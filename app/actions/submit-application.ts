"use server";

import { applicationSchema } from "@/app/lib/schemas/application-schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import crypto from "crypto";
import {
	sanitizeInput,
	maskSensitiveData,
	validateFile,
} from "@/app/lib/utils/form-security";
import { supabase } from "@/app/lib/supabase";

/**
 * Generates a unique application ID in the format: IAF-YYYY-XXXXX
 * where YYYY is the current year and XXXXX is a random 5-digit number
 */
function generateApplicationId(): string {
	const year = new Date().getFullYear();
	const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit number
	return `IAF-${year}-${randomNum}`;
}

/**
 * Checks if an application ID already exists in the database
 */
async function isApplicationIdUnique(applicationId: string): Promise<boolean> {
	const { data, error } = await supabase
		.from("scholarship_applications")
		.select("application_id")
		.eq("application_id", applicationId)
		.single();

	if (error) {
		console.error("Error checking application ID:", error);
		return false;
	}

	return !data;
}

/**
 * Generates a unique application ID that doesn't exist in the database
 */
async function generateUniqueApplicationId(): Promise<string> {
	let applicationId: string;
	let isUnique = false;

	while (!isUnique) {
		applicationId = generateApplicationId();
		isUnique = await isApplicationIdUnique(applicationId);
	}

	return applicationId!;
}

/**
 * Uploads a file to Supabase Storage
 */
async function uploadFileToStorage(
	file: File,
	applicationId: string,
	documentType: string
): Promise<string | null> {
	try {
		const fileExt = file.name.split(".").pop();
		const fileName = `${applicationId}/${documentType}.${fileExt}`;
		const filePath = `scholarship-documents/${fileName}`;

		const { data, error } = await supabase.storage
			.from("scholarship-documents")
			.upload(filePath, file, {
				cacheControl: "3600",
				upsert: false,
			});

		if (error) {
			console.error("Error uploading file:", error);
			return null;
		}

		// Get the public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from("scholarship-documents").getPublicUrl(filePath);

		return publicUrl;
	} catch (error) {
		console.error("Error in uploadFileToStorage:", error);
		return null;
	}
}

/**
 * Server action to submit application form data to Django backend
 * Handles form submission, validation, and database storage
 *
 * @param formData - The form data from the client
 * @returns Object containing success status, application ID, and message
 */
export async function submitApplication(formData: FormData) {
	// Generate a request ID for tracking this submission in logs
	const requestId = crypto.randomUUID();

	try {
		console.log(`[${requestId}] Processing application submission`);

		// Get client IP for rate limiting
		const headersList = await headers();
		const ip =
			headersList.get("x-forwarded-for") ||
			headersList.get("x-real-ip") ||
			"unknown";

		// Convert FormData to a plain object
		const rawFormData: Record<string, any> = {};

		// Process form data with proper error handling
		try {
			formData.forEach((value, key) => {
				// Handle arrays with naming convention like siblings[0][name]
				if (key.includes("[") && key.includes("]")) {
					const match = key.match(/([^[]+)\[(\d+)\]\[([^\]]+)\]/);
					if (match) {
						const [_, baseKey, indexStr, propKey] = match;
						const base = baseKey;
						const index = Number.parseInt(indexStr);

						if (!rawFormData[base]) {
							rawFormData[base] = [];
						}

						// Ensure the array has enough elements
						while (rawFormData[base].length <= index) {
							rawFormData[base].push({});
						}

						// Sanitize string inputs
						if (typeof value === "string") {
							rawFormData[base][index][propKey] = sanitizeInput(value);
						} else {
							rawFormData[base][index][propKey] = value;
						}
					}
				} else if (key.endsWith("[]")) {
					// Handle simple arrays
					const actualKey = key.replace("[]", "");
					if (!rawFormData[actualKey]) {
						rawFormData[actualKey] = [];
					}

					// Sanitize string inputs
					if (typeof value === "string") {
						rawFormData[actualKey].push(sanitizeInput(value));
					} else {
						rawFormData[actualKey].push(value);
					}
				} else if (key.startsWith("documents.")) {
					// Handle file uploads
					const documentKey = key.replace("documents.", "");
					if (!rawFormData.documents) {
						rawFormData.documents = {};
					}

					// Store file information
					if (value instanceof File) {
						// Validate file
						const validation = validateFile(
							value,
							["application/pdf", "image/jpeg", "image/png"],
							2 // 2MB max
						);

						if (!validation.valid) {
							throw new Error(
								`Invalid file for ${documentKey}: ${validation.message}`
							);
						}

						// Upload file to Supabase Storage
						const uploadPromise = uploadFileToStorage(
							value,
							applicationId,
							documentKey
						).then((url) => {
							if (url) {
								rawFormData.documents[documentKey] = url;
							}
						});

						rawFormData.documents[documentKey] = {
							name: value.name,
							type: value.type,
							size: value.size,
							lastModified: value.lastModified,
						};
					}
				} else {
					// Handle regular fields
					// For checkbox values, convert "on" to true
					if (value === "on") {
						rawFormData[key] = true;
					} else if (typeof value === "string") {
						// Sanitize string inputs
						rawFormData[key] = sanitizeInput(value);
					} else {
						rawFormData[key] = value;
					}
				}
			});
		} catch (error) {
			console.error(`[${requestId}] Error processing form data:`, error);
			return {
				success: false,
				message:
					error instanceof Error
						? error.message
						: "Failed to process form data",
			};
		}

		// Handle boolean fields for declarations
		if (rawFormData.studentDeclaration === undefined) {
			rawFormData.studentDeclaration = false;
		}

		if (rawFormData.parentDeclaration === undefined) {
			rawFormData.parentDeclaration = false;
		}

		console.log(`[${requestId}] Form data processed, validating...`);

		// Log sanitized data for debugging (mask sensitive data)
		console.log(
			`[${requestId}] Processed form data:`,
			maskSensitiveData(rawFormData)
		);

		// Parse and validate the data
		let validatedData;
		try {
			validatedData = applicationSchema.parse(rawFormData);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errorDetails = error.errors
					.map((err) => `${err.path.join(".")}: ${err.message}`)
					.join(", ");
				console.error(`[${requestId}] Validation error:`, errorDetails);
				return {
					success: false,
					message: `Validation failed: ${errorDetails}`,
				};
			}
			throw error;
		}

		console.log(
			`[${requestId}] Validation successful, sending to Django API...`
		);

		// Generate unique application ID
		const applicationId = await generateUniqueApplicationId();

		// Add metadata, application ID, and document URLs
		const applicationData = {
			...validatedData,
			application_id: applicationId,
			documents: rawFormData.documents,
			metadata: {
				ipAddress: ip,
				userAgent: (await headersList).get("user-agent") || "unknown",
				submissionId: requestId,
				createdAt: new Date().toISOString(),
			},
		};

		// Send to Django backend
		const djangoResult = await sendToDjangoBackend(applicationData, requestId);

		if (!djangoResult.success) {
			console.error(
				`[${requestId}] Failed to save application to Django backend:`,
				djangoResult.message
			);
			return {
				success: false,
				message:
					djangoResult.message ||
					"Failed to submit application. Please try again.",
			};
		}

		console.log(
			`[${requestId}] Application successfully saved to Django backend with ID: ${djangoResult.applicationId}`
		);

		// Store the application ID in a cookie for reference
		(await cookies()).set("lastApplicationId", applicationId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60 * 24 * 7, // 1 week
			path: "/",
			sameSite: "strict",
		});

		// Revalidate the path to update any cached data
		revalidatePath("/apply");

		// After validation and before returning success:
		const { data, error } = await supabase
			.from("scholarship_applications")
			.insert([
				{
					...applicationData,
					// Ensure all fields from the schema are included
					firstName: applicationData.firstName,
					lastName: applicationData.lastName,
					fatherName: applicationData.fatherName,
					motherName: applicationData.motherName,
					dob: applicationData.dob,
					sex: applicationData.sex,
					bloodGroup: applicationData.bloodGroup,
					passportNumber: applicationData.passportNumber,
					govtIdNumber: applicationData.govtIdNumber,
					nationality: applicationData.nationality,
					state: applicationData.state,
					city: applicationData.city,
					district: applicationData.district,
					pincode: applicationData.pincode,
					residentialAddress: applicationData.residentialAddress,
					secondaryAddress: applicationData.secondaryAddress,
					studentMobile: applicationData.studentMobile,
					fatherMobile: applicationData.fatherMobile,
					motherMobile: applicationData.motherMobile,
					studentEmail: applicationData.studentEmail,
					parentEmail: applicationData.parentEmail,
					fatherOccupation: applicationData.fatherOccupation,
					motherOccupation: applicationData.motherOccupation,
					fatherIncome: applicationData.fatherIncome,
					fatherIncomeCurrency: applicationData.fatherIncomeCurrency,
					motherIncome: applicationData.motherIncome,
					motherIncomeCurrency: applicationData.motherIncomeCurrency,
					siblings: applicationData.siblings,
					currentlyEnrolled: applicationData.currentlyEnrolled,
					currentInstitution: applicationData.currentInstitution,
					entranceTests: applicationData.entranceTests,
					tenthScore: applicationData.tenthScore,
					tenthSubjects: applicationData.tenthSubjects,
					tenthBoard: applicationData.tenthBoard,
					tenthYear: applicationData.tenthYear,
					twelfthScore: applicationData.twelfthScore,
					twelfthSubjects: applicationData.twelfthSubjects,
					twelfthBoard: applicationData.twelfthBoard,
					twelfthYear: applicationData.twelfthYear,
					graduationStream: applicationData.graduationStream,
					graduationSubjects: applicationData.graduationSubjects,
					graduationUniversity: applicationData.graduationUniversity,
					graduationYear: applicationData.graduationYear,
					pgStream: applicationData.pgStream,
					pgSubjects: applicationData.pgSubjects,
					pgUniversity: applicationData.pgUniversity,
					pgYear: applicationData.pgYear,
					ieltsScore: applicationData.ieltsScore,
					ieltsYear: applicationData.ieltsYear,
					programType: applicationData.programType,
					firstPreference: applicationData.firstPreference,
					secondPreference: applicationData.secondPreference,
					thirdPreference: applicationData.thirdPreference,
					hostelRequired: applicationData.hostelRequired,
					studentDeclaration: applicationData.studentDeclaration,
					parentDeclaration: applicationData.parentDeclaration,
					documents: applicationData.documents,
					status: applicationData.status,
					submittedAt: applicationData.submittedAt,
					metadata: applicationData.metadata,
				},
			]);

		if (error) {
			console.error(`[${requestId}] Supabase error:`, error.message);
			return {
				success: false,
				message: "Failed to save application to Supabase.",
			};
		}

		return {
			success: true,
			applicationId: applicationId,
			message: "Application submitted successfully!",
		};
	} catch (error) {
		console.error(`[${requestId}] Error processing application:`, error);
		return {
			success: false,
			message: "Failed to submit application. Please try again later.",
		};
	}
}

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
		.eq("application_id", applicationId);

	if (error) {
		console.error("Error checking application ID:", error);
		return false;
	}

	// If no rows are found, the ID is unique
	return data.length === 0;
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
		console.log(
			`Attempting to upload file: ${file.name} for document type: ${documentType}`
		);

		const fileExt = file.name.split(".").pop();
		const fileName = `${applicationId}/${documentType}.${fileExt}`;
		const filePath = `applications/${fileName}`; // Changed bucket path

		console.log(`Uploading to path: ${filePath}`);

		const { data, error } = await supabase.storage
			.from("applications") // Changed bucket name
			.upload(filePath, file, {
				cacheControl: "3600",
				upsert: true,
			});

		if (error) {
			console.error("Error uploading file:", error);
			throw new Error(`Failed to upload ${documentType}: ${error.message}`);
		}

		console.log(`File uploaded successfully, getting public URL`);

		// Get the public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from("applications").getPublicUrl(filePath);

		console.log(`Public URL generated: ${publicUrl}`);

		return publicUrl;
	} catch (error) {
		console.error("Error in uploadFileToStorage:", error);
		throw error;
	}
}

/**
 * Converts camelCase to snake_case
 */
function camelToSnakeCase(str: string): string {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Transforms an object's keys from camelCase to snake_case
 */
function transformKeysToSnakeCase(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map((item) => transformKeysToSnakeCase(item));
	}

	if (obj !== null && typeof obj === "object") {
		return Object.keys(obj).reduce((result, key) => {
			const snakeKey = camelToSnakeCase(key);
			result[snakeKey] = transformKeysToSnakeCase(obj[key]);
			return result;
		}, {} as any);
	}

	return obj;
}

/**
 * Server action to submit application form data to Supabase
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

		// Generate unique application ID first
		const applicationId = await generateUniqueApplicationId();
		console.log(`[${requestId}] Generated application ID: ${applicationId}`);

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

						rawFormData.documents[documentKey] = {
							name: value.name,
							type: value.type,
							size: value.size,
							lastModified: value.lastModified,
							file: value, // Store the actual file for later upload
						};
					}
				} else {
					// Handle regular fields
					if (key === "studentDeclaration" || key === "parentDeclaration") {
						// Convert declaration checkboxes to boolean
						rawFormData[key] = value === "on" || value === "true";
					} else if (key === "siblings") {
						// Handle siblings array
						if (typeof value === "string") {
							const siblingNames = value
								.split(",")
								.map((item) => item.trim())
								.filter(Boolean);
							rawFormData[key] = siblingNames.map((name) => ({
								name: name,
								age: null,
								occupation: null,
								relation: "Brother", // Using proper enum value
								education: null,
								maritalStatus: null,
							}));
						} else {
							rawFormData[key] = value;
						}
					} else if (key === "entranceTests") {
						// Handle entrance tests array
						if (typeof value === "string") {
							const testNames = value
								.split(",")
								.map((item) => item.trim())
								.filter(Boolean);
							rawFormData[key] = testNames.map((name) => ({
								name: name,
								conductedBy: "N/A", // Required field
								year: new Date().getFullYear().toString(), // Convert to string
								marksRank: "N/A", // Required field
								score: null,
								date: null,
							}));
						} else {
							rawFormData[key] = value;
						}
					} else if (value === "on") {
						// For other checkbox values, convert "on" to true
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

		// Ensure arrays are properly initialized with correct structure
		if (!Array.isArray(rawFormData.siblings)) {
			rawFormData.siblings = [];
		} else {
			// Ensure each sibling has the required object structure
			rawFormData.siblings = rawFormData.siblings.map((sibling) => {
				if (typeof sibling === "string") {
					return {
						name: sibling,
						age: null,
						occupation: null,
						relation: "Brother", // Using proper enum value
						education: null,
						maritalStatus: null,
					};
				}
				// Ensure all required fields exist
				return {
					name: sibling.name || "",
					age: sibling.age || null,
					occupation: sibling.occupation || null,
					relation: sibling.relation === "Sister" ? "Sister" : "Brother", // Ensure valid enum value
					education: sibling.education || null,
					maritalStatus: sibling.maritalStatus || null,
				};
			});
		}

		if (!Array.isArray(rawFormData.entranceTests)) {
			rawFormData.entranceTests = [];
		} else {
			// Ensure each entrance test has the required object structure
			rawFormData.entranceTests = rawFormData.entranceTests.map((test) => {
				if (typeof test === "string") {
					return {
						name: test,
						conductedBy: "N/A",
						year: new Date().getFullYear().toString(), // Convert to string
						marksRank: "N/A",
						score: null,
						date: null,
					};
				}
				// Ensure all required fields exist
				return {
					name: test.name || "",
					conductedBy: test.conductedBy || "N/A",
					year: (test.year || new Date().getFullYear()).toString(), // Ensure string type
					marksRank: test.marksRank || "N/A",
					score: test.score || null,
					date: test.date || null,
				};
			});
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

		console.log(`[${requestId}] Validation successful, uploading files...`);

		// Upload files if present
		if (rawFormData.documents) {
			console.log(`[${requestId}] Starting file uploads...`);
			const uploadPromises = Object.entries(rawFormData.documents).map(
				async ([documentKey, documentData]) => {
					if (documentData.file) {
						console.log(`[${requestId}] Uploading ${documentKey}...`);
						try {
							const url = await uploadFileToStorage(
								documentData.file,
								applicationId,
								documentKey
							);
							if (url) {
								console.log(
									`[${requestId}] Successfully uploaded ${documentKey}`
								);
								rawFormData.documents[documentKey] = url;
							} else {
								throw new Error(`Failed to get URL for ${documentKey}`);
							}
						} catch (error) {
							console.error(
								`[${requestId}] Error uploading ${documentKey}:`,
								error
							);
							throw error;
						}
					} else {
						console.log(`[${requestId}] No file found for ${documentKey}`);
					}
				}
			);

			try {
				console.log(`[${requestId}] Waiting for all uploads to complete...`);
				await Promise.all(uploadPromises);
				console.log(`[${requestId}] All files uploaded successfully`);
			} catch (error) {
				console.error(`[${requestId}] Error during file uploads:`, error);
				return {
					success: false,
					message:
						error instanceof Error
							? `Failed to upload documents: ${error.message}`
							: "Failed to upload documents. Please try again.",
				};
			}
		} else {
			console.log(`[${requestId}] No documents to upload`);
		}

		// Prepare application data for Supabase
		const applicationData = transformKeysToSnakeCase({
			...validatedData,
			application_id: applicationId,
			documents: rawFormData.documents,
			status: "Pending", // Changed from 'pending' to 'Pending' to match enum
			submitted_at: new Date().toISOString(),
			metadata: {
				ipAddress: ip,
				userAgent: headersList.get("user-agent") || "unknown",
				submissionId: requestId,
				createdAt: new Date().toISOString(),
			},
		});

		console.log(`[${requestId}] Prepared data for Supabase:`, applicationData);

		// Save to Supabase
		const { data, error } = await supabase
			.from("scholarship_applications")
			.insert([applicationData])
			.select()
			.single();

		if (error) {
			console.error(`[${requestId}] Supabase error:`, error.message);
			return {
				success: false,
				message: "Failed to save application. Please try again.",
			};
		}

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

import { Schema, model, models, type Document, type Model } from "mongoose"

// Define the sibling interface
interface Sibling {
  relation: "Brother" | "Sister"
  name: string
  school?: string
  class?: string
}

// Define the entrance test interface
interface EntranceTest {
  name: string
  conductedBy: string
  year: string
  marksRank: string
}

// Define the document interface
export interface IApplication extends Document {
  applicationId: string
  firstName: string
  lastName: string
  fatherName: string
  motherName: string
  dob: string
  sex: "Male" | "Female" | "Other"
  bloodGroup?: string
  passportNumber?: string
  govtIdNumber: string
  nationality: string
  state: string
  city: string
  district: string
  pincode: string
  residentialAddress: string
  secondaryAddress?: string
  studentMobile: string
  fatherMobile: string
  motherMobile?: string
  studentEmail: string
  parentEmail?: string
  fatherOccupation: string
  motherOccupation?: string
  fatherIncome: string
  fatherIncomeCurrency: string
  motherIncome?: string
  motherIncomeCurrency?: string
  siblings?: Sibling[]
  currentlyEnrolled: "Yes" | "No"
  currentInstitution?: string
  entranceTests?: EntranceTest[]
  tenthScore: string
  tenthSubjects: string
  tenthBoard: string
  tenthYear: string
  twelfthScore: string
  twelfthSubjects: string
  twelfthBoard: string
  twelfthYear: string
  graduationStream?: string
  graduationSubjects?: string
  graduationUniversity?: string
  graduationYear?: string
  pgStream?: string
  pgSubjects?: string
  pgUniversity?: string
  pgYear?: string
  ieltsScore?: string
  ieltsYear?: string
  programType: "Skill Courses" | "Diploma" | "Undergraduate Degree" | "Postgraduate Degree" | "Doctoral Program"
  firstPreference: string
  secondPreference?: string
  thirdPreference?: string
  hostelRequired: "Yes" | "No"
  studentDeclaration: boolean
  parentDeclaration: boolean
  documents?: Record<string, string>
  status: "Pending" | "Under Review" | "Approved" | "Rejected"
  submittedAt: Date
}

// Define the schema
const ApplicationSchema = new Schema<IApplication>(
  {
    applicationId: { type: String, required: false, unique: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    fatherName: { type: String, required: false },
    motherName: { type: String, required: false },
    dob: { type: String, required: false },
    sex: { type: String, enum: ["Male", "Female", "Other"], required: false },
    bloodGroup: { type: String, required: false },
    passportNumber: { type: String, required: false },
    govtIdNumber: { type: String, required: false },
    nationality: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    district: { type: String, required: false },
    pincode: { type: String, required: false },
    residentialAddress: { type: String, required: false },
    secondaryAddress: { type: String, required: false },
    studentMobile: { type: String, required: false },
    fatherMobile: { type: String, required: false },
    motherMobile: { type: String, required: false },
    studentEmail: { type: String, required: false },
    parentEmail: { type: String, required: false },
    fatherOccupation: { type: String, required: false },
    motherOccupation: { type: String, required: false },
    fatherIncome: { type: String, required: false },
    fatherIncomeCurrency: { type: String, default: "INR" },
    motherIncome: { type: String },
    motherIncomeCurrency: { type: String, default: "INR" },
    siblings: [
      {
        relation: { type: String, enum: ["Brother", "Sister"], required: true },
        name: { type: String, required: true },
        school: { type: String },
        class: { type: String },
      },
    ],
    currentlyEnrolled: { type: String, enum: ["Yes", "No"], required: true },
    currentInstitution: { type: String },
    entranceTests: [
      {
        name: { type: String, required: false },
        conductedBy: { type: String, required: false },
        year: { type: String, required: false },
        marksRank: { type: String, required: false },
      },
    ],
    tenthScore: { type: String, required: false },
    tenthSubjects: { type: String, required: false },
    tenthBoard: { type: String, required: false },
    tenthYear: { type: String, required: false },
    twelfthScore: { type: String, required: false },
    twelfthSubjects: { type: String, required: false },
    twelfthBoard: { type: String, required: false },
    twelfthYear: { type: String, required: false },
    graduationStream: { type: String, required: false },
    graduationSubjects: { type: String, required: false },
    graduationUniversity: { type: String, required: false },
    graduationYear: { type: String, required: false },
    pgStream: { type: String, required: false },
    pgSubjects: { type: String, required: false },
    pgUniversity: { type: String, required: false },
    pgYear: { type: String, required: false },
    ieltsScore: { type: String, required: false },
    ieltsYear: { type: String, required: false },
    programType: {
      type: String,
      enum: ["Skill Courses", "Diploma", "Undergraduate Degree", "Postgraduate Degree", "Doctoral Program"],
      required: false,
    },
    firstPreference: { type: String, required: false },
    secondPreference: { type: String, required: false },
    thirdPreference: { type: String, required: false },
    hostelRequired: { type: String, enum: ["Yes", "No"], default: "Yes", required: false },
    studentDeclaration: { type: Boolean, required: true },
    parentDeclaration: { type: Boolean, required: true },
    documents: { type: Map, of: String },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Approved", "Rejected"],
      default: "Pending",
      required: false
    },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
)

// Create or retrieve the model
export const Application: Model<IApplication> =
  models.Application || model<IApplication>("Application", ApplicationSchema)


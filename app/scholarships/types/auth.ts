export interface Sibling {
  name: string
  relation: string
}

export interface EntranceTest {
  name: string
  year: string
  marks_rank: string
  conducted_by: string
}

export interface Documents {
  photo?: string
  id_card?: string
  tenth_certificate?: string
}

export interface Metadata {
  created_at: string
  ip_address: string
  user_agent: string
  submission_id: string
}

export interface ApplicantData {
  id?: number
  application_id: string
  first_name: string
  last_name: string
  father_name?: string
  mother_name?: string
  dob?: string
  sex?: string
  blood_group?: string
  passport_number?: string
  govt_id_number?: string
  nationality?: string
  state?: string
  city?: string
  district?: string
  pincode?: string
  residential_address?: string
  secondary_address?: string
  student_mobile?: string
  father_mobile?: string
  mother_mobile?: string
  student_email?: string
  parent_email?: string
  father_occupation?: string
  mother_occupation?: string
  father_income?: string
  father_income_currency?: string
  mother_income?: string
  mother_income_currency?: string
  siblings?: Sibling[]
  currently_enrolled?: string
  current_institution?: string
  entrance_tests?: EntranceTest[]
  tenth_score?: string
  tenth_subjects?: string
  tenth_board?: string
  tenth_year?: string
  twelfth_score?: string
  twelfth_subjects?: string
  twelfth_board?: string
  twelfth_year?: string
  graduation_stream?: string
  graduation_subjects?: string
  graduation_university?: string
  graduation_year?: string
  pg_stream?: string
  pg_subjects?: string
  pg_university?: string
  pg_year?: string
  ielts_score?: string
  ielts_year?: string
  program_type?: string
  first_preference?: string
  second_preference?: string
  third_preference?: string
  hostel_required?: string
  student_declaration?: boolean
  parent_declaration?: boolean
  documents?: Documents
  status?: string
  submitted_at: string
  metadata?: Metadata
}

export interface LoginResponse {
  success: boolean
  message: string
  user_data?: ApplicantData
}

export interface HealthEndpoint {
  endpoint: string
  method: string
  status: string
  latency_ms: number
  sample_response?: any
}

export interface HealthReport {
  overall_status: string
  endpoints: HealthEndpoint[]
  timestamp: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface NotificationData {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
}

export interface ApplicationStatusHistory {
  status: string
  timestamp: string
  updated_by?: string
  notes?: string
}

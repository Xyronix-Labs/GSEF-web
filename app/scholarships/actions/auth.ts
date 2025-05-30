"use server"

import type { ApplicantData, ApiResponse, HealthReport } from "../types/auth"

const BASE_URL = "https://server.xyronixlabs.com/gsef"

export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/ping/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
    return response.ok
  } catch (error) {
    console.error("Server health check failed:", error)
    return false
  }
}

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/ping/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
    return response.ok
  } catch (error) {
    console.error("Database health check failed:", error)
    return false
  }
}

export async function getHealthReport(): Promise<ApiResponse<HealthReport>> {
  try {
    const response = await fetch(`${BASE_URL}/health/report/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Health check failed: ${response.status}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Health report failed:", error)
    return {
      success: false,
      error: "Failed to get health report",
    }
  }
}

export async function validateApplication(applicationId: string): Promise<ApiResponse<ApplicantData>> {
  try {
    console.log(`Validating application ID: ${applicationId}`)

    const response = await fetch(`${BASE_URL}/applicant/${applicationId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    console.log(`API response status: ${response.status}`)

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: "Application ID not found. Please check your ID and try again.",
        }
      }
      return {
        success: false,
        error: `Server error: ${response.status}. Please try again later.`,
      }
    }

    const data = await response.json()
    console.log("API response data:", data)

    if (!data) {
      return {
        success: false,
        error: "Invalid response from server. Please try again.",
      }
    }

    const applicantData = Array.isArray(data) ? data[0] : data

    return {
      success: true,
      data: applicantData,
    }
  } catch (error) {
    console.error("Application validation failed:", error)
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    }
  }
}

export async function validateEmail(email: string): Promise<ApiResponse<ApplicantData>> {
  try {
    console.log(`Validating email: ${email}`)

    const response = await fetch(`${BASE_URL}/applicant/email/${encodeURIComponent(email)}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    console.log(`API response status: ${response.status}`)

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: "Email address not found in our records. Please check your email and try again.",
        }
      }
      return {
        success: false,
        error: `Server error: ${response.status}. Please try again later.`,
      }
    }

    const data = await response.json()
    console.log("API response data:", data)

    if (!data) {
      return {
        success: false,
        error: "Invalid response from server. Please try again.",
      }
    }

    const applicantData = Array.isArray(data) ? data[0] : data

    return {
      success: true,
      data: applicantData,
    }
  } catch (error) {
    console.error("Email validation failed:", error)
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    }
  }
}

export async function loginUser(username: string, password: string): Promise<ApiResponse<ApplicantData>> {
  try {
    console.log(`Logging in user: ${username}`)

    const response = await fetch(`${BASE_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login_type: "username",
        username,
        password,
      }),
      cache: "no-store",
    })

    console.log(`Login response status: ${response.status}`)

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: "Invalid username or password. Please try again.",
        }
      }
      return {
        success: false,
        error: `Login failed: ${response.status}. Please try again later.`,
      }
    }

    const data = await response.json()
    console.log("Login response data:", data)

    if (!data || !data.user_data) {
      return {
        success: false,
        error: "Invalid response from server. Please try again.",
      }
    }

    return {
      success: true,
      data: data.user_data,
    }
  } catch (error) {
    console.error("Login failed:", error)
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    }
  }
}

export async function registerUser(
  applicationId: string,
  username: string,
  password: string,
): Promise<ApiResponse<any>> {
  try {
    console.log(`Registering user: ${username} with application ID: ${applicationId}`)

    const response = await fetch(`${BASE_URL}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        application_id: applicationId,
        username,
        password,
      }),
      cache: "no-store",
    })

    console.log(`Registration response status: ${response.status}`)

    if (!response.ok) {
      if (response.status === 409) {
        return {
          success: false,
          error: "Username already exists. Please choose a different username.",
        }
      }
      if (response.status === 404) {
        return {
          success: false,
          error: "Application ID not found. Please check your application ID.",
        }
      }
      return {
        success: false,
        error: `Registration failed: ${response.status}. Please try again later.`,
      }
    }

    const data = await response.json()
    console.log("Registration response data:", data)

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Registration failed:", error)
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    }
  }
}

export async function getApplicationStatus(applicationId: string): Promise<ApiResponse<ApplicantData>> {
  try {
    const response = await fetch(`${BASE_URL}/applicant/${applicationId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to get application status: ${response.status}`,
      }
    }

    const data = await response.json()
    const applicantData = Array.isArray(data) ? data[0] : data

    return {
      success: true,
      data: applicantData,
    }
  } catch (error) {
    console.error("Get application status failed:", error)
    return {
      success: false,
      error: "Failed to get application status",
    }
  }
}

export async function updateApplicationStatus(applicationId: string, statusCode: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${BASE_URL}/auth/update-status/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        application_id: applicationId,
        status_code: statusCode,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to update status: ${response.status}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Update status failed:", error)
    return {
      success: false,
      error: "Failed to update application status",
    }
  }
}

export async function getAllApplicants(limit?: number, offset?: number): Promise<ApiResponse<ApplicantData[]>> {
  try {
    let url = `${BASE_URL}/applicants/`
    if (limit !== undefined && offset !== undefined) {
      url = `${BASE_URL}/applicants/range/?limit=${limit}&offset=${offset}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to get applicants: ${response.status}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Get applicants failed:", error)
    return {
      success: false,
      error: "Failed to get applicants",
    }
  }
}

export async function getPendingApplications(): Promise<ApiResponse<ApplicantData[]>> {
  try {
    const response = await fetch(`${BASE_URL}/applications/pending-data/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to get pending applications: ${response.status}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Get pending applications failed:", error)
    return {
      success: false,
      error: "Failed to get pending applications",
    }
  }
}

export async function getAcceptedApplications(): Promise<ApiResponse<ApplicantData[]>> {
  try {
    const response = await fetch(`${BASE_URL}/applications/accepted/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to get accepted applications: ${response.status}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Get accepted applications failed:", error)
    return {
      success: false,
      error: "Failed to get accepted applications",
    }
  }
}

export async function deleteApplicant(applicationId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${BASE_URL}/applicant/delete/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        application_id: applicationId,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to delete applicant: ${response.status}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Delete applicant failed:", error)
    return {
      success: false,
      error: "Failed to delete applicant",
    }
  }
}

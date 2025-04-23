import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { applicationId, contactNumber } = await request.json()

    if (!applicationId || !contactNumber) {
      return NextResponse.json(
        { success: false, message: "Application ID and contact number are required" },
        { status: 400 },
      )
    }

    // Forward the request to Django backend
    const response = await fetch("http://localhost:8000/api/check-status/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId, contactNumber }),
    })

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP Error: ${response.status} ${response.statusText}` };
      }
      
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to check application status" },
        { status: response.status },
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error checking application status:", error)
    return NextResponse.json({ success: false, message: "Failed to check application status" }, { status: 500 })
  }
}
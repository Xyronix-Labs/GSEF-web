"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail } from "lucide-react"
import type { ApplicantData } from "@/app/scholarships/types/auth"

interface ContactTabProps {
  userData: ApplicantData
}

export function ContactTab({ userData }: ContactTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Address Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Residential Address</p>
            <p className="font-medium">{userData.residential_address || "Not provided"}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {userData.city && userData.state ? `${userData.city}, ${userData.state}` : ""}
              {userData.pincode ? ` - ${userData.pincode}` : ""}
            </p>
          </div>
          {userData.secondary_address && (
            <div>
              <p className="text-sm text-muted-foreground">Secondary Address</p>
              <p className="font-medium">{userData.secondary_address}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-primary" />
            <span>Contact Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Student Mobile</p>
            <p className="font-medium">{userData.student_mobile || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Student Email</p>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-primary" />
              <p className="font-medium">{userData.student_email || "Not provided"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Parent Email</p>
            <p className="font-medium">{userData.parent_email || "Not provided"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

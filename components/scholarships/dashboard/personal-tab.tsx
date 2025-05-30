"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BadgeIcon as IdCard, Heart, FileText } from "lucide-react"
import type { ApplicantData } from "@/app/scholarships/types/auth"

interface PersonalTabProps {
  userData: ApplicantData
}

export function PersonalTab({ userData }: PersonalTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IdCard className="w-5 h-5 text-primary" />
            <span>Personal Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {userData.dob ? new Date(userData.dob).toLocaleDateString() : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{userData.sex || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blood Group</p>
              <p className="font-medium flex items-center space-x-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{userData.blood_group || "Not provided"}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nationality</p>
              <Badge variant="outline">{userData.nationality || "Not provided"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Identity Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Passport Number</p>
            <p className="font-medium font-mono">{userData.passport_number || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Government ID</p>
            <p className="font-medium font-mono">{userData.govt_id_number || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">District</p>
            <p className="font-medium">{userData.district || "Not provided"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

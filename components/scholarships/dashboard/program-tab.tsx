"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Home } from "lucide-react"
import type { ApplicantData } from "@/app/scholarships/types/auth"

interface ProgramTabProps {
  userData: ApplicantData
}

export function ProgramTab({ userData }: ProgramTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Program Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Program Type</p>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {userData.program_type || "Not specified"}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/30">
              <span className="font-medium">1st Preference</span>
              <span className="text-green-700 dark:text-green-500 font-semibold">
                {userData.first_preference || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
              <span className="font-medium">2nd Preference</span>
              <span className="text-yellow-700 dark:text-yellow-500 font-semibold">
                {userData.second_preference || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-900/30">
              <span className="font-medium">3rd Preference</span>
              <span className="text-orange-700 dark:text-orange-500 font-semibold">
                {userData.third_preference || "Not specified"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-primary" />
            <span>Additional Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Hostel Required</p>
            <Badge
              className={
                userData.hostel_required === "Yes"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }
            >
              {userData.hostel_required || "Not specified"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Currently Enrolled</p>
            <Badge
              className={
                userData.currently_enrolled === "Yes"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }
            >
              {userData.currently_enrolled || "Not specified"}
            </Badge>
          </div>
          {userData.current_institution && (
            <div>
              <p className="text-sm text-muted-foreground">Current Institution</p>
              <p className="font-medium">{userData.current_institution}</p>
            </div>
          )}
          {userData.ielts_score && (
            <div>
              <p className="text-sm text-muted-foreground">IELTS Score</p>
              <p className="font-medium">
                {userData.ielts_score} ({userData.ielts_year || "Year not specified"})
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

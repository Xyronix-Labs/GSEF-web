"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, XCircle, FileText, Eye, Award } from "lucide-react"
import type { ApplicantData } from "@/app/scholarships/types/auth"

interface StatusTrackerProps {
  userData: ApplicantData
}

export function StatusTracker({ userData }: StatusTrackerProps) {
  const getStatusProgress = (status: string) => {
    switch (status?.toLowerCase()) {
      case "submitted":
      case "pending":
        return 25
      case "under review":
        return 50
      case "interview":
        return 75
      case "approved":
      case "accepted":
      case "a100":
        return 100
      case "rejected":
      case "declined":
        return 0
      default:
        return 25
    }
  }

  const getStatusSteps = (status: string) => {
    const steps = [
      { name: "Application Submitted", icon: FileText, completed: true },
      { name: "Under Review", icon: Eye, completed: getStatusProgress(status) >= 50 },
      { name: "Interview/Assessment", icon: Clock, completed: getStatusProgress(status) >= 75 },
      { name: "Final Decision", icon: Award, completed: getStatusProgress(status) >= 100 },
    ]
    return steps
  }

  const progress = getStatusProgress(userData.status || "pending")
  const steps = getStatusSteps(userData.status || "pending")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Application Status Tracker</span>
        </CardTitle>
        <CardDescription>Track the progress of your scholarship application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.name}
                className={`flex flex-col items-center p-4 rounded-lg border ${
                  step.completed
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                  }`}
                >
                  {step.completed ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className="text-sm font-medium text-center">{step.name}</span>
                <Badge
                  variant={step.completed ? "default" : "secondary"}
                  className={`mt-2 ${
                    step.completed ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""
                  }`}
                >
                  {step.completed ? "Completed" : "Pending"}
                </Badge>
              </div>
            )
          })}
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">Current Status</h4>
          <div className="flex items-center space-x-2">
            {userData.status?.toLowerCase() === "approved" || userData.status?.toLowerCase() === "a100" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : userData.status?.toLowerCase() === "rejected" ? (
              <XCircle className="w-5 h-5 text-red-600" />
            ) : (
              <Clock className="w-5 h-5 text-yellow-600" />
            )}
            <span className="font-medium">{userData.status || "Pending Review"}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {userData.status?.toLowerCase() === "approved" || userData.status?.toLowerCase() === "a100"
              ? "Congratulations! Your application has been approved."
              : userData.status?.toLowerCase() === "rejected"
                ? "Unfortunately, your application was not successful this time."
                : "Your application is currently being reviewed by our admissions team."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, FileText, User } from "lucide-react"
import type { ApplicantData } from "@/app/scholarships/types/auth"

interface ApplicationHistoryProps {
  userData: ApplicantData
}

export function ApplicationHistory({ userData }: ApplicationHistoryProps) {
  // Mock history data - in a real app, this would come from an API
  const submittedAt = userData.submitted_at ? new Date(userData.submitted_at) : new Date()

const historyEvents = [
  {
    status: "Application Submitted",
    timestamp: submittedAt.toISOString(),
    icon: FileText,
    description: "Application successfully submitted to GSEF portal",
    type: "success",
  },
  {
    status: "Document Verification",
    timestamp: new Date(submittedAt.getTime() + 86400000).toISOString(),
    icon: CheckCircle,
    description: "All submitted documents verified and approved",
    type: "success",
  },
  {
    status: "Under Review",
    timestamp: new Date(submittedAt.getTime() + 172800000).toISOString(),
    icon: User,
    description: "Application is being reviewed by the admissions committee",
    type: "info",
  },
  {
    status: userData.status || "Pending",
    timestamp: new Date().toISOString(),
    icon: Clock,
    description: `Current status: ${userData.status || "Pending review"}`,
    type: userData.status?.toLowerCase() === "approved" ? "success" : "pending",
  },
]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Application Timeline</span>
        </CardTitle>
        <CardDescription>Track the complete history of your application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

          <div className="space-y-6">
            {historyEvents.map((event, index) => {
              const Icon = event.icon
              return (
                <div key={index} className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                      event.type === "success"
                        ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-600"
                        : event.type === "info"
                          ? "bg-blue-100 border-blue-500 dark:bg-blue-900/30 dark:border-blue-600"
                          : "bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30 dark:border-yellow-600"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        event.type === "success"
                          ? "text-green-600 dark:text-green-500"
                          : event.type === "info"
                            ? "text-blue-600 dark:text-blue-500"
                            : "text-yellow-600 dark:text-yellow-500"
                      }`}
                    />
                  </div>

                  {/* Event content */}
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{event.status}</h4>
                      <Badge
                        variant={event.type === "success" ? "default" : "secondary"}
                        className={
                          event.type === "success"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : ""
                        }
                      >
                        {new Date(event.timestamp).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(event.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

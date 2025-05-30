"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye } from "lucide-react"
import type { ApplicantData } from "@/app/scholarships/types/auth"

interface DocumentsTabProps {
  userData: ApplicantData
}

export function DocumentsTab({ userData }: DocumentsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>Uploaded Documents</span>
        </CardTitle>
        <CardDescription>All documents submitted with your application</CardDescription>
      </CardHeader>
      <CardContent>
        {userData.documents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.documents.photo && (
              <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Profile Photo</h4>
                  <Badge
                    variant="outline"
                    className="text-green-600 dark:text-green-500 border-green-300 dark:border-green-800"
                  >
                    Uploaded
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={userData.documents.photo} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={userData.documents.photo} download>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {userData.documents.id_card && (
              <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">ID Card</h4>
                  <Badge
                    variant="outline"
                    className="text-green-600 dark:text-green-500 border-green-300 dark:border-green-800"
                  >
                    Uploaded
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={userData.documents.id_card} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={userData.documents.id_card} download>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {userData.documents.tenth_certificate && (
              <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">10th Certificate</h4>
                  <Badge
                    variant="outline"
                    className="text-green-600 dark:text-green-500 border-green-300 dark:border-green-800"
                  >
                    Uploaded
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={userData.documents.tenth_certificate} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={userData.documents.tenth_certificate} download>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No documents information available</p>
        )}
      </CardContent>
    </Card>
  )
}

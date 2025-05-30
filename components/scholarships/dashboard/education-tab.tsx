"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { School, GraduationCap, Award, FileText } from "lucide-react"
import type { ApplicantData } from "@/app/scholarships/types/auth"

interface EducationTabProps {
  userData: ApplicantData
}

export function EducationTab({ userData }: EducationTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <School className="w-5 h-5 text-primary" />
              <span>O Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="font-bold text-lg text-green-600 dark:text-green-500">{userData.tenth_score || "N/A"}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Board</p>
              <p className="font-medium">{userData.tenth_board || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <Badge variant="outline">{userData.tenth_year || "Not provided"}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subjects</p>
              <p className="text-sm">{userData.tenth_subjects || "Not provided"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span>A Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="font-bold text-lg text-green-600 dark:text-green-500">{userData.twelfth_score || "N/A"}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Board</p>
              <p className="font-medium">{userData.twelfth_board || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <Badge variant="outline">{userData.twelfth_year || "Not provided"}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subjects</p>
              <p className="text-sm">{userData.twelfth_subjects || "Not provided"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Graduation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Stream</p>
              <p className="font-medium">{userData.graduation_stream || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">University</p>
              <p className="font-medium">{userData.graduation_university || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <Badge variant="outline">{userData.graduation_year || "Not provided"}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subjects</p>
              <p className="text-sm">{userData.graduation_subjects || "Not provided"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entrance Tests */}
      {userData.entrance_tests && userData.entrance_tests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Entrance Tests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userData.entrance_tests.map((test, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold">{test.name || "Test name not provided"}</h4>
                  <p className="text-sm text-muted-foreground">Year: {test.year || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">Conducted by: {test.conducted_by || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">Marks/Rank: {test.marks_rank || "N/A"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

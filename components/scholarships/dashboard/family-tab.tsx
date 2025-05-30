"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, DollarSign } from "lucide-react"
import type { ApplicantData } from "@/app/scholarships/types/auth"

interface FamilyTabProps {
  userData: ApplicantData
}

export function FamilyTab({ userData }: FamilyTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Parents Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-semibold">Father's Details</h4>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{userData.father_name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Occupation</p>
                <p className="font-medium">{userData.father_occupation || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile</p>
                <p className="font-medium">{userData.father_mobile || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="font-medium flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-500" />
                  <span>
                    {userData.father_income || "0"} {userData.father_income_currency || ""}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Mother's Details</h4>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{userData.mother_name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Occupation</p>
                <p className="font-medium">{userData.mother_occupation || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile</p>
                <p className="font-medium">{userData.mother_mobile || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="font-medium flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-500" />
                  <span>
                    {userData.mother_income || "0"} {userData.mother_income_currency || ""}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Siblings Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userData.siblings && userData.siblings.length > 0 ? (
            <div className="space-y-3">
              {userData.siblings.map((sibling, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{sibling.name || "Name not provided"}</p>
                    <Badge variant="outline">{sibling.relation || "Relation not specified"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No siblings information provided</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

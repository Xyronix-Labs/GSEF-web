"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  LogOut,
  User,
  GraduationCap,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Globe,
  Calendar,
  Settings,
  Users,
  FileText,
  Bell,
  Download,
  RefreshCw,
  Shield,
} from "lucide-react"
import type { ApplicantData } from "@/app/scholarships/types/auth"
import { ModeToggle } from "@/components/scholarships/mode-toggle"
import { PersonalTab } from "@/components/scholarships/dashboard/personal-tab"
import { ContactTab } from "@/components/scholarships/dashboard/contact-tab"
import { FamilyTab } from "@/components/scholarships/dashboard/family-tab"
import { EducationTab } from "@/components/scholarships/dashboard/education-tab"
import { ProgramTab } from "@/components/scholarships/dashboard/program-tab"
import { DocumentsTab } from "@/components/scholarships/dashboard/documents-tab"
import { StatusTracker } from "@/components/scholarships/dashboard/status-tracker"
import { ApplicationHistory } from "@/components/scholarships/dashboard/application-history"
import { NotificationCenter } from "@/components/scholarships/dashboard/notification-center"
import { AdminPanel } from "@/components/scholarships/dashboard/admin-panel"
import { getApplicationStatus } from "@/app/scholarships/actions/auth"

export default function Dashboard() {
  const [userData, setUserData] = useState<ApplicantData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authType, setAuthType] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window !== "undefined") {
        try {
          const storedData = localStorage.getItem("userData")
          const storedAuthType = localStorage.getItem("authType")

          if (!storedData) {
            setError("No user data found. Please log in again.")
            setLoading(false)
            return
          }

          const parsedData = JSON.parse(storedData)
          setUserData(parsedData)
          setAuthType(storedAuthType)

          // Check if user is admin (you can implement your own logic here)
          setIsAdmin(parsedData.application_id?.includes("ADMIN") || false)
        } catch (error) {
          console.error("Error fetching user data:", error)
          setError("Failed to load user data. Please log in again.")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userData")
      localStorage.removeItem("authType")
    }
    router.push("/")
  }

  const handleRefresh = async () => {
    if (!userData?.application_id) return

    setRefreshing(true)
    try {
      const result = await getApplicationStatus(userData.application_id)
      if (result.success && result.data) {
        setUserData(result.data)
        localStorage.setItem("userData", JSON.stringify(result.data))
      }
    } catch (error) {
      console.error("Refresh failed:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const getStatusIcon = (status = "Pending") => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "accepted":
      case "a100":
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
      case "pending":
      case "under review":
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
      case "rejected":
      case "declined":
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getStatusColor = (status = "Pending") => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "accepted":
      case "a100":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900"
      case "pending":
      case "under review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900"
      case "rejected":
      case "declined":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-500">
              <XCircle className="w-6 h-6" />
              <span>Authentication Error</span>
            </CardTitle>
            <CardDescription>We couldn't load your application data</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error || "No user data found. Please log in again."}</AlertDescription>
            </Alert>
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Government Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/xyronixlabs.png"
              alt="Xyronix Labs Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              priority
            />
            <div>
              
              <p className="text-sm opacity-80">{isAdmin ? "Administrative Dashboard" : "Applicant Dashboard"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="bg-white text-gray-900 border border-gray-300 hover:border-orange-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <ModeToggle />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white text-gray-900 border border-gray-300 hover:border-orange-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={userData.documents?.photo || "/placeholder.svg?height=96&width=96"} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                    {userData.first_name?.[0]}
                    {userData.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">
                    {userData.first_name} {userData.last_name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-primary border-primary/30">
                      {userData.application_id}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(userData.status)}
                      <Badge className={getStatusColor(userData.status)}>{userData.status || "Pending"}</Badge>
                    </div>
                    {isAdmin && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900">
                        <Image
                          src="/xyronixlabs.png"
                          alt="Xyronix Labs Logo"
                          width={40}
                          height={40}
                          className="w-20 h-20 object-contain"
                          priority
                        />
                        Administrator
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Applied: {new Date(userData.submitted_at).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Status Tracker */}
        <StatusTracker userData={userData} />

        <Tabs defaultValue={isAdmin ? "admin" : "personal"} className="space-y-6">
          <TabsList className={`grid w-full ${isAdmin ? "grid-cols-8" : "grid-cols-7"}`}>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Personal</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Contact</span>
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Family</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </TabsTrigger>
            <TabsTrigger value="program" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Program</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Admin Panel */}
          {isAdmin && (
            <TabsContent value="admin">
              <AdminPanel />
            </TabsContent>
          )}

          {/* Personal Information */}
          <TabsContent value="personal">
            <PersonalTab userData={userData} />
          </TabsContent>

          {/* Contact Information */}
          <TabsContent value="contact">
            <ContactTab userData={userData} />
          </TabsContent>

          {/* Family Information */}
          <TabsContent value="family">
            <FamilyTab userData={userData} />
          </TabsContent>

          {/* Education Information */}
          <TabsContent value="education">
            <EducationTab userData={userData} />
          </TabsContent>

          {/* Program Information */}
          <TabsContent value="program">
            <ProgramTab userData={userData} />
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents">
            <DocumentsTab userData={userData} />
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <NotificationCenter userData={userData} />
          </TabsContent>
        </Tabs>

        {/* Application History */}
        <ApplicationHistory userData={userData} />
      </div>
    </div>
  )
}

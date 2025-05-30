"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Trash2,
} from "lucide-react"
import { getAllApplicants, updateApplicationStatus, deleteApplicant, getHealthReport } from "@/app/scholarships/actions/auth"
import type { ApplicantData, HealthReport } from "@/app/scholarships/types/auth"

export function AdminPanel() {
  const [applicants, setApplicants] = useState<ApplicantData[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState<ApplicantData[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadApplicants()
    loadHealthReport()
  }, [])

  useEffect(() => {
    filterApplicants()
  }, [applicants, searchTerm, statusFilter])

  const loadApplicants = async () => {
    setLoading(true)
    try {
      const result = await getAllApplicants()
      if (result.success && result.data) {
        setApplicants(result.data)
      } else {
        setError("Failed to load applicants")
      }
    } catch (err) {
      setError("Error loading applicants")
    } finally {
      setLoading(false)
    }
  }

  const loadHealthReport = async () => {
    try {
      const result = await getHealthReport()
      if (result.success && result.data) {
        setHealthReport(result.data)
      }
    } catch (err) {
      console.error("Failed to load health report:", err)
    }
  }

  const filterApplicants = () => {
    let filtered = applicants

    if (searchTerm) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.application_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.student_email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((applicant) => applicant.status?.toLowerCase() === statusFilter)
    }

    setFilteredApplicants(filtered)
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const result = await updateApplicationStatus(applicationId, newStatus)
      if (result.success) {
        setSuccess(`Status updated successfully for ${applicationId}`)
        loadApplicants() // Reload data
      } else {
        setError(`Failed to update status: ${result.error}`)
      }
    } catch (err) {
      setError("Error updating status")
    }
  }

  const handleDeleteApplicant = async (applicationId: string) => {
    if (!confirm(`Are you sure you want to delete applicant ${applicationId}?`)) {
      return
    }

    try {
      const result = await deleteApplicant(applicationId)
      if (result.success) {
        setSuccess(`Applicant ${applicationId} deleted successfully`)
        loadApplicants() // Reload data
      } else {
        setError(`Failed to delete applicant: ${result.error}`)
      }
    } catch (err) {
      setError("Error deleting applicant")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "accepted":
      case "a100":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "accepted":
      case "a100":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const stats = {
    total: applicants.length,
    pending: applicants.filter((a) => a.status?.toLowerCase() === "pending").length,
    approved: applicants.filter((a) => a.status?.toLowerCase() === "approved" || a.status?.toLowerCase() === "a100")
      .length,
    rejected: applicants.filter((a) => a.status?.toLowerCase() === "rejected").length,
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="applicants" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applicants">Manage Applicants</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="applicants">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Application Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={loadApplicants} disabled={loading} size="sm">
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Manage and review scholarship applications</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, application ID, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="a100">A100</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Applicants Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.map((applicant) => (
                      <TableRow key={applicant.application_id}>
                        <TableCell className="font-mono">{applicant.application_id}</TableCell>
                        <TableCell>
                          {applicant.first_name} {applicant.last_name}
                        </TableCell>
                        <TableCell>{applicant.student_email}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(applicant.status || "pending")}
                            <Badge className={getStatusColor(applicant.status || "pending")}>
                              {applicant.status || "Pending"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(applicant.submitted_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Select onValueChange={(value) => handleStatusUpdate(applicant.application_id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Update" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="A100">A100</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteApplicant(applicant.application_id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>System Health Report</span>
              </CardTitle>
              <CardDescription>Monitor system performance and API health</CardDescription>
            </CardHeader>
            <CardContent>
              {healthReport ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Overall Status</h3>
                    <Badge
                      className={
                        healthReport.overall_status === "healthy"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }
                    >
                      {healthReport.overall_status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {healthReport.endpoints.map((endpoint, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{endpoint.endpoint}</span>
                            <Badge
                              className={
                                endpoint.status === "healthy"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }
                            >
                              {endpoint.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Method: {endpoint.method} | Latency: {endpoint.latency_ms}ms
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(healthReport.timestamp).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading health report...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Analytics & Reports</span>
              </CardTitle>
              <CardDescription>Generate and download comprehensive reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex-col">
                  <Download className="w-6 h-6 mb-2" />
                  Export All Applications
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  Generate Analytics Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  Pending Applications Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <CheckCircle className="w-6 h-6 mb-2" />
                  Approved Applications Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

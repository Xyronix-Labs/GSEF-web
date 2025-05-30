"use client"

import Image from "next/image"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Shield, Database, Server, Mail, BadgeIcon as IdCard, Globe, UserPlus } from "lucide-react"
import {
  validateApplication,
  validateEmail,
  checkServerHealth,
  checkDatabaseHealth,
  loginUser,
  registerUser,
} from "@/app/scholarships/actions/auth"
import { ModeToggle } from "@/components/scholarships/mode-toggle"

export default function LoginPage() {
  const [applicationId, setApplicationId] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [healthStatus, setHealthStatus] = useState({
    server: null as boolean | null,
    database: null as boolean | null,
  })
  const router = useRouter()

  // Check health status on page load
  useEffect(() => {
    const checkHealth = async () => {
      const serverHealth = await checkServerHealth()
      setHealthStatus((prev) => ({ ...prev, server: serverHealth }))

      const dbHealth = await checkDatabaseHealth()
      setHealthStatus((prev) => ({ ...prev, database: dbHealth }))
    }

    checkHealth()
  }, [])

  const handleSubmit = async (e: React.FormEvent, loginType: "application" | "email" | "credentials") => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let result

      switch (loginType) {
        case "application":
          if (!applicationId.trim()) {
            setError("Please enter your application ID")
            return
          }
          result = await validateApplication(applicationId)
          break

        case "email":
          if (!email.trim()) {
            setError("Please enter your email address")
            return
          }
          if (!email.includes("@")) {
            setError("Please enter a valid email address")
            return
          }
          result = await validateEmail(email)
          break

        case "credentials":
          if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password")
            return
          }
          result = await loginUser(username, password)
          break

        default:
          setError("Invalid login type")
          return
      }

      if (result.success && result.data) {
        if (typeof window !== "undefined") {
          localStorage.setItem("userData", JSON.stringify(result.data))
          localStorage.setItem("authType", loginType)
        }
        router.push("/scholarships/dashboard")
      } else {
        setError(result.error || "Authentication failed")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!applicationId.trim() || !username.trim() || !password.trim()) {
      setError("Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await registerUser(applicationId, username, password)

      if (result.success) {
        // Auto-login after successful registration
        const loginResult = await loginUser(username, password)
        if (loginResult.success && loginResult.data) {
          if (typeof window !== "undefined") {
            localStorage.setItem("userData", JSON.stringify(loginResult.data))
            localStorage.setItem("authType", "credentials")
          }
          router.push("/dashboard")
        }
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background flex items-center justify-center p-4">
      

      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E5E7EB%22%20fill-opacity%3D%220.2%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50 dark:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23374151%22%20fill-opacity%3D%220.2%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:opacity-30"></div>

      <Card className="w-full max-w-md backdrop-blur-sm border-border shadow-xl mt-20">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/xyronixlabs.png"
              alt="Xyronix Labs Logo"
              width={40}
              height={40}
              className="w-20 h-20 object-contain"
              priority
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">GSEF Portal Access</CardTitle>
            <CardDescription className="mt-2">Secure authentication for scholarship applicants</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Health Status Indicators */}
          <div className="flex justify-center space-x-6 mb-6 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-muted-foreground" />
              <div
                className={`w-3 h-3 rounded-full ${
                  healthStatus.server === null
                    ? "bg-gray-400 dark:bg-gray-500"
                    : healthStatus.server
                      ? "bg-green-500"
                      : "bg-red-500"
                }`}
              />
              <span className="text-xs font-medium">Server</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <div
                className={`w-3 h-3 rounded-full ${
                  healthStatus.database === null
                    ? "bg-gray-400 dark:bg-gray-500"
                    : healthStatus.database
                      ? "bg-green-500"
                      : "bg-red-500"
                }`}
              />
              <span className="text-xs font-medium">Database</span>
            </div>
          </div>

          <Tabs defaultValue="application" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="application" className="flex items-center space-x-1 text-xs">
                <IdCard className="w-3 h-3" />
                <span>App ID</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center space-x-1 text-xs">
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="login" className="flex items-center space-x-1 text-xs">
                <Shield className="w-3 h-3" />
                <span>Login</span>
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center space-x-1 text-xs">
                <UserPlus className="w-3 h-3" />
                <span>Register</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="application" className="space-y-4 mt-6">
              <form onSubmit={(e) => handleSubmit(e, "application")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="applicationId">Application ID</Label>
                  <Input
                    id="applicationId"
                    type="text"
                    placeholder="Enter your application ID (e.g., IAF-2025-50144)"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Access Dashboard"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 mt-6">
              <form onSubmit={(e) => handleSubmit(e, "email")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Access Dashboard"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={(e) => handleSubmit(e, "credentials")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="regApplicationId">Application ID</Label>
                  <Input
                    id="regApplicationId"
                    type="text"
                    placeholder="Your application ID"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regUsername">Username</Label>
                  <Input
                    id="regUsername"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regPassword">Password</Label>
                  <Input
                    id="regPassword"
                    type="password"
                    placeholder="Create a password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Authorized access only • All activities are monitored and logged
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">© 2025 Global South Education Fund</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

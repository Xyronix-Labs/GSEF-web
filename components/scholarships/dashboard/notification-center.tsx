"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react"
import type { ApplicantData, NotificationData } from "@/app/scholarships/types/auth"

interface NotificationCenterProps {
  userData: ApplicantData
}

export function NotificationCenter({ userData }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([])

  useEffect(() => {
    // Mock notifications - in a real app, these would come from an API
    const mockNotifications: NotificationData[] = [
      {
        id: "1",
        title: "Application Status Update",
        message: `Your application ${userData.application_id} status has been updated to: ${userData.status || "Pending"}`,
        type: "info",
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: "2",
        title: "Document Verification",
        message: "All your submitted documents have been verified successfully.",
        type: "success",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true,
      },
      {
        id: "3",
        title: "Interview Scheduled",
        message: "Your scholarship interview has been scheduled. Please check your email for details.",
        type: "warning",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        read: false,
      },
    ]

    setNotifications(mockNotifications)
  }, [userData])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "error":
        return <X className="w-5 h-5 text-red-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <span>Notification Center</span>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Stay updated with your application progress</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read ? "bg-muted/30 border-muted" : "bg-background border-primary/20 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className={`font-semibold ${notification.read ? "text-muted-foreground" : ""}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 ${notification.read ? "text-muted-foreground" : ""}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                        Mark as Read
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => removeNotification(notification.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

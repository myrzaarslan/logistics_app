"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { LoginPage } from "@/components/auth/login-page"
import { MainLayout } from "@/components/layout/main-layout"
import { Dashboard } from "@/components/dashboard/dashboard"
import { RequestForm } from "@/components/requests/request-form"
import { RequestDetails } from "@/components/requests/request-details"
import { DocumentManager } from "@/components/documents/document-manager"
import { ActivityLog } from "@/components/activity/activity-log"
import { UserManagement } from "@/components/users/user-management"
import type { TransportRequest } from "@/types/request"
import { sampleRequests } from "@/data/sample-data"

function AppContent() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null)
  const [requests, setRequests] = useState<TransportRequest[]>(sampleRequests)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  const updateRequestStatus = (requestId: string, newStatus: TransportRequest["status"]) => {
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req)))
  }

  const handleRequestClick = (request: TransportRequest) => {
    setSelectedRequest(request)
  }

  const handleBackFromDetails = () => {
    setSelectedRequest(null)
  }

  const renderContent = () => {
    if (selectedRequest) {
      return (
        <RequestDetails request={selectedRequest} onBack={handleBackFromDetails} onStatusUpdate={updateRequestStatus} />
      )
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard userRole={user.role} currentUserId={user.id} onRequestClick={handleRequestClick} />
      case "create-request":
        return <RequestForm />
      case "documents":
        return <DocumentManager />
      case "activity":
        return <ActivityLog userRole={user.role} />
      case "users":
        return <UserManagement currentUser={user} />
      default:
        return <Dashboard userRole={user.role} currentUserId={user.id} onRequestClick={handleRequestClick} />
    }
  }

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab} currentUser={user}>
      {renderContent()}
    </MainLayout>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

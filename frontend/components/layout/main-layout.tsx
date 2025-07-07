"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, Plus, FileText, Activity, LogOut, Truck, User } from "lucide-react"
import type { UserRole } from "@/types/user"

interface MainLayoutProps {
  children: ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
  currentUser: UserRole
}

export function MainLayout({ children, activeTab, onTabChange, currentUser }: MainLayoutProps) {
  const tabs = [
    { id: "dashboard", label: "Панель управления", icon: LayoutDashboard },
    { id: "create-request", label: "Создать заявку", icon: Plus },
    { id: "documents", label: "Документы", icon: FileText },
    { id: "activity", label: "Активность", icon: Activity },
    ...(currentUser.role === "chief_logistician" ? [{ id: "users", label: "Пользователи", icon: User }] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">LogisTech</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-500">
                {currentUser.role === "chief_logistician" ? "Главный логист" : "Логист"}
              </p>
            </div>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">{children}</main>
    </div>
  )
}

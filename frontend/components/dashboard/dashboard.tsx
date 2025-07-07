"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Package, Clock, CheckCircle, AlertCircle, Search } from "lucide-react"
import { RequestCard } from "./request-card"
import { StatusFilter } from "./status-filter"
import { sampleRequests } from "@/data/sample-data"
import type { TransportRequest } from "@/types/request"

interface DashboardProps {
  userRole: "chief_logistician" | "logistician"
  currentUserId: string
  onRequestClick?: (request: TransportRequest) => void
}

export function Dashboard({ userRole, currentUserId, onRequestClick }: DashboardProps) {
  const [requests, setRequests] = useState<TransportRequest[]>(sampleRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [logisticianFilter, setLogisticianFilter] = useState<string>("all")

  const stats = {
    total: requests.length,
    notStarted: requests.filter((r) => r.status === "not_started").length,
    inProgress: requests.filter((r) => r.status === "loading" || r.status === "in_transit").length,
    completed: requests.filter((r) => r.status === "completed").length,
  }

  // Filter requests based on user role
  const userRequests =
    userRole === "chief_logistician"
      ? requests
      : requests.filter((req) => req.issuedBy === "Current User" || req.driver.name.includes("Current User"))

  const filteredRequests = userRequests.filter((request) => {
    const matchesSearch =
      request.cargo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.route.to.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesLogistician = logisticianFilter === "all" || request.issuedBy === logisticianFilter

    return matchesSearch && matchesStatus && matchesLogistician
  })

  const updateRequestStatus = (requestId: string, newStatus: TransportRequest["status"]) => {
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req)))
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Не начато</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.notStarted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В процессе</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершено</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры и поиск</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по грузу, водителю, маршруту..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <StatusFilter value={statusFilter} onChange={setStatusFilter} />

            {userRole === "chief_logistician" && (
              <Select value={logisticianFilter} onValueChange={setLogisticianFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Логист" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все логисты</SelectItem>
                  <SelectItem value="Иван Петров">Иван Петров</SelectItem>
                  <SelectItem value="Мария Сидорова">Мария Сидорова</SelectItem>
                  <SelectItem value="Алексей Козлов">Алексей Козлов</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Активные заявки ({filteredRequests.length})</h2>

        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Заявки не найдены</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onStatusUpdate={updateRequestStatus}
                userRole={userRole}
                onClick={onRequestClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

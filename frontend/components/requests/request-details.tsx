"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  MapPin,
  User,
  Package,
  Calendar,
  Truck,
  FileText,
  Edit,
  Download,
  Eye,
  DollarSign,
  Clock,
} from "lucide-react"
import type { TransportRequest } from "@/types/request"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

interface RequestDetailsProps {
  request: TransportRequest
  onBack: () => void
  onStatusUpdate: (requestId: string, status: TransportRequest["status"]) => void
}

export function RequestDetails({ request, onBack, onStatusUpdate }: RequestDetailsProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const canEdit = user?.role === "chief_logistician" || request.issuedBy === user?.name

  const statusHistory = [
    { status: "not_started", date: request.createdAt, user: request.issuedBy },
    { status: "loading", date: "2024-01-15T08:00:00Z", user: request.issuedBy },
    { status: "in_transit", date: "2024-01-15T14:30:00Z", user: request.issuedBy },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Заявка #{request.id}</h1>
            <p className="text-muted-foreground">
              Создано: {formatDate(request.createdAt)} • {request.issuedBy}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <StatusBadge status={request.status} />
          {canEdit && (
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="route">Маршрут</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Route Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Маршрут</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="font-medium text-lg">{request.route.from}</p>
                  <p className="text-sm text-muted-foreground">Отправление</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-px bg-border flex-1 w-12"></div>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div className="h-px bg-border flex-1 w-12"></div>
                </div>
                <div className="flex-1 text-right">
                  <p className="font-medium text-lg">{request.route.to}</p>
                  <p className="text-sm text-muted-foreground">Назначение</p>
                </div>
              </div>

              {request.route.waypoints && request.route.waypoints.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Промежуточные точки:</p>
                  <div className="flex flex-wrap gap-2">
                    {request.route.waypoints.map((waypoint, index) => (
                      <Badge key={index} variant="secondary">
                        {waypoint}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver & Vehicle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Водитель и транспорт</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{request.driver.name}</p>
                  <p className="text-sm text-muted-foreground">ИИН: {request.driver.iin}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">{request.vehicle.stateNumber}</p>
                  <p className="text-sm text-muted-foreground">{request.vehicle.type}</p>
                  <div className="flex space-x-2 mt-2">
                    {request.vehicle.hasTractor && <Badge variant="outline">Тягач</Badge>}
                    {request.vehicle.hasTrailer && <Badge variant="outline">Прицеп</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cargo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Груз</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-medium">{request.cargo.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Вес</p>
                    <p className="font-medium">{request.cargo.weight} т</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Паллеты</p>
                    <p className="font-medium">{request.cargo.palletCount}</p>
                  </div>
                </div>
                {request.cargo.temperatureMode && (
                  <div>
                    <p className="text-muted-foreground text-sm">Температурный режим</p>
                    <Badge variant="secondary">{request.cargo.temperatureMode}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Даты</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Погрузка</p>
                  <p className="font-medium">{formatDate(request.dates.loading)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Разгрузка</p>
                  <p className="font-medium">{formatDate(request.dates.unloading)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Финансы</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Стоимость водителю</p>
                    <p className="font-medium">{formatCurrency(request.payment.costToDriver)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Цена от клиента</p>
                    <p className="font-medium">{formatCurrency(request.payment.priceFromCustomer)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Аванс</p>
                    <p className="font-medium">{formatCurrency(request.payment.advance)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Маржа</p>
                    <p className="font-medium text-green-600">{formatCurrency(request.payment.totalMargin)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="route" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Детали маршрута</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-2">Здесь будет интеграция с картами</p>
                  <p className="text-xs text-muted-foreground">
                    Планируется интеграция с Google Maps API для отображения маршрута
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{request.route.from}</p>
                      <p className="text-sm text-muted-foreground">Точка отправления</p>
                    </div>
                  </div>

                  {request.route.waypoints?.map((waypoint, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{waypoint}</p>
                        <p className="text-sm text-muted-foreground">Промежуточная точка {index + 1}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{request.route.to}</p>
                      <p className="text-sm text-muted-foreground">Точка назначения</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Документы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(request.documents).map(
                  ([type, filename]) =>
                    filename && (
                      <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{type.toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">{filename}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Просмотр
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Скачать
                          </Button>
                        </div>
                      </div>
                    ),
                )}

                {Object.keys(request.documents).length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Документы не загружены</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>История изменений</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusHistory.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <StatusBadge status={entry.status as TransportRequest["status"]} />
                        <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Изменено: {entry.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

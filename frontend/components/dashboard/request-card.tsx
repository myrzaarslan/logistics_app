"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, User, Package, Calendar, Truck, FileText, Edit } from "lucide-react"
import type { TransportRequest } from "@/types/request"
import { StatusBadge } from "./status-badge"
import { formatCurrency, formatDate } from "@/lib/utils"

interface RequestCardProps {
  request: TransportRequest
  onStatusUpdate: (requestId: string, status: TransportRequest["status"]) => void
  userRole: "chief_logistician" | "logistician"
  onClick?: (request: TransportRequest) => void
}

export function RequestCard({ request, onStatusUpdate, userRole, onClick }: RequestCardProps) {
  const canEdit = userRole === "chief_logistician" || request.issuedBy === "Current User"

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick?.(request)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">Заявка #{request.id}</h3>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Создано: {formatDate(request.createdAt)} • {request.issuedBy}
            </p>
          </div>

          {canEdit && (
            <div className="flex items-center space-x-2">
              <Select
                value={request.status}
                onValueChange={(value) => onStatusUpdate(request.id, value as TransportRequest["status"])}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Не начато</SelectItem>
                  <SelectItem value="loading">Погрузка</SelectItem>
                  <SelectItem value="in_transit">В пути</SelectItem>
                  <SelectItem value="unloading">Разгрузка</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Route */}
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{request.route.from}</span>
          <span className="text-muted-foreground">→</span>
          <span className="font-medium">{request.route.to}</span>
          {request.route.waypoints && request.route.waypoints.length > 0 && (
            <Badge variant="secondary">+{request.route.waypoints.length} точек</Badge>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Погрузка: {formatDate(request.dates.loading)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Разгрузка: {formatDate(request.dates.unloading)}</span>
          </div>
        </div>

        {/* Driver & Vehicle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{request.driver.name}</span>
            <Badge variant="outline">{request.driver.iin}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span>{request.vehicle.stateNumber}</span>
            <Badge variant="secondary">{request.vehicle.type}</Badge>
          </div>
        </div>

        {/* Cargo */}
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{request.cargo.name}</span>
          <Badge variant="outline">{request.cargo.weight} т</Badge>
          <Badge variant="outline">{request.cargo.palletCount} паллет</Badge>
          {request.cargo.temperatureMode && <Badge variant="secondary">{request.cargo.temperatureMode}</Badge>}
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg text-sm">
          <div>
            <p className="text-muted-foreground">Стоимость водителю</p>
            <p className="font-medium">{formatCurrency(request.payment.costToDriver)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Цена от клиента</p>
            <p className="font-medium">{formatCurrency(request.payment.priceFromCustomer)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Маржа</p>
            <p className="font-medium text-green-600">{formatCurrency(request.payment.totalMargin)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Аванс</p>
            <p className="font-medium">{formatCurrency(request.payment.advance)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            {request.documents.ttn && (
              <Badge variant="outline" className="text-green-600">
                <FileText className="h-3 w-3 mr-1" />
                ТТН
              </Badge>
            )}
            {request.documents.cmr && (
              <Badge variant="outline" className="text-blue-600">
                <FileText className="h-3 w-3 mr-1" />
                CMR
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Документы
            </Button>
            <Button variant="outline" size="sm">
              PDF договор
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

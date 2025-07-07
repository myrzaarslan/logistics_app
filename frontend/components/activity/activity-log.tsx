"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, User, FileText, Truck, CheckCircle, AlertCircle } from "lucide-react"
import { sampleActivityLog } from "@/data/sample-data"
import type { ActivityLogEntry } from "@/types/activity"
import { formatDate } from "@/lib/utils"

interface ActivityLogProps {
  userRole: "chief_logistician" | "logistician"
}

export function ActivityLog({ userRole }: ActivityLogProps) {
  const [activities] = useState<ActivityLogEntry[]>(sampleActivityLog)

  // Filter activities based on user role
  const userActivities =
    userRole === "chief_logistician"
      ? activities
      : activities.filter((activity) => activity.userName === "Current User")

  const [userFilter, setUserFilter] = useState<string>("all")
  const [actionFilter, setActionFilter] = useState<string>("all")

  const filteredActivities = userActivities.filter((activity) => {
    const matchesUser = userFilter === "all" || activity.userId === userFilter
    const matchesAction = actionFilter === "all" || activity.action === actionFilter

    return matchesUser && matchesAction
  })

  const getActionIcon = (action: ActivityLogEntry["action"]) => {
    const iconMap = {
      create_request: <FileText className="h-4 w-4" />,
      update_status: <Truck className="h-4 w-4" />,
      upload_document: <FileText className="h-4 w-4" />,
      complete_request: <CheckCircle className="h-4 w-4" />,
      login: <User className="h-4 w-4" />,
      other: <AlertCircle className="h-4 w-4" />,
    }

    return iconMap[action] || iconMap.other
  }

  const getActionLabel = (action: ActivityLogEntry["action"]) => {
    const labelMap = {
      create_request: "Создание заявки",
      update_status: "Обновление статуса",
      upload_document: "Загрузка документа",
      complete_request: "Завершение заявки",
      login: "Вход в систему",
      other: "Другое действие",
    }

    return labelMap[action] || labelMap.other
  }

  const getActionColor = (action: ActivityLogEntry["action"]) => {
    const colorMap = {
      create_request: "bg-blue-100 text-blue-800",
      update_status: "bg-yellow-100 text-yellow-800",
      upload_document: "bg-purple-100 text-purple-800",
      complete_request: "bg-green-100 text-green-800",
      login: "bg-gray-100 text-gray-800",
      other: "bg-gray-100 text-gray-800",
    }

    return colorMap[action] || colorMap.other
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Журнал активности</h1>
      </div>

      {/* Filters */}
      {userRole === "chief_logistician" && (
        <Card>
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Пользователь" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все пользователи</SelectItem>
                  <SelectItem value="1">Иван Петров</SelectItem>
                  <SelectItem value="2">Мария Сидорова</SelectItem>
                  <SelectItem value="3">Алексей Козлов</SelectItem>
                </SelectContent>
              </Select>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Действие" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все действия</SelectItem>
                  <SelectItem value="create_request">Создание заявки</SelectItem>
                  <SelectItem value="update_status">Обновление статуса</SelectItem>
                  <SelectItem value="upload_document">Загрузка документа</SelectItem>
                  <SelectItem value="complete_request">Завершение заявки</SelectItem>
                  <SelectItem value="login">Вход в систему</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Последние действия ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Нет записей активности</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-gray-100 rounded-full">{getActionIcon(activity.action)}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getActionColor(activity.action)}>{getActionLabel(activity.action)}</Badge>
                        {activity.requestId && <Badge variant="outline">Заявка #{activity.requestId}</Badge>}
                      </div>
                      <span className="text-sm text-muted-foreground">{formatDate(activity.timestamp)}</span>
                    </div>

                    <p className="mt-1 text-sm text-gray-900">{activity.description}</p>

                    <div className="mt-2 flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="text-xs">
                          {activity.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{activity.userName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

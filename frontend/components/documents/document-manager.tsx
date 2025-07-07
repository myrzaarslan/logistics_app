"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, Download, Eye, Upload, Calendar } from "lucide-react"
import { sampleDocuments } from "@/data/sample-data"
import type { Document } from "@/types/document"
import { formatDate } from "@/lib/utils"

export function DocumentManager() {
  const [documents] = useState<Document[]>(sampleDocuments)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === "all" || doc.type === typeFilter
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getDocumentIcon = (type: Document["type"]) => {
    return <FileText className="h-4 w-4" />
  }

  const getStatusBadge = (status: Document["status"]) => {
    const statusConfig = {
      pending: { label: "Ожидает", variant: "secondary" as const },
      approved: { label: "Одобрен", variant: "default" as const },
      rejected: { label: "Отклонен", variant: "destructive" as const },
    }

    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTypeBadge = (type: Document["type"]) => {
    const typeConfig = {
      ttn: { label: "ТТН", color: "bg-blue-100 text-blue-800" },
      cmr: { label: "CMR", color: "bg-green-100 text-green-800" },
      invoice: { label: "Счет", color: "bg-purple-100 text-purple-800" },
      contract: { label: "Договор", color: "bg-orange-100 text-orange-800" },
      other: { label: "Другое", color: "bg-gray-100 text-gray-800" },
    }

    const config = typeConfig[type]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Управление документами</h1>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Загрузить документ
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Поиск и фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию, ID заявки, водителю, ключевым словам..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="ttn">ТТН</SelectItem>
                <SelectItem value="cmr">CMR</SelectItem>
                <SelectItem value="invoice">Счет</SelectItem>
                <SelectItem value="contract">Договор</SelectItem>
                <SelectItem value="other">Другое</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="pending">Ожидает</SelectItem>
                <SelectItem value="approved">Одобрен</SelectItem>
                <SelectItem value="rejected">Отклонен</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Документы ({filteredDocuments.length})</h2>

        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Документы не найдены</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">{getDocumentIcon(document.type)}</div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{document.name}</h3>
                          {getTypeBadge(document.type)}
                          {getStatusBadge(document.status)}
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Заявка: #{document.requestId}</p>
                          {document.driverName && <p>Водитель: {document.driverName}</p>}
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Загружен: {formatDate(document.uploadedAt)}</span>
                          </div>
                        </div>

                        {document.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {document.keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

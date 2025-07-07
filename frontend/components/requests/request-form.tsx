"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, Upload, FileText } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface RequestFormData {
  // Route
  routeFrom: string
  routeTo: string
  waypoints: string[]

  // Dates
  loadingDate: Date | undefined
  unloadingDate: Date | undefined

  // Driver
  driverName: string
  driverIIN: string

  // Vehicle
  vehicleStateNumber: string
  vehicleType: string
  hasTractor: boolean
  hasTrailer: boolean

  // Cargo
  cargoName: string
  cargoWeight: string
  palletCount: string
  temperatureMode: string

  // Payment
  costToDriver: string
  priceFromCustomer: string
  advance: string

  // Documents
  uploadedFiles: File[]
}

export function RequestForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<RequestFormData>({
    routeFrom: "",
    routeTo: "",
    waypoints: [],
    loadingDate: undefined,
    unloadingDate: undefined,
    driverName: "",
    driverIIN: "",
    vehicleStateNumber: "",
    vehicleType: "",
    hasTractor: false,
    hasTrailer: false,
    cargoName: "",
    cargoWeight: "",
    palletCount: "",
    temperatureMode: "",
    costToDriver: "",
    priceFromCustomer: "",
    advance: "",
    uploadedFiles: [],
  })

  const addWaypoint = () => {
    setFormData((prev) => ({
      ...prev,
      waypoints: [...prev.waypoints, ""],
    }))
  }

  const removeWaypoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      waypoints: prev.waypoints.filter((_, i) => i !== index),
    }))
  }

  const updateWaypoint = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      waypoints: prev.waypoints.map((wp, i) => (i === index ? value : wp)),
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files],
    }))
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index),
    }))
  }

  const calculateMargin = () => {
    const cost = Number.parseFloat(formData.costToDriver) || 0
    const price = Number.parseFloat(formData.priceFromCustomer) || 0
    return price - cost
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.routeFrom || !formData.routeTo || !formData.loadingDate || !formData.unloadingDate) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)

    toast({
      title: "Успешно",
      description: "Заявка создана успешно",
    })
  }

  const generatePDF = () => {
    // This would integrate with a PDF generation library
    toast({
      title: "PDF генерируется",
      description: "Договор будет скачан автоматически",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Создать новую заявку</h1>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={generatePDF}>
            <FileText className="h-4 w-4 mr-2" />
            Генерировать PDF
          </Button>
          <Button type="submit">Создать заявку</Button>
        </div>
      </div>

      {/* Route Section */}
      <Card>
        <CardHeader>
          <CardTitle>Маршрут</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="routeFrom">Город отправления *</Label>
              <Input
                id="routeFrom"
                value={formData.routeFrom}
                onChange={(e) => setFormData((prev) => ({ ...prev, routeFrom: e.target.value }))}
                placeholder="Например: Алматы"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routeTo">Город назначения *</Label>
              <Input
                id="routeTo"
                value={formData.routeTo}
                onChange={(e) => setFormData((prev) => ({ ...prev, routeTo: e.target.value }))}
                placeholder="Например: Астана"
                required
              />
            </div>
          </div>

          {/* Waypoints */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Промежуточные точки</Label>
              <Button type="button" variant="outline" size="sm" onClick={addWaypoint}>
                <Plus className="h-4 w-4 mr-1" />
                Добавить точку
              </Button>
            </div>
            {formData.waypoints.map((waypoint, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={waypoint}
                  onChange={(e) => updateWaypoint(index, e.target.value)}
                  placeholder={`Промежуточная точка ${index + 1}`}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => removeWaypoint(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dates Section */}
      <Card>
        <CardHeader>
          <CardTitle>Даты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Дата погрузки *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.loadingDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.loadingDate ? (
                      format(formData.loadingDate, "PPP", { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.loadingDate}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, loadingDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Дата разгрузки *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.unloadingDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.unloadingDate ? (
                      format(formData.unloadingDate, "PPP", { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.unloadingDate}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, unloadingDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Section */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о водителе</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driverName">ФИО водителя *</Label>
              <Input
                id="driverName"
                value={formData.driverName}
                onChange={(e) => setFormData((prev) => ({ ...prev, driverName: e.target.value }))}
                placeholder="Иванов Иван Иванович"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverIIN">ИИН водителя *</Label>
              <Input
                id="driverIIN"
                value={formData.driverIIN}
                onChange={(e) => setFormData((prev) => ({ ...prev, driverIIN: e.target.value }))}
                placeholder="123456789012"
                maxLength={12}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Section */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о транспорте</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleStateNumber">Гос. номер *</Label>
              <Input
                id="vehicleStateNumber"
                value={formData.vehicleStateNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, vehicleStateNumber: e.target.value }))}
                placeholder="123ABC01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Тип транспорта</Label>
              <Select
                value={formData.vehicleType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, vehicleType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truck">Грузовик</SelectItem>
                  <SelectItem value="semi-trailer">Полуприцеп</SelectItem>
                  <SelectItem value="trailer">Прицеп</SelectItem>
                  <SelectItem value="van">Фургон</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasTractor"
                checked={formData.hasTractor}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hasTractor: checked as boolean }))}
              />
              <Label htmlFor="hasTractor">С тягачом</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasTrailer"
                checked={formData.hasTrailer}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hasTrailer: checked as boolean }))}
              />
              <Label htmlFor="hasTrailer">С прицепом</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cargo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о грузе</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cargoName">Наименование груза *</Label>
              <Input
                id="cargoName"
                value={formData.cargoName}
                onChange={(e) => setFormData((prev) => ({ ...prev, cargoName: e.target.value }))}
                placeholder="Например: Продукты питания"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargoWeight">Вес (тонн) *</Label>
              <Input
                id="cargoWeight"
                type="number"
                step="0.1"
                value={formData.cargoWeight}
                onChange={(e) => setFormData((prev) => ({ ...prev, cargoWeight: e.target.value }))}
                placeholder="20.5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="palletCount">Количество паллет</Label>
              <Input
                id="palletCount"
                type="number"
                value={formData.palletCount}
                onChange={(e) => setFormData((prev) => ({ ...prev, palletCount: e.target.value }))}
                placeholder="33"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperatureMode">Температурный режим</Label>
              <Select
                value={formData.temperatureMode}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, temperatureMode: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите режим" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambient">Обычный</SelectItem>
                  <SelectItem value="refrigerated">Рефрижератор</SelectItem>
                  <SelectItem value="frozen">Заморозка</SelectItem>
                  <SelectItem value="heated">Подогрев</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Финансовая информация</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costToDriver">Стоимость водителю (₸) *</Label>
              <Input
                id="costToDriver"
                type="number"
                value={formData.costToDriver}
                onChange={(e) => setFormData((prev) => ({ ...prev, costToDriver: e.target.value }))}
                placeholder="500000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceFromCustomer">Цена от клиента (₸) *</Label>
              <Input
                id="priceFromCustomer"
                type="number"
                value={formData.priceFromCustomer}
                onChange={(e) => setFormData((prev) => ({ ...prev, priceFromCustomer: e.target.value }))}
                placeholder="600000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advance">Аванс (₸)</Label>
              <Input
                id="advance"
                type="number"
                value={formData.advance}
                onChange={(e) => setFormData((prev) => ({ ...prev, advance: e.target.value }))}
                placeholder="200000"
              />
            </div>
          </div>

          {formData.costToDriver && formData.priceFromCustomer && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Маржа: {calculateMargin().toLocaleString("ru-RU")} ₸</strong>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle>Документы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fileUpload">Загрузить ТТН/CMR/SMR (PDF, JPG)</Label>
              <div className="mt-2">
                <Input
                  id="fileUpload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById("fileUpload")?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Выбрать файлы
                </Button>
              </div>
            </div>

            {formData.uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Загруженные файлы:</Label>
                {formData.uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

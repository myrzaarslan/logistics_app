"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StatusFilterProps {
  value: string
  onChange: (value: string) => void
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Статус" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все статусы</SelectItem>
        <SelectItem value="not_started">Не начато</SelectItem>
        <SelectItem value="loading">Погрузка</SelectItem>
        <SelectItem value="in_transit">В пути</SelectItem>
        <SelectItem value="unloading">Разгрузка</SelectItem>
        <SelectItem value="completed">Завершено</SelectItem>
      </SelectContent>
    </Select>
  )
}

import { Badge } from "@/components/ui/badge"
import type { TransportRequest } from "@/types/request"

interface StatusBadgeProps {
  status: TransportRequest["status"]
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    not_started: { label: "Не начато", variant: "secondary" as const, color: "text-orange-600" },
    loading: { label: "Погрузка", variant: "default" as const, color: "text-blue-600" },
    in_transit: { label: "В пути", variant: "default" as const, color: "text-purple-600" },
    unloading: { label: "Разгрузка", variant: "default" as const, color: "text-indigo-600" },
    completed: { label: "Завершено", variant: "default" as const, color: "text-green-600" },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={config.color}>
      {config.label}
    </Badge>
  )
}

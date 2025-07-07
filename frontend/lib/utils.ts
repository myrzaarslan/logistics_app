import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function calculateMargin(priceFromCustomer: number, costToDriver: number): number {
  return priceFromCustomer - costToDriver
}

export function getStatusColor(status: string): string {
  const statusColors = {
    not_started: "text-orange-600 bg-orange-100",
    loading: "text-blue-600 bg-blue-100",
    in_transit: "text-purple-600 bg-purple-100",
    unloading: "text-indigo-600 bg-indigo-100",
    completed: "text-green-600 bg-green-100",
  }

  return statusColors[status as keyof typeof statusColors] || "text-gray-600 bg-gray-100"
}

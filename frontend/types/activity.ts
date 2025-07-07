export interface ActivityLogEntry {
  id: string
  userId: string
  userName: string
  action: "create_request" | "update_status" | "upload_document" | "complete_request" | "login" | "other"
  description: string
  requestId?: string
  timestamp: string
  metadata?: Record<string, any>
}

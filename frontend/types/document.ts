export interface Document {
  id: string
  name: string
  type: "ttn" | "cmr" | "invoice" | "contract" | "other"
  status: "pending" | "approved" | "rejected"
  requestId: string
  driverName?: string
  keywords: string[]
  uploadedAt: string
  uploadedBy: string
  fileUrl: string
  fileSize: number
}

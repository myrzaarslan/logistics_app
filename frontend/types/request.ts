export interface TransportRequest {
  id: string
  status: "not_started" | "loading" | "in_transit" | "unloading" | "completed"
  route: {
    from: string
    to: string
    waypoints?: string[]
  }
  dates: {
    loading: string
    unloading: string
  }
  driver: {
    name: string
    iin: string
  }
  vehicle: {
    stateNumber: string
    type: string
    hasTractor: boolean
    hasTrailer: boolean
  }
  cargo: {
    name: string
    weight: number
    palletCount: number
    temperatureMode?: string
  }
  payment: {
    costToDriver: number
    priceFromCustomer: number
    advance: number
    totalMargin: number
  }
  documents: {
    ttn?: string
    cmr?: string
    smr?: string
  }
  issuedBy: string
  createdAt: string
  updatedAt: string
}

export interface Staff {
  id: number
  name: string
  email: string
  phone: string | null
  status: 'active' | 'inactive'
}

export interface ServiceSlot {
  id: number
  staff_id: number
  slot_date: string
  start_time: string
  end_time: string
  status: 'available' | 'held' | 'confirmed'
  staff?: Staff
}

export interface BookingReservation {
  reservation_id: number
  service_slot_id: number
  customer_id: number
  status: 'held' | 'confirmed' | 'expired' | 'cancelled'
  hold_expires_at: string | null
  confirmed_at: string | null
  remaining_seconds: number
  slot?: ServiceSlot
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface ApiListResponse<T> {
  data: T[]
}

export interface ApiError {
  success: false
  message: string
  error_code?: string
  errors?: Record<string, string[]>
}

export interface AuthResponse {
  success: boolean
  token: string
  customer: { id: number; name: string; email: string }
}

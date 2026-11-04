import api from './axios'
import type { ApiResponse, ApiListResponse, BookingReservation } from '../types/booking'

export const reserveSlot = (
  serviceSlotId: number,
  idempotencyKey: string
): Promise<ApiResponse<BookingReservation>> =>
  api
    .post<ApiResponse<BookingReservation>>('/bookings/reserve', {
      service_slot_id: serviceSlotId,
      idempotency_key: idempotencyKey,
    })
    .then((r) => r.data)

export const confirmReservation = (
  reservationId: number
): Promise<ApiResponse<BookingReservation>> =>
  api
    .post<ApiResponse<BookingReservation>>('/bookings/confirm', { reservation_id: reservationId })
    .then((r) => r.data)

export const getReservation = (
  reservationId: number
): Promise<ApiResponse<BookingReservation>> =>
  api
    .get<ApiResponse<BookingReservation>>(`/bookings/${reservationId}`)
    .then((r) => r.data)

export const cancelReservation = (
  reservationId: number
): Promise<ApiResponse<BookingReservation>> =>
  api
    .post<ApiResponse<BookingReservation>>(`/bookings/${reservationId}/cancel`)
    .then((r) => r.data)

export interface MyBookingsResponse {
  success: boolean
  data: BookingReservation[]
  meta: { current_page: number; last_page: number; total: number }
}

export const getMyBookings = (page = 1): Promise<MyBookingsResponse> =>
  api.get<MyBookingsResponse>('/bookings', { params: { page } }).then((r) => r.data)

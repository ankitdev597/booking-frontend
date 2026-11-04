import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BookingPage } from '../pages/BookingPage'
import * as staffApi from '../api/staffApi'
import * as slotApi from '../api/slotApi'
import * as bookingApi from '../api/bookingApi'
import { AuthProvider } from '../context/AuthContext'

// Seed localStorage so AuthProvider sees an authenticated customer
beforeEach(() => {
  localStorage.setItem('auth_token', 'test-token')
  localStorage.setItem('customer', JSON.stringify({ id: 1, name: 'Alice', email: 'alice@test.com' }))
})

const staffList = [{ id: 1, name: 'Dr. Smith', email: 'smith@test.com', phone: null, status: 'active' as const }]
const slotList = [
  { id: 10, staff_id: 1, slot_date: '2026-12-01', start_time: '09:00:00', end_time: '10:00:00', status: 'available' as const },
  { id: 11, staff_id: 1, slot_date: '2026-12-01', start_time: '10:00:00', end_time: '11:00:00', status: 'held' as const },
]
const heldReservation = {
  reservation_id: 100,
  service_slot_id: 10,
  customer_id: 1,
  status: 'held' as const,
  hold_expires_at: new Date(Date.now() + 300_000).toISOString(),
  confirmed_at: null,
  remaining_seconds: 300,
}
const confirmedReservation = { ...heldReservation, status: 'confirmed' as const, confirmed_at: new Date().toISOString() }

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}

describe('BookingPage', () => {
  it('fetches and displays staff members', async () => {
    vi.spyOn(staffApi, 'fetchStaff').mockResolvedValue({ data: staffList })
    render(<BookingPage />, { wrapper })
    expect(await screen.findByText('Dr. Smith')).toBeInTheDocument()
  })

  it('fetches slots after staff and date selected', async () => {
    vi.spyOn(staffApi, 'fetchStaff').mockResolvedValue({ data: staffList })
    vi.spyOn(slotApi, 'fetchSlots').mockResolvedValue({ data: slotList })
    render(<BookingPage />, { wrapper })

    fireEvent.click(await screen.findByText('Dr. Smith'))
    await waitFor(() => expect(slotApi.fetchSlots).toHaveBeenCalled())
    expect(await screen.findAllByText(/Reserve Slot/i)).toHaveLength(1)
  })

  it('reserves a slot and shows countdown', async () => {
    vi.spyOn(staffApi, 'fetchStaff').mockResolvedValue({ data: staffList })
    vi.spyOn(slotApi, 'fetchSlots').mockResolvedValue({ data: slotList })
    vi.spyOn(bookingApi, 'reserveSlot').mockResolvedValue({ success: true, message: 'ok', data: heldReservation })
    render(<BookingPage />, { wrapper })

    fireEvent.click(await screen.findByText('Dr. Smith'))
    fireEvent.click(await screen.findByText('Reserve Slot'))

    await waitFor(() => expect(bookingApi.reserveSlot).toHaveBeenCalledWith(10, expect.any(String)))
    expect(await screen.findByTestId('countdown-timer')).toBeInTheDocument()
  })

  it('disables reserve button while reserving', async () => {
    vi.spyOn(staffApi, 'fetchStaff').mockResolvedValue({ data: staffList })
    vi.spyOn(slotApi, 'fetchSlots').mockResolvedValue({ data: slotList })
    let resolve!: (v: unknown) => void
    vi.spyOn(bookingApi, 'reserveSlot').mockReturnValue(new Promise((r) => { resolve = r }))
    render(<BookingPage />, { wrapper })

    fireEvent.click(await screen.findByText('Dr. Smith'))
    const btn = await screen.findByText('Reserve Slot')
    fireEvent.click(btn)
    expect(await screen.findByText('Reserving…')).toBeDisabled()
    resolve({ success: true, message: 'ok', data: heldReservation })
  })

  it('shows conflict error on HTTP 409', async () => {
    vi.spyOn(staffApi, 'fetchStaff').mockResolvedValue({ data: staffList })
    vi.spyOn(slotApi, 'fetchSlots').mockResolvedValue({ data: slotList })
    const err = Object.assign(new Error(), { response: { status: 409, data: { message: 'Slot taken.' } } })
    vi.spyOn(bookingApi, 'reserveSlot').mockRejectedValue(err)
    render(<BookingPage />, { wrapper })

    fireEvent.click(await screen.findByText('Dr. Smith'))
    fireEvent.click(await screen.findByText('Reserve Slot'))

    expect(await screen.findByText(/just taken/i)).toBeInTheDocument()
  })

  it('confirms a reservation', async () => {
    vi.spyOn(staffApi, 'fetchStaff').mockResolvedValue({ data: staffList })
    vi.spyOn(slotApi, 'fetchSlots').mockResolvedValue({ data: slotList })
    vi.spyOn(bookingApi, 'reserveSlot').mockResolvedValue({ success: true, message: 'ok', data: heldReservation })
    vi.spyOn(bookingApi, 'confirmReservation').mockResolvedValue({ success: true, message: 'ok', data: confirmedReservation })
    render(<BookingPage />, { wrapper })

    fireEvent.click(await screen.findByText('Dr. Smith'))
    fireEvent.click(await screen.findByText('Reserve Slot'))
    fireEvent.click(await screen.findByText('Confirm Booking'))

    await waitFor(() => expect(bookingApi.confirmReservation).toHaveBeenCalledWith(100))
    expect(await screen.findByText(/Booking Confirmed/i)).toBeInTheDocument()
  })

  it('prevents duplicate confirm submissions', async () => {
    vi.spyOn(staffApi, 'fetchStaff').mockResolvedValue({ data: staffList })
    vi.spyOn(slotApi, 'fetchSlots').mockResolvedValue({ data: slotList })
    vi.spyOn(bookingApi, 'reserveSlot').mockResolvedValue({ success: true, message: 'ok', data: heldReservation })
    let resolve!: (v: unknown) => void
    vi.spyOn(bookingApi, 'confirmReservation').mockReturnValue(new Promise((r) => { resolve = r }))
    render(<BookingPage />, { wrapper })

    fireEvent.click(await screen.findByText('Dr. Smith'))
    fireEvent.click(await screen.findByText('Reserve Slot'))
    const confirmBtn = await screen.findByText('Confirm Booking')
    fireEvent.click(confirmBtn)
    expect(await screen.findByText('Confirming…')).toBeDisabled()
    resolve({ success: true, message: 'ok', data: confirmedReservation })
  })

  it('shows empty state when no slots available', async () => {
    vi.spyOn(staffApi, 'fetchStaff').mockResolvedValue({ data: staffList })
    vi.spyOn(slotApi, 'fetchSlots').mockResolvedValue({ data: [] })
    render(<BookingPage />, { wrapper })

    fireEvent.click(await screen.findByText('Dr. Smith'))
    expect(await screen.findByText(/No available slots/i)).toBeInTheDocument()
  })

  it('shows error state when slot fetch fails', async () => {
    vi.spyOn(staffApi, 'fetchStaff').mockResolvedValue({ data: staffList })
    vi.spyOn(slotApi, 'fetchSlots').mockRejectedValue(new Error('Network error'))
    render(<BookingPage />, { wrapper })

    fireEvent.click(await screen.findByText('Dr. Smith'))
    expect(await screen.findByText(/Failed to load available slots/i)).toBeInTheDocument()
  })

  it('cancels a reservation and releases slot', async () => {
    vi.spyOn(staffApi, 'fetchStaff').mockResolvedValue({ data: staffList })
    vi.spyOn(slotApi, 'fetchSlots').mockResolvedValue({ data: slotList })
    vi.spyOn(bookingApi, 'reserveSlot').mockResolvedValue({ success: true, message: 'ok', data: heldReservation })
    vi.spyOn(bookingApi, 'cancelReservation').mockResolvedValue({
      success: true,
      message: 'ok',
      data: { ...heldReservation, status: 'cancelled' },
    })
    render(<BookingPage />, { wrapper })

    fireEvent.click(await screen.findByText('Dr. Smith'))
    fireEvent.click(await screen.findByText('Reserve Slot'))
    fireEvent.click(await screen.findByText('Cancel'))

    await waitFor(() => expect(bookingApi.cancelReservation).toHaveBeenCalledWith(100))
    expect(screen.queryByTestId('countdown-timer')).not.toBeInTheDocument()
  })
})

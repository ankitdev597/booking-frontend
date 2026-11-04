import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ReservationCountdown } from '../components/booking/ReservationCountdown'

const baseProps = {
  isConfirming: false,
  isCancelling: false,
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
  onExpired: vi.fn(),
}

describe('ReservationCountdown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('renders countdown timer for held reservation', () => {
    const reservation = {
      reservation_id: 1,
      service_slot_id: 1,
      customer_id: 1,
      status: 'held' as const,
      hold_expires_at: new Date(Date.now() + 300_000).toISOString(),
      confirmed_at: null,
      remaining_seconds: 300,
    }
    render(<ReservationCountdown reservation={reservation} {...baseProps} />)
    expect(screen.getByTestId('countdown-timer')).toHaveTextContent('05:00')
  })

  it('shows confirmed state', () => {
    const reservation = {
      reservation_id: 1,
      service_slot_id: 1,
      customer_id: 1,
      status: 'confirmed' as const,
      hold_expires_at: null,
      confirmed_at: new Date().toISOString(),
      remaining_seconds: 0,
    }
    render(<ReservationCountdown reservation={reservation} {...baseProps} />)
    expect(screen.getByText(/Booking Confirmed/i)).toBeInTheDocument()
  })

  it('shows expired state when hold_expires_at is in the past', () => {
    const reservation = {
      reservation_id: 1,
      service_slot_id: 1,
      customer_id: 1,
      status: 'held' as const,
      hold_expires_at: new Date(Date.now() - 1_000).toISOString(),
      confirmed_at: null,
      remaining_seconds: 0,
    }
    render(<ReservationCountdown reservation={reservation} {...baseProps} />)
    expect(screen.getByText(/Reservation Expired/i)).toBeInTheDocument()
  })

  it('disables confirm button while confirming', () => {
    const reservation = {
      reservation_id: 1,
      service_slot_id: 1,
      customer_id: 1,
      status: 'held' as const,
      hold_expires_at: new Date(Date.now() + 300_000).toISOString(),
      confirmed_at: null,
      remaining_seconds: 300,
    }
    render(<ReservationCountdown reservation={reservation} {...baseProps} isConfirming={true} />)
    expect(screen.getByText('Confirming…')).toBeDisabled()
  })
})

import type { BookingReservation } from '../../types/booking'
import { useEffect } from 'react'
import { useCountdown } from '../../hooks/useCountdown'
import { formatCountdown } from '../../utils/date'

interface Props {
  reservation: BookingReservation
  isConfirming: boolean
  isCancelling: boolean
  onConfirm: () => void
  onCancel: () => void
  onExpired: () => void
}

export function ReservationCountdown({
  reservation,
  isConfirming,
  isCancelling,
  onConfirm,
  onCancel,
  onExpired,
}: Props) {
  const { remaining, isExpired } = useCountdown(reservation.hold_expires_at)

  useEffect(() => {
    if (isExpired && reservation.status === 'held') {
      onExpired()
    }
  }, [isExpired, reservation.status, onExpired])

  if (reservation.status === 'confirmed') {
    return (
      <div className="rounded-xl border-2 border-green-300 bg-green-50 p-5 space-y-2">
        <div className="flex items-center gap-2 text-green-700 font-semibold">
          <span className="text-xl">✓</span>
          <span>Booking Confirmed!</span>
        </div>
        <p className="text-sm text-green-600">
          Your slot has been successfully confirmed.
        </p>
      </div>
    )
  }

  if (reservation.status === 'expired' || (reservation.status === 'held' && isExpired)) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5">
        <p className="text-red-700 font-semibold text-sm">Reservation Expired</p>
        <p className="text-red-500 text-xs mt-1">Please select another slot.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4">
      <div>
        <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Slot Reserved — Confirm within</p>
        <div
          data-testid="countdown-timer"
          className={`text-4xl font-mono font-bold mt-1 ${remaining <= 60 ? 'text-red-600' : 'text-blue-700'}`}
        >
          {formatCountdown(remaining)}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          disabled={isConfirming || isCancelling}
          className="flex-1 bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isConfirming ? 'Confirming…' : 'Confirm Booking'}
        </button>
        <button
          onClick={onCancel}
          disabled={isConfirming || isCancelling}
          className="px-4 py-2.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {isCancelling ? 'Cancelling…' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}

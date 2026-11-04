import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMyBookings } from '../api/bookingApi'
import { cancelReservation } from '../api/bookingApi'
import { formatCountdown, formatTime } from '../utils/date'
import { useCountdown } from '../hooks/useCountdown'
import { Loader } from '../components/common/Loader'
import { ErrorMessage } from '../components/common/ErrorMessage'
import type { BookingReservation } from '../types/booking'

const STATUS_STYLES: Record<string, string> = {
  held:      'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  expired:   'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-500',
}

function CountdownBadge({ expiresAt }: { expiresAt: string }) {
  const { remaining } = useCountdown(expiresAt)
  return (
    <span className={`text-xs font-mono ${remaining <= 60 ? 'text-red-600' : 'text-yellow-700'}`}>
      {formatCountdown(remaining)}
    </span>
  )
}

function ReservationRow({
  reservation,
  onCancel,
  cancelling,
}: {
  reservation: BookingReservation
  onCancel: (id: number) => void
  cancelling: number | null
}) {
  const slot = reservation.slot

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[reservation.status]}`}>
            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
          </span>
          {reservation.status === 'held' && reservation.hold_expires_at && (
            <CountdownBadge expiresAt={reservation.hold_expires_at} />
          )}
        </div>
        {slot ? (
          <p className="text-sm font-medium text-gray-800">
            {slot.slot_date} &nbsp;·&nbsp; {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
          </p>
        ) : (
          <p className="text-sm text-gray-400">Slot details unavailable</p>
        )}
        <p className="text-xs text-gray-400">Reservation #{reservation.reservation_id}</p>
      </div>

      {reservation.status === 'held' && (
        <button
          onClick={() => onCancel(reservation.reservation_id)}
          disabled={cancelling === reservation.reservation_id}
          className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          {cancelling === reservation.reservation_id ? 'Cancelling…' : 'Cancel'}
        </button>
      )}
    </div>
  )
}

export function MyBookingsPage() {
  const [page, setPage] = useState(1)
  const [cancelling, setCancelling] = useState<number | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-bookings', page],
    queryFn: () => getMyBookings(page),
    staleTime: 15_000,
  })

  const handleCancel = async (id: number) => {
    setCancelling(id)
    setCancelError(null)
    try {
      await cancelReservation(id)
      refetch()
    } catch {
      setCancelError('Failed to cancel reservation. Please try again.')
    } finally {
      setCancelling(null)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">My Bookings</h2>

      {cancelError && <ErrorMessage message={cancelError} onDismiss={() => setCancelError(null)} />}

      {isLoading && <Loader text="Loading your bookings…" />}
      {isError && <ErrorMessage message="Failed to load your bookings." />}

      {data && data.data.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-10">You have no bookings yet.</p>
      )}

      {data && data.data.map((r) => (
        <ReservationRow
          key={r.reservation_id}
          reservation={r}
          onCancel={handleCancel}
          cancelling={cancelling}
        />
      ))}

      {data && data.meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-500">
            Page {data.meta.current_page} of {data.meta.last_page}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.meta.last_page, p + 1))}
            disabled={page === data.meta.last_page}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

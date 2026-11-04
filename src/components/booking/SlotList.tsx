import type { ServiceSlot } from '../../types/booking'
import { SlotCard } from './SlotCard'
import { SlotSkeleton } from '../common/Loader'
import { ErrorMessage } from '../common/ErrorMessage'

interface Props {
  slots: ServiceSlot[] | undefined
  isLoading: boolean
  isError: boolean
  isReserving: boolean
  onReserve: (slotId: number) => void
}

export function SlotList({ slots, isLoading, isError, isReserving, onReserve }: Props) {
  if (isLoading) return <SlotSkeleton />
  if (isError) return <ErrorMessage message="Failed to load available slots." />
  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        No available slots for this date.
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Available Slots</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            isReserving={isReserving}
            onReserve={onReserve}
          />
        ))}
      </div>
    </div>
  )
}

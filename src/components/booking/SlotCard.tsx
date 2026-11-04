import type { ServiceSlot } from '../../types/booking'
import { formatTime } from '../../utils/date'

interface Props {
  slot: ServiceSlot
  isReserving: boolean
  onReserve: (slotId: number) => void
}

export function SlotCard({ slot, isReserving, onReserve }: Props) {
  const available = slot.status === 'available'

  return (
    <div
      className={`rounded-lg border-2 p-3 flex flex-col gap-2 transition-colors ${
        available
          ? 'border-green-200 bg-green-50'
          : slot.status === 'held'
          ? 'border-yellow-200 bg-yellow-50'
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="text-sm font-medium text-gray-800">
        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
      </div>
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
          available
            ? 'bg-green-100 text-green-700'
            : slot.status === 'held'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {available ? 'Available' : slot.status === 'held' ? 'Held' : 'Confirmed'}
      </span>
      {available && (
        <button
          onClick={() => onReserve(slot.id)}
          disabled={isReserving}
          className="mt-1 text-xs bg-blue-600 text-white rounded-md px-3 py-1.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isReserving ? 'Reserving…' : 'Reserve Slot'}
        </button>
      )}
    </div>
  )
}

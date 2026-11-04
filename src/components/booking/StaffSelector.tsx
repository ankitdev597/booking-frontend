import { useQuery } from '@tanstack/react-query'
import { fetchStaff } from '../../api/staffApi'
import type { Staff } from '../../types/booking'
import { Loader } from '../common/Loader'
import { ErrorMessage } from '../common/ErrorMessage'

interface Props {
  selectedId: number | null
  onSelect: (staff: Staff) => void
}

export function StaffSelector({ selectedId, onSelect }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['staff'],
    queryFn: fetchStaff,
    staleTime: 60_000,
  })

  if (isLoading) return <Loader text="Loading staff…" />
  if (isError) return <ErrorMessage message="Failed to load staff members." />

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Select a Service Provider</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data?.data.map((staff) => (
          <button
            key={staff.id}
            onClick={() => onSelect(staff)}
            className={`text-left px-4 py-3 rounded-lg border-2 transition-colors ${
              selectedId === staff.id
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-200 hover:border-blue-300 bg-white'
            }`}
          >
            <p className="font-medium text-sm">{staff.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{staff.email}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

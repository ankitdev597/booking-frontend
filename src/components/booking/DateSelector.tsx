import { todayString } from '../../utils/date'

interface Props {
  value: string | null
  onChange: (date: string) => void
}

export function DateSelector({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Select a Date</h2>
      <input
        type="date"
        min={todayString()}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 w-full sm:w-auto"
      />
    </div>
  )
}

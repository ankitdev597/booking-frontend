interface Props {
  message: string
  onDismiss?: () => void
}

export function ErrorMessage({ message, onDismiss }: Props) {
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600 font-bold leading-none">
          ×
        </button>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { StaffSelector } from '../components/booking/StaffSelector'
import { DateSelector } from '../components/booking/DateSelector'
import { SlotList } from '../components/booking/SlotList'
import { ReservationCountdown } from '../components/booking/ReservationCountdown'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { useAvailableSlots } from '../hooks/useAvailableSlots'
import { useReservation } from '../hooks/useReservation'
import { MyBookingsPage } from './MyBookingsPage'
import type { Staff } from '../types/booking'
import { todayString } from '../utils/date'

type Tab = 'book' | 'my-bookings'

export function BookingPage() {
  const { customer, logout } = useAuth()
  const [tab, setTab] = useState<Tab>('book')
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(todayString())

  const { data: slots, isLoading, isError } = useAvailableSlots(
    selectedStaff?.id ?? null,
    selectedDate
  )

  const {
    reservation,
    isReserving,
    isConfirming,
    isCancelling,
    error,
    conflictError,
    reserve,
    confirm,
    cancel,
    clearReservation,
  } = useReservation(selectedStaff?.id ?? null, selectedDate)

  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff)
    clearReservation()
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    clearReservation()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-gray-900">Book a Service</h1>
            <nav className="flex gap-1">
              <button
                onClick={() => setTab('book')}
                className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  tab === 'book' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Book
              </button>
              <button
                onClick={() => setTab('my-bookings')}
                className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  tab === 'my-bookings' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                My Bookings
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{customer?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {tab === 'my-bookings' ? (
          <MyBookingsPage />
        ) : (
          <>
        {/* Step 1 — Staff */}
        <StaffSelector selectedId={selectedStaff?.id ?? null} onSelect={handleStaffSelect} />

        {/* Step 2 — Date */}
        {selectedStaff && (
          <DateSelector value={selectedDate} onChange={handleDateChange} />
        )}

        {/* Error banner */}
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={conflictError ? clearReservation : undefined}
          />
        )}

        {/* Active reservation panel */}
        {reservation && (
          <ReservationCountdown
            reservation={reservation}
            isConfirming={isConfirming}
            isCancelling={isCancelling}
            onConfirm={confirm}
            onCancel={cancel}
            onExpired={clearReservation}
          />
        )}

        {/* Step 3 — Slots (hide when confirmed) */}
        {selectedStaff && selectedDate && reservation?.status !== 'confirmed' && (
          <SlotList
            slots={slots}
            isLoading={isLoading}
            isError={isError}
            isReserving={isReserving}
            onReserve={reserve}
          />
        )}
          </>
        )}
      </main>
    </div>
  )
}

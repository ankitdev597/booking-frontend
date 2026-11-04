import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { reserveSlot, confirmReservation, cancelReservation } from '../api/bookingApi'
import { generateIdempotencyKey } from '../utils/date'
import { extractErrorMessage, isConflictError } from '../utils/errorHandler'
import type { BookingReservation } from '../types/booking'

interface ReservationState {
  reservation: BookingReservation | null
  isReserving: boolean
  isConfirming: boolean
  isCancelling: boolean
  error: string | null
  conflictError: boolean
}

const initial: ReservationState = {
  reservation: null,
  isReserving: false,
  isConfirming: false,
  isCancelling: false,
  error: null,
  conflictError: false,
}

export function useReservation(staffId: number | null, date: string | null) {
  const queryClient = useQueryClient()
  const [state, setState] = useState<ReservationState>(initial)

  const invalidateSlots = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['slots', staffId, date] })
  }, [queryClient, staffId, date])

  const reserve = useCallback(
    async (slotId: number) => {
      setState((s) => ({ ...s, isReserving: true, error: null, conflictError: false }))
      const key = generateIdempotencyKey()
      try {
        const res = await reserveSlot(slotId, key)
        setState((s) => ({ ...s, reservation: res.data, isReserving: false }))
        invalidateSlots()
      } catch (err) {
        const conflict = isConflictError(err)
        setState((s) => ({
          ...s,
          isReserving: false,
          conflictError: conflict,
          error: conflict ? 'This slot was just taken. Please choose another.' : extractErrorMessage(err),
        }))
        if (conflict) invalidateSlots()
      }
    },
    [invalidateSlots]
  )

  const confirm = useCallback(async () => {
    if (!state.reservation) return
    setState((s) => ({ ...s, isConfirming: true, error: null }))
    try {
      const res = await confirmReservation(state.reservation.reservation_id)
      setState((s) => ({ ...s, reservation: res.data, isConfirming: false }))
      invalidateSlots()
    } catch (err) {
      setState((s) => ({
        ...s,
        isConfirming: false,
        error: extractErrorMessage(err, 'Confirmation failed.'),
      }))
    }
  }, [state.reservation, invalidateSlots])

  const cancel = useCallback(async () => {
    if (!state.reservation) return
    setState((s) => ({ ...s, isCancelling: true, error: null }))
    try {
      await cancelReservation(state.reservation.reservation_id)
      setState({ ...initial })
      invalidateSlots()
    } catch (err) {
      setState((s) => ({
        ...s,
        isCancelling: false,
        error: extractErrorMessage(err, 'Cancellation failed.'),
      }))
    }
  }, [state.reservation, invalidateSlots])

  const clearReservation = useCallback(() => {
    setState({ ...initial })
    invalidateSlots()
  }, [invalidateSlots])

  return { ...state, reserve, confirm, cancel, clearReservation }
}

import { useQuery } from '@tanstack/react-query'
import { fetchSlots } from '../api/slotApi'
import type { ServiceSlot } from '../types/booking'

export function useAvailableSlots(staffId: number | null, date: string | null) {
  return useQuery<ServiceSlot[]>({
    queryKey: ['slots', staffId, date],
    queryFn: async () => {
      const res = await fetchSlots(staffId!, date!)
      return res.data
    },
    enabled: staffId !== null && date !== null,
    staleTime: 10_000,
    refetchInterval: 30_000,
  })
}

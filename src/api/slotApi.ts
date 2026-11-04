import api from './axios'
import type { ApiListResponse, ServiceSlot } from '../types/booking'

export const fetchSlots = (staffId: number, date: string): Promise<ApiListResponse<ServiceSlot>> =>
  api
    .get<ApiListResponse<ServiceSlot>>('/slots', { params: { staff_id: staffId, date } })
    .then((r) => r.data)

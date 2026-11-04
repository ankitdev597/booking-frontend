import api from './axios'
import type { ApiListResponse, Staff } from '../types/booking'

export const fetchStaff = (): Promise<ApiListResponse<Staff>> =>
  api.get<ApiListResponse<Staff>>('/staff').then((r) => r.data)

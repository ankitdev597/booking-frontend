import api from './axios'
import type { AuthResponse } from '../types/booking'

export const login = (email: string, password: string): Promise<AuthResponse> =>
  api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data)

export const register = (
  name: string,
  email: string,
  password: string,
  password_confirmation: string
): Promise<AuthResponse> =>
  api
    .post<AuthResponse>('/auth/register', { name, email, password, password_confirmation })
    .then((r) => r.data)

export const logout = (): Promise<void> =>
  api.post('/auth/logout').then(() => undefined)

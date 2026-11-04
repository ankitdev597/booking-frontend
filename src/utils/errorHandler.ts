import type { AxiosError } from 'axios'
import type { ApiError } from '../types/booking'

export function extractErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  const axiosError = error as AxiosError<ApiError>
  return axiosError.response?.data?.message ?? fallback
}

export function extractValidationErrors(error: unknown): Record<string, string[]> {
  const axiosError = error as AxiosError<ApiError>
  return axiosError.response?.data?.errors ?? {}
}

export function isConflictError(error: unknown): boolean {
  return (error as AxiosError)?.response?.status === 409
}

export function isValidationError(error: unknown): boolean {
  return (error as AxiosError)?.response?.status === 422
}

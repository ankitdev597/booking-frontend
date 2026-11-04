import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useCountdown } from '../hooks/useCountdown'

describe('useCountdown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('returns 0 when expiresAt is null', () => {
    const { result } = renderHook(() => useCountdown(null))
    expect(result.current.remaining).toBe(0)
    expect(result.current.isExpired).toBe(true)
  })

  it('returns positive remaining seconds for a future timestamp', () => {
    const expiresAt = new Date(Date.now() + 300_000).toISOString()
    const { result } = renderHook(() => useCountdown(expiresAt))
    expect(result.current.remaining).toBeGreaterThan(295)
    expect(result.current.isExpired).toBe(false)
  })

  it('counts down each second', () => {
    const expiresAt = new Date(Date.now() + 5_000).toISOString()
    const { result } = renderHook(() => useCountdown(expiresAt))
    expect(result.current.remaining).toBe(5)

    act(() => { vi.advanceTimersByTime(1_000) })
    expect(result.current.remaining).toBe(4)

    act(() => { vi.advanceTimersByTime(1_000) })
    expect(result.current.remaining).toBe(3)
  })

  it('marks isExpired when countdown reaches zero', () => {
    const expiresAt = new Date(Date.now() + 2_000).toISOString()
    const { result } = renderHook(() => useCountdown(expiresAt))

    act(() => { vi.advanceTimersByTime(3_000) })
    expect(result.current.remaining).toBe(0)
    expect(result.current.isExpired).toBe(true)
  })

  it('clears interval on unmount — no memory leak', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    const expiresAt = new Date(Date.now() + 60_000).toISOString()
    const { unmount } = renderHook(() => useCountdown(expiresAt))
    unmount()
    expect(clearSpy).toHaveBeenCalled()
  })

  it('resets when expiresAt changes', () => {
    const first = new Date(Date.now() + 10_000).toISOString()
    const { result, rerender } = renderHook(({ exp }) => useCountdown(exp), {
      initialProps: { exp: first },
    })
    expect(result.current.remaining).toBe(10)

    const second = new Date(Date.now() + 30_000).toISOString()
    rerender({ exp: second })
    expect(result.current.remaining).toBe(30)
  })
})

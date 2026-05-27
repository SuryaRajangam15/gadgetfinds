import { useState, useCallback } from 'react'

let _fn = null
export const setToastFn = fn => { _fn = fn }
export const toast = (msg, type = '') => _fn?.(msg, type)

export function useToastState() {
  const [toasts, set] = useState([])
  const add = useCallback((msg, type = '') => {
    const id = Date.now() + Math.random()
    set(t => [...t, { id, msg, type }])
    setTimeout(() => set(t => t.filter(x => x.id !== id)), 3200)
  }, [])
  return { toasts, add }
}

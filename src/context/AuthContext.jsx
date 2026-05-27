import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  // 5-click logo secret — exposed via context so Navbar can use it
  const logoClicks = useRef(0)
  const logoTimer  = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const isAdmin = user?.user_metadata?.role === 'admin'

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  }

  async function signOut() { await supabase.auth.signOut() }

  // Called by Navbar on every logo click
  function handleLogoClick(openLoginModal) {
    if (isAdmin) return          // already admin — do nothing special
    logoClicks.current++
    clearTimeout(logoTimer.current)
    if (logoClicks.current >= 5) {
      logoClicks.current = 0
      openLoginModal()           // fire the callback passed from Navbar
    }
    logoTimer.current = setTimeout(() => { logoClicks.current = 0 }, 1500)
  }

  return (
    <Ctx.Provider value={{ user, loading, isAdmin, signIn, signOut, handleLogoClick }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)

import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from '../hooks/useToast'

export default function Login() {
  const { signIn, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]     = useState('')
  const [pass, setPass]       = useState('')
  const [error, setError]     = useState('')
  const [busy, setBusy]       = useState(false)

  if (isAdmin) return <Navigate to="/admin" replace/>

  async function submit(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const user = await signIn(email, pass)
      if (user?.user_metadata?.role !== 'admin') {
        await supabase.auth.signOut()
        setError('This account does not have admin access.')
        setBusy(false); return
      }
      toast('Welcome back, Surya! 👋', 'success')
      navigate('/admin')
    } catch(err) {
      setError(err.message||'Incorrect email or password.')
    }
    setBusy(false)
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:20}}>
      <div style={{background:'var(--surface)',borderRadius:'var(--r-xl)',padding:40,width:'100%',maxWidth:400,boxShadow:'var(--sh-xl)'}}>
        <div className="modal-icon">🔐</div>
        <h2 style={{fontSize:22,fontWeight:800,textAlign:'center',marginBottom:6}}>Admin Login</h2>
        <p style={{fontSize:14,color:'var(--muted)',textAlign:'center',marginBottom:28}}>Sign in with your Supabase admin account</p>
        {error && <div className="modal-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="admin@youremail.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Your password" value={pass} onChange={e=>setPass(e.target.value)} required/>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={busy}>
            {busy?'Logging in…':'Login →'}
          </button>
        </form>
      </div>
    </div>
  )
}

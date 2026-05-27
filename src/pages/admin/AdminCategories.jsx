import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { toast } from '../../hooks/useToast'

export default function AdminCategories() {
  const [cats, setCats]   = useState([])
  const [name, setName]   = useState('')
  const [icon, setIcon]   = useState('')
  const [editId, setEdit] = useState(null)
  const [error, setErr]   = useState('')
  const [busy, setBusy]   = useState(false)

  async function load() {
    const {data} = await supabase.from('categories').select('*,products(count)').order('name')
    setCats(data||[])
  }
  useEffect(()=>{ load() },[])

  async function save() {
    if (!name.trim()) { setErr('Category name required'); return }
    setErr(''); setBusy(true)
    const payload = { name:name.trim(), icon:icon.trim()||'📦' }
    if (editId) {
      const {error:e} = await supabase.from('categories').update(payload).eq('id',editId)
      if (e) toast('Failed to update','error'); else toast('Category updated!','success')
    } else {
      const {error:e} = await supabase.from('categories').insert(payload)
      if (e) toast('Failed to add','error'); else toast('Category added!','success')
    }
    setName(''); setIcon(''); setEdit(null); setBusy(false); load()
  }

  async function del(id) {
    if (!confirm('Delete this category?')) return
    await supabase.from('products').update({category_id:null}).eq('category_id',id)
    await supabase.from('categories').delete().eq('id',id)
    toast('Category deleted'); load()
  }

  function edit(c) { setName(c.name); setIcon(c.icon||''); setEdit(c.id) }

  return (
    <div
  className="admin-mobile-stack"
  style={{
    display:'grid',
    gridTemplateColumns:'1fr 1.1fr',
    gap:32,
    alignItems:'start'
  }}
>
      <div className="form-wrap">
        <div className="form-title">{editId?'✏️ Edit Category':'📂 Add New Category'}</div>
        <div className="form-group">
          <label className="form-label">Category Name *</label>
          <input className={'form-input'+(error?' error':'')} placeholder="e.g. Smart Home Gadgets" value={name} onChange={e=>setName(e.target.value)}/>
          {error && <div className="form-error">{error}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Emoji Icon</label>
          <input className="form-input" placeholder="e.g. 🏠" maxLength={4} style={{width:80}} value={icon} onChange={e=>setIcon(e.target.value)}/>
          <div className="form-hint">One emoji to represent this category</div>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-primary" style={{flex:1,justifyContent:'center'}} onClick={save} disabled={busy}>{busy?'Saving…':'Save Category'}</button>
          {editId && <button className="btn btn-ghost btn-sm" onClick={()=>{setName('');setIcon('');setEdit(null);setErr('')}}>Cancel</button>}
        </div>
      </div>

      <div className="admin-list">
        <div className="admin-list-head"><h3>All Categories ({cats.length})</h3></div>
        {cats.length===0
          ? <div style={{padding:40,textAlign:'center',color:'var(--muted)'}}>No categories yet.</div>
          : cats.map(c=>{
              const cnt = c.products?.[0]?.count||0
              return (
                <div key={c.id} className="admin-list-item">
                  <div className="admin-item-img">{c.icon||'📦'}</div>
                  <div className="admin-item-info">
                    <div className="admin-item-name">{c.name}</div>
                    <div className="admin-item-meta">{cnt} product{cnt!==1?'s':''}</div>
                  </div>
                  <div className="admin-item-actions">
                    <button className="btn btn-ghost btn-sm" onClick={()=>edit(c)}>✏️</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>del(c.id)}>🗑️</button>
                  </div>
                </div>
              )
            })}
      </div>
    </div>
  )
}

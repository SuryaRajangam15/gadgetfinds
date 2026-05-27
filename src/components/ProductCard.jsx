import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProductCard({ product, categoryName }) {
  const navigate = useNavigate()
  const img = product.image_urls?.[0]

  async function handleBuy(e) {
    e.stopPropagation()
    await supabase.from('clicks').insert({ product_id: product.id })
    window.open(product.affiliate_link || 'https://amazon.in', '_blank')
  }

  return (
    <div className="prod-card" onClick={() => navigate('/products/' + product.id)}>
      <div className="prod-card-img">
                {img ? <img
          src={img}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />
             : <div className="prod-card-img-placeholder">🛍️</div>}
      </div>
      <div className="prod-card-body">
        {categoryName && <div className="prod-cat-tag">{categoryName}</div>}
        <div className="prod-card-title">{product.name}</div>
        <div className="prod-card-desc">{product.description}</div>
        <div className="prod-card-footer">
          <button className="btn btn-outline" onClick={e=>{e.stopPropagation();navigate('/products/'+product.id)}}>Details</button>
          <button className="btn btn-orange" onClick={handleBuy}>🛒 Buy</button>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Footer from '../components/footer/HomeFooter'

export default function ProductDetail() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [p, setP]             = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setL]       = useState(true)

  const [img, setImg] = useState(0)

  /* IMAGE PREVIEW */
  const [previewImage, setPreviewImage] =
    useState(null)

  useEffect(() => {

    supabase
      .from('products')
      .select('*,categories(id,name,icon)')
      .eq('id',id)
      .single()

      .then(async ({data,error}) => {

        if (error || !data) {

          navigate('/products')

          return
        }

        setP(data)

        if (data.category_id) {

          const {data:rel} =
            await supabase
              .from('products')
              .select('*')
              .eq('category_id',data.category_id)
              .neq('id',id)
              .limit(4)

          setRelated(rel || [])
        }

        setL(false)

      })

  }, [id])

  async function buy() {

    await supabase
      .from('clicks')
      .insert({
        product_id:p.id
      })

    window.open(
      p.affiliate_link || 'https://amazon.in',
      '_blank'
    )

  }

  if (loading) {

    return (
      <div
        style={{
          minHeight:'80vh',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          color:'var(--muted)'
        }}
      >
        Loading…
      </div>
    )
  }

  if (!p) return null

  const imgs = p.image_urls || []

  return (

    <>

      <div
        style={{
          paddingTop:100,
          paddingBottom:80
        }}
      >

        <div className="container">

          {/* BREADCRUMB */}
          <div
            style={{
              display:'flex',
              gap:6,
              fontSize:13,
              color:'var(--muted)',
              marginBottom:32,
              flexWrap:'wrap'
            }}
          >

            <Link
              to="/"
              style={{color:'var(--accent)'}}
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to="/products"
              style={{color:'var(--accent)'}}
            >
              Products
            </Link>

            <span>/</span>

            <span
              style={{
                color:'var(--text)',
                fontWeight:600
              }}
            >
              {p.name}
            </span>

          </div>

          {/* MAIN */}
          <div
            style={{
              display:'grid',
              gridTemplateColumns:'1fr 1.1fr',
              gap:56,
              marginBottom:72
            }}
          >

            {/* LEFT */}
            <div>

              {/* MAIN IMAGE */}
              <div className="detail-gallery-main">

                {imgs[img] ? (

                  <img
                    src={imgs[img]}
                    alt={p.name}
                    onClick={() =>
                      setPreviewImage(imgs[img])
                    }
                    style={{
                      cursor:'zoom-in'
                    }}
                  />

                ) : (

                  <div
                    style={{
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      height:'100%',
                      minHeight:360,
                      fontSize:80
                    }}
                  >
                    🛍️
                  </div>

                )}

              </div>

              {/* THUMBS */}
              {imgs.length > 1 && (

                <div className="detail-gallery-thumbs">

                  {imgs.map((s,i)=>(

                    <div
                      key={i}
                      className={
                        'detail-gallery-thumb' +
                        (img===i ? ' active':'')
                      }
                      onClick={() => setImg(i)}
                    >

                      <img
  src={s}
  alt=""
  style={{
    cursor:'pointer'
  }}
/>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* RIGHT */}
            <div>

              {p.categories && (

                <span
                  style={{
                    fontSize:11,
                    fontWeight:700,
                    color:'var(--accent)',
                    textTransform:'uppercase',
                    letterSpacing:'.04em',
                    display:'block',
                    marginBottom:14
                  }}
                >
                  {p.categories.name}
                </span>

              )}

              <h1
                style={{
                  fontSize:'clamp(22px,3.5vw,34px)',
                  fontWeight:800,
                  marginBottom:20,
                  lineHeight:1.2
                }}
              >
                {p.name}
              </h1>

              <p
                style={{
                  fontSize:16,
                  color:'var(--text2)',
                  lineHeight:1.8,
                  marginBottom:28
                }}
              >
                {p.description}
              </p>

              <div
                style={{
                  background:'var(--surface2)',
                  border:'1px solid var(--border)',
                  borderRadius:'var(--r)',
                  padding:'18px 20px',
                  marginBottom:28,
                  display:'flex',
                  gap:20,
                  flexWrap:'wrap'
                }}
              >

                {[
                  '🛡️ Genuine Amazon product',
                  '🚚 Prime eligible',
                  '↩️ Easy returns'
                ].map(t=>(

                  <span
                    key={t}
                    style={{
                      fontSize:14,
                      color:'var(--text2)'
                    }}
                  >
                    {t}
                  </span>

                ))}

              </div>

              <div
                style={{
                  display:'flex',
                  flexDirection:'column',
                  gap:12
                }}
              >

                <button
                  onClick={buy}
                  className="btn btn-orange btn-lg"
                  style={{
                    width:'100%',
                    justifyContent:'center',
                    borderRadius:16,
                    fontSize:17,
                    fontWeight:700,
                    background:'linear-gradient(135deg,#f97316,#ef4444)',
                    boxShadow:'0 4px 20px rgba(249,115,22,.4)'
                  }}
                >
                  🛒 Buy on Amazon →
                </button>

                <p
                  style={{
                    fontSize:12,
                    color:'var(--muted)',
                    textAlign:'center',
                    padding:'10px 14px',
                    background:'#fffbf5',
                    border:'1px solid #fed7aa',
                    borderRadius:10,
                    lineHeight:1.6
                  }}
                >
                  🔗 Affiliate link — small commission at no extra cost to you.
                </p>

                <button
                  className="btn btn-ghost"
                  style={{
                    width:'100%',
                    justifyContent:'center'
                  }}
                  onClick={() =>
                    navigate('/products')
                  }
                >
                  ← More Gadgets
                </button>

              </div>

            </div>

          </div>

          {/* RELATED */}
          {related.length > 0 && (

            <div
              style={{
                borderTop:'1px solid var(--border)',
                paddingTop:60
              }}
            >

              <div className="section-label">
                🔗 Related
              </div>

              <h2
                className="section-title"
                style={{marginBottom:28}}
              >
                You May Also Like
              </h2>

              <div className="products-grid">

                {related.map(r=>(

                  <div
                    key={r.id}
                    className="prod-card"
                    onClick={() =>
                      navigate('/products/'+r.id)
                    }
                  >

                    <div className="prod-card-img">

                      {r.image_urls?.[0] ? (

                        <img
                          src={r.image_urls[0]}
                          alt={r.name}
                          loading="lazy"
                        />

                      ) : (

                        <div className="prod-card-img-placeholder">
                          🛍️
                        </div>

                      )}

                    </div>

                    <div className="prod-card-body">

                      <div className="prod-card-title">
                        {r.name}
                      </div>

                      <div className="prod-card-desc">
                        {r.description}
                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (

        <div
          className="image-preview-overlay"
          onClick={() =>
            setPreviewImage(null)
          }
        >

         {/* PREV BUTTON */}
{img > 0 && (

  <button
    className="preview-nav-btn left"
    onClick={(e) => {

      e.stopPropagation()

      const prev = img - 1

      setImg(prev)

      setPreviewImage(imgs[prev])

    }}
  >
    <span>❮</span>
  </button>

)}

{/* IMAGE */}
<img
  src={previewImage}
  alt=""
  className="image-preview-full"
  onClick={(e) =>
    e.stopPropagation()
  }
/>

{/* NEXT BUTTON */}
{img < imgs.length - 1 && (

  <button
    className="preview-nav-btn right"
    onClick={(e) => {

      e.stopPropagation()

      const next = img + 1

      setImg(next)

      setPreviewImage(imgs[next])

    }}
  >
    <span>❯</span>
  </button>

)}
        </div>

      )}

      <Footer/>

    </>

  )
}
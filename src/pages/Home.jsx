import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard";
import HomeFooter from "../components/footer/HomeFooter";
import { productMemoryCache } from "../utils/productMemoryCache";

const MOBILE_CARDS = [
  {
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=85",
    name: "Smart Tech Gadgets",
    tag: "🎧 Tech",
  },
  {
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85",
    name: "Home Utility Finds",
    tag: "🏠 Utility",
  },
  {
    img: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&q=85",
    name: "Ambient Lighting",
    tag: "💡 Decor",
  },
  {
    img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=85",
    name: "Desk Setup",
    tag: "🖥️ Desk",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState([]);
  const [totalClicks, setClicks] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        // INSTANT MEMORY CACHE
        if (productMemoryCache.homeProducts) {
          setProducts(productMemoryCache.homeProducts);

          setCats(productMemoryCache.categories || []);

          setStats(
            productMemoryCache.stats || {
              products: 0,
              categories: 0,
            },
          );

          setLoading(false);

          return;
        }

        // FETCH DATA
        const [productsRes, categoriesRes, clicksRes, productsCountRes] =
          await Promise.all([
            supabase
              .from("products")
              .select(
                `
            *,
            categories(
              id,
              name,
              icon
            )
          `,
              )
              .order("created_at", { ascending: false })
              .limit(4),

            supabase.from("categories").select("id,name,icon").order("name"),

            supabase.from("clicks").select("id", {
              count: "exact",
              head: true,
            }),

            supabase.from("products").select("id", {
              count: "exact",
            }),
          ]);

        const freshProducts = productsRes.data || [];

        const freshCategories = categoriesRes.data || [];

        const freshStats = {
          products: productsCountRes.count || 0,

          categories: freshCategories.length || 0,
        };

        // UPDATE UI
        setProducts(freshProducts);

        setCats(freshCategories);

        setClicks(clicksRes.count || 0);

        setStats(freshStats);

        // MEMORY CACHE
        productMemoryCache.homeProducts = freshProducts;

        productMemoryCache.categories = freshCategories;

        productMemoryCache.stats = freshStats;
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Update dot on scroll
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const handler = () => {
      const idx = Math.round(el.scrollLeft / 182);
      setActiveDot(Math.min(idx, MOBILE_CARDS.length - 1));
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  function scrollToCard(i) {
    carouselRef.current?.scrollTo({ left: i * 182, behavior: "smooth" });
    setActiveDot(i);
  }

  return (
    <>
      <section className="hero">
        <div className="hero-dots" />
        <div className="container">
          <div className="hero-inner">
            <div>
              <div className="hero-eyebrow">
                <span className="hero-dot" />
                Curated by Surya • Updated Weekly
              </div>
              <h1 className="hero-h1">
                Budget Gadgets &amp;
                <br />
                <em>Smart Home</em> Finds
                <br />
                You'll Love
              </h1>
              <p className="hero-sub">
                Hand-picked trending gadgets from trusted stores — smart home,
                desk setups, and viral finds at prices that make sense.
              </p>
              <div className="hero-btns">
                <Link to="/products" className="btn btn-primary btn-xl">
                  🛍️ Explore Gadgets
                </Link>
                <button
                  className="btn btn-ghost btn-xl"
                  onClick={() =>
                    window.open(
                      "https://pinterest.com/budgettechsurya",
                      "_blank",
                    )
                  }
                >
                  📌 See Pinterest
                </button>
              </div>
              <div className="hero-proof">
                <div className="hero-avatars">
                  {["😊", "🙂", "😄", "🤩"].map((e, i) => (
                    <div key={i} className="hero-avatar">
                      {e}
                    </div>
                  ))}
                </div>
                <div className="proof-text">
                  <strong>10,000+ monthly views</strong> on Pinterest
                  <br />
                  trust Surya's picks every week
                </div>
              </div>
            </div>

            {/* Desktop floating cards */}
            <div className="hero-right-col desktop-only">
              <div className="hero-cards">
                <div className="hcard hcard-big1">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
                    alt="Smart Tech"
                    onError={(e) =>
                      (e.target.src =
                        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80")
                    }
                  />
                  <div className="hcard-body">
                    <div className="hcard-name">Smart Tech Gadgets</div>
                    <div className="hcard-tag-pill">🎧 Tech</div>
                  </div>
                </div>
                <div className="hcard hcard-s1">
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"
                    alt="Home Utility"
                    onError={(e) =>
                      (e.target.src =
                        "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=400&q=80")
                    }
                  />
                  <div className="hcard-body">
                    <div className="hcard-name">Home Utility</div>
                    <div className="hcard-tag-pill">🏠 Utility</div>
                  </div>
                </div>
                <div className="hcard hcard-s2">
                  <img
                    src="https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80"
                    alt="Lighting"
                    onError={(e) =>
                      (e.target.src =
                        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80")
                    }
                  />
                  <div className="hcard-body">
                    <div className="hcard-name">Ambient Lighting</div>
                    <div className="hcard-tag-pill">💡 Decor</div>
                  </div>
                </div>
                <div className="hcard hcard-big2">
                  <img
                    src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80"
                    alt="Desk Setup"
                    onError={(e) =>
                      (e.target.src =
                        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80")
                    }
                  />
                  <div className="hcard-body">
                    <div className="hcard-name">Desk Setup</div>
                    <div className="hcard-tag-pill">🖥️ Desk</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            className="section-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div className="section-label">🔥 Trending Now</div>
              <h2 className="section-title">Featured Gadgets</h2>
              <p className="section-sub">
                Surya's top picks this week — viral on Pinterest.
              </p>
            </div>
            <Link to="/products" className="btn btn-outline">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    height: "320px",
                    borderRadius: "24px",
                  }}
                  className="skeleton-card"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  categoryName={p.categories?.name}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>

              <h3>No products yet</h3>

              <p>Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <div className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            <div>
              <div className="stat-num">{stats.products}</div>
              <div className="stat-label">Products Listed</div>
            </div>
            <div>
              <div className="stat-num">{cats.length}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div>
              <div className="stat-num">{totalClicks.toLocaleString()}</div>
              <div className="stat-label">Product Clicks</div>
            </div>
            <div>
              <div className="stat-num">10K+</div>
              <div className="stat-label">Pinterest Monthly Views</div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: "var(--surface2)" }}>
        <div className="container">
          <div
            className="section-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 36,
            }}
          >
            <div>
              <div className="section-label">📂 Browse</div>

              <h2 className="section-title">Shop by Category</h2>

              <p className="section-sub">
                Find exactly what you're looking for.
              </p>
            </div>

            <Link to="/categories" className="btn btn-outline">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="cat-grid">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="skeleton-card"
                  style={{
                    height: "140px",
                    borderRadius: "24px",
                  }}
                />
              ))}
            </div>
          ) : cats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📂</div>

              <h3>No categories yet</h3>
            </div>
          ) : (
            <div className="cat-grid">
              {cats.slice(0, 10).map((c) => (
                <div
                  key={c.id}
                  className="cat-card"
                  onClick={() => navigate("/categories")}
                >
                  <div className="cat-icon-wrap">{c.icon || "📦"}</div>

                  <div className="cat-name">{c.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          padding: "52px 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <div style={{ fontSize: 48, marginBottom: 14 }}>📌</div>
          <h2
            style={{
              fontSize: "clamp(20px,3vw,30px)",
              fontWeight: 800,
              marginBottom: 10,
            }}
          >
            Follow Surya on Pinterest
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 17, marginBottom: 28 }}>
            Daily gadget drops, viral finds & smart deals.
          </p>
          <button
            className="btn btn-lg"
            style={{
              background: "#e60023",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(230,0,35,.3)",
            }}
            onClick={() =>
              window.open("https://pinterest.com/budgettechsurya", "_blank")
            }
          >
            📌 Follow @budgettechsurya
          </button>
        </div>
      </div>

      <HomeFooter />
    </>
  );
}

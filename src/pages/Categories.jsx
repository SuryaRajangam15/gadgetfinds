import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard";
import CategoryFooter from "../components/footer/CategoryFooter";
import { useAuth } from "../context/AuthContext";
import { productMemoryCache } from "../utils/productMemoryCache";

export default function Categories() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [cats, setCats] = useState(productMemoryCache.categories || []);

  const [products, setProducts] = useState(productMemoryCache.products || []);

  const [loading, setL] = useState(!productMemoryCache.categories);

  const [active, setActive] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        if (productMemoryCache.categories && productMemoryCache.products) {
          setCats(productMemoryCache.categories);
          setProducts(productMemoryCache.products);
          setL(false);
          return;
        }
        const [c, p] = await Promise.all([
          supabase.from("categories").select("*").order("name"),

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
            .order("created_at", {
              ascending: false,
            }),
        ]);

        const freshCats = c.data || [];

        const freshProducts = p.data || [];

        setCats(freshCats);
        setProducts(freshProducts);

        productMemoryCache.categories = freshCats;
        productMemoryCache.products = freshProducts;
      } catch (err) {
        console.error(err);
      } finally {
        setL(false);
      }
    }

    loadData();
  }, []);
  const shown = active
    ? products.filter((p) => String(p.category_id) === String(active))
    : [];
  const productCounts = useMemo(() => {
    const counts = {};

    products.forEach((p) => {
      counts[p.category_id] = (counts[p.category_id] || 0) + 1;
    });

    return counts;
  }, [products]);

  return (
    <>
      {/* HEADER */}
      <div className="page-header">
        <div className="container">
          <div className="category-summary">
            <div className="section-label">📂 Browse</div>

            <div className="category-title-row">
              <h1 className="section-title">All Categories</h1>

              {isAdmin && (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/admin/categories")}
                >
                  + Add Category
                </button>
              )}
            </div>

            <p className="section-sub">Explore gadgets by type.</p>

            <div className="category-header-row">
              <div className="category-stats">
                <span>📂 {cats.length} Categories</span>

                <span>📦 {products.length} Products</span>

                <span>🔥 Updated Weekly</span>
              </div>

              <div className="category-filter-wrap">
                <div className="category-dropdown" ref={dropdownRef}>
                  <button
                    className="category-dropdown-trigger"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span>
                      {active
                        ? `${
                            cats.find((c) => String(c.id) === String(active))
                              ?.icon
                          } ${
                            cats.find((c) => String(c.id) === String(active))
                              ?.name
                          }`
                        : "📂 All Categories"}
                    </span>

                    <span className={dropdownOpen ? "rotate" : ""}>▼</span>
                  </button>

                  {dropdownOpen && (
                    <div className="category-dropdown-menu">
                      <button
                        className={!active ? "active" : ""}
                        onClick={() => {
                          setActive(null);
                          setDropdownOpen(false);
                        }}
                      >
                        📂 All Categories
                      </button>

                      {cats.map((c) => (
                        <button
                          key={c.id}
                          className={
                            String(active) === String(c.id) ? "active" : ""
                          }
                          onClick={() => {
                            setActive(c.id);
                            setDropdownOpen(false);
                          }}
                        >
                          {c.icon} {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className="container"
        style={{
          paddingTop: 5,
          paddingBottom: 40,
          minHeight: "45vh",
        }}
      >
        {loading ? (
          <div className="cat-grid" style={{ marginTop: 24 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="skeleton-card"
                style={{
                  height: "180px",
                  borderRadius: "24px",
                }}
              />
            ))}
          </div>
        ) : !active ? (
          cats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📂</div>

              <h3>No categories yet</h3>

              <p>Check back soon!</p>
            </div>
          ) : (
            <div className="cat-grid" style={{ marginTop: 24 }}>
              {cats.map((c) => {
                const cnt = productCounts[c.id] || 0;

                return (
                  <div
                    key={c.id}
                    className="cat-card"
                    onClick={() => {
                      setActive(c.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <div className="cat-icon-wrap">{c.icon || "📦"}</div>

                    <div className="cat-name">{c.name}</div>

                    <div className="cat-count">
                      {cnt} product{cnt !== 1 ? "s" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <>
            <p
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: "var(--text2)",
                padding: "14px 0",
              }}
            >
              Showing
              <strong style={{ color: "var(--accent)" }}>
                {" "}
                {shown.length}{" "}
              </strong>
              gadget{shown.length !== 1 ? "s" : ""} in
              <strong>
                {" "}
                {cats.find((c) => String(c.id) === String(active))?.name}
              </strong>
            </p>

            {shown.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>

                <h3>No gadgets here yet</h3>
              </div>
            ) : (
              <div className="products-grid">
                {shown.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categoryName={p.categories?.name}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CategoryFooter />
    </>
  );
}

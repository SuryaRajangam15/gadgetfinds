import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard";
import CategoryFooter from "../components/footer/CategoryFooter";
import { useAuth } from "../context/AuthContext";

export default function Categories() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const cachedCats = JSON.parse(
    localStorage.getItem("categories_page_cache") || "[]",
  );

  const cachedProducts = JSON.parse(
    localStorage.getItem("categories_products_cache") || "[]",
  );

  const [cats, setCats] = useState(cachedCats);

  const [products, setProducts] = useState(cachedProducts);

  const [active, setActive] = useState(null);

  const [loading, setL] = useState(cachedCats.length === 0);

  useEffect(() => {
    async function loadData() {
      try {
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

        localStorage.setItem(
          "categories_page_cache",
          JSON.stringify(freshCats),
        );

        localStorage.setItem(
          "categories_products_cache",
          JSON.stringify(freshProducts),
        );
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

  return (
    <>
      {/* HEADER */}
      <div className="page-header">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            {/* LEFT */}
            <div>
              <div className="section-label">📂 Browse</div>

              <h1 className="section-title">All Categories</h1>

              <p className="section-sub">Explore gadgets by type.</p>
            </div>

            {/* ADD CATEGORY BUTTON */}
            {isAdmin && (
              <button
                className="btn btn-primary"
                onClick={() => navigate("/admin/categories")}
              >
                + Add Category
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className="container"
        style={{
          paddingTop: 24,
          paddingBottom: 40,
          minHeight: "45vh",
        }}
      >
        {/* FILTER PILLS */}
        <div className="cpf-pill-bar">
          <button
            className={"cpf-pill" + (!active ? " active" : "")}
            onClick={() => setActive(null)}
          >
            All
            <span className="cpf-pill-count">{cats.length}</span>
          </button>

          {cats.map((c) => (
            <button
              key={c.id}
              className={
                "cpf-pill" + (String(active) === String(c.id) ? " active" : "")
              }
              onClick={() => setActive(c.id)}
            >
              {c.icon} {c.name}
              <span className="cpf-pill-count">
                {
                  products.filter((p) => String(p.category_id) === String(c.id))
                    .length
                }
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="cat-grid" style={{ marginTop: 24 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="skeleton-card"
                style={{
                  height: "180px",
                  borderRadius: "24px",
                  background: "#f3f4f6",
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
                const cnt = products.filter(
                  (p) => String(p.category_id) === String(c.id),
                ).length;

                return (
                  <div
                    key={c.id}
                    className="cat-card"
                    onClick={() => setActive(c.id)}
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

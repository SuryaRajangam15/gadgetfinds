import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import ProductFooter from "../components/footer/ProductFooter";
import React, { useEffect, useState, useMemo } from "react";
import { productMemoryCache } from "../utils/productMemoryCache";

export default function Products() {
  const [products, setP] = useState([]);

  const [cats, setC] = useState([]);

  const [loading, setL] = useState(true);

  const { isAdmin } = useAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState("newest");

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  useEffect(() => {
    async function loadProducts() {
      try {
        // MEMORY CACHE
        if (productMemoryCache.products) {
          setP(productMemoryCache.products);

          setC(productMemoryCache.categories || []);

          setL(false);

          return;
        }

        // FETCH PRODUCTS
        const [p, c] = await Promise.all([
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

          supabase.from("categories").select("*"),
        ]);

        const freshProducts = p.data || [];

        const freshCats = c.data || [];

        // UPDATE UI
        setP(freshProducts);

        setC(freshCats);

        // MEMORY CACHE
        productMemoryCache.products = freshProducts;

        productMemoryCache.categories = freshCats;
      } catch (err) {
        console.error(err);
      } finally {
        setL(false);
      }
    }

    loadProducts();
  }, []);

  const list = useMemo(() => {
    return products

      .filter((p) => {
        if (q) {
          const lq = q.toLowerCase();

          if (
            !p.name.toLowerCase().includes(lq) &&
            !p.description?.toLowerCase().includes(lq)
          ) {
            return false;
          }
        }

        if (cat && String(p.category_id) !== String(cat)) {
          return false;
        }

        return true;
      })

      .sort((a, b) => {
        if (sort === "az") {
          return a.name.localeCompare(b.name);
        }

        if (sort === "za") {
          return b.name.localeCompare(a.name);
        }

        if (sort === "oldest") {
          return new Date(a.created_at) - new Date(b.created_at);
        }

        return new Date(b.created_at) - new Date(a.created_at);
      });
  }, [products, q, cat, sort]);

  const lastIndex = currentPage * productsPerPage;

  const firstIndex = lastIndex - productsPerPage;

  const currentProducts = list.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(list.length / productsPerPage);

  return (
    <>
      {/* HERO */}
      <div className="page-header">
        <div className="container">
          <div>
            <div className="section-label">🛍️ All Products</div>

            <div className="products-title-row">
              <h1 className="section-title">Browse Gadgets</h1>

              {isAdmin && (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/admin/products")}
                >
                  + Add Product
                </button>
              )}
            </div>

            <p className="section-sub">Curated products from trusted stores.</p>
          </div>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div
        className="container"
        style={{
          paddingTop: 0,
          paddingBottom: 40,
        }}
      >
        <div className="pf-wrap">
          <div className="pf-bar">
            {/* SEARCH */}
            <div className="pf-search-wrap">
              <span className="pf-search-icon">🔍</span>

              <input
                className="pf-search"
                placeholder="Search gadgets..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            {/* CATEGORY */}
            <div className="pf-select-wrap">
              <span className="pf-select-icon">🗂️</span>

              <select
                className="pf-select"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              >
                <option value="">All Categories</option>

                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SORT */}
            <div className="pf-select-wrap">
              <span className="pf-select-icon">🔥</span>

              <select
                className="pf-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest First</option>

                <option value="popular">Most Clicked</option>

                <option value="oldest">Oldest First</option>

                <option value="az">A → Z</option>

                <option value="za">Z → A</option>
              </select>
            </div>

            {/* CLEAR */}
            <button
              className="pf-clear"
              onClick={() => {
                setQ("");
                setCat("");
                setSort("newest");
              }}
            >
              🧹 Clear
            </button>
          </div>

          {/* RESULTS */}
          <div className="pf-results">
            <span className="pf-count">
              Showing <strong>{list.length}</strong> gadget
              {list.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* PRODUCTS */}
        {loading && products.length === 0 ? (
          <div className="products-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="skeleton-card"
                style={{
                  height: "320px",
                  borderRadius: "24px",
                }}
              />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>

            <h3>No gadgets found</h3>

            <p>Try changing your filters.</p>
          </div>
        ) : (
          <div className="products-grid">
            {currentProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                categoryName={p.categories?.name}
              />
            ))}
          </div>
        )}

        {/* PAGINATION */}

        {totalPages > 1 && (
          <div className="products-pagination-wrap">
            <button
              className="products-page-nav"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              &lt;
            </button>

            <div className="products-pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              className="products-page-nav"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      <ProductFooter />
    </>
  );
}

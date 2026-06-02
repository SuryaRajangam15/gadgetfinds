import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";
import { toast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";
import { productMemoryCache } from "../../utils/productMemoryCache";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoad] = useState(true);
  const [productPage, setProductPage] = useState(1);

  const [categoryPage, setCategoryPage] = useState(1);

  const PRO_PAGE_SIZE = 10;

  const CAT_PAGE_SIZE = 10;

  const navigate = useNavigate();

  const { signOut } = useAuth();

  async function logout() {
    await signOut();

    toast("Logged out successfully");

    navigate("/");
  }

  async function load() {
    setLoad(true);

    // MEMORY CACHE
    if (productMemoryCache.analytics) {
      setData(productMemoryCache.analytics);

      setLoad(false);

      return;
    }

    const [views, clicks, products, categories] = await Promise.all([
      supabase
        .from("page_views")
        .select("viewed_at")
        .order("viewed_at", { ascending: false })
        .limit(500),

      supabase.from("clicks").select("product_id"),

      supabase.from("products").select("id,name,category_id,categories(name)"),

      supabase.from("categories").select("id,name"),
    ]);

    const viewRows = views.data || [];
    const clickRows = clicks.data || [];
    const prodRows = products.data || [];
    const catRows = categories.data || [];

    /* CLICK MAP */
    const clickMap = {};

    clickRows.forEach((r) => {
      if (r.product_id != null) {
        const k = String(r.product_id);

        clickMap[k] = (clickMap[k] || 0) + 1;
      }
    });

    /* DAILY VIEWS */
    const daily = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();

      d.setDate(d.getDate() - i);

      daily[d.toISOString().slice(0, 10)] = 0;
    }

    viewRows.forEach((r) => {
      const day = r.viewed_at?.slice(0, 10);

      if (day && daily[day] !== undefined) {
        daily[day]++;
      }
    });

    /* TOP PRODUCTS */
    const topProds = prodRows
      .map((p) => ({
        ...p,
        clicks: clickMap[String(p.id)] || 0,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const topClicks = topProds[0]?.clicks || 0;

    /* CATEGORY ANALYTICS */
    const categoryStats = catRows.map((cat) => {
      const categoryProducts = prodRows.filter(
        (p) => String(p.category_id) === String(cat.id),
      );

      const totalClicks = categoryProducts.reduce(
        (sum, p) => sum + (clickMap[String(p.id)] || 0),
        0,
      );

      return {
        name: cat.name,
        clicks: totalClicks,
        products: categoryProducts.length,
      };
    });

    const analyticsData = {
      totalViews: viewRows.length,

      totalClicks: clickRows.length,

      totalProducts: prodRows.length,

      topClicks,

      daily,

      topProds,

      categoryStats,
    };

    setData(analyticsData);

    // MEMORY CACHE
    productMemoryCache.analytics = analyticsData;

    setLoad(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function reset() {
    if (!confirm("Reset ALL analytics? This cannot be undone.")) {
      return;
    }

    await Promise.all([
      supabase.from("clicks").delete().neq("id", 0),

      supabase.from("page_views").delete().neq("id", 0),
    ]);

    toast("Analytics reset");

    load();
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted)",
        }}
      >
        Loading…
      </div>
    );
  }

  const {
    totalViews,
    totalClicks,
    totalProducts,
    topClicks,
    daily,
    topProds,
    categoryStats,
  } = data;

  const maxDay = Math.max(1, ...Object.values(daily));

  return (
    <>
      <div
        style={{
          paddingTop: 40,
          paddingBottom: 60,
        }}
      >
        <div className="container">
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div>
              <div className="section-label">📊 Insights</div>

              <h1 className="section-title" style={{ marginBottom: 6 }}>
                Customer Analytics
              </h1>

              <p
                style={{
                  fontSize: 16,
                  color: "var(--muted)",
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                Track how visitors interact with your gadgets
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button className="btn btn-ghost btn-sm" onClick={load}>
                🔄 Refresh
              </button>

              <button className="btn btn-danger btn-sm" onClick={reset}>
                🗑️ Reset Data
              </button>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate("/admin/products")}
              >
                ← Admin
              </button>

              <button className="btn btn-danger btn-sm" onClick={logout}>
                🚪 Logout
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="analytics-grid">
            {[
              {
                icon: "👁️",
                color: "#eff4ff",
                val: totalViews,
                lbl: "Total Page Views",
              },

              {
                icon: "🛒",
                color: "#fff5ee",
                val: totalClicks,
                lbl: "Product Clicks",
              },

              {
                icon: "📦",
                color: "#f0fdf4",
                val: totalProducts,
                lbl: "Products Listed",
              },

              {
                icon: "🔥",
                color: "#fff5f5",
                val: topClicks,
                lbl: "Top Product Clicks",
              },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-card-icon" style={{ background: s.color }}>
                  {s.icon}
                </div>

                <div className="stat-card-val">{s.val.toLocaleString()}</div>

                <div className="stat-card-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* CHART */}
          <div className="visits-chart">
            <h3>📈 Daily Activity (Last 7 Days)</h3>

            <div className="chart-bars">
              {Object.entries(daily).map(([day, val]) => {
                const pct = Math.max(3, Math.round((val / maxDay) * 100));

                return (
                  <div key={day} className="chart-bar-wrap">
                    <div className="chart-bar-val">{val || ""}</div>

                    <div className="chart-bar" style={{ height: pct + "px" }} />

                    <div className="chart-bar-lbl">{day.slice(5)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PRODUCT TABLE */}
          <div className="analytics-table-wrap">
            <div className="analytics-table-head">
              <h3>🛒 Product Click Leaderboard</h3>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>#</th>
                    <th style={{ textAlign: "center" }}>Product</th>
                    <th style={{ textAlign: "center" }}>Category</th>
                    <th style={{ textAlign: "center" }}>Clicks</th>
                  </tr>
                </thead>

                <tbody>
                  {topProds
                    .slice(
                      (productPage - 1) * PRO_PAGE_SIZE,
                      productPage * PRO_PAGE_SIZE,
                    )
                    .map((p, i) => (
                      <tr key={p.id}>
                        <td style={{ textAlign: "center" }}>
                          {(productPage - 1) * PRO_PAGE_SIZE + i + 1}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <strong>{p.name}</strong>
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {p.categories?.name || "—"}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <strong style={{ color: "var(--accent2)" }}>
                            {p.clicks}
                          </strong>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  padding: "20px 0",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={productPage === 1}
                  onClick={() => setProductPage((p) => p - 1)}
                >
                  ←
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 600,
                  }}
                >
                  {productPage} / {Math.ceil(topProds.length / PRO_PAGE_SIZE)}
                </div>

                <button
                  className="btn btn-ghost btn-sm"
                  disabled={
                    productPage >= Math.ceil(topProds.length / PRO_PAGE_SIZE)
                  }
                  onClick={() => setProductPage((p) => p + 1)}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* CATEGORY TABLE */}
          <div className="analytics-table-wrap">
            <div className="analytics-table-head">
              <h3>📂 Clicks by Category</h3>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>#</th>

                    <th style={{ textAlign: "center" }}>Category</th>

                    <th style={{ textAlign: "center" }}>Total Clicks</th>

                    <th style={{ textAlign: "center" }}>Products</th>
                  </tr>
                </thead>

                <tbody>
                  {categoryStats
                    .slice(
                      (categoryPage - 1) * CAT_PAGE_SIZE,
                      categoryPage * CAT_PAGE_SIZE,
                    )
                    .map((c, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: "center" }}>
                          {(categoryPage - 1) * CAT_PAGE_SIZE + i + 1}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <strong>{c.name}</strong>
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <strong style={{ color: "var(--accent2)" }}>
                            {c.clicks}
                          </strong>
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {c.products} products
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  padding: "20px 0",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={categoryPage === 1}
                  onClick={() => setCategoryPage((p) => p - 1)}
                >
                  ←
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 600,
                  }}
                >
                  {categoryPage} /{" "}
                  {Math.ceil(categoryStats.length / CAT_PAGE_SIZE)}
                </div>

                <button
                  className="btn btn-ghost btn-sm"
                  disabled={
                    categoryPage >=
                    Math.ceil(categoryStats.length / CAT_PAGE_SIZE)
                  }
                  onClick={() => setCategoryPage((p) => p + 1)}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

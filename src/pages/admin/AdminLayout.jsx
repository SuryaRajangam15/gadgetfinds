import React from "react";

import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { toast } from "../../hooks/useToast";

export default function AdminLayout() {
  const { signOut } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const isAnalyticsPage = location.pathname === "/admin/analytics";

  async function logout() {
    await signOut();

    toast("Logged out successfully");

    navigate("/");
  }

  function tabClass(path) {
    const active = location.pathname.startsWith(path);

    return "admin-tab" + (active ? " active" : "");
  }

  return (
    <>
      <div
        style={{
          paddingTop: 80,
          paddingBottom: 60,
          minHeight: "calc(100vh - 220px)",
        }}
      >
        <div className="container">
          {/* NORMAL ADMIN HEADER */}
          {!isAnalyticsPage && (
            <>
              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 32,
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                {/* LEFT */}
                <div>
                  <div className="section-label">🔐 Admin Panel</div>

                  <h1 className="section-title" style={{ marginBottom: 6 }}>
                    Manage Your Site
                  </h1>

                  <p
                    style={{
                      fontSize: 16,
                      color: "var(--muted)",
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                    Logged in as <strong>Surya</strong>
                  </p>
                </div>

                {/* ACTIONS */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <NavLink
                    to="/admin/analytics"
                    className="btn btn-ghost btn-sm"
                  >
                    📊 Analytics
                  </NavLink>

                  <button className="btn btn-danger btn-sm" onClick={logout}>
                    🚪 Logout
                  </button>
                </div>
              </div>

              {/* TABS */}
              <div className="admin-tabs">
                <NavLink
                  to="/admin/products"
                  className={tabClass("/admin/products")}
                >
                  🛍️ Products
                </NavLink>

                <NavLink
                  to="/admin/categories"
                  className={tabClass("/admin/categories")}
                >
                  📂 Categories
                </NavLink>
              </div>
            </>
          )}

          {/* PAGE CONTENT */}
          <Outlet />
        </div>
      </div>
    </>
  );
}

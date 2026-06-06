import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../hooks/useToast";
import useTheme from "../hooks/useTheme";

export default function Navbar() {
  const { isAdmin, signOut, handleLogoClick, signIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  async function logout() {
    await signOut();
    toast("Logged out successfully");
    navigate("/");
  }

  function openLoginModal() {
    setEmail("");
    setPass("");
    setLoginErr("");
    setShowLogin(true);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginErr("");
    setBusy(true);
    try {
      const user = await signIn(email, pass);
      if (user?.user_metadata?.role !== "admin") {
        const { supabase } = await import("../lib/supabase");
        await supabase.auth.signOut();
        setLoginErr("This account does not have admin access.");
        setBusy(false);
        return;
      }
      setShowLogin(false);
      toast("Welcome back, Surya! 👋", "success");
      navigate("/admin");
    } catch (err) {
      setLoginErr(err.message || "Incorrect email or password.");
    }
    setBusy(false);
  }

  const lc = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <>
      <nav className={scrolled ? "navbar scrolled" : "navbar"}>
        <div className="nav-inner">
          <div
            className="nav-logo"
            onClick={() => handleLogoClick(openLoginModal)}
            style={{ cursor: "pointer" }}
          >
            <div className="nav-logo-mark">⚡</div>
            <div>
              <div className="nav-logo-text">
                <span>Gadget</span>Finds
              </div>
              <div className="nav-logo-sub">
                by Surya • Budget Tech Gadgets 🔥
              </div>
            </div>
          </div>

          <div className="nav-links">
            <NavLink to="/" end className={lc}>
              Home
            </NavLink>
            <NavLink to="/products" className={lc}>
              Products
            </NavLink>
            <NavLink to="/categories" className={lc}>
              Categories
            </NavLink>
            <NavLink to="/about" className={lc}>
              About
            </NavLink>
          </div>

          <div className="nav-right">
            <button
              className="btn btn-primary btn-sm nav-pinterest-btn"
              onClick={() =>
                window.open("https://pinterest.com/budgettechsurya", "_blank")
              }
            >
              📌 Pinterest
            </button>
            {isAdmin && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => navigate("/admin")}
              >
                🔐 Admin
              </button>
            )}

            <Link to="/products" className="btn btn-primary btn-sm">
              Browse Gadgets
            </Link>
            <button className="btn btn-ghost theme-btn" onClick={toggleTheme}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE ACTION BUTTONS */}

      {mobileMenu && (
        <div className="mobile-action-buttons">
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              window.open("https://pinterest.com/budgettechsurya", "_blank")
            }
          >
            📌 Pinterest
          </button>

          {isAdmin && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate("/admin")}
            >
              🔐 Admin
            </button>
          )}

          <Link to="/products" className="btn btn-primary btn-sm">
            Browse Gadgets
          </Link>
        </div>
      )}

      {/* MOBILE THEME TOGGLE */}
      <button className="mobile-theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      {/* MOBILE BOTTOM NAV */}
      <div className="mobile-bottom-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            "mobile-bottom-link" + (isActive ? " active" : "")
          }
        >
          <div className="mobile-bottom-icon">🏠</div>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            "mobile-bottom-link" + (isActive ? " active" : "")
          }
        >
          <div className="mobile-bottom-icon">🛍️</div>
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            "mobile-bottom-link" + (isActive ? " active" : "")
          }
        >
          <div className="mobile-bottom-icon">📂</div>
          <span>Categories</span>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            "mobile-bottom-link" + (isActive ? " active" : "")
          }
        >
          <div className="mobile-bottom-icon">🧑🏻‍💼</div>
          <span>About</span>
        </NavLink>

        {/* <a
    href="/about"
    target="_blank"
    rel="noreferrer"
    className="mobile-bottom-link"
  >
    <div className="mobile-bottom-icon">📌</div>
    <span>About</span>
  </a> */}

        <button
          className="mobile-bottom-link mobile-menu-btn"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <div className="mobile-bottom-icon">☰</div>
          <span>Menu</span>
        </button>
      </div>
      {showLogin && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}
        >
          <div className="modal">
            <button className="modal-close" onClick={() => setShowLogin(false)}>
              ✕
            </button>
            <div className="modal-icon">🔐</div>
            <h2>Admin Login</h2>
            <p>Sign in with your Supabase admin account</p>
            {loginErr && <div className="modal-error">{loginErr}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@youremail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <div className="form-group">
                  <label className="form-label">Password</label>

                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      placeholder="Password"
                      className="form-input"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                disabled={busy}
              >
                {busy ? "Logging in…" : "Login →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

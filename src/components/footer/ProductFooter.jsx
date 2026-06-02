import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductFooter() {
  const navigate = useNavigate();
  return (
    <footer>
      <div className="container">
        <div className="product-footer-minimal">
          {/* LEFT */}
          <div className="product-footer-left">
            <p className="product-footer-copy">
              © 2026 GadgetFinds.in · Curated by Surya
            </p>

            <p className="product-footer-sub">
              Affiliate links · Latest product prices
            </p>
          </div>

          {/* RIGHT */}
          <div className="product-footer-right">
            <div className="product-footer-top">
              <span className="product-footer-fire">🔥</span>

              <span className="product-footer-title">Trending This Week</span>
            </div>

            <p className="product-footer-desc">
              Top gadgets handpicked by Surya · Direct product links
            </p>

            <div className="product-footer-links">
              <button
                className="product-footer-link"
                onClick={() => navigate("/products")}
              >
                Browse Hot Deals →
              </button>

              <span className="product-footer-dot">·</span>

              <button
                className="product-footer-link"
                onClick={() =>
                  window.open("https://pinterest.com/budgettechsurya", "_blank")
                }
              >
                📌 Pinterest
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

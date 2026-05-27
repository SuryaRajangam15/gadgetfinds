import React from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryFooter() {
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
              Browse gadgets by category · Updated weekly
            </p>
          </div>

          {/* RIGHT */}
          <div className="product-footer-right">
            <div className="product-footer-top">
              <span className="product-footer-fire">📂</span>

              <span className="product-footer-title">Browse Categories</span>
            </div>

            <p className="product-footer-desc">
              Smart home, desk setup, lighting, gadgets & more
            </p>

            <div className="product-footer-links">
              <button
                className="product-footer-link"
                onClick={() => navigate("/categories")}
              >
                Explore Collections →
              </button>

              <span className="product-footer-dot">·</span>

              <button
                className="product-footer-link"
                onClick={() => navigate("/products")}
              >
                ⚡ Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

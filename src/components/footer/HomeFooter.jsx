import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomeFooter() {
  const navigate = useNavigate()

  return (
    <footer>
      <div className="container">

        {/* TOP GRID */}
        <div className="footer-grid">

          {/* LEFT */}
          <div>

            <div className="footer-logo-text">
              <span>Gadget</span>Finds.in
            </div>

            <p className="footer-desc">
              Trending budget tech gadgets curated by Surya.
              From Amazon smart home picks to viral desk setups
              — all at unbeatable prices.
            </p>

            <div className="footer-social">

              <div
                className="f-social-btn"
                onClick={() =>
                  window.open(
                    'https://pinterest.com/budgettechsurya',
                    '_blank'
                  )
                }
              >
                📌
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <div>

            <div className="footer-heading">
              Navigate
            </div>

            <span
              className="footer-link"
              onClick={() => navigate('/')}
            >
              Home
            </span>

            <span
              className="footer-link"
              onClick={() => navigate('/products')}
            >
              Products
            </span>

            <span
              className="footer-link"
              onClick={() => navigate('/categories')}
            >
              Categories
            </span>

            <span
              className="footer-link"
              onClick={() => navigate('/about')}
            >
              About
            </span>

          </div>

          {/* LEGAL */}
          <div>

            <div className="footer-heading">
              Legal
            </div>

            <span className="footer-link">
              Privacy Policy
            </span>

            <span className="footer-link">
              Affiliate Disclosure
            </span>

            <span className="footer-link">
              Contact
            </span>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">

          <div>

            <p>
              © 2026 GadgetFinds.in · Curated by Surya
            </p>

            <p className="footer-affiliate">
              GadgetFinds participates in affiliate programs.
              Purchases through links may earn a commission
              at no extra cost to you.
            </p>

          </div>

          <span className="badge badge-blue">
            MADE WITH ❤️ IN INDIA
          </span>

        </div>

      </div>
    </footer>
  )
}
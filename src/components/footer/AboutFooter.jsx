import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AboutFooter() {

  const navigate = useNavigate()

  return (

    <footer>

      <div className="container">

        <div className="about-footer-minimal">

          {/* LEFT */}
          <div className="about-footer-left">

            <p className="about-footer-copy">
              © 2026 GadgetFinds.in · Made with ❤️ by Surya
            </p>

          </div>

          {/* RIGHT */}
          <div className="about-footer-right">

            <button
              className="about-footer-home"
              onClick={() => navigate('/home')}
            >
              ← Back to Home
            </button>

          </div>

        </div>

      </div>

    </footer>

  )
}
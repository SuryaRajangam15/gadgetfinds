import React, { useState } from 'react'
import { toast } from '../hooks/useToast'
import { sendTelegramRequest } from '../utils/sendTelegramRequest'

const budgets = [
  'Under ₹500',
  '₹500 - ₹1,000',
  '₹1,000 - ₹2,000',
  '₹2,000 - ₹5,000',
  'Above ₹5,000'
]

export default function RequestModal({ onClose }) {

  const [step, setStep] = useState(1)

  const [product, setProduct] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {

    e.preventDefault()

    if (!product || !budget) {

      toast(
        'Please fill required fields',
        'error'
      )

      return
    }

    try {

      setLoading(true)

      await sendTelegramRequest({
        product,
        budget,
        message
      })

      toast(
        'Request submitted ✨',
        'success'
      )

      onClose()

    } catch(err) {

      toast(
        'Failed to send request',
        'error'
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <div
      className="request-modal-overlay"
      onClick={(e) =>
        e.target === e.currentTarget &&
        onClose()
      }
    >

      {/* STEP 1 */}
      {step === 1 && (

        <div className="request-intro-modal">

          <button
            className="request-modal-close"
            onClick={onClose}
          >
            ✕
          </button>

          <div className="request-intro-top">

            <div className="request-intro-icon">
              📦
            </div>

          </div>

          <div className="request-intro-content">

            <h2>
              Request a Gadget ✨
            </h2>

            <p>
              Don’t find the gadget you're looking for?
            </p>

            <p className="request-subtext">
              Tell us what you want — we'll try to
              find it for you!
            </p>

            <button
              className="request-start-btn"
              onClick={() => setStep(2)}
            >
              Let’s Request 🚀
            </button>

          </div>

        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (

        <div className="request-modal compact">

          <button
            className="request-modal-close"
            onClick={onClose}
          >
            ✕
          </button>

          <h2>
            Request a Gadget ✨
          </h2>

          <p>
            Tell us which gadget you want and your expected budget.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label className="form-label">
                Gadget Name
              </label>

              <input
                type="text"
                className="form-input"
                placeholder="Mini projector, gaming fan..."
                value={product}
                onChange={(e) =>
                  setProduct(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label className="form-label">
                Expected Budget
              </label>

              <div className="budget-chips">

                {budgets.map((b) => (

                  <button
                    type="button"
                    key={b}
                    className={
                      budget === b
                      ? 'budget-chip active'
                      : 'budget-chip'
                    }
                    onClick={() => setBudget(b)}
                  >
                    {b}
                  </button>

                ))}

              </div>

            </div>

            <div className="form-group">

              <label className="form-label">
                Extra Details (Optional)
              </label>

              <textarea
                className="form-textarea"
                placeholder="Features, color, brand..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
              />

            </div>

            <button
              type="submit"
              className="btn btn-primary request-submit-btn"
              disabled={loading}
            >
              {loading
                ? 'Sending...'
                : 'Send Request 🚀'}
            </button>

          </form>

        </div>
      )}

    </div>
  )
}
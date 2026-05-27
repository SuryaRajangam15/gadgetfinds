import React from 'react'
import AboutFooter from '../components/footer/AboutFooter'

export default function About() {

  return (
    <>

      {/* HERO */}
      <div
        style={{
          padding:'92px 0 46px',
          background:'linear-gradient(160deg,#f5f7fc,#f8f9fd)',
          textAlign:'center'
        }}
      >

        <div className="container">

          {/* AVATAR */}
          <div
            style={{
              width:74,
              height:74,
              borderRadius:'50%',
              background:'linear-gradient(135deg,var(--accent),#60a5fa)',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              fontSize:30,
              margin:'0 auto 18px'
            }}
          >
            👨‍💻
          </div>

          {/* LABEL */}
          <div
            className="section-label"
            style={{
              justifyContent:'center',
              fontSize:11,
              marginBottom:8
            }}
          >
            THE PERSON BEHIND GADGETFINDS
          </div>

          {/* TITLE */}
          <h1
            style={{
              fontSize:'clamp(34px,5vw,54px)',
              fontWeight:800,
              lineHeight:1.08,
              marginBottom:12,
              letterSpacing:'-.03em'
            }}
          >
            Hey, I'm{' '}
            <span style={{color:'var(--accent)'}}>
              Surya
            </span>{' '}
            👋
          </h1>

          {/* SUBTEXT */}
          <p
            style={{
              color:'var(--muted)',
              fontSize:15,
              lineHeight:1.7,
              maxWidth:500,
              margin:'0 auto'
            }}
          >
            Budget Tech Gadgets Curator · Pinterest Creator · Amazon Enthusiast
          </p>

        </div>

      </div>

      {/* CONTENT */}
      <div
        style={{
          maxWidth:820,
          margin:'0 auto',
          padding:'48px 22px 72px'
        }}
      >

        {/* FEATURE CARDS */}
        <div
          style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',
            gap:18,
            marginBottom:44
          }}
        >

          {/* CARD 1 */}
          <div className="about-feature-card">

            <div className="about-feature-icon">
              📌
            </div>

            <h3 className="about-feature-title">
              Pinterest Creator
            </h3>

            <p className="about-feature-text">
              10,000+ monthly views on @budgettechsurya with daily gadget drops
            </p>

          </div>

          {/* CARD 2 */}
          <div className="about-feature-card">

            <div className="about-feature-icon">
              🛍️
            </div>

            <h3 className="about-feature-title">
              Amazon Curator
            </h3>

            <p className="about-feature-text">
              Only listing gadgets with 4★+ ratings & genuine reviews
            </p>

          </div>

          {/* CARD 3 */}
          <div className="about-feature-card">

            <div className="about-feature-icon">
              💰
            </div>

            <h3 className="about-feature-title">
              Budget First
            </h3>

            <p className="about-feature-text">
              Every pick under ₹1999 — great tech shouldn't break the bank
            </p>

          </div>

        </div>

        {/* STORY */}
        <h3
          style={{
            fontSize:26,
            fontWeight:800,
            marginBottom:18
          }}
        >
          My Story
        </h3>

        <p
          style={{
            color:'var(--text2)',
            fontSize:16,
            lineHeight:1.95,
            marginBottom:22
          }}
        >
          I started <strong>GadgetFinds.in</strong> because I was tired of
          overpaying for tech gadgets that were available for a fraction
          of the price on Amazon. Every week I spend hours discovering
          the best budget gadgets so you don't have to.
        </p>

        <p
          style={{
            color:'var(--text2)',
            fontSize:16,
            lineHeight:1.95,
            marginBottom:40
          }}
        >
          What started as a small Pinterest board —{' '}
          <strong>@budgettechsurya</strong> — grew into a community of
          over 10,000 fellow gadget lovers. This website is the natural
          next step: a clean, simple place where you can browse everything
          I recommend, click through to Amazon, and get the best deal.
        </p>

        {/* HOW */}
        <h3
          style={{
            fontSize:26,
            fontWeight:800,
            marginBottom:18
          }}
        >
          How This Works
        </h3>

        <p
          style={{
            color:'var(--text2)',
            fontSize:16,
            lineHeight:1.95,
            marginBottom:42
          }}
        >
          Every product you see on GadgetFinds is something I personally
          researched and believe offers genuine value. When you click
          "Buy on Amazon", you'll be taken directly to the product page.
          I earn a small affiliate commission — this keeps the site
          running at no extra cost to you.
        </p>

        {/* PINTEREST */}
        <h3
          style={{
            fontSize:26,
            fontWeight:800,
            marginBottom:14
          }}
        >
          Follow Me on Pinterest
        </h3>

        <p
          style={{
            color:'var(--text2)',
            fontSize:16,
            lineHeight:1.9,
            marginBottom:24
          }}
        >
          For daily gadget drops, viral finds, and the latest Amazon deals,
          follow me on Pinterest:
        </p>

        {/* BUTTON */}
        <a
          href="https://pinterest.com/budgettechsurya"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
          style={{
            borderRadius:999,
            padding:'14px 26px',
            fontWeight:700,
            boxShadow:'0 10px 30px rgba(37,99,235,.22)'
          }}
        >
          📌 @budgettechsurya
        </a>

        {/* DIVIDER */}
        <hr
          style={{
            margin:'48px 0 26px',
            border:'none',
            borderTop:'1px solid var(--border)'
          }}
        />

        {/* DISCLOSURE */}
        <p
          style={{
            fontSize:12,
            color:'var(--muted)',
            lineHeight:1.7
          }}
        >
          Affiliate Disclosure: GadgetFinds.in participates in the Amazon
          Associates programme. Purchases through our links may earn us
          a commission at no extra cost to you.
        </p>

      </div>

      <AboutFooter/>

    </>
  )
}
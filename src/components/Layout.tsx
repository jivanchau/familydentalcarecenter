import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { site } from '../config/site'
import Footer from './Footer'
import Header from './Header'

function WhatsAppButton() {
  const text = encodeURIComponent('Hello, I would like to book an appointment.')
  return (
    <a
      className="whatsapp-fab"
      href={`https://wa.me/${site.whatsapp}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <i className="fab fa-whatsapp" />
    </a>
  )
}

function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      className={`back-to-top${show ? ' is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <i className="fa-solid fa-angle-up" />
    </button>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  // Block body on purpose: newer browsers return a Promise from scrollTo, which React would treat as a cleanup.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  )
}

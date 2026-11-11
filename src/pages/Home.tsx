import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookingBand, DentistsSection, LatestPosts, Testimonials, TreatmentCards } from '../components/sections'
import { SectionHeading, useSeo } from '../components/ui'
import { paths, site } from '../config/site'
import { doctors, features, heroSlides } from '../data/content'

const SLIDE_MS = 7000
const slideLabels = ['Family care', 'Implants', 'Root canal']

function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % heroSlides.length), SLIDE_MS)
    return () => clearTimeout(t)
  }, [i])

  return (
    <section className="showcase" aria-roledescription="carousel" aria-label="Highlights">
      {heroSlides.map((s, n) => (
        <div
          key={s.image}
          className={`showcase__slide${n === i ? ' is-active' : ''}`}
          style={{ backgroundImage: `url(${s.image})`, backgroundPosition: s.position }}
          aria-hidden={n !== i}
        >
          <div className="container showcase__content">
            {n === 0 ? (
              <h1>{s.title[0]} <strong>{s.title[1]}</strong></h1>
            ) : (
              <h2>{s.title[0]} <strong>{s.title[1]}</strong></h2>
            )}
            <p>{s.text}</p>
            <div className="showcase__actions">
              <Link to={s.to} className="btn btn-custom btn-lg" tabIndex={n === i ? 0 : -1}>{s.cta}</Link>
              <a href={`tel:${site.bookingPhone.replace(/\D/g, '')}`} className="btn btn-outline-light btn-lg" tabIndex={n === i ? 0 : -1}>
                <i className="fa-solid fa-phone" /> Call us
              </a>
            </div>
          </div>
        </div>
      ))}
      <div className="container showcase__tabs" role="tablist">
        {heroSlides.map((s, n) => (
          <button
            key={s.image}
            role="tab"
            aria-selected={n === i}
            className={`showcase__tab${n === i ? ' is-active' : ''}`}
            onClick={() => setI(n)}
          >
            <span className="showcase__num">0{n + 1}</span>
            <span className="showcase__label">{slideLabels[n] ?? s.title[1]}</span>
            <span className="showcase__bar"><span key={`${i}-${n}`} style={{ animationDuration: `${SLIDE_MS}ms` }} /></span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  useSeo('', `${site.name}, ${site.city}: family and specialist dental care since ${site.established}. Braces, aligners, implants, root canal and more.`)
  return (
    <>
      <Hero />

      <section className="section">
        <div className="container">
          <SectionHeading label="Why Family Dental Care Center" title="Why patients choose us" center />
          <div className="why-grid">
            {features.map((f) => (
              <div className="why-item" key={f.title}>
                <span className="why-item__icon"><i className={`fa-solid ${f.icon}`} aria-hidden="true" /></span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-row">
            <SectionHeading label="What we do" title="Our Treatments">
              Comfortable, personalised care for every member of your family.
            </SectionHeading>
            <Link to={paths.treatments} className="btn btn-outline">View all treatments</Link>
          </div>
          <TreatmentCards />
        </div>
      </section>

      <section className="section">
        <div className="container intro-split">
          <div className="intro-split__media">
            <img src="/img/photos/dentist-patient.jpg" alt="Dentist talking with a smiling patient in the dental chair" loading="lazy" />
            <div className="intro-split__badge">
              <strong>{new Date().getFullYear() - site.established}+</strong>
              <span>years caring for {site.city}</span>
            </div>
          </div>
          <div>
            <SectionHeading label="About Family Dental Care Center" title={`Your neighbourhood dental clinic in ${site.city}`} />
            <p>
              Since opening in {site.established}, {site.name} has become a trusted name for dental care in {site.city}. You
              will find us on Redcross Road, easy to reach from anywhere in town. Our dentists,{' '}
              {doctors.map((d) => d.name).join(' and ')}, offer gentle, modern treatment at fair prices, with careful
              sterilization and a team that makes every visit as comfortable as possible.
            </p>
            <ul className="tick-list">
              <li><i className="fa-solid fa-check" /> Specialist orthodontic care</li>
              <li><i className="fa-solid fa-check" /> Clear advice before any treatment starts</li>
              <li><i className="fa-solid fa-check" /> Treatment for children and adults</li>
            </ul>
            <Link to={paths.about} className="btn btn-custom btn-lg">More about us</Link>
          </div>
        </div>
      </section>

      <DentistsSection soft />
      <Testimonials />
      <LatestPosts />
      <BookingBand />
    </>
  )
}

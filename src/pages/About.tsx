import { useEffect, useRef, useState } from 'react'
import { BookingBand, DentistsSection } from '../components/sections'
import { PageBanner, SectionHeading, useSeo } from '../components/ui'
import { site } from '../config/site'
import { doctors, stats } from '../data/content'

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1200)
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [value])
  return <span ref={ref} className="stat__value">{n.toLocaleString('en-IN')}</span>
}

const values = [
  {
    icon: 'fa-bullseye',
    title: 'Our Mission',
    text: 'To deliver safe, high-quality dental treatment that saves natural teeth wherever possible, using gentle, minimally invasive methods and up-to-date techniques.',
  },
  {
    icon: 'fa-eye',
    title: 'Our Vision',
    text: `A community in ${site.city} where everyone can keep a healthy smile for life, through affordable treatment, early prevention and simple oral-health education for children and families.`,
  },
  {
    icon: 'fa-handshake',
    title: 'Our Promise',
    text: 'Honest advice, a clear explanation of every option and its cost before treatment begins, and a team that treats you with patience and respect.',
  },
]

export default function About() {
  useSeo('About Us', `Family dental care in ${site.city} since ${site.established}: honest advice, gentle treatment and fair prices.`)
  return (
    <>
      <PageBanner title="About Our Clinic" eyebrow={`${site.name} · ${site.city}`} crumbs={[{ label: 'About' }]} />

      <section className="section">
        <div className="container intro-split is-reversed">
          <div>
            <SectionHeading label="Who we are" title="Caring for smiles since 2018" />
            <p>
              Since {site.established}, {site.name} has been looking after the smiles of families in {site.city} and the
              surrounding area. Our goal is simple: honest advice, gentle treatment and fair prices, so that good dental care is
              within everyone’s reach.
            </p>
            <p>
              We use modern dental equipment and keep it well maintained, so treatment is quicker and more comfortable. Your
              safety comes first: instruments are cleaned and sterilized before every patient. Our friendly team will explain each
              step of your treatment, answer your questions and make sure you feel at ease from the moment you walk in.
            </p>
            <p className="lead-note">
              <i className="fa-solid fa-user-doctor" /> Led by {doctors.map((d) => d.name).join(' and ')}.
            </p>
          </div>
          <div className="intro-split__media">
            <img src="/img/photos/clinic-interior.jpg" alt="Modern dental treatment room" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading label="What guides us" title="Mission, vision and promise" center />
          <div className="values-grid">
            {values.map((v) => (
              <article className="value-card" key={v.title}>
                <span className="value-card__icon"><i className={`fa-solid ${v.icon}`} aria-hidden="true" /></span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-strip__grid">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <i className={`fa-solid ${s.icon}`} aria-hidden="true" />
              <div>
                <Counter value={s.value} />
                <span className="stat__label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <DentistsSection />
      <BookingBand />
    </>
  )
}

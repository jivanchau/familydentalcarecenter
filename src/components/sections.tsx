import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { paths, site } from '../config/site'
import { doctors, galleryItems, testimonials, treatmentOffers, type Doctor, type GalleryCategory } from '../data/content'
import { formatDate, recentBlogs, toExcerpt, type BlogSummary } from '../lib/api'
import { BlogThumb } from './blog'
import TreatmentIcon from './TreatmentIcon'
import { SectionHeading } from './ui'

/** Treatment cards: icon + title + text + "Learn more" link, left-aligned. */
export function TreatmentCards({ limit, compact }: { limit?: number; compact?: boolean }) {
  const items = limit ? treatmentOffers.slice(0, limit) : treatmentOffers
  return (
    <div className={`treat-grid${compact ? ' is-compact' : ''}`}>
      {items.map((t) => (
        <Link to={t.to} key={t.title} className="treat-card">
          <span className="treat-card__icon">
            <TreatmentIcon name={t.icon} className="treat-card__svg" />
          </span>
          <span className="treat-card__body">
            <h3>{t.title}</h3>
            {!compact && <p>{t.text}</p>}
            <span className="treat-card__more">
              Learn more <i className="fa-solid fa-arrow-right" />
            </span>
          </span>
        </Link>
      ))}
    </div>
  )
}

/** Doctor photo, or a coloured block with initials when no photo is set. */
export function DoctorAvatar({ doctor }: { doctor: Doctor }) {
  if (doctor.photo) return <img src={doctor.photo} alt={doctor.name} loading="lazy" />
  const initials = doctor.name.replace(/^Dr\.?\s*/i, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join('')
  return (
    <span className="avatar-initials" role="img" aria-label={doctor.name}>
      {initials}
    </span>
  )
}

/** "Meet our dentists": horizontal profile cards. */
export function DentistsSection({ soft }: { soft?: boolean }) {
  return (
    <section className={`section${soft ? ' section--soft' : ''}`}>
      <div className="container">
        <SectionHeading label="Our dentists" title="Meet the people behind your smile" />
        <div className="dentist-grid">
          {doctors.map((d) => (
            <Link to={paths.dentist(d.slug)} className="dentist-card" key={d.slug}>
              <span className="dentist-card__photo">
                <DoctorAvatar doctor={d} />
              </span>
              <span className="dentist-card__body">
                <h3>{d.name}</h3>
                <span className="dentist-card__role">{d.role}</span>
                <span className="dentist-card__more">
                  View profile <i className="fa-solid fa-arrow-right" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Full-width call-to-action band. */
export function BookingBand() {
  return (
    <section className="booking-band">
      <div className="container booking-band__inner">
        <div>
          <h2>Ready for a healthier smile?</h2>
          <p>Book a check-up at {site.name}, {site.city}. We are open {site.openDays}.</p>
        </div>
        <div className="booking-band__actions">
          <Link to={paths.contact} className="btn btn-light">
            <i className="fa-regular fa-calendar" /> Book Appointment
          </Link>
          <a href={`tel:${site.bookingPhone.replace(/\D/g, '')}`} className="btn btn-outline-light">
            <i className="fa-solid fa-phone" /> {site.bookingPhone}
          </a>
        </div>
      </div>
    </section>
  )
}

/** Latest three blog posts; renders nothing when there are none (or the API is unavailable). */
export function LatestPosts() {
  const [posts, setPosts] = useState<BlogSummary[]>([])
  useEffect(() => {
    recentBlogs(undefined, 3).then(setPosts).catch(() => setPosts([]))
  }, [])
  if (posts.length === 0) return null
  return (
    <section className="section section--soft">
      <div className="container">
        <div className="section-row">
          <SectionHeading label="From our blog" title="Tips for a healthier smile" />
          <Link to={paths.blog} className="btn btn-outline">All articles</Link>
        </div>
        <div className="grid grid-3">
          {posts.map((b) => (
            <Link to={paths.post(b.slug)} className="post-tile" key={b.slug}>
              <span className="post-tile__img"><BlogThumb title={b.title} src={b.thumbnail} /></span>
              <span className="post-tile__body">
                <time dateTime={b.createdAt}>{formatDate(b.createdAt)}</time>
                <h3>{b.title}</h3>
                <p>{toExcerpt(b.excerpt, 100)}</p>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % Math.max(1, testimonials.length)), 6000)
    return () => clearInterval(t)
  }, [])
  if (testimonials.length === 0) return null
  const t = testimonials[i]
  return (
    <section className="section">
      <div className="container">
        <SectionHeading label="Patient stories" title="What our patients say" center />
        <figure className="review-card" key={i}>
          <i className="fa-solid fa-quote-left review-card__mark" />
          <blockquote>{t.text}</blockquote>
          <figcaption>{t.name}</figcaption>
        </figure>
      </div>
    </section>
  )
}

const filters: { key: 'all' | GalleryCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'endodontic', label: 'Endodontic' },
  { key: 'surgery', label: 'Surgery' },
  { key: 'dental', label: 'Dental' },
]

export function SmileGallery({ showEmpty }: { showEmpty?: boolean }) {
  const [filter, setFilter] = useState<'all' | GalleryCategory>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const items = galleryItems.filter((g) => filter === 'all' || g.category === filter)

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLightbox(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  if (galleryItems.length === 0) {
    return showEmpty ? (
      <section className="section">
        <div className="container center">
          <SectionHeading label="Gallery" title="Patient smiles" center>
            Photos of our work are coming soon.
          </SectionHeading>
        </div>
      </section>
    ) : null
  }

  return (
    <section className="section">
      <div className="container">
        <SectionHeading label="Gallery" title="Patient smiles" center>
          Real results from our patients.
        </SectionHeading>
        <div className="gallery-filters" role="tablist">
          {filters.map((f) => (
            <button key={f.key} role="tab" aria-selected={filter === f.key} className={filter === f.key ? 'is-active' : ''} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid grid-3">
          {items.map((g, n) => (
            <button className="grid-box" key={g.image} onClick={() => setLightbox(n)}>
              <img src={g.image} alt={g.title} loading="lazy" />
              <span className="image-mask">
                <i className="fa-solid fa-magnifying-glass-plus" />
                <span>{g.title}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      {lightbox !== null && items[lightbox] && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={items[lightbox].image} alt={items[lightbox].title} />
            <figcaption>{items[lightbox].title}</figcaption>
          </figure>
          <button className="lightbox__close" aria-label="Close">×</button>
        </div>
      )}
    </section>
  )
}

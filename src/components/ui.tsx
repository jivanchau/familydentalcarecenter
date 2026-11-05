import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../config/site'

export function useSeo(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : `${site.tagline} | ${site.name}`
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}

/** Page header used on every inner page: gradient band with the tooth pattern, centred title and breadcrumb. */
export function PageBanner({
  title,
  eyebrow,
  crumbs,
}: {
  title: string
  eyebrow?: string
  crumbs?: { label: string; to?: string }[]
}) {
  const trail = crumbs ?? [{ label: title }]
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/"><i className="fa-solid fa-house" /> Home</Link>
          {trail.map((c) => (
            <span key={c.label}>
              <i className="fa-solid fa-chevron-right" />
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </span>
          ))}
        </nav>
      </div>
    </section>
  )
}

/** Section heading: small coloured label above a left- or centre-aligned title. */
export function SectionHeading({
  label,
  title,
  children,
  center,
}: {
  label?: string
  title: string
  children?: ReactNode
  center?: boolean
}) {
  return (
    <div className={`section-heading${center ? ' is-center' : ''}`}>
      {label && <span className="section-heading__label">{label}</span>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}

export function Loader() {
  return (
    <div className="loader" role="status" aria-label="Loading">
      <span />
    </div>
  )
}

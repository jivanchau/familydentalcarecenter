import { Link, NavLink } from 'react-router-dom'
import { PageBanner, useSeo } from '../components/ui'
import { paths, site } from '../config/site'
import { treatments, type Treatment as TreatmentT } from '../lib/api'

export default function Treatment({ treatment }: { treatment: TreatmentT }) {
  useSeo(treatment.title, treatment.description)
  return (
    <>
      <PageBanner title={treatment.title} crumbs={[{ label: treatment.title.replace(/ in Nepalgunj$/i, '') }]} />
      <section className="section">
        <div className="container content-layout">
          {/* Trusted, pre-sanitized HTML from src/data/treatments.json */}
          <article className="prose" dangerouslySetInnerHTML={{ __html: treatment.body }} />
          <aside className="sidebar">
            <div className="sidebar-box">
              <h4>Treatments</h4>
              <ul className="sidebar-links">
                {treatments.map((t) => (
                  <li key={t.slug}>
                    <NavLink to={paths.treatment(t.slug)}>{t.title.replace(/ in Nepalgunj$/i, '')}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sidebar-box sidebar-cta">
              <h4>Need an appointment?</h4>
              <p>Call us or send a message and we’ll get back to you.</p>
              <a className="btn btn-light" href={`tel:${site.bookingPhone.replace(/\D/g, '')}`}><i className="fa-solid fa-phone" /> {site.bookingPhone}</a>
              <Link className="btn btn-custom" to={paths.contact}>Book Appointment</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

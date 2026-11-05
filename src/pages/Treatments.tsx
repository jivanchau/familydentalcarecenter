import { Link } from 'react-router-dom'
import { BookingBand } from '../components/sections'
import { PageBanner, SectionHeading, useSeo } from '../components/ui'
import { paths, site } from '../config/site'
import { treatmentGroups, treatments } from '../lib/api'

const shortTitle = (title: string) => title.replace(new RegExp(` in (Kohalpur|${site.city})$`, 'i'), '')

export default function Treatments() {
  useSeo('Treatments', `Dental treatments at ${site.name}, ${site.city}: braces, aligners, implants, root canal, cosmetic and family dentistry.`)
  return (
    <>
      <PageBanner title="Our Treatments" eyebrow={`${site.name} · ${site.city}`} crumbs={[{ label: 'Treatments' }]} />
      <section className="section">
        <div className="container">
          <SectionHeading label="What we do" title="Care for every smile" center>
            Choose a treatment to learn how it works, what to expect and how long it takes.
          </SectionHeading>
          <div className="treat-groups">
            {treatmentGroups.map((g) => (
              <article className="treat-group" key={g.key}>
                <header className="treat-group__head">
                  <span className="why-item__icon"><i className={`fa-solid ${g.icon}`} aria-hidden="true" /></span>
                  <div>
                    <h2>{g.label}</h2>
                    <p>{g.blurb}</p>
                  </div>
                </header>
                <ul className="treat-group__list">
                  {treatments
                    .filter((t) => t.group === g.key)
                    .map((t) => (
                      <li key={t.slug}>
                        <Link to={paths.treatment(t.slug)}>
                          {shortTitle(t.title)} <i className="fa-solid fa-arrow-right" />
                        </Link>
                      </li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <BookingBand />
    </>
  )
}

import { Link } from 'react-router-dom'
import { DoctorAvatar } from '../components/sections'
import { PageBanner, useSeo } from '../components/ui'
import { paths, site } from '../config/site'
import type { Doctor as DoctorT } from '../data/content'

export default function Doctor({ doctor }: { doctor: DoctorT }) {
  useSeo(doctor.name, `${doctor.name}, ${doctor.role} at ${site.name}, ${site.city}.`)
  const regNo = doctor.profile?.find((p) => p.label.includes('NMC'))?.value

  return (
    <>
      <PageBanner title={doctor.name} crumbs={[{ label: 'About Doctor' }]} />
      <section className="section">
        <div className="container doctor-layout">
          <aside className="doctor-card">
            <DoctorAvatar doctor={doctor} />
            <h2>{doctor.name}</h2>
            <p className="role">{doctor.role}</p>
            {regNo && <p className="doctor-card__reg">NMC Reg. No. {regNo}</p>}
            <h4>Contact Information</h4>
            {site.phones.map((p) => (
              <p key={p}><i className="fa-solid fa-phone" /> <a href={`tel:${p.replace(/\D/g, '')}`}>{p}</a></p>
            ))}
            <p><i className="fa-solid fa-envelope" /> <a href={`mailto:${site.email}`}>{site.email}</a></p>
            <Link to={paths.contact} className="btn btn-custom doctor-card__cta">Book Appointment</Link>
          </aside>

          <div className="doctor-body">
            <h2 className="heading-bar">About {doctor.name}</h2>
            <p className="doctor-role-line">{doctor.role}</p>
            {doctor.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}

            {doctor.profile && (
              <div className="doctor-section">
                <h3><i className="fa-solid fa-user-doctor" /> Professional Profile</h3>
                <dl className="profile-list">
                  {doctor.profile.map((p) => (
                    <div key={p.label}>
                      <dt>{p.label}</dt>
                      <dd>{p.value}</dd>
                    </div>
                  ))}
                </dl>
                {doctor.experience?.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
              </div>
            )}

            {!doctor.profile && doctor.memberships.length > 0 && (
              <ul className="check-list">
                {doctor.memberships.map((m) => (
                  <li key={m}><i className="fa-solid fa-circle-check" /> {m}</li>
                ))}
              </ul>
            )}

            {doctor.expertise && (
              <div className="doctor-section">
                <h3><i className="fa-solid fa-tooth" /> Areas of Expertise &amp; Clinical Focus</h3>
                {doctor.expertise.intro && <p>{doctor.expertise.intro}</p>}
                <div className="expertise-grid">
                  {doctor.expertise.items.map((e) => (
                    <div className="expertise-item" key={e.title}>
                      <i className="fa-solid fa-circle-check" />
                      <div>
                        <strong>{e.title}</strong>
                        <p>{e.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {doctor.philosophy && (
              <div className="doctor-section">
                <h3><i className="fa-solid fa-lightbulb" /> Our Treatment Philosophy</h3>
                <blockquote className="doctor-quote">“{doctor.philosophy.quote}”</blockquote>
                <p>{doctor.philosophy.text}</p>
              </div>
            )}

            {doctor.closing && (
              <div className="doctor-section">
                <h3><i className="fa-solid fa-house-medical" /> {doctor.closing.title}</h3>
                <p>{doctor.closing.text}</p>
              </div>
            )}

            <div className="doctor-cta">
              <div>
                <h3>Ready to Transform Your Smile?</h3>
                <p>Schedule your consultation today. Contact us to book an appointment or visit us at our clinic.</p>
              </div>
              <div className="doctor-cta__actions">
                <Link to={paths.contact} className="btn btn-light">Book Appointment</Link>
                <a href={`tel:${site.phones[1].replace(/\D/g, '')}`} className="btn btn-outline-light">
                  <i className="fa-solid fa-phone" /> {site.phones[1]}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

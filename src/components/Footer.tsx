import { Link } from 'react-router-dom'
import { footerLinks, paths, site } from '../config/site'

const socialIcons = [
  ['google', 'Google', 'fa-google'],
  ['facebook', 'Facebook', 'fa-facebook-f'],
  ['instagram', 'Instagram', 'fa-instagram'],
  ['youtube', 'YouTube', 'fa-youtube'],
] as const

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/img/brand/familydentacarelogo.png" alt={site.name} width={164} height={90} loading="lazy" />
          <p>
            Family and specialist dental care in {site.city} since {site.established}, from children’s check-ups to braces,
            implants and smile makeovers.
          </p>
          <div className="footer__social">
            {socialIcons.map(([key, label, icon]) =>
              site.social[key] ? (
                <a key={key} href={site.social[key]} target="_blank" rel="noreferrer" aria-label={label}>
                  <i className={`fab ${icon}`} />
                </a>
              ) : null,
            )}
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul className="footer__links">
            {footerLinks.quick.map((l) => (
              <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Popular Treatments</h4>
          <ul className="footer__links">
            {footerLinks.treatments.map((l) => (
              <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Visit Us</h4>
          <ul className="footer__contact">
            <li><i className="fa-solid fa-location-dot" /> <a href={site.mapLink} target="_blank" rel="noreferrer">{site.address}</a></li>
            <li>
              <i className="fa-solid fa-phone" />{' '}
              {site.phones.map((p, i) => (
                <a key={p} href={`tel:${p.replace(/\D/g, '')}`}>{p}{i < site.phones.length - 1 ? ', ' : ''}</a>
              ))}
            </li>
            <li><i className="fa-solid fa-envelope" /> <a href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
          <div className="footer__hours">
            {site.hours.map((h) => (
              <p key={h.label}><span>{h.label}</span> {h.value}</p>
            ))}
            <p className="footer__closed">{site.closed}</p>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {new Date().getFullYear()} {site.name}, {site.city}. All rights reserved.</span>
          <span>
            <Link to={paths.privacy}>Privacy</Link> · <Link to={paths.terms}>Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}

import { PageBanner, useSeo } from '../components/ui'
import { site } from '../config/site'

// Placeholder copy — replace with the clinic's approved legal text before launch.
const copy = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      `${site.name} respects your privacy. Information you share through our contact form (name, email, phone and message) is used only to respond to your enquiry and schedule appointments.`,
      'We do not sell or share your personal information with third parties, except where required by law.',
      `For questions about your data, contact us at ${site.email}.`,
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    body: [
      'Content on this website is for general information only and is not a substitute for a professional dental consultation.',
      'Treatment costs mentioned are indicative and may vary depending on the case after clinical examination.',
      'Appointments are subject to availability. Please call the clinic to confirm.',
    ],
  },
}

export default function Legal({ kind }: { kind: keyof typeof copy }) {
  const c = copy[kind]
  useSeo(c.title)
  return (
    <>
      <PageBanner title={c.title} />
      <section className="section">
        <div className="container prose narrow">
          {c.body.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </div>
      </section>
    </>
  )
}

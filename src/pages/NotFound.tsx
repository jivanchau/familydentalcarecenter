import { Link } from 'react-router-dom'
import { PageBanner, useSeo } from '../components/ui'

export default function NotFound() {
  useSeo('Page not found')
  return (
    <>
      <PageBanner title="Page not found" />
      <section className="section">
        <div className="container center">
          <p>The page you’re looking for doesn’t exist or has moved.</p>
          <Link to="/" className="btn btn-custom btn-lg">Back to Home</Link>
        </div>
      </section>
    </>
  )
}

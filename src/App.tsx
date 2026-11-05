import { createBrowserRouter, Navigate, RouterProvider, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import { paths } from './config/site'
import { doctors } from './data/content'
import { findTreatment } from './lib/api'
import About from './pages/About'
import { AdminEditor, AdminList } from './pages/Admin'
import BlogPost from './pages/BlogPost'
import Blogs from './pages/Blogs'
import Contact from './pages/Contact'
import Doctor from './pages/Doctor'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import Treatment from './pages/Treatment'
import Treatments from './pages/Treatments'

function TreatmentPage() {
  const { slug = '' } = useParams()
  const treatment = findTreatment(slug)
  return treatment ? <Treatment key={slug} treatment={treatment} /> : <NotFound />
}

function DentistPage() {
  const { slug = '' } = useParams()
  const doctor = doctors.find((d) => d.slug === slug)
  return doctor ? <Doctor key={slug} doctor={doctor} /> : <NotFound />
}

/** Old top-level URLs (/root-canal, /dr-ramesh-ram-bhandari, …) → their new address. public/_redirects does the same with a 301 in production. */
function LegacySlug() {
  const { slug = '' } = useParams()
  if (findTreatment(slug)) return <Navigate to={paths.treatment(slug)} replace />
  const doctor = doctors.find((d) => d.slug === slug || `dr-${d.slug}` === slug)
  if (doctor) return <Navigate to={paths.dentist(doctor.slug)} replace />
  return <NotFound />
}

const moved = (path: string, to: string) => ({ path, element: <Navigate to={to} replace /> })

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: paths.home, element: <Home /> },
      { path: paths.about, element: <About /> },
      { path: paths.treatments, element: <Treatments /> },
      { path: '/treatments/:slug', element: <TreatmentPage /> },
      { path: '/dentists/:slug', element: <DentistPage /> },
      { path: paths.gallery, element: <Gallery /> },
      { path: paths.blog, element: <Blogs /> },
      { path: '/blog/:slug', element: <BlogPost /> },
      { path: paths.contact, element: <Contact /> },
      { path: '/admin', element: <AdminList /> },
      { path: '/admin/new', element: <AdminEditor /> },
      { path: '/admin/edit/:slug', element: <AdminEditor /> },
      { path: paths.privacy, element: <Legal kind="privacy" /> },
      { path: paths.terms, element: <Legal kind="terms" /> },
      moved('/about-clinic', paths.about),
      moved('/blogs', paths.blog),
      moved('/updates', paths.blog),
      moved('/contact-us', paths.contact),
      moved('/terms-and-conditions', paths.terms),
      { path: '/:slug', element: <LegacySlug /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}

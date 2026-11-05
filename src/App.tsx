import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom'
import Layout from './components/Layout'
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

/** Top-level slugs mirror the old site's .php names (minus extension) so redirects stay 1:1. */
function SlugPage() {
  const { slug = '' } = useParams()
  const treatment = findTreatment(slug)
  if (treatment) return <Treatment key={slug} treatment={treatment} />
  const doctor = doctors.find((d) => d.slug === slug)
  if (doctor) return <Doctor doctor={doctor} />
  return <NotFound />
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about-clinic', element: <About /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/blogs', element: <Blogs /> },
      { path: '/updates', element: <Blogs /> },
      { path: '/blog/:slug', element: <BlogPost /> },
      { path: '/contact-us', element: <Contact /> },
      { path: '/admin', element: <AdminList /> },
      { path: '/admin/new', element: <AdminEditor /> },
      { path: '/admin/edit/:slug', element: <AdminEditor /> },
      { path: '/privacy-policy', element: <Legal kind="privacy" /> },
      { path: '/terms-and-conditions', element: <Legal kind="terms" /> },
      { path: '/:slug', element: <SlugPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}

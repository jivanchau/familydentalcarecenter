import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BlogThumb } from '../components/blog'
import { Loader, PageBanner, useSeo } from '../components/ui'
import { site } from '../config/site'
import { BLOGS_PER_PAGE, fetchBlogs, formatDate, toExcerpt, type BlogSummary } from '../lib/api'

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ok'; items: BlogSummary[]; total: number }

export default function Blogs() {
  useSeo('Blogs', `Dental health tips and treatment guides from the dentists at ${site.name}, ${site.city}.`)
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let live = true
    setState({ status: 'loading' })
    fetchBlogs(page)
      .then((d) => live && setState({ status: 'ok', ...d }))
      .catch((e: Error) => live && setState({ status: 'error', message: e.message }))
    return () => {
      live = false
    }
  }, [page])

  const goTo = (n: number) => {
    setParams(n === 1 ? {} : { page: String(n) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages = state.status === 'ok' ? Math.ceil(state.total / BLOGS_PER_PAGE) : 0

  return (
    <>
      <PageBanner title="Blogs" />
      <section className="section">
        <div className="container">
          {state.status === 'loading' && <Loader />}

          {state.status === 'error' && <p className="center empty-state">{state.message}</p>}

          {state.status === 'ok' && state.items.length === 0 && (
            <div className="center empty-state">
              <i className="fa-regular fa-newspaper" />
              <p>No articles yet. Check back soon for dental tips from our team.</p>
            </div>
          )}

          {state.status === 'ok' && state.items.length > 0 && (
            <>
              <div className="grid grid-3">
                {state.items.map((b) => (
                  <article className="blog-card" key={b.slug}>
                    <Link to={`/blog/${b.slug}`} className="blog-card__img" tabIndex={-1}>
                      <BlogThumb title={b.title} src={b.thumbnail} />
                    </Link>
                    <div className="blog-card__body">
                      <time dateTime={b.createdAt}><i className="fa-regular fa-calendar" /> {formatDate(b.createdAt)}</time>
                      <h3><Link to={`/blog/${b.slug}`}>{b.title}</Link></h3>
                      <p>{toExcerpt(b.excerpt)}</p>
                      <Link to={`/blog/${b.slug}`} className="btn btn-custom">Read More</Link>
                    </div>
                  </article>
                ))}
              </div>

              {pages > 1 && (
                <nav className="pagination" aria-label="Blog pages">
                  {page > 1 && <button onClick={() => goTo(page - 1)}>Prev</button>}
                  {Array.from({ length: pages }, (_, n) => n + 1).map((n) => (
                    <button key={n} className={n === page ? 'is-active' : ''} aria-current={n === page ? 'page' : undefined} onClick={() => goTo(n)}>
                      {n}
                    </button>
                  ))}
                  {page < pages && <button onClick={() => goTo(page + 1)}>Next</button>}
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

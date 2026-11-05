import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BlogThumb, RichText } from '../components/blog'
import ShareButtons from '../components/ShareButtons'
import { Loader, PageBanner, useSeo } from '../components/ui'
import { paths, site } from '../config/site'
import { fetchBlog, formatDate, recentBlogs, toExcerpt, type Blog, type BlogSummary } from '../lib/api'
import NotFound from './NotFound'

export default function BlogPost() {
  const { slug = '' } = useParams()
  // undefined = loading, null = not found
  const [post, setPost] = useState<Blog | null | undefined>(undefined)
  const [error, setError] = useState('')
  const [recent, setRecent] = useState<BlogSummary[]>([])
  useSeo(post?.title ?? 'Blog', post ? toExcerpt(post.description, 155) : undefined)

  useEffect(() => {
    let live = true
    setPost(undefined)
    setError('')
    fetchBlog(slug)
      .then((p) => live && setPost(p))
      .catch((e: Error) => live && setError(e.message))
    recentBlogs(slug)
      .then((r) => live && setRecent(r))
      .catch(() => live && setRecent([]))
    return () => {
      live = false
    }
  }, [slug])

  if (post === null) return <NotFound />

  return (
    <>
      <PageBanner title={post?.title ?? 'Blog'} crumbs={[{ label: 'Blogs', to: paths.blog }]} />
      <section className="section">
        <div className="container content-layout">
          {error ? (
            <p className="empty-state">{error}</p>
          ) : !post ? (
            <Loader />
          ) : (
            <div>
              {post.thumbnail && <img className="post-cover" src={post.thumbnail} alt="" />}
              <p className="post-meta">
                <i className="fa-regular fa-calendar" /> {formatDate(post.createdAt)} · {site.name}
              </p>
              <article className="prose">
                <RichText text={post.description} />
              </article>
              <ShareButtons title={post.title} />
              <Link to={paths.blog} className="btn btn-custom post-back">
                <i className="fa-solid fa-arrow-left" /> All articles
              </Link>
            </div>
          )}
          <aside className="sidebar">
            {recent.length > 0 && (
              <div className="sidebar-box">
                <h4>Recent Posts</h4>
                <ul className="recent-posts">
                  {recent.map((r) => (
                    <li key={r.slug}>
                      <Link to={paths.post(r.slug)}>
                        <BlogThumb title={r.title} src={r.thumbnail} small />
                        <span>{r.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="sidebar-box sidebar-cta">
              <h4>Book a Visit</h4>
              <p>{site.address}</p>
              <Link className="btn btn-custom" to={paths.contact}>Book Appointment</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import RichTextEditor from '../components/admin/RichTextEditor'
import ThumbnailUpload from '../components/admin/ThumbnailUpload'
import { BlogThumb } from '../components/blog'
import { Loader, PageBanner, useSeo } from '../components/ui'
import { admin, ApiError, formatDate, slugify, type Blog } from '../lib/api'

/** Keeps the admin out of search results. */
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
}

type Auth = 'checking' | 'signed-out' | 'signed-in' | { error: string }

/** Wraps every admin screen: shows the login form until the session cookie is valid. */
function AdminGate({ children }: { children: (logout: () => void) => ReactNode }) {
  useNoIndex()
  const [auth, setAuth] = useState<Auth>('checking')

  useEffect(() => {
    admin
      .me()
      .then(() => setAuth('signed-in'))
      .catch((e: ApiError) => setAuth(e.status === 401 ? 'signed-out' : { error: e.message }))
  }, [])

  const logout = useCallback(() => {
    admin.logout().finally(() => setAuth('signed-out'))
  }, [])

  if (auth === 'checking') return <section className="section"><Loader /></section>
  if (typeof auth === 'object') return <section className="section"><p className="container center empty-state">{auth.error}</p></section>
  if (auth === 'signed-out') return <LoginForm onSuccess={() => setAuth('signed-in')} />
  return <>{children(logout)}</>
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setError('')
    try {
      await admin.login(String(f.get('username')), String(f.get('password')))
      onSuccess()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section">
      <form className="admin-card admin-login" onSubmit={submit}>
        <h2><i className="fa-solid fa-lock" /> Admin sign in</h2>
        <label>
          Username
          <input name="username" autoComplete="username" required autoFocus />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {error && <p className="form-status is-error" role="alert">{error}</p>}
        <button className="btn btn-custom btn-lg" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </section>
  )
}

function AdminBar({ title, logout, back }: { title: string; logout: () => void; back?: boolean }) {
  return (
    <div className="admin-bar">
      <h2>{title}</h2>
      <div className="admin-bar__actions">
        {back && <Link to="/admin" className="btn btn-light-outline"><i className="fa-solid fa-arrow-left" /> All posts</Link>}
        <button className="btn btn-light-outline" onClick={logout}><i className="fa-solid fa-right-from-bracket" /> Sign out</button>
      </div>
    </div>
  )
}

/** /admin — list of posts. */
export function AdminList() {
  useSeo('Admin')
  return (
    <>
      <PageBanner title="Blog Admin" crumbs={[{ label: 'Admin' }]} />
      <AdminGate>{(logout) => <PostList logout={logout} />}</AdminGate>
    </>
  )
}

function PostList({ logout }: { logout: () => void }) {
  const [posts, setPosts] = useState<Omit<Blog, 'description'>[] | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    admin.list().then((d) => setPosts(d.items)).catch((e: Error) => setError(e.message))
  }, [])
  useEffect(load, [load])

  async function remove(slug: string, title: string) {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return
    try {
      await admin.remove(slug)
      load()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <AdminBar title="Blog posts" logout={logout} />
        <div className="admin-card">
          <div className="admin-card__head">
            <span>{posts ? `${posts.length} post${posts.length === 1 ? '' : 's'}` : ''}</span>
            <Link to="/admin/new" className="btn btn-custom"><i className="fa-solid fa-plus" /> New post</Link>
          </div>
          {error && <p className="form-status is-error">{error}</p>}
          {!posts ? (
            <Loader />
          ) : posts.length === 0 ? (
            <p className="empty-state center">No posts yet. Click “New post” to write your first article.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th aria-label="Thumbnail" /><th>Title</th><th>Slug</th><th>Created</th><th aria-label="Actions" /></tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.slug}>
                    <td className="admin-table__thumb"><BlogThumb title={p.title} src={p.thumbnail} small /></td>
                    <td data-label="Title"><a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">{p.title}</a></td>
                    <td data-label="Slug"><code>{p.slug}</code></td>
                    <td data-label="Created">{formatDate(p.createdAt)}</td>
                    <td className="admin-table__actions">
                      <Link to={`/admin/edit/${p.slug}`} className="icon-btn" aria-label={`Edit ${p.title}`}><i className="fa-solid fa-pen" /></Link>
                      <button className="icon-btn is-danger" onClick={() => remove(p.slug, p.title)} aria-label={`Delete ${p.title}`}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  )
}

/** /admin/new and /admin/edit/:slug */
export function AdminEditor() {
  const { slug } = useParams()
  useSeo(slug ? 'Edit post' : 'New post')
  return (
    <>
      <PageBanner title={slug ? 'Edit Post' : 'New Post'} crumbs={[{ label: 'Admin', to: '/admin' }, { label: slug ? 'Edit' : 'New' }]} />
      <AdminGate>{(logout) => <PostForm key={slug ?? 'new'} slug={slug} logout={logout} />}</AdminGate>
    </>
  )
}

function PostForm({ slug, logout }: { slug?: string; logout: () => void }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [postSlug, setPostSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(Boolean(slug))
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(Boolean(slug))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!slug) return
    admin
      .get(slug)
      .then((p) => {
        setTitle(p.title)
        setPostSlug(p.slug)
        setDescription(p.description)
        setThumbnail(p.thumbnail)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  function onTitle(v: string) {
    setTitle(v)
    if (!slugEdited) setPostSlug(slugify(v)) // auto-fill slug until the user edits it
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = { title, slug: postSlug, description, thumbnail }
      if (slug) await admin.update(slug, data)
      else await admin.create(data)
      navigate('/admin')
    } catch (err) {
      setError((err as Error).message)
      setSaving(false)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <AdminBar title={slug ? 'Edit post' : 'Write a new post'} logout={logout} back />
        {loading ? (
          <Loader />
        ) : (
          <form className="admin-card admin-form" onSubmit={submit}>
            <label>
              Title
              <input value={title} onChange={(e) => onTitle(e.target.value)} required minLength={3} maxLength={150} placeholder="e.g. 5 Tips for Healthy Gums" />
            </label>
            <label>
              Slug <small>(web address: /blog/<strong>{postSlug || 'your-slug'}</strong>)</small>
              <input
                value={postSlug}
                onChange={(e) => {
                  setSlugEdited(true)
                  setPostSlug(e.target.value.toLowerCase())
                }}
                required
                maxLength={120}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                title="Lowercase letters, numbers and single hyphens only"
                placeholder="5-tips-for-healthy-gums"
              />
            </label>
            <div className="admin-field">
              <span className="admin-field__label">Thumbnail <small>(optional — shown on the blog list and at the top of the post)</small></span>
              <ThumbnailUpload value={thumbnail} onChange={setThumbnail} onBusyChange={setUploading} />
            </div>
            <div className="admin-field">
              <span className="admin-field__label">Description</span>
              <RichTextEditor value={description} onChange={setDescription} minLength={20} />
            </div>
            {error && <p className="form-status is-error" role="alert">{error}</p>}
            <div className="admin-form__actions">
              <button className="btn btn-custom btn-lg" disabled={saving || uploading}>
                {uploading ? 'Uploading image…' : saving ? 'Saving…' : slug ? 'Save changes' : 'Publish post'}
              </button>
              <Link to="/admin" className="btn btn-outline">Cancel</Link>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'

type Props = { title: string; url?: string }

/**
 * Share bar for blog posts.
 * - Facebook: opens Facebook's share dialog (the preview card comes from the og: tags added by functions/blog/[slug].ts).
 * - Instagram: there is no web "share link to Instagram" URL, so on phones we open the system share sheet
 *   (which lists Instagram, WhatsApp, …); on desktop we copy the link for pasting into Instagram.
 * - Copy link: copies the post URL.
 */
export default function ShareButtons({ title, url }: Props) {
  const [toast, setToast] = useState('')
  const link = url ?? (typeof window !== 'undefined' ? window.location.href : '')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(t)
  }, [toast])

  async function copy(message: string) {
    try {
      await navigator.clipboard.writeText(link)
      setToast(message)
    } catch {
      window.prompt('Copy this link:', link)
    }
  }

  function shareFacebook() {
    const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`
    const w = 600
    const h = 560
    const left = window.screenX + (window.outerWidth - w) / 2
    const top = window.screenY + (window.outerHeight - h) / 2
    const popup = window.open(href, 'fb-share', `width=${w},height=${h},left=${left},top=${top},noopener`)
    if (!popup) window.location.href = href // popup blocked → open in the same tab
  }

  async function shareInstagram() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch && navigator.share) {
      try {
        await navigator.share({ title, url: link })
        return
      } catch (e) {
        if ((e as Error).name === 'AbortError') return // user closed the share sheet
      }
    }
    await copy('Link copied — paste it into your Instagram story, bio or message.')
  }

  return (
    <div className="share-bar">
      <span className="share-bar__label">Share this article</span>
      <div className="share-bar__buttons">
        <button type="button" className="share-btn share-btn--facebook" onClick={shareFacebook} aria-label="Share on Facebook">
          <i className="fab fa-facebook-f" />
          <span>Facebook</span>
        </button>
        <button type="button" className="share-btn share-btn--instagram" onClick={shareInstagram} aria-label="Share on Instagram">
          <i className="fab fa-instagram" />
          <span>Instagram</span>
        </button>
        <button type="button" className="share-btn share-btn--link" onClick={() => copy('Link copied to clipboard.')} aria-label="Copy link">
          <i className="fa-solid fa-link" />
          <span>Copy link</span>
        </button>
      </div>
      {toast && (
        <p className="share-toast" role="status">
          <i className="fa-solid fa-circle-check" /> {toast}
        </p>
      )}
    </div>
  )
}

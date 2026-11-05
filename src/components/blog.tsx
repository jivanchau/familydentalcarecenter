import type { ReactNode } from 'react'
import { formatDate } from '../lib/api'

/** Only these link targets are rendered as links; anything else (e.g. javascript:) stays plain text. */
const SAFE_URL = /^(https?:\/\/|mailto:|tel:|\/(?!\/))/i

/** Inline formatting: **bold**, *italic*, [text](url). Everything is rendered as React text (never HTML). */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const k = `${keyBase}-${m.index}`
    if (m[1] !== undefined) out.push(<strong key={k}>{inline(m[1], k)}</strong>)
    else if (m[2] !== undefined) out.push(<em key={k}>{inline(m[2], k)}</em>)
    else if (SAFE_URL.test(m[4])) {
      const external = /^https?:/i.test(m[4])
      out.push(
        <a key={k} href={m[4]} {...(external ? { target: '_blank', rel: 'noopener noreferrer nofollow' } : {})}>
          {m[3]}
        </a>,
      )
    } else out.push(m[0])
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/**
 * Renders a post description written in the admin editor (a small, safe Markdown subset):
 * blank line = paragraph · "## " heading · "### " subheading · "- " bullets · "1. " numbered ·
 * "> " quote · **bold** · *italic* · [link](https://…). Single line breaks are kept.
 */
export function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  let para: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let quote: string[] = []

  const withBreaks = (lines: string[], k: string) =>
    lines.flatMap((l, i) => (i ? [<br key={`${k}-br${i}`} />, ...inline(l, `${k}-${i}`)] : inline(l, `${k}-${i}`)))
  const flush = () => {
    const k = `b${blocks.length}`
    if (para.length) blocks.push(<p key={k}>{withBreaks(para, k)}</p>)
    else if (list) {
      const items = list.items.map((li, i) => <li key={i}>{inline(li, `${k}-${i}`)}</li>)
      blocks.push(list.ordered ? <ol key={k}>{items}</ol> : <ul key={k}>{items}</ul>)
    } else if (quote.length) blocks.push(<blockquote key={k}>{withBreaks(quote, k)}</blockquote>)
    para = []
    list = null
    quote = []
  }

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    let m: RegExpMatchArray | null
    if (!line) flush()
    else if ((m = line.match(/^(#{2,3})\s+(.*)$/))) {
      flush()
      const k = `b${blocks.length}`
      blocks.push(m[1] === '##' ? <h2 key={k}>{inline(m[2], k)}</h2> : <h3 key={k}>{inline(m[2], k)}</h3>)
    } else if ((m = line.match(/^(?:([-*])|(\d+)\.)\s+(.*)$/))) {
      const ordered = Boolean(m[2])
      if (!list || list.ordered !== ordered) {
        flush()
        list = { ordered, items: [] }
      }
      list.items.push(m[3])
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      if (!quote.length) flush()
      quote.push(m[1])
    } else {
      if (list || quote.length) flush()
      para.push(line)
    }
  }
  flush()
  return <>{blocks}</>
}

/** Post thumbnail: the uploaded image, or a branded placeholder generated from the title. */
export function BlogThumb({ title, src, date, small }: { title: string; src?: string | null; date?: string; small?: boolean }) {
  if (src) {
    return (
      <div className={`blog-thumb blog-thumb--image${small ? ' blog-thumb--small' : ''}`}>
        <img src={src} alt="" loading="lazy" />
      </div>
    )
  }
  return (
    <div className={`blog-thumb${small ? ' blog-thumb--small' : ''}`} aria-hidden="true">
      <i className="fa-solid fa-tooth blog-thumb__icon" />
      {!small && (
        <div className="blog-thumb__text">
          {date && <span>{formatDate(date)}</span>}
          <strong>{title}</strong>
        </div>
      )}
    </div>
  )
}

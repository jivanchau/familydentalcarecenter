import { useRef, type KeyboardEvent } from 'react'
import { RichText } from '../blog'

type Props = { value: string; onChange: (value: string) => void; minLength?: number }

type Tool = { icon: string; label: string; shortcut?: string; run: (ta: HTMLTextAreaElement) => [string, number, number] }

/** Wraps the selection in `before`/`after` (or toggles it off if already wrapped). */
const wrap = (before: string, after: string, placeholder: string): Tool['run'] => (ta) => {
  const { value, selectionStart: s, selectionEnd: e } = ta
  const selected = value.slice(s, e) || placeholder
  if (value.slice(s - before.length, s) === before && value.slice(e, e + after.length) === after) {
    const next = value.slice(0, s - before.length) + selected + value.slice(e + after.length)
    return [next, s - before.length, s - before.length + selected.length]
  }
  const next = value.slice(0, s) + before + selected + after + value.slice(e)
  return [next, s + before.length, s + before.length + selected.length]
}

/** Adds (or removes) a prefix at the start of every selected line. */
const prefixLines = (prefix: (i: number) => string, pattern: RegExp): Tool['run'] => (ta) => {
  const { value, selectionStart: s, selectionEnd: e } = ta
  const start = value.lastIndexOf('\n', s - 1) + 1
  const endIdx = value.indexOf('\n', e)
  const end = endIdx === -1 ? value.length : endIdx
  const lines = value.slice(start, end).split('\n')
  const allPrefixed = lines.every((l) => pattern.test(l))
  const updated = lines.map((l, i) => (allPrefixed ? l.replace(pattern, '') : prefix(i) + l.replace(/^(#{2,3}\s|[-*]\s|\d+\.\s|>\s?)/, ''))).join('\n')
  return [value.slice(0, start) + updated + value.slice(end), start, start + updated.length]
}

const TOOLS: (Tool | 'sep')[] = [
  { icon: 'fa-bold', label: 'Bold', shortcut: 'b', run: wrap('**', '**', 'bold text') },
  { icon: 'fa-italic', label: 'Italic', shortcut: 'i', run: wrap('*', '*', 'italic text') },
  'sep',
  { icon: 'fa-heading', label: 'Heading', run: prefixLines(() => '## ', /^##\s/) },
  { icon: 'fa-font', label: 'Subheading', run: prefixLines(() => '### ', /^###\s/) },
  'sep',
  { icon: 'fa-list-ul', label: 'Bullet list', run: prefixLines(() => '- ', /^[-*]\s/) },
  { icon: 'fa-list-ol', label: 'Numbered list', run: prefixLines((i) => `${i + 1}. `, /^\d+\.\s/) },
  { icon: 'fa-quote-left', label: 'Quote', run: prefixLines(() => '> ', /^>\s?/) },
  'sep',
  {
    icon: 'fa-link',
    label: 'Link',
    shortcut: 'k',
    run: (ta) => {
      const url = window.prompt('Link address (https://… , /contact-us , tel:… )', 'https://')
      if (!url || url === 'https://') return [ta.value, ta.selectionStart, ta.selectionEnd]
      return wrap('[', `](${url.trim()})`, 'link text')(ta)
    },
  },
]

/** A small formatting toolbar over a textarea, with a live preview of exactly what visitors will see. */
export default function RichTextEditor({ value, onChange, minLength }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)

  function apply(tool: Tool) {
    const ta = ref.current
    if (!ta) return
    const [next, selStart, selEnd] = tool.run(ta)
    onChange(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(selStart, selEnd)
    })
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (!(e.metaKey || e.ctrlKey)) return
    const tool = TOOLS.find((t): t is Tool => t !== 'sep' && t.shortcut === e.key.toLowerCase())
    if (tool) {
      e.preventDefault()
      apply(tool)
    }
  }

  return (
    <div className="rte">
      <div className="rte__toolbar" role="toolbar" aria-label="Text formatting">
        {TOOLS.map((t, i) =>
          t === 'sep' ? (
            <span key={i} className="rte__sep" />
          ) : (
            <button
              key={t.label}
              type="button"
              className="rte__btn"
              title={t.shortcut ? `${t.label} (Ctrl/⌘+${t.shortcut.toUpperCase()})` : t.label}
              aria-label={t.label}
              onMouseDown={(e) => e.preventDefault()} // keep the textarea selection
              onClick={() => apply(t)}
            >
              <i className={`fa-solid ${t.icon}`} />
              {t.label === 'Subheading' && <small>2</small>}
            </button>
          ),
        )}
      </div>
      <div className="rte__panes">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          required
          minLength={minLength}
          rows={18}
          aria-label="Description"
          placeholder={'Start writing your article…\n\nSelect text and use the toolbar to make it bold, a heading, a list, or a link.'}
        />
        <div className="rte__preview prose" aria-label="Preview">
          <span className="rte__preview-label">Preview</span>
          {value.trim() ? <RichText text={value} /> : <p className="muted">Your formatted article will appear here.</p>}
        </div>
      </div>
    </div>
  )
}

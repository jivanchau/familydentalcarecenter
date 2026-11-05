import { useRef, useState, type DragEvent } from 'react'
import { admin } from '../../lib/api'

const MAX_W = 1600
const MAX_H = 1000

/**
 * Resizes (max 1600×1000) and compresses the picked image in the browser, so a 6 MB phone photo
 * uploads as roughly 100–300 KB. Prefers WebP; falls back to JPEG where WebP encoding is unsupported.
 */
async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_W / bitmap.width, MAX_H / bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff' // flatten transparency (PNG → JPEG)
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const toBlob = (type: string, q: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, q))
  const webp = await toBlob('image/webp', 0.82)
  if (webp && webp.type === 'image/webp') return webp
  const jpeg = await toBlob('image/jpeg', 0.85)
  if (!jpeg) throw new Error('Could not process this image.')
  return jpeg
}

type Props = { value: string | null; onChange: (url: string | null) => void; onBusyChange?: (busy: boolean) => void }

export default function ThumbnailUpload({ value, onChange, onBusyChange }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusyState] = useState(false)
  const setBusy = (b: boolean) => {
    setBusyState(b)
    onBusyChange?.(b)
  }
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  async function handle(file?: File) {
    if (!file) return
    setError('')
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setError('Please choose a JPG, PNG or WebP image.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('That image is over 20 MB. Please choose a smaller one.')
      return
    }
    setBusy(true)
    try {
      const { url } = await admin.upload(await compress(file))
      onChange(url)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    handle(e.dataTransfer.files[0])
  }

  return (
    <div className="thumb-upload">
      <div
        className={`thumb-upload__drop${dragging ? ' is-dragging' : ''}${value ? ' has-image' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {value ? (
          <img src={value} alt="Thumbnail preview" />
        ) : (
          <div className="thumb-upload__empty">
            <i className="fa-regular fa-image" />
            <span>Drag an image here, or</span>
          </div>
        )}
        {busy && (
          <div className="thumb-upload__busy" role="status">
            <span className="spinner" /> Uploading…
          </div>
        )}
      </div>
      <div className="thumb-upload__actions">
        <button type="button" className="btn btn-outline" onClick={() => input.current?.click()} disabled={busy}>
          <i className="fa-solid fa-upload" /> {value ? 'Change image' : 'Choose image'}
        </button>
        {value && (
          <button type="button" className="btn btn-outline is-danger" onClick={() => onChange(null)} disabled={busy}>
            <i className="fa-solid fa-xmark" /> Remove
          </button>
        )}
        <small>JPG, PNG or WebP. Landscape works best (about 1200 × 750). Resized automatically.</small>
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => handle(e.target.files?.[0])} />
      {error && <p className="form-status is-error" role="alert">{error}</p>}
    </div>
  )
}

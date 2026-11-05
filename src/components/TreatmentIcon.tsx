// Line icons for the treatment cards. They draw with `currentColor`, so CSS controls the colour
// (primary blue by default, white on card hover) and they follow any theme change automatically.

import type { ReactNode } from 'react'

export type TreatmentIconName = 'implant' | 'braces' | 'root-canal' | 'bridge' | 'whitening' | 'veneers'

// Molar outline on a 64x64 grid (crown on top, two roots).
const TOOTH =
  'M21 7c-7 0-12 5-12 12 0 6 3 10 4 16 1 8 3 20 8 20 4 0 4-8 6-13 1-3 3-4 5-4s4 1 5 4c2 5 2 13 6 13 5 0 7-12 8-20 1-6 4-10 4-16 0-7-5-12-12-12-5 0-7 3-11 3s-6-3-11-3z'

/** One crown, 20 units wide, starting at x=ox with its top at y. */
const crown = (ox: number, y: number) =>
  `M${ox} ${y + 18}V${y + 8}c0-5 2.5-8 6-8 1.6 0 2.6 1 4 1s2.4-1 4-1c3.5 0 6 3 6 8v10z`

const icons: Record<TreatmentIconName, ReactNode> = {
  implant: (
    <>
      <path d="M22 5c-5 0-8 4-8 9 0 4 2 7 3 9h30c1-2 3-5 3-9 0-5-3-9-8-9-4 0-6 2-10 2s-6-2-10-2z" />
      <rect x="26" y="23" width="12" height="6" rx="1.5" />
      <path d="M25 29h14l-2 21-5 7-5-7z" />
      <path d="M24.5 35l15-3M25 40.5l14-3M25.5 46l13-3M26.5 51l11-2.5" />
    </>
  ),
  braces: (
    <>
      <path d={TOOTH} />
      <path d="M2 23h60" />
      <rect x="24" y="16" width="16" height="14" rx="2.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M28 16v-3M36 16v-3M28 30v3M36 30v3" />
    </>
  ),
  'root-canal': (
    <>
      <path d={TOOTH} />
      <path d="M25 22c3-4 11-4 14 0v5c-4 3-10 3-14 0z" fill="currentColor" fillOpacity="0.2" />
      <path d="M27 28l-6 21M37 28l6 21" />
      <path d="M32 1v19" strokeWidth="2" />
      <rect x="29" y="-2" width="6" height="7" rx="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  bridge: (
    <>
      <path d={crown(2, 12)} />
      <path d={crown(22, 12)} fill="currentColor" fillOpacity="0.15" />
      <path d={crown(42, 12)} />
      <path d="M6 30l2 18c.4 3 4.6 3 5 0l1-10 1 10c.4 3 4.6 3 5 0l2-18" />
      <path d="M44 30l2 18c.4 3 4.6 3 5 0l1-10 1 10c.4 3 4.6 3 5 0l2-18" />
      <path d="M2 56h60" strokeDasharray="3 4" />
    </>
  ),
  whitening: (
    <>
      <path d={TOOTH} />
      <path d="M17 18c0-4 2-6 5-7" />
      <path d="M52 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="currentColor" stroke="none" />
      <path d="M58 20l1.2 3.3 3.3 1.2-3.3 1.2L58 29l-1.2-3.3-3.3-1.2 3.3-1.2z" fill="currentColor" stroke="none" />
      <path d="M6 4l1 2.8 2.8 1-2.8 1L6 11.6 5 8.8 2.2 7.8 5 6.8z" fill="currentColor" stroke="none" />
    </>
  ),
  veneers: (
    <>
      {/* front tooth with a thin shell (the veneer) lifted off its front surface */}
      <path d="M26 6h18c3 0 5 2 5 5l-2 20c-1 8-4 24-12 27-8-3-11-19-12-27l-2-20c0-3 2-5 5-5z" />
      <path d="M17 10c0-3 2-5 5-5M17 10l2 19c.6 5 1.6 9 3 13" strokeWidth="4" strokeOpacity="0.55" />
      <path d="M8 22h5m-2.5-2.5v5" strokeWidth="2" />
    </>
  ),
}

export default function TreatmentIcon({ name, className }: { name: TreatmentIconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="-2 -4 68 68"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}

// Static page content (home, about, team, gallery). Blogs and treatments live in JSON.
// Items marked TODO are placeholders: replace them with the clinic's real details before launch.
import type { TreatmentIconName } from '../components/TreatmentIcon'
import { paths, site } from '../config/site'

export const heroSlides: { image: string; position: string; title: [string, string]; text: string; to: string; cta: string }[] = [
  {
    image: '/img/images/hero-smile.jpg',
    position: '76% center', // keeps the smile in view when narrow screens crop the sides
    title: ['Healthy Teeth,', 'Happy Smiles'],
    text: 'From check-ups to complete smile makeovers, all under one roof',
    to: paths.contact,
    cta: 'Book a Visit',
  },
  {
    image: '/img/images/hero-implant.jpg', // photo: Jonathan Borba on Unsplash (Unsplash License)
    position: '70% center',
    title: ['Fill The Gap,', 'Restore Your Smile'],
    text: 'Long-lasting implants, crowns and bridges for missing teeth',
    to: paths.treatment('dental-implants'),
    cta: 'Explore Implants',
  },
  {
    image: '/img/images/hero-root-canal.jpg', // custom illustration
    position: '72% center',
    title: ["Don't Lose It,", 'Save It'],
    text: 'A root canal can save a badly decayed or infected tooth',
    to: paths.treatment('root-canal'),
    cta: 'About Root Canals',
  },
]

/** "Why patients choose us" points on the home page (Font Awesome icon classes). */
export const features = [
  {
    icon: 'fa-user-doctor',
    title: 'Orthodontic Specialist',
    text: 'Braces, aligners and bite correction planned by a qualified orthodontist.',
  },
  {
    icon: 'fa-people-roof',
    title: 'Care for All Ages',
    text: 'Gentle treatment for children, adults and seniors, all in one clinic.',
  },
  {
    icon: 'fa-shield-heart',
    title: 'Clean & Safe',
    text: 'Instruments are sterilized before every patient, every time.',
  },
  {
    icon: 'fa-calendar-check',
    title: 'Easy Appointments',
    text: 'Call or WhatsApp us to book a visit at a time that suits you.',
  },
]

export const treatmentOffers: { icon: TreatmentIconName; title: string; text: string; to: string }[] = [
  {
    icon: 'braces',
    title: 'Braces & Clear Aligners',
    text: 'Straighter teeth and a better bite with metal, ceramic or invisible aligners.',
    to: paths.treatment('braces'),
  },
  {
    icon: 'implant',
    title: 'Dental Implants',
    text: 'A fixed, natural-looking replacement for a missing tooth.',
    to: paths.treatment('dental-implants'),
  },
  {
    icon: 'root-canal',
    title: 'Root Canal Treatment',
    text: 'Stops tooth pain and saves an infected tooth from extraction.',
    to: paths.treatment('root-canal'),
  },
  {
    icon: 'bridge',
    title: 'Crowns, Bridges & Dentures',
    text: 'Strong, comfortable restorations to rebuild damaged or missing teeth.',
    to: paths.treatment('crowns-and-bridges'),
  },
  {
    icon: 'whitening',
    title: 'Whitening & Veneers',
    text: 'Brighten and reshape your smile with safe cosmetic treatments.',
    to: paths.treatment('teeth-whitening'),
  },
  {
    icon: 'veneers',
    title: 'Teeth Cleaning & Check-ups',
    text: 'Regular scaling and polishing to keep gums healthy and breath fresh.',
    to: paths.treatment('teeth-cleaning'),
  },
]

export type Doctor = {
  slug: string
  name: string
  shortName: string
  role: string
  /** Optional: without a photo the site shows the doctor's initials. */
  photo?: string
  /** Opening paragraphs of the profile page. */
  bio: string[]
  memberships: string[]
  /** Optional richer profile sections (shown when present). */
  profile?: { label: string; value: string }[]
  /** Paragraphs shown after the profile details. */
  experience?: string[]
  expertise?: { intro?: string; items: { title: string; text: string }[] }
  philosophy?: { quote: string; text: string }
  closing?: { title: string; text: string }
}

export const doctors: Doctor[] = [
  {
    slug: 'bishwanath-chaudhary', // → /dentists/bishwanath-chaudhary (old URL redirects)
    name: 'Dr. Bishwanath Chaudhary',
    shortName: 'Dr Bishwanath',
    role: 'Consultant Orthodontist & Dentofacial Orthopedist',
    bio: [
      'Welcome to the practice of Dr. Bishwanath Chaudhary, where healthy, confident smiles are crafted with scientific precision and compassionate patient care.',
      'Dr. Bishwanath Chaudhary is a highly qualified and experienced specialist in Orthodontics & Dentofacial Orthopedics, dedicated to improving functional bite health and creating beautiful, life-changing smiles for children, teens, and adults.',
    ],
    memberships: ['Member, Orthodontic & Dentofacial Orthopedic Association of Nepal (ODOAN)'],
    profile: [
      { label: 'Specialization', value: 'Orthodontics & Dentofacial Orthopedics' },
      { label: 'Nepal Medical Council (NMC) No.', value: '8629' },
      { label: 'Nepal Dental Association (NDA) No.', value: '1496' },
      { label: 'Professional Affiliations', value: 'Member, Orthodontic & Dentofacial Orthopedic Association of Nepal (ODOAN)' },
    ],
    experience: [
      'With extensive clinical experience serving communities across the region—including major medical centers and specialized dental facilities—Dr. Chaudhary provides state-of-the-art orthodontic solutions tailored to each patient’s unique anatomical needs and personal aesthetic goals.',
    ],
    expertise: {
      intro: 'Dr. Chaudhary specializes in diagnosing, preventing, and treating dental and facial irregularities. His primary areas of clinical excellence include:',
      items: [
        { title: 'Traditional Metal & Ceramic Braces', text: 'Effective alignment solutions for complex teeth crowding, spacing, and bite adjustments.' },
        { title: 'Clear Aligners', text: 'Modern, virtually invisible orthodontic options for discreet smile transformation.' },
        { title: 'Dentofacial Orthopedics', text: 'Early interceptive treatment and growth modification for children and young teens to ensure proper jaw development.' },
        { title: 'Malocclusion & Bite Correction', text: 'Comprehensive correction of overbites, underbites, crossbites, and open bites.' },
        { title: 'Post-Treatment Retention & Care', text: 'Customized retainers and ongoing oral health monitoring to ensure permanent results.' },
      ],
    },
    philosophy: {
      quote: 'A great smile is built on structural harmony, healthy function, and individualized patient care.',
      text: 'Dr. Chaudhary believes that orthodontic care is more than just straightening teeth—it is about enhancing overall facial harmony, oral function, and patient confidence. Every treatment plan begins with a thorough diagnostic evaluation, open communication, and a clear step-by-step guidance process so that patients feel comfortable and informed throughout their transformation journey.',
    },
    closing: {
      title: 'Clinical Excellence & Modern Care',
      text: 'Whether you are seeking early orthodontic evaluation for your child or modern invisible alignment options for yourself, Dr. Bishwanath Chaudhary and his team are committed to providing the highest standard of evidence-based dental care in a safe, comfortable, and welcoming environment.',
    },
  },
  {
    slug: 'ramesh-ram-bhandari',
    name: 'Dr. Ramesh Ram Bhandari',
    shortName: 'Dr Ramesh',
    role: 'Dental Surgeon', // TODO: confirm qualification / speciality
    bio: [
      // TODO: replace with the doctor's real biography.
      `Dr. Ramesh Ram Bhandari is a dental surgeon at ${site.name}, Kohalpur, committed to gentle, patient-friendly treatment.`,
    ],
    memberships: [],
  },
]

/** TODO: add real Google/Facebook reviews here. The reviews section stays hidden while this is empty. */
export const testimonials: { name: string; text: string }[] = []

export type GalleryCategory = 'endodontic' | 'surgery' | 'dental'

/**
 * TODO: replace with the clinic's own before/after cases (with patient consent).
 * The section stays hidden while this list is empty.
 */
export const galleryItems: { image: string; title: string; category: GalleryCategory }[] = []

const yearsOfService = new Date().getFullYear() - site.established

export const stats = [
  { icon: 'fa-calendar-check', value: yearsOfService, label: 'Years of Service' },
  { icon: 'fa-user-doctor', value: doctors.length, label: 'Dentists' },
  { icon: 'fa-house-medical', value: 1, label: 'Clinic' },
  { icon: 'fa-tooth', value: treatmentOffers.length, label: 'Core Treatments' },
]

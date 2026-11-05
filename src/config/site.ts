// Single source of truth for clinic details. Change values here, not in components.
export const site = {
  name: 'Family Dental Care Center',
  shortName: 'Family Dental clinic',
  tagline: 'Best Dental Clinic in Nepalgunj',
  city: 'Nepalgunj',
  established: 2018,
  phones: ['081-532770', '9848064937'],
  whatsapp: '9779848064937', // country code + number, digits only (977 = Nepal)
  email: 'familydentalcarecenter@gmail.com',
  address:
    'Nepalgunj-13, Sadar Line, Banke, Province Lumbini, Nepal.',
  mapLink: 'https://maps.app.goo.gl/DA16xJUpxkeL5VsS9',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1096.5777792378444!2d81.62139474779791!3d28.054690196924458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39986700069159b9%3A0x6d92a9598ffc3c60!2sFamily%20Dental%20Care%20Center!5e1!3m2!1sen!2snp!4v1793895729485!5m2!1sen!2snp',
  hours: [
    { label: 'Dr. Bishwanath Chaudhary', value: '2:00 PM - 6:00 PM' },
    { label: 'Dr. Ramesh Ram Bhandari', value: '10:00 AM - 6:00 PM' },
    { label: 'Dr. Prathista Bhattrai Baisya', value: '10:00 AM - 6:00 PM' },

  ],
  closed: 'Saturday : Closed',
  openDays: 'Sunday – Friday',
  // Add or remove links freely; icons only render for links that are set.
  social: {
    google: 'https://share.google/eGM2ho4U7W6uq28yQ',
    facebook: 'https://www.facebook.com/profile.php?id=61587652840131',
    // To add more later: instagram: 'https://…', youtube: 'https://…'
  } as Partial<Record<'google' | 'facebook' | 'instagram' | 'youtube', string>>,
}

export type NavItem = { label: string; to?: string; children?: NavItem[]; soon?: boolean }

/** Every URL in one place. Old URLs are 301-redirected in public/_redirects. */
export const paths = {
  home: '/',
  about: '/about-us',
  treatments: '/treatments',
  treatment: (slug: string) => `/treatments/${slug}`,
  dentist: (slug: string) => `/dentists/${slug}`,
  blog: '/blog',
  post: (slug: string) => `/blog/${slug}`,
  gallery: '/gallery',
  contact: '/contact',
  privacy: '/privacy-policy',
  terms: '/terms',
}

const t = paths.treatment

export const nav: NavItem[] = [
  { label: 'Home', to: paths.home },
  {
    label: 'About',
    children: [
      { label: 'Our Clinic', to: paths.about },
      { label: 'Dr. Bishwanath Chaudhary', to: paths.dentist('bishwanath-chaudhary') },
      { label: 'Dr. Prathista Bhattrai Baisya', to: paths.dentist('prathista-bhattrai-baisya') },
      { label: 'Dr. Ramesh Ram Bhandari', to: paths.dentist('ramesh-ram-bhandari') },
    ],
  },
  {
    label: 'Treatments',
    children: [
      {
        label: 'Orthodontics',
        children: [
          { label: 'Braces', to: t('braces') },
          { label: 'Clear Aligners', to: t('clear-aligners') },
          { label: 'In-house Clear Aligner Lab', soon: true },
          { label: 'TADs (Mini-implants)', soon: true },
        ],
      },
      {
        label: 'Pain Relief & Surgery',
        children: [
          { label: 'Root Canal Treatment', to: t('root-canal') },
          { label: 'Minor Oral Surgery', to: t('oral-surgery') },
          { label: 'Gum Treatment', to: t('gum-treatment') },
          { label: 'Dental Laser', soon: true },
        ],
      },
      {
        label: 'Tooth Replacement',
        children: [
          { label: 'Dental Implants', to: t('dental-implants') },
          { label: 'Crowns & Bridges', to: t('crowns-and-bridges') },
          { label: 'Dentures', to: t('dentures') },
          { label: 'Full Mouth Rehabilitation', to: t('full-mouth-rehabilitation') },
        ],
      },
      {
        label: 'Cosmetic',
        children: [
          { label: 'Veneers / Laminates', to: t('veneers') },
          { label: 'Teeth Whitening', to: t('teeth-whitening') },
        ],
      },
      {
        label: 'Family & Prevention',
        children: [
          { label: 'Kids Dentistry', to: t('kids-dentistry') },
          { label: 'Teeth Cleaning', to: t('teeth-cleaning') },
          { label: 'Fillings', to: t('fillings') },
        ],
      },
      { label: 'All Treatments', to: paths.treatments },
    ],
  },
  { label: 'Gallery', to: paths.gallery },
  { label: 'Blog', to: paths.blog },
  { label: 'Contact', to: paths.contact },
]

export const footerLinks = {
  quick: [
    { label: 'About Our Clinic', to: paths.about },
    { label: 'All Treatments', to: paths.treatments },
    { label: 'Blog', to: paths.blog },
    { label: 'Gallery', to: paths.gallery },
    { label: 'Book an Appointment', to: paths.contact },
  ],
  treatments: [
    { label: 'Braces & Aligners', to: t('braces') },
    { label: 'Dental Implants', to: t('dental-implants') },
    { label: 'Root Canal Treatment', to: t('root-canal') },
    { label: 'Teeth Cleaning', to: t('teeth-cleaning') },
    { label: 'Kids Dentistry', to: t('kids-dentistry') },
    { label: 'Teeth Whitening', to: t('teeth-whitening') },
  ],
}

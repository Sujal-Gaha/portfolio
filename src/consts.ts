export type Site = {
  TITLE: string
  DESCRIPTION: string
  EMAIL: string
  NUM_POSTS_ON_HOMEPAGE: number
  POSTS_PER_PAGE: number
  SITEURL: string
}

export type Link = {
  href: string
  label: string
}

export const SITE: Site = {
  TITLE: 'Sujal Magar',
  DESCRIPTION: 'I am a Fullstack developer with 2+ years of experience. ',
  EMAIL: 'suzalgahamagar@gmail.com',
  NUM_POSTS_ON_HOMEPAGE: 2,
  POSTS_PER_PAGE: 3,
  SITEURL: 'https://sujalgahamagar.com.np/',
}

export const NAV_LINKS: Link[] = [
  { href: '/blog', label: 'blog' },
  { href: '/authors', label: 'authors' },
  { href: '/about', label: 'about' },
  { href: '/tags', label: 'tags' },
]

export const SOCIAL_LINKS: Link[] = [
  { href: 'https://github.com/Sujal-Gaha', label: 'GitHub' },
  { href: 'https://x.com/suzalgahamagar', label: 'Twitter' },
  { href: 'suzalgahamagar@gmail.com', label: 'Email' },
  { href: 'https://linkedin.com/in/sujal-magar-382889287/', label: 'LinkedIn' },
]

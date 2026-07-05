# AOIP — Artificial Opportunity Intelligence Platform

The homepage of AOIP: an objective-first experience. Instead of asking
users to search government schemes, AOIP asks **"What would you like to
achieve?"** and maps the answer to the best opportunities across India.

## Features

- **Objective-driven hero** — ten interactive objective cards (Start a
  Business, Expand Manufacturing, Export Products, Access Funding, Go
  Green, Adopt AI, Scale Your MSME, Women Entrepreneurship, Innovate &
  Patent, Build Industrial Infrastructure) as the first screen.
- **12 languages** — English, हिन्दी, मराठी, ਪੰਜਾਬੀ, ગુજરાતી, বাংলা,
  தமிழ், తెలుగు, ಕನ್ನಡ, മലയാളം, ଓଡ଼ିଆ, অসমীয়া.
  - Browser language is detected on the first visit and applied
    automatically, with a banner to confirm or change it.
  - The preference is saved in `localStorage` (`aoip.language`) — no
    repeated language prompts.
  - A language switcher lives in the top-right corner on every screen.
- **Dark & light mode**, WCAG-minded focus states, reduced-motion
  support, animated opportunity-network background, scroll reveals and
  count-up statistics.

## Tech stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion ·
Lucide Icons · next-themes

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
```

## Structure

```
app/                    # App Router entry (layout, page, globals)
components/
  home/                 # Hero, objective grid, sections
  layout/               # Navbar, footer, language switcher & banner
  providers/            # Theme + language context providers
  ui/                   # Reusable primitives (Button, Section, Counter)
lib/
  i18n/                 # Locale config, Dictionary type, 12 dictionaries
  data/objectives.ts    # Objective card definitions
```

## Future architecture hooks

The homepage links are ready to be wired to the questionnaire flow
(`/journey?objective=<id>`), authentication, the applicant dashboard and
the recommendation/strategy reports as those surfaces ship. The language
preference persistence is centralised in the `LanguageProvider`, where
profile sync can be added alongside `localStorage`.

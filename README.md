# GOP — Government Opportunity Platform

The homepage of GOP: an objective-first experience. Instead of asking
users to search government schemes, GOP asks **"What would you like to
achieve?"** and maps the answer to the best opportunities across India.

A disclaimer is shown on the homepage (hero and footer, in all 12
languages): GOP may make mistakes — users should verify important
information themselves.

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
- **Adaptive questionnaire journey** (`/journey`) driven by the
  Applicant Intelligence Engine artifacts: welcome framing, objective
  pre-answered from the homepage card, staged mandatory questions
  (applicant → location → foundation track), an information-gain
  adaptive loop, restriction notices from elimination rules, cross-field
  validation, document check, preferences, one-screen review with
  inline edit, and completion.
- **Lead capture** — a contact step (name, email, phone, consent)
  before completion. Leads are stored in `localStorage` (`aoip.leads`)
  and emailed to the team inbox via FormSubmit so applicants can be
  contacted later.
- **Admin console** (`/admin`, not linked from the UI, noindex) —
  gated by an access key; only the admin can download applicant JSON,
  individually per applicant or in bulk. Applicants have no download
  option. The key is verified against a SHA-256 hash in
  `components/admin/admin-console.tsx`; rotate it by replacing the
  hash. Note: a static site cannot do real authentication — treat the
  gate as a deterrent and move the console behind server-side auth
  before scaling.

## Tech stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion ·
Lucide Icons · next-themes

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # static export to ./out
```

## Hosting

The site is a full static export (`output: "export"`).
`.github/workflows/deploy.yml` builds with
`NEXT_PUBLIC_BASE_PATH=/AOIP` and publishes `out/` to GitHub Pages on
every push to the deploy branches:

> https://anxietysocial1-ship-it.github.io/AOIP/

Lead emails are delivered through FormSubmit to the team inbox
configured in `lib/engine/lead.ts`. FormSubmit sends a one-time
activation email on the first submission from the live domain — click
it once and every subsequent lead arrives as a formatted email.
Regardless of activation, leads are always kept in the visitor's
`localStorage`, where the admin console (`/admin`) can list and export
them. Note that each browser only holds the leads submitted from it —
the email inbox is the complete record across all visitors.

(The repository, deploy path and internal storage keys keep the
original `AOIP`/`aoip` identifiers; all user-facing branding is GOP.)

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
  data/questionnaire/   # Applicant Intelligence Engine artifacts
```

## Questionnaire engine data

`lib/data/questionnaire/` holds the Applicant Intelligence Engine
artifacts consumed by the upcoming questionnaire flow:

- `questions.json` — 253 questions across 23 modules (Objective
  Discovery, Applicant Context, MSME Classification, Financial Profile,
  Export Readiness, …) with input types, sensitivity levels and
  information-gain metadata.
- `rules.json` — derivation, branch, elimination and validation rules
  plus the information-gain configuration that decides which question to
  ask next.
- `flow.json` — the questionnaire state machine (20 states, from
  `S-000-WELCOME` to `S-120-COMPLETE`).

`lib/data/questionnaire/index.ts` exposes typed accessors
(`questionnaire`, `rules`, `flow`, `getQuestion`, `getModuleQuestions`,
`getPrimaryObjectiveValues`). Keep these imports server-side — the raw
artifacts total ~370 KB and should not enter the client bundle.

Each homepage objective card carries a `primaryObjective` value that
matches the engine's Q-OBJ-001 answer vocabulary, so a card selection
can pre-answer the first questionnaire question.

## Future architecture hooks

The homepage links are ready to be wired to the questionnaire flow
(`/journey?objective=<id>`), authentication, the applicant dashboard and
the recommendation/strategy reports as those surfaces ship. The language
preference persistence is centralised in the `LanguageProvider`, where
profile sync can be added alongside `localStorage`.

# Param Shah — Portfolio

Personal portfolio site. React + Vite, deployed on Vercel at
**[paramshahportfolio.vercel.app](https://paramshahportfolio.vercel.app/)**.

Includes NEXUS, an AI copilot that answers questions about my background,
backed by Gemini through a serverless proxy.

---

## Stack

| Area | Tech |
| --- | --- |
| Framework | React 19, Vite, React Router |
| Styling | Tailwind CSS v4 |
| 3D / motion | Three.js, React Three Fiber, drei, Framer Motion, GSAP |
| Chat | Google Gemini via a Vercel serverless function |
| Contact form | EmailJS |
| Hosting | Vercel |

## Running locally

```bash
npm install
cp .env.example .env   # then paste your own Gemini key
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint over `src/`, `api/`, and configs |
| `npm run optimize:images` | Regenerate web-sized photos (see below) |

> The `/api/chat` function only runs on Vercel. In local `npm run dev` the
> NEXUS widget will fail to reach it — use `vercel dev` if you need to test
> the chat end to end.

## Environment variables

| Name | Required | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | yes | Server-side only. **No `VITE_` prefix** — that would inline the key into the client bundle where anyone could read it. |
| `ALLOWED_ORIGINS` | no | Comma-separated origin allowlist for `/api/chat`. Defaults to the production domain plus localhost. |

Set these in the Vercel dashboard under **Settings → Environment Variables**.
`.env` is gitignored and must stay that way.

## Project layout

```
api/
  chat.js          Serverless Gemini proxy — validates, rate limits, and
                   injects the system prompt server-side
  _knowledge.js    NEXUS knowledge base. The leading underscore keeps Vercel
                   from treating it as a route; living outside src/ keeps it
                   out of the client bundle
src/
  components/
    sections/      Page sections (Hero3D, Home, Skills, Experience, …)
  data/            Content: projects, experience, skills
  hooks/           useMediaQuery (reduced motion, pointer), useDocumentTitle
  pages/           /resume and the 404 route
tools/
  optimize-images.js   Photo resizing script
  og-image.html        Source for the social share card
public/            Static passthrough: resume.pdf, og-image.png, robots.txt
```

## Keeping content current

Most updates are data-only:

- **Projects** → `src/data/projects.js` (drives both the carousel and `/resume`)
- **Experience** → `src/data/experience.js` (`type: "work"` vs `"leadership"`
  decides which resume heading it lands under)
- **Skills** → `src/data/skills.js`, then add the name to a category in
  `src/components/sections/Skills.jsx`
- **NEXUS answers** → `api/_knowledge.js`

Three places repeat headline facts (year of study, current role) and drift
apart easily — when those change, update all of them:

1. `src/components/sections/Home.jsx` — the intro paragraph and education card
2. `api/_knowledge.js` — so NEXUS doesn't contradict the page
3. `tools/og-image.html` — then re-render `public/og-image.png`
   (see `tools/README.md`)

## Photos

Full-resolution phone photos are far too heavy to ship: the originals here
totalled 4.2 MB for images displayed in a 400px circle.

Drop new photos into `src/assets/images/`, then:

```bash
npm run optimize:images
```

This writes resized WebP copies to `src/assets/images/optimized/`, which is
the only directory the app bundles. Originals stay untouched.

## Notes

- The custom cursor and the heavier animations are gated behind
  `(pointer: fine)` and `prefers-reduced-motion` — see
  `src/hooks/useMediaQuery.js`. Test changes with reduced motion enabled.
- `vercel.json` handles the SPA rewrite so `/resume` survives a hard refresh,
  and sets caching plus security headers.

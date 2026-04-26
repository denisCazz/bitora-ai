# Bitora AI — ai.bitora.it

Sito web del sub-brand AI di Bitora. Astro 5 in modalità SSR (Node) + Tailwind CSS, design system "Interactive 3D / AI 2026" con three.js.

## Tech stack

- **Astro 5** in modalità `output: 'server'` con adapter `@astrojs/node` (standalone)
- **Tailwind CSS** con design system esteso (gradienti aurora, glow, animazioni shimmer/marquee/aurora)
- **three.js** per il `HeroOrb` — caricato solo su desktop/tablet (md+), fallback CSS su mobile
- **Canvas 2D** per `ParticleField` e `FloatingNodes` (rete neurale animata)
- **Resend** per l'invio email del form contatti
- **Zod** per la validazione server-side
- Container Docker pronto per deploy su **Coolify** (VPS), porta **80**

## Struttura

```
ai-bitora/
├── src/
│   ├── layouts/Layout.astro       — Meta SEO, font, JSON-LD Organization+LocalBusiness
│   ├── components/
│   │   ├── Header.astro           — Scroll-aware blur, pill-nav desktop, drawer mobile
│   │   ├── Footer.astro           — Brand strip + link grid + bottom bar
│   │   ├── ui/                    — Design system (Section, Card, Button, Badge, Heading, Marquee, Icon, Reveal)
│   │   └── three/                 — Componenti 3D islands (HeroOrb, ParticleField, AnimatedDashboard, FloatingNodes)
│   └── pages/
│       ├── index.astro            — Homepage 3D
│       ├── automazioni.astro      — FloatingNodes + flusso AI
│       ├── chatbot.astro          — Mockup chat animato
│       ├── siti-web.astro         — Browser mockup tilt
│       ├── gestionali.astro       — CRM AI query mockup
│       ├── formazione.astro       — Programmi + Transition Pack
│       ├── casi-studio.astro      — 3 casi editoriali
│       ├── piemonte.astro         — Mappa SVG stilizzata
│       ├── contatti.astro         — Form con loading state e validazione live
│       ├── grazie.astro           — Confetti + next steps
│       ├── 404.astro              — Pagina not found con quick-nav
│       ├── api/contatti.ts        — POST endpoint Zod + Resend
│       ├── api/health.ts          — GET /api/health per healthcheck Coolify
│       ├── sitemap.xml.ts         — Sitemap dinamica
│       └── robots.txt.ts          — Robots dinamico
├── Dockerfile                     — Multi-stage Node 22 alpine, porta 80
├── .dockerignore
├── .env.example                   — Variabili obbligatorie
├── public/
│   ├── favicon.svg
│   └── icona.png                  — Logo Bitora AI (usato come OG image temporanea)
└── SITE_DETAILS.md                — Documentazione tecnica completa
```

## Comandi locali

```bash
npm install
npm run dev        # Dev server → http://localhost:4321
npm run build      # Build SSR in dist/
npm run preview    # Preview build locale
```

## Variabili d'ambiente

Copia `.env.example` → `.env` e compila:

| Variabile        | Esempio                 | Note                                   |
| ---------------- | ----------------------- | -------------------------------------- |
| `RESEND_API_KEY` | `re_xxxxxxxxxx`         | Crea su https://resend.com/api-keys    |
| `CONTACT_FROM`   | `no-reply@ai.bitora.it` | Dominio verificato su Resend           |
| `CONTACT_TO`     | `info@bitora.it`        | Destinatario lead                      |

Senza `RESEND_API_KEY` il form logga su stdout ma non invia email.

## Deploy su Coolify (VPS)

### 1. Crea l'applicazione

- New Resource → **Application** → sorgente repo
- Build pack: **Dockerfile**
- Branch: `main`
- **Port: 80**

### 2. Variabili d'ambiente in Coolify

```
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_FROM=no-reply@ai.bitora.it
CONTACT_TO=info@bitora.it
NODE_ENV=production
```

### 3. Healthcheck

- Path: `/api/health`
- Port: `80`
- Interval: 30s

### 4. Dominio + SSL

- Aggiungi `ai.bitora.it` in Coolify → SSL automatico via Let's Encrypt
- DNS: record `A` o `CNAME` verso IP del VPS

### 5. Email (Resend)

- Verifica dominio `bitora.it` (o `ai.bitora.it`) su [resend.com/domains](https://resend.com/domains)
- Configura DKIM / SPF / Return-Path
- Testa invio in staging prima del go-live

## Da completare prima del lancio

- [ ] Creare `public/og-default.png` (1200×630) — attualmente si usa `icona.png` come fallback OG
- [ ] Configurare `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` in Coolify
- [ ] Verificare dominio mittente su Resend e testare flusso form end-to-end
- [ ] Puntare DNS `ai.bitora.it` al VPS e verificare SSL
- [ ] Google Search Console + Bing Webmaster Tools: verificare proprietà e inviare sitemap
- [ ] Inserire snippet Analytics (Umami / Plausible / GA4) in `Layout.astro`

## Brand identity

**Nome pubblico:** Bitora AI | **Payoff:** AI operativa per PMI e aziende del territorio
**URL:** ai.bitora.it | **Sub-brand di:** bitora.it

**Palette:** `#6366f1` indigo → `#8b5cf6` violet → `#06b6d4` cyan → `#22d3ee` accent
**Tipografia:** Space Grotesk (display) · Inter (body) · JetBrains Mono (mono)

## GTM (Go-To-Market)

Leggi i file in `gtm/`:
1. `outreach-clienti-esistenti.md` — Contattare i 50+ clienti Bitora esistenti
2. `contenuti-seo-locali.md` — Pagine geo-locali, lead magnet, piano social
3. `webinar-ai-pmi-piemonte.md` — Piano webinar AI per PMI

## Documentazione tecnica completa

→ `SITE_DETAILS.md`

# Bitora AI — ai.bitora.it

Sito web del sub-brand AI di Bitora. Astro 5 in modalità SSR (Node) + Tailwind CSS, design system "Interactive 3D / AI 2026" con three.js.

## Tech stack

- **Astro 5** in modalità `output: 'server'` con adapter `@astrojs/node` (standalone)
- **Tailwind CSS** con design system esteso (gradienti aurora, glow, animazioni shimmer/marquee/aurora)
- **three.js** per il `HeroOrb` (sfera con shader noise + fresnel) — caricato solo dove serve
- **Canvas 2D** per `ParticleField` e `FloatingNodes` (rete neurale animata)
- **Resend** per l'invio email del form contatti
- **Zod** per la validazione server-side
- Container Docker pronto per deploy su **Coolify** (VPS)

## Struttura

```
ai-bitora/
├── src/
│   ├── layouts/Layout.astro       — Meta SEO, font, JSON-LD Organization+LocalBusiness
│   ├── components/
│   │   ├── Header.astro           — Scroll-aware blur + drawer mobile
│   │   ├── Footer.astro           — 4 colonne con gradient bar e social
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
│       ├── api/contatti.ts        — POST endpoint Zod + Resend
│       ├── api/health.ts          — GET endpoint per healthcheck Coolify
│       ├── sitemap.xml.ts         — Sitemap dinamica
│       └── robots.txt.ts          — Robots dinamico
├── Dockerfile                     — Multi-stage Node 22 alpine
├── .dockerignore
├── .env.example                   — Variabili obbligatorie (RESEND_API_KEY, CONTACT_FROM, CONTACT_TO)
└── public/favicon.svg
```

## Comandi locali

```bash
npm install
npm run dev        # Dev server su http://localhost:80
npm run build      # Build SSR in dist/
npm run preview    # Preview build locale
node ./dist/server/entry.mjs   # Run produzione (richiede env vars)
```

## Variabili d'ambiente

Vedi `.env.example`. Le variabili obbligatorie per il funzionamento del form:

| Variabile         | Esempio                       | Note                                                |
| ----------------- | ----------------------------- | --------------------------------------------------- |
| `RESEND_API_KEY`  | `re_xxxxxxxxxx`               | Crea su https://resend.com/api-keys                 |
| `CONTACT_FROM`    | `no-reply@ai.bitora.it`       | Mittente — dominio verificato su Resend             |
| `CONTACT_TO`      | `info@bitora.it`              | Destinatario lead                                   |

Senza `RESEND_API_KEY` il form risponde con `error=config` e i dati vengono solo loggati su `stdout`.

## Deploy su Coolify (VPS)

Il progetto è pronto per essere deployato su Coolify tramite Dockerfile.

### 1) Crea il progetto su Coolify

- New Resource → **Application** → Source: GitHub/GitLab/Public Repo
- Build pack: **Dockerfile**
- Branch: `main` (o quello che usi)
- Port: **4321**

### 2) Variabili d'ambiente

Aggiungi nel pannello **Environment Variables** di Coolify:

```
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_FROM=no-reply@ai.bitora.it
CONTACT_TO=info@bitora.it
NODE_ENV=production
```

### 3) Healthcheck

Il container espone `/api/health` (già configurato anche nel `HEALTHCHECK` del Dockerfile).
Su Coolify:
- **Healthcheck path**: `/api/health`
- **Healthcheck port**: `4321`

### 4) Dominio

- Aggiungi `ai.bitora.it` come dominio in Coolify
- Coolify genera automaticamente il certificato SSL (Let's Encrypt)
- Sul tuo DNS, punta `ai` (CNAME o A record) all'IP del VPS

### 5) Verifica Resend

- In Resend, aggiungi il dominio `ai.bitora.it` (o `bitora.it`)
- Configura i record SPF / DKIM / Return-Path richiesti
- Verifica l'invio test prima di andare live

## Da completare prima del lancio

- [ ] Sostituire il numero WhatsApp `39XXXXXXXXXX` con il numero reale (Header, Footer, index, chatbot, contatti, piemonte)
- [ ] Configurare `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` su Coolify
- [ ] Verificare dominio mittente su Resend
- [ ] Creare immagine OG (`og-default.png`, 1200×630) in `public/`
- [ ] Verificare Google Search Console e Bing Webmaster Tools
- [ ] Inserire ID Google Analytics / Umami nel `Layout.astro`
- [ ] Aggiungere Calendly o Cal.com per la prenotazione (link nel form contatti)
- [ ] Eseguire test Lighthouse e fissare eventuali problemi (vedi `AUDIT.md`)
- [ ] Testare flusso form completo end-to-end in staging Coolify

## Brand identity

**Nome pubblico:** Bitora AI
**Payoff:** AI operativa per PMI e aziende del territorio
**URL:** ai.bitora.it
**Relazione con Bitora:** sub-brand quasi autonomo, esplicita connessione "by bitora.it"

**Palette:**
- Brand: `#6366f1` (indigo) → `#06b6d4` (cyan) — gradient principale
- Aurora: `#6366f1 → #8b5cf6 → #06b6d4 → #22d3ee` (sfondo / texts)
- Surface: `#080810` (background) / `#14142a` (cards)
- Accent: `#22d3ee` (cyan chiaro)
- Electric: `#facc15` (call-out highlights)

**Tipografia:**
- Display: **Space Grotesk** (titoli)
- Sans: **Inter** (body)
- Mono: **JetBrains Mono** (code/eyebrow/data)

**Tono di voce:** Pratico, diretto, locale. Niente fronzoli tecnici, niente promesse vuote. Focus su risultati misurabili.

## GTM (Go-To-Market)

Leggi i file in `gtm/` per:
1. **outreach-clienti-esistenti.md** — Come contattare i 50+ clienti Bitora esistenti
2. **contenuti-seo-locali.md** — Pagine geo-locali, lead magnet checklist, piano social 30 giorni
3. **webinar-ai-pmi-piemonte.md** — Piano completo webinar con struttura, promozione e KPI

## Audit pre-go-live

Vedi `AUDIT.md` per la checklist completa: Lighthouse scores, conversion, SEO, accessibilità, mobile UX e blocker.

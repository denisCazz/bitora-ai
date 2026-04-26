# Bitora AI — Dettagli Tecnici e Funzionali

Documento di riferimento per sviluppo, manutenzione e handoff del sito `ai.bitora.it`.

---

## Obiettivo del Sito

**Bitora AI** è il sub-brand AI di Bitora (bitora.it), con sede a Carmagnola (TO).  
Il sito serve come:

1. **Vetrina commerciale** per i servizi AI rivolti a PMI e professionisti italiani
2. **Lead generation** tramite form contatti → email via Resend
3. **Authority building** con casi studio, FAQ, presenza locale Piemonte e schema SEO strutturato

**Target:** Piccole e medie imprese italiane, studi professionali, B2B manifatturiero/servizi.  
**Geografico principale:** Piemonte (TO, CN, AT, AL, BI, VC, NO, VB), Italia.

---

## Stack Tecnico

| Layer            | Tecnologia                          | Note                                        |
| ---------------- | ----------------------------------- | ------------------------------------------- |
| Framework        | **Astro 5** (SSR mode)              | `output: 'server'`, adapter Node standalone |
| Stile            | **Tailwind CSS 3**                  | Configurazione estesa con token custom      |
| 3D / Canvas      | **three.js** + Canvas 2D            | Solo desktop/tablet (≥ 768px)               |
| Email            | **Resend**                          | Form contatti server-side                   |
| Validazione      | **Zod**                             | Schema ContactSchema in `api/contatti.ts`   |
| Runtime          | **Node 22 (alpine)**                | Container Docker multi-stage                |
| Deploy           | **Coolify VPS**                     | Traefik come reverse proxy, Let's Encrypt   |
| Porta app        | **80** (container) → 443 (Traefik) | `PORT=80` nel Dockerfile runner stage       |

---

## Architettura Pagine

### Pagine pubbliche

| Rotta           | File                     | Descrizione                                       |
| --------------- | ------------------------ | ------------------------------------------------- |
| `/`             | `pages/index.astro`      | Homepage — hero 3D, servizi, timeline, FAQ        |
| `/automazioni`  | `pages/automazioni.astro`| FloatingNodes + casi d'uso automazioni AI         |
| `/chatbot`      | `pages/chatbot.astro`    | Chat mockup animato B2B + features                |
| `/siti-web`     | `pages/siti-web.astro`   | Browser mockup tilt + timeline progetto           |
| `/gestionali`   | `pages/gestionali.astro` | CRM AI + query bar mockup                         |
| `/formazione`   | `pages/formazione.astro` | Programmi training + AI Transition Pack           |
| `/casi-studio`  | `pages/casi-studio.astro`| 3 casi studio con metriche reali                  |
| `/piemonte`     | `pages/piemonte.astro`   | SEO locale + mappa SVG + incentivi regionali      |
| `/contatti`     | `pages/contatti.astro`   | Form 6 campi + validazione live + loading state   |
| `/grazie`       | `pages/grazie.astro`     | Confirm post-invio — confetti + next steps        |
| `/404`          | `pages/404.astro`        | Not found — quick-nav alle sezioni principali     |

### API endpoints (SSR, non prerenderizzati)

| Rotta            | File                     | Metodo | Descrizione                                 |
| ---------------- | ------------------------ | ------ | ------------------------------------------- |
| `/api/contatti`  | `pages/api/contatti.ts`  | POST   | Form submission — Zod + Resend + honeypot   |
| `/api/health`    | `pages/api/health.ts`    | GET    | Healthcheck Coolify (`{ status: 'ok' }`)    |
| `/sitemap.xml`   | `pages/sitemap.xml.ts`   | GET    | Sitemap dinamica con tutte le rotte         |
| `/robots.txt`    | `pages/robots.txt.ts`    | GET    | Robots.txt dinamico                         |

---

## Design System

Tutti i componenti risiedono in `src/components/ui/` e `src/components/three/`.

### Componenti UI (`src/components/ui/`)

| Componente   | Props principali                         | Note                                     |
| ------------ | ---------------------------------------- | ---------------------------------------- |
| `Section`    | `variant`, `padding`, `border`, `id`     | 5 varianti: default, dark, glow, grid, spotlight |
| `Button`     | `href`, `variant`, `size`, `external`    | primary/secondary/ghost/outline          |
| `Badge`      | `variant`, `dot`                         | brand/cyan/electric/success/glass        |
| `Card`       | `variant`, `hover`, `padding`            | default/glass/glow/tilt/gradient-border  |
| `Heading`    | `level`, `eyebrow`, `highlight`, `align` | h1–h3, animated gradient highlight       |
| `Marquee`    | `items`, `direction`, `speed`            | Scorrimento infinito senza JS            |
| `Icon`       | `name`, `size`, `class`                  | SVG Lucide inline, ~45 icone             |
| `Reveal`     | `tag`, `delay`, `class`                  | IntersectionObserver + CSS animation     |

### Componenti 3D (`src/components/three/`)

| Componente         | Descrizione                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `HeroOrb`          | Sfera three.js con noise shader + Fresnel. **Solo desktop/tablet** (≥768px). Fallback CSS su mobile. |
| `ParticleField`    | Canvas 2D, particelle con repulsione mouse. Ridotto/disabilitato con `prefers-reduced-motion`. |
| `FloatingNodes`    | Rete neurale animata (canvas 2D). Varianti: `network`, `flow`.      |
| `AnimatedDashboard`| Dashboard mockup con counter animati e chart CSS.                   |

---

## Flusso Form Contatti

```
Browser (contatti.astro)
  → POST /api/contatti (FormData o JSON)
    → Zod ContactSchema.safeParse()
      ✗ 422 + fieldErrors → form mostra errori inline
      ✓ Honeypot check (campo `website`) → redirect /grazie silenzioso se compilato
      → Resend.emails.send()
        ✗ 502 → redirect /contatti?error=send
        ✓ redirect /grazie 303
```

### Schema validazione (Zod)

| Campo      | Tipo     | Regole                          |
| ---------- | -------- | ------------------------------- |
| `nome`     | string   | min 2, max 120                  |
| `azienda`  | string   | opzionale, max 160              |
| `email`    | string   | email valida, max 180           |
| `telefono` | string   | opzionale, max 40               |
| `interesse`| string   | opzionale, max 120              |
| `messaggio`| string   | min 10, max 4000                |
| `privacy`  | bool/on  | richiesto                       |
| `website`  | string   | honeypot — deve essere vuoto    |

### Email risultante (Resend)

- **From:** `Bitora AI <CONTACT_FROM>`
- **To:** `CONTACT_TO`
- **Reply-To:** email del lead
- **Subject:** `[ai.bitora.it] Nuova richiesta · {nome} · {azienda}`
- **Body:** HTML brandizzato con gradient header + tabella campi + messaggio

---

## Variabili d'Ambiente

```bash
# Obbligatorie
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx   # Resend API key
CONTACT_FROM=no-reply@ai.bitora.it           # Mittente (dominio verificato su Resend)
CONTACT_TO=info@bitora.it                    # Destinatario lead

# Opzionali (defaults nel Dockerfile)
NODE_ENV=production
HOST=0.0.0.0
PORT=80
ASTRO_TELEMETRY_DISABLED=1
```

---

## Deploy Coolify

### Configurazione applicazione

```
Build pack:    Dockerfile
Branch:        main
Port:          80
```

### Dockerfile (sintesi flusso multi-stage)

```
base (node:22-alpine)
  └── deps: npm ci --no-audit --no-fund
      └── build: npm run build && npm prune --omit=dev
          └── runner: copia dist/ + node_modules/, utente non-root astro:1001
                      EXPOSE 80
                      HEALTHCHECK → wget /api/health
                      CMD node ./dist/server/entry.mjs
```

### Healthcheck

- Endpoint: `GET /api/health`
- Risposta: `{ "status": "ok", "service": "ai-bitora", "ts": <epoch> }`
- Configurare in Coolify: path `/api/health`, port `80`, interval 30s

### SSL e dominio

Coolify gestisce automaticamente il certificato via Traefik + Let's Encrypt.  
DNS: record `A` o `CNAME` per `ai.bitora.it` → IP del VPS.

---

## SEO e Schema Strutturato

### JSON-LD (iniettato in `Layout.astro`)

- `Organization` — Bitora AI, `sameAs: bitora.it`
- `LocalBusiness` — sede Carmagnola (TO), tel `+393514979670`, area `IT + Piemonte`
- `FAQPage` — iniettato in `index.astro` con le 6 FAQ della homepage

### Meta tags

Tutti presenti in `Layout.astro`:
- `<title>`, `<meta description>`, `<link rel="canonical">`
- Open Graph: `og:title`, `og:description`, `og:url`, `og:image`, `og:locale`
- Twitter Card: `summary_large_image`
- `<meta name="theme-color" content="#080810">`

### OG Image

- Default attuale: `/icona.png` (fallback temporaneo)
- Da creare: `public/og-default.png` (1200×630px, brand gradient + wordmark)
- Ogni pagina può sovrascrivere via prop `ogImage` al Layout

### Sitemap e Robots

- `/sitemap.xml` — dinamica, include tutte le rotte con `priority` e `changefreq`
- `/robots.txt` — `Disallow: /api/`, `Disallow: /grazie`

---

## Performance

### Bundle size

| Asset                    | Size (raw) | Gzip    | Note                          |
| ------------------------ | ---------- | ------- | ----------------------------- |
| `HeroOrb.*.js` (three.js)| ~501 KB    | ~127 KB | Solo homepage, solo ≥ 768px  |
| Resto client             | < 10 KB    | < 4 KB  | Reveal, ParticleField, drawer |

### Ottimizzazioni attive

- `HeroOrb` non inizializza WebGL su `window.innerWidth < 768` → niente bundle three.js su mobile
- `IntersectionObserver` su tutti i componenti canvas → niente rAF se fuori viewport
- `prefers-reduced-motion` rispettato da tutti i componenti animati
- `devicePixelRatio` limitato: max 1.5 su tablet, max 2 su desktop
- `font-display: swap` su Google Fonts, `preconnect` per eliminare latenza
- Astro genera asset client con hash → cache immutabile

### Core Web Vitals target

| Metrica | Target    | Note                                         |
| ------- | --------- | -------------------------------------------- |
| LCP     | ≤ 2.5s    | LCP element: H1 homepage                     |
| INP     | ≤ 200ms   |                                              |
| CLS     | ≤ 0.05    | HeroOrb in wrapper con `height` fisso        |

---

## Accessibilità

- `lang="it"` sul `<html>`
- Skip link "Vai al contenuto" → `#main`
- `:focus-visible` globale con outline indigo
- Tutti i link/button con `aria-label` o testo visibile
- Drawer mobile con `aria-expanded`, `aria-controls`, `aria-hidden`
- Form: `<label>` esplicito, errori con `role="alert"` + `aria-live`
- SVG decorativi con `aria-hidden="true"`

---

## Componente Header (comportamento breakpoint)

| Breakpoint | Hamburger | Logo         | WhatsApp     | Nav pill | CTA           |
| ---------- | --------- | ------------ | ------------ | -------- | ------------- |
| < lg       | sinistra  | centro (abs) | destra       | nascosta | nel drawer    |
| lg+        | nascosto  | sinistra     | sinistra CTA | centro   | destra        |

---

## Checklist Go-Live

### Obbligatorie

- [ ] Impostare `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` in Coolify
- [ ] Verificare dominio su Resend (DKIM / SPF / Return-Path)
- [ ] Testare form end-to-end in staging (invio → email → redirect `/grazie`)
- [ ] DNS: `ai.bitora.it` → IP VPS, SSL attivato

### Raccomandate

- [ ] Creare `public/og-default.png` (1200×630)
- [ ] Google Search Console + Bing Webmaster Tools: verifica e submit sitemap
- [ ] Inserire Analytics (Umami / Plausible / GA4) in `src/layouts/Layout.astro`
- [ ] Lighthouse run post-deploy (mobile + desktop) e archiviare PDF

### Post-lancio (iterazione)

- [ ] WhatsApp FAB floating su mobile
- [ ] Schema `Service` per ogni pagina servizio
- [ ] Blog `/blog` per SEO long-tail
- [ ] Self-host font Google (Inter, Space Grotesk, JetBrains Mono) per eliminare round-trip
- [ ] Calendly / Cal.com per prenotazione diretta dalla pagina contatti
- [ ] A/B test headline homepage

---

## File di Riferimento

| File                   | Scopo                                              |
| ---------------------- | -------------------------------------------------- |
| `README.md`            | Quickstart, comandi, deploy Coolify                |
| `AUDIT.md`             | Checklist pre-go-live: SEO, a11y, performance      |
| `SITE_DETAILS.md`      | Questo file — architettura, flussi, configurazione |
| `.env.example`         | Template variabili d'ambiente                      |
| `Dockerfile`           | Build container produzione                         |
| `.dockerignore`        | Esclusioni dal build context Docker                |
| `tailwind.config.mjs`  | Token design system (colori, animazioni, ombre)    |
| `astro.config.mjs`     | Config Astro SSR + Node adapter + Vite             |
| `gtm/`                 | Go-to-market: outreach, SEO locale, webinar        |

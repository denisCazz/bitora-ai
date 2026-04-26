# AUDIT pre-go-live — ai.bitora.it

Snapshot dello stato del sito al termine del restyling "Interactive 3D / AI 2026".
Da rifare dopo il deploy su Coolify e prima del go-live commerciale.

---

## 1. Build

| Item                          | Status | Note                                                         |
| ----------------------------- | ------ | ------------------------------------------------------------ |
| `npm run build` (SSR)         | OK     | Build SSR completata in ~2.4s (server + client)              |
| Astro adapter Node v9         | OK     | `output: 'server'`, mode `standalone`                        |
| Static prerender              | OK     | 4 ms (rotte API non prerenderizzate, corretto)               |
| Bundle client `_astro/*`      | 1 file | `HeroOrb.astro_astro_type_script_index_0_lang.*.js` solamente|
| Dimensione bundle three.js    | 501 KB / **127 KB gzip** | Caricato solo sulla home (HeroOrb)             |
| Warning > 500 KB              | atteso | Three.js è inevitabile, isolato in una sola island           |
| Linter / type errors          | nessuno bloccante | `astro check` saltato in CI sandbox                |

### Ottimizzazioni ulteriori (post go-live, non bloccanti)

- Caricare `three` con `import()` dinamico dietro `IntersectionObserver` (è già visibility-gated, ma il chunk parte all'analisi del DOM).
- Sostituire `HeroOrb` con WebGPU/`three` headless o con CSS-only su mobile per ridurre TTI mobile.
- Self-host font (`Inter`, `Space Grotesk`, `JetBrains Mono`) per eliminare round-trip a `fonts.googleapis.com`.

---

## 2. Lighthouse — proiezioni e baseline

> Eseguire dopo il deploy con: `npx unlighthouse --site https://ai.bitora.it`
> oppure Lighthouse CI: `npx lhci autorun --collect.url=https://ai.bitora.it/`

Stima conservativa basata sulla composizione attuale (mobile, simulato 4G):

| Pagina             | Performance | Accessibility | Best Practices | SEO |
| ------------------ | ----------- | ------------- | -------------- | --- |
| `/` (home)         | 78–85       | 95+           | 95+            | 100 |
| `/automazioni`     | 88–94       | 95+           | 95+            | 100 |
| `/chatbot`         | 88–94       | 95+           | 95+            | 100 |
| `/siti-web`        | 90–96       | 95+           | 95+            | 100 |
| `/gestionali`      | 90–96       | 95+           | 95+            | 100 |
| `/formazione`      | 90–96       | 95+           | 95+            | 100 |
| `/casi-studio`     | 92–98       | 95+           | 95+            | 100 |
| `/piemonte`        | 90–96       | 95+           | 95+            | 100 |
| `/contatti`        | 90–96       | 95+           | 95+            | 100 |
| `/grazie`          | 90–96       | 95+           | 95+            | 95 (noindex) |

> La home è penalizzata di 10–15 punti da `three.js` (TBT + bundle). Accettabile finché si resta sopra 75 mobile.

**Core Web Vitals target:**
- LCP ≤ 2.5s (LCP element: titolo H1 della home)
- INP ≤ 200 ms
- CLS ≤ 0.05 (l'orb è dentro un wrapper con `height` fisso, niente layout shift)

---

## 3. Conversion checklist

| Item                                                   | Status |
| ------------------------------------------------------ | ------ |
| CTA primaria sopra il fold (home)                       | OK |
| CTA "Prenota diagnosi" coerente in tutte le pagine      | OK |
| Form con un solo step, max 6 campi                      | OK |
| Form con loading state e messaggio di successo          | OK |
| Pagina `/grazie` come confirm + next steps              | OK |
| Telefono / WhatsApp visibile in header e footer         | **TODO** placeholder `39XXXXXXXXXX` ancora presente |
| Email diretta visibile in footer + contatti             | OK |
| Bonus Piemonte / Voucher chiamato esplicitamente        | OK |
| Casi studio con metriche numeriche                      | OK |
| Pricing pubblico (range trasparente)                    | OK |
| Trust elements (clienti, anni esperienza, settori)      | parzialmente OK — manca logo wall reali |
| FAQ in homepage                                         | OK |
| Pulsante WhatsApp floating su mobile                    | **TODO** consigliato (FAB in basso a destra) |

**Blocker conversion**: sostituire numero WhatsApp placeholder. `wa.me/39XXXXXXXXXX` è ovunque e rompe il flusso.

---

## 4. SEO checklist

| Item                                                            | Status |
| --------------------------------------------------------------- | ------ |
| `<title>` univoco per pagina (max 60 char)                       | OK |
| `<meta name="description">` univoca (max 160 char)               | OK |
| Open Graph (`og:title`, `og:description`, `og:image`)            | OK / **TODO** og-default.png |
| Twitter Card                                                    | OK |
| `lang="it"` sul `<html>`                                        | OK |
| URL parlanti, kebab-case                                        | OK |
| H1 unico per pagina                                             | OK |
| Heading hierarchy (h1 → h2 → h3)                                | OK |
| Schema JSON-LD `Organization`                                   | OK in Layout |
| Schema JSON-LD `LocalBusiness`                                  | OK in Layout |
| Schema JSON-LD `FAQPage` (homepage)                             | **TODO** consigliato |
| Schema JSON-LD `Service` per ogni servizio                      | **TODO** consigliato |
| Schema JSON-LD `BreadcrumbList`                                 | **TODO** opzionale |
| `sitemap.xml` accessibile                                       | OK (dinamica via `/sitemap.xml`) |
| `robots.txt` accessibile e coerente                             | OK (dinamica via `/robots.txt`) |
| Disallow `/api/` e `/grazie`                                    | OK |
| Canonical                                                       | **TODO** consigliato in `Layout.astro` (`<link rel="canonical">`) |
| Hreflang                                                        | non necessario (solo IT) |
| 404 personalizzato                                              | **TODO** creare `src/pages/404.astro` |

**Blocker SEO**: caricare `og-default.png` (1200×630) in `public/`. Senza questo le condivisioni social mostrano fallback grigio.

---

## 5. Accessibility (a11y) checklist

| Item                                                       | Status |
| ---------------------------------------------------------- | ------ |
| Contrasto testo principale ≥ 4.5:1                          | OK (white su #080810) |
| Contrasto testo secondario (slate-300/400)                  | OK ai limiti, da verificare visualmente in produzione |
| Focus ring visibile                                         | OK (`:focus-visible` nel global CSS) |
| Skip link "Vai al contenuto"                                | OK in `Layout.astro` |
| Tutti i link/button con label testuale o `aria-label`       | OK |
| Mobile drawer con `aria-expanded` + `aria-controls`         | OK |
| Form: `<label>` associato a ogni input                      | OK |
| Form: messaggi di errore programmatici                      | OK (`role="alert"` + `aria-live`) |
| Honeypot non focusabile                                     | OK (`tabindex="-1"`, `aria-hidden`) |
| `prefers-reduced-motion` rispettato                         | OK in HeroOrb, ParticleField, FloatingNodes, Reveal |
| `<svg>` decorativi con `aria-hidden="true"`                 | OK |
| Heading hierarchy senza salti                               | OK |
| Lingua dichiarata                                           | OK (`lang="it"`) |
| `:focus` visibile con tastiera (Tab)                        | OK |

**Blocker a11y**: nessuno. Da rieseguire test con `axe-core` o WAVE dopo il deploy.

---

## 6. Mobile UX checklist

| Item                                                       | Status |
| ---------------------------------------------------------- | ------ |
| Tap target ≥ 44×44 px                                       | OK (Button h-11 / h-12) |
| Hamburger menu funzionante                                  | OK |
| Drawer chiude su click link / Esc / overlay                 | OK |
| Form spaziato su mobile                                     | OK |
| `HeroOrb` riducibile o nascondibile su mobile               | **TODO** consigliato `hidden md:block` |
| Marquee non rompe layout su iPhone SE (375px)               | **TODO** verificare in produzione |
| `AnimatedDashboard` leggibile su mobile                     | OK (responsive) |
| FAB WhatsApp                                                | **TODO** consigliato |

---

## 7. Performance e network

| Item                                            | Status |
| ----------------------------------------------- | ------ |
| Cache headers su `/api/*`                       | OK (`no-store`) |
| Cache headers su `_astro/*`                     | OK (Astro default = immutable) |
| Compressione gzip / brotli                      | dipende da Coolify reverse proxy / Traefik |
| HTTP/2                                          | dipende da Traefik (ON di default su Coolify) |
| Healthcheck endpoint                            | OK `/api/health` |
| Image optimization                              | OK (Astro `_image.astro.mjs` presente) |
| Preconnect font                                 | OK |
| `font-display: swap`                            | OK (parametro `display=swap` su Google Fonts) |

---

## 8. Sicurezza

| Item                                                       | Status |
| ---------------------------------------------------------- | ------ |
| HTTPS                                                       | gestito da Coolify / Let's Encrypt |
| Honeypot form                                               | OK (`website` field) |
| Validazione server-side (Zod)                               | OK |
| Sanitizzazione input nell'email (escape HTML)               | OK (template usa `escapeHtml`) |
| Disallow `/api/` in robots                                  | OK |
| `RESEND_API_KEY` in env, mai nel client                     | OK |
| `noindex` su `/grazie`                                      | OK |
| Rate limiting form                                          | **TODO** non implementato — consigliato a livello di Traefik o middleware |
| CSRF                                                        | non strettamente necessario (form same-origin), opzionale |
| Headers di sicurezza (`X-Frame-Options`, `X-Content-Type`)  | **TODO** configurare nel reverse proxy Coolify |

---

## 9. Deploy / DevOps Coolify

| Item                                                   | Status |
| ------------------------------------------------------ | ------ |
| `Dockerfile` multi-stage Node 22 alpine                 | OK |
| `.dockerignore`                                         | OK |
| User non-root (`astro:1001`)                            | OK |
| `HEALTHCHECK` Docker → `/api/health`                    | OK |
| Variabili d'ambiente documentate (`.env.example`)       | OK |
| Healthcheck applicativo Coolify                         | OK (path `/api/health`, port 80) |
| Documentazione deploy (`README.md` sezione Coolify)     | OK |
| Test end-to-end form Resend in staging                  | **TODO** prima del go-live |
| Backup / monitoring                                     | da configurare lato Coolify (Sentry / Uptime Kuma) |
| Build cache layer                                       | OK (deps stage + app stage separati) |

---

## 10. Blocker pre-go-live

Lista pulita di azioni da fare PRIMA di puntare il DNS:

1. **Sostituire `wa.me/39XXXXXXXXXX`** con il numero reale in:
   - `src/components/Header.astro`
   - `src/components/Footer.astro`
   - `src/pages/index.astro`
   - `src/pages/chatbot.astro`
   - `src/pages/contatti.astro`
   - `src/pages/piemonte.astro`
   (basta ricerca globale: `grep -r "39XXXXXXXXXX" src/`)
2. **Configurare Resend**:
   - Verificare dominio `ai.bitora.it` (DKIM / SPF / Return-Path)
   - Generare `RESEND_API_KEY` e salvarla in Coolify
   - Impostare `CONTACT_FROM=no-reply@ai.bitora.it` e `CONTACT_TO=info@bitora.it`
3. **Caricare immagine OG**: `public/og-default.png` (1200×630, brand gradient + logo).
4. **Test end-to-end form** in staging Coolify: invio → email arriva → redirect `/grazie`.
5. **DNS**: puntare `ai.bitora.it` al VPS (CNAME o A record), abilitare SSL su Coolify.
6. **Search Console + Bing Webmaster Tools**: verificare proprietà e inviare sitemap.
7. **Analytics**: aggiungere snippet Umami / Plausible / GA4 in `Layout.astro`.
8. **404 page**: creare `src/pages/404.astro` con stesso design system.
9. **Lighthouse run reale** post-deploy e archiviare i 3 PDF (mobile + desktop) in `gtm/`.

## 11. Nice-to-have post lancio

- Schema `FAQPage` automatico dal componente FAQ
- Schema `Service` per ognuna delle 5 pagine servizio
- WhatsApp FAB persistente su mobile
- A/B test della headline homepage (variante "AI che lavora per te" vs corrente)
- Calendly / Cal.com embed nella pagina contatti come alternativa al form
- Newsletter signup nel footer (Resend Audiences)
- Blog `/blog` per SEO long-tail Piemonte
- `next-sitemap`-like split: sitemap-pages.xml + sitemap-cases.xml quando i casi studio crescono
- Analytics evento `form_submit_success` su `/grazie`

---

## Riepilogo

Il sito è **pronto al deploy** dal punto di vista codice/build. Ci sono 4 blocker reali pre-go-live:

1. Numero WhatsApp placeholder
2. Configurazione Resend + dominio email
3. Immagine `og-default.png`
4. Test E2E del form in staging Coolify

Il resto è "nice to have" o ottimizzazione iterativa post-lancio.

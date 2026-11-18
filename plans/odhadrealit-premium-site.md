# Implementation Plan — odhadrealit.sk Premium PropTech Website

## 1. Goal and success criteria

Build a complete, high-fidelity React/Vite website for **odhadrealit.sk** that:

- Feels premium, data-led, modern, and original while translating the attached Orwin reference’s visual rhythm into a PropTech context.
- Prioritizes an exceptional homepage, then supports six coherent secondary pages.
- Uses professional Slovak copy with correct diacritics and no unsupported claims, invented company details, or fake social proof.
- Works as a responsive, accessible interactive prototype with client-side navigation, a mobile menu, accordions, smooth scrolling, and a validated multi-step demo valuation.
- Clearly labels illustrative dashboard values and valuation output as demo/orientational data.
- Requires no backend: submissions and valuation results remain in local React state and are not persisted or transmitted.

## 2. Confirmed technical baseline

- Existing app: blank React 19 + Vite 8 + TypeScript + Tailwind CSS v4 scaffold.
- Existing design system: none. Create a small local component/token system using Tailwind utilities and CSS variables.
- Package manager: pnpm, based on `pnpm-lock.yaml` and repository toolchain instructions.
- Existing dev server is host-managed and must not be started manually.
- Typography: public Google **Manrope** (400/500/600/700/800), imported in `src/index.css`.
- Add `lucide-react` for a consistent outlined icon language rather than hand-drawn or emoji icons.
- Use Unsplash MCP-selected architecture/interior photography for image-led sections, with intentional crops and descriptive Slovak alt text. Do not copy reference-site imagery.

## 3. Visual direction derived from the PDF

Translate, rather than reproduce, these reference traits:

- Small, crisp white navigation above a large rounded hero.
- Hero as a dominant architectural container with deep-to-soft gradient, oversized headline, and overlapping laptop/mobile product mockups.
- Four cards visually attached beneath the hero.
- Bold editorial headings mixing dark and muted text.
- Numbered process rows separated by fine rules.
- Asymmetrical, horizontally scrolling or offset card compositions.
- Image-led promotional panels and a large final gradient CTA.
- Restrained palette, generous negative space, large radii, and subtle shadows.

Original differentiation for odhadrealit.sk:

- Purple/olive/green palette supplied by the user.
- Map, valuation range, property photography, price trend chart, comparable-listing cards, and decision-path UI instead of e-commerce screens.
- Thin geographic contour/grid details inside dashboard visuals, without decorative blob clutter.
- Green used primarily for actions, selected states, and chart accents; purple remains the dominant brand color.

## 4. Design system and global styling

Define semantic CSS variables in `src/index.css` for:

- Brand colors: primary/secondary purple, muted olive, soft green, accent lime.
- Text, muted text, border, surface, white background.
- Supporting semantic tokens: subtle purple surface, lime hover, focus ring, error/success colors, restrained shadow presets.
- Radius scale: pill, 24px cards, 36px hero, and smaller inner-control radii.
- Container width: `1356px`; responsive gutters of 32/24/16px.
- Section rhythm: approximately 96/64/48px desktop/tablet/mobile.
- Fluid display and section typography using `clamp()`.
- Shared focus-visible outline, reduced-motion overrides, text selection, and body defaults inside `@layer base`.

Create reusable UI primitives:

- `Container`, `SectionHeading`, `Eyebrow`
- `ButtonLink` and `Button` variants: lime primary, purple primary, white/ghost secondary
- `Logo`
- `IconBadge`
- `DemoBadge` for “Ukážkové údaje”
- `PropertyImage`
- `DashboardPreview` and small chart/map/comparable primitives

All interactive controls receive hover, active, focus-visible, disabled, and validation states. Animations use opacity/transform only and are disabled or reduced under `prefers-reduced-motion`.

## 5. Application structure

Organize the implementation to avoid an oversized `App.tsx`:

- `src/App.tsx` — route resolution, route transition wrapper, shared shell
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/*` — buttons, headings, accordion, fields, demo badge
- `src/components/visuals/*` — dashboard, laptop/mobile frame, chart, map, service visuals
- `src/components/valuation/ValuationWizard.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/ValuationPage.tsx`
- `src/pages/SellPage.tsx`
- `src/pages/BuyoutPage.tsx`
- `src/pages/AgentsPage.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/content/siteContent.ts` — navigation, FAQs, service/page copy, footer links
- `src/lib/router.ts` — dependency-light History API routing helpers and route table
- `src/index.css` — Tailwind import, Google font import, semantic tokens, global effects

Use clean client-side paths:

- `/`
- `/odhad-ceny`
- `/predaj-nehnutelnosti`
- `/vykup-nehnutelnosti`
- `/pre-maklerov`
- `/o-nas`
- `/kontakt`

Internal links use a local accessible `Link` component that updates `history.pushState`, closes the mobile menu, scrolls to the top (or an anchor), and handles `popstate`. Unknown paths render a polished not-found state with a route back home.

## 6. Shared site shell

### Header

- White sticky header with subtle background/blur only after scroll.
- Left wordmark “odhadrealit.sk” with a minimal geometric mark.
- Desktop nav links exactly as requested.
- Lime pill CTA to `/odhad-ceny`.
- Mobile hamburger with proper `aria-expanded`, a full-width dropdown/drawer, focus-visible states, Escape/outside-click close, and body scroll control.
- Highlight active route without creating heavy tab styling.

### Footer

- Calm light-surface footer with logo, concise positioning statement, services column, company column, and contact column.
- Contact details explicitly marked as placeholders, e.g. “E-mail: doplniť”, rather than fabricated values.
- Legal links for Ochrana súkromia, Nastavenia cookies, and Obchodné podmienky display lightweight informational prototype panels or inline notices so links are functional without pretending legal documents exist.
- Include a short demo disclaimer about orientational information and no real-time market-data connection.

## 7. Homepage implementation

### A. Hero

- Rounded 36px gradient shell using the specified 110-degree purple-to-green gradient.
- Two-column asymmetric desktop layout; stacked mobile layout.
- Left:
  - Exact requested headline with “skutočnú hodnotu” highlighted in soft green/lime tint.
  - Requested supporting copy.
  - Primary and secondary CTA.
  - Address field with location icon, validation, and submit action routing to `/odhad-ceny` with the entered address prefilled in local navigation state/query string.
  - Small reassurance line: no obligation, demo/orientational result.
- Right:
  - CSS-built perspective laptop and overlapping phone.
  - Dashboard includes premium residence image, fictional Bratislava address, valuation range, line chart, stylized map with markers, and comparable properties.
  - Persistent “Ukážkové údaje” badge; values never framed as live data.
  - Layered lighting and restrained realistic shadows, with simpler transforms on mobile/reduced motion.

### B. Hero-attached benefits

Four cards visually tucked under the hero:

1. Odhad ceny online
2. Prehľad trhu
3. Jednoduchý proces
4. Pomoc pri predaji

Use Lucide outlined icons, concise original copy, one slightly emphasized lead card, and responsive 4/2/1-column behavior.

### C. Main services

Large heading: “Všetko, čo potrebujete vedieť o svojej nehnuteľnosti.”

Use a varied editorial grid:

- Online odhad ceny: wide purple card with dashboard snippet and valuation chip.
- Predaj nehnuteľnosti: tall image-led card with process timeline overlay.
- Rýchly výkup: light card with an individual-offer pathway UI and clear nonbinding language.

Each card links to its relevant page; compositions differ rather than repeating one template.

### D. Numbered process

Heading: “Od odhadu k správnemu rozhodnutiu.”

Four full-width rows with large numbers, titles, concise explanations, fine dividers, and responsive column alignment:

01 Zadáte nehnuteľnosť  
02 Získate orientačný odhad  
03 Spoznáte svoje možnosti  
04 Vyberiete ďalší krok

### E. Data and insights

- Two-column premium section with text/CTA left and a larger analytics dashboard right.
- Chart, map, range, neighborhood context, and comparable cards use fictional values and a visible demo label.
- Copy states that the prototype illustrates how supplied property attributes can support orientation; it does not imply live integrations.

### F. Trust and credibility

- Editorial intro plus four benefit cards:
  - Prehľadné informácie
  - Jednoduché používanie
  - Individuálny prístup
  - Pomoc pri ďalšom rozhodovaní
- Avoid metrics, logos, ratings, awards, and testimonial claims.
- Vary card scale/position subtly to preserve asymmetry.

### G. Property selling feature

- Large image-led asymmetrical banner using a contemporary Slovak/central-European residential image.
- Headline: “Keď poznáte cenu, ľahšie sa rozhodnete.”
- Explain two pathways: assisted sale and nonbinding buyout enquiry.
- CTA to `/predaj-nehnutelnosti`.

### H. Real estate professionals

- Split section with professional cooperation copy and a purpose-built agent dashboard mockup.
- Show lead/workflow concepts only as interface examples, not performance claims.
- CTA to `/pre-maklerov`.

### I. FAQ

- Six requested questions with concise Slovak answers.
- Single-open accordion behavior; first item open by default.
- Real buttons, `aria-expanded`, associated panels, keyboard accessibility, and animated height/opacity with reduced-motion fallback.

### J. Final CTA

- Large rounded gradient banner.
- Exact requested headline and supporting text.
- Lime CTA to valuation page.
- Original floating property card/dashboard/map-pin composition that echoes, but does not duplicate, the hero.

## 8. Secondary pages

All pages use a consistent compact gradient/page hero, breadcrumb-like eyebrow, strong H1, contextual CTA, and the shared footer while varying content structure enough to avoid template repetition.

### Odhad ceny (`/odhad-ceny`)

- Page intro clearly explains the demo/orientational nature.
- Multi-step wizard:
  1. Lokalita — address, city/municipality, postcode.
  2. Typ — apartment/house selection, ownership/build-state options.
  3. Parametre — area, rooms, floor, optional balcony/parking/condition.
  4. Súhrn — editable summary and explicit demo consent/acknowledgment.
  5. Výsledok — deterministic illustrative range and next-step cards.
- Validation:
  - Required location fields.
  - Supported numeric ranges for area, rooms, floor, and postcode format.
  - Inline Slovak errors linked with `aria-describedby`.
  - Block progression until current-step fields are valid.
- Result generation:
  - Use a transparent, deterministic front-end formula based on property type, area, condition, and a coarse demo locality multiplier.
  - Label the output “Ilustračný demo výsledok — nejde o znalecký posudok ani garantovanú trhovú cenu.”
  - Never claim external database access.
- Controls for Back, Continue, Start over; progress indicator; preserve values while moving between steps.
- Hero address query prefills step one.

### Predaj nehnuteľnosti (`/predaj-nehnutelnosti`)

- Explain assisted-sale journey, preparation, presentation, enquiries, and decision support.
- Image-led stages, checklist, “predaj vs. výkup” comparison, and CTA to a nonbinding enquiry form.
- Front-end enquiry confirmation only; message explicitly says nothing was transmitted in this prototype.

### Výkup nehnuteľnosti (`/vykup-nehnutelnosti`)

- Explain when a faster-sale enquiry may be relevant, trade-offs, document preparation, and no guaranteed offer.
- Four-step process and compact form for property basics/contact placeholder.
- Demo confirmation with next-step explanation, not a promised quote.

### Pre maklérov (`/pre-maklerov`)

- Cooperation scenarios: branded valuation support, clearer client consultations, structured property intake, and market-facing materials.
- Agent dashboard visual, workflow cards, and cooperation enquiry.
- No claims of existing integrations, partners, lead volume, or conversion results.

### O nás (`/o-nas`)

- Brand purpose, principles, responsible-data stance, and how the platform is intended to support decisions.
- No fabricated founding story, team roster, address, registration data, awards, or milestones.
- Editorial manifesto layout with restrained visual storytelling.

### Kontakt (`/kontakt`)

- Contact-intent cards: valuation help, sale/buyout, professional cooperation, general question.
- Accessible contact form with name, email, topic, and message validation.
- Clearly marked placeholder contact block.
- On submit, show local demo confirmation stating that the prototype did not send the message.

## 9. Content and imagery rules

- Write all marketing and helper copy in natural Slovak with correct accents.
- Keep sentence lengths controlled and avoid inflated promises.
- Use fictional dashboard addresses and numbers only when marked as “Ukážkové údaje.”
- Add alt text based on what the image communicates; decorative visuals use empty alt attributes.
- Select 2–4 context-specific Unsplash images at implementation time:
  - contemporary central-European apartment exterior
  - bright premium residential interior
  - modern apartment/house detail suitable for a wide banner
- Reuse images thoughtfully with different crops rather than creating a stock-heavy site.
- Do not use logos, photos, testimonials, or copy from Orwin or ocenujem.sk.

## 10. Responsive behavior

- Breakpoints follow content needs rather than device names.
- Desktop: full nav, two-column hero, layered perspective devices, varied service grid.
- Tablet: compact nav until collapse threshold, stacked/asymmetric sections, 2-column cards.
- Mobile:
  - 16px gutters, 48px section rhythm, reduced radii where needed while preserving the 36px hero character.
  - Hero copy first; mockups scale into a single controlled composition with no horizontal overflow.
  - Buttons become full-width where helpful.
  - Process rows stack number/title/copy.
  - Dashboard internals simplify but retain legibility.
  - Forms use single columns and large touch targets.
- Test at approximately 375px, 768px, 1024px, and 1440px widths.

## 11. Interaction and accessibility details

- Semantic landmarks: header, nav, main, sections with labelled headings, footer.
- One H1 per page and logical heading hierarchy.
- Skip-to-content link.
- Keyboard-operable menu, accordion, forms, and modal/notices.
- Minimum touch target around 44px.
- Visible focus states with purple/lime contrast.
- Labels remain visible; placeholders do not substitute for labels.
- Validation summary or first-invalid-field focus on blocked form progression.
- Smooth scrolling only when motion is allowed.
- Route changes update `document.title`, move focus to the main page heading, and scroll to top.
- Decorative CSS motion remains subtle: small card lift, chart draw/fade, device float, and section reveal; no scroll-jacking or autoplay carousels.

## 12. Verification

After implementation:

1. Run `pnpm format` using the repository-provided formatter.
2. Run `pnpm build` because this is a broad multi-page change and the design-system procedure explicitly requires a production build.
3. Check all seven routes, active navigation, browser back/forward behavior, mobile menu, anchor links, FAQ accordion, legal prototype links, and 404 state.
4. Exercise valuation wizard:
   - empty required fields
   - invalid postcode/numeric ranges
   - Back/Next state retention
   - deterministic result
   - reset flow
   - hero-address prefill
5. Exercise sale/buyout/contact demo forms and verify their confirmations clearly state no submission occurred.
6. Inspect responsive behavior at 375/768/1024/1440px with no overflow, clipped device mockups, or unreadable chart labels.
7. Keyboard-check focus order, Escape behavior, accordion semantics, and form error associations.
8. Verify reduced-motion CSS and contrast for primary text, controls, focus rings, and lime buttons.
9. Search rendered copy/source for placeholder lorem ipsum, unsupported real-data claims, invented contacts, statistics, awards, partners, and testimonials.

## 13. Explicit non-goals

- No backend, CMS, database, authentication, e-mail delivery, CRM integration, map API, or live valuation/market-data provider.
- No persistence beyond the current browser state.
- No claim that the demo result is a formal appraisal, guaranteed sale price, or binding buyout offer.
- No fabricated legal/company information; missing details remain clearly marked placeholders.

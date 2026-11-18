import { useRef, type ReactNode } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  Camera,
  Check,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Compass,
  Eye,
  FileSearch,
  FileText,
  HandCoins,
  Handshake,
  Heart,
  HelpCircle,
  KeyRound,
  Layers,
  LifeBuoy,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Palette,
  Phone,
  Receipt,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  UserRound,
  UsersRound,
  Workflow,
  Wrench,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Link } from "@/lib/router"
import { images } from "@/content"
import { ButtonLink, cx, Eyebrow } from "@/components/ui"
import { AgentBoard } from "@/components/visuals"
import { EnquiryForm } from "@/components/EnquiryForm"
import {
  AddressSearch,
  ClosingBanner,
  InfoItem,
  PageIntro,
  SectionHeading,
  Soft,
  usePageMotion,
} from "@/components/site"

/* ---------- Shared page scaffolding ---------- */

function Page({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  usePageMotion(ref)
  return (
    <div ref={ref} className="[&>section+section]:pt-0">
      {children}
    </div>
  )
}

type Feature = {
  icon: LucideIcon
  t: string
  d: string
}

type Step = {
  t: string
  d: string
}

/* Divided row of short benefits, same pattern as the homepage hero strip. */
function BenefitStrip({ items, center = false }: { items: Feature[]; center?: boolean }) {
  return (
    <ul
      className={cx(
        "mt-14 grid gap-y-8 border-t border-line pt-10 sm:mt-16 sm:grid-cols-3 sm:gap-y-0",
        center && "mx-auto max-w-[1000px]",
      )}
    >
      {items.map((b, i) => (
        <li
          key={b.t}
          className={cx(
            "flex gap-4 text-left sm:px-6",
            i > 0 && "sm:border-l sm:border-line",
            i === 0 && "sm:pl-0",
          )}
        >
          <b.icon aria-hidden className="mt-0.5 size-6 shrink-0 text-sage" strokeWidth={1.6} />
          <div>
            <h2 className="text-[0.98rem] font-extrabold tracking-tight text-ink">{b.t}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">{b.d}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

/* Horizontal numbered steps, mirrors the homepage process section. */
function StepRow({ items }: { items: Step[] }) {
  return (
    <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
      {items.map((s, i) => (
        <li key={s.t} data-reveal className="group relative border-t border-line pt-7">
          <span
            aria-hidden
            className="absolute -top-px left-0 h-0.5 w-10 bg-brand transition-[width] duration-500 group-hover:w-full"
          />
          <span className="block text-[2.75rem] leading-none font-extrabold tracking-[-0.04em] text-lime">
            0{i + 1}
          </span>
          <h3 className="mt-5 text-[1.15rem] font-extrabold tracking-tight text-ink">{s.t}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{s.d}</p>
        </li>
      ))}
    </ol>
  )
}

/* Two-column enquiry block: context on the left, form on the right. */
function EnquirySection({
  id,
  eyebrow,
  title,
  lead,
  next,
  children,
}: {
  id: string
  eyebrow: string
  title: ReactNode
  lead: string
  next: string[]
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="container-site section-y">
      <div className="rounded-[28px] bg-surface px-5 py-12 sm:rounded-hero sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 [&>*]:min-w-0">
          <div>
            <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} lead={lead}>
              {title}
            </SectionHeading>
            <div data-reveal className="mt-10">
              <p className="text-xs font-bold tracking-[0.14em] text-olive uppercase">
                Čo bude nasledovať
              </p>
              <ol className="mt-4 flex flex-col gap-3">
                {next.map((n, i) => (
                  <li key={n} className="flex items-start gap-3 text-[0.95rem] text-ink">
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-extrabold text-brand ring-1 ring-line">
                      {i + 1}
                    </span>
                    {n}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div data-reveal>{children}</div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Predaj nehnuteľnosti ---------- */

export function SellPage() {
  return (
    <Page>
      <PageIntro
        eyebrow="Predaj nehnuteľnosti"
        title={
          <>
            Predaj s jasným plánom <Soft>od prvého dňa.</Soft>
          </>
        }
        lead="Pomôžeme vám pripraviť predaj bytu či domu tak, aby ste sa rozhodovali s prehľadom – od orientačnej ceny až po rokovanie so záujemcami."
        aside={
          <div className="relative mx-auto max-w-[520px] pb-8 lg:pb-0">
            <img
              src={images.interior.src}
              alt={images.interior.alt}
              className="aspect-[5/4] w-full rounded-card object-cover shadow-lift"
            />
            <div className="absolute bottom-0 left-4 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-lift sm:-left-8 lg:bottom-8">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <ClipboardCheck aria-hidden className="size-[18px]" strokeWidth={1.8} />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-muted">Ďalší krok</p>
                <p className="text-sm font-extrabold text-ink">Príprava nehnuteľnosti</p>
              </div>
            </div>
          </div>
        }
        footer={
          <BenefitStrip
            items={[
              { icon: Camera, t: "Kvalitná prezentácia", d: "Vecne a pravdivo, v čo najlepšom svetle." },
              { icon: ClipboardCheck, t: "Podklady v poriadku", d: "Pripomenieme dokumenty, ktoré predaj nezdržia." },
              { icon: MessageCircle, t: "Priebežná komunikácia", d: "Vždy viete, čo sa deje a čo nasleduje." },
            ]}
          />
        }
      >
        <ButtonLink to="/predaj-nehnutelnosti#dopyt-predaj">Nezáväzný dopyt</ButtonLink>
        <ButtonLink to="/odhad-ceny" variant="outline" arrow={false}>
          Najprv odhad ceny
        </ButtonLink>
      </PageIntro>

      {/* Process — vertical timeline with sticky heading */}
      <section aria-labelledby="sell-process" className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="sell-process"
              eyebrow="Postup"
              lead="Každý predaj je iný. Toto je rámec, z ktorého spolu vychádzame."
            >
              <Soft>Ako môže</Soft> prebiehať predaj.
            </SectionHeading>
          </div>
          <ol className="relative">
            <span aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-line" />
            {[
              { t: "Úvodná konzultácia", d: "Prejdeme vašu situáciu, očakávania a časový rámec." },
              { t: "Cenová stratégia", d: "Z orientačného odhadu a stavu nehnuteľnosti navrhneme rozumné cenové rozpätie." },
              { t: "Príprava a prezentácia", d: "Pomôžeme s fotografiami, popisom a podkladmi, ktoré záujemcovia potrebujú." },
              { t: "Záujemcovia a rokovanie", d: "Koordinujeme obhliadky a pomáhame pri rozhodovaní o ponukách." },
            ].map((s, i) => (
              <li key={s.t} data-reveal className="relative flex gap-6 pb-10 last:pb-0">
                <span
                  className={cx(
                    "relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
                    i === 0 ? "bg-brand text-white" : "bg-white text-brand ring-1 ring-line",
                  )}
                >
                  0{i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-[1.2rem] font-extrabold tracking-tight text-ink">{s.t}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-muted">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Comparison */}
      <section aria-labelledby="sell-compare" className="container-site section-y">
        <SectionHeading id="sell-compare" eyebrow="Porovnanie" align="center">
          Klasický predaj <Soft>alebo výkup?</Soft>
        </SectionHeading>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {[
            {
              t: "Klasický predaj",
              d: "Pre tých, ktorí majú čas a chcú dosiahnuť vhodnú cenu na voľnom trhu.",
              pts: ["Priestor na dosiahnutie trhovej ceny", "Dlhší časový horizont", "Obhliadky a rokovanie so záujemcami"],
              to: "/predaj-nehnutelnosti#dopyt-predaj",
              cta: "Chcem predávať",
              dark: false,
            },
            {
              t: "Výkup nehnuteľnosti",
              d: "Rýchlejšia alternatíva s individuálnou, nezáväznou ponukou.",
              pts: ["Rýchlejšie riešenie", "Cena môže byť nižšia ako na voľnom trhu", "Menej obhliadok a príprav"],
              to: "/vykup-nehnutelnosti",
              cta: "Viac o výkupe",
              dark: true,
            },
          ].map((c) => (
            <div
              key={c.t}
              data-reveal
              className={cx(
                "flex flex-col rounded-card p-8 sm:p-10",
                c.dark ? "on-dark bg-navy text-white" : "border border-line bg-white",
              )}
            >
              <h3 className="text-[1.5rem] font-extrabold tracking-tight">{c.t}</h3>
              <p className={cx("mt-2", c.dark ? "text-white/70" : "text-muted")}>{c.d}</p>
              <ul className={cx("mt-6 flex flex-col divide-y border-y", c.dark ? "divide-white/10 border-white/10" : "divide-line border-line")}>
                {c.pts.map((p) => (
                  <li key={p} className="flex items-center gap-3 py-3">
                    <Check aria-hidden className={cx("size-4 shrink-0", c.dark ? "text-lime" : "text-sage")} strokeWidth={2.6} />
                    <span className={c.dark ? "text-white/85" : "text-ink"}>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <ButtonLink to={c.to} variant={c.dark ? "light" : "brand"}>
                  {c.cta}
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
      </section>

      <EnquirySection
        id="dopyt-predaj"
        eyebrow="Nezáväzný dopyt"
        title={
          <>
            Povedzte nám <Soft>o svojej nehnuteľnosti.</Soft>
          </>
        }
        lead="Ozveme sa vám a navrhneme postup, ktorý zodpovedá vašej situácii. Dopyt vás k ničomu nezaväzuje."
        next={["Ozveme sa vám a doplníme si informácie", "Prejdeme možnosti a cenové rozpätie", "Rozhodnete sa, či chcete pokračovať"]}
      >
        <EnquiryForm
          id="sell"
          title="Dopyt na predaj"
          submitLabel="Odoslať dopyt"
          withLocation
          topics={["Byt", "Rodinný dom", "Pozemok", "Iné"]}
          messageLabel="Krátky popis"
          messagePlaceholder="Napríklad veľkosť, stav a kedy by ste chceli predávať."
        />
      </EnquirySection>
    </Page>
  )
}

/* ---------- Výkup nehnuteľnosti ---------- */

export function BuyoutPage() {
  return (
    <Page>
      <PageIntro
        eyebrow="Výkup nehnuteľnosti"
        align="center"
        title={
          <>
            Keď je čas dôležitejší <Soft>ako čakanie.</Soft>
          </>
        }
        lead="Výkup môže byť vhodný pri dedičstve, sťahovaní či finančných záväzkoch – alebo vtedy, keď nechcete absolvovať dlhý predajný proces. Každú nehnuteľnosť posudzujeme individuálne."
        footer={
          <BenefitStrip
            center
            items={[
              { icon: Timer, t: "Rýchlosť", d: "Kratší proces bez dlhého čakania na kupujúceho." },
              { icon: KeyRound, t: "Jednoduchosť", d: "Menej obhliadok, príprav a koordinácie." },
              { icon: Scale, t: "Transparentnosť", d: "Otvorene o cene, podmienkach a kompromisoch." },
            ]}
          />
        }
      >
        <ButtonLink to="/vykup-nehnutelnosti#dopyt-vykup">Požiadať o ponuku</ButtonLink>
        <ButtonLink to="/predaj-nehnutelnosti" variant="outline" arrow={false}>
          Porovnať s predajom
        </ButtonLink>
      </PageIntro>

      {/* When it makes sense */}
      <section aria-labelledby="buyout-when" className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            id="buyout-when"
            eyebrow="Kedy dáva výkup zmysel"
            lead="Výkup nie je pre každého. Najčastejšie pomáha v týchto situáciách."
          >
            Rýchle riešenie <Soft>pre konkrétne situácie.</Soft>
          </SectionHeading>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {[
              { icon: Clock3, t: "Potrebujete riešenie rýchlo", d: "Termín sťahovania alebo záväzky nepočkajú." },
              { icon: Wrench, t: "Nehnuteľnosť potrebuje rekonštrukciu", d: "Bez investícií do prípravy na predaj." },
              { icon: UserRound, t: "Nechcete organizovať obhliadky", d: "Menej času a koordinácie s cudzími ľuďmi." },
              { icon: FileText, t: "Dedičstvo či spoluvlastníctvo", d: "Prehľadnejšie riešenie pre viacerých vlastníkov." },
            ].map((c) => (
              <li key={c.t} data-reveal className="flex gap-4 border-t border-line py-7">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <c.icon aria-hidden className="size-5" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-[1.05rem] font-extrabold tracking-tight text-ink">{c.t}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{c.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Transparency */}
      <section aria-labelledby="buyout-fair" className="container-site section-y">
        <div
          data-reveal
          className="on-dark bg-navy grid gap-10 overflow-hidden rounded-[28px] px-6 py-12 text-white sm:rounded-hero sm:px-10 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-16 lg:py-20"
        >
          <div>
            <Scale aria-hidden className="size-7 text-lime" strokeWidth={1.6} />
            <h2
              id="buyout-fair"
              className="mt-6 text-[clamp(1.85rem,1.35rem+1.8vw,2.6rem)] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              Férovo o kompromisoch.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/75">
              Ponuka nie je garantovaná – závisí od individuálneho posúdenia nehnuteľnosti, jej
              stavu a právnych okolností. Ak si nie ste istí, začnite orientačným odhadom.
            </p>
            <ButtonLink to="/odhad-ceny" variant="light" className="mt-8">
              Zistiť orientačnú cenu
            </ButtonLink>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              { h: "Čo získate", pts: ["Rýchlejšie riešenie", "Menej starostí s prípravou", "Jasný ďalší krok"] },
              { h: "Na čo myslieť", pts: ["Cena býva nižšia ako na voľnom trhu", "Ponuka závisí od posúdenia", "Nie každá nehnuteľnosť je vhodná"] },
            ].map((col) => (
              <div key={col.h}>
                <p className="text-xs font-bold tracking-[0.14em] text-lime uppercase">{col.h}</p>
                <ul className="mt-4 flex flex-col divide-y divide-white/10 border-y border-white/10">
                  {col.pts.map((p) => (
                    <li key={p} className="py-3.5 text-[0.95rem] text-white/85">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="buyout-process" className="container-site section-y">
        <SectionHeading id="buyout-process" eyebrow="Postup" className="max-w-2xl">
          <Soft>Od dopytu</Soft> k rozhodnutiu v štyroch krokoch.
        </SectionHeading>
        <StepRow
          items={[
            { t: "Dopyt", d: "Vyplníte základné údaje o nehnuteľnosti a svojej situácii." },
            { t: "Posúdenie", d: "Prejdeme podklady, lokalitu a stav nehnuteľnosti." },
            { t: "Nezáväzná ponuka", d: "Ak je to možné, pripravíme individuálny návrh riešenia." },
            { t: "Rozhodnutie", d: "Ponuku môžete prijať, odmietnuť alebo porovnať s predajom." },
          ]}
        />
      </section>

      <EnquirySection
        id="dopyt-vykup"
        eyebrow="Dopyt na výkup"
        title={
          <>
            Požiadajte o <Soft>individuálnu ponuku.</Soft>
          </>
        }
        lead="Pošlite nám základné informácie. Odoslanie dopytu neznamená záväzok predať ani nárok na ponuku."
        next={["Posúdime podklady a lokalitu", "Ak je to možné, pripravíme nezáväzný návrh", "Rozhodnutie je výlučne na vás"]}
      >
        <EnquiryForm
          id="buyout"
          title="Dopyt na výkup"
          submitLabel="Požiadať o ponuku"
          withLocation
          topics={["Byt", "Rodinný dom", "Pozemok", "Iné"]}
          messageLabel="Situácia a stav nehnuteľnosti"
          messagePlaceholder="Napríklad dôvod výkupu, stav a časový horizont."
        />
      </EnquirySection>
    </Page>
  )
}

/* ---------- Pre maklérov ---------- */

export function AgentsPage() {
  return (
    <Page>
      <PageIntro
        eyebrow="Pre maklérov a realitné kancelárie"
        title={
          <>
            Pomáhame aj <Soft>realitným profesionálom.</Soft>
          </>
        }
        lead="Hľadáme partnerov, s ktorými chceme overiť, ako môže zrozumiteľný orientačný odhad uľahčiť prvý kontakt s klientom a prípravu na stretnutie."
        aside={
          <div className="pb-6 sm:pr-3">
            <AgentBoard />
          </div>
        }
      >
        <ButtonLink to="/pre-maklerov#spolupraca">Zistiť možnosti spolupráce</ButtonLink>
        <div className="flex flex-wrap gap-2 pl-1">
          {["Samostatní makléri", "Realitné kancelárie", "Developeri"].map((t) => (
            <span key={t} className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted">
              {t}
            </span>
          ))}
        </div>
      </PageIntro>

      <section aria-labelledby="agents-areas" className="container-site section-y">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="agents-areas" eyebrow="Oblasti spolupráce" className="max-w-2xl">
            <Soft>Čo môžeme</Soft> spoločne rozvíjať.
          </SectionHeading>
          <p data-reveal className="max-w-sm text-muted lg:pb-1">
            Konkrétnu podobu spolupráce nastavíme individuálne. Toto sú smery, ktoré chceme s
            partnermi rozvíjať.
          </p>
        </div>
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {[
            { icon: Palette, t: "Odhad s vašou značkou", d: "Orientačný výstup pre klienta s vaším logom a kontaktom." },
            { icon: Workflow, t: "Štruktúrovaný príjem", d: "Údaje o nehnuteľnosti v jednotnej, prehľadnej podobe." },
            { icon: UsersRound, t: "Lepšie stretnutia", d: "Podklady, ktoré klientovi pomôžu pochopiť cenové súvislosti." },
            { icon: Megaphone, t: "Marketingové podklady", d: "Prehľadné vizuály použiteľné v komunikácii s klientmi." },
          ].map((f) => (
            <li key={f.t} data-reveal className="border-t border-line pt-7">
              <InfoItem icon={f.icon} title={f.t} text={f.d} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="agents-start" className="container-site section-y">
        <div
          data-reveal
          className="on-dark bg-navy overflow-hidden rounded-[28px] px-6 py-12 text-white sm:rounded-hero sm:px-10 sm:py-16 lg:px-16 lg:py-20"
        >
          <div className="max-w-2xl">
            <p className="text-[0.8rem] font-bold tracking-[0.14em] text-lime uppercase">Ako začneme</p>
            <h2
              id="agents-start"
              className="mt-5 text-[clamp(1.85rem,1.35rem+1.8vw,2.6rem)] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              Spolupráca nastavená podľa vašej praxe.
            </h2>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: MessageCircle, t: "Úvodný rozhovor", d: "Zistíme, ako pracujete s klientmi a kde by vám odhad pomohol." },
              { icon: Layers, t: "Návrh nastavenia", d: "Spoločne zvolíme podobu výstupov a spôsob odovzdávania údajov." },
              { icon: Target, t: "Overenie v praxi", d: "Riešenie vyskúšame na reálnych situáciách a podľa potreby upravíme." },
            ].map((s, i) => (
              <li key={s.t} className="border-t border-white/15 pt-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-lime">0{i + 1}</span>
                  <s.icon aria-hidden className="size-5 text-white/60" strokeWidth={1.6} />
                </div>
                <h3 className="mt-4 text-[1.1rem] font-extrabold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-white/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <EnquirySection
        id="spolupraca"
        eyebrow="Spolupráca"
        title={
          <>
            Poďme sa <Soft>spoznať.</Soft>
          </>
        }
        lead="Napíšte nám o svojej kancelárii a o tom, čo by vám v práci s klientmi pomohlo."
        next={["Ozveme sa a dohodneme krátky rozhovor", "Prejdeme vaše potreby a možnosti", "Navrhneme ďalší postup"]}
      >
        <EnquiryForm
          id="agents"
          title="Záujem o spoluprácu"
          submitLabel="Odoslať"
          topics={["Samostatný maklér", "Realitná kancelária", "Developer", "Iné"]}
          messagePlaceholder="Napríklad región pôsobenia a čo by vám pomohlo."
        />
      </EnquirySection>
    </Page>
  )
}

/* ---------- O nás ---------- */

export function AboutPage() {
  const principles = [
    { icon: Eye, t: "Transparentnosť", d: "Vysvetľujeme, z čoho výsledky vychádzajú a aké majú limity." },
    { icon: Target, t: "Vecnosť", d: "Žiadne prehnané sľuby. Radšej rozumné rozpätie ako zavádzajúce číslo." },
    { icon: ShieldCheck, t: "Zodpovednosť k dátam", d: "S údajmi narábame citlivo a len v nevyhnutnom rozsahu." },
    { icon: Heart, t: "Ľudský prístup", d: "Za každým dopytom je človek a jeho konkrétna situácia." },
  ]
  return (
    <Page>
      <PageIntro
        eyebrow="O nás"
        title={
          <>
            Lepšie rozhodnutia o bývaní <Soft>začínajú porozumením.</Soft>
          </>
        }
        lead="odhadrealit.sk vzniká ako moderná platforma, ktorá ľuďom pomáha zorientovať sa v hodnote nehnuteľnosti skôr, než urobia veľké rozhodnutie."
      />

      {/* Editorial statement */}
      <section aria-label="Naše poslanie" className="container-site section-y">
        <div className="grid gap-10 border-t border-line pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pt-16">
          <p
            data-reveal
            className="text-[clamp(1.45rem,1.15rem+1.2vw,2.2rem)] leading-[1.3] font-bold tracking-[-0.02em] text-ink"
          >
            Predaj či kúpa nehnuteľnosti patrí medzi najväčšie finančné rozhodnutia v živote.{" "}
            <span className="text-olive">Napriek tomu sa často robí s neúplnými informáciami.</span>{" "}
            Chceme to zmeniť.
          </p>
          <div data-reveal className="flex flex-col gap-5 text-[1.02rem] leading-relaxed text-muted">
            <p>
              Spájame technológiu s ľudským prístupom. Technológia pomáha rýchlo pripraviť
              orientačný prehľad, človek pomáha pochopiť súvislosti a zvoliť správny ďalší krok.
            </p>
            <p>
              Nesľubujeme zázračné čísla. Ukazujeme rozpätia, vysvetľujeme, z čoho vychádzajú, a
              otvorene hovoríme o tom, kde má online odhad svoje hranice.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Fotografia" className="container-site section-y">
        <figure data-reveal className="relative overflow-hidden rounded-[28px] sm:rounded-hero">
          <img
            src={images.house.src}
            alt={images.house.alt}
            loading="lazy"
            className="h-[300px] w-full object-cover sm:h-[480px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand/75 via-brand/10 to-transparent" />
          <figcaption className="absolute right-6 bottom-6 left-6 max-w-xl text-[clamp(1.25rem,1rem+1vw,1.9rem)] leading-tight font-extrabold text-white sm:right-auto sm:bottom-10 sm:left-10">
            Každá nehnuteľnosť má svoj príbeh. Číslo je len jeho časť.
          </figcaption>
        </figure>
      </section>

      {/* Principles — editorial numbered rows */}
      <section aria-labelledby="about-principles" className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading id="about-principles" eyebrow="Princípy">
              <Soft>Hodnoty,</Soft> ktorými sa riadime.
            </SectionHeading>
          </div>
          <ol className="border-b border-line">
            {principles.map((p, i) => (
              <li
                key={p.t}
                data-reveal
                className="grid gap-3 border-t border-line py-8 sm:grid-cols-[72px_1fr] sm:gap-6"
              >
                <span className="text-sm font-extrabold tracking-[0.14em] text-olive">0{i + 1}</span>
                <div>
                  <h3 className="flex items-center gap-3 text-[1.35rem] font-extrabold tracking-tight text-ink">
                    {p.t}
                    <p.icon aria-hidden className="size-5 text-sage" strokeWidth={1.6} />
                  </h3>
                  <p className="mt-2 max-w-lg leading-relaxed text-muted">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What we do */}
      <section aria-labelledby="about-services" className="container-site section-y">
        <SectionHeading id="about-services" eyebrow="Čo robíme" className="max-w-2xl">
          Tri cesty <Soft>k lepšiemu rozhodnutiu.</Soft>
        </SectionHeading>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { to: "/odhad-ceny", icon: Compass, t: "Online odhad ceny", d: "Orientačné rozpätie pre byt alebo dom." },
            { to: "/predaj-nehnutelnosti", icon: Handshake, t: "Predaj nehnuteľnosti", d: "Podpora od prípravy až po rokovanie." },
            { to: "/vykup-nehnutelnosti", icon: HandCoins, t: "Výkup nehnuteľnosti", d: "Rýchlejšia cesta s nezáväznou ponukou." },
          ].map((s) => (
            <li key={s.to} data-reveal>
              <Link
                to={s.to}
                className="group flex h-full flex-col rounded-card border border-line bg-white p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <s.icon aria-hidden className="size-6 text-sage" strokeWidth={1.6} />
                <h3 className="mt-8 text-[1.2rem] font-extrabold tracking-tight text-ink">{s.t}</h3>
                <p className="mt-1.5 text-muted">{s.d}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-brand">
                  Zistiť viac
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ClosingBanner
        id="about-cta"
        title="Vaša nehnuteľnosť má hodnotu."
        highlight="Spoznajte ju."
        text="Začnite orientačným odhadom a získajte lepší prehľad o svojich možnostiach."
      >
        <AddressSearch id="about-address" tone="dark" />
      </ClosingBanner>
    </Page>
  )
}

/* ---------- Kontakt ---------- */

export function ContactPage() {
  const intents = [
    { icon: Compass, t: "Pomoc s odhadom", d: "Nerozumiete výsledku alebo chcete spresnenie?" },
    { icon: Handshake, t: "Predaj alebo výkup", d: "Zvažujete ďalší krok s nehnuteľnosťou?" },
    { icon: Briefcase, t: "Spolupráca", d: "Ste maklér, kancelária alebo developer?" },
    { icon: LifeBuoy, t: "Všeobecná otázka", d: "Čokoľvek ďalšie, s čím vám môžeme pomôcť." },
  ]
  const details = [
    { icon: Mail, k: "E-mail", value: "info@odhadrealit.sk" },
    { icon: Phone, k: "Telefón", value: "+421 900 000 000" },
    { icon: MapPin, k: "Adresa", value: "Hlavná 1, 811 07 Bratislava" },
    { icon: Receipt, k: "Fakturačné údaje", value: "IČO: 12345678, DIČ: SK1234567890" },
  ]
  return (
    <Page>
      <PageIntro
        eyebrow="Kontakt"
        title={
          <>
            Radi vám pomôžeme <Soft>zorientovať sa.</Soft>
          </>
        }
        lead="Napíšte nám, s čím potrebujete pomôcť."
      />
      <section aria-label="Kontaktný formulár" className="container-site pb-12 sm:pb-16 lg:pb-24">
        <div className="grid gap-12 border-t border-line pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:pt-16 [&>*]:min-w-0">
          <div className="flex flex-col gap-10">
            <div data-reveal>
              <Eyebrow>S čím vám pomôžeme</Eyebrow>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {intents.map((it) => (
                  <li key={it.t} className="flex items-start gap-4 py-5">
                    <it.icon aria-hidden className="mt-0.5 size-5 shrink-0 text-sage" strokeWidth={1.7} />
                    <div>
                      <h2 className="font-extrabold text-ink">{it.t}</h2>
                      <p className="mt-0.5 text-sm text-muted">{it.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="rounded-card bg-surface p-6 sm:p-7">
              <h2 className="flex items-center gap-2 font-extrabold text-ink">
                <Sparkles aria-hidden className="size-4 text-sage" /> Kontaktné údaje
              </h2>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                {details.map((d) => (
                  <div key={d.k} className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2.5 text-muted">
                      <d.icon aria-hidden className="size-4 text-sage" /> {d.k}
                    </dt>
                    <dd className="font-semibold text-ink/60">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Link
              data-reveal
              to="/#faq"
              className="group inline-flex items-center gap-2 self-start text-sm font-bold text-brand"
            >
              <HelpCircle aria-hidden className="size-4 text-sage" />
              Pozrite si časté otázky
              <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div data-reveal>
            <EnquiryForm
              id="contact"
              title="Napíšte nám"
              submitLabel="Odoslať správu"
              topics={["Pomoc s odhadom", "Predaj nehnuteľnosti", "Výkup nehnuteľnosti", "Spolupráca", "Iné"]}
            />
          </div>
        </div>
      </section>
    </Page>
  )
}

/* ---------- 404 ---------- */

export function NotFoundPage() {
  return (
    <Page>
      <PageIntro
        eyebrow="Chyba 404"
        align="center"
        title={
          <>
            Táto adresa <Soft>na mape chýba.</Soft>
          </>
        }
        lead="Stránku sa nepodarilo nájsť. Vráťte sa na úvod alebo rovno zadajte adresu nehnuteľnosti."
        footer={
          <div className="mx-auto mt-10 max-w-[660px] text-center">
            <AddressSearch id="nf-address" />
            <ButtonLink to="/" variant="outline" size="sm" className="mt-6">
              Späť na úvod
            </ButtonLink>
          </div>
        }
      />
    </Page>
  )
}


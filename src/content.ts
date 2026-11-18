const unsplash = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const images = {
  house: {
    src: unsplash("photo-1523217582562-09d0def993a6", 1400),
    thumb: unsplash("photo-1523217582562-09d0def993a6", 640),
    alt: "Moderný biely rodinný dom s veľkými oknami obklopený zeleňou",
  },
  apartments: {
    src: unsplash("photo-1788352931538-ae4f3eb0cf1d", 1600),
    thumb: unsplash("photo-1788352931538-ae4f3eb0cf1d", 640),
    alt: "Ulica s novými bytovými domami s bielymi balkónmi a stromami",
  },
  interior: {
    src: unsplash("photo-1665249934445-1de680641f50", 1400),
    thumb: unsplash("photo-1665249934445-1de680641f50", 640),
    alt: "Svetlá obývacia izba s veľkým oknom a minimalistickým nábytkom",
  },
  villa: {
    src: unsplash("photo-1628012209120-d9db7abf7eab", 1400),
    thumb: unsplash("photo-1628012209120-d9db7abf7eab", 640),
    alt: "Biela súčasná architektúra pod jasnou modrou oblohou",
  },
}

export const mainNav = [
  { label: "Odhad ceny", to: "/odhad-ceny" },
  { label: "Predaj nehnuteľnosti", to: "/predaj-nehnutelnosti" },
  { label: "Výkup", to: "/vykup-nehnutelnosti" },
  { label: "Pre maklérov", to: "/pre-maklerov" },
  { label: "O nás", to: "/o-nas" },
  { label: "Kontakt", to: "/kontakt" },
]

export const faqs = [
  {
    q: "Ako funguje online odhad nehnuteľnosti?",
    a: "Zadáte lokalitu, typ nehnuteľnosti, výmeru a niekoľko základných parametrov. Na ich základe pripravíme orientačné cenové rozpätie, ktoré vám pomôže zorientovať sa. Nejde o znalecký posudok – je to prvý krok k lepšiemu prehľadu.",
  },
  {
    q: "Je odhad ceny nezáväzný?",
    a: "Áno. Orientačný odhad je úplne nezáväzný a nezaväzuje vás k predaju, výkupu ani k inej službe. Sami sa rozhodnete, či a ako budete pokračovať.",
  },
  {
    q: "Aké údaje potrebujem na odhad?",
    a: "Stačí adresa alebo lokalita, typ nehnuteľnosti, úžitková plocha, počet izieb a celkový stav. Doplňujúce údaje, napríklad balkón či parkovanie, môžu odhad spresniť.",
  },
  {
    q: "Je výsledná cena garantovaná?",
    a: "Nie. Orientačný odhad nepredstavuje garantovanú predajnú cenu. Skutočná cena závisí od aktuálneho dopytu, technického stavu, právnych okolností a ďalších faktorov, ktoré je vhodné posúdiť individuálne.",
  },
  {
    q: "Môžem požiadať aj o pomoc s predajom?",
    a: "Áno. Ak zvažujete predaj, môžete nám zanechať nezáväzný dopyt. Ozveme sa vám, prejdeme vaše možnosti a navrhneme ďalší postup, ktorý zodpovedá vašej situácii.",
  },
  {
    q: "Ako funguje výkup nehnuteľnosti?",
    a: "Výkup je alternatíva pre tých, ktorí uprednostňujú rýchlejšie riešenie. Po odoslaní dopytu sa nehnuteľnosť posúdi individuálne a ak je to možné, dostanete nezáväznú ponuku. Cena pri výkupe môže byť nižšia ako pri štandardnom predaji.",
  },
]

export const formatEur = (n: number) =>
  new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n)

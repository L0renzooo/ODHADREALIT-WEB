// Array indices are model codes. Preserve the source files' ordering.
export const districts = [
  "Bánovce nad Bebravou",
  "Banská Bystrica",
  "Banská Štiavnica",
  "Bardejov",
  "Bratislava I",
  "Bratislava II",
  "Bratislava III",
  "Bratislava IV",
  "Bratislava V",
  "Brezno",
  "Bytča",
  "Čadca",
  "Detva",
  "Dolný Kubín",
  "Dunajská Streda",
  "Galanta",
  "Gelnica",
  "Hlohovec",
  "Humenné",
  "Ilava",
  "Kežmarok",
  "Komárno",
  "Košice I",
  "Košice II",
  "Košice III",
  "Košice IV",
  "Košice-okolie",
  "Krupina",
  "Kysucké Nové Mesto",
  "Levice",
  "Levoča",
  "Liptovský Mikuláš",
  "Lučenec",
  "Malacky",
  "Martin",
  "Medzilaborce",
  "Námestovo",
  "Michalovce",
  "Myjava",
  "Nitra",
  "Nové Mesto nad Váhom",
  "Nové Zámky",
  "Pezinok",
  "Piešťany",
  "Poltár",
  "Poprad",
  "Prešov",
  "Prievidza",
  "Púchov",
  "Považská Bystrica",
  "Revúca",
  "Rimavská Sobota",
  "Rožňava",
  "Ružomberok",
  "Sabinov",
  "Šaľa",
  "Senec",
  "Senica",
  "Skalica",
  "Snina",
  "Sobrance",
  "Spišská Nová Ves",
  "Stará Ľubovňa",
  "Stropkov",
  "Svidník",
  "Topoľčany",
  "Trenčín",
  "Trnava",
  "Trebišov",
  "Turčianske Teplice",
  "Tvrdošín",
  "Veľký Krtíš",
  "Vranov nad Topľou",
  "Žarnovica",
  "Žiar nad Hronom",
  "Žilina",
  "Zlaté Moravce",
  "Zvolen",
  "Partizánske",
] as const
export const flatMaterials = [
  "beton",
  "drevo",
  "panel",
  "tehla",
  "zmiesana",
  "iny",
] as const
export const houseMaterials = [
  "iny",
  "murivo",
  "beton_panel",
  "drevo",
  "zmiesana",
] as const
export const flatFeatures = [
  "rooms",
  "usable_area_m2",
  "balcony_m2",
  "loggia_m2",
  "terrace_m2",
  "cellar_m2",
  "garden_m2",
  "total_floors",
  "year_built",
  "district",
  "material",
] as const
export const houseFeatures = [
  "usable_area_m2",
  "property_area_m2",
  "year_built",
  "district",
  "material",
  "parking",
  "garden",
  "new_build",
] as const

export const materialLabels = {
  beton: "Betón",
  drevo: "Drevo",
  panel: "Panel",
  tehla: "Tehla",
  zmiesana: "Zmiešaná konštrukcia",
  iny: "Iný materiál",
  murivo: "Murivo",
  beton_panel: "Betón alebo panel",
  unknown: "Neviem",
} as const
export const areas = {
  balcony_m2: "Balkón",
  loggia_m2: "Lodžia",
  terrace_m2: "Terasa",
  cellar_m2: "Pivnica",
  garden_m2: "Predzáhradka",
} as const
export const amenities = {
  parking: "Parkovanie",
  garden: "Záhrada",
  new_build: "Novostavba",
} as const
export const intentions = {
  soon: "Áno, čo najskôr",
  within_year: "Áno, v najbližších 3–12 mesiacoch",
  later: "Možno v budúcnosti",
  value_only: "Nie, chcem len poznať hodnotu",
} as const
export type PropertyType = "flat" | "house"
export type Answer = "yes" | "no" | ""
export type Address = {
  verified?: true
  street: string
  municipality: string
  postcode: string
  district: number | null
  latitude?: number
  longitude?: number
  providerId?: string
  streetName?: string
  houseNumber?: string
  placeName?: string
  locality?: string
  county?: string
  country?: string
  countryCode?: string
  resultType?: string
  precision?: "house" | "street" | "locality" | "area"
}
type Construction<M extends string,> = {
  year_built: string
  unknownYear: boolean
  period: string
  material: M | "unknown" | ""
}
type Area = {
  present: Answer
  size: string
}
export type Flat = Construction<typeof flatMaterials[number]> & {
  usable_area_m2: string
  rooms: string
  total_floors: string
} & Record<keyof typeof areas, Area>
export type House = Construction<typeof houseMaterials[number]> & {
  usable_area_m2: string
  property_area_m2: string
} & Record<keyof typeof amenities, Answer>
export interface Draft {
  address: Address
  type: PropertyType | ""
  flat: Flat
  house: House
  sale_intent: keyof typeof intentions | ""
  contact: { email: string }
}
export function initialDraft(street: string): Draft {
  const construction = {
    usable_area_m2: "",
    year_built: "",
    unknownYear: false,
    period: "",
    material: "",
  } as const
  const absent: Area = { present: "", size: "" }
  return {
    address: { street, municipality: "", postcode: "", district: null },
    type: "",
    flat: {
      ...construction,
      rooms: "",
      total_floors: "",
      balcony_m2: absent,
      loggia_m2: absent,
      terrace_m2: absent,
      cellar_m2: absent,
      garden_m2: absent,
    },
    house: {
      ...construction,
      property_area_m2: "",
      parking: "",
      garden: "",
      new_build: "",
    },
    sale_intent: "",
    contact: { email: "" },
  }
}
export function formatAddress(a: Address) {
  return [addressTitle(a), addressDetail(a)].filter(Boolean).join(", ")
}
export function addressTitle(a: Address) {
  return a.street || a.placeName || a.municipality
}
export function addressDetail(a: Address) {
  const places = [...new Set([a.municipality, a.locality])].filter(
    (name) => name && name !== addressTitle(a),
  )
  return [a.postcode, places.join(" – ") || (!a.street ? a.county : "")]
    .filter(Boolean)
    .join(" ")
}
export function entries<K extends string, V>(record: Record<K, V>) {
  return Object.entries(record) as [K, V][]
}

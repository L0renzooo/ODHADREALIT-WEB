import { addressTitle, districts, formatAddress, type Address } from "./model"

const endpoint = import.meta.env.VITE_PHOTON_ENDPOINT || "https://photon.komoot.io/api/"
const cache = new Map<string, { until: number; addresses: Address[] }>()
let retryAfter = 0

export const busyMessage = "Overovanie adries je dočasne vyťažené. Skúste to neskôr."
export const errorMessage = "Overovanie adries je momentálne nedostupné. Skúste to znova."
const unconfirmed = "Túto adresu sa nepodarilo overiť. Spresnite údaje alebo vyberte adresu z ponuky."
export class AddressVerificationError extends Error {}

function comparable(value: string) {
  return value.normalize("NFC").trim().replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/").toLocaleLowerCase("sk")
}

export function verificationIssue(a: Address): string {
  if (a.precision !== "house" || !a.streetName || !a.houseNumber || !/\d/.test(a.houseNumber)) {
    return "Presné číslo domu sa nepodarilo overiť. Doplňte ulicu, číslo domu a obec."
  }
  if (!a.municipality || a.district === null || !districts[a.district]) {
    return "Pre túto adresu sa nepodarilo overiť obec a okres. Vyberte presnejší výsledok."
  }
  if (!/^\d{5}$/.test(a.postcode.replace(/\s/g, ""))) return "Pre túto adresu sa nepodarilo overiť PSČ. Vyberte presnejší výsledok."
  if (!a.providerId || a.countryCode !== "SK" || !Number.isFinite(a.latitude) || !Number.isFinite(a.longitude)) return unconfirmed
  return ""
}

export async function verifyManualAddress(draft: Address, signal: AbortSignal): Promise<Address> {
  const results = await searchAddresses(draft.street + ", " + draft.municipality, signal)
  const street = comparable(draft.street)
  const candidates = results.filter(a => {
    if (!a.verified || !a.streetName || !a.houseNumber) return false
    const shortNumber = a.houseNumber.split("/").pop()
    return street === comparable(a.street) || street === comparable(a.streetName + " " + shortNumber)
  })
  const local = candidates.filter(a => comparable(a.municipality) === comparable(draft.municipality) && a.district === draft.district)
  if (candidates.length && !local.length) throw new AddressVerificationError("Zadaná obec a okres nezodpovedajú overenej polohe domu.")
  const exact = local.filter(a => a.postcode.replace(/\s/g, "") === draft.postcode.replace(/\s/g, ""))
  if (local.length && !exact.length) throw new AddressVerificationError("Zadané PSČ nezodpovedá overenej adrese.")
  if (exact.length !== 1) throw new AddressVerificationError(unconfirmed)
  return exact[0]
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object"
}

function normalizeFeature(feature: unknown): Address | null {
  if (!record(feature) || !record(feature.properties) || !record(feature.geometry)) return null
  const p = feature.properties
  const field = (key: string) => typeof p[key] === "string" ? p[key].trim() : ""
  const coordinates = feature.geometry.coordinates
  if (field("countrycode").toUpperCase() !== "SK" || feature.geometry.type !== "Point" || !Array.isArray(coordinates)) return null
  const [longitude, latitude] = coordinates
  // Generous bounds catch swapped coordinates and null-island placeholders in an SK response.
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < 47 || latitude > 50 || longitude < 16 || longitude > 23) return null

  const name = field("name")
  const type = field("type")
  const streetName = field("street") || (type === "street" ? name : "")
  const houseNumber = field("housenumber")
  const municipality = field("city") || (type === "city" ? name : "")
  const county = field("county")
  const districtName = county.replace(/^okres\s+/i, "").trim()
  // A city-wide result can carry the county of its centre even when it spans several model districts.
  const spansDistricts = type === "city" && ["Bratislava", "Košice"].includes(name)
  const districtCode = spansDistricts ? -1 : districts.findIndex(district =>
    district.localeCompare(districtName, "sk", { sensitivity: "accent" }) === 0)
  const precision = type === "house" && houseNumber ? "house" : streetName ? "street" :
    ["city", "district", "locality"].includes(type) ? "locality" : "area"
  const osmId = p.osm_id
  const address: Address = {
    street: [streetName, houseNumber].filter(Boolean).join(" "),
    streetName, houseNumber, municipality,
    placeName: name, locality: field("district") || field("locality"),
    county, district: districtCode >= 0 ? districtCode : null,
    postcode: field("postcode"), country: field("country"), countryCode: "SK",
    latitude, longitude, resultType: type, precision,
    providerId: /^[NWR]$/.test(field("osm_type")) && /^[1-9]\d*$/.test(String(osmId))
      ? field("osm_type") + "/" + osmId : undefined,
  }
  if (!verificationIssue(address)) address.verified = true
  return addressTitle(address) ? address : null
}

export function searchable(query: string) {
  return (query.match(/[\p{L}\p{N}]/gu)?.length ?? 0) >= 3
}

export async function searchAddresses(query: string, signal: AbortSignal): Promise<Address[]> {
  const key = query.trim().replace(/\s+/g, " ").toLocaleLowerCase("sk")
  if (!searchable(key)) return []
  const cached = cache.get(key)
  if (cached && cached.until > Date.now()) return cached.addresses
  if (Date.now() < retryAfter) throw new AddressVerificationError(busyMessage)

  const url = new URL(endpoint, window.location.origin)
  // The public instance supports "default" for local names. Explicit "sk" returns HTTP 400.
  url.search = new URLSearchParams({ q: key, countrycode: "SK", lang: "default", limit: "6" }).toString()
  const response = await fetch(url, { signal, credentials: "omit", headers: { Accept: "application/json" } })
  if (response.status === 429) {
    const after = response.headers.get("Retry-After")
    const date = after && !/^\d+$/.test(after) ? Date.parse(after) : NaN
    retryAfter = Number.isFinite(date) ? Math.max(Date.now(), date) : Date.now() + (Number(after) || 60) * 1000
    if (!Number.isFinite(retryAfter)) retryAfter = Date.now() + 60_000
    throw new AddressVerificationError(busyMessage)
  }
  if (!response.ok) throw new Error(errorMessage)
  const data: unknown = await response.json()
  if (!record(data) || data.type !== "FeatureCollection" || !Array.isArray(data.features)) throw new Error(errorMessage)
  const seen = new Set<string>()
  const addresses = data.features.map(normalizeFeature).filter((a): a is Address => !!a)
    .sort((a, b) => /\d/.test(key)
      ? Number(b.precision === "house") - Number(a.precision === "house")
      : 0)
    .filter(a => {
      const id = [formatAddress(a), a.latitude, a.longitude].join("|")
      if (seen.has(id)) return false
      seen.add(id)
      return true
    }).slice(0, 6)
  signal.throwIfAborted()
  cache.delete(key)
  if (cache.size >= 32) cache.delete(cache.keys().next().value!)
  cache.set(key, { until: Date.now() + 300_000, addresses })
  return addresses
}

type SalesMetric = {
  label: string
  value: number
  prefix: string
  suffix: string
}

// Populate only with client-verified figures. Production omits the metrics until then.
const verifiedSalesMetrics: SalesMetric[] = []
const prototypeSalesMetrics: SalesMetric[] = [
  { label: "nehnuteľností", value: 1200, prefix: "", suffix: "+" },
  { label: "vyššia úspešnosť predaja", value: 18, prefix: "+", suffix: " %" },
]

export const illustrativeMetrics =
  import.meta.env.DEV && verifiedSalesMetrics.length === 0
export const salesMetrics = illustrativeMetrics
  ? prototypeSalesMetrics
  : verifiedSalesMetrics
export const formatSalesNumber = new Intl.NumberFormat("sk-SK", {
  maximumFractionDigits: 0,
  useGrouping: true,
}).format

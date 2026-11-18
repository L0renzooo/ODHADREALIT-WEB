import { useEffect, type ComponentType } from "react"
import { RouterProvider, scrollToId, useRouter } from "@/lib/router"
import { Footer, Header } from "@/components/layout"
import HomePage from "@/pages/HomePage"
import ValuationPage from "@/pages/ValuationPage"
import {
  AboutPage,
  AgentsPage,
  BuyoutPage,
  ContactPage,
  NotFoundPage,
  SellPage,
} from "@/pages/SecondaryPages"

type RouteDef = {
  title: string
  component: ComponentType
}

const routes: Record<string, RouteDef> = {
  "/": { title: "Odhad ceny nehnuteľnosti online", component: HomePage },
  "": { title: "Odhad ceny", component: ValuationPage },
  "/predaj-nehnutelnosti": {
    title: "Predaj nehnuteľnosti",
    component: SellPage,
  },
  "/vykup-nehnutelnosti": {
    title: "Výkup nehnuteľnosti",
    component: BuyoutPage,
  },
  "/pre-maklerov": { title: "Pre maklérov", component: AgentsPage },
  "/o-nas": { title: "O nás", component: AboutPage },
  "/kontakt": { title: "Kontakt", component: ContactPage },
}

function Shell() {
  const { pathname } = useRouter()
  const route = routes[pathname]
  const Page = route?.component ?? NotFoundPage

  useEffect(() => {
    document.title = `${route?.title ?? "Stránka nenájdená"} · odhadrealit.sk`
    document.documentElement.lang = "sk"
  }, [route])

  // Honour a hash on initial load (e.g. /#faq).
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => scrollToId(id))
  }, [])

  return (
    <div
      className="flex min-h-screen flex-col"
      data-theme="navy"
    >
      <a
        href="#obsah"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-transform focus:translate-y-0"
      >
        Preskočiť na obsah
      </a>
      <Header />
      <main id="obsah" key={pathname} className="flex-1">
        <Page />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  )
}

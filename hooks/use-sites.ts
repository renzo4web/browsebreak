import { useStorage } from "@plasmohq/storage/dist/hook"

import { cleanUrl } from "~helpers"
import type { AlertType, Site } from "~types"

export default function useSites() {
  const [sites, setSites] = useStorage<Site[]>("sites")

  const saveSite = async (urlIn: string, type: AlertType, timerValue = 0) => {
    const url = cleanUrl(urlIn)
    if (url && !sites?.find((site) => site.url === url)) {
      await setSites([
        ...(sites ?? []),
        { url, active: true, type, timerValue }
      ])
      alert("Saved, refresh the page to see the changes")
    } else {
      alert("Site already saved")
    }
  }

  async function deleteSite(site: Site) {
    const newSites = sites?.filter((s) => s.url !== site.url)
    await setSites(newSites)
  }

  async function updateSite(site: Site, isChecked: boolean) {
    const newSites = sites?.map((s: any) => {
      if (s.url === site.url) {
        s.active = isChecked
      }
      return s
    })
    await setSites(newSites)
  }

  return {
    sites,
    saveSite,
    deleteSite,
    updateSite
  }
}

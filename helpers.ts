import type { Site } from "~types"

export const query = { active: true, currentWindow: true }

export function cleanUrl(url: string) {
  const urlObj = new URL(url)
  return urlObj.origin + urlObj.pathname
}

export function getCurrentSite(sites: Site[]) {
  return sites?.find(
    (site: any) => site.url === window.location.href && site.active
  )
}

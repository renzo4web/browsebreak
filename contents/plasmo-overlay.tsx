import cssText from "data-text:~/contents/plasmo-overlay.css"
import type { PlasmoCSConfig, PlasmoMountShadowHost } from "plasmo"
import { useEffect, useState } from "react"
import { unmountComponentAtNode } from "react-dom"
import { useMount, useWindowScroll } from "react-use"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/dist/hook"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {}

const storage = new Storage()
export const mountShadowHost: PlasmoMountShadowHost = async ({
  shadowHost,
  anchor,
  mountState
}) => {
  const data: { url: string }[] = await storage.get("sites") // "value"
  if (data) {
    const isCurrentSite = !!data?.find(
      (site: any) => site.url === window.location.href
    )

    if (isCurrentSite) {
      console.log("mountShadowhost", isCurrentSite)
      anchor.element.appendChild(shadowHost)
    }
  }

  anchor.element.appendChild(shadowHost)
  return null
}

const PlasmoOverlay = () => {
  const [sites, setSites] = useStorage("sites")
  const [alerted, setAlerted] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)
  const { y } = useWindowScroll()
  let scrollTotal = 0

  useMount(() => {
    // check current y
    setLastScroll(y)
  })

  useEffect(() => {
    ;(async () => {
      const isCurrentSite = sites?.find(
        (site: any) => site.url === window.location.href
      )

      console.log("isCurrentSite", isCurrentSite)
      if (!!isCurrentSite && y > 1000 && !alerted && lastScroll <= 0) {
        alert("scrolling to much take a break;")
        setAlerted(true)
      }
    })()
  }, [sites, y])

  return (
    <span
      id="scrolleando-ui"
      className="hw-top"
      style={{
        padding: 12
      }}>
      CSUI OVERLAY FIXED POSITION
    </span>
  )
}

export default PlasmoOverlay

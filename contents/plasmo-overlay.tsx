import cssText from "data-text:~/contents/plasmo-overlay.css"
import type {
  PlasmoCSConfig,
  PlasmoGetStyle,
  PlasmoMountShadowHost
} from "plasmo"
import { useEffect, useRef, useState } from "react"
import { unmountComponentAtNode } from "react-dom"
import { useMount, useWindowScroll } from "react-use"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/dist/hook"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
  .modal-window {
  position: fixed;
  background-color: rgba(255, 255, 255, 0.25);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  pointer-events: none;
  visibility: hidden;
   opacity: 0;
  transition: all 0.3s;
   }
    p {
      background-color: yellow;
    }

.modal-window > div {
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2em;
  background: white;
}
.modal-window header {
  font-weight: bold;
}
.modal-window h1 {
  font-size: 150%;
  margin: 0 0 15px;
}



.modal-close {
  color: #aaa;
  line-height: 50px;
  font-size: 80%;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  width: 70px;
  text-decoration: none;
}
.modal-close:hover {
  color: black;
}

.active  {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
}
  `
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

  return null
}

const PlasmoOverlay = () => {
  const [sites, setSites] = useStorage("sites")
  const [alerted, setAlerted] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)
  const { y } = useWindowScroll()
  const [showOverlay, setShowOverlay] = useState(false)
  let scrollTotal = 0
  const umbralScroll = 50

  const [scrollPercentage, setScrollPercentage] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const totalHeight = document.documentElement.scrollHeight
      const scrolledHeight = window.scrollY

      const percentage = (scrolledHeight / (totalHeight - windowHeight)) * 100

      setScrollPercentage(percentage)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      // Limpieza al desmontar el componente
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useMount(() => {
    // check current y
    setLastScroll(y)
  })

  useEffect(() => {
    ;(async () => {
      const currentSite = sites?.find(
        (site: any) => site.url === window.location.href
      )

      if (!currentSite) return

      if (y <= 0) {
        setLastScroll(y)
        setShowOverlay(false)
        setAlerted(false)
      }

      console.log("scroll", scrollPercentage)
      console.log("currentSite", currentSite)
      console.log("dd", umbralScroll)
      if (
        !!currentSite &&
        scrollPercentage >= umbralScroll &&
        !showOverlay &&
        lastScroll <= 0
      ) {
        alert("scrolling to much take a break;")
        setShowOverlay(true)
      }
    })()
  }, [sites, y, scrollPercentage])

  console.log("showOverlay", showOverlay)
  return (
    <div id="open-modal" className={showOverlay ? `modal-window active` : ""}>
      {showOverlay && (
        <div className="modal-content">
          <button
            onClick={() => {
              setShowOverlay(false)
              setAlerted(true)
            }}
            className="modal-close">
            Close
          </button>
          <h4>Take a break</h4>
        </div>
      )}
    </div>
  )
}

export default PlasmoOverlay

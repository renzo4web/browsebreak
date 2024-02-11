import type {
  PlasmoCSConfig,
  PlasmoGetStyle,
  PlasmoMountShadowHost
} from "plasmo"
import { useEffect, useRef, useState } from "react"
import { useMount, useWindowScroll } from "react-use"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/dist/hook"

import getRandomPhrase from "~config"
import { getCurrentSite } from "~helpers"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
  .modal-window {
  position: fixed;
  background-color: rgba(0, 100, 230, 0.96);
  top: 0;
  font-family: Arial, sans-serif;
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
        font-size: 1.2em;
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

/* Buttons styles start */
button {
    display: inline-block;
    border: none;
    padding: 1rem 2rem;
    margin: 0;
    text-decoration: none;
    border-radius: 0.3rem;
    background: #0069ed;
    color: #ffffff;
    font-family: sans-serif;
    border: 2px dashed #ffff;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    text-align: center;
    transition: background 250ms ease-in-out, transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
}

button:hover,
button:focus {
    background: #0053ba;
}

button:focus {
    outline: 1px solid #fff;
    outline-offset: -4px;
}

button:active {
    transform: scale(0.99);
}
  `
  return style
}

export const config: PlasmoCSConfig = {}

export const storage = new Storage()
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
  const umbralScroll = 50
  const minLastScrollToWatch = 10
  const [timerId, setTimerId] = useState(null) // State to track the timer
  const phrase = useRef({
    title: getRandomPhrase().title,
    subtitle: getRandomPhrase().subtitle
  })

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
    setAlerted(false)
  })

  /**
   * Scroll logic
   */
  useEffect(() => {
    ;(async () => {
      const currentSite = sites?.find(
        (site: any) => site.url === window.location.href
      )

      if (currentSite?.type !== "scroll") {
        return
      }
      if (!currentSite || !currentSite?.active) return

      if (y <= minLastScrollToWatch) {
        setLastScroll(y)
        setShowOverlay(false)
        setAlerted(false)
      }

      const canShowUmbral =
        !!currentSite &&
        scrollPercentage >= umbralScroll &&
        !showOverlay &&
        lastScroll <= minLastScrollToWatch &&
        !alerted

      if (canShowUmbral) {
        setShowOverlay(true)
        setAlerted(true)
      }
    })()
  }, [sites, y, scrollPercentage])

  /*
   *  Timer logic
   * */
  useEffect(() => {
    const site = getCurrentSite(sites)
    if (site?.type === "timer") {
      const timeoutId = setTimeout(
        () => {
          setShowOverlay(true)
          setAlerted(true)
        },
        Number(site.timerValue) * 1000
      )

      setTimerId(timeoutId)
      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [sites])

  /*
   *  Block logic
   * */
  useEffect(() => {
    if (getCurrentSite(sites)?.type === "blocked") {
      setShowOverlay(true)
    }
  }, [sites])

  const restartTimer = () => {
    // Clear the previous timer
    const site = getCurrentSite(sites)
    clearTimeout(timerId)

    // Restart the timer
    const newTimerId = setTimeout(() => {
      // Logic to show the alert after a certain time
      setShowOverlay(true)
    }, site.timerValue * 1000) // Restart the timer to 10 seconds

    setTimerId(newTimerId) // Update the timer ID
  }

  return (
    <div id="open-modal" className={showOverlay ? `modal-window active` : ""}>
      {showOverlay && (
        <div
          style={{
            borderRadius: "1em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(10, 103, 221)",
            borderWidth: "3px",
            color: "white",
            borderColor: "white",
            borderStyle: "dashed"
          }}
          className="modal-content">
          <div
            style={{
              textAlign: "center"
            }}>
            <h4
              style={{
                fontSize: "1.5em",
                marginBottom: "0px"
              }}>
              {phrase.current.title}
            </h4>
            <p>{phrase.current.subtitle}</p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center"
            }}>
            {getCurrentSite(sites)?.type === "timer" && (
              <button
                className={"btn btn-rounded btn-primary btn-md"}
                style={{
                  marginRight: "1em"
                }}
                onClick={() => {
                  setShowOverlay(false)
                  setAlerted(false)
                  restartTimer()
                }}>
                Alert me in {getCurrentSite(sites)?.timerValue} seconds
              </button>
            )}
            <button
              className={"btn btn-rounded btn-primary btn-md"}
              onClick={() => {
                setAlerted(true)
                setShowOverlay(false)
              }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlasmoOverlay

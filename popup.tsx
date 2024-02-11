import "./style.css"

import { useState } from "react"

import SitesList from "~components/SitesList"
import { cleanUrl, query } from "~helpers"
import useSites from "~hooks/use-sites"

function IndexPopup() {
  const { sites, updateSite, deleteSite, saveSite } = useSites()
  const [formValue, setFormValues] = useState({
    url: "",
    _type: "",
    timerValue: 0
  })

  const handleChange = (e) => {
    setFormValues({
      ...formValue,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = e.target?.url?.value
    const type = e.target?._type?.value
    const timerValue = e.target?.timerValue?.value || 0
    if (!url || !type) {
      return alert("Please fill the form")
    }
    await saveSite(url, type, timerValue)
    setFormValues({
      url: "",
      _type: "",
      timerValue: 0
    })
  }

  return (
    <div
      style={{
        width: "100%"
      }}
      className="bg-gray-2 ring-2  min-w-96 px-3 py-5 flex items-center flex-col">
      <div className="mx-auto  w-full">
        <form onSubmit={handleSubmit}>
          <div className={"flex items-center justify-between mb-3"}>
            <span
              className="tooltip flex space-x-2 tooltip-right"
              data-tooltip="alert after the timer has completed">
              <input
                name="_type"
                type="radio"
                value={"timer"}
                className="radio radio-bordered-primary "
                onChange={handleChange}
                checked={formValue._type === "timer"}
              />
              <h6 className={"inline font-bold"}>Timer</h6>
            </span>

            <span
              className="tooltip flex space-x-2 tooltip-bottom"
              data-tooltip="scroll more than 50% of the page">
              <input
                name="_type"
                type="radio"
                value={"scroll"}
                className="radio radio-bordered-primary "
                onChange={handleChange}
                checked={formValue._type === "scroll"}
              />
              <h6 className={"inline font-bold"}>Scroll</h6>
            </span>

            <span
              className="tooltip flex space-x-2 tooltip-left"
              data-tooltip="The alert is displayed when opening the page">
              <input
                name="_type"
                type="radio"
                value={"blocked"}
                onChange={handleChange}
                checked={formValue._type === "blocked"}
                className="radio radio-bordered-primary "
              />
              <label htmlFor={"blocked"} className={"inline font-bold"}>
                Blocked
              </label>
            </span>
          </div>
          <input
            style={{
              width: "100%",
              minWidth: "100%"
            }}
            className="input-solid input input-lg"
            type={"url"}
            name={"url"}
            onChange={handleChange}
            value={formValue.url}
            placeholder="Site URL"
          />
          {formValue._type === "timer" && (
            <input
              style={{
                width: "100%",
                minWidth: "100%"
              }}
              className="input-solid input mt-2 input-lg"
              type={"number"}
              name={"timerValue"}
              prefix={"Timer in seconds"}
              onChange={handleChange}
              value={formValue.timerValue}
              placeholder="Timer in seconds"
            />
          )}
          <div className={"space-x-4 py-4"}>
            <button
              className={"btn btn-rounded hover:bg-blue-6 btn-primary btn-md"}
              type="submit">
              Save
            </button>

            <button
              type={"button"}
              onClick={async () => {
                chrome.tabs.query(query, async (tabs) => {
                  const currentTab = tabs?.[0] // there will be only one in this array
                  // TODO: add type from user input, maybe copy url to input
                  setFormValues((c) => ({
                    ...c,
                    url: cleanUrl(currentTab?.url)
                  }))
                })
              }}
              className={"btn btn-rounded btn-outline-secondary btn-md"}>
              Add current site
            </button>
          </div>
        </form>
        <SitesList
          sites={sites}
          handleClickSwitch={updateSite}
          handleClickDelete={deleteSite}
        />
      </div>
    </div>
  )
}

export default IndexPopup

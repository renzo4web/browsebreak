import { useStorage } from "@plasmohq/storage/hook"

import "./style.css"

const query = { active: true, currentWindow: true }

function IndexPopup() {
  const [sites, setSites] = useStorage("sites")

  const saveSite = async (url: string) => {
    if (url && !sites?.find((site) => site.url === url)) {
      await setSites([...(sites ?? []), { url }])
      alert("Saved, refresh the page to see the changes")
    } else {
      alert("Site already saved")
    }
  }

  const handleSubmit = async (e: any) => {
    const url = e.target.url.value
    await saveSite(url)
    e.preventDefault()
  }

  return (
    <div
      style={{ width: "100%" }}
      className="w-11/12 h-full bg-gray-2  min-w-96 px-5 py-5 flex flex-col items-center">
      <div className="w-full">
        <form onSubmit={handleSubmit}>
          <input className="input-block input" placeholder="site url" />
          <div className={"space-x-4 py-4"}>
            <button className={"btn btn-primary btn-xs"} type="submit">
              Save
            </button>

            <button
              onClick={async () => {
                chrome.tabs.query(query, async (tabs) => {
                  const currentTab = tabs?.[0] // there will be only one in this array
                  await saveSite(currentTab?.url)
                })
              }}
              className={"btn btn-outline-secondary btn-xs"}>
              Add current site
            </button>
          </div>
        </form>
      </div>

      <div className="accordion w-full">
        <input type="checkbox" id="toggle-15" className="accordion-toggle" />
        <label
          htmlFor="toggle-15"
          className="accordion-title bg-gray-2 text-md text-gray-11">
          Current sites
        </label>
        <span className="accordion-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
          </svg>
        </span>
        <div className="accordion-content text-content2 w-full">
          <div className="min-h-0 w-full space-y-3">
            {sites?.map((site: any) => {
              return (
                <div
                  className={"flex items-center justify-between w-full"}
                  key={site.url}>
                  <h4 className="text-md truncate max-w-64 text-gray-11">
                    {site?.url}
                  </h4>
                  <input
                    type="checkbox"
                    className="switch switch-success "
                    checked={!!site?.active}
                    onChange={async (e) => {
                      const newSites = sites?.map((s: any) => {
                        if (s.url === site.url) {
                          s.active = e.target.checked
                        }
                        return s
                      })
                      await setSites(newSites)
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup

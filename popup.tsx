import { useStorage } from "@plasmohq/storage/hook"

import "./style.css"

const query = { active: true, currentWindow: true }

function cleanUrl(url: string) {
  const urlObj = new URL(url)
  return urlObj.origin + urlObj.pathname
}

function IndexPopup() {
  const [sites, setSites] = useStorage("sites")

  const saveSite = async (urlIn: string) => {
    const url = cleanUrl(urlIn)
    if (url && !sites?.find((site) => site.url === url)) {
      await setSites([...(sites ?? []), { url, active: true }])
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
      style={{
        width: "100%"
      }}
      className="bg-gray-2 ring-2  min-w-96 px-3 py-5 flex items-center flex-col">
      <div className="mx-auto  w-full">
        <form onSubmit={handleSubmit}>
          <input
            style={{
              width: "100%",
              minWidth: "100%"
            }}
            className="input-solid input input-lg"
            type={"url"}
            placeholder="Site URL"
          />
          <div className={"space-x-4 py-4"}>
            <button
              className={"btn btn-rounded btn-primary btn-md"}
              type="submit">
              Save
            </button>

            <button
              onClick={async () => {
                chrome.tabs.query(query, async (tabs) => {
                  const currentTab = tabs?.[0] // there will be only one in this array
                  await saveSite(currentTab?.url)
                })
              }}
              className={"btn btn-rounded btn-outline-secondary btn-md"}>
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
          Saved sites
        </label>
        <span className="accordion-icon">
          <svg width="24" height="24" viewBox="0 0 24 24">
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
                  <div className="inline-flex items-center space-x-1">
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

                    <button
                      onClick={async () => {
                        const newSites = sites?.filter(
                          (s: any) => s.url !== site.url
                        )
                        await setSites(newSites)
                      }}
                      className="btn  btn-circle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
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

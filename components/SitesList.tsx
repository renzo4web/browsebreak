import type { Site } from "~types"

interface SitesListProps {
  sites: Site[]
  handleClickSwitch: (site: Site, isChecked: boolean) => void
  handleClickDelete: (site: Site) => void
}
export default function SitesList({
  sites,
  handleClickDelete,
  handleClickSwitch
}: SitesListProps) {
  return (
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
                    onChange={(e) => handleClickSwitch(site, e.target.checked)}
                  />

                  <button
                    onClick={() => handleClickDelete(site)}
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
  )
}

import { useStorage } from "@plasmohq/storage/hook"

import "./style.css"

function IndexPopup() {
  const [sites, setSites] = useStorage("sites")

  const handleSubmit = async (e: any) => {
    const url = e.target.url.value
    if (url) {
      await setSites([...(sites ?? []), { url }])
      alert("Saved")
    }
    e.preventDefault()
  }

  return (
    <div
      style={{
        padding: 16
      }}>
      <div>
        <h4 className={"text-lg text-center font-bold"}>Current sites</h4>
        {sites?.map((site: any) => {
          return <div key={site.url}>{site?.url}</div>
        })}
      </div>

      <button
        onClick={async () => {
          const url = window.location.href
          if (url) {
            await setSites([...(sites ?? []), { url }])
            alert("Saved, reload the page to take effect.")
          }
        }}>
        Add current site
      </button>

      <div className="px-10">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-3 gap-y-8">
            <div className="sm:col-span-4">
              <label
                htmlFor="url"
                className="block text-sm font-medium leading-6 text-gray-900">
                Site URL
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="url"
                    name="url"
                    id="url"
                    placeholder="https://..."
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  )
}

export default IndexPopup

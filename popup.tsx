import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

function IndexPopup() {
  const [sites, setSites] = useStorage("sites")

  const handleSubmit = async (e: any) => {
    const url = e.target.url.value
    alert(url)
    if (url) {
      await setSites([...(sites ?? []), { url }])
      alert("Saved")
    }
    // save url to chrome.storage
    e.preventDefault()
  }

  return (
    <div
      style={{
        padding: 16
      }}>
      <div>
        {sites?.map((site: any) => {
          return <div key={site.url}>{site?.url}</div>
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <input name="url" type="url" />
        <button type="submit">Save</button>
      </form>
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
    </div>
  )
}

export default IndexPopup

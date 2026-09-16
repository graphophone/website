import React from "react"

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full grow flex items-center justify-center">
        { children }
    </div>
  )
}

export default layout
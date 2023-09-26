import * as React from "react"
import * as progressStyle from "./progressbar.module.scss"

const Progressbar = props => {
  const { completed } = props

  return (
    <div className={progressStyle.progressContainer}>
      <div className={`${progressStyle.progress2}`}>
        <div className={progressStyle.progressbar2} style={{ width: `${completed}%` }} />
      </div>
    </div>
  )
}

export default Progressbar

export type AlertType = "timer" | "scroll" | "blocked"
export interface Site {
  url: string
  active: boolean
  type: AlertType
  timerValue?: number
}

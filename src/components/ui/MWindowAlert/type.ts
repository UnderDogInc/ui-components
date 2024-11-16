export type TypeAlert = 'error' | 'success' | 'warning'
import { Brightness, Color } from '../../../type'

export type IOptionsAlerts = {
  colorIcon: Color
  brightnessIcon: Brightness
  fillIcon: `#${string}`
  borderColor: string
  title: string
  text: string
  componentIcon: object
}
type TOffsetStyle = {
  [key in string]: string|undefined
}
type Position = {
  x?: 'left' | 'center' | 'right' 
  y?: 'top' | 'center' | 'bottom'
}

type TTargetData = {
  x: number
  y: number
  width: number
  height: number
}

export type {
  TOffsetStyle,
  TTargetData,
  Position
}
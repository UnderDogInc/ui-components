import { Color, Brightness, Class } from "./ColorClassConfig"
import { color } from "./ColorClassConfig"

export interface ICollor {
  style?: {
    backgroundColor?: string
    borderColor?: string
    color?: string
    fill?: string
  }
  class?: string
}

function colorClass(currentColor: Color, brightness: Brightness, typeClass: Class): ICollor {
  const defaultColor = 'primary'
  const defaultBrightness = '900'

  if (isColorCss(currentColor)) {
    switch (typeClass) {
    case "bgColor":
      return {
        style: { 
          backgroundColor: currentColor,
        },
      }
    case 'borderColor':
      return {
        style: {
          borderColor: currentColor,
        },
      }
    case 'fillColor':
      return {
        style: {
          fill: currentColor,
        },
      }
    default:
      return {
        style: {
          color: currentColor,
        },
      }
    }
  }

  const colorName: Color = color[currentColor]
    ? currentColor
    : defaultColor
	
  const brightnessName = color[colorName][typeClass][brightness]
    ? brightness
    : defaultBrightness

  return {
    class: color[colorName][typeClass][brightnessName],
  }
}


function prettierNumeric(format: string, formatSymbol: string|number, item: string|number ): string {
  let stringItem = String(item)
  const countSymbolFormat = format.length  

  if (stringItem.length < countSymbolFormat) {
    const test = Array(countSymbolFormat - stringItem.length).fill(formatSymbol).join('')
    stringItem = test + stringItem
  }
	
  return stringItem
}

function isColorCss(color: string): boolean {
  const regexColor = /(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}|(?:rgba?|hsla?)\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s/]*[\d.]+%?\))/i

  return regexColor.test(color)
}

// eslint-disable-next-line @typescript-eslint/ban-types
const throttle = (callback: Function, limit: number) => {
  let waiting = false

  return (...args: any[]) => {
    if (waiting) {
      return
    }

    callback(...args)
    waiting = true

    setTimeout(() => {
      waiting = false
    }, limit)

    return
  }
}

const getZIndex = (el?: Element | null): number => {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return 0

  const index = +window.getComputedStyle(el).getPropertyValue('z-index')

  if (!index) return getZIndex(el.parentNode as Element)

  return index
}

const getMaxZIndex = (exclude: Element) => {
  const base = exclude
  const zis = [0, getZIndex(base)]
  const activeElements = Array.from(document.getElementsByClassName('m-menu--active'))
    .concat(Array.from(document.getElementsByClassName('m-popup--active')))
    .concat(Array.from(document.getElementsByClassName('m-bottom-sheet--active')))
    .concat(Array.from(document.getElementsByClassName('m-dialog-alert--active')))
    

  for (let index = 0; index < activeElements.length; index++) {
    zis.push(getZIndex(activeElements[index]))
  }

  return Math.max(...zis)
}

const activeZIndex = (el?: Element | null): number => {
  if (typeof window === 'undefined' || !el) return 0

  const content = el

  const index = getMaxZIndex(content) + 2

  if (index == null) return index

  return index
}

const cheakOutsideWindow = (el:HTMLElement) => {
  const { bottom, left, right, top } = el.getBoundingClientRect()
  

  const isOutsideTop = top < 0
  const isOutsideBottom = bottom > Math.max(document.body.scrollHeight, window.innerHeight)
  const isOutsideLeft = left < 0
  const isOutsideRight = right > window.innerWidth

  if (isOutsideTop) {
    // el.style.top = Math.ceil(parseInt(el.style.top) - ) 'px'    
  }

  if (isOutsideBottom) {
    el.style.top = Math.ceil(parseInt(el.style.top) - (bottom - Math.max(document.body.scrollHeight, window.innerHeight)) - 10) + 'px'
  }

  if (isOutsideLeft) {
    el.style.left = Math.ceil(parseInt(el.style.left) + Math.abs(left) + 10) + 'px'
    
  }
  
  if (isOutsideRight) {
    el.style.left = Math.ceil(parseInt(el.style.left) - (right - window.innerWidth) - 10) + 'px'
  }
}

const convertToUnit = (str: string | number | null | undefined, unit = 'px'): string | undefined => {
  if (str == null || str === '') {
    return undefined
  }
  else if (isNaN(+str)) {
    return String(str)
  }
  else {
    return `${Number(str)}${unit}`
  }
}

const checkHaveHTMLCode = (text: string): boolean => {
  return /<[^<]+>/gi.test(text)
}

export {
  isColorCss,
  colorClass,
  prettierNumeric,
  throttle,
  getZIndex,
  getMaxZIndex,
  activeZIndex,
  cheakOutsideWindow,
  convertToUnit,
  checkHaveHTMLCode
}
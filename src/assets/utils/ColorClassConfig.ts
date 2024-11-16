type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type ColorName = 'primary' | 'orange' | 'black' | 'purple' | 'azure' | 'white' | 'background-color' | 'green' | 'red'
type Color = ColorName | RGB | RGBA | HEX
type Brightness = '900' | '500' | '100' | '50'
type Class = 'bgColor' | 'borderColor' | 'textColor' | 'fillColor'

type IBrightness = {
	900: string
	500?: string
	100?: string
	50?: string
}

type IClass = Record<Class, IBrightness>

type IColors = Record<Color, IClass>

const color: IColors = {
  primary: {
    bgColor: {
      100: 'ui-bg-primary-100',
      500: 'ui-bg-primary-500',
      900: 'ui-bg-primary-900',
    },
    borderColor: {
      100: 'ui-border-primary-100',
      500: 'ui-border-primary-500',
      900: 'ui-border-primary-900',
    },
    textColor: {
      100: 'ui-text-primary-100',
      500: 'ui-text-primary-500',
      900: 'ui-text-primary-900',
    },
    fillColor: {
      100: 'ui-fill-primary-100',
      500: 'ui-fill-primary-500',
      900: 'ui-fill-primary-900',
    },
  },
  orange: {
    bgColor: {
      100: 'ui-bg-orange-100',
      500: 'ui-bg-orange-500',
      900: 'ui-bg-orange-900',
    },
    borderColor: {
      100: 'ui-border-orange-100',
      500: 'ui-border-orange-500',
      900: 'ui-border-orange-900',
    },
    textColor: {
      100: 'ui-text-orange-100',
      500: 'ui-text-orange-500',
      900: 'ui-text-orange-900',
    },
    fillColor: {
      100: 'ui-fill-orange-100',
      500: 'ui-fill-orange-500',
      900: 'ui-fill-orange-900',
    },
  },
  black: {
    bgColor: {
      50: 'ui-bg-black-50',
      100: 'ui-bg-black-100',
      500: 'ui-bg-black-500',
      900: 'ui-bg-black-900',
    },
    borderColor: {
      50: 'ui-border-black-50',
      100: 'ui-border-black-100',
      500: 'ui-border-black-500',
      900: 'ui-border-black-900',
    },
    textColor: {
      50: 'ui-text-black-50',
      100: 'ui-text-black-100',
      500: 'ui-text-black-500',
      900: 'ui-text-black-900',
    },
    fillColor: {
      50: 'ui-fill-black-50',
      100: 'ui-fill-black-100',
      500: 'ui-fill-black-500',
      900: 'ui-fill-black-900',
    },
  },
  purple: {
    bgColor: {
      500: 'ui-bg-purple-500',
      900: 'ui-bg-purple-900',
    },
    borderColor: {
      500: 'ui-border-purple-500',
      900: 'ui-border-purple-900',
    },
    textColor: {
      500: 'ui-text-purple-500',
      900: 'ui-text-purple-900',
    },
    fillColor: {
      500: 'ui-fill-purple-500',
      900: 'ui-fill-purple-900',
    },
  },
  azure: {
    bgColor: {
      500: 'ui-bg-azure-500',
      900: 'ui-bg-azure-900',
    },
    borderColor: {
      500: 'ui-border-azure-500',
      900: 'ui-border-azure-900',
    },
    textColor: {
      500: 'ui-text-azure-500',
      900: 'ui-text-azure-900',
    },
    fillColor: {
      500: 'ui-fill-azure-500',
      900: 'ui-fill-azure-900',
    },
  },
  white: {
    bgColor: {
      900: 'ui-bg-white-900',
    },
    borderColor: {
      900: 'ui-border-white-900',
    },
    textColor: {
      900: 'ui-text-white-900',
    },
    fillColor: {
      900: 'ui-fill-white-900',
    },
  },
  'background-color': {
    bgColor: {
      500: 'ui-bg-background-color-500',
      900: 'ui-bg-background-color-900',
    },
    borderColor: {
      500: 'ui-border-background-color-500',
      900: 'ui-border-background-color-900',
    },
    textColor: {
      500: 'ui-text-background-color-500',
      900: 'ui-text-background-color-900',
    },
    fillColor: {
      500: 'ui-fill-background-color-500',
      900: 'ui-fill-background-color-900',
    },
  },
  green: {
    bgColor: {
      100: 'ui-bg-green-100',
      500: 'ui-bg-green-500',
      900: 'ui-bg-green-900',
    },
    borderColor: {
      100: 'ui-border-green-100',
      500: 'ui-border-green-500',
      900: 'ui-border-green-900',
    },
    textColor: {
      100: 'ui-text-green-100',
      500: 'ui-text-green-500',
      900: 'ui-text-green-900',
    },
    fillColor: {
      100: 'ui-fill-green-100',
      500: 'ui-fill-green-500',
      900: 'ui-fill-green-900',
    },
  },
  red: {
    bgColor: {
      100: 'ui-bg-red-100',
      500: 'ui-bg-red-500',
      900: 'ui-bg-red-900',
    },
    borderColor: {
      100: 'ui-border-red-100',
      500: 'ui-border-red-500',
      900: 'ui-border-red-900',
    },
    textColor: {
      100: 'ui-text-red-100',
      500: 'ui-text-red-500',
      900: 'ui-text-red-900',
    },
    fillColor: {
      100: 'ui-fill-red-100',
      500: 'ui-fill-red-500',
      900: 'ui-fill-red-900',
    },
  },
}

export {
  color
}

export type {
  Color,
  Brightness,
  Class,
  ColorName
}
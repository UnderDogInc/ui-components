import * as components from './components'
import type { Brightness, Class, Color, ColorName} from './assets/utils/ColorClassConfig'


type HatUI = typeof components
type HatUIComponentNames = keyof { [K in keyof HatUI]: any };

export type HatUIComponents = Pick<HatUI, HatUIComponentNames>;
export type {
  Brightness,
  Class,
  Color,
  ColorName
}

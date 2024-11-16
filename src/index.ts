import { App } from 'vue'
import * as components from './components'
import * as directives from './assets/directives'

function install(app: App) {
  for (const key in components) {
    // @ts-expect-error
    app.component(key, components[key])
  }

  for (const key in directives) {
    // @ts-expect-error
    app.directive(key, directives[key])
  }

}

import './assets/style/global.scss'

export default { install }

export * from './components'
export * from './assets/directives'
export type { Brightness, Class, Color, HatUIComponents } from './type'

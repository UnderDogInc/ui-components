import { app } from '@storybook/vue3'
import * as directives from '../src/assets/directives'
import '../src/assets/style/global.scss'

for (const key in directives) {
  // @ts-expect-error
  app.directive(key, directives[key])      
}


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}


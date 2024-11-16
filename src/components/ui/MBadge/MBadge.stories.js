import MBadge from './MBadge.vue'
import {color} from '@/assets/utils/ColorClassConfig'


export default {
  title: 'Badge',
  component: MBadge,
  argTypes: {
    colorUp: {
      options: Object.keys(color),
      control: { type: 'select' },
    },
    brightnessUp: {
      options: ['900', '500', '100', '50'],
      control: { type: 'select' },
    },
    colorDown: {
      options: Object.keys(color),
      control: { type: 'select' },
    },
    brightnessDown: {
      options: ['900', '500', '100', '50'],
      control: { type: 'select' },
    },
    colorTextUp: {
      options: Object.keys(color),
      control: { type: 'select' },
    },
    brightnessTextUp: {
      options: ['900', '500', '100', '50'],
      control: { type: 'select' },
    },
    colorTextDown: {
      options: Object.keys(color),
      control: { type: 'select' },
    },
    brightnessTextDown: {
      options: ['900', '500', '100', '50'],
      control: { type: 'select' },
    },
    style: {
      options: ['pill', 'rounded'],
      control: { type: 'select' },
    },
    size: {
      options: ['default', 'small'],
      control: { type: 'select' },
    },
    type: {
      options: ['down', 'up', null],
      control: { type: 'select' },
    },
    colorDot: {
      options: Object.keys(color),
      control: { type: 'select' },
    },
  },
}

const Template = (args) => ({
  components: {
    MBadge,
  },
  setup() {
    return { args }
  },
  template: `<m-badge v-bind="args">
                <button style="border: 1px solid gray; border-radius: 3px; padding: 2px 5px; background: #83D6E8">example</button>
             </m-badge>`,
})

export const Default = Template.bind({})
Default.args = {
  type: 'up',
  style: 'pill',
  title: 'test',
  colorUp: 'rgba(131, 191, 110, 0.1)',
}
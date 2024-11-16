import MInputTel from './MInputTel.vue'

export default {
  title: 'MInputTel',
  component: MInputTel,
}

const Template = (args) => ({
  components: {
    MInputTel,
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <MInputTel v-bind="args"></MInputTel>
  `,
})

export const Defalut = Template.bind({})
Defalut.args = {}
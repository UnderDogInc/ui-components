import MCheckbox from './MCheckbox.vue'

export default {
  title: 'Checkbox',
  component: MCheckbox,
}

const Template = (args) => ({
  components: { MCheckbox },
  data() {
    return {
      select: [],
      test: {
        id: 'checkbox2',
        value: {
          value: 'test 2',
        },
      },
    }
  },
  setup() {
    return { args }
  },
  template: `
    {{select}}
    <m-checkbox v-model="select" v-bind="args">Применить</m-checkbox>
  `,
})

export const Default = Template.bind({})
Default.args = {
  id: 'checkbox',
  value: {
    value: 'test 1',
  },
}

export const Switches = Template.bind({})
Switches.args = {
  id: 'checkbox',
  type: 'switches',
  value: {
    value: 'test 1',
  },
}

import MRateRange from './MRateRange.vue'

export default {
  title: 'Rate Range',
  component: MRateRange,
}

const Template = (args) => ({
  data() {
    return {
      value: 0,
    }
  },
  components: {
    MRateRange,
  },
  setup() {
    return { args }
  },
  template: '<MRateRange v-model="value" v-bind="args" />',
})
export const Default = Template.bind({})
Default.args = {
}

import MRadioButton from './MRadioButton.vue'

export default {
  title: 'Radio Button',
  component: MRadioButton,
}

const Template = (args) => ({
  data() {
    return {
      value: 'women',
    }
  },
  components: { 
    MRadioButton,
  },
  setup() {
    return { args }
  },
  template: `<MRadioButton v-model="value" id="women" value="women" v-bind="args">Женский пол</MRadioButton> <MRadioButton value="men" v-model="value" v-bind="args" id="men">Муржской пол</MRadioButton>`,
})

export const Default = Template.bind({})
Default.args = {
}
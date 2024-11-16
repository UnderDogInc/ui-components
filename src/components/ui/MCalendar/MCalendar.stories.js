import MCalendar from './MCalendar.vue'

export default {
  title: 'MCalendar',
  component: MCalendar,
}

const Template = (args) => ({
  components: {
    MCalendar,
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <m-calendar
      v-bind="args"
    >
    </m-calendar>
  `,
})

export const Default = Template.bind({})
Default.args = {
  datePicker: true,
  timePicker: true,
}

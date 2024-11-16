import MBottomSheetCalendar from './MBottomSheetCalendar.vue'

export default {
  title: 'Bottom Sheet Calendar',
  component: MBottomSheetCalendar,
}

const Template = (args) => ({
  components: {
    MBottomSheetCalendar,
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <MBottomSheetCalendar
      v-bind="args"
    >
    </MBottomSheetCalendar>
  `,
})

export const Default = Template.bind({})
Default.args = {
  isOpen: true,
  datePicker: true,
  timePicker: true,
}

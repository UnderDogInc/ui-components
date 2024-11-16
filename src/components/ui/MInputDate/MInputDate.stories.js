import MInputDate from './MInputDate.vue'
import MCalendar from '../MCalendar/MCalendar.vue'
import { ref } from 'vue'

export default {
  title: 'Input Date',
  component: MInputDate,
}

const Template = (args) => ({
  components: {
    MInputDate,
    MCalendar,
  },
  setup() {
    const refArgs = ref(args)

    return {
      args,
      refArgs,
    }
  },
  template: `
    <MInputDate
      v-bind="refArgs"
    >
      Дата, с которой начать
    </MInputDate>
  `,
})

export const Default = Template.bind({})
Default.args = {
  timePicker: true,
  isReadonly: true,
}
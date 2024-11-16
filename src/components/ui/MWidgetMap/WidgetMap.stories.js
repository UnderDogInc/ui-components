import { ref } from 'vue'
import WidgetMap from './WidgetMap.vue'

export default {
  title: 'Widget Map',
  component: WidgetMap,
}

const Template = (args) => ({
  components: {
    WidgetMap,
  },
  setup() {
    const value = ref('')

    return {
      args,
      value,
    }
  },
  template: `
    <WidgetMap
      v-model="value"
      v-bind="args"
    >
    </WidgetMap>
  `,
})

export const Default = Template.bind({})
Default.args = {
  // modelValue: 'SPB20',
  cityTitle: 'Санкт-Петербург',
}

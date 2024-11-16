import { ref } from 'vue'
import MAutocomplete from './MAutocomplete.vue'

export default {
  title: 'Autocomplete',
  component: MAutocomplete,
}

const Template = (args) => ({
  components: {
    MAutocomplete,
  },
  setup() {
    const value = ref([{
      title: 'Москва',
      value: '1',
    }])

    return {
      args,
      value,
    }
  },
  template: `
    <MAutocomplete
      v-model="value"
      v-bind="args"
    />
  `,
})

export const Default = Template.bind({})
Default.args = {
  activeKey: 'value',
  textKey: 'title',
  items: [
    {
      title: 'Москва',
      value: '1',
    },
    {
      title: 'Питер',
      value: '2',
    },
  ],
  multiple: true,
  errorMessage: 'tererte',
  disabled: true,
}
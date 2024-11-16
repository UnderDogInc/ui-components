import { ref } from 'vue'
import MInputChips from './MInputChips.vue'

export default {
  title: 'Input Chips',
  component: MInputChips,
}

const Template = (args) => ({
  components: {
    MInputChips,
  },
  setup() {
    const modelValue = ref(['asdf,asdf', 'asdfasef'])

    return {
      args,
      modelValue,
    }
  },
  template: `
    <MInputChips
      v-bind="args"
      v-model="modelValue"
    />
  `,
})

export const Default = Template.bind({})
Default.args = {
  isReadonly: true,
}
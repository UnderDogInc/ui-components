import { ref } from 'vue'
import MBottomSheet from './MBottomSheet.vue'

export default {
  title: 'Botoom Sheet',
  component: MBottomSheet,
}

const Template = (args) => ({
  components: {
    MBottomSheet,
  },
  setup() {
    const openBottomSheet = ref(true)

    return {
      args,
      openBottomSheet,
    }
  },

  template: `
    <button
      @click="openBottomSheet = true"
    >
      open
    </button>
    <MBottomSheet
      v-bind="args"
      v-model="openBottomSheet"
    >
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
      <div>asdfas</div>
    </MBottomSheet>
  `,
})

export const Default = Template.bind({})
Default.args = {
  title: 'Bottom Sheet',
}
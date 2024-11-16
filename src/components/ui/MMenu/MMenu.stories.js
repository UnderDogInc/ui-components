import MMenu from './MMenu.vue'

export default {
  title: 'Menu',
  component: MMenu,
}

const Template = (args) => ({
  components: {
    MMenu,
  },
  data() {
    return {
      open: false,
    }
  },
  setup() {
    return { args }
  },
  template: `
  <button @click="open=true">
    {{open}}
  </button>
  <MMenu
    v-model="open"
    v-bind="args"
    class="menua"
  >
  </MMenu>`,
})

export const Default = Template.bind({})

import MTextarea from './MTextarea.vue'

export default {
  title: 'Textarea',
  component: MTextarea,
}

const Template = (args) => ({
  components: {
    MTextarea,
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <MTextarea
      v-bind="args"
    >
    </MTextarea>
  `,
})

export const Default = Template.bind({})
Default.args = {}
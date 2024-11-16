import MQuote from './MQuote.vue'

export default {
  title: 'Quote',
  component: MQuote,
}

const Template = (args) => ({
  components: {
    MQuote,
  },
  data() {
    return {
      value: false,
    }
  },
  setup() {
    return {
      args,
    }
  },
  template: `<MQuote :style="{marginLeft: '600px'}" v-model="value" v-bind="args">
    <template #activator="{on}">
      <span v-on="on">
        open
      </span>
    </template>
  </MQuote>`,
})

export const Default = Template.bind({})
Default.args = {
  text: 'Отображается под изображением в слайдере. Не должен содержать того-то того-то и того-то',
  bottom: true,
  'offset-y': true,
}
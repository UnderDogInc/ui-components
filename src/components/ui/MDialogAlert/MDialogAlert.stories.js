import { ref } from 'vue'
import MDialogAlert from './MDialogAlert'

export default {
  title: "Dialog Alert",
  name: 'Alert',
  component: MDialogAlert,
}

const Template = (args) => ({
  components: {
    MDialogAlert,
  },
  setup() {
    const isOpen = ref(false)

    return {
      args,
      isOpen,
    }
  },
  template: `
    <button @click="isOpen=true">open</button>
    <MDialogAlert v-bind="args" v-model:is-open="isOpen"/>
  `,
})

export const Default = Template.bind({})
Default.args = {
  title: 'Подтвердите действие',
  text: [
    'Вы действительно хотите удалить выбранный товар?',
    '<div>test</div>',
  ],
  aceptText: 'Уйти со страницы',
}
import { ref } from 'vue'
import MWindowAlert from './MWindowAlert.vue'

export default {
  title: 'Window Alert',
  component: MWindowAlert,
}

const Template = (args) => ({
  components: {
    MWindowAlert,
  },
  setup() {
    const isOpen = ref(false) 
    const isOpen2 = ref(false) 
    const isOpen3 = ref(false) 
    const isOpen4 = ref(false) 
    const isOpen5 = ref(false) 
    
    return {
      args,
      isOpen,
      isOpen2,
      isOpen3,
      isOpen4,
      isOpen5,
    }
  },
  template: `
    <button @click="isOpen = !isOpen">
      open1
    </button>
    <button @click="isOpen2 = !isOpen2">
      open2
    </button>
    <button @click="isOpen3 = !isOpen3">
      open3
    </button>
    <button @click="isOpen4 = !isOpen4">
      open4
    </button>
    <button @click="isOpen5 = !isOpen5">
      open5
    </button>
    <MWindowAlert
      autoClosingAfterTime
      v-bind="args"
      v-model:isOpen="isOpen"
      class="test class"
    />
    <MWindowAlert
      autoClosingAfterTime
      type="success"
      text="<span>Заказ с id=[11209] не удается удалить</span>"
      v-model:isOpen="isOpen2"
      class="test class"
    />
    <MWindowAlert
      autoClosingAfterTime
      type="success"
      text="Заказ с id=[11209] не удается удалить"
      v-model:isOpen="isOpen3"
      class="test class"
    />
    <MWindowAlert
      autoClosingAfterTime
      type="success"
      text="Заказ с id=[11209] не удается удалить"
      v-model:isOpen="isOpen4"
      class="test class"
    />
    <MWindowAlert
      autoClosingAfterTime
      type="success"
      text="Заказ с id=[11209] не удается удалить"
      v-model:isOpen="isOpen5"
      class="test class"
    />
  `,
})

export const Default = Template.bind({})
Default.args = {
  type: 'error',
  text: 'Заказ с id=[11209] не удается удалить',
}
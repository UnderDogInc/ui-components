import MInput from './MInput.vue'
import RubleIcon from '../../icon/RubleIcon.vue'
import { ref } from 'vue'

export default {
  title: 'Input',
  component: MInput,
}

const Template = (args) => ({
  components: {
    MInput,
  },
  setup() {
    const refArgs = ref(args)

    return { refArgs }
  },
  template: `
    <m-input
      v-model="refArgs.value"
      v-bind="refArgs"
    >
      Имя
    </m-input>`,
})

export const Default = Template.bind({})
Default.args = {
  value: '',
  placeholder: 'Александр',
}

export const InputError = Template.bind({})
InputError.args = {
  value: '',
  errorMessage: 'Неверный формат имени',
}


const TemplateWithIcon = (args) => ({
  components: {
    MInput,
    RubleIcon,
  },
  setup() {
    const refArgs = ref(args)
    
    const test = () => {
      console.log(1)
    }

    return { 
      refArgs,
      test,
    }
  },
  template: `
    <m-input
      @clickInput="test"
      v-model="refArgs.value"
      v-bind="refArgs"
    >
      <template #prepend-icon="{isFocus}">
        <RubleIcon
          width="20px"
          height="20px"
          :fill="isFocus ? '#1A1D1F' : '#9A9FA5'"
        />
      </template>
      Стоимость
    </m-input>
  `,
})


export const InputWithIcon = TemplateWithIcon.bind({})
InputWithIcon.args = {
  clearable: true,
  type: 'number',
  prependIconOptions: {
    border: true,
    bgColor: true,
  },
}

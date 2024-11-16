import { LoadingType } from '../../../assets/utils/storybookTypes/typesArgs'
import MLoading from './MLoading.vue'

export default {
  title: 'Loading',
  component: MLoading,
  argTypes: {
    animationName: LoadingType,
    color: {
      control: { type: 'color' },
    },
  },
}

const Template = (args) => ({
  components: {
    MLoading,
  },
  setup() {
    return {
      args,
    }
  },
  template: `
    <MLoading v-bind="args"/>
  `,
})

export const Default = Template.bind({})
Default.args = {

}
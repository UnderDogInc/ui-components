import MTabsButton from './MTabsButton.vue'

export default {
  title: 'Tabs Button',
  component: MTabsButton,
  argTypes: {
    type: {
      options: ['buttons', 'tabs'],
      control: { type: 'select' },
    },
  },
}

const Template = (args) => ({
  data() {
    return {
      value: {
        title: '',
        value: '',
      },
    }
  },
  components: {
    MTabsButton,
  },
  setup() {
    return {
      args,
    }
  },
  template: '<MTabsButton v-model="value" v-bind="args" />',
})

export const Default = Template.bind({})
Default.args = {
  items: [
    {
      value: '.xls',
      title: '.xls',
    },
    {
      value: '.csv',
      title: '.csv',
    },
    {
      value: '.doc',
      title: '.doc',
    },
  ],
  type: 'buttons',
  colorHover: 'rgba(102, 139, 251, 0.5)',
  color: 'rgba(102, 139, 251, 1)',
  colorDefault: '#EDEDED',
}
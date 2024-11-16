import MDropDownFile from './MDropDownFile.vue'

export default {
  title: 'Drop Down File',
  component: MDropDownFile,
}

const Template = (args) => ({
  data() {
    return {
      fiels: [
        {
          id: 1,
          url: 'https://avatars.mds.yandex.net/i?id=0d850cab98f56ab20b50f322978ac300c8068ea5-7662207-images-thumbs&n=13',
        },
      ],
    }
  },
  components: {
    MDropDownFile,
  },
  setup() {
    return {
      args,
    }
  },
  template: '<MDropDownFile v-model="fiels" v-bind="args"/>',
})

export const Default = Template.bind({})
Default.args = {
  isReadonly: false,
}
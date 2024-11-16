import MInputFile from './MInputFile.vue'

export default {
  title: 'Input File',
  component: MInputFile,
}

const Template = (args) => ({
  data() {
    return {
      file: {
        url: 'https://avatars.mds.yandex.net/i?id=0d850cab98f56ab20b50f322978ac300c8068ea5-7662207-images-thumbs&n=13',
        name: 'https://avatars.mds.yandex.net/i?id=0d850cab98f56ab20b50f322978ac300c8068ea5-7662207-images-thumbs&n=13',
      },
    }
  },
  components: {
    MInputFile,
  },
  setup() {
    return {
      args,
    }
  },
  template: '<MInputFile v-model="file" v-bind="args" />',
})

export const Default = Template.bind({})
Default.args = {
  // isReadonly: true,
  acceptVideo: true,
}

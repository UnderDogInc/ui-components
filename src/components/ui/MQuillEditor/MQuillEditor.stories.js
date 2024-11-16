import { ref } from 'vue'
import MQuillEditor from './MQuillEditor.vue'

export default {
  title: 'Quill editor',
  component: MQuillEditor,
}

const Template = (args) => ({
  components: {
    MQuillEditor,
  },
  setup() {
    const content = ref('<p><img src="adsfasefas/sadfaesf" data-id="12341234"></p>')

    const removeImage = (attributes) => {
      console.log(attributes['data-id'].value)
    }

    return {
      args,
      content,
      removeImage,
    }
  },
  template: `<MQuillEditor @removeImage="removeImage" v-bind="args" v-model="content"/>`,
})

export const Default = Template.bind({})

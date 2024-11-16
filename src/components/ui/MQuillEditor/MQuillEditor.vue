<script setup lang="ts">
import { QuillEditor, Quill, Delta } from '@vueup/vue-quill'
import { PropType, ref, computed } from 'vue'
import ImageResize from 'quill-image-resize'
import ImageUploader from 'quill-image-uploader'
import FormError from '../../HOC/FormError/FormError.vue'
import './MQuillEditor.scss'

export interface IImageAttributes {
  title: string,
  value: string,
}

interface ModulesQuill {
  imageResize?: {
    displaySize: boolean;
    displayStyles: {
      backgroundColor: string;
      border: string;
      color: string;
    };
    modules: string[];
  };
  imageUploader?: {
    upload: (file: File) => Promise<string>;
  };
}

Quill.debug('error')

const InlineBlot = Quill.import("blots/block")

class LoadingImage extends InlineBlot {
static blotName: string
static create(data: any) {
  const node = super.create(data)
  if (data === true) return node

  const image = document.createElement("img")
    
  if (data) {
    const parsedata = JSON.parse(data)
      
    if (parsedata) {
      parsedata.url && image.setAttribute("src", parsedata.url)
      props.imageAttributes.forEach((el) => {
        parsedata[el.value] && image.setAttribute(el.title, parsedata[el.value])
      })
    }
  }
      
  node.appendChild(image)

  return node
}
}

LoadingImage.blotName = "image"

Quill.register({ "formats/image": LoadingImage })
Quill.register("modules/imageUploader", ImageUploader)

class myModule extends (ImageResize as any) {
  hide = () => {
    emits('removeImage', (this.img as HTMLElement).attributes)
    this.hideOverlay()
    this.removeModules()
    this.img = undefined
  }

  checkImage = (evt: any) => {
    if (props.canDeleteImage) {
      if (this.img) {
        if ((evt.keyCode == 46 || evt.keyCode == 8)) {
          // eslint-disable-next-line no-undef
          ((window as Window & typeof globalThis & { Quill: typeof Quill }).Quill || Quill).find(this.img).deleteAt(0)
        }

        this.hide()
      }
    }
  };
}

Quill.register('modules/imageResize', myModule)

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  onUploadImage: {
    type: Function,
    default: Function,
  },
  toolbar: {
    type: Array,
    default: undefined,
  },
  imageAttributes: {
    type: Array as PropType<IImageAttributes[]>,
    default: () => [
      {
        title: 'data-id',
        value: 'id',
      },
    ],
  },
  isReadonly: Boolean,
  canUploadImage: {
    type: Boolean,
    default: true,
  },
  canDeleteImage: {
    type: Boolean,
    default: true,
  },
})
const emits = defineEmits(['update:modelValue', 'text-change', 'editor-change', 'selection-change', 'ready', 'blurEvent', 'focusEvent', 'removeImage'])
const quill = ref<Quill>(null)
const isFocus = ref(false)

const curretnQuill = computed(() => {
  return quill?.value?.getQuill()
})

const toolbar = computed(() => [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],

  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  props.canUploadImage
    ? ['link', 'image']
    : null,
  ['clean'],
].filter(el => el !== null))

const options = computed(() =>{
  const options = {
    modules: {
      toolbar: props.toolbar
        ? props.toolbar
        : toolbar.value,
      imageResize: {
        displaySize: true,
        displayStyles: {
          backgroundColor: 'black',
          border: 'none',
          color: 'white',
        },
        modules: [ 'Resize', 'DisplaySize', 'Toolbar' ],
      },
      imageUploader: {
        upload: (file: File): Promise<string>  => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              props.onUploadImage(file)
                .then((data: any) => {
                  resolve(JSON.stringify(data))
                })
                .catch(() => reject('error'))
            }, 100)
          })
        },
      },
      keyboard: {
        bindings: {
          backspace: {
            key: 'backspace',
            handler: function(range: {length: number, index: number}) {
              if (!props.canDeleteImage) {
                const index = range.length === 0
                  ? range.index - 1
                  : range.index
                const length = range.length === 0
                  ? range.length + 1
                  : range.length
                const delta = curretnQuill.value.getContents(index, length) as Delta

                const isImage = delta.reduce((value, el) => {
                  if (typeof el.insert === 'object') {
                    if (Object.keys(el.insert).find(el => el === 'image')) {
                      return true
                    }
                  }

                  return value
                }, false)

                return !isImage
              }

              return true
            },
          },
        },
      },
    } as ModulesQuill,
  }


  if (props.isReadonly) {
    delete options.modules.imageResize
    delete options.modules.imageUploader
  }

  return options
})

const blurEvent = (e: Event): void => {
  isFocus.value = false

  emits('blurEvent', e)
}

const focusEvent = (e: Event): void => {
  isFocus.value = true

  emits('focusEvent', e) 
}
</script>

<template>
  <form-error
    :error-message="props.errorMessage"
  >
    <div
      class="quill"
      :class="{
        'quill-error': props.errorMessage,
        'quill-focus': isFocus,
        'quill-readonly': props.isReadonly,
      }"
    >

      <quill-editor
        ref="quill"
        v-bind="$attrs"
        :content="props.modelValue"
        content-type="html"
        :read-only="props.isReadonly"
        :global-options="options"
        @update:content="emits('update:modelValue', $event)"
        @text-change="emits('text-change', $event)"
        @ready="emits('ready', $event)"
        @editor-change="emits('editor-change', $event)"
        @selection-change="emits('selection-change', $event)"
        @blur="blurEvent"
        @focus="focusEvent"
      />
    </div>
  </form-error>
</template>

<style>
@import '@vueup/vue-quill/dist/vue-quill.snow.css';
</style>
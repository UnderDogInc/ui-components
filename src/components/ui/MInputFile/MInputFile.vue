<script setup lang="ts">
import { computed, defineProps, defineEmits, ref, PropType } from 'vue'

import DownloadIcon from '../../icon/DownloadIcon.vue'
import FormError from '../../HOC/FormError/FormError.vue'
import DeleteIcon from '../../icon/DeleteIcon.vue'

export interface IValue {
  name: string,
  url: string,
  [s: string]: any
}

const props = defineProps({
  modelValue: {
    type: [File, Object] as PropType<File|IValue>,
    default: undefined,
  },
  label: {
    type: String,
    default: undefined,
  },
  errorMessage: {
    type: String,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: 'Загрузите файл',
  },
  visibleItem: {
    type: Boolean,
    default: true,
  },
  canUpload: {
    type: Boolean,
    default: true,
  },
  hiddenClear: Boolean,
  isReadonly: Boolean,
  error: Boolean,
  acceptVideo: Boolean,
})

const emits = defineEmits(['update:modelValue'])

const file = ref<HTMLInputElement>()
const selectedFile = computed(() => !!props.modelValue)
const isError = computed(() => !!props.errorMessage || props.error)

const filesURL = computed(() => {
  if (!props.modelValue) {
    return
  }

  if (props.modelValue instanceof File) {
    return URL.createObjectURL(props.modelValue as File)
  }

  return (props.modelValue as IValue).url
})

const placeholderInputText = computed(() => {
  if (props.modelValue) {
    return props.modelValue.name
  }

  return props.placeholder
})

const previewFile = (event: Event) => {
  const files = (event.target as HTMLInputElement).files

  if (files?.length) {
    emits('update:modelValue', files[0])
  }

  if (file.value) {
    file.value.value = ''
  }
}

const removeFile = () => {
  if (file.value) {
    file.value.files = null
    emits('update:modelValue', undefined)
  }
}

const isVideo = computed(() => {
  const currVal = props.modelValue

  if (!currVal) {
    return false
  }

  if (currVal instanceof File) {
    return currVal.type.startsWith('video/')
  }

  const urlSegments = currVal.url.toLowerCase().split(".")
  const format = urlSegments[urlSegments.length - 1]

  return format === 'mp4'
})
</script>

<template>
  <form-error
    :error-message="props.errorMessage"
  >
    <div
      v-if="props.label"
      class="lable ui-text-p12-semibold ui-font-semibold ui-mb-[12px]"
    >
      {{ props.label }}
    </div>
    <div
      v-if="filesURL && visibleItem"
      class="ui-mb-[12px]"
    >
      <video
        v-if="isVideo"
        :src="filesURL"
        class="ui-rounded-base ui-max-h-[150px] ui-border-2"
        :class="{
          'ui-border-red-900': isError
        }"
      ></video>
      <img
        v-else
        class="ui-rounded-base ui-max-h-[150px] ui-border-2"
        :class="{
          'ui-border-red-900': isError
        }"
        :src="filesURL"
      >
    </div>
    <div
      v-bind="$attrs"
      class="m-input ui-group ui-input ui-min-h-[48px] ui-flex ui-justify-between ui-items-center ui-px-[2px] ui-pl-[10px] ui-border-2 ui-border-black-50 ui-bg-background-color-900 ui-rounded-base ui-text-p14-semibold ui-font-semibold ui-text-black-500 ui-transition ui-duration-[300] ui-ease"
      :class="{
        'hover:ui-bg-primary-100 hover:ui-border-primary-500 ui-cursor-pointer': !props.isReadonly && props.canUpload,
        '!ui-border-red-900 !ui-bg-background-color-500': isError,
      }"
      @click="!props.isReadonly && canUpload && file?.click()"
    >
      <div
        class="m-input__text ui-py-[2px] ui-truncate"
      >
        {{ placeholderInputText }}
      </div>
      <div
        v-if="!props.isReadonly"
        class="m-input__button ui-flex ui-items-center ui-self-stretch ui-relative after:ui-absolute after:ui-content-[''] after:ui-transition after:ui-duration-[300] after:ui-ease after:ui-h-[calc(100%)] after:ui-w-[2px] after:ui-bg-black-50 after:ui-right-[168px] after:ui-top-[0px]"
        :class="{
          'after:!ui-bg-red-900': isError,
          'group-hover:after:ui-bg-primary-500': !props.isReadonly,
          'after:ui-hidden': !props.canUpload,
        }"
      >
        <div
          v-if="selectedFile && !props.hiddenClear"
          class="clear ui-cursor-pointer ui-flex ui-items-center ui-justify-center ui-mr-[4px]"
          :class="{
            '!ui-mr-[7px]': !props.canUpload,
          }"
          @click.prevent.stop="removeFile"
        >
          <delete-icon
            width="20px"
            height="20px"
            fill="rgba(111, 118, 126, 0.4)"
          />
        </div>
        <div
          v-if="props.canUpload"
          class="dowload ui-cursor-pointer ui-select-none ui-flex ui-ml-[10px] ui-items-center ui-rounded-base ui-bg-white-900 ui-py-[8px] ui-px-[10px] ui-border-black-50 ui-border-2 ui-text-black-900 ui-text-p14-semibold ui-whitespace-nowrap"
        >
          <download-icon
            class="ui-mr-[4px]"
            width="24px"
            height="24px"
            fill="#1A1D1F"
          />
          Выберите файл
        </div>
      </div>
    </div>
    <input
      class="ui-absolute ui-pointer-events-none ui-opacity-0"
      ref="file"
      type="file"
      name="photo"
      :accept="'image/jpeg,image/png,image/jpg' + (props.acceptVideo ? ',video/mp4' : '')"
      @change="previewFile"
    >
  </form-error>
</template>

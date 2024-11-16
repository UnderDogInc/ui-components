<script setup lang="ts">
import { defineProps, PropType, defineEmits, ref, onMounted, computed } from 'vue'

import DownloadIcon from '../../icon/DownloadIcon.vue'
import FormError from '../../HOC/FormError/FormError.vue'
import CloseIcon from '../../icon/CloseIcon.vue'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.min.css'

export interface ObjectFile {
  id: number,
  url: string,
  [x: string]: string | number | object
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<(File | ObjectFile)[]>,
    required: true,
  },
  errorMessage: {
    type: String,
    default: undefined,
  },
  errorsIndex: {
    typy: Array as PropType<number[]>,
    default: () => [],
  },
  height: {
    type: String,
    default: '96px',
  },
  maxCount: {
    type: Number,
    default: 4,
  },
  canUpload: {
    type: Boolean,
    default: true,
  },
  isReadonly: Boolean,
  deleteOnlyFile: Boolean,
})

const emits = defineEmits(['update:modelValue', 'removeFile'])
const file = ref<HTMLInputElement>()
const fileform = ref<HTMLElement>()
const dragZone = ref<boolean>(false)

const isEmpty = computed(() => !props.modelValue.length)
const isError = computed(() => !!props.errorMessage)

const filesURL = computed(() => {
  return props.modelValue.map((el) => {
    if (el instanceof File) {
      return URL.createObjectURL(el as File)
    }

    return (el as ObjectFile).url
  })
})

const checkIsFile = (item: File | ObjectFile): boolean => item instanceof File

const classFileDrop = computed(() => {
  if (isEmpty.value) {
    let classDragZone = 'ui-justify-center ui-items-center ui-border-2 ui-rounded-base ui-transition ui-duration-[300] ui-ease '

    if (dragZone.value && !props.isReadonly && props.canUpload) {
      classDragZone += 'ui-bg-primary-100 ui-border-primary-500'
    }
    else {
      classDragZone += ' ui-bg-background-color-900 ui-border-black-50'

      if (!props.isReadonly && props.canUpload) {
        classDragZone += ' hover:ui-bg-primary-100 hover:ui-border-primary-500'
      }
    }

    return classDragZone
  }

  return '-ui-m-[6px] ui-w-[calc(100%_+_6px)]'
})

const fileSelected = (event: Event) => {
  if (!props.isReadonly && props.canUpload) {
    const files = (event.target as HTMLInputElement).files

    if (files && !files.length) {
      return
    }

    if (files) {
      const filesArray = Array.from(files)

      emits('update:modelValue', props.modelValue.concat(filesArray))
    }

    if (file.value) {
      file.value.value = ''
    }
  }
}

const drop = (e: DragEvent) => {
  if (!props.isReadonly && props.canUpload) {

    dragZone.value = false

    if (e.dataTransfer && !e.dataTransfer.files) {
      return
    }

    if (e.dataTransfer) {
      const filtersType = ['image/jpeg', 'image/png', 'image/jpg']
      const files = Array.from(e.dataTransfer.files).filter(el => filtersType.includes(el.type))
      emits('update:modelValue', props.modelValue.concat(files))
    }
  }
}

const removeFile = (index: number) => {
  emits('removeFile', props.modelValue[index])
  emits('update:modelValue', props.modelValue.filter((_, _index) => _index !== index))
}

const show = (event: any) => {
  const viewer = new Viewer(event.target, {
    hide() {
      viewer.destroy()
    },
  })

  viewer.view()
}

onMounted(() => {
  ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(evt: string) {
    fileform.value && fileform.value.addEventListener(evt, function(e: Event) {
      e.preventDefault()
      e.stopPropagation()
    }, false)
  })
})
</script>

<template>
  <form-error
    :error-message="props.errorMessage"
  >
    <div
      ref="fileform"
      v-bind="$attrs"
      class="file__drop ui-flex ui-flex-wrap"
      :class="[
        classFileDrop,
        {
          'ui-border-red-900': isError && !dragZone,  
        },
      ]"
      :style="{
        'min-height': props.height
      }"
      @drop.passive="drop"
      @dragover="dragZone = true"
      @dragleave="dragZone = false"
    >
      <div
        v-if="isEmpty"
        class="dowload ui-m-[6px] ui-cursor-pointer ui-font-semibold ui-flex ui-items-center ui-rounded-base ui-bg-white-900 ui-py-[8px] ui-px-[10px] ui-border-black-50 ui-border-2 ui-text-black-900 ui-text-p14-semibold"
        :class="{
          '!ui-cursor-default': props.isReadonly || !props.canUpload
        }"
        @click="!props.isReadonly && props.canUpload && file?.click()"
      >
        <slot
          name="dowload-button"
        >
          <template
            v-if="!props.isReadonly && props.canUpload"
          >
            <download-icon
              class="ui-mr-[4px]"
              width="16px"
              height="16px"
              fill="#1A1D1F"
            />
            Выберите изображения
          </template>
          <template
            v-else
          >
            Нет изображений
          </template>
        </slot>
      </div>
      <div
        v-else
        v-for="(item, index) in filesURL"
        :key="index"
        class="image__wrap ui-relative ui-m-[6px]"
      >
        <div
          v-if="!props.isReadonly && !(props.deleteOnlyFile && !checkIsFile(props.modelValue[index]))"
          class="image__delete ui-p-[4px] ui-border-2 ui-border-black-50 ui-rounded-[8px] ui-absolute ui-top-[4px] ui-left-[4px] ui-bg-white-900 ui-cursor-pointer ui-shadow-quote-shadow"
          @click="removeFile(index)"
        >
          <close-icon
            width="16px"
            height="16px"
            fill="#9A9FA5"
          />
        </div>
        <img
          @click="show"
          class="image ui-border-2 ui-border-black-50 ui-rounded-base"
          :class="{
            '!ui-border-red-500': props.errorsIndex.find(el => el === index)
          }"
          :src="item"
          :style="{
            width: props.height,
            height: props.height,
          }"
        >
      </div>
      <div
        v-if="!isEmpty && filesURL.length < maxCount && !props.isReadonly && props.canUpload"
        class="image__more ui-m-[6px] ui-flex ui-justify-center ui-items-center ui-bg-background-color-900 ui-border-black-50 ui-border-2 ui-rounded-base ui-transition ui-duration-[300] ui-ease"
        :class="{
          'hover:ui-bg-primary-100 hover:ui-border-primary-500': !props.isReadonly && props.canUpload,
        }"
        :style="{
          width: props.height,
          height: props.height,
        }"
      >
        <div
          class="dowload ui-cursor-pointer ui-font-semibold ui-flex ui-items-center ui-rounded-base ui-bg-white-900 ui-py-[8px] ui-px-[10px] ui-border-black-50 ui-border-2 ui-text-black-900 ui-text-p14-semibold"
          @click="file?.click()"
        >
          <download-icon
            class="ui-mr-[4px]"
            width="16px"
            height="16px"
            fill="#1A1D1F"
          />
          Ещё
        </div>
      </div>
    </div>
    <input
      ref="file"
      type="file"
      name="photo"
      accept="image/jpeg,image/png,image/jpg"
      class="ui-absolute ui-pointer-events-none ui-opacity-0 ui-w-0"
      multiple
      :readonly="props.isReadonly"
      @change="fileSelected"
    >
  </form-error>
</template>
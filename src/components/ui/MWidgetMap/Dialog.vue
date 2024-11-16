<script setup lang="ts">
import BalloonBottomSheet from './BalloonBottomSheet.vue'
import HeaderBlock from './HeaderBlock.vue'
import ListBlock from './ListBlock.vue'
import MapBlock from './MapBlock.vue'
import MButton from '../MButton'
import MPopup from '../MPopup'
import { PropType, ref, watch } from 'vue'
import { CdekType } from './type'

const props = defineProps({
  modelValue: Boolean,
  cdekList: {
    type: Array as PropType<CdekType[]>,
    default: () => [],
  },
  currentValueProps: {
    type: String,
    required: true,
  },
  updateValueFunction: {
    type: Function,
    required: true,
  },
})

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)
const isMap = ref(true)
const currentValue = ref(props.currentValueProps)
const isOpenBalloonBottomSheet = ref(false)
const openBalloon = ref(false)
const BalloonProps = ref({
  code: '',
  name: '',
  metro: '',
  address: '',
  comment: '',
  images: [] as string[],
})

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
})

watch(currentValue, (newValue) => {
  props.updateValueFunction(newValue)
})

watch(isOpen, (newValue) => {
  emits('update:modelValue', newValue)
})

const closeDialog = () => {
  isOpen.value = false
}

const selectCode = (value: string) => {
  props.updateValueFunction(value)

  closeDialog()
}

const openBottomSheet = (item: CdekType) => {
  if (window.innerWidth <= 768) {
    openBalloon.value = false
    isOpenBalloonBottomSheet.value = true
    BalloonProps.value = {
      code: item.code,
      name: item.name,
      metro: item.nearest_metro_station || '',
      address: item.location.address,
      comment: item.address_comment || '',
      images: item.office_images || [],
    }
  }
  else {
    openBalloon.value = true
  }
}
</script>

<template>
  <m-popup
    v-model="isOpen"
    title="Выбор пвз"
    brightness-title="500"
    color-title="azure"
    max-width="700px"
    max-height="80%"
    v-bind="$attrs"
  >
    <div>
      <div
        class="row"
      >
        <div>
          <header-block
            v-model:is-map="isMap"
          />
        </div>
        <div
          v-if="isMap"
        >
          <map-block
            v-model="currentValue"
            class="dialog-map"
            no-open-balloon
            :open-balloon="openBalloon"
            :cdek-list="cdekList"
            @clickBalloon="openBottomSheet"
            @update:model-value="selectCode"
          />
        </div>
        <div
          v-else
          class="dialog-list-wrap"
        >
          <list-block
            v-model="currentValue"
            class="dialog-list"
            :cdek-list="cdekList"
            @update:model-value="selectCode"
          />
        </div>
        <div class="ui-mt-[16px]">
          <m-button
            @click="closeDialog"
          >
            Закрыть
          </m-button>
        </div>
      </div>
    </div>
    <balloon-bottom-sheet
      v-model="isOpenBalloonBottomSheet"
      v-bind="BalloonProps"
      @selectCode="selectCode"
    />
  </m-popup>
</template>
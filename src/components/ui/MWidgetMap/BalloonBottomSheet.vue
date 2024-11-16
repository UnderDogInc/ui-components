<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import MBottomSheet from '../MBottomSheet'
import MButton from '../MButton'
import './BalloonBottomSheet.scss'
import { CdekType } from './type'

const props = defineProps({
  isOpen: Boolean,
  cdek: {
    type: Object as PropType<CdekType>,
    default: undefined,
  },
})

const emits = defineEmits(['update:isOpen', 'selectCode'])
const isOpen = ref(props.isOpen)

watch(isOpen, (newValue) => {
  emits('update:isOpen', newValue)
})

watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue
})

</script>

<template>
  <m-bottom-sheet
    :model-value="isOpen"
    :title="cdek?.name"
    @update:model-value="emits('update:isOpen', $event)"
  >
    <div
      v-if="cdek"
      class="bottom-sheet__info-wrap"
    >
      <div
        v-if="cdek.nearest_station"
        class="bottom-sheet-metro"
      >
        Станция метро: {{ cdek.nearest_station }}
      </div>
      <div
        v-if="cdek?.location?.address"
        class="bottom-sheet-address"
      >
        Адрес: {{ cdek.location.address }}
      </div>
      <div
        v-if="cdek?.address_comment"
        class="bottom-sheet-comment"
      >
        Как пройти: {{ cdek.address_comment }}
      </div>
      <div
        v-if="cdek?.work_time?.time"
        class="bottom-sheet-time"
      >
        Робочее время: {{ cdek.work_time.time }}
      </div>
      <div
        v-if="cdek?.office_images && cdek?.office_images.length"
        class="bottom-sheet-image-wrap"
      >
        <div
          v-for="(url, index) in cdek.office_images"
          :key="index"
          class="bottom-sheet-image"
        >
          <img
            :src="(url as string)"
            :alt="cdek.code"
          >
        </div>
      </div>
    </div>
    <template #footer>
      <m-button
        @click="emits('selectCode', cdek?.code)"
        block
        class="ui-h-[48px]"
      >
        Выбрать пункт
      </m-button>
    </template>
  </m-bottom-sheet>
</template>


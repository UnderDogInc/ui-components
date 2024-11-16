<script setup lang="ts">
import { PropType } from 'vue'
import './CurrentBlock.scss'
import { CdekType } from './type'

defineProps({
  currentValue: {
    type: Object as PropType<CdekType>,
    reqired: true,
  },
  isReadonly: Boolean,
})
const emits = defineEmits(['selectOther'])
</script>

<template>
  <div
    class="current-block"
    v-if="currentValue"
  >
    <div
      v-if="currentValue.name"
      class="current-block__name"
    >
      Выбран: {{ currentValue.name }}
    </div>
    <div
      v-if="currentValue.code"
      class="current-block__code"
    >
      Код ПВЗ: {{ currentValue.code }}
    </div>
    <div
      v-if="currentValue.nearest_metro_station"
      class="current-block__metro"
    >
      Станция метро: {{ currentValue.nearest_metro_station }}
    </div>
    <div
      v-if="currentValue.location?.address"
      class="current-block__address"
    >
      Адрес: {{ currentValue.location?.address }}
    </div>
    <div
      v-if="currentValue.address_comment"
      class="current-block__comment"
    >
      Как пройти: {{ currentValue.address_comment }}
    </div>
    <div
      v-if="currentValue.work_time?.time"
      class="current-block__time"
    >
      Робочее время: {{ currentValue.work_time?.time }}
    </div>
    <div
      v-if="currentValue.office_images"
      class="current-block__image-wrap"
    >
      <div
        v-for="(url, index) in currentValue.office_images"
        :key="index"
        class="current-block__image"
      >
        <img
          :src="url"
          :alt="currentValue.code"
        >
      </div>
    </div>
    <div
      v-if="!isReadonly"
      class="current-block__btn"
      @click="emits('selectOther')"
    >
      Выбрать другой пункт
    </div>
  </div>
</template>

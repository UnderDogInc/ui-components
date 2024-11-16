<script setup lang="ts">
import { yandexMap, ymapMarker } from 'vue-yandex-maps'
import { PropType, ref } from 'vue'
import './MapBlock.scss'
import { CdekType } from './type'

defineProps({
  cdekList: {
    type: Array as PropType<CdekType[]>,
    default: () => [],
  },
  modelValue: {
    type: String,
    reqired: true,
  },
  openBalloon: {
    type: Boolean,
    default: true,
  },
  noOpenBalloon: Boolean,
})

const coords = ref([0, 0])

const emits = defineEmits(['update:modelValue', 'clickBalloon'])

const bindListener = (item: CdekType) => {
  document.querySelector(`[data-cdek="${item.code}"]`)?.addEventListener('click', selectItem)
}

const selectItem = (event: Event) => {
  emits('update:modelValue', (event.target as HTMLElement)?.getAttribute('data-cdek'))
}

const clickMarker = (item: CdekType) => {
  emits('clickBalloon', item)
}

const balloonTemplate = (item: CdekType) => {
  const name = item.name
    ? `<p class="ballon__title">${item.name}</p>`
    : ''

  const metro = item.nearest_metro_station
    ? `<p class="ballon__metro">Ближайшая станция метро: ${item.nearest_metro_station}</p>`
    : ''

  const address = item.location.address
    ? `<p class="ballon__address">Адрес: ${item.location.address}</p>`
    : ''

  const comment = item.address_comment
    ? `<p class="ballon__comment">Как пройти: ${item.address_comment}</p>`
    : ''

  const time = item.work_time.time
    ? `<p class="ballon__work-time">Рабочее время: ${item.work_time.time}</p>`
    : ''

  return `
    <div class="ballon">
      ${name}
      ${metro}
      ${address}
      ${comment}
      ${time}
      <div class="ballon__btn" data-cdek="${item.code}">Выбрать пункт выдачи</div>
    </div>
  `
}
</script>

<template>
  <yandex-map
    class="block__map ui-h-[600px]"
    :controls="['zoomControl']"
    :coords="coords"
    :settings="{
      apiKey: 'asdfasef2342323',
      lang: 'ru_RU',
      coordorder: 'latlong',
      enterprise: false,
      version: '2.1'
    }"
    show-all-markers
    zoom="10"
  >
    <ymapMarker
      v-for="(cdek, index) in cdekList"
      :key="index"
      :marker-id="index"
      :coords="[cdek.location.latitude, cdek.location.longitude]"
      cluster-name="1"
      :balloon-template="balloonTemplate(cdek)"
      :options="{
        openBalloonOnClick: openBalloon,
      }"
      @balloonopen="bindListener(cdek)"
      @click="clickMarker(cdek)"
    />
  </yandex-map>
</template>
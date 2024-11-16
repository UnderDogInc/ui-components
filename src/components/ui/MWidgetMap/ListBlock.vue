<script setup lang="ts">
import lodashDebounce from 'lodash/debounce'
import MInput from '../MInput'
import MPagination from '../MPagination'
import SearchIcon from '../../icon/SearchIcon.vue'
import { computed, PropType, ref, watch } from 'vue'

import './ListBlock.scss'
import { CdekType } from './type'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  textNoSearch: {
    type: String,
    default: 'Не удалось найти пункт выдачи заказов',
  },
  cdekList: {
    type: Array as PropType<CdekType[]>,
    default: () => [],
  },
  perPage: {
    type: [String, Number],
    default: 5,
  },
})

const emits = defineEmits(['update:modelValue'])

const listWrap = ref<HTMLElement>()
const list = ref<HTMLElement>()

const cdekSearchList = ref<CdekType[]>(props.cdekList)
const currentValue = ref(props.modelValue)
const search = ref('')
const page = ref(1)

const debounce = computed(() => {
  return lodashDebounce(updateSeatchList, 250)
})

const currentPageItems = computed(() => {
  const start = (page.value - 1) * parseInt(String(props.perPage))

  return cdekSearchList.value.slice(start, start + parseInt(String(props.perPage)))
})

const totalPage = computed(() => {
  return Math.ceil(cdekSearchList.value.length / parseInt(String(props.perPage)))
})

const updateSeatchList = () => {
  const newList: CdekType[] = []

  props.cdekList.forEach((el: CdekType) => {
    if (el.name.toLowerCase().includes(search.value.toLowerCase().trim()) || (el.location.address.toLowerCase().includes(search.value.toLowerCase().trim())) || (el.nearest_metro_station && el.nearest_metro_station.toLowerCase().includes(search.value.toLowerCase().trim()))) {
      newList.push(el)
    }
  })

  page.value = 1
  cdekSearchList.value = newList
}

const closeDialog = (value: string) => {
  emits('update:modelValue', value)
}

watch(search, () => {
  debounce.value()
})

watch(currentValue, (newValue) => {
  emits('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  currentValue.value = newValue
})

watch(page, () => {
  if (list.value && list.value.clientHeight < list.value.scrollHeight) {
    list.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  else if (listWrap.value) {
    const currentScrollTop = window.scrollY - Math.abs(listWrap.value.getBoundingClientRect().top)
          
    window.scrollTo({
      top: currentScrollTop,
      behavior: 'smooth',
    })
  }
})

watch(() => props.cdekList, (newValue) => {
  cdekSearchList.value = newValue
})
</script>

<template>
  <div
    ref="listWrap"
    class="block__cdek-list-wrap"
  >
    <m-input
      v-model="search"
      class="block__cdek-list__search"
      placeholder="Поиск по адресу и названию"
      clearable
    >
      <template #prepend-icon="{isFocus}">
        <div
          class="block__cdek-list__search-icon"
        >
          <search-icon
            :fill="isFocus ? 'rgb(59 130 246 / 0.5)' : '#EDEDED'"
            width="24px"
            height="24px"
          />
        </div>
      </template>
    </m-input>
    <slot
      name="list"
      v-bind="({
        items: currentPageItems
      })"
    >
      <div
        v-if="currentPageItems.length < 1"
        class="block__cdek-list__no-text"
      >
        {{ textNoSearch }}
      </div>
      <div
        ref="list"
        class="block__cdek-list scroll-y"
      >
        <div
          v-for="cdek in currentPageItems"
          :key="cdek.code"
          @click="closeDialog(cdek.code)"
          class="block__cdek-list__item"
          :class="{
            'block__cdek-list__item-active': cdek.code === currentValue
          }"
        >
          <div
            v-if="cdek.name"
            class="block__cdek-list__item-name"
          >
            {{ cdek.name }}
          </div>
          <div
            v-if="cdek.nearest_metro_station"
            class="block__cdek-list__item-metro"
          >
            Станция метро: {{ cdek.nearest_metro_station }}
          </div>
          <div
            v-if="cdek?.location?.address"
            class="block__cdek-list__item-address"
          >
            Адрес: {{ cdek.location.address }}
          </div>
          <div
            v-if="cdek.address_comment"
            class="block__cdek-list__item-comment"
          >
            Как пройти: {{ cdek.address_comment }}
          </div>
          <div
            v-if="cdek.address_comment"
            class="block__cdek-list__item-time"
          >
            Робочее время: {{ cdek.work_time.time }}
          </div>
          <div
            v-if="cdek.office_images"
            class="block__cdek-list__item-image-wrap"
          >
            <div
              v-for="(url, index) in cdek.office_images"
              :key="index"
              class="block__cdek-list__item-image"
            >
              <img
                :src="url"
                :alt="cdek.code"
              >
            </div>
          </div>
        </div>
      </div>
    </slot>
    <div
      v-if="totalPage > 1"
      class="block__cdek-list__pagination"
    >
      <m-pagination
        v-model="page"
        :page-count="totalPage"
        hidden-text
      />
    </div>
  </div>
</template>
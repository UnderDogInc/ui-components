<script setup lang="ts">
import { defineProps, computed, defineEmits, ref, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import ChewronRightIcon from '../../icon/ChewronRightIcon.vue'

import MInput from '../MInput'

import { TPageItem } from './type'
import './MPagination.scss'
import SearchIcon from '../../icon/SearchIcon.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  pageRange: {
    type: Number,
    default: 5,
  },
  prevText: {
    type: String,
    default: "Назад",
  },
  nextText: {
    type: String,
    default: "Дальше",
  },
  disable: Boolean,
  withSearch: Boolean,
  isNavigationIcon: Boolean,
})

const emits = defineEmits(['update:modelValue'])

const selected: Ref<number> = ref(+props.modelValue)

const pages = computed((): TPageItem => {
  const items: TPageItem = {}

  if (+props.pageCount <= +props.pageRange) {
    for (let index = 0; index < +props.pageCount; index++) {
      const page = {
        index: index,
        content: index + 1,
        selected: index === (selected.value - 1),
      }
      items[index] = page
    }
  }
  else {
    const halfPageRange = Math.floor(+props.pageRange / 2)

    const setPageItem = (index: number) => {
      const page = {
        index: index,
        content: index + 1,
        selected: index === (selected.value - 1),
      }

      items[index] = page
    }

    let selectedRangeLow = 0
	
    if (selected.value - halfPageRange > 0) {
      selectedRangeLow = selected.value - 1 - halfPageRange
    }

    let selectedRangeHigh = selectedRangeLow + props.pageRange - 1

    if (selectedRangeHigh >= props.pageCount) {
      selectedRangeHigh = props.pageCount - 1
      selectedRangeLow = selectedRangeHigh - props.pageRange + 1
    }

    for (let i = selectedRangeLow; i <= selectedRangeHigh && i <= props.pageCount - 1; i++) {
      setPageItem(i)
    }
  }

  return items
})

const firstPageSelected = computed((): boolean =>{
  return selected.value === 1
})
const lastPageSelected = computed((): boolean =>{
  return (selected.value === +props.pageCount) || (+props.pageCount === 0)
})

const visiblePrevThreeDot = computed((): boolean =>{
  return !pages.value[0]
})
const visibleNextThreeDot = computed((): boolean =>{
  return !pages.value[props.pageCount - 1]
})

const searchPage = ref('')

const onUpdateSearch = (e: string) => {
  if (parseInt(e) > props.pageCount) {
    searchPage.value =  ''
    
    nextTick(() => {
      searchPage.value = String(props.pageCount)
    })
  }
}

const updatePage = () => {
  if (searchPage.value) {
    selected.value = parseInt(searchPage.value)
    
    searchPage.value = ''
  }
}

const incrementValue = (): void => {
  ++selected.value
}

const decrementValue = (): void => {
  --selected.value
}

watch(selected, (newValue) => {
  emits('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  selected.value = newValue
})

</script>

<template>
  <div>
    <div
      v-if="props.withSearch"
      class="ui-mb-[8px]"
    >
      <m-input
        v-model="searchPage"
        @update:model-value="onUpdateSearch"
        only-number
        height="32px"
        class="m-pagination__search"
        placeholder="Введите номер страницы"
        @keypress.enter="updatePage"
        @blur="updatePage"
      >
        <template #prepend-icon>
          <search-icon
            fill="#000"
          />
        </template>
      </m-input>
    </div>
    <div
      class="m-pagination ui-flex not:last:ui-bg-red-900"
    >
      <template
        v-if="!firstPageSelected"
      >
        <div
          @click="!props.disable && decrementValue()"
          class="ui-select-none ui-font-semibold ui-touch-none m-pagination__navigation m-pagination__navigation__prev ui-text-sm ui-h-[32px] ui-cursor-pointer ui-flex ui-items-center ui-px-[10px] ui-rounded-base ui-border-[2px] ui-border-balck-50 max-768px:ui-w-[32px] max-768px:ui-p-0 max-768px:ui-justify-center"
        >
          <div class="max-768px:ui-hidden">
            {{ props.prevText }}
          </div>
          <div
            class="max-768px:ui-flex ui-hidden"
          >
            <chewron-right-icon
              class="ui-rotate-180"
              width="24px"
              height="24px"
            />
          </div>
        </div>
      </template>
      <div
        v-if="visiblePrevThreeDot"
        class="m-pagination__item ui-font-semibold ui-w-[32px] ui-h-[32px] ui-flex ui-items-center ui-justify-center ui-text-[14px] ui-leading-[140%] ui-text-black-500 max-768px:ui-hidden"
      >
        ...
      </div>
      <template
        v-for="page in pages"
        :key="page"
      >
        <div
          @click="!props.disable && (selected = page.content)"
          class="m-pagination__item ui-w-[32px] ui-h-[32px] ui-font-semibold ui-rounded-base ui-transition ui-ease ui-duration-300 ui-flex ui-items-center ui-justify-center ui-text-[14px] ui-leading-[140%] ui-cursor-pointer hover:ui-border-[2px] hover:ui-border-black-50"
          :class="{
            'ui-border-[2px] ui-border-black-50 ui-text-black-900': page.selected,
            'ui-text-black-500 hover:ui-text-black-900': !page.selected,
          }"
        >
          {{ page.content }}
        </div>
      </template>
      <div
        v-if="visibleNextThreeDot"
        class="m-pagination__item ui-w-[32px] ui-h-[32px] ui-font-semibold ui-flex ui-items-center ui-justify-center ui-text-[14px] ui-leading-[140%] ui-text-black-500 max-768px:ui-hidden"
      >
        ...
      </div>
      <template
        v-if="!lastPageSelected"
      >
        <div
          @click="!props.disable && incrementValue()"
          class="ui-select-none ui-font-semibold ui-touch-none m-pagination__navigation m-pagination__navigation__next ui-text-sm ui-h-[32px] ui-cursor-pointer ui-flex ui-items-center ui-px-[10px] ui-rounded-base ui-border-[2px] ui-border-balck-50 max-768px:ui-w-[32px] max-768px:ui-p-0 max-768px:ui-justify-center"
        >
          <div class="max-768px:ui-hidden">
            {{ props.nextText }}
          </div>
          <div
            class="max-768px:ui-flex ui-hidden"
          >
            <chewron-right-icon
              width="24px"
              height="24px"
            />
          </div>
        </div>
      </template>
    </div>

  </div>
</template>
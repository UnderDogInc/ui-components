<script setup lang="ts">
import { defineProps, ref, onMounted, watch, defineEmits, nextTick, computed } from 'vue'
import type { PropType, Ref } from 'vue'

import { IHeader, Item } from './type' 

import MContextMenu from '../MContextMenu'

import numberShownField from './numberShownField.vue'
import MPagination from '../MPagination/MPagination.vue'
import ChewronRightIcon from '../../icon/ChewronRightIcon.vue'
import SortDownIcon from '../../icon/SortDownIcon.vue'
import MCheckbox from '../MCheckbox/MCheckbox.vue'
import MButton from '../MButton/MButton.vue'
import MLoading from '../MLoading/MLoading.vue'

import './MTable.scss'
import { typeAnimationName } from '../MLoading/type'
import { throttle } from '../../../assets/utils/utils'


const props = defineProps({
  modelValue: {
    type: Array as PropType<Item[]>,
  },
  headers: {
    type: Array as PropType<Array<IHeader>>,
    required: true,
  },
  items: {
    type: Array as PropType<Array<Item>>,
    required: true,
  },
  paddingRow: {
    type: String,
    default: '12px',
  },
  gapRows: {
    type: String,
    default: '12px',
  },
  page: {
    type: Number,
    default: 1,
  },
  pageCount: {
    type: Number,
    default: 10,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  perPageItems: {
    type: Array as PropType<Array<number|string>>,
    default:() => [10, 15, 30, 45],
  },
  checkedKey: {
    type: String,
    default: 'id',
  },
  textNoData: {
    type: String,
    default: null,
  },
  loadingType: {
    type: String as PropType<typeAnimationName>,
    default: 'default',
  },
  colorLoadingHex: {
    type: String as PropType<`#${string}`>,
    default: '#1A1D1F',
  },
  loadingText: {
    type: String,
    default: 'Идет подгрузка данных',
  },
  draggableKey: {
    type: String,
    default: 'id',
  },
  showDetails: {
    type: Array as PropType<boolean[]>,
    default: null,
  },
  scrollingSelector: {
    type: String,
    default: null,
  },
  loading: Boolean,
  multipleSorting: Boolean,
  borderHeader: Boolean,
  borderRows: Boolean,
  canSelect: Boolean,
  canDnD: Boolean,
  itemsCenter: Boolean,
  visibilityNumberViews: Boolean,
  visibilityPerItems: Boolean,
  visibilityPagination: Boolean,
  visibilityButtonMore: Boolean,
  cursorPointerRows: Boolean,
})

const emits = defineEmits(['update:modelValue', 'update:items', 'update:page', 'update:perPage', 'update:showDetails', 'sorting', 'loadMore', 'clickRow'])

const headers: Ref<Array<IHeader>> = ref(props.headers || [])
const items: Ref<Array<Item>> = ref(props.items || [])

const selectedItem = ref<Item[]>(props.modelValue || [])

const multipleSorting: Ref<{
	[key in string]: string
}> = ref({})

const page = ref(props.page)
const perPage = ref(props.perPage)
const pageCount = ref(props.pageCount)
const perPageItems = ref(props.perPageItems)

const canScrollLeft: Ref<boolean> = ref(false)

const tableWrap: Ref<HTMLElement|null> = ref(null)
const loadingOverlay = ref<HTMLElement|null>(null)
const show = ref(true)
const showDetails = ref(props.showDetails || Array(props.items.length).fill(false))
const tableWidth = ref(0)

const updateSelectPage = () => {
  if (isCheckedSelctAllPage.value) {
    removeSelectedFilterPage()
  }
  else {
    selectSelectedFilterPage()
  }
}

const isCheckedSelctAllPage = computed(() => {
  return props.items.reduce((value, item) => {
    if (value && selectedItem.value.find(el => el[props.checkedKey] === item[props.checkedKey])) {
      return true
    }

    return false
  }, true)
})

const isChecked = (item: Item) => {  
  return !!selectedItem.value.find((el) => {    
    return el[props.checkedKey] === item[props.checkedKey]
  })
}

const toggleDetails = (index: number): void => {
  showDetails.value[index] = !showDetails.value[index]
}

watch(() => props.showDetails, (newValue) => {
  showDetails.value = newValue
})

watch(showDetails, (newValue) => {
  emits('update:showDetails', newValue)
})

watch(() => props.items.length, () => {
  showDetails.value = Array(props.items.length).fill(false)
})

watch(() => props.page, () => {
  showDetails.value = Array(props.items.length).fill(false)
})

watch(() => props.perPage, () => {
  showDetails.value = Array(props.items.length).fill(false)
})

const scrolling = (e: Event) => {
  if (props.loading) {
    e.preventDefault()
  }
  else {
    checkCanScrollLeft()
  }
}

const scrollTableRight = () => {
  if (tableWrap.value) {    
    tableWrap.value.scroll({
      left: tableWrap.value.scrollLeft + 400,
      behavior: 'smooth',
    })
  }
}

const checkCanScrollLeft = () => {
  const target = tableWrap.value
  isOpenIndex.value = null

  if (target) {
    tableWidth.value = target.clientWidth
    canScrollLeft.value = Math.floor(target.scrollWidth - target.scrollLeft) - 48 > target.clientWidth
  }
}

const removeSelectedFilterPage = () => {
  props.items.forEach((el) => {
    selectedItem.value = selectedItem.value.filter(_el => _el[props.checkedKey] !== el[props.checkedKey])
  })
}

const selectSelectedFilterPage = () => {
  props.items.forEach((el) => {
    if (!selectedItem.value.find(_el => _el[props.checkedKey] === el[props.checkedKey])) {
      selectedItem.value.push(el)
    }
  })
}

const sortTable = (value: string) => {
  if (!Object.keys(multipleSorting.value).includes(value) || multipleSorting.value[value] === '') {
    multipleSorting.value[value] = 'asc'
  }
  else if (multipleSorting.value[value] === 'asc') {
    multipleSorting.value[value] = 'desc'
  }
  else {
    multipleSorting.value[value] = ''
  }

  if (!props.multipleSorting) {
    multipleSorting.value = {
      [value]: multipleSorting.value[value],
    }
  }

  emits('sorting', multipleSorting.value)
}

const itemCurrentlyDragging = ref()
const transitioning = ref(false) 

const transitionStart = () => {
  transitioning.value = true
}

const transitionEnd = () => {
  transitioning.value = false
}

const onDragOver = throttle((event: DragEvent, item: Item) => {
  if (item[props.draggableKey] === itemCurrentlyDragging.value[props.draggableKey] || transitioning.value) {
    return
  }

  const oldPositionItem = items.value?.findIndex(el => el[props.draggableKey] === itemCurrentlyDragging.value[props.draggableKey]) || 0
  const newPositionItem = items.value?.findIndex(el => el[props.draggableKey] === item[props.draggableKey]) || 0

  items.value?.splice(oldPositionItem, 1)
  items.value?.splice(newPositionItem, 0, itemCurrentlyDragging.value) 
}, 50)

const onDragStart = (event: DragEvent, item: Item) => {
  itemCurrentlyDragging.value = item
}

const onDragEnd = () => {
  emits('update:items', items.value)
  itemCurrentlyDragging.value = null
}

const scrollToTopTable = (): void => {
  if (tableWrap.value) {
    if (props.scrollingSelector) {
      const elementScrol = document.querySelector(props.scrollingSelector)

      if (elementScrol) {
        const top = -(elementScrol.getBoundingClientRect().top - tableWrap.value.getBoundingClientRect().top)

        elementScrol.scrollBy({
          behavior: 'smooth',
          top,
        })
      }
    }
    else {
      window.scrollBy({
        behavior: 'smooth',
        top:  tableWrap.value.getBoundingClientRect().top,
      })
    }

  }

}

const isOpenIndex = ref<null | number>(null)

const contextMenuPosition = ref({
  x: 0,
  y: 0,
})

const onContextMenu = (event: MouseEvent, index: number, value: boolean): boolean  => {

  if (value) {
    
    const {clientX: X, clientY: Y} = event
    
    isOpenIndex.value = null
    
    contextMenuPosition.value = {
      x: X,
      y: window.window.pageYOffset + Y,
    }
    
    nextTick(() => {
      isOpenIndex.value = index
    })
   
  }
  
  return !value
}

const onMouseDown = (item: Item, event: MouseEvent) => {
  if (event.buttons === 4) {
    emits('clickRow', item, event)

    return false
  }
}

watch(() => props.items, (newValue) => {
  items.value = newValue
})

watch(selectedItem, (newValue) => {
  emits('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  selectedItem.value = newValue || []
})

watch(page, (newValue) => {
  if (!props.loading) {
    emits('update:page', newValue)
    show.value = false
    nextTick(() => {
      show.value = true
    })
  }

  scrollToTopTable()
})

watch(() => props.page, (newValue) => {
  page.value = newValue
})

watch(() => props.pageCount, (newValue) => {
  pageCount.value = newValue
})

watch(perPage, (newValue) => {
  if (!props.loading) {
    emits('update:perPage', newValue)
  }
})

watch(() => props.perPage, (newValue) => {
  perPage.value = newValue
})

onMounted(() => {
  checkCanScrollLeft()
})
</script>

<template>
  <div
    class="ui-relative ui-z-[0]"
  >
    <div
      v-if="props.loading"
      class="m-table__loading ui-w-full ui-h-full ui-absolute ui-top-0 ui-left-0 ui-bg-background-color-500 ui-flex ui-flex-col ui-items-center ui-justify-center ui-z-[2]"
      ref="loadingOverlay"
    >
      <slot
        name="loading"
      >
        <div
          class="ui-text-p14-semibold ui-font-semibold ui-mb-[12px]"
        >
          {{ props.loadingText }}
        </div>
        <m-loading
          :animation-name="props.loadingType"
          :color="props.colorLoadingHex"
        />
      </slot>
    </div>
    <div
      v-bind="$attrs"
      v-resize="checkCanScrollLeft"
      class="ui-overflow-x-auto scroll-x ui-pb-[10px] ui-z-[0]"
      ref="tableWrap"
      @scroll="scrolling"
    >
      <table
        class="m-table ui-min-w-[100%]"
      >
        <thead>
          <tr
            class="m-table__header"
            :class="{
              'ui-border-b-[1px] ui-border-black-50': props.borderHeader
            }"
          >
            <th
              v-if="props.canSelect && items.length"
              class="m-table__check-box ui-py-[13px] ui-align-top ui-pl-[8px] ui-pr-[14px] ui-sticky ui-left-0 ui-bg-white-900 group-hover:ui-bg-background-color-900 ui-transition ui-ease ui-duration-300"
            >
              <div
                :style="{
                  marginBottom: props.gapRows,
                }"
              >
                <m-checkbox
                  class="ui-flex ui-items-center"
                  :value="true"
                  :model-value="isCheckedSelctAllPage"
                  @update:model-value="updateSelectPage"
                  :id="String(props.page)"
                />
              </div>
            </th>
            <th
              v-for="(item) in headers"
              :key="item.value"
              @click="item.sortable && sortTable(item.value)"
              class="m-table__headers-item ui-text-sm ui-text-black-500 ui-text-left ui-font-normal ui-py-[13px] ui-pr-[12px] first:ui-pl-[12px]"
              :class="{
                'ui-cursor-pointer': item.sortable,
                'ui-text-black-900': multipleSorting[item.value],
              }"
              :style="{
                maxWidth: item.maxWidth,
                minWidth: item.maxWidth,
              }"
            >
              <slot
                :name="`header-${item.value}`"
                v-bind="({
                  item: item,
                })"
              >
                <span
                  class="ui-flex ui-items-center"
                  :style="{
                    marginBottom: props.gapRows,
                  }"
                >
                  {{ item.name }}
                  <template v-if="item.sortable">
                    <sort-down-icon 
                      class="ui-ml-[4px] ui-transition ui-duration-300 ui-ease"
                      :class="{
                        'sort-desc': multipleSorting[item.value] === 'desc',
                        'sort-asc': multipleSorting[item.value] === 'asc',
                      }"
                      width="12px"
                      height="12px"
                      fill="#9A9FA5"
                    />
                  </template>
                </span>
              </slot>
            </th>
            <th
              v-if="$slots['row-show-details']"
              class="m-table__headers-item ui-text-sm ui-text-black-500 ui-text-left ui-font-normal ui-py-[13px] ui-pr-[12px] first:ui-pl-[12px]"
            >
              <span
                class="ui-flex ui-items-center"
                :style="{
                  marginBottom: props.gapRows,
                }"
              >
                Дополнительные детали
              </span>
            </th>
            <th
              class="ui-sticky ui-right-0 group-hover:ui-bg-background-color-900 ui-bg-white-900 ui-pl-[12px]"
              v-if="canScrollLeft && items.length"
            >
            </th>
          </tr>
        </thead>
        <tbody
          class="m-table__body ui-relative"
        >
          <tr
            v-if="!items.length"
            class="m-table__row ui-group"
          >
            <td
              class="m-table__row-no-data-text ui-text-base ui-font-semibold ui-py-[14px] ui-text-black-900 ui-text-left"
              :colspan="headers.length"
            >
              <div
                class="ui-sticky ui-left-0 ui-text-center"
                :style="{
                  width: tableWidth - 2 + 'px',
                }"
              >
                <slot
                  name="text-no-data"
                >
                  {{props.textNoData}}
                </slot>
              </div>
            </td>
          </tr>
          <transition-group
            name="list"
          >
            <template 
              v-for="(item, index) in items"
              :key="(item[props.draggableKey] as number | string) || index"
            >
              <tr
                class="m-table__row ui-transition-[background-color] ui-duration-300 ui-ease"
                :class="{
                  'm-table__row-hide-details': showDetails[index],
                  'ui-bg-background-color-900': (props.canDnD && itemCurrentlyDragging && itemCurrentlyDragging[props.draggableKey] === item[props.draggableKey]) || index === isOpenIndex,
                  'ui-group hover:ui-bg-background-color-900': !props.canDnD || !itemCurrentlyDragging,
                  'ui-border-b-[1px] ui-border-black-50': props.borderRows && !showDetails[index],
                  'ui-bg-primary-100': isChecked(item),
                  'ui-cursor-pointer': props.cursorPointerRows,
                  'ui-cursor-move': props.canDnD,
                }"
                :draggable="props.canDnD"
                @click="emits('clickRow', item, $event)"
                @mousedown="onMouseDown(item, $event)"
                @contextmenu.prevent="onContextMenu($event, index, !!$slots['row-context-menu'])"
                @transitionstart.prevent="transitionStart"
                @transitionend="transitionEnd"
                @dragover.prevent.stop="onDragOver($event, item)"
                @dragstart.stop="onDragStart($event, item)"
                @dragend.stop="onDragEnd"
                @dragenter.prevent
              >
                <td
                  v-if="props.canSelect"
                  class="m-table__check-box ui-pl-[8px] ui-pr-[14px] ui-sticky ui-py-[14px] ui-left-0 ui-bg-white-900"
                  @click.stop
                > 
                  <div
                    class="ui-z-[-1] ui-w-full ui-h-full ui-absolute ui-top-0 group-hover:ui-bg-background-color-900 ui-left-0 ui-transition ui-ease ui-duration-300"
                    :class="{
                      'ui-bg-primary-100': isChecked(item),
                      'ui-bg-background-color-900': (props.canDnD && itemCurrentlyDragging && itemCurrentlyDragging[props.draggableKey] === item[props.draggableKey]) || index === isOpenIndex,
                    }"
                  />
                  <m-checkbox
                    :value="item"
                    v-model="selectedItem"
                    :checked-key="props.checkedKey"
                    :id="String(item[props.checkedKey])"
                  />
                </td>
                <td
                  v-for="({value}) in headers"
                  :key="value"
                  class="m-table__row-item ui-text-base ui-text-black-900 ui-text-left ui-py-[14px] ui-pr-[12px] first:ui-pl-[12px]"
                  :class="[`m-table__row-item-${value}`]"
                >
                  <slot
                    :name="`rows-${value}`"
                    v-bind="({
                      item: item[value],
                      countRow: index,
                      rowItem: item,
                    })"
                  >
                    <div
                      :style="{
                        marginBottom: props.gapRows,
                        marginTop: props.gapRows,
                      }"
                    >
                      {{ item[value] }}
                    </div>
                  </slot>
                </td>
                <td
                  class="ui-py-[14px] ui-pr-[14px]"
                  v-if="$slots['row-show-details']"
                >
                  <slot
                    name="row-show-details"
                    v-bind="{
                      item: item,
                      showDetails: showDetails[index],
                      toggleDetails: () => toggleDetails(index),
                      countRow: index,
                    }"
                  />

                </td>
                <td
                  @click.stop
                  class="m-table__row-append-icon ui-py-[14px] ui-pr-[12px]"
                  v-if="$slots['row-append-icon']"
                >
                  <slot
                    name="row-append-icon"
                    v-bind="({
                      ...item
                    })"
                  />
                </td>
                <td
                  @click.stop
                  class="m-table__row-scroll-btn  ui-right-0 ui-py-[14px] ui-pr-[14px] ui-sticky ui-left-0  ui-bg-white-900 ui-pl-[12px] ui-transition"
                  v-if="canScrollLeft"
                >
                  <div
                    class="ui-z-[-1] ui-w-full ui-h-full ui-absolute  ui-top-0 group-hover:ui-bg-background-color-900 ui-left-0 ui-transition ui-ease ui-duration-300"
                    :class="{
                      'ui-bg-primary-100': isChecked(item),
                      'ui-bg-background-color-900': (props.canDnD && itemCurrentlyDragging && itemCurrentlyDragging[props.draggableKey] === item[props.draggableKey]) || index === isOpenIndex,
                    }"
                  />
                  <chewron-right-icon
                    @click="scrollTableRight"
                    class="ui-cursor-pointer ui-self-center"
                    width="24px"
                    height="24px"
                    fill="#9A9FA5"
                  />
                </td>
                <slot
                  name="row"
                  v-bind="({
                    countRow: index,
                    item: item,  
                  })"
                />
                <div
                  v-if="$slots['row-context-menu']"
                >
                  <m-context-menu
                    :is-open="index === isOpenIndex"
                    @update:is-open="!$event ? (isOpenIndex = null) : {}"
                    :position-x="contextMenuPosition.x" 
                    :position-y="contextMenuPosition.y"
                  >
                    <slot
                      :name="`row-context-menu`"
                      v-bind="({
                        item: item
                      })"
                    />
                  </m-context-menu>
                </div>
              </tr>
              <tr
                v-if="$slots['row-details'] && showDetails[index]"
                class="row-details ui-border-b-[1px] ui-border-black-50"
              >
                <td
                  v-if="props.canSelect"
                  class="m-table__check-box ui-pl-[8px] ui-pr-[14px] ui-sticky ui-py-[14px] ui-left-0 ui-bg-white-900"
                  @click.stop
                > 
                  <div
                    class="ui-z-[-1] ui-w-full ui-h-full ui-absolute  ui-top-0 group-hover:ui-bg-background-color-900 ui-left-0 ui-transition ui-ease ui-duration-300"
                    :class="{
                      'ui-bg-primary-100': isChecked(item),
                      'ui-bg-background-color-900': props.canDnD && itemCurrentlyDragging && itemCurrentlyDragging[props.draggableKey] === item[props.draggableKey],
                    }"
                  />
                </td>
                <td
                  :colspan="props.headers.length + 1"
                  class="ui-py-[12px]"
                >
                  <div
                    class="row-details-card ui-rounded-base ui-bg-background-color-900 ui-p-[12px]"
                  >
                    <slot
                      name="row-details"
                      v-bind="({
                        countRow: index,
                        item: item,  
                      })"
                    />
                  </div>
                </td>
              </tr>
            </template>
          </transition-group>
        </tbody>
      </table>
    </div>

  </div>
  <div 
    class="m-table__footer ui-mt-[24px]"
    v-if="props.visibilityPagination || props.visibilityPerItems || props.visibilityNumberViews"  
  >
    <div
      v-if="props.visibilityPagination || props.visibilityPerItems"  
      class="ui-flex ui-justify-between ui-flex-wrap -ui-m-[6px] ui-w-[calc(100%_+_6px)] ui-mb-[15px]"
    >
      <m-pagination
        class="m-table__footer-pagination ui-m-[6px]"
        v-if="props.visibilityPagination"
        v-model="page"
        with-search
        :disable="props.loading"
        :page-count="pageCount"
      />
      <number-shown-field
        v-if="props.visibilityPerItems"
        class="m-table__footer-number-shown ui-m-[0px]"
        v-model="perPage"
        :items="perPageItems"
      />
      <div
        v-else-if="props.visibilityNumberViews"
        class="m-table__footer-count-text ui-flex ui-items-center ui-m-[6px]"
      >
        <slot name="number-views">
          <span class="ui-text-sm ui-text-black-500 ui-m-[6px]">
            {{page * perPage}} товаров из {{ pageCount * perPage}}
          </span>
        </slot>
      </div>
    </div>
    <template v-if="props.visibilityButtonMore">
      <m-button
        outline
        color="black"
        brightness="50"
        block
        class="m-table__footer-button-more ui-h-[48px] ui-m-[6px]"
        @click="emits('loadMore')"
      >
        Показать еще
      </m-button>
    </template>
  </div>
</template>

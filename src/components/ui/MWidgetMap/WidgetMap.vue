<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { throttle } from '../../../assets/utils/utils'
import type { CdekType } from './type'
import CurrentBlock from './CurrentBlock.vue'
import HeaderBlock from './HeaderBlock.vue'
import MapBlock from './MapBlock.vue'
import ListBlock from './ListBlock.vue'
import Dialog from './Dialog.vue'
import MButton from '../MButton'
import BalloonBottomSheet from './BalloonBottomSheet.vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  urlFetchList: {
    type: String,
    reqired: true,
  },
  urlShowList: {
    type: String,
    reqired: true,
  },
  cityTitle: {
    type: String,
    required: true,
  },
  countryAlpha2: {
    type: String,
    default: 'ru',
  },
  perPage: {
    type: [Number, String],
    default: 5,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  isReadonly: Boolean,
  onlyDialog: Boolean,
})

const emits = defineEmits(['update:modelValue', 'change', 'errorRequest'])

const currentValue = ref(props.modelValue)
const cdekList = ref<CdekType[]>([])
const isMap = ref(true)
const isOpen = ref(false)
const isOpenBallon = ref(false)
const isDialog = ref<boolean>((window && window.innerWidth > 768) || true)
const lazyLoad = ref(false)
const errorRequest = ref(false)
const cheakBallonData = ref<CdekType>({} as CdekType)

const wrap = ref<HTMLElement|null>(null)

const openBottomSheet = (cdek: CdekType) => {
  cheakBallonData.value = cdek

  isOpenBallon.value = true
}

const currentCdek = computed(() => {
  return cdekList.value.find(el => el.code === currentValue.value) || {} as CdekType
})

const fetchList = async() => {
  await fetch(`${props.urlFetchList}?kladr_code=${props.cityTitle}&alpha2=${props.countryAlpha2}`, {
    method: 'get',
  })
    .then((data) => {
      return data.json()
    })
    .then(({ data }) => {
      cdekList.value = data
    })
}

const debounce = computed(() => {
  return throttle(() => {
    isDialog.value = window.innerWidth > 768
    isOpenBallon.value = isOpenBallon.value && !isDialog.value
  }, 250)
})

const selectValue = (value: string) => {
  currentValue.value = value
  reset()
}

const scrollToTopBlock = () => {
  if (wrap.value && wrap.value.getBoundingClientRect().top < 0) {
    let currentScrollTop = window.scrollY - Math.abs(wrap.value.getBoundingClientRect().top)
    const header = document.getElementById('header')

    if (header && parseInt(window.getComputedStyle(header).top) === 0) {
      currentScrollTop -= header.clientHeight
    }

    window.scrollTo({
      top: currentScrollTop,
      behavior: 'smooth',
    })
  }
}

const open = () => {
  isDialog.value = window.innerWidth > 768
  isOpen.value = true
}

const updateValue = (value: string) => {
  currentValue.value = value
}

const reset = () => {
  isOpen.value = false
  isMap.value = true
  isOpenBallon.value = false
  cheakBallonData.value = {} as CdekType
}

const getPvz = async(): Promise<void> => {
  if (props.urlShowList) {
    await fetch(props.urlShowList, {
      method: 'get',
    })
      .then((data) => {
        return data.json()
      })
      .then(({ data }) => {
        cdekList.value.push(data)
      })
  }
}

watch(() => props.modelValue, (newValue) => {
  currentValue.value = newValue || ''
  reset()
})

watch(currentValue, (newValue) => {
  emits('update:modelValue', newValue)
  newValue && emits('change', cdekList.value.find(el => el.code === newValue))
  newValue && scrollToTopBlock()
  reset()
})

watch(() => props.cityTitle, (newValue, oldValue) => {
  fetchList()

  if (oldValue) {
    reset()
  }
})

onMounted(async() => {
  await fetchList()

  if (props.modelValue && !cdekList.value.find(el => el.code === props.modelValue)) {
    getPvz()
  }

  lazyLoad.value = true
})
</script>

<template>
  <div>
    <div
      v-if="lazyLoad && !errorRequest"
      ref="wrap"
      class="block-wrap"
    >
      <template
        v-if="cdekList.length < 1"
      >
        <div>
          <div
            class="no-pvz-message ui-text-red-500 ui-text-p16"
          >
            В выбранном городе нет пунктов выдачи заказов
          </div>
          <m-button
            @click="open"
          >
            Выбрать пункт выдачи
          </m-button>
          <!-- </slot> -->
        </div>
      </template>
      <template
        v-else
      >
        <template
          v-if="currentValue && !isOpen"
        >
          <div>
            <current-block
              :current-value="currentCdek"
              :is-readonly="isReadonly"
              @selectOther="open"
            />
          </div>
        </template>
        <template
          v-if="!isOpen && !currentValue && !isReadonly"
        >
          <div
            class="block__activator"
          >
            <slot
              name="activator"
              v-bind="({
                on: {
                  click: open,
                }
              })"
            >
              <m-button
                @click="open"
              >
                Выбрать пункт выдачи
              </m-button>
            </slot>
          </div>
        </template>
        <template
          v-if="isOpen"
        >
          <div
            class="max-768px:ui-block ui-hidden"
          >
            <div>
              <header-block
                v-model:is-map="isMap"
              />
            </div>
            <template
              v-if="isMap"
            >
              <div>
                <map-block
                  v-model="currentValue"
                  class="map"
                  :cdek-list="cdekList"
                  :open-balloon="false"
                  @input="selectValue"
                  @click-balloon="openBottomSheet"
                />
              </div>
            </template>
            <template
              v-else
            >
              <div
                class="list-wrap"
              >
                <list-block
                  v-model="currentValue"
                  class="list"
                  :cdek-list="cdekList"
                />
              </div>
            </template>
          </div>
        </template>
      </template>
      <div
        v-resize="debounce"
      >
        <Dialog
          v-if="isDialog"
          v-model="isOpen"
          :cdek-list="cdekList"
          :current-value-props="currentValue"
          :update-value-function="(item: string) => {
            updateValue(item)
          }"
        />
      </div>
    </div>
    <balloon-bottom-sheet
      v-model:is-open="isOpenBallon"
      :cdek="cheakBallonData"
      @select-code="selectValue"
    />
  </div>
</template>

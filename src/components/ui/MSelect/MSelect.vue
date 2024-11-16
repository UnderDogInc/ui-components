<script setup lang="ts">
import { defineProps, ref, defineEmits, watch, computed, useSlots, useAttrs } from 'vue'
import type { PropType, Ref } from 'vue'
import lodashDebounce from 'lodash/debounce'

import { IItems } from '../MList/type'
import './MSelect.scss'

import MInput from '@/components/ui/MInput/MInput.vue'
import MList from '../MList/MList.vue'
import MChip from '../MChip/MChip.vue'
import HOCFormError from '@/components/HOC/FormError/FormError.vue'
import ChewronDownIcon from '@/components/icon/ChewronDownIcon.vue'
import MLayoutMenu from '../MLayoutMenu/MLayoutMenu.vue'
import MBottomSheet from '../MBottomSheet/MBottomSheet.vue'
import MButton from '../MButton/MButton.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<IItems> || Array as PropType<Array<IItems>>,
    required: true,
  },
  items: {
    type: Array as PropType<Array<IItems>>,
    default: () => [],
  },
  keyTitle: {
    type: String,
    default: 'title',
  },
  keyValue: {
    type: String,
    default: 'value',
  },
  errorMessage: String,
  namesNextSlots: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
  maxHeightList: {
    type: String,
    default: '312px',
  },
  maxWidthList: {
    type: String,
    default: 'auto',
  },
  multiple: Boolean,
  joinSymbol: {
    type: String,
    default: ', ',
  },
  bottomSheetTitle: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  chips: Boolean,
  clearable: Boolean,
  isOpen: Boolean,
  isDisabled: Boolean,
  isReadonly: Boolean,
  error: Boolean,
  infiniteScroll: Boolean,
  mobileBottomSheet: Boolean,
})

const emits = defineEmits(['update:modelValue', 'update:isOpen', 'infinite'])
const slots = useSlots()

const isOpen = ref(props.isOpen)
const isOpenList: Ref<boolean>  = ref(false)
const isOpenNextList: Ref<boolean>  = ref(false)

const modelValue = computed(() => {
  if (props.multiple && !props.chips) {
    const newTitle: Array<string> = []

    if (Array.isArray(props.modelValue)) {
      props.modelValue.forEach((el: IItems) => newTitle.push(el[props.keyTitle] || ''))
    }

    return newTitle.join(props.joinSymbol)
  }
  else if (props.chips) {
    return Array.isArray(props.modelValue) && props.modelValue.length > 0
      ? ' '
      : ''
  }


  return props.modelValue[props.keyTitle]
})

const hidenList = () => {
  isOpenList.value = false
  isOpenNextList.value = false
}

const opentNextList = () => {
  isOpenNextList.value = true
}

const deleteChip = (item: IItems) => {
  Array.isArray(props.modelValue) && emits('update:modelValue', props.modelValue.filter(el => el[props.keyValue] !== item[props.keyValue]))
}

const clearableEvent = () => {
  const newValue = Array.isArray(props.modelValue)
    ? []
    : {
      [props.keyTitle]: '',
      [props.keyValue]: '',
    }

  emits('update:modelValue', newValue)
}

watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue
})

watch(isOpen, (newValue) => {
  emits('update:isOpen', newValue)
})

watch(() => props.modelValue, () => {
  if(!props.multiple) {
    isOpen.value = false
    hidenList()
  }
})

const propsFromMenu = computed(() => {
  const propsNew: {
    [key in string]: any
  } = {}

  for (const key in MLayoutMenu.props) {
    propsNew[key] = useAttrs()[key]
  }

  return propsNew
})

const isMobile = ref(window.innerWidth <= 1198)

const debounce = computed(() => {
  return lodashDebounce(resize, 250)
})

const resize = (): void => {
  isMobile.value = window.innerWidth <= 1198 && props.mobileBottomSheet
}

const mobileListSelect = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  mobileListSelect.value = newValue
})
</script>

<template>
  <m-layout-menu
    v-bind="({
      ...$attrs
    })"
    v-resize="debounce"
    :nudge-bottom="propsFromMenu.nudgeBottom || 12"
    min-width="auto"
    v-model:is-open="isOpen"
    :maxHeight="props.maxHeightList"
    :max-width="maxWidthList"
    :close-on-click="!props.multiple && propsFromMenu.closeOnClick"
    offset-y
    :disabled="props.isDisabled || props.isReadonly"
    :class="{
      '!ui-pointer-events-none': props.isDisabled,
    }"
  >
    <template #activator="{attrs, on}">
      <HOCFormError :error-message="props.errorMessage">
        <slot
          name="activator"
          v-bind="({
            currentValue: props.modelValue,
            attrs,
            on,
          })"
        >
          <div
            v-bind="attrs"
            v-on="!props.isDisabled ? on : {}"
          >
            <m-input
              class="m-select__input"
              :class="[
                {
                  'm-select__input-active': isOpenList,
                  'm-select__input-chips': props.chips && Array.isArray(props.modelValue) && props.modelValue.length,
                  'm-select__input-error': props.errorMessage || props.error,
                  'm-select__input-readonly': props.isReadonly,
                },
              ]"
              :is-disabled="props.isDisabled"
              :modelValue="modelValue"
              :clearable="props.clearable"
              :is-readonly="props.isReadonly"
              :placeholder="placeholder"
              is-readonly-input
              @clearable="() => {
                clearableEvent()
              }"
            >
              <template
                v-if="slots['label']"
                #default
              >
                <slot name="label" />
              </template>
              <template
                v-if="props.chips"
                #chips
              >
                <m-chip
                  class="ui-m-[4px]"
                  v-for="(item, index) in props.modelValue"
                  :title="item[props.keyTitle]"
                  :key="index"
                  max-height="24px"
                  :can-deleted="!props.isReadonly"
                  @on-delete="deleteChip(item)"
                />
              </template>
              <template
                v-if="!props.isReadonly"
                #append-icon
              >
                <chewron-down-icon
                  class="m-select__input-chevron"
                  width="24px"
                  height="24px"
                  fill="#1A1D1F"
                />
              </template>
            </m-input>
          </div>
        </slot>
      </HOCFormError>
    </template>
    <component
      :is="isMobile ? MBottomSheet : 'div'"
      v-model="isOpen"
      :title="props.bottomSheetTitle"
      :attach="false"
      :class="{
        'bottom-sheet-select': isMobile
      }"
    >
      <slot
        v-bind="({
          isMobile: isMobile,
          attach: {
            class: `${isMobile ? 'list-bottom-sheet': ''}`,
          },
        })"
      >
        <m-list
          @update:model-value="isMobile && props.multiple? mobileListSelect = $event : emits('update:modelValue', $event)"
          :model-value="isMobile && props.multiple ? mobileListSelect : props.modelValue"
          :items="props.items"
          :multiple="props.multiple"
          :active-key="props.keyValue"
          :text-key="props.keyTitle"
          :infinite-scroll="props.infiniteScroll"
          class="ui-overflow-y-auto ui-scroll-y"
          :class="{
            'list-bottom-sheet': isMobile,
          }"
          @infinite="emits('infinite', $event)"
        >
          <template #item="props">
            <slot
              name="item"
              v-bind="props"
            />
          </template>
          <template
            v-if="slots['actions']"
            #actions
          >
            <slot
              name="actions"
              v-bind="({
                on: {
                  click: opentNextList,
                }
              })"
            />
          </template>
        </m-list>
      </slot>
      <template #footer>
        <div
          v-if="props.multiple"
          class="ui-flex-wrap ui-flex -ui-m-[4px]"
        >
          <m-button
            class="ui-grow ui-m-[4px]"
            @click="emits('update:modelValue', mobileListSelect); isOpen = false"
          >
            Выбрать
          </m-button>
          <m-button
            @click="mobileListSelect = props.multiple ? [] : { [props.keyTitle]: '', [props.keyValue]: ''}"
            class="ui-grow ui-m-[4px]"
            outline
            color="black"
            brightness="50"
          >
            Очистить
          </m-button>
        </div>
      </template>
    </component>
  </m-layout-menu>
</template>


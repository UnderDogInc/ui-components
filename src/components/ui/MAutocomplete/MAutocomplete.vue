<script setup lang="ts">
import lodashDebounce from 'lodash/debounce'
import MLayoutMenu from '../MLayoutMenu/MLayoutMenu.vue'
import MInput from '../MInput/MInput.vue'
import MChip from '../MChip/MChip.vue'
import ChewronDownIcon from '../../icon/ChewronDownIcon.vue'
import MList from '../MList/MList.vue'
import { PropType, watch, ref, computed } from 'vue'
import { IItems } from '../MList/type'
import './MAutocomplete.scss'
import MBottomSheet from '../MBottomSheet'
import MButton from '../MButton'
import SearchIcon from '../../icon/SearchIcon.vue'

const props = defineProps({
  modelValue: {
    type: [Object, Array] as PropType<IItems|IItems[]>,
    required: true,
  },
  items: {
    type: Array as PropType<IItems[]>,
    required: false,
  },
  maxHeight: {
    type: String,
    default: '300',
  },
  activeKey: {
    type: String,
    default: 'title',
  },
  noDataText: {
    type: String,
    default: '',
  },
  textKey: {
    type: String,
    default: 'title',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  maxWidthList: {
    type: String,
    default: 'auto',
  },
  bottomSheetTitle: {
    type: String,
    default: '',
  },
  mobileBottomSheet: {
    type: Boolean,
    default: true,
  },
  multiple: Boolean,
  disabled: Boolean,
  infiniteScroll: Boolean,
  isReadonly: Boolean,
  clearable: Boolean,
  error: Boolean,
})
const emits = defineEmits(['update:modelValue', 'input', 'infinite', 'clearable', 'close'])

const isOpen = ref(false)
const valueText = ref(typeof props.modelValue === 'object'
  ? !Array.isArray(props.modelValue)
    ? props.modelValue[props.textKey] 
    : ''
  : String(props.modelValue)
)


const isMobile = ref(window.innerWidth <= 1198)

const debounce = computed(() => {
  return lodashDebounce(resize, 250)
})

const resize = (): void => {
  isMobile.value = window.innerWidth <= 1198 && props.mobileBottomSheet
}

const SelectValueInList = (event: IItems) => {
  if (props.multiple) {
    valueText.value = ''
  }
  else {
    valueText.value = event[props.textKey]
  }

  if (!props.multiple) {
    isOpen.value = false
  }

  emits('update:modelValue', event)
}

const oldSelect = () => {
  if (props.multiple) {
    valueText.value = ''
  }
  else {
    valueText.value = typeof props.modelValue === 'object'
      ? !Array.isArray(props.modelValue)
        ? props.modelValue[props.textKey] 
        : ''
      : String(props.modelValue)
  }
}

const deleteChip = (event: string) => {
  if (Array.isArray(props.modelValue)) {  
    emits('update:modelValue', props.modelValue.filter(el => el[props.activeKey] !== event))
  }
}

const mobilevalueText = ref('')

const mobileListSelect = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  mobileListSelect.value = newValue
})

watch(() => props.modelValue, (newValue) => {
  valueText.value = typeof newValue === 'object'
    ? !Array.isArray(newValue)
      ? newValue[props.textKey] 
      : ''
    : String(newValue)
})

watch(isOpen, (newValue) => {
  if (!newValue) {
    mobilevalueText.value = ''
    emits('close')
  }
})
</script>

<template>
  <div>
    <m-layout-menu
      @close-menu="oldSelect"
      :close-on-click="false"
      v-model:is-open="isOpen"
      v-resize="debounce"
      nudge-bottom="12px"
      class="autocomplete"
      offset-y
      :disabled="props.disabled || props.isReadonly"
      :max-height="props.maxHeight"
      :max-width="maxWidthList"
    >
      <template #activator="{open}">
        <m-input
          :is-disabled="props.disabled"
          :is-readonly="props.isReadonly || isMobile"
          v-model="valueText"
          :error-message="errorMessage"
          :error="error"
          :clearable="props.clearable"
          @clearable="emits('clearable', $event); emits('input')"
          @click="(!props.disabled && !props.isReadonly) && open()"
          @focus="(!props.disabled && !props.isReadonly) && open()"
          @input="emits('input', $event)"
          @click-input="(!props.disabled && !props.isReadonly) && (isOpen = true)"
          class="autocomplete__activator"
          :class="{
            'autocomplete__activator-multiple': props.multiple,
            'ui-cursor-default': props.disabled || props.isReadonly,
          }"
        >
          <!-- @blur="!isMobile && !props.multiple && (isOpen = false)" -->
          <template
            v-if="$slots['label']"
            #default
          >
            <slot
              name="label"
            />
          </template>

          <template
            v-if="props.multiple"
            #chips
          >
            <m-chip
              v-for="(chip, index) in props.modelValue"
              :key="index"
              :title="chip[props.textKey]"
              can-deleted
              class="ui-m-[4px]"
              @on-delete="deleteChip(chip[props.activeKey])"
            />
          </template>

          <template #append-icon="{isFocus}">
            <chewron-down-icon
              width="24px"
              height="24px"
              :fill="isFocus ? '#1A1D1F' :'#9A9FA5'"
            />
          </template>
        </m-input>
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
        <div
          v-if="isMobile" 
          class="ui-pb-[24px] ui-sticky ui-top-0 ui-bg-white-900"
        >
          <m-input
            @input="emits('input', $event)"
            v-model="mobilevalueText"
            @clearable="emits('clearable', $event); emits('input')"
            clearable
          >
            <template #append-icon>
              <search-icon />
            </template>
          </m-input>
        </div>
        <slot
          v-bind="({
            isMobile: isMobile,
            attach: {
              class: `${isMobile ? 'list-bottom-sheet': ''}`,
            },
          })"
        >
          <m-list
            @update:model-value="isMobile && props.multiple? mobileListSelect = $event : SelectValueInList($event)"
            :model-value="isMobile && props.multiple ? mobileListSelect : props.modelValue"
            class="ui-w-full autocomplete__list"
            :active-key="props.activeKey"
            :text-key="props.textKey"
            :no-items-text="props.noDataText"
            :items="props.items"
            :multiple="props.multiple"
            :infinite-scroll="props.infiniteScroll"
            :class="{
              'list-bottom-sheet': isMobile,
            }"
            @infinite="emits('infinite', $event)"
          />
        </slot>

        <template
          v-if="props.multiple"
          #footer
        >
          <div
            class="ui-flex-wrap ui-flex -ui-m-[4px]"
          >
            <m-button
              class="ui-grow ui-m-[4px]"
              @click="SelectValueInList(mobileListSelect); isOpen = false"
            >
              Выбрать
            </m-button>
            <m-button
              @click="mobileListSelect = []"
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
  </div>
</template>

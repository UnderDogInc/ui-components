<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import type { PropType, Ref } from 'vue'

import { ISearchItem } from './type'
import './MSearch.scss'

import MInput from '../MInput'
import MSelect from '@/components/ui/MSelect/MSelect.vue'
import ChewronDownIcon from '@/components/icon/ChewronDownIcon.vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  searchItems: {
    type: Array as PropType<Array<ISearchItem>>,
    default: undefined,
  },
  currentSearchItem: {
    type: Object as PropType<ISearchItem>,
  },
  paddingY: {
    type: String,
    default: '8px',
  },
  paddingX: {
    type: String,
    default: '12px',
  },
  height: {
    type: String,
    default: '40px',
  },
  placeholder: {
    type: String,
    default: 'Введите данные',
  },
  clearable: Boolean,
  dropAnswer: Boolean,
})

const emits = defineEmits(['update:modelValue', 'update:currentSearchItem'])

const searchType: Ref<HTMLDivElement|null> = ref(null)

</script>

<template>
  <div class="search">
    <m-input
      class="search__input"
      :model-value="props.modelValue"
      :paddingX="props.paddingX"
      :paddingY="props.paddingY"
      :clearable="props.clearable"
      :height="props.height"
      :placeholder="props.placeholder"
      :prependIconOptions="({
        border: false,
        bgColor: false,
      })"
      @update:model-value="emits('update:modelValue', $event)"
    >
      <template #prepend-icon>
        <m-select
          v-if="props.searchItems"
          :model-value="props.currentSearchItem"
          @update:model-value="emits('update:currentSearchItem', $event)"
          :items="props.searchItems"
          nudge-bottom="12"
          closeOnClick
        >
          <template #activator="{ currentValue, on }">
            <div
              v-on="on"
              class="search__activator ui-bg-black-50 ui-ml-[4px] ui-flex ui-px-[8px] ui-py-[4px] ui-rounded-[8px]"
              ref="searchType"
            >
              <div
                class="ui-text-base ui-flex ui-items-center ui-text-black-900 ui-mr-[4px] ui-w-[max-content] ui-font-semibold"
              >
                {{currentValue.title }} 
              </div>
              <div>
                <chewron-down-icon
                  width="24px"
                  height="24px"
                  fill="#1A1D1F"
                />
              </div>
            </div>
          </template>
        </m-select>
      </template>
      <template
        v-if="props.dropAnswer"  
        #append-icon
      >
        <chewron-down-icon
          width="24px"
          height="24px"
          fill="#1A1D1F"
        />
      </template>
    </m-input>
  </div>
</template>
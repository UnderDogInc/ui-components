<script setup lang="ts">
import { useSlots, defineEmits, defineProps } from 'vue'
import type { PropType } from 'vue'

import { IItems } from './type'
import './MList.scss'

import MListItemDefault from './MListItemDefault.vue'
import MCheckbox from '../MCheckbox/MCheckbox.vue'
import MInfiniteLoading from '../MInfiniteLoading/MInfiniteLoading.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<IItems> || Array as PropType<Array<IItems>>,
    default: () => ({
      title: '',
      value: '',
    }),
  },
  items: {
    type: Array as PropType<Array<IItems>>,
    default:() => [],
  },
  activeKey: {
    type: String,
    default: 'value',
  },
  textKey: {
    type: String,
    default: 'title',
  },
  noItemsText: {
    type: String,
    default: '',
  },
  multiple: Boolean,
  infiniteScroll: Boolean,
})

const emits = defineEmits(['update:modelValue', 'infinite'])
const slots = useSlots()

const selectedValue = (item: IItems) => {
  if (item.isDisabled) {
    return
  }

  if (props.multiple) {
    if (Array.isArray(props.modelValue)) {
      if (isActive(item)) {
        emits('update:modelValue', props.modelValue.filter(el => el[props.activeKey] !== item[props.activeKey]))

        return
      }

      emits('update:modelValue', [...props.modelValue, item])

      return
    }
  }

  emits('update:modelValue', item)
}

const isActive = (item: IItems): boolean => {

  if (Array.isArray(props.modelValue)) {
    return Boolean(props.modelValue.find(el => el[props.activeKey] === item[props.activeKey]))
  }

  if (Array.isArray(item.value)) {
    return props.modelValue[props.activeKey].includes(item[props.activeKey])
  }

  return props.modelValue[props.activeKey] === item[props.activeKey]
}

</script>

<template>
  <div
    v-bind="$attrs"
    class="m-list--wrap ui-bg-white-900 ui-p-3 ui-rounded-base"
  >
    <div
      class="scroll-y ui-overflow-y-auto ui-pr-[5px] "
    >
      <div
        v-for="(item, index) in props.items"
        :key="index"
        class="m-list__body"
        @click.prevent="selectedValue(item)"
      >
        <slot
          name="item"
          v-bind="({
            item: item,
            isActive: isActive(item),
            isDisabled: !!item.isDisabled,
          })"
        >
          <m-list-item-default
            :active="isActive(item)"
            :is-disabled="!!item.isDisabled"
            :multiple="props.multiple"
            class="ui-flex ui-items-center"
          >
            <div
              class="ui-flex ui-items-center"
              v-if="props.multiple"
            >
              <m-checkbox
                class="ui-mr-[8px]"
                :value="item"
                :id="`list-${item[props.activeKey]}-${index}`"
                :model-value="isActive(item)"
                :is-disabled="!!item.isDisabled"
              />
            </div>
            {{ item[props.textKey] }}
          </m-list-item-default>
        </slot>
      </div>
      <div
        v-if="!props.items.length && !slots['actions']"
        class="ui-text-base ui-font-semibold ui-mb-[4px] ui-p-3"
      >
        {{ props.noItemsText }}
      </div>
      <div
        v-if="slots['actions']"
        class="m-list__actions ui-border-t-black-50 ui-border-t ui-pt-[12px] ui-mt-[12px]"
      >
        <slot name="actions"/>
      </div>
      <m-infinite-loading
        v-if="infiniteScroll"
        class="ui-pt-[12px]"
        @infinite="emits('infinite', $event)"
      />
    </div>
  </div>
</template>

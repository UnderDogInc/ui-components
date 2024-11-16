<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import MInput from '../MInput'
import MChip from '../MChip'
import './MInputChips.scss'

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: Array,
  },
  isReadonly: Boolean,
})

const emits = defineEmits(['update:modelValue'])

const text = ref('')

const chips = computed(() => {
  return props.modelValue
})

const addChips = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()

  if (text.value) {
    emits('update:modelValue', [...props.modelValue, text.value])
    text.value = ''
  }
}

const deleteChip = (index: number) => {
  emits('update:modelValue', props.modelValue.filter((_, _index) => _index !== index))
}
</script>

<template>
  <m-input
    v-model="text"
    class="m-input-chips"
    :class="{
      'm-input-chips-whith-chips': props.modelValue.length
    }"
    :is-readonly="props.isReadonly"
    @keyup.enter="addChips"
    @blur="addChips"
  >
    <template #chips>
      <m-chip
        v-for="(chip, index) in chips"
        :key="index"
        class="ui-m-[4px]"
        :title="chip"
        :can-deleted="!props.isReadonly"
        @on-delete="deleteChip(index)"
      />
    </template>
  </m-input>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, computed, nextTick, PropType } from 'vue'
import './MCheckbox.scss'

export type TypeCheckbox = 'standart' | 'switches'

const props = defineProps({
  value: { 
    type: [String, Object, Boolean, Number] as PropType<string|{[key in string]: any}|boolean|number>,
    required: true,
  },
  modelValue: {
    type: [Array, Boolean] as PropType<Array<{[key in string]: any}|any>|boolean>,
    default: undefined,
  },
  checkedKey: {
    type: String,
    default: undefined,
  },
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String as PropType<TypeCheckbox>,
    default: 'standart',
  },
  checked: Boolean,
  isDisabled: Boolean,
  isReadonly: Boolean,
})

const allCheked = ref<string|{[key in string]: any}|boolean|number>(props.modelValue || false)

const emits = defineEmits(['update:modelValue'])

const checkboxState = computed(() => { 
  if (Array.isArray(props.modelValue)) {
    if (typeof props.value === 'object') {
      const key = props.checkedKey
        ? props.checkedKey
        : Object.keys(props.value)[0]

      const value = props.value
      

      return !!props.modelValue.find(el => el[key] === value[key])
    }

    return props.modelValue.indexOf(props.value) !== -1
  } 

  return props.modelValue || Boolean(allCheked.value)
})

const typeClasses = computed(() => {
  return {
    label: `m-checkox-${props.type}__lable`,
    checkbox: `m-checkox-${props.type}`,
  }
})

const classes = computed(() => {
  return {
    'active': checkboxState.value,
  }
})

const toggle = () => {
  if (props.isDisabled || props.isReadonly) {
    return
  }

  let v = props.modelValue
  
  if (Array.isArray(v)) {
    let i = v.indexOf(props.value)

    
    if (typeof props.value === 'object') {
      const key = props.checkedKey
        ? props.checkedKey
        : Object.keys(props.value)[0]

      const value = props.value

      v.find((el, index) => {
        if (el[key] === value[key]) {
          i = index
        }

        return el[key] === value[key]
      })
    }

    if (i === -1) {
      v.push(props.value)
    }
    else {
      v.splice(i, 1)
    }
  } 
  else {
    v = !v
  }

  allCheked.value = v
  emits('update:modelValue', v, props.value)
}

watch(() => props.modelValue, (newValue) => {
  nextTick(() => {
    allCheked.value = newValue || false
  })
})

watch(() => props.checked, () => {
  if (allCheked.value !== checkboxState.value) {
    toggle()
  }
})
</script>

<template>
  <div>
    <input
      class="m-checkox"
      :class="[
        {
          ...classes,
        },
        typeClasses.checkbox,
      ]"
      type="checkbox"
      :id="id"
      :value="props.value"
      :disabled="props.isDisabled || props.isReadonly"
      :checked="checkboxState"
    >
    <label
      v-bind="$attrs"
      @click="toggle"
      :for="id"
      class="m-checkox__lable ui-font-medium ui-text-base"
      :class="[
        typeClasses.label,
      ]"
    >
      <div
        class="content"
        :class="
          {
            '!ui-cursor-default': props.isDisabled || props.isReadonly,
          }"
      />
      <slot />
    </label>
  </div>
</template>

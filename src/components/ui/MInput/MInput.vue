<script setup lang="ts">
import { defineProps, defineEmits, computed, useSlots, ref, watch } from 'vue'
import type { Ref, PropType } from 'vue'

import { IOptionsIcon } from './type'
import './MInput.scss'

import HOCFormError from '@/components/HOC/FormError/FormError.vue'
import DeleteIcon from '@/components/icon/DeleteIcon.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  prependIconOptions: {
    type: Object as PropType<IOptionsIcon>,
    default: () => ({
      border: true,
      bgColor: false,
    }),
  },
  appendIconOptions: {
    type: Object as PropType<IOptionsIcon>,
    default: () => ({
      border: true,
      bgColor: false,
    }),
  },
  type: {
    type: String,
    default: 'text',
  },
  size: {
    type: [String, Number],
    default: 20,
  },
  step: {
    type: [String, Number],
    default: 1,
  },
  onlyNumber: Boolean,
  error: Boolean,
  placeholder: String,
  errorMessage: String,
  isDisabled: Boolean,
  isReadonly: Boolean,
  isReadonlyInput: Boolean,
  clearable: Boolean,
})


const slots = useSlots()

const emits = defineEmits(['update:modelValue', 'clickInput', 'clearable', 'focus', 'blur'])
const input: Ref<HTMLInputElement|null> = ref(null)
const isFocus: Ref<boolean> = ref(false)

const paddingX = computed(() => {
  return `ui-pr-[${
    slots['append-icon'] || props.clearable
      ? '0px'
      : '12px'
  }] ui-pl-[${
    slots['prepend-icon']
      ? '0px'
      : '12px'
  }]`
})

const classPrependIcon = computed(() => {
  return {
    'ui-border-r-2': props.prependIconOptions?.border,
  }
})

const classAppendIcon = computed(() => {
  return {
    'ui-border-l-2': props.appendIconOptions?.border,
  }
})

const classColor = computed(() => {
  const classes = {
    input: props.errorMessage || props.error
      ? 'after:ui-border-red-500'
      : isFocus.value
        ? 'after:ui-border-primary-500'
        : 'after:ui-border-black-50',
    prependIcon: props.errorMessage || props.error
      ? 'ui-border-red-500'
      : isFocus.value
        ? 'ui-border-primary-500'
        : 'ui-border-black-50',
    appendIcon: props.errorMessage || props.error
      ? 'ui-border-red-500'
      : isFocus.value
        ? 'ui-border-primary-500'
        : 'ui-border-black-50',
  }

  return classes
})

const classHover = computed(() => {
  const classes = {
    input: !props.isDisabled && !props.isReadonly
      ? props.errorMessage || props.error
        ? `red-hover`
        : `primary-hover`
      : '',
    prependIcon: !props.isDisabled && !props.isReadonly
      ? props.errorMessage || props.error
        ? `red-hover`
        : `primary-hover`
      : '',
    appendIcon: !props.isDisabled && !props.isReadonly
      ? props.errorMessage || props.error
        ? `red-hover`
        : `primary-hover`
      : '',
  }

  return classes
})

const focusEvent = (event: FocusEvent): void => {
  if (!props.isDisabled && !props.isReadonly) {
    isFocus.value = true
    emits('focus', event)
  }
}

const blurEvent = (event: FocusEvent): void => {
  if (!props.isDisabled && !props.isReadonly) {
    isFocus.value = false
    emits('blur', event)
  }
}

const clearableValue = (e: Event) => {
  e.stopPropagation()
  e.preventDefault()

  emits('update:modelValue', '')
  emits('clearable', e)
}

const updateModelValue = (event: Event) => {
  if (props.onlyNumber) {
    (event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.replace(/\D/g, '')
  }

  const eventTarget = (event.target as HTMLInputElement).value

  
  emits('update:modelValue', eventTarget)
}

const clickOnWrap = (e: MouseEvent) => {
  if (input.value) {
    input.value.focus()
    emits('clickInput', e)
  }
}

watch(() => props.modelValue, (newValue) => {
  if (input.value && props.onlyNumber) {
    input.value.value = String(newValue)
  }
})
</script>

<template>
  <div
    v-bind="$attrs"
    @click.prevent="clickOnWrap"
    ref="input"
  >
    <HOCFormError :error-message="props.errorMessage">
      <label
        class="m-input--wrap ui-group"
        :class="{
          '!ui-pointer-events-none': props.isDisabled,
        }"
      >
        <span
          v-if="slots['default']"
          class="label ui-font-semibold ui-text-p12-semibold"
        >
          <slot />
        </span>
        <div
          class="m-input ui-w-[100%] input__wrap ui-relative ui-flex ui-py-[12px] ui-items-center ui-rounded-base after:ui-absolute after:ui-rounded-base after:ui-border-2 after:ui-w-full after:ui-h-full after:ui-content-[''] after:ui-pointer-events-none after:ui-transition-[border-color] after:ui-duration-300 after:ui-ease"
          :class="[
            classColor.input,
            classHover.input,
            {
              'ui-bg-background-color-900': props.isDisabled,
              'ui-border-primary-500': isFocus,
            },
          ]"
        >
          <span
            v-if="slots['prepend-icon']"
            class="prepend-icon ui-pl-[6px] ui-pr-[4px] -ui-my-[10px] ui-mr-[12px] ui-self-stretch ui-flex ui-items-center ui-transition-[border-color] ui-duration-300 ui-ease"
            :class="[
              classPrependIcon,
              classColor.prependIcon,
              classHover.prependIcon,
            ]"
          >
            <div
              class="m-input__icon--wrap m-input__icon--wrap-prepend ui-p-[8px]"
              :class="{
                'ui-bg-black-50 ui-rounded-[8px]': props.prependIconOptions.bgColor
              }"
            >
              <slot
                name="prepend-icon"
                v-bind="({
                  isFocus: isFocus,
                  isError: !!props.errorMessage || props.error,
                })"
              />
            </div>
          </span>
          <div
            class="m-input__content ui-flex ui-flex-wrap ui-items-center ui-flex-[1] ui-min-w-[0px]"
            :class="[
              paddingX,
            ]"
          >
            <slot
              name="chips"
              v-if="slots['chips']"
            />
            <input
              :value="props.modelValue === undefined || props.modelValue === null ? '' : props.modelValue"
              :disabled="props.isDisabled"
              @input="updateModelValue"
              :placeholder="props.placeholder"
              @focus="focusEvent"
              @blur="blurEvent"
              :type="props.type"
              :readonly="props.isReadonly || props.isReadonlyInput"
              :step="props.step"
              class="ui-outline-0 ui-min-w-[0px] ui-flex-[1_1_auto] ui-max-w-full ui-h-[24px] ui-w-auto ui-flex ui-bg-[transparent]"
              :class="[
                {
                  'm-input__disable': props.isDisabled,
                  '!ui-cursor-default': props.isDisabled || props.isReadonly,
                }
              ]"
              ref="input"
            >
          </div>
          <div
            v-if="props.clearable && props.modelValue && String(props.modelValue || '')?.length && !props.isReadonly && !props.isDisabled"
            class="ui-pl-[12px] ui-self-stretch ui-flex ui-items-center"
            @click="clearableValue"
            :class="{
              'ui-pr-[6px]': slots['append-icon'],
              'ui-pr-[12px]': !slots['append-icon'],
            }"
          >
            <delete-icon
              width="20px"
              height="20px"
              fill="rgba(111, 118, 126, 0.4)"
              class="ui-cursor-pointer ui-transition-[opacity] ui-duration-300"
              :class="{
                'ui-opacity-0': !String(props.modelValue || '')?.length,
                'ui-opacity-1': String(props.modelValue || '').length,
              }"
            />
          </div>
          <span
            v-if="slots['append-icon']"
            class="append-icon ui-pr-[6px] ui-pl-[4px] -ui-my-[10px] ui-self-stretch ui-flex ui-items-center ui-transition-[border-color] ui-duration-300 ui-ease"
            :class="[
              classAppendIcon,
              classColor.appendIcon,
              classHover.appendIcon,
              {
                'ui-ml-[12px]': !props.clearable 
              },
            ]"
          >
            <div
              class="m-input__icon--wrap m-input__icon--wrap-append ui-p-[8px]"
              :class="{
                'ui-bg-black-50 ui-rounded-[8px]': props.appendIconOptions.bgColor
              }"
            >
              <slot
                name="append-icon"
                v-bind="({
                  isFocus: isFocus,
                  isError: !!props.errorMessage || props.error,
                })"
              />
            </div>
          </span>
        </div>
      </label>
    </HOCFormError>
  </div>
</template>

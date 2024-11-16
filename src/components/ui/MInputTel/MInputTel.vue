<script setup lang="ts">
import './MInputTel.scss'
import FormError from '../../HOC/FormError/FormError.vue'
import MInput from '../MInput/MInput.vue'
import MInputTelCountry from './MInputTelCountry.vue'
import { ref, watch, computed } from 'vue'

const props = defineProps({
  phone: {
    type: String,
    default:  '',
  },
  phoneCountry: {
    type: String,
    default: 'RU',
  },
  errorMessage: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
  clearable: Boolean,
  error: Boolean,
  isReadonly: Boolean,
})

const emits = defineEmits(['update:phone', 'update:phoneCountry'])

const valuePhone = ref(props.phone)
const valuePhoneCounty = ref(props.phoneCountry)

const fromatValue = computed({
  get() {
    const inputNumber = valuePhone.value.replace(/\D/g, '')
    const numberLenght = inputNumber.length
    let value = ''

    if (numberLenght < 11) {
      value = inputNumber.slice(0, 3)

      if (numberLenght > 3 ) {
        value = value + ' ' + inputNumber.slice(3, 6)
      }

      if (numberLenght > 6 ) {
        value = value + '-' + inputNumber.slice(6, 8)
      }

      if (numberLenght > 8 ) {
        value = value + '-' + inputNumber.slice(8, 10)
      }
    }
    else {
      value = inputNumber
    }

    return value
  },
  set(v) {
    valuePhone.value = v.replace(/\D/g, '')
  },
})

watch(valuePhone, (newValue) => {
  emits('update:phone', newValue)
})

watch(() => props.phone, (newValue) => {
  valuePhone.value = newValue
})

watch(valuePhoneCounty, (newValue) => {
  emits('update:phoneCountry', newValue)
})

watch(() => props.phoneCountry, (newValue) => {
  valuePhoneCounty.value = newValue
})

</script>

<template>
  <div>
    <form-error
      :error-message="props.errorMessage"
    >
      <m-input
        v-model="fromatValue"
        :clearable="clearable"
        :placeholder="props.placeholder"
        :is-readonly="props.isReadonly"
        :error="props.error || !!props.errorMessage"
        size="1"
        class="m-input-tel"
      >
        <slot />
        <template
          #prepend-icon
        >
          <m-input-tel-country
            v-model="valuePhoneCounty"
            :is-readonly="props.isReadonly"
          />
        </template>
      </m-input>
    </form-error>
  </div>
</template>
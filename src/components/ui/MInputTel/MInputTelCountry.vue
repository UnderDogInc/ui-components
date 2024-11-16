<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import MLayoutMenu from '../MLayoutMenu/MLayoutMenu.vue'
import сountryData from '../../../assets/alpha2/сountryData.json'
import * as flagIcons from '../../../assets/alpha2'
import MList from '../MList/MList.vue'

import './MInputTel.scss'
import ChewronDownIcon from '../../icon/ChewronDownIcon.vue'
import MInput from '../MInput/MInput.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: "RU",
  },
  isReadonly: Boolean,
})

const emits = defineEmits(['update:modelValue'])

const computedCounryData = computed(() => {
  return сountryData.filter((el) => el.name.toLocaleLowerCase().includes(searchCoutryList.value.trim().toLocaleLowerCase()) || el.name_rus.toLocaleLowerCase().includes(searchCoutryList.value.trim().toLocaleLowerCase()) || el.dial_code.trim().includes(searchCoutryList.value.trim().toLocaleLowerCase()))
})

const searchCoutryList = ref('')
const isOpen = ref(false)
const currentCountry = ref({
  name: 'Russia',
  dial_code: '+7',
  code: 'RU',
  component: 'ru',
  flag_file: 'ru.svg',
  name_rus: 'Россия',
})

const getStartCountryData = (code: string): void => {
  const country = сountryData.find(el => el.code === code)
  
  if (country) {
    currentCountry.value = country
  }
}

watch(() => currentCountry.value.code, (newValue) => {
  emits('update:modelValue', newValue)
  isOpen.value = false
  searchCoutryList.value = ''
})

watch(() => props.modelValue, (newValue) => {
  getStartCountryData(newValue)
})

onMounted(() => {
  getStartCountryData(props.modelValue)
})

</script>

<template>
  <div>
    <m-layout-menu
      v-model:is-open="isOpen"
      offset-y
      nudge-bottom="12"
      max-height="400"
      :disabled="props.isReadonly"
      :close-on-click="false"
    >
      <template #activator="{on}">
        <div
          class="current-country-select"
          :class="{
            'current-country-select-active': isOpen,
            'current-country-select__readonly': props.isReadonly
          }"
          v-on="on"
        >
          <component
            :is="flagIcons[currentCountry.component as keyof typeof flagIcons]"
            class="country-flag"
          />
          <div
            class="country-code"
          >
            {{ currentCountry.dial_code }}
          </div>
          <chewron-down-icon
            v-if="!props.isReadonly"
            class="current-country-select__arrow"
            width="24px"
            height="24px"
            fill="#9A9FA5"
          />
        </div>
      </template>
      <div
        class="country-list"
      >
        <div
          class="country-list-search"
        >
          <m-input
            v-model="searchCoutryList"
            placeholder="Поиск по названию и приставочному номеру стран"
          />
        </div>
        <m-list
          v-model="currentCountry"
          :items="computedCounryData"
          active-key="code"
          text-key="dial_code"
        >
          <template #item="{item, isActive}">
            <div
              class="country"
              :class="{
                'country-active': isActive,
              }"
            >
              <component
                :is="flagIcons[item.component as keyof typeof flagIcons]"
                class="country-flag"
              />
              <div
                class="country-code"
              >
                {{ item.dial_code }} {{ item.name_rus}}
              </div>
            </div>
          </template>
        </m-list>
      </div>
    </m-layout-menu>
  </div>
</template>
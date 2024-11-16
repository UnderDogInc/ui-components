<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue'
import type { PropType, Ref } from 'vue'

import { prettierNumeric } from '../../../assets/utils/utils'
import type { ModelValue, IDataValue, ICurrentDate } from '../MCalendar/type'
import './MBottomSheetCalendar.scss'

import MButton from '@/components/ui/MButton/MButton.vue'
import ConfirmIcon from '@/components/icon/ConfirmIcon.vue'
import ChewronDownIcon from '@/components/icon/ChewronDownIcon.vue'
import MIcon from '../MIcon/MIcon.vue'
import MBottomSheetMounthPicker from './MBottomSheetMounthPicker.vue'
import MBottomSheetYearsPicker from './MBottomSheetYearsPicker.vue'
import MBottomSheet from '../MBottomSheet/MBottomSheet.vue'
import MBottomSheetTimePicker from './MBottomSheetTimePicker.vue'


const props = defineProps({
  modelValue: {
    type: Object as PropType<ModelValue>,
    required: true,
  },
  datePicker: Boolean,
  timePicker: Boolean,
  attach: [Boolean, String] as PropType<string | false | undefined>,
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emits = defineEmits(['update:modelValue', 'update:isOpen'])

const isOpen = ref(props.isOpen)
const hour: Ref<number|undefined> = ref(0)
const minutes: Ref<number|undefined> = ref(0)

const currentData = ref<number>(Date.now())
const mounthPickerIsOpen = ref(false)
const yearsPickerIsOpen = ref(false)
const hourPickerIsOpen: Ref<boolean> = ref(false)
const minutesPickerIsOpen: Ref<boolean> = ref(false)

const nameWeekDay = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]
const dataFormat = /[0-9]{2}.[0-9]{2}.[0-9]{4}-[0-9]{2}.[0-9]{2}.[0-9]{4}/gm
const dataFormatSingleDate = /[0-9]{2}.[0-9]{2}.[0-9]{4}/gm
const dataFormatSingleDateWithTime = /[0-9]{2}.[0-9]{2}.[0-9]{4} [0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}/gm


const getDate = computed((): Date => {
  return new Date(currentData.value)
})

const getCurrentDate = computed((): ICurrentDate => {
  return {
    mouthNow: getDate.value.getMonth(),
    yaerNow: getDate.value.getFullYear(),
  }
})

const justifyAcrions = computed((): string => {
  let justifyClass = 'ui-justify-start'

  if (selectedData.value.startDate || selectedData.value.finishDate) {
    justifyClass = 'ui-justify-between'
  }

  return justifyClass
})

const dataText = computed(() => {
  if (selectedData.value.startDate) {
    const startDate = prettierNumeric('##', '0', selectedData.value.startDate.getDate())
    const startMounth = prettierNumeric('##', '0', selectedData.value.startDate.getMonth() + 1)
    const startYear = selectedData.value.startDate.getFullYear()

    return `${startDate}.${startMounth}.${String(startYear).slice(2)}`
  }

  return ''
})

const currentDays = computed((): Date[] => {
  const { mouthNow: mouth, yaerNow: yaer } = getCurrentDate.value
  const lastDay: number = new Date(yaer, mouth + 1, 0).getDate()
  const arrayDays: Array<Date> = []

  for (let day = 1; day < lastDay + 1; day++) {
    arrayDays.push(new Date(new Date(yaer, mouth, day)))
  }

  return arrayDays
})

const currentMonth = computed((): string => {
  const mouths: Array<string> = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ]

  return mouths[getCurrentDate.value.mouthNow]
})

const currentYear = computed((): string|number => {
  return getCurrentDate.value.yaerNow
})

const activeApplyButton = computed((): boolean => {
  return (!!selectedData.value.startDate || !!selectedData.value.finishDate) || (!!selectedData.value.startDate || props.datePicker)
})

const formatStringToDate = (dateString: string): Date => {
  if (!props.timePicker) {
    const [day, mouth, yaer] = dateString.split('.')

    return new Date(+yaer, +mouth - 1, +day)
  }
  else if (dateString)  {
    const [date, time] = dateString.split(' ')
    const [day, mouth, yaer] = date.split('.')

    hour.value = +time.split(':')[0]
    minutes.value = +time.split(':')[1]

    return new Date(+yaer, +mouth - 1, +day)
  }
  else {
    const [day, mouth, yaer] = dateString.split('.')

    return new Date(+yaer, +mouth - 1, +day)
  }
}

const selectedData: Ref<{
	startDate: Date | null,
	finishDate: Date | null,
}> = ref({
  startDate: null,
  finishDate: null,
})

const selectData = (day: Date): void => {
  if (selectedData.value.startDate === null || props.datePicker) {
    selectedData.value.startDate = day
  }
  else if (selectedData.value.finishDate === null && selectedData.value.startDate !== day) {
    selectedData.value.finishDate = day
  }
  else {
    selectedData.value.startDate = day
    selectedData.value.finishDate = null
  }
}

const formatDateToString = (date: IDataValue) => {
  const startDate = prettierNumeric('##', '0', date.startDate.getDate())
  const startMounth = prettierNumeric('##', '0', date.startDate.getMonth() + 1)
  const startMounthValue = prettierNumeric('##', '0', date.startDate.getMonth() + 1)
  const startYear = date.startDate.getFullYear()

  if (!props.datePicker && date.finishDate) {
    const finishDate = prettierNumeric('##', '0', date.finishDate.getDate())
    const finishMounth = prettierNumeric('##', '0', date.finishDate.getMonth() + 1)
    const finishMounthValue = prettierNumeric('##', '0', date.finishDate.getMonth() + 1)
    const finishYear = date.finishDate.getFullYear()

    return {
      value: `${startDate}.${startMounthValue}.${startYear}-${finishDate}.${finishMounthValue}.${finishYear}`,
      title: `${startDate}.${startMounth}.${String(startYear).slice(2)} - ${finishDate}.${finishMounth}.${String(finishYear).slice(2)}`,
    }
  }


  if (props.timePicker) {
    const startHour = prettierNumeric('##', '0', hour.value as number)
    const startMinuts = prettierNumeric('##', '0', minutes.value as number)

    return {
      value: `${startDate}.${startMounth}.${startYear} ${startHour}:${startMinuts}`,
      title: `${startDate}.${startMounth}.${String(startYear).slice(2)} ${startHour}:${startMinuts}`,
    }
  }


  return {
    value: `${startDate}.${startMounth}.${startYear}`,
    title: `${startDate}.${startMounth}.${String(startYear).slice(2)}`,
  }
}

const applyDate = (isClose = false): void => {
  if (selectedData.value.startDate && selectedData.value.finishDate && selectedData.value.startDate.getTime() > selectedData.value.finishDate.getTime()) {
    [selectedData.value.startDate, selectedData.value.finishDate] = [selectedData.value.finishDate, selectedData.value.startDate]
  }

  const newValue = formatDateToString(selectedData.value as IDataValue)

  emits('update:modelValue',  {
    ...newValue,
    isDate: true,
  })

  isOpen.value = !isClose
}

const clearSelectedDate = (): void => {
  [selectedData.value.startDate, selectedData.value.finishDate] = [null, null]
}

const classFromSelectDay = (day: Date): string => {
  const { startDate, finishDate } = selectedData.value

  if ((startDate && day.getTime() === startDate.getTime()) || (finishDate && day.getTime() === finishDate.getTime())) {
    return 'ui-bg-primary-900 ui-text-white-900'
  }

  if (startDate && finishDate && ((day.getTime() > startDate.getTime() && day.getTime() < finishDate.getTime()) || (day.getTime() < startDate.getTime() && day.getTime() > finishDate.getTime()))) {
    return 'ui-bg-primary-100 ui-text-black-900 hover:bg-primary-100'
  }

  return 'ui-text-black-900 hover:ui-bg-primary-100'
}

const numberWeekDay = (date: Date): number => {
  return date.getDay() === 0
    ? 7
    : date.getDay()
}

const girdColumnFromDay = (date: Date): object => {
  return {
    gridColumnStart: numberWeekDay(date),
    gridColumnEnd: numberWeekDay(date),
  }
}

const ininSelectedDate = (date: string) => {
  selectedData.value.startDate = formatStringToDate(date.split('-')[0])
  currentData.value = formatStringToDate(date.split('-')[0]).getTime()

  if (!props.datePicker) {
    selectedData.value.finishDate = formatStringToDate(date.split('-')[1])
  }
}

const updateMounth = (mounth: number) => {
  currentData.value = new Date(
    getCurrentDate.value.yaerNow,
    mounth
  ).getTime()
  mounthPickerIsOpen.value = false
}

const updateYear = (year: number) => {
  currentData.value = new Date(
    year,
    getCurrentDate.value.mouthNow
  ).getTime()
  yearsPickerIsOpen.value = false
}

const prevMonth = (): void => {
  currentData.value = new Date(
    getCurrentDate.value.yaerNow,
    getCurrentDate.value.mouthNow - 1
  ).getTime()
}

const nextMonth = (): void => {
  currentData.value = new Date(
    getCurrentDate.value.yaerNow,
    getCurrentDate.value.mouthNow + 1
  ).getTime()
}

onMounted(() => {
  if (dataFormat.test(props.modelValue?.value) || dataFormatSingleDate.test(props.modelValue?.value) || dataFormatSingleDateWithTime.test(props.modelValue?.value)) {
    ininSelectedDate(props.modelValue.value)
  }
})

watch(() => props.modelValue, (newValue) => {
  if (dataFormat.test(props.modelValue?.value) || dataFormatSingleDate.test(props.modelValue?.value) || dataFormatSingleDateWithTime.test(props.modelValue?.value)) {
    ininSelectedDate(newValue.value)

    return
  }

  if (!newValue.isDate) {
    selectedData.value = {
      startDate: null,
      finishDate: null,
    }
  }
})

watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue

  if (!newValue) {
    minutesPickerIsOpen.value = false
    hourPickerIsOpen.value = false
    mounthPickerIsOpen.value = false
    yearsPickerIsOpen.value = false
  }
})

watch(isOpen, (newValue) => {
  emits('update:isOpen', newValue)
})
</script>

<template>
  <m-bottom-sheet
    v-model="isOpen"
    :attach="attach"
  >
    <template #header>
      <div class="m-calendar__header ui-flex ui-pb-[24px] ui-justify-between ui-items-center ui-w-full ui-border-b-black-50 ui-border-b ui-border-solid">
        <m-icon
          @click="prevMonth"
          :bg-color="'background-color'"
          :brightness="'900'"
          padding="8px"
        >
          <chewron-down-icon
            class="ui-rotate-90"
            width="24px"
            height="24px"
            fill="#1A1D1F"
          />
        </m-icon>
        <div class="m-calendar__header-title ui-flex ui-justify-center ui-items-center ui-text-[20px] ui-leading-[160%] ui-text-black-900 ui-font-semibold">
          <div
            @click="mounthPickerIsOpen = true"
            class="ui-cursor-pointer"
          >
            {{currentMonth}}
          </div>
          &nbsp;
          <div
            @click="yearsPickerIsOpen = true"
            class="ui-cursor-pointer"
          >
            {{currentYear}}
          </div>
        </div>
        <m-icon
          @click="nextMonth"
          :bg-color="'background-color'"
          :brightness="'900'"
          padding="8px"
        >
          <chewron-down-icon
            class="-ui-rotate-90"
            width="24px"
            height="24px"
            fill="#1A1D1F"
          />
        </m-icon>
      </div>
    </template>
    <div class="m-calendar__body ui-relative ui-pb-[24px] ui-border-b-black-50 ui-border-b ui-border-solid">

      <div class="m-calendar__body-week ui-grid ui-gap-[20px] ui-grid-cols-7 ui-mb-[12px]">
        <div
          class="calendar__week-day ui-w-[32px] ui-h-[32px] ui-text-black-500 ui-text-sm ui-flex ui-items-center ui-justify-center"
          v-for="name in nameWeekDay"
          :key="name"
        >
          {{ name }}
        </div>
      </div>
      <div class="m-calendar__body-days ui-grid ui-gap-x-[20px] ui-gap-y-[12px] ui-grid-cols-7">
        <div
          class="calendar__week-day ui-w-[32px] ui-h-[32px] ui-rounded-[8px] ui-transition ui-ease ui-duration-300 ui-cursor-pointer ui-text-black-900 ui-text-sm ui-flex ui-items-center ui-justify-center"
          v-for="day in currentDays"
          :class="[
            classFromSelectDay(day)
          ]"
          :key="String(day)"
          :style="{
            ...girdColumnFromDay(day),
          }
          "
          @click="selectData(day)"
        >
          {{ day.getDate() }}
        </div>
      </div>
    </div>
    <m-bottom-sheet-mounth-picker
      v-model="getCurrentDate.mouthNow"
      v-model:is-open="mounthPickerIsOpen"
      :attach="attach"
      @new-mounth="updateMounth"
    />

    <m-bottom-sheet-years-picker
      v-model="getCurrentDate.yaerNow"
      v-model:is-open="yearsPickerIsOpen"
      :attach="attach"
      @new-year="updateYear"
    />

    <m-bottom-sheet-time-picker
      v-model:is-open="hourPickerIsOpen"
      v-model="hour"
      :first-time="hour"
      double
      :min="0"
      :date="dataText"
      :attach="attach"
      :max="23"
      @open-select-hout="() => {
        minutesPickerIsOpen = false
        hourPickerIsOpen = true
      }"
      @open-select-minutes="() => {
        minutesPickerIsOpen = true
        hourPickerIsOpen = false
      }"
      @open-select-data="() => {
        minutesPickerIsOpen = false
        hourPickerIsOpen = false
      }"
    />

    <m-bottom-sheet-time-picker
      v-model:is-open="minutesPickerIsOpen"
      v-model="minutes"
      :first-time="hour"
      :second-time="minutes"
      :min="0"
      :max="59"
      :step="5"
      :date="dataText"
      :attach="attach"
      @open-select-hout="() => {
        minutesPickerIsOpen = false
        hourPickerIsOpen = true
      }"
      @open-select-minutes="() => {
        minutesPickerIsOpen = true
        hourPickerIsOpen = false
      }"
      @open-select-data="() => {
        minutesPickerIsOpen = false
        hourPickerIsOpen = false
      }"
      can-accept
      @accept="applyDate(true)"
    />

    <template #footer>
      <div
        class="m-calendar__actions ui-flex"
        :class="[
          justifyAcrions
        ]"
      >
        <m-button
          v-if="props.timePicker && (!hourPickerIsOpen && !minutesPickerIsOpen)"
          :is-disabled="!activeApplyButton"
          class="acept"
          @click="hourPickerIsOpen = true"
        >
          Выбрать часы
        </m-button>
        <m-button
          v-else-if="props.timePicker && hourPickerIsOpen"
          :is-disabled="!activeApplyButton"
          class="acept"
          @click="[minutesPickerIsOpen, hourPickerIsOpen] = [true, false]"
        >
          Выбрать минуты
        </m-button>
        <m-button
          v-else
          :is-disabled="!activeApplyButton"
          class="acept ui-h-[48px]"
          @click="applyDate(true)"
        >
          <template #prepend-icon>
            <confirm-icon
              class="ui-fill-[transparent]"
              fill="#FCFCFC"
            />
          </template>
          Применить
        </m-button>
        <m-button
          v-if="selectedData.startDate || selectedData.finishDate"
          @click="clearSelectedDate"
          class="clear hover:ui-border-primary-500 ui-transition ui-ease ui-duration-300 ui-h-[48px]"
          outline
          color="black"
          brightness="50"
        >
          Очистить
        </m-button>
      </div>
    </template>
  </m-bottom-sheet>
</template>

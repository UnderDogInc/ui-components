<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue'
import type { PropType, Ref } from 'vue'

import { prettierNumeric } from '../../../assets/utils/utils'
import type { ModelValue, IDataValue, ICurrentDate } from './type'
import './MCalendar.scss'

import MButton from '@/components/ui/MButton/MButton.vue'
import ConfirmIcon from '@/components/icon/ConfirmIcon.vue'
import ChewronDownIcon from '@/components/icon/ChewronDownIcon.vue'
import MMonthPicer from './MMonthPicker.vue'
import MYearsPicer from './MYearsPicker.vue'
import MTimePicker from './MTimePicker.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ModelValue>,
    required: true,
  },
  datePicker: Boolean,
  timePicker: Boolean,
  canClose: Boolean,
  withTime: Boolean,
})

const emits = defineEmits(['update:modelValue', 'closeCalendar'])

const calendar = ref<HTMLElement | null>(null)
const isSelectMounth: Ref<boolean> = ref(false)
const isSelectYear: Ref<boolean> = ref(false)
const isSelectHour: Ref<boolean> = ref(false)
const isSelectMinutes: Ref<boolean> = ref(false)
const hour: Ref<number|undefined> = ref(0)
const minutes: Ref<number|undefined> = ref(0)

const nameWeekDay = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]
const dataFormat = /[0-9]{2}.[0-9]{2}.[0-9]{4}-[0-9]{2}.[0-9]{2}.[0-9]{4}/gm
const dataFormatSingleDate = /[0-9]{2}.[0-9]{2}.[0-9]{4}/gm
const dataFormatSingleDateWithTime = /[0-9]{2}.[0-9]{2}.[0-9]{4} [0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}/gm

const currentData = ref<number>(Date.now())

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

  if (props.canClose || selectedData.value.startDate || selectedData.value.finishDate) {
    justifyClass = 'ui-justify-between'
  }

  return justifyClass
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

const dataText = computed(() => {
  if (selectedData.value.startDate) {
    const startDate = prettierNumeric('##', '0', selectedData.value.startDate.getDate())
    const startMounth = prettierNumeric('##', '0', selectedData.value.startDate.getMonth() + 1)
    const startYear = selectedData.value.startDate.getFullYear()

    return `${startDate}.${startMounth}.${String(startYear).slice(2)}`
  }

  return ''
})

const formatStringToDate = (dateString: string): Date => {
  if (!props.timePicker) {
    const [day, mouth, yaer] = dateString.split('.')

    return new Date(+yaer, +mouth - 1, +day)
  }
  else if (dateString) {
    const [date, time] = dateString.split(' ')
    const [day, mouth, yaer] = date.split('.')

    if (time) {
      hour.value = +time.split(':')[0]
      minutes.value = +time.split(':')[1]
    }

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

  if (props.timePicker && hour.value !== undefined && minutes.value !== undefined) {
    const startHour = prettierNumeric('##', '0', hour.value)
    const startMinuts = prettierNumeric('##', '0', minutes.value)

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

const applyDate = (): void => {
  if (selectedData.value.startDate && selectedData.value.finishDate && selectedData.value.startDate.getTime() > selectedData.value.finishDate.getTime()) {
    [selectedData.value.startDate, selectedData.value.finishDate] = [selectedData.value.finishDate, selectedData.value.startDate]
  }

  const newValue = formatDateToString(selectedData.value as IDataValue)

  emits('update:modelValue',  {
    ...newValue,
    isDate: true,
  })
}

const clearSelectedDate = (): void => {
  [selectedData.value.startDate, selectedData.value.finishDate, hour.value, minutes.value, isSelectHour.value, isSelectMinutes.value] = [null, null, undefined, undefined, false, false]
}

const classFromSelectDay = (day: Date): string => {
  const { startDate, finishDate } = selectedData.value

  if ((startDate && day.getTime() === startDate.getTime()) || (finishDate && day.getTime() === finishDate.getTime())) {
    return 'ui-bg-primary-900 ui-text-white-900'
  }

  if (startDate && finishDate && ((day.getTime() > startDate.getTime() && day.getTime() < finishDate.getTime()) || (day.getTime() < startDate.getTime() && day.getTime() > finishDate.getTime()))) {
    return 'ui-bg-primary-100 ui-text-black-900 hover:ui-bg-primary-100'
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

const closeSelect = () => {
  isSelectMounth.value = false
  isSelectYear.value = false
}

const updateMounth = (mounth: number) => {
  currentData.value = new Date(
    getCurrentDate.value.yaerNow,
    mounth
  ).getTime()

  isSelectMounth.value = false
}

const updateYear = (year: number) => {
  currentData.value = new Date(
    year,
    getCurrentDate.value.mouthNow
  ).getTime()

  isSelectYear.value = false
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
}, {
  deep: true,
})

watch(isSelectMounth, (newValue) => {
  if (newValue) {
    isSelectYear.value = false
  }
})

watch(isSelectYear, (newValue) => {
  if (newValue) {
    isSelectMounth.value = false
  }
})
</script>

<template>
  <div
    v-bind="$attrs"
    class="ui-m-calendar--wrap ui-rounded-base ui-bg-white-900 ui-p-[24px] ui-w-[max-content]"
    ref="calendar"
  >
    <div class="m-calendar__header ui-flex ui-justify-between ui-items-center ui-pb-[24px] ui-border-b-black-50 ui-border-b ui-border-solid">
      <div
        class="ui-flex ui-items-center ui-cursor-pointer ui-justify-center ui-bg-background-color-900 ui-rounded-[8px] ui-w-[36px] ui-h-[36px] ui-rotate-90"
        :class="{
          'ui-opacity-80 ui-pointer-events-none': isSelectMounth || isSelectYear
        }"
        @click="prevMonth"
      >
        <chewron-down-icon
          width="24px"
          height="24px"
          :fill="
            isSelectMounth || isSelectYear
              ? '#9A9FA5'
              : '#1A1D1F'
          "
        />
      </div>
      <div class="m-calendar__header-title ui-flex ui-justify-center ui-items-center ui-font-[20px] ui-text-black-900 ui-font-semibold">
        <div
          @click="isSelectMounth = !isSelectMounth"
          class="ui-cursor-pointer"
        >
          {{currentMonth}}
        </div>
				&nbsp;
        <div
          @click="isSelectYear = !isSelectYear"
          class="ui-cursor-pointer"
        >
          {{currentYear}}
        </div>
      </div>
      <div
        class="ui-flex ui-items-center ui-cursor-pointer ui-justify-center ui-bg-background-color-900 ui-rounded-[8px] ui-w-[36px] ui-h-[36px] -ui-rotate-90"
        :class="{
          'ui-opacity-80 ui-pointer-events-none': isSelectMounth || isSelectYear
        }"
        @click="nextMonth"
      >
        <chewron-down-icon
          width="24px"
          height="24px"
          :fill="
            isSelectMounth || isSelectYear
              ? '#9A9FA5'
              : '#1A1D1F'
          "
        />
      </div>
    </div>
    <div
      class="m-calendar__body ui-relative ui-pb-[24px] ui-border-b-black-50 ui-border-b ui-border-solid"
      :class="{
        '!ui-pb-[50px]': isSelectHour || isSelectMinutes
      }"
    >
      <m-month-picer
        v-if="isSelectMounth"
        :current-month="getCurrentDate.mouthNow"
        class="ui-absolute ui-bg-white-900"
        @new-mounth="updateMounth"
      />

      <m-years-picer
        v-if="isSelectYear"
        :current-year="getCurrentDate.yaerNow"
        class="ui-absolute ui-bg-white-900"
        @new-year="updateYear"
      />

      <m-time-picker
        v-if="isSelectHour"
        @open-select-hout="() => {
          isSelectHour = true
          isSelectMinutes = false
        }"
        @open-select-minutes="() => {
          isSelectMinutes = true
          isSelectHour = false
        }"
        v-model="hour"
        :first-time="hour"
        :second-time="minutes"
        double
        :min="0"
        :max="23"
        :date="dataText"
        @open-select-data="() => {
          isSelectHour=false
          isSelectMinutes=false
        }"
        class="ui-absolute ui-bg-white-900"
        @change="() => {
          isSelectHour=false
          isSelectMinutes=true
        }"
      />

      <m-time-picker
        v-if="isSelectMinutes"
        @open-select-hout="() => {
          isSelectHour = true
          isSelectMinutes = false
        }"
        @open-select-minutes="() => {
          isSelectMinutes = true
          isSelectHour = false
        }"
        @open-select-data="() => {
          isSelectHour=false
          isSelectMinutes=false
        }"
        v-model="minutes"
        :first-time="hour"
        :second-time="minutes"
        :min="0"
        :max="59"
        :step="5"
        :date="dataText"
        class="ui-absolute ui-bg-white-900"
      />


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
    <div
      class="m-calendar__actions ui-pt-[24px] ui-flex"
      :class="[
        justifyAcrions
      ]"
    >
      <template v-if="!isSelectMounth && !isSelectYear">
        <m-button
          v-if="props.timePicker && (!isSelectHour && !isSelectMinutes)"
          :is-disabled="!activeApplyButton"
          class="acept"
          @click="isSelectHour = true"
        >
          Выбрать часы
        </m-button>
        <m-button
          v-else-if="props.timePicker && isSelectHour"
          :is-disabled="!activeApplyButton"
          class="acept"
          @click="[isSelectMinutes, isSelectHour] = [true, false]"
        >
          Выбрать минуты
        </m-button>
        <m-button
          v-else
          :is-disabled="!activeApplyButton"
          class="acept"
          @click="applyDate"
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
          v-if="props.canClose"
          class="hover:ui-border-primary-500 ui-transition ui-ease ui-duration-300"
          @click.stop="emits('closeCalendar')"
          outline
          color="black"
          brightness="50"
        >
          Закрыть
        </m-button>
        <m-button
          v-else-if="selectedData.startDate || selectedData.finishDate"
          @click="clearSelectedDate"
          class="hover:ui-border-primary-500 ui-transition ui-ease ui-duration-300"
          outline
          color="black"
          brightness="50"
        >
          Очистить
        </m-button>
      </template>
      <template v-else>
        <m-button
          class="hover:ui-border-primary-500 ui-transition ui-ease ui-duration-300 ui-ml-auto"
          outline
          color="black"
          brightness="50"
          @click="closeSelect"
        >
          Отменить
        </m-button>
      </template>
    </div>
  </div>
</template>

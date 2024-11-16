<script setup lang=ts>
import { computed, onMounted, ref, watch } from 'vue'
import { prettierNumeric } from '../../../assets/utils/utils'
import { Point } from './type'

const props = defineProps({
  lable: {
    type: String,
    default: 'Выбранное время: ',
  },
  firstTime: {
    type: [Number, String],
    default: '00',
  },
  secondTime: {
    type: [Number, String],
    default: '00',
  },
  modelValue: {
    type: [Number, String],
    required: false,
  },
  isMinutes: Boolean,
  double: Boolean,
  max: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  step: {
    type: Number,
    default: 1,
  },
  date: {
    type: String,
    required: false,
  },
})

const emits = defineEmits(['change', 'openSelectData', 'update:modelValue', 'openSelectHout', 'openSelectMinutes'])

const selectValue = ref<number|null>(null)
const valueOnMouseDown = ref<number|null>(null)
const valueOnMouseUp = ref<number|null>(null)
const isDragging = ref(false)

const count = computed(() => {
  return props.double 
    ? ( props.max - props.min + 1 ) / 2
    : props.max - props.min + 1
})

const rotateZ = computed(() => {
  const value = Number(props.modelValue || 0)

  return 360 / count.value * value
})

const items = computed(() => {
  const items = []

  if (props.double) {
    items.push(new Array(count.value).fill(props.min).map((el, index)=> el + index))
    items.push(new Array(count.value).fill(count.value).map((el, index)=> el + index))
  }
  else {
    items.push(new Array(count.value).fill(props.min).map((el, index)=> el + index))
  }

  return items
})

const visibleItems = computed(() => {
  const items = []

  if (props.double) {
    items.push(new Array(count.value / props.step).fill(props.min).map((el, index)=> el + index * props.step))
    items.push(new Array(count.value / props.step).fill(count.value).map((el, index)=> el + index * props.step))
  }
  else {
    items.push(new Array(count.value / props.step).fill(props.min).map((el, index)=> el + index * props.step))
  }

  return items
})

const clock = ref<HTMLElement|null>(null)
const line = ref<HTMLElement|null>(null)

const widthClock = computed(() => {
  if (clock.value) {
    return clock.value.clientHeight + 'px'
  }

  return '100%'
})

const euclidean = (p0: Point, p1: Point) => {
  const dx = p1.x - p0.x
  const dy = p1.y - p0.y

  return Math.sqrt(dx * dx + dy * dy)
}

const getAngel = (center: Point, coords: Point) => {
  const x = coords.x - center.x
  const y = coords.y - center.y
  const rad  = Math.atan2(y - euclidean(center, coords), x)
  const deg = Math.abs(rad * 360 / Math.PI)
  
  return deg
}

const setValueOnMouseUp = (angle: number, isInside: boolean) => {
  const piceAngle = 360 / count.value
  let indexPice
  const angleForGetIndex = Math.abs(angle + piceAngle / 2)

  if (angle < piceAngle / 2 || (angle + piceAngle / 2 ) % 360 < piceAngle / 2) {
    indexPice = 0
  }
  else if ( angleForGetIndex > piceAngle / 2 && angleForGetIndex < piceAngle) {
    indexPice = 1
  }
  else {
    indexPice = Math.floor(angleForGetIndex / piceAngle)
  } 

  const value = props.double
    ? isInside
      ? items.value[1][indexPice]
      : items.value[0][indexPice]
    : items.value[0][indexPice]

  if (valueOnMouseDown.value === null) {
    valueOnMouseDown.value = value
  }

  valueOnMouseUp.value = value
  selectValue.value = value
  emits('update:modelValue', value)
}

const updateLine = (isInside: boolean) => {
  if (line.value) {
    if (props.double && isInside) {
      const item = document.getElementById('roundInsideItem') as HTMLElement

      line.value.style.height = item.clientHeight - item.children[0].clientHeight / 2 + 'px'
      line.value.style.top = parseInt(item.style.top) + item.children[0].clientHeight / 2 + 'px'
    }
    else {
      const item = document.getElementById('roundItem') as HTMLElement
      line.value.style.height = item.clientHeight - item.children[0].clientHeight / 2 + 'px'
      line.value.style.top = parseInt(item.style.top) + item.children[0].clientHeight / 2 + 'px'
    }
  }
}

const onMouseUp = (e: MouseEvent | TouchEvent) => {
  e.stopPropagation()
  isDragging.value = false

  emits('change', valueOnMouseUp.value)
}

const onMouseDown = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()

  isDragging.value = true
  valueOnMouseDown.value = null
  valueOnMouseUp.value = null
  onMouseMove(e)
}

const onMouseMove = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  if (!isDragging.value) return

  if (clock.value) {
    const { width, top, left } = clock.value.getBoundingClientRect()
    const { clientX, clientY } = 'touches' in e 
      ? e.touches[0]
      : e
    const center = { 
      x: width / 2,
      y: -width / 2,
    }
    const coords = { 
      x: clientX - left,
      y: top - clientY,
    }

    const angle = getAngel(center, coords)
    const euclideanOnMouse = euclidean(center, coords)
    const item = document.getElementById('roundInsideItem') as HTMLElement
    const inInsideRound = props.double && item && item.getBoundingClientRect().height > euclideanOnMouse || false
    
    setValueOnMouseUp(angle, inInsideRound)
  }
}

onMounted(() => {
  if (props.modelValue) {
    updateLine(props.modelValue >= count.value)
  }
})

watch(() => props.modelValue, (newValue) => {
  updateLine(!!newValue && (newValue >= count.value))
})
</script>

<template>
  <div
    class="ui-w-[100%] ui-h-[100%] ui-py-[24px] ui-flex ui-flex-col ui-items-center ui-justify-center"
  >
    <div class="ui-mt-[-15px] ui-mb-[12px]">
      <span>
        {{props.lable}}
      </span>
      <span
        class="ui-cursor-pointer ui-mx-[3px] ui-text-black-500 ui-transition-[color] hover:ui-text-black-900"
        @click="emits('openSelectData')"
      >
        {{ props.date + ' '}}
      </span>
      <span
        class="ui-cursor-pointer ui-text-black-500 ui-transition-[color] hover:ui-text-black-900"
        @click="emits('openSelectHout')"
      >
        {{ prettierNumeric('##', '0', props.firstTime) }}
      </span>
      <span>
        :
      </span>
      <span
        class="ui-cursor-pointer ui-text-black-500 ui-transition-[color] hover:ui-text-black-900"
        @click="emits('openSelectMinutes')"
      >
        {{ prettierNumeric('##', '0', props.secondTime) }}
      </span>
    </div>
    <div
      ref="clock"
      class="calendar-clock ui-h-full ui-relative ui-align-middle ui-rounded-[50%] ui-bg-white-900 ui-border-2 ui-border-black-50 ui-text-center"
      :style="{
        width: widthClock,
      }"
      @mouseup="onMouseUp"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseleave="(e: MouseEvent) => (isDragging && onMouseUp(e))"
      @touchstart="onMouseDown"
      @touchend="onMouseUp"
      @touchmove="onMouseMove"
    >
      <div
        ref="line"
        class="ui-absolute ui-w-[2px] ui-left-[50%] ui-top-[20px] ui-h-[calc(50%_-_20px)] ui-origin-bottom ui-ml-[-1px] ui-bg-primary-900"
        :style=" {
          transform: `rotateZ(${rotateZ}deg)`
        }"
      >
        <div 
          class="ui-absolute ui-w-[12px] ui-h-[12px] ui-bg-primary-900 ui-bottom-[0px] ui-rounded-[50%] ui-left-[50%] ui-translate-x-[-50%] ui-translate-y-[50%]"
        />
        <div 
          class="ui-absolute ui-w-[8px] ui-h-[8px] ui-bg-white-900 ui-border-[2px] ui-border-primary-900 ui-top-[0px] ui-rounded-[50%] ui-left-[50%] ui-translate-x-[-50%] ui-translate-y-[-50%]"
        />
      </div>
      <div
        class="calendar-clock-round"
        v-for="(round, index) in visibleItems"
        :key="index"
      >
        <div
          v-for="(hour, _index) in round"
          :key="hour"
          :id="_index === 0 && index > 0
            ? 'roundInsideItem'
            : _index === 0
              ? 'roundItem'
              : ''
          "
          class="ui-absolute ui-w-[30px] ui-left-[50%] -ui-ml-[15px] ui-origin-bottom"
          :style=" {
            top: `${5 + 30 * index}px`,
            height: `calc(50% - ${5 + 30 * index}px)`,
            transform: `rotateZ(${360 / count * hour}deg)`
          }"
        >
          <span
            class="ui-flex ui-select-none ui-text-p14-semibold ui-font-semibold ui-cursor-pointer ui-rounded-[50%] ui-w-[30px] ui-h-[30px] ui-items-center ui-justify-center ui-p-[5px]"
            :class="{
              'ui-bg-primary-900 ui-text-white-900': props.modelValue === hour || (props.modelValue === 0 && hour === 0),
              'hover:ui-bg-primary-100': props.modelValue !== hour,
            }"
            :style=" {
              transform: `rotateZ(-${360 / count * hour}deg)`
            }"
          >
            {{ hour }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>
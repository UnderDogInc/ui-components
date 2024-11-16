<template>
  <div
    class="circle-slider__wrap"
    :class="[
      {'circle-slider__type-text' : isTypeText}
    ]"
    :style="styleCircleSize"
  >
    <div
      class="circle-slider__container"
      :style="[styleCircleSize, containerTransformStyle]"
    >
      <div
        ref="carousel"
        class="circle-slider"
        :style="styleCircleSize"
      >
        <div
          v-for="item in items"
          :key="item.id"
          class="circle-slider__item"
          :class="[
            {'circle-slider__item-active': item.id === currValue}
          ]"
          :style="item.styles"
          @click="triggerChange(item.id)"
        >
          <span v-if="type === 'text'">
            {{ item.data }}
          </span>
          <span
            v-else-if="type === 'image'"
            class="circle-slider__image"
          >
            <img
              :src="item.data"
              :style="{'transform': `rotate(${imageRotate}deg)`}"
              alt="test"
            >
          </span>
          <span
            v-else
            :style="{ background: item.data }"
          />
        </div>
      </div>
      <span
        class="circle-slider__selector"
        :style="styleSelector"
      />
    </div>
    <div
      class="circle-slider__inner"
      :style="styleInnerCircle"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, toRefs, watch} from "vue"

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  value: {
    type: Number,
    default: null,
  },
  itemSizeInDegrees: {
    type: Number,
    default: 9.5,
  },
  reverse: Boolean,
  radiusInPixels: {
    type: Number,
    default: 320,
  },
  type: {
    type: String,
    default: 'circle',
  },
  rotate: {
    type: Number,
    default: 180,
  },
  imageRotate: {
    type: Number,
    default: -90,
  },
})

const emit = defineEmits(["input"])

const { value } = toRefs(props)
const draggable = ref(null)
const wheelDeltaAccumulator = ref(0)
const wheelDeltaTickValue = ref(120)
const carousel = ref(null)


const isTypeText = computed(() => props.type === 'text')
const containerTransformStyle = computed(() => `transform: rotate(${props.rotate}deg)`)
const itemRadius = computed(() => 0.04 * props.radiusInPixels)
const itemsCircleRadius = computed(() =>  0.89 * props.radiusInPixels)
const styleCircleSize = computed(() =>  {
  const size = props.radiusInPixels * 2

  return {
    width: `${size}px`,
    height: `${size}px`,
  }
})

const styleSelector = computed(() =>  {
  const k = 1.32
  let size = itemRadius.value * 2 * k
  let halfSize = size / 2
  let translateY = itemsCircleRadius.value

  if (isTypeText.value) {
    size = itemRadius.value * k
    halfSize = size / 2
    translateY = itemsCircleRadius.value
  }

  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `calc(50% - ${halfSize}px)`,
    left: `calc(50% - ${halfSize}px)`,
    transform: `translateY(${-translateY}px)`,
  }
})

const styleCircleSizeWithPosition = computed(() => {
  const posValue = props.radiusInPixels

  return {
    ...styleCircleSize.value,
    left: `calc(50% - ${posValue}px`,
    top: `calc(50% - ${posValue}px`,
  }
})

const styleInnerCircle = computed(() => {
  const k = 0.75
  const size = Math.ceil(props.radiusInPixels * 2 * k)
  const halfSize = Math.ceil(size / 2)

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `calc(50% - ${halfSize}px)`,
    top: `calc(50% - ${halfSize}px)`,
  }
})

const itemHeight = computed(() => {
  const r = radian(props.itemSizeInDegrees / 2)

  return 2 * itemsCircleRadius.value * Math.sin(r)
})

const items = computed(() => {
  let items = props.options

  if (props.reverse) {
    items = items.reverse()
  }

  return items.slice().map((e, index) => {
    const angle = props.itemSizeInDegrees * index
    const radian = radian(angle + 90)
    let k = 1

    if (this.isTypeText) {
      k = 1.15
    }

    const circleRadius = (itemsCircleRadius, value * k)
    const styles = {
      width: `${2 * itemRadius.value }px`,
      height: `${2 * itemRadius.value }px`,
      top: `calc(50% - ${itemRadius.value}px)`,
      left: `calc(50% - ${itemRadius.value }px)`,
      transform: `translateX(${circleRadius * Math.cos(radian).toFixed(6)}px) translateY(${-circleRadius * Math.sin(radian).toFixed(6)}px) rotate(${270 - angle}deg)`,
    }

    return {
      id: index,
      data: e,
      angle,
      styles,
    }
  })
})

const selectedItem = computed(() => {
  if (value?.value !== undefined && value.value !== null) {
    return items.value.find(item => item.id === value.value)
  }

  return items.value[Math.ceil(items.value.length / 2) - 1]
})

const selectedItemIndex = computed(() => items.value.indexOf(this.selectedItem))
const viewParamsChangeTrigger = computed(() => `${props.radiusInPixels}${props.itemSizeInDegrees}`)

watch(() => value, () => {
  setRotation()
})

watch(() => viewParamsChangeTrigger, () => {
  makeDraggable()
  setRotation()
})


onMounted(() => {
  const item = selectedItem.value
  triggerChange(item.id)
  makeDraggable()
  setRotation(false)
})

const radian = (n) => {
  return n * (Math.PI / 180)
}

const makeDraggable = () => {
  const carousel = this.$refs.carousel

  if (draggable.value) {
    draggable.value.kill()
  }

  const itemsAngles = items.value.map(item => item.angle)
  const itemsLength = itemsAngles.length

  const ctx = this
  draggable.value = this.$Draggable.create(carousel, {
    type: 'rotation',
    edgeResistance: 0.9,
    cursor: 'default',
    activeCursor: 'default',
    allowEventDefault: true,
    bounds: {
      minRotation: itemsAngles[0],
      maxRotation: itemsAngles[itemsLength - 1],
    },
    snap: itemsAngles,
    onDragEnd() {
      const rotation = ctx.draggable.rotation
      ctx.checkAngleMatchItem(rotation)
    },
  })[0]
}

const setRotation = (animate = true) => {
  const carousel = value

  this.$gsap.killTweensOf(carousel)
  this.$gsap.to(carousel, {
    rotate: selectedItem.value.angle,
    duration: animate
      ? '0.3'
      : '0',
  })
}

const triggerChange = (e) => {
  value?.value = e
  emit('input', e)
}
</script>

<style lang="scss" scoped>

.circle-slider {
  position: absolute;


  &__image {
    background: rgba(150,107,255,0.53) !important;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 55px;
      display: flex;
    }
  }

  &__wrap {
    position: relative;
  }

  &__container {
    border-radius: 50%;
    position: relative;
  }

  &__selector {
    border-radius: 50%;
    border: 2px solid black;
    box-sizing: border-box;
    outline: 3px solid #0000;
    pointer-events: none;
    position: absolute;
  }

  &__item {
    margin: 0;
    padding: 0;
    position: absolute;

    > span {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: currentColor;
    }
  }

  &__inner {
    position: absolute;
    border-radius: 50%;
    will-change: transform;
  }
}

.circle-slider__type-text {
  .circle-slider {
    &__item {
      margin: 0;
      padding: 0;
      position: absolute;
      color: black;

      &-active {
        color: #0a0a0a;
      }

      > span {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: currentColor;
      }
      > span {
        background: unset;
      }
    }

    &__selector {
      outline: none;
      background: black;
    }
  }
}

@media only screen and (min-width: 1199px) {
  .circle-slider {
    &__item {
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>

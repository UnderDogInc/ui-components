<script setup lang="ts">
import InfiniteLoading from "v3-infinite-loading"
import "v3-infinite-loading/lib/style.css"

const props = defineProps({
  top: {
    type: Boolean,
    required: false,
  },
  target: {
    type: [String, Boolean],
    required: false,
  },
  distance: {
    type: Number,
    required: false,
    default: 0,
  },
  identifier: {
    required: false,
  },
  firstload: {
    type: Boolean,
    required: false,
    default: true,
  },
  slots: {
    type: Object,
    required: false,
  },
})

const emits = defineEmits(['infinite'])
</script>

<template>
  <div
    class="ui-flex ui-items-center ui-justify-center"
  >
    <InfiniteLoading
      :top="props.top"
      :target="props.target"
      :distance="props.distance"
      :identifier="props.identifier"
      :firstload="props.firstload"
      :slots="props.slots"
      @infinite="emits('infinite', $event)"
    >
      <template
        v-if="$slots.spinner"
        #spinner
      >
        <slot
          name="spinner"
        />      
      </template>
      <template #complete>
        <slot
          name="complete"
        />
      </template>
      <template #error="item">
        <slot
          name="error"
          v-bind="item"
        />
      </template>
    </InfiniteLoading>
  </div>
</template>
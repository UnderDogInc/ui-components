<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { throttle } from '../../../assets/utils/utils'
import '@fullcalendar/core/vdom'
import FullCalendar, { CalendarOptions, DatesSetArg, EventClickArg, EventContentArg, EventSourceInput } from '@fullcalendar/vue3'
import ruLocale from '@fullcalendar/core/locales/ru'
import interactionPlugin from '@fullcalendar/interaction'
import daygrid from '@fullcalendar/daygrid'
import timegrid from '@fullcalendar/timegrid'
import './MScheduler.scss'


const props = defineProps({
  events: {
    type: Array as PropType<EventSourceInput>,
    default: () => [],
  },
})

const emits = defineEmits(['updateDataRange', 'clickEvent'])

const isMobile = ref(window.innerWidth <= 768)

const calendar = ref()

const calendarOptions = computed((): undefined | CalendarOptions => ({
  plugins: [ interactionPlugin, daygrid, timegrid ],
  initialView: isMobile.value
    ? 'timeGridDay'
    : 'dayGridMonth',
  locale: ruLocale,
  displayEventTime: false,
  eventClick: (e: EventClickArg) => {
    const event = e.event

    emits('clickEvent', {
      start: event.start,
      end: event.end,
      id: event.id,
      ...event.extendedProps,
    })
  },
  datesSet: (a: DatesSetArg) => {
    emits('updateDataRange', {
      start: a.start,
      end: a.end,
    })
  },
  eventContent: (arg: EventContentArg) => {
    const event = arg.event

    if (!arg.view.type.includes('time')) {
      const hoursStart = new Date(event.start || '').getHours()
      const minutesStart = new Date(event.start || '').getMinutes()

      const timeStart = `${hoursStart < 10
        ? `0${hoursStart}`
        : hoursStart}:${minutesStart < 10
        ? `0${minutesStart}`
        : minutesStart}`
      
      const firstLetters = (event.extendedProps.user.full_name as string).split(' ').slice(0, 2).map(el => el[0]).join('')
              
      let customHtml = ''
      customHtml += "<div class='ui-min-w-[16px] ui-text-center ui-h-[16px] ui-w-[16px] ui-text-[8px] ui-mr-[4px] ui-text-white-900 ui-font-semibold ui-leading-[16px] ui-rounded-[50%] ui-bg-orange-500'>" + firstLetters + "</div>"
      customHtml += "<div class='ui-mr-[4px] ui-text-p12-semibold ui-truncate ui-leading-[16px] ui-text-p14-semibold ui-font-semibold'>" + event.extendedProps.user.full_name + "</div>"
      customHtml += "<div class='ui-text-p12-semibold ui-font-semibold ui-text-[10px] ui-rounded-base ui-px-[4px] ui-bg-black-50 ui-leading-[160%]'>" + timeStart + "</div>"
      
      return { html: customHtml }
    }
    else {
      const minutesStart = new Date(event.start || '').getMinutes()
      const hoursStart = new Date(event.start || '').getHours()
      const timeStart = `${hoursStart < 10
        ? `0${hoursStart}`
        : hoursStart}:${minutesStart < 10
        ? `0${minutesStart}`
        : minutesStart}`
      
      const minutesEnd = new Date(event.end || '').getMinutes()
      const hoursEnd = new Date(event.end || '').getHours()
      const timeEnd = `${hoursEnd < 10
        ? `0${hoursEnd}`
        : hoursEnd}:${minutesEnd < 10
        ? `0${minutesEnd}`
        : minutesEnd}`
        
      let customHtml = ''
      customHtml += '<div class="ui-truncate ui-text-black-900 ui-text-p12-semibold ui-font-semibold ui-leading-[14px]">' + event.extendedProps.user.full_name + '</div>'

      customHtml += "<div class='ui-text-black-900 ui-text-p14-semibold ui-font-semibold ui-rounded-base ui-px-[4px] ui-max-w-max ui-bg-black-50'><span class='ui-truncate ui-block'>" + timeStart + '-' + timeEnd +  "</span></div>"


      return { html: customHtml}
    }

                          
  },
  events: props.events || undefined,
  headerToolbar: {
    start: 'title',
    center: 'today prev,next',
    end: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
}))

const resize = throttle((): void => {
  if (window.innerWidth < 768) {
    if (calendar.value && calendar.value.getApi() && calendar.value.getApi().view.type !== 'timeGridDay') {
      calendar.value.getApi().changeView('timeGridDay')
    }

    isMobile.value = true
  }
  else {
    isMobile.value = false
  }
}, 250)

</script>
<template>
  <FullCalendar
    v-resize="resize"
    v-bind="$attrs"
    ref="calendar"
    v-bind:options="calendarOptions"
  />
</template>
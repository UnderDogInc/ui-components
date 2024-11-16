import MList from './MList.vue'
import MListItemButton from './MListItemButton.vue'
import MListItemDefault from './MListItemDefault.vue'
import CalendarIcon from '@/components/icon/CalendarIcon.vue'


export default {
  title: 'List',
  component: MList,
}

const Template = (args) => ({
  components: {
    MList,
    MListItemButton,
    MListItemDefault,
    CalendarIcon,
  },
  data() {
    return {
      currentValue: {
        value: 'shoes',
        title: 'Обувь',
      },
    }
  },
  setup() {
    return { args }
  },
  template: `
  <m-list v-model="currentValue" v-bind="args">
    <template v-if="false" #actions>
      <m-list-item-button>
        <template #prepend-icon>
          <calendar-icon 
            class="ui-mr-[8px] ui-w-[24px] ui-h-[24px] ui-transition ui-duration-300 ui-stroke-black-900"
          />
        </template>
        Выбрать диапазон
      </m-list-item-button>
    </template>
  </m-list>
  `,
})

export const Default = Template.bind({})
Default.args = {
  items: [
    {
      value: 'shoes',
      title: 'Обувь',
    },
    {
      value: 'clothes',
      title: 'Одежда',
    },
    {
      value: 'asessuiry',
      title: 'Аксессуары',
      isButton: true,
    },
    {
      value: 'asessuiry-disabled',
      title: 'Аксессуары disabled',
      isButton: true,
      isDisabled: true,
    },
    {
      value: 'clothes-disabled',
      title: 'Одежда disabled',
      isDisabled: true,
    },
  ],
}


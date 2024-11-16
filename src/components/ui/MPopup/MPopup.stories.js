import MPopup from './MPopup.vue'
import MSelect from '../MSelect'
import {color} from '@/assets/utils/ColorClassConfig'
import { ref } from 'vue'


export default {
  title: 'Popup',
  component: MPopup,
  argTypes: {
    colorTitle: {
      options: Object.keys(color),
      control: { type: 'select' },
    },
    bgColor: {
      options: Object.keys(color),
      control: { type: 'select' },
    },
    brightnessTitle: {
      options: ['900', '500', '100', '50'],
      control: { type: 'select' },
    },
    bgBrightness: {
      options: ['900', '500', '100', '50'],
      control: { type: 'select' },
    },
  },
}

const Template = (args) => ({
  components: { 
    MPopup,
    MSelect,
  },
  data() {
    return {
      isOpen: false,
      target: null,
    }
  },
  mounted() {
    this.target = this.$refs.target
  },
  setup() {
    const test = ref()

    const currentDateRange = ref([{
      title: 'За 7 дней',
      value: 'week',
    }])
    const itemsList = [
      {
        title: 'За 7 дней',
        value: 'week',
      },
      {
        title: 'За месяц',
        value: 'mounth',
      },
      {
        title: 'За год',
        value: 'yaer',
      },
      {
        title: 'За все время',
        value: 'all time',
      },
    ]
    
    return {
      args,
      test,
      currentDateRange,
      itemsList,
    }
  },
  template: `
    <div
      class="ui-h-[2000px]"
      ref="test"
    >
      <div
        @click="isOpen = true"
        ref="target"
      >
        open
      </div>
      <m-popup
        v-model="isOpen"
        v-bind="args"
        class="test"
      >
        <div>
          <m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          /><m-select
            v-model="currentDateRange"
            multiple
            :close-on-click="false"
            :items="itemsList"
          />
        </div>
        <template #footer>
          footer
        </template>
      </m-popup>
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {
  colorTitle: 'red',
  brightnessTitle: '100',
  title: 'Добавление бонусов на баланс',
  position: {
    x: 'right',
  },
}
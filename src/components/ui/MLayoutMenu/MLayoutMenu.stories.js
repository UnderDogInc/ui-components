import MLayoutMenu from './MLayoutMenu.vue'
import MSelect from '../MSelect'
import MBottomSheet from '../MBottomSheet'
import MIcon from '../MIcon'
import MInput from '../MInput'
import MCalendar from '../MCalendar'
import MList from '../MList'
import MListItemDefault from '../MList/listDefault'
import SettingsIcon from '../../icon/SettingsIcon.vue'
import CalendarIcon from '../../icon/CalendarIcon.vue'

import { ref, watch } from 'vue'

export default {
  title: 'MLayoutMenu',
  component: MLayoutMenu,
}

const Template = (args) => ({
  components: {
    MLayoutMenu,
    MSelect,
    MBottomSheet,
    MIcon,
    SettingsIcon,
  },
  data() {
    return {
      input: '',
    }
  },
  setup() {
    const value = ref({
      title: 'title 1',
      value: 'value 1',
    })
    const items = [
      {
        title: 'title 1',
        value: 'value 1',
      },
      {
        title: 'title 2',
        value: 'value 2',
      },
      {
        title: 'title 3',
        value: 'value 3',
      },
    ]

    return {
      args,
      items,
      value,
    }
  },
  template: `
    <div
      class="ui-flex ui-justify-end"
    >
      <MLayoutMenu
        v-bind="args"
      >
        <template #activator="{on}">
          <m-icon
            v-on="on"
            class="cursor-pointer group"
            :bg-color="'black'"
            :brightness="'50'"
            padding="8px"
          >
            <SettingsIcon
              class="group-hover:stroke-black-900 transition-[stroke] duration-300 ease"
              width="24px"
              height="24px"
              fill="#9A9FA5"
            />
          </m-icon>
        </template>
        <div>
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
        </div>
      </MLayoutMenu>
    </div>
    <MBottomSheet
      :model-value="false"
    >
      <MSelect
        :items="items"
        v-model="value"
        v-bind="args"
      />
    </MBottomSheet>
  `,
})

export const Default = Template.bind({})

Default.args = {
  top: true,
  attach: true,
}

const Template2 = (args) => ({
  components: {
    MLayoutMenu,
    MSelect,
    MBottomSheet,
    MIcon,
    SettingsIcon,
    MCalendar,
    MList,
    MListItemDefault,
    MInput,
    CalendarIcon,
  },
  setup() {
    const currentDateRange = ref({
      title: 'За 7 дней',
      value: 'week',
    })

    const conuntOpenMenu = ref(0) 

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

    watch(currentDateRange, () => {
      setTimeout(() => {
        conuntOpenMenu.value = 1
      }, 0)
    })

    const closeCalendar = () => {
      conuntOpenMenu.value--
    }
    
    const updateCountOpenMenu = (index) => {
      conuntOpenMenu.value = index
    }

    return {
      args,
      itemsList,
      currentDateRange,
      conuntOpenMenu,
      closeCalendar,
      updateCountOpenMenu,
    }
  },
  template: `
  <div
    class="ui-flex"
  >
    <MLayoutMenu
      :is-open="conuntOpenMenu >= 1"
      offset-y
      nudgeBottom="12"
      @clickOutside="updateCountOpenMenu(1)"
      :closeOnOutsideClick="conuntOpenMenu === 1"
      @openMenu="updateCountOpenMenu(1)"
    >
      <template #activator="{on}">
        <m-icon
          v-on="on"
          class="cursor-pointer group"
          :bg-color="'black'"
          :brightness="'50'"
          padding="8px"
        >
          <SettingsIcon
            class="group-hover:stroke-black-900 transition-[stroke] duration-300 ease"
            width="24px"
            height="24px"
            fill="#9A9FA5"
          />
        </m-icon>
      </template>
      <MLayoutMenu
        :is-open="conuntOpenMenu >= 2"
        offset-x
        nudgeRight="12"
        :closeOnOutsideClick="conuntOpenMenu === 2"
        @openMenu="updateCountOpenMenu(2)"
        @clickOutside="updateCountOpenMenu(2)"
      >
        <template #activator="{on}">
          <div>
            <MListItemDefault
              v-on="on"
            >
              {{ currentDateRange.title }}
            </MListItemDefault>
          </div>
        </template>
        <MLayoutMenu
          :is-open="conuntOpenMenu >= 3"
          offset-x
          nudgeRight="12"
          :closeOnOutsideClick="conuntOpenMenu === 3"
          @openMenu="updateCountOpenMenu(3)"
          @clickOutside="updateCountOpenMenu(3)"
        >
          <template #activator="{on}">
            <MList
              :items="itemsList"
              v-model="currentDateRange"
            >
              <template #actions>
                <m-input
                  v-on="on"
                  :model-value="currentDateRange.isDate ? currentDateRange.title : ''"
                  isReadonly
                  :appendIconOptions="{
                    border: true,
                    bgColor: true,
                  }"
                >
                  <template #append-icon="{isFocus}">
                    <CalendarIcon
                      width="20px"
                      height="20px"
                      :fill="isFocus ? '#1A1D1F' : '#9A9FA5'"
                    />
                  </template>
                  Произвольная дата
                </m-input>
              </template>
            </MList>
          </template>
          <MCalendar
            canClose
            @close-calendar="closeCalendar"
            v-model="currentDateRange"
          />
        </MLayoutMenu>
      </MLayoutMenu>
    </MLayoutMenu>
  </div>
  `,
})

export const OtherTest = Template2.bind({})


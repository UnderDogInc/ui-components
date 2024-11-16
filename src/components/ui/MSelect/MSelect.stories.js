import MSelect from './MSelect.vue'
import CalendarIcon from '@/components/icon/CalendarIcon.vue'
import MList from '@/components/ui/MList'
import MCalendar from '@/components/ui/MCalendar/MCalendar.vue'
import MLayoutMenu from '../MLayoutMenu'
import MInput from '../MInput'
import { ref, watch } from 'vue'


export default {
  title: 'Select',
  component: MSelect,

  argTypes: {
    ...MLayoutMenu.props,
  },
}

const Template = (args) => ({
  components: {
    MSelect,
    CalendarIcon,
    MList,
    MCalendar,
    MInput,
    MLayoutMenu,
  },
  data() {
    return {
      select: {
        value: '',
        title: '',
      },
    }
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
      {
        title: 'За все время disabled',
        value: 'all time disabled',
        isDisabled: true,
      },
    ]

    watch(currentDateRange, () => {
      setTimeout(() => {
        conuntOpenMenu.value = 0
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
  <m-select
    v-model="currentDateRange"
    v-bind="args"
    :is-open="conuntOpenMenu >= 1"
    offset-y
    nudgeBottom="12"
    :closeOnOutsideClick="conuntOpenMenu === 1"
    :closeOnClick="false"
    @clickOutside="updateCountOpenMenu(1)"
    @openMenu="updateCountOpenMenu(1)"
  >      
    <template #label>
      По товарам
    </template>

    <MLayoutMenu
      :is-open="conuntOpenMenu >= 2"
      offset-x
      nudgeRight="12"
      :closeOnOutsideClick="conuntOpenMenu === 2"
      :closeOnClick="false"
      @clickOutside="updateCountOpenMenu(1)"
      @openMenu="updateCountOpenMenu(2)"
    >
      <template #activator="{on}">
        <MList
          v-model="currentDateRange"
          :items="itemsList"
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
  </m-select>

  `,
})


export const SelectTime = Template.bind({})
SelectTime.args = {
}

const TemplateMulti = (args) => ({
  components: {
    MSelect,
  },
  data() {
    return {
      select: [],
    }
  },
  setup() {
    return { args }
  },
  template: `
  <m-select v-model="select" v-bind="args">      
    <template #label>
			Добавьте свойства
    </template>
  </m-select>

  `,
})


export const Multi = TemplateMulti.bind({})
Multi.args = {
  items: [
    {
      value: 'new',
      title: 'Новинки',
    },
    {
      value: 'sale',
      title: 'Акции',
    },
    {
      value: 'some',
      title: 'Подборка',
    },
    {
      value: 'recomendet',
      title: 'Рекомендованные',
    },
    {
      value: 'new1',
      title: 'Новинки',
    },
    {
      value: 'sal1e',
      title: 'Акции',
    },
    {
      value: 'some',
      title: 'Подборка',
    },
    {
      value: 'recomendet1',
      title: 'Рекомендованные',
    },
    {
      value: 'new2',
      title: 'Новинки',
    },
    {
      value: 'sale2',
      title: 'Акции',
    },
    {
      value: 'some',
      title: 'Подборка',
    },
    {
      value: 'recomendet2',
      title: 'Рекомендованные',
    },
  ],
  multiple: false,
  // chips: true,
  'maxHeightList': '400px',
  clearable: true,
  placeholder: 'placeholder',
}

export const Disable = TemplateMulti.bind({})
Disable.args = {
  isReadonly: true,
  placeholder: 'placeholder',
}

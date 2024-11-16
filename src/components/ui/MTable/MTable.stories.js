import { ref, watch } from 'vue'
import MTable from './MTable.vue'
import MPopup from '../MPopup'

export default {
  title: 'Table',
  component: MTable,
}

const Template = (args) => ({
  // 2894|Tl2NoTzLmjY614hrF1HXoQP18iYlD1Zq7jKF8P5O
  components: {
    MTable,
    MPopup,
  },
  setup() {
    const perPage = ref(9)
    const currentPage = ref(1)
    const selectUsers = ref()
    const loading = ref(false)

    const items = ref([])

    const tableHeaders = [
      {
        name: 'ID',
        titleFromSearch: 'По Id',
        value: 'id',
      },
      {
        name: 'Имя',
        value: 'name',
      },
      {
        name: 'Фамилия',
        value: 'surname',
      },
      {
        name: 'Почта',
        titleFromSearch: 'По email',
        value: 'email',
      },
      {
        name: 'Телефон',
        titleFromSearch: 'По номеру телефона',
        value: 'phone',
      },
      {
        name: 'Оператор',
        titleFromSearch: 'По оператору',
        value: 'operator',
      },
      {
        name: 'Статус',
        value: 'type',
      },
      {
        name: 'Кол-во заказов',
        value: 'orders',
      },
      {
        name: 'Дата регистрации',
        value: 'created_at',
      },
    ]

    const clickRow = (item, e) => {
      console.log(e)
    }


    watch(currentPage)

    const test = (items) => {
      console.log(items)
    }

    return {
      clickRow,
      args,
      perPage,
      currentPage,
      tableHeaders,
      selectUsers,
      items,
      loading,
      test,
    }
  },
  template: `
    <button>test</button>
    <m-popup
      :model-value="true"
      title="asdf"
      colorTitle="red"
      brightnessTitle="900"
    >
    <m-table
      v-model="selectUsers"
      v-model:per-page="perPage"
      v-model:page="currentPage"
      can-select
      :loading="loading"
      visibility-pagination
      visibility-per-items
      :headers="tableHeaders"
      v-model:items="items"
      :per-page-items="[9, 18, 27, 36]"
      v-bind="args"
      scrollingSelector=".m-popup"
      can-dnd
      @update:items="test"
      @clickRow="clickRow"
    >
    <template #row-show-details="{toggleDetails, showDetails}">
      <div @click="toggleDetails">
       {{ showDetails }}
      </div>
    </template>
    <template #row-details="{item}">
      <div @click="toggleDetails">
       {{ item }}
      </div>
    </template>
    <template #row-context-menu="{item}">
    <div>
      {{ item.id }}
    </div>
    </template>
    </m-table> 
    </m-popup>
    `,
})

export const Default = Template.bind({})

export const LastOrder = Template.bind({})
LastOrder.args = {
  canDnD: true,
  headers: [
    {
      name: 'ID',
      value: 'id',
      maxWidth: '72px',
    },
    {
      name: 'Cтатус заказа',
      value: 'statusOrder',
      maxWidth: '228px',
    },
    {
      name: 'Дата доставки',
      value: 'dateDelivery',
    },
    {
      name: 'Ожидает возврата',
      value: 'return',
    },
  ],
  "onUpdate:Items": (e) => {
    console.log(e)
  },
  items: [
    {
      id: 10533,
      statusOrder: 'Готовится на отправку от п...',
      dateDelivery: '18.04.2022',
      return: 'Ожидает',
    },
    {
      id: 10534,
      statusOrder: 'Готовится на отправку от п...',
      dateDelivery: '18.04.2022',
      return: 'Ожидает',
    },
    {
      id: 10535,
      statusOrder: 'Готовится на отправку от п...',
      dateDelivery: '18.04.2022',
      return: 'Ожидает',
    },
    {
      id: 10536,
      statusOrder: 'Готовится на отправку от п...',
      dateDelivery: '18.04.2022',
      return: 'Ожидает',
    },
    {
      id: 10537,
      statusOrder: 'Готовится на отправку от п...',
      dateDelivery: '18.04.2022',
      return: 'Ожидает',
    },
    {
      id: 10538,
      statusOrder: 'Готовится на отправку от п...',
      dateDelivery: '18.04.2022',
      return: 'Ожидает',
    },
  ],
  paddingRow: '12px',
  gapRows: '0px',
  borderHeader: true,
  borderRows: true,
}

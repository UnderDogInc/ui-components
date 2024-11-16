import { ref } from 'vue'
import MScheduler from './MScheduler.vue'

export default {
  title: 'Scheduler',
  component: MScheduler,
}

const Template = (args) => ({
  components: {
    MScheduler,
  },
  setup() {
    const events = ref([
      {
        "id": 789,
        "employee_id": 5,
        "user": {
          "id": 9494,
          "uuid": "badc40a5-3f05-4764-9aca-499ee319b0b0",
          "full_name": "Сивкова Надежда",
        },
        "description": null,
        "start": "2022-10-01T06:00:00.000000Z",
        "end": "2022-10-01T15:00:00.000000Z",
        "created_at": "2022-09-25T15:44:48.000000Z",
        "updated_at": "2022-09-25T15:44:48.000000Z",
      },
      {
        "id": 793,
        "employee_id": 4,
        "user": {
          "id": 9061,
          "uuid": "13e61734-fd16-4e23-b63e-08dc0a181fde",
          "full_name": "Носков Виталий",
        },
        "description": null,
        "start": "2022-10-01T07:00:00.000000Z",
        "end": "2022-10-01T16:00:00.000000Z",
        "created_at": "2022-09-25T15:53:12.000000Z",
        "updated_at": "2022-09-25T15:53:12.000000Z",
      },
      {
        "id": 794,
        "employee_id": 4,
        "user": {
          "id": 9061,
          "uuid": "13e61734-fd16-4e23-b63e-08dc0a181fde",
          "full_name": "Носков Виталий",
        },
        "description": null,
        "start": "2022-10-02T07:00:00.000000Z",
        "end": "2022-10-02T16:00:00.000000Z",
        "created_at": "2022-09-25T15:53:54.000000Z",
        "updated_at": "2022-09-25T15:53:54.000000Z",
      },
      {
        "id": 811,
        "employee_id": 5,
        "user": {
          "id": 9494,
          "uuid": "badc40a5-3f05-4764-9aca-499ee319b0b0",
          "full_name": "Сивкова Надежда",
        },
        "description": null,
        "start": "2022-10-03T06:00:00.000000Z",
        "end": "2022-10-03T15:00:00.000000Z",
        "created_at": "2022-09-28T10:40:00.000000Z",
        "updated_at": "2022-09-28T10:40:00.000000Z",
      },
      {
        "id": 816,
        "employee_id": 4,
        "user": {
          "id": 9061,
          "uuid": "13e61734-fd16-4e23-b63e-08dc0a181fde",
          "full_name": "Носков Виталий",
        },
        "description": null,
        "start": "2022-10-03T07:00:00.000000Z",
        "end": "2022-10-03T16:00:00.000000Z",
        "created_at": "2022-09-28T10:45:43.000000Z",
        "updated_at": "2022-09-28T10:45:43.000000Z",
      },
      {
        "id": 812,
        "employee_id": 5,
        "user": {
          "id": 9494,
          "uuid": "badc40a5-3f05-4764-9aca-499ee319b0b0",
          "full_name": "Сивкова Надежда",
        },
        "description": null,
        "start": "2022-10-04T06:00:00.000000Z",
        "end": "2022-10-04T15:00:00.000000Z",
        "created_at": "2022-09-28T10:40:52.000000Z",
        "updated_at": "2022-09-28T10:40:52.000000Z",
      },
      {
        "id": 822,
        "employee_id": 4,
        "user": {
          "id": 9061,
          "uuid": "13e61734-fd16-4e23-b63e-08dc0a181fde",
          "full_name": "Носков Виталий",
        },
        "description": null,
        "start": "2022-10-04T07:00:00.000000Z",
        "end": "2022-10-04T16:00:00.000000Z",
        "created_at": "2022-09-28T10:53:44.000000Z",
        "updated_at": "2022-09-28T11:26:33.000000Z",
      },
      {
        "id": 813,
        "employee_id": 5,
        "user": {
          "id": 9494,
          "uuid": "badc40a5-3f05-4764-9aca-499ee319b0b0",
          "full_name": "Сивкова Надежда",
        },
        "description": null,
        "start": "2022-10-05T06:00:00.000000Z",
        "end": "2022-10-05T15:00:00.000000Z",
        "created_at": "2022-09-28T10:42:35.000000Z",
        "updated_at": "2022-09-28T10:42:35.000000Z",
      },
      {
        "id": 817,
        "employee_id": 4,
        "user": {
          "id": 9061,
          "uuid": "13e61734-fd16-4e23-b63e-08dc0a181fde",
          "full_name": "Носков Виталий",
        },
        "description": null,
        "start": "2022-10-05T07:00:00.000000Z",
        "end": "2022-10-05T16:00:00.000000Z",
        "created_at": "2022-09-28T10:46:36.000000Z",
        "updated_at": "2022-09-28T10:46:36.000000Z",
      },
      {
        "id": 818,
        "employee_id": 4,
        "user": {
          "id": 9061,
          "uuid": "13e61734-fd16-4e23-b63e-08dc0a181fde",
          "full_name": "Носков Виталий",
        },
        "description": null,
        "start": "2022-10-06T07:00:00.000000Z",
        "end": "2022-10-06T16:00:00.000000Z",
        "created_at": "2022-09-28T10:48:50.000000Z",
        "updated_at": "2022-09-28T10:48:50.000000Z",
      },
      {
        "id": 815,
        "employee_id": 5,
        "user": {
          "id": 9494,
          "uuid": "badc40a5-3f05-4764-9aca-499ee319b0b0",
          "full_name": "Сивкова Надежда",
        },
        "description": null,
        "start": "2022-10-07T06:00:00.000000Z",
        "end": "2022-10-07T15:00:00.000000Z",
        "created_at": "2022-09-28T10:44:13.000000Z",
        "updated_at": "2022-09-28T10:44:13.000000Z",
      },
      {
        "id": 819,
        "employee_id": 5,
        "user": {
          "id": 9494,
          "uuid": "badc40a5-3f05-4764-9aca-499ee319b0b0",
          "full_name": "Сивкова Надежда",
        },
        "description": null,
        "start": "2022-10-08T06:00:00.000000Z",
        "end": "2022-10-08T15:00:00.000000Z",
        "created_at": "2022-09-28T10:49:49.000000Z",
        "updated_at": "2022-09-28T11:25:45.000000Z",
      },
      {
        "id": 820,
        "employee_id": 4,
        "user": {
          "id": 9061,
          "uuid": "13e61734-fd16-4e23-b63e-08dc0a181fde",
          "full_name": "Носков Виталий",
        },
        "description": null,
        "start": "2022-10-09T07:00:00.000000Z",
        "end": "2022-10-09T16:00:00.000000Z",
        "created_at": "2022-09-28T10:50:29.000000Z",
        "updated_at": "2022-09-28T10:50:29.000000Z",
      },
      {
        "id": 832,
        "employee_id": 4,
        "user": {
          "id": 9061,
          "uuid": "13e61734-fd16-4e23-b63e-08dc0a181fde",
          "full_name": "Носков Виталий",
        },
        "description": null,
        "start": "2022-10-10T07:00:00.000000Z",
        "end": "2022-10-10T16:00:00.000000Z",
        "created_at": "2022-09-28T11:31:29.000000Z",
        "updated_at": "2022-09-28T11:31:29.000000Z",
      },
      {
        "id": 840,
        "employee_id": 4,
        "user": {
          "id": 9061,
          "uuid": "13e61734-fd16-4e23-b63e-08dc0a181fde",
          "full_name": "Носков Виталий",
        },
        "description": null,
        "start": "2022-10-11T07:00:00.000000Z",
        "end": "2022-10-11T16:00:00.000000Z",
        "created_at": "2022-10-09T13:06:15.000000Z",
        "updated_at": "2022-10-09T13:06:15.000000Z",
      },
      {
        "id": 848,
        "employee_id": 5,
        "user": {
          "id": 9494,
          "uuid": "badc40a5-3f05-4764-9aca-499ee319b0b0",
          "full_name": "Сивкова Надежда",
        },
        "description": null,
        "start": "2022-10-12T06:00:00.000000Z",
        "end": "2022-10-12T15:00:00.000000Z",
        "created_at": "2022-10-09T13:16:52.000000Z",
        "updated_at": "2022-10-12T07:06:17.000000Z",
      },
      {
        "id": 841,
        "employee_id": 4,
        "user": {
          "id": 9061,
          "uuid": "13e61734-fd16-4e23-b63e-08dc0a181fde",
          "full_name": "Носков Виталий",
        },
        "description": null,
        "start": "2022-10-12T07:00:00.000000Z",
        "end": "2022-10-12T16:00:00.000000Z",
        "created_at": "2022-10-09T13:08:10.000000Z",
        "updated_at": "2022-10-09T13:08:10.000000Z",
      },
    ])

    const addEvent = () => {
      events.value.push({
        "id": 841,
        "employee_id": 4,
        "user": {
          "id": 9061,
          "uuid": "13e61734-fd16-4e23-b63e-08dc0a181fde",
          "full_name": "Носков Виталий",
        },
        "description": null,
        "start": "2022-10-12T07:00:00.000000Z",
        "end": "2022-10-12T16:00:00.000000Z",
        "created_at": "2022-10-09T13:08:10.000000Z",
        "updated_at": "2022-10-09T13:08:10.000000Z",
      })
    }

    const clickEvent = (e) => {
      console.log(e)
    }

    return {
      args,
      events,
      addEvent,
      clickEvent,
    }
  },
  template: `<div @click="addEvent">addd</div><MScheduler @updateDataRange="clickEvent" :events="events"/>`,
})

export const Default = Template.bind({})

Default.args = {
}
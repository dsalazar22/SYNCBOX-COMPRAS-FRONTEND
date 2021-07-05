<template>
    <div>
       <!-- <gantt-elastic :options="options" :tasks="tasks">
      <gantt-header slot="header"></gantt-header>
    </gantt-elastic> -->
    </div>
</template>
<script>
// import GanttElastic from "gantt-elastic/src/GanttElastic.vue";
// import GanttHeader from "gantt-elastic/src/components/Header.vue";
import dayjs from "dayjs";
import { infoplanning } from "@/components/i40/js/iplanning";
// just helper to get current dates
function getDate(hours) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const timeStamp = new Date(
    `${currentYear}-${currentMonth}-${currentDay} 00:00:00`
  ).getTime();
  return new Date(timeStamp + hours * 60 * 60 * 1000).getTime();
}

let options = {
  taskMapping: {
    progress: "percent"
  },
  maxRows: 100,
  maxHeight: 300,
  title: {
    label: "",
    html: false
  },
  row: {
    height: 24
  },
  calendar: {
    hour: {
      display: true
    }
  },
  chart: {
    progress: {
      bar: false
    },
    expander: {
      display: true
    }
  },
  taskList: {
    expander: {
      straight: false
    },
    columns: [
      {
        id: 1,
        label: "ID",
        value: "id",
        width: 40
      },
      {
        id: 2,
        label: "Description",
        value: "label",
        width: 200,
        expander: true,
        html: true,
        events: {
          click({ data, column }) {
            alert("description clicked!\n" + data.label);
          }
        }
      },
      {
        id: 3,
        label: "Assigned to",
        value: "user",
        width: 130,
        html: true
      },
      {
        id: 3,
        label: "Start",
        value: task => dayjs(task.start).format("YYYY-MM-DD"),
        width: 78
      },
      // {
      //   id: 4,
      //   label: "Type",
      //   value: "type",
      //   width: 68
      // },
      {
        id: 5,
        label: "%",
        value: "progress",
        width: 35,
        style: {
          "task-list-header-label": {
            "text-align": "center",
            width: "100%"
          },
          "task-list-item-value-container": {
            "text-align": "center",
            width: "100%"
          }
        }
      }
    ]
  },
  locale: {
    code: "en",
    Now: "Now",
    "X-Scale": "Zoom-X",
    "Y-Scale": "Zoom-Y",
    "Task list width": "Task list",
    "Before/After": "Expand",
    "Display task list": "Task list"
  }
};


export default {
  name: "Gantt",
  components: {
    // GanttElastic,
    // GanttHeader
  },
  
  data() {
    return {
      tasks:[],
      options
    };
  },
  methods: {
    cargar_actividades(){
      this.tasks = [
        {
          id: 0,
          label: "NA",
          user:
            'NA',
          start: getDate(-24 * 5),
          duration: 0,
          percent: 0,
          type: "NA"
          //collapsed: true,
        },
      ];
    },
//51133
    cargar_calendario(value){
      let order = {}
      order.consecutive_order = value
        infoplanning.getplanninginfo(order, 'info-gantt-production-order').then(data => {
          this.tasks = data.data
      })
    },
  },
  created() {
    this.cargar_actividades()
  },
};
</script>
<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Estado de la Planta
      <!-- <div class="text-muted text-tiny mt-1"><small class="font-weight-normal">Today is Tuesday, 8 February 2018</small></div> -->
    </h4>

    <!-- {{commercial_data[0].detallecolor}} -->
    
    <h1 class="display-4">
        <!-- {{numberWithCommas(0)}} -->
        <div class="small ml-2">
            {{numberWithCommas(planning_data.programmed)}} / {{numberWithCommas(planning_data.available)}} 
            <!-- {{planning_data}} -->
             <div class="float-right mr-2"> {{ ((planning_data.programmed/planning_data.available)*100).toFixed(2) }}% </div>
        </div>
        <b-progress :value="((planning_data.programmed/planning_data.available)*100) " height="5px" class="rounded-0" />
                                        
        <!-- <hr> -->
        <p class="text-center mt-2" style="font-size: 2rem;">
                Ocupacion Total
        </p>
    </h1>
    
    <div v-for="item in planning_data.wgroups">
        <b-card no-body :class="'shadow mb-1 border border-secondary bg-white'">
            <h1 class="display-3 text-center text-dark mt-2">
                    {{item.description}}
                <hr>
            </h1>
            <h1 class="display-4 text-dark">
                     <div class="small ml-2">
                         
                            {{numberWithCommas(item.programmed)}} / {{numberWithCommas(item.planned)}}
                        
                        <!-- {{item}} -->
                        <div class="float-right mr-2"> {{ ((item.programmed/item.planned)*100).toFixed(2) }}% </div>
                        <b-progress :value="((item.programmed/item.planned)*100) " height="5px" class="rounded-0" />
                    </div>
            </h1>

            <b-row>
                <b-col v-for="ii in item.workstations" xs="12" md="6" class="mt-1">
                    <div class="ml-2 mr-2">
                        <b-card no-body class="shadow mb-1 border border-secondary bg-white border-secondary">
                            <h4 class="text-center mt-2" style="margin:0px;">
                                {{ii.code}}
                            </h4>
                            <div class="mb-2">
                                &nbsp;&nbsp;{{numberWithCommas(ii.programmed)}} / {{numberWithCommas(ii.planned)}}
                                
                                <!-- {{ii}} -->
                                <div class="float-right mr-2"> {{ ((ii.programmed/ii.planned)*100).toFixed(2) }}% </div>
                                <b-progress :value="((ii.programmed/ii.planned)*100) " height="5px" class="rounded-0" />
                            </div>
                        </b-card>
                    </div>
                </b-col>
            </b-row>
        </b-card>
    </div>


  </div>
</template>

<script>
// import Vue from 'vue'
// import VueChartJs from 'vue-chartjs'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import { infoplanning } from "@/components/i40/js/iplanning";
import {reports} from "@/components/i40/js/globals"
// import VueResource from 'vue-resource'

// Vue.use(VueResource)

export default {
  name: 'dashboard-commercial',
  metaInfo: {
    title: 'Estado de la Carga'
  },
  components: {
    PerfectScrollbar
  },

  // Resize charts
  //

  data() {
      return {
          planning_data:[],
      }
  },

  methods: {
    numberWithCommas(x) {
        if(x == null)
            x=0
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    },

    getContentResumen(){
        infoplanning.getfullinfocapacity().then(data =>{
            // console.log(data.data)
            this.planning_data = data.data[0]
        })
    },

   
  },

  mounted(){
      
  },

  created() {
      
      this.getContentResumen()
  },
  
  beforeDestroy () {
  },
}
</script>
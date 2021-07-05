<template>
    <div>
         <div>
          <h2 class="font-weight-light mb-2">001 - Prueba</h2>
        </div>

        <div class="row">
            <div class="col-sm-12 col-md-6">
                 <b-card no-body header="Indicadores Generales" header-tag="h6" class="mb-4 align-middle" 
                     >
                    <b-card-body>
                        <div class="small">
                            Cantidad Pendiente
                        <div class="float-right"> </div>
                        </div>
                        <div class="progress mb-2" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-danger':false, 'bg-success':true}" :style="{width: String(0)}"></div>
                        </div>
                        <div class="small">
                            Disponibilidad <div class="float-right"> </div>
                        </div>
                        <div class="progress mb-2" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-danger':false, 'bg-success':true}" :style="{width: String(0)}"></div>
                        </div>
                        <div class="small">
                            Eficiencia <div class="float-right"> </div>
                        </div>
                        <div class="progress mb-2" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-danger':false, 'bg-success':true}" :style="{width: String(0)}"></div>
                        </div>
                        <div class="small">
                            Calidad <div class="float-right"> </div>
                        </div>
                        <div class="progress mb-2" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-danger':false, 'bg-success':true}" :style="{width: String(0)}"></div>
                        </div>
                        <div class="small">
                            OEE <div class="float-right"> </div>
                        </div>
                        <div class="progress mb-2" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-danger':false, 'bg-success':true}" :style="{width: String(0)}"></div>
                        </div>
                    </b-card-body>
                </b-card>

                <b-card no-body header="Resumen General" header-tag="h6" class="mb-4 align-middle">
                    <b-card-body>
                        <div class="small mb-2">Código de Orden<div class="float-right">1234</div></div>
                        <div class="small mb-2">Fecha Comprometida<div class="float-right">1234</div></div>
                        <div class="small mb-2">Tiempo Estimado de Producción<div class="float-right">1234</div></div>
                        <div class="small mb-2">Velocidad Real/Estandar<div class="float-right"></div></div>

                        <div class="w-100 font-weight-bold"> Información Tiempo </div>

                        <div class="small mb-2 mt-1">Tiempo Total<div class="float-right"></div></div>

                        <div class="row">
                            <div class="col-4">
                                <vc-donut
                                    background="#FFF" foreground="#EEEEEE"
                                    :size="100" unit="px" :thickness="25"
                                    legendPlacement="top"
                                    :sections="sections" :total="100">
                                   <h4 style="margin: 0;">75%</h4> donut consumed
                                </vc-donut>
                            </div>
                            <div class="col-8">
                                <div class="small mb-2">Tiempo Real Trabajado<div class="float-right"></div></div>
                                <div class="small mb-2">Tiempo Microparos<div class="float-right"></div></div>
                                <div class="small mb-2">Tiempo Total Paros<div class="float-right"></div></div>
                            </div>
                        </div>
                        <!-- <button @click="testAAAA()">Randomize</button> -->
                    </b-card-body>
                </b-card>
                <b-card no-body header="Resumen Tiempos" header-tag="h6" class="mb-4 align-middle">
                    <b-card-body>
                        <div class="px-2 mt-4">
                            <dashboard2-chart1 ref="chart1" class="w-100" :height="120" />
                        </div>
                    </b-card-body>
                </b-card>
            </div>
            <div class="col-sm-12 col-md-6">
                  <!-- Team ToDo -->
            <b-card no-body class="mb-4">
                <b-card-header header-tag="h6" class="with-elements">
                    <div class="card-header-title">ESTO-ES-UN-CÓDIGO-DE-MAQUINA-LARGO</div>
                    <div class="card-header-elements ml-auto">
                    </div>
                </b-card-header>
                <div class="d-flex justify-content-end mb-1">
                    <b-nav tabs class="nav-sm tabs-alt mr-2 ml-2">
                        <b-nav-item :active="statistic" @click="statisticInfo">Estadística</b-nav-item>
                        <b-nav-item :active="statistictimes" @click="statisticTimes">Tiempos</b-nav-item>
                        <b-nav-item :active="timeline" @click="timelineInfo">Timeline</b-nav-item>
                    </b-nav>
                </div>
                <perfect-scrollbar style="height: 275px">
                    <b-card-body>
                        <div v-if="statistic">
                            <div class="h5">Resumen General</div>
                            <div class="small">
                                Cantidad Pendiente
                            <div class="float-right"> </div>
                            </div>
                            <div class="progress mb-2" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':false, 'bg-success':true}" :style="{width: String(0)}"></div>
                            </div>
                            <div class="small">
                                Disponibilidad <div class="float-right"> </div>
                            </div>
                            <div class="progress mb-2" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':false, 'bg-success':true}" :style="{width: String(0)}"></div>
                            </div>
                            <div class="small">
                                Eficiencia <div class="float-right"> </div>
                            </div>
                            <div class="progress mb-2" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':false, 'bg-success':true}" :style="{width: String(0)}"></div>
                            </div>
                            <div class="small">
                                Calidad <div class="float-right"> </div>
                            </div>
                            <div class="progress mb-2" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':false, 'bg-success':true}" :style="{width: String(0)}"></div>
                            </div>
                            <div class="small">
                                OEE <div class="float-right"> </div>
                            </div>
                            <div class="progress mb-2" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':false, 'bg-success':true}" :style="{width: String(0)}"></div>
                            </div>
                            <br/>
                            <div class="h5">Información Unidades</div>
                            <div class="row">
                                <div class="col-4">
                                    <vc-donut
                                        background="#FFF" foreground="#EEEEEE"
                                        :size="100" unit="px" :thickness="25"
                                        legendPlacement="top"
                                        :sections="sections" :total="100">
                                    <h4 style="margin: 0;">75%</h4> donut consumed
                                    </vc-donut>
                                </div>
                                <div class="col-8">
                                    <div class="small mb-2">Unidades Esperadas<div class="float-right">1234</div></div>
                                    <div class="small mb-2">Unidades Producidas<div class="float-right">1234</div></div>
                                    <div class="small mb-2">Unidades Defectuosas<div class="float-right">1234</div></div>
                                </div>
                            </div>
                        </div>

                        <div v-if="statistictimes">

                            <div class="row">
                                <div class="col-4">
                                    <vc-donut
                                        background="#FFF" foreground="#EEEEEE"
                                        :size="100" unit="px" :thickness="25"
                                        legendPlacement="top"
                                        :sections="sections" :total="100">
                                    <h4 style="margin: 0;">75%</h4> donut consumed
                                    </vc-donut>
                                </div>
                                <div class="col-8">
                                    <div class="small mb-2">Tiempo Real Trabajado<div class="float-right">1234</div></div>
                                    <div class="small mb-2">Tiempo Microparos<div class="float-right">1234</div></div>
                                    <div class="small mb-2">Tiempo Total Paros
                                    <div class="float-right">1234</div></div>
                                </div>
                            </div>

                            <h5 class="mt-3">Tiempos de Paro</h5>

                            <div>
                                <dashboard2-chart1 ref="chart1" class="w-100" :height="120" />
                                </div>
                        </div>

                        <div v-if="timeline">
                            <light-timeline :items='itemsTimeLine'></light-timeline>
                        </div>

                    <!--  -->
                    </b-card-body>
                </perfect-scrollbar>
            </b-card>
            <!-- / Team ToDo -->
            </div>
        </div>
        <div class="row">
        </div>
    </div>
</template>

<style src="vue-css-donut-chart/dist/vcdonut.css"></style>

<script>
import Vue from 'vue'
import VueChartJs from 'vue-chartjs'
import LightTimeline from "vue-light-timeline";
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';
Vue.use(LightTimeline);
Vue.use(Donut);

Vue.component('dashboard2-chart1', {
  extends: VueChartJs.Bar,
  mounted () {
    this.renderChart({
      datasets: [{
        data: [24, 92, 77, 90, 91, 78, 28, 49, 23, 81, 15, 97, 94, 16, 99, 61,
          38, 34, 48, 3, 5, 21, 27, 4, 33, 40, 46, 47, 48, 18
        ],
        borderWidth: 0,
        backgroundColor: 'rgba(87, 181, 255, 1)'
      }],
      labels: ['Uno 34%', 'ocho', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    }, {
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false
        }]
      },
      legend: {
        display: false
      },
      //responsive: false,
      maintainAspectRatio: false
    })
  }
})


export default {
    components: {
        PerfectScrollbar
  },
  data() {
      return {
          values:[],
          statistic: true,
          timeline: false,
          statistictimes: false,
          itemsTimeLine: '',
          order_id: 0,

           sections: [
          { label: 'Red section', value: 25, color: '#F3823C' },
          { label: 'Green section', value: 25, color: '#FD6586' },
          { label: 'Blue section', value: 25, color: '#3DA3E8' }
        ]
      }
  },
  methods: {
      resultValues(){
          this.values= [{
        data: [11, 92, 77, 90, 91, 78, 28, 49, 23, 81, 15, 97, 94, 16, 99, 61,
          38, 34, 48, 3, 5, 21, 27, 4, 33, 40, 46, 47, 48, 18
        ],
        borderWidth: 0,
        backgroundColor: 'rgba(87, 181, 255, 1)'
      }]
      },
       testAAAA()
    {
        this.resultValues()

          this.$refs.chart1.renderChart({
      datasets: this.values,
      labels: ['Uno 56%', 'dos', 'tres', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    }, {
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false
        }]
      },
      legend: {
        display: false
      },
      //responsive: false,
    //   maintainAspectRatio: false
    })
  },

      statisticInfo(){
          this.statistic=true
          this.timeline=false
          this.statistictimes=false
      },

      timelineInfo(){
          this.statistic=false
          this.timeline=true
          this.statistictimes=false
      },

      statisticTimes(){
          this.statistictimes=true
          this.statistic=false
          this.timeline=false
      },

  },
  created() {
    //   this.testAAAA()
  },
  mounted() {
    //   this.testAAAA()
  },
  updated() {
      
  },
}
</script>


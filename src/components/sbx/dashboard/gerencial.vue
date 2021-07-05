<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Dashboard
      <!-- <div class="text-muted text-tiny mt-1"><small class="font-weight-normal">Today is Tuesday, 8 February 2018</small></div> -->
    </h4>
    <!-- Counters -->

    <div class="row">
      <div class="col-sm-6 col-xl-3">

        <b-card class="mb-4">
          <div class="d-flex align-items-center">
            <div class="lnr lnr-cart display-4 text-success"></div>
            <div class="ml-3">
              <div class="text-muted small">Esperado por Facturar</div>
              <div class="text-large">{{numberWithCommas(contentResumen[1]["result"][2]["total_price"])}}</div>
            </div>
          </div>
        </b-card>

      </div>
      <div class="col-sm-6 col-xl-3">

        <b-card class="mb-4">
          <div class="d-flex align-items-center">
            <div class="lnr lnr-thumbs-up display-4 text-info"></div>
            <div class="ml-3">
              <div class="text-muted small">Real Facturado</div>
              <div class="text-large">{{numberWithCommas(contentResumen[1]["result"][2]["total_real_price"])}}</div>
            </div>
          </div>
        </b-card>

      </div>
      <div class="col-sm-6 col-xl-3">

        <b-card class="mb-4">
          <div class="d-flex align-items-center">
            <div class="lnr lnr-thumbs-down display-4 text-danger"></div>
            <div class="ml-3">
              <div class="text-muted small">Perdido</div>
              <div class="text-large">{{(numberWithCommas(contentResumen[1]["result"][2]["total_price"] - contentResumen[1]["result"][2]["total_real_price"]))}}</div>
            </div>
          </div>
        </b-card>

      </div>
      <div class="col-sm-6 col-xl-3">

        <b-card class="mb-4">
          <div class="d-flex align-items-center">
            <div class="lnr lnr-sad display-4 text-warning"></div>
            <div class="ml-3">
              <div class="text-muted small">Costos por Paros</div>
              <div class="text-large">{{numberWithCommas(contentResumen[1]["result"][1]["workstation_cost"])}}</div>
            </div>
          </div>
        </b-card>

      </div>
    </div>
    <!-- / Counters -->


     <!-- Sale stats -->
        <b-card no-body class="mb-4">
          <b-card-header header-tag="h6" class="with-elements">
            <div class="card-header-title">Información Totalizada</div>
            <div class="card-header-elements ml-auto">
              <!-- <b-btn variant="default" class="btn-xs md-btn-flat">Show more</b-btn> -->
            </div>
          </b-card-header>
          <div class="table-responsive">
            <b-table small show-empty stacked="md" :items="contentResumen[1]['result']" :fields="[{key:'tipo', label:'Concepto'},{key:'time_worked', label:'Tiempo Total'},{key:'total_losttime', label:'Microparos'},{key:'total_price', label:'Venta Esperada'},{key:'total_real_price', label:'Venta Real'},{key:'total_real_diff', label:'Diferencia'},{key:'total_price_lost', label:'Costo Microparos'},{key:'workstation_cost', label:'Costo Centro Trabajo'},]">
            
                <template v-slot:cell(time_worked)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.time_worked)}}
                    </div>
                </template>


                <template v-slot:cell(total_losttime)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_losttime)}}
                    </div>
                </template>
                <template v-slot:cell(total_price)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_price)}}
                    </div>
                </template>
                
                <template v-slot:cell(total_real_price)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_real_price)}}
                    </div>
                </template>
                
                <template v-slot:cell(total_real_diff)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_real_diff)}}
                    </div>
                </template>
                
                <template v-slot:cell(total_price_lost)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_price_lost)}}
                    </div>
                </template>
                
                <template v-slot:cell(workstation_cost)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.workstation_cost)}}
                    </div>
                </template>
            
            </b-table>
          </div>
        </b-card>
        <!-- / Sale stats -->


        <!-- Sales -->
        <b-tabs class="nav-tabs-top mb-4">
          <b-tab title="Centro de Trabajo Tiempo Real" active>
            <b-table small show-empty stacked="md" :items="realtimeResult" :fields="[{key:'centrotrabajo', label:'CT'},{key:'description', label:'Descripcion'},{key:'total_price', label:'Por Facturar'},{key:'total_real_price', label:'Facturado'},{key:'total_real_diff', label:'Diferencia'},{key:'total_price_lost', label:'Microparos'},
                    {key:'total_price_lost', label:'Costo Microparos'},
                    {key:'workstation_cost', label:'Costo Centro Trabajo'},{key:'total', label:'Total'}]">

                <template v-slot:cell(centrotrabajo)="row">
                    <div class="text-left">
                        <div class="row">
                            <div class="col-4">

                                
                                <i class="fas fa-circle text-success" v-if="(row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))<=0 || (row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))>=90">
                                </i>
                                
                                <i class="fas fa-circle text-danger" v-if="(row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))>0 && (row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))<=80">
                                </i>

                                <i class="fas fa-circle text-warning" v-if="(row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))>80 && (row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))<90">
                                </i>

                                {{row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100).toFixed(2) }} %


                            </div>
                            <div lass="col-8">
                                {{row.item.centrotrabajo}}
                            </div>
                        </div>
                        
                        
                    </div>
                </template>
            
                <template v-slot:cell(time_worked)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.time_worked)}}
                    </div>
                </template>


                <template v-slot:cell(total)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total.toFixed(2))}}
                    </div>
                </template>
                <template v-slot:cell(total_price)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_price.toFixed(2))}}
                    </div>
                </template>
                
                <template v-slot:cell(total_real_price)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_real_price.toFixed(2))}}
                    </div>
                </template>
                
                <template v-slot:cell(total_real_diff)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_real_diff.toFixed(2))}}
                    </div>
                </template>
                
                <template v-slot:cell(total_price_lost)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_price_lost.toFixed(2))}}
                    </div>
                </template>
                
                <template v-slot:cell(workstation_cost)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.workstation_cost.toFixed(2))}}
                    </div>
                </template>
            
            </b-table>
          </b-tab>
          <b-tab title="Centro de Trabajo Acumulado">

                 <b-table small show-empty stacked="md" :items="contentResumen[0]['result']" :fields="[{key:'centrotrabajo', label:'CT'},{key:'total_price', label:'Por Facturar'},{key:'total_real_price', label:'Facturado'},{key:'total_real_diff', label:'Diferencia'},{key:'total_price_lost', label:'Microparos'},
                    {key:'total_price_lost', label:'Costo Microparos'},
                    {key:'workstation_cost', label:'Costo Centro Trabajo'},{key:'total', label:'Total'}]">

                <template v-slot:cell(centrotrabajo)="row">
                    <div class="text-left">
                        <div class="row">
                            <div class="col-4">

                                
                                <i class="fas fa-circle text-success" v-if="(row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))<=0 || (row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))>=90">
                                </i>
                                
                                <i class="fas fa-circle text-danger" v-if="(row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))>0 && (row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))<=80">
                                </i>

                                <i class="fas fa-circle text-warning" v-if="(row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))>80 && (row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100))<90">
                                </i>

                                {{row.item.total_price == null || row.item.total_price == 0 ?0:((row.item.total_real_price/row.item.total_price)* 100).toFixed(2) }} %


                            </div>
                            <div lass="col-8">
                                {{numberWithCommas(row.item.centrotrabajo)}}
                            </div>
                        </div>
                        
                        
                    </div>
                </template>
            
                <template v-slot:cell(time_worked)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.time_worked)}}
                    </div>
                </template>


                <template v-slot:cell(total)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total)}}
                    </div>
                </template>
                <template v-slot:cell(total_price)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_price)}}
                    </div>
                </template>
                
                <template v-slot:cell(total_real_price)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_real_price)}}
                    </div>
                </template>
                
                <template v-slot:cell(total_real_diff)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_real_diff)}}
                    </div>
                </template>
                
                <template v-slot:cell(total_price_lost)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total_price_lost)}}
                    </div>
                </template>
                
                <template v-slot:cell(workstation_cost)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.workstation_cost)}}
                    </div>
                </template>
            
            </b-table>

              <!-- <thead>
                <tr>
                  <th>Centro Trabajo</th>
                  <th>Qty.</th>
                  <th>Sum.</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in contentResumen[0].result">
                  <td class="align-middle">
                    {{item["centrotrabajo"]}}
                  </td>
                  <td class="align-middle">
                      {{item["unidades_esperadas"]}}
                  </td>
                  <td class="align-middle">
                      {{item["total_producido"]}}
                  </td>
                  <td class="align-middle">
                      {{item["time_worked"]}}
                  </td>
                  <td class="align-middle">
                      {{item["total_losttime"]}}
                  </td>
                </tr>
              </tbody>
            </table> -->
          </b-tab>
        </b-tabs>
        <!-- / Sales -->
  </div>
</template>

<script>
import Vue from 'vue'
import VueChartJs from 'vue-chartjs'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import {reports} from "@/components/i40/js/globals"
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.component('dashboard1-chart1', {
  extends: VueChartJs.Line,
  mounted () {
    this.renderChart({
      labels: ['2016-10', '2016-11', '2016-12', '2017-01', '2017-02', '2017-03', '2017-04', '2017-05'],
      datasets: [{
        label: 'Visits',
        data: [93, 25, 95, 59, 46, 68, 4, 41],
        borderWidth: 1,
        backgroundColor: 'rgba(28,180,255,.05)',
        borderColor: 'rgba(28,180,255,1)'
      }, {
        label: 'Returns',
        data: [83, 1, 43, 28, 56, 82, 80, 66],
        borderWidth: 1,
        borderDash: [5, 5],
        backgroundColor: 'rgba(136, 151, 170, 0.1)',
        borderColor: '#8897aa'
      }]
    }, {
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: '#aaa'
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: '#aaa',
            stepSize: 20
          }
        }]
      },

      responsive: false,
      maintainAspectRatio: false
    })
  }
})

Vue.component('dashboard1-chart2', {
  extends: VueChartJs.Line,
  mounted () {
    this.renderChart({
      datasets: [{
        data: [24, 92, 77, 90, 91, 78, 28, 49, 23, 81, 15, 97, 94, 16, 99, 61,
          38, 34, 48, 3, 5, 21, 27, 4, 33, 40, 46, 47, 48, 18
        ],
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: '#009688',
        pointBorderColor: 'rgba(0,0,0,0)',
        pointRadius: 1,
        lineTension: 0
      }],
      labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
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
      responsive: false,
      maintainAspectRatio: false
    })
  }
})

Vue.component('dashboard1-chart3', {
  extends: VueChartJs.Bar,
  mounted () {
    this.renderChart({
      datasets: [{
        data: [24, 92, 77, 90, 91, 78, 28, 49, 23, 81, 15, 97, 94, 16, 99, 61,
          38, 34, 48, 3, 5, 21, 27, 4, 33, 40, 46, 47, 48, 18
        ],
        borderWidth: 0,
        backgroundColor: '#673AB7'
      }],
      labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
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
      responsive: false,
      maintainAspectRatio: false
    })
  }
})

Vue.component('dashboard1-chart4', {
  extends: VueChartJs.Line,
  mounted () {
    this.renderChart({
      datasets: [{
        data: [24, 92, 77, 90, 91, 78, 28, 49, 23, 81, 15, 97, 94, 16, 99, 61,
          38, 34, 48, 3, 5, 21, 27, 4, 33, 40, 46, 47
        ],
        borderWidth: 1,
        backgroundColor: 'rgba(206, 221, 54, 0.2)',
        borderColor: '#cedd36',
        pointBackgroundColor: 'rgba(0,0,0,0)',
        pointBorderColor: 'rgba(0,0,0,0)',
        pointRadius: 1
      }],
      labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
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
      responsive: false,
      maintainAspectRatio: false
    })
  }
})

Vue.component('dashboard1-chart5', {
  extends: VueChartJs.Doughnut,
  mounted () {
    this.renderChart({
      datasets: [{
        data: [85, 15],
        backgroundColor: ['#fff', 'rgba(255,255,255,0.3)'],
        hoverBackgroundColor: ['#fff', 'rgba(255,255,255,0.3)'],
        borderWidth: 0
      }]
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
      tooltips: {
        enabled: false
      },
      cutoutPercentage: 94,
      responsive: false,
      maintainAspectRatio: false
    })
  }
})

Vue.component('dashboard1-chart6', {
  extends: VueChartJs.Pie,
  mounted () {
    this.renderChart({
      labels: ['Desktops', 'Smartphones', 'Tablets'],
      datasets: [{
        data: [1225, 654, 211],
        backgroundColor: ['rgba(99,125,138,0.5)', 'rgba(28,151,244,0.5)', 'rgba(2,188,119,0.5)'],
        borderColor: ['#647c8a', '#2196f3', '#02bc77'],
        borderWidth: 1
      }]
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
        position: 'right',
        labels: {
          boxWidth: 12
        }
      },
      responsive: false,
      maintainAspectRatio: false
    })
  }
})

export default {
  name: 'dashboard-1',
  metaInfo: {
    title: 'Costos Planta Tiempo Real'
  },
  components: {
    PerfectScrollbar
  },

  // Resize charts
  //

  data() {
      return {
          contentResumen:[],
          realtimeResult:[],
          lastValues:[]
      }
  },

  methods: {
    numberWithCommas(x) {
        if(x == null)
            x=0
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    },
      getContentResumen(){
          this.$http
        .get(
            reports+"/getgerenciareport"
        )
        .then(respuesta => {
          // console.log(respuesta)
            return respuesta.json();
        })
        .then(data => {
          //  this.contentResumen=data
          // console.log(data)
           this.getRealTimeInfo(data)
        });
      },

      getRealTimeInfo(infox){
          this.$http
        .get(
            reports+"/getrrealtimeinfows"
        )
        .then(respuesta => {
            return respuesta.json();
        })
        .then(data => {
            let wscode = Object.keys(data)

            // console.log(data)
            let resultado = []
            this.contentResumen= infox
            for (let index = 0; index < wscode.length; index++) {
                const element = wscode[index];
                // console.log(element)

                let infoWorkstation = data[element]

                if(infoWorkstation['wsinfo'] != undefined && infoWorkstation['infocalculada'] != undefined && infoWorkstation['realtimecontent'] != undefined){
                    

           
                    try{
                        let wsinfo = JSON.parse(infoWorkstation['wsinfo'])
                        let infocalculada =  JSON.parse(infoWorkstation['infocalculada'])
                        let realtimecontent =  JSON.parse(infoWorkstation['realtimecontent'])

                        let tiempoTrabajado = infocalculada["tiempotrabajado"]
                        let stopTime = infocalculada["stop_time"]
                       

                        let isworking = false
                        let include = false



        

                        if(infocalculada["stoptimeinterval_id"]!=undefined){
                            if(wsinfo[0].affect){
                                tiempoTrabajado = infocalculada["stop_time"]
                                include = true
                            }
                        }else{
                            tiempoTrabajado = infocalculada["tiempotrabajado"]
                            isworking = true
                        }

                        if(tiempoTrabajado != 0){
                            tiempoTrabajado = parseInt((tiempoTrabajado.split(":")[0]*60))+parseInt(tiempoTrabajado.split(":")[1])
                        }
                        stopTime = parseInt(stopTime.split(":")[0])+parseInt(stopTime.split(":")[1])

                        if(isworking || include){
                          
                         
                            if(isworking){

                          
                                let moneyExpected = (((tiempoTrabajado*60)/wsinfo[0].expected_time_cycle)*wsinfo[0].standard_unit_cycle)*wsinfo[0].price_list
                                let realMoney = (infocalculada["nro_ciclos"]*wsinfo[0]["real_unit_cycle"])*wsinfo[0].price_list
                                let lostMoney = stopTime*wsinfo[0].price_list
                                let wrkstationCost = tiempoTrabajado*wsinfo[0].price_list
                                resultado.push({'centrotrabajo': element, 'description': wsinfo[0].description, 'total_price':moneyExpected, 'total_real_price':realMoney, 'total_real_diff':moneyExpected-realMoney, 'total_price_lost':lostMoney, 'workstation_cost':wrkstationCost, 'total':(moneyExpected-realMoney)+wrkstationCost, 'isworking':true})
                                 
                                this.contentResumen[1]["result"][2]["total_price"] = this.contentResumen[1]["result"][2]["total_price"]+realMoney
                                this.contentResumen[1]["result"][2]["total_real_price"]= (this.contentResumen[1]["result"][2]["total_real_price"]+(moneyExpected-realMoney)).toFixed(2)
                                this.contentResumen[1]["result"][2]["total_real_diff"]= this.contentResumen[1]["result"][2]["total_real_diff"]+lostMoney
                            }else{

                                let moneyExpected = (((tiempoTrabajado*60)/wsinfo[0].expected_time_cycle)*wsinfo[0].standard_unit_cycle)*wsinfo[0].price_list
                                let realMoney = (infocalculada["nro_ciclos"]*wsinfo[0]["real_unit_cycle"])*wsinfo[0].price_list
                                let lostMoney = stopTime*wsinfo[0].price_list
                                let wrkstationCost = lostMoney
                                let total = 0

                                if(wsinfo[0].standard_unit_cycle != undefined){
                                    total = moneyExpected
                                }else{
                                    moneyExpected = 0
                                    total = wrkstationCost
                                }

                                resultado.push({'centrotrabajo': element, 'description': wsinfo[0].stopcode_description, 'total_price':moneyExpected, 'total_real_price':0, 'total_real_diff':realMoney, 'total_price_lost':lostMoney, 'workstation_cost':wrkstationCost, 'total':total, 'isworking':false})

                                // this.contentResumen[1]["result"][2]["total_price"] = this.contentResumen[1]["result"][2]["total_price"]+realMoney
                                // this.contentResumen[1]["result"][2]["total_real_price"]= (this.contentResumen[1]["result"][2]["total_real_price"]+(moneyExpected-realMoney)).toFixed(2)
                                // this.contentResumen[1]["result"][2]["total_real_diff"]= this.contentResumen[1]["result"][2]["total_real_diff"]+lostMoney
                            }
                        }
                    }catch(e){
                        // console.log(infoWorkstation)
                    }
                }
            }
            resultado.sort(function(a, b){if(a.total < b.total)  return 1; else return -1});
            this.realtimeResult = resultado
        });
      },

      getInfoEvents(){
        this.getContentResumen()
        // this.getRealTimeInfo()
      }
  },

  created() {
      this.getInfoEvents()
      this.$options.interval = setInterval(this.getInfoEvents, 5000)
  },
  
  beforeDestroy () {
      clearInterval(this.$options.interval)
  },

  mounted () {
    const charts = this.$children.filter(component => /-chart\d+$/.test(component.$options._componentTag))

    const resizeCharts = () => charts.forEach(chart => chart._data._chart.resize())

    // Initial resize
    resizeCharts()

    // For performance reasons resize charts on delayed resize event
    this.layoutHelpers.on('resize.dashboard-1', resizeCharts)
  },
  beforeDestroy () {
    this.layoutHelpers.off('resize.dashboard-1')
  }
}
</script>

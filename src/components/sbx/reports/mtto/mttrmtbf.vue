<template>
    <div>
        <!-- <div class="content-heading">
            <div>
                {{titleHeader}}
                <small> Centro de Trabajo</small>
            </div>
        </div> -->
                <h4 class="font-weight-bold py-3 mb-1">
                    MTBF y MTTR Por Centro de Trabajo
                        <!-- <small>Tiempo de Paro - Grupo de Centro de Trabajo</small> -->
                </h4>
                <div class="mt-2">
                         Seleccione un Centro de Trabajo
                    <multiselect
                        v-model="selectedGroup"
                        :options="workstationGroup"
                        
                        placeholder="Grupo de Centros de Trabajo"
                        label="code"
                        track-by="code" />
                </div>
                <div class="row mt-2">
                    <div class="col-md-12 col-sm-12 col-lg-12">
                        <div class="row mb-1">
                            <div class="col-md-1">
                            </div>
                            <div class="col-md-4">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                                    <date-picker v-model="dateStart" :config="options"></date-picker>
                                </div>
                            </div>
                                
                            <div class="col-md-4">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                                    <date-picker v-model="dateFinsh" :config="options"></date-picker>
                                </div> 
                            </div>
                            <div class="col-md-3">

                                <div class="row">
                                    <button type="button" class="btn btn-success" v-on:click="cargarDatos('')">Consultar</button>
                                </div>
                                
                                <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
                            </div>
                        </div>
                    
                    </div>
                </div>
        <div>
            
            <p class="text-center mt-3 mb-3">
                En esta gráfica se puede visualizar, el numero de medio de minutos en que ocurre un fallo en el equipo (MTBF), comparado con el tiempo medio en resolver la falla (MTTF).
            </p>

            <div id="container"></div>

          <!-- <b-row>
            <b-col md="4">
                {{workstationGroup}}
            </b-col>
            <b-col md="8">
                <div id="container"></div>
            </b-col>
          </b-row> -->
        </div>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
// var jsPDF = require('jspdf');
// require('jspdf-autotable');
// import reports from "../../../vendor/js/constant"
// require("@/i40/vendor/highcharts.js");
import Multiselect from 'vue-multiselect'
import {reports} from "@/components/i40/js/globals"
import moment from "moment";
// Import this component
import datePicker from "vue-bootstrap-datetimepicker";
// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

import Vue from "vue";
import VueResource from 'vue-resource'
import LightTimeline from "vue-light-timeline";
import { infomaster } from "@/components/i40/js/master";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

// import JsonExcel from 'vue-json-to-excel';
 

// import Scrollable from "@/components/Common/Scrollable";


Vue.use(VueResource)
// import Scrollable from "@/components/Common/Scrollable";
import { CrearPDF } from "@/vendor/js/funx"

Vue.use(LightTimeline);
// Vue.component('downloadExcel', JsonExcel)
const theme = "red";
export default {
  components: {
    Multiselect,
    // Scrollable,
    datePicker,
    SweetModal, 
    SweetModalTab 
  },
  data() {
    return {
            titleHeader:"",
            workstationGroup:[],
            selectedGroup:{},
            donutdata: [],
            items: [],
            items2: [],
            dateStart:null,
            dateFinsh:null,
            options: {
                format: "YYYY-MM-DD HH:mm",
                //useCurrent: false
                // minDate:Date(),
            },

            fields: [
                {
                    key: 'root_code',
                    label: 'Codigo',
                },
                {
                    key: 'root_description',
                    label: 'Descripcion',
                },
                {
                    key: 'nro_veces',
                    label: 'Frecuencia',
                },
                {
                    key: 'mtbf',
                    label: 'MTBF (min)',
                },
            ],

            
            json_fields : {
                "descripcion"      : "String",
                "turno"      : "Number",
                "inicio"   : "String",
                "Fin" : "String",
                "TiempoTotal"    : "Number"
            },

            json_meta: [
                [{
                    "key": "charset",
                    "value": "utf-8"
                }]
            ],
    };
  },
  methods: {
      
    async cargarDatos(valor) {
        // this.plot_stoptime()

        this.titleHeader=this.selectedGroup.description
      var paramtros =
        this.selectedGroup.code +
        "/" +
        this.dateStart +
        ":00/" +
        this.dateFinsh +
        ":59";

    let title = []
    let mtbf = []
    let mttr = []
    let mtbfResult = []

      await this.$http
        .get(
            reports+"/obtenermtbf/" + paramtros
        )
        .then(respuesta => {
            return respuesta.json();
        })
        .then(data => {
            // this.totales_minutes = 0
            // this.ciclos_paros = 0
            // this.undsprod = 0
            // this.tiempo_total_operacion=0
            let info_chart = []

            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if(element.root_description  != 'Total')
                  info_chart.push({name:element.root_description + ' (' + element.mtbf + ')', y: element.mtbf })
            }

            // console.log(totales_minutes, ciclos_paros)
            // // console.log(data)
            mtbfResult = data;

        //   this.plot_stoptime("container", info_chart, "a2")

        });


      await this.$http
        .get(
            reports+"/obtenermttr/" + paramtros
        )
        .then(respuesta => {
            return respuesta.json();
        })
        .then(data => {
            // this.totales_minutes = 0
            // this.ciclos_paros = 0
            // this.undsprod = 0
            // this.tiempo_total_operacion=0
            let info_chart = []

            for (let index = 0; index < data.length; index++) {
                
                const element = data[index];
                if(element.root_description  != 'Total'){
                //   info_chart.push({name:element.root_description + ' (' + element.mtbf + ')', y: element.mtbf })
                  title.push(element.root_description)
                  for (let index2 = 0; index2 < mtbfResult.length; index2++) {
                      const element2 = mtbfResult[index2];

                      if(element.root_description == element2.root_description){
                        mtbf.push(element2.mtbf)
                        mttr.push(element.mttr)
                      }
                  }
                }
            }
            // console.log(title,mttr, mtbf)
            this.plot_stoptime(title,mttr, mtbf)
        });


    },
// "container"
    plot_stoptime(title,mttr, mtbf){
          Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'MTBF vs MTTR',
                    align: 'left'
                },
                subtitle: {
                    text: 'SyncBox i4.0',
                    align: 'left'
                },
                xAxis: [{
                    categories: title,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value} min',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    title: {
                        text: 'MTTF',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    opposite: true

                }, { // Secondary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'MTBF',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} min',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    }

                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 80,
                    verticalAlign: 'top',
                    y: 55,
                    floating: true,
                    backgroundColor:
                        Highcharts.defaultOptions.legend.backgroundColor || // theme
                        'rgba(255,255,255,0.25)'
                },
                series: [{
                    name: 'MTBF',
                    type: 'column',
                    yAxis: 1,
                    data: mtbf,
                    tooltip: {
                        valueSuffix: ' min'
                    }

                }, 
                {
                    name: 'MTTR',
                    type: 'spline',
                    data: mttr,
                    tooltip: {
                        valueSuffix: 'min'
                    }
                }],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                floating: false,
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom',
                                x: 0,
                                y: 0
                            },
                            yAxis: [{
                                labels: {
                                    align: 'right',
                                    x: 0,
                                    y: -6
                                },
                                showLastLabel: false
                            }, {
                                labels: {
                                    align: 'left',
                                    x: 0,
                                    y: -6
                                },
                                showLastLabel: false
                            }, {
                                visible: false
                            }]
                        }
                    }]
                }
            });
    },

  },
  created() {
        infomaster.workstation([],"select").then(data => {
            // console.log(data.data[0].wstype)
            // this.workstationType = data.data[0].wstype
            // this.workstationPlant = data.data[0].wsplant
            this.workstationGroup = data.data[0].workstation
            
            // if( data.data[0].workstation != null){
            //     this.tableData = data.data[0].workstation
            //     this.totalRows= this.tableData.length
            // }
        })
     },
};
</script>
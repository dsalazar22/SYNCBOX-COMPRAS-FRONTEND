<template>
    <div>
        <!-- <div class="content-heading">
            <div>
                {{titleHeader}}
                <small> Centro de Trabajo</small>
            </div>
        </div> -->
                <h4 class="font-weight-bold py-3 mb-1">
                    MTBF Por Centros de Trabajo
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

                                <div class="text-center">
                                    <button type="button" class="btn btn-success" v-on:click="cargarDatos('')">Consultar</button>
                                    <button type="button" class="btn btn-success" v-on:click="exportExcel('')">Exportar</button>

                                </div>
                                
                                <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
                            </div>
                        </div>
                    
                    </div>
                </div>
        <div>

          <b-row class="mt-3">
            <b-col md="6">
              <b-table striped hover :foot-clone="true" :fields="fields" :items="donutdata">
                     <!-- <template v-slot:cell(name)="row">
                        <div>
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if='row.item.detalle != ""' @click.prevent="content_details(row.item)"><i class="ion ion-md-create"></i></b-btn>
                            {{row.item.name}}
                        </div>
                    </template> -->
              </b-table>
            </b-col>
            <b-col md="6">
              <div id="container"></div>
            </b-col>
          </b-row>
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
      
    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.donutdata)
      const workbook = XLSX.utils.book_new()
      const filename = 'datos_mtbf'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },

    cargarDatos: function(valor) {

        this.titleHeader=this.selectedGroup.description
      var paramtros =
        this.selectedGroup.code +
        "/" +
        this.dateStart +
        ":00/" +
        this.dateFinsh +
        ":59";

      this.$http
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
          this.donutdata = data;

          this.plot_stoptime("container", info_chart, "a2")

        });

    },
// "container"
    plot_stoptime(div_info, items, name){
          Highcharts.chart(div_info, {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: "pie"
            },
            title: {
              text: ""
            },
            tooltip: {
              pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
            },
            plotOptions: {
               pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                  enabled: true,
                  format: "{point.name}: {point.percentage:.1f}%",
                  style: {
                    color:
                      (Highcharts.theme &&
                        Highcharts.theme.contrastTextColor) ||
                      "black"
                  }
                }
              }
            },
            series: [
              {
                name: name,
                colorByPoint: true,
                data: items
              }
            ]
          });
    },

  },
  created() {
        infomaster.workstation([],"select").then(data => {
            // console.log(data)
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
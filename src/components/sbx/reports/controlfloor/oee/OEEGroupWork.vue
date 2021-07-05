<template>
    <div>
        <div class="h3">
            <div>
                <!-- {{titleHeader}} -->
                OEE - Grupo de Centro de Trabajo
            </div>
        </div>
        <div></div>
     <div>
                Seleccione un Grupo de Centros de Trabajo
                    <multiselect
                        v-model="selectedGroup"
                        :options="workstationGroup"
                        
                        placeholder="Grupo de Centros de Trabajo"
                        label="description"
                        track-by="description" />
                
            </div>

        <div class="row mb-0 mt-2">
       
            <div class="col-md-4">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                    <date-picker v-model="dateStart" :config="options"></date-picker>
                </div>
            </div>

           
                
                <div class="col-md-4">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                        <date-picker v-model="dateFinish" :config="options"></date-picker>
                    </div> 
                </div>
                <div class="col-md-2">
                    <div class="row">
                        <div class="col">
                            <button type="button" class="btn btn-success" v-on:click="cargarDatos()">Consultar</button>
                        </div>
                        <div class="col">
                            <download-excel
                                class   = "btn btn-default"
                                :data   = "donutdata"
                                :fields = "fieldsDetalleParos"
                                name    = "syncbox.xls">
                            
                                Descargar Excel
                            
                            </download-excel>
                        </div>
                    </div>
                </div>
        </div>
               <!-- <div class="row mb-2">
            <div class="col text-center">
            <b-btn v-b-modal.modallg variant="primary" >Información Producción</b-btn></div>
        </div> -->
        <div class="row text-center">
            <div class="col-sm-6 col-md-6 col-xl-5">
                <!-- <donut-chart 
                    id="donut" 
                    :data="donutData" 
                    :colors="colors"
                    resize="true">
                </donut-chart> -->
                <pie-chart
                    :ratio=ratioOEE
                    :percent=indicadorOEE
                    :stroke-width=10
                    bckColor=#eee
                    :label=textOEE
                    label-small="OEE"
                    :color=colorOEE
                    :opacity=1
                />
            </div>
            <div class="col-sm-12 col-md-6 col-xl-7 mt-2">
                <div class="row">
                <div class="col"> <pie-chart
                    :ratio=ratioDisponibilidad
                    :percent=indicadorDisponibilidad
                    :stroke-width=10
                    :label=textDisponibilidad
                    label-small="DISPONIBILIDAD"
                    bckColor=#eee
                    :color=colorDisponibilidad
                    :opacity=1
                /></div>
            <div class="col"> <pie-chart
                    :ratio=ratioEficiencia
                    :percent=indicadorEficiencia
                    :stroke-width=10
                    :label=textEficiencia
                    label-small="EFICIENCIA"
                    bckColor=#eee
                    :color=colorEficiencia
                    :opacity=1
                /></div>
            <div class="col"> <pie-chart
                    :ratio=ratioCalidad
                    :percent=indicadorCalidad
                    :stroke-width=10
                    :label=textCalidad
                    label-small="CALIDAD"
                    bckColor=#eee
                    :color=colorCalidad
                    :opacity=1
                /></div>
                </div>
                <div class="row">
                    <div class="col mt-2">
                        <div id="container2" style="min-width: 300px; height: 400px; margin: 0 auto"></div>
                         <!-- <apexcharts height="310" type="line" :options="chartOptions" :series="series"></apexcharts> -->
                    </div>
                </div>
            </div>


            
        </div>

        <div class="row mt-3">
            <div class="col-md-6">
                  <div class="overflow-auto">
            
                     <!-- <a class="list-group-item" href="#"> -->
                    <table  >
                        <tbody>
                            <tr>
                                <div class="card card-default">
                                    <div class="card-header">
                                        <!-- <div class="px-2 float-right badge badge-danger">5</div>
                                        <div class="px-2 mr-2 float-right badge badge-success">12</div> -->
                                        Razones de Paro (Tiempos dados en minutos)
                                    </div>
                                    <!-- START list group-->
                                    <div :height="430">
                                        <!-- <div class="list-group" v-for="item in donutdata"> -->
                                            <!-- <div class="list-group-item list-group-item-action" > -->
                                                <b-table striped hover :foot-clone="true" :fields="fieldsDetalleParos" :items="donutdata"></b-table>
                                            <!-- </div> -->
                                            <!-- END list group item-->
                                        <!-- </div> -->
                                    </div>
                                </div>
                            </tr>
                        </tbody>
                    </table>
            <!-- </a> -->
                </div>
                    </div>
                        <div class="col-md-6">
                            <div class="card card-default">
                            <div class="card-header">Resultados de Tiempos</div>
                                <div class="card-body">
                                    <!-- <Morris type="Donut" id="morris-donut" :data="donutdata" :options="donutOptions"/> -->
                                    <div id="resultadoTiempos" style="min-width: 250px; height: 400px; max-width: 600px; margin: 0 auto"></div>
                                </div>
                            </div>
                        </div>
                </div>
       



        <div class="row mt-3">
            <div class="col-md-6">
                  <div class="list-group mb-3">
                      <!-- <a class="list-group-item" href="#"> -->
                <table class="wd-wide">
                    <tbody>
                        <tr>
                            <div class="card card-default">
                                <div class="card-header">
                                    <!-- <div class="px-2 float-right badge badge-danger">5</div>
                                    <div class="px-2 mr-2 float-right badge badge-success">12</div> -->
                                    <div class="card-title">Detalle de Unidades</div>
                                </div>
                                <!-- START list group-->
                                <div :height="330">
                                    <div class="list-group" v-for="item in donutUnidades">
                                        <div class="list-group-item list-group-item-action" >
                                            <div class="media">
                                                <!-- <img class="align-self-start mx-2 circle thumb32" src="img/user/12.jpg" alt="Image"> -->
                                                <div class="media-body text-truncate">
                                                    <p class="mb-1">
                                                                <strong class="text-primary">
                                                    <span>{{item.name}}</span>
                                                    </strong>
                                                            </p>
                                                            <!-- <p class="mb-1 text-sm">Cras sit amet nibh libero, in gravida nulla. Nulla...</p> -->
                                                        </div>
                                                        <div class="ml-auto">
                                                        {{item.y}}
                                                            <!-- <small class="text-muted ml-2"> 1d</small> -->
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- END list group item-->
                                            </div>
                                        </div>
                                    </div>
                                </tr>
                            </tbody>
                        </table>
                    <!-- </a> -->
                </div>
                    </div>
                        <div class="col-md-6">
                            <div class="card card-default">
                            <div class="card-header">Resultados de Unidades</div>
                                <div class="card-body">
                                    <!-- <Morris type="Donut" id="morris-donut" :data="donutdata" :options="donutOptions"/> -->
                                    <div id="resultadoUnidades" style="min-width: 250px; height: 400px; max-width: 600px; margin: 0 auto"></div>
                                </div>
                            </div>
                        </div>
                </div>
    </div>


</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>

import Vue from "vue";
import { infomaster } from "@/components/i40/js/master";
// require( "@/components/i40/js/vendor/highcharts.js")
import VueResource from "vue-resource"
// Datepicker
import moment from 'moment'
// Import this component
import datePicker from 'vue-bootstrap-datetimepicker';
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
import Multiselect from 'vue-multiselect'

// import Raphael from 'raphael/raphael'
// global.Raphael = Raphael

// import Vue from 'vue'
// import { DonutChart } from 'vue-morris'
// or import .vue-file, if you have vue-loader
import PieChart from 'vue-pie-chart/src/PieChart.vue'
import {reports} from "@/components/i40/js/globals"
import ObtenerColorOEE from "@/components/i40/js/floor/colorsOEE.js"
// import $ from 'jquery'
import {ServerTable, ClientTable, Event} from 'vue-tables-2';
import JsonExcel from 'vue-json-to-excel';
 

// import Scrollable from "@/components/Common/Scrollable";

Vue.use(ClientTable);
Vue.use(VueResource);
Vue.component('downloadExcel', JsonExcel)

export default {
     components: {
        Multiselect,
        datePicker,
        // DonutChart,
        'pie-chart': PieChart,
        // Scrollable,
        ObtenerColorOEE,
     },
     data() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            return {
                titleHeader: this.$route.params.groupName,
                items2:[],
                fieldsDetalleParos: 
                        [
                            {
                                key: 'name',
                                label: 'Codigo - Descripción',
                            },
                            {
                                key: 'y',
                                label: 'Tiempo (m)',
                            },
                            {
                                key: 'ciclosparos',
                                label: 'Ciclos',
                            },
                        ],
                fields: {
                    codigo: {
                        label: 'Codigo',
                        sortable: false
                    },
                    producto: {
                        label: 'Producto',
                        sortable: false
                    },
                    cantidadprogramada: {
                        label: 'Cant Programa',
                        sortable: false
                    },
                    cajas: {
                        label: 'Cajas',
                        sortable: false
                    },
                    reales: {
                        label: 'Reales',
                        sortable: false
                    },
                    mptotalproducidas: {
                        label: 'Materia Prima Reales',
                        sortable: false
                    },
                    defectuosas: {
                        label: 'Defectuosas',
                        sortable: false
                    },
                    mpdefectuosas: {
                        label: 'Materia Prima Defectuosas',
                        sortable: false
                    },
                    // tiemporeal: {
                    //     label: 'Tiempo Real',
                    //     sortable: false
                    // },
                    // oee: {
                    //     label: 'OEE',
                    //     sortable: false
                    // }
                },
                dateStart: null,
                dateFinish: null,
                options: {
                    format: "YYYY-MM-DD HH:mm",
                    // useCurrent: false
                    // minDate:Date(),
                },
                colors: [],
                donutData: [],

                indicadorOEE:0,
                ratioOEE:0.001,
                textOEE:"0%",
                colorOEE:"#40a070",

                indicadorDisponibilidad:0,
                ratioDisponibilidad:0.001,
                textDisponibilidad:"0%",
                colorDisponibilidad:"#40a070",

                indicadorEficiencia:0,
                ratioEficiencia:0.001,
                textEficiencia:"0%",
                colorEficiencia:"#40a070",

                indicadorCalidad:0,
                ratioCalidad:0.001,
                textCalidad:"0%",
                colorCalidad:"#40a070",

                chartOptions: null,
                series: [],
                donutdata:[],
                donutUnidades:[],

                // columns: ['idordenproduccion', 'codigo', 'producto', 'descproceso', 'esperadas', 'producido', 'defectuosas', 
                // 'tiempototaltrabajado', 'tiempomicroparos', 'tiemporealtrabajado', 'tiempobase', 'tiemporeal', 'disponibilidad',
                // 'eficiencia', 'calidad','oee'],
                //  columns: ['idordenproduccion', 'codigo', 'producto', 'descproceso', 'esperadas', 'producido', 'defectuosas', 'tiempobase', 'tiemporeal', 
                // 'disponibilidad','eficiencia', 'calidad','oee'],
                //  columns: ['idordenproduccion', 'codigo', 'producto', 'cantidadprogramada', 'reales', 'defectuosas','cajas', 
                //  'mptotalproducidas','mpdefectuosas',
                //  'tiempobase', 'tiemporeal', 
                // 'disponibilidad','eficiencia', 'calidad','oee'],
                itemx:[],
                optionsx:[],
                workstationGroup:[],
                selectedGroup:{}
                // items:[]
            }
     },
     methods: {

    async fetchData(){
      return this.donutData;
    },

        
       
          color:function(valor){
              return ObtenerColorOEE(valor)
          },
            colorTiempoReal:function(valorideal, valorreal){
                return ObtenerColorOEE((valorideal/valorreal)*100)
          },
        cargarDatos: function(){

        this.optionsx = {
        headings: {
            // name: 'Country Name',
            // code: 'Country Code',
            // uri: 'View Record'

            idordenproduccion:'# Orden', 
            codigo:'Codigo', 
            producto:'Producto', 
            // descproceso:'Proceso', 
            // esperadas:'Unds Esperadas', 
            cantidadprogramada:'Unds Programadas', 
            // producido:'Unds Producidas', 
            reales:'Unds Buenas', 
            defectuosas:'Defectuosas',
            // cajas:'Cajas',
            // mptotalproducidas:'Materia Prima Buenas', 
            // mpdefectuosas:'Materia Prima Defectuosas',
            // tiempototaltrabajado:'Tiempo Total Trabajado', 
            // tiempomicroparos:'Tiempo Microparos', 
            // tiemporealtrabajado:'Tiempo Real Trabajado', 
            tiempobase:'Tiempo Base', 
            tiemporeal:'Tiempo Real', 
            disponibilidad:'% Disponibilidad',
            eficiencia:'% Eficiencia', 
            calidad:'% Calidad',
            oee:'% OEE'
        },
        // sortable: ['name', 'code'],
        filterable: ['idordenproduccion', 'codigo','producto']
        }

            //  this.colors= [ "#FF6384", "#36A2EB" ]
            //  this.donutData = [{ label: 'OEE', value: 98.65 },
            //         { label: 'Diff', value: 1.2 }]
        var paramtros =
        this.selectedGroup.description +
        "/" +
        this.dateStart +
        ":00/" +
        this.dateFinish +
        ":59";

        console.log(reports+'/obtenerOEEProductosGrupoCentroTrabajo/'+paramtros)
    
           this.$http.get(reports+'/obtenerOEEProductosGrupoCentroTrabajo/'+paramtros)
                    .then(respuesta =>{
                        return respuesta.json()
                    })
                    .then(resultado =>{
                        // console.log(resultado)
                        this.itemx = JSON.parse(resultado)
                        // this.items2 = JSON.parse(resultado)
                    });

        this.$http
        .get(
          reports+"/obtenerDetalleOEEGrupos/" + paramtros
        )
        .then(respuesta => {
          return respuesta.json();
        })
        .then(data => {
            this.items = data
            
            this.ratioOEE=JSON.parse(data[0].resultados)[0].oee/100
            this.indicadorOEE=JSON.parse(data[0].resultados)[0].oee
            this.textOEE=JSON.parse(data[0].resultados)[0].oee+"%"
            this.colorOEE=ObtenerColorOEE(JSON.parse(data[0].resultados)[0].oee)

            this.ratioDisponibilidad=JSON.parse(data[0].resultados)[0].disponibilidad/100
            this.indicadorDisponibilidad=JSON.parse(data[0].resultados)[0].disponibilidad
            this.textDisponibilidad=JSON.parse(data[0].resultados)[0].disponibilidad+"%"
            this.colorDisponibilidad=ObtenerColorOEE(JSON.parse(data[0].resultados)[0].disponibilidad)

            this.ratioEficiencia=JSON.parse(data[0].resultados)[0].eficiencia/100
            this.indicadorEficiencia=JSON.parse(data[0].resultados)[0].eficiencia
            this.textEficiencia=JSON.parse(data[0].resultados)[0].eficiencia+"%"
            this.colorEficiencia=ObtenerColorOEE(JSON.parse(data[0].resultados)[0].eficiencia)

            this.ratioCalidad=JSON.parse(data[0].resultados)[0].calidad/100
            this.indicadorCalidad=JSON.parse(data[0].resultados)[0].calidad
            this.textCalidad=JSON.parse(data[0].resultados)[0].calidad+"%"
            this.colorCalidad=ObtenerColorOEE(JSON.parse(data[0].resultados)[0].calidad)

            this.donutdata=JSON.parse(data[1].resultados)

            // console.log(data[1].resultados)

            this.donutUnidades=JSON.parse(data[3].resultados)

            Highcharts.chart("resultadoTiempos", {
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
                    format: '{point.name}: <b>{point.percentage:.1f}%</b>',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
              }
            },
            series: [
              {
                name: "Paros",
                colorByPoint: true,
                data: JSON.parse(data[1].resultados)
              }
            ]
          });

        Highcharts.chart("resultadoUnidades", {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: "column"
            },
            title: {
              text: ""
            },
            tooltip: {
              //pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                  enabled: true,
                  //format: "{point.percentage:.1f} %",
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
                name: "Unidades",
                colorByPoint: true,
                data: JSON.parse(data[3].resultados)
              }
            ]
          });
        //   console.log()
        });

        /////////////////////////////////////////////////////////////////////////////////////

        this.$http.get(reports+'/obtenerOEEGruposPorCentroTrabajo/'+paramtros)
                    .then(respuesta =>{
                        return respuesta.json()
                    })
                    .then(resultado =>{
                        var i 
                        var categoria=[]
                        var datosserie =[]
                        var dataDisponibilidad=[]
                        var dataEficiencia=[]
                        var dataCalidad=[]
                        var dataOEE=[]
                        for(i=0;i<JSON.parse(resultado[0].resultados).length;i++){
                            categoria.push(JSON.parse(resultado[0].resultados)[i].centrotrabajo)
                        }

                        for(i=0;i<JSON.parse(resultado[1].resultados).length;i++){
                           
                            dataDisponibilidad.push( JSON.parse(resultado[1].resultados)[i].disponibilidad)
                            dataEficiencia.push(JSON.parse(resultado[1].resultados)[i].eficiencia)
                            dataCalidad.push(JSON.parse(resultado[1].resultados)[i].calidad)
                            dataOEE.push(JSON.parse(resultado[1].resultados)[i].oee)
                        }

                        datosserie =[
                            {
                                name:"disponibilidad",
                                data:dataDisponibilidad
                            },
                            {
                                name:"eficiencia",
                                data:dataEficiencia
                            },
                            {
                                name:"calidad",
                                data:dataCalidad
                            },
                            {
                                name:"OEE",
                                data:dataOEE
                            }
                                                            
                        ]

                        Highcharts.chart('container2', {
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: 'OEE por Centros de Trabajo'
                            },
                            subtitle: {
                                text: ''
                            },
                            xAxis: {
                                categories: categoria,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Porcentajes (%)'
                                }
                            },
                            tooltip: {
                                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                    '<td style="padding:0"><b>{point.y:.1f} min</b></td></tr>',
                                footerFormat: '</table>',
                                shared: true,
                                useHTML: true
                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                }
                            },
                            //series: resultado.detalle
                            
                            series: datosserie
                        });
                       // console.log(JSON.parse(resultado[1].resultados))                
                    });
         }
     },
     created() {
         infomaster.workstation([],"select").then(data => {
                    
                    // this.workstationType = data.data[0].wstype
                    // this.workstationPlant = data.data[0].wsplant
                    this.workstationGroup = data.data[0].wsgroup
                    
                    // if( data.data[0].workstation != null){
                    //     this.tableData = data.data[0].workstation
                    //     this.totalRows= this.tableData.length
                    // }
                })
     },
}

</script>
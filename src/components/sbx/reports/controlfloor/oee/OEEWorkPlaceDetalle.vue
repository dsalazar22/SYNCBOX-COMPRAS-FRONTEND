<template>
    <div>
        <div class="h3">
            <div>
                OEE - Grupo de Centro de Trabajo
            </div>
        </div>

            <div>
                Seleccione un Centro de Trabajo
                    <multiselect
                        v-model="selectedGroup"
                        :options="workstationGroup"
                        :searchable="true"
                        placeholder="Centros de Trabajo"
                        label="code"
                        track-by="code" />
                
            </div>

        <div class="row mb-4">
            <div class="col"></div>
            <div class="col-md-4">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                    <date-picker v-model="dateStart" :config="optionsCalendario"></date-picker>
                </div>
            </div>
                
            <div class="col-md-4">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                    <date-picker v-model="dateFinish" :config="optionsCalendario"></date-picker>
                </div> 
            </div>
             <div class="col-md-2">
                 <button type="button" class="btn btn-success" v-on:click="cargarDatos()">Consultar</button>
                <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
            </div>
        </div>

        <div class="row mb-3">
            <div class="col text-center">
            <b-btn v-b-modal.modalTimeLine variant="primary" >Consultar Timeline</b-btn>

        <!-- <b-btn v-b-modal.modallg variant="primary" class="ml-2">Información Producción</b-btn> -->
            </div>
        </div>
        

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
                        <!-- <div id="container2" style="min-width: 300px; height: 400px; margin: 0 auto"></div> -->
                         <!-- <apexcharts height="310" type="line" :options="chartOptions" :series="series"></apexcharts> -->
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


    <b-modal id="modalTimeLine" size="lg" title="Timeline Tiempos de Paro">
        <div class="row col-centered">
            <div class="col-12 text-center">
                <h2>TIMELINE</h2>
            </div>
              <div class="col-2"></div>
              <div class="col">
                <div :height="630">
                    <light-timeline :items='itemsTimeLine'></light-timeline>
                </div>
            </div>
            <div class="col-2"></div>
        </div>
    </b-modal>


    <b-modal id="modallg" size="lg" title="Información Productos Fabricados">
                    <div class="row mb-2">
                           
                               <div class="col-3 text-center">
                                    <!-- <img class="img-fluid" src="../../../img/logo/Colanta.jpg" width="280" alt=""> -->
                               </div>
                               <div class="col-9 text-center">
                                   <h2>DIVISIÓN TÉCNICA <br>
                                    <small class="text-muted">DEPARTAMENTO DE PRODUCCIÓN</small></h2>
                                    <hr/>
                                   <div class="row">
                                      
                                    <div class="col-12">
                                        <h4>{{titleHeader}}</h4>
                                    </div>
                                    
                                    <div class="col-12">
                                            <h4>Productos por Grupos Centros de Trabajo</h4>
                                    </div>
                                    <div class="col-3">
                                        
                                    </div>
                                </div>
                                       <div class="row">
                           <div class="col-1"></div>
                           <div class="col-5">
                           <h4>Fecha Inicial: <small class="text-muted">{{dateStart}}</small></h4></div>
                           <div class="col-5">
                           <h4>Fecha Final: <small class="text-muted">{{dateFinish}}</small></h4></div>
                           <div class="col-1"></div>
                            
                       </div>
                               </div>
                       </div>
                        
                
                       <b-table striped hover :items="itemx" :fields="fields"></b-table>
                       <hr/>
                       <div class="row">
                           <div class="col-12" style="height:60px; ">
                               Observaciones:
                           </div>
                       </div>
                       <hr/>
                        <div class="row">
                           <div class="col-4">
                               Revisó:
                           </div>
                           <div class="col-8">
                               
                           </div>
                       </div>
                       <hr/>
                    </b-modal>

    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
// require( "@/components/i40/js/vendor/highcharts.js")
// Datepicker
import Vue from 'vue'
import moment from 'moment'
import Multiselect from 'vue-multiselect'
import VueResource from "vue-resource"
// Import this component
import datePicker from 'vue-bootstrap-datetimepicker';
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

// import Raphael from 'raphael/raphael'
// global.Raphael = Raphael
// import Vue from 'vue'
// import { DonutChart } from 'vue-morris'
// or import .vue-file, if you have vue-loader

import PieChart from 'vue-pie-chart/src/PieChart.vue'
import {reports} from "@/components/i40/js/globals"
import ObtenerColorOEE from "@/components/i40/js/floor/colorsOEE.js"
import { infomaster } from "@/components/i40/js/master";
// import Scrollable from "@/components/Common/Scrollable";
import {ServerTable, ClientTable, Event} from 'vue-tables-2';
import LightTimeline from "vue-light-timeline";
 

// import Scrollable from "@/components/Common/Scrollable";

Vue.use(ClientTable);
Vue.use(LightTimeline);
Vue.use(VueResource);

export default {
     components: {
        datePicker,
        // DonutChart,
        'pie-chart': PieChart,
        // Scrollable,
        ObtenerColorOEE,
        Multiselect
     },
     data() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            return {
                titleHeader: this.$route.params.workPlace,
                
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


                // columns: ['idordenproduccion', 'codigo', 'producto', 'descproceso', 'esperadas', 'producido', 'defectuosas', 
                // 'tiempototaltrabajado', 'tiempomicroparos', 'tiemporealtrabajado', 'tiempobase', 'tiemporeal', 'disponibilidad',
                // 'eficiencia', 'calidad','oee'],

                 columns: ['idordenproduccion', 'codigo', 'producto', 'cantidadprogramada', 'reales', 'defectuosas','cajas', 
                 'mptotalproducidas','mpdefectuosas',
                 'tiempobase', 'tiemporeal', 'eficiencia', 'calidad'],   
                itemx:[],
                optionsx:[],

                itemsTimeLine:[],
                
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
                optionsCalendario: {
                    format: "YYYY-MM-DD HH:mm"
                    // useCurrent: false
                    // minDate:Date(),
                },

                workstationGroup:[],
                selectedGroup:{}
               
                // items:[]
            }
     },
     methods: {
            color:function(valor){
                return ObtenerColorOEE(valor)
            },
            colorTiempoReal:function(valorideal, valorreal){
                return ObtenerColorOEE((valorideal/valorreal)*100)
            },
            cargarDatos: function(){

            this.titleHeader= this.$route.params.workPlace,

            this.optionsx = {
                headings: {
                    // name: 'Country Name',
                    // code: 'Country Code',
                    // uri: 'View Record'

                    idordenproduccion:'# Orden', 
                    codigo:'Codigo', 
                    producto:'Producto', 
                    descproceso:'Proceso', 
                    esperadas:'Unds Esperadas', 
                    producido:'Unds Producidas', 
                    defectuosas:'Defectuosas',
                    // tiempototaltrabajado:'Tiempo Total Trabajado', 
                    // tiempomicroparos:'Tiempo Microparos', 
                    // tiemporealtrabajado:'Tiempo Real Trabajado', 
                    tiempobase:'Tiempo Base', 
                    tiemporeal:'Tiempo Real', 
                    // disponibilidad:'% Disponibilidad',
                    eficiencia:'% Eficiencia', 
                    calidad:'% Calidad',
                    // oee:'% OEE'
                },
                filterable: []
            // sortable: ['name', 'code'],
            // filterable: ['idordenproduccion', 'codigo','producto']
        }

            //  this.colors= [ "#FF6384", "#36A2EB" ]
            //  this.donutData = [{ label: 'OEE', value: 98.65 },
            //         { label: 'Diff', value: 1.2 }]

             titleHeader: this.$route.params.workPlace;
        
        var paramtros =
        this.selectedGroup.code +
        "/" +
        this.dateStart +
        ":00/" +
        this.dateFinish +
        ":59";

        //TIMELINE
        this.$http
        .get(
          reports+"/obtenerOEETimeLineCentroTrabajo/" + paramtros
        )
        .then(respuesta => {
          return respuesta.json();
        })
        .then(usuarios => {

            // console.log(usuarios)

            this.itemsTimeLine = usuarios
        });

    
           this.$http.get(reports+'/obtenerOEEProductosWorkPlace/'+paramtros)
                    .then(respuesta =>{
                        return respuesta.json()
                    })
                    .then(resultado =>{
                        this.itemx = JSON.parse(resultado)
                    });

        this.$http
        .get(
          reports+"/obtenerDetalleOEEWorkPlace/" + paramtros
        )
        .then(respuesta => {
          return respuesta.json();
        })
        .then(usuarios => {

            this.items = usuarios
            
            this.ratioOEE=JSON.parse(usuarios[0].resultados)[0].oee/100
            this.indicadorOEE=JSON.parse(usuarios[0].resultados)[0].oee
            this.textOEE=JSON.parse(usuarios[0].resultados)[0].oee+"%"
            this.colorOEE=ObtenerColorOEE(JSON.parse(usuarios[0].resultados)[0].oee)

            this.ratioDisponibilidad=JSON.parse(usuarios[0].resultados)[0].disponibilidad/100
            this.indicadorDisponibilidad=JSON.parse(usuarios[0].resultados)[0].disponibilidad
            this.textDisponibilidad=JSON.parse(usuarios[0].resultados)[0].disponibilidad+"%"
            this.colorDisponibilidad=ObtenerColorOEE(JSON.parse(usuarios[0].resultados)[0].disponibilidad)

            this.ratioEficiencia=JSON.parse(usuarios[0].resultados)[0].eficiencia/100
            this.indicadorEficiencia=JSON.parse(usuarios[0].resultados)[0].eficiencia
            this.textEficiencia=JSON.parse(usuarios[0].resultados)[0].eficiencia+"%"
            this.colorEficiencia=ObtenerColorOEE(JSON.parse(usuarios[0].resultados)[0].eficiencia)

            this.ratioCalidad=JSON.parse(usuarios[0].resultados)[0].calidad/100
            this.indicadorCalidad=JSON.parse(usuarios[0].resultados)[0].calidad
            this.textCalidad=JSON.parse(usuarios[0].resultados)[0].calidad+"%"
            this.colorCalidad=ObtenerColorOEE(JSON.parse(usuarios[0].resultados)[0].calidad)

            this.donutdata=JSON.parse(usuarios[1].resultados)

            this.donutUnidades=JSON.parse(usuarios[3].resultados)

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
                  format: "{point.name}: {point.percentage:.1f} %",
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
                name: "Paros",
                colorByPoint: true,
                data: JSON.parse(usuarios[1].resultados)
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
                    data: JSON.parse(usuarios[3].resultados)
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
            });
         }
     },

     created() {
         infomaster.workstation([],"select").then(data => {
                    
                    // this.workstationType = data.data[0].wstype
                    // this.workstationPlant = data.data[0].wsplant
                    this.workstationGroup = data.data[0].workstation
                    
                    // if( data.data[0].workstation != null){
                    //     this.tableData = data.data[0].workstation
                    //     this.totalRows= this.tableData.length
                    // }
                })
     },
}
</script>
<template>
    <div>
        <!-- <keep-alive> -->
        <div class="h3">
            
               Buscar Ordenes de Produccion por Tiempo
                
            
        </div>
     <div>
                Seleccione un Grupo de Centros de Trabajo
                    <multiselect
                        v-model="selectedGroup"
                        :options="workstationGroup"
                        
                        placeholder="Grupo de Centros de Trabajo"
                        label="description"
                        track-by="description" />
                
            </div>

        <div class="row mt-2">
            <div class="col-md-1"></div>
            <div class="col-md-4">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                    <date-picker v-model="dateStart" :config="optionsCalendar" @dp-change="doSomethingOnChange"></date-picker>
                </div>
                <button type="button" class="btn btn-link" @click="cambiarFecha">Fecha Sugerida Inicial: {{dateinicial}}</button>
            </div> 
            <div class="col-md-4">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                    <date-picker v-model="dateFinsh" :config="optionsCalendar"></date-picker>
                </div> 
            </div>
            <div class="col-md-3">
                <button type="button" class="btn btn-success" v-on:click="cargarDatos()">Consultar</button>
                <b-btn  class="btn btn-success" variant="outline-success" v-on:click="download()">Imprimir</b-btn>
                <button type="button" class="btn btn-success" v-on:click="exportExcel('')">Excel</button>  
                <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
            </div>
        </div>
        <div class="row mb-2 mt-2">
            <!-- <div class="col text-center"><b-btn v-b-modal.modallg variant="primary" >Información Producción</b-btn></div> -->
        </div>
<!-- <b-table striped hover :items="tableData" :fields="fields"></b-table> -->
      
    <b-table striped hover :items="tableData" :fields="columns_result" :responsive="true">
        <template v-slot:cell(idordenproduccion)="row" style="font-weight:bold; text-align: right">
            <!-- <router-link   :to="{name:'detalleOrdenProduccion', params:{ id: row.item.idordenproduccion }}"> -->
            <router-link target="_blank" :to="{path:'/reprt/detalleOrdenProduccion/'+row.item.idordenproduccion}">
                {{row.item.idordenproduccion}}
            </router-link>
        </template>

        <template v-slot:cell(cantidadprogramada)="row">
            {{numberWithCommas(row.item.cantidadprogramada)}}
        </template>
        <template v-slot:cell(reales)="row">
            {{numberWithCommas(row.item.reales)}}
        </template>
        
        <template v-slot:cell(producido)="row">
            {{numberWithCommas(row.item.producido)}}
        </template>
        <template v-slot:cell(tiemporeal)="row">
            {{row.item.tiemporeal.toFixed(2)}}
        </template>


        <template v-slot:cell(oee)="row" style="font-weight:bold; text-align: right" :style="{ color: color(row.item.oee) }">
            {{row.item.oee}}
        </template>
        <template v-slot:cell(disponibilidad)="row" style="font-weight:bold; text-align: right" :style="{ color: color(row.item.disponibilidad) }">
            {{row.item.disponibilidad}}
        </template>
        <template v-slot:cell(eficiencia)="row" style="font-weight:bold; text-align: right" :style="{ color: color(row.item.eficiencia) }">
            {{row.item.eficiencia}}
        </template>
        <template v-slot:cell(calidad)="row" style="font-weight:bold; text-align: right" :style="{ color: color(row.item.calidad) }">
            {{row.item.calidad}}
        </template>
        <template v-slot:cell(tiempobase)="row" style="font-weight:bold; text-align: right">
            {{row.item.tiempobase}}
        </template>
        <template v-slot:cell(tiemporeal)="row" style="font-weight:bold; text-align: right" :style="{ color: colorTiempoReal(row.item.tiempobase,row.item.tiemporeal) }">
            {{row.item.tiemporeal}}
        </template>
        <template v-slot:cell(cumplimiento)="row" style="font-weight:bold; text-align: right" :style="{ color: color(row.item.cumplimiento) }">
            {{row.item.cumplimiento}}
        </template>
</b-table>
<div class="row">
        <div class="col-xl-4 col-lg-6 mt-3">
            <div class="card b">
                <div class="card-header">
                    <h4 class="m-0">Totales Generales</h4>
                </div>
                <div :height="330">
                    <div class="list-group" v-for="item in datosTotalizados">
                        <div class="list-group-item list-group-item-action" >
                            <div class="media">
                                <div class="media-body text-truncate">
                                    <p class="mb-1">
                                        <strong class="text-primary">
                                            <span>{{item.nombre}}</span>
                                        </strong>
                                    </p>
                                </div>
                                <div class="ml-auto">
                                    {{item.total}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-4 col-lg-6 mt-3">
            <div class="card b">
                <div class="card-header">
                    <h4 class="m-0">Total Defectuosas</h4>
                </div>
                <div :height="330">
                    <div class="list-group" v-for="item in datosDefectuosas">
                        <div class="list-group-item list-group-item-action" >
                            <div class="media">
                                <div class="media-body text-truncate">
                                    <p class="mb-1">
                                        <strong class="text-primary">
                                            <span>{{item.name}}</span>
                                        </strong>
                                    </p>
                                </div>
                                <div class="ml-auto">
                                    {{item.y}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-4 col-lg-6 mt-3">
            <div class="card b">
                <div class="card-header">
                    <h4 class="m-0">Defectuosas Totales</h4>
                </div>
                    <div class="card-body">
                                    <!-- <Morris type="Donut" id="morris-donut" :data="donutdata" :options="donutOptions"/> -->
                                    <div id="resultadoDefectuosas" style="min-width: 250px; height: 300px; max-width: 500px; margin: 0 auto"></div>
                                </div>
                        
                    </div>
            </div>
        </div>

<div class="row">
        <div class="col-xl-4 col-lg-6 mt-3">
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
                                        <b-table striped hover :foot-clone="true" :fields="fieldsDetalleParos" :items="parosTotales"></b-table>
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

        <div class="col-xl-4 col-lg-6 mt-3">
            <div id="resultadoParos" style="min-width: 250px; height: 400px; max-width: 600px; margin: 0 auto"></div>
        </div>
    </div>


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
                           <h4>Fecha Final: <small class="text-muted">{{dateFinsh}}</small></h4></div>
                           <div class="col-1"></div>
                            
                       </div>
                               </div>
                       </div>
                        
                
                        <b-table striped hover :items="tableData" :fields="fields"></b-table>
                       <!-- <hr/>
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
                       <hr/> -->
                       <div>
                           <!-- <b-btn class="mt-3" variant="outline-success" block @click="download">Imprimir</b-btn> -->
                           </div>
                    

    </b-modal>


               
           <v-client-table :data="data" :columns="cols" :options="options" class="mt-4">
        </v-client-table>
            
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>


<script>
// require( "@/components/i40/js/vendor/highcharts.js")
import VueResource from "vue-resource"
import {reports} from "@/components/i40/js/globals"
import Multiselect from 'vue-multiselect'
import { infomaster } from "@/components/i40/js/master";
// var jsPDF = require('jspdf');
// require('jspdf-autotable');
    
// import vmodal from 'vue-js-modal'

// import Scrollable from "@/components/Common/Scrollable";
import _ from 'underscore'
import moment from "moment";
import ObtenerColorOEE from "@/components/i40/js/floor/colorsOEE.js"
// Import this component
import datePicker from "vue-bootstrap-datetimepicker";
// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
import { CrearPDF } from "@/vendor/js/funx"


import Vue from 'vue'
import {ClientTable} from 'vue-tables-2'
import JsonExcel from 'vue-json-to-excel';
 

// import Scrollable from "@/components/Common/Scrollable";

Vue.use(ClientTable)
Vue.use(VueResource);
Vue.component('downloadExcel', JsonExcel)


export default {
    components: {
        datePicker,
        ObtenerColorOEE,
        Multiselect
        // Scrollable,
    },
    data() {
        return {
            workstationGroup:[],
            selectedGroup:{},
            titleHeader:"",
            itemx:[],
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
                        label: 'Und Programa',
                        sortable: false
                    },
                    reales: {
                        label: 'Und Reales',
                        sortable: false
                    },
                    cumplimiento: {
                        label: '%Cumplimiento',
                        sortable: false
                    },
                    // cajas: {
                    //     label: 'Cajas',
                    //     sortable: false
                    // },
                    // mptotalproducidas: {
                    //     label: 'MP Reales (L)',
                    //     sortable: false
                    // },
                    defectuosas: {
                        label: 'Und Defectuosas',
                        sortable: false
                    },
                    // mpdefectuosas: {
                    //     label: 'MP Defectuosas (L)',
                    //     sortable: false
                    // },
                    // tiemporeal: {
                    //     label: 'Tiempo Real',
                    //     sortable: false
                    // },
                    // oee: {
                    //     label: 'OEE',
                    //     sortable: false
                    // }
                },
            dateStart:"",
            dateFinsh:"",
            optionsCalendar: {
                format: "YYYY-MM-DD HH:mm",
                //useCurrent: false
                // minDate:Date(),
             },
            json_fields: {
                "idordenproduccion"  : "Number",
                "codigo"      : "String",
                "producto"   : "String",
                "cantidadprogramada" : "Number",
                "reales"    : "Number",
                "cumplimiento"    : "Number",
                "producido"    : "Number",
                "defectuosas"    : "Number",
                "tiempobase"    : "Number",
                "tiemporeal"    : "Number",
                "eficiencia"    : "Number",
                "calidad"    : "Number",

            },
            tableData: [],
            columns_result: [
                {key:'idordenproduccion',label:'# Orden'},
                {key:'codigo',label:'Codigo'},
                {key:'producto',label:'Producto'},
                {key:'cantidadprogramada',label:'Und Programadas'},
                {key:'reales',label:'Und Reales'},
                {key:'cumplimiento',label:'%Cumplimiento'},
                {key:'producido',label:'Und Producidas'},
                // {key:'cajas',label:'Cajas'},
                // {key:'mpunidadesproducidas',label:'MP Prod (L)'},
                // {key:'mpunidadesdefectuosas',label:'MP Defec (L)'},
                {key:'defectuosas',label:'Und Def'},
                {key:'tiempobase',label:'Tiempo Base (s)'},
                {key:'tiemporeal',label:'Tiempo Real(s)'},
                {key:'eficiencia',label:'Eficiencia'},
                {key:'calidad',label:'Calidad'}
        ],
                   
                    // cajas: {
                    //     label: 'Cajas',
                    //     sortable: false
                    // },
                    // mptotalproducidas: {
                    //     label: 'MP Prod. (L)',
                    //     sortable: false
                    // },
                  
                    // mpdefectuosas: {
                    //     label: 'MP Def. (L)',
                    //     sortable: false
                    // },
            
            options: {
                pagination: { chunk: 5 },
                filterable: [],
                sortIcon: {
                    // is: 'fa-sort',
                    // base: 'fas',
                     up: 'fa-sort-up',
                     down: 'fa-sort-down'
                }
            },
            datosTotalizados:[],
            datosDefectuosas:[],
            parosTotales:[],

            data:[],
            cols: [],

            dateinicial:""
        }
    },
    methods: {
        numberWithCommas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
        cambiarFecha(){
            // console.log(moment(this.dateinicial).format("YYYY-MM-DDTHH:mm"))
            this.dateStart=this.dateinicial
        },
        doSomethingOnChange(event){
            if(this.dateStart != "" && this.dateStart != null && event.oldDate != null)
                this.$http
                .get(
                    reports+`/obtenerFechas/${this.selectedGroup.description}/${moment(this.dateStart).format("YYYY-MM-DD")}/_`
                )
                .then(
                    function(response) {

                        this.dateFinsh = moment(response.body[0].fachamax).format("YYYY-MM-DDTHH:mm")
                        this.dateinicial = moment(response.body[0].fechamin).format("YYYY-MM-DDTHH:mm")

                    },
                    function(response) {}
                );
        },  

        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.tableData)
            const workbook = XLSX.utils.book_new()
            const filename = `prod_tiempo`
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },

        download (){
                var columns = [
                    {title: "Codigo", dataKey: "codigo"},
                    {title: "Producto", dataKey: "producto"}, 
                    {title: "Programado", dataKey: "cantidadprogramada"},
                    {title: "Reales", dataKey: "reales"},
                    {title: "%Cumplimiento", dataKey: "cumplimiento"},
                    {title: "Cajas", dataKey: "cajas"},
                    {title: "MP Prod. (L)", dataKey: "mptotalproducidas"},
                    {title: "Defectuosas", dataKey: "defectuosas"},
                    {title: "MP Defect. (L)", dataKey: "mpdefectuosas"},
                ];

                // Only pt supported (not mm or in)

                
                
                var titlePDF = '                       PRODUCTOS POR RANGOS DE FECHAS'
                var infoFecha = 'Fecha Inicial: '+this.dateStart+' - Fecha Final: '+ this.dateFinsh

                let logo_company = `${this.publicUrl}img/logo_compania.jpg`
                let logo = `${this.publicUrl}img/logo.png`

                var doc = CrearPDF(titlePDF, infoFecha, columns, this.tableData,logo_company,logo)
                let first = doc.autoTable.previous;

                var columnsx = [];
                for(var i=0; i< this.cols.length;i++){
                    // console.log(this.cols[i])
                    columnsx.push({title: this.cols[i], dataKey: this.cols[i]})
                }

                // console.log(this.data)

                doc.autoTable(columnsx, this.data, {
                    startY: first.finalY + 10,
                    showHeader: 'firstPage',
                    styles: { fontSize: 6},
                                columnStyles: {
                                    id: {fontSize: 6}
                                },
                    
                });
                first = doc.autoTable.previous;

                doc.setFontSize(8);
                doc.text("----------------FIN DEL INFORME ----------------", 210, first.finalY + 20);
                doc.setFontSize(9);
                doc.text("Observaciones:", 60, first.finalY + 30);
                doc.setFontSize(9);
                doc.text("Revisó:", 60, first.finalY + 70);

                doc.save('productos_por_tiempos.pdf');
            },
        color:function(valor){
            return ObtenerColorOEE(valor)
        },
        colorTiempoReal:function(valorideal, valorreal){
            return ObtenerColorOEE((valorideal/valorreal)*100)
        },
        cargarDatos: function() {
            var paramtros =
                    this.dateStart +
                    ":00/" +
                    this.dateFinsh +
                    ":59";
                // console.log(reports+`/obtenerTitulosCross/${this.selectedGroup.description}/`+paramtros)
                this.cols = []
                this.cols.push("centrotrabajo")
                this.$http.get(reports+`/obtenerTitulosCross/${this.selectedGroup.description}/`+paramtros)
                    .then(respuesta =>{
                        var i 
                        for(i=0;i<respuesta.data.length;i++){
                           this.cols.push(respuesta.data[i].codigo)
                        }
                    });

                this.$http.get(reports+`/obtenerTotalesxProductoxCentroTrabajo/${this.selectedGroup.description}/`+paramtros)
                    .then(respuesta =>{
                        
                        this.data = respuesta.data
                    })

                // this.$http.get(reports+'/obtenerOEEProductosGrupoCentroTrabajo/Empacado Leche Fresca/'+paramtros)
                //     .then(respuesta =>{
                //         return respuesta.json()
                //     })
                //     .then(resultado =>{
                //         // console.log(resultado)
                //         this.itemx = JSON.parse(resultado)
                //         // this.items2 = JSON.parse(resultado)
                //     });

                this.$http.get(reports+'/obtenerInformacionProductosRangoTiempo/'+paramtros+'/'+this.selectedGroup.description)
                .then(respuesta =>{
                    return respuesta.json()
                }).then(resultado =>{
                this.tableData = resultado[0].detalleproducto.map((item, index) => {
                        item['id'] = index
                        return item
                })
                
                this.tableData = resultado[0].detalleproducto
                this.datosTotalizados = resultado[0].indicadores
                this.datosDefectuosas = resultado[0].totaldefectuosas
                this.parosTotales = resultado[0].parosdetallados

                // console.log(resultado)

                Highcharts.chart("resultadoDefectuosas", {
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
                                format: "{point.name}:{point.percentage:.1f} %",
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
                            data: resultado[0].totaldefectuosas
                        }]
                });
                
                    Highcharts.chart("resultadoParos", {
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
                                format: "{point.name}:{point.percentage:.1f} %",
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
                            data: resultado[0].parosdetallados
                        }]
                });
            });

            // this.download()
        },
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

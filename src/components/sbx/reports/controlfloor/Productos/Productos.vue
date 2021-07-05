<template>
    <div>
        <div class="h3">
            <div>
               Buscar por Codigo de Producto y Tiempos
            </div>
        </div>
        <vue-bootstrap-typeahead
            :data="products"
            v-model="ProductsSearch"
            size="lg"
            placeholder="Escribe una Parte del Producto..."
            @hit="selectedProducts = $event"
        />
            
        <div class="row mt-2">
            <div class="col-md-2"></div>
            <div class="col-md-4">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                    <date-picker v-model="dateStart" :config="optionsCalendar"></date-picker>
                </div>
            </div> 
            <div class="col-md-4">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                    <date-picker v-model="dateFinsh" :config="optionsCalendar"></date-picker>
                </div> 
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-success" v-on:click="cargarDatos()">Consultar</button>
                <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
            </div>
        </div>

        <b-table striped hover :items="tableData" :fields="columns">
            <template v-slot:cell(idordenproduccion)="row" style="font-weight:bold; text-align: right">
                <!-- <router-link   :to="{name:'detalleOrdenProduccion', params:{ id: row.item.idordenproduccion }}"> -->
                <router-link  :to="{path:'/reprt/detalleOrdenProduccion/'+row.item.idordenproduccion}">
                    {{row.item.idordenproduccion}}
                </router-link>
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
                                        <b-table striped hover :foot-clone="true" :fields="fieldsDetalleParos" :items="parosTotales"></b-table>
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
    
<!-- <modal name="hello-world">
  hello, world!
</modal> -->
            <!-- <b-btn  v-on:click="show()" variant="primary" >Consultar Timeline</b-btn> -->
    <!-- <OrdnProduccion id="demoLogin" /> -->

    <router-view></router-view>

    </div>
</template>



<script>
// require( "@/components/i40/js/vendor/highcharts.js")
import VueResource from "vue-resource"
// import vmodal from 'vue-js-modal'
import Vue from 'vue'
// import Scrollable from "@/components/Common/Scrollable";
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import {reports} from "@/components/i40/js/globals"
import _ from 'underscore'
import moment from "moment";
import ObtenerColorOEE from "@/components/i40/js/floor/colorsOEE.js"
import OrdnProduccion from "../OrdnProduccion/OrdenProduccion.vue"
// Import this component
import datePicker from "vue-bootstrap-datetimepicker";
// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";


import {ClientTable} from 'vue-tables-2'
 

// import Scrollable from "@/components/Common/Scrollable";

// Vue.use(vmodal)
Vue.use(ClientTable)
Vue.use(VueResource);


export default {
    components: {
        VueBootstrapTypeahead,
        datePicker,
        ObtenerColorOEE,
        // Scrollable
    },
    data() {
        return {
            products: [],
            ProductsSearch: '',
            selectedProducts: null,
            dateStart:null,
            dateFinsh:null,
            optionsCalendar: {
                format: "YYYY-MM-DD HH:mm",
                //useCurrent: false
                // minDate:Date(),
     	    },
            tableData: [],
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
            columns: {
                    idordenproduccion: {
                        label: 'ID Orden',
                        sortable: false
                    },
                    codigo: {
                        label: 'Codigo',
                        sortable: false
                    },
                    producto: {
                        label: 'Producto',
                        sortable: false
                    },
                    cantidadprogramada: {
                        label: 'Und Programadas',
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
                    producido: {
                        label: 'Und Producidas',
                        sortable: false
                    },
                    // cajas: {
                    //     label: 'Cajas',
                    //     sortable: false
                    // },
                    // mptotalproducidas: {
                    //     label: 'MP Prod. (L)',
                    //     sortable: false
                    // },
                    // defectuosas: {
                    //     label: 'Und Def.',
                    //     sortable: false
                    // },
                    // mpdefectuosas: {
                    //     label: 'MP Def. (L)',
                    //     sortable: false
                    // },
                    tiempobase: {
                        label: 'Tiempo Base (s)',
                        sortable: false
                    },
                    tiemporeal: {
                        label: 'Tiempo Real(s)',
                        sortable: false
                    },
                    eficiencia: {
                        label: 'Eficiencia',
                        sortable: false
                    },
                    calidad: {
                        label: 'Calidad',
                        sortable: false
                    },
            },
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
            parosTotales:[]
        }
    },
    methods: {
            color:function(valor){
                return ObtenerColorOEE(valor)
            },
            colorTiempoReal:function(valorideal, valorreal){
                return ObtenerColorOEE((valorideal/valorreal)*100)
            },
            async getproducts(query) {
                if(query.length>=1){
                    let url_content = (reports+"/searchProduct/:query").replace(':query', query)
                    
                    const res = await fetch(url_content)
                    const suggestions = await res.json()
                    this.products = suggestions[0].producto
                 }
                },
            cargarDatos: function() {
                var paramtros =
                        this.dateStart +
                        ":00/" +
                        this.dateFinsh +
                        ":59/" +  this.selectedProducts;
                 
                 this.$http.get(reports+'/obtenerInformacionProductos/'+paramtros)
                    .then(respuesta =>{
                    let resultado = JSON.parse(respuesta.bodyText)

                    // console.log(resultado)
                    this.tableData = resultado[0].detalleproducto.map((item, index) => {
                            item['id'] = index
                            return item
                        })

                     this.tableData = resultado[0].detalleproducto
                     this.datosTotalizados = resultado[0].indicadores
                     this.datosDefectuosas = resultado[0].totaldefectuosas
                     this.parosTotales = resultado[0].parosdetallados

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
                                format: "{point.name} {point.percentage:.1f} %",
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
                            data: resultado[0].parosdetallados
                        }]
                    });
                });
            },
            show () {
            
        },
    },
    watch: {
        ProductsSearch: _.debounce(function(addr) { this.getproducts(addr) }, 500)
    }
}
</script>
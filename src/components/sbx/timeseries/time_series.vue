<template>
    <div>
        <h4 class="font-weight-bold py-3 mb-4">Consultar Series de Tiempos</h4>
        <!-- <div class="w-100 text-right"></div> -->
                                            <div class="position-relative">
        <b-input-group>
            <b-input-group-text slot="prepend" v-if="loading">
                <i class="ion ion-md-sync"></i>
            </b-input-group-text>
            <b-input-group-text slot="prepend" v-if="!loading">
                <i class="ion ion-ios-search"></i>
            </b-input-group-text>
            <input type="text" class="form-control"
                placeholder="Seleccione una Serie de Tiempo"
                autocomplete="off"
                v-model="valueSerie"
                @keydown.down="down"
                @keydown.up="up"
                @keydown.enter="hit"
                @keydown.esc="reset"
                @blur="reset"
                @input="update_time_serie" />
                <b-input-group-text slot="append" v-if="isDirty || valueSerie" @click="resetInput">
                    <i class="ion ion-md-close" ></i>
                </b-input-group-text>
        </b-input-group>

        <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
            
            <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                <span class="name" v-text="item"></span>
                <!-- <span class="text-muted">{{ item }}</span> -->
            </a>
        </div>
        </div>
        <!-- <multiselect
            v-model="selectedSeries"
            label="description"
            track-by="description"
            placeholder=""
            :options="seriesOptions"
            :multiple="true"
            :searchable="true"
            :internal-search="false"
            :clear-on-select="false"
            :close-on-select="false"
            :hide-selected="true">
            <span slot="noResult">No found.</span>
        </multiselect> -->

        <div class="row mb-4 mt-3">
            <div class="col"></div>
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
            <div class="col"></div>
           
        </div>
        <div class="w-100 text-center mb-3">
             <button type="button" class="btn btn-success mr-2" v-on:click="cargarDatos()">Adicionar Variable</button>
              <button type="button" class="btn btn-warning ml-2" v-on:click="nuevaConsulta()">Nueva Consulta</button>
              <button type="button" class="btn btn-info ml-2" v-on:click="exportExcel()">Descargar Datos</button>
              <!-- <button type="button" class="btn btn-info ml-2" v-on:click="showFormulario = true">Ver Series Graficadas</button> -->
            <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
        </div>
        <div id="container" ref="highcharts" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
        <table class="table table-sm">
            <thead>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Limite Inferior</th>
                    <th scope="col">Limite Superior</th>
                    <th scope="col">Media</th>
                    <th scope="col">Desv stand</th>
                    <th scope="col">Acción</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in (ax != null ? ax.series : null)">
                    <!-- :class="{'badge-dot': true, 'background-color': '#000'}" -->
                    <td><b-badge  class="badge-dot" :style="{'background-color': item.color}" /> {{item.name}}</td>
                    <td> {{item.lower_limit}} </td>
                    <td> {{item.upper_limit}} </td>
                    <td>{{average(item.yData)}}</td>
                    <td>{{standardDeviation(item.yData)}}</td>
                    <td><b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="ax.series[item.index].remove();"><i class="ion ion-md-close"></i></b-btn></td>
                </tr>
            </tbody>
        </table>

        <div class="w-100 text-center mt-2">
            <!-- <p> Adicione limites de control</p> -->
            <div class="row">
                <div class="col">
                    <b-form-input v-model="txtLimite"
            type="number"
            placeholder="Ingrese un limite"></b-form-input>
                </div>
                <div class="col">
                    <b-form-input v-model="txtNombre"
            type="text"
            placeholder="Ingrese un Nombre"></b-form-input>
                </div>
                <div class="col-4">
                    <button type="button" class="btn btn-success" v-on:click="nuevoLimiteControl()">Adicionar Limites</button>
                    <button type="button" class="btn btn-warning ml-2" v-on:click="limpiarLimiteControl()">Borrar Limites</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import Vue from 'vue'
import Axios from 'axios'
// require( "@/vendor/charts/highcharts.js")
// require( "@/vendor/charts/exporting.js")
// require( "@/vendor/charts/offline-exporting.js")
import moment from 'moment'
import Multiselect from 'vue-multiselect'
import VueTypeahead from 'vue-typeahead'
import datePicker from 'vue-bootstrap-datetimepicker';
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
import { time_series } from "@/components/i40/js/globals";
import { infotimeseries } from "@/components/i40/js/timeseries";
// Vue.prototype.$http = Axios


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {

    extends: VueTypeahead,
    components: {
        datePicker,
        Multiselect,
    },
    data() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        return {
            infovars:[],
            products: [],
            ProductsSearch: '',
            selectedProducts: null,
            titleHeader: "",
            dateStart: null,
            dateFinish: null,
            options: {
                format: "YYYY-MM-DD HH:mm",
                // useCurrent: false
                // minDate:Date(),
            },
            chart: null,
            ax:null,
            txtLimite:0,
            txtNombre:"",
            keyPlotLine:0,
            src: '',
            query:'',
            selected_serie:'',
            valueSerie:'',
            showFormulario:false
            // seriesOptions:[],
            // selectedSeries:[]

        }
    },
    methods: {

        standardDeviation(values){
            var avg = this.average(values);
            
            var squareDiffs = values.map(function(value){
                var diff = value - avg;
                var sqrDiff = diff * diff;
                return sqrDiff;
            });
            
            var avgSquareDiff = this.average(squareDiffs);

            var stdDev = Math.sqrt(avgSquareDiff);
            return stdDev;
        },

        average(data){
            var sum = data.reduce(function(sum, value){
                return sum + value;
            }, 0);

            var avg = sum / data.length;
            return avg;
        },

        meanValue(item){
            for (let index = 0; index < this.ax.series.length; index++) {
                const element = this.ax.series[index];
                if(element.name == item.codigocentrotrabajo+' '+item.tag_name){
                    return Math.round(this.average(element.yData)*100)/100
                }
            }
        },

        update_time_serie () {
            this.query = this.valueSerie
            this.update()
        },

        resetInput () {
            this.valueSerie = ''
            this.reset()
        },

        onHit (item) {
            this.valueSerie=item
        },

        nuevoLimiteControl:function(){
            this.keyPlotLine++
            this.ax.yAxis[0].addPlotLine({
                color: 'red',
                width: 2,
                id: this.keyPlotLine,
                value: this.txtLimite,
                label: {
                    text: this.txtNombre,
                    align: 'center',
                    style: {
                        color: 'gray'
                    }
                }
            });

            this.txtLimite =0
            this.txtNombre=""
        },

        limpiarLimiteControl:function(){
            if(this.keyPlotLine >0){
               this.ax.yAxis[0].removePlotLine(this.keyPlotLine)
               this.keyPlotLine--
            }
        },

        Unix_timestamp(t)
        {
            var dt = new Date(t*1000);
            var hr = dt.getHours();
            var m = "0" + dt.getMinutes();
            var s = "0" + dt.getSeconds();
            return hr+ ':' + m.substr(-2) + ':' + s.substr(-2);  
        },

        exportExcel: function () {
            let variables = []
            // console.log( this.ax.series[0])
            for (let index = 0; index < this.infovars.length; index++) {
                const element = this.infovars[index];
                let dateVar = new Date(element[0])
                variables.push({"Fecha":moment.utc(element[0]).format("YYYY-MM-DD hh:mm:ss"), "Valor": element[1]})
                
            }
            
            let data = XLSX.utils.json_to_sheet(variables)
            const workbook = XLSX.utils.book_new()
            const filename = 'datos_series_tiempo'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },

        nuevaConsulta: function(){
            var seriesLength = this.ax.series.length;
            for(var i = seriesLength -1; i > -1; i--) {
                this.ax.series[i].remove();
            }
        },

        cargarDatos: function(){

            var paramtros =
            this.valueSerie +
            "/" +
            this.dateStart.replace(/ /g, "T") +
            ":00Z/" +
            this.dateFinish.replace(/ /g, "T") +
            ":00Z";

            infotimeseries.get_content_time_series([],paramtros).then(data =>{
                // console.log(data)
                this.infovars = data.data
                var item = {
                    type: 'line',
                    name: this.valueSerie,
                    data: this.infovars
                }
                this.ax.addSeries(item)

                // console.log(this.ax)
            });
        },

        crearChart: function(){
            return Highcharts.chart('container', {
                    exporting: {
                        chartOptions: { // specific options for the exported image
                            plotOptions: {
                                series: {
                                    dataLabels: {
                                        enabled: true
                                    }
                                }
                            }
                        },
                        fallbackToExportServer: false
                    },

                    chart: {
                        zoomType: 'x'
                    },
                    time: {
                    useUTC: true,
                    //timezone: 'America/New_York'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: document.ontouchstart === undefined ?
                                'Click sostenido para hacer zoom' : ''
                    },
                    xAxis: {
                        type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: 'Valores'
                        },
                        
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br/>',
                        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/><b>Valor: </b>{point.y:.2f}'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },
                    series:[]
                })
        }
    },
    mounted(){
        this.src = time_series+'searchserie/'
        this.ax = this.crearChart()
    },
    // watch: {
    //     ProductsSearch: _.debounce(function(addr) { this.getproducts(addr) }, 500)
    // }
}
</script>

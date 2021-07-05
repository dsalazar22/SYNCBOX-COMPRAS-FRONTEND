<template>
    <div>

        <!-- {{process.env.datacontroller}} -->
     <!-- {{datacontroller}} -->
        
        <div class="row">
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
               <radial-gauge :value="indicadores.disponibilidad" :options="configGauge('Disponibilidad')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                  <radial-gauge :value="indicadores.eficiencia" :options="configGauge('Eficiencia')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                 <radial-gauge :value="indicadores.calidad" :options="configGauge('Calidad')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                 <radial-gauge :value="indicadores.oee" :options="configGauge('OEE')"></radial-gauge>
            </div>
        </div>  
    
        <b-tabs class="nav-tabs-top nav-responsive-xl mt-4">
             <b-tab :title="title_resources" :active="true">
                 <div class="mr-2 ml-2 mt-2">
                     <b-row>
                         <b-col md="12" class="mb-2">
                             <!-- <b-form-group horizontal label="Filtrar" class="mb-0"> -->
                             <b-input-group>
                                 <b-form-input v-model="filter" placeholder="Buscar..." />
                                 <b-input-group-append>
                                 <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                                 </b-input-group-append>
                             </b-input-group>
                             <!-- </b-form-group> -->
                         </b-col>

                     </b-row>
                     <div class="row">
                         <div class="col-xs-12 col-sm-12 col-md-8">
                     <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :filter="filter" @filtered="onFiltered">
                         <template v-slot:cell(edit)="row">
                             <div class="text-center">
                                 <router-link :to="{ path: godetails(row.item) }">
                                <i class="ion ion-ios-more"></i>
                                </router-link>
                                 <!-- <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="godetails(props.item)"><i class="ion ion-ios-more"></i></b-btn> -->
                                 <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(props.item,'delete')"><i class="ion ion-md-close"></i></b-btn> -->
                             </div>
                         </template>
                         <template v-slot:cell(disponibilidad)="row" >
                             <div class="text-right">
                                 <b-badge pill :variant="set_color_indicator(row.item.disponibilidad)">{{row.item.disponibilidad}}</b-badge>
                             </div>
                         </template>
                         <template v-slot:cell(eficiencia)="row" >
                             <div class="text-right">
                                 <b-badge pill :variant="set_color_indicator(row.item.eficiencia)">{{row.item.eficiencia}}</b-badge>
                             </div>
                         </template>
                         <template v-slot:cell(calidad)="row" >
                             <div class="text-right">
                                 <b-badge pill :variant="set_color_indicator(row.item.calidad)">{{row.item.calidad}}</b-badge>
                             </div>
                         </template>
                         <template v-slot:cell(oee)="row" >
                             <div class="text-right">
                                 <b-badge pill :variant="set_color_indicator(row.item.oee)">{{row.item.oee}}</b-badge>
                             </div>
                         </template>
                         <!-- <template slot="active" >
                             <div class="text-center">
                                 <span style="color:red" v-if="!props.item.active"><i class="ion ion-md-remove-circle"></i></span>
                                 <span style="color:green" v-if="props.item.active"><i class="ion ion-md-add-circle"></i></span>
                             </div>
                         </template> -->
                     </b-table>
                     </div>
                     <div class="col-xs-12 col-sm-12 col-md-4"></div>
                     </div>
                 </div>
             </b-tab>
            <b-tab title="Estadística">
                 <b-card no-body class="mb-0 mt-0">
                    <b-card-header header-tag="h6" class="with-elements">
                         <div class="card-header-title">Estadística</div>
                         <div class="card-header-elements ml-auto">
                             <div class="d-flex justify-content-end mb-1">
                                 <b-nav tabs class="nav-sm tabs-alt mr-2 ml-2">
                                     <b-nav-item :active="seleccion == 'paros'" @click="seleccionPestana('paros')">Tiempos de Paro</b-nav-item>
                                     <b-nav-item :active="seleccion == 'ttotales'" @click="seleccionPestana('ttotales')">Tiempos Totales</b-nav-item>
                                     <b-nav-item :active="seleccion == 'undtotales'" @click="seleccionPestana('undtotales')">Unidades Totales</b-nav-item>
                                     <b-nav-item :active="seleccion == 'ord_prod'" @click="seleccionPestana('ord_prod')">Productos</b-nav-item>
                                     <!-- <b-nav-item >Total Productos</b-nav-item> -->
                                     <b-nav-item :active="seleccion == 'oee'" @click="seleccionPestana('oee')">OEE</b-nav-item>
                                     <!-- <b-nav-item >Timeline</b-nav-item> -->
                                 </b-nav>
                             </div>
                         <!-- <label class="text m-0">
                             <span class="text-light text-tiny font-weight-semibold align-middle">
                             SHOW STATS
                             </span>
                             <span class="switcher switcher-sm d-inline-block align-middle mr-0 ml-2">
                             <input type="checkbox" class="switcher-input" checked>
                             <span class="switcher-indicator">
                                 <span class="switcher-yes"></span>
                                 <span class="switcher-no"></span>
                             </span>
                             </span>
                         </label> -->
                         </div>
                    </b-card-header>
                    <div class="row mt-2">
                        <div class="col-md-1"></div>
                            <div class="col-md-4">
                                    <flat-pickr v-model="startDate" :config="datetimeConfig" :placeholder="'Fecha Inicial'" />
                            </div>
                            <div class="col-md-4">
                                    <flat-pickr v-model="finishDate" :config="datetimeConfig" :placeholder="'Fecha Final'" />
                            </div>
                        <div class="col-md-3">
                            <button type="button" class="btn btn-success" v-on:click="cargarDatos('')">Consultar</button>
                                <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
                        </div>
                    </div>
                    <chartspie ref="stoptimes" class="m-2"/>
                </b-card>
            </b-tab>

            <b-tab title="Tambor">
                <!-- {{$route.params['idfloor']}} -->
                <drump :id_plant="$route.params['idfloor']"></drump>
            </b-tab>
        </b-tabs>
    </div>
</template>

<style src="@/vendor/libs/c3/c3.scss" lang="scss"></style>

<script>
import {realtime} from '@/vendor/sbx/sbx-realtime/realtime'
import PieChart from 'vue-pie-chart/src/PieChart.vue'
import LinearGauge from 'vue-canvas-gauges/src/LinearGauge'
import RadialGauge from 'vue-canvas-gauges/src/RadialGauge'

import flatPickr from 'vue-flatpickr-component'
import chartspie from './charts/charts_pie'
import drump from '@/components/sbx/production/drump.vue'

function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
  name: 'dashboard-4',
  
  components:{
        drump,
        LinearGauge,
        RadialGauge,
        chartspie,
        flatPickr,
    },

  metaInfo: {
    title: 'Real Time'
  },
  data: () => ({
    filter: null,
    indicadores:{},

    showEditForm:false,
    showFinOrders:false,
    wscode:'',
    datetimeConfig: {
        dateFormat: 'Y-m-d H:i',
        enableTime: true,
        altInput: true,
        animate: !isRTL()
    },

    startDate:null,
    finishDate:null,
    parameterPos:"",
    
    seleccion:'paros',

    tableData:[],
    columns: [
           {key:'description', label:"Descripción"},
           
           {key:'disponibilidad', label:"Disponibilidad"},
           {key:'eficiencia', label:"Eficiencia"},
           {key:'calidad', label:"Calidad"},
           {key:'oee', label:"OEE"},
           {key:'id', label:"id", thClass: 'd-none', tdClass: 'd-none'},
           {key:'edit', label:"Detalle"}],
    title_resources:"Plantas"
  }),

  methods: {

    set_color_indicator(value){
        if(value>0 && value<=75)
            return 'danger'
        else if(value>75 && value<85)
            return 'warning'
        else
            return 'success'
    },
    
    godetails(args){
        
        if (args.linkpart == 'floor'){
            this.title_resources = 'Plantas'
            return 'info/' + args.description + '/' + args.id
        }
        if (args.linkpart == 'group')
        {
            this.title_resources = "Grupos"
            this.wscode = this.$route.params['codefloor']
            return '/info/' + this.$route.params['codefloor'] + '/' + this.$route.params['idfloor'] + '/' + args.description + '/' + args.id  
        }
        // else (args.linkpart == 'group')
        //     this.$router.push('/' this.$route + args.linkpart + '/' + args.id)
    },

    contentOEE() {

        let mods = "company"
        this.parameterPos = "company"
        let modsid = 0

        if(this.$route.params['codefloor'] != null){
            mods = "floor"
            this.parameterPos = "plant"
            this.wscode = this.$route.params['codefloor']
            modsid = this.$route.params['idfloor']
        }

        realtime.infoOEE(mods, modsid).then(data => {
            if(data.status == 200){
                if(data.data[0].content_general == null){
                    this.indicadores={
                        eficiencia:0,
                        disponibilidad:0,
                        calidad:0,
                        oee:0
                    }
                }else{
                    this.indicadores = data.data[0].content_general[0]
                }
                this.tableData = []

                if(data.data[0].content_resources != null)
                    this.tableData =  data.data[0].content_resources
                    
            }
        })

        //  this.indicadores ={oee: Math.random()*100, disp: Math.random()*100, efic: Math.random()*100, qual:Math.random()*100}
    },

     configGauge(title){
         return {
                    minValue: 0,
                    // startAngle: 90,
                    // ticksAngle: 180,
                    colorPlate: "#f7f7f7",
                    borderShadowWidth: 0,
                    borders: false,
                    needleType: "arrow",
                    needleWidth: 2,
                    needleCircleSize: 5,
                    needleCircleOuter: false,
                    needleCircleInner: true,
                    animationDuration: 500,
                    animationRule: "linear",
                    units: title,
                    valueBox: true,
                    maxValue: 100,

                    valueTextShadow: false,
                    valueDec: 2,
                    barBeginCircle: 0,
                    fontNumbersSize: 24,
                    fontUnitsSize: 25,
                    fontValueSize: 30,
                    majorTicks: [
                        "0",
                        "10",
                        "20",
                        "30",
                        "40",
                        "50",
                        "60",
                        "70",
                        "80",
                        "90",
                        "100",
                    ],
                    width: 200,
                    height: 200,
                    minorTicks: 5,
                    strokeTicks: true,
                        highlights: [
                            {
                                "from": 50,
                                "to": 65,
                                "color": "#d93749"
                            },
                            {
                                "from": 65,
                                "to": 75,
                                "color": "#FF8C00"
                            },
                            {
                                "from": 75,
                                "to": 85,
                                "color": "#FFD700"
                            },
                            {
                                "from": 85,
                                "to": 95,
                                "color": "#40a070"
                            },
                            {
                                "from": 95,
                                "to": 100,
                                "color": "#00C5CD"
                            }
                        ],
                    }
     },

    onFiltered (filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
    },
    cargarDatos(start,finish,code){
        if(this.startDate != "" && this.finishDate != ""){
            this.$refs.stoptimes.openCharts(this.seleccion, this.parameterPos,this.wscode,this.startDate+":00",this.finishDate+":59")
        }
    },

        ///pestana
    seleccionPestana(item){
        this.seleccion = item
    
        if(this.startDate != "" && this.finishDate != ""){
            this.$refs.stoptimes.openCharts(this.seleccion, this.parameterPos,this.wscode,this.startDate+":00", this.finishDate+":59")
        }
    }
},

    created: function() {
        // this.timer = setInterval(this.contentOEE, 2000)
        this.$options.interval = setInterval(this.contentOEE, 1000)
        // this.contentOEE

    },

    mounted () {
        
    },
    beforeDestroy () {
        clearInterval(this.$options.interval)
    }
}
</script>

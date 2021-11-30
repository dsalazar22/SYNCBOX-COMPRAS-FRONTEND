<template>
    <div>
        <notifications group="notifications-default" />
         <div class="row">
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
               <radial-gauge :value="getInfoContent(wsinfo[0]['infocalculada'],'disponibilidad',0)" :options="configGauge('Disponibilidad')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                  <radial-gauge :value="getInfoContent(wsinfo[0]['infocalculada'],'eficiencia',0)" :options="configGauge('Eficiencia')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                 <radial-gauge :value="getInfoContent(wsinfo[0]['infocalculada'],'calidad',0)" :options="configGauge('Calidad')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                 <radial-gauge :value="getInfoContent(wsinfo[0]['infocalculada'],'oee',0)" :options="configGauge('OEE')"></radial-gauge>
            </div>
        </div>
    
        <b-tabs class="nav-tabs-top nav-responsive-xl mt-4">
            <b-tab title="Recursos" :active="true">
                <div class="text-right">
                    <!-- <b-btn size="md" class="icon-btn borderless" variant="outline-dark"><span class="ion ion-md-apps"></span></b-btn>
                    <b-btn size="md" class="icon-btn borderless" variant="outline-secondary"><span class="ion ion-md-reorder"></span></b-btn> -->
                </div>                   
                <div class="row mt-2 ml-1 mr-2">
                    <div  class="col-sm-6 col-xl-4">
                        <b-card no-body class="mb-4">
                            <div class="mt-2 ml-2 mb-1">
                                <b-badge :variant="wsinfo[0].trade_status == 'available' ? 'success' : 'danger'" class="badge-dot" />
                                <!-- <b-btn variant="primary btn-round icon-btn mr-1"> </b-btn> -->
                                 {{wsinfo[0]['wscode']}}
                                 
                                <div class="text-muted small">{{ getInfoContent(wsinfo[0]['infocalculada'],'description',0) }} {{getInfoContent(wsinfo[0]['infocalculada'],'prod_description',0) }}</div>
                                <div class="text-muted small"> # OP: {{ getInfoContent(wsinfo[0]['infocalculada'],'order_id',0) }} </div>
                            </div>
                            <hr class="m-0">
                            <!-- <b-card-body class="d-flex justify-content-between align-items-start pb-2"> -->
                                <!-- <b-dropdown variant="default icon-btn borderless btn-round md-btn-flat hide-arrow" size="sm" :right="!isRTL">
                                <template slot="button-content"><i class="ion ion-ios-more"></i></template>
                                <b-dropdown-item href="javascript:void(0)">View</b-dropdown-item>
                                <b-dropdown-item href="javascript:void(0)">Edit</b-dropdown-item>
                                <b-dropdown-item href="javascript:void(0)">Remove</b-dropdown-item>
                                </b-dropdown> -->
                            <!-- </b-card-body> -->

                            <div class="small mt-2">
                                <strong class="ml-2">Completado {{getInfoContent(wsinfo[0]['infocalculada'],'percentage_complete',0)}}%</strong>  <div class="float-right mr-2"> {{ getInfoContent(wsinfo[0]['infocalculada'],'programmed',0) }} - {{getInfoContent(wsinfo[0]['infocalculada'],'totalProducido',0)}} = {{getInfoContent(wsinfo[0]['infocalculada'],'totalPendiente',0)}} </div>
                            </div>

                            <b-progress :variant=" infoColorsCurrenVelocity(getInfoContent(wsinfo[0]['infocalculada'],'percentage_complete',0)) " :value="getInfoContent(wsinfo[0]['infocalculada'],'percentage_complete',0)" height="3px" class="rounded-0" />
                            <div class="card-body small pt-2 pb-0">
                            </div>

                            <!-- <b-card-body class="pb-0">
                            </b-card-body> -->
                            

                               <div class="row mb-1">
                                    <div class="col text-center">
                                    <div class="text-muted small">Número de Ciclos</div>
                                        <div class="font-weight-bold">{{ getInfoContent(wsinfo[0]['infocalculada'],'nro_ciclos',0) }}</div>
                                    </div>
                                    <div class="col text-center">
                                        <div class="text-muted small">Defectuosas</div>
                                        <!-- completedPercent((itemws.PresetMinute*60)+(itemws.Preset01s/10.0), (itemws.LastCycleTimeMinutes*60)+(itemws.LastCycleTime01s/10.0)) -->
                                        <!-- <b-progress :value="0" height="3px" class="rounded-0" /> -->
                                        <div class="font-weight-bold">{{getInfoContent(wsinfo[0]['infocalculada'],'scrap_counter',0)}}</div>
                                        <div class="card-body small pt-2 pb-0">
                                            <!-- <strong>{{completedPercent(project.tasks, project.completedTasks)}}%</strong>  -->
                                        </div>
                                    </div>
                                </div>


                             <div class="row mb-1">
                                    <div class="col text-center">
                                    <div class="text-muted small">Tiempo de Trabajo</div>
                                        <div class="font-weight-bold">{{ getInfoContent(wsinfo[0]['infocalculada'],'tiempotrabajado',0) }}</div>
                                    </div>
                                    <div class="col text-center">
                                        <div class="text-muted small">Tiempo de Paro</div>
                                        <!-- completedPercent((itemws.PresetMinute*60)+(itemws.Preset01s/10.0), (itemws.LastCycleTimeMinutes*60)+(itemws.LastCycleTime01s/10.0)) -->
                                        <!-- <b-progress :value="0" height="3px" class="rounded-0" /> -->
                                        <div class="font-weight-bold">{{ getInfoContent(wsinfo[0]['infocalculada'],'stop_time',0) }}</div>
                                        <div class="card-body small pt-2 pb-0">
                                            <!-- <strong>{{completedPercent(project.tasks, project.completedTasks)}}%</strong>  -->
                                        </div>
                                    </div>
                                </div>

                                <div class="row mb-2">
                                    <div class="col">
                                        <div class="text-muted small ml-2">
                                            Ciclo Actual
                                             <div class="float-right mr-2"> {{ getInfoContent(wsinfo[0]['infocalculada'],'percentage_current_cycle',0) }}% </div>
                                        </div>
                                        <b-progress :variant="infoColorsCurrenVelocity(getInfoContent(wsinfo[0]['infocalculada'],'percentage_current_cycle',0))" :value=" getInfoContent(wsinfo[0]['infocalculada'],'percentage_current_cycle',0) " height="3px" class="rounded-0" />
                                        <div class="font-weight-bold text-center">{{ getInfoContent(wsinfo[0]['infocalculada'],'tiempocicloactual',0) }}</div>
                                    </div>
                                    <div class="col">
                                        <div class="text-muted small ml-2">Velocidad<div class="float-right mr-2"> {{getInfoContent(wsinfo[0]['infocalculada'],'percentage_last_cycle',0)}}% </div></div>
                                        <b-progress :variant="infoColorsVelocity(getInfoContent(wsinfo[0]['infocalculada'],'percentage_last_cycle',0))" :value="getInfoContent(wsinfo[0]['infocalculada'],'percentage_last_cycle',0)" height="3px" class="rounded-0" />
                                        <div class="font-weight-bold text-center">{{getInfoContent(wsinfo[0]['infocalculada'],'tiempoultimociclo',0)}}</div>
                                        <div class="card-body small pt-2 pb-0">
                                            <!-- <strong>{{completedPercent(project.tasks, project.completedTasks)}}%</strong>  -->
                                        </div>
                                    </div>
                                </div>

                             <!-- <apexchart type="radialBar" :options="chartOptions" :series="series"></apexchart> -->
                            <hr class="m-0">

                            <!-- <b-card-body class="py-3 text-center"> -->
                                <!-- <div class="text-muted small mb-2">Team</div> -->
                                <!-- <div class="d-flex flex-wrap">
                                <a v-for="member in project.team" href="javascript:void(0)" class="d-block mr-1 mb-1"><img :src="`/static/img/avatars/${member.avatar}`" alt="" class="ui-w-30 rounded-circle"></a>
                                </div> -->
                                <!-- <b-btn variant="outline-primary icon-btn btn-xl borderless"><span class="far fa-paper-plane"></span></b-btn> -->
                                <div class="d-flex justify-content-between">
                                    <div class="mt-2 mb-2 ml-2">
                                        <b-btn v-if=" (check_access('start_order','w') && (wsinfo[0].wsstatus == 'stopped'  || wsinfo[0].wsstatus == undefined)) " @click="editProductionOrder(wsinfo[0])" variant="outline-success icon-btn borderless"><span class="fas fa-play"></span></b-btn>
                                        <b-btn v-if=" (check_access('stop_order','w') &&  (wsinfo[0].wsstatus == 'running')) " @click="openFinOrder(wsinfo[0])" variant="outline-danger icon-btn borderless"><span class="fas fa-stop"></span></b-btn>
                                        <b-btn v-if=" (check_access('stop_order','w') && (wsinfo[0].wsstatus == 'stopped'  || wsinfo[0].wsstatus == undefined)) " @click="openChangeState(wsinfo[0])" variant="outline-info icon-btn borderless"><span class="fas fa-random"></span></b-btn>
                                        <b-btn v-if=" (check_access('report_unities','w') &&  wsinfo[0].wsstatus == 'running') " variant="outline-secondary icon-btn borderless" @click="open_manual_report(wsinfo[0])"><span class="fas fa-hand-paper"></span></b-btn>
                                        <!-- <b-btn size="sm" variant="outline-secondary icon-btn borderless"><span class="ion ion-ios-more"></span></b-btn> -->
                                    </div>
                                    <div class="mt-2 mr-2">
                                        <b-badge class="align-text-bottom" :variant="getInfoContent(wsinfo[0]['infocalculada'],'StatusStateCurrentColor','info')">{{getInfoContent(wsinfo[0]['infocalculada'],'StatusStateCurrentTitle','---')}}</b-badge>
                                    </div>
                                </div> 
                                <!--<b-btn size="sm" variant="outline-warning icon-btn btn-xs borderless"><span class="ion ion-md-bulb"></span></b-btn> -->
                            <!-- </b-card-body> -->

                        </b-card>
                    </div>
                    <div class="col-sm-6 col-xl-8">
                        <b-nav class="justify-content-end mt-2">
                            <b-nav tabs class="nav-sm tabs-alt">
                                <b-nav-item :active="selectTab=='timeline'" @click="selectTab='timeline'">Timeline</b-nav-item>
                                <b-nav-item :active="selectTab=='eficiencia_horahora'" @click="selectTab='eficiencia_horahora'">Eficiencia Hora a Hora</b-nav-item>
                            </b-nav>
                        </b-nav>

                        <div v-if="selectTab=='eficiencia_horahora'">
                            
                            <h3 class="display-5 text-center font-weight-bold mt-2">CONTROL HORA A HORA EFICIENCIA</h3>
                                <div id="container" ></div>
                        </div>
                        <div v-if="selectTab=='timeline'">
                            <h2 class="text-center">TIMELINE</h2>
                            
                            <perfect-scrollbar style="height: 300px; width:100%" class="ml-3 mb-3">
                                <light-timeline :items='itemTimeLine'></light-timeline> 
                            </perfect-scrollbar>
                        </div>
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
                                     <b-nav-item :active="seleccion == 'timeline'" @click="seleccionPestana('timeline')">Timeline</b-nav-item>
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
                  
                <drump :id_plant="idplant" :code_group="idgroup" :code_workstation="idworkstation"></drump>
            </b-tab>
        </b-tabs>


        <sweet-modal ref="showEditForm" title="Iniciar Ordenes de Producción" width="90%">
            <!-- <div slot="modal-title">
                Iniciar <span class="font-weight-light">Ordenes de Producción</span><br>
            </div> -->
            
             <div class="h2 text-center">{{wsinfo[0]['wscode']}}</div>
            <!-- <perfect-scrollbar style="height: 500px; width:100%"> -->
                <orders ref="open_orders" style="width:98%"/>
            <!-- </perfect-scrollbar> -->

             <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="closeProductionOrder()">Cerrar</b-btn>
            </div>
        </sweet-modal>

        <sweet-modal ref="showStopOrders" title="Finalizar Ordenes de Producción" width="90%">
        <!-- <b-modal id="modals-top" v-model="showFinOrders"  class="modal-center" size="lg"> -->


             <div class="h2 text-center">{{wsinfo[0]['wscode']}}</div>
            <!-- <perfect-scrollbar style="height: 500px; width:100%"> -->
                <stoporders ref="stop_orders" style="width:98%"/>
            <!-- </perfect-scrollbar> -->

             <!-- <div slot="modal-footer" class="w-100 text-right"> -->
                <!-- <b-btn variant="primary" @click="closeFinOrder()">Cerrar</b-btn> -->
            <!-- </div> -->
        <!-- </b-modal> -->

            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="closeStopOrder()">Cerrar</b-btn>
            </div>
        </sweet-modal>
        <!-- <b-modal id="modals-top" v-model="manual_report"  class="modal-center" size="lg"> -->
            <sweet-modal ref="manual_report" width="90%">

                <div class="h2 text-center">{{wsinfo[0]['wscode']}}</div>
                
                <mreport ref="mreport"></mreport>
                    <!-- <div slot="modal-footer" class="w-100 text-right"> -->
                    <!-- </div> -->
            </sweet-modal>
        <!-- </b-modal> -->
    </div>
</template>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import Vue from 'vue'
import VueResource from "vue-resource"
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component'

import Notifications from 'vue-notification'
import VueMarkdown from 'vue-markdown'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'

import { realtime } from '@/vendor/sbx/sbx-realtime/realtime'
import LinearGauge from 'vue-canvas-gauges/src/LinearGauge'
import RadialGauge from 'vue-canvas-gauges/src/RadialGauge'

import stoporders from './stop_orders'
import orders from './operation_orders'
import chartspie from './charts/charts_pie'

import LightTimeline from "vue-light-timeline"
import drump from '@/components/sbx/production/drump.vue'
import mreport from '@/components/sbx/production/reports/manual_reports'
import {infousers} from '@/components/i40/js/users'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

Vue.use(LightTimeline)
Vue.use(Notifications)
Vue.use(VueResource)

function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
    
    name: 'sbx-glb-realtime',
    metaInfo: {
        title: 'Real Time'
    },

    watch: {
        '$route.params.idfloor': function(value){
            this.idplant = this.$route.params.idfloor
        },

        '$route.params.idgroup':function(value){
            this.idgroup = this.$route.params.codegroup
        },

        '$route.params.wscode':function(value){
            this.idworkstation = this.$route.params.wscode
        },


    },

    components:{
        stoporders,
        mreport,
        drump,
        PerfectScrollbar,
        Datepicker, 
        flatPickr,
        LinearGauge,
        RadialGauge,
        orders,
        chartspie,
        SweetModal,
    },

    data: () => ({
        selectTab:'timeline',
        existeContainer:false,

        idplant:undefined,
        idgroup:undefined,
        idworkstation:undefined,

        startDate:null,
        finishDate:null,
            
        datetimeConfig: {
            dateFormat: 'Y-m-d H:i',
            enableTime: true,
            altInput: true,
            animate: !isRTL()
        },

        wsinfo :{},

        indicadores:{
            disponibilidad:0,
            eficiencia:0,
            calidad:0,
            oee:0.0
        },
        
        // showEditForm:false,
        showFinOrders:false,
        seleccion:'paros',

        intervalTimeLine:null,
        nuevalineatiempo:null,
        itemTimeLine:[],
        wscode:"",
        selected_item:{},
        dos:[
            {name:'06:00', y:96.2},
            {name:'07:00', y:85.8},
            {name:'08:00', y:99.9},
            {name:'09:00', y:103.7},
            {name:'10:00', y:98.1},
            {name:'11:00', y:78.7},
            {name:'12:00', y:91.4},
            {name:'13:00', y:89.2},
            {name:'14:00', y:96.8},
            {name:'15:00', y:95.9},
            {name:'16:00', y:83.7},
            {name:'17:00', y:89.1},
            {name:'18:00', y:90.9}
        ],
        tiemporefresh:5000,
    }),
    computed: {
        
    },
    methods: {

        check_access(control, action){
            return infousers.check_access(control,action)
        }, 
        open_manual_report(prop1){
            this.$refs.mreport.getInfo(prop1)
            this.$refs.manual_report.open() 
            // this.manual_report = true
        },

        completedPercent (tasks, completed) {
            if(tasks == 0)
                return 0
            return Math.round((completed / tasks) * 100)
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

        infoColorsOEE(value){
            return realtime.infoColorsOEE(value)
        },

        infoColorsVelocity(value){
            return realtime.infoColorsVelocity(value)
        },

        infoColorsCurrenVelocity(value){
            return realtime.infoColorsCurrenVelocity(value)
        },

        getContent(){
            realtime.infoContentWorkstationOEE(this.wscode).then(data => {
                if(data.status == 200){
                    this.wsinfo = data.data
                    // console.log(this.wsinfo[0])
                    // this.indicadores = data.data[0].content_general[0]
                    // this.tableData =  data.data[0].content_resources
                }
            })
        },

        editProductionOrder(item){
            this.selected_item = item
            this.$refs.open_orders.abrirOrdenes(item)
            this.$refs.showEditForm.open()
        },

        closeFinOrder(){
            this.showFinOrders=false
        },

        openFinOrder(item){
            console.log('uno')
            this.$refs.stop_orders.abrirOrdenes(item)
            this.$refs.showStopOrders.open()
            this.$refs.stop_orders.getParos(item, 'stop')
            // this.showFinOrders = true
        },

        openChangeState(item){

            this.$refs.showStopOrders.open()
            this.$refs.stop_orders.getParos(item, 'change_status')
            // this.showFinOrders = true
        },

        closeProductionOrder(){
            // this.showEditForm=false
            this.$refs.showEditForm.close()
        },


        closeStopOrder(){
            // this.showEditForm=false
            this.$refs.showStopOrders.close()
        },

        getInfoContent(value, variable, retorno){
            if(value != undefined){
                return JSON.parse(value.replace(/'/g, '"'))[variable]
            }else{
                return retorno
            }
        },
        loadchart(){
            if (document.getElementById("container") && this.existeContainer == false) {
                this.plot_stoptime2("container", this.dos, "EFICIENCIA/HORA A HORA", this, "column")
                this.existeContainer = true
            }else{
                this.tiemporefresh=50000

                let hst = window.location.hostname
      // let reports = 'http://'+'20.0.0.49'+':2221'
                let reports = 'http://'+hst+''
                this.$http.get(reports+'/sbxtvwscontroller/fustec').then(respuesta =>{
                            return respuesta.json()
                        })
                        .then(resultado =>{
                        this.dos = []

                        for(var item in resultado[0].eficienciahorahora){
                            this.dos.push({name:resultado[0].eficienciahorahora[item].hh,y:resultado[0].eficienciahorahora[item].eficiencia})
                        }

                        let array=this.dos
                        for (let index = 0; index < array.length; index++) {
                            this.dos[index]["color"] = this.dos[index]["y"]<70?'#EF5350':'#5BD34D';
                        }

                        this.plot_stoptime2("container", this.dos, "EFICIENCIA/HORA A HORA", this, "column")

                })
                
            }
        },

        getRealTimeTimeline(){
            realtime.getReport("ws", "timeline", this.wscode, moment().add(-8,'hours').format("YYYY-MM-DDTHH:mm:ss"), moment().format("YYYY-MM-DDTHH:mm:ss")).then(data=>{
                if(data.status == 200){
                    this.itemTimeLine = data.data
                    // console.log(this.wsinfo[0])
                    // this.indicadores = data.data[0].content_general[0]
                    // this.tableData =  data.data[0].content_resources
                }
            })
        },
        ///DATOS REPORTES
        cargarDatos(start,finish,code){
            this.$refs.stoptimes.openCharts(this.seleccion, "ws",this.wscode,this.startDate+":00", this.finishDate+":59")
        },

        ///pestana
        seleccionPestana(item){
            this.seleccion = item

            if(this.startDate != "" && this.finishDate != ""){
                this.$refs.stoptimes.openCharts(this.seleccion, "ws",this.wscode,this.startDate+":00", this.finishDate+":59")
            }
        },

        plot_stoptime2(div_info, items, name, compo, type, meta){

            var pieColors = (function () {
            var colors = [],
                base = Highcharts.getOptions().colors[0],
                i;

                for (i = 0; i < 10; i += 1) {
                    // Start out with a darkened base color (negative brighten), and end
                    // up with a much brighter color
                    colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
                }
                return colors;
            }());


        Highcharts.chart(div_info, {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: type,

              spacing: [0, 0, 0, 0],
              backgroundColor: null 
            },
            title: {
              text: "",
            },
            
            legend:{ enabled:false },
            tooltip: {
              pointFormat: `{point.name}: <b>{point.y:.1f}${type=="column"?'%':''}</b>`
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,

                  format: "{point.y:.1f}%",
                        style: {
                            fontSize: '16px',
                            // color:'#32A9E1',
                        }
                    }
                }
            },
            xAxis: {
                startOnTick: false,
                type: 'category',
                labels: {
                    rotation: 0,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif',
                        // color:'#32A9E1',
                    }
                }
            },
            yAxis: {
               labels: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                min:0,
                max:110,
                minPadding: 0,
                maxPadding: 0,
                gridLineWidth: 0,
                title: null,

                plotLines: [{
                  zIndex: 1000,
                  value: meta,
                  color: '#32A9E1',
                  // dashStyle: 'shortdash',
                  width: 5,
                  label: {
                      text: `${meta}%   p`,
                      align: 'right',
                      y:-70,
                      x:12,
                    style: {
                        fontSize: '20px',
                        fontFamily: 'Verdana, sans-serif',
                        color:'#32A9E1',
                    }
                }
              }]
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
        // console.log(this.$refs)
        this.wscode = this.$route.params['wscode']
        this.getRealTimeTimeline()
        this.$options.interval = setInterval(this.getContent, 1000)
        this.intervalTimeLine = setInterval(this.getRealTimeTimeline, 5000)
        this.nuevalineatiempo = setInterval(this.loadchart, this.tiemporefresh)
        //rhis.tiemporefresh    
        
    },
    mounted(){
        let array=this.dos
        for (let index = 0; index < array.length; index++) {
            this.dos[index]["color"] = this.dos[index]["y"]<95?'#EF5350':'#5BD34D';
        
        }
        this.plot_stoptime2("container", this.dos, "EFICIENCIA/HORA A HORA", this, "column")
    },
    beforeDestroy () {
        clearInterval(this.$options.interval)
        clearInterval(this.intervalTimeLine)
        clearInterval(this.nuevalineatiempo)
    }
}
</script>
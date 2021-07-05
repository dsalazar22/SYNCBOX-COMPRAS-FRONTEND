<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Estado de Llamadas</h4>
    
        <!-- <b-tabs class="nav-tabs-top nav-responsive-xl mt-4">
            <b-tab title="Llamadas" :active="true">                 -->


                <div v-if="llamando.length > 0" class="m-2">
                    <h2>Llamando</h2>

                    <table class="table table-sm mt-2">
                        <thead>
                            <th>Codigo CT</th>
                            <th>Area</th>
                            <th>Etapa</th>
                            <th>Responsable</th>
                            <th>Fecha Inicio</th>
                            <th>Minutos Transcurridos</th>
                            <th>Acción</th>
                        </thead>
                        <tbody>
                            <tr v-for="item in llamando">
                                    <!-- :class="{'badge-dot': true, 'background-color': '#000'}" -->
                                    <!-- <td><b-badge  class="badge-dot" :style="{'background-color': item.color}" /> {{item.name}}</td>
                                    <td><b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="ax.series[item.index].remove();"><i class="ion ion-md-close"></i></b-btn></td> -->
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.wscode}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.area_description}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.stage}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.personal_name}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.start_date}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.elapsed_minute}} </b> </td>
                                    
                                    <td :style="color_stage(item, item.order_stage)">           
                                        <b-btn
                                            :variant="color_button(item, item.order_stage)"
                                            v-if="check_access('floor_root', 'c')"
                                            class="btn-xs"
                                            @click.prevent="editProductionOrder(item)" >
                                            <i class="ion ion-md-create"></i>
                                        </b-btn>
                                    </td>
                                </tr>
                            </tbody>
                    </table>  
                </div>



                <div v-if="no_disponible.length > 0" class="m-2">
                    <h2>No Disponible</h2>

                    <table class="table table-sm mt-2">
                        <thead>
                            <th>Codigo CT</th>
                            <th>Area</th>
                            <th>Etapa</th>
                            <th>Responsable</th>
                            <th>Fecha Inicio</th>
                            <th>Minutos Transcurridos</th>
                            <th>Acción</th>
                        </thead>
                        <tbody>
                            <tr v-for="item in no_disponible">
                                    <!-- :class="{'badge-dot': true, 'background-color': '#000'}" -->
                                    <!-- <td><b-badge  class="badge-dot" :style="{'background-color': item.color}" /> {{item.name}}</td>
                                    <td><b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="ax.series[item.index].remove();"><i class="ion ion-md-close"></i></b-btn></td> -->
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.wscode}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.area_description}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.stage}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.personal_name}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.start_date}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.elapsed_minute}} </b> </td>
                                    
                                    <td :style="color_stage(item, item.order_stage)">           
                                        <b-btn
                                            :variant="color_button(item, item.order_stage)"
                                            v-if="check_access('floor_root', 'c')"
                                            class="btn-xs"
                                            @click.prevent="editProductionOrder(item)" >
                                            <i class="ion ion-md-create"></i>
                                        </b-btn>
                                    </td>
                                </tr>
                            </tbody>
                    </table>  
                </div>



                <div v-if="gestionando.length > 0" class="m-2">
                    <h2>Gestionando</h2>

                    <table class="table table-sm mt-2">
                        <thead>
                            <th>Codigo CT</th>
                            <th>Area</th>
                            <th>Etapa</th>
                            <th>Responsable</th>
                            <th>Fecha Inicio</th>
                            <th>Minutos Transcurridos</th>
                            <th>Acción</th>
                        </thead>
                        <tbody>
                            <tr v-for="item in gestionando">
                                    <!-- :class="{'badge-dot': true, 'background-color': '#000'}" -->
                                    <!-- <td><b-badge  class="badge-dot" :style="{'background-color': item.color}" /> {{item.name}}</td>
                                    <td><b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="ax.series[item.index].remove();"><i class="ion ion-md-close"></i></b-btn></td> -->
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.wscode}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.area_description}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.stage}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.personal_name}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.start_date}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.elapsed_minute}} </b> </td>
                                    
                                    <td :style="color_stage(item, item.order_stage)">           
                                        <b-btn
                                            :variant="color_button(item, item.order_stage)"
                                            v-if="check_access('floor_root', 'c')"
                                            class="btn-xs"
                                            @click.prevent="editProductionOrder(item)" >
                                            <i class="ion ion-md-create"></i>
                                        </b-btn>
                                    </td>
                                </tr>
                            </tbody>
                    </table>  
                </div>

                <div v-if="otros.length > 0" class="m-2">
                    <h2>Otros Estados</h2>

                    <table class="table table-sm mt-2">
                        <thead>
                            <th>Codigo CT</th>
                            <th>Area</th>
                            <th>Etapa</th>
                            <th>Responsable</th>
                            <th>Fecha Inicio</th>
                            <th>Minutos Transcurridos</th>
                            <th>Acción</th>
                        </thead>
                        <tbody>
                            <tr v-for="item in otros">
                                    <!-- :class="{'badge-dot': true, 'background-color': '#000'}" -->
                                    <!-- <td><b-badge  class="badge-dot" :style="{'background-color': item.color}" /> {{item.name}}</td>
                                    <td><b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="ax.series[item.index].remove();"><i class="ion ion-md-close"></i></b-btn></td> -->
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.wscode}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.area_description}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.stage}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.personal_name}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.start_date}} </b> </td>
                                    <td :style="color_stage(item, item.order_stage)" ><b> {{item.elapsed_minute}} </b> </td>
                                    
                                    <td :style="color_stage(item, item.order_stage)">           
                                        <b-btn
                                            :variant="color_button(item, item.order_stage)"
                                            v-if="check_access('floor_root', 'c')"
                                            class="btn-xs"
                                            @click.prevent="editProductionOrder(item)" >
                                            <i class="ion ion-md-create"></i>
                                        </b-btn>
                                    </td>
                                </tr>
                            </tbody>
                    </table>  
                </div>
            <!-- </b-tab>
            <b-tab title="Estadística">
                 <b-card no-body class="mb-0 mt-0">
                    <b-card-header header-tag="h6" class="with-elements">
                         <div class="card-header-title">Estadística</div>
                         <div class="card-header-elements ml-auto">
                             <div class="d-flex justify-content-end mb-1">
                                 <b-nav tabs class="nav-sm tabs-alt mr-2 ml-2"> -->
                                     <!-- <b-nav-item :active="seleccion == 'paros'" @click="seleccionPestana('paros')">Tiempos de Paro</b-nav-item>
                                     <b-nav-item :active="seleccion == 'ttotales'" @click="seleccionPestana('ttotales')">Tiempos Totales</b-nav-item>
                                     <b-nav-item :active="seleccion == 'undtotales'" @click="seleccionPestana('undtotales')">Unidades Totales</b-nav-item>
                                     <b-nav-item :active="seleccion == 'timeline'" @click="seleccionPestana('timeline')">Timeline</b-nav-item>
                                     <b-nav-item :active="seleccion == 'ord_prod'" @click="seleccionPestana('ord_prod')">Productos</b-nav-item>
                                     
                                     <b-nav-item :active="seleccion == 'oee'" @click="seleccionPestana('oee')">OEE</b-nav-item> -->
                                 <!-- </b-nav>
                             </div> -->
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
                         <!-- </div> -->
                    <!-- </b-card-header> -->
                    <!-- <div class="row mt-2">
                        <div class="col-md-1"></div>
                            <div class="col-md-4">
                                    <flat-pickr v-model="startDate" :config="datetimeConfig" :placeholder="'Fecha Inicial'" />
                            </div>
                            <div class="col-md-4">
                                    <flat-pickr v-model="finishDate" :config="datetimeConfig" :placeholder="'Fecha Final'" />
                            </div>
                        <div class="col-md-3">
                            <button type="button" class="btn btn-success" v-on:click="cargarDatos('')">Consultar</button>
                                
                        </div>
                    </div>
                </b-card>
            </b-tab>
        </b-tabs> -->


        <sweet-modal ref="showEditForm" title="Asignar Responsable de Asistencia" width="70%">

            <div>

                <h3>
                    Seleccione el Responsable para Asistir el Llamado
                </h3>
            
            </div>
            <div class="row mb-3" >
                <div class="col-9">
                    <multiselect
                        v-model="itemselected"
                        :options="info_operator"
                        label="concat"
                        :searchable="true"
                        :show-labels="false"
                        placeholder="Asiste Llamado"
                    />
                </div>
                <div class="col-3">
                    <b-button :variant="this.itemselected.wscode == null ? 'success' : 'warning'" @click="set_personal()">Asignar Responsable</b-button>
                </div>
            </div>


            <div class="row mb-4">
                <div class="col">
                    <b-btn
                        variant="outline-warning"
                        block
                        @click.prevent="set_no_disponible()" >
                        <!-- <i class="ion ion-md-create"></i> -->
                        PERSONAL NO DISPONIBLE
                    </b-btn>
                </div>
            </div>

            <div class="text-center mt-2">
                        <b-btn
                        variant="outline-info borderless"
                        @click.prevent="closeProductionOrder()" >
                        <!-- <i class="ion ion-md-create"></i> -->
                        CERRAR VENTANA
                    </b-btn>
            </div>
        </sweet-modal>

    <b-modal ref="my-modal" hide-footer title="Sistema de Llamados" :no-close-on-esc="true">
      <div class="d-block text-center">
        <h3>¡Recuerda Activar los Altavoces del Equipo!</h3>
      </div>
      <b-button class="mt-3" variant="outline-info" block @click="hideModal">OK</b-button>
    </b-modal>

    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import Vue from 'vue'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component'

import Notifications from 'vue-notification'
import VueMarkdown from 'vue-markdown'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'

import { realtime } from '@/vendor/sbx/sbx-realtime/realtime'
import LinearGauge from 'vue-canvas-gauges/src/LinearGauge'
import RadialGauge from 'vue-canvas-gauges/src/RadialGauge'

import orders from './operation_orders'
import stoporders from './stop_orders'
import chartspie from './charts/charts_pie'

import LightTimeline from "vue-light-timeline"
import {infousers} from '@/components/i40/js/users'
import { infoproduction } from "@/components/i40/js/production";

import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import Multiselect from 'vue-multiselect';

Vue.use(LightTimeline)
Vue.use(Notifications)



function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
    
    name: 'sbx-glb-realtime',
    metaInfo: {
        title: 'Llamadas'
    },

    components:{
        PerfectScrollbar,
        Datepicker, 
        flatPickr,
        LinearGauge,
        RadialGauge,
        orders,
        stoporders,
        chartspie,
        SweetModal,
        Multiselect
    },

    data: () => ({
       info_operator:[],
       itemselected:{},

        startDate:null,
        finishDate:null,
            
        datetimeConfig: {
            dateFormat: 'Y-m-d H:i',
            enableTime: true,
            altInput: true,
            animate: !isRTL()
        },

        wsinfo :{},
        
        // showEditForm:false,
        showFinOrders:false,
        seleccion:'paros',

        intervalTimeLine:null,
        itemTimeLine:[],
        wscode:"",

        manual_report:false,
        contentRows:[],
        selected_item:{},

        color_titilando_bg:'#d9534f',
        no_disponible_color_bg: "#f0ad4e",
        no_disponible_color_text: "#f0ad4e",

        count_calls:0,
        current_calls:0,

        llamando:[],
        gestionando:[],
        no_disponible:[],
        otros:[],

    }),
    methods: {

        hideModal() {
        this.$refs['my-modal'].hide()
      },

      color_button(item, stage){
          

            if(stage == 1)
                if (this.color_titilando_text != '#f7f7f7')
                    return "outline-success borderless icon-btn"
                else
                    return "outline-white borderless icon-btn"
            else if(stage == 2)
                return "outline-white borderless icon-btn"
            else if(stage == 3)
                return "outline-white borderless icon-btn"
            else if(stage == 4)
                return "outline-white borderless icon-btn"
            else if(stage == 9)
                if (this.color_titilando_text != '#f7f7f7')
                    return "outline-success borderless icon-btn"
                else
                    return "outline-white borderless icon-btn"

      },

        color_stage(item, stage){
            // if(stage != 1)
            //     console.log(stage)
            if(stage == 1)
                return {background: this.color_titilando_bg, color: this.color_titilando_text}
            else if(stage == 2)
                // return {background: "#d9534f", color: "#f7f7f7"}
                return {background: "#0275d8", color: "#f7f7f7"}
            else if(stage == 9)
                return {background: this.no_disponible_color_bg, color: this.no_disponible_color_text}
            else if(stage == 3)
                return {background: "#5cb85c", color: "#f7f7f7"}
            else if(stage == 4)
                return {background: "#5cb85c", color: "#f7f7f7"}
        },

        check_access(control, action){
            return infousers.check_access(control,action)
        }, 

        open_manual_report(prop1){
            this.$refs.mreport.getInfo(prop1)
            this.manual_report = true
        },

        completedPercent (tasks, completed) {
            if(tasks == 0)
                return 0
            return Math.round((completed / tasks) * 100)
        },

        getContent(){
            realtime.callerscontroller("select", "{}").then(data => {
                this.current_calls = 0
                this.llamando=[]
                this.gestionando=[]
                this.no_disponible=[]
                this.otros=[]
                if(data.status == 200){
                    this.contentRows = data.data

                    for (let index = 0; index < this.contentRows.length; index++) {
                        const element = this.contentRows[index];
                        if(element.order_stage == 1){
                            this.current_calls += 1
                        }

                        if(element.stage == "LLAMANDO")
                            this.llamando.push(element)
                        else if (element.stage == "GESTIONANDO")
                            this.gestionando.push(element)
                        else if (element.stage == "NO DISPONIBLE")
                            this.no_disponible.push(element)
                        else
                            this.otros.push(element)
                        // console.log()
                        // if(element.stage == "")
                        
                    }
                }
            })
        },


        set_personal(){
            // let part = this.itemselected.concat.split('(')[1]
            // part.split(')')[0]
            
            realtime.callerscontroller("change_stage", {calls_history_id: this.selected_item.calls_history_id, calls_id: this.selected_item.calls_id, calls_stages_id: 3, status: true,  personal_id: this.itemselected.personal_id}).then(data => {
                if(data.status == 200){
                    this.contentRows = data.data
                    this.send_message("3")
                }
            })
            
        },

        set_no_disponible(){
            realtime.callerscontroller("change_stage", {calls_history_id: this.selected_item.calls_history_id, calls_id: this.selected_item.calls_id, calls_stages_id: 9, status: true}).then(data => {
                if(data.status == 200){
                    this.contentRows = data.data
                    this.send_message("8")
                }
            })
        },

        send_message(code){
            let callers_code = (parseInt(this.selected_item.callers_code)<=9 ? "0" : "") + this.selected_item.callers_code
            let wsc = this.selected_item.wscode.replace(' ','-')
            wsc = wsc.replace(' ','-')
            wsc = wsc.replace(' ','-')
            wsc = wsc.replace(' ','-')
            let fullmessage = 'w:ESTADO_LLAMADO_'+callers_code+':'+wsc
            // console.log(fullmessage)
            realtime.apirunset(2,fullmessage,code).then(data => {
                    // console.log(data)
                })
        },

        editProductionOrder(item){
            this.selected_item = item
            // this.$refs.open_orders.abrirOrdenes(item)

            if (item.order_stage == 1){

                realtime.callerscontroller("change_stage", {calls_history_id: item.calls_history_id, calls_id: item.calls_id, calls_stages_id: 2, status: true}).then(data => {
                    if(data.status == 200){
                        this.contentRows = data.data
                        this.send_message("2")
                    }
                })
            }
            this.$refs.showEditForm.open()
        },

        closeFinOrder(){
            this.showFinOrders=false
        },

        openFinOrder(item){
            this.$refs.stop_orders.getParos(item, 'stop')
            this.showFinOrders = true
        },

        openChangeState(item){
            this.$refs.stop_orders.getParos(item, 'change_status')
            this.showFinOrders = true
        },

        closeProductionOrder(){
            // this.showEditForm=false
            this.$refs.showEditForm.close()
        },

        getInfoContent(value, variable, retorno){
            if(value != undefined){
                return JSON.parse(value.replace(/'/g, '"'))[variable]
            }else{
                return retorno
            }
        },

        playSound () {
            var audio = new Audio(`${this.publicUrl}audio/calling.wav`);
            audio.play();
        },

        playSoundEveryMinutes () {
            if(this.llamando.length > 0 || this.gestionando.length > 0 || this.no_disponible.length > 0){
                var audio = new Audio(`${this.publicUrl}audio/calls.wav`);
                audio.play();
            }
        },

        ///DATOS REPORTES
        cargarDatos(start,finish,code){
            // this.$refs.stoptimes.openCharts(this.seleccion, "ws",this.wscode,this.startDate+":00", this.finishDate+":59")
        },

        colors_change(){

            if(this.current_calls>this.count_calls){
                this.count_calls = this.current_calls
                this.playSound()
            }else if(this.current_calls<this.count_calls){
                this.count_calls = this.current_calls
            }

            if (this.color_titilando_bg == '#d9534f'){
                this.color_titilando_bg = '#fff'
                this.color_titilando_text = '#292b2c'
            }else{
                this.color_titilando_bg = '#d9534f'
                this.color_titilando_text = '#f7f7f7'
            }


            if (this.no_disponible_color_bg == "#f0ad4e"){
                this.no_disponible_color_bg = '#fff'
                this.no_disponible_color_text = '#292b2c'
            }else{
                this.no_disponible_color_bg = "#f0ad4e"
                this.no_disponible_color_text = '#292b2c'
            }
        }
    },

    mounted(){
        this.$refs['my-modal'].show()
    },
    created() {
        this.$options.interval = setInterval(this.playSoundEveryMinutes, 300000)
        this.$options.interval = setInterval(this.getContent, 1000)
        this.$options.interval = setInterval(this.colors_change, 800)
        infoproduction.loadoperators("select", "{}").then(data =>{
            this.info_operator=data.data
        })

       
    },
    beforeDestroy () {
        clearInterval(this.$options.interval)
    }
}
</script>
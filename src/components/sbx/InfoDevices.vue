<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">Diagnóstico SyncBox i4.0</h4>
    <!-- <p>This page is an example of basic layout. For more options use <strong>Vue starter template generator</strong> in the docs.</p> -->
    <!-- <p><button class="btn btn-primary btn-lg">Button</button></p> -->
    
    
    <div class="bg-white container-p-x py-5 container-m--x container-m--y mb-0">

      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 class="font-weight-light mb-2">Estado del Servidor</h2>
          <!-- <b-btn variant="outline-info icon-btn" class="btn-sm"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn> -->
          <div :class="infoStatusServer">{{infoTextStatusServer}}</div>
        </div>
        <div class="row">
            <div class="col">
                  <b-btn variant="outline-warning " size="lg" v-if="check_access('info_check', 'c')" @click.prevent="restartServer()"><i class="ion ion-md-refresh"></i> Reiniciar Servidor </b-btn>
                <!-- <b-btn class="bg-warning text-warning" size="lg">
                    <i class="ion ion-md-refresh"></i>&nbsp; Reiniciar Servidor
                </b-btn> -->
            </div>
        <!-- <div class="col">
         <b-btn variant="default" size="lg">
          <i class="ion ion-md-power text-danger"></i>&nbsp; Apagar Servidor
        </b-btn>
        </div> -->
        </div>
      </div>

      <!-- Stats -->
      <div class="row">
        <div class="col-sm-6 col-md-4 col-lg-6 col-xl-4">

          <div class="border-light ui-bordered p-3 mt-2">
            <div class="media align-items-center">
              <div class="media-body small mr-3">
                <div class="font-weight-semibold mb-3">PROCESADOR</div>
                <div class="mb-1">Total: {{infoServer === null ? 0 : infoServer.CPU.Total}}</div>
                <div class="mb-1">Busy: {{infoServer === null ? 0 : infoServer.CPU.Busy}}</div>
                <div>{{infoServer === null ? 0 : infoServer.Uptime}}</div>
              </div>
              <div class="d-flex align-items-center position-relative mr-3" style="height:60px;width: 135px;">
                
                <donut-chart :percent="parseFloat(infoServer === null ? 0 : infoServer.CPU.Usage)" 
                    foreground-color="#d9534f" background-color="#bada55" 
                    :stroke-width="8" :radius="80" class="w-100 position-absolute" 
                    :height="110"></donut-chart>
                <!-- <dashboard4-chart1 class="w-100 position-absolute" :height="60" style="top:0" /> -->
                <div class="w-100 text-right mr-2 font-weight-bold">{{infoServer === null ? 0 : infoServer.CPU.Usage}} %</div>
              </div>
            </div>
          </div>

        </div>
        <div class="col-sm-6 col-md-4 col-lg-6 col-xl-4">

          <div class="border-light ui-bordered p-3 mt-2">
            <div class="media align-items-center">
              <div class="media-body small mr-3">
                <div class="font-weight-semibold mb-3">MEMORIA</div>
                <div class="mb-1">Total: {{infoServer === null ? 0 : infoServer.Memory.Total}}</div>
                <div class="mb-1">Used: {{infoServer === null ? 0 : infoServer.Memory.Used}}</div>
                <div>Free: {{infoServer === null ? 0 : infoServer.Memory.Free}}</div>
              </div>
               <div class="d-flex align-items-center position-relative mr-3" style="height:60px;width: 135px;">
                 <donut-chart :percent="parseFloat(infoServer === null ? 0 : infoServer.Memory.Usage)" foreground-color="#d9534f" background-color="#bada55" 
                    :stroke-width="8" :radius="80" class="w-100 position-absolute" 
                    :height="110"></donut-chart>
                <!-- <dashboard4-chart1 class="w-100 position-absolute" :height="60" style="top:0" /> -->
                <div class="w-100 text-right mr-2 font-weight-bold">{{infoServer === null ? 0 : infoServer.Memory.Usage}} %</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6 col-md-4 col-lg-6 col-xl-4">
          <div class="border-light ui-bordered p-3 mt-2">
            <div class="media align-items-center">
              <div class="media-body small mr-3">
                <div class="font-weight-semibold mb-3">ALMACENAMIENTO</div>
                <div class="mb-1">Total: {{infoServer === null ? 0 : infoServer.Disk.Total}}</div>
                <div class="mb-1">Used: {{infoServer === null ? 0 : infoServer.Disk.Used}}</div>
                <div>Free: {{infoServer === null ? 0 : infoServer.Disk.Free}}</div>
              </div>
              <div class="d-flex align-items-center position-relative mr-2" style="height:60px;width: 135px;">
                 <donut-chart :percent="parseFloat(infoServer === null ? 0 : infoServer.Disk.Usage)" 
                 foreground-color="#d9534f" background-color="#bada55" 
                    :stroke-width="8" :radius="80" class="w-100 position-absolute" 
                    :height="110"></donut-chart>
                <!-- <dashboard4-chart1 class="w-100 position-absolute" :height="60" style="top:0" /> -->
                <div class="w-100 text-right mr-2 font-weight-bold">{{infoServer === null ? 0 : infoServer.Disk.Usage}} %</div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <!-- / Stats -->

    </div>

    
    
    
    <b-tabs class="nav-tabs-top nav-responsive-xl mt-3">
        <b-tab title="Estado Dispositivos" active>
            <div class="card-body">
                <b-table small show-empty  stacked="md" :items="itemsDispositivos" :fields="fieldsDispositivos">
                    <template v-slot:cell(UltimaFechaConexion)="row">  
                        {{ unixtodate(row.item.UltimaFechaConexion) }}
                    </template>
                    <template v-slot:cell(FechaActual)="row">
                        {{ unixtodate(row.item.FechaActual) }}
                    </template>
                    <template v-slot:cell(EnLinea)="row">
                        <div  class="text-center">
                            <span style="color:red" v-if="!row.item.EnLinea"><i class="ion ion-md-close"></i></span>
                            <span style="color:green" v-if="row.item.EnLinea"><i class="ion ion-md-checkmark"></i></span>
                        </div>
                    </template>
                </b-table>
            </div>
        </b-tab>
        <b-tab title="Estado Servicios">
            <div class="card-body">
                 <b-table small show-empty  stacked="md" :fields="fieldsCheckServicios" :items="statusServices">
                     <template v-slot:cell(EnLinea)="row">
                        <div class="ml-3">
                            <span style="color:red" v-if="row.item.Estado != 'active'"><i class="ion ion-md-close"></i></span>
                            <span style="color:green" v-if="row.item.Estado === 'active'"><i class="ion ion-md-checkmark"></i></span>
                        </div>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <div >
                            <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="infoService(row.item)" v-b-modal.modallg><i class="ion ion-md-information-circle-outline"></i></b-btn>
                            <b-btn variant="outline-warning borderless icon-btn" v-if="row.item.Estado === 'active'" class="btn-xs" @click.prevent="serviceAction(row.item.Nombre,'restart')"><i class="ion ion-md-refresh"></i></b-btn>
                            <b-btn variant="outline-success borderless icon-btn" v-if="row.item.Estado != 'active'" class="btn-xs" @click.prevent="serviceAction(row.item.Nombre,'start')"><i class="ion ion-md-arrow-dropright-circle"></i></b-btn>
                            <b-btn variant="outline-success borderless icon-btn" v-if="row.item.Nombre=='syncboxconnect'" class="btn-xs" @click="confirmUpdate=true"><i class="ion ion-ios-sync"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" v-if="row.item.Estado === 'active'" class="btn-xs" @click.prevent="serviceAction(row.item.Nombre,'stop')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                </b-table>
            </div>
        </b-tab>
        <!-- <b-tab title="Variables SyncBox">
            <div class="card-body">
                <b-table show-empty  stacked="md" :items="itemsVariablesDispotivos">
                   
                </b-table>
            </div>
        </b-tab> -->
    </b-tabs>
     <sweet-modal ref="simpleAlert" >
        <div v-html="infoStatusService" class="text-left">
        </div>
  </sweet-modal>
  <notifications group="notifications-default" />
 <b-modal id="modallg" size="lg" :title="titleHeaderInfoService" :header-bg-variant="headerBgInfoService"
             :header-text-variant="headerTextinfoService">
     <div v-html="infoStatusService" style="font-family: Lucida Console,Lucida Sans Typewriter,monaco,Bitstream Vera Sans Mono,monospace; font-size:10px;">
        </div>
  </b-modal>

   <b-modal v-model="confirmUpdate" size="lg" title="Actualizar Variables">
       <div class="h3 text-danger">
           ¡ATENCIÓN!
       </div>
       <div>
           Esta opción descargará la configuración que se tiene en SyncBox Cloud. Sí ejecuta esta acción borrará la configuración actual y la reemplazará por la nueva. ¿Está seguro?
       </div>
         <div slot="modal-footer" class="w-100">
        <!-- <p class="float-left">Modal Footer Content</p> -->

        <b-button size="md" class="float-right ml-2" variant="warning"  @click="serviceAction('syncboxconnect','sync')">Actualizar SyncBox Connect</b-button>
        <b-button size="md" class="float-right" variant="primary" @click="confirmUpdate=false">Cerrar</b-button>
        
      </div>
  </b-modal>
<!-- <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal> -->
</div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>

<script>
import Vue from 'vue'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import VueMarkdown from 'vue-markdown'
import DoughnutChart from 'vue-doughnut-chart'
import moment from 'moment'
import {infousers} from '@/components/i40/js/users'
import { ObtenerEstadoDispositivos, ObtenerInfoServer, ObtenerVariables, CheckServices, GetServiceStatus, ServiceAction, RestartServer } from "@/vendor/sbx/sbx/connect_library";

import Notifications from 'vue-notification'

Vue.use(Notifications)

export default {
    
    metaInfo: {
        title: 'Diagnóstico'
    },
    components: {
        'donut-chart': DoughnutChart,
        SweetModal,
        SweetModalTab,
        VueMarkdown,
       
    },
    data: () => ({
        name: 'InfoDevices',
        version: 'v1.0.0.0',

        infoServer:null,
        infoStatusService:"",

        displayRange: 3,
        /// Info Tabla
        itemsDispositivos:[],
        itemsVariablesDispotivos:[],
        statusServices:[],
        /// Campos Tabla
        fieldsDispositivos:[
            {key:'EnLinea', label:"En Línea"},
            {key:'CodigoDispositivo', label:"Código Dispositivo"},
            {key:'IpDispositivo', label:"IP Dispositivo"},
            {key:'UltimaFechaConexion', label:"Última Conexión"},
            {key:'FechaActual', label:"Actual"},
            {key:'TiempoDiferencia', label:"Tiempo (s)"},
            {key:'TTR', label:"TTL"},
            
            {key:'IdTipoDispositivo', label:"Código", thClass: 'd-none', tdClass: 'd-none'},
        ],
        fieldsCheckServicios:[
            {key:'EnLinea', label:"En Línea"},
            {key:'Nombre', label:"Nombre"},
            {key:'Estado', label:"Estado"},
            {key:'actions', label:"Acciones"},
        ],

        //Info Servicios
        titleHeaderInfoService:"",
        headerBgInfoService:"light",
        headerTextinfoService:"dark",


        ///Variables de Tiempo
        timeInfoEstado:null,
        timeInfoServer:null,

        ///Variables Estado Servidor
        infoStatusServer:"",
        infoTextStatusServer:"",
        confirmUpdate:false
    }),
    methods: {
        check_access(control, action){
        return infousers.check_access(control,action)
        },
///Funcion para cargar la ayuda del helper
             openHelp: function(){
                //  this.contentWiki = "# FFFF"
                // ApiWikiHelp(this.version, this.name).then(data => {
                //     this.contentWiki = data.data
                // })
                // .catch(data =>{
                //     this.contentWiki = data.data
                // })
                this.$refs.longModal.open()
            },
        ///Funcion para cargar la ayuda del helper
        //Eventos de tiempo
        ObtenerInfoEstado(){
            try{
                ObtenerEstadoDispositivos().then(data =>{
                    if(data.data != '')
                        this.itemsDispositivos = data.data
                    else
                        this.itemsDispositivos = []
                    this.infoStatusServer = "badge badge-success font-weight-bold"
                    this.infoTextStatusServer = "RUNNING"
                })
                .catch(error => {
                    this.infoStatusServer = "badge badge-danger font-weight-bold"
                    this.infoTextStatusServer = "DOWN"
                })

                CheckServices().then(data =>{
                    if(data.data != '')
                        this.statusServices = data.data
                    else
                        this.statusServices = []

                    this.infoStatusServer = "badge badge-success font-weight-bold"
                    this.infoTextStatusServer = "RUNNING"
                })
                .catch(error => {
                    this.infoStatusServer = "badge badge-danger font-weight-bold"
                    this.infoTextStatusServer = "DOWN"
                })
            }
            catch(e){ }
           
        },
        ObtenerInfoServer() {
             ObtenerInfoServer().then(data =>{
                this.infoServer = data.data
            })
            .catch(error => {
                this.infoStatusServer = "badge badge-danger font-weight-bold"
                this.infoTextStatusServer = "DOWN"
            })
        },

        ///Acciones desde los grid
        ///Estado Servicios
        infoService(item){
            GetServiceStatus(item.Nombre).then(data =>{
                var statusServ = data.data.replace(/(\n)/g, "<br/>").replace(/ /g,"&nbsp;")
                //statusServ = statusServ.replace(/_/g," ");
                this.infoStatusService = statusServ
                //  this.$refs.simpleAlert.open()
                this.titleHeaderInfoService="Servicio "+item.Nombre
                
                if(statusServ.includes("Active:&nbsp;active&nbsp;(running)"))
                {
                    this.headerBgInfoService="success",
                    this.headerTextinfoService="white"
                }else {//if(statusServ.includes("Active:&inactive&(dead)")){
                     this.headerBgInfoService="danger",
                    this.headerTextinfoService="white"
                }

                this.infoStatusServer = "badge badge-success font-weight-bold"
                this.infoTextStatusServer = "RUNNING"
            })
            .catch(error => {
                this.infoStatusServer = "badge badge-danger font-weight-bold"
                this.infoTextStatusServer = "DOWN"
            })
        },

        showCustom: function(classes, title, text) {
           this.$notify({
               group: 'notifications-default',
               type: classes,
               title: title,
               text: text
           })
        },

        serviceAction(nombre, action){
            ServiceAction(nombre, action).then(data =>{
                if (data.status === 202){
                    this.showCustom('bg-dark text-white', "Error", "¡Error al Ejecutar la Solicitud!")
                }else{
                    if(action === "restart")
                        this.showCustom('bg-warning text-dark', "Reiniciar Servicio: Correcto","¡El Servicio se ha Reiniciado con Éxito!")
                    else if(action === "stop")
                        this.showCustom('bg-danger text-white', "Detener Servicio: Correcto","¡El Servicio se ha Detenido con Éxito!")
                    else 
                        this.showCustom('bg-success text-white', "Inicio del Servicio: Correcto","¡El Servicio se ha Iniciado con Éxito!")
                }
            })
            .catch(error => {
                this.infoStatusServer = "badge badge-danger font-weight-bold"
                this.infoTextStatusServer = "DOWN"
            })
        },

        restartServer(){
            RestartServer().then(data =>{})
        },

        //Funciones
        unixtodate: function(value){
            return moment.unix(value).format("YYYY-MM-DD HH:mm:ss")
        },
    },
    mounted () {
        this.ObtenerInfoServer()
        this.ObtenerInfoEstado();
        this.timeInfoEstado = setInterval(this.ObtenerInfoEstado, 1000)
        this.timeInfoServer = setInterval(this.ObtenerInfoServer, 2000)
    },
  destroyed () {
       clearInterval(this.timeInfoEstado);
       clearInterval(this.timeInfoServer);
  },
}
</script>

<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-2">
      <span class="text-muted font-weight-light">Análisis /</span> Carga de Recursos
    </h4>

    <hr class="border-light container-m--x mt-0">

    <div id="container"></div>
    <nouislider v-model="vueSliderRangeValue" :options="options3" @set="onChange(data_calendar)"></nouislider>
      <!-- <vue-slider
            v-model="vueSliderRangeValue"
            :data="vueSliderRangeData"
            :height="2"
            :dotSize="12"
            :tooltipMerge="false"
            :reverse="isRTL"
             @callback="onChange(data_calendar)"/> -->


        <div class="text-right mt-2 mb-1">
            <b-btn variant="outline-success" class="btn-sm" @click.prevent="showSlideModal()">
                <span class="ion ion-md-add"></span>&nbsp;&nbsp;Seleccione...
            </b-btn>    
       
             <b-btn variant="outline-info icon-btn" class="btn-sm"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
         </div>

        <b-modal ref="slideModal" class="modal-center" size="lg" hide-header hide-footer>

            Al seleccionar un Centro de Trabajo específico, se permitirá generar una asignación de estos a las ordenes de producción que fueron cambiadas de lugar. Tenga presente que si hay alguna restricción en los centros de trabajo en la configuración de la ruta,
            automáticamente se desaparecerán estas ordenes de producción para evitar movimiento no deseados previos a la configuración.

             <div class="row mt-2">
                 <div class="col" style="overflow-x: auto; white-space: nowrap;">
                    <v-jstree
                        :data="treeData"
                        :class="{ 'tree-rtl': isRTL , 'col mb-4':true}"
                        show-checkbox
                        allow-batch
                        whole-row
                        @item-click="itemClick" />
                 </div>
                 <div class="col" style="overflow-x: auto; white-space: nowrap;">
                    <v-jstree
                        :data="treeDataDetail"
                        :class="{ 'tree-rtl': isRTL , 'col mb-5':true}"
                        show-checkbox
                        allow-batch
                        whole-row
                        @item-click="itemClick2" />
                 </div>
             </div>
             <div class="text-right">
             <b-button v-b-modal.modal-lg variant="primary">Cerrar</b-button>
             <b-modal id="modal-lg" size="lg" title="Large Modal">Cerrar</b-modal>
          </div>
        </b-modal>
    <b-row>
        <b-col>
            <b-btn variant="outline-dark icon-btn" class="btn-sm" @click.prevent="cual=1; cargar_calendario()"><i class="oi oi-bar-chart"></i></b-btn>

            <b-btn variant="outline-success icon-btn" class="btn-sm" @click.prevent="push_content('chartInfo1')" v-if="objInfo2.level == 'workstation' && document_selected == 'drgfirst' "><i class="ion ion-md-done-all"></i></b-btn>
                {{ lastCheked1.description }}
                <b-input-group class="mb-2 mt-2">
                    <b-input-group-text slot="prepend"><i class="ion ion-ios-search"></i></b-input-group-text>
                    <input type="text" class="form-control" placeholder="Search..." @input="search($event)">
                </b-input-group>

        </b-col>
        <b-col>
            <b-btn variant="outline-dark icon-btn" class="btn-sm" @click.prevent="cual=2; cargar_calendario()"><i class="oi oi-bar-chart"></i></b-btn>

            <b-btn variant="outline-success icon-btn" class="btn-sm" @click.prevent="push_content('chartInfo2')" v-if="objInfo2.level == 'workstation' && document_selected == 'drgsecond'"><i class="ion ion-md-done-all"></i></b-btn>
                {{ lastCheked1.description != null ? lastCheked2.description == null ? " - - - -" : lastCheked2.description : ''}}
                <b-input-group class="mb-2 mt-2">
                    <b-input-group-text slot="prepend"><i class="ion ion-ios-search"></i></b-input-group-text>
                    <input type="text" class="form-control" placeholder="Search..." @input="search2($event)">
                </b-input-group>
        </b-col>
    </b-row>

    <b-row>
        <b-col v-dragula="colOne" bag="first-bag"  my-drake="first" id="drgfirst">
           
            <div v-for="(text, index) in colOne" :key="'one'+index.toString()">
                <div class="mb-1" :id="index" v-if="text.pending_amount>0">
                    <b-card no-body :class="{'border-primary':text.consume_buffer < 0, 'border-success':text.consume_buffer >= 0 && text.consume_buffer <33,'border-warning':text.consume_buffer >=33 && text.consume_buffer < 66,'border-danger':text.consume_buffer >= 66 && text.consume_buffer <= 100,'border-dark': text.consume_buffer>100}">
                        <div class="text-center">
                            <span class="font-weight-light">{{text.consecutive_order}} {{text.code}} </span> {{text.products_description}}  
                        </div>
                        <div class="text-center"> 
                            {{text.customer_order_id}} - {{text.name}} 
                        </div>
                        <div  class="text-center">
                            Actividad: ({{text.sequence}}) {{text.activity_description}}
                        </div>
                         <div  class="text-center">
                            Centro de Trabajo: {{text.workstation_code == "" ? "------": text.workstation_code}}
                        </div>
                        <div class="small">
                            Cantidad Pendientes <div class="float-right"> {{text.programed_amount}} - {{text.produced_amount}} = {{text.pending_amount}}</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-danger':(((text.produced_amount)/text.programed_amount)*100)>=80, 'bg-success':(((text.produced_amount)/text.programed_amount)*100)<80}" :style="{width: String(((text.produced_amount)/text.programed_amount)*100)+'%' }"></div>
                        </div>

                        <div class="small">
                            Tiempo Estimado (horas) <div class="float-right"> {{Math.round((text.programed_amount/text.production_per_hour)*100)/100}} - {{Math.round((text.produced_amount/text.production_per_hour)*100)/100}} = {{Math.round((text.pending_amount/text.production_per_hour)*100)/100}}</div>
                        </div>
                        <div class="progress mb-3" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-danger':(((text.produced_amount)/text.programed_amount)*100)>=80, 'bg-success':(((text.produced_amount)/text.programed_amount)*100)<80}" :style="{width: String(((text.produced_amount)/text.programed_amount)*100)+'%' }"></div>
                        </div>
                        
                         <div :id="text.order_production_process_id.toString() + text.workstation_code" class="w-100">  </div>
                        <b-row no-gutters >
                            <b-col md="4" class="text-center" :class="{
                            'text-white':(text.consume_buffer >=33 && text.consume_buffer < 66) ? false : true, 'bg-warning':text.consume_buffer >=33 && text.consume_buffer < 66,
                            'bg-primary':text.consume_buffer < 0, 'bg-success':text.consume_buffer >= 0 && text.consume_buffer <33,'bg-warning':text.consume_buffer >=33 && text.consume_buffer < 66,'bg-danger':text.consume_buffer >= 66 && text.consume_buffer <= 100,'bg-dark': text.consume_buffer>100}">
                                    {{text.consume_buffer}}%
                            </b-col>
                            <b-col md="4" class="text-center">
                                {{text.deadline}}
                            </b-col>
                           <b-col md="4" class="d-flex justify-content-between">
                                <div> {{text.status_modules_code}}</div>
                                <b-btn variant="outline-info icon-btn m-r-1" class="btn-sm" @click.prevent="showEditForm=true; $refs.gantt_detail.cargar_calendario(text.consecutive_order)"><i class="ion ion-ios-stats"></i></b-btn>
                            </b-col>
                        </b-row>

                    </b-card>
                    <div v-show="false" :id="index+'--'">
                        {{text}}
                    </div>
                </div>
             </div>
        </b-col>
        <b-col v-dragula="colTwo" bag="first-bag" my-drake="second" id="drgsecond">
            <div v-for="(text, index) in colTwo" :key="'two'+index.toString()">
                <div class="mb-1" v-if="text.pending_amount>0">
                    <b-card no-body :class="{'border-primary':text.consume_buffer < 0, 'border-success':text.consume_buffer >= 0 && text.consume_buffer <33,'border-warning':text.consume_buffer >=33 && text.consume_buffer < 66,'border-danger':text.consume_buffer >= 66 && text.consume_buffer <= 100,'border-dark': text.consume_buffer>100}">
                        <div class="text-center">
                            <span class="font-weight-light">{{text.consecutive_order}} {{text.code}} </span> {{text.products_description}}  
                        </div>
                        <div class="text-center"> 
                            {{text.customer_order_id}} - {{text.name}} 
                        </div>
                        <div  class="text-center">
                        Actividad: ({{text.sequence}}) {{text.activity_description}}
                        </div>
                         <div  class="text-center">
                            Centro de Trabajo: {{text.workstation_code == "" ? "------": text.workstation_code}}
                        </div>
                        <div class="small">
                            Cantidad Pendientes <div class="float-right"> {{text.programed_amount}} - {{text.produced_amount}} = {{text.pending_amount}}</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-danger':(((text.produced_amount)/text.programed_amount)*100)>=80, 'bg-success':(((text.produced_amount)/text.programed_amount)*100)<80}" :style="{width: String(((text.produced_amount)/text.programed_amount)*100)+'%' }"></div>
                        </div>
                        
                        <div class="small">
                            Tiempo Estimado (horas) <div class="float-right"> {{Math.round((text.programed_amount/text.production_per_hour)*100)/100}} - {{Math.round((text.produced_amount/text.production_per_hour)*100)/100}} = {{Math.round((text.pending_amount/text.production_per_hour)*100)/100}}</div>
                        </div>
                        <div class="progress mb-3" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-danger':(((text.produced_amount)/text.programed_amount)*100)>=80, 'bg-success':(((text.produced_amount)/text.programed_amount)*100)<80}" :style="{width: String(((text.produced_amount)/text.programed_amount)*100)+'%' }"></div>
                        </div>
                        <div :id="text.order_production_process_id.toString() + text.workstation_code" class="w-100"> 
                            <div class='row'><div class='col text-center small'>Fecha Inicial</div>
                            <div class='col text-center small'>Fecha Final</div>
                            </div> 
                            
                            <div class='row'><div class='col text-center'> {{text.start_date.replace('T',' ')}} </div>
                            <div class='col text-center'>{{text.finish_date.replace('T',' ')}}</div>
                            </div>
                        </div>
                       
                        <b-row no-gutters >
                            <b-col md="4" class="text-center" :class="{
                            'text-white':(text.consume_buffer >=33 && text.consume_buffer < 66) ? false : true, 'bg-warning':text.consume_buffer >=33 && text.consume_buffer < 66,
                            'bg-primary':text.consume_buffer < 0, 'bg-success':text.consume_buffer >= 0 && text.consume_buffer <33,'bg-warning':text.consume_buffer >=33 && text.consume_buffer < 66,'bg-danger':text.consume_buffer >= 66 && text.consume_buffer <= 100,'bg-dark': text.consume_buffer>100}">
                                    {{text.consume_buffer}}%
                            </b-col>
                            <b-col md="4" class="text-center">
                                {{text.deadline}}
                            </b-col>
                            <b-col md="4" class="d-flex justify-content-between">
                                <div> {{text.status_modules_code}}</div>
                                <b-btn variant="outline-info icon-btn m-r-1" class="btn-sm" @click.prevent="showEditForm=true; $refs.gantt_detail.cargar_calendario(text.consecutive_order)"><i class="ion ion-ios-stats"></i></b-btn>
                            </b-col>
                        </b-row>

                    </b-card>
                    <div v-show="false" :id="index+'--'">
                        {{text}}
                    </div>
                </div>
             </div>
        </b-col>
    </b-row>
     <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>
     <b-modal id="modals-top" v-model="showEditForm"  class="modal-center" size="lg">
            <!-- <div slot="modal-title">
                Modificar <span class="font-weight-light">Ordenes de Producción</span><br>
            </div> -->
                <vue-gantt ref="gantt_detail"></vue-gantt>

                
                 <div slot="modal-footer">
                <b-btn @click="showEditForm=false">Cerrar</b-btn>
            </div> 
     </b-modal>

  </div>
</template>

<style src="vue-dragula/styles/dragula.css" />

    <style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
    <style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<style>
  .dragula-example {
    margin-bottom: 6px;
  }

  .sortable-example {
    margin: 0;
    padding: 0;
  }
  .sortable-example li {
    padding: 6px 10px;
    margin-bottom: 8px;
    list-style: none;
  }
  .sortable-example-inline li {
    margin-right: 8px;
    display: inline-block;
  }
  [dir=rtl] .sortable-example-inline li {
    margin-right: 0;
    margin-left: 8px;
  }

  .sortable-example-3 {
    width: 220px;
  }
  .sortable-example-3 img {
    margin-right: 8px;
    margin-bottom: 8px;
    width: 100px;
    height: 100px;
    border-radius: 999px;
    display: block;
    float: left;
  }
  [dir=rtl] .sortable-example-3 img {
    margin-right: 0;
    margin-left: 8px;
    float: right;
  }
</style>

<script>
// require( "@/components/i40/js/vendor/highcharts.js")
import Vue from 'vue'
// import VueDragula from 'vue-dragula'
// import draggable from 'vuedraggable'
import VJstree from 'vue-jstree'
import { infoplanning } from "@/components/i40/js/iplanning";
import { infomaster } from "@/components/i40/js/master";
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { infoproduction } from "@/components/i40/js/production"
import { infoColors } from "@/components/i40/js/styles"
import VueMarkdown from 'vue-markdown'
// Vue.use(VueDragula)
import { Vue2Dragula } from 'vue2-dragula'
import moment from 'moment'

import Nouislider from '@/vendor/libs/nouislider/Nouislider'
import vueSlider from 'vue-slider-component'

import 'dragula/dist/dragula.css'
import gantt from './gantt'

Vue.use(Vue2Dragula)


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
  name: 'ui-drag-and-drop',
  metaInfo: {
    title: 'Análisis de Carga'
  },
  components: {
    VueMarkdown,
    SweetModal,
    SweetModalTab,
    VJstree,
    'vue-gantt': gantt,

    Nouislider,
    vueSlider,
    // draggable
  },
  data: () => ({
        name: 'control_capacity',
        version: 'v1.0.0.0',
        contentWiki: "",
        anchorAttrs: {
            target: '_blank',
            rel: 'noopener noreferrer nofollow'
        },
           
        contentWiki: "",
        data_calendar:[],
        
        calendar1:[],
        calendar2:[],
        chartInfo1:{},
        chartInfo2:{},
        lastCheked:{},
        lastCheked1 : {},
        lastCheked2:[],
        treeDataDetail:[],
        treeData:[],
        objInfo:{},
        objInfo1:{},
        objInfo2:{},
        orderList:[],
        orderList2:[],
        colOne:[],
        colTwo:[],

        colOneDra:[],
        colTwoDra:[],
        resultColTwoDra:[],

        document_selected:'', 
        calendar_values:[],


        showEditForm:false,
        service: null,
        vueSliderRangeValue: [0,1],
        // vueSliderRangeData: []
        options3: { },

        container_drag:[],
        cual:0,
  }),
  methods: {
        editProductionOrder(item){
            this.$refs.editorder.editProductionOrder(item)
            this.showEditForm=true
        },
        push_content(target){
            // if(target == 'chartInfo1'){
                // console.log(this.resultColTwoDra)
                 infoplanning.getplanninginfo(this.resultColTwoDra,'confirm-analyze').then(data => {
                 })
            // }
        },

        infoColorTOC(value){
            return infoColors.infoColorsTOC(text.consume_buffer), infoColors.infoTextTOC(text.consume_buffer)
        },

        search_js ($event, target) {
            const val = String($event.target.value).replace(/^\s+|\s+$/g, '').toLowerCase()

            var y = document.getElementById(target);
            //var child_nodes = x.childNodes;
            var child_nodesy = y.childNodes;

             if (!val) {
                for (let index = 0; index < child_nodesy.length; index++) {
                    const element = child_nodesy[index];
                    if(element.childNodes[0] != undefined && !isNaN(element.childNodes[0].id)){
                        let node = element.childNodes[0].childNodes
                        for (let index2 = 0; index2 < node.length; index2++) {
                            const element2 = node[index2];
                            if(element2.id == element.childNodes[0].id.toString()+'--'){
                                element.childNodes[0].removeAttribute("style");
                            }
                        }
                    }
                }
                return
            }
            
            for (let index = 0; index < child_nodesy.length; index++) {
                const element = child_nodesy[index];
                if(element.childNodes[0] != undefined && !isNaN(element.childNodes[0].id)){
                     let node = element.childNodes[0].childNodes
                     for (let index2 = 0; index2 < node.length; index2++) {
                        const element2 = node[index2];
                        if(element2.id == element.childNodes[0].id.toString()+'--'){
                            if(!name(val,JSON.parse(element2.textContent)))
                              element.childNodes[0].setAttribute("style", "display: none;");
                        }
                        else{
                            element.childNodes[0].removeAttribute("style");
                        }
                    }
                }
            }
            
            function name(val, element) {
                
                return (element.products_description.toLowerCase().indexOf(val) !== -1 || element.customer_order_id.toString().indexOf(val) !== -1 || element.consecutive_order.toString().indexOf(val) !== -1
                || element.name.toLowerCase().indexOf(val) !== -1 || element.code.indexOf(val) !== -1 || element.activity_description.toLowerCase().indexOf(val) !== -1) 
                
            }
        },

        search(event){
            this.search_js(event,"drgfirst")
        },

        search2 ($event) {
            this.search_js(event,"drgsecond")
        },
        ///Funcion para cargar la ayuda del helper
            openHelp: function(){
                //  this.contentWiki = "# FFFF"
                ApiWikiHelp(this.version, this.name).then(data => {
                    this.contentWiki = data.data
                })
                .catch(data =>{
                    this.contentWiki = data.data
                })
                this.$refs.longModal.open()
            },

        showSlideModal () {
            this.$refs.slideModal.show()
        },

        hideSlideModal () {
            this.$refs.slideModal.hide()
        },

        itemClick (node) {
            this.lastCheked1 = node.model
            // this.lastCheked2 = node.model
            this.objInfo1= JSON.parse(JSON.stringify(node.model))
            this.colOne = []
            this.objInfo1.children="-"

            this.validate_workstation_per_order("drgsecond", this.lastCheked2.code)

            infoplanning.calendarcontroller(this.objInfo1, "select-" + this.lastCheked1.level).then(data =>{
                    if(data.data.length >0 && data.data != "Invalid Option" ){
                        this.calendar1 = data.data
                    }
                })

            if(this.objInfo1.level == 'group' || this.objInfo1.level == 'workstation' ){

                if(this.treeDataDetail.length == undefined || this.treeDataDetail.length == 0){
                    this.treeDataDetail = JSON.parse(JSON.stringify(this.treeData))  //JSON.stringify(JSON.parse(this.lastCheked.children))
                }
                // select-workstation-group
                infoproduction.production({"element_id":this.objInfo1.level == "workstation" ? this.objInfo1.workstation_id : this.objInfo1.workstation_group_id},"select-"+this.objInfo1.level ).then(data =>{
                    // this.colOneDra = JSON.parse(JSON.stringify(data.data))
                    if(data.data != null){
                        this.colOne = JSON.parse(JSON.stringify(data.data))
                        this.orderList=JSON.parse(JSON.stringify(data.data))
                    }else{
                        this.colOne = []
                        this.orderList = []
                    }
                    // this.tableCommercialsOrders = data.data
                })

            }else{
                this.treeDataDetail = []
                this.colOne = this.orderList
            }

            // Trigger model update by clonning data
            // this.treeData = this.treeData.slice(0)
        },

        itemClick2 (node) {
            
            this.lastCheked2 = node.model
            this.objInfo2= JSON.parse(JSON.stringify(node.model))
            this.orderList2 = this.colTwo
            // this.colOne = this.objInfo.children
            this.objInfo2.children = "-"
            // console.log(node.model)
            // this.cargar_calendario(2)

            this.validate_workstation_per_order("drgfirst", this.lastCheked2.code)

            infoplanning.calendarcontroller(this.objInfo2, "select-" + this.lastCheked2.level).then(data =>{
                if(data.data.length >0 && data.data != "Invalid Option" ){
                    this.calendar2 = data.data
                }
            })

            if(this.objInfo2.level == 'group' || this.objInfo2.level == 'workstation'){
                // this.treeDataDetail = this.lastCheked.children //JSON.stringify(JSON.parse(this.lastCheked.children))
                // select-workstation-group
                infoproduction.production({"element_id":this.objInfo2.level == "workstation" ? this.objInfo2.workstation_id : this.objInfo2.workstation_group_id},"select-"+this.objInfo2.level).then(data =>{

                    if(data.data != null){
                        this.colTwo = JSON.parse(JSON.stringify(data.data))
                        this.orderList2=JSON.parse(JSON.stringify(data.data))
                    }else{
                        this.colTwo = []
                        this.orderList2 = []
                    }
                    // this.tableCommercialsOrders = data.data
                })
            }

            // Trigger model update by clonning data
            // this.treeDataDetail = this.treeDataDetail.slice(0)
        },


        validate_workstation_per_order (target, wokstation_code) {
            
            // this.search_js(event,"drgfirst")
            // this.search_js(event,"drgsecond")

            var y = document.getElementById(target);
            //var child_nodes = x.childNodes;
            var child_nodesy = y.childNodes;
            
            for (let index = 0; index < child_nodesy.length; index++) {
                const element = child_nodesy[index];
                if(element.childNodes[0] != undefined && !isNaN(element.childNodes[0].id)){
                     let node = element.childNodes[0].childNodes
                     
                     for (let index2 = 0; index2 < node.length; index2++) {
                        const element2 = node[index2];
                        if(element2.id == element.childNodes[0].id.toString()+'--'){
                            if(!JSON.parse(element2.textContent).workstations.includes(wokstation_code))
                            {
                                element.childNodes[0].setAttribute("style", "display: none;");
                            }else{
                                element.childNodes[0].removeAttribute("style");
                            }
                        }
                    }
                }
            }
        },
        
        cargar_calendario(){
            if (this.cual === 1){
                this.document_selected = "drgfirst" 
                this.calendar_values = this.calendar1
                this.lastCheked = this.lastCheked1
                this.objInfo = this.objInfo1
                this.analyse_info_calendar_production_per_event()

            }else if(this.cual === 2){
                this.document_selected = "drgsecond" 
                this.calendar_values = this.calendar2
                this.lastCheked = this.lastCheked2
                this.objInfo = this.objInfo2
                this.analyse_info_calendar_production_per_event()
            }
        },

        load_chart(chartInfo){
            
            Highcharts.chart('container', {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'Horas Programadas vs Horas Planeadas'
                },
                subtitle: {
                    text: chartInfo.title
                },
                xAxis: [{
                    categories: chartInfo.categories,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Horas Planeadas',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        //text: 'Rainfall',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} mm',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true,
                    visible: false
                }
                ],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 0,
                    verticalAlign: 'top',
                    y: 0,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255,255,255,0.25)'
                },
                series: [{
                    name: 'Horas Programadas',
                    type: 'column',
                    data: chartInfo.hoursProgrammers,
                    tooltip: {
                        valueSuffix: ' h'
                    }

                }, {
                    name: 'Horas Planeadas',
                    type: 'line',
                    data: chartInfo.hoursPlanned,
                    tooltip: {
                        valueSuffix: ' h'
                    }
                }]
            });
        },

        analyse_info_calendar_production_per_event(){
            this.colTwoDra = []
            var x = document.getElementById(this.document_selected);
            var child_nodes = x.childNodes;

            for (let index = 0; index < child_nodes.length; index++) {
                const element = child_nodes[index];
                if(element.childNodes[0] != undefined && !isNaN(element.childNodes[0].id)){
                     let node = element.childNodes[0].childNodes
                     
                     for (let index2 = 0; index2 < node.length; index2++) {
                         const element2 = node[index2];
                         if(element2.id != undefined){
                            // console.log(element2.id , element2)
                              if(element2.id.includes('--')){
                                    let record_to_save = JSON.parse(element2.textContent)
                                    
                                    if(record_to_save.workstation_id != undefined && record_to_save.workstation_id != null){
                                        record_to_save.last_workstation_id = record_to_save.workstation_id
                                    }
                                    record_to_save.workstation_id = this.lastCheked.workstation_id
                                    
                                    this.colTwoDra.push(record_to_save)
                              }
                         }
                     }
                }
            }
            
            // this.vueSliderRangeData.length = 0

            // if(this.lastCheked2.description != null){
            let info_send = {"resource":this.lastCheked, "production_orders":this.colTwoDra,"calendar":this.calendar_values, "production_one":this.colOneDra}
            infoplanning.getplanninginfo(info_send,'analyze').then(data => {
                    this.data_calendar = data.data.calendar

                    this.onChange(data.data.calendar)
                    let array_dates = []
                    for (let index = 0; index < data.data.calendar.length; index++) {
                        const element = data.data.calendar[index];
                        array_dates.push(element.start_date)
                        
                    }

                    if(this.vueSliderRangeValue[1] == 1){
                        this.vueSliderRangeValue.length = 0
                        this.vueSliderRangeValue = [0,array_dates.length]

                        this.options3 = {
                            step: 1,
                            connect: true,
                            tooltips: true,
                            range: {
                                min: [0],
                                max: [array_dates.length]
                            }
                        }
                    }


                    for (let index = 0; index < data.data.production_orders.length; index++) {
                        const element = data.data.production_orders[index];
                        document.getElementById(element.order_production_process_id.toString()+element.workstation_code).innerHTML = 
                        "<div class='row'><div class='col text-center small'>Fecha Inicial</div><div class='col text-center small'>Fecha Final</div></div> <div class='row'><div class='col text-center'>"+element.start_date.replace('T',' ').replace('Z','')+"</div><div class='col text-center'>"+element.finish_date.replace('T',' ').replace('Z','')+"</div></div>"
                    }

                    this.resultColTwoDra = JSON.parse(JSON.stringify(data.data.production_orders))
                        // console.log(this.resultColTwoDra)
                })
                // }else{
                //     alert("Seleccione un grupo o centro de trabajo en el área de destino! Esta información no será procesada")
                // }
        },

        onChange(items){
            let categories = []
            let hoursPlanned = [] 
            let hoursProgrammers = []
            let calendar = items
            let on_off = false


            for (let index = 0; index < calendar.length; index++) {
                const element = calendar[index];

                if(this.vueSliderRangeValue[1] != 1){

                    if(moment().add(this.vueSliderRangeValue[0],'days').format('YYYY-MM-DD') == element.start_date || moment().add( this.vueSliderRangeValue[1],'days').format('YYYY-MM-DD')  == element.start_date ){
                        on_off = !on_off
                    }
                    
                    if(on_off){
                        categories.push(element.start_date)
                        hoursPlanned.push(element.planned_hours)
                        hoursProgrammers.push(element.programmed_hours)
                        // this.vueSliderRangeData.push(element.start_date)
                    }

                }else{
                    categories.push(element.start_date)
                    hoursPlanned.push(element.planned_hours)
                    hoursProgrammers.push(element.programmed_hours)
                    // this.vueSliderRangeData.push(element.start_date)
                }
            }

            let chart_info_calc = {}
            chart_info_calc.categories = categories
            chart_info_calc.hoursPlanned = hoursPlanned
            chart_info_calc.hoursProgrammers = hoursProgrammers
            chart_info_calc.title = this.objInfo.description
            this.load_chart(chart_info_calc)
        },

        test(){

            this.container_drag[0].drake.remove()

            this.analyse_info_calendar_production_per_event()
            // console.log(this.container_drag)
            // let el = this.container_drag[0].el
            // let source = this.container_drag[0].container
            // console.log(this.container_drag[0].container.id)
            // document.getElementById(this.container_drag[0].container.id).value = this.container_drag[0].container


            // source.append(el)
            // cc.el.remove()

            // console.log(this.$dragula)
            
            // console.log($(args.el))
            //$(args.el).remove();
            // $(args.source).append(args.el);
            // console.log(args.el)
            // 
        },
        test2(args){
        }
    },
    created() {
        this.options3 = {
                        step: 1,
                        connect: true,
                        tooltips: true,
                        range: {
                            min: [0],
                            max: [1]
                        }
                    }
        infomaster.tree_workstation_capacity().then(data =>{
            this.treeData = JSON.parse(JSON.stringify(data.data)) 
            // this.treeDataDetail = JSON.parse(JSON.stringify(data.data)) 
        })

        
        if(this.$dragula.$service.find('my-drake') == undefined){
            this.$dragula.$service.options('my-drake', {
                direction: 'vertical'
            })

            this.$dragula.$service.eventBus.$on('drop', (args) => {
                try{
                    this.cargar_calendario()
                }
                catch(ex){}
            })

            this.$dragula.$service.eventBus.$on('drag', (args) => {
                try{
                    // console.log(args.container.id)
                    // console.log(document.getElementById(args.container.id))
                    // // document.getElementById(args.container.id).value
                    // this.container_drag.push({"a":args, "b":document.getElementById(args.container.id).value})
                }
                catch(ex){}
            })

            this.$dragula.$service.eventBus.$on('cancel', (args) => {
                try{
                    // console.log(document.getElementById(args.container.id))
                    // // document.getElementById(args.container.id).value
                    // this.container_drag.push({"a":args, "b":document.getElementById(args.container.id).value})
                }
                catch(ex){}
            })

            // this.$dragula.$service.eventBus.$on(
            //     {
            //         drop: (opts) => {
            //             const {el, container, model} = opts
            //             console.log('HANDLE drop: ', el, container, model, opts)
            //             console.log('classList', el.classList)
            //             el.classList.add('ex-moved')
            //             consoel.log('new classList', el.classList)
            //         },
            //     }
            // )
        }
    },
     mounted () {
    //
    // noUiSlider
    //

    // Handle RTL direction
    if (this.isRTL) {
      this.options1 = Object.assign({}, this.options1, { direction: 'rtl' })
      this.options3 = Object.assign({}, this.options3, { direction: 'rtl' })
      this.options4 = Object.assign({}, this.options4, { direction: 'rtl' })
      this.options6 = Object.assign({}, this.options6, { direction: 'rtl' })
    }
  }
}
</script>

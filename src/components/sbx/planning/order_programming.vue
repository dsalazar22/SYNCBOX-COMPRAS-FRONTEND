<template>
    <div>

        
        <h4 class="font-weight-bold py-3 mb-4">Crear Orden de Producción</h4>
        <div class="w-100 text-right"></div>

        <div class="row">
            <div class="col">
                <h5>Tipo de Documento</h5>
                Codigo: {{ selected_info_order_type.code }}
                <div>
                    Definición:  {{ selected_info_order_type != null ? selected_info_order_type.description : ""}}
                </div>
                <h5 class="mt-2">Producto Seleccionado</h5>
                    Descripción: {{product_ppal != null ? product_ppal.description : ""}}
                <div></div>
                Cantidad a Producir: {{product_ppal.amount}}
            </div>
            <div class="col">
                <h5 >Listas de Materiales</h5>
                Descripción: {{selected_listDefinitionBOM != null ? selected_listDefinitionBOM.name : ""}}
                <div>
                Version: {{selected_listDefinitionBOM != null ? selected_listDefinitionBOM.version : ""}}
                </div>
                <h5 class="mt-2">Ruta de Procesos</h5>
                Descripción: {{selected_listDefinitionRoute  != null ? selected_listDefinitionRoute.description : ""}}
                <div></div>
                Version: {{selected_listDefinitionRoute  != null ? selected_listDefinitionRoute.version : ""}}
            </div>
        </div>

        <form-wizard ref="wizard" class="form-wizard-boxed-steps" v-if="finished_basic_order">
            <!-- Allow html in tab title (this template required for the proper styling) -->
            <template slot="step" slot-scope="props">
                <wizard-step :tab="props.tab" @click.native="props.navigateToTab(props.index)" @keyup.enter.native="props.navigateToTab(props.index)" :transition="props.transition" :index="props.index">
                <span slot="title" :class="{'text-danger':props.tab.validationError}" v-html="props.tab.title"></span>
                </wizard-step>
            </template>
            <!-- / -->

            <tab-content :title='primerItem '>
                <b-card class="mb-3">
                    <h5>Seleccione un Tipo de Documento</h5>
                    <multiselect
                        v-model="selected_info_order_type"
                        :options="info_order_type"
                        label="description"
                        :searchable="true"
                        :show-labels="false"
                        placeholder="Tipos de Documentos"
                    />

                    <h5 class="mt-2">Seleccione una Fecha</h5>

                    <date-picker v-model="dateline" :config="options"></date-picker>

                    <b-nav class="justify-content-end mt-2">
                        <b-nav tabs class="nav-sm tabs-alt">
                            <b-nav-item :active="selectTab=='producto'" @click="selectTab = 'producto'">Desde Producto</b-nav-item>
                            <b-nav-item :active="selectTab=='pedido'" @click="selectTab = 'pedido'">Desde un Pedido</b-nav-item>
                        </b-nav>
                    </b-nav>
                    <div class="row" v-if="selectTab == 'producto'">
                        <div class="col">
                            <div class="position-relative">
                                <h5>Producto</h5>
                                <b-input-group>
                                    <b-input-group-text slot="prepend" v-if="loading">
                                        <i class="ion ion-md-sync"></i>
                                    </b-input-group-text>
                                    <b-input-group-text slot="prepend" v-if="!loading">
                                        <i class="ion ion-ios-search"></i>
                                    </b-input-group-text>
                                    <input type="text" class="form-control"
                                        placeholder="Seleccione un Producto"
                                        autocomplete="off"
                                        v-model="valueProduct"
                                        @keydown.down="down"
                                        @keydown.up="up"
                                        @keydown.enter="hit"
                                        @keydown.esc="reset"
                                        @blur="reset"
                                        @input="updateQueryProducto" />
                                    <b-input-group-text slot="append" v-if="isDirty || valueProduct" @click="resetInput">
                                        <i class="ion ion-md-close" ></i>
                                    </b-input-group-text>
                                </b-input-group>
                                <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                                    <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                        <span class="name" v-text="item.code"></span>
                                        <span class="text-muted">{{ item.description }}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Cantidad
                    <b-form-input v-model="amount_required" placeholder="Enter your name"></b-form-input> -->

                    <div v-if="selectTab == 'pedido'">
                        <b-row>
                            <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->
                            <b-col md="5" class="my-1">
                                <b-input-group>
                                    <b-form-input v-model="filter" placeholder="Buscar..." />
                                    <b-input-group-append>
                                    <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                                    </b-input-group-append>
                                </b-input-group>
                            </b-col>
                            <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->

                            <!-- ESTE ES EL PAGINADOR -->
                            <b-col md="5" class="my-1">
                                <b-form-select :options="pageOptions" v-model="perPage" />
                            </b-col>
                            <!-- ESTE ES EL PAGINADOR -->

                            <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
                            <b-col md="2" class="d-flex justify-content-center my-1">
                                
                                <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                            </b-col>
                            <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
                        </b-row>
                        <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="cptItems"  :fields="columnsCommercialsOrders" :current-page="currentPage" :per-page="perPage" :filter="filter" @filtered="onFiltered">
                            <!-- <template slot="visible_buffer" slot-scope="props">
                                    {{props.item}}
                                </template> -->

                                 <template v-slot:cell(edit)="row">
                                        <div class="text-left">
                                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="select_product(row.item)" target="_blank"><i class="ion ion-md-checkmark"></i></b-btn>
                                        </div>
                                    </template>
                        </b-table>
                    </div>
                </b-card>
            </tab-content>

            <tab-content title="<div class='small text-muted'>CANTIDAD</div>">
                <b-card class="mb-3">
                    <h5>Cantidad a Producir</h5>
                    <b-form-input v-model="product_ppal.amount" placeholder="Cantidad"></b-form-input>
                </b-card>
            </tab-content>

            <tab-content :title="segundoItem">
                <b-card class="mb-3">
                        <multiselect
                        v-model="selected_listDefinitionBOM"
                        :options="listDefinitionBOM"
                         :custom-label="label_bom"
                        :searchable="true"
                        :show-labels="false"
                        placeholder="Seleccione una Receta"
                    />
                </b-card>
            </tab-content>

            <tab-content title="<div class='small text-muted'>RUTA</div>">
                <b-card class="mb-3">
                    
                    <multiselect
                        v-model="selected_listDefinitionRoute"
                        :options="listDefinitionRoute"
                        :custom-label="label_routes"
                        :searchable="true"
                        :show-labels="false"
                        placeholder="Seleccione una Ruta"
                    />
                </b-card>
            </tab-content>

            <!-- Buttons -->
            <b-btn variant="default" slot="prev">Anterior</b-btn>
            <b-btn variant="default" slot="next">Siguiente</b-btn>
            <!-- <b-btn variant="outline-info borderless" class="btn-sm" 
                @click.prevent="finished_basic_order = false; show_tree=true; show_info_details = 'tree'; tree_product_info();">
                <span class="fas fa-project-diagram"></span>&nbsp;&nbsp;Cargar Árbol
            </b-btn> -->
            <b-btn @click="finished_basic_order = false; show_info_details = 'tree'; tree_product_info();" variant="primary" slot="finish">Finalizar</b-btn>
        </form-wizard>

        <div v-if="!finished_basic_order">
            <div class="w-100 text-right">
                <!-- <b-btn variant="outline-info borderless" class="btn-sm" @click.prevent="show_info_details = 'ruta'; operations_product();">
                    <span class="fas fa-project-diagram"></span>&nbsp;&nbsp;
                    Ver Operaciones
                </b-btn>
                <b-btn variant="outline-info borderless" class="btn-sm" @click.prevent="show_tree=true; show_info_details = 'tree'; tree_product_info();">
                    <span class="fas fa-project-diagram"></span>&nbsp;&nbsp;Cargar Árbol
                </b-btn> -->
            </div>

            <div class="mt-2" v-if="show_info_details == 'tree'">
                <tree :data="info_product_map" class="tree" node-text="name" layoutType="euclidean" :zoomable="true">
                </tree>  
                <b-btn @click="finished_basic_order = false; show_info_details = 'tree'; crear_orden();" variant="primary" slot="finish">Confirmar Orden de Produccion</b-btn>
            </div>    
            
            <div v-if="show_info_details == 'ruta'">
                <div v-for="item of tableRouteOperation" :key="item.route_operation_id"> 
                <b-card no-body class="mb-3">
                    <b-card-header> 
                        <div class="row">
                            <div class="col-1 text-center">
                                <b-badge variant="outline-primary"> {{item.sequence}} </b-badge>
                            </div>
                            <div class="col-11">
                                    <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle="'acc'+item.route_operation_id">
                                        {{item.description}}
                                        <div class="collapse-icon"></div>
                                    </a>
                            </div>
                        </div>
                        <!-- </div> -->
                    </b-card-header>
                    <b-collapse :id="'acc'+item.route_operation_id" :accordion="'acc'+item.route_operation_id">
                        <b-card-body>
                            <!-- INFORMACION GENERADA DESDE LA BASE DE DATOS -->
                                
                            <div class="row">
                                <!-- INFORMACION OPERACION RUTA DE PROCESO -->
                                <b-tabs class="w-100 nav-tabs-left mb-2">
                                        <div class="card-body">
                                            <b-table small :fields="ws_fields" :items="item.array_to_json == null ? [] : item.array_to_json ">
                                                <template v-slot:cell(edit)="row">
                                                    <b-btn v-if="!row.item.configured" variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="showEditOperationProcess=true;objInfoOperationProcess=row.item;objInfoOperationProcess.selectedWorkstation=row.item.wsselected" ><i class="ion ion-md-add"></i></b-btn>
                                                    <b-btn v-if="row.item.configured" variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="showEditOperationProcess=true;objInfoOperationProcess=row.item;objInfoOperationProcess.selectedWorkstation=row.item.wsselected" ><i class="ion ion-md-create"></i></b-btn>
                                                    <!-- <b-btn v-if="props.item.configured" variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="submitPrepareToDelete('ws',props.item)"><i class="ion ion-md-close"></i></b-btn> -->                                    
                                                    <!-- <b-btn variant="outline-info borderless" class="btn-sm" @click.prevent="show_tree=true; show_info_details = 'tree'; tree_product_info();">
                                                        <span class="fas fa-project-diagram"></span>&nbsp;&nbsp;Cargar Árbol
                                                    </b-btn> -->
                                                </template> 
                                            </b-table>
                                        </div>
                                </b-tabs>

                                <!-- INFORMACION OPERACION RUTA DE PROCESO -->
                            </div>
                            
                            <!-- INFORMACION GENERADA DESDE LA BASE DE DATOS -->

                            <div class="w-100 text-right mt-2">
                                <b-btn variant="success" @click="getCapacity">Calcular</b-btn>
                            </div>
                            
                        </b-card-body>
                        
                    </b-collapse>
                
                </b-card>
            </div></div>

        </div>

    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>

<style src="@/vendor/libs/vue-form-wizard/vue-form-wizard.scss" lang="scss"></style>

<script>
import Vue from 'vue'
import Axios from 'axios'
import Multiselect from 'vue-multiselect'
import Notifications from 'vue-notification'
import VueTypeahead from 'vue-typeahead'
import process_detail from '@/components/sbx/config/details/details_routes'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

import { infomaster } from '@/components/i40/js/master'
import { infoconfig } from "@/components/i40/js/config";
import { infosysconfig } from "@/components/i40/js/sysconfig";
import { infotrade } from "@/components/i40/js/trade";
import { infoplanning } from "@/components/i40/js/iplanning";
import { infoproduction } from "@/components/i40/js/production";

import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import VueMarkdown from 'vue-markdown';
import {tree} from 'vued3tree'
import {FormWizard, TabContent, WizardStep} from 'vue-form-wizard'


import RouteController from '@/components/sbx/config/details/route_controller'

import { config,master } from "@/components/i40/js/globals";
import datePicker from 'vue-bootstrap-datetimepicker';
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

Vue.use(Notifications)
Vue.prototype.$http = Axios


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
        metaInfo: {
        title: 'Administración y Edición de Productos'
        },

    extends: VueTypeahead,
    components: {
        datePicker,
        SweetModal,
        VueMarkdown,
        SweetModalTab,
        Multiselect,
        'process-detail':process_detail,
        RouteController,
        tree,
        FormWizard,
        TabContent,
        WizardStep
    },
    computed: {
        cptItems(){
            return this.tableCommercialsOrders.map((item)=>{
                let tmp=item;
                let color=''
                if(tmp.visible_buffer>100){
                    color = 'dark'
                }
                else if(tmp.visible_buffer<=100 && tmp.visible_buffer>66){
                    color = 'danger'
                }
                else if(tmp.visible_buffer<=66 && tmp.visible_buffer>33){
                    color = 'warning'
                }
                else if(tmp.visible_buffer<=33 && tmp.visible_buffer>=0){
                    color = 'success'
                }else{
                    color='info'
                }


                tmp._cellVariants = {visible_buffer: color};
                return tmp;
            })  
        }
    },
    data() {
        return {
            show_info_details: 'ruta',
            ws_fields:[{key:'priority', label:'Prioridad'},{key:'code', label:'Codigo'},{key:'production_per_hour', label:'Producción por Hora'},{key:'minute_preparation', label:'Tiempo de Preparación'},{key:'edit', label:'Editar'}],
            name: 'product_detail',
            version: 'v1.0.0.0',
            show_tree:false,
            finished_basic_order: true,

            primerItem: "<div class='small text-muted'>PRODUCTO</div> ",
            segundoItem: "<div class='small text-muted'>RECETA</div> ",
            amount_required: 0,
            contentWiki: "",

            title:"Administración y Edición Productos",
            mensaje_borrado:'',
            singleStringValue: '',
            product_type: ['MTS', 'MTO'],
            disabledcode : false,
            description:"",
            infoProduct:{
                product_id: 0, 
                code: '', 
                description: '', 
                families_id : 0, 
                um:'',
                details: '', 
                active:true, 
                type_product:'MTS',
                familyselected:null,
                selectedum:null,
                input:false,
            },
            
            product_ppal:{},
            tableRouteOperation:[],
            tableCommercialsOrders:[],
            columnsCommercialsOrders: [
        

                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    // {key:' id_workplace', label:"id_workplace", thClass: 'd-none', tdClass: 'd-none'},
                    // {key:' workstation_type_id', label:"workstation_type_id", thClass: 'd-none', tdClass: 'd-none'},
                    {key:'visible_buffer', label:"Buffer"},
                    {key:'code_status', label:"Estado" , thClass: 'd-none', tdClass: 'd-none'},
                    {key:'order_code', label:"#Pedido"},
                    {key:'product_code', label:"Código"},
                    {key:'product_description', label:"Descripción"},
                    {key:'customer_name', label:"Cliente"},
                    {key:'requested_amount', label:"Pedida"},
                    {key:'delivered_quantity', label:"Entregada"},
                    {key:'available_inventory', label:"Inventario"},
                    {key:'total_pending', label:"Pendiente"},
                    {key:'order_created', label:"Ingreso"},
                    {key:'deadline', label:"Fecha Comprometida"},

                    {key:'edit', label:"Acción"},
                    
                    // {key:'wsplant', label:"Planta"},
                    // {key:'wsgroup', label:"Grupo"},
                    // {key:'wstype', label:"Tipo"},
                    // {key:'edit', label:"Edit"}
            ],
            
            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla
            selected_bom:'',

            selected_info_order_type:{},
            info_order_type:[],

            info_product_map:{},

            objState:{},

            ///Informacion Lista de Materiales
                delete_option_mp: 'tab',
                verPreparacion:false,
                tableBOM:[],
                columnsBOM: [
                    // {key:'complete', label:"Completo"},
                    {key:'sequence', label:"Orden"},
                    {key:'code', label:"Código"},
                    {key:'description', label:"Descripción"},
                    {key:'amount_per_parent', label:"Cantidad x Padre"},
                    {key:'edit', label:"Edit"}],

                showAddEditMaterials:false,
                showAddEditMaterialsDetails:false,

                listDefinitionBOM:[],
                selected_listDefinitionBOM:null,
                listDetaulsBOM:[],

                listDefinitionRoute:[],
                selected_listDefinitionRoute:null,

                

                itemNewDetailBOM:{
                    sequence:null,
                    itemTransactionType:null,
                    amount_per_parent:null,
                    parent_id:0,
                    child_id:0,
                    details_bill_of_materials_id:0,
                    bill_of_materials_id:0
                },

                itemNewDefinitionBOM:{
                    bill_of_materials_id:0,
                    name:null,
                    comments:null,
                    default:false,
                    parent_id:0,
                    version:0,
                },

                itemProductSelected:{},
            ///Informacion Lista de Materiales
                selectTab: 'producto',

            ////Informacion Rutas de Procesos

                tableRutasProcesos:[],
                showAddRoute:false,
                itemRouteSelected:{},
                itemNewRoute:{},
                itemDelete:{},
                
                columnsRutasProcesos: [
                // {key:'complete', label:"Completo"},
                {key:'code', label:"Código"},
                {key:'description', label:"Descripción"},
                {key:'default', label:"Ruta por Defecto"},
                {key:'edit', label:"Edit"}],

            ////Informacion Rutas de Procesos

            ////Buscar Rutas
                value:'',
                src: master+'productsearch/',
                limit: 10,
                minChars: 2,
            ////Buscar Rutas

            ///Buscar Productos
                valueProduct:'',
            ///Buscar Productos

            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },

            dateline:null,

            options: {
                format: "YYYY-MM-DD HH:mm",
                // useCurrent: false
                // minDate:Date(),
            },
        }
    },
    methods: {

        tree_product_info(){
            infoconfig.productstructure( this.selected_listDefinitionBOM.bill_of_materials_id, this.product_ppal.product_id).then(data => {
                if (data.status === 202){
                    }else{
                        this.info_product_map = JSON.parse(JSON.stringify(data.data))
                        // this.info_to_send.details = JSON.parse(JSON.stringify(data.data))
                    }
                })
        },

        crear_orden(){
            
            let info_to_send = {
                product_id: this.product_ppal.product_id,
                amount: this.product_ppal.amount,
                order_type: this.selected_info_order_type.code,
                bom: this.selected_listDefinitionBOM.bill_of_materials_id,
                route: this.selected_listDefinitionRoute.route_product_id,
                dateline: this.dateline,
                details:this.info_product_map
            }

            console.log(info_to_send)
            
            infoproduction.createproductionorder(info_to_send)
            this.selected_info_order_type={}
            this.selected_listDefinitionBOM={}
            this.selected_listDefinitionRoute={}
            this.finished_basic_order=true
            this.show_tree=false
            this.product_ppal={}
            this.selectTab='producto'
            this.$refs.wizard.navigateToTab(0)
        },

        getCapacity(){
            infoplanning.getKeepCapacity([],"").then(data => {
                // console.log(data.data)
                        // if(data.data[0] != undefined){
                        //     console.log(data.data)
                        //     this.tableRouteOperation = data.data
                        // }
                    })
        },

        label_bom ({ version, name }) {
            return `${name}` + ' - ' + 'Versión: ' + `${version}`
        },

        label_routes({ version, description }) {
            return `${description}` + ' - ' + 'Versión: ' + `${version}`
        },

        operations_product(){
            infoconfig.routeOperations({route_id: this.selected_listDefinitionRoute.route_product_id},0,"select").then(data => {
                        if(data.data[0] != undefined){
                            this.tableRouteOperation = data.data
                        }
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

        listProductRoute(product_id){
            infoconfig.routeproduct([], product_id, "select").then(data => {
                if(data.data != '')
                    this.listDefinitionRoute = data.data
            })
        },


        tree_product_info(){
            infoconfig.productstructure( this.selected_listDefinitionBOM.bill_of_materials_id, this.product_ppal.product_id).then(data => {
                if (data.status === 202){
                    }else{
                        this.info_product_map = JSON.parse(JSON.stringify(data.data))
                    }
                })
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

        loadRecetas(product_id){
            infoconfig.billofmaterialscontrol([], product_id, "select").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
                }else{
                    this.listDefinitionBOM = data.data
                }
            })
        },

        select_product(param){

            this.product_ppal = {
                product_id: param.product_id,
                description: param.product_description,
                amount: param.pending_amount
            }

            this.loadRecetas(param.product_id)
            this.listProductRoute(param.product_id)
        },

         onFiltered (filteredItems) {
                this.totalRows = filteredItems.length
                this.currentPage = 1

                this.cntBlack = 0
                this.cntDanger = 0
                this.cntWarning = 0
                this.cntSuccess = 0
                this.cntInfo = 0

                for (let index = 0; index < filteredItems.length; index++) {
                    const element = filteredItems[index];

                    if(element._cellVariants.visible_buffer === "dark"){
                        this.cntBlack = this.cntBlack+1
                    }
                    else if(element._cellVariants.visible_buffer === "danger"){
                        this.cntDanger = this.cntDanger+1
                    }
                    else if(element._cellVariants.visible_buffer === "warning"){
                        this.cntWarning = this.cntWarning+1
                    }
                    else if(element._cellVariants.visible_buffer === "success"){
                        this.cntSuccess = this.cntSuccess+1
                    }else{
                        this.cntInfo = this.cntInfo+1
                    }
                    
                }

            },



    ///Eventos buqueda
        onHit (item) {

            this.product_ppal = {
                product_id: item.product_id,
                description: item.description,
                amount: 0
            }
            
            this.valueProduct = item.description
            this.loadRecetas(item.product_id)
            this.listProductRoute(item.product_id)
        },

        updateQueryProducto () {
            let uri = encodeURIComponent(this.valueProduct)
            this.query = uri
            this.update()
        },

        updateQuery () {
            this.query = this.value
            this.update()
        },

        resetInput () {
            this.value = ''
            this.valueProduct = ''
            this.valueSelectedTool=''
            this.reset()
        },
    ///Eventos buqueda
    },

    created() {
        infotrade.orders([],"select-orders").then(data =>{
            this.tableCommercialsOrders = data.data
        })

        infosysconfig.documenttype([],"select").then(data => {
            this.info_order_type = data.data
        })
    },

}
</script>
<style>
.tree {
  height: 400px;
  border: 1px solid #cccccc;

}
.graph-root {
  height: 400px;
  width: 100%;
}
.feedback{
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
}
.log  {
  height: 200px;
  overflow-x: auto;
  overflow-y: auto;
  overflow: auto;
  text-align: left;
}
</style>
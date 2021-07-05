<template>
<!-- :fields="columns" -->
    <div>
        <notifications group="notifications-default" />
        <div class="row">
            <div class="col">
                <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
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
                <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->

        <b-nav class="justify-content-end mt-2">
            <b-nav tabs class="nav-sm tabs-alt">
                <!-- <b-nav-item :active="selectTab=='lista_materiales'" v-if="!infoProduct.input" @click="eventSelectedTab('lista_materiales')">Listas de Materiales</b-nav-item> -->
                <b-nav-item v-if="this.$route.params.wscode == undefined" :active="selectTab=='totals'" @click="eventSelectedTab('totals')">Totales</b-nav-item>
                <b-nav-item v-if="this.$route.params.wscode == undefined" :active="selectTab=='totals_process'" @click="eventSelectedTab('totals_process')">Totales por Proceso</b-nav-item>
                <b-nav-item :active="selectTab=='totals_workstation' || this.$route.params.wscode != undefined" @click="eventSelectedTab('totals_workstation')">Totales Centros de Trabajo</b-nav-item>
            <!-- <b-nav-item disabled>Disabled</b-nav-item> -->
            </b-nav>
        </b-nav>
<!-- {{columnsCommercialsOrders}} -->
                <!-- style="font-size:12px" small  -->
            <!-- 
                

                    <b-table style="font-size:12px" small 
                    tbody-class="h6 font-weight-normal font-table" show-empty hover responsive stacked="sm" :items="cptItems"  
                    :fields="columnsCommercialsOrders" 
                    :current-page="currentPage" :per-page="perPage" :filter="filter" @filtered="onFiltered" 
                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" >

             -->

                        <b-table responsive small :items="cptItems" :fields="columnsCommercialsOrders" 
                            :current-page="currentPage" :per-page="perPage" style="font-size:12px"
                            :style="{'max-height': (windowHeight-280).toString()+'px'}" 
                            class="h-100 w-100 bg-white mt-2" :no-border-collapse="false" 
                            :sticky-header="true" :hover="true" :striped="true" :bordered="true"
                            :filter="filter" @filtered="onFiltered" 
                        >
                            <template v-slot:cell(consume_buffer)="row">
                                <div  style="width:80px">
                                <b-dropdown v-if="check_access('report_manual_tac', 'w')" variant="default btn-xs icon-btn md-btn-flat hide-arrow" :right="!isRTL">
                                    <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                    <b-dropdown-item @click="reportsDetails(row.item)" ><i class="ion ion-md-hammer"></i> &nbsp;&nbsp;Detalle de la Orden</b-dropdown-item>
                                    <b-dropdown-item @click="addReports(row.item)" ><i class="ion ion-md-hand"></i> &nbsp;&nbsp;Adicionar Reporte de Produccion Manual</b-dropdown-item>
                                </b-dropdown>
                                <span> {{row.item.consume_buffer}} </span>
                                </div>
                            </template>

                             <template v-slot:cell(consecutive_order)="row" style="font-weight:bold; text-align: right">
                                <router-link target="_blank" :to="{path:'/drum/searchop/'+row.item.consecutive_order}">
                                    {{row.item.consecutive_order}}
                                </router-link>
                            </template>

                            <template v-slot:head(deadline)="scope">
                                <div class="text-nowrap">Fecha Compromiso</div>
                            </template>
                            <template v-slot:head(requested_date)="scope">
                                <div class="text-nowrap">Fecha Solicitada</div>
                            </template>
                            <template v-slot:head(planning_date)="scope">
                                <div class="text-nowrap">Fecha Planeada</div>
                            </template>
                            <template v-slot:head(projected_date)="scope">
                                <div class="text-nowrap">Fecha Proyectada</div>
                            </template>

                            <template v-slot:cell(products_description)="row">
                                <div class="text-nowrap">{{row.item.products_description}}</div>
                            </template>

                            <template v-slot:cell(deadline)="row">
                                <div class="text-nowrap">{{row.item.deadline}}</div>
                            </template>

                            <template v-slot:cell(activity_description)="row">
                                <div class="text-nowrap">{{row.item.activity_description}}</div>
                            </template>
                            <template v-slot:cell(planning_date)="row">
                                <div class="text-nowrap">{{row.item.planning_date}}</div>
                            </template>
                            <template v-slot:cell(projected_date)="row">
                                <div class="text-nowrap">{{row.item.projected_date}}</div>
                            </template>

                            <template v-slot:cell(workstation_groups)="row">
                                <div class="text-nowrap">{{row.item.workstation_groups}}</div>
                            </template>

                            <template v-slot:cell(workstation_code)="row">
                                <div class="text-nowrap">{{row.item.workstation_code}}</div>
                            </template>

                            <template v-slot:cell(workstation_group)="row">
                                <div class="text-nowrap">{{row.item.workstation_group}}</div>
                            </template>

                            <template v-slot:cell(programed_amount)="row">
                                <div class="text-nowrap text-right">{{numberWithCommas(row.item.programed_amount)}}</div>
                            </template>
                            <template v-slot:cell(pending_amount)="row">
                                <div class="text-nowrap text-right">{{numberWithCommas(row.item.pending_amount)}}</div>
                            </template>

                            <template v-slot:cell(edit)="row">
                                <b-dropdown v-if="check_access('planning_order', 'w')" variant="default btn-xs icon-btn md-btn-flat hide-arrow" :right="!isRTL">
                                    <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                    <b-dropdown-item @click.prevent="$refs.cancelarJob.open();selected_production_order=row.item;" ><i class="ion ion-md-remove-circle text-warning"></i> &nbsp;&nbsp;Cambiar Estado</b-dropdown-item>
                                    <b-dropdown-item @click="showEditContentOrder=true;infosend=row.item" ><i class="ion ion-md-hammer"></i> &nbsp;&nbsp;Ajustes Generales</b-dropdown-item>
                                    <b-dropdown-item @click.prevent="showEditOrder=true;infosend=row.item"><i class="ion ion-md-create text-success"></i> &nbsp;&nbsp;Cambiar Cantidad</b-dropdown-item>
                                </b-dropdown>
                            </template>
                    </b-table>
                    
                <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    
                    <div  class="w-50">
                        <small class="text-muted"> Total Ordenes de Producción: {{totalRows}} </small>
                        <div class="small">
                            Buffer Ordenes de Producción <div class="float-right"> {{cntBlack}} de {{totalRows}} ({{Math.round((cntBlack/totalRows)*100)}}%)</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-dark':true}" :style="{width: String((cntBlack/totalRows)*100)+'%' }"></div>
                        </div>
                        <div class="small">
                            Buffer Ordenes de Producción <div class="float-right"> {{cntDanger}} de {{totalRows}} ({{Math.round((cntDanger/totalRows)*100)}}%)</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-danger':true}" :style="{width: String((cntDanger/totalRows)*100)+'%' }"></div>
                        </div>
                        <div class="small">
                            Buffer Ordenes de Producción <div class="float-right"> {{cntWarning}} de {{totalRows}} ({{Math.round((cntWarning/totalRows)*100)}}%)</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-warning':true}" :style="{width: String((cntWarning/totalRows)*100)+'%' }"></div>
                        </div>
                        <div class="small">
                            Buffer Ordenes de Producción <div class="float-right"> {{cntSuccess}} de {{totalRows}} ({{Math.round((cntSuccess/totalRows)*100)}}%)</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-success':true}" :style="{width: String((cntSuccess/totalRows)*100)+'%' }"></div>
                        </div>
                                    <div class="small">
                            Buffer Ordenes de Producción <div class="float-right"> {{cntInfo}} de {{totalRows}} ({{Math.round((cntInfo/totalRows)*100)}}%)</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-info':true}" :style="{width: String((cntInfo/totalRows)*100)+'%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
            <sweet-modal ref="longModal">
                <div class="text-left">
                    <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
                </div>
            </sweet-modal>

            <b-modal id="modals-top" v-model="showEditOrder"  class="modal-center" size="lg">
                <div slot="modal-title">
                    Modificar <span class="font-weight-light">Ordenes de Producción</span><br>
                </div>

                <h3 class="text-danger text-center">ATENCIÓN</h3>
                <div>
                    <h4 class="text-center">
                       {{infosend.code}} {{infosend.products_description}}
                       <span> <div>Cantidad: {{infosend.programed_amount}}</div>  </span>
                    </h4>
                </div>
                <div>
                    <!-- {{infosend}} -->
                </div>
                Al modificar estos valores con cantidades erroneas, puede generar algunas conseceuncias, dentro del 
                proceso, verifique muy bien antes de aprobar la cantidad escrita.

                <div>
                    <!-- {{infosend}} -->
                </div>

                <h5 class="mt-2">Ingrese una nueva Cantidad:</h5>
                <b-input type="number" min="0" step="1" placeholder="Cantidad" v-model.trim="infosend.programed_amount"/>

                <div slot="modal-footer" class="w-100">
                    <div class="d-flex justify-content-between">
                        <div>
                            <b-btn @click="showEditOrder=false">Cerrar</b-btn>
                        </div>
                        <div>
                            <b-btn variant="warning" @click="update_production_order()">Guardar</b-btn>
                        </div>
                    </div>
                </div> 
            </b-modal>


            <b-modal id="modals-top" v-model="showEditContentOrder"  class="modal-center" size="lg">
                <div slot="modal-title">
                    Modificar <span class="font-weight-light">Ordenes de Producción</span><br>
                </div>

                <h3 class="text-danger text-center">ATENCIÓN</h3>
                <div>
                    <h4 class="text-center">
                       <span> <div>Prioridad de Ejecucion: {{infosend.priority}}</div>  </span>
                    </h4>
                </div>
                <div>
                    <!-- {{infosend}} -->
                </div>
              

                <div>
                    <!-- {{infosend}} -->
                </div>

                <h5 class="mt-2">Ingrese una nueva Prioridad:</h5>
                <b-input type="number" min="0" step="1" placeholder="Prioridad" v-model.trim="infosend.priority"/>

                <div slot="modal-footer" class="w-100">
                    <div class="d-flex justify-content-between">
                        <div>
                            <b-btn @click="showEditContentOrder=false">Cerrar</b-btn>
                        </div>
                        <div>
                            <b-btn variant="warning" @click="update_details_order()">Guardar</b-btn>
                        </div>
                    </div>
                </div> 
            </b-modal>

            <b-modal id="modals-top" v-model="showReportOrder"  class="modal-center" size="lx">
                <div slot="modal-title">
                    Reportar <span class="font-weight-light">Ordenes de Producción</span><br>
                </div>

                <h5 class="mt-2">Cantidad a Reportar:</h5>
                <b-input type="number" step="1" placeholder="Prioridad" v-model.trim="amountManualReport"/>

                <div slot="modal-footer" class="w-100">
                    <div class="d-flex justify-content-between">
                        <div>
                            <b-btn @click="showReportOrder=false">Cerrar</b-btn>
                        </div>
                        <div>
                            <b-btn variant="warning" @click="submitReport()">Guardar</b-btn>
                        </div>
                    </div>
                </div> 
            </b-modal>


            <!-- CONFIRMACION BORRADO DE REGISTRO -->
                    <!-- <div class="d-inline-block"> -->
                        <sweet-modal :icon="type_event_selected_order == 'cancel'?'error':'warning'" title="Cambiar Estado" ref="cancelarJob">
                            
                            <!-- <div class="w-100 text-center" v-if="type_event_selected_order == 'finish'">
                                ¿Está seguro que desea cerrar esta operación del producto? <br>
                                Si confirma esta acción la orden de producción, no será visible en ningun momento, pero las cantidades reportadas seran alamacenada y conservadas de manera continua.
                            </div>

                             <div class="w-100 text-center" v-if="type_event_selected_order == 'cancel'">
                                ¿Está seguro que desea cancelar esta operación del producto? <br>
                                Si confirma esta acción la orden de producción, no será visible en ningun momento y no será posible ejecutar esta operación.
                            </div> -->
                            
                            <!-- <template slot="button"><b-btn @click="updateJobs()" :variant="type_event_selected_order == 'cancel'?'danger':'warning'" class="mr-2">{{type_event_selected_order == 'cancel'?'Cancelar':'Finalizar'}}</b-btn></template> -->
                            <multiselect
                                v-model="itemStatus"
                                :options="optionsStatus"
                                label="description"
                                :searchable="true"
                                :show-labels="false"
                                placeholder="Seleccione un Estado"
                            />
                            <template slot="button"><b-btn @click="updateJobs()" :variant="type_event_selected_order == 'cancel'?'danger':'warning'" class="mr-2">Ejecutar Cambio</b-btn></template>
                            <template slot="button"><b-btn @click="closeUpdateJobs()" variant="primary">Cerrar</b-btn></template> 
                        </sweet-modal>
                    <!-- </div> -->
            <!-- CONFIRMACION BORRADO DE REGISTRO -->
        </div>

        <b-modal id="modals-top" v-model="showEditForm"  class="modal-center" size="lg">
        <!-- <div slot="modal-title">
            Modificar <span class="font-weight-light">Ordenes de Producción</span><br>
        </div> -->
            <vue-gantt ref="gantt_detail"></vue-gantt>
            
             <div slot="modal-footer">
            <b-btn @click="showEditForm=false">Cerrar</b-btn>
        </div> 
     </b-modal>

    <sweet-modal width="100%" ref="reportsDetails">
        <div class="text-left">
            <h2>Detalle Reporte de Producción por Actividad</h2>
            <b-table  small tbody-class="h6 font-weight-normal font-table" :items="itemsReportsDetails"  :fields="fieldsReportDetails" >
                <template v-slot:cell(sequence)="row">
                    <b-btn variant="outline-success icon-btn m-r-1" class="btn-xs" @click.prevent="itemsItemsReportsDetails=row.item.reports_details"><i class="ion ion-md-create"></i></b-btn>
                    {{row.item.sequence}}
                </template>
           </b-table>
        </div>
        <div class="text-left" v-if="itemsItemsReportsDetails.length>0">
            <h2>Detalle de los Reportes Ingresados</h2>
            <b-table  small tbody-class="h6 font-weight-normal font-table" :items="itemsItemsReportsDetails"  :fields="fieldsItemsReportDetails" >
           </b-table>
        </div>
    </sweet-modal>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<script>
import Vue from 'vue'
import gantt from '../planning/gantt'
import { infoproduction } from "@/components/i40/js/production";
import Columns from '@/vendor/sbx/json/columns.json';
import VueMarkdown from 'vue-markdown'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import moment from 'moment'
import Notifications from 'vue-notification'
import {infousers} from '@/components/i40/js/users'
import Multiselect from 'vue-multiselect'
import { infosysconfig } from "@/components/i40/js/sysconfig";
Vue.use(Notifications)

export default {
    components: {
        VueMarkdown,
        SweetModal,
        'vue-gantt': gantt,
        Multiselect
    },
    props: {
        id_plant: {
            type: String
        },
        code_group: {
            type: String
        },
        code_workstation: {
            type: String
        },
    },
    computed: {
        cptItems(){
            let result = this.tableCommercialsOrders.filter((item) => {
                if(this.$route.params.codefloor != undefined){
                    if(item.workstation_plant_id == this.$route.params.idfloor){
                        if(this.$route.params.codegroup!= undefined){
                            if(item.workstation_group != null){
                                if(item.workstation_group == this.$route.params.codegroup){
                                    if(this.$route.params.wscode != undefined){
                                        if(this.$route.params.wscode == item.workstation_code){
                                            return item
                                        }
                                    }
                                }
                            }
                        }else{
                            return item
                        }
                    }
                }else{
                    return item
                }
            }).map((item)=>{
                let tmp=item;
                let color=''

                tmp.consume_buffer = 0

                if(tmp.buffer_days != 0){
                    var now = moment(new Date()); //todays date
                    var end = moment(tmp.deadline);
                    var duration = moment.duration(now.diff(end));
                    var days = duration.asDays();

                    tmp.consume_buffer = Math.round(((days/tmp.buffer_days)*100)*100) / 100 
                }

                if(tmp.consume_buffer>100){
                    color = 'dark'
                }
                else if(tmp.consume_buffer<=100 && tmp.consume_buffer>66){
                    color = 'danger'
                }
                else if(tmp.consume_buffer<=66 && tmp.consume_buffer>33){
                    color = 'warning'
                }
                else if(tmp.consume_buffer<=33 && tmp.consume_buffer>=0){
                    color = 'success'
                }else{
                    color='info'
                }

                tmp._cellVariants = {consume_buffer: color};
                tmp._showDetails = true
                return tmp;
            })

            this.totalRows = result.length

            if(this.selectTab == 'totals')
                result.sort((a, b) => parseFloat(b.consume_buffer) - parseFloat(a.consume_buffer));

            return result
            
        }
    },
    data() {
        return {
            windowHeight: 0,
            amountManualReport:0,
            showReportOrder:false,
            reportInfoParam:{},
            optionsStatus:[],
            itemStatus:{},
            itemsReportsDetails:[],
            fieldsReportDetails:[
                {key:'sequence', label:"Secuencia"},
                {key:'activity_description', label:"Actividad"},
                {key:'programmed_amount', label:"Programado"},
                {key:'produced_amount', label:"Producido"},
                {key:'pending_amount', label:"Pendiente"},
            ],

            itemsItemsReportsDetails:[],
            fieldsItemsReportDetails:[
                {key:'production_report_id', label:"ID"},
                {key:'code_module', label:"Modulo Reporte"},
                {key:'amount', label:"Cantidad"},
                {key:'is_scrap', label:"Desperdicio"},
                {key:'created', label:"Fecha Creacion"},
                {key:'user_report', label:"Usuario"},
            ],

            sortBy: 'id',
            sortDesc: false,
            
            name: 'production',
            version: 'v1.0.0.0',
            contentWiki: "",
            showEditForm:false,
            showEditOrder:false,
            cntBlack:0,
            cntDanger:0,
            cntWarning:0,
            cntSuccess:0,
            cntInfo:0,
            tableCommercialsOrders:[],
            info_result_orders:[],
            infosend:{},
            selectTab:'totals',

            selected_production_order:{},
            type_event_selected_order:'',
            showEditContentOrder:false,

            // columnsCommercialsOrders: [
            //     ///Este objeto es fijo en caso de que se necesite modificar la info
            //     // {key:' id_workplace', label:"id_workplace", thClass: 'd-none', tdClass: 'd-none'},
            //     // {key:' workstation_type_id', label:"workstation_type_id", thClass: 'd-none', tdClass: 'd-none'},
            //     {key:'consume_buffer', label:"Buffer"},
            //     {key:'status_modules_code', label:"Estado"},
            //     {key:'consecutive_order', label:"#Orden"},
            //     {key:'customer_order_id', label:"#Pedido"},
            //     {key:'name', label:"Cliente"},
            //     {key:'code', label:"Código"},
            //     {key:'products_description', label:"Descripción"},
            //     {key:'deadline', label:"Fecha Comprometida"},
            //     {key:'programed_amount', label:"Programada"},
            //     {key:'pending_amount', label:"Pendiente"},
            //     {key:'activity_description', label:"Actividad"},
            //     {key:'sequence', label:"Secuencia"},
            //     {key:'workstation_code', label:"CT"},
            //     {key:'workstation_groups', label:"Grupos"},
                
            //     // {key:'wsplant', label:"Planta"},
            //     // {key:'wsgroup', label:"Grupo"},
            //     // {key:'wstype', label:"Tipo"},
            //     // {key:'edit', label:"Edit"}
            // ],

            columnsCommercialsOrders:[],

            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla

            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },
        }
    
    },
    methods: {
        isRTL () {
            return document.documentElement.getAttribute('dir') === 'rtl' ||
                document.body.getAttribute('dir') === 'rtl'
        },

        check_access(control, action){
            return infousers.check_access(control,action)
        }, 
         onResize() {
            this.windowHeight = window.innerHeight
        },

        numberWithCommas(num) {
            if(num == null)
                num=0
            num = num.toFixed(2)
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
            // return x //.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },

        addReports(item){
            this.showReportOrder = true
            this.reportInfoParam = item
            this.amountManualReport=0
        },
        
        submitReport(action, param_amount){

            let info_to_send = {
                    workstation_id:this.reportInfoParam.workstation_id,   
                    amonut:this.amountManualReport,
                    order_production_process_id: this.reportInfoParam.order_production_process_id,
                    jobs_id:this.reportInfoParam.job_id,
                }

            infoproduction.reportproduction(info_to_send,"tac").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Guardar registro","¡Error Guardando el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                    
                    if(this.$route.params.wscode != undefined){
                        this.selectTab='totals_workstation'
                    }
                    this.loadCommercialsOrders()
                    
                    this.showReportOrder = false

                }
            })
        },

        reportsDetails(item){

            this.itemsItemsReportsDetails=[]
            infoproduction.detailsReports(item.consecutive_order).then(data =>{

                if (data.status === 202){
                    // this.showCustom('bg-danger text-white', "Error","¡Error Modificando el Registro!")
                }else{
                    if (data.data == ""){
                        this.itemsReportsDetails = []
                    }else
                        this.itemsReportsDetails = data.data
                }

                
            })
            
            this.$refs.reportsDetails.open()
        },
        selected_source(){console.log(this.info_result_orders)
            // if (this.code_workstation == undefined || this.code_group == undefined){

            //     if(this.code_workstation != undefined){
            //         this.columnsCommercialsOrders = Columns.columns_drump_totals_process
            //     } else{
            //         this.columnsCommercialsOrders = Columns.columns_drump_totals_workstation  
            //     }

            //     this.tableCommercialsOrders = this.info_result_orders[0].total_planned

            // }else{
            //     this.tableCommercialsOrders = this.info_result_orders[0].total_orders
            //     this.columnsCommercialsOrders = Columns.columns_drump_totals
            // }
            this.tableCommercialsOrders = []
            if(this.selectTab == 'totals'){
                this.tableCommercialsOrders = this.info_result_orders[0].total_orders
                this.columnsCommercialsOrders = Columns.columns_drump_totals
            }else if(this.selectTab == 'totals_process'){
                if (this.code_group == undefined || this.info_result_orders[0].total_planned == null){
                    
                    this.tableCommercialsOrders = this.info_result_orders[0].total_process
                }else{
                    this.tableCommercialsOrders = this.info_result_orders[0].total_planned
                }
                this.columnsCommercialsOrders = Columns.columns_drump_totals_process
            } else if(this.selectTab == 'totals_workstation'){
                this.tableCommercialsOrders = this.info_result_orders[0].total_planned
                this.columnsCommercialsOrders = Columns.columns_drump_totals_workstation  
            }


                this.cntBlack = 0
                this.cntDanger = 0
                this.cntWarning = 0
                this.cntSuccess = 0
                this.cntInfo = 0

                for (let index = 0; index < this.tableCommercialsOrders.length; index++) {
                    const element = this.tableCommercialsOrders[index];
                    
                    if(element.consume_buffer>100){
                        this.cntBlack = this.cntBlack+1
                    }
                    else if(element.consume_buffer<=100 && element.consume_buffer>66){
                        this.cntDanger = this.cntDanger+1
                    }
                    else if(element.consume_buffer<=66 && element.consume_buffer>33){
                        this.cntWarning = this.cntWarning+1
                    }
                    else if(element.consume_buffer<=33 && element.consume_buffer>=0){
                        this.cntSuccess = this.cntSuccess+1
                    }else{
                        this.cntInfo = this.cntInfo+1
                    }
                }

            
        }, 
        updateJobs(){
            this.selected_production_order.status = this.itemStatus.status_id
            infoproduction.changestatusorderprocess(this.selected_production_order).then(data =>{

                 if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Modificando el Registro!")
                }else{
                    // this.info_result_orders = data.data
                    this.$refs.cancelarJob.close()
                    this.selected_source()
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                    this.loadCommercialsOrders()
                    // this.cptItems()
                }
                
            })
        },
        closeUpdateJobs(){
            this.$refs.cancelarJob.close()
        },

        eventSelectedTab(tab){
            this.selectTab = tab
            this.selected_source()
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
            
            showCustom: function(classes, title, text) {
                this.$notify({
                    group: 'notifications-default',
                    type: classes,
                    title: title,
                    text: text
                })
            },
        ///Funcion para cargar la ayuda del helper
        loadCommercialsOrders(){
            infoproduction.production([],"select-complete-production-order").then(data =>{
                // console.log(data.data)
                this.info_result_orders = data.data
                this.selected_source()
            })

            infosysconfig.documentstatus({module:'production_order'}, "select").then(data => {
                // console.log("-----_", data.data)
                if(data.data != ''){
                    this.optionsStatus = data.data
                }else{
                    this.tableData = []
                }
            })

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

                    if(element._cellVariants.consume_buffer === "dark"){
                        this.cntBlack = this.cntBlack+1
                    }
                    else if(element._cellVariants.consume_buffer === "danger"){
                        this.cntDanger = this.cntDanger+1
                    }
                    else if(element._cellVariants.consume_buffer === "warning"){
                        this.cntWarning = this.cntWarning+1
                    }
                    else if(element._cellVariants.consume_buffer === "success"){
                        this.cntSuccess = this.cntSuccess+1
                    }else{
                        this.cntInfo = this.cntInfo+1
                    }
                }
            },
        
        update_production_order(){
            infoproduction.updateproductionorder(this.infosend).then(data =>{

                 if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Modificando el Registro!")
                }else{
                    this.loadCommercialsOrders()
                    this.showEditOrder = false
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                }
                
            })
        },
        update_details_order(){
            infoproduction.updatedetailproductionorder(this.infosend).then(data =>{

                 if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Modificando el Registro!")
                }else{
                    this.loadCommercialsOrders()
                    this.showEditOrder = false
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                }
                
            })
        }
    },
    created(){
        if(this.$route.params.wscode != undefined){
            this.selectTab='totals_workstation'
        }
        this.loadCommercialsOrders()
    },
    beforeDestroy() { 
        window.removeEventListener('resize', this.onResize); 
    },

    mounted() {
        window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
        })
    },
}
</script>
<style>
    .font-table {font-size: 12px;}
    .table .table-warning, .table .table-warning > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #ffff00;
        color: #292b2c;
    }
    .table .table-dark, .table .table-dark > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #292b2c;
        color: #f7f7f7;
    }
    .table .table-danger, .table .table-danger > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #d9534f;
        color: #f7f7f7;
    }
    .table .table-success, .table .table-success > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #5cb85c;
        color: #f7f7f7;
    }
</style>
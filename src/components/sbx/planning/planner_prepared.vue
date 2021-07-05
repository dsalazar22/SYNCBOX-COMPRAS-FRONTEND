<template>
    <div>

        <BlockUI message="" :html="html" v-if="loading" />
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-1">Planeador</h4>
        <!-- <b-nav class="justify-content-end mt-2">
            <b-nav tabs class="nav-sm tabs-alt">
                <b-nav-item :active="selectTab=='plant'"  @click="eventSelectedTab('plant')">Visualización 3D</b-nav-item>
                <b-nav-item :active="selectTab=='machines'"  @click="eventSelectedTab('machines')">Visualización 2D</b-nav-item>
                <b-nav-item :active="selectTab=='orders'" @click="eventSelectedTab('orders')">Ordenes</b-nav-item>
                <b-nav-item :active="selectTab=='ideal'" @click="eventSelectedTab('ideal')">Situación Ideal</b-nav-item>
            </b-nav>
        </b-nav>
        <div class="text-right mt-2 mb-2">
            <b-btn variant="default" size="sm" @click="open_to_planning()">Ordenes Pendientes por Programar</b-btn>&nbsp;

            56359
        </div> -->

    <div v-if="!active_reload">
         <form-wizard class="form-wizard-boxed-steps" v-if="finished_basic_order" ref="wzpo"  @on-complete="planner_order">
            <!-- Allow html in tab title (this template required for the proper styling) -->
            <template slot="step" slot-scope="props">
                <wizard-step :tab="props.tab" @click.native="props.navigateToTab(props.index)" @keyup.enter.native="props.navigateToTab(props.index)" :transition="props.transition" :index="props.index">
                    <span slot="title" :class="{'text-danger':props.tab.validationError}" v-html="props.tab.title"></span>
                </wizard-step>
            </template>
            <!-- / -->

            <tab-content title='Orden de Producción ' :before-change="validateMontaje" >
                <b-card class="mb-3">
                <h5>Orden de Producción</h5>
                            <b-nav class="justify-content-end mt-2">
                                <b-nav tabs class="nav-sm tabs-alt">
                                    <b-nav-item :active="!orders_planned" @click="orders_planned=false; reload_content(false)">Pendientes por Planear</b-nav-item>
                                    <b-nav-item :active="orders_planned" @click="orders_planned = true; reload_content(true)">Planeadas</b-nav-item>
                                </b-nav>
                            </b-nav>
                        <div v-if="!orders_planned">
                            <b-row>
                                    <b-col md="6" class="my-1">
                                        <b-input-group>
                                            <b-form-input v-model="filter" placeholder="Buscar..." />
                                            <b-input-group-append>
                                            <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                                            </b-input-group-append>
                                        </b-input-group>
                                    </b-col>
                                    <b-col md="6" class="my-1">
                                        <b-form-select :options="pageOptions" v-model="perPage" />
                                    </b-col>
                            </b-row>

                                <b-table small show-empty stacked="md" :items="cptItems" :fields="columns" :current-page="currentPage" :per-page="perPage">
                                    <template v-slot:cell(edit)="row">
                                        <div class="text-left">
                                            <b-btn variant="outline-success borderless icon-btn" v-if="!row.item.partial" class="btn-xs" slot="next" @click.prevent="schedule_order(row.item)"><i class="ion ion-md-checkmark"></i></b-btn>
                                            <b-btn variant="warning icon-btn" v-if="row.item.partial" class="btn-xs" slot="next" @click.prevent="partial=row.item.partial; schedule_order(row.item)"><i class="ion ion-md-checkmark"></i></b-btn>
                                            {{row.item.partial ? "Parcial" : ""}}
                                        </div>
                                    </template>
                                </b-table>
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                                    </div>
                                    <div class="text-muted">
                                        <small> Total Ordenes Pendientes: {{this.totalRows}} </small>
                                    </div>
                                </div>
                        </div>
                            <div v-if="orders_planned">
                                <table class="table table-striped mt-2">
                                    <thead class="thead-dark">
                                    <tr>
                                        <th scope="col">Buffer</th>
                                        <th scope="col">OP</th>
                                        <th scope="col">Pedido</th>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Código</th>
                                        <th scope="col">Descripción</th>
                                        <th scope="col">Programado</th>
                                        <!-- <th scope="col">Planeado</th> -->
                                        <th scope="col">Fecha Programada</th>
                                        <th scope="col" v-if="sandbox_active" >Nueva Fecha</th>
                                        <th scope="col">Fecha Comprometida</th>
                                    </tr>
                                    </thead>
                                    <draggable v-model="tableData" tag="tbody">
                                    <tr v-for="item in tableData" :key="item.consecutive_order">
                                        <td scope="row">
                                            <!-- <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="content_load_order_planned(item.production_order_id)"><i class="ion ion-md-create"></i></b-btn> -->
                                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(item,'delete')"><i class="ion ion-md-close"></i></b-btn> {{ item.consumed_buffer }}</td>
                                        <td>{{ item.consecutive_order }}</td>
                                        <td>{{ item.client_order }}</td>
                                        <td>{{ item.customer_name }}</td>
                                        <td>{{ item.products_code }}</td>
                                        <td>{{ item.products_description }}</td>
                                        <td>{{ item.programmed_amount }}</td>
                                        <td>{{ item.deadline }}</td>
                                        <td v-if="sandbox_active">{{ item.NuevaFecha }}</td>
                                        <td>{{ item.requested_date }}</td>
                                        <!-- <td>{{ item.programmed_amount }}</td> -->
                                    </tr>
                                    </draggable>
                                </table>

                                <div class="text-right">
                                    <b-btn @click="cancel_sandbox()" variant="default" class="mb-2" >Cancelar Sandbox</b-btn>
                                    <b-btn @click="sandbox_planning()" variant="warning" class="mb-2" >Ejecutar Sandbox</b-btn>
                                    <b-btn @click="sandbox_planning()" variant="danger" class="mb-2" >Confirmar Sandbox</b-btn>
                                </div>

                            </div>
                </b-card>
            </tab-content>

            <!-- <tab-content title="Secuencia" :before-change="validateMontaje">
                <b-card class="mb-3">
                    <h5>Secuencia</h5>
                    <div id="viewport3d" class="w-100 overflow-auto" style="height:1000px"></div>    
                </b-card>
            </tab-content> -->

            <tab-content title="Montaje" >
                <b-card class="mb-3">
                    <h5>Montaje</h5> 
                    <!-- {{selectedOrder}} -->
                    <div>
                        <b-btn @click="exec_info()" block variant="success" class="mb-2" >Resumen Planning</b-btn>
                        <div v-for="item in resumen_planning">
                            <b-card no-body class="mb-3">
                                <b-card-header> 
                                    <div class="row">
                                        <div class="col-12">
                                            <!-- <h3 class="text-center"> -->
                                            <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle="'acc'+item.ProductCode">
                                                {{item.ProductCode}} - {{item.ProductDescription}}
                                                <div class="collapse-icon"></div>
                                            </a>
                                            <!-- </h3> -->
                                        </div>
                                    </div>
                                    <!-- </div> -->
                                </b-card-header>
                                <b-collapse :id="'acc'+item.ProductCode" :accordion="'acc'+item.ProductCode">
                                    <b-card-body>
                                        <b-tabs class="w-100 nav-tabs-left mb-2">
                                            <b-tab v-for="(item_ac, index) in item.ResumenActivities" :active="index == 0" v-bind:key="item_ac.ProductionOrderId">
                                                <template v-slot:title>
                                                    <!-- <b-spinner type="grow" small></b-spinner>  -->
                                                    <b-btn variant="outline-success borderless icon-btn" v-if="item_ac.Confirmed" class="btn-xs" @click.prevent="change_confirmed(item.ProductCode,item_ac.ProcessName,!item_ac.Confirmed)"><i class="fas fa-circle"></i></b-btn> 
                                                    <b-btn variant="outline-danger borderless icon-btn" v-if="!item_ac.Confirmed" class="btn-xs" @click.prevent="change_confirmed(item.ProductCode,item_ac.ProcessName,!item_ac.Confirmed)"><i class="fas fa-circle"></i></b-btn> 
                                                    
                                                    {{item_ac.ProcessName}}
                                                </template>
                                                <div class="w-100">
                                                    <div class="text-right">
                                                        <label class="switcher switcher-warning mt-4 mb-4">
                                                            <span class="switcher-label">Paralelizar ésta Actividad en los Centros de Trabajo Activados</span>
                                                            <input type="checkbox" class="switcher-input" @click="change_parallels(item.ProductCode,item_ac.ProcessName,item_ac)" v-model="item_ac.Parallels">
                                                                <span class="switcher-indicator">
                                                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <!-- {{item}} -->
                                                    <!-- <h4 class="text-center"> -->
                                                    <!-- {{item_ac.ProcessName}}  -->
                                                    <!-- </h4> -->
                                                    <!-- {{item_ac.DateStart}} {{item_ac.DateFinish}} -->
                                                    <b-table small show-empty stacked="md" :items="item_ac.ResumenWorkstations" :fields="columns_resumen">
                                                        <template v-slot:cell(Code)="row">
                                                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="content_load(row.item)"><i class="ion ion-md-checkmark"></i></b-btn> 
                                                            <span>{{row.item.Code}}</span> 
                                                        </template>
                                                        <template v-slot:cell(IsActive)="row">
                                                            <b-btn variant="outline-success borderless icon-btn" v-if="row.item.Default" class="btn-xs" @click.prevent="setDefaultWorkstation(row.item, item_ac)"><i class="fas fa-circle"></i></b-btn> 
                                                            <b-btn variant="outline-danger borderless icon-btn" v-if="!row.item.Default" class="btn-xs" @click.prevent="setDefaultWorkstation(row.item, item_ac)"><i class="fas fa-circle"></i></b-btn> 
                                                            <!-- <b-btn variant="outline-warning borderless icon-btn" class="btn-xs" @click.prevent="content_load(row.item)"><i class="ion ion-md-create"></i></b-btn>  -->
                                                            <label class="switcher switcher-success mt-2">
                                                                <input type="checkbox" class="switcher-input" @click="ejecutar_cambio(row.item.ProductCode,item_ac.ProcessName,row.item)" v-model="row.item.IsActive">
                                                                    <span class="switcher-indicator">
                                                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                                                </span>
                                                                <!-- <span class="switcher-label">Activa</span> -->
                                                            </label>
                                                        </template>
                                                        <template v-slot:cell(ProductionPerHour)="row">
                                                                <div class="text-left">
                                                                    <b-input-group size="sm">
                                                                        <b-form-input size="sm" type="number" v-model="row.item.ProductionPerHour"></b-form-input>
                                                                        <b-input-group-append>
                                                                            <b-button size="sm" variant="outline-warning borderless icon-btn" @click.prevent="change_productionperhour(item.ProductCode,item_ac.ProcessName,row.item)"><i class="ion ion-md-create"></i></b-button>
                                                                        </b-input-group-append>
                                                                    </b-input-group>
                                                                    <!-- <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="data_change(props.item,'edit')"><i class="ion ion-md-create"></i></b-btn> -->
                                                                    <!-- <b-btn variant="outline-warning borderless icon-btn" class="btn-xs" @click.prevent="remove_workstation(item.ProductCode,item_ac.ProcessName,props.item)"><i class="ion ion-md-create"></i></b-btn> -->
                                                                </div>
                                                            </template>
                                                    </b-table>
                                                </div>
                                            </b-tab>
                                        </b-tabs>
                                    </b-card-body>
                                </b-collapse>
                            </b-card>
                        </div>
                        <div v-if=" resumen_planning.length > 0" class="text-right">
                            <b-btn @click="exec_cancel()" variant="default" class="mb-2" >Cancelar</b-btn>
                            <b-btn @click="exec_confirm()" variant="warning" class="mb-2" >Recalcular</b-btn>
                        </div>

                                    
                    </div>
                    <div id="mountimeline"></div>
                    

                    <!-- <div id="viewport3d_mount" class="w-100 overflow-auto" style="height:1000px"></div>     -->
                </b-card>
            </tab-content>

            <!-- <tab-content title="Máquina">
                <b-card class="mb-3">
                    <h5>Máquina</h5> 
                    <div class="float" id="selectionInfo"></div>
                    <b-nav class="justify-content-end mt-2">
                        <b-nav tabs class="nav-sm tabs-alt">
                            <b-nav-item :active="selectTab=='viewport3d_3d'"  @click="eventSelectedTab('viewport3d_3d')">Visualización 3D</b-nav-item>
                            <b-nav-item :active="selectTab=='viewport3d_machine'"  @click="eventSelectedTab('viewport3d_machine')">Visualización Máquina</b-nav-item>
                        </b-nav>
                    </b-nav>

                    <div id="viewport3d_3d" v-show="selectTab=='viewport3d_3d'" class="w-100 overflow-auto" style="height:1000px"></div>
                    <div id="viewport3d_machine" v-show="selectTab=='viewport3d_machine'" class="w-100 overflow-auto" style="height:1000px"></div>
                </b-card>
            </tab-content> -->

            <!-- Buttons -->
            
            <b-btn variant="default" slot="prev" >Anterior</b-btn>
            <b-btn variant="default" slot="next">Siguiente</b-btn>
            <b-btn variant="primary" slot="finish">Finalizar</b-btn>
            
        </form-wizard>
    </div>



    <b-btn v-if="active_reload" @click="reloadPage()" block variant="success" >Actualizar</b-btn>

         <!-- <div id="example3" style="height: 200px;"></div> -->
        <!-- <div id="viewport3d" class="w-100 overflow-auto" style="height:1000px"></div> -->

        <!-- <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="lg"> -->
            <sweet-modal title="Planear Ordenes de Producción" width="80%" ref="showFormulario">
            
                        <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
                     
              
        <!-- </b-modal> -->
        </sweet-modal>

         <sweet-modal title="Carga Centro de Trabajo" width="90%" ref="wsloadchart">
            <div id="container"></div>
          </sweet-modal>

         <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
            ¿Está seguro que desea retirar esta orden?
            <div class="w-100 text-center">
                Al retirar la orden de producción, lo hará con todas las partes y los procesos que dependan de la misma.
            </div>
            
            <template slot="button"><b-btn @click="deleteRecord()" variant="danger" class="mr-2">Retirar</b-btn></template>
            <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>


         <sweet-modal width="90%" title="Detalle Programado" ref="detalle_orden_produccion">
            <div id="visor_planned_order" class="w-100 overflow-auto" style="height:1000px"></div>    
        </sweet-modal>


         <b-modal id="modals-top" v-model="recovery_order"  class="modal-center" size="md">
            <div slot="modal-title">
            Recuperar <span class="font-weight-light">Orden Planeada</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <div class="text-center">
                    Esta Orden de Producción ha sido Planeada.
               
                    <div></div>
                    <h4>¿Desea Recuperarla?</h4>
               </div>
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="danger" @click="remove_planned_order()">NO Deseo Recuperarla</b-btn>
                <b-btn variant="success" @click="recovery_planned_order()">SÍ Deseo Recuperarla</b-btn>
            </div>
        </b-modal>


         <b-modal id="modals-top" v-model="recovery_order_partial"  class="modal-center" size="md">
            <div slot="modal-title">
            Orden Planeada<br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <div class="text-center">
                    Esta Orden de Producción ha sido Planeada antes, pero quedo de forma parcial, por este motivo se debe de recuperar la versión previa
       
               </div>
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="info" @click="recovery_order_partial=false">Cerrar</b-btn>
            </div>
        </b-modal>

    </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-form-wizard/vue-form-wizard.scss" lang="scss"></style>
<script>
import Vue from 'vue'
import { infoplanning } from "@/components/i40/js/iplanning";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

import {FormWizard, TabContent, WizardStep} from 'vue-form-wizard'
import Notifications from 'vue-notification'
import draggable from "vuedraggable"
import BlockUI from 'vue-blockui'

Vue.use(BlockUI)
Vue.use(Notifications)

export default {
    components: {
        SweetModal,
        SweetModalTab,
        WizardStep,
        TabContent,
        FormWizard,
        draggable
    },
    watch:{
        'filter':function(value){
            // // if(value.length > 3){
                // console.log(value)
                        this.filter_tableData = this.tableData.filter(function (task) {
                            if( task.consecutive_order.toString().includes(value.toLowerCase()) || task.products_code.toLowerCase().includes(value.toLowerCase()) || task.products_description.toLowerCase().includes(value.toLowerCase()))
                                return task
                        });
            // }

            // this.filter_tableData.sort(this.GetSortOrder("code"))
            this.totalRows = this.filter_tableData.length
            this.currentPage = 1
        },
    },

    computed: {
        cptItems(){
            return this.filter_tableData.map((item)=>{
                let tmp=item;
                let color=''
                if(tmp.consumed_buffer>100){
                    color = 'dark'
                }
                else if(tmp.consumed_buffer<=100 && tmp.consumed_buffer>66){
                    color = 'danger'
                }
                else if(tmp.consumed_buffer<=66 && tmp.consumed_buffer>33){
                    color = 'warning'
                }
                else if(tmp.consumed_buffer<=33 && tmp.consumed_buffer>=0){
                    color = 'success'
                }else{
                    color='info'
                }
                tmp._cellVariants = {consumed_buffer: color};
                return tmp;
            })  
        }
    },
    data() {
        return {

            loading: false,
             html: `
                <div class="sk-folding-cube sk-primary"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>
                <h5 class="text-center mb-0">LOADING...</h5>`,
            selectedOrder:{},
            partial:false,
            sandbox_active:false,
            dragging: false,
            recovery_order:false,
            orders_planned: false,
            recovery_order_partial:false,
            item_order: {},

            selectTab:"plant",
            active_reload: false,

            finished_basic_order: true,

            show_tree:false,

            resumen_planning:[],

            primerItem: "<div class='small text-muted'>PRODUCTO</div> ",
            segundoItem: "<div class='small text-muted'>RECETA</div> ",
            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla

            /// Columnas de las tablas
                columns: [
                    {key:'consumed_buffer', label:"Buffer"},
                    {key:'consecutive_order', label:"OP"},
                    {key:'client_order', label:"# Pedido"},
                    {key:'customer_name', label:"Cliente"},
                    {key:'products_code', label:"Código"},
                    {key:'products_description', label:"Descripción"},
                    {key:'programmed_amount', label:"Programado"},
                    {key:'programmed_amount', label:"Planeado"},
                    {key:'deadline', label:"Fecha Limite"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Acciones"}
                ],
            /// Columnas de las tablas
            tableData: [],
            filter_tableData:[],
            order_id:'0',

            columns_resumen: [
                    {key:'IsActive', label:"Activo"},
                    {key:'WorkstationID', label:"ID"},
                    {key:'Code', label:"Codigo"},
                    // {key:'Default', label:"Sugerido"},
                    {key:'StartDate', label:"Fecha Inicio"},
                    {key:'DateFinish', label:"Fecha Fin"},
                    {key:'ProductionPerHour', label:"Produccion x hr"},
                    {key:'TotalMinutes', label:"Minutos"},
                    // {key:'action', label:"Retirar"},
                ],
        }
    },

    methods: {
        setDefaultWorkstation(item, item_ac){

            if(!item.Default){
                if(!item.IsActive){
                    item.IsActive = true

                }
            }

            item.Default = !item.Default
            item.order_production_process_id = item_ac.OrderProductionProcessId

            if(item.Default){
                infoplanning.addworkstation(item).then(data => {
                })
            }else{
                infoplanning.remoworkstation(item).then(data => {
                })
            }

        },

        content_load_order_planned(order_id){
            this.$refs.detalle_orden_produccion.open()
            
            document.getElementById('visor_planned_order').innerHTML = ''
            planning.mount(document.getElementById('visor_planned_order'),order_id)
            this.recovery_order = false
        },

        content_load(item_vl){
            this.objInfo1 = {"workstation_id":item_vl.WorkstationID}
            let categories = []
            let planned = []
            let programmed = []
            // console.log(this.objInfo1)
            infoplanning.calendarcontroller(this.objInfo1, "select-workstation-slots").then(data =>{
                    if(data.data.length >0 && data.data != "Invalid Option" ){
                        this.calendar1 = data.data

                        for (let index = 0; index < this.calendar1.length; index++) {
                            const element = this.calendar1[index];
                            categories.push(element.start_date)
                            programmed.push(element.programed_hours)
                            planned.push(element.planned_hours)
                        }

                        let chart_info_calc = {}
                        chart_info_calc.categories = categories
                        chart_info_calc.hoursPlanned = planned
                        chart_info_calc.hoursProgrammers = programmed
                        chart_info_calc.title =""
                        this.load_chart(chart_info_calc,'container', 'Centro de Trabajo ' + item_vl.Code +' por Día')


                        // infoplanning.workstationslots(this.selectedGroup.workstation_id).then(data =>{
                        //     console.log(data)
                        //     // if(data.data.length >0 && data.data != "Invalid Option" ){
                        //     //     this.calendar1 = data.data

                        //         // for (let index = 0; index < this.calendar1.length; index++) {
                        //         //     const element = this.calendar1[index];
                        //         //     categories.push(element.start_date)
                        //         //     planned.push(element.planned_hours)
                        //         // }

                        //         // let chart_info_calc = {}
                        //         // chart_info_calc.categories = categories
                        //         // chart_info_calc.hoursPlanned = planned
                        //         // chart_info_calc.hoursProgrammers = []
                        //         // chart_info_calc.title =""
                        //         // this.load_chart(chart_info_calc)
                        //     // }
                        // })

                        //  for (let index = 0; index < this.calendar1.length; index++) {
                        //     const element = this.calendar1[index];
                        //     categories.push(element.start_date)
                        //     planned.push(element.planned_hours)
                        //  }

                        // let chart_info_calc = {}
                        // chart_info_calc.categories = categories
                        // chart_info_calc.hoursPlanned = planned
                        // chart_info_calc.hoursProgrammers = []
                        // chart_info_calc.title =""
                        // this.load_chart(chart_info_calc)
                    }
                })

            infoplanning.calendarcontroller(this.objInfo1, "select-workstation-details-slots").then(data =>{
                    if(data.data.length >0 && data.data != "Invalid Option" ){
                        if(data.data != ""){}
                            // this.tableData = data.data
                        else{}
                            // this.tableData = []
                    }
                })
           
            // infoplanning.getplanninginfo(info_send,'analyze').then(data => {
            // })

            this.$refs.wsloadchart.open()

        },

        cancel_sandbox(){
            this.sandbox_active = false
            infoplanning.getinforesources('parent-programmed').then(data =>{
                if(data.data != null && data.data != ""){
                    this.tableData = data.data
                }
                else
                    this.tableData = []   
            })
        },

        async sandbox_planning(){
             this.loading = true
            await infoplanning.removesandbox().then(data =>{});
            
            for (let index = 0; index < this.tableData.length; index++) {
                const element = this.tableData[index].production_order_id;
                // values.push(element)
                // newTable.push(this.tableData[index])
                await infoplanning.sandbox_planning(element).then(data => {
                    console.log(data)
                    if(data.status == 200){
                        this.tableData[index]["NuevaFecha"] = data.data
                    }
                    this.html= `
                        <div class="sk-folding-cube sk-primary"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>
                        <h5 class="text-center mb-0">REPROGRAMANDO ORDEN NRO ${this.tableData[index].consecutive_order}</h5>
                        <h5 class="text-center mb-0">TOTAL ${index} / ${this.tableData.length}</h5>`
                })
            }
            this.sandbox_active = true
            this.loading = false
            
        },

        load_chart(chartInfo, docid, subtitle){
            Highcharts.chart(docid, {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'Horas Programadas vs Horas Planeadas'
                },
                subtitle: {
                    text: subtitle
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

        ejecutar_cambio(product, activity, id){
            for (let index = 0; index < this.resumen_planning.length; index++) {
                const element_product = this.resumen_planning[index];

                if(element_product.ProductCode==product){
                    for (let index2 = 0; index2 < element_product.ResumenActivities.length; index2++) {
                        const element_operation = element_product.ResumenActivities[index2];

                        if(element_operation.ProcessName == activity){
                            for (let index3 = 0; index3 < element_operation.ResumenWorkstations.length; index3++) {
                                const element = element_operation.ResumenWorkstations[index3];

                                if(element.Code==id.Code){
                                    this.resumen_planning[index].ResumenActivities[index2].ResumenWorkstations[index3].IsActive=id.IsActive
                                    // if(index3 == 0)
                                    //     this.resumen_planning[index].ResumenActivities[index2].ResumenWorkstations.shift()
                                    // else
                                    //     this.resumen_planning[index].ResumenActivities[index2].ResumenWorkstations.splice(index3,index3)
                                    return
                                }
                            }
                        }
                    }
                }
            }
        },

        change_productionperhour(product, activity, id){
            for (let index = 0; index < this.resumen_planning.length; index++) {
                const element_product = this.resumen_planning[index];

                if(element_product.ProductCode==product){
                    for (let index2 = 0; index2 < element_product.ResumenActivities.length; index2++) {
                        const element_operation = element_product.ResumenActivities[index2];

                        if(element_operation.ProcessName == activity){
                            for (let index3 = 0; index3 < element_operation.ResumenWorkstations.length; index3++) {
                                const element = element_operation.ResumenWorkstations[index3];

                                if(element.Code==id.Code){
                                    let vle = id.ProductionPerHour.toString()
                                    console.log(this.resumen_planning[index].ResumenActivities[index2], this.resumen_planning[index].ResumenActivities[index2].ResumenWorkstations[index3])
                                     infoplanning.setstandard(this.resumen_planning[index].ResumenActivities[index2].OrderProductionProcessId, vle).then(data =>{
                                         console.log(data)
                                     })
                                    this.resumen_planning[index].ResumenActivities[index2].ResumenWorkstations[index3].ProductionPerHour= parseFloat(vle)
                                    return
                                }
                            }
                        }
                    }
                }
            }
        },


        change_confirmed(product, activity, state){
            // console.log(product, activity, state)
            let result = []
            for (let index = 0; index < this.resumen_planning.length; index++) {
                const element_product = this.resumen_planning[index];

                if(element_product.ProductCode==product){
                    for (let index2 = 0; index2 < element_product.ResumenActivities.length; index2++) {
                        const element_operation = element_product.ResumenActivities[index2];

                        if(element_operation.ProcessName == activity){
                            // element_product.ResumenActivities[index2].Confirmed = state
                            // this.resumen_planning[index].ResumenActivities[index2].Confirmed = state
                            let confirmResult = {}
                            confirmResult.order_production_process_id = this.resumen_planning[index].ResumenActivities[index2].OrderProductionProcessId
                            confirmResult.status = state

                            infoplanning.changestatusactivity(confirmResult).then(data => {
                                this.resumen_planning[index].ResumenActivities[index2].Confirmed = state
                            })
                        }
                    }
                }

                // result.push(element_product)
            }

            // this.resumen_planning = result
        },


        change_parallels(product, activity, id){
            // console.log(product, activity, id)
            let result = []
            for (let index = 0; index < this.resumen_planning.length; index++) {
                const element_product = this.resumen_planning[index];

                if(element_product.ProductCode==product){
                    for (let index2 = 0; index2 < element_product.ResumenActivities.length; index2++) {
                        const element_operation = element_product.ResumenActivities[index2];

                        if(element_operation.ProcessName == activity){
                            // element_product.ResumenActivities[index2].Confirmed = state
                            this.resumen_planning[index].ResumenActivities[index2].Parallels = id.Parallels
                        }
                    }
                }

                // result.push(element_product)
            }

            // this.resumen_planning = result
        },

        reload_content(value){
             this.tableData = []  
            if (!value){
                infoplanning.getinforesources('parent-to-program').then(data =>{
                    if(data.data != null && data.data != ""){
                        this.tableData = data.data
                        this.totalRows = data.data.length
                    }
                    else{
                        this.tableData = []
                        this.totalRows = 0
                    } 
                })
            }else{
                 infoplanning.getinforesources('parent-programmed').then(data =>{
                    if(data.data != null && data.data != ""){
                        this.tableData = data.data 
                    }
                    else
                        this.tableData = []   
                })
            }
        },

        closeDeleteRecord(){
            this.item_order = {}
            this.$refs.errorWithButtonAlert.close()
        },

        deleteRecord(){
            infoplanning.removeorderplanned(this.item_order.production_order_id).then(data =>{
                this.reload_content(true)
                this.$refs.errorWithButtonAlert.close()
            })
        },

        data_change(item, action){
            this.item_order = item
            this.$refs.errorWithButtonAlert.open()
        },

        exec_cancel(){
            this.resumen_planning = []
        },

        exec_confirm(){
            // console.log(this.resumen_planning)
             infoplanning.setorderplanned(this.order_id, this.resumen_planning).then(data =>{
                 this.validateMontaje()
                 this.exec_info()

             })
            // infoplanning.setorderplanned(this.order_id, this.resumen_planning).then(data =>{
                
            //     this.exec_cancel()
            //     document.getElementById('viewport3d_mount').innerHTML = ''
            //     planning.mount(document.getElementById('viewport3d_mount'),this.order_id)
            // })
        },

        remove_workstation(product, activity, id){

            for (let index = 0; index < this.resumen_planning.length; index++) {
                const element_product = this.resumen_planning[index];

                if(element_product.ProductCode==product){
                    for (let index2 = 0; index2 < element_product.ResumenActivities.length; index2++) {
                        const element_operation = element_product.ResumenActivities[index2];

                        if(element_operation.ProcessName == activity){
                            for (let index3 = 0; index3 < element_operation.ResumenWorkstations.length; index3++) {
                                const element = element_operation.ResumenWorkstations[index3];

                                if(element.Code==id.Code){
                                    if(index3 == 0)
                                        this.resumen_planning[index].ResumenActivities[index2].ResumenWorkstations.shift()
                                    else
                                        this.resumen_planning[index].ResumenActivities[index2].ResumenWorkstations.splice(index3,index3)
                                    return
                                }
                            }
                        }
                    }
                }
            }
        },

        exec_info(){
            infoplanning.getorderplanned(this.order_id).then(data =>{
                if(data.data != null && data.data != "")
                    this.resumen_planning = data.data 
                else
                    this.resumen_planning = []   
            })
            // http://127.0.0.1:3500/getorderplanned/264780
        },
                ///Funcion para envio de alertas lateral superior derecha
            showCustom: function(classes, title, text) {
                this.$notify({
                    group: 'notifications-default',
                    type: classes,
                    title: title,
                    text: text
                })
            },
        /// Funcion para envio de alertas lateral superior derecha
        // eventSelectedTab(value){
        //     this.selectTab = value

        //     if(this.selectTab == "viewport3d_3d")
        //         planning.plant(document.getElementById(value))
        //     // else
        //     //     planning.program(document.getElementById(value))
        // },    
        
        validateSecuencia(){
            document.getElementById('viewport3d').innerHTML = ''
            planning.display(document.getElementById('viewport3d'),document.getElementById('selectionInfo'),this.order_id)

            return true
        },
        
        remove_planned_order(){
            infoplanning.deleteorderplanned(this.order_id).then(data =>{
                this.exec_cancel()
                this.validateMontaje()
                this.recovery_order = false
            })
        },


        recovery_planned_order(){
            this.exec_cancel()
            this.validateMontaje()
            this.recovery_order = false

        },

        validateMontaje(){
            infoplanning.mount(this.order_id).then(data =>{
                let resumenPlanning = data.data["ResumenPlanning"]
                var container = document.getElementById('mountimeline');
                var chart = new google.visualization.Timeline(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn({ type: 'string', id: 'Eventos' });
                dataTable.addColumn({ type: 'string', id: 'Evento' });
                // dataTable.addColumn({ type: 'string', role: 'style' });
                dataTable.addColumn({ type: 'date', id: 'Start' });
                dataTable.addColumn({ type: 'date', id: 'End' });

                    let color = []
                    let rows = []

                    let countLines = 0

                    for (let index = 0; index < resumenPlanning.length; index++) {
                        countLines++
                        const element = resumenPlanning[index];
                        var dt = new Date(element.DateStart);
                        var dtf = new Date(element.DateFinish)//.split(' ').join('T'));
                        
                        rows.push([element.ProductCode,element.ProductDescription,  new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds()), new Date(dtf.getFullYear(), dtf.getMonth(), dtf.getDate(), dtf.getHours(), dtf.getMinutes(), dtf.getSeconds())])

                        for (let index = 0; index < element.ResumenActivities.length; index++) {
                            countLines++
                            const element2 = element.ResumenActivities[index];
                            dt = new Date(element2.DateStart);
                            dtf = new Date(element2.DateFinish)
                            rows.push([element.ProductCode + ' - ' + element2.ProcessName, element2.ProcessName,  new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds()), new Date(dtf.getFullYear(), dtf.getMonth(), dtf.getDate(), dtf.getHours(), dtf.getMinutes(), dtf.getSeconds())])   
                        }
                    }

                    var paddingHeight = 40;
                    // set the height to be covered by the rows
                    var rowHeight = countLines * 40.12;
                    // set the total chart height
                    var chartHeight = rowHeight + paddingHeight;

                    document.getElementById("mountimeline").style.height = chartHeight.toString()+'px';

                    var options = {timeline: { showBarLabels: true }};
                    dataTable.addRows(rows);
                    chart.draw(dataTable, options);
             })

            return true
            
        },

        reloadPage(){
            window.location.reload()
        },

        planner_order(){
            infoplanning.operationslots(this.order_id).then(data =>{
            })
            // var ans = await asyncText('POST', api_ip + "savemapplanning/" + options.order_id + "/" + list_result.partial, list_result)
            // console.log("value")
            // planning.program(document.getElementById('viewport3d_mount'), this.order_id) //.then(res=>{
            this.active_reload = true
                // if (res== "OK"){
                    
                    // this.showCustom('bg-success text-white', "Planeación","¡La Planeación con Éxito!")
                    // infoplanning.getinforesources('parent-to-program').then( function(data) {
                    //     if(data.data != null && data.data != "")
                    //         this.tableData = data.data 
                    //     else
                    //         this.tableData = []   
                    // })
                    
                // }else{
                //     this.showCustom('bg-danger text-white', "Error","¡Error al Planear!")
                // }
            // })
        },

        load_info_programmer(slot){
            document.getElementById('viewport3d').innerHTML = ''
            planning.display(document.getElementById('viewport3d'),document.getElementById('selectionInfo'), this.order_id)
            // console.log(this.order_id, this.selectTab)
        },
        
        schedule_order(item){
            this.selectedOrder=item
            this.order_id = item.production_order_id
            // document.getElementById('viewport3d').innerHTML = ''
            // planning.display(document.getElementById('viewport3d'),document.getElementById('selectionInfo'), item.production_order_id)
            //this.load_info_programmer()
        },

         ///Filtros Para las Tablas
            onFiltered (filteredItems) {
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
        ///Filtros Para las Tablas
    },
    
    created() {
        google.charts.load('current', {'packages':['timeline']});
        infoplanning.getinforesources('parent-to-program').then(data =>{
            if(data.data != null && data.data != ""){
                this.tableData = data.data 
                this.filter_tableData = this.tableData
                this.totalRows = data.data.length
            }
            else{
                this.tableData = []
                this.filter_tableData = this.tableData
                this.totalRows = 0 
            }
        })
    }, 
    beforeMount() {
    },
}
</script>
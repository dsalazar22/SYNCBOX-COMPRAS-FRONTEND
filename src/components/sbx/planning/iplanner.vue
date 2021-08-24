<template>
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
                            <b-tab v-for="(item_ac, index) in item.ResumenActivities" :active="index == 0" v-bind:key="item_ac.OrderProductionProcessId">
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
        <div id="mountimeline"></div>
                    

        <b-btn v-if="active_reload" @click="reloadPage()" block variant="success" >Actualizar</b-btn>

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
  
Vue.use(Notifications)

export default {
    props: {
        orderid: {
            type: Number
        },
    },
    components: {
        SweetModal,
        SweetModalTab,
        WizardStep,
        TabContent,
        FormWizard,
        draggable
    },
    computed: {
        cptItems(){
            return this.tableData.map((item)=>{
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
            selectedOrder:{},
            partial:false,
            sandbox_active:false,
            dragging: false,
            recovery_order:false,
            orders_planned: false,
            recovery_order_partial:false,
            item_order: {},
            lastDate:null,

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
            order_id:'0',

            columns_resumen: [
                    {key:'IsActive', label:"Activo"},
                    // {key:'WorkstationID', label:"ID"},
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

        sandbox_planning(){
            let values = []
            let newTable = []
            for (let index = 0; index < this.tableData.length; index++) {
                const element = this.tableData[index].production_order_id;
                values.push(element)
                newTable.push(this.tableData[index])
            }

            this.sandbox_active = true
            infoplanning.sandbox_planning(values).then(data => {
                for (let index = 0; index < newTable.length; index++) {
                    newTable[index]["NuevaFecha"] = data.data[index].DateFinish
                }

                this.tableData = newTable
            })
            
            
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
                                // console.log(element)
                                if(element.Code==id.Code){
                                    let vle = id.ProductionPerHour.toString()
                                    this.resumen_planning[index].ResumenActivities[index2].ResumenWorkstations[index3].ProductionPerHour = parseFloat(vle)
                                    return
                                }
                            }
                        }
                    }
                }
            }
        },

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
            this.$emit('refresh',true)
            // console.log(this.resumen_planning)
             infoplanning.setorderplanned(this.order_id, this.resumen_planning).then(data =>{
                //  console.log( this.resumen_planning)
                 this.validateMontaje()
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
            
        validateSecuencia(){
            document.getElementById('viewport3d').innerHTML = ''
            planning.display(document.getElementById('viewport3d'),document.getElementById('selectionInfo'),this.order_id)

            return true
        },
        
        remove_planned_order(){
                this.$emit('refresh',true)
            infoplanning.deleteorderplanned(this.order_id).then(data =>{
                this.exec_cancel()
                this.validateMontaje()
                this.recovery_order = false
            })
        },


        recovery_planned_order(){
            this.exec_cancel()
            this.$emit('refresh',true)
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
                    let d = null

                    let countLines = 0
                    this.lastDate = null

                    for (let index = 0; index < resumenPlanning.length; index++) {
                        countLines++
                        const element = resumenPlanning[index]//.ResumenWorkstations[0];
                        var dt = new Date(element.DateStart);
                        var dtf = new Date(element.DateFinish)//.split(' ').join('T'));

                        if(dt>dtf){
                            dtf=dt
                        }

                        d = dtf
                        
                        rows.push([element.ProductCode,element.ProductDescription,  new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds()), new Date(dtf.getFullYear(), dtf.getMonth(), dtf.getDate(), dtf.getHours(), dtf.getMinutes(), dtf.getSeconds())])

                        for (let index = 0; index < element.ResumenActivities.length; index++) {
                            countLines++
                            const element2 = element.ResumenActivities[index];
                            let cnstime = element2.ResumenWorkstations[0]
                            dt = new Date(cnstime.StartDate);
                            dtf = new Date(cnstime.DateFinish)

                            if (dtf<dt){dtf=dt}

                            rows.push([element.ProductCode + ' - ' + element2.ProcessName, element2.ProcessName,  new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds()), new Date(dtf.getFullYear(), dtf.getMonth(), dtf.getDate(), dtf.getHours(), dtf.getMinutes(), dtf.getSeconds())])   
                        }
                    }

                    this.lastDate =  [d.getFullYear(), 
                        (d.getMonth()+1 <= 9 ?'0':'') + (d.getMonth()+1).toString(),
                        (d.getDate() <= 9 ?'0':'') + (d.getDate()).toString()].join('-')+' '+
                        [(d.getHours() <= 9 ?'0':'') + (d.getHours()).toString(),
                        (d.getMinutes() <= 9 ?'0':'') + (d.getMinutes()).toString()].join(':');

                    this.lastDate =  ''

                    // console.log(this.lastDate)
                    this.$emit('dateplanner',this.lastDate)

                    var paddingHeight = 40;
                    // set the height to be covered by the rows
                    var rowHeight = countLines * 40.12;
                    // set the total chart height
                    var chartHeight = rowHeight + paddingHeight;

                    document.getElementById("mountimeline").style.height = chartHeight.toString()+'px';

                    var options = {timeline: { showBarLabels: true }};
                    dataTable.addRows(rows);
                    chart.draw(dataTable, options);
                    this.$emit('refresh',false)
             })

            return true
            
        },

        reloadPage(){
            window.location.reload()
        },

        planner_remote_order(value){
            // console.log(value)
            infoplanning.operationslots(value).then(data =>{
            })
            this.active_reload = true
        },

        planner_order(){
            infoplanning.operationslots(this.order_id).then(data =>{
            })
            this.active_reload = true
        },

        load_info_programmer(slot){
            document.getElementById('viewport3d').innerHTML = ''
            planning.display(document.getElementById('viewport3d'),document.getElementById('selectionInfo'), this.order_id)
            // console.log(this.order_id, this.selectTab)
        },
        
        schedule_order(item){
            this.selectedOrder=item
            this.order_id = item.production_order_id
        },
    },
    
    created() {
        google.charts.load('current', {'packages':['timeline']});
        this.order_id=this.orderid
        // console.log(this.orderid)
        this.$emit('refresh',true)
        this.validateMontaje()
    }, 
    beforeMount() {

    },
}
</script>
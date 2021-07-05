<template>
    <div>
        <BlockUI message="" :html="html" v-if="loading" />
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-1">Planeador</h4>
 
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
            infoplanning.getinforesources('order-parent-programmed').then(data =>{
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
                    // console.log(data)
                    this.tableData[index]["NuevaFecha"] = data.data

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
                            this.resumen_planning[index].ResumenActivities[index2].Confirmed = state
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

        reload_content(){
            infoplanning.getinforesources('order-parent-programmed').then(data =>{
                if(data.data != null && data.data != ""){
                    this.tableData = data.data 
                }
                else
                    this.tableData = []   
            })
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
    },
    
    created() {
        google.charts.load('current', {'packages':['timeline']});
        this.reload_content()
    }, 
    beforeMount() {
    },
}
</script>
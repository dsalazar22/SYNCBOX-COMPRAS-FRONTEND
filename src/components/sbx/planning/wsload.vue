<template>
    <div>

        <h4 class="font-weight-bold py-3 mb-4">Capacidades por Centros de Trabajo</h4>
        <div class="w-100 text-right"></div>

        <div>
            <h3>Seleccione un Centro de Trabajo</h3> 
            <multiselect
            v-model="selectedWorkstation"
            :options="workstations"
            placeholder="Centros de Trabajo"
            label="code"
            track-by="code" />
        </div>
        <div class="w-100 text-right mt-2 mb-2">
            <button type="button" class="btn btn-success" v-on:click="content_load()">Consultar</button>
            <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
        </div>

        <div id="container"></div>
        <div :id="'timeline'" style="height: 110px;" v-show="false"></div>

        <div style="overflow-x:auto; min-height:300px">
            <!-- {{columns}} -->


            <b-table responsive :items="tableData" :fields="columns"
                style="font-size:12px; min-height:300px; " 
                class="h-100 w-100 bg-white mt-2" :no-border-collapse="false" 
                :sticky-header="true" :hover="true" :striped="true" :bordered="true"
            >

                <template v-slot:cell(edit)="row">
                    <div class="text-left">
                        <!-- <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="data_change(props.item,'edit')"><i class="ion ion-md-create"></i></b-btn> -->
                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                    </div>
                </template>
                <template v-slot:head(consecutive_order)="scope">
                    <div class="text-nowrap"># Orden</div>
                </template>
                <template v-slot:head(order_code)="scope">
                    <div class="text-nowrap"># Pedido</div>
                </template>
                <template v-slot:head(priority)="scope">
                    <div class="text-nowrap">Prioridad</div>
                </template>
                <template v-slot:head(requested_date)="scope">
                    <div class="text-nowrap">Fecha Solicitada</div>
                </template>
                <template v-slot:head(start_date)="scope">
                    <div class="text-nowrap">Fecha Inicio</div>
                </template>
                <template v-slot:head(finish_date)="scope">
                    <div class="text-nowrap">Fecha Fin</div>
                </template>
                <template v-slot:cell(priority)="row">
                    <!-- <div class="text-nowrap">   v-if="check_access('drump_commercial', 'w')"-->
                        <div v-if="!editPriority">
                            
                                <b-dropdown variant="default btn-xs icon-btn md-btn-flat hide-arrow" :right="!isRTL">
                                    <!-- {{props.item}} -->
                                    <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                    <!-- <b-dropdown-item href="javascript:void(0)">Ver Perfil</b-dropdown-item> -->
                                    <!-- <b-dropdown-item v-if="props.item.produced_amount == 0" @click.prevent="$refs.cancelarJob.open();selected_production_order=props.item; type_event_selected_order='cancel'" ><i class="ion ion-md-close text-danger"></i> &nbsp;&nbsp;Cancelar Activadad</b-dropdown-item> -->
                                    <b-dropdown-item @click="editPriority=true" > &nbsp;&nbsp;Cambiar Prioridad</b-dropdown-item>
                                    <b-dropdown-item @click.prevent="showEditOrder=true;infosend=row.item"><i class="ion ion-md-create text-success"></i> &nbsp;&nbsp;Cambiar Cantidad</b-dropdown-item>
                                    <b-dropdown-item @click="cambiarCentroTrabajo(row.item)" > &nbsp;&nbsp;Cambiar Centro de Trabajo</b-dropdown-item>
                                    <b-dropdown-item @click.prevent="$refs.cancelarJob.open();selected_production_order=row.item;" ><i class="ion ion-md-remove-circle text-warning"></i> &nbsp;&nbsp;Cambiar Estado</b-dropdown-item>

                                    <!-- <b-dropdown-item href="javascript:void(0)"><i class="ion ion-md-resize"></i> &nbsp;&nbsp;Dividir Actividad</b-dropdown-item> -->

                                    <!-- <b-btn variant="outline-success icon-btn m-r-1" class="btn-xs" @click.prevent="showEditOrder=true;infosend=props.item"><i class="ion ion-md-create"></i></b-btn> -->
                                    <!-- <b-dropdown-item href="javascript:void(0)">Eliminar</b-dropdown-item> -->
                                </b-dropdown>
                            <!-- <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="editPriority=true"><i class="ion ion-md-create"></i></b-btn> 
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="editPriority=true"><i class="ion ion-md-create"></i></b-btn>  -->
                            {{row.item.priority}}
                        </div>
                        <b-input-group size="sm"  v-if="editPriority">
                            <b-form-input type="number" v-model="row.item.priority" min="0.00"></b-form-input>
                            <b-input-group-append>
                                <b-btn variant="outline-success borderless icon-btn" class="btn"  @click.prevent="data_change_priority(row.item)"><i class="ion ion-md-checkmark"></i></b-btn>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn" @click.prevent="cancelEditPrioty(row.item,row.item.priority)"><i class="ion ion-md-close"></i></b-btn>
                            </b-input-group-append>
                        </b-input-group>


                    <!-- </div> -->
                </template>
                <template v-slot:cell(products_code)="row">
                    <div class="text-nowrap"> {{row.item.products_code}}</div>
                </template>
                <template v-slot:cell(products_description)="row">
                    <div class="text-nowrap"> {{row.item.products_description}}</div>
                </template>
                <template v-slot:cell(name)="row">
                    <div class="text-nowrap"> {{row.item.name}}</div>
                </template>
                <template v-slot:cell(requested_date)="row">
                    <div class="text-nowrap"> {{row.item.requested_date}}</div>
                </template>
                <template v-slot:cell(start_date)="row">
                    <div class="text-nowrap"> {{row.item.start_date}}</div>
                </template>
                <template v-slot:cell(finish_date)="row">
                    <div class="text-nowrap"> {{row.item.finish_date}}</div>
                </template>
                <template v-slot:cell(activity_description)="row">
                    <div class="text-nowrap"> {{row.item.activity_description}}</div>
                </template>
                <template v-slot:cell(programed_amount)="row">
                    <div class="text-nowrap"> {{numberWithCommas(row.item.programed_amount)}}</div>
                </template>
                
                <template v-slot:cell(produced_amount)="row">
                    <div class="text-nowrap"> {{numberWithCommas(row.item.produced_amount)}}</div>
                </template>
                
                <template v-slot:cell(pending_amount)="row">
                    <div class="text-nowrap"> {{numberWithCommas(row.item.pending_amount)}}</div>
                </template>
                
                <!-- <template v-slot:cell(show)="row">
                    <div class="text-left">
                    <span style="color:red" v-if="!row.item.show"><i class="ion ion-md-remove-circle"></i></span>
                        <span style="color:green" v-if="row.item.show"><i class="ion ion-md-add-circle"></i></span>
                    </div>
                </template>
                <template v-slot:cell(active)="row">
                    <div class="text-left">
                        <span style="color:red" v-if="!row.item.active"><i class="ion ion-md-remove-circle"></i></span>
                        <span style="color:green" v-if="row.item.active"><i class="ion ion-md-add-circle"></i></span>
                    </div>
                </template> -->
            </b-table>
        </div>


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

        <b-modal v-model="wschange" size="xl" title="Centros de Trabajo" hide-footer>
            <b-form-select v-model="wsselected" :options="wsoption"></b-form-select>
                <div class="w-100 text-right mt-1">
                    <b-button
                        variant="primary"
                        size="sm"
                        @click="wschange=false">
                        Cerrar
                    </b-button> 
                    &nbsp;
                    <b-button
                        variant="success"
                        size="sm"
                        @click="setChange()">
                        Aplicar Cambio
                    </b-button>
                </div>
        </b-modal>

        <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
            ¿Está seguro que desea retirar esta orden?
            <div class="w-100 text-center">
                Al retirar la orden de producción, lo hará con todas las partes y los procesos que dependan de esta misma.
            </div>
            
            <template slot="button"><b-btn @click="deleteRecord()" variant="danger" class="mr-2">Retirar</b-btn></template>
            <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>

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

    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>
// require("@/i40/vendor/highcharts.js");
import Vue from 'vue'
import { infoplanning } from "@/components/i40/js/iplanning";
import Multiselect from 'vue-multiselect'
import { infomaster } from "@/components/i40/js/master";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue' 
import { infoproduction } from "@/components/i40/js/production";
import { infosysconfig } from "@/components/i40/js/sysconfig";
import Notifications from 'vue-notification'
Vue.use(Notifications)

export default {
    metaInfo: {
        title: 'Carga por Centro de Trabajo'
    },
    components: {
        Multiselect,
        SweetModal,
        SweetModalTab
        // Scrollable,
        // datePicker
    },

    data() {
        return {
            windowHeight: 0,
            showEditOrder:false, 
            infosend:{},
            type_event_selected_order:"",

            optionsStatus:[],
            itemStatus:{},
            wsselected:null,
            wsoption:[],
            selected_production_order:{},
            item_order:{},
            calendar1:[],
            selectedGroup:{},
            workstationGroup:[],

            itemOrderSelected:[],
            selectedWorkstation:{},
            workstations:[],

            tableData:[],
            editPriority:false,
            wschange:false,
            columns: [
                    {key:'priority', label:"Prioridad"},
                    {key:'status_modules_code', label:"Estado"},
                    {key:'consecutive_order', label:"# Orden", stickyColumn: true},
                    {key:'activity_description', label:"Actividad"},
                    {key:'products_code', label:"Codigo"},
                    {key:'products_description', label:"Descripcion"},
                    {key:'order_code', label:"# Pedido", stickyColumn: true},
                    {key:'name', label:"Cliente"},
                    {key:'requested_date', label:"Fecha Solicitada"},
                    {key:'start_date', label:"Fecha Inicio"},
                    {key:'finish_date', label:"Fecha Fin"},
                    {key:'programed_amount', label:"Programado"},
                    {key:'produced_amount', label:"Producido"},
                    {key:'pending_amount', label:"Pendiente"},
                    // {key:'description', label:"Descripción"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    // {key:'edit', label:"Editar"}
                ],
            objInfo1:{}
        }
    },

    methods: { 
        isRTL () {
            return document.documentElement.getAttribute('dir') === 'rtl' ||
                document.body.getAttribute('dir') === 'rtl'
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

        showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
        },
        update_production_order(){
            infoproduction.updateproductionorder(this.infosend).then(data =>{

                 if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Modificando el Registro!")
                }else{
                    this.content_load()
                    this.showEditOrder = false
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                }
                
            })
        },
        updateJobs(){
            this.selected_production_order.status = this.itemStatus.status_id
            infoproduction.changestatusorderprocess(this.selected_production_order).then(data =>{

                 if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Modificando el Registro!")
                }else{
                    this.$refs.cancelarJob.close()
                    this.content_load()
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                }
                
            })
        },
        closeUpdateJobs(){
            this.$refs.cancelarJob.close()
        },

        cambiarCentroTrabajo(item){
            this.wschange = true
            this.itemOrderSelected = {}
            this.itemOrderSelected = item
            this.wsoption = []

            infoplanning.calendarcontroller(item.order_production_process_id, "select-workstation-available").then(data =>{
                if(data.data.length >0 && data.data != "Invalid Option" ){
                    if(data.data != ""){
                        for (let index = 0; index < data.data.length; index++) {
                            const element = data.data[index];
                            this.wsoption.push({value:element.workstation_id, text:element.code+' '+element.description})
                            
                        }
                    }
                }
            })
        },

        setChange(){
            console.log(this.itemOrderSelected)
            infoplanning.calendarcontroller({ws_planning_default_id: this.itemOrderSelected.ws_planning_default_id, workstation_id:this.wsselected}, "select-change-workstation").then(data =>{
                this.content_load()
            })
        },

        loadTimeline(wscode){
            
        },

        data_change_priority(item){
            this.editPriority=false

            infoplanning.changepriority(item).then(data =>{
                if(data.data.length >0 && data.data != "Invalid Option" ){
                    this.startContent()
                }
            })

        },
        cancelEditPrioty(item, value){
            this.startContent()
            this.editPriority=false
        },

        startContent(){
            infoplanning.calendarcontroller(this.objInfo1, "select-workstation-details-slots").then(data =>{
                this.tableData = []
                if(data.data.length >0 && data.data != "Invalid Option" ){
                    if(data.data != ""){
                        this.tableData = data.data
                        this.loadTimeline(data.data)
                    }
                }
            })
        },

        closeDeleteRecord(){
            this.item_order = {}
            this.$refs.errorWithButtonAlert.close()
        },

        deleteRecord(){
            infoplanning.removeorderplanned(this.item_order.production_order_id).then(data =>{
                this.content_load()
                this.$refs.errorWithButtonAlert.close()
            })
        },

        data_change(item, action){
            this.item_order = item
            this.$refs.errorWithButtonAlert.open()
        },
        content_load_group(){
            this.objInfo1 = {"workstation_id":this.selectedWorkstation.workstation_id}
        },

        load_groups_per_month_ws(){
            this.objInfo1 = {"workstation_group_id":this.selectedGroup.workstation_group_id}
            let categories = []
            let planned = []
            let programmed = []
            
            infoplanning.calendarcontroller(this.objInfo1, "select-group-per-month-slots").then(data =>{
                
                let calendarx = data.data

                for (let index = 0; index < calendarx.length; index++) {
                    const element = calendarx[index];
                    categories.push(element.start_date)
                    programmed.push(element.programed_hours)
                    planned.push(element.planned_hours)
                }

                let chart_info_calc = {}
                chart_info_calc.categories = categories
                chart_info_calc.hoursPlanned = planned
                chart_info_calc.hoursProgrammers = programmed
                chart_info_calc.title =""
                this.load_chart(chart_info_calc,'container2', this.selectedGroup.description + ' por Día')
            })
        },

        load_groups_ws(){
            this.objInfo1 = {"workstation_group_id":this.selectedGroup.workstation_group_id}
            let categories = []
            let planned = []
            let programmed = []
            let order_info = []
            let activity_info = []
            
            infoplanning.calendarcontroller(this.objInfo1, "select-group-slots").then(data =>{
                


                for (let index = 0; index < calendarx.length; index++) {
                    const element = calendarx[index];
                    categories.push(element.start_date)
                    programmed.push(element.programed_hours)
                    planned.push(element.planned_hours)
                    order_info.push(element.consecutive_order)
                    activity_info.push(element.activity_description)


            }



                let chart_info_calc = {}
                chart_info_calc.categories = categories
                chart_info_calc.hoursPlanned = planned
                chart_info_calc.hoursProgrammers = programmed
                chart_info_calc.order_info = order_info
                chart_info_calc.activity_info = activity_info
                chart_info_calc.title =""
                this.load_chart(chart_info_calc,'container2', this.selectedGroup.description + ' por Día')
            })
        },

        getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

        content_load(){


            this.objInfo1 = {"workstation_id":this.selectedWorkstation.workstation_id}
            let categories = []
            let planned = []
            let programmed = []
            let order_info = []
            let activity_info = []
            this.tableData = []
            
            var container = document.getElementById('timeline');
            this.chart = new google.visualization.Timeline(container);
            var dtchart = new google.visualization.DataTable();

            dtchart.addColumn({ type: 'string', id: 'Eventos' });
            dtchart.addColumn({ type: 'string', id: 'Evento' });
            dtchart.addColumn({ type: 'string', role: 'style' });
            // dtchart.addColumn({ type: 'string', role: 'tooltip' });
            dtchart.addColumn({ type: 'date', id: 'Start' });
            dtchart.addColumn({ type: 'date', id: 'End' });
            let color = []
            let rows = []
            let lastColor = this.getRandomColor()
            let lastorder = 0

            // console.log(this.objInfo1)
            infoplanning.calendarcontroller(this.objInfo1, "select-workstation-slots").then(data =>{
                    if(data.data.length >0 && data.data != "Invalid Option" ){
                        let calendarx = data.data

                        this.calendar1 = data.data

                        for (let index = 0; index < this.calendar1.length; index++) {
                            
                            // let exists = false
                            // for (let index2 = 0; index2 < programmed.length; index2++) {
                            //     const element2 = programmed[index2];
                            //     // console.log(element2)
                            //     if(element2.name==element.start_date){
                            //         programmed[index2].data.push(element.programed_hours)
                            //         exists = true
                            //     }
                            // }

                            // if(!exists){
                            //     let name = element.start_date
                            //     let data = []
                            //     data.push(element.programed_hours)
                            //     programmed.push({name:name, data:data})
                            // }
                            // planned.push(element.planned_hours)
                            // order_info.push(element.consecutive_order)
                            // activity_info.push(element.activity_description)
                            // console.log(programmed)
                            const element = this.calendar1[index];
                            categories.push(element.start_date)
                            programmed.push(element.programed_hours)
                            planned.push(element.planned_hours)
                            order_info.push(element.consecutive_order)
                            activity_info.push(element.activity_description)

                                                        


                            if(element.consecutive_order != null){
                                
                                var dt = new Date(element.start_date);
                                var dtf = new Date(dt.getTime() + Math.trunc(element.programed_hours*60*60*1000))

                                    if(lastorder != element.consecutive_order){
                                        lastorder = element.consecutive_order
                                        lastColor = this.getRandomColor()
                                    }
                                
                                rows.push(['Timeline',`(${element.consecutive_order}) ${element.activity_description}`, lastColor, new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds()), new Date(dtf.getFullYear(), dtf.getMonth(), dtf.getDate(), dtf.getHours(), dtf.getMinutes(), dtf.getSeconds())])
                            }

                        }

                        let chart_info_calc = {}
                        chart_info_calc.categories = categories
                        chart_info_calc.hoursPlanned = planned
                        chart_info_calc.hoursProgrammers = programmed
                        chart_info_calc.order_info = order_info
                        chart_info_calc.activity_info = activity_info
                        chart_info_calc.title =""

                        // console.log(rows)
                        var options = {timeline: { showBarLabels: false }};
                        dtchart.addRows(rows);
                        this.chart.draw(dtchart, options);


                        


                        this.load_chart(chart_info_calc,'container', 'Centro de Trabajo ' + this.objInfo1.description +' por Día')


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
                this.tableData = []
                if(data.data.length >0 && data.data != "Invalid Option" ){
                    if(data.data != "")
                        this.tableData = data.data
                }
            })


        },

        load_chart(chartInfo, docid, subtitle){
            // console.log(chartInfo.categories)
            Highcharts.chart(docid, {
                chart: {
                    zoomType: 'x',
                    type: 'column'
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
                    
                    useHTML: true,
                        formatter: function() {
                                      
                            var point = this.point.x;
                            return `
                                <div>
                                    <div class="text-center">
                                    <h3> ${chartInfo.activity_info[point] == null ? '-----' : chartInfo.activity_info[point]} </h3>
                                    <h4> OP ${chartInfo.order_info[point] == null ? '0' : chartInfo.order_info[point]} </h4>
                                    </div>
                                    <b>Horas Programadas:</b> ${chartInfo.hoursProgrammers[point]} <br/>
                                    <b>Horas Planeadas:</b> ${chartInfo.hoursPlanned[point]} <br/>                               
                                </div>
                            
                            `;
                        }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
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
                    data: chartInfo.hoursProgrammers

                }, {
                    name: 'Horas Planeadas',
                    type: 'line',
                    data: chartInfo.hoursPlanned
                }]
            });
        },
    },
    beforeDestroy() { 
        window.removeEventListener('resize', this.onResize); 
    },

    mounted() {
        window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
        })
    },
    created() {
        google.charts.load('current', {'packages':['timeline']});

          infomaster.group([],"select").then(data => {
                    
                    // this.workstationType = data.data[0].wstype
                    // this.workstationPlant = data.data[0].wsplant

                    this.workstationGroup= data.data
                    
                    // if( data.data[0].workstation != null){
                    //     this.tableData = data.data[0].workstation
                    //     this.totalRows= this.tableData.length
                    // }
                })

            infomaster.workstation([],"select").then(data => {
                
                // this.workstationType = data.data[0].wstype
                // this.workstationPlant = data.data[0].wsplant
                this.workstations= data.data[0].workstation
                
                // if( data.data[0].workstation != null){
                //     this.tableData = data.data[0].workstation
                //     this.totalRows= this.tableData.length
                // }
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
    
}
</script>

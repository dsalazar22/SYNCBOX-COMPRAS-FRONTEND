<template>
    <div>
        <!-- MODIFICACION ORDEN DE PRODUCCION - JOBS-->
        <!-- <div class="w-100 h4 text-center font-weight-light">
            
        </div>
        <div class="w-100 h6 text-center">
            
        </div> -->

        <h4>
            {{selectedOrderItem.code + ' - ' + selectedOrderItem.description}}
            <small class="text-muted">Orden de Producción: {{selectedOrderItem.order_id}}</small>
        </h4>
           
        <b-tabs class="nav-tabs-top mb-4">
            <b-tab title="Orden de Producción" active>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-12 col-md-6">
                            <b-card no-body header="Resumen Orden de Producción" header-tag="h6" class="mb-4 align-middle">
                                <b-card-body>
                                    <!-- <div class="small mb-2">Número de Orden:<div class="float-right">1234</div></div> -->
                                    <!-- <div class="small mb-2">Producto:<div class="float-right">1234</div></div> -->
                                    <div class="small mb-2">Cantidad Programada Total:<div class="float-right">{{selectedOrderItem.programmed_amount}}</div></div>
                                    <div class="small mb-2">Cantidad Producida Total:<div class="float-right">{{selectedOrderItem.quantity_produced}}</div></div>
                                    <div class="small mb-2">Cantidad Pendiente:<div class="float-right">{{selectedOrderItem.pending_amount}}</div></div>
                                    <div class="small mb-2">Cantidad Asignada:<div class="float-right">{{ cantidadTotalAsignada }}</div></div>
                                    <div class="small mb-2">Cantidad Pendiente por Asignar:<div class="float-right">{{ selectedOrderItem.programmed_amount - cantidadTotalAsignada }}</div></div>
                                </b-card-body>
                            </b-card>
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <b-card no-body header="Modificar Orden de Producción" header-tag="h6" class="mb-4 align-middle">
                                <b-card-body>
                                     <b-input-group>
                                        <b-input-group-text slot="prepend">
                                            <i class="fas fa-hashtag"></i>
                                        </b-input-group-text>
                                        <b-input placeholder="Cantidad a Producir" v-model="selectedOrderItem.programmed_amount" type="number" />
                                    </b-input-group>
                                            
                                    <datepicker
                                        v-model="selectedOrderItem.deadline"
                                        :bootstrapStyling="true"
                                        :monday-first="true"
                                        :full-month-name="true"
                                        :format="customFormatter"
                                        placeholder="Fecha de Compromiso"
                                        :calendar-button="true"
                                        calendar-button-icon="ion ion-md-calendar"
                                        :clear-button="true"
                                        :disabled-dates="disabledDates"
                                        :highlighted="highlightedDates" 
                                        class="mt-2"
                                    />
                                    
                                    <div class="d-flex justify-content-between mt-2">
                                        <label class="switcher switcher-success mt-2">
                                        <input type="checkbox" class="switcher-input" :disabled="!selectedOrderItem.is_global"  v-model="selectedOrderItem.published">
                                        <span class="switcher-indicator">
                                        <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                        <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                        </span>
                                        <span class="switcher-label">Publicar</span>
                                    </label>
                                        <b-btn class="mt-0" :variant="variantSaveButton" @click="saveEditOrder()">Guardar</b-btn>
                                    </div>
                                </b-card-body>
                            </b-card>
                        </div>
                    </div>
                </div>
            </b-tab>
            <b-tab title="Jobs">
                <div class="card-body">
                <!-- <div class="col-md-1"></div> -->
                    <div class="w-100">
                        <!-- <b-card no-body header="Adicionar / Editar Jobs" header-tag="h6" class="mb-4 align-middle">
                            <b-card-body> -->
                                <div class="row">
                                    <div class="col-sm-12 col-md-6">
                                        <b-form-group class="mt-0" label="Centro de Trabajo">
                                            <multiselect                        
                                                v-model="selectedWorkStation"
                                                :options="workstation"
                                                placeholder="Seleccione un Centro de Trabajo"
                                                label="code"
                                                track-by="description" />
                                        </b-form-group>
                                    </div>
                                    <div class="col-sm-12 col-md-6">
                                        <b-form-group class="mt-0" label="Cantidad">
                                            <b-input-group-text slot="prepend">
                                                <i class="fas fa-hashtag"></i>
                                            </b-input-group-text>
                                            <b-input placeholder="Cantidad a Producir" v-model="objInfoJobs.amount_programmed" type="number" />
                                        </b-form-group>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <label class="switcher switcher-success mt-1">
                                            <input type="checkbox" class="switcher-input" v-model="objInfoJobs.published">
                                            <span class="switcher-indicator">
                                            <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                            <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                            </span>
                                            <span class="switcher-label">Publicar</span>
                                        </label>
                                        
                                    <b-btn class="mt-0" :variant="variantSaveButton" v-if="!selectedOrderItem.is_global" @click="createJobs()">Guardar</b-btn>
                                </div>
                                <div class="mt-2">
                                    <div class="row">
                                    </div>
                                </div>
                            <!-- </b-card-body>
                        </b-card> -->
                    </div>

                    <div class="d-flex justify-content-end mb-1">
                        <b-nav tabs class="nav-sm tabs-alt mr-2 ml-2">
                            <b-nav-item :active="jobsActive" @click="getInfoJobsStatus('')">Activos</b-nav-item>
                            <b-nav-item :active="jobFinished" @click="getInfoJobsStatus('002')">Terminados</b-nav-item>
                            <b-nav-item :active="jobCanceled" @click="getInfoJobsStatus('007')">Cancelados</b-nav-item>
                        </b-nav>
                    </div>
            
                    <b-table small show-empty stacked="md" :items="tableDataJobs" :fields="columnsJobs">
                        <template v-slot:cell(jobs_id)="row">
                            <div class="text-center">
                            <span><i :class="{'ion ion-md-eye':row.item.published, 'ion ion-md-eye-off': !row.item.published, 'mr-2':true, 'text-info':row.item.published, 'text-warning': !row.item.published}"></i></span>
                                {{row.item.jobs_id}}
                            </div>
                        </template>

                        <template v-slot:cell(edit)="row">
                            <!-- {{ props.item }} -->
                            <div class="text-center" v-if="row.item.status_code != '003'">
                                <!-- <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="showDetailsProductionOrders"><i class="ion ion-md-information-circle-outline"></i></b-btn> -->
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="data_change_jobs(row.item, 'update')" v-if="jobsActive"><i class="ion ion-md-create"></i></b-btn>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change_jobs(row.item,'delete')" v-if="jobsActive && row.item.amount_produced==0"><i class="ion ion-md-close" ></i></b-btn>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change_jobs(row.item,'close')" v-if="jobsActive && row.item.amount_produced>0"><i class="ion ion-md-power" ></i></b-btn>
                            </div>
                            <div class="text-center" v-if="row.item.status_code == '003'">
                                <i class="ion ion-md-hammer"></i>
                            </div>
                        </template>
                        <template v-slot:cell(show)="row">
                            <div class="text-center">
                            <span style="color:red" v-if="!row.item.show"><i class="ion ion-md-remove-circle"></i></span>
                                <span style="color:green" v-if="row.item.show"><i class="ion ion-md-add-circle"></i></span>
                            </div>
                        </template>
                        <template v-slot:cell(active)="row">
                            <div class="text-center">
                                <span style="color:red" v-if="!row.item.active"><i class="ion ion-md-remove-circle"></i></span>
                                <span style="color:green" v-if="row.item.active"><i class="ion ion-md-add-circle"></i></span>
                            </div>
                        </template>
                        <!-- <template slot="deadline" slot-scope="props">
                            <div class="text-center">
                                {{props.item.deadline.replace("T00:00:00","")}}
                            </div>
                        </template> -->
                    </b-table>
                 </div>
            </b-tab>
        </b-tabs>


                
                <!-- </b-card> -->
<!-- MODIFICACION ORDEN DE PRODUCCION - JOBS -->

<!-- CONFIRMACION BORRADO DE REGISTRO -->
        <!-- <div class="d-inline-block"> -->
            <sweet-modal icon="error" title="Borrar registro" ref="cancelarJob">
                ¿Está seguro que desea cancelar el Job?
                <div class="w-100 text-center">
                    Este Job llevará su cantidad programada a 0 (cero) y lo pondrá en cacenlado. En caso de que requiera fabricar esta producción, deberá volver a generar el Job.
                </div>
                
                <template slot="button"><b-btn @click="updateJobs()" variant="danger" class="mr-2">Cancelar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        <!-- </div> -->
<!-- CONFIRMACION BORRADO DE REGISTRO -->


    <!-- <notifications group="notifications-default" /> -->
        
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>

import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import { getInfoWorkstation, orderProductionController, jobsProductionController } from "@/vendor/sbx/sbx/production_order";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import Notifications from 'vue-notification'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

Vue.use(Notifications)

export default {
    components: {
        Multiselect,
        SweetModal,
        SweetModalTab,
        Datepicker,
    },
    data() {
        return {
            /// Objeto que será enviado en las operacion CRUD JOBS
                showEditForm: false,
                variantSaveButton:"success",
                workstation: [],
                selectedWorkStation: {},
                selectedOrderItem:{},
                itemSelected:{},

                objInfoJobs: {
                    id:0,
                    amount_programmed:0,
                    amount_produced:0,
                    published:false,
                    job_status_code:0,
                    workstation_id:0,
                    new_workstation_id:0,
                    production_order_id:0,
                    job_status_code:""
                },
                cantidadTotalAsignada:0,
            ///

            ///INFO TABLA JOBS
                tableCompleteDataJobs: [],
                tableDataJobs: [],
                columnsJobs: [
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'jobs_id', label:"Id Job"},
                    {key:'workstation_code', label:"Centro Trabajo"},
                    {key:'amount_programmed', label:"Programado"},
                    {key:'amount_produced', label:"Producido"},
                    {key:'pending_amount', label:"Pendiente"},
                    {key:'published', label:"published", thClass: 'd-none', tdClass: 'd-none'},
                    {key:'workstation_id', label:"workstation_id", thClass: 'd-none', tdClass: 'd-none'},
                    // {key:'centrotrabajo', label:"Centro Trabajo"},
                    // {key:'deadline', label:"Comprometida"},
                    {key:'edit', label:"Editar"},
                ],
            ////

            ///DETALLE JOBS
                jobsActive:true,
                jobFinished: false,
                jobCanceled: false,
            ///

            disabledDates: {
                to: new Date(Date.now() - 8640000) // Disable sunday
            },

            highlightedDates: {
                dates: [
                    moment().toDate()
                ]
            },

            customFormatter(date) {
                return moment(date).format('YYYY-MM-DD');
            },
        }
    },
    methods: {
        ///
            restarForm(){
                this.jobsActive=true
                this.jobFinished= false
                this.jobCanceled= false

                this.objInfoJobs = {
                    id:0,
                    amount_programmed:0,
                    amount_produced:0,
                    published:false,
                    job_status_code:0,
                    job_status_code:""
                }
                
                this.selectedWorkStation={}
            },
        ///

        ///CRUD JOBS
            editProductionOrder(item){
                this.itemSelected = item
                this.selectedOrderItem= JSON.parse(JSON.stringify(item));
                this.objInfoJobs.production_order_id = item.order_id

                getInfoWorkstation().then(data =>{
                    this.workstation = data.data
                })

                jobsProductionController(this.objInfoJobs,"select").then(data => {

                    this.tableCompleteDataJobs = data.data
                    this.tableDataJobs = []
                    
                    for(var i in this.tableCompleteDataJobs){
                        if(this.tableCompleteDataJobs[i].status_code != "002" && this.tableCompleteDataJobs[i].status_code != "007"){
                            this.tableDataJobs.push(this.tableCompleteDataJobs[i])
                        }
                    }
                    
                    this.cantidadAsignada(data)
                })

                this.restarForm();
            },

            createJobs(){
                if(this.objInfoJobs.id==0)
                    this.objInfoJobs.workstation_id = this.selectedWorkStation.id_workplace
                else
                    this.objInfoJobs.new_workstation_id = this.selectedWorkStation.id_workplace

                    this.objInfoJobs.production_order_id = this.selectedOrderItem.order_id

                jobsProductionController(this.objInfoJobs,this.objInfoJobs.id == 0 ? "insert" : "update").then(data => {

                    if(data.status == 200){
                        this.tableCompleteDataJobs = data.data
                        
                        this.tableDataJobs = []
                        for(var i in this.tableCompleteDataJobs){
                            
                            if(this.tableCompleteDataJobs[i].status_code != "002" && this.tableCompleteDataJobs[i].status_code != "007"){
                                this.tableDataJobs.push(this.tableCompleteDataJobs[i])
                            }
                        }
                        this.cantidadAsignada(data)
                        this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                        
                    }else{
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }
                })
                this.restarForm();
            },

            updateJobs(){
                
                this.objInfoJobs.new_workstation_id = this.selectedWorkStation.id_workplace

                this.objInfoJobs.production_order_id = this.selectedOrderItem.order_id
                
                jobsProductionController(this.objInfoJobs,"update").then(data => {
                    if(data.status == 200){
                        this.tableCompleteDataJobs = data.data
                    
                        this.tableDataJobs = []
                        for(var i in this.tableCompleteDataJobs){
                            
                            if(this.tableCompleteDataJobs[i].status_code != "002" && this.tableCompleteDataJobs[i].status_code != "007"){
                                this.tableDataJobs.push(this.tableCompleteDataJobs[i])
                            }
                        }                    
                        this.cantidadAsignada(data)
                        this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Modificado con Éxito!")
                    }else{
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }                    
                })

                this.$refs.cancelarJob.close()
                this.restarForm();
            },

            getInfoJobsStatus(status){
                switch(status) {
                    case '002': //CERRADO
                        this.jobFinished = true
                        this.jobsActive = false
                        this.jobCanceled = false

                        this.tableDataJobs = []
                        for(var i in this.tableCompleteDataJobs){
                            if(this.tableCompleteDataJobs[i].status_code == "002"){
                                this.tableDataJobs.push(this.tableCompleteDataJobs[i])
                            }
                        }
                        
                        break;
                    case '007': //CANCELADO
                        this.jobFinished = false
                        this.jobsActive = false
                        this.jobCanceled = true

                        this.tableDataJobs = []
                        for(var i in this.tableCompleteDataJobs){
                            if(this.tableCompleteDataJobs[i].status_code == "007"){
                                this.tableDataJobs.push(this.tableCompleteDataJobs[i])
                            }
                        }

                        break;
                    default:
                        this.jobFinished = false
                        this.jobsActive = true
                        this.jobCanceled = false

                        this.tableDataJobs = []
                        for(var i in this.tableCompleteDataJobs){
                            if(this.tableCompleteDataJobs[i].status_code != "002" && this.tableCompleteDataJobs[i].status_code != "007"){
                                this.tableDataJobs.push(this.tableCompleteDataJobs[i])
                            }
                        }
                }
            },
        ///

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


            cantidadAsignada: function(data){
                 this.cantidadTotalAsignada = 0;

                    for(let i in data.data){
                        this.cantidadTotalAsignada += data.data[i].amount_programmed
                    }

                    this.cantidadTotalAsignada
            },

            data_change_jobs(item, action){
                if(action == "delete"){
                    this.$refs.cancelarJob.open()
                    this.objInfoJobs.production_order_id = this.selectedOrderItem.order_id
                    this.objInfoJobs.id = item.jobs_id
                    this.objInfoJobs.amount_programmed = 0
                    this.objInfoJobs.published = false
                    this.objInfoJobs.job_status_code = "007"

                } else if(action == "update") {

                    this.objInfoJobs.production_order_id = this.selectedOrderItem.order_id
                    this.objInfoJobs.id = item.jobs_id
                    this.objInfoJobs.amount_programmed = item.amount_programmed
                    this.objInfoJobs.published = item.published
                    this.objInfoJobs.job_status_code = item.status_code
                    this.objInfoJobs.workstation_id = 0,
                    this.objInfoJobs.new_workstation_id=0
                    
                    for(var i in this.workstation){
                        if(this.workstation[i].code == item.workstation_code){
                            this.selectedWorkStation = this.workstation[i]
                            this.workstation_id = this.selectedWorkStation.id_workplace
                            this.objInfoJobs.workstation_id = this.selectedWorkStation.id_workplace
                        }
                    }
                }
            },

            saveEditOrder(){
                orderProductionController({
                    id: this.selectedOrderItem.order_id,
                    amount: this.selectedOrderItem.programmed_amount,
                    deadline: this.selectedOrderItem.deadline,
                    published: this.selectedOrderItem.published
                    }, "update").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        this.itemSelected.published = this.selectedOrderItem.published
                        this.itemSelected.deadline = this.selectedOrderItem.deadline
                        this.itemSelected.programmed_amount = this.selectedOrderItem.programmed_amount
                        this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Modificado con Éxito!")
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
            },
    },
}
</script>

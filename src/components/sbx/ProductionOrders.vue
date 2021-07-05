<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Tambor de Producción - Activas</h4>
        <div class="w-100 text-right"></div>
<!-- TABLA ORDENES DE PRODUCCION -->
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
                    <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="addData"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-center">
                            <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="showDetailsProductionOrders"><i class="ion ion-md-information-circle-outline"></i></b-btn>
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="editProductionOrder(row.item)"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                    <template v-slot:cell(order_id)="row">
                        <div class="d-flex justify-content-between">
                                    <div>
                                        <span ><i v-if="row.item.is_global" class="ion ion-ios-globe"></i></span>
                                    </div>
                                    <div>
                                        {{row.item.order_id}}
                                    </div>
                                </div>
                    </template>
                    <template v-slot:cell(show)="row">
                        <div class="text-center">
                            <!-- <i class="ion ion-md-create"></i> -->
                        <span style="color:red" v-if="!row.item.show"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.show"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                    <template v-slot:cell(active)="row">
                        <div class="text-center">
                            <!-- <i class="ion ion-md-create"></i> -->
                            <span style="color:red" v-if="!row.item.active"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.active"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                    <template v-slot:cell(deadline)="row">
                        <div class="text-center">
                            {{customFormatter(row.item.deadline)}}
                            <!-- {{moment(row.item.deadline).toDate()}} -->
                        </div>
                    </template>
                </b-table>
                <b-row>
                    <b-col md="6" class="my-1">
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </b-col>
                </b-row>
            </div>
        </div>
<!-- TABLA ORDENES DE PRODUCCION -->

<!-- CONFIRMACION BORRADO DE REGISTRO -->
        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar Registro" ref="errorWithButtonAlert">
                ¿Está Seguro que Desea Borrar el Registro?
                <div class="w-100 text-center">
                    El registro será borrado de forma lógica, pero su información será visible en reportes. 
                </div>
                
                <template slot="button"><b-btn @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>
<!-- CONFIRMACION BORRADO DE REGISTRO -->


        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="md">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Ordenes de Producción</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>

            <div class="position-relative">
                <b-input-group>
                    <b-input-group-text slot="prepend" v-if="loading">
                        <i class="ion ion-md-sync"></i>
                    </b-input-group-text>
                    <b-input-group-text slot="prepend" v-if="!loading">
                        <i class="ion ion-ios-search"></i>
                    </b-input-group-text>
                    <input type="text" class="form-control"
                        placeholder="Seleccione un producto"
                        autocomplete="off"
                        v-model="value"
                        @keydown.down="down"
                        @keydown.up="up"
                        @keydown.enter="hit"
                        @keydown.esc="reset"
                        @blur="reset"
                        @input="updateQuery" />
                    <b-input-group-text slot="append" v-if="isDirty || value" @click="resetInput">
                        <i class="ion ion-md-close" ></i>
                    </b-input-group-text>
                </b-input-group>

                <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: false ? 'auto' : 0, right: false ? 0 : 'auto'}">
                    <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                        <span class="name" v-text="item.code"></span>
                        <span class="text-muted">{{ item.description }}</span>
                    </a>
                </div>

            </div>

            <b-input-group class="mt-2">
                <b-input-group-text slot="prepend">
                    <i class="fas fa-hashtag"></i>
                </b-input-group-text>
                <b-input placeholder="Cantidad a Producir" v-model="objInfo.amount" type="number" />
            </b-input-group>
                    
            <datepicker
                v-model="objInfo.deadline"
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

            <b-form-group class="mt-2">
                <multiselect                        
                    v-model="objInfo.selectedCentroTrabajo"
                    :options="workstation"
                    :disabled="objInfo.globalOrder" 
                    placeholder="Seleccione un Centro de Trabajo"
                    label="description"
                    track-by="description" />
            </b-form-group>
           
            <div class="mt-2">
                <div class="row">
                    <div class="col text-center">
                        <!-- <h3>Propiedades</h3> -->
                        <b-form-group class="text-left">
                            
                            <label class="switcher switcher-success">
                                <input type="checkbox" class="switcher-input" @change="checkGlobalOrder(objInfo.globalOrder)" v-model="objInfo.globalOrder">
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Orden Global</span>
                            </label>
                            <label class="switcher switcher-success">
                                <input type="checkbox" class="switcher-input" :disabled="!objInfo.globalOrder" v-model="objInfo.published">
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Publicar</span>
                            </label>
                        </b-form-group>
                    </div>
                </div>
            </div>
                    
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" @click="submit()">Guardar</b-btn>
            </div>
                <!-- </b-card> -->
        </b-modal>

        <b-modal id="modals-top" v-model="showDetails"  class="modal-center" size="lg">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Ordenes de Producción</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>

           <my-component ref="infoOrder"/>
                    
            <div slot="modal-footer" class="w-100 text-right">
                <!-- <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" @click="submit()">Guardar</b-btn> -->
            </div>
                <!-- </b-card> -->
        </b-modal>

        <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>

        <b-modal id="modals-top" v-model="showEditForm"  class="modal-center" size="lg">
            <div slot="modal-title">
                Modificar <span class="font-weight-light">Ordenes de Producción</span><br>
            </div>

            <perfect-scrollbar style="height: 500px; width:100%">
                <edit-order ref="editorder" style="width:98%"/>
            </perfect-scrollbar>

             <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="closeProductionOrder()">Cerrar</b-btn>
            </div>
        </b-modal>

    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
    import Vue from 'vue'
    import Axios from 'axios'
    import VueTypeahead from 'vue-typeahead'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";

    import { getInfoWorkstation, orderProductionController } from "@/vendor/sbx/sbx/production_order";

    import moment from 'moment'
    import Datepicker from 'vuejs-datepicker'
    import Multiselect from 'vue-multiselect'
    import componentxxx from './controls/Info_Orders'
    import EditOrder from './controls/Edit_Order'

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
    import {apiconnection} from '@/vendor/sbx/conn'
  
    Vue.use(Notifications)

    // Vue.prototype.$http = Axios


    function isRTL () {
    return document.documentElement.getAttribute('dir') === 'rtl' ||
            document.body.getAttribute('dir') === 'rtl'
    }

    export default {
        extends: VueTypeahead,
        name: 'ProductionOrdersActive',
        metaInfo: {
            title: 'Ordenes de Producción'
        },
        components: {
            PerfectScrollbar,
            Multiselect,
            Datepicker,
            VueMarkdown,
            SweetModal,
            SweetModalTab,
            'my-component': componentxxx,
            'edit-order': EditOrder
        },
        data: () => ({
            showEditForm:false,
            showDetails:false,
            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },

            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla


            showFormulario:false,

            variantSaveButton:"success",
            disabledcode:false,
            modified:false,
            tableData: [],     
            

            /// Columnas de las tablas
                columns: [
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'order_id', label:"Id Orden"},
                    {key:'code', label:"Código"},
                    {key:'description', label:"Descripción"},
                    {key:'programmed_amount', label:"Programado"},
                    {key:'quantity_produced', label:"Producido"},
                    {key:'pending_amount', label:"Pendiente"},
                    // {key:'centrotrabajo', label:"Centro Trabajo"},
                    {key:'deadline', label:"Comprometida"},
                    {key:'edit', label:"Editar"},
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD PRDUCTION ORDER
                workstation: [],

                objInfo: {
                    id:0,
                    selectedCentroTrabajo:{},
                    published:false,
                    globalOrder:false,
                    product: {},
                    amount:0,
                    deadline :null
                },
            ///

            value:'',
            src: apiconnection+'searchproduct/',
            limit: 10,
            minChars: 3,

            disabledDates: {
                to: new Date(Date.now() - 8640000) // Disable sunday
            },

            highlightedDates: {
                dates: [
                    moment().toDate()
                    // moment().add(1, 'd').toDate(),
                    // moment().add(2, 'd').toDate(),
                    // moment().add(3, 'd').toDate()
                ]
            },

        }),
        methods:{
        ///Funcion para reiniciar los datos de las ordenes
            restartInfo(){
               this.objInfo = {
                    id:0,
                    selectedCentroTrabajo:{},
                    published:false,
                    globalOrder:false,
                    product: {},
                    amount:0,
                    deadline :null
                }
            },
        ///Funcion para reiniciar los datos

        ///Funcion para cargar la ayuda del helper
             openHelp: function(){
                //  this.contentWiki = "# FFFF"
                ApiWikiHelp("workstation").then(data => {
                    this.contentWiki = data.data
                })
                .catch(data =>{
                    this.contentWiki = data.data
                })
                this.$refs.longModal.open()
            },
        ///Funcion para cargar la ayuda del helper

        ///Filtros Para las Tablas
            onFiltered (filteredItems) {
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
        ///Filtros Para las Tablas

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

        ///Adicionar un nuevo dato, cancelar el ingreso, cancelar el borrado de un dato
            addData:function(){
                this.restartInfo()
                getInfoWorkstation().then(data =>{
                    this.workstation = data.data
                })
                this.showFormulario=true
            },

            cancel: function(){
                this.restartInfo()
                this.showFormulario=false
            },

            closeDeleteRecord: function(){
                this.restartInfo()
                this.$refs.errorWithButtonAlert.close()
            },
        ///Adicionar un nuevo dato, cancelar el ingreso, cancelar el borrado de un dato

        ///Eventos CRUD Ordenes
            submit: function(){
                orderProductionController(this.objInfo, this.objInfo.id === 0 ? "insert" : "update").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        if(this.objInfo.id === 0)
                            this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                        else
                            this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                            
                        this.showData()
                        this.cancel()
                        
                    }
                })
                .catch(function (error) {
                    console.log(error.status)
                })
            },
            deleteRecord: function(){
                orderProductionController(this.objInfo, "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Eliminar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Eliminado","¡El Registro se ha Eliminado con Éxito!")
                        this.restartInfo()
                    }
                    this.dismissCountDown = this.dismissSecs
                    this.showData()
                })
                .catch(function (error) {
                    console.log(error.status)
                })
                
                this.$refs.errorWithButtonAlert.close()
            },
            showData: function(){
                orderProductionController([],"select").then(data => {
                    this.tableData = data.data
                    this.totalRows= this.tableData.length
                })
            },
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.variantSaveButton="warning"

                ////Informacion que será modificada o borrada
                //this.objInfo.id=row.workstation_group_id
                
                if(action === "edit")
                    this.showFormulario=true
                else
                    this.$refs.errorWithButtonAlert.open()
            },
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

        ///Espacio para metodos propios del control
            updateQuery () {
                this.query = this.value
                this.update()
            },
            onHit (item) {
                this.objInfo.product = item.id_product
                this.value = item.description
                this.reset()
            },
            resetInput () {
                this.value = ''
                this.reset()
            },
            customFormatter(date) {
                return moment(date).format('YYYY-MM-DD');
            },
            checkGlobalOrder(status){
                if(status){
                    this.objInfo.selectedCentroTrabajo = {}
                }else{
                    this.objInfo.published = false
                }
            },
        ///Espacio para metodos propios del control



            showDetailsProductionOrders(item){
                this.$refs.infoOrder.testAAAA()
                this.showDetails=true
            },

            editProductionOrder(item){
                this.$refs.editorder.editProductionOrder(item)
                this.showEditForm=true
            },

            closeProductionOrder(){
                this.showData()
                this.showEditForm = false
            }
        },
        created(){
            this.showData()
        },
    }
</script>

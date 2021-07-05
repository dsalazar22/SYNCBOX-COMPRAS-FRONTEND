<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Esquema de Particion  <span class="font-weight-light">Asociación de Cuentas</span></h4>
        <div class="w-100 text-right"></div>
        
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
                    <b-btn variant="outline-success icon-btn" class="btn-md" v-if="check_access('admin_um', 'c')" v-b-modal.modals-default @click.prevent="addData();objState={}"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="check_access('admin_um', 'c')" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn> -->
                        </div>
                    </template>
                </b-table>
                 <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div class="text-muted">
                        <small> Total Registros: {{this.totalRows}} </small>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                    El registro será borrado de forma lógica, pero su información será visible en reportes. 
                </div>
                
                <template slot="button"><b-btn v-if="check_access('admin_um', 'd')" @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="lg">
            <div slot="modal-title">
            Maestros <span class="font-weight-light">Esquema de Particion</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group :feedback="objState.message" label="Cuenta Secundaria">
                    <multiselect
                        v-model="itemCCC"
                        :options="itemsCCC"
                        placeholder="Cuenta Secundaria"
                        label="ssp"
                        track-by="ssp" />
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Cuentas Primarias">
                    <div class="row">
                        <div class="col">
                            <b-input placeholder="Desde" v-model.trim="objInfo.ppal_account_from" />
                        </div>
                        <div class="col">
                            <b-input placeholder="Hasta" v-model.trim="objInfo.ppal_account_to" />
                        </div>
                    </div>
                </b-form-group>
            </fieldset>
            <div class="text-right">
                <b-btn size='xs' class="mt-2" variant="info" v-if="check_access('admin_um', 'c')" @click="cancelScheme()">Cancelar</b-btn>
                <b-btn size='xs' class="mt-2" variant="success" v-if="check_access('admin_um', 'c')" @click="submit()">Guardar</b-btn>
            </div>
            <b-table small show-empty stacked="md" :items="dataScheme" :fields="columnsSheme" class="mt-2">
                <template v-slot:cell(edit)="row">
                    <div class="text-left">
                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="check_access('admin_um', 'c')" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                    </div>
                </template>
            </b-table>


            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="showFormulario=false">Cerrar</b-btn>
                <!-- <b-btn :variant="variantSaveButton" v-if="check_access('admin_um', 'c')" @click="submit()">Guardar</b-btn> -->
            </div>
        </b-modal>

        <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>

    </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { infocosts } from "@/components/i40/js/costs";
    import { infosysconfig } from "@/components/i40/js/sysconfig";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
    import Multiselect from 'vue-multiselect'

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import {infousers} from '@/components/i40/js/users'
    import moment from "moment";
    // Import this component
    import datePicker from "vue-bootstrap-datetimepicker";
    // Import date picker css
    import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
  
    Vue.use(Notifications)
    Vue.use(datePicker);

    export default {
        metaInfo: {
            title: 'Esquema de Particion'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab,
            Multiselect,
            // datePicker,
        },
        watch: {
            'itemCCC':function(value){
                this.showSchema(value)
            }
        },
        
        data: () => ({
            name: 'um',
            version: 'v1.0.0.0',

            itemCCC:{},
            itemsCCC:[],

            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },
            
            options: {
                format: "YYYY-MM-DD",
                //useCurrent: false
                // minDate:Date(),
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


            /**
            columns: [
                {key:'description', label:"Descripcion"},
                {key:'workstation_plant_id', label:"workstation_plant_id", thClass: 'd-none', tdClass: 'd-none'},
            ], 
             */

            /// Columnas de las tablas
                columns: [
                    {key:'code', label:"Codigo"},
                    {key:'description', label:"Descripción"},
                    // {key:'rounding', label:"Redondeo"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Editar/Eliminar"}
                ],
            /// Columnas de las tablas

            /// Columnas de las tablas
                dataScheme:[],
                columnsSheme: [
                    {key:'ppal_account_from', label:"Desde"},
                    {key:'ppal_account_to', label:"Hasta"},
                    {key:'edit', label:"Editar/Eliminar"}
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    partition_scheme_id:0, 
                    ppal_account_from:'', 
                    ppal_account_to:''
                },
                objState:{},
            ///

        }),
        methods:{
            check_access(control, action){
            return infousers.check_access(control,action)
            },
        ///Funcion para reiniciar los datos
            restartInfo(){
                this.itemCCC=null
                this.objInfo = {
                    partition_scheme_id:0,
                    ppal_account_from:'', 
                    ppal_account_to:''
                }
            },
        ///Funcion para reiniciar los datos

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

        ///Eventos CRUD
            submit: function(){
                if(this.validate_content()){
                    this.objInfo.puc_id = this.itemCCC.puc_id

                    infocosts.esquemaparticion(this.objInfo, this.objInfo.partition_scheme_id === 0 ? "insert" : "update").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        if(this.objInfo.partition_scheme_id === 0)
                            this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
                        else
                            this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                        
                        this.showSchema(this.itemCCC)
                        
                        this.objInfo = {
                            partition_scheme_id:0,
                            ppal_account_from:'', 
                            ppal_account_to:''
                        }
                        this.showData()
                    }
                }).catch(function (error) {
                    console.log(error.status)
                })}else{
                    this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
                }
            },
            deleteRecord: function(){
                infocosts.esquemaparticion(this.objInfo, "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Eliminar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Eliminado","¡El Registro se ha Eliminado con Éxito!")
                        // this.restartInfo()
                        this.showSchema(this.itemCCC)
                            
                        this.objInfo = {
                            partition_scheme_id:0,
                            ppal_account_from:'', 
                            ppal_account_to:''
                        }
                        this.showData()
                    }
                    this.dismissCountDown = this.dismissSecs
                })
                .catch(function (error) {
                    console.log(error.status)
                })
                
                this.$refs.errorWithButtonAlert.close()
            },
            showData: function(){
                this.tableData = []
                this.totalRows = 0
                infocosts.esquemaparticion([],"select").then(data => {
                    if(data.data != ''){
                        this.tableData = data.data
                        this.totalRows= this.tableData.length
                    }
                })
            },
            showSchema(value){
                this.dataScheme = []
                if(value != {} && value != null ){
                    infocosts.esquemaparticion(value.puc_id,"select_scheme").then(data => {
                        if(data.data != ''){
                            this.dataScheme = data.data
                        }
                    })
                }
            },

            cancelScheme(){
                this.objInfo = {
                    partition_scheme_id:0,
                    ppal_account_from:'', 
                    ppal_account_to:''
                }
            },
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.variantSaveButton="warning"

                ////Informacion que será modificada o borrada
                this.objInfo=row
                
                if(action === "edit"){
                    this.showFormulario=true

                    for (let index = 0; index < this.itemsCCC.length; index++) {
                        const element = this.itemsCCC[index];
                        if (element.puc_id == row.puc_id) {
                            this.itemCCC = element
                        }    
                    }

                    for (let index = 0; index < this.itemsPC.length; index++) {
                        const element = this.itemsPC[index];
                        if (element.code == row.um) {
                            this.itemPC = element
                        }    
                    }
                }
                else
                    this.$refs.errorWithButtonAlert.open()
            },
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
             validate_content(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este es un Campo Obligatorio'

                if (this.objInfo.code == ''){
                    this.objState.code = 'invalid'
                    isOK = false;
                }else{
                    this.objState.code = 'valid'
                }
                if (this.objInfo.description == ''){
                     this.objState.description = 'invalid'
                     isOK = false;
                }else{
                    this.objState.description = 'valid'
                }
                return isOK
            },

        ///Espacio para metodos propios del control
        ///Espacio para metodos propios del control
        
        },
        created(){
            this.showData()

            infocosts.puc([],"select").then(data => {
                if(data.data != ''){
                    let array = data.data
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];
                        if (!element.t_account) {
                            element.ssp = element.code + ' ' + element.description
                            this.itemsCCC.push(element)
                        }    
                    }
                }
            })
        },
    }
</script>

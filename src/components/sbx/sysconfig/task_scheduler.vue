<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Tareas Programadas</h4>
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
                    <b-btn variant="outline-warning icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="addData();objState={}"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                    
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-warning borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                            <b-btn variant="outline-info borderless icon-btn" v-if="row.item.status == 'available'" class="btn-xs" @click.prevent="data_change(row.item,'lock')"><i class="fas fa-pause"></i></b-btn>
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="row.item.status == 'stopped'" @click.prevent="data_change(row.item,'unlock')"><i class="fas fa-play"></i></b-btn>
                        </div>
                    </template>
                    <template v-slot:cell(frecuency)="row">
                        <!-- <div class="text-left"> -->
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{row.item.frecuency}} ({{row.item.unity_frecuency_code}})
                        <!-- <span style="color:red" v-if="!row.item.show"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.show"><i class="ion ion-md-add-circle"></i></span> -->
                        <!-- </div> -->
                    </template>
                    <template v-slot:cell(last_execution)="row">
                            {{format_date(row.item.last_execution)}}
                    </template>
                    <template v-slot:cell(next_execution)="row">
                            {{format_date(row.item.next_execution)}}
                    </template>
                    <template v-slot:cell(service_name)="row">
                        <!-- <div class="text-left"> -->
                            <!-- <i class="ion ion-md-create"></i> -->
                            <b-badge :variant="row.item.is_running == 'true' ? 'warning' : 'success'" class="badge-dot" />
                            {{row.item.service_name}}
                        <!-- <span style="color:red" v-if="!row.item.show"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.show"><i class="ion ion-md-add-circle"></i></span> -->
                        <!-- </div> -->
                    </template>
                    <template v-slot:cell(active)="row">
                        <div class="text-left">
                            <!-- <i class="ion ion-md-create"></i> -->
                            <span style="color:red" v-if="!row.item.active"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.active"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                </b-table>
                 <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div class="text-muted">
                        <small> Total Tareas programadas: {{this.totalRows}} </small>
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
                
                <template slot="button"><b-btn @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="md">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Tareas Programadas</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group :feedback="objState.message" label="Codigo">
                    <b-input placeholder="Código" v-model.trim="objInfo.service_name" :state="objState.service_name" v-on:input="objState.service_name = 'valid'; objState.service_name= objInfo.service_name==''?'invalid':'valid'"/>
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Descripción">
                    <b-input placeholder="Descripción" v-model.trim="objInfo.description" :state="objState.description" v-on:input="objState.description = 'valid'; objState.description= objInfo.description==''?'invalid':'valid'"/>
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Comando">
                    <b-input placeholder="Comando" v-model.trim="objInfo.command" :state="objState.command" v-on:input="objState.command = 'valid'; objState.command= objInfo.command==''?'invalid':'valid'"/>
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Frecuencia">
                    <b-input type="number" placeholder="Frecuencia" v-model.trim="objInfo.frecuency_value" :state="objState.frecuency" v-on:input="objState.frecuency = 'valid'; objState.frecuency= objInfo.frecuency==''?'invalid':'valid'"/>
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Unidad de Medida de Tiempo">
                    <b-form-select :options="[
                    { value: null, text: 'Please select an option' },
                    { value: 'millisecond', text: 'Milisegundos' },
                    { value: 'second', text: 'Segundos' },
                    { value: 'minute', text: 'Minutos' },
                    { value: 'hour', text: 'Horas' },
                    { value: 'day', text: 'Días' }]" v-model="objInfo.unity_frecuency_code" />
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Siguiente Ejecución">
                    <!-- <b-input placeholder="Fecha Inicio" v-model.trim="objInfo.next_execution" :state="objState.next_execution" v-on:input="objState.next_execution = 'valid'; objState.next_execution= objInfo.next_execution==''?'invalid':'valid'"/> -->
                    <date-picker v-model="objInfo.next_execution" :config="options"></date-picker>
                </b-form-group>
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" @click="submit()">Guardar</b-btn>
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

<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { infoservices } from "@/components/i40/js/services";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
    import moment from 'moment'
    import datePicker from 'vue-bootstrap-datetimepicker';
    import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
  
    Vue.use(Notifications)

    export default {
    
        metaInfo: {
            title: 'Tareas Programadas'
        },
        components: {
            VueMarkdown,
            SweetModal,
            datePicker,
            SweetModalTab
        },
        data: () => ({
            name: 'task_scheduler',
            version: 'v1.0.0.0',

             options: {
                format: "YYYY-MM-DD HH:mm:ss",
                // useCurrent: false
                // minDate:Date(),
            },

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


            /**
            columns: [
                {key:'description', label:"Descripcion"},
                {key:'workstation_plant_id', label:"workstation_plant_id", thClass: 'd-none', tdClass: 'd-none'},
            ], 
             */

            /// Columnas de las tablas
                columns: [
                    {key:'service_name', label:"Código"},
                    {key:'description', label:"Descripción"},
                    // {key:'command', label:"Comando"},
                    {key:'frecuency', label:"Frecuencia"},
                    {key:'last_execution', label:"Última Ejecución"},
                    {key:'next_execution', label:"Siguiente Ejecución"},
                    {key:'last_elapsed_time', label:"Duración (ms)"},
                    {key:'edit', label:"Edit"}
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    
                },
                objState:{},
            ///

        }),
        methods:{
            format_date(param){
                return moment(param).format('YYYY-MM-DD hh:mm:ss')
            },

            date_millisecond(value){
                return moment(value/1000000).format('YYYY-MM-DD hh:mm:ss')
            },
        ///Funcion para reiniciar los datos
            restartInfo(){
                 this.objInfo= {}
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
                    this.objInfo.frecuency = parseInt(this.objInfo.frecuency_value)
                    infoservices.services(this.objInfo, "insert").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                        }else{
                            this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
                            this.showData()
                            this.cancel()
                        }
                    })
                    .catch(function (error) {
                        console.log(error.status)
                    })
                    }else{
                    this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
                }
            },
            deleteRecord: function(){
                infoservices.services(this.objInfo, "delete").then(data => {
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
                infoservices.services([],"select").then(data => {
                    // console.log(data.data)
                    this.tableData = data.data
                    this.totalRows= this.tableData.length
                })
            },
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.variantSaveButton="warning"

                ////Informacion que será modificada o borrada
                this.objInfo=row
                
                if(action === "edit"){
                    this.showFormulario=true
                    this.objInfo.service_name = row.service_name
                    this.objInfo.frecuency_value = row.frecuency
                }
                else if(action == "delete"){
                    this.$refs.errorWithButtonAlert.open()
                }else{
                    infoservices.services(this.objInfo, action).then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error durante la transacción!")
                        }else{
                            this.showCustom('bg-warning text-dark', "Acción","¡La acción se ha ejecutado con éxito!")
                            this.showData()
                        }
                    })
                    .catch(function (error) {
                        console.log(error.status)
                    })
                }
            },
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
             validate_content(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este es un Campo Obligatorio'

                if (this.objInfo.service_name == ''){
                    this.objState.service_name = 'invalid'
                    isOK = false;
                }else{
                    this.objState.service_name = 'valid'
                }
                if (this.objInfo.description == ''){
                     this.objState.description = 'invalid'
                     isOK = false;
                }else{
                    this.objState.description = 'valid'
                }
                if (this.objInfo.command == ''){
                     this.objState.command = 'invalid'
                     isOK = false;
                }else{
                    this.objState.command = 'valid'
                }
                return isOK
            },

        ///Espacio para metodos propios del control
        ///Espacio para metodos propios del control
        
        },
        created(){
            // this.showData()
            this.$options.interval = setInterval(this.showData, 500)
        },
        beforeDestroy () {
            clearInterval(this.$options.interval)
        }


    }
</script>
<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Configuración de Turnos</h4>
        <div class="w-100 text-right"></div>
        
        <div class="row">
            <div class="col">
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="check_access('admin_documents_types', 'c')" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                        </div>
                    </template>
                </b-table>
            </div>
        </div>

        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="md">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Tipos de Documentos</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                 <b-form-group label="Módulo" horizontal :feedback="objState.module" >
                    <b-select v-model="objInfo.module" :options="arrModulo" />
                     </b-form-group>
                <b-form-group :feedback="objState.message" label="Código" horizontal>
                    <b-input placeholder="Código" :disabled="!edit_code" v-model.trim="objInfo.code" :state="objState.code" v-on:input="objState.code = 'valid'; objState.code= objInfo.code==''?'invalid':'valid'"/>
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Descripción" horizontal>
                    <b-input placeholder="Descripción" v-model.trim="objInfo.description" :state="objState.description" v-on:input="objState.description = 'valid'; objState.description= objInfo.description==''?'invalid':'valid'"/>
                </b-form-group>
                <b-form-group class="text-right">
                    <label class="switcher switcher-success mt-2">
                        <input type="checkbox" class="switcher-input" v-model="objInfo.is_active">
                        <span class="switcher-indicator">
                        <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                        <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                        </span>
                        <span class="switcher-label">Activo</span>
                    </label>
                </b-form-group>
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" v-if="check_access('admin_documents_types', 'c')" @click="submit()">Guardar</b-btn>
            </div>
        </b-modal>

        <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>

    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import Multiselect from 'vue-multiselect'
    import { infosysconfig } from "@/components/i40/js/sysconfig";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import {infousers} from '@/components/i40/js/users'
  
    Vue.use(Notifications)

    export default {
    
        metaInfo: {
            title: 'Tipos de Documentos'
        },
        components: {
            VueMarkdown,
            SweetModal,
            Multiselect,
            SweetModalTab
        },
        computed: {
            
        },
        data: () => ({
            name: 'ducuments_types',
            version: 'v1.0.0.0',

            contentWiki: "",
            tablemodule: [],
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

            edit_code: true,
            showFormulario:false,

            variantSaveButton:"success",
            disabledcode:false,
            modified:false,
            tableData: [],       
            
            arrModulo:[{ value: 1, text: 'Pedidos Comerciales' }, { value: 2, text: 'Ordenes de Producción' }],


            /**
            columns: [
                {key:'description', label:"Descripcion"},
                {key:'workstation_plant_id', label:"workstation_plant_id", thClass: 'd-none', tdClass: 'd-none'},
            ], 
             */

            /// Columnas de las tablas
                columns: [
                    {key:'turn_id', label:"Turno"},
                    {key:'start', label:"Inicio"},
                    {key:'finish', label:"Fin"},
                    {key:'edit', label:"Editar"}, 
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                selected_code:"",
                objInfo: {},
                objState:{},
            ///

        }),
        methods:{
            check_access(control, action){
                return infousers.check_access(control,action)
                },
                    getModule(param1){
                    let result=""
                    for(let i= 0;i < this.arrModulo.length; i++){
                        let element = this.arrModulo[i]
                        if(element.value == param1)
                            result = element.text
                    }

                    return result
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
                this.selected_code=""
                this.variantSaveButton= success
            },

            cancel: function(){
                this.restartInfo()
                this.showFormulario=false
                this.selected_code=""
            },

            closeDeleteRecord: function(){
                this.restartInfo()
                this.selected_code=""
                this.$refs.errorWithButtonAlert.close()
            },
        ///Adicionar un nuevo dato, cancelar el ingreso, cancelar el borrado de un dato

        ///Eventos CRUD
            submit: function(){
                if(this.validate_content()){
                    infosysconfig.ctrlturns(this.objInfo, this.selected_code === "" ? "insert" : "update").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        if(this.selected_code === "")
                            this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
                        else
                            this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
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
            showData: function(){
                infosysconfig.ctrlturns([],"select").then(data => {
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
                this.selected_code = this.objInfo.code
                
                if(action === "edit"){
                    this.showFormulario=true
                    this.objInfo.code = row.code
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
        },
    }
</script>
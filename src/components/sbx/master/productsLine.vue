<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">{{$route.params.module == "prd" ? "Línea de Productos" : "Grupos de Partes"}}</h4>
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
                    <b-btn variant="outline-success icon-btn" class="btn-md" v-if="check_access('products_fammily', 'c')" v-b-modal.modals-default @click.prevent="addData"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="check_access('products_fammily', 'w')" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" v-if="check_access('products_fammily', 'd')" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                    <template v-slot:cell(show)="row">
                        <div class="text-left">
                            <!-- <i class="ion ion-md-create"></i> -->
                        <span style="color:red" v-if="!row.item.show"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.show"><i class="ion ion-md-add-circle"></i></span>
                        </div>
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
                   <small> Total Lineas de Productos: {{this.totalRows}} </small>
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
                
                <template slot="button"><b-btn v-if="check_access('products_fammily', 'd')" @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="md">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">{{$route.params.module == "prd" ? "Lineas de Productos" : "Grupos de Partes"}}</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group label="Código" :feedback="objState.message">
                    <b-input placeholder="Código" :disabled="disabledcode" v-model.trim="objInfo.code" />
                </b-form-group>
                <b-form-group label="Descripción" :feedback="objState.message">
                    <b-input placeholder="Descripción" :disabled="disabledcode" v-model.trim="objInfo.description" />
                </b-form-group>
                <div>
                    <div class="row">
                        <div class="col text-center">
                            <!-- <h3>Propiedades</h3> -->
                            <b-form-group class="text-left">
                                <label class="switcher switcher-success mt-2">
                                    <input type="checkbox" class="switcher-input" v-model="objInfo.active">
                                    <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                    </span>
                                    <span class="switcher-label">Activa</span>
                                </label>
                            </b-form-group>
                        </div>
                    </div>
                </div>
                    
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" @click="submit()">Guardar</b-btn>
            </div>
                <!-- </b-card> -->
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
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
    import { infomaster } from '@/components/i40/js/master'

    import Notifications from 'vue-notification'
    import {infousers} from '@/components/i40/js/users'
    import VueMarkdown from 'vue-markdown'
  
    Vue.use(Notifications)

    export default {
        
        metaInfo: {
            title: 'Lineas de Productos'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab
        },
        watch: {
            '$route.params.module':function(value){
                this.selectedModule = value
                this.showData()
            }
        },
        data: () => ({
            name: 'groups',
            version: 'v1.0.0.0',

            titulo: "Lineas de Productos",
            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },

            selectedModule:'',

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
                     {key:'code', label:"Código"},
                     {key:'description', label:"Descripción"},
                     {key:'active', label:"Activa"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Edit"}
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    lines_id:0,
                    code: "",
                    description: "",
                    
                },
            ///

            objState:{}

        }),
        methods:{
            check_access(control, action){
            return infousers.check_access(control,action)
},
        ///Funcion para reiniciar los datos
            restartInfo(){
                this.objInfo = { 
                    lines_id:0,
                    code: "",
                    description: "",
                    buffer: 0,
                    active:true
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
                this.showData()
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
                    this.objInfo.module = this.selectedModule 
                infomaster.lines(this.objInfo, this.objInfo.lines_id === 0 ? "insert" : "update").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        if(this.objInfo.lines_id === 0)
                            this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                        else
                            this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                        this.showData()
                        this.cancel()
                        
                    }
                    }).catch(function (error) {
                        console.log(error.status)
                    })
                    }else{
                    this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
                }
            },
            deleteRecord: function(){
                infomaster.lines(this.objInfo, "delete").then(data => {
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
                infomaster.lines(this.selectedModule,"select","").then(data => {
                    if(data.data != ""){
                        this.tableData = data.data
                        this.totalRows= this.tableData.length
                    }else{
                        this.tableData = []
                        this.totalRows= 0
                    }
                })
            },
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.variantSaveButton="warning"

                ////Informacion que será modificada o borrada
                this.objInfo = row
                
                if(action === "edit")
                    this.showFormulario=true
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
                if (this.objInfo.buffer == 0 ){
                     this.objState.buffer = 'invalid'
                     isOK = false;
                }else{
                    this.objState.buffer = 'valid'
            
                return isOK
                }
        ///Espacio para metodos propios del control
        ///Espacio para metodos propios del control
        
        }
    },
        created(){
            this.selectedModule = this.$route.params.module    
            this.showData()
        },
}
   
</script>


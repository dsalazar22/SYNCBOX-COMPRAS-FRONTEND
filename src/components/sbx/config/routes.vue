<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-2">Rutas de Productos</h4>
        <div class="w-100 text-right"></div>
        
        <div class="row">
            <div class="col">
                <b-row>
                    <b-col md="5" class="my-1">
                        <!-- <b-form-group horizontal label="Filtrar" class="mb-0"> -->
                        <b-input-group>
                            <b-form-input v-model="filter" placeholder="Buscar..." />
                            <b-input-group-append>
                            <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                            </b-input-group-append>
                        </b-input-group>
                        <!-- </b-form-group> -->
                    </b-col>
                    <b-col md="5" class="my-1">
                        <b-form-select :options="pageOptions" v-model="perPage" />
                    </b-col>
                    <b-col md="2" class="d-flex justify-content-center my-1">
                                <b-btn variant="outline-success icon-btn" class="btn-md" v-if="check_access('products_route', 'c')"  v-b-modal.modals-default  to="routes/details"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                                <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                    </b-col>
                </b-row>
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-center">
                            <b-btn variant="outline-success borderless icon-btn" v-if="check_access('products_route', 'w')" class="btn-xs" :to="{path:`routes/details/${row.item.route_id}/${row.item.route_product_id}/${row.item.product_id}`}"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" v-if="check_access('products_route', 'd')" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                </b-table>
                <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div class="text-muted">
                        <small> Total Rutas de Productos: {{this.totalRows}} </small>
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
            Administrar <span class="font-weight-light">Grupos de Centros de Trabajo</span><br>
            <small :class="infostatus">El código del centro de trabajo, enlaza el equipo que esta siendo monitoreado desde el PLC.</small>
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group>
                    <b-input placeholder="Descripción" :disabled="disabledcode" v-model.trim="objInfo.description" />
                </b-form-group>
                <div>
                    <div class="row">
                        <div class="col text-center">
                            <!-- <h3>Propiedades</h3> -->
                            <b-form-group class="text-left">
                                <label class="switcher switcher-success">
                                    <input type="checkbox" class="switcher-input" :disabled="!objInfo.active" v-model="objInfo.show">
                                    <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                    </span>
                                    <span class="switcher-label">Publica</span>
                                </label>
                                <label class="switcher switcher-success mt-2">
                                    <input type="checkbox" class="switcher-input" @change="checkActive(objInfo.active)" v-model="objInfo.active">
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
    import { infoconfig } from "@/components/i40/js/config";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
    import {infousers} from '@/components/i40/js/users'
    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
  
    Vue.use(Notifications)

    export default {

        metaInfo: {
            title: 'Rutas de Productos'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab
        },
        data: () => ({
            name: 'routes',
            version:'v1.0.0.0',

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
                    {key:'product_code', label:"Código"},
                    {key:'product_description', label:"Producto"},
                    {key:'description', label:"Ruta"},
                    // {key:'template', label:"Plantilla"},
                    {key:'version', label:"Version"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Edit"}
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    id:0,
                    
                },
            ///

        }),
        methods:{
        ///Funcion para reiniciar los datos
            restartInfo(){
                this.objInfo = { 
                    id:0,
                    
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
        
            deleteRecord: function(){
                infoconfig.routes(this.objInfo, "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","Error al Eliminar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Eliminado","El Registro se ha Eliminado con Éxito!")
                        this.tableData = data.data
                        this.totalRows= this.tableData.length
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
                infoconfig.routes([],"0","select-template").then(data => {
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
                
                if(action === "edit")
                    this.showFormulario=true
                else
                    this.$refs.errorWithButtonAlert.open()
            },
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

        ///Espacio para metodos propios del control
        ///Espacio para metodos propios del control

        check_access(control, action){
            return infousers.check_access(control,action)
        }
        
        },
        created(){
            this.showData()
        },
    }
</script>

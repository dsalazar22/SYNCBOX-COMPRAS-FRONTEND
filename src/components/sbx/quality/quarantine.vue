<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Cuarentena</h4>
        <div class="w-100 text-right"></div>


            <div v-if="showEditForm">

                <div class="row">
                    <div class="col-sm-12 col-md-5">
                        <b-card header="Reportar Cuarentena" header-tag="h6" class="mb-4" >
                            <b-form>
                                <b-form-row>
                                    <b-form-group class="col-md-12" label="Producción Acumulada" :feedback="objState.message">
                                        <b-input  placeholder="Producción Acumulada" v-model="objInfo.produced_amount" :state="objState.produced_amount" v-on:input="objState.produced_amount = 'valid'; objState.produced_amount= objInfo.produced_amount==''?'invalid':'valid'"/>
                                    </b-form-group>
                                </b-form-row>
                                <b-form-row>
                                    <b-form-group class="col-md-12" label="Cantidad en Cuarentena" :feedback="objState.message">
                                        <b-input  placeholder="Cantidad en Cuarentena" v-model="objInfo.quantity_quarantine" :state="objState.quantity_quarantine" v-on:input="objState.quantity_quarantine = 'valid'; objState.quantity_quarantine= objInfo.quantity_quarantine==''?'invalid':'valid'"/>
                                    </b-form-group>
                                </b-form-row>
                                <b-form-row>
                                    <b-form-group class="col-md-12" label="Cantidad" :feedback="objState.message">        
                                        <b-input type="number" step="0.1"  placeholder="Cantidad" v-model="objInfo.quantity" :state="objState.quantity" v-on:input="objState.quantity = 'valid'; objState.quantity= objInfo.quantity==''?'invalid':'valid'"/>
                                    </b-form-group>
                                </b-form-row>
                                <b-form-row>
                                        <b-form-group class="col-md-12" label="Razón Defecto" v-if="objState.defect_reason">
                                            <multiselect
                                                v-model="objInfo.defect_reason"
                                                label="description"
                                                track-by="description"
                                                placeholder="Seleccione una razón"
                                                :options="tabledefect_reason"
                                                :multiple="true"
                                                :searchable="true"
                                                :internal-search="false"
                                                :clear-on-select="false"
                                                :close-on-select="false"
                                                :hide-selected="true"
                                            />
                                        </b-form-group>
                                    </b-form-row>
                                <b-form-row>
                                    <b-form-group class="col-md-12" label="Comentario" >
                                    <b-textarea rows="10" max-rows="10"  v-model="objInfo.comment"/>
                                    </b-form-group>
                                </b-form-row>
                                <div class="text-right">
                                    <b-btn variant="warning" @click="showEditForm=false">Reportar</b-btn>
                                    <b-btn variant="danger" @click="submit()">Dar de Baja</b-btn>
                                    <b-btn variant="success" @click="submit()">Derogar</b-btn>
                                </div>                
                                
                            </b-form>
                        </b-card>
                    </div>
                    <div class="col-xs-12 col-md-7">
                        <b-table>
                        
                        </b-table>
                    </div>
                    </div>
                <div class="w-100 text-right">
                         
                <b-btn variant="primary" @click="showEditForm=false">Cancelar</b-btn>
            </div>
            </div>

        
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
                    <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="showEditForm=true"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
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
                        <small> Total Cuarentena: {{this.totalRows}} </small>
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


       
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            <b-row>

        <sweet-modal ref="longModal">
            <div class="text-left">
            <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>
             </b-row>

             </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import Multiselect from 'vue-multiselect'
    import { infosysconfig } from "@/components/i40/js/sysconfig";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
    import { infoconfig } from "@/components/i40/js/config";
    import { infomaster } from "@/components/i40/js/master";

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
  
    Vue.use(Notifications)

    export default {
    
        metaInfo: {
            title: 'Cuarentena'
        },
        components: {
            VueMarkdown,
            Multiselect,
            SweetModal,
            infomaster,
            infoconfig,
            SweetModalTab
        },
        data: () => ({
            name: 'quarantine',
            version: 'v1.0.0.0',
            showEditForm: false,
            tabledefect_reason:[],

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
                    {key:'buffer', label:"Buffer"},
                    {key:'workstation', label:"Centro de trabajo"},
                    {key:'scheduled_order', label:"# Orden"},
                    {key:'code', label:"Código"},
                    {key:'description', label:"Descripción"},
                    {key:'quantity_quarantine', label:"Cantidad Cuarentena"},
                    {key:'amount_report', label:"Cantidad Reportada"},
                    {key:'amount_pending', label:"Cantidad Pendiente"},
                    {key:'quantity_produced', label:"Cantidad Producida"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
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
        ///Funcion para reiniciar los datos
            restartInfo(){
                 this.objInfo= {
                    code_id:"",
                    produced_amount:"",
                    amount_report:"", 
                    amount_pending:"",
                    buffer:"",
                    defect_reason:"",
                    workstation:"",
                    quantity_quarantine:"",
                    user:"",
                    data:"",
                    quantity_produced:"",
                    scheduled_order:"",
                    description:"", 
                    quantity:"",
                    decimal_quantity:0,
                    
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
                    infosysconfig.um(this.objInfo, this.objInfo.code_id === "" ? "insert" : "update").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                        }else{
                            if(this.objInfo.code_id === "")
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
            deleteRecord: function(){
                infosysconfig.um(this.objInfo, "delete").then(data => {
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
                infosysconfig.um([],"select").then(data => {
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
                    this.objInfo.code_id = row.code
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
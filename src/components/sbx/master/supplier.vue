<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Proveedores</h4>
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
                    <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default  @click.prevent="addData(); objState={}"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <!-- {{props.item}} -->
                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="check_access('general_providers', 'c')"  @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
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
                </b-table>
                 <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div class="text-muted">
                   <small> Total Proveedores: {{this.totalRows}} </small>
                    </div>
                    </div>
            </div>
        </div>

        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
                ??Est?? seguro que desea borrar el registro?
                <div class="w-100 text-center">
                    El registro ser?? borrado de forma l??gica, pero su informaci??n ser?? visible en reportes. 
                </div>
                
                <template slot="button"><b-btn v-if="check_access('general_providers', 'd')"  @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="md">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Proveedores</span><br>
            <!-- <small :class="infostatus">El c??digo del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electr??nicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group label="NIT" :feedback="objState.message" >
                    <b-input placeholder="NIT" v-model.trim="objInfo.nit" :state="objState.nit!=''" v-on:input="objState.nit = 'valid'; objState.nit= objInfo.nit==''?'invalid':'valid'"/>
                </b-form-group>
                <b-form-group label="Nombre" :feedback="objState.message" >
                    <b-input placeholder="Nombre" v-model.trim="objInfo.name" :state="objState.name!=''" v-on:input="objState.name = 'valid'; objState.name= objInfo.name==''?'invalid':'valid'"/>
                </b-form-group>
                <b-form-group label="Tel??fono" :feedback="objState.message" >
                    <b-input placeholder="Tel??fono" v-model.trim="objInfo.phone"/>
                </b-form-group>
                <b-form-group label="Direcci??n" :feedback="objState.message" >
                    <b-input placeholder="Direcci??n" v-model.trim="objInfo.address" />
                </b-form-group>
                <b-form-group label="Correo Electr??nico" :feedback="objState.message" >
                    <b-input placeholder="Correo Electr??nico" v-model.trim="objInfo.email" />
                </b-form-group>
                <b-form-group label="Web Site" :feedback="objState.message" >
                    <b-input placeholder="Web Site" v-model.trim="objInfo.website" />
                </b-form-group>
                <b-form-group label="Contacto Principal" :feedback="objState.message" >
                    <b-input placeholder="Contacto Principal" v-model.trim="objInfo.principal_contact" />
                </b-form-group>
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" v-if="check_access('general_providers', 'c')" @click="submit()">Guardar</b-btn>
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
    import { infomaster } from "@/components/i40/js/master";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import {infousers} from '@/components/i40/js/users'
  
    Vue.use(Notifications)

    export default {
    
        metaInfo: {
            title: 'Proveedores'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab
        },
        data: () => ({
            name: 'supplier',
            version: 'v1.0.0.0',

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
                    {key:'nit', label:"NIT"},
                    {key:'name', label:"Nombre"},
                    {key:'phone', label:"Tel??fono"},
                    {key:'address', label:"Direcci??n"},
                  
                    {key:'principal_contact', label:"Contacto"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Edit"}
                ],
            /// Columnas de las tablas

            /// Objeto que ser?? enviado en las operacion CRUD
                objInfo: {
                    supplier_id:0,
                    nit: '',
                    name: '',
                    phone: '',
                    address: '',
                    doc_type:null,
                    email:'',
                    website: '',
                    principal_contact: '',
                },
            ///
                objState:{},
        }),
        methods:{
            check_access(control, action){
            return infousers.check_access(control,action)
            },
        ///Funcion para reiniciar los datos
            restartInfo(){
                 this.objInfo= {
                    supplier_id:0,
                    nit: '',
                    name: '',
                    phone: '',
                    address: '',
                    doc_type:null,
                    email:'',
                    website: '',
                    principal_contact: '',
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
                    
                    infomaster.supplier(this.objInfo, "0", this.objInfo.supplier_id === 0 ? "insert" : "update").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","??Error Guardando el Registro!")
                        }else{
                            if(this.objInfo.supplier_id === 0)
                                this.showCustom('bg-success text-white', "Guardar Registro","??El registro se ha Guardado con ??xito!")
                            else
                                this.showCustom('bg-warning text-white', "Modificar Registro","??El registro se ha Modificado con ??xito!")
                            this.showData()
                            this.cancel()
                        }
                    })
                    .catch(function (error) {
                        console.log(error.status)
                    })
                    }else{
                    this.showCustom('bg-danger text-white', "Error","??La Informaci??n esta Incompleta, Por Favor Valide!")
                }
            },
            deleteRecord: function(){
                infomaster.supplier(this.objInfo, "0", "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","??Error al Eliminar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Eliminado","??El Registro se ha Eliminado con ??xito!")
                        this.restartInfo()
                    }
                    this.dismissCountDown = this.dismissSecs
                    this.showData()
                })
                .catch(function (error) {
                    this.showCustom('bg-danger text-white', "Error",error)
                    console.log(error.status)
                })
                
                this.$refs.errorWithButtonAlert.close()
            },
            showData: function(){
                infomaster.supplier([], "0","select").then(data => {
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

                ////Informacion que ser?? modificada o borrada
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

                if (this.objInfo.nit == ''){
                    this.objState.nit = 'invalid'
                    isOK = false;
                }else{
                    this.objState.nit = 'valid'
                }
                if (this.objInfo.name == ''){
                     this.objState.name = 'invalid'
                     isOK = false;
                }else{
                    this.objState.name = 'valid'
                }

                // if (this.objInfo.doc_type == '' || this.objInfo.doc_type == null){
                //      this.objState.doc_type = 'invalid'
                //      isOK = false;
                // }else{
                //     this.objState.doc_type = 'valid'
                // }
                

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

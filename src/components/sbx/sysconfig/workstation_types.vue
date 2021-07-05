<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Tipos Centros de Trabajo</h4>
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
                    <b-btn variant="outline-success icon-btn" class="btn-md" v-if="check_access('admin_workstation_type', 'c')" v-b-modal.modals-default @click.prevent="addData(); variantSaveButton='success'; objState={}"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->

                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div>
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="check_access('admin_workstation_type', 'c')" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                    <template v-slot:cell(description)="row">
                        <div>
                            <span v-if="row.item.cc">[{{row.item.cc}}] </span> {{row.item.description}}
                        </div>
                    </template>
                    <template v-slot:cell(is_productive)="row">
                        <div>
                            <!-- <i class="ion ion-md-create"></i> -->
                        <span style="color:red" v-if="!row.item.is_productive"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.is_productive"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                    <!-- <template slot="active" slot-scope="props">
                        <div class="text-center">
                            <i class="ion ion-md-create"></i>
                            <span style="color:red" v-if="!props.item.active"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="props.item.active"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template> -->
                </b-table>
                 <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div class="text-muted">
                   <small> Total Tipos Centros de Trabajo: {{this.totalRows}} </small>
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
                
                <template slot="button"><b-btn @click="deleteRecord()" v-if="check_access('admin_workstation_type', 'd')" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="xl">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Tipos Centros de Trabajo</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>

             <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-5">
                    <h5>Definicion del Tipo de Centro de Trabajo</h5>
                    <fieldset class="demo-vertical-spacing-sm">
                        <b-form-group label="Descripción">
                            <b-input placeholder="Descripción" v-model.trim="objInfo.description"  />
                        </b-form-group>    
                        <b-form-group label="Codigo Centro de Costos">
                            <b-input placeholder="Codigo Centro de Costos" v-model.trim="objInfo.cc"  />
                        </b-form-group>    
                        <label class="switcher switcher-success mt-2">
                            <input type="checkbox" class="switcher-input" v-model="objInfo.is_productive">
                            <span class="switcher-indicator">
                            <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                            <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                            </span>
                            <span class="switcher-label">Es Productivo</span>
                        </label>
                    </fieldset>
                    <div class="text-right mt-2">
                        <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                        <b-btn :variant="variantSaveButton" v-if="check_access('admin_workstation_type', 'c')" @click="submit()">Guardar</b-btn>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-7">
                    <div class="mt-3" >
                        <h4>Informacion de Inductores</h4>
                        
                        <!-- v-model="objInfoOperation.sequence" -->
                        <!-- {{tableDrivers}} -->
                        <b-form>
                            <b-form-row v-for="item in tableDrivers" :key="item.code">
                                <b-form-group :label="item.description + ' ['+item.um+']'" class="col-md-12"
                                    style="margin-bottom: 0.5rem;" label-cols-sm="7" label-cols-lg="7" content-cols-sm content-cols-lg="7" size="sm">
                                    <b-input  type="number" :id="'f'+item.drivers_id" :placeholder="item.description" v-model="item.value" size="sm"/>
                                    <!-- {{item}} -->
                                </b-form-group>
                            </b-form-row>
                        </b-form>
                        <div class="text-right">
                            <!-- <b-btn variant="outline-success icon-btn" class="btn-md" @click="saveDrivers"><i class="ion ion-md-checkmark"></i></b-btn>  -->
                            <!-- <b-btn variant="outline-danger icon-btn" class="btn-md"><i class="ion ion-md-close"></i></b-btn> -->
                        </div>
                    </div> 
                </div>
             </div>

            <div slot="modal-footer" class="w-100 text-right">
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
    import { infosysconfig } from "@/components/i40/js/sysconfig";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import {infousers} from '@/components/i40/js/users'
    import { infocosts } from "@/components/i40/js/costs";
  
    Vue.use(Notifications)

    export default {
    
        metaInfo: {
            title: 'Tipos Centros de Trabajo'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab
        },
        data: () => ({
            name: 'workstation_types',
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
            tableDrivers:[],         


            /**
            columns: [
                {key:'description', label:"Descripcion"},
                {key:'workstation_plant_id', label:"workstation_plant_id", thClass: 'd-none', tdClass: 'd-none'},
            ], 
             */

            /// Columnas de las tablas
                columns: [
                   
                    // {key:'workstation_types', label:"Tipos Centros de Trabajo"},
                    {key:'description', label:"Tipo Centro Trabajo"},
                    {key:'is_productive', label:"Es Productivo"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Edit"}
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    workstation_type_id:0,
                    description:null, 
                    cc:null, 
                    is_productive: false,
                },
            ///
            objState:{},
        }),
        watch:{
            'objInfo.workstation_type_id':function(value){
                infocosts.drivers([],"select").then(data => {
                        this.tableDrivers = []
                        if(data.data != ''){
                            let tdrivers = []

                            console.log(tdrivers)

                            for (let index = 0; index < data.data.length; index++) {
                                let element = data.data[index]
                                if(element.driver_route == null){
                                    element.value = 0;
                                    tdrivers.push(element)
                                }
                            }
              
                            infocosts.tworkstationdrivers("get", value).then(data => {
                                if(data.status == 200){
                                    if(data.data != ""){
                                    let array = data.data
                                        for (let index = 0; index < array.length; index++) {
                                            const element = array[index];
                                            for (let index2 = 0; index2 < tdrivers.length; index2++) {
                                                const element2 = tdrivers[index2];
                                                if(element.driver_id == element2.drivers_id){
                                                    tdrivers[index2].value = element.value
                                                }
                                            }
                                        }
                                    }
                                }
                            })

                            this.tableDrivers = tdrivers
                        
                    }
                })
            }
        },
        methods:{
            check_access(control, action){
                return infousers.check_access(control,action)
            },

            saveDrivers(){
                let resultado = []
                for (let index = 0; index < this.tableDrivers.length; index++) {
                    const element = this.tableDrivers[index];
                    resultado.push({type_id:this.objInfo.workstation_type_id, driver_id:element.drivers_id, value:parseFloat(element.value==null?0:element.value)})                    
                }

                infocosts.tworkstationdrivers("post", resultado).then(data => {
                    if(data.status == 200){
                        this.showCustom('bg-success text-white', "Guardar Registro","¡El registro se ha Guardado con Éxito!")
                    }else{
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }
                })
            },

        ///Funcion para reiniciar los datos
            restartInfo(){
                 this.objInfo= {
                    workstation_type_id:0,
                    description:"", 
                    is_productive: false,
                 }

                for (let index = 0; index < this.tableDrivers.length; index++) {
                    this.tableDrivers[index].value=null;
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
                    infosysconfig.workstationtype(this.objInfo, this.objInfo.workstation_type_id === 0 || this.objInfo.workstation_type_id === undefined ? "insert" : "update").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                        }else{
                            if(this.objInfo.workstation_type_id === 0 || this.objInfo.workstation_type_id === undefined)
                                this.showCustom('bg-success text-white', "Guardar Registro","¡El registro se ha Guardado con Éxito!")
                            else
                                this.showCustom('bg-warning text-white', "Modificar Registro","¡El registro se ha Modificado con Éxito!")
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
                infosysconfig.workstationtype(this.objInfo, "delete").then(data => {
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
                infosysconfig.workstationtype([],"select").then(data => {
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
            async data_change(row,action){
                this.variantSaveButton="warning"

                ////Informacion que será modificada o borrada
                this.objInfo=row
                
                if(action === "edit"){
                    this.showFormulario=true
                    this.objInfo.workstation_type_id = row.workstation_type_id


                   
                }
                else
                    this.$refs.errorWithButtonAlert.open()
            },
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

            validate_content(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este es un Campo Obligatorio'

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

            infocosts.drivers([],"select").then(data => {
                if(data.data != ''){
                    this.tableDrivers = data.data
                    for (let index = 0; index < this.tableDrivers.length; index++) {
                        this.tableDrivers[index].value=null;
                        
                    }
                }
            })
        },
    }
</script>
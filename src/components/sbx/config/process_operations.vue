<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Configuración de Procesos</h4>
        <div class="w-100 text-right"></div>
        
        <!--TABLA DE DATOS-->
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
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
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
            <small> Total Configuración de Procesos: {{this.totalRows}} </small>
                 </div>
                    </div>
            </div>
        </div>
        <!--TABLA DE DATOS-->

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
        <!-- <sweet-modal ref="showFormulario" width="50%"> -->
        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="xl">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Procesos</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>

            <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
                    <h3>Configure el Proceso</h3>
                    <fieldset class="demo-vertical-spacing-sm">
                        <b-form-group label="Descripción del Proceso" :feedback="objState.message" >
                            <b-input placeholder="Descripción" :disabled="disabledcode" v-model.trim="objInfo.description" :state="objState.description != ''" v-on:input="objState.description = 'valid'; objState.description= objInfo.description==''?'invalid':'valid'"/>
                        </b-form-group>

                        <b-form-group label="Seleccione una Planta" :feedback="objState.message" >
                            <multiselect
                                v-model="selectedPlant"
                                placeholder=""
                                :options="tablePlants"
                                label="description"
                                track-by="description"/>
                        </b-form-group>

                        <b-form-group label="Adicione los Grupos de Centros de Trabajo" :feedback="objState.message" >
                            <multiselect
                                v-model="objInfo.workstation_group"
                                label="description"
                                track-by="description"
                                placeholder=""
                                :options="tableGroups"
                                :multiple="true"
                                :searchable="true"
                                :internal-search="false"
                                :clear-on-select="false"
                                :close-on-select="false"
                                :hide-selected="true">
                                <span slot="noResult">No found.</span>
                            </multiselect>
                        </b-form-group>
                        
                    </fieldset>
                    <div class="w-100 text-right mt-4">
                        <b-btn :variant="variantSaveButton" @click="submit()">Guardar</b-btn>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-8">
                    
                    <!-- <b-nav class="justify-content-end mt-2">
                        <b-nav tabs class="nav-sm tabs-alt">
                            <b-nav-item @click="tipoConf = 'wct'" :active="tipoConf == 'wct' || tipoConf == ''">Centros de Trabajo</b-nav-item>
                            <b-nav-item @click="tipoConf = 'cif'" :active="tipoConf == 'cif'">Configuración Inductores</b-nav-item>
                        </b-nav>
                    </b-nav> -->


                    <div class="mt-3" v-if="tipoConf=='wct' || tipoConf==''">
                        <h4>Configuración Centros de Trabajo</h4>
                        <b-nav tabs class="nav-sm tabs-alt">
                            <b-nav-item @click="configCTs(true)" :active="activeTabCTs">Disponibles</b-nav-item>
                            <b-nav-item @click="configCTs(false)" :active="!activeTabCTs">No Disponibles </b-nav-item>
                        </b-nav>

                        <b-table small show-empty stacked="md" :items="tableControlCTs" :fields="columnsControlCTs" class="mt-2">
                            <template v-slot:cell(edit)="row">
                                <div class="text-center">
                                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="data_change_CTs(row.item)" v-if="!activeTabCTs && objInfo.process_definition_id != 0"><i class="ion ion-md-checkmark"></i></b-btn>
                                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change_CTs(row.item)" v-if="activeTabCTs && objInfo.process_definition_id != 0"><i class="ion ion-md-close"></i></b-btn>
                                </div>
                            </template>
                        </b-table>
                    </div> 

                </div>
            </div>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cerrar</b-btn>
            </div>
        </b-modal>

        <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>
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
    import Multiselect from 'vue-multiselect'
    import { infoconfig } from "@/components/i40/js/config";
    import { infomaster } from "@/components/i40/js/master";

    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import VueMarkdown from 'vue-markdown'

    import Notifications from 'vue-notification'
    
    import workstationVue from '../master/workstation.vue';
  
    Vue.use(Notifications)

    export default {
        
        metaInfo: {
            title: 'Definición de Procesos'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab,
            Multiselect,
            ApiWikiHelp
        },
        watch:{
            'activeTabCTs': function(values){
                this.columnsControlCTs=[
                    {key:'code', label:"Descripción"},
                    {key:'description', label:"Grupo"},
                    {key:'edit', label:this.activeTabCTs?"Desaprobar":"Aprobar"}
                ]
   
                var array = this.sttableControlCTs
                this.tableControlCTs = []
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    if(element.is_approved == values){
                        this.tableControlCTs.push(element)
                    }
                }

            },
        },
        data: () => ({
            name: 'process_operations',
            version: 'v1.0.0.0',

            tipoConf:'',

            activeTabCTs:true,

            showFormulario: false,

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

            variantSaveButton:"success",
            disabledcode:false,
            modified:false,
            tableData: [],

            tablePlants:[],
            selectedPlant:{},
            tableGroups:[],

            tableControlCTs:[],
            sttableControlCTs:[],

            tableDrivers:[],
            
            
            columnsCIFMOD:[],

            columnsCIFMOD:[
                {key:'description', label:"Descripción"},
                {key:'cost_minute', label:"Valor por Minuto"},
                {key:'edit', label:"Editar"}
            ],
            
            columnsControlCTs:[
                    {key:'code', label:"Descripción"},
                    {key:'description', label:"Grupo"},
                    {key:'edit', label:"Desaprobar"}
                ],

            /// Columnas de las tablas
                columns: [
                    {key:'description', label:"Descripción"},
                    {key:'workstation_plant', label:"Planta"},
                    {key:'workstation_groups', label:"Grupos de Centros de Trabajo"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Edit"}
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    process_definition_id:0, 
                    workstation_plant_id:0, 
                    description:'',
                    workstation_group:[] ///ARREGLO, ESTO TIENE UNA PROPIEDAD QUE ES LA LONGITUD DEL ARREGLO .lenght()
                },
            ///

            objState:{},

        }),
        methods:{

            configCTs(status){
                this.activeTabCTs = status
            },

            loadWorkstations(action, info){
                infoconfig.workstationprocess(info,action).then(dataCtrl => {
                    if(dataCtrl.data != ''){
                        var array = dataCtrl.data
                        this.sttableControlCTs = dataCtrl.data
                        this.tableControlCTs = []
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            if(element.is_approved == this.activeTabCTs){
                                this.tableControlCTs.push(element)
                            }
                        }
                    }else{
                        this.tableControlCTs = []
                    }
                })
            },

            data_change_CTs(row){
                row.is_approved = !this.activeTabCTs
                this.loadWorkstations("update", row)
            },

        ///Funcion para reiniciar los datos
            restartInfo(){
                this.objInfo = { 
                    process_definition_id:0, 
                    workstation_plant_id:0, 
                    description:'',
                    workstation_group:[]
                }
                this.selectedPlant={}
                this.tableControlCTs=[]
                this.sttableControlCTs=[]
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
                
                    this.objInfo.workstation_plant_id = this.selectedPlant.workstation_plant_id
               
                    infoconfig.process(this.objInfo, this.objInfo.process_definition_id === 0 ? "insert" : "update").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                        }else{
                            if(this.objInfo.process_definition_id === 0)
                                this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                            else
                                this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Modificado con Éxito!")

                            this.showData()
                            
                            // this.cancel()
                        }
                    })
                    .catch(function (error) {
                        console.log(error.status)
                    })
                }else{
                    this.showCustom('bg-danger text-white', "Error Guardando registro","¡La información no esta completa, por favor valide!")
                }
            },
            deleteRecord: function(){
                infoconfig.process(this.objInfo, "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Registro Eliminado","¡Error al Eliminar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Eliminado","¡El Registro se ha Eliminado con Éxito!")
                        this.restartInfo()
                    }
                    
                    this.showData()
                })
                .catch(function (error) {
                    console.log(error.status)
                })
                
                this.$refs.errorWithButtonAlert.close()
            },
            showData: function(){
                infoconfig.process([],"select").then(data => {
                    if(data.data != ''){
                        this.tableData = data.data
                        this.totalRows= this.tableData.length
                        if(this.objInfo.description != ''){
                            for (let index = 0; index < this.tableData.length; index++) {
                                const element = this.tableData[index];
                                if(element.description == this.objInfo.description){
                                    // this.objInfo.process_definition_id = element.process_definition_id
                                    this.variantSaveButton="warning"
                                    this.objInfo.workstation_group = element.workstation_groups_selected
                                    this.objInfo.description = element.description
                                    this.objInfo.process_definition_id = element.process_definition_id
                                    this.selectedPlant = element.workstation_plant_selected

                                    this.loadWorkstations("select", element)
                                }
                            }
                        }
                    }
                })

                infomaster.plant([],"select").then(data => {
                    if(data.data != ''){
                        this.tablePlants = data.data
                    }
                })

                infomaster.group([],"select").then(data => {
                    if(data.data != ''){
                        this.tableGroups = data.data
                    }
                })

            },
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.variantSaveButton="warning"
                this.objInfo.workstation_group = row.workstation_groups_selected
                this.objInfo.description = row.description
                this.objInfo.process_definition_id = row.process_definition_id
                this.selectedPlant = row.workstation_plant_selected
                
                if(action === "edit"){
                    this.showFormulario=true
                    this.loadWorkstations("select", row)
                    this.activeTabCTs = true
                }
                else
                    this.$refs.errorWithButtonAlert.open()
                    
            },
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

        ///Espacio para metodos propios del control
        ///Espacio para metodos propios del control
        
            validate_content(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este Campo es Oblogatorio'

                if (this.selectedPlant.workstation_plant_id == undefined){
                    this.objState.selectedPlant = 'invalid'
                    isOK = false;
                }else{
                    this.objState.selectedPlant = 'valid'
                }
                if (this.objInfo.description == ''){
                    this.objState.description = 'invalid'
                    isOK = false;
                }else{
                    this.objState.description = 'valid'
                }
                if (this.objInfo.workstation_group.length ==0){
                    this.objState.workstation_group = 'invalid'
                    isOK = false;
                }else{
                    this.objState.workstation_group = 'valid'
                }

                return isOK;
            },



        },
        created(){
            this.showData()
        },
    }
</script>

<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Configuración - Centros de Trabajo</h4>
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
                    <b-btn variant="outline-success icon-btn" class="btn-md" v-if="check_access('operations_workstation', 'c')" v-b-modal.modals-default @click.prevent="addData();objState={}"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-center">
                            <b-btn variant="outline-success borderless icon-btn" v-if="check_access('operations_workstation', 'w')" class="btn-xs" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
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
                   <small> Total Centros de Trabajo: {{this.totalRows}} </small>
                    </div>
                    </div>
            </div>
        </div>

        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                    El registro será borrado de forma lógica, pero la información será visible en reportes. 
                </div>
                
                <template slot="button"><b-btn v-if="check_access('operations_workstation', 'd')" @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="lg">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Centros de Trabajo</span><br>
            <small>El código del centro de trabajo, enlaza el equipo que esta siendo monitoreado desde el PLC.</small>
            </div>
            <fieldset class="demo-vertical-spacing-sm">

                <b-row>
                    <b-col md="4" align-self="center" class="text-center"  @mouseover="active = true" @mouseleave="active = false">
                            <img v-if="image != null" v-bind:src="image != null ? image.dataUrl: null" class="img-thumbnail rounded border border-secondary" alt="Responsive image">
                            <image-uploader
                                :preview="false"
                                :className="['sr-only', 'fileinput', { 'fileinput--loaded': hasImage }]"
                                capture="environment"
                                :debug="1"
                                doNotResize="gif"
                                :autoRotate="true"
                                outputFormat="verbose"
                                @input="setImage"
                                v-show="active || image == null"
                                >
                                <label for="fileInput" slot="upload-label">
                                    <i class="fas fa-camera"></i> Click aquí para cambiar la imagen
                                </label>
                            </image-uploader>
                    </b-col>

                    <b-col md="8" align-self="center">
                        <b-form-group label="Código" :feedback="objState.message">
                            <b-input placeholder="Código" v-model.trim="objInfo.codigo" :state="objState.codigo!=''" v-on:input="objState.codigo = 'valid'; objState.codigo= objInfo.codigo==''?'invalid':'valid'"/>
                        </b-form-group>
                        <b-form-group label="Descripción" :feedback="objState.message">
                            <b-input placeholder="Descripción" v-model.trim="objInfo.description" :state="objState.description!=''" v-on:input="objState.description = 'valid'; objState.description= objInfo.description==''?'invalid':'valid'"/>
                        </b-form-group>

                        <b-row>
                            <b-col md="6">
                                <b-form-group label="Valor Minuto Máquina">
                                    <b-input placeholder="Valor Minuto Máquina" v-model.trim="objInfo.cost_minute" type="number"/>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group label="Valor Minuto Hombre">
                                    <b-input placeholder="Valor Minuto Hombre" v-model.trim="objInfo.cost_person_minute" type="number"/>
                                </b-form-group>
                            </b-col>
                        </b-row>


                    </b-col>
                </b-row>
                <div class="text-center mb-2">
                        <label class="switcher switcher-success">
                            <input type="checkbox" class="switcher-input" v-model="objInfo.affectation_oee">
                            <span class="switcher-indicator">
                            <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                            <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                            </span>
                            <span class="switcher-label">Incluir este equipo en los calculos OEE</span>
                        </label>

                        <label class="switcher switcher-success">
                            <input type="checkbox" class="switcher-input" v-model="objInfo.concurrent_orders">
                            <span class="switcher-indicator">
                            <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                            <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                            </span>
                            <span class="switcher-label">Habilitar Ordenes Concurrentes</span>
                        </label>
                </div>

                    <!-- <b-nav class="justify-content-end mt-2 mb-2">
                        <b-nav tabs class="nav-sm tabs-alt">
                            <b-nav-item @click="tipoConf = 'wct'" :active="tipoConf == 'wct' || tipoConf == ''">Informacion General</b-nav-item>
                            <b-nav-item @click="tipoConf = 'cif'" :active="tipoConf == 'cif'">Configuración Inductores</b-nav-item>
                        </b-nav>
                    </b-nav> -->
                <div v-if="tipoConf=='wct'">
                    <b-row>
                        <b-col md="6">
                            <b-form-group label="Número de Activo">
                                <b-input placeholder="Número de Activo" v-model.trim="objInfo.active_number"/>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group label="Código de Integración">
                                <b-input placeholder="Código de Integración" v-model.trim="objInfo.code_integration"/>
                            </b-form-group>
                        </b-col>
                    </b-row>


                    <b-form-group label="Seleccione una Planta">
                        <multiselect
                            v-model="objInfo.selectedPlant"
                            :options="workstationPlant"
                            
                            placeholder="Planta"
                            label="description"
                            track-by="description" />
                    </b-form-group>

                    <b-form-group label="Seleccione un Grupo de Centros de Trabajo">
                        <multiselect
                            v-model="objInfo.selectedGroup"
                            :options="workstationGroup"
                            
                            placeholder="Grupo de Centros de Trabajo"
                            label="description"
                            track-by="description" />
                    </b-form-group>

                    <b-form-group label="Seleccione un Tipo de Recurso">
                        <multiselect
                            v-model="objInfo.selectedWorkStationType"
                            :options="workstationType"
                            
                            placeholder="Tipo de Recurso"
                            label="description"
                            track-by="description" />
                    </b-form-group>

                    <!-- <div>
                        <div class="row">
                            <div class="col text-center">
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
                    </div> -->

                </div>
                <div v-if="tipoConf == 'cif'">
                    <div class="mt-3" >
                        <h4>Configuración de Inductores</h4>
                        
                        <!-- v-model="objInfoOperation.sequence" -->
                        <!-- {{tableDrivers}} -->
                        <b-form>
                            <b-form-row v-for="item in tableDrivers" :key="item.code">
                                <b-form-group :label="item.description + ' ['+item.um+']'" class="col-md-12"
                                    style="margin-bottom: 0.5rem;" label-cols-sm="5" label-cols-lg="4" content-cols-sm content-cols-lg="7" size="sm">
                                    <b-input  type="number" :id="'f'+item.drivers_id" :placeholder="item.description" v-model="item.value" size="sm"/>
                                    <!-- {{item}} -->
                                </b-form-group>
                            </b-form-row>
                        </b-form>
                        <div class="text-right">
                            <b-btn variant="outline-success icon-btn" class="btn-md" @click="saveDrivers"><i class="ion ion-md-checkmark"></i></b-btn> 
                            <!-- <b-btn variant="outline-danger icon-btn" class="btn-md"><i class="ion ion-md-close"></i></b-btn> -->
                        </div>
                    </div> 
                </div>
                    
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" v-if="check_access('operations_workstation', 'c')" @click="submit()">Guardar</b-btn>
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>


<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import {infousers} from '@/components/i40/js/users'
    import { infomaster } from "@/components/i40/js/master";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
    import Multiselect from 'vue-multiselect'
    import ImageUploader from 'vue-image-upload-resize'

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import { infocosts } from "@/components/i40/js/costs";
  
    Vue.use(Notifications)
    Vue.use(ImageUploader);

    export default {
    
        metaInfo: {
            title: 'Centros de Trabajo'
        },
        components: {
            Multiselect,
            VueMarkdown,
            SweetModal,
            SweetModalTab
        },
        data: () => ({
            tipoConf:'wct',
            name: 'workstation',
            version: 'v1.0.0.0',
            active: false,
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
            
            
            hasImage: false,
            image: null, 
            tableDrivers:[],


            /**
            columns: [
                {key:'description', label:"Descripcion"},
                {key:'workstation_plant_id', label:"workstation_plant_id", thClass: 'd-none', tdClass: 'd-none'},
            ], 
             */

            /// Columnas de las tablas
                columns: [

                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:' id_workplace', label:"id_workplace", thClass: 'd-none', tdClass: 'd-none'},
                    {key:' workstation_type_id', label:"workstation_type_id", thClass: 'd-none', tdClass: 'd-none'},
                    {key:' plant_id', label:"plant_id", thClass: 'd-none', tdClass: 'd-none'},
                    {key:' group_id', label:"group_id", thClass: 'd-none', tdClass: 'd-none'},
                    {key:'code', label:"Código"},
                    {key:'description', label:"Descripción"},
                    {key:'wsplant', label:"Planta"},
                    {key:'wsgroup', label:"Grupo"},
                    {key:'wstype', label:"Tipo"},
                    {key:'edit', label:"Edit"}
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    id:0,
                    codigo:'',
                    descripcion:'',
                    code_integration:'',
                    affectation_oee:true,
                    concurrent_orders:false,
                    cost_minute:null,
                    cost_person_minute:null,
                    active_number:'',
                    selectedWorkStationType:{},
                    selectedPlant:{},
                    selectedGroup:{}
                },
                objState:{},
            ///

            workstationType:[],
            workstationPlant:[],
            workstationGroup:[],
        }),
        methods:{

        mouseOver: function(){
            this.active = !this.active;   
        },

        setImage: function(output) {
            this.hasImage = true;
            this.image = output;
            // console.log('Info', output)
            // console.log('Exif', output.exif)
        },

            check_access(control, action){
            return infousers.check_access(control,action)
            },
        ///Funcion para reiniciar los datos
            restartInfo(){
                this.objInfo = {
                    id:0,
                    codigo:'',
                    descripcion:'',
                    code_integration:'',
                    cost_minute:null,
                    cost_person_minute:null,
                    affectation_oee:true,
                    concurrent_orders:false,
                    active_number:'',
                    selectedWorkStationType:{},
                    selectedPlant:{},
                    selectedGroup:{}
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
                    infomaster.workstation(this.objInfo, this.objInfo.id === 0 ? "insert" : "update").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error Registro","¡Error Guardando el Registro!")
                        }else{
                            if(this.objInfo.id === 0)
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
                    this.showCustom('bg-danger text-white', "Error","¡La información no esta completa!")
                }
            },
            deleteRecord: function(){
                infomaster.workstation(this.objInfo, "delete").then(data => {
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
                infomaster.workstation([],"select").then(data => {
                    if(data.data != ""){
                        this.workstationType = data.data[0].wstype
                        this.workstationPlant = data.data[0].wsplant
                        this.workstationGroup = data.data[0].wsgroup
                        
                        if( data.data[0].workstation != null){
                            this.tableData = data.data[0].workstation
                            this.totalRows= this.tableData.length
                        }
                    }
                })
            },
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.restartInfo()
                this.variantSaveButton="warning"

                ////Informacion que será modificada o borrada
                //this.objInfo.id=row.workstation_group_id


                this.estadoGuardarCustomTags="warning";

                var i=0
                for(i=0;i<this.workstationType.length;i++){
                    if(this.workstationType[i].workstation_type_id === row.workstation_type_id){
                        this.objInfo.selectedWorkStationType=this.workstationType[i]
                    }
                }

                i=0
                for(i=0;i<this.workstationPlant.length;i++){
                    if(this.workstationPlant[i].workstation_plant_id === row.plant_id){
                        this.objInfo.selectedPlant=this.workstationPlant[i]
                    }
                }

                i=0
                for(i=0;i<this.workstationGroup.length;i++){
                    if(this.workstationGroup[i].workstation_group_id === row.group_id){
                        this.objInfo.selectedGroup=this.workstationGroup[i]
                    }
                }
                
                this.objInfo.codigo=row.code;
                this.objInfo.code_integration=row.code_integration;
                this.objInfo.description=row.description;
                this.objInfo.cost_minute=row.cost_minute;
                this.objInfo.cost_person_minute=row.cost_person_minute;
                this.objInfo.active_number=row.active_number;
                this.objInfo.id=row.workstation_id;
                this.objInfo.affectation_oee=row.affectation_oee;
                this.objInfo.concurrent_orders=row.concurrent_orders;

                if(action === "edit"){
                    this.showFormulario=true
                    infocosts.drivers([],"select").then(data => {
                        this.tableDrivers = []
                            if(data.data != ''){
                                let tdrivers = data.data

                                for (let index = 0; index < tdrivers.length; index++) {
                                    tdrivers[index].value = 0;
                                }
                
                                infocosts.workstationdrivers("get", row.workstation_id).then(data => {
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
                else
                    this.$refs.errorWithButtonAlert.open()
            },
             saveDrivers(){
                let resultado = []
                for (let index = 0; index < this.tableDrivers.length; index++) {
                    const element = this.tableDrivers[index];
                    resultado.push({workstation_id:this.objInfo.id, driver_id:element.drivers_id, value:parseFloat(element.value==null?0:element.value)})                    
                }

                infocosts.workstationdrivers("post", resultado).then(data => {
                    if(data.status == 200){
                        this.showCustom('bg-success text-white', "Guardar Registro","¡El registro se ha Guardado con Éxito!")
                    }else{
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }
                })
            },
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            validate_content(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este es un Campo Obligatorio'

                if (this.objInfo.codigo == ''){
                    this.objState.codigo = 'invalid'
                    isOK = false;
                }else{
                    this.objState.codigo = 'valid'
                }
                if (this.objInfo.description == '' || this.objInfo.description === undefined){
                     this.objState.description = 'invalid'
                     isOK = false;
                }else{
                    this.objState.description = 'valid'
                }
                // if (this.objInfo.code_integration == ''){
                //      this.objState.code_integration = 'invalid'
                //      isOK = false;
                // }else{
                //     this.objState.code_integration = 'valid'
                // }

                if(this.objInfo.selectedPlant.workstation_plant_id === undefined){
                    isOK = false;
                }
                if(this.objInfo.selectedGroup.workstation_group_id === undefined){
                    isOK = false;
                }
                if(this.objInfo.selectedWorkStationType.workstation_type_id === undefined){
                    isOK = false;
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

<style>
.thumbnail:hover {
    background-color: red;
    opacity: 0.5;
}
</style>

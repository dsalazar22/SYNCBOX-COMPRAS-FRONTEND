<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Configuración de Herramentales</h4>
        <div class="w-100 text-right"></div>
        <div v-if="showEditForm">
            <b-card header="Adicionar Herramental" header-tag="h6" class="mb-4" >
                <b-form>
                    <b-form-row>
                        <b-form-group class="col-md-4" label="Código" :feedback="objState.message">
                            <b-input  placeholder="Código" v-model="infoTimes.code" :state="objState.code!=''" v-on:input="objState.code = 'valid'; objState.code= infoTimes.code==''?'invalid':'valid'"/>
                        </b-form-group>
                        <b-form-group class="col-md-8" label="Descripción" :feedback="objState.message">
                            <b-input  placeholder="Descripción" v-model="infoTimes.description" :state="objState.description!=''" v-on:input="objState.description = 'valid'; objState.description= infoTimes.description==''?'invalid':'valid'"/>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <b-form-group class="col-md-4" label="Unidades por Ciclo" :feedback="objState.message">        
                            <b-input type="number" step="0.1"  placeholder="Unidades por Ciclo" v-model="infoTimes.unity_expected_cycle" :state="objState.unity_expected_cycle!=0" v-on:input="objState.unity_expected_cycle = 'valid'; objState.unity_expected_cycle= infoTimes.unity_expected_cycle==''?'invalid':'valid'"/>
                        </b-form-group>
                        <b-form-group class="col-md-4" label="Tiempo de Ciclo" :feedback="objState.message">
                            <b-input-group append="segundos">
                                <b-input type="number" step="0.1" placeholder="Tiempo de Ciclo" v-model="infoTimes.standard_time_cycle" :state="objState.standard_time_cycle!=0" v-on:input="objState.standard_time_cycle = 'valid'; objState.standard_time_cycle= infoTimes.standard_time_cycle==''?'invalid':'valid'"/>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group class="col-md-4" label="Tipo de Herramental">
                            <multiselect
                                v-model="infoTimes.selectedtootltype"
                                :options="toolTypeContent"
                                :custom-label="customToolType"
                                :searchable="true"
                                :show-labels="false"
                                placeholder="Tipo de Herramental"
                            />
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <b-form-group class="col-md-4" label="Modificar Unidades por Ciclo">  
                            <label class="switcher switcher-warning mt-2">
                                <input type="checkbox" class="switcher-input" v-model="infoTimes.modify_unity_expected">
                                <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Modificar Unidades por Ciclo</span>
                            </label>
                        </b-form-group>
                        <b-form-group class="col-md-4" label="Modificar Tiempo de Ciclo">
                            <label class="switcher switcher-warning mt-2">
                                <input type="checkbox" class="switcher-input" v-model="infoTimes.modify_time_expected">
                                <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Modificar Tiempo de Ciclo</span>
                            </label>
                        </b-form-group>
                        <b-form-group class="col-md-4" label="Usar de Referencia el Ultimo Ciclo?">
                            <label class="switcher switcher-warning mt-2">
                                <input type="checkbox" class="switcher-input" v-model="infoTimes.use_last_cycle">
                                <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Usar de Referencia el Ultimo Ciclo?</span>
                            </label>
                        </b-form-group>
                    </b-form-row>
            
                    <b-form-row>
                        <!-- <b-form-group class="col-md-4" label="Modificar Unidades por Ciclo">  
                            <label class="switcher switcher-warning mt-2">
                                <input type="checkbox" class="switcher-input" v-model="infoTimes.modify_unity_expected">
                                <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Modificar Unidades por Ciclo</span>
                            </label>
                        </b-form-group> -->
                        <b-form-group class="col-md-4" label="Generico Grupos Centros de Trabajo">
                            <label class="switcher switcher-warning mt-2">
                                <input type="checkbox" class="switcher-input" v-model="infoTimes.generic_data">
                                <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Genérico Grupos Centros de Trabajo</span>
                            </label>
                        </b-form-group>
                        <b-form-group class="col-md-4" label="Grupos de Centros de Trabajo" v-if="infoTimes.generic_data">
                             <multiselect
                                v-model="infoTimes.selectedgroupsworkstation"
                                :options="groupsWorkStationContent"
                                :custom-label="customToolType"
                                :searchable="true"
                                :show-labels="false"
                                placeholder="Grupos de Centros de Trabajo"
                            />
                        </b-form-group>
                    </b-form-row>
                </b-form>
                <div class="row mt-2">
                    <div class="col-6 text-left">
                        <b-btn variant="danger" v-if="check_access('operations_tools', 'w')" @click="$refs.alertOverrideTime.open()">Reemplazar los tiempos?</b-btn>
                    </div>
                    <div class="col-6  text-right">
                        <b-btn variant="primary" @click="showEditForm=false">Cancelar</b-btn>
                        <b-btn variant="success" v-if="check_access('operations_tools', 'w')" @click="submit()">Guardar</b-btn>
                    </div>
                </div>
            </b-card>
        </div>
        <div>
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
                    <b-btn variant="outline-success icon-btn" class="btn-md" v-b-modal.modals-default @click.prevent="showEditForm=true; infoTimes = {
                    tools_id:0,
                    code:'',
                    description:'',
                    description_tool_type:'',
                    standard_time_cycle:0.0,
                    unity_expected_cycle:0.0,
                    generic_data:false,
                    modify_unity_expected:false,

                    modify_time_expected:false,
                    use_last_cycle:false,

                    selectedtootltype:null,
                    selectedgroupsworkstation:null,
                }"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                    <b-btn variant="outline-info icon-btn" class="btn-md" v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->

            
            <b-table small show-empty
                    stacked="md" :fields="columnsSpeeds" :items="speedTableData" class="mt-3" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                <template v-slot:cell(unity_expected_cycle)="row">
                    <div class="text-left">
                        {{row.item.unity_expected_cycle}}
                    </div>
                </template>
                <template v-slot:cell(standard_time_cycle)="row">
                    <div class="text-left">
                        {{row.item.standard_time_cycle}}
                    </div>
                </template>
                <template v-slot:cell(generic_data)="row">
                    <div  class="text-left">
                        <!-- <i class="ion ion-md-create"></i> -->
                        <span style="color:red" v-if="!row.item.generic_data"><i class="ion ion-md-remove-circle"></i></span>
                        <span style="color:green" v-if="row.item.generic_data"><i class="ion ion-md-add-circle"></i> {{row.item.workstation_group_description}} </span>
                    </div>
                </template>
                <template v-slot:cell(modify_unity_expected)="row">
                    <div  class="text-left">
                        <!-- <i class="ion ion-md-create"></i> -->
                        <span style="color:red" v-if="!row.item.modify_unity_expected"><i class="ion ion-md-remove-circle"></i></span>
                        <span style="color:green" v-if="row.item.modify_unity_expected"><i class="ion ion-md-add-circle"></i></span>
                    </div>
                </template>
                <template v-slot:cell(edit)="row">
                    <div class="text-left">
                        <b-btn variant="outline-success borderless icon-btn" v-if="check_access('operations_tools', 'c')" class="btn-xs" @click.prevent="showEditForm=true; infoTimes=row.item"><i class="ion ion-md-create"></i></b-btn>
                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="removeSpeed(row.item)"><i class="ion ion-md-close"></i></b-btn>
                    </div>
                </template>
            </b-table>
             <div class="d-flex justify-content-between">
                 <div>
                 <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                 </div>
                    <div class="text-muted">
                 <small> Total Herramentales: {{this.totalRows}} </small>
                    </div>
                    </div>
        </div>

        <sweet-modal icon="error" title="Borrar Registro" ref="alertOverrideTime">
            ¿Está seguro que desea reemplazar todos los tiempo de ciclos?
            <div class="w-100 text-center"></div>
            <template slot="button"><b-btn v-if="check_access('operations_tools', 'd')" @click="updateAllCycleTime()" variant="danger" class="mr-2">Confirmar</b-btn></template>
            <template slot="button"><b-btn @click="$refs.alertOverrideTime.close()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>

        <sweet-modal icon="error" title="Borrar Registro" ref="alertSpeedDelete">
            ¿Está seguro que desea borrar el registro?
            <div class="w-100 text-center"></div>
            <template slot="button"><b-btn v-if="check_access('operations_tools', 'd')" @click="deleteSpeedRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
            <template slot="button"><b-btn @click="$refs.alertSpeedDelete.close()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>

        <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>

    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import Notifications from 'vue-notification'
import VueMarkdown from 'vue-markdown'
import {infousers} from '@/components/i40/js/users'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { infoconfig } from "@/components/i40/js/config";
import { infomaster } from "@/components/i40/js/master";
import { infosysconfig } from "@/components/i40/js/sysconfig";
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";

Vue.use(Notifications)

export default {
    metaInfo: {
       title: 'Herramentales'
    },
    components: {
        VueMarkdown,
        SweetModal,
        Multiselect
    },
    data() {

        return {
         name: 'tools',
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


            ///INFO TIEMPOS
            showEditForm : false,
            speedTableData:[],
            
            toolTypeContent:[],
            groupsWorkStationContent:[],
            

            columnsSpeeds: [
                {key:'code', label:"Código"},
                {key:'description', label:"Descripción"},
                {key:'standard_time_cycle', label:"Ciclo Estandar"},
                {key:'unity_expected_cycle', label:"Unidades por Ciclo"},
                {key:'modify_unity_expected', label:"Modificar Unidades"},
                {key:'description_tool_type', label:"Tipo de Herramental"},
                {key:'generic_data', label:"Genérico"},
                {key:'edit', label:"Edit"}
            ],

            infoTimes: {
                tools_id:0,
                code:'',
                description:'',
                description_tool_type:'',
                workstation_group_description:'',
                standard_time_cycle:0.0,
                unity_expected_cycle:0.0,
                generic_data:false,
                modify_unity_expected:false,

                selectedtootltype:null,
                selectedgroupsworkstation:null,
            },
            objState:{},

            value:'',
            // src: apiconnection+'speedController/search/',
            limit: 10,
            minChars: 2,
        }
    },

    methods: {
        check_access(control, action){
        return infousers.check_access(control,action)
            },
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

        customToolType({ description }) {
            return `${description == null ? '' : description}`
        },

        removeSpeed:function(item){
            this.infoTimes = item
            this.$refs.alertSpeedDelete.open()
        },

        submit(){
            if(this.validate_content()){
                this.infoTimes.tool_type_id = this.infoTimes.selectedtootltype.tool_type_id

                if(this.infoTimes.selectedgroupsworkstation != null)
                    this.infoTimes.workstation_group_id = this.infoTimes.selectedgroupsworkstation.workstation_group_id
                else
                    this.infoTimes.workstation_group_id = null

                infoconfig.tools(this.infoTimes, this.infoTimes.tools_id === 0 || this.infoTimes.tools_id === undefined?"insert":"update").then(data => {

                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        if(this.infoTimes.tools_id === 0 || this.infoTimes.tools_id === undefined){
                            this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                        }
                        else
                            this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                        // this.tableRutasProcesos = data.data
                        //  this.showEditProduct=false
                        // this.objInfoOperation.route_id = this.objInfo.route_id

                        this.speedTableData = data.data
                        this.totalRows = this.speedTableData.length
                        this.infoTimes = {}
                    }
                })
            }
        },

        updateAllCycleTime(){
            infoconfig.tools(this.infoTimes, 'update-all-cycles').then(data => {

                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Modificado los Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Actualizar Registro","¡Los Registros se han modificado con Éxito!")
      
                    this.$refs.alertOverrideTime.close()
                }
            })
        },

        deleteSpeedRecord(){
            infoconfig.tools(this.infoTimes, 'delete').then(data => {

                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Eliminando el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Eliminar Registro","¡El Registro se ha Eliminado con Éxito!")
                    this.speedTableData = data.data
                    this.totalRows = this.speedTableData.length
                    this.$refs.alertSpeedDelete.close()
                }
            })
        },

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

            validate_content(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este es un Campo Obligatorio'
                
                if (this.infoTimes.code == ''){
                    this.objState.code = 'invalid'
                    isOK = false;
                }else{
                    this.objState.code = 'valid'
                }
                if (this.infoTimes.description == ''){
                     this.objState.description = 'invalid'
                     isOK = false;
                }else{
                    this.objState.description = 'valid'
                }
                if (this.infoTimes.unity_expected_cycle == 0.0){
                     this.objState.unity_expected_cycle = 'invalid'
                     isOK = false;
                }else{
                    this.objState.unity_expected_cycle = 'valid'
                }
                if (this.infoTimes.standard_time_cycle == 0.0){
                     this.objState.standard_time_cycle = 'invalid'
                     isOK = false;
                }else{
                    this.objState.standard_time_cycle = 'valid'
                }
                return isOK
            },
    },

    beforeCreate() {
        infosysconfig.toolstype([],"select").then(data =>{
            if(data.data != "")
                this.toolTypeContent = data.data
            else
                this.toolTypeContent = []
        })

        infomaster.group([],"select").then(data =>{
            if(data.data != "")
                this.groupsWorkStationContent = data.data
            else
                this.groupsWorkStationContent = []
        })

        infoconfig.tools([], "select").then(data => {

            if (data.status === 202){
                this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
            }else{
                if(data.data!="")
                    this.speedTableData = data.data
                else
                    this.speedTableData = []

                this.totalRows = this.speedTableData.length
            }
        })
    },
}
</script>
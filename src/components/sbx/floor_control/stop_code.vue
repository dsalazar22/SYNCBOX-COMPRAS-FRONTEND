<template>
  <div>
    <notifications group="notifications-default" />
    <h4 class="font-weight-bold py-3 mb-4">Código de Paros</h4>
    
    <!-- <p>This page is an example of basic layout. For more options use <strong>Vue starter template generator</strong> in the docs.</p> -->
    <!-- <p><button class="btn btn-primary btn-lg">Button</button></p> -->
    <div class="w-100 text-right">
    </div>
        <div class="row">
            <div class="col">
                <b-row>
                    <b-col md="6" class="my-1">
                        
                        <b-input-group>
                            <b-form-input v-model="filter" placeholder="Buscar..." />
                            <b-input-group-append>
                            <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                            </b-input-group-append>
                        </b-input-group>
                        
                    </b-col>
                    <b-col md="4" class="my-1">
                        <b-form-select :options="pageOptions" v-model="perPage" />
                    </b-col>
                    <b-col md="2" class="my-1">
                        <b-btn variant="outline-success icon-btn" class="btn-md" v-if="check_access('floor_stopcode', 'c')"  v-b-modal.modals-default @click.prevent="newstopcode"><i class="ion ion-md-add"></i></b-btn>
                        <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                    </b-col>
                </b-row>
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="edit(row.item)"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="remove(row.item)"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                    <template v-slot:cell(availability)="row">
                        <div class="text-left">
                            <!-- <i class="ion ion-md-create"></i> -->
                          <span style="color:red" v-if="!row.item.availability"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.availability"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                    <template v-slot:cell(performance)="row">
                        <div class="text-left">
                            <!-- <i class="ion ion-md-create"></i> -->
                            <span style="color:red" v-if="!row.item.performance"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.performance"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                    <template v-slot:cell(setup_time)="row">
                        <div class="text-left">
                            <!-- <i class="ion ion-md-create"></i> -->
                            <span style="color:red" v-if="!row.item.setup_time"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.setup_time"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                    <template v-slot:cell(auto_stop)="row">
                        <div  class="text-left">
                            <!-- <i class="ion ion-md-create"></i> -->
                            <span style="color:red" v-if="!row.item.auto_stop"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.auto_stop"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                    <template v-slot:cell(affect_order)="row">
                        <div  class="text-left">
                            <!-- <i class="ion ion-md-create"></i> -->
                            <span style="color:red" v-if="!row.item.affect_order"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.affect_order"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                    <template v-slot:cell(next_order)="row">
                        <div  class="text-left">
                            <!-- <i class="ion ion-md-create"></i> -->
                            <span style="color:red" v-if="!row.item.next_order"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.next_order"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                    <template v-slot:cell(auto_start)="row">
                        <div  class="text-left">
                            <!-- <i class="ion ion-md-create"></i> -->
                            <span style="color:red" v-if="!row.item.auto_start"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.auto_start"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                </b-table>
                 <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                <div class="text-muted">
                    <small> Total Código de Paro: {{this.totalRows}} </small>
                 </div>
                    </div>
            </div>
    </div>
    <div class="d-inline-block">
        <sweet-modal icon="error" title="Borrar Registro" ref="errorWithButtonAlert">
            ¿Está seguro que desea borrar el registro?
            <div class="w-100 text-center">
                El registro será borrado de forma lógica, su información será visible en reportes. 
                Pero para dejar disponible este consecutivo el sistema conservará el código original y se modificará al final
                parte de su código. Lo que significaría una estructura similar a: 
                <div></div>
                <span class="font-italic font-weight-bold">{{deleteCode}}-DEL-{{Math.round((new Date()).getTime() / 1000)}}</span>
            </div>
            <div class="w-100 text-center font-weight-bold">
            {{deleteCode}}
            <div class="w-100"></div>
             {{deleteDescripcion}}
            </div>
             <template slot="button"><b-btn v-if="check_access('floor_stopcode', 'd')"  @click="deleteregistro()" variant="danger" class="mr-2">Eliminar</b-btn></template>
            <template slot="button"><b-btn @click="closeErrorAlarm()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>
    </div>

    <b-modal id="modals-center" v-model="show"  class="modal-center" size="lg">
        <div slot="modal-title">
          Administrar <span class="font-weight-light">Código de Paros</span><br>
          <!-- <small :class="infostatus">{{subtitle}}</small> -->
        </div>
         <fieldset class="demo-vertical-spacing-sm">
        <b-form-row>
            <b-form-group class="col-md-4" :feedback="objState.message" label="Código">
                <b-input placeholder="Código" v-model.trim="infoParos.code" />
            </b-form-group>
            <b-form-group class="col-md-8" :feedback="objState.message" label="Descripción">
                <b-input placeholder="Descripción" v-model.trim="infoParos.description" />
            </b-form-group>
        </b-form-row>
         </fieldset>

            <b-nav class="justify-content-end mt-2">
                <b-nav tabs class="nav-sm tabs-alt">
                    <b-nav-item :active="selectTab=='info_general'" @click="selectTab='info_general'">Información General</b-nav-item>
                    <b-nav-item :active="selectTab=='info_access'" @click="selectTab='info_access'">Configuracion de uso</b-nav-item>
                </b-nav>
            </b-nav>


        <div class="row mt-4" v-if="selectTab=='info_general'">
            <div class="col-sm-12 col-md-7">
                <fieldset class="demo-vertical-spacing-sm">
                 <b-form-group :feedback="objState.message" label="Tiempo Estimado de Duración">
                    <b-input placeholder="Tiempo Estimado de Duración (minutos)" type="number" v-model.trim="infoParos.estimated_duration" />
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Grupos de Centros de Trabajo">
                    <multiselect
                        v-model="infoParos.workstation_group"
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
                <b-form-group :feedback="objState.message" label="Área Funcional Responsable">
                    <multiselect
                        v-model="infoParos.functional_area"
                        label="description"
                        track-by="description"
                        placeholder=""
                        :options="tableFunctionalArea"
                        :searchable="true"
                        :internal-search="false"
                        :clear-on-select="false"
                        :close-on-select="false"
                        :hide-selected="true">
                        <span slot="noResult">No found.</span>
                    </multiselect>
                </b-form-group>
                <b-form-textarea id="textarea1"
                                v-model="infoParos.definition"
                                placeholder="Definición del Paro"
                                :rows="3"
                                :max-rows="6"
                                class="mb-3">
                </b-form-textarea>
                </fieldset>
            </div>
            <div class="col-sm-12 col-md-5">
                
                <div>
                    <div>

                        <h4>Propiedades</h4>
                        <b-form-group class="text-left">
                            <label class="switcher switcher-success">
                                <input type="checkbox" class="switcher-input" @change="checkStatusAvailable(infoParos.availability)" v-model="infoParos.availability">
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Afectar Disponibilidad</span>
                            </label>
                            <label class="switcher switcher-success mt-2">
                                <input type="checkbox" class="switcher-input" @change="checkStatusPerform(infoParos.performance)" v-model="infoParos.performance">
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Afectar Eficiencia</span>
                            </label>                            
                            <label class="switcher switcher-success mt-2">
                                <input type="checkbox" class="switcher-input" v-model="infoParos.affect_cost">
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Afectar Costo</span>
                            </label>
                            <label class="switcher switcher-success mt-2">
                                <input type="checkbox" class="switcher-input" v-model="infoParos.setup_time">
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Tiempo de Preparación</span>
                            </label>
                            <label class="switcher switcher-danger mt-2">
                                <input type="checkbox" class="switcher-input" v-model="infoParos.auto_stop">
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Paro Automático</span>
                            </label>
                        </b-form-group>
                    </div>
                    <div>
                        <h4>Comportamiento</h4>
                        <b-form-group class="text-left">
                         <label class="switcher switcher-success mt-2">
                                <input type="checkbox" class="switcher-input" v-model="infoParos.next_order">
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Orden de Producción Siguiente</span>
                            </label>
                            <label class="switcher switcher-warning mt-2">
                                <input type="checkbox" class="switcher-input" v-model="infoParos.affect_order">
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Afectar Orden de Producción</span>
                            </label>
                            <label class="switcher switcher-warning mt-2">
                                <input type="checkbox" class="switcher-input" v-model="infoParos.auto_start">
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label">Iniciar Automáticamente</span>
                            </label>
                            <div class="w-100"></div>
                        </b-form-group>
                    </div>
                </div>
            
            </div>
        </div>

        <div class="mt-4" v-if="selectTab=='info_access'">
                <!-- <b-form-group label="Razon de Causa Raíz por Defecto (si no se marca una razon de paro)">
                    <multiselect
                        v-model="infoParos.root_cause"
                        label="description"
                        track-by="description"
                        placeholder=""
                        :options="root_cause_options"
                        :multiple="false"
                        :searchable="true"
                        :internal-search="false"
                        :clear-on-select="false"
                        :close-on-select="false"
                        :hide-selected="true">
                        <span slot="noResult">No found.</span>
                    </multiselect>
                </b-form-group> -->
                <b-form-group label="Usuarios Con Acceso a Seleccionar Este Codigo">
                    <multiselect
                        v-model="user_stop_code"
                        label="username"
                        track-by="username"
                        placeholder=""
                        :options="usersInfo"
                        :multiple="true"
                        :searchable="true"
                        :internal-search="true"
                        :clear-on-select="true"
                        :close-on-select="false"
                        :hide-selected="true">
                        <span slot="noResult">No found.</span>
                    </multiselect>
                </b-form-group>
                <b-form-group label="Usuarios Con Acceso a Seleccionar los Codigos de Causa Raiz">
                    <multiselect
                        v-model="user_root_cause"
                        label="username"
                        track-by="username"
                        placeholder=""
                        :options="usersInfoRoot"
                        :multiple="true"
                        :searchable="true"
                        :internal-search="false"
                        :clear-on-select="false"
                        :close-on-select="false"
                        :hide-selected="true">
                        <span slot="noResult">No found.</span>
                    </multiselect>
                </b-form-group>
        </div>

        <div slot="modal-footer" class="w-100 text-right">
            <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
            <b-btn :variant="variantSaveButton" v-if="check_access('floor_stopcode', 'w')" @click="submit()">Guardar</b-btn>
        </div>
        <!-- </b-card> -->
    </b-modal>

               <!-- <div class="d-inline-block">
          <b-btn @click="$refs.ultraWide.open()">Ultra wide</b-btn>
          <sweet-modal title="Ultra Wide" width="100%" ref="ultraWide">
            This is a very wide modal.
          </sweet-modal>
        </div> -->
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
import { NewStopCode, UpdateStopCode, GetActiveStopCode, DeleteStopCode } from "@/vendor/sbx/sbx/stop_code";
import Notifications from 'vue-notification'
import {infousers} from '@/components/i40/js/users'
import VueMarkdown from 'vue-markdown'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import { infomaster } from "@/components/i40/js/master";
import Multiselect from 'vue-multiselect'

Vue.use(Notifications)


export default {

    metaInfo: {
        title: 'Código de Paros'
    },
    components: {
        VueMarkdown,
        SweetModal,
        SweetModalTab,
        Multiselect,
        ApiWikiHelp

    },

    watch:{
        'user_stop_code':function(elements){
            this.usersInfoRoot = this.user_stop_code
        }
    },
    
    data: () => ({
        name: 'StopCode',
        version: 'v1.0.0.0',

        usersInfo : [],
        usersInfoRoot : [],
        root_cause_options:[],
        user_stop_code:[],
        user_root_cause:[],

        selectTab:'info_general',

        contentWiki: "",
        anchorAttrs: {
            target: '_blank',
            rel: 'noopener noreferrer nofollow'
        },
        deleteCode:"",
        deleteDescripcion:"",

        variantSaveButton:"success",
        modified:false,
        tableData: [],
        optionsGroups: [{ value: null, text: 'Seleccione un grupo' },],
        selectedGroup:null,
        columns: [
            {key:'code', label:"Código"},
            {key:'description', label:"Descripción"},
            {key:'estimated_duration', label:"Tiempo (min)"},
            {key:'availability', label:"Dispo"},
            {key:'performance', label:"Efic"},
            {key:'w_group', label:"Grupos"},
            // {key:'setup_time', label:"T Prep"},
            // {key:'auto_stop', label:"Paro Auto"},
            // {key:'next_order', label:"Orden Sig"},
            // {key:'affect_order', label:"Afectar Ord"},
            // {key:'auto_start', label:"Auto Inic"},
            {key:'definition', label:"Definition", thClass: 'd-none', tdClass: 'd-none'},
            {key:'edit', label:"Edit"}],

        infoParos: {
            code: '',
            description: '',
            estimated_duration: 0,
            workstation_group: null,
            functional_area: null,
            definition: null,
            performance: null,
            availability: false,
            affect_cost: false,
            setup_time: false,
            auto_stop: false,
            next_order: false,
            affect_order: false,
            auto_start: false,
        },

        currentPage: 1,
        perPage: 50,
        totalRows: 0,
        pageOptions: [ 50, 100, 200 ],
        filter: null,
        show:false,
        objState: {},

        tableGroups:[],
        tableFunctionalArea:[]

    }),
    methods:{
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

        newstopcode:function(){
            this.infoParos.availability=false
            this.infoParos.performance=false
            this.infoParos.setup_time=false
            this.infoParos.auto_stop=false
            this.infoParos.affect_order=false
            this.infoParos.next_order=false
            this.infoParos.auto_start=false
            this.infoParos.affect_cost=false
            this.user_stop_code = []
            this.user_root_cause = []

            this.show=true
            this.selectTab='info_general'
        },
        cancel: function(){
            this.infoParos={}
            this.modified = false
            this.variantSaveButton="success"
            this.show=false
            this.selectTab='info_general'
        },
        submit: function(){
            if(this.validate_content()){
                this.infoParos.functional_area_id = this.infoParos.functional_area.functional_area_id

                let user_stop_code_pp = ''
                if(this.user_stop_code != undefined || this.user_stop_code != null)
                    for (let index = 0; index < this.user_stop_code.length; index++) {
                        const element = this.user_stop_code[index];
                        user_stop_code_pp = user_stop_code_pp+element.iduser
                        if(index <this.user_stop_code.length-1)
                            user_stop_code_pp = user_stop_code_pp+','
                        
                    }

                let user_root_cause_pp = ''
                if(this.user_root_cause != undefined || this.user_root_cause != null)
                    for (let index = 0; index < this.user_root_cause.length; index++) {
                        const element = this.user_root_cause[index];
                        user_root_cause_pp = user_root_cause_pp+element.iduser
                        if(index <this.user_root_cause.length-1)
                            user_root_cause_pp = user_root_cause_pp+','
                    }

                this.infoParos.user_root_cause_pp = user_root_cause_pp
                this.infoParos.user_stop_code_pp = user_stop_code_pp




                infomaster.stop_code(this.infoParos,!this.modified ? 'insert':'update').then(data =>{
                     if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Guardar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                        this.tableData = data.data
                        this.totalRows= this.tableData.length
                        this.cancel()
                    }
                }).catch(function (error) {
                    console.log(error.status)
                })
            }
        },
        showCustom: function(classes, title, text) {
           this.$notify({
               group: 'notifications-default',
               type: classes,
               title: title,
               text: text
           })
        },
        showData: function(){
            infomaster.stop_code([],'select').then(data =>{
               if(data.data!=""){
                    this.tableData = data.data
                    this.totalRows= this.tableData.length
                }
            })
        },
        checkStatusPerform: function(status){
            if(status){
                this.infoParos.performance =true
                this.infoParos.availability =false
            }
        },
        
        checkStatusAvailable: function(status){
            if(status){
                this.infoParos.performance =false
                this.infoParos.availability =true
            }
        },

        edit :function(row){
            this.objState.code='valid';
            this.objState.description='valid';
            this.variantSaveButton="warning"
            this.modified = true
            this.infoParos = JSON.parse(JSON.stringify(row))
            this.user_stop_code = []
            this.user_root_cause = []

            
            if(this.infoParos.usersstopcode != null){
                let arrayUser = this.infoParos.usersstopcode.split(',')
                for (let index = 0; index < arrayUser.length; index++) {
                    const elementUser = arrayUser[index];

                    for (let index = 0; index < this.usersInfo.length; index++) {
                        const element = this.usersInfo[index];
                        // console.log(element)
                        if(element.iduser == elementUser){
                            this.user_stop_code.push(element)
                        }
                    }
                }
            }

            if(this.infoParos.usersstoprootcode != null){
                let arrayUser = this.infoParos.usersstoprootcode.split(',')
                for (let index = 0; index < arrayUser.length; index++) {
                    const elementUser = arrayUser[index];

                    for (let index = 0; index < this.usersInfo.length; index++) {
                        const element = this.usersInfo[index];
                        if(element.iduser == elementUser){
                            this.user_root_cause.push(element)
                        }
                    }
                }
            }
            this.show=true
        },

        remove: function(row){
            this.infoParos = row,
            this.deleteCode=row.code
            this.deleteDescripcion=row.description
            this.$refs.errorWithButtonAlert.open()
        },

        deleteregistro: function(){
            infomaster.stop_code(this.infoParos,'delete').then(data =>{
                     if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Guardar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                        if(data.data!=""){
                            this.tableData = data.data
                            this.totalRows= this.tableData.length
                        }
                        this.cancel()
                    }
                }).catch(function (error) {
                    console.log(error.status)
                })
            
            this.$refs.errorWithButtonAlert.close()
        },
        closeErrorAlarm: function(){
            this.deleteCode = ""
            this.deleteDescripcion=""
            this.$refs.errorWithButtonAlert.close()
        },
        onFiltered (filteredItems) {
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

            validate_content(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este es un Campo Obligatorio'

                if (this.infoParos.code == ''){
                    this.objState.code = 'invalid'
                    isOK = false;
                }else{
                    this.objState.code = 'valid'
                }
                if (this.infoParos.description == ''){
                     this.objState.description = 'invalid'
                     isOK = false;
                }else{
                    this.objState.description = 'valid'   
                }

                return isOK;
            }
    },
    created(){
        infomaster.stop_code([],"start-form").then(data => {
            if(data.data != ""){
                if(data.data[0].ws_group != null)
                    this.tableGroups = data.data[0].ws_group
                else
                    this.tableGroups = []

                if(data.data[0].list_functional_area != null)
                    this.tableFunctionalArea = data.data[0].list_functional_area
                else
                    this.tableFunctionalArea = []

                if(data.data[0].stopcode != null){
                    this.tableData = data.data[0].stopcode
                    this.totalRows= this.tableData.length
                }
                else{
                    this.tableData = []
                    this.totalRows= 0
                }
            }
        })
        infomaster.getusers().then(data => {
            // console.log(data.data)
            this.usersInfo=[]
            if(data.data != ""){
                this.usersInfo = data.data
            }
        })
    //    this.showData()
    }
}
</script>

<template>
    <div>
        <notifications group="notifications-default" />
         <div class="d-flex justify-content-between mb-3">
            <div>
                <h4 class="font-weight-bold mt-2 mb-0">
                    {{text_name}}
                    <!-- <div class="text-muted text-tiny mt-1"><small class="font-weight-normal">Today is Tuesday, 8 February 2018</small></div> -->
                </h4>
            </div>
        </div>
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
                    <!-- <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="addData();objState={}"><i class="ion ion-md-add"></i></b-btn>&nbsp; -->
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
        </div>
        <b-table small :fields="columnsCustom" :items="itemsCustom" :current-page="currentPage" :per-page="perPage" :filter="filter" @filtered="onFiltered">
            <template v-slot:cell(edit)="row" >
                <div class="text-left">
                    <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(props.item,'delete')"><i class="ion ion-md-close"></i></b-btn> -->
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="check_access('capacity_capacity', 'c')" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                </div>
            </template>

            <template v-slot:cell(is_controlled_capacity)="row" >
                <div  class="text-left">
                    <!-- <i class="ion ion-md-create"></i> -->
                    <span style="color:red" v-if="!row.item.is_controlled_capacity"><i class="ion ion-md-remove-circle"></i></span>
                    <span style="color:green" v-if="row.item.is_controlled_capacity"><i class="ion ion-md-add-circle"></i></span>
                </div>
            </template>
             <template v-slot:cell(auto_calendar)="row" >
                <div  class="text-left">
                    <!-- <i class="ion ion-md-create"></i> -->
                    <span style="color:red" v-if="!row.item.auto_calendar"><i class="ion ion-md-remove-circle"></i></span>
                    <span style="color:green" v-if="row.item.auto_calendar"><i class="ion ion-md-add-circle"></i></span>
                </div>
            </template>
        </b-table>
        <div class="d-flex justify-content-between">
            <div>
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
            </div>
            <div class="text-muted">
                <small> Total Grupos de Centros de Trabajo: {{this.totalRows}} </small>
            </div>
        </div>

        <b-modal id="modals-top" v-model="showFormulario"  centered size="md">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Capacidades por Grupos</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <h4 class="text-center">{{this.objInfo.workstation_group_description}}</h4>
            <fieldset class="demo-vertical-spacing-sm">

                <b-form-group :feedback="objState.message">
                      <label class="switcher switcher-success mt-2">
                            <input type="checkbox" class="switcher-input" v-model="objInfo.is_controlled_capacity" @change=" active_calendar = !objInfo.is_controlled_capacity; objInfo.auto_calendar = false;">
                            <span class="switcher-indicator">
                            <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                            <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                            </span>
                            <span class="switcher-label">Controlar Capacidad en él Centro de Trabajo</span>
                        </label>
                </b-form-group>
                <b-form-group :feedback="objState.message">
                      <label class="switcher switcher-success mt-2">
                            <input type="checkbox" class="switcher-input" v-model="objInfo.auto_calendar" :disabled="active_calendar">
                            <span class="switcher-indicator">
                            <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                            <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                            </span>
                            <span class="switcher-label">Generar Automáticamente el Calendario</span>
                        </label>
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Hora de Inicio de Operación" horizontal :label-cols="5">
                    <!-- <timeselector v-model="objInfo.default_start_hour"></timeselector> -->
                    <!-- <vue-clock-picker v-model="objInfo.default_start_hour"></vue-clock-picker> -->
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Número Totales Trabajadas Día" horizontal :label-cols="5">
                    <b-input type="number" v-model="objInfo.default_number_hours" v-on:input="objInfo.default_number_hours > 24 ?objInfo.default_number_hours=24 : objInfo.default_number_hours"/>
                </b-form-group>
                <b-form-group :feedback="objState.message">
                      
                </b-form-group>
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel(); getContent();">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" v-if="check_access('capacity_capacity', 'c')" @click="submit()">Guardar</b-btn>
            </div>
        </b-modal>

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
import { infoplanning } from "@/components/i40/js/iplanning";
// import VueClockPicker from '@pencilpix/vue2-clock-picker';
// import '@pencilpix/vue2-clock-picker/dist/vue2-clock-picker.min.css';
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import Notifications from 'vue-notification'
import VueMarkdown from 'vue-markdown'
import {infousers} from '@/components/i40/js/users'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";

Vue.use(Notifications)

export default {
    components: {
        // VueClockPicker,
        VueMarkdown,
        SweetModal,
        SweetModalTab
    },
    data() {
        return {
            name: 'config_workstation_capacity',
            version: 'v1.0.0.0',
            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },
            text_name:'Asignación y Configuración de Capacidades',
            columnsCustom:[
                {key:'workstation_plant_description', label:"Planta"},
                {key:'workstation_group_description', label:"Grupo"},
                {key:'is_controlled_capacity', label:"Control Capacidad"},
                {key:'auto_calendar', label:"Auto Calendario"},
                {key:'default_start_hour', label:"Hora de Inicio"},
                {key:'default_number_hours', label:"Horas Día"},
                // {key:'decimal_quantity', label:"Cifras Decimales"},
                ///Este objeto es fijo en caso de que se necesite modificar la info
                {key:'edit', label:"Editar"}],
            itemsCustom:[],

            objInfo:{},
            objState:{},
            showFormulario:false,
            variantSaveButton:'success',
            active_calendar:false,

            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla
        }
    },
    methods: {
        check_access(control, action){
        return infousers.check_access(control,action)
        },
        
        getContent(){
            infoplanning.capabilities([],"select").then(data =>{
               this.itemsCustom = data.data 
            })
        },
        cancel(){
            this.showFormulario=false;
            this.objInfo={}
            this.variantSaveButton = this.objInfo.capacity_workstation_group_id == null ? 'success' : 'warning'
        },
        submit(){
            infoplanning.capabilities(this.objInfo, this.objInfo.capacity_workstation_group_id == null ? "insert" : "update").then(data =>{
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                }else{
                    if(this.objInfo.code_id === "")
                        this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
                    else
                        this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                    this.itemsCustom = data.data 
                    this.cancel()

                }
            })
        },

        data_change(item, action){
            this.showFormulario = true
            this.objInfo = item
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
    },
    created() {
        this.getContent()
    },
}
</script>

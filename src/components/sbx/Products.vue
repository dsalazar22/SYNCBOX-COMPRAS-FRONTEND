<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-0">Configuración de Productos</h4>

    <hr class="border-light container-m--x mt-0 mb-4">
    <div class="w-100 text-right">
</div>
   <b-modal id="modals-top" v-model="show"  class="modal-center">
        <div slot="modal-title">
          Administrar <span class="font-weight-light">Productos</span><br>
          <small :class="infostatus">{{subtitle}}</small>
        </div>

        <!-- <b-alert :show="dismissCountDown"
                dismissible
                :variant="alarmaGuardarDatos"
                @dismissed="dismissCountDown=0"
                @dismiss-count-down="countDownChanged">
                <div class="d-flex">
            <div class="mr-auto p-2">{{confirmMessage}}</div>
            <div class="p-2"> {{dismissCountDown}} segundos...</div>
            </div>
        </b-alert> -->
            <!-- <b-card header="Producto" header-tag="h6" class="mb-4"> -->
        <fieldset class="demo-vertical-spacing-sm">
            <b-form-group label="">
                <b-input placeholder="Código" :disabled="disabledcode" :state="codeProduct" aria-describedby="inputCode" v-model.trim="infoProduct.code" />
            </b-form-group>
            <b-form-group label="">
                <b-input placeholder="Descripción" :state="description" required v-model.trim="infoProduct.description"/>
            </b-form-group>

            <div class="h4 text-center"></div>

            <!-- <b-form-group label="">
                <b-input type="number" step="0.1" :state="unityPerCycle" placeholder="Unidades por Ciclo" v-model="infoProduct.unityPerCycle"/>
            </b-form-group>
            <b-form-group label="">
                <b-input type="number" step="0.1" :state="cycleTime" placeholder="Tiempo de Ciclo" v-model="infoProduct.cycleTime"/>
            </b-form-group> -->
            <!-- <b-form-group>
                <label class="switcher switcher-success mt-2">
                    <input type="checkbox" class="switcher-input" checked>
                    <span class="switcher-indicator">
                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                    </span>
                    <span class="switcher-label">Activo</span>
                </label>
            </b-form-group> -->
            <!-- <div class="text-right"> -->
                
                <!-- <b-btn variant="warning">Detalle</b-btn> -->
            <!-- </div> -->
        </fieldset>
            <!-- </b-card> -->
           
        <div slot="modal-footer" class="w-100 text-right">
            <b-btn variant="primary" @click="show=false">Cancelar</b-btn>
            <b-btn :variant="variantvalue" @click="submit($event)">Guardar</b-btn>
        </div>
    </b-modal>
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

                 <b-col md="1" class="my-1 ml-3">
                    <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="newproduct"><i class="ion ion-md-add"></i></b-btn>
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
            </b-row>
            <b-table small show-empty
                    stacked="md" :items="tableData" :fields="columns" :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter" @filtered="onFiltered">
                 <template v-slot:cell(unity_expected_cycle)="row">
                    <div class="text-center">
                        {{row.item.unity_expected_cycle}}
                    </div>
                </template>
                <template v-slot:cell(standard_time_cycle)="row">
                    <div class="text-center">
                        {{row.item.standard_time_cycle}}
                    </div>
                </template>
                <template v-slot:cell(complete)="row">
                    <div class="text-center">
                        <div class="row">
                        <div class="col-6 text-right success">
                            <span :class="{'text-success': row.item.complete == 'OK', 'text-danger': row.item.complete != 'OK'}">
                            <i v-if="row.item.complete == 'OK'" class="ion ion-md-thumbs-up "></i>
                            <i v-if="row.item.complete != 'OK'" class="ion ion-md-thumbs-down"></i>
                            </span>
                        </div>
                        <div class="col-6 text-left">{{ row.item.complete }}  </div>
                        </div>
                    </div>
                </template>

                <template v-slot:cell(edit)="row">
                    <div class="text-center">
                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="edit(row.item)"><i class="ion ion-md-create"></i></b-btn>
                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="remove(row.item)"><i class="ion ion-md-close"></i></b-btn>
                        <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="openInfoSpeed(row.item)"><i class="ion ion-md-stopwatch"></i></b-btn>
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
    <!-- <v-client-table :data="tableData" :columns="columns" :options="options">
      <template slot="edit" slot-scope="props">
          <div>
          <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="edit(props.row)"><i class="ion ion-md-create"></i></b-btn>
          <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="remove(props.row)"><i class="ion ion-md-close"></i></b-btn>
          </div>
      </template>
    </v-client-table> -->

    <div class="d-inline-block">
        <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
            ¿Está seguro que desea borrar el registro?
            <div class="w-100 text-center">
            {{infoProduct.code}}
            </div>
             {{infoProduct.description}}
             <template slot="button"><b-btn @click="deleteregistro()" variant="danger" class="mr-2">Eliminar</b-btn></template>
            <template slot="button"><b-btn @click="$refs.errorWithButtonAlert.close()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>
    </div>
        <notifications group="notifications-default" />
          <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>

    
        <div class="d-inline-block">
        <sweet-modal icon="error" title="Borrar registro" ref="alertSpeedDelete">
            ¿Está seguro que desea borrar el registro?
            <div class="w-100 text-center">
            
            </div>
             <template slot="button"><b-btn @click="deleteSpeedRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
            <template slot="button"><b-btn @click="closeAlertDeleteSpeed" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>
    </div>
        <notifications group="notifications-default" />
          <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>


        <sweet-modal ref="detailSpeedProduct" title="Modificar Tiempos de Fabricación" width="80%" >
         
            <!-- <div class="h4 text-center"> Detalle de Tiempos </div> -->

        <div class="position-relative mb-3">
                <b-input-group>
                    <b-input-group-text slot="prepend" v-if="loading">
                        <i class="ion ion-md-sync"></i>
                    </b-input-group-text>
                    <b-input-group-text slot="prepend" v-if="!loading">
                        <i class="ion ion-ios-search"></i>
                    </b-input-group-text>
                    <input type="text" class="form-control"
                        placeholder="Seleccione una configuración"
                        autocomplete="off"
                        v-model="value"
                        @keydown.down="down"
                        @keydown.up="up"
                        @keydown.enter="hit"
                        @keydown.esc="reset"
                        @blur="reset"
                        @input="updateQuery" />
                    <b-input-group-text slot="append" v-if="isDirty || value" @click="resetInput">
                        <i class="ion ion-md-close" ></i>
                    </b-input-group-text>
                </b-input-group>

                <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                    <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                        <span class="name" v-text="item.code"></span>
                        <span class="text-muted">{{ item.description }}</span>
                    </a>
                </div>

            </div>

                <div >
                    <b-form>
                        <b-form-row>
                            <b-form-group class="col-md-4" label="Código">
                                <b-input  placeholder="Código" v-model="infoTimes.code" :disabled="this.infoTimes.id != 0 || this.infoTimes.speed_config_id != 0"/>
                            </b-form-group>
                            <b-form-group class="col-md-8" label="Descripción">
                                <b-input  placeholder="Descripción" v-model="infoTimes.description" :disabled="this.infoTimes.id != 0 || this.infoTimes.speed_config_id != 0"/>
                            </b-form-group>
                        </b-form-row>
                        <b-form-row>
                            <b-form-group class="col-md-6" label="Unidades por Ciclo">
                                
                                <b-input type="number" step="0.1"  placeholder="Unidades por Ciclo" v-model="infoTimes.unity_expected_cycle" :disabled="this.infoTimes.id != 0 || this.infoTimes.speed_config_id != 0"/>

     
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Tiempo de Ciclo">
                                <b-input-group append="s">
                                <b-input type="number" step="0.1" placeholder="Tiempo de Ciclo" v-model="infoTimes.standard_time_cycle"/>
                                 </b-input-group>
                            </b-form-group>
                        </b-form-row>
                    
                            <div class="d-flex justify-content-between">
                                <div>
                                <label class="switcher switcher-warning mt-2">
                                    <input type="checkbox" class="switcher-input" v-model="infoTimes.default">
                                    <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                    </span>
                                    <span class="switcher-label">Default</span>
                                </label>
                                <label class="switcher switcher-warning mt-2">
                                    <input type="checkbox" class="switcher-input" v-model="infoTimes.modify_unity_expected">
                                    <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                    </span>
                                    <span class="switcher-label">Modificar Unidades por Ciclo</span>
                                </label>

                                </div>
                                <div>
                                    <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="submitSpeed"><i class="ion ion-md-checkmark"></i></b-btn>
                                    <b-btn variant="outline-warning icon-btn" class="btn-md" v-b-modal.modals-default @click.prevent="clearSepeedForm"><i class="fas fa-eraser"></i></b-btn>
                                    <!-- <b-btn variant="outline-info icon-btn" class="btn-md" :disabled="infoProduct.idproduct==0" v-b-modal.modals-default @click.prevent="$refs.errorWithButtonAlert.open()"><i class="ion ion-md-search"></i></b-btn> -->
                                </div>
                            </div>

                            <b-table small show-empty
                                    stacked="md" :fields="columnsSpeeds" :items="speedTableData" class="mt-3">
                                <template v-slot:cell(unity_expected_cycle)="row">
                                    <div class="text-center">
                                        {{row.item.unity_expected_cycle}}
                                    </div>
                                </template>
                                <template v-slot:cell(standard_time_cycle)="row">
                                    <div class="text-center">
                                        {{row.item.standard_time_cycle}}
                                    </div>
                                </template>

                                <template v-slot:cell(default)="row">
                                    <div  class="text-center">
                                        <!-- <i class="ion ion-md-create"></i> -->
                                        <span style="color:red" v-if="!row.item.default"><i class="ion ion-md-remove-circle"></i></span>
                                        <span style="color:green" v-if="row.item.default"><i class="ion ion-md-add-circle"></i></span>
                                    </div>
                                </template>
                                <template v-slot:cell(modify_unity_expected)="row">
                                    <div  class="text-center">
                                        <!-- <i class="ion ion-md-create"></i> -->
                                        <span style="color:red" v-if="!row.item.modify_unity_expected"><i class="ion ion-md-remove-circle"></i></span>
                                        <span style="color:green" v-if="row.item.modify_unity_expected"><i class="ion ion-md-add-circle"></i></span>
                                    </div>
                                </template>

                                <template v-slot:cell(edit)="row">
                                    <div class="text-center">
                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="editSpeed(row.item)"><i class="ion ion-md-create"></i></b-btn>
                                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="removeSpeed(row.item)"><i class="ion ion-md-close"></i></b-btn>
                                    </div>
                                </template>
                            </b-table>
                            
                            <!-- <b-form-group class="col-md-6" label="">
                                
                            </b-form-group>
                            <b-form-group class="col-md-6" label="">
                                
                            </b-form-group> -->
                    </b-form>
                </div>


            <!-- </sweet-modal-tab> -->

            <!-- <sweet-modal-tab title="Tab 3" id="tab3" :icon="icons.heart" disabled>Tab 3 is disabled</sweet-modal-tab> -->
            <!-- icons is an object containing SVG strings -->

            <b-btn slot="button" @click=" obtenerProductos(); $refs.detailSpeedProduct.close()">Cerrar</b-btn>
            <!-- <b-btn slot="button" variant="primary" @click="$refs.detailSpeedProduct.close()" class="ml-2">OK</b-btn> -->
          </sweet-modal>
  </div>
</template>

<style src="@/vendor/libs/vue-data-tables/vue-data-tables.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
import Vue from 'vue'
import Axios from 'axios'
import {ClientTable} from 'vue-tables-2'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import { NewProduct, UpdateProduct, GetActiveProducts, DeleteProduct } from "@/vendor/sbx/product";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import Notifications from 'vue-notification'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import VueMarkdown from 'vue-markdown'
import { SpeedController } from "@/vendor/sbx/sbx/speed_config";


import VueTypeahead from 'vue-typeahead'
import {apiconnection} from '@/vendor/sbx/conn'

Vue.use(ClientTable)
Vue.use(Notifications)
// Vue.prototype.$http = Axios


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
  extends: VueTypeahead,
  name: 'products',
  metaInfo: {
    title: 'Productos'
  },
  components: {
    SweetModal,
    VueMarkdown
  },
    data: () => ({
        contentWiki: "",
        anchorAttrs: {
            target: '_blank',
            rel: 'noopener noreferrer nofollow'
        },

        disabledcode:true,
        subtitle:"",
        infostatus:"text-success",
        variantvalue:"success",
        show:false,
        dismissCountDown:'',
        alarmaGuardarDatos: 'danger',
        dismissSecs: 5,
        dismissCountDown: 0,

        tableData:[],

        columns: [
            {key:'id_product', label:"id", thClass: 'd-none', tdClass: 'd-none'},
            {key:'complete', label:"Completo", thClass:'text-center', tdClass:'text-center'},
            {key:'code', label:"Código", thClass:'text-center', tdClass:'text-center'},
            {key:'description', label:"Descripción", thClass:'text-center', tdClass:'text-center'},
            {key:'edit', label:"Edit", thClass:'text-center', tdClass:'text-center'}],

        infoProduct:{
            idproduct:0,
            code:'',
            description:'',
        },

        currentPage: 1,
        perPage: 50,
        totalRows: 0,
        pageOptions: [ 50, 100, 200 ],
        filter: null,

        confirmMessage:"",
        codeProduct:undefined,
        description: undefined,

        ///INFO TIEMPOS
            speedTableData:[],
            columnsSpeeds: [
                {key:'id', label:"id", thClass: 'd-none', tdClass: 'd-none'},
                {key:'speed_config_id', label:"id", thClass: 'd-none', tdClass: 'd-none'},
                {key:'code', label:"Código"},
                {key:'description', label:"Descripción"},
                {key:'standard_time_cycle', label:"Ciclo Estandar"},
                {key:'unity_expected_cycle', label:"Unidades por Ciclo"},
                {key:'default', label:"Por Defecto"},
                {key:'modify_unity_expected', label:"Modificar Unidades"},
                {key:'edit', label:"Edit"}
            ],

            infoTimes: {
                id:0,
                product_id:0,
                speed_config_id:0,
                code:"",
                description:"",
                standard_time_cycle:0.0,
                unity_expected_cycle:0.0,
                default:false,
                modify_unity_expected:false
            },


            value:'',
            src: apiconnection+'speedController/search/',
            limit: 10,
            minChars: 2,
        
    }),
    methods:{
        deleteregistro: function(){
            DeleteProduct(this.infoProduct.code).then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Registro Eliminado","¡Error al Eliminar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Eliminado","¡El Registro se ha Eliminado con Éxito!")
                    }

                    this.obtenerProductos()
                })
                .catch(function (error) {
                    console.log(error.status)
            })
            
            this.$refs.errorWithButtonAlert.close()
        },
        remove: function(row){
            this.infoProduct.code=row.code
            this.infoProduct.description=row.description
            this.$refs.errorWithButtonAlert.open()
        },
        edit: function(row){
            this.dismissCountDown = 0
            this.subtitle="Modicar el Producto"
            this.infostatus="text-warning"
            this.codeProduct=undefined
            this.description= undefined

            this.infoProduct.idproduct=row.id_product
            this.infoProduct.code=row.code
            this.infoProduct.description=row.description
            this.variantvalue="warning"
            this.show = true
            this.disabledcode=true
        },
        newproduct:function(){
            this.dismissCountDown = 0
            this.subtitle="Adicionar nuevo Producto"
            this.infostatus="text-success"
            this.codeProduct=undefined
            this.description= undefined

            this.infoProduct.idproduct=0
            this.infoProduct.code=""
            this.infoProduct.description=""

            this.show=true
            this.variantvalue="success"
            this.disabledcode=false
        },
        submit: function(event){

            event.preventDefault();

            if (!this.infoProduct.code) {
                this.codeProduct=false;
                return
            } else {
                this.codeProduct=true;
            }

            if (!this.infoProduct.description) {
                this.description=false;
                return
            } else {
                this.description=true;
            }

            if(this.infoProduct.idproduct === 0){
                NewProduct(this.infoProduct).then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Guardar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Guardado","¡El Registro se ha Guardado con Éxito!")
                    }

                    this.obtenerProductos()
                })
                .catch(function (error) {
                    console.log(error.status)
                })
                 this.show=false
            }
            else{
                UpdateProduct(this.infoProduct).then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Guardar el Registro!")
                    }else{
                        this.showCustom('bg-warning text-white', "Registro Guardado","¡El Registro se ha Actualizado con Éxito!")
                    }

                    this.obtenerProductos()
                })
                .catch(function (error) {
                    console.log(error.status)
                })
                this.show=false
            }
            
        },
        obtenerProductos: function(){
            GetActiveProducts().then(data => {
                this.tableData = data.data
                this.totalRows= this.tableData.length
            })
        },
        showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
        },
        onFiltered (filteredItems) {
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        openHelp: function(){
                //  this.contentWiki = "# FFFF"
                ApiWikiHelp("products").then(data => {
                    this.contentWiki = data.data
                })
                .catch(data =>{
                    this.contentWiki = data.data
                })
                this.$refs.longModal.open()
            },



            ///Eventos CRUD
            submitSpeed: function(){

                if(this.infoTimes.speed_config_id != 0){
                    SpeedController(this.infoTimes, this.infoTimes.id === 0 ? "insert" : "update").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Guardar registro","¡Error al Guardar el Registro!")
                        }else{
                            if(this.infoTimes.id === 0)
                                this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                            else
                                this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Modificado con Éxito!")
                            this.showData()
                            this.cancel()
                            
                        }
                    })
                    .catch(function (error) {
                        console.log(error.status)
                    })
                } else {
                     SpeedController(this.infoTimes, "full_insert" ).then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Guardar registro","¡Error al Guardar el Registro!")
                        }else{
                            if(this.infoTimes.id === 0)
                                this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                            else
                                this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Modificado con Éxito!")
                            this.showData()
                            this.cancel()
                            
                        }
                    })
                    .catch(function (error) {
                        console.log(error.status)
                    })
                }
            },
            deleteSpeedRecord: function(){
                SpeedController(this.infoTimes, "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Registro Eliminado","¡Error al Eliminar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Eliminado","¡El Registro se ha Eliminado con Éxito!")
                       this.speedTableData = data.data
                    }
                    
                    this.$refs.alertSpeedDelete.close()
                    this.$refs.detailSpeedProduct.open()
                    this.showData()
                })
                .catch(function (error) {
                    console.log(error.status)
                })
                
                this.$refs.errorWithButtonAlert.close()
            },
            showData: function(){

                
                this.infoTimes.id=0,
                this.infoTimes.speed_config_id=0,
                this.infoTimes.code="",
                this.infoTimes.description="",
                this.infoTimes.standard_time_cycle=0.0,
                this.infoTimes.unity_expected_cycle=0.0,
                this.infoTimes.default=false,
                this.infoTimes.modify_unity_expected=false


                SpeedController(this.infoTimes,"select").then(data => {
                    this.speedTableData = data.data
                    //this.totalRows= this.speedTableData.length
                })
            },
            openInfoSpeed: function (item) {
                this.infoTimes.product_id = item.id_product
                
                this.showData()
                this.$refs.detailSpeedProduct.open()
            },
        ///Eventos CRUD

        ///EVENTOS TABLE
        editSpeed: function(item){
                this.infoTimes.id=item.id
                this.infoTimes.speed_config_id=item.speed_config_id
                this.infoTimes.standard_time_cycle =item.standard_time_cycle
                this.infoTimes.default =item.default
                this.infoTimes.modify_unity_expected=item.modify_unity_expected
                this.infoTimes.code =item.code
                this.infoTimes.description =item.description
                this.infoTimes.unity_expected_cycle =item.unity_expected_cycle
            
        },
        clearSepeedForm: function(){
                this.infoTimes.id=0
                this.infoTimes.speed_config_id=0
                this.infoTimes.standard_time_cycle =0.0
                this.infoTimes.default =false
                this.infoTimes.modify_unity_expected=false
                this.infoTimes.code = ""
                this.infoTimes.description =""
                this.infoTimes.unity_expected_cycle =0
            
        },
        removeSpeed:function(item){

            this.$refs.detailSpeedProduct.close()
            this.editSpeed(item)
            this.$refs.alertSpeedDelete.open()
        },
        closeAlertDeleteSpeed(){
            this.clearSepeedForm()
            this.$refs.alertSpeedDelete.close()
            this.$refs.detailSpeedProduct.open()
        },

        updateQuery () {
            this.query = this.value
            this.update()
        },
        onHit (item) {
            this.infoTimes.id=0
            this.infoTimes.speed_config_id=item.speed_config_id
            this.infoTimes.standard_time_cycle =item.standard_time_cycle
            this.infoTimes.default = false
            this.infoTimes.modify_unity_expected=false
            this.infoTimes.code =item.code
            this.infoTimes.description =item.description
            this.infoTimes.unity_expected_cycle =item.unity_expected_cycle

            this.value = ''
            this.reset()
        },
        resetInput () {
            this.value = ''
            this.reset()
        },
    },
    created: function() {
        this.obtenerProductos()
    }

}
</script>
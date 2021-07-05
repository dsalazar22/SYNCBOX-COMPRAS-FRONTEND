<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-0">{{this.selectedModule == 'mnt' ? 'Registro de Partes' : 'Configuración de Productos'}}</h4>

    <hr class="border-light container-m--x mt-0 mb-4">
    <div class="w-100 text-right">
    </div>
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
                    <b-btn variant="outline-success icon-btn" class="btn-md"  :to="{path:'product_detail/'+selectedModule+'/0'}"><i class="ion ion-md-add"></i></b-btn>&nbsp;  
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
            </b-row>

            <b-table small show-empty
                    stacked="md" :items="tableData" :fields="columns" :current-page="currentPage"
                    :per-page="perPage">
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
                            <div class="col-6 text-left"> {{ row.item.complete }} </div>
                        </div>
                    </div>
                </template>

                <template v-slot:cell(edit)="row">
                    <div class="text-left">
                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'product_detail/'+selectedModule+'/'+row.item.product_id}"><i class="ion ion-md-create"></i></b-btn>
                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="remove(row.item)"><i class="ion ion-md-close"></i></b-btn>
                    </div>
                </template>

            </b-table>

            <div class="d-flex justify-content-between">
                <div>
                    <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                </div>
                <div class="text-muted">
                   <small> Total Productos: {{this.totalRows}} </small>
                </div>
            </div>
        </div>
    </div>

    <div class="d-inline-block">
        <sweet-modal icon="error" title="Borrar Registro" ref="errorWithButtonAlert">
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
            <sweet-modal icon="error" title="Borrar Registro" ref="alertSpeedDelete">
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


        
         
            <!-- <div class="h4 text-center"> Detalle de Tiempos </div> -->
       
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
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import Notifications from 'vue-notification'
import VueMarkdown from 'vue-markdown'
import { SpeedController } from "@/vendor/sbx/sbx/speed_config";
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'

import { infomaster } from "@/components/i40/js/master";


import VueTypeahead from 'vue-typeahead'
import {apiconnection} from '@/vendor/sbx/conn'

Vue.use(ClientTable)
Vue.use(Notifications)
// Vue.prototype.$http = Axios

export default {
  extends: VueTypeahead,
  
  metaInfo: {
    title: 'Configuración de Productos'
  },
  components: {
    SweetModal,
    VueMarkdown
  },
   watch: {

        'filter':function(value){

            this.tableData = this.filter_tableData.filter(function (task) {
                if(task.code.toLowerCase().includes(value.toLowerCase()) || task.description.toLowerCase().includes(value.toLowerCase()))
                    return task
            });

            this.totalRows = this.tableData.length
            this.currentPage = 1
        },

        '$route.params.module': function(value){

            this.selectedModule = value
            // console.log(this.selectedModule)
            this.obtenerProductos()
            // console.log(value)
        }
  },
    data: () => ({
        name: 'products',
        version: 'v1.0.0.0',

        contentWiki: "",
        anchorAttrs: {
            target: '_blank',
            rel: 'noopener noreferrer nofollow'
        },

        selectedModule:'',
     
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
        filter_tableData:[],

        columns: [
            {key:'product_id', label:"id", thClass: 'd-none', tdClass: 'd-none'},
            // {key:'complete', label:"Completo"},
            {key:'code', label:"Código"},
            {key:'description', label:"Descripción"},
            {key:'family', label:"Familia"},
            {key:'type_product', label:"Tipo"},
            {key:'edit', label:"Edit"}],

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

        

            value:'',
            src: apiconnection+'speedController/search/',
            limit: 10,
            minChars: 2,

        
    }),
    methods:{
        deleteregistro: function(){
            // console.log(this.infoProduct)
            infomaster.products(this.infoProduct,"0","delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Eliminar el Registro!")
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
            this.infoProduct = row
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
            let event = "select"
            if(this.selectedModule  == "mnt"){
                event = "mnt"
            }
            
            infomaster.products(this.selectedModule,'0',event).then(data => {
                if(data.data != ""){
                    this.tableData = data.data
                    this.filter_tableData = this.tableData
                    this.totalRows= this.tableData.length
                }else{
                    this.tableData = []
                    this.filter_tableData = []
                    this.totalRows=0
                }
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

        // onFiltered (filteredItems) {
        //     this.totalRows = filteredItems.length
        //     this.currentPage = 1
        // },

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

        ///Eventos CRUD
            submitSpeed: function(){

                if(this.infoTimes.speed_config_id != 0){
                    SpeedController(this.infoTimes, this.infoTimes.id === 0 ? "insert" : "update").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error al Guardar el Registro!")
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
                            this.showCustom('bg-danger text-white', "Error","¡Error al Guardar el Registro!")
                        }else{
                            if(this.infoTimes.id === 0)
                                this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                            else
                                this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
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
                        this.showCustom('bg-danger text-white', "Error","¡Error al Eliminar el Registro!")
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
        this.selectedModule = this.$route.params.module
        this.obtenerProductos()
    },

}
</script>
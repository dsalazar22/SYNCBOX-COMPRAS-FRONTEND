<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Configuración de Plantas</h4>
        <div class="w-100 text-right"></div>
<!-- {{versionSBX}} -->
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
                    <b-btn variant="outline-success icon-btn" class="btn-md" v-if="check_access('operations_plants', 'c')" v-b-modal.modals-default @click.prevent="addData"><i class="ion ion-md-add"></i></b-btn>&nbsp;
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
                   <small> Total Plantas: {{this.totalRows}} </small>
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
                
                <template slot="button"><b-btn v-if="check_access('operations_plants', 'd')" @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

        <b-modal id="modals-top" v-model="show"  class="modal-center" size="md">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Plantas</span><br>
            <!-- <small :class="infostatus">{{subtitle}}</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group :feedback="objState.message">
                    <b-input placeholder="Descripción" :disabled="disabledcode" v-model.trim="objInfo.description" :state="objState.description!=''" v-on:input="objState.description = 'valid'; objState.description= objInfo.description==''?'invalid':'valid'"/>
                </b-form-group>
                <b-form-group :feedback="objState.message">
                    <multiselect
                        v-model="itemSF"
                        :options="itemsSF"
                        placeholder="Cuenta Secundaria"
                        label="fulldesc"
                        track-by="fulldesc" />
                </b-form-group>
                <!-- <b-form-group>
                    <b-select v-model="selectedGroup" placeholder="Grupo" :options="optionsGroups" class="flex-grow-1" />
                </b-form-group> -->
                <div>
                    <div class="row">
                        <div class="col text-center">
                            <!-- <h3>Propiedades</h3> -->
                            <b-form-group class="text-left">
                                
                                <label class="switcher switcher-success">
                                    <input type="checkbox" class="switcher-input" @change="checkActive(objInfo.active)" v-model="objInfo.active">
                                    <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                    </span>
                                    <span class="switcher-label">Activa</span>
                                </label>
                                <label class="switcher switcher-success">
                                    <input type="checkbox" class="switcher-input" :disabled="!objInfo.active" v-model="objInfo.show">
                                    <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                    </span>
                                    <span class="switcher-label">Pública</span>
                                </label>
                            </b-form-group>
                        </div>
                    </div>
                </div>
                    
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" v-if="check_access('operations_plants', 'w')"  @click="submit()">Guardar</b-btn>
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
    import { infocosts } from "@/components/i40/js/costs";
    import Multiselect from 'vue-multiselect'

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
  
    Vue.use(Notifications)

    // if (isIE10) {
    //     delete Uint8Array.prototype.foo
    //     Uint8Array.prototype.foo = undefined
    // }

    export default {
        
        metaInfo: {
            title: 'Plantas'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab,
            Multiselect
        },
        data: () => ({
            name: 'workstation_plant',
            version: 'v1.0.0.0',

            //source: new Date().toLocaleTimeString(),
            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },

            currentPage: 1,
            perPage: 50,
            totalRows: 0,
            pageOptions: [ 50, 100, 200 ],
            filter: null,
            show:false,

            deleteCode:"",
            deleteDescripcion:"",

            variantSaveButton:"success",
            disabledcode:false,
            modified:false,
            tableData: [],            

            columns: [
                {key:'description', label:"Descripción"},
                {key:'show', label:"Publica"},
                {key:'active', label:"Activa"},
                {key:'workstation_plant_id', label:"workstation_plant_id", thClass: 'd-none', tdClass: 'd-none'},
                {key:'edit', label:"Edit"}],

            objInfo: {
                id:0,
                description: "",
                show: false,
                active: false,
            },
                objState:{},   
                
            itemsSF:[],
            itemSF:{},
        }),
        methods:{

            check_access(control, action){
          return infousers.check_access(control,action)
            },
        
            onFiltered (filteredItems) {
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },

            addData:function(){
                this.objInfo = {
                    id:0,
                    description:"",
                    show: false,
                    active: false,
                }
                this.show=true
            },

            cancel: function(){
                this.objInfo = []
                this.show=false
            },

        ///Eventos CRUD
            submit: function(){
                if(this.validate_content()){
                    this.objInfo.sf_id = this.itemSF.sf_id
                infomaster.plant(this.objInfo, this.objInfo.id === 0 ? "insert" : "update").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Guardar el Registro!")
                    }else{
                        if(this.objInfo.id === 0)
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
            deleteRecord: function(){
                infomaster.plant(this.objInfo, "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Eliminar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Eliminado","¡El Registro se ha Eliminado con Éxito!")
                        this.objInfo=[]
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
                infomaster.plant([],"select").then(data => {
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

            showCustom: function(classes, title, text) {
                this.$notify({
                    group: 'notifications-default',
                    type: classes,
                    title: title,
                    text: text
                })
            },
            
            closeDeleteRecord: function(){
                this.objInfo=[]
                this.$refs.errorWithButtonAlert.close()
            },

            checkStatusPerform: function(status){
                if(status){
                    this.objInfo.performance =false
                    this.objInfo.availability =true
                }
                
            },

            data_change :function(row,action){
                this.objInfo = {
                    id:0,
                    description: "",
                    show: false,
                    active: false,
                },
                
                this.variantSaveButton="warning"
                this.objInfo.id=row.workstation_plant_id
                this.objInfo.description=row.description
                this.objInfo.show=row.show
                this.objInfo.active=row.active

                for (let index = 0; index < this.itemsSF.length; index++) {
                    const element = this.itemsSF[index];
                    if(element.sf_id == row.sf_id){
                        this.itemSF = element
                    }
                }

                if(action === "edit")
                    this.show=true
                else
                    this.$refs.errorWithButtonAlert.open()
            },

            checkActive: function(status){
                if(!status){
                    this.objInfo.show=false
                }
            },

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
        },
        created(){
            this.showData()

            infocosts.sf([],"select").then(data => {
                this.itemsSF = []
                if(data.data != ''){
                    for (let index = 0; index < data.data.length; index++) {
                        const element = data.data[index];
                        element.fulldesc = element.nit + ' ' + element.name
                        this.itemsSF.push(element)
                        
                    }
                    
                }
            })
        },
    }
</script>

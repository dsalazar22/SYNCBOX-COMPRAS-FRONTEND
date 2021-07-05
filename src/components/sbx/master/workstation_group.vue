<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Configuración Grupos - Centros de Trabajo</h4>
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
                        <b-btn variant="outline-success icon-btn" v-if="check_access('operations_workstation_groups', 'c')"  class="btn-md"  v-b-modal.modals-default @click.prevent="addData(); objState={}"><i class="ion ion-md-add"></i></b-btn>&nbsp;
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
                        <small> Total Grupos Centros de Trabajo: {{this.totalRows}} </small>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar Registro" ref="errorWithButtonAlert">
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                    El registro será borrado de forma lógica, pero la información estará visible en reportes. 
                </div>
                
                <template slot="button"><b-btn v-if="check_access('operations_workstation_groups', 'd')" @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="lg">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Grupos de Centros de Trabajo</span><br>
            <!-- <small :class="infostatus">{{subtitle}}</small> -->

            </div>
                <b-nav class="justify-content-end mb-2">
                    <b-nav tabs class="nav-sm tabs-alt">
                        <b-nav-item :active="selectTab=='infogral'"  @click="selectTab='infogral'">General</b-nav-item>
                        <b-nav-item :active="selectTab=='cvisible'"  @click="loadFields();selectTab='cvisible'">Campos Visibles</b-nav-item>
                        <b-nav-item :active="selectTab=='cusers'"  @click="selectTab='cusers'">Usuarios Autorizados</b-nav-item>
                    </b-nav>
                </b-nav> 
            <div v-if="selectTab=='cvisible'">
                <!-- :fields="columns" -->
                <b-table small show-empty stacked="md" :items="infoFields" :fields="
                    [{key:'fields_options_wsgroup_id', label:'Accion'},
                    {key:'field_order', label:'Orden Visual'},
                    {key:'new_description', label:'Descripcion'}]">

                    <template v-slot:cell(field_order)="row">
                        <div class="text-left">
                            <b-form-input placeholder="Descripción" size="sm" v-model="selectedEditRow.field_order" autocomplete="false" v-if="row.item.fields_options_wsgroup_id == selectedEditRow.fields_options_wsgroup_id && row.item.fields_options_wsgroup_id != null"></b-form-input>
                            <div v-if="row.item.fields_options_wsgroup_id != selectedEditRow.fields_options_wsgroup_id || row.item.fields_options_wsgroup_id == null">
                                {{row.item.field_order}}
                            </div>
                            
                        </div>
                    </template>

                    <template v-slot:cell(new_description)="row">
                        <div class="text-left">
                            <b-form-input placeholder="Descripción" size="sm" v-model="selectedEditRow.new_description" autocomplete="false" v-if="row.item.fields_options_wsgroup_id == selectedEditRow.fields_options_wsgroup_id && row.item.fields_options_wsgroup_id != null"></b-form-input>
                            <div v-if="row.item.fields_options_wsgroup_id != selectedEditRow.fields_options_wsgroup_id  || row.item.fields_options_wsgroup_id == null">
                                {{row.item.new_description}}
                            </div>
                        </div>
                    </template>

                    <template v-slot:cell(fields_options_wsgroup_id)="row">
                        <div class="text-left">
                            <!-- {{row.item.fields_options_wsgroup_id}} -->
                            <!-- <i class="ion ion-md-create"></i> -->
                            <b-btn variant="outline-success borderless icon-btn" v-if="row.item.fields_options_wsgroup_id && selectedEditRow.fields_options_wsgroup_id == null" class="btn-xs" @click.prevent="delete_confirmed(row.item.fields_options_wsgroup_id)"><i class="fas fa-circle"></i></b-btn> 
                            <b-btn variant="outline-danger borderless icon-btn" v-if="!row.item.fields_options_wsgroup_id && selectedEditRow.fields_options_wsgroup_id == null" class="btn-xs" @click.prevent="insert_confirmed(row.item)"><i class="fas fa-circle"></i></b-btn> 
                            <b-btn variant="outline-success borderless icon-btn" v-if="row.item.fields_options_wsgroup_id && selectedEditRow.fields_options_wsgroup_id == null"  class="btn-xs" @click.prevent="editField(row.item)"><i class="ion ion-md-create"></i></b-btn>

                            <b-btn variant="outline-success borderless icon-btn" v-if="selectedEditRow.fields_options_wsgroup_id==row.item.fields_options_wsgroup_id && selectedEditRow.fields_options_wsgroup_id != null"  class="btn-xs" @click.prevent="update_confirmed()"><i class="ion ion-md-checkmark"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn"  v-if="selectedEditRow.fields_options_wsgroup_id==row.item.fields_options_wsgroup_id && selectedEditRow.fields_options_wsgroup_id != null" class="btn-xs" @click.prevent="selectedEditRow = {}"><i class="ion ion-md-close"></i></b-btn>

                        </div>
                    </template>
                </b-table>
            </div>

            <div v-if="selectTab=='infogral'">
                <fieldset class="demo-vertical-spacing-sm">
                    <b-form-group :feedback="objState.message">
                        <b-input placeholder="Descripción" :disabled="disabledcode" autocomplete="false" v-model.trim="objInfo.description" :state="objState.description != ''" v-on:input="objState.description = 'valid'; objState.description= objInfo.description==''?'invalid':'valid'"/>
                    </b-form-group>
                    <!-- <b-form-group>
                        <b-select v-model="selectedGroup" placeholder="Grupo" :options="optionsGroups" class="flex-grow-1" />
                    </b-form-group> -->
                    <div>
                        <div class="row">
                            <div class="col text-left">
                                <!-- <h3>Propiedades</h3> -->
                                <b-form-group>
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
            </div>

            <div v-if="selectTab=='cusers'">
                <!-- @click="loadFields();selectTab='cvisible'" -->
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
                    <div class="text-right mt-2">
                        <b-btn variant="success" @click="submitUsers()">Guardar</b-btn>
                    </div>
                </b-form-group>
                
            </div>

            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" v-if="check_access('operations_workstation_groups', 'c')" @click="submit()">Guardar</b-btn>
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
    import { infoconfig } from "@/components/i40/js/config";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import draggable from 'vuedraggable/src/vuedraggable'
    import Multiselect from 'vue-multiselect'
  
    Vue.use(Notifications)

    export default {
        
        metaInfo: {
            title: 'Grupos Centros de Trabajo'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab,
            draggable,
            Multiselect
        },
        data: () => ({
            selectTab:'infogral',
            name: 'workstation_group',
            version: 'v1.0.0.0',

            user_stop_code:[],
            usersInfo : [],

            //source: new Date().toLocaleTimeString(),
            contentWiki: "# Hola",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },

            selectedEditRow:{},

            currentPage: 1,
            perPage: 50,
            totalRows: 0,
            pageOptions: [ 50, 100, 200 ],
            filter: null,
            showFormulario:false,

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
            objState: {},

            infoFields:[]
        }),
        methods:{
            editField(item){
                this.selectedEditRow=JSON.parse(JSON.stringify(item))
            },

            insert_confirmed(item){
                item.workstation_group_id = this.objInfo.id
                infoconfig.fieldsconfig(item,"insert").then(data => {
                    if(data.status == 200){
                        this.selectedEditRow = {}
                        this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                    }else{this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")}
                    this.loadFields()
                })
            },

            update_confirmed(){
                infoconfig.fieldsconfig(this.selectedEditRow,"update").then(data => {
                    this.loadFields()
                    if(data.status == 200){
                        this.selectedEditRow = {}
                        this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                    }else{this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")}
                })
            },

            delete_confirmed(item){
                infoconfig.fieldsconfig(item,"delete").then(data => {
                    if(data.status == 200){
                        this.selectedEditRow = {}
                        this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                    }else{this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")}
                    this.loadFields()
                })
            },

            loadFields(){
                infoconfig.fieldsconfig(this.objInfo.id,"select").then(data => {
                    this.infoFields = []
                    if(data.data != ''){
                        this.infoFields = data.data
                    }
                })
            },

            check_access(control, action){
             return infousers.check_access(control,action)
            },

            restartInfo(){
                this.objInfo = { 
                    id:0,
                    description: "",
                    show: false,
                    active: false
                }
                this.user_stop_code = []
            },

            onFiltered (filteredItems) {
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },

            addData:function(){
                this.restartInfo()
                this.showFormulario=true
                this.selectTab='infogral'
                this.infoFields = []
            },

            cancel: function(){
                this.restartInfo()
                this.showFormulario=false
            },
            
            submit: function(){
                if(this.validate_content()){
                    infomaster.group(this.objInfo, this.objInfo.id === 0 ? "insert" : "update").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
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
                }
            },

            deleteRecord: function(){
                infomaster.group(this.objInfo, "delete").then(data => {
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
                infomaster.group([],"select").then(data => {
                    if(data.data != ""){
                        this.tableData = data.data
                        this.totalRows= this.tableData.length
                    }else{
                        this.tableData = []
                        this.totalRows= 0
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
            
            closeDeleteRecord: function(){
                this.restartInfo()
                this.$refs.errorWithButtonAlert.close()
            },

            checkStatusPerform: function(status){
                if(status){
                    this.objInfo.performance =false
                    this.objInfo.availability =true
                }
            },

            submitUsers(){
                for (let index = 0; index < this.user_stop_code.length; index++) {
                    this.user_stop_code[index].group_id = this.objInfo.id
                }
                
                infoconfig.userswsgroup(this.user_stop_code).then(data => {
                    console.log(data.data)
                })
            },


            data_change :function(row,action){
                this.selectTab='infogral'
                this.infoFields = []
                this.variantSaveButton="warning"
                this.objInfo.id=row.workstation_group_id
                this.objInfo.description=row.description
                this.objInfo.show=row.show
                this.objInfo.active=row.active
                this.user_stop_code = []

                if(action === "edit"){
                    this.showFormulario=true
                    
                    infoconfig.getuserswsgroup(row.workstation_group_id).then(data => {
                        console.log(row.workstation_group_id, data.data)
                        for (let index = 0; index < data.data.length; index++) {
                            const element = data.data[index];

                            for (let index2 = 0; index2 < this.usersInfo.length; index2++) {
                                const element2 = this.usersInfo[index2];
                                if(element2.iduser == element.iduser){
                                    this.user_stop_code.push(element2)
                                }
                            }
                        }
                    })
                }
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
            infomaster.getusers().then(data => {
                // console.log(data.data)
                this.usersInfo=[]
                if(data.data != ""){
                    this.usersInfo = data.data
                }
            })
        },
    }
</script>

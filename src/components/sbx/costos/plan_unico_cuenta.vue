<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Plan Unico de Cuentas - PUC</h4>
        <div class="w-100 text-right"></div>
        
        <b-nav class="justify-content-end mt-2 mb-2">
            <b-nav tabs class="nav-sm tabs-alt">
                <b-nav-item :active="selectTab=='ver_registros'" @click="selectTab='ver_registros'">Ver Registros</b-nav-item>
                <b-nav-item :active="selectTab=='subir_archivos'" @click="selectTab='subir_archivos'">Subir Maestros</b-nav-item>
            <!-- <b-nav-item disabled>Disabled</b-nav-item> -->
            </b-nav>
        </b-nav>

        <div class="row" v-if="selectTab=='ver_registros'">
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
                    <b-btn variant="outline-success icon-btn" class="btn-md" v-if="check_access('admin_um', 'c')" v-b-modal.modals-default @click.prevent="addData();objState={}"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="check_access('admin_um', 'c')" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                    <template v-slot:cell(t_account)="row">
                        <div class="text-left">
                            <!-- <i class="ion ion-md-create"></i> -->
                        <span style="color:#0275d8;" v-if="!row.item.t_account"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.t_account"><i class="ion ion-md-add-circle"></i></span>
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
                        <small> Total Registros: {{this.totalRows}} </small>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="selectTab=='subir_archivos'">
            <div>
                    <b-form-file
                        v-if="!file1"
                            v-model="file1"
                            :state="Boolean(file1)"
                            placeholder="Seleccion un archivo o arrastre aqui..."
                            drop-placeholder="Arrastre un archivo aqui..."></b-form-file>

                    <div v-if="file1" class="text-center">
                        <b>Archivo Seleccionado:</b> {{ file1 ? file1.name : '' }}
                    </div>
                    <div class="row" v-if="file1 && !archivook">
                        <div class="col">
                            <b-btn variant="warning" block @click="file1=null; tableDataPreImport=[]; archivook=false "><i class="ion ion-md-close"> </i> &nbsp;&nbsp; Cargar Otro Archivo</b-btn>
                        </div>
                        <div class="col">
                            <b-btn variant="info" block @click="cargarArchivo" ><i class="ion ion-md-checkmark"></i> &nbsp;&nbsp; Subir Archivo</b-btn>
                        </div>
                    </div>
                    <div class="row" v-if="archivook">
                        <div class="col">
                            <b-btn variant="warning" block @click="file1=null; tableDataPreImport=[]; archivook=false "><i class="ion ion-md-close"> </i> &nbsp;&nbsp; Cargar Otro Archivo</b-btn>
                        </div>
                        <div class="col">
                            <b-btn variant="success" block @click="confirmarArchivo" ><i class="ion ion-md-checkmark"></i> &nbsp;&nbsp; Confirmar Archivo</b-btn>
                        </div>
                    </div>

                    <b-table small show-empty stacked="md" :items="tableDataPreImport" :fields="columnsPreImport" class="mt-2">
                        <template v-slot:cell(codigo)="row">
                            <div class="text-left">
                                <!-- <i class="ion ion-md-create"></i> -->
                            <span style="color:red" v-if="!row.item.tipos_de_cuenta_id"><i class="fas fa-circle"></i></span>
                            <span style="color:green" v-if="row.item.tipos_de_cuenta_id"><i class="fas fa-circle"></i></span>
                                {{row.item.codigo}}
                            </div>
                        </template>
                        <template v-slot:cell(t_account)="row">
                            <div class="text-left">
                                <!-- <i class="ion ion-md-create"></i> -->
                                    <span style="color:#0275d8;" v-if="!row.item.bool_account"><i class="fas fa-circle"></i></span>
                                    <span style="color:green" v-if="row.item.bool_account"><i class="fas fa-circle"></i></span>
                                {{row.item.t_account}}
                            </div>
                        </template>
                    </b-table>
            </div>
        </div>

        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                    El registro será borrado de forma lógica, pero su información será visible en reportes. 
                </div>
                
                <template slot="button"><b-btn v-if="check_access('admin_um', 'd')" @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="md">
            <div slot="modal-title">
            Plan Unico de Cuentas <span class="font-weight-light">PUC</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group :feedback="objState.message" label="Numero de Cuenta">
                    <b-input placeholder="Numero de Cuenta" v-model.trim="objInfo.code"/>
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Descripción">
                    <b-input placeholder="Descripción" v-model.trim="objInfo.description" />
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Tipo de Cuenta">
                    <multiselect
                        v-model="selectedTipoCuenta"
                        :options="tipoCuentas"
                        placeholder="Tipo de Cuenta"
                        label="description"
                        track-by="description" />
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Factor">
                    <div class="row">
                        <div class="col"><b-check v-model="objInfo.type_primary" @change="objInfo.type_secundary = objInfo.type_primary" >Cuenta Primaria</b-check></div>
                        <div class="col"><b-check v-model="objInfo.type_secundary" @change="objInfo.type_primary = objInfo.type_secundary">Cuenta Secundaria</b-check></div>
                    </div>
                </b-form-group>
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" v-if="check_access('admin_um', 'c')" @click="submit()">Guardar</b-btn>
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { infocosts } from "@/components/i40/js/costs";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
    import Multiselect from 'vue-multiselect'

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import {infousers} from '@/components/i40/js/users'
  
    Vue.use(Notifications)

    export default {
    
        metaInfo: {
            title: 'PUC'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab,
            Multiselect
        },
        data: () => ({
            name: 'um',
            version: 'v1.0.0.0',

            selectTab:'ver_registros',

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
            selectedTipoCuenta:{},
            tipoCuentas:[],

            file1:null,
            archivook:false,


            /**
            columns: [
                {key:'description', label:"Descripcion"},
                {key:'workstation_plant_id', label:"workstation_plant_id", thClass: 'd-none', tdClass: 'd-none'},
            ], 
             */

            /// Columnas de las tablas
                columns: [
                    {key:'code', label:"Numero de Cuenta"},
                    {key:'description', label:"Descripción"},
                    {key:'t_account', label:"Tipo (Primaria/Secundaria)"},
                    // {key:'rounding', label:"Redondeo"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Editar/Eliminar"}
                ],

                columnsPreImport: [
                    {key:'codigo', label:"Codigo"},
                    {key:'description', label:"Descripción"},
                    {key:'tiposcuenta', label:"Tipo Cuenta"},
                    {key:'t_account', label:"Tipo (Primaria/Secundaria)"},
                ],
                
                tableDataPreImport:[],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    code:"",
                    description:"",
                    type_primary:true,
                    type_secundary:false, 
                    tipos_de_cuenta_id: 0,
                    puc_id:0
                },
                objState:{},
            ///

        }),
        methods:{
            cargarArchivo(){
                infocosts.uploadFile('puc', this.file1).then(data =>{
                    this.tableDataPreImport=[]

                    if(data.data != ""){
                        this.tableDataPreImport=data.data

                        this.archivook=true

                        for (let index = 0; index < this.tableDataPreImport.length; index++) {
                            const element = this.tableDataPreImport[index];

                            if(!element.tipos_de_cuenta_id){
                                this.archivook= false
                                break
                            }
                        }
                    }
                })
            },

            confirmarArchivo(){
                infocosts.uploadFile('confirm_puc', this.file1).then(data =>{
                    this.tableDataPreImport=[]
                    if(data.status == 200){
                        this.showCustom('bg-success text-white', "Importacion","¡La importacion fue exitosa!")
                        this.showData()
                    }
                    else{
                        this.showCustom('bg-danger text-white', "Importacion","¡Hubo algun error al cargar la informacion, revise por favor!")
                    }
                })
            },

            check_access(control, action){
                return infousers.check_access(control,action)
            },
        ///Funcion para reiniciar los datos
            restartInfo(){
                 this.objInfo= {
                    code:"",
                    description:"", 
                    type_primary:true,
                    type_secundary:false, 
                    tipos_de_cuenta_id: 0,
                    puc_id:0
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
                this.objInfo.t_account = this.objInfo.type_primary
                this.objInfo.tipos_de_cuenta_id = this.selectedTipoCuenta.tipos_de_cuenta_id
                if(this.validate_content()){
                    infocosts.puc(this.objInfo, this.objInfo.puc_id === 0 ? "insert" : "update").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                        }else{
                            if(this.objInfo.puc_id === 0)
                                this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
                            else
                                this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
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
                infocosts.puc(this.objInfo, "delete").then(data => {
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
                infocosts.puc([],"select").then(data => {
                    this.tableData = []
                    this.totalRows= 0
                    if(data.data != ''){
                        this.tableData = data.data
                        this.totalRows= this.tableData.length
                    }
                })
            },
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.variantSaveButton="warning"

                ////Informacion que será modificada o borrada
                
                
                if(action === "edit"){
                    this.showFormulario=true
                    this.objInfo.puc_id = row.puc_id
                    this.objInfo.type_primary = row.t_account ? true : false
                    this.objInfo.type_secundary = !row.t_account ? true : false
                    this.objInfo.code = row.code
                    this.objInfo.description = row.description
                    this.objInfo.tipos_de_cuenta_id = row.tipos_de_cuenta_id
                    
                    for (let index = 0; index < this.tipoCuentas.length; index++) {
                        const element = this.tipoCuentas[index];
                        if(element.tipos_de_cuenta_id == row.tipos_de_cuenta_id){
                            this.selectedTipoCuenta = element
                        }
                        
                    }
                }
                else{
                    this.objInfo=row
                    this.$refs.errorWithButtonAlert.open()
                }
            },
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
             validate_content(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este es un Campo Obligatorio'

                if (this.objInfo.code == ''){
                    this.objState.code = 'invalid'
                    isOK = false;
                }else{
                    this.objState.code = 'valid'
                }
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

            infocosts.tiposCuentas([],"select").then(data => {
                this.tipoCuentas = []
                if(data.data != ''){
                    this.tipoCuentas = data.data
                }
            })
        },
    }
</script>

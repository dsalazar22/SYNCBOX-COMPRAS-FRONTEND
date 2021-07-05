<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Administración de Formularios</h4>
        <div class="w-100 text-right"></div>
        
        <div class="row">
            <div class="col">
                <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            <b-row>
                <!-- BUSCADOR Y EL BOTON PARA BORRAR -->
                <b-col md="5" class="my-1">
                    <b-input-group>
                        <b-form-input v-model="filter" placeholder="Buscar..." />
                        <b-input-group-append>
                        <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
                <!-- PAGER OPTION SELECTOR-->
                <b-col md="5" class="my-1">
                    <b-form-select :options="pageOptions" v-model="perPage" />
                </b-col>
                <!-- NEW REGISTERS AND HELP BUTTONS -->
                <b-col md="2" class="d-flex justify-content-center my-1">
                    <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="addData();objState={}"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
            </b-row>
            <!-- TABLE INI-->
                <b-table small show-empty stacked="md" :items="tableDataForm" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn> -->
                        </div>
                    </template>
                     <!-- <template v-slot:cell(fields)="row">
                            <ul class="list-unstyled">
                                <li v-for="(i, index) in row.item.fields" :key="`i-${index}`">
                                    <b-form-group>
                                    <b-button size="sm" variant="primary">{{i.label}}</b-button>
                                    </b-form-group>
                                </li>
                            </ul>
                    </template> -->


                    <template v-slot:cell(is_active)="row">
                        <div class="text-left">
                            <span style="color:red" v-if="!row.item.is_active"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.is_active"><i class="ion ion-md-add-circle"></i></span>
                            <!-- <label class="switcher switcher-success mt-2">
                                <input type="checkbox" class="switcher-input" onclick="return false" v-model="row.item.status">
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <span class="switcher-label"></span>
                             </label> -->
                        </div>
                    </template>
                </b-table>
                <!-- TABLE END-->
                <!-- PAGER GROUP SELECTOR-->
                 <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div class="text-muted">
                        <small> Total Formularios: {{this.totalRows}} </small>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                    El registro será borrado de forma lógica, pero su información será visible en reportes. 
                </div>
                <template slot="button"><b-btn @click="deleteRecord();" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord(); showFormulario = true; deleteRecordField=false; deleteForm = false;" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>
    <!-- NEW MODAL INI-->
        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="lg" :no-close-on-backdrop="true" :no-close-on-esc="true" :hide-header-close="true">
            <div slot="modal-title">
                Administrar <span class="font-weight-light">Formularios</span><br>
                <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
                <!-- <div v-if="!showForm1"> -->
                <!-- <fieldset class="demo-vertical-spacing-sm"> -->
                    <h5>Definición del Formulario</h5>
                    <!-- <b-container fluid> -->
                        <b-row>
                            <b-col> 
                                <b-form-group label="Nombre del Formulario" :feedback="objState.message">
                                    <b-input placeholder="Nombre Formulario" type="text" v-model.trim="objInfo.description" :state="objState.description!=''" v-on:input="objState.description; objState.description= objInfo.description==''?'invalid':'valid'"/>
                                </b-form-group>
                            </b-col>
                             <!-- <b-col> 
                                <b-form-group label="Detalle" :feedback="objState.message">
                                    <b-input placeholder="Detalle" type="text" v-model.trim="objInfo.detail" :state="objState.detail" v-on:input="objState.detail = 'invalid'; objState.detail= objInfo.detail==''?'invalid':'valid'"/>
                                </b-form-group>
                            </b-col>  -->
                            <!-- <b-col>
                                <b-form-group label="Módulo" :feedback="objState.message">
                                    <b-input placeholder="Módulo" type="text" v-model.trim="objInfo.module" :state="objState.module" v-on:input="objState.module = 'invalid'; objState.module= objInfo.module==''?'invalid':'valid'"/>
                                </b-form-group>
                            </b-col> -->
                        </b-row>
                        <!-- <b-row>
                           
                        </b-row> -->
                        
                        <b-row>
                            <b-col class="text-right">
                                <label class="switcher switcher-success mt-2">
                                    <input type="checkbox" class="switcher-input" v-model="objInfo.is_active">
                                    <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                    </span>
                                    <span class="switcher-label">Estado</span>
                                </label>
                            </b-col>
                        </b-row>
                    <!-- </b-container> -->

                    <hr>
                    
                    <h5>Campos del Formulario</h5>
                    <div class="rounded mt-2">
                        <div class="ml-2 mr-2">
                            <b-row>
                                <b-col cols="2">
                                    <b-form-group label="Seq" :feedback="objStateField.field_id">
                                        <b-input placeholder="Seq" required v-model.trim="objField.field_sequence" :state="objStateField.field_sequence!=0" v-on:input="objStateField.field_sequence = 'invalid'; objStateField.field_sequence= objField.field_sequence==''?'invalid':'valid'"/>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group label="Identificador" :feedback="objStateField.field_id">
                                        <b-input placeholder="Identificador" :disabled="showFormField" type="text" required v-model.trim="objField.field_id" :state="objStateField.field_id!=''" v-on:input="objStateField.field_id = 'invalid'; objStateField.field_id= objField.field_id==''?'invalid':'valid'"/>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group label="Adicionar nueva Etiqueta" :feedback="objStateField.message">
                                        <b-input placeholder="Nombre de etiqueta" type="text" required v-model.trim="objField.label" :state="objStateField.label!=''" v-on:input="objStateField.label = 'invalid'; objStateField.label= objField.label==''?'invalid':'valid'"/>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group label="Tipo" :feedback="objStateField.message">
                                        <b-form-select :options="typeOptions" v-model="objField.type" />
                                    </b-form-group> 
                                </b-col>
                            </b-row>
                        </div>
                    </div>
                    <div class="text-right mb-2">
                        <!-- ADD REGISTER AND HELP BUTTONS -->
                        <b-btn v-if="!showFormField" variant="outline-success icon-btn" class="btn-md" @click.prevent="addDataLabels();objStateField={}"><i class="ion ion-md-add"></i></b-btn>
                        <b-btn v-if="showFormField" variant="outline-warning icon-btn" class="btn-md" @click.prevent="addDataLabels();objStateField={}"><i class="ion ion-md-add"></i></b-btn>
                        <b-btn variant="outline-info icon-btn" class="btn-md" @click.prevent="showFormField = false; objField={}"><i class="ion ion-md-close"></i></b-btn>&nbsp;
                        <!-- <b-btn variant="outline-info icon-btn" class="btn-md"  @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn> -->
                    </div>
                     <!-- SUB-TABLE INI -->   
                    <b-table small show-empty stacked="md" :items="objInfo.fields" :fields="formFields" :current-page="currentPageField" :per-page="perPageField" 
                        :filter="filterField" @filtered="onFilteredField">
                        <template v-slot:cell(edit)="row">
                            <div class="text-left">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="data_changeField(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_changeField(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                            </div>
                        </template>
                        <template v-slot:cell(is_active)="row">
                            <div class="text-left">
                                <label class="switcher switcher-success mt-2">
                                    <input type="checkbox" class="switcher-input" onclick="return false" v-model="row.item.is_active">
                                    <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                    </span>
                                    <span class="switcher-label"></span>
                                </label>
                            </div>
                        </template>
                    </b-table>
                    <!-- SUB-TABLE END --> 
                    <!-- PAGER INI -->
                        <b-row>    
                            <b-col md="3" class="my-1">
                                <b-form-select :options="pageOptionsField" v-model="perPageField" />
                            </b-col>
                            <b-col md="4" class="my-1">
                                <div class="d-flex justify-content-between">
                                    <b-pagination :total-rows="totalRowsField" :per-page="perPageField" v-model="currentPageField" class="d-flex justify-content-center my-0" />
                                </div>
                            </b-col>
                            <b-col md="4" class="my-1">
                                <div class="text-muted">
                                    <small> Total Campos: {{this.totalRowsField}} </small>
                                </div>
                             </b-col>
                        </b-row>
                    <!-- PAGER END -->
                <!-- </fieldset> -->
            <!-- </div> -->
            <!-- <div v-if="showForm1">
                <fieldset class="demo-vertical-spacing-sm">
                    <b-form-group label="Etiqueta" :feedback="objStateFieldUpdate.message">
                        <b-input placeholder="Nombre de etiqueta" type="text" required v-model.trim="objFieldUpdate.label" :state="objStateFieldUpdate.label" v-on:input="objStateFieldUpdate.label = 'invalid'; objStateFieldUpdate.label= objFieldUpdate.label==''?'invalid':'valid'"/>
                    </b-form-group>
                    <b-form-group label="Tipo" :feedback="objStateFieldUpdate.message">
                        <b-form-select :options="typeOptions" :state='valid' v-model="objFieldUpdate.type" />
                    </b-form-group> 
                    <b-btn variant="outline-info icon-btn" class="btn-md"  @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </fieldset>
            </div> -->
            <div slot="modal-footer" class="w-100 text-right">
                <div class="d-flex justify-content-between">
                    <div>
                        <b-btn variant="danger" @click="showFormulario = false; deleteForm=true; $refs.errorWithButtonAlert.open();">Eliminar</b-btn>                    
                    </div>
                    <div>
                        <b-btn :variant="variantSaveButton" @click="submit_form()">Guardar</b-btn>
                        <b-btn variant="primary" @click="cancel(); showFormulario = false;">Cancelar</b-btn>
                    </div>
                </div>
            </div>
                
        </b-modal>
        <!-- NEW MODAL END-->
    </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { infosysconfig } from "@/components/i40/js/sysconfig";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
  
    Vue.use(Notifications)

    export default {
    
        metaInfo: {
            title: 'Formularios'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab
        },
        data: () => ({
            name: 'um',
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
                currentPageField: 1,
                perPageField: 50,
                totalRowsField: 0,  
                pageOptionsField: [ 50, 100, 200 ],
                typeOptions: [ "numero", "texto","titulo" ],
                filter: null,
                filterField: null,
            ///Info de filtro y paginas para la tabla


            deleteRecordField: false,
            deleteForm: false,


            showFormulario:false,
            showFormField:false,
            showTooltip: true,
            showForm1:false,

            variantSaveButton:"success",
            disabledcode:false,
            modified:false,
            tableDataForm:[],

            /// Columnas de la tabla Formularios
                columns: [
                    {key:'description', label:"Nombre Formulario"},
                    {key:'is_active', label:"Estado"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Editar"},
                ],
            /// Columnas de la tabla Formularios

            // Columnas de la subtabla Campos del formmulario
                formFields: [
                    {key:'field_sequence', label:"Seq"},
                    {key:'field_id', label:"Codigo"},
                    {key:'label', label:"Etiqueta"},
                    {key:'type', label:"Tipo"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Editar/Eliminar"}
                ],
            // Columnas de la subtabla Campos del formmulario


            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    forms_id:0,
                    is_active:true, 
                    description:"",
                    fields:[],
                },
                objState:{
                },
            /// Objeto hijo de campos del formulario
                objField: {
                    field_id:"",
                    field_order: 0,
                    label:"", 
                    type:"",
                },
                objStateField:{
                },
                
                objStateFieldUpdate:{
                },
                
            ///

        }),
        methods:{
        ///Funcion para reiniciar los datos
            restartInfo(){
                 this.objInfo= {
                    forms_id:0,
                    is_active:true, 
                    description:"",
                    fields:[],
                    },
                 this.objField= {
                    field_id:0,
                    label:"", 
                    type:"",
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
            onFilteredField (filteredItems) {
                this.totalRowsField = filteredItems.length
                this.currentPageField = 1
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

            addDataLabels:function(){

                if(!this.validate_content_field()){
                    this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
                    return 
                }

                if(this.showFormField){
                    for (let index = 0; index < this.objInfo.fields.length; index++) {
                        const element = this.objInfo.fields[index];
                        if(this.objInfo.fields[index].field_id == this.objField.field_id){
                            this.objInfo.fields[index] = this.objField
                        }
                    }
                    this.objInfo.fields.push('')
                    this.objInfo.fields.pop()
                }else{
                    if(this.validate_content_field()){
                        // this.objField.field_id++;
                        let newFieldJSN = JSON.parse(JSON.stringify(this.objField))
                        this.objInfo.fields.push(newFieldJSN);
                        this.objField= {
                            field_id:"",
                            label:"", 
                            type:"",
                        }
                    }
                }

                this.objInfo.fields.sort((a,b) => (a.field_order > b.field_order) ? 1 : ((b.field_order > a.field_order) ? -1 : 0)); 
            },

            cancel: function(){
                this.restartInfo()
                if(this.showForm1){
                    this.showForm1=false;
                }else{
                    this.showFormulario=false;
                }                

            },

            closeFormField: function(){
                
                this.showForm1=false;
            },

            closeDeleteRecord: function(){
                // this.restartInfo()
                this.$refs.errorWithButtonAlert.close()
            },
        ///Adicionar un nuevo dato, cancelar el ingreso, cancelar el borrado de un dato

        ///Eventos CRUD
            submit_form: function(){
                if(this.validate_content()){
                    infosysconfig.forms(this.objInfo, this.objInfo.forms_id === 0 || this.objInfo.forms_id === undefined ? "insert" : "update").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                        }else{
                            if(this.objInfo.forms_id === 0)
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
                if(this.deleteForm){
                    infosysconfig.forms(this.objInfo, "delete").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error al Eliminar el Registro!")
                        }else{
                            this.showCustom('bg-success text-white', "Registro Eliminado","¡El Registro se ha Eliminado con Éxito!")
                            this.restartInfo()
                        }
                        this.dismissCountDown = this.dismissSecs
                        this.$refs.errorWithButtonAlert.close()
                        this.showFormulario = false
                        this.showData()
                    })
                    .catch(function (error) {
                        console.log(error.status)
                    })
                    
                }else{
                    for (let index = 0; index < this.objInfo.fields.length; index++) {
                        const element = this.objInfo.fields[index];
                        if(this.objInfo.fields[index].field_id == this.objField.field_id){
                            this.objInfo.fields.splice(index, 1); 
                        }
                    }
                    this.objInfo.fields.sort((a,b) => (a.field_order > b.field_order) ? 1 : ((b.field_order > a.field_order) ? -1 : 0)); 
                    this.showFormulario = true
                    this.$refs.errorWithButtonAlert.close()
                    
                }
            },
            showData: function(){
                infosysconfig.forms([],"select").then(data => {
                    if(data.data != ""){
                        this.tableDataForm = data.data
                        this.totalRows= this.tableDataForm.length
                    }
                })
            },
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.variantSaveButton="warning"
                ////Informacion que será modificada o borrada
                this.objInfo=row
                
                
                if(action === "edit"){
                    this.showFormulario=true
                }
                else
                    this.$refs.errorWithButtonAlert.open()
            },

            data_changeField :function(row,action){
                this.variantSaveButton="warning"               
                // this.showForm1 = true;
                ////Informacion que será modificada o borrada
                // this.objInfo = row;
                this.objField = JSON.parse(JSON.stringify(row));

                if(action === "edit"){
                    this.showFormField=true
                }
                else{
                    this.showFormulario = false
                    this.$refs.errorWithButtonAlert.open()
                }
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

            validate_content_field(){
                let isOK = true;
                this.objStateField = {}
                this.objStateField.message = 'Este es un Campo Obligatorio'
                
                if (this.objField.field_id == ''){
                    this.objStateField.field_id = 'invalid'
                    isOK = false;
                }else{
                    this.objStateField.field_id = 'valid'
                }

                if (this.objField.label == ''){
                    this.objStateField.label = 'invalid'
                    isOK = false;
                }else{
                    this.objStateField.label = 'valid'
                }

                if (this.objField.type == ''){
                     this.objStateField.type = 'invalid'
                     isOK = false;
                }else{
                    this.objStateField.type = 'valid'
                }

                return isOK
            },

        ///Espacio para metodos propios del control
        ///Espacio para metodos propios del control
        
        },
        created(){
            this.showData() 
        },
    }
</script>

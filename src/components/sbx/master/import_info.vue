<template>
    <div>
        <notifications group="notifications-default" />
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
                            <b-btn variant="danger" block @click="confirmarArchivo" ><i class="ion ion-md-checkmark"></i> &nbsp;&nbsp; Reemplazar Informacion</b-btn>
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
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
    import Multiselect from 'vue-multiselect'

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import {infousers} from '@/components/i40/js/users'
    import { infomaster } from '@/components/i40/js/master'
  
    Vue.use(Notifications)

    export default {
    
        metaInfo: {
            title: 'Cargar Informacion Maestros'
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

                columnsPreImport: [
                    {key:'codigo', label:"Codigo"},
                    {key:'description', label:"Descripción"},
                    {key:'unity_measure', label:"Unidad Medida"},
                    {key:'version', label:"Version"},
                    {key:'sequence', label:"Secuencia"},
                    {key:'process_definition', label:"Definicion Proceso"},
                    {key:'operation', label:"Operacion"},
                    {key:'scrap', label:"% Desperdicio"},
                    {key:'production_per_hour', label:"Produccion HM"},
                    {key:'production_per_hh', label:"produccion HH"},
                    {key:'kw_per_hour', label:"Kw por Hora"},
                    {key:'kcal_per_hour', label:"Kcal por Hora"},
                    {key:'preparation_minutes', label:"Tiempo Preparacion (min)"},
                    {key:'operators', label:"Operarios"},
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
                infomaster.uploadFile('rshort/false', this.file1).then(data =>{
                    this.tableDataPreImport=[]

                    if(data.data != ""){
                        this.tableDataPreImport=data.data

                        this.archivook=true

                        // for (let index = 0; index < this.tableDataPreImport.length; index++) {
                        //     const element = this.tableDataPreImport[index];

                        //     if(!element.tipos_de_cuenta_id){
                        //         this.archivook= false
                        //         break
                        //     }
                        // }
                    }
                })
            },

            confirmarArchivo(){
                infomaster.uploadFile('rshort/ok', this.file1).then(data =>{
                    // this.tableDataPreImport=[]
                    if(data.status == 200){
                        this.showCustom('bg-success text-white', "Importacion","¡La importacion fue exitosa!")
                        // this.showData()
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
                    // infocosts.puc(this.objInfo, this.objInfo.puc_id === 0 ? "insert" : "update").then(data => {
                    //     if (data.status === 202){
                    //         this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    //     }else{
                    //         if(this.objInfo.puc_id === 0)
                    //             this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
                    //         else
                    //             this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                    //         this.showData()
                    //         this.cancel()
                            
                    //     }
                    // })
                    // .catch(function (error) {
                    //     console.log(error.status)
                    // })
                    }else{
                    this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
                }
            },
            
            
            showData: function(){
                
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
        },
    }
</script>

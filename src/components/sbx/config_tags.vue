<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Series de Tiempo - Configuración Tags</h4>
        <div class="w-100 text-right"></div>
        
        <div class="row">
            <div class="col">
                <b-row>
                    <b-col md="6" class="my-1">
                        <!-- <b-form-group horizontal label="Filtrar" class="mb-0"> -->
                        <b-input-group>
                            <b-form-input v-model="filter" placeholder="Buscar..." />
                            <b-input-group-append>
                            <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                            </b-input-group-append>
                        </b-input-group>
                        <!-- </b-form-group> -->
                    </b-col>
                    <b-col md="6" class="my-1">
                        <b-form-select :options="pageOptions" v-model="perPage" />
                    </b-col>
                </b-row>
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(codigocentrotrabajo)="props">
                        <div class="text-left">
                           <i v-if="props.item.status == 'true'" class="fas fa-circle text-success"></i>
                            <i v-if="props.item.status == 'false' || props.item.status == undefined" class="fas fa-circle text-danger"></i>
                            {{props.item.codigocentrotrabajo}}
                        </div>
                    </template>
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs"  @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn> -->
                        </div>
                    </template>
                </b-table>
                 <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                <div class="text-muted">
                   <small> Total Configuración de Tags: {{this.totalRows}} </small>
                 </div>
                    </div>
            </div>
        </div>


        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="md">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Tags</span><br>
            <small></small>
            </div>
            <div class="h4 mb-0 text-center">{{objInfo.tag}}</div><br>
            <fieldset class="demo-vertical-spacing-sm">                
                <b-form-group :label="'Número de Decimales (Valor/' + Math.pow(10, objInfo.decimal_places) + ')'">
                    <b-input type="number" placeholder="Número de Decimales" :disabled="disabledcode" v-model="objInfo.decimal_places" />
                </b-form-group>
                <b-form-group label="Límite Inferior">
                    <b-input type="number" placeholder="Límite Inferior" :disabled="disabledcode" v-model.trim="objInfo.lower_limit" />
                </b-form-group>
                <b-form-group label="Límite Superior">
                    <b-input type="number" placeholder="Límite Superior" :disabled="disabledcode" v-model.trim="objInfo.upper_limit" />
                </b-form-group>
                <b-form-group label="">
                    <b-form-checkbox
                        v-model="objInfo.status"
                        value="true"
                        unchecked-value="false"
                        >
                        Activar Almacenamiento de la Variable
                    </b-form-checkbox>
                </b-form-group>
                
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" v-if="check_access('floor_tags', 'c')" @click="submit()">Guardar</b-btn>
            </div>
                <!-- </b-card> -->
        </b-modal>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { infotimeseries } from "@/components/i40/js/timeseries";

    import Notifications from 'vue-notification'
    
  
    Vue.use(Notifications)

    export default {
        
        metaInfo: {
            title: 'Configuración Tags'
        },
        components: {
            // VueMarkdown,
            SweetModal,
            SweetModalTab
        },
        data: () => ({
            name: 'configs_tag',
            version: 'v1.0.0.0',
           
            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },

            options: [
                { text: 'Segundos', value: 's' },
                { text: 'Minutos', value: 'm' },
                { text: 'Horas', value: 'h' },
            ],

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

            /// Columnas de las tablas
                columns: [
                    // {key:'id', label:'id', thClass: 'd-none', tdClass: 'd-none'},
                    {key:'codigocentrotrabajo', label:'Centro Trabajo'},
                    {key:'tag_name', label:'Tag'},
                    {key:'decimal_places', label:'Número de Decimales'},
                    {key:'lower_limit', label:'Límite Inferior'},
                    {key:'upper_limit', label:'Límite Superior'},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Edit"}
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    decimal_places:0,
                },
            ///

        }),
        methods:{
            check_access(control, action){
            return true //infousers.check_access(control,action)
            },
        ///Funcion para reiniciar los datos
            restartInfo(){
                this.objInfo = {
                    decimal_places:0,
                    lower_limit:0,
                    upper_limit:0
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

        ///Eventos CRUD
            submit: function(){
                infotimeseries.tagcontroller(this.objInfo, `tags:${this.objInfo.codigocentrotrabajo}:${this.objInfo.tag_name}`, "modify",).then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                        this.showData()
                        this.cancel()
                        
                    }
                })
                .catch(function (error) {
                    console.log(error.status)
                })
            },

            showData: function(){
                infotimeseries.tagcontroller("[]", "_", "get").then(data =>{
                    this.tableData = Object.values(data.data)
                    this.totalRows= this.tableData.length
                })
            },
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.variantSaveButton="warning"

                ////Informacion que será modificada o borrada
                this.objInfo.status = row.status
                this.objInfo.tag = row.tag_name
                this.objInfo.tag_name = row.tag_name
                this.objInfo.codigocentrotrabajo = row.codigocentrotrabajo
                this.objInfo.decimal_places  = row.decimal_places == null || row.decimal_places == undefined ? 0 : row.decimal_places
                this.objInfo.lower_limit  = row.lower_limit == null || row.lower_limit == undefined ? 0 : row.lower_limit
                this.objInfo.upper_limit  = row.upper_limit == null || row.upper_limit == undefined ? 0 : row.upper_limit
                
                if(action === "edit")
                    this.showFormulario=true
                else
                    this.$refs.errorWithButtonAlert.open()
            },
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

        ///Espacio para metodos propios del control
        ///Espacio para metodos propios del control
        
        },
        created(){
            this.showData()
        },
        mounted () {
        }
    }
</script>

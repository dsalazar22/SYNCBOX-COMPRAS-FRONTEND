<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Configuración de Contadores</h4>
        <div class="w-100 text-right"></div>
        
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
                    <b-col md="2" class="my-1">
                        <b-btn variant="outline-success icon-btn" @click.prevent="newOwnerTags()"><i class="ion ion-md-add"></i></b-btn>
                    </b-col>
                </b-row>
                
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(tag_name)="props"> 
                        <div class="text-left">
                            {{props.item.tag_name}}
                        </div>
                    </template> 
                    <template v-slot:cell(max_value)="props"> 
                        <div class="text-left">
                            <i class="ion ion-md-stopwatch text-info" v-if="props.item.counter_type == 'Timers'"></i>
                            <i class="ion ion-md-calculator text-info" v-if="props.item.counter_type != 'Timers'"></i>
                            &nbsp;&nbsp;
                            {{props.item.max_value + (props.item.counter_type == 'Timers' ? ' ('+props.item.time_option +')' : '')}} 
                        </div>
                    </template>
                    <template v-slot:cell(edit)="row"> 
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs"  @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                </b-table>

                <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div class="text-muted">
                        <small> Total de Tags Configurados: {{this.totalRows}} </small>
                    </div>
                </div>
            </div>
        </div>

        <b-modal id="modals-top" v-model="showFormulario" no-close-on-backdrop class="modal-center" size="xl">
            <div slot="modal-title">
                Administrar Tableros <span class="font-weight-light">Alarmas</span><br>
                <small class="text-danger">No use caracteres especiales en ninguno de los textos, ej. (tildes, ñ, %, @, etc)</small>
            </div>
            <b-row>
                <b-col md="4">
                    <h4>Atención:</h4> 
                    <h5>Contadores de Ciclos:</h5> 
                    <p>
                        El contador debe de ser un dato aislado a la operación del sistema, una vez <b>SyncBox i4.0</b> lea este valor lo sumará a 
                        los contadores que esten programados, y luego lo enviará a cero. Este debe de ser un valor que incremente simplemente.
                    </p>

                    <h5>Contadores de Tiempos:</h5>
                    <p>
                        El contador de tiempos activará la rutina una vez el TAG seleccionado sea igual al numero 1 (uno). De otro modo se suspenderá 
                        el conteo. Las unidades internas del sistema estan en segundos, la visualizacion es la que se seleccione.
                    </p>
                </b-col>
                <b-col md="8">
                    <fieldset class="demo-vertical-spacing-sm mt-2">                
                        <b-form-group class="mb-4" label="Nombre de la Variable">
                            <b-form-input placeholder="Nombre de la Variable" v-model="objOwnerTags.tag_name" :disabled="disabledcode" ></b-form-input>
                        </b-form-group>
                        <b-row>
                            <b-col md="12">
                                <b-form-group label="TAG">
                                    <multiselect
                                        v-model="objOwnerTags.tags"
                                        placeholder=""
                                        :options="tableVariables"
                                        :multiple="false"
                                        :searchable="true"
                                        :clear-on-select="true"
                                        :close-on-select="true"
                                        :hide-selected="true">
                                        <span slot="noResult">No found.</span>
                                    </multiselect>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col md="12">
                                <b-form-group label="Tipo de Contador">
                                    <b-form-select v-model="objOwnerTags.counter_type" :disabled="disabledcode" :options="['Timers', 'Counter']"></b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-row v-if="objOwnerTags.counter_type == 'Timers'">
                            <b-col md="12">
                                <b-form-group label="Visualización de Tiempo">
                                    <b-form-select v-model="objOwnerTags.time_option" :options="['Horas', 'Minutos', 'Segundos']"></b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        
                        <b-row>
                            <b-col md="12">
                                <b-form-group label="Valor Maximo de Esta Variable">
                                    <b-form-input type="number" placeholder="Valor Maximo de Esta Variable" v-model="objOwnerTags.max_value" ></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </fieldset>
                </b-col>
            </b-row>
            <div slot="modal-footer" class="w-100 text-right">
                <div class="d-flex justify-content-between">
                    <div>
                    </div>
                    <div>
                        <b-btn variant="primary" @click="showFormulario=false">Cancelar / Cerrar</b-btn>
                        <b-btn variant="success" @click="save()">Guardar</b-btn>
                    </div>
                </div>
                <!-- <b-btn :variant="variantSaveButton" v-if="check_access('floor_tags', 'c')" @click="submit()">Guardar</b-btn> -->
            </div>
            <!-- </b-card> -->
        </b-modal>
        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar Tablero" ref="messageSyncInfo">
                
                <div class="w-100 text-center">
                    Esta seguro que desea elimintar éste tablero <b>{{objOwnerTags.tag_name}}</b> ?
                    <p>
                        Esta acción no se podrá deshacer.    
                    </p>
                    
                </div>
                
                <template slot="button"><b-btn @click="deleteOwnerTags()" variant="danger" class="mr-2">Borrar Tablero</b-btn></template>
                <template slot="button"><b-btn @click="cancelDeleteOwnerTags();" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

    </div>
</template>

    <style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
    <style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
    <style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { infotimeseries } from "@/components/i40/js/timeseries";

    import Notifications from 'vue-notification'
    import Multiselect from 'vue-multiselect'
    
  
    Vue.use(Notifications)

    export default {
        
        metaInfo: {
            title: 'Configuración de Tableros'
        },
        components: {
            // VueMarkdown,
            SweetModal,
            Multiselect,
            SweetModalTab
        },
        data: () => ({
            name: 'configs_tag',
            version: 'v1.0.0.0',

            itemVariable:null,
            tableVariables:[],
            OwnerTagsCreated:false,
           
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
                    {key:'tag_name', label:'Nombre Variable'},
                    {key:'wscode', label:'Centro de Trabajo'},
                    {key:'tags', label:'Tag'},
                    {key:'max_value', label:'Valor Max'},

                    {key:'edit', label:"Edit"}
                ],
            /// Columnas de las tablas

            /// Columnas de las tablas
                objOwnerTags:{},
                tableChart:[],
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
                this.objInfo = {}
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
            
        ////

        ///Eventos CRUD
            newOwnerTags(){
                
                this.objOwnerTags = {}
                this.showFormulario = true
                this.disabledcode = false
            },
            
            cancelDeleteOwnerTags(){
                this.$refs.messageSyncInfo.close()
                this.objOwnerTags = {}
                this.disabledcode = false
                this.OwnerTagsCreated = false
            },

            deleteOwnerTags:function name(params) {
                infotimeseries.ownertagscontroller(this.objOwnerTags, "del").then(data => {
                    this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                    this.showData()
                })
                this.$refs.messageSyncInfo.close()
            },

            saveOwnerTags:function(){
                infotimeseries.ownertagscontroller(this.objOwnerTags, "modify").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                        if(data.data != ""){
                            this.objInfo = data.data
                            this.disabledcode = true
                            this.OwnerTagsCreated = true
                        }
                        this.showData()
                    }
                })
                .catch(function (error) {
                    console.log(error.status)
                })
            },

            save(){

                infotimeseries.ownertagscontroller(this.objOwnerTags, "modify").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                        if(data.data != ""){
                            this.objInfo = data.data
                            this.disabledcode = true
                            this.OwnerTagsCreated = true
                        }
                        this.showData()
                        this.objAlarms = {}
                    }
                })
                .catch(function (error) {
                    console.log(error.status)
                })
            },

            showData: function(){
                infotimeseries.ownertagscontroller("[]", "get").then(data =>{
                    this.tableData = Object.values(data.data)
                    this.totalRows= this.tableData.length
                })
            },
            
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.variantSaveButton="warning"
                this.disabledcode = true
                this.OwnerTagsCreated = true

                ////Informacion que será modificada o borrada
                this.objOwnerTags = row
                
                if(action === "edit")
                    this.showFormulario=true
                else
                    this.$refs.messageSyncInfo.open()
            },


            data_change_chart: function(row, action){
                if(action == 'delete'){
                    let poss = -1
                    for (let index = 0; index < this.objAlarms.length; index++) {
                        const element = this.objAlarms[index];
                        if(this.objAlarms.old_tag_name = element.tag_name){
                            poss = index
                        }
                    }
                    this.tableChart.splice(poss, 1);
                }else{
                    this.objAlarms = row
                    this.objAlarms.old_tag_name = row.tag_name
                }
            }
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

        ///Espacio para metodos propios del control
        ///Espacio para metodos propios del control
        
        },
        created(){
            this.showData()
            infotimeseries.alarmcontroller("[]", "get_tags").then(data =>{
                // console.log(data.data)
                this.tableVariables = data.data
            })
        },
        mounted () {
        }
    }
</script>

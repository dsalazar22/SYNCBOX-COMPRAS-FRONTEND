<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Configuración de OEE</h4>
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
                    <!-- <b-col md="2" class="my-1">
                        <b-btn variant="outline-success icon-btn" @click.prevent="newBoard()"><i class="ion ion-md-add"></i></b-btn>
                    </b-col> -->
                </b-row>
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <!-- <template v-slot:cell(edit)="row"> -->
                    <template v-slot:cell(alarm_name)="props">
                        <div class="text-left">
                           <i v-if="props.item.status == 'true'" class="fas fa-circle text-success"></i>
                            <i v-if="props.item.status != 'true'" class="fas fa-circle text-danger"></i>
                            {{props.item.alarm_name}}
                        </div>
                    </template>
                    <template v-slot:cell(codigocentrotrabajo)="props">
                        <div class="text-left">
                           <i v-if="props.item.status == 'true'" class="fas fa-circle text-success"></i>
                            <i v-if="props.item.status == 'false' || props.item.status == undefined" class="fas fa-circle text-danger"></i>
                            {{props.item.codigocentrotrabajo}}
                        </div>
                    </template>
                    <template  v-slot:cell(edit)="row">
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

        <b-modal id="modals-top" v-model="showFormulario" no-close-on-backdrop class="modal-center" size="xl">
            <div slot="modal-title">
                Configuración de la Maquina <span class="font-weight-light">Valores Tiempo Real</span><br>
                <small class="text-danger">No use caracteres especiales en ninguno de los textos, ej. (tildes, ñ, %, @, etc)</small>
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <h4>Definición de Variables</h4>
                 <b-row>
                    <b-col md="4">
                        <b-form-group label="Contador de Ciclos">
                            <multiselect
                                v-model="tags_cycles"
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
                    <b-col md="4">
                        <b-form-group label="Unidades por Ciclo">
                            <multiselect
                                v-model="tags_unty_per_cycle"
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
                    <b-col md="4">
                        <b-form-group label="Contador de Unidades Defectuosas">
                            <multiselect
                                v-model="tags_unity_scrap"
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
                 </b-row>
                 <b-row>

                    <b-col md=12>
                            <b-row>
                                <b-col md=6>
                                    <b-form-group label="Tiempo de Paro (minutos)">
                                        <multiselect
                                            v-model="tags_stop_time_minutes"
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
                                <b-col md=6>
                                    <b-form-group label="Tiempo de Paro (segundos)">
                                        <multiselect
                                            v-model="tags_stop_time_second"
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
                    </b-col>
                 </b-row>

                 <b-row>
                    <b-col md=12>
                            <b-row>
                                <b-col md=6>
                                    <b-form-group label="Valocidad Estandar por Ciclo (minutos)">
                                        <multiselect
                                            v-model="tags_standard_velocity_minutes"
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
                                <b-col md=6>
                                    <b-form-group label="Valocidad Estandar por Ciclo (segundos)">
                                        <multiselect
                                            v-model="tags_standard_velocity_second"
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
                    </b-col>
                 </b-row>
                 <b-row>
                    <b-col md=6>
                        <b-form-group label="Valocidad Real por Ciclo (minutos)">
                            <multiselect
                                v-model="tags_velocity_real_per_cicle_minute"
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
                    <b-col md=6>
                        <b-form-group label="Valocidad Real por Ciclo (segundos)">
                            <multiselect
                                v-model="tags_velocity_real_per_cicle_second"
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
                    <b-col md=6>
                        <b-form-group label="Evento Cambio de Estado">
                            <multiselect
                                v-model="tags_event_change_state"
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
                    <b-col md=6>
                        <b-form-group label="Valor Estado del Centro de Trabajo En Operación">
                            <b-input type="number" autocomplete="off" placeholder="Valor Estado del Centro de Trabajo En Operación" v-model.trim="objInfo.value_running" />
                        </b-form-group>
                    </b-col>
                </b-row>
                 <b-row>
                    <b-col md=12>
                        <b-form-group label="Frecuencia de Almacenamiento de Velocidad de Producción en Minutos">
                            <b-input type="number" autocomplete="off" placeholder="Frecuencia de Almacenamiento de Velocidad de Producción en Minutos" v-model.trim="objInfo.frecuency_save_production_miuntes" />
                        </b-form-group>
                    </b-col>
                 </b-row>
            </fieldset>
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
                    Esta seguro que desea elimintar éste tablero <b>{{this.objInfo.alarm_name}}</b> ?
                    <p>
                        Esta acción no se podrá deshacer.    
                    </p>
                    
                </div>
                
                <template slot="button"><b-btn @click="deleteBoard()" variant="danger" class="mr-2">Borrar Tablero</b-btn></template>
                <!-- <template slot="button"><b-btn @click="cancelDeleteBoard();" variant="primary">Cerrar</b-btn></template>  -->
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
    import { infotimeseries } from "@/components/i40/js/timeseries"
    import { infoembebbed } from "@/components/i40/js/embebbed";

    import Notifications from 'vue-notification'
    import Multiselect from 'vue-multiselect'
    
  
    Vue.use(Notifications)

    export default {
        
        metaInfo: {
            title: 'Configuración de Centros de Trabajo - OEE'
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
            boardCreated:false,
           
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
                    {key:'wscode', label:'Centro de Trabajo'},
                    {key:'tags_cycles', label:'Tag Ciclos'},
                    {key:'tags_unity_scrap', label:'Tag Desperdicio'},
                    {key:'tags_stop_time_minutes', label:'Tag Tiempo Paro'},
                    {key:'tags_standard_velocity_second', label:'Tag Tiempo Ciclo'},
                    {key:'edit', label:"Edit"}
                ],

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                },

                tags_cycles:null,
                tags_unty_per_cycle:null,
                tags_unity_scrap:null,
                tags_stop_time_minutes:null,
                tags_stop_time_second:null,
                tags_standard_velocity_minutes:null,
                tags_standard_velocity_second:null,
                tags_velocity_real_per_cicle_minute:null,
                tags_velocity_real_per_cicle_second:null,
                tags_event_change_state:null,
                tags_value_running:null,
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

            save(){
                this.objInfo.tags_cycles = this.tags_cycles
                this.objInfo.tags_unty_per_cycle = this.tags_unty_per_cycle
                this.objInfo.tags_unity_scrap = this.tags_unity_scrap
                this.objInfo.tags_stop_time_minutes = this.tags_stop_time_minutes
                this.objInfo.tags_stop_time_second = this.tags_stop_time_second
                this.objInfo.tags_standard_velocity_minutes = this.tags_standard_velocity_minutes
                this.objInfo.tags_standard_velocity_second = this.tags_standard_velocity_second
                this.objInfo.tags_velocity_real_per_cicle_minute = this.tags_velocity_real_per_cicle_minute
                this.objInfo.tags_velocity_real_per_cicle_second = this.tags_velocity_real_per_cicle_second
                this.objInfo.tags_event_change_state = this.tags_event_change_state
                this.objInfo.tags_value_running = this.tags_value_running

                infoembebbed.wscontroller(this.objInfo, "modify").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                        if(data.data != ""){
                            this.objInfo = data.data
                            this.disabledcode = true
                            this.boardCreated = true
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
                this.tableData =[] 
                infoembebbed.wscontroller("[]", "get").then(data =>{
                    let array =  Object.keys(data.data)
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];
                        let content = data.data[element]
                        content["wscode"] = element
                        this.tableData.push(content)
                    }

                    this.totalRows= this.tableData.length
                })
            },
            
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            async data_change (row,action){

                let values = []
                await infotimeseries.alarmcontroller("[]", "get_tags").then(data =>{
                    values.push("-")
                    for (let index = 0; index < data.data.length; index++) {
                        const element = data.data[index];
                        if(element.split(':')[0] == row.wscode){
                            values.push(element.split(':')[1])
                        }
                    }
                })

                this.tableVariables = values

                this.tags_cycles = row.tags_cycles == undefined ? 'CycleCounter' : row.tags_cycles
                this.tags_unty_per_cycle = row.tags_unty_per_cycle == undefined ? '' : row.tags_unty_per_cycle
                this.tags_unity_scrap = row.tags_unity_scrap == undefined ? 'ScrapCounter' : row.tags_unity_scrap
                this.tags_stop_time_minutes = row.tags_stop_time_minutes == undefined ? 'StopTimeMinutes' : row.tags_stop_time_minutes
                this.tags_stop_time_second = row.tags_stop_time_second == undefined ? 'StopTimeSeconds' : row.tags_stop_time_second
                this.tags_standard_velocity_minutes = row.tags_standard_velocity_minutes == undefined ? 'PresetMinute' : row.tags_standard_velocity_minutes
                this.tags_standard_velocity_second = row.tags_standard_velocity_second == undefined ? 'Preset01s' : row.tags_standard_velocity_second
                this.tags_velocity_real_per_cicle_minute = row.tags_velocity_real_per_cicle_minute == undefined ? 'CycleTiempoCurrentMinute' : row.tags_velocity_real_per_cicle_minute
                this.tags_velocity_real_per_cicle_second = row.tags_velocity_real_per_cicle_second == undefined ? 'CycleTiempoCurrent01s' : row.tags_velocity_real_per_cicle_second
                this.tags_event_change_state = row.tags_event_change_state == undefined ? 'StatusStateCurrent' : row.tags_event_change_state
                this.tags_value_running = row.tags_value_running == undefined ? '' : row.tags_value_running

                this.objInfo = row

                this.variantSaveButton="warning"
                this.disabledcode = true
                this.boardCreated = true

                ////Informacion que será modificada o borrada
                this.showFormulario=true
            },
        
        },
        created(){
            this.showData()
        },

        mounted () {
        }
    }
</script>

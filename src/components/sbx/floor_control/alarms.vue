<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Configuración de Alarmas</h4>
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
                        <b-btn variant="outline-success icon-btn" @click.prevent="newBoard()"><i class="ion ion-md-add"></i></b-btn>
                    </b-col>
                </b-row>
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" 
                    :filter="filter" @filtered="onFiltered">
                    <!-- <template v-slot:cell(edit)="row"> -->
                    <template v-slot:cell(alarm_value)="props">
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
                   <small> Total Configuración de Tags: {{this.totalRows}} </small>
                 </div>
                    </div>
            </div>
        </div>

        <b-modal id="modals-top" v-model="showFormulario" no-close-on-backdrop class="modal-center" size="xl">
            <div slot="modal-title">
                Administrar Tableros <span class="font-weight-light">Alarmas</span><br>
                <small class="text-danger">No use caracteres especiales en ninguno de los textos, ej. (tildes, ñ, %, @, etc)</small>
            </div>
            <fieldset class="demo-vertical-spacing-sm">                
                <b-input-group class="mb-4">
                    <b-form-input placeholder="Nombre del Tablero" :disabled="disabledcode" v-model="objInfo.alarm_name" ></b-form-input>
                    <b-input-group-append>
                        <b-btn variant="success" @click="saveBoard()"> <span class="ion ion-md-checkmark"></span> </b-btn>
                    </b-input-group-append>
                </b-input-group>

                <h4>Definición de Variables</h4>
                 <b-row>
                    <b-col md="2">
                        <b-form-group label="Orden Visual">
                            <b-input type="number" placeholder="Orden Visual" v-model.trim="objAlarms.order" />
                        </b-form-group>
                    </b-col>
                    <b-col md="3">
                        <b-form-group label="Nombre de la Alarma">
                            <b-input placeholder="Nombre de la Alarma" v-model.trim="objAlarms.alarm_name" />
                        </b-form-group>
                    </b-col>
                    
                    <b-col md="1">
                        <b-form-group label="Comparación">
                            <b-form-select v-model="objAlarms.comparison" :options="['<','>','<=','>=','==']"></b-form-select>
                        </b-form-group>
                    </b-col>
                    
                    <b-col md="2">
                        <b-form-group label="Valor de Advertencia">
                            <b-input placeholder="Valor de Advertencia" v-model.trim="objAlarms.alarm_value" />
                        </b-form-group>
                    </b-col>
                    <b-col md="2">
                        <b-form-group label="Valor Sugerido">
                            <b-input type="number" placeholder="Valor Sugerido" v-model.trim="objAlarms.prop_value" />
                        </b-form-group>
                    </b-col>
                    <b-col md="2">
                        <b-form-group label="Editar Valor Sugerido">
                            <label class="switcher switcher-success mt-2">
                                <input type="checkbox" class="switcher-input" checked v-model="objAlarms.edit_value"> 
                                <span class="switcher-indicator">
                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                </span>
                                <!-- <span class="switcher-label">Habilitar Edición</span> -->
                            </label>
                        </b-form-group>
                    </b-col>
                 </b-row>
                 <b-row>
                    <b-col md=12>
                        <b-form-group label="TAGS">
                            <multiselect
                                v-model="objAlarms.tags"
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

                 <div class="text-right mb-2">
                    <b-btn variant="outline-success" @click.prevent="newChart()" size="sm" :disabled="!boardCreated"><i class="ion ion-md-checkmark"> &nbsp;&nbsp; Confirmar </i></b-btn>
                 </div>

                <b-table small show-empty stacked="md" :items="tableChart" :fields="columnsCharts">
                    <template v-slot:cell(alarm_value)="row">
                        <div class="text-left">
                          X <b> {{row.item.comparison == null ? "???" : row.item.comparison }} </b> {{row.item.alarm_value}}
                        </div>
                    </template>
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs"  @click.prevent="data_change_chart(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change_chart(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                </b-table>
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <div class="d-flex justify-content-between">
                    <div>
                        <b-form-checkbox v-model="objInfo.status" value="true" unchecked-value="false" :disabled="!boardCreated">
                           Habilitar Tablero
                        </b-form-checkbox>
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
                <template slot="button"><b-btn @click="cancelDeleteBoard();" variant="primary">Cerrar</b-btn></template> 
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
    import Notifications from 'vue-notification'
    import Multiselect from 'vue-multiselect'
    import { infotimeseries } from "@/components/i40/js/timeseries";
    
  
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
                    {key:'alarm_name', label:'Nombre del Tablero'},
                    // {key:'tag_name', label:'Tag'},
                    // {key:'decimal_places', label:'Número de Decimales'},
                    // {key:'lower_limit', label:'Límite Inferior'},
                    // {key:'upper_limit', label:'Límite Superior'},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Edit"}
                ],
            /// Columnas de las tablas

            /// Columnas de las tablas
                objAlarms:[],
                columnsCharts: [
                    // {key:'id', label:'id', thClass: 'd-none', tdClass: 'd-none'},
                    {key:'order', label:'Orden'},
                    {key:'alarm_name', label:'Nombre de la Alarma'},
                    {key:'tags', label:'TAG'},
                    {key:'alarm_value', label:'Valor de Advertencia'},
                    {key:'prop_value', label:'Valor Sugerido'},
                    
                    {key:'edit', label:"Edit"}
                ],

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
        newChart(){
            let poss = -1
            if(this.objAlarms.order == undefined || this.objAlarms.order == null)
                this.objAlarms.order = 0

            for (let index = 0; index < this.tableChart.length; index++) {
                const element = this.tableChart[index];
                if(this.objAlarms.old_alarm_name == element.alarm_name || this.objAlarms.alarm_name == element.alarm_name){
                    poss = index
                    this.tableChart[index].alarm_name = this.objAlarms.alarm_name
                    this.tableChart[index].tags = this.objAlarms.tags
                    this.tableChart[index].alarm_value = this.objAlarms.alarm_value
                    this.tableChart[index].prop_value = this.objAlarms.prop_value
                    this.tableChart[index].edit_value = this.objAlarms.edit_value
                }
            }

            if(poss == -1){
                this.tableChart.push({alarm_name:this.objAlarms.alarm_name, tags:this.objAlarms.tags, 
                    order:this.objAlarms.order, alarm_value:this.objAlarms.alarm_value, 
                    prop_value:this.objAlarms.prop_value, 
                    edit_value:this.objAlarms.edit_value})
            }

            this.tableChart.sort(function (a, b) {
                if (a.order > b.order) {
                    return 1;
                }
                if (a.order < b.order) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
            
            this.objAlarms = {}
        },
        ////

        ///Eventos CRUD
            newBoard(){
                this.objInfo = {}
                this.disabledcode = false
                this.boardCreated = false
                this.showFormulario=true

                this.tableChart = []
                this.objAlarms={}
            },
            cancelDeleteBoard(){
                this.$refs.messageSyncInfo.close()
                this.objInfo = {}
                this.disabledcode = false
                this.boardCreated = false
            },
            deleteBoard:function name(params) {
                infotimeseries.alarmcontroller(this.objInfo, "del").then(data => {
                    this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                    this.showData()
                })
                this.$refs.messageSyncInfo.close()
            },
            saveBoard:function(){
                infotimeseries.alarmcontroller(this.objInfo, "modify").then(data => {
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
                    }
                })
                .catch(function (error) {
                    console.log(error.status)
                })
            },

            save(){
                this.objInfo.info_config= JSON.stringify(this.tableChart)
                infotimeseries.alarmcontroller(this.objInfo, "modify").then(data => {
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
                infotimeseries.alarmcontroller("[]", "get").then(data =>{
                    this.tableData = Object.values(data.data)
                    this.totalRows= this.tableData.length
                })
            },
            
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.variantSaveButton="warning"
                this.disabledcode = true
                this.boardCreated = true

                ////Informacion que será modificada o borrada
                this.objInfo = row
                this.tableChart = []
                if(row.info_config != "")
                    this.tableChart = JSON.parse(row.info_config)
                this.objAlarms={}
                
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
                        if(this.objAlarms.old_alarm_name = element.alarm_name){
                            poss = index
                        }
                    }
                    this.tableChart.splice(poss, 1);
                }else{
                    this.objAlarms = row
                    this.objAlarms.old_alarm_name = row.alarm_name
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

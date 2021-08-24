<template>
    <div>
        <notifications group="notifications-default" />
        <h3>Calendario</h3>
        <b-alert show :variant=" automount.is_running == 'true' ? 'warning' : 'success' ">
            <div class="d-flex justify-content-between">
                <div>
                    {{automount.description}}
                </div>
                <div>
                    Ultimo Tiempo de Ejecución: {{msToHMS(automount.last_elapsed_time)}}
                    <b-btn variant="outline borderless icon-btn" class="btn-xs" @click.prevent="restart()"><i class="fas fa-sync"></i></b-btn>
                </div>
            </div>

            
        </b-alert>
        <div class="text-right">
             <b-btn variant="outline-success borderless" class="btn-sm" @click.prevent="reload_calendario()">
                <span class="ion ion-md-add"></span>&nbsp;&nbsp;Calcular Calendario
            </b-btn>
             <b-btn variant="outline-danger borderless" class="btn-sm" @click.prevent="open_delete_confirm()">
                <span class="ion ion-md-remove"></span>&nbsp;&nbsp;Borrar Calendario
            </b-btn>
            <b-btn variant="outline-info borderless" class="btn-sm" @click.prevent="openHelp">
                <span class="fas fa-chalkboard-teacher"></span>&nbsp;&nbsp;Ayuda 
            </b-btn>
        
        </div>
        <div class="row">
         <div class="col-5" style="overflow-x: auto; white-space: nowrap;">
              <v-jstree
                :data="treeData"
                :class="{ 'tree-rtl': false }"
                show-checkbox
                allow-batch
                whole-row
                @item-click="itemClick" />

                <!-- {{JSON.stringify(treeData)}} -->
         </div>
            <div class="col-7">
                <h5 class="text-center mt-2">
                    {{lastCheked.description}}
                </h5>
                <b-row>
                    <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->
                    <b-col md="6" class="my-1">
                        <b-input-group>
                            <b-form-input v-model="filter" placeholder="Buscar..." />
                            <b-input-group-append>
                            <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                            </b-input-group-append>
                        </b-input-group>
                    </b-col>
                    <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->

                    <!-- ESTE ES EL PAGINADOR -->
                    <b-col md="6" class="my-1">
                        <b-form-select :options="pageOptions" v-model="perPage" />
                    </b-col>
                    <!-- ESTE ES EL PAGINADOR -->

                    <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
                    
                    <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
                </b-row>
                <b-table small :items="infoHolidays" :fields="fieldsCustom" :current-page="currentPage" :per-page="perPage" 
                        :filter="filter" @filtered="onFiltered">

                    <template v-slot:cell(start_date)="row">
                      
                        <div>
                          <b-form-checkbox-group
                              id="checkbox-group-2"
                              v-model="selectedDates"
                            >
                              <b-form-checkbox :value="checkDataChange(row.item,(row.item.planned_hours == 0 ? 'start-day-calendar-' : 'stop-day-calendar-'))">{{row.item.start_date}}</b-form-checkbox>
                          </b-form-checkbox-group>
                          
                        </div>
                      
                    </template>
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <!-- {{row.item}} -->
                            <b-btn variant="outline-success borderless icon-btn" v-if="row.item.planned_hours == 0" class="btn-xs" @click.prevent="data_change(row.item,'start-day-calendar-')"><i class="ion ion-md-hammer"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" v-if="row.item.planned_hours > 0" class="btn-xs" @click.prevent="data_change(row.item,'stop-day-calendar-')"><i class="ion ion-md-hand"></i></b-btn>
                        </div>
                    </template>
                </b-table>
                <div>
                     
                    <div class="d-flex justify-content-center">
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div class="w-100 text-muted text-center">
                        <small> Total Días en Calendario: {{this.totalRows}} </small>
                    </div>
                </div>
            </div>
              
        </div>

        <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
            ¿Está seguro que desea borrar el registro?
            <div class="w-100 text-center">
                El cambio será ejecutado al registro actual y a todos los que dependa de él, en orden jerárquico.
                <div class="row mt-2">
                    <div class="col-5">
                        Borrar el calendario a partir de:
                    </div>
                    <div class="col-7">
                        <datepicker
                        v-model="objInfo.date1"
                        :bootstrapStyling="true"
                        :monday-first="true"
                        :full-month-name="true"
                        placeholder="Select arrival date"
                        :calendar-button="true"
                        calendar-button-icon="ion ion-md-calendar"
                        :clear-button="true"
                        :disabled-dates="disabledDates"/>
                    </div>
                </div>
            </div>

            <template slot="button"><b-btn v-if="check_access('capacity_calendar', 'd')" @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
            <template slot="button"><b-btn @click="close_delete_record()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>

        <sweet-modal :icon="this.action=='start-day-calendar-'?'success':'error'" title="Deshabilitar / Habilitar Día" ref="set_stop_date">
            {{this.action=='start-day-calendar-'?'¿Está seguro que desea habilitar este día?':'¿Está seguro que desea deshabilitar este día?'}}

            <div class="w-100 text-center">
                El cambio será ejecutado al registro actual y a todos los que dependa de él, en orden jerárquico.
            </div>
            <div class="text-left mt-2">
                Numero de Horas:
                    <b-input type="number" placeholder="Horas" v-model.trim="objInfo.num_hours" />
            </div>
            <div class="text-left mt-1">
                Información Complementaria:
                 <b-input placeholder="Descripción" v-model.trim="objInfo.comment" />
            </div>

            <template slot="button"><b-btn v-if="check_access('capacity_calendar', 'd')" @click="change_selected_item()" :variant="this.action=='start-day-calendar-'?'success':'danger'" class="mr-2">Ejecutar Cambio</b-btn></template>
            <template slot="button"><b-btn @click="$refs.set_stop_date.close()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>

        <!-- <sweet-modal icon="error" title="Deshabilitar Día" ref="set_stop_date">
            ¿Está seguro que desea deshabilitar este día?
            <div class="w-100 text-center">
                El cambio será ejecutado al registro actual y a todos los que dependa de él, en orden jerárquico.
            </div>
            <div>
                <b-input placeholder="Descripción" v-model.trim="objInfo.comment" />
            </div>

            <template slot="button"><b-btn v-if="check_access('capacity_calendar', 'd')" @click="change_selected_item()" variant="danger" class="mr-2">Eliminar</b-btn></template>
            <template slot="button"><b-btn @click="$refs.set_stop_date.close()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal> -->

        <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>
    </div>
</template>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-jstree/vue-jstree.scss" lang="scss"></style>
<script>

var Holidays = require('date-holidays')
import Vue from 'vue'
import { infoplanning } from "@/components/i40/js/iplanning";
import { infomaster } from "@/components/i40/js/master";
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { infosysconfig } from "@/components/i40/js/sysconfig";
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import Notifications from 'vue-notification'
import VueMarkdown from 'vue-markdown'
import VJstree from 'vue-jstree'
import {infousers} from '@/components/i40/js/users'
import { infoservices } from "@/components/i40/js/services";

Vue.use(Notifications)

export default { 
    metaInfo: {
        title: 'Calendario'
    },
    components: {
        Datepicker,
        VueMarkdown,
        SweetModal,
        SweetModalTab,
        VJstree
        
    },

    data() {
        
        return {
            automount:{},
            resultChange:[],
            selectedDates:[],
            name: 'config_capacity',
            version: 'v1.0.0.0',
            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },

            lastCheked : {},
            treeData:[],
            
            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },

            action:'',
            objInfo:{num_hours:0},
            disabledDates: {
                to: new Date(Date.now() - 8640000) // Disable sunday
            },

            itemsCustom:[],
            fieldsCustom:[
                {key:'start_date', label:"Fecha"},
                {key:'day_of_week', label:"Día"},
                {key:'number_week', label:"Sem"},
                {key:'planned_hours', label:"# de Horas"},
                {key:'edit', label:"Editar"},                
            ],

            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla
        }
    },
    computed: {
        infoHolidays: function(){
            moment.locale("es")
            for (let index = 0; index < this.itemsCustom.length; index++) {
                this.itemsCustom[index].day_of_week
                var mk = new moment(this.itemsCustom[index].start_date)
                this.itemsCustom[index].day_of_week = mk.format("dd")
                
                if(this.itemsCustom[index].type=="customer")
                    this.itemsCustom[index]._cellVariants={"day_of_week":"info"}
                else if(this.itemsCustom[index].type=="auto")
                    this.itemsCustom[index]._cellVariants={"day_of_week":"danger"}
                    
                if(this.itemsCustom[index].day_of_week == "do"){
                    if(this.itemsCustom[index].type!="-")
                        this.itemsCustom[index].type="d"

                if(this.itemsCustom[index].type == "-"){
                    this.itemsCustom[index].type=""
                }

                    this.itemsCustom[index]._cellVariants={"day_of_week":"warning"}
                }
            }

            return this.itemsCustom
        }
    },

    methods: {
        restart(){
            this.automount.frecuency_value = parseInt(this.automount.frecuency)
            this.automount.frecuency = this.automount.frecuency_value
            this.automount.next_execution = '2020-01-01 00:00:00'
            infoservices.services(this.automount, "insert").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
                    this.showData()
                    this.cancel()
                }
            })
            .catch(function (error) {
                console.log(error.status)
            })
        },
        check_access(control, action){
        return infousers.check_access(control,action)
        },
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

        deleteRecord(){
            this.objInfo.date_to_delete=moment(this.objInfo.date1).format("YYYY-MM-DD")
            infoplanning.calendarcontroller(this.objInfo,"remove-calendar-"+this.lastCheked.level).then(data =>{
                 if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                }else{            
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                    if(data.data.length >0){
                        this.itemsCustom = data.data 
                        this.totalRows = this.itemsCustom.length
                    }else{
                        this.itemsCustom = []
                        this.totalRows = 0
                    }

                    this.$refs.errorWithButtonAlert.close();
                    this.objInfo.date1 = moment().toDate()
                    
                }
            })
            // infoplanning.calendarcontroller([],"select-company").then(data =>{
            //     this.itemsCustom = data.data 
            //     this.totalRows = this.itemsCustom.length
            // })
        },

        close_delete_record(){
            this.$refs.errorWithButtonAlert.close(); 
            this.objInfo.date1 = moment().toDate()
        },

        open_delete_confirm(){
            this.$refs.errorWithButtonAlert.open();
            this.objInfo.date1 = moment().toDate()
        },

        reload_calendario(){
            infoplanning.calendarcontroller(this.objInfo, "reload-calendar-"+this.lastCheked.level).then(data =>{
                 if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                }else{            
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                    if(data.data.length >0){
                        this.itemsCustom = data.data 
                        this.totalRows = this.itemsCustom.length
                    }else{
                        this.itemsCustom = []
                        this.totalRows = 0
                    }

                    this.$refs.errorWithButtonAlert.close(); 
                    this.objInfo.date1 = moment().toDate()
                }
            })
        },

        cargar_calendario(){
            infoplanning.calendarcontroller(this.objInfo, "select-" + this.lastCheked.level).then(data =>{
                // console.log(data)
                if(data.data.length >0 && data.data != "Invalid Option" ){
                    this.itemsCustom = data.data 
                    this.totalRows = this.itemsCustom.length
                }else{
                    this.itemsCustom = [] 
                    this.totalRows = 0
                }
            })
        },

        data_change(item,event){
            this.$refs.set_stop_date.open()
            this.objInfo.date_to_stop = item.start_date
            this.objInfo.total_hours = 0
            this.objInfo.num_hours = 0
            this.action = event
        },

        checkDataChange(item,event){
            let obj = JSON.parse(JSON.stringify(this.objInfo))
            obj.date_to_stop = item.start_date
            obj.total_hours = 0
            obj.num_hours = 0
            obj.action = event
            return obj
        },

        async change_selected_item(){
            if(this.selectedDates.length == 0){
                await this.sendChangesItems(this.objInfo,this.action+this.lastCheked.level)
            }else{
                for (let index = 0; index < this.selectedDates.length; index++) {
                    const element = this.selectedDates[index];
                    element.num_hours = this.objInfo.num_hours
                    await this.sendChangesItems(element,element.action+this.lastCheked.level)
                }
            }

            if(this.resultChange.length >0){
                this.itemsCustom = this.resultChange 
                this.totalRows = this.itemsCustom.length
            }else{
                this.itemsCustom = []
                this.totalRows = 0
            }

            this.$refs.set_stop_date.close(); 
            this.objInfo.date1 = moment().toDate()
            this.selectedDates = []
        },

        async sendChangesItems(item,action){
            this.resultChange = []
             await infoplanning.calendarcontroller(item,action).then(data =>{
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                }else{            
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                    if(data.data.length >0){
                        this.resultChange = data.data 
                    }
                }
            })
        },

        itemClick (node) {
            this.lastCheked = node.model
            this.objInfo= JSON.parse(JSON.stringify( node.model))
            this.objInfo.children="-"
            this.cargar_calendario()

            // Trigger model update by clonning data
            this.treeData = this.treeData.slice(0)
        },

        itemRecurivo(tree){
            
            let element = {text:tree.description,children:[]};
            for (let index = 0; index < tree.length; index++) {
                const _element = tree[index];
                element.children.push({'text':_element.description})
                if(_element.children!=undefined){
                    if(_element.children.length>0){
                        this.itemRecurivo(_element.children)
                    }
                }
            }

            this.treeData.push(element)
        },
        msToHMS( ms ) {
            // 1- Convert to seconds:
            var seconds = ms / 1000;
            // 2- Extract hours:
            var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
            hours = (hours<=9?'0':'')+hours.toString()

            seconds = seconds % 3600; // seconds remaining after extracting hours
            // 3- Extract minutes:
            var minutes = parseInt( seconds / 60 ); 
            minutes = (minutes<=9?'0':'')+minutes.toString()

            seconds = parseInt(seconds % 60);
            seconds = (seconds<=9?'0':'')+seconds.toString()
            return  hours+":"+minutes+":"+seconds;
        },
        getServices: function(){
            infoservices.services([],"select").then(data => {
                // this.tableData = data.data
                // this.totalRows= this.tableData.length

                for (let index = 0; index < data.data.length; index++) {
                    const element = data.data[index];
                    if(element.service_name == 'automount'){
                        // console.log(element)
                        this.automount = element
                    }
                    
                }

                // console.log(data.data)
            })
        },
    },

    created() {
        infomaster.tree_workstation_capacity().then(data =>{
            this.treeData = data.data 
        })
        
        this.$options.interval = setInterval(this.getServices, 500)
    },

    beforeDestroy () {
        clearInterval(this.$options.interval)
    }
}
</script>

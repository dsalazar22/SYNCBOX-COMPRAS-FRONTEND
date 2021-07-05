<template>
    <div>
        <notifications group="notifications-default" />
         <div class="d-flex justify-content-between">
            <div>
                <h4 class="font-weight-bold mt-2 mb-0">
                    {{text_name}}
                    <!-- <div class="text-muted text-tiny mt-1"><small class="font-weight-normal">Today is Tuesday, 8 February 2018</small></div> -->
                </h4>
            </div>
        </div>
        <div class="d-flex justify-content-end mb-1">
            <b-nav tabs class="nav-sm tabs-alt mr-2 ml-2">
                <b-nav-item :active="selectedTab=='holidays'" @click="changeTab('holidays')">Días Festivos</b-nav-item>
                <b-nav-item :active="selectedTab=='custom'" @click="changeTab('custom')">Días Personalizados</b-nav-item>
            </b-nav>
        </div>
        <div v-if="selectedTab=='holidays'">
            <b-table  small :items="infoHolidays">
            </b-table>
        </div>
        <div v-if="selectedTab=='custom'">
            <div class="text-right">
                <b-btn variant="outline-success icon-btn" v-if="!showFormulario" class="btn-md"  v-b-modal.modals-default @click.prevent="showFormulario=true;objState={}"><i class="ion ion-md-add"></i></b-btn>
                <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
            </div>
             <b-card header="Adicionar Días Libres" header-tag="h6" class="mb-4" v-if="showFormulario">
                La selección del rango de tiempo permite adicionar días consecutivos en que se van a generar paros generalizados proyectados. Si esto es un solo día, por favor ponga el mismo día inicial y final, puesto que se toma como un rango cerrado.
                
                <fieldset class="demo-vertical-spacing-sm mt-2">
                     <b-form-group label="Seleccione una Planta">
                    <multiselect
                        v-model="objInfo.selectedPlant"
                        :options="workstationPlant"
                        placeholder="Planta"
                        label="description"
                        track-by="description" />
                    </b-form-group>
                    <b-form-group :feedback="objState.message" label="Seleccione un Rango de Tiempo">
                        <flat-pickr v-model="objInfo.range" :config="rangeConfig" :placeholder="'Seleccione un Rango de Tiempo'" />
                    </b-form-group>
                    <b-form-group :feedback="objState.message" label="Descripción">
                        <b-input placeholder="Descripción" v-model.trim="objInfo.comment" :state="objState.description!=''" v-on:input="objState.description = 'valid'; objState.description= objInfo.description==''?'invalid':'valid'"/>
                    </b-form-group>
                </fieldset>
                <div class="w-100 text-right mt-2">
                    <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                    <b-btn :variant="variantSaveButton" v-if="check_access('capacity_holidays', 'c')" @click="addHolidays()">Guardar</b-btn>
                </div>
             </b-card>
            <b-table small :fields="columnsCustom" :items="itemsCustom">
                 <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
            </b-table>
        </div>

         <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar Registro" ref="errorWithButtonAlert">
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                Esta acción no se podrá deshacer.
                </div>
                <template slot="button"><b-btn v-if="check_access('capacity_holidays', 'd')" @click="removeHolidays()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="$refs.errorWithButtonAlert.close(); objInfo={}" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

        <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>

    </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
var Holidays = require('date-holidays')
import moment from 'moment'
import Vue from 'vue'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import { infomaster } from "@/components/i40/js/master";
import { infoplanning } from "@/components/i40/js/iplanning";
import Notifications from 'vue-notification'
import VueMarkdown from 'vue-markdown'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component'
import Multiselect from 'vue-multiselect'
import {infousers} from '@/components/i40/js/users'

Vue.use(Notifications)

function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
    metaInfo: {
        title: 'Días Festivos'
    },
    components: {
        Datepicker,
        flatPickr,
        ApiWikiHelp,
        Multiselect,
        VueMarkdown,
        SweetModal,
        SweetModalTab
    },
    data() {
        return {

            name: 'config_holidays',
            version: 'v1.0.0.0',

            contentWiki: "",
            
            text_name:'Días Festivos',
            selectedTab:'holidays',
            range: null,
            rangeConfig: {
                mode: 'range',
                altInput: true,
                animate: !isRTL(),
                minDate:new Date().fp_incr(1)
            },

            itemsCustom:[],
            columnsCustom: [
                {key:'workstation_plant', label:"Planta"},
                {key:'date_start', label:"Fecha Inicio"},
                {key:'date_finish', label:"Fecha Fin"},
                {key:'comment', label:"Comentario"},
                // {key:'decimal_quantity', label:"Cifras Decimales"},
                ///Este objeto es fijo en caso de que se necesite modificar la info
                {key:'edit', label:"Borrar"}
            ],
            itemCustom:{},
            showFormulario:false,
            objState:{},
            objInfo:{},
            variantSaveButton:'success',
            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },
            workstationPlant:[],
        }
    },
    computed: {
        infoHolidays: function(){
            moment.locale('es');
            var hd = new Holidays("CO")
            let array = hd.getHolidays(moment().year())
            let array1 = hd.getHolidays(moment().year()+1)

            for (let index = 0; index < array1.length; index++) {
                const element = array1[index];
                array.push(element)
            }
            
            let itemsHolidays = [];

            for (let index = 0; index < array.length; index++) {
                const element = array[index];

                if(moment(element.date).diff(moment(),'days')>-1){
                    if(itemsHolidays.length-1>1){
                        if(itemsHolidays[itemsHolidays.length-1].date == moment(element.date).format("YYYY-MM-DD")){
                            itemsHolidays[itemsHolidays.length-1].comment = itemsHolidays[itemsHolidays.length-1].comment + ', ' + element.name
                        }else{
                            itemsHolidays.push({date: moment(element.date).format("YYYY-MM-DD"), diff:moment(element.date).diff(moment(),'days'), day: moment(element.date).format('dd'), week: moment(element.date).week(), comment: element.name })
                        }
                    }else{
                        itemsHolidays.push({date: moment(element.date).format("YYYY-MM-DD"), diff:moment(element.date).diff(moment(),'days'), day: moment(element.date).format('dd'), week: moment(element.date).week(), comment: element.name })
                    }
                }
            }

            return itemsHolidays

            ///Número de Día 0 Domingo and 6 sábado
            //var weeknumber = moment("2019-07-07", "YYYY-MM-DD").day()

            ///Número de la semana
            //var weeknumber = moment("2019-07-07", "YYYY-MM-DD").week()

            ///name of day
            ///weeknumber.format('dd')

            //name of month
            //weeknumber.format('MMMM'),
            
            // var weeknumber = moment("2019-07-07", "YYYY-MM-DD") //.day() //weekday() //.week();
            
            // console.log(weeknumber.format('MMMM'), weeknumber.year());
            // var wk = moment().add(2,'days')
            // console.log(wk);

        
        }
    },
    methods: {
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

        changeTab(item){
            this.selectedTab=item
            if(item != 'holidays'){
                this.getHolidays()
            }
        },
        getHolidays(){
            infoplanning.holidays([],"select").then(data =>{
                if(data.data != null && data.data != "")
                    this.itemsCustom = data.data 
                else
                    this.itemsCustom = []   
            })
        },

        addHolidays(){
            if (this.validate_content()){
            let resultadoDate = this.objInfo.range.replace(/to/gi,"|")
             try{
                
                this.objInfo.date_start = resultadoDate.split("|")[0]
                this.objInfo.date_finish = resultadoDate.split("|")[1]
                this.objInfo.plant_id = this.objInfo.selectedPlant.workstation_plant_id
                
                    infoplanning.holidays(this.objInfo,"insert").then(data =>{
                        if(data.status == 200){
                            this.itemsCustom = data.data 
                            this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                            this.objInfo={}
                        }else{
                            this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                        }
                    })
                
            }catch(ex){
                this.showCustom('bg-danger text-white', "Error","¡Error en los datos, por favor valide!")
            }
            }else{
                        this.showCustom('bg-danger text-white', "Error","¡Información Incompleta!")
                    }
        },

        data_change(item,event){
            this.objInfo = item
            this.$refs.errorWithButtonAlert.open()
        },

        removeHolidays(){
            infoplanning.holidays(this.objInfo,"delete").then(data =>{
                if(data.status == 200){
                        this.itemsCustom = data.data 
                        this.showCustom('bg-danger text-white', "Eliminar Registro","¡El Registro se ha Eliminado con Éxito!")
                        this.objInfo={}
                        this.$refs.errorWithButtonAlert.close()
                    }else{
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }
            })
        },

        cancel(){
            this.showFormulario = false
            this.objInfo={}
        },

              validate_content(){

                //   console.log(this.objInfo)
                
                let isOK = true;
                
                if (this.objInfo.selectedPlant == '' || this.objInfo.selectedPlant == undefined){
                    isOK = false;
                }
                if (this.objInfo.range == ''|| this.objInfo.range == undefined){
                    isOK = false;
                }
                if (this.objInfo.description == ''|| this.objInfo.description == undefined){
                    isOK = false;
                }
                return isOK
            },

    },
    ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

      
    created() {
        infomaster.plant([],"select").then(data => {
            if(data.data != null)
                this.workstationPlant = data.data
            else
                this.workstationPlant = []
        })
        // this.getHolidays()
    },
    
}
</script>

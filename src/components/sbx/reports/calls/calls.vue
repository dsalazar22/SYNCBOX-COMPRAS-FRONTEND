<template>
    <div>
        <!-- <div class="content-heading">
            <div>
                {{titleHeader}}
                <small> Centro de Trabajo</small>
            </div>
        </div> -->
        <h4 class="font-weight-bold py-3 mb-1">
               Información Llamados
                <!-- <small>Tiempo de Paro - Grupo de Centro de Trabajo</small> -->
        </h4>
        <div>
        Seleccione un Centro de Trabajo
        <multiselect
            v-model="selectedGroup"
            :options="workstationGroup"
            
            placeholder="Grupo de Centros de Trabajo"
            label="code"
            track-by="code" /></div>
        <div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12">
                <div class="row mb-1">
                    <div class="col-md-2">


                    </div>
                    <div class="col-md-4">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                            <date-picker v-model="dateStart" :config="options"></date-picker>
                        </div>
                    </div>
                        
                    <div class="col-md-4">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                            <date-picker v-model="dateFinsh" :config="options"></date-picker>
                        </div> 
                    </div>
                    <div class="col-md-2">

                        <div class="row">
                            <button type="button" class="btn btn-success" v-on:click="cargarDatos('')">Consultar</button>
                        </div>
                        
                        <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
                    </div>
                </div>
                <div>

                    <b-table striped hover small :fields="fields" :items="items" class="mt-3">
                        <template v-slot:cell(caller_description)="row">
                            <div class="text-left">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" slot="next" @click.prevent="content_details(row.item)"><i class="fas fa-info"></i></b-btn>

                                {{row.item.caller_description}}
                            </div>
                        </template>
                    </b-table>

                    <!-- <b-modal v-model="detallestopcode" size="xl" title="Detalle Tiempo de Paro"> -->
                        <sweet-modal ref="detallestopcode" width="90%" title="Detalle Tiempo de Paro">
                            <!-- <b-tabs class="nav-tabs-top nav-responsive-xl">
                                <b-tab title="Detalle Tiempos de Paro" active> -->
                                    <h4 class="ml-2 mt-4">Detalle Parada</h4>
                                    <b-table striped hover small :fields="fields_details" :items="items_details">
                                    </b-table>
                                <!-- </b-tab>
                                <b-tab title="Detalle Causa Raiz">
                                    <h4 class="ml-2 mt-4">Detalle Causa Raiz</h4>
                                    <div id="containerroot" style="min-width: 250px; height: 400px; max-width: 600px; margin: 0 auto"></div>
                                    <b-table striped hover small :fields="fields_root" :items="items_root">
                                    </b-table>
                                </b-tab>
                            </b-tabs> -->
                        </sweet-modal>
                    <!-- </b-modal> -->

                    <!-- Modal Component -->
                     
                </div>
            </div>
        </div>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import Multiselect from 'vue-multiselect'
import {reports} from "@/components/i40/js/globals"
import moment from "moment";
// Import this component
import datePicker from "vue-bootstrap-datetimepicker";
// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

import Vue from "vue";
import VueResource from 'vue-resource'
import { infomaster } from "@/components/i40/js/master";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

// import JsonExcel from 'vue-json-to-excel';
 

// import Scrollable from "@/components/Common/Scrollable";


Vue.use(VueResource)
// import Scrollable from "@/components/Common/Scrollable";
// import { CrearPDF } from "../../../vendor/js/funx"

// Vue.component('downloadExcel', JsonExcel)
const theme = "red";
export default {
  components: {
    Multiselect,
    // Scrollable,
    datePicker,
    SweetModal, 
    SweetModalTab 
  },
  data() {
    return {
            titleHeader:"",
            workstationGroup:[],
            selectedGroup:{},
            donutdata: [],
            items: [],
            items2: [],
            dateStart:null,
            dateFinsh:null,
            options: {
                format: "YYYY-MM-DD HH:mm",
                //useCurrent: false
                // minDate:Date(),
            },

            fields: [
                {
                    key: 'caller_description',
                    label: 'Area',
                },
                {
                    key: 'start_date',
                    label: 'Fecha Inicio',
                },
                {
                    key: 'finish_date',
                    label: 'Fecha Fin',
                },
                {
                    key: 'elapsed_minutes',
                    label: 'Tiempo Pareto (min)',
                },
            ],

            fields_details: [
                {
                    key: 'calls_stages_description',
                    label: 'Etapa',
                },
                {
                    key: 'start_date',
                    label: 'Fecha Inicio',
                },
                {
                    key: 'finish_date',
                    label: 'Fecha Fin',
                },
                {
                    key: 'elapsed_minutes',
                    label: 'Tiempo (min)',
                },
                {
                    key: 'name',
                    label: 'Atendió',
                },
            ],

            json_fields : {
                "descripcion"      : "String",
                "turno"      : "Number",
                "inicio"   : "String",
                "Fin" : "String",
                "TiempoTotal"    : "Number"
            },

            json_meta: [
                [{
                    "key": "charset",
                    "value": "utf-8"
                }]
            ],

            totales_minutes: 0,
            ciclos_paros: 0,
            undsprod: 0,


            // fields_details : [],
            items_details :[],
            fields_root: [
                   {
                    key: 'code',
                    label: 'Codigo',
                },
                {
                    key: 'description',
                    label: 'Descripcion',
                },
                {
                    key: 'tt',
                    label: 'Tiempo (Min)',
                },
                {
                    key: 'ciclos',
                    label: 'Ciclos',
                },
            ],
            items_root: []
    };
  },
  methods: {

    content_details(item){
        this.items_details = item.details
        this.$refs.detallestopcode.open()
        
    },
      
    cargarDatos: function(valor) {

        this.titleHeader=this.selectedGroup.description
      var paramtros =
        this.selectedGroup.code +
        "/" +
        this.dateStart +
        ":00/" +
        this.dateFinsh +
        ":59";

      this.$http
        .get(
            reports+"/obtenerllamados/" + paramtros
        )
        .then(respuesta => {
            return respuesta
        })
        .then(data => {
            this.items = data.body
            // console.log(data.body)
        });


    },
// "container"

  },
  created() {
        infomaster.workstation([],"select").then(data => {
            // this.workstationType = data.data[0].wstype
            // this.workstationPlant = data.data[0].wsplant
            this.workstationGroup = data.data[0].workstation
            
            // if( data.data[0].workstation != null){
            //     this.tableData = data.data[0].workstation
            //     this.totalRows= this.tableData.length
            // }
        })
     },
};
</script>



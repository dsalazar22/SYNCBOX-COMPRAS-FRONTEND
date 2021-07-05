<template>
    <div>
        <!-- <div class="content-heading">
            <div>
                {{titleHeader}}
                <small> Centro de Trabajo</small>
            </div>
        </div> -->
            <h4 class="font-weight-bold py-3 mb-1">
                Inventario por Ubicación
                    <!-- <small>Tiempo de Paro - Grupo de Centro de Trabajo</small> -->
            </h4>

            <b-input-group>
                <b-form-input v-model="filter" placeholder="Buscar..." />
                <b-input-group-append>
                    <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                </b-input-group-append>
                <b-input-group-append>
                    <button type="button" class="btn btn-success" v-on:click="exportExcel('')">Exportar</button>
                </b-input-group-append>
            </b-input-group>

            <b-table striped hover :foot-clone="true" :fields="fields" :items="donutdata" small
                    :filter="filter">
                <template v-slot:cell(array_agg)="row">
                    <div class="text-left">
                       {{replaces(row.item.array_agg)}}
                    </div>
                </template>
            </b-table>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
// var jsPDF = require('jspdf');
// require('jspdf-autotable');
// import reports from "../../../vendor/js/constant"
// require("@/i40/vendor/highcharts.js");
import Multiselect from 'vue-multiselect'
import {reports} from "@/components/i40/js/globals"
import moment from "moment";
// Import this component
import datePicker from "vue-bootstrap-datetimepicker";
// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

import Vue from "vue";
import VueResource from 'vue-resource'
import LightTimeline from "vue-light-timeline";
import { infoinventory } from "@/components/i40/js/inventory";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

// import JsonExcel from 'vue-json-to-excel';
 

// import Scrollable from "@/components/Common/Scrollable";


Vue.use(VueResource)
// import Scrollable from "@/components/Common/Scrollable";
import { CrearPDF } from "@/vendor/js/funx"

Vue.use(LightTimeline);
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
            donutdata: [],
            filter: null,

            //ubication, code, description, product_id, amount, lote, created, production_order, array_agg(centrotrabajo) 

            fields: [
                {
                    key: 'ubication',
                    label: 'Ubicacion',
                },
                {
                    key: 'code',
                    label: 'Codigo',
                },
                {
                    key: 'description',
                    label: 'Descripcion',
                },
                {
                    key: 'amount',
                    label: 'Cantidad',
                },
                {
                    key: 'lote',
                    label: 'Lote',
                },
                {
                    key: 'created',
                    label: 'Creacion',
                },
                {
                    key: 'production_order',
                    label: 'OP',
                },
                {
                    key: 'array_agg',
                    label: 'Centro de Trabajo',
                },
            ],
    };
  },
  methods: {
      replaces(values){
          return values.toString().replace('"', "").replace('[', "").replace(']', "").replace(',', ", ")
      },
      
    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.donutdata)
      const workbook = XLSX.utils.book_new()
      const filename = 'inventario_ubicaciones'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },

  },
  created() {
        infoinventory.totalsinventory("invubq").then(data => {
            // console.log(data)
            // this.workstationType = data.data[0].wstype
            // this.workstationPlant = data.data[0].wsplant
            this.donutdata = data.data
            
            // if( data.data[0].workstation != null){
            //     this.tableData = data.data[0].workstation
            //     this.totalRows= this.tableData.length
            // }
        })
     },
};
</script>
<template>
    <div>
        <!-- <keep-alive> -->
        <div class="h3">
               Reportes de Producción por Rango de Tiempo
        </div>
        <div class="row mt-2">
            <div class="col-md-1"></div>
            <div class="col-md-4">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                    <date-picker v-model="dateStart" :config="optionsCalendar"></date-picker>
                </div>
            </div> 
            <div class="col-md-4">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                    <date-picker v-model="dateFinsh" :config="optionsCalendar"></date-picker>
                </div> 
            </div>
            <div class="col-md-3">
                <button type="button" class="btn btn-success" v-on:click="cargarDatos()">Consultar</button>
                <button type="button" class="btn btn-success" v-on:click="exportExcel('')">Excel</button>  
                <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
            </div>
        </div>
        <div class="row mb-2 mt-2">
        </div>
      
        <b-table striped hover :items="tableData" :fields="columns_result" :responsive="true">
        </b-table>

            
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>


<script>
// require( "@/components/i40/js/vendor/highcharts.js")
import VueResource from "vue-resource"
import {reports} from "@/components/i40/js/globals"
import Multiselect from 'vue-multiselect'
import { infomaster } from "@/components/i40/js/master";
// var jsPDF = require('jspdf');
// require('jspdf-autotable');
    
// import vmodal from 'vue-js-modal'

// import Scrollable from "@/components/Common/Scrollable";
import _ from 'underscore'
import moment from "moment";
import ObtenerColorOEE from "@/components/i40/js/floor/colorsOEE.js"
// Import this component
import datePicker from "vue-bootstrap-datetimepicker";
// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
import { CrearPDF } from "@/vendor/js/funx"


import Vue from 'vue'
import {ClientTable} from 'vue-tables-2'
import JsonExcel from 'vue-json-to-excel';
 

// import Scrollable from "@/components/Common/Scrollable";

Vue.use(ClientTable)
Vue.use(VueResource);
Vue.component('downloadExcel', JsonExcel)


export default {
    components: {
        datePicker,
        ObtenerColorOEE,
        Multiselect
        // Scrollable,
    },
    data() {
        return {
            workstationGroup:[],
            selectedGroup:{},
            titleHeader:"",
            itemx:[],
            dateStart:"",
            dateFinsh:"",
            optionsCalendar: {
                format: "YYYY-MM-DD HH:mm",
                //useCurrent: false
                // minDate:Date(),
             },
            tableData: [],
            columns_result: [
                {key:'code_ct',label:'CT'},
                {key:'consecutive_order',label:'# Orden'},
                {key:'code',label:'Codigo'},
                {key:'description',label:'Producto'},
                {key:'code_module',label:'Modulo'},
                {key:'programmed_amount',label:'Und Reales'},
                {key:'created',label:'Fecha'},
                {key:'amount',label:'Cantidad'},
                {key:'amount_2',label:'Cantidad 2'},
                {key:'personal_code',label:'Codigo Persona'},
                {key:'personal_name',label:'Nombre Persona'},
                {key:'workstation_origin',label:'CT Origen'},
        ],
            
            options: {
                pagination: { chunk: 5 },
                filterable: [],
                sortIcon: {
                    // is: 'fa-sort',
                    // base: 'fas',
                     up: 'fa-sort-up',
                     down: 'fa-sort-down'
                }
            },
        }
    },
    methods: {
        numberWithCommas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
        cambiarFecha(){
            // console.log(moment(this.dateinicial).format("YYYY-MM-DDTHH:mm"))
            this.dateStart=this.dateinicial
        },

        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.tableData)
            const workbook = XLSX.utils.book_new()
            const filename = `prod_tiempo`
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        cargarDatos: function() {
            var paramtros =
                    this.dateStart +
                    ":00/" +
                    this.dateFinsh +
                    ":59";
                this.$http.get(reports+`/getreports/`+paramtros)
                    .then(respuesta =>{
                        return respuesta.json()
                    }).then(data => {

                        this.tableData=JSON.parse(data)
                        
                        // console.log(data)
           
            });
        },
    },
    created() {},
}
</script>

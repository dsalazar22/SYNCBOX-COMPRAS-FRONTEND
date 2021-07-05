<template>
    <div>
        <div class="h3">
            <div>
                <!-- {{titleHeader}} -->
                OEE - COMPAÑIA
            </div>
        </div>
        <div></div>
            <div class="shadow card">
              <div class="card-header font-weight-bold">RESULTADO OEE</div>
              <div class="card-body" style="padding:0px;">
                <!-- Cajas Meta:500
                Cajas Actuales:500 -->
                  <div id="disponibilidad" style="height: 500px; margin: 0 auto"></div>
              </div>
          </div>

          <div v-for="item in grupos">              
            <div class="shadow card">
                <div class="card-header font-weight-bold">RESULTADO OEE: {{item.description.toUpperCase() }}</div>
                <div class="card-body" style="padding:0px;">
                    <div :id="item.description" style="height: 300px; margin: 0 auto"></div>
                </div>
            </div>
          </div>

    </div>
        
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>

import Vue from "vue";
import { infomaster } from "@/components/i40/js/master";
// require( "@/components/i40/js/vendor/highcharts.js")
import VueResource from "vue-resource"
// Datepicker
import moment from 'moment'
// Import this component
import datePicker from 'vue-bootstrap-datetimepicker';
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
import Multiselect from 'vue-multiselect'
import PieChart from 'vue-pie-chart/src/PieChart.vue'
import {reports} from "@/components/i40/js/globals"
import ObtenerColorOEE from "@/components/i40/js/floor/colorsOEE.js"
// import $ from 'jquery'
import {ServerTable, ClientTable, Event} from 'vue-tables-2';
import JsonExcel from 'vue-json-to-excel';
 

// import Scrollable from "@/components/Common/Scrollable";

Vue.use(ClientTable);
Vue.use(VueResource);
Vue.component('downloadExcel', JsonExcel)

export default {
     components: {
        Multiselect,
        datePicker,
        // DonutChart,
        'pie-chart': PieChart,
        // Scrollable,
        ObtenerColorOEE,
     },
     data() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            return {
                grupos:[],
                resultadogrupos:[],
                preresultadogrupos:[],
            }
     },
     methods: {

         getOEECompania(){
             this.$http.get(reports+'/ObtenerOEECompania').then(respuesta =>{
                return respuesta.json()
            })
            .then(resultado =>{
                let array = resultado
                let categorias=[]
                let disponibilidad=[]
                let eficiencia=[]
                let calidad=[]
                let oee=[]

                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    categorias.push(element.mes)
                    disponibilidad.push(element.disponibilidad),
                    eficiencia.push(element.eficiencia)
                    calidad.push(element.calidad)
                    oee.push(element.oee)
                }

                let fullinfo = [{name:'Disponibilidad', data:disponibilidad},
                {name:'Eficiencia', data:eficiencia},
                {name:'Calidad', data:calidad},
                {name:'OEE', data:oee}]

                this.chartinfo('disponibilidad',fullinfo,categorias)

                

                // this.chartinfo('eficiencia',eficiencia,categorias)
                // this.chartinfo('calidad',calidad,categorias)
                // this.chartinfo('oee',oee,categorias)




            });

         },

          async getOEEGrupos(){
            await this.$http.get(reports+'/ObtenerOEEGrupos').then(respuesta =>{
                return respuesta.json()
            })
            .then(resultado =>{
                this.grupos=resultado[0].grupos
                let array=resultado[0].totalgrupos
                let categorias=[]
                
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    if(this.preresultadogrupos[element.description] == undefined){
                        this.preresultadogrupos[element.description] =[]
                        this.preresultadogrupos[element.description].push({name:'Disponibilidad',data:[]})
                        this.preresultadogrupos[element.description].push({name:'Eficiencia',data:[]})
                        this.preresultadogrupos[element.description].push({name:'Calidad',data:[]})
                        this.preresultadogrupos[element.description].push({name:'OEE',data:[]})
                    }

                    let array1 = this.preresultadogrupos[element.description]
                    categorias.push(element.mes)

                    for (let index1 = 0; index1 < array1.length; index1++) {
                        const element1 = array1[index1];
                        if (element1.name == 'Disponibilidad') {
                            this.preresultadogrupos[element.description][index1].data.push(element.disponibilidad)
                        }
                        
                        else if (element1.name == 'Eficiencia') {
                            this.preresultadogrupos[element.description][index1].data.push(element.eficiencia)
                        }
                        else if (element1.name == 'Calidad') {
                            this.preresultadogrupos[element.description][index1].data.push(element.calidad)
                        }
                        else if (element1.name == 'OEE') {
                            this.preresultadogrupos[element.description][index1].data.push(element.oee)
                        }
                        
                    }
                }

                array = Object.keys(this.preresultadogrupos)

                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    this.chartinfo(element,this.preresultadogrupos[element],categorias)
                    
                }
            });
         },

         chartinfo(name,values,category){
             Highcharts.chart(name, {
            xAxis: {
                categories: category
            },
            title: {
                style: {
                    display: 'none'
                }
            },
            series: values
        });
         }
    
     },
     created() {
         this.getOEEGrupos()
     },
     mounted(){
         this.getOEECompania()
         this.getOEEGrupos()
     }
}

</script>



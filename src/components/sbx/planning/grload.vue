<template>
    <div>

        <h4 class="font-weight-bold py-3 mb-4">Capacidades por Grupos de Centros de Trabajo</h4>
        <div class="w-100 text-right"></div>

        <div>
            <h3>Seleccione un Grupo de Centros de Trabajo</h3> 
             
            <multiselect
                v-model="selectedGroup"
                :options="workstationGroup"
                
                placeholder="Grupo de Centros de Trabajo"
                label="description"
                track-by="description" />
        </div>

        <div class="w-100 text-right mt-2 mb-2">
            <button type="button" class="btn btn-success" v-on:click="load_groups_ws('')">Consultar Por Día</button>
            <button type="button" class="btn btn-success" v-on:click="load_groups_per_month_ws('')">Consultar Por Mes</button>
            <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
        </div>

        <div id="container2"></div>

      
        <!-- <div class="w-100 text-right mt-2 mb-2">
            <button type="button" class="btn btn-success" v-on:click="content_load('')">Consultar</button>
            
        </div> -->

        <div id="ctxwsload"></div>

        <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
            ¿Está seguro que desea retirar esta orden?
            <div class="w-100 text-center">
                Al retirar la orden de producción, lo hará con todas las partes y los procesos que dependan de esta misma.
            </div>
            
            <template slot="button"><b-btn @click="deleteRecord()" variant="danger" class="mr-2">Retirar</b-btn></template>
            <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>

    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
// require("@/components/i40/js/@/components/i40/js/vendor/highcharts.js");
import { infoplanning } from "@/components/i40/js/iplanning";
import Multiselect from 'vue-multiselect'
import { infomaster } from "@/components/i40/js/master";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue' 

export default {
    components: {
        Multiselect,
        SweetModal,
        SweetModalTab
        // Scrollable,
        // datePicker
    },

    data() {
        return {
            item_order:{},
            calendar1:[],
            selectedGroup:{},
            workstationGroup:[],

            selectedWorkstation:{},
            workstations:[],

            tableData:[],
            columns: [
                    {key:'status_modules_code', label:"Estado"},
                    {key:'consecutive_order', label:"# Orden"},
                    {key:'products_code', label:"Codigo"},
                    {key:'products_description', label:"Descripcion"},
                    {key:'order_code', label:"# Pedido"},
                    {key:'name', label:"Cliente"},
                    {key:'requested_date', label:"Fecha Solicitada"},
                    {key:'start_date', label:"Fecha Inicio"},
                    {key:'finish_date', label:"Fecha Fin"},
                    {key:'activity_description', label:"Actividad"},
                    {key:'programed_amount', label:"Programado"},
                    {key:'produced_amount', label:"Producido"},
                    {key:'pending_amount', label:"Producido"},
                    // {key:'description', label:"Descripción"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Editar/Eliminar"}
                ],
            objInfo1:{}
        }
    },

    methods: {
        closeDeleteRecord(){
            this.item_order = {}
            this.$refs.errorWithButtonAlert.close()
        },

        deleteRecord(){
            infoplanning.removeorderplanned(this.item_order.production_order_id).then(data =>{
                this.content_load('')
                this.$refs.errorWithButtonAlert.close()
            })
        },

        data_change(item, action){
            this.item_order = item
            this.$refs.errorWithButtonAlert.open()
        },
        content_load_group(){
            this.objInfo1 = {"workstation_id":this.selectedWorkstation.workstation_id}
        },

        load_groups_per_month_ws(){
            document.getElementById("ctxwsload").innerHTML = ''

            this.objInfo1 = {"workstation_group_id":this.selectedGroup.workstation_group_id}
            let categories = []
            let planned = []
            let programmed = []
            
            infoplanning.calendarcontroller(this.objInfo1, "select-group-per-month-slots").then(data =>{
                
                let calendarx = data.data

                for (let index = 0; index < calendarx.length; index++) {
                    const element = calendarx[index];
                    categories.push(element.start_date)
                    programmed.push(element.programed_hours)
                    planned.push(element.planned_hours)
                }

                let chart_info_calc = {}
                chart_info_calc.categories = categories
                chart_info_calc.hoursPlanned = planned
                chart_info_calc.hoursProgrammers = programmed
                chart_info_calc.title =""
                this.load_chart(chart_info_calc,'container2', this.selectedGroup.description + ' por Día')
            })

            this.load_contentbygroup(this.selectedGroup.workstation_group_id)
        },

        load_groups_ws(){
            document.getElementById("ctxwsload").innerHTML = ''
            
            this.objInfo1 = {"workstation_group_id":this.selectedGroup.workstation_group_id}
            let categories = []
            let planned = []
            let programmed = []
            
            infoplanning.calendarcontroller(this.objInfo1, "select-group-slots").then(data =>{
                
                let calendarx = data.data

                for (let index = 0; index < calendarx.length; index++) {
                    const element = calendarx[index];
                    categories.push(element.start_date)
                    programmed.push(element.programed_hours)
                    planned.push(element.planned_hours)
                }

                let chart_info_calc = {}
                chart_info_calc.categories = categories
                chart_info_calc.hoursPlanned = planned
                chart_info_calc.hoursProgrammers = programmed
                chart_info_calc.title =""
                this.load_chart(chart_info_calc,'container2', this.selectedGroup.description + ' por Día')
            })

            this.load_contentbygroup(this.selectedGroup.workstation_group_id)
        },

        load_contentbygroup(wsgrpid){

            for (let index = 0; index < this.workstations.length; index++) {
                const element = this.workstations[index];
                if(element.group_id==wsgrpid){
                    const div = document.createElement('div');
                    div.className = 'row mt-2';
                    div.id=element.code
                    document.getElementById('ctxwsload').appendChild(div);

                    this.content_load(element, element.workstation_id)
                }
            }
            
        },

        content_load(idcontent, wsid){
            this.objInfo1 = {"workstation_id":wsid}
            let categories = []
            let planned = []
            let programmed = []
            // console.log(this.objInfo1)
            infoplanning.calendarcontroller(this.objInfo1, "select-workstation-slots").then(data =>{
                    if(data.data.length >0 && data.data != "Invalid Option" ){
                        this.calendar1 = data.data

                        for (let index = 0; index < this.calendar1.length; index++) {
                            const element = this.calendar1[index];
                            categories.push(element.start_date)
                            programmed.push(element.programed_hours)
                            planned.push(element.planned_hours)
                        }

                        let chart_info_calc = {}
                        chart_info_calc.categories = categories
                        chart_info_calc.hoursPlanned = planned
                        chart_info_calc.hoursProgrammers = programmed
                        chart_info_calc.title =""
                        this.load_chart(chart_info_calc,idcontent.code, 'Centro de Trabajo ' + idcontent.code +' por Día')


                        // infoplanning.workstationslots(this.selectedGroup.workstation_id).then(data =>{
                        //     console.log(data)
                        //     // if(data.data.length >0 && data.data != "Invalid Option" ){
                        //     //     this.calendar1 = data.data

                        //         // for (let index = 0; index < this.calendar1.length; index++) {
                        //         //     const element = this.calendar1[index];
                        //         //     categories.push(element.start_date)
                        //         //     planned.push(element.planned_hours)
                        //         // }

                        //         // let chart_info_calc = {}
                        //         // chart_info_calc.categories = categories
                        //         // chart_info_calc.hoursPlanned = planned
                        //         // chart_info_calc.hoursProgrammers = []
                        //         // chart_info_calc.title =""
                        //         // this.load_chart(chart_info_calc)
                        //     // }
                        // })

                        //  for (let index = 0; index < this.calendar1.length; index++) {
                        //     const element = this.calendar1[index];
                        //     categories.push(element.start_date)
                        //     planned.push(element.planned_hours)
                        //  }

                        // let chart_info_calc = {}
                        // chart_info_calc.categories = categories
                        // chart_info_calc.hoursPlanned = planned
                        // chart_info_calc.hoursProgrammers = []
                        // chart_info_calc.title =""
                        // this.load_chart(chart_info_calc)
                    }
                })

            infoplanning.calendarcontroller(this.objInfo1, "select-workstation-details-slots").then(data =>{
                // console.log(data)
                    if(data.data.length >0 && data.data != "Invalid Option" ){
                        if(data.data != "")
                            this.tableData = data.data
                        else
                            this.tableData = []
                    }
                })
           
            // infoplanning.getplanninginfo(info_send,'analyze').then(data => {
            // })

        },

        load_chart(chartInfo, docid, subtitle){
            
            Highcharts.chart(docid, {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: subtitle
                },
                subtitle: {
                    text: 'Horas Programadas vs Horas Planeadas'
                },
                xAxis: [{
                    categories: chartInfo.categories,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Horas Planeadas',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        //text: 'Rainfall',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} mm',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true,
                    visible: false
                }
                ],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 0,
                    verticalAlign: 'top',
                    y: 0,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255,255,255,0.25)'
                },
                series: [{
                    name: 'Horas Programadas',
                    type: 'column',
                    data: chartInfo.hoursProgrammers,
                    tooltip: {
                        valueSuffix: ' h'
                    }

                }, {
                    name: 'Horas Planeadas',
                    type: 'line',
                    data: chartInfo.hoursPlanned,
                    tooltip: {
                        valueSuffix: ' h'
                    }
                }]
            });
        },
    },
     created() {

          infomaster.group([],"select").then(data => {
                    
                    // this.workstationType = data.data[0].wstype
                    // this.workstationPlant = data.data[0].wsplant

                    this.workstationGroup= data.data
                    
                    // if( data.data[0].workstation != null){
                    //     this.tableData = data.data[0].workstation
                    //     this.totalRows= this.tableData.length
                    // }
                })

         infomaster.workstation([],"select").then(data => {
                    
                    // this.workstationType = data.data[0].wstype
                    // this.workstationPlant = data.data[0].wsplant
                    this.workstations= data.data[0].workstation
                    // if( data.data[0].workstation != null){
                    //     this.tableData = data.data[0].workstation
                    //     this.totalRows= this.tableData.length
                    // }
                })
     },
    
}
</script>

<template>
    <div>
        
<div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12">

            <div v-if="selectedReport=='timeline'">
                <perfect-scrollbar style="height: 300px; width:80%" class="ml-3 mb-3">
                    <light-timeline :items='donutdata'></light-timeline> 
                </perfect-scrollbar>
            </div>

            <div id="resultadoDefectuosas" v-else-if="selectedReport!='oee' && selectedReport!='timeline' && show"></div>
            <div v-else-if="selectedReport=='oee'">
                <div class="row">
                    <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                        <radial-gauge :value="this.items[0].disponibilidad" :options="configGauge('Disponibilidad')"></radial-gauge>
                    </div>
                    <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                        <radial-gauge :value="this.items[0].eficiencia" :options="configGauge('Eficiencia')"></radial-gauge>
                    </div>
                    <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                        <radial-gauge :value="this.items[0].calidad" :options="configGauge('Calidad')"></radial-gauge>
                    </div>
                    <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                        <radial-gauge :value="this.items[0].oee" :options="configGauge('OEE')"></radial-gauge>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="list-group mb-3">
                        <b-table small class="mt-2" responsive="true" striped hover :foot-clone="true" :fields="fields" :items="items"></b-table>
                    </div>
                </div>
            </div>
            </div>
        </div>

        <!-- <b-modal id="modalTimeLine" size="lg" title="TimeLine Tiempos de Paro">
        <div class="row col-centered">
            <div class="col-12 text-center">
                <h2>TIMELINE</h2>
            </div>
              <div class="col-3"></div>
              <div class="col-6">
                <Scrollable :height="630">
            <light-timeline :items='items'></light-timeline>
            </Scrollable>
            </div>
            <div class="col-3"></div>
        </div>
        </b-modal> -->
       
    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-color/vue-color.scss" lang="scss"></style>

<script>
// require( "@/vendor/charts/highcharts.js")
import { realtime } from '@/vendor/sbx/sbx-realtime/realtime'
import LinearGauge from 'vue-canvas-gauges/src/LinearGauge'
import RadialGauge from 'vue-canvas-gauges/src/RadialGauge'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'

export default {
    components:{
        PerfectScrollbar,
        LinearGauge,
        RadialGauge,
    },
    data() {
        return {
            donutdata:[],
            items: [],
            dateStart:null,
            dateFinsh:null,
            selectedReport:'',
            datosOEE: {},
            itemTimeLine:[],
            show:true,
        fields: 
            [],
        }
    },
    methods: {
        openCharts(report, control, code, start, finish){
            this.selectedReport = report
             
            realtime.getReport(control, report, code, start, finish).then(data=>{

                // console.log(data.data)

                this.fields = data.data[0].field
                this.items = data.data[0].info
                this.donutdata = data.data
                this.show = this.donutdata[0].show_chart[0].show == undefined ? false : this.donutdata[0].show_chart[0].show 
                if(report != "oee" && data.data[0].show_chart[0].show){
                    Highcharts.chart("resultadoDefectuosas", {
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false,
                                type: "pie"
                            },
                            title: {
                                text: ""
                            },
                            tooltip: {
                                pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: "pointer",
                                    dataLabels: {
                                    enabled: true,
                                    format: "{point.name} {point.percentage:.1f} %",
                                        style: {
                                            color:
                                            (Highcharts.theme &&
                                                Highcharts.theme.contrastTextColor) ||
                                            "black"
                                        }
                                    }
                                }
                            },
                            series: [
                            {
                                name: "Paros",
                                colorByPoint: true,
                                data: data.data[0].info
                            }]
                    });
                }
             })
        },

        configGauge(title){
                return {
                        minValue: 0,
                        // startAngle: 90,
                        // ticksAngle: 180,
                        colorPlate: "#f7f7f7",
                        borderShadowWidth: 0,
                        borders: false,
                        needleType: "arrow",
                        needleWidth: 2,
                        needleCircleSize: 5,
                        needleCircleOuter: false,
                        needleCircleInner: true,
                        animationDuration: 500,
                        animationRule: "linear",
                        units: title,
                        valueBox: true,
                        maxValue: 100,

                        valueTextShadow: false,
                        valueDec: 2,
                        barBeginCircle: 0,
                        fontNumbersSize: 24,
                        fontUnitsSize: 25,
                        fontValueSize: 30,
                        majorTicks: [
                            "0",
                            "10",
                            "20",
                            "30",
                            "40",
                            "50",
                            "60",
                            "70",
                            "80",
                            "90",
                            "100",
                        ],
                        width: 200,
                        height: 200,
                        minorTicks: 5,
                        strokeTicks: true,
                            highlights: [
                                {
                                    "from": 50,
                                    "to": 65,
                                    "color": "#d93749"
                                },
                                {
                                    "from": 65,
                                    "to": 75,
                                    "color": "#FF8C00"
                                },
                                {
                                    "from": 75,
                                    "to": 85,
                                    "color": "#FFD700"
                                },
                                {
                                    "from": 85,
                                    "to": 95,
                                    "color": "#40a070"
                                },
                                {
                                    "from": 95,
                                    "to": 100,
                                    "color": "#00C5CD"
                                }
                            ],
                    }
        
        },

        getCode(){
            
            let count =0
            let text_name = ''

            for (const item in this.$route.params) {
                count=count+1

                if(count ==1){
                    text_name = this.$route.params[item]
                }
            }

            return text_name
        }
    },
}
</script>

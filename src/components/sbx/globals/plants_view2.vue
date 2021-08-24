<template>
    <div>

        <!-- {{process.env.datacontroller}} -->
     <!-- {{datacontroller}} -->
    <b-card no-body :class="'shadow mb-1 border border-secondary bg-white'">
        <h1 class="display-4 text-center text-dark mt-2">
            {{text_name_title}}
        <hr>
    </h1>
    <div class="m-2">
    
        <div class="row">
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
               <radial-gauge :value="indicadores.disponibilidad" :options="configGauge('Disponibilidad')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                  <radial-gauge :value="indicadores.eficiencia" :options="configGauge('Eficiencia')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                 <radial-gauge :value="indicadores.calidad" :options="configGauge('Calidad')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                 <radial-gauge :value="indicadores.oee" :options="configGauge('OEE')"></radial-gauge>
            </div>
        </div>  
<!-- 
 <b-row class="mt-4">
     <b-col xs="12" md="12">
        <b-row>
            <b-col v-for="a in cptItems" xs="12" md="4" class="mb-2">
                <b-btn block :variant="eventColorSelected" @click="detalle_cliente(a)">
                    {{a.customer_name}} <br> {{numberWithCommas(a.totalprice)}}
                </b-btn>
            </b-col>
        </b-row>
     </b-col>
 </b-row> -->

    </div>

</b-card>

    


    <b-card no-body :class="'shadow mb-1 border border-secondary bg-white'">
        <h1 class="display-4 text-center text-dark mt-2">
            {{text_name}}
        <hr>
    </h1>
    <div class="m-2">
        
    
        <!-- {{tableData}} -->
        <b-row>
            <b-col v-for="a in tableData" xs="12" :md="tableData.length >= 2 ? 6 : 12" class="mb-2">

                <b-card class="m-2"  no-body>
                    <div class="contact-content">
                        <div class="contact-content-about">
                            <h4 class="contact-content-name m-2 text-center"><a :href="godetails(a)" class="text-body">{{a.description}}</a></h4>
                            <div class="small">
                                <!-- <div>{{contact.job_title}}</div>
                                <div v-if="contact.company"> {{contact.company}}  &nbsp;&nbsp; <span class="text-lighter">|</span>  </div>
                                <div v-if="contact.phone"> Telefono: {{contact.phone}}  &nbsp;&nbsp; <span class="text-lighter">|</span> &nbsp;&nbsp; 
                                    Celular: {{contact.phone}}  &nbsp;&nbsp; <span class="text-lighter">|</span> &nbsp;&nbsp; Correo: {{contact.email}}</div> -->
                            </div>
                            <hr class="my-1 border-light">

                            <div class="row ml-2 mr-2">
                                <div class="col"  style="padding:0">
                                    <b-card class="m-0 text-center" :class="'bg-'+set_color_indicator(a.disponibilidad)" no-body>
                                        <div :class="'text-'+(set_color_indicator(a.disponibilidad)=='success' || set_color_indicator(a.disponibilidad)=='danger'?'white':'dark')">
                                            <div class="ml-2 mr-2">
                                                <h4 class="mt-1" style="padding:0; margin-bottom:0;">
                                                    {{a.disponibilidad}}%
                                                </h4>
                                            </div>
                                            <hr class="my-1 border-dark m-0">
                                            <div class="ml-2 mr-2">
                                                <small>Disponibilidad</small>
                                            </div>
                                        </div>
                                    </b-card>
                                </div>
                                <div class="col"  style="padding:0">
                                    <b-card class="m-0 text-center" :class="'bg-'+set_color_indicator(a.eficiencia)" no-body>
                                        <div :class="'text-'+(set_color_indicator(a.eficiencia)=='success' || set_color_indicator(a.eficiencia)=='danger'?'white':'dark')">
                                            <div class="ml-2 mr-2">
                                                <h4 class="mt-1" style="padding:0; margin-bottom:0;">
                                                    {{a.eficiencia}}%
                                                </h4>
                                            </div>
                                            <hr class="my-1 border-dark m-0">
                                            <div class="ml-2 mr-2">
                                                <small>Eficiencia</small>
                                            </div>
                                        </div>
                                    </b-card>
                                </div>
                                <div class="col" style="padding:0">
                                    <b-card class="m-0 text-center" :class="'bg-'+set_color_indicator(a.calidad)" no-body>
                                        <div :class="'text-'+(set_color_indicator(a.calidad)=='success' || set_color_indicator(a.calidad)=='danger'?'white':'dark')">
                                            <div class="ml-2 mr-2">
                                                <h4 class="mt-1" style="padding:0; margin-bottom:0;">
                                                    {{a.calidad}}%
                                                </h4>
                                            </div>
                                            <hr class="my-1 border-dark m-0">
                                            <div class="ml-2 mr-2">
                                                <small>Calidad</small>
                                            </div>
                                        </div>
                                    </b-card>
                                </div>
                            </div>


                                <!-- <div class="ml-3 mr-3" > -->
                                    <b-card class="ml-2 mr-2 text-center" :class="'bg-'+set_color_indicator(a.oee)" no-body>
                                        <div :class="'text-'+(set_color_indicator(a.oee)=='success' || set_color_indicator(a.oee)=='danger'?'white':'dark')">
                                            <div class="ml-2 mr-2">
                                                <h4 class="mt-1" style="padding:0; margin-bottom:0;">
                                                    {{a.oee}}%
                                                </h4>
                                            </div>
                                            <hr class="my-1 border-dark m-0">
                                            <div class="ml-2 mr-2">
                                                <small>OEE</small>
                                            </div>
                                        </div>
                                    </b-card>
                                <!-- </div> -->

                            <!-- <div class="text-left">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="ojbContacto=contact;deleteCustomer=false;"><i class="ion ion-md-create"></i></b-btn>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="ojbContacto=contact;deleteCustomer=true;"><i class="ion ion-md-close"></i></b-btn>
                            </div> -->
                        </div>
                    </div>
                </b-card>

                <!-- {{a}}
                <h4 class="contact-content-name mb-1"><router-link :to="{ path: godetails(a) }">{{a.description}}</router-link></h4>

                <b-badge pill :variant="set_color_indicator(a.disponibilidad)">{{a.disponibilidad}}</b-badge>
                <b-badge pill :variant="set_color_indicator(a.eficiencia)">{{a.eficiencia}}</b-badge>
                <b-badge pill :variant="set_color_indicator(a.calidad)">{{a.calidad}}</b-badge>
                <b-badge pill :variant="set_color_indicator(a.oee)">{{a.oee}}</b-badge> -->
                
            </b-col>
        </b-row>

    </div>

</b-card>

    


    </div>
</template>

<style src="@/vendor/libs/c3/c3.scss" lang="scss"></style>

<script>
import {realtime} from '@/vendor/sbx/sbx-realtime/realtime'
import PieChart from 'vue-pie-chart/src/PieChart.vue'
import LinearGauge from 'vue-canvas-gauges/src/LinearGauge'
import RadialGauge from 'vue-canvas-gauges/src/RadialGauge'

import flatPickr from 'vue-flatpickr-component'
import chartspie from './charts/charts_pie'
import drump from '@/components/sbx/production/drump.vue'

function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
  name: 'dashboard-4',
  
  components:{
        drump,
        LinearGauge,
        RadialGauge,
        chartspie,
        flatPickr,
    },

  metaInfo: {
    title: 'Real Time'
  },
  watch:{
        '$route.params':function(value){
            this.text_name = value ? 'PLANTAS DISPONIBLES' : 'GRUPOS DE CENTROS DE TRABAJO DISPONIBLES'
            this.text_name_title = value ? 'ESTADO GENERAL DE LA PLANTA' : 'ESTADO GENERAL DEL GRUPO DE CENTROS DE TRABAJO'
        }
  },
  data: () => ({
    filter: null,
    indicadores:{},
    text_name: 'PLANTAS DISPONIBLES',
    text_name_title:'ESTADO GENERAL DE LA PLANTA',

    showEditForm:false,
    showFinOrders:false,
    wscode:'',
    datetimeConfig: {
        dateFormat: 'Y-m-d H:i',
        enableTime: true,
        altInput: true,
        animate: !isRTL()
    },

    startDate:null,
    finishDate:null,
    parameterPos:"",
    
    seleccion:'paros',

    tableData:[],
    columns: [
           {key:'description', label:"Descripción"},
           
           {key:'disponibilidad', label:"Disponibilidad"},
           {key:'eficiencia', label:"Eficiencia"},
           {key:'calidad', label:"Calidad"},
           {key:'oee', label:"OEE"},
           {key:'id', label:"id", thClass: 'd-none', tdClass: 'd-none'},
           {key:'edit', label:"Detalle"}],
    title_resources:"Plantas"
  }),

  methods: {

    set_color_indicator(value){
        if(value>0 && value<=75)
            return 'danger'
        else if(value>75 && value<85)
            return 'warning'
        else
            return 'success'
    },
    
    godetails(args){
        
        if (args.linkpart == 'floor'){
            this.title_resources = 'Plantas'
            return 'info/' + args.description + '/' + args.id
        }
        if (args.linkpart == 'group')
        {
            this.title_resources = "Grupos"
            this.wscode = this.$route.params['codefloor']
            return '/info/' + this.$route.params['codefloor'] + '/' + this.$route.params['idfloor'] + '/' + args.description + '/' + args.id  
        }
        // else (args.linkpart == 'group')
        //     this.$router.push('/' this.$route + args.linkpart + '/' + args.id)
    },

    contentOEE() {

        let mods = "company"
        this.parameterPos = "company"
        let modsid = 0

        if(this.$route.params['codefloor'] != null){
            mods = "floor"
            this.parameterPos = "plant"
            this.wscode = this.$route.params['codefloor']
            modsid = this.$route.params['idfloor']
        }

        realtime.obteneroeeinfocomplete().then(data => {
            // console.log(mods,data)
            this.tableData = []
            this.indicadores={
                eficiencia:0,
                disponibilidad:0,
                calidad:0,
                oee:0
            }

            if(mods == 'company'){
                let ef =(data.data[0].totales[0].eficiencia)
                let cal =(data.data[0].totales[0].calidad)
                let disp = (data.data[0].totales[0].disponibilidad)
                this.indicadores.eficiencia = parseFloat((ef * 100).toFixed(2))
                this.indicadores.disponibilidad =parseFloat((disp * 100).toFixed(2))
                this.indicadores.calidad=parseFloat((cal * 100).toFixed(2))
                this.indicadores.oee =parseFloat(((disp*cal*ef) * 100).toFixed(2))

                if(data.data[0].totales_planta != null){
                    let array = data.data[0].totales_planta
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];

                        let ef =parseFloat(((element.eficiencia)*100).toFixed(2))
                        let cal =parseFloat(((element.calidad)*100).toFixed(2))
                        let disp = parseFloat(((element.disponibilidad)*100).toFixed(2))
                        let oee = parseFloat(((element.eficiencia*element.calidad*element.disponibilidad)*100).toFixed(2))

                        this.tableData.push({description:element.planta, eficiencia:ef, calidad:cal,disponibilidad:disp, oee:oee,linkpart: 'floor', id:element.workstation_plant_id})
                        
                    }
                    // this.tableData =  data.data[0].totales_planta
                }
            }else{
                let array = data.data[0].totales_grupos
                let arrayPlanta = data.data[0].totales_planta

                for (let index = 0; index < arrayPlanta.length; index++) {
                    const element = arrayPlanta[index];

                    if(element.planta == this.wscode){
                        let ef =(element.eficiencia)
                        let cal =(element.calidad)
                        let disp = (element.disponibilidad)

                        this.indicadores.eficiencia = parseFloat((ef * 100).toFixed(2))
                        this.indicadores.disponibilidad =parseFloat((disp * 100).toFixed(2))
                        this.indicadores.calidad=parseFloat((cal * 100).toFixed(2))
                        this.indicadores.oee =parseFloat(((disp*cal*ef) * 100).toFixed(2))
                    }
                    
                }

                if(array != null){
                    
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];
                        let ef =parseFloat(((element.eficiencia)*100).toFixed(2))
                        let cal =parseFloat(((element.calidad)*100).toFixed(2))
                        let disp = parseFloat(((element.disponibilidad)*100).toFixed(2))
                        let oee = parseFloat(((element.eficiencia*element.calidad*element.disponibilidad)*100).toFixed(2))

                        this.tableData.push({description:element.wsgroup,eficiencia:ef, calidad:cal,disponibilidad:disp, oee:oee,linkpart: 'group', id:element.workstation_group_id})
                        
                    }
                    // this.tableData =  data.data[0].totales_planta
                }
            }
        })

        //  this.indicadores ={oee: Math.random()*100, disp: Math.random()*100, efic: Math.random()*100, qual:Math.random()*100}
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

    onFiltered (filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
    },
    cargarDatos(start,finish,code){
        if(this.startDate != "" && this.finishDate != ""){
            this.$refs.stoptimes.openCharts(this.seleccion, this.parameterPos,this.wscode,this.startDate+":00",this.finishDate+":59")
        }
    },

        ///pestana
    seleccionPestana(item){
        this.seleccion = item
    
        if(this.startDate != "" && this.finishDate != ""){
            this.$refs.stoptimes.openCharts(this.seleccion, this.parameterPos,this.wscode,this.startDate+":00", this.finishDate+":59")
        }
    }
},

    created: function() {
        // this.timer = setInterval(this.contentOEE, 2000)
        this.text_name = Object.entries(this.$route.params).length == 0 ? 'PLANTAS DISPONIBLES' : 'GRUPOS DE CENTROS DE TRABAJO DISPONIBLES'
        this.text_name_title = Object.entries(this.$route.params).length == 0 ? 'ESTADO GENERAL DE LA PLANTA' : 'ESTADO GENERAL DEL GRUPO DE CENTROS DE TRABAJO'
        this.$options.interval = setInterval(this.contentOEE, 1000)
        // this.contentOEE

    },

    mounted () {
        this.text_name = Object.entries(this.$route.params).length == 0 ? 'PLANTAS DISPONIBLES' : 'GRUPOS DE CENTROS DE TRABAJO DISPONIBLES'
        this.text_name_title = Object.entries(this.$route.params).length == 0 ? 'ESTADO GENERAL DE LA PLANTA' : 'ESTADO GENERAL DEL GRUPO DE CENTROS DE TRABAJO'
    },
    beforeDestroy () {
        clearInterval(this.$options.interval)
    }
}
</script>

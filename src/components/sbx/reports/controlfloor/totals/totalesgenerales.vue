<template>
    <div>
        <h4 class="font-weight-bold py-3 mb-1">
               Informacion General
                <!-- <small>Tiempo de Paro - Grupo de Centro de Trabajo</small> -->
        </h4>

        <div class="text-right mb-2">
            <b-button-group size="xs">
                <b-button
                        v-for="(btn, idx) in buttons"
                        :key="idx"
                        :pressed.sync="btn.state"
                        @click="evtsCharts(btn.code)"
                        variant="primary">
                        {{ btn.caption }}
                    </b-button>
            </b-button-group>
        </div>
        <div class="row">
            <div class="col-9">
                <div id="container"></div>
            </div>
            <div class="col-3">
                <br>
                <b>Fecha:</b> {{selecteditem.fecha}} <br/>
                <b>Tiempo Trabajado:</b> {{numberWithCommas(selecteditem.tiempototaltrabajo)}}<br/>
                <b>Microparos:</b> {{numberWithCommas(selecteditem.microparos)}}<br/>
                <b>Total Producido:</b> {{numberWithCommas(selecteditem.totalproducido)}}<br/>
                <b>Costo Producido:</b> {{numberWithCommas(selecteditem.costoproducido)}}<br/>
                <b>Costo Defectuosas:</b> {{numberWithCommas(selecteditem.costodefectuosas)}}<br/>
                <b>Unidades Esperadas:</b> {{numberWithCommas(selecteditem.unidadesesperadas)}}<br/>
                <b>Eficiencia:</b> {{numberWithCommas(selecteditem.eficiencia)}}<br/>
                <b>Tiempo Paro:</b> {{numberWithCommas(selecteditem.tiempototal)}}<br/>
                <b>Costo Tiempo de Paro:</b> {{numberWithCommas(selecteditem.costototal)}}<br/>
            </div>
        </div>
        

        <b-table :sticky-header="false" :no-border-collapse="false" responsive style="font-size:12px"
                   :items="selecteditem.detalle"  :fields="columnas">

                        <template v-slot:head(code)="scope">
                            <div class="text-nowrap">Codigo</div>
                        </template>
                        <template v-slot:head(description)="scope">
                            <div class="text-nowrap">Descripcion</div>
                        </template>
                        <!-- <template v-slot:cell(description)="scope">
                            <div class="text-nowrap">{{scope.description}}</div>
                        </template> -->
                        <template v-slot:cell(tiempototaltrabajo)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.tiempototaltrabajo)}}</div>
                        </template>
                        <template v-slot:cell(microparos)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.microparos)}}</div>
                        </template>
                        <template v-slot:cell(totalproducido)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.totalproducido)}}</div>
                        </template>
                        <template v-slot:cell(unddefectuosas)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.unddefectuosas)}}</div>
                        </template>
                        <template v-slot:cell(costoproducido)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.costoproducido)}}</div>
                        </template>
                        <template v-slot:cell(costodefectuosas)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.costodefectuosas)}}</div>
                        </template>
                        <template v-slot:cell(unidadesesperadas)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.unidadesesperadas)}}</div>
                        </template>

                    
                    </b-table>

    </div>


</template>

<script>
    import Vue from 'vue'
    import VueResource from 'vue-resource'
    import {reports} from "@/components/i40/js/globals"
    Vue.use(VueResource)

    export default {
          metaInfo: {
            title: 'Totales Generales'
        },
        data() {
            return {

                columnas: [
                    {key:'code',sortable:true, label:"Codigo"},
                    {key:'description',sortable:false, label:"Descripcion"},
                    {key:'tiempototaltrabajo',sortable:false, label:"Tiempo Trabajado (min)"},
                    {key:'microparos',sortable:false, label:"Microparos (min)"},
                    {key:'totalproducido',sortable:false, label:"Cant Producidas"},
                    {key:'unddefectuosas',sortable:false, label:"Cant Defectuosas"},
                    {key:'costoproducido',sortable:false, label:"$ Produccion"},
                    {key:'costodefectuosas',sortable:false, label:"$ Defecutosas"},
                    {key:'unidadesesperadas',sortable:false, label:"Cant Esperada"},
                    {key:'eficiencia',sortable:false, label:"Eficiencia"},
                    {key:'calidad',sortable:false, label:"Calidad"},
                ],


                buttons: [
                    { caption: 'Unidades Producidas', state: true, code: 'undsprod' },
                    { caption: 'Unidades Defectuosas', state: false, code: 'undsdefectuosas' },
                    { caption: 'Costo', state: false, code: 'costos' },
                    { caption: 'Eficiencia', state: false, code: 'eficiencia' },
                    
                ],


                selecteditem:{},
                completeinfo:[],
                categorias: [],
                calidad: [],
                costodefectuosas: [],
                costoproducido: [],
                costototal: [],
                eficiencia: [],
                microparos: [],
                tiempototal: [],
                tiempototaltrabajo: [],
                totalproducido: [],
                unddefectuosas: [],
                unidadesesperadas: [],
            }
        },
        methods: {
            evtsCharts(item){
                // console.log(item)
                for (let index = 0; index < this.buttons.length; index++) {
                    const element = this.buttons[index];
                    if(element.code != item){
                        this.buttons[index].state = false
                    }else{
                        this.buttons[index].state = true
                    }

                    if(item == 'undsprod'){
                        this.totales(this.caption, this.categorias,this.totalproducido, this)
                    }else if(item == 'undsdefectuosas'){
                        this.totales(this.caption, this.categorias,this.unddefectuosas, this)
                    }else if(item == 'costos'){
                        this.totales(this.caption, this.categorias,this.costototal, this)
                    }else if(item == 'eficiencia'){
                        this.totales(this.caption, this.categorias,this.eficiencia, this)
                    }else if(item == 'calidad'){
                        this.totales(this.caption, this.categorias,this.calidad, this)
                    }else if(item == 'ttotal'){
                        this.totales(this.caption, this.categorias,this.tiempototal, this)
                    }
                    
                }
            },
            download (){
                this.$http.get(reports+"/getgeneralcomplete" )
                    .then(respuesta => {
                    return respuesta.json();
                    })
                    .then(usuarios => {
                        // console.log(usuarios)

                        this.completeinfo=usuarios

                        let categorias = []
                        let valores = []

                        for (let index = 0; index < usuarios.length; index++) {
                            const element = usuarios[index];
                            this.categorias.push(element.fecha)
                            this.calidad.push(100-element.calidad)
                            // this.costodefectuosas.push(element.costodefectuosas)
                            // this.costoproducido.push(element.costoproducido)
                            this.costototal.push(element.costoproducido)
                            this.eficiencia.push(element.eficiencia)
                            // this.microparos.push(element.microparos)
                            this.tiempototal.push(element.tiempototal)
                            // this.tiempototaltrabajo.push(element.tiempototaltrabajo)
                            this.totalproducido.push(element.totalproducido)
                            this.unddefectuosas.push(element.unddefectuosas)
                            // this.unidadesesperadas.push(element.unidadesesperadas)

                            this.totales('Unidades Producidas', this.categorias,this.totalproducido, this)

                        }
                    });
            },
            numberWithCommas(x) {
                if(x == null)
                    x=0
                return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            },

            totales(caption, categoria,valor, infoback){
                Highcharts.chart('container', {
                        chart: {
                            zoomType: 'x'
                        },
                        title: {
                        text: ""
                        },
                        tooltip: {
                        //   pointFormat: "<b>{point.value:.1f}%</b>"
                        },
                        plotOptions: {
                            
                        area: {
                                fillColor: {
                                    linearGradient: {
                                        x1: 0,
                                        y1: 0,
                                        x2: 0,
                                        y2: 1
                                    },
                                    stops: [
                                        [0, Highcharts.getOptions().colors[0]],
                                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                    ]
                                },
                                marker: {
                                    radius: 2
                                },
                                lineWidth: 1,
                                states: {
                                    hover: {
                                        lineWidth: 1
                                    }
                                },
                                threshold: null,
                            

                            allowPointSelect: true,
                            cursor: "pointer",
                    
                            events: {
                                click: function (event) {

                                    

                                    for (let index = 0; index < infoback.completeinfo.length; index++) {
                                        const element = infoback.completeinfo[index];
                                        if(element.fecha == event.point.category){
                                            infoback.selecteditem =element
                                            break
                                        }
                                        
                                    }
                                    
                                    
                                        
                                        if(event.point.selected != true){
                                           
                                            
                                        }else{
                                            
                                        }
                                    
                                }
                            },
                        }
                        },
                        xAxis: {
                            categories: categoria,
                        },
                        series: [
                        {
                            type: 'area',
                            name: caption,
                            data:  valor
                        }]
                    });
                
            }

        },
        mounted() {
            this.download()
        }

    }
</script>
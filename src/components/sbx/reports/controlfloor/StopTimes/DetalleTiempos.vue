<template>
    <div>
        <h4 class="font-weight-bold py-3 mb-1">
               Detalle de Tiempos por Grupo
                <!-- <small>Tiempo de Paro - Grupo de Centro de Trabajo</small> -->
        </h4>

            <div>
                Seleccione un Grupo de Centros de Trabajo
                    <multiselect
                        v-model="selectedGroup"
                        :options="workstationGroup"
                        
                        placeholder="Grupo de Centros de Trabajo"
                        label="description"
                        track-by="description" />
                
            </div>

        <div class="row mb-4">
            <div class="col"></div>
            <div class="col-md-3">
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
             <div class="col-md-3">
                 <button type="button" class="btn btn-success" v-on:click="cargarDatos('')">Consultardd</button>
                 <b-btn variant="outline-success" @click="download">Imprimir</b-btn>
                <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
            </div>
        </div>
        <!-- <div class="row mb-2"> -->
            <!-- <div class="col text-center"><b-btn v-b-modal.modallg variant="primary" v-on:click="informacionReporte()">Información Tiempos de Paro</b-btn></div> -->
        <!-- </div> -->
        <div class="row">
            <div class="col-xl-4 col-md-12">
                <!-- START List group-->
                <div id="containerTiposParo" style="min-width: 250px; height: 400px; max-width: 600px; margin: 0 auto">
                    
                </div>
                <!-- END List group-->
            </div>
            <div class="col-xl-8">
                <!-- START bar chart-->
                <div class="card" id="cardChart3">
                   
                    <div class="card-wrapper">
                        <div class="card-body">
                            <!-- <FlotChart :data="barStackedData" :options="barStackedOptions" height="250px" /> -->
                            <div id="container3" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
                        </div>
                    </div>
                </div>
                <!-- END bar chart-->
            </div>
        </div>
        <div class="col-md-12 pl-0 pr-0">
            <div class="card card-default">
            <div class="card-header">Resultados de Tiempos por Centros de Trabajo</div>
                <div class="card-body">
                    <div id="container2" style="min-width: 300px; height: 400px; margin: 0 auto"></div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                  <div class="list-group mb-3">
            <!-- <a class="list-group-item" href="#"> -->
                    <table class="wd-wide">
                        <tbody>
                            <tr>
                                <div class="card card-default">
                                    <div class="card-header">
                                        <!-- <div class="px-2 float-right badge badge-danger">5</div>
                                        <div class="px-2 mr-2 float-right badge badge-success">12</div> -->
                                        Detalle de Tiempos en Minutos
                                    </div>
                                    <!-- START list group-->
                                    <div :height="430">
                                        <!-- <div class="list-group" v-for="item in donutdata"> -->
                                            <!-- <div class="list-group-item list-group-item-action" > -->
                                                <b-table striped hover :foot-clone="true" :fields="fields" :items="donutdata"></b-table>
                                            <!-- </div> -->
                                            <!-- END list group item-->
                                        <!-- </div> -->
                                    </div>
                                </div>
                            </tr>
                        </tbody>
                    </table>
            <!-- </a> -->
        </div>
            </div>
                <div class="col-md-6">
                    <div class="card card-default">
                    <div class="card-header">Resultados de Tiempos</div>
                        <div class="card-body">
                            <!-- <Morris type="Donut" id="morris-donut" :data="donutdata" :options="donutOptions"/> -->
                            <div id="container" style="min-width: 250px; height: 400px; max-width: 600px; margin: 0 auto"></div>
                        </div>
                    </div>
                </div>
        </div>


        <b-modal id="modallg" hide-footer size="lg" title="Información Tiempos de Paro">
            <div id="xcont"> 
                       <div class="row mb-2">
                           
                               <div class="col-3 text-center">
                                    <!-- <img class="img-fluid" src="../../../img/logo/Colanta.jpg" width="280" alt="App Logo"> -->
                               </div>
                               <div class="col-9 text-center">
                                   <h2>DIVISIÓN TÉCNICA <br>
                                    <small class="text-muted">DEPARTAMENTO DE PRODUCCIÓN</small></h2>
                                    <hr/>
                                   <div class="row">
                                      
                                    <div class="col-12">
                                        <h4>{{titleHeader}}</h4>
                                    </div>
                                    
                                    <div class="col-12">
                                            <h4>Todos los Centros de Trabajo</h4>
                                    </div>
                                    <div class="col-3">
                                        
                                    </div>
                                </div>
                                       <div class="row">
                           <div class="col-1"></div>
                           <div class="col-5">
                           <h4>Fecha Inicial: <small class="text-muted">{{dateStart}}</small></h4></div>
                           <div class="col-5">
                           <h4>Fecha Final: <small class="text-muted">{{dateFinsh}}</small></h4></div>
                           <div class="col-1"></div>
                            
                       </div>
                               </div>
                       </div>
                        
                
                       <b-table striped hover :items="items2"></b-table>
                       <!-- <hr/>
                       <div class="row">
                           <div class="col-12" style="height:60px; ">
                               Observaciones:
                           </div>
                       </div>
                       <hr/>
                        <div class="row">
                           <div class="col-4">
                               Revisó:
                           </div>
                           <div class="col-8">
                               
                           </div>
                       </div>
                       <hr/> -->
                       <div>
                           
                           </div>
                    </div>
                    </b-modal>

    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>

    // var jsPDF = require('jspdf');
    // require('jspdf-autotable');

    // require( "@/i40/vendor/highcharts.js")  
import Multiselect from 'vue-multiselect'
import { infomaster } from "@/components/i40/js/master";

    // import $ from 'jquery';
    // Sparklines
    // import 'jquery-sparkline/jquery.sparkline.min.js';


    // import VueEasyPieChart from 'vue-easy-pie-chart'
    // import 'vue-easy-pie-chart/dist/vue-easy-pie-chart.css'
    // import Sparkline from '@/components/Common/Sparklines';
    // import FlotChart from '@/components/Charts/Flot';
    // Datepicker
    import moment from 'moment'
    // Import this component
    import datePicker from 'vue-bootstrap-datetimepicker';
    // Import date picker css
    import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
    
    // import Scrollable from '@/components/Common/Scrollable'

    import Vue from 'vue'
    import VueResource from 'vue-resource'
    import {reports} from "@/components/i40/js/globals"
 

// import Scrollable from "@/components/Common/Scrollable";
    import { CrearPDF } from "@/vendor/js/funx"
    // import VueHtml2Canvas from 'vue-html2canvas';
 
    // Vue.use(VueHtml2Canvas);
    Vue.use(VueResource)
    

    export default {
        name: '',
        components: {
            Multiselect,
            // Sparkline,
            // FlotChart,
            // Scrollable,
            datePicker,
            // VueEasyPieChart
            // higth
        },
        data() {
            return {
                workstationGroup:[],
                selectedGroup:{},
                counter: 0,
                items2:[],
                titleHeader: "",
                dateStart: null,
                dateFinsh: null,
                options: {
                    format: 'YYYY-MM-DD HH:mm',
                    // useCurrent: false,
                    // minDate:Date(),
                } ,
                donutdata: [],
                // Donut Chart
                donutOptions: {
                    element: 'morris-donut',
                    colors: ['#f05050', '#fad732', '#ff902b','#f05050', '#fad732'],
                    resize: true
                 },
                barStackedOptions: {
                    series: {
                        stack: true,
                        bars: {
                            align: 'center',
                            lineWidth: 0,
                            show: true,
                            barWidth: 0.6,
                            fill: 0.9
                        }
                    },
                    grid: {
                        borderColor: '#eee',
                        borderWidth: 1,
                        hoverable: true,
                        backgroundColor: '#fcfcfc'
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: (label, x, y) => x + ' : ' + y
                    },
                    xaxis: {
                        tickColor: '#fcfcfc',
                        mode: 'categories'
                    },
                    yaxis: {
                        tickColor: '#eee'
                    },
                    shadowSize: 0
                },

                fields: [
                    {
                        key: 'name',
                        label: 'Codigo - Descripción',
                    },
                    {
                        key: 'y',
                        label: 'Tiempo (m)',
                    },
                    {
                        key: 'ciclosParos',
                        label: 'Ciclos',
                    },
                ],

                // selectedLanguage() {
                //     switch(this.$i18n.i18next.language) {
                //         case 'es': return 'Spanish'; break;
                //         case 'en': default: return 'English';
                //     }
                // }
            }
        },
       
        methods: {
            download (){
                // console.log(this.items2)
                
                var columns = [
                    {title: "Descripcion", dataKey: "descripcion"},
                    {title: "Turno", dataKey: "turno"}, 
                    {title: "Inicio", dataKey: "inicio"},
                    {title: "Fin", dataKey: "fin"},
                    {title: "Tiempo Total", dataKey: "tiempototal"},
                    {title: "Centro Trabajo", dataKey: "centrotrabajo"},
                ];
                var titlePDF = this.titleHeader+' | TODOS LOS CENTROS DE TRABAJO'
                var infoFecha = 'Fecha Inicial: '+this.dateStart+' - Fecha Final: '+ this.dateFinsh

                let logo_company = `${this.publicUrl}img/logo_compania.jpg`
                let logo = `${this.publicUrl}img/logo.png`


                

                var doc = CrearPDF(titlePDF, infoFecha, columns, this.items2,logo_company,logo)
                let first = doc.autoTable.previous;
                doc.setFontSize(8);
                doc.text("----------------FIN DEL INFORME ----------------", 210, first.finalY + 20);
                doc.setFontSize(9);
                doc.text("Observaciones:", 60, first.finalY + 30);
                doc.setFontSize(9);
                doc.text("Revisó:", 60, first.finalY + 70);

                doc.save('paros_grupos_ct.pdf');

            },
            changeLanguage (lang) {
                this.$i18n.i18next.changeLanguage(lang);
            },
            formatDatetime: function(datetime) {
                if (datetime === null) {
                    return "[null]";
                } else {
                    return datetime.format("YYYY-MM-DD HH:mm:ss");
                }
            },
            informacionReporte: function(){
                var paramtros =
                        this.selectedGroup.description +
                        "/" +
                        this.dateStart +
                        ":00/" +
                        this.dateFinsh +
                        ":59";
                        
                this.$http.get(reports+"/ObtenerDetalleReporteParosGruposCentroTrabajo/" + paramtros)
                        .then(respuesta => {
                        return respuesta.json();
                        })
                        .then(usuarios => {
                        this.items2 = JSON.parse(usuarios);
                        });

                    },
            cargarDatos: function(valor){

            var paramtros = this.selectedGroup.description+'/'+this.dateStart+":00/"+this.dateFinsh+":59"
                ///DetalleParos
                    this.$http.get(reports+'/obtenerDetalleParos/'+paramtros)
                    .then(respuesta =>{
                        return respuesta.json()
                    })
                    .then(datosParos =>{
                        
                            this.donutdata=datosParos

                            Highcharts.chart('container', {
                                chart: {
                                    plotBackgroundColor: null,
                                    plotBorderWidth: null,
                                    plotShadow: false,
                                    type: 'pie'
                                },
                                title: {
                                    text: ''
                                },
                                tooltip: {
                                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                },
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        
                                        dataLabels: {
                                            enabled: true,
                                            format: '{point.name}: <b>{point.percentage:.1f}%</b>',
                                            style: {
                                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                            }
                                        }
                                    }
                                },
                                series: [{
                                    name: 'Paros',
                                    colorByPoint: true,
                                    data: datosParos
                                }]
                            });
                        
                    });
                ///Detalle paros
                
                    this.$http.get(reports+'/obtenerTotalTiempoParoCentroTrabajo/'+paramtros)
                    .then(respuesta =>{
                        return respuesta.json()
                    })
                    .then(resultado =>{
                        // $('.bar').sparkline(resultado[0], {
                        //     type: 'bar',
                        //     tooltipFormat: '{{value:levels}} - {{value}}',
                        //     barColor:'#23b7e5',
                        //     height:'60',
                        //     barWidth:'10',
                        //     barSpacing:'6',
                        //     chartRangeMin:'0',
                        //     // tooltipValueLookups: {
                        //     //     levels: $.range_map({ ':2': 'Low', '3:6': 'Medium', '7:': 'High' })
                        //     // }
                        // });

                        
                        // $('.tiemposPerdidosHora').sparkline(resultado[1], {
                        //     type:'line',
                        //     height:'60',
                        //     width:'80%',
                        //     lineWidth:'2',
                        //     lineColor:'#7266ba',
                        //     chartRangeMin:'0',
                        //     spotColor:'#888',
                        //     minSpotColor:'#7266ba',
                        //     maxSpotColor:'#7266ba',
                        //     fillColor:'',
                        //     highlightLineColor:'#fff',
                        //     spotRadius:'3',
                        //     resize:true
                        // });

                        //  $('.tiemposCentrosTrabajo').sparkline(resultado[0], {
                        //     type:'pie',
                        //     height:'60',
                        //     width:'80%',
                        //     lineWidth:'2',
                        //     lineColor:'#7266ba',
                        //     chartRangeMin:'0',
                        //     spotColor:'#888',
                        //     minSpotColor:'#7266ba',
                        //     maxSpotColor:'#7266ba',
                        //     fillColor:'',
                        //     highlightLineColor:'#fff',
                        //     spotRadius:'3',
                        //     resize:true
                        // });
                    
                    });


                     this.$http.get(reports+'/obtenerTotalTiempoParoCentroTrabajo/'+paramtros)
                    .then(respuesta =>{
                        return respuesta.json()
                    })
                    .then(resultado =>{
                        
                        // $('.bar').sparkline(resultado[0], {
                        //     type: 'bar',
                        //     tooltipFormat: '{{value:levels}} - {{value}}',
                        //     barColor:'#23b7e5',
                        //     height:'60',
                        //     barWidth:'10',
                        //     barSpacing:'6',
                        //     chartRangeMin:'0',
                        //     // tooltipValueLookups: {
                        //     //     levels: $.range_map({ ':2': 'Low', '3:6': 'Medium', '7:': 'High' })
                        //     // }
                        // });

                        
                        // $('.tiemposPerdidosHora').sparkline(resultado[1], {
                        //     type:'line',
                        //     height:'60',
                        //     width:'80%',
                        //     lineWidth:'2',
                        //     lineColor:'#7266ba',
                        //     chartRangeMin:'0',
                        //     spotColor:'#888',
                        //     minSpotColor:'#7266ba',
                        //     maxSpotColor:'#7266ba',
                        //     fillColor:'',
                        //     highlightLineColor:'#fff',
                        //     spotRadius:'3',
                        //     resize:true
                        // });

                        //  $('.tiemposCentrosTrabajo').sparkline(resultado[0], {
                        //     type:'pie',
                        //     height:'60',
                        //     width:'80%',
                        //     lineWidth:'2',
                        //     lineColor:'#7266ba',
                        //     chartRangeMin:'0',
                        //     spotColor:'#888',
                        //     minSpotColor:'#7266ba',
                        //     maxSpotColor:'#7266ba',
                        //     fillColor:'',
                        //     highlightLineColor:'#fff',
                        //     spotRadius:'3',
                        //     resize:true
                        // });
                    
                    });

                     this.$http.get(reports+'/obtenerTodosCentrosTrabajoParos/'+paramtros)
                    .then(respuesta =>{
                        return respuesta.json()
                    })

                    .then(resultado =>{
                        Highcharts.chart('container2', {
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: 'Paros por Centros de Trabajo'
                            },
                            subtitle: {
                                text: ''
                            },
                            xAxis: {
                                categories: resultado.grupo,
                                crosshair: true
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Tiempos (min)'
                                }
                            },
                            tooltip: {
                                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                    '<td style="padding:0"><b>{point.y:.1f} min</b></td></tr>',
                                footerFormat: '</table>',
                                shared: true,
                                useHTML: true
                            },
                            plotOptions: {
                                dataLabels: {
                                enabled: true,
                            },
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                }
                            },
                            //series: resultado.detalle
                            series: JSON.parse(JSON.stringify(resultado.detalle).replace(/,0|_/g,',null').replace(/\[0|_/g,'[null'))
                        });
                                            
                    });

                 this.$http.get(reports+'/obtenerTiposParoCentrosTrabajo/'+paramtros)
                .then(respuesta =>{
                    return respuesta.json()
                })
                .then(resultado =>{
                    Highcharts.chart('containerTiposParo', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                 dataLabels: {
                                            enabled: true,
                                            format: '{point.name}: <b>{point.percentage:.1f}%</b>',
                                            style: {
                                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                            }
                                        }
                            }
                        },
                        series: [{
                            name: 'Paros',
                            colorByPoint: true,
                            data: resultado[0].totalvariables
                        }]
                    });
                
                    Highcharts.chart('container3', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Tiempo de Paro'
                    },
                    xAxis: {
                        categories: resultado[0].grupo,
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Minutos Totales'
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    legend: {
                        align: 'right',
                        x: -30,
                        verticalAlign: 'top',
                        y: 25,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
                        }
                    },
                    series: resultado[0].detalle,
                });              
            });
        }
    },
        created() {
         infomaster.workstation([],"select").then(data => {
                    
                    // this.workstationType = data.data[0].wstype
                    // this.workstationPlant = data.data[0].wsplant
                    this.workstationGroup = data.data[0].wsgroup
                    
                    // if( data.data[0].workstation != null){
                    //     this.tableData = data.data[0].workstation
                    //     this.totalRows= this.tableData.length
                    // }
                })
     },
        
}
</script>
<template>
    <div>
        <!-- <h4 class="font-weight-bold py-3 mb-4">Series de Tiempos</h4> -->
        <!-- <div class="w-100 text-right"></div> -->
        <!-- <div class="border border-dark rounded"> -->

            
            <div :id="name_chart" ref="highcharts" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
            <div class="text-right mt-2 mb-2">
                <b-button v-if="this.interval_realtime" variant="outline-danger" block @click="controlRealChar()" size="sm"> <i class="ion ion-ios-square-outline"></i> &nbsp;&nbsp; Detener </b-button>
                <b-button v-if="!this.interval_realtime" variant="outline-success" block @click="controlRealChar()" size="sm"> <i class="ion ion-ios-play"></i> &nbsp;&nbsp; Iniciar de Nuevo </b-button>
            </div>
             <table class="table table-sm">
                <thead>
                    <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Limite Inferior</th>
                    <th scope="col">Limite Superior</th>
                    <th scope="col">Media</th>
                    <th scope="col">Desv stand</th>
                    <th scope="col">Valor Actual</th>
                    <!-- <th scope="col">Acción</th> -->
                    </tr>
                </thead>
                <tbody>
                    
                    <tr v-for="(item, ix) in getChartInfo">

                        <td>

                            <!-- <i v-if="props.item.status == 'true'" class="fas fa-circle text-success"></i>
                            <i v-if="props.item.status == 'false' || props.item.status == undefined" class="fas fa-circle text-danger"></i> -->

                            <!-- <b-badge  class="badge-dot" :style="{'background-color': item.color}" />  -->
                            <i class="fas fa-chart-line" :style="{'color':  getColor(item)}"></i>
                            {{item.tag_name}}
                        </td>
                        <td>
                            <b-badge class="badge-dot" variant="info"/>
                            {{item.lower_limit}}
                        </td>
                        <td>
                            <b-badge class="badge-dot" variant="danger"/>
                            {{item.upper_limit}}
                        </td>
                        <td>
                            {{meanValue(item)}}
                        </td>
                        <td>
                            {{sdValue(item)}}
                        </td>
                        <td>
                            <div class="row">
                                <div class="col">

                                </div>
                                <div class="col text-left">
                                    <i v-if="item.lower_limit > item.realtime_value" class="fas fa-circle text-info"></i>
                                    <i v-if="item.upper_limit < item.realtime_value" class="fas fa-circle text-danger"></i>
                                    <i v-if="item.upper_limit >= item.realtime_value && item.lower_limit <= item.realtime_value" class="fas fa-circle text-success"></i>
                                    <!-- <i v-if="" class="fas fa-circle text-success"></i> -->
                                    {{item.realtime_value}}
                                </div>
                            </div>
                        </td>
                    </tr>
                    <!-- <tr v-for="item in (ax != null ? ax.series : null)"> -->

                        

                        <!-- :class="{'badge-dot': true, 'background-color': '#000'}" -->
                        <!-- <td><b-badge  class="badge-dot" :style="{'background-color': item.color}" /> {{item.name}}</td> -->
                        <!-- <td><b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="ax.series[item.index].remove();"><i class="ion ion-md-close"></i></b-btn></td> -->
                    <!-- </tr> -->
                </tbody>
            </table>

        <!-- </div> -->
    </div>
</template>
<script>
import Vue from 'vue'
import { infotimeseries } from "@/components/i40/js/timeseries";

export default {
    components: {
    },
    props:{
        name_chart: {
            type: String
        },
        tags: {
            type: Array
        },
        backtime: {
            type: Number
        },
    },
    computed: {
        getChartInfo(){
            let test = this.chart_test
            return this.chart_info
        }
    },
    data() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        return {
            chart: null,
            ax: null,
            interval_realtime: true,
            interval_chart: null,
            series_realtime: null,
            chart_info:[],
            chart_test:[],
        }
    },
    methods: {

        standardDeviation(values){
            var avg = this.average(values);
            
            var squareDiffs = values.map(function(value){
                var diff = value - avg;
                var sqrDiff = diff * diff;
                return sqrDiff;
            });
            
            var avgSquareDiff = this.average(squareDiffs);

            var stdDev = Math.sqrt(avgSquareDiff);
            return stdDev;
        },

        average(data){
            var sum = data.reduce(function(sum, value){
                return sum + value;
            }, 0);

            var avg = sum / data.length;
            return avg;
        },

        meanValue(item){
            for (let index = 0; index < this.ax.series.length; index++) {
                const element = this.ax.series[index];
                if(element.name == item.codigocentrotrabajo+' '+item.tag_name){
                    return Math.round(this.average(element.yData)*100)/100
                }
            }
        },

        sdValue(item){
            for (let index = 0; index < this.ax.series.length; index++) {
                const element = this.ax.series[index];
                if(element.name == item.codigocentrotrabajo+' '+item.tag_name){
                    return Math.round(this.standardDeviation(element.yData)*100)/100
                }
            }
        },

        getColor(item){
            for (let index = 0; index < this.ax.series.length; index++) {
                const element = this.ax.series[index];

                if(element.name == item.codigocentrotrabajo+' '+item.tag_name){
                    return element.color
                }
                
            }
        },

        controlRealChar(){
            this.interval_realtime=!this.interval_realtime;
        },

        dynamicChart(){
            return Highcharts.chart(this.name_chart, {
                chart: {
                    type: 'line',
                    animation: Highcharts.svg, // don't animate in old IE
                    marginRight: 10,
                    zoomType: 'x',
                },

                time: {
                    useUTC: false
                },

                title: {
                    text: this.name_chart
                },

                accessibility: {
                    announceNewData: {
                        enabled: true,
                        minAnnounceInterval: 15000,
                        announcementFormatter: function (allSeries, newSeries, newPoint) {
                            if (newPoint) {
                                return 'New point added. Value: ' + newPoint.y;
                            }
                            return false;
                        }
                    }
                },

                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                },

                yAxis: {
                    title: {
                        text: 'Value'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },

                tooltip: {
                    headerFormat: '<b>{series.name}</b><br/>',
                    pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
                },

                legend: {
                    enabled: false
                },

                exporting: {
                    enabled: false
                },

                series: []
            });
        },

    async chartWorking(){
        let array = this.tags
        for (let index = 0; index < array.length; index++) {
            const element = array[index];

            let time = (new Date()).getTime()
            let stime =  Math.floor((time - (this.backtime*60*1000))/1000)
            let ftime =  Math.floor(time/1000)
            let result = {}
            await infotimeseries.get_epoch_time_series(`${element}/${stime}/${ftime}`).then(data =>{
                result = data.data
            })

            var item = {
                name: element.split(':')[1]+" "+element.split(':')[2],
                data: result
            }
            this.ax.addSeries(item)
        }

        if (this.interval_chart  == null){
            this.interval_chart = setInterval(() => {
                
                if(this.interval_realtime){
                    let x = (new Date()).getTime()
                    let array = this.tags
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];
                        infotimeseries.getlastvalue(element).then(data =>{
                            let y = parseFloat(data.data['realtime_value']);
                            this.ax.series[index].addPoint([x, y], true, true);

                            // if(this.chart_info.length == 0)
                            //     this.chart_info.push(data.data)

                            let exist = false

                            this.chart_test=[]

                            for (let ix = 0; ix < this.chart_info.length; ix++) {
                                const e = this.chart_info[ix];
                                if(e.id == element){
                                    exist = true
                                    let dat = data.data
                                    dat.id = element
                                    this.chart_info[ix] = dat
                                    this.chart_test.push(dat)
                                }
                                
                            }

                            if(!exist){
                                let dat = data.data
                                dat.id = element
                                this.chart_info.push(data.data)
                            }
                        })
                    }
                }
            }, 1000);
        }
    },

    handleVisibilityChange() {
      if(document.hidden) {
          var seriesLength = this.ax.series.length;
          for(var i = seriesLength -1; i > -1; i--) {
              this.ax.series[i].remove();
          }
          clearInterval(this.interval_chart)
          this.interval_chart=null
      } else {
          this.chartWorking()
      }
    }
  },

  mounted(){
      // this.src = infotimeseries.gettimeseries()+'searchserie/'
      this.ax = this.dynamicChart(this.name_chart)
      this.chartWorking();
  },

  created() {


    document.addEventListener('visibilitychange', this.handleVisibilityChange, false)
  }
}
</script>

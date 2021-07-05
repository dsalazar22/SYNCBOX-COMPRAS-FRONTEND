<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Alarmas Tiempo Real</h4> 
        <div class="w-100 text-right"></div>
        <b-tabs class="nav-tabs-left mb-2">
            <b-tab v-for="(item_ac, index) in tableData" :active="index == 0" v-bind:key="item_ac.board_name">
                <template v-slot:title>
                    {{item_ac.alarm_name}}
                </template>
                <div class="ml-2 mr-2 mt-2">
                    <b-table small show-empty stacked="md" :items="JSON.parse(item_ac.info_config)" :fields="columnsAlarms">
                        <template v-slot:cell(comparison)="props">
                            <div class="text-left">
                                <i :class="getColor(props.item)"></i>
                                {{tableRealTimeData[props.item.tags]}}
                                {{props.item.comparison}}
                                {{props.item.alarm_value}}
                            </div>
                        </template>
                        <template v-slot:cell(edit)="props">
                            <div class="text-left">
                                <b-input-group>
                                    <b-form-input placeholder="Valor Enviar"  size="sm" :disabled="props.item.edit_value == false" v-model="valuesPrepared[props.item.tags]" ></b-form-input>
                                    <b-input-group-append>
                                        <b-btn variant="success" @click="sendValue(props.item)" size="sm"> <span class="ion ion-md-checkmark"></span> </b-btn>
                                    </b-input-group-append>
                                </b-input-group>
                            </div>
                        </template>
                    </b-table>
                </div>
            </b-tab>


             <b-tab v-if="owner_counter.length > 0">
                <template v-slot:title>
                    Mis Contadores
                </template>
                <div class="ml-2 mr-2 mt-2">
                    <b-table small show-empty stacked="md" :items="owner_counter" :fields="columnsCounter">

                        <template slot="tag_name" slot-scope="props">
                            <div class="text-left">
                                {{props.item.tag_name}}
                            </div>
                        </template> 
                        <template slot="current_value" slot-scope="props">
                            <div class="text-left">
                                {{getCurrentValue(props.item)}}
                            </div>
                        </template> 

                        <template slot="max_value" slot-scope="props">
                            <div class="text-left">

                                <i :class="getColor(props.item)"></i> &nbsp;
                                {{getLimitValue(props.item)}}

                            </div>
                        </template> 

                        <template slot="wscode" slot-scope="props">
                            <div class="text-left">
                                <i class="ion ion-md-stopwatch text-info" v-if="props.item.counter_type == 'Timers'"></i>
                                <i class="ion ion-md-calculator text-info" v-if="props.item.counter_type != 'Timers'"></i>
                                &nbsp;
                                {{props.item.wscode}}
                            </div>
                        </template>
                        <template slot="edit" slot-scope="props">
                            <div class="text-left">
                                <b-btn variant="success" @click="sendResetOwnerValue(props.item)" size="sm"> <span class="ion ion-md-checkmark"></span> </b-btn>
                            </div>
                        </template>

                    </b-table>
                </div>
            </b-tab>
        </b-tabs>
    </div>
</template>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>
import Vue from 'vue'
import Notifications from 'vue-notification'
import { infotimeseries } from "@/components/i40/js/timeseries";
import { realtime } from '@/vendor/sbx/sbx-realtime/realtime'
import moment from 'moment'

Vue.use(Notifications)

export default {
    components: {
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
            tableData:[],
            tableRealTimeData:[],
            valuesPrepared:[],

            owner_counter:[],
            columnsCounter:[
                {key:'wscode', label:'Centro Trabajo'},
                {key:'tag_name', label:'Nombre Variable'},
                {key:'current_value', label:'Valor Actual'},
                {key:'max_value', label:'Limite'},
                
                {key:'edit', label:'Reset'},
            ],

            columnsAlarms:[
                {key:'alarm_name', label:'Nombre Variable'},
                {key:'tags', label:'TAG'},
                {key:'comparison', label:'Valor Actual | Limite'},
                {key:'edit', label:'Reset'},
            ],

        }
    },
   methods: {

    showCustom: function(classes, title, text) {
        this.$notify({
            group: 'notifications-default',
            type: classes,
            title: title,
            text: text
        })
    },

    sendResetOwnerValue(item){
        infoservices.sendredis(6,item.id_tag, "current_value",0).then(data =>{
            if (data.status === 202){
                this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
            }else{
                this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
            }
        })
    },
        SecondsTohhmmss(totalSeconds) {
            var hours   = Math.floor(totalSeconds / 3600);
            var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
            var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

            // round seconds
            seconds = Math.round(seconds * 100) / 100

            var result = (hours < 10 ? "0" + hours : hours);
                result += ":" + (minutes < 10 ? "0" + minutes : minutes);
                result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
            return result;
        },

        getLimitValue(item){
            let result = item.max_value

            if(item.counter_type == 'Timers'){
                let factor=1;
                if(item.time_option == 'Horas'){
                    factor = 3600
                }else if(item.time_option == 'Minutos'){
                    factor = 36
                }

                result = this.SecondsTohhmmss(result*factor)
            }

            return result
        },

        getCurrentValue(item){
            if(item.counter_type == 'Timers'){
                    return this.SecondsTohhmmss(item.current_value)
            }else{
                return item.current_value
            }
        },

        sendValue(item){
            let wsname = item.tags.split(':')[0].split(' ').join('+')
            let tagname = item.tags.split(':')[1]
            infoservices.apirunset(2,'w:'+tagname+':'+wsname, this.valuesPrepared[item.tags]).then(data =>{
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                }else{
                    this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                }
            })
        },

        getColor(item){
            let comparison = item.comparison
            let realtime = this.tableRealTimeData[item.tags]
            let alarmValue = item.alarm_value

            if (item.counter_type == 'Counter' || item.counter_type == 'Timers') {
                comparison = '<'
                alarmValue = item.max_value
                realtime = item.current_value
                let factor=1;
                if(item.counter_type == 'Timers'){
                    factor=1;
                    if(item.time_option == 'Horas'){
                        factor = 3600
                    }else if(item.time_option == 'Minutos'){
                        factor = 36
                    }

                    alarmValue = alarmValue*factor
                }

            }

            if(comparison == '<'){
                if(parseFloat(realtime) < parseFloat(alarmValue)){
                    return 'fas fa-circle text-success'
                }else{
                    return 'fas fa-circle text-danger'
                }
            }else if (comparison == '<='){
                
                if(parseFloat(realtime) <= parseFloat(alarmValue)){
                    return 'fas fa-circle text-success'
                }else{
                    return 'fas fa-circle text-danger'
                }

            }else if (comparison == '>'){
                
                if(parseFloat(realtime) > parseFloat(alarmValue)){
                    return 'fas fa-circle text-success'
                }else{
                    return 'fas fa-circle text-danger'
                }

            }else if (comparison == '>='){

                if(parseFloat(realtime) >= parseFloat(alarmValue)){
                    return 'fas fa-circle text-success'
                }else{
                    return 'fas fa-circle text-danger'
                }
            }else if (comparison == '=='){
                if(parseFloat(realtime) == parseFloat(alarmValue)){
                    return 'fas fa-circle text-success'
                }else{
                    return 'fas fa-circle text-danger'
                }
            }
        },
        chartWorking(){
            this.interval_chart = setInterval(() => {
                try {
                        infotimeseries.alarmcontroller("[]", "get_tags_value").then(data =>{
                            this.tableRealTimeData = data.data
                        })

                        infotimeseries.ownertagscontroller("[]", "get").then(data =>{
                            let values = data.data
                            let keys = Object.keys( data.data)
                            let oc = []
                            for (let index = 0; index < keys.length; index++) {
                                const element = keys[index];
                                const val = values[element];
                                val["id_tag"] = element

                                oc.push(val)
                        }
                        this.owner_counter = oc
                    }, 
                        (error) => {
                            clearInterval(this.interval_chart)
                        }
                    )
                } catch (error) {
                    console.log(error)
                }
        }, 1000);
    },

    showData: function(){
        infotimeseries.alarmcontroller("[]", "get").then(data =>{
            this.tableData = Object.values(data.data)
            this.totalRows= this.tableData.length
            this.valuesPrepared = []

            for (let index = 0; index < this.tableData.length; index++) {
                const element = JSON.parse(this.tableData[index].info_config);

                for (let index = 0; index < element.length; index++) {
                    const el = element[index];
                    this.valuesPrepared[el.tags]=el.prop_value
                }
            }
        })
    },

    handleVisibilityChange() {
      if(document.hidden) {
          clearInterval(this.interval_chart)
      } else {
          this.chartWorking()
      }
    }
  },

  mounted(){
    //   this.ax = this.dynamicChart(this.name_chart)
      this.chartWorking();
  },

  created() {
      this.showData()
    document.addEventListener('visibilitychange', this.handleVisibilityChange, false)
  }
}
</script>

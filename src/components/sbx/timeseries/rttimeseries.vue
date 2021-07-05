<template>
    <div>
        <h4 class="font-weight-bold py-3 mb-4">Tiempo Real - Series de Tiempos</h4>
        <!-- <div class="w-100 text-right"></div> -->
       <div>
            <b-tabs class="nav-tabs-left mb-2">
                <b-tab v-for="(item_ac, index) in tableData" :active="index == 0" v-bind:key="item_ac.board_name">
                    <template v-slot:title>

                        {{item_ac.board_name}}
                        <!-- <b-spinner type="grow" small></b-spinner>  -->
                        <!-- <b-btn variant="outline-success borderless icon-btn" v-if="item_ac.Confirmed" class="btn-xs" @click.prevent="change_confirmed(item.ProductCode,item_ac.ProcessName,!item_ac.Confirmed)"><i class="fas fa-circle"></i></b-btn> 
                        <b-btn variant="outline-danger borderless icon-btn" v-if="!item_ac.Confirmed" class="btn-xs" @click.prevent="change_confirmed(item.ProductCode,item_ac.ProcessName,!item_ac.Confirmed)"><i class="fas fa-circle"></i></b-btn> 
                        
                        {{item_ac.ProcessName}} -->
                    </template>
                        <div style="width:90%" class="text-center">
                            <div v-for="(ac, ix) in JSON.parse(item_ac.info_config)" class="text-center">
                                <timeseries :name_chart="ac.chart_name" :tags="ac.tags" :backtime="parseInt(ac.time_minutes)"></timeseries>
                            </div>
                        </div>
                    </b-tab>
                </b-tabs>
           <!-- <div class="row">
               <div class="col">
                   <timeseries name_chart="cont1"></timeseries>
               </div>
               <div class="col">
                   <timeseries name_chart="cont2"></timeseries>
               </div>
           </div> -->
       </div>
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import BOMController from './controls/timeseries'
import { infotimeseries } from "@/components/i40/js/timeseries";

export default {
    components: {
        'timeseries':BOMController
    },
    data() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        return {
            tableData:[],
        }
    },
    methods: {
    },
    created() {
        infotimeseries.boardcontroller("[]", "get").then(data =>{
            let array = Object.values(data.data)
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if(element.status == "true")
                    this.tableData.push(element)
                
            }
        })
    },
}
</script>

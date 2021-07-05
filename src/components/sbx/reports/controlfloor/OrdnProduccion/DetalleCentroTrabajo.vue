<template>
    <div>
        <h2>{{this.centroTrabajo}}</h2>
        <v-client-table :data="tableData" :columns="columns" :options="options" class="mt-4">
            
        <div slot="tiempobase" slot-scope="props" style="font-weight:bold; text-align: right">
            {{props.row.tiempobase}}
        </div>
        <div slot="tiemporeal" slot-scope="props" style="font-weight:bold; text-align: right" :style="{ color: colorTiempoReal(props.row.tiempobase,props.row.tiemporeal) }">
            {{props.row.tiemporeal}}
        </div>
    </v-client-table>
    </div>
</template>
<script>
import Vue from 'vue'
import {ClientTable} from 'vue-tables-2'
import {reports} from "@/components/i40/js/globals"
import excel from 'vue-excel-export'
 

// import Scrollable from "@/components/Common/Scrollable";

Vue.use(excel)
Vue.use(ClientTable)
export default {
     components: {
        // ConfigVars,
     },

    data () {
    return {
        centroTrabajo:"",
        tableData: [],
        columns: ['fechainicio','fechafin', 'totalproducido', 'unddefectuosas', 'cajas',
        'mpunidadesbuenas','mpunidadesdefectuosas','tiempototaltrabajo','microparos'],
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
   watch: {
        $route(){
            this.centroTrabajo=this.$route.params.workPlace
            
            this.$http.get(reports+'/obtenerDetalleOrdenProduccionCentroTrabajo/'+this.$route.params.id+'/'+this.$route.params.workPlace)
                .then(respuesta =>{
                    return respuesta.json()
                })
                
                .then(resultado =>{
                    this.tableData = resultado
                })
        },
   }
}
</script>

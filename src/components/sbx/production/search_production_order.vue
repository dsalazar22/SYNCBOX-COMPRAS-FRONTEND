<template>
<!-- :fields="columns" -->
    <div>
    <notifications group="notifications-default" />
    <h4 class="font-weight-bold py-3 mb-2">
      Buscar Orden de Producción
    </h4>

        <b-form-group label="Número de Orden">
            <b-input-group>
              <!-- <b-input v-model="userInfo.reset_password" type="password" /> -->
              <b-form-input  v-model="ordercode" ></b-form-input>
              <b-input-group-append>
                <b-button variant="success" @click="loadCommercialsOrders()">Buscar Orden de Producción</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="tabledata"  :fields="columnsCommercialsOrders" >
        </b-table>

<!-- 21654 -->
        <h5 class="font-weight-bold py-3 mb-2">
        Detalle Orden de Producción
        </h5>
        <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="tabledatadetails"  :fields="columnsDetails" >
            <template v-slot:cell(intervalo)="row">
                <div class="text-left">
                    <b-btn variant="outline-warning borderless" class="btn-xs" @click.prevent="data_changeField(row.item,'edit')"><i class="ion ion-md-create"></i> {{row.item.intervalo}} </b-btn>
                </div>
            </template>
        </b-table>


         <b-modal id="modals-top" v-model="manual_report"  class="modal-center" size="lg">

            <!-- <div class="h2 text-center">{{wsinfo[0]['wscode']}}</div> -->

            <h2 class="text-danger">Reportar Unidades Defectuosas</h2>
            <h3>{{info.centrotrabajo}}</h3>
            <!-- <h5>Orden de Producción: {{info.consecutive_order}}</h5> -->

            <h4 class="text-center text-danger mt-2">Revise la siguiente información con Atención</h4>
            <h5>
                Cantidad Actual :
                {{info.totalproducido}} - {{info.unddefectuosas}} = {{info.totalproducido - info.unddefectuosas}}
            </h5>

            <h5>
                Cantidad Futura : 
                {{info.totalproducido}} -  ({{info.unddefectuosas}} + {{amount_scrap}}) = <span class="text-danger"> {{parseFloat(info.totalproducido) - (parseFloat(info.unddefectuosas) + parseFloat(amount_scrap))}} </span>
            </h5> 

             <multiselect
                v-model="itemselected"
                :options="items_defectuosas"
                label="description"
                :searchable="true"
                :show-labels="false"
                placeholder="Codigo del Defecto"
            />

            <b-input type="number" step="0.1" placeholder="Cantidad a Reportar" class="mt-2" v-model="amount_scrap"/>

            <div class="w-100 mt-2 text-right">
               <b-btn variant="primary" @click="manual_report=false">Cancelar</b-btn>
                <b-btn variant="success" v-if="info.totalproducido > amount_scrap" @click="submit('scrap', amount_scrap)">Guardar</b-btn>
            </div> 
            
            <!-- <mreport ref="mreport"></mreport> -->
                <div slot="modal-footer" class="w-100 text-right">
            </div>
        </b-modal>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>
import Vue from 'vue'
import { infoproduction } from "@/components/i40/js/production";
import { infomaster } from "@/components/i40/js/master";
import VueMarkdown from 'vue-markdown'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import Multiselect from 'vue-multiselect'
import Notifications from 'vue-notification'
Vue.use(Notifications)
// Vue.use(Notifications)

export default {
    components: {
        VueMarkdown,
        Multiselect,
    },
    computed: {
       
    },
    data() {
        return {
            amount_scrap:0,
            info:{},
            wsinfo:{},
            item:{},
            itemselected:[],
            manual_report:false,
            items_defectuosas:[],
            ordercode:0,
            tabledata:[],
            tabledatadetails:[],
            columnsDetails:[
                {key:"intervalo", label:"# Intervalo"},
                {key:"activity_description", label:"Actividad"},
                {key:"centrotrabajo", label:"Centro Trabajo"},
                {key:"fechainicio", label:"Fecha Inicio"},
                {key:"fechafin", label:"Fecha Fin"},
                {key:"tiempototaltrabajo", label:"Tiempo Trabajo [Min]"},
                {key:"microparos", label:"Microparos [Min]"},
                {key:"totalproducido", label:"Total Producido"},
                {key:"unddefectuosas", label:"Defectuosas"},
            ],

            columnsCommercialsOrders:[
                {key:"consecutive_order", "sortable": true, label:"# Orden"},
                {key:"codigo", "sortable": true, label:"Codigo"},
                {key:"producto", "sortable": true, label:"Producto"},
                {key:"activity_description", "sortable": true, label:"Actividad"},
                {key:"tiempototaltrabajo", "sortable": true, label:"Tiempo Trabajado [Min]"},
                {key:"cantidadprogramada", "sortable": true, label:"Programado"},
                {key:"totalproducido", "sortable": true, label:"Producido"},
                {key:"unddefectuosas", "sortable": true, label:"Defectuosas"},
                {key:"fechafin", "sortable": true, label:"Fecha Fin"},
                {key:"turno", "sortable": true, label:"Turno"},
            ],
            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla
        }
    
    },
    watch: {
        '$route.params.orderid': function (orderid) {
            // console.log('hole')
            
        },
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
        ///Funcion para cargar la ayuda del helper
        loadCommercialsOrders(){
            infoproduction.searchproductionorder(this.ordercode).then(data =>{
                this.tabledatadetails = data.data[0]["details"]
                this.tabledata = data.data[0]["total"]
            })
        },

        data_changeField(params) {
            
            this.info=params
            this.amount_scrap = 0
            this.manual_report=true

             infomaster.scrapcode({"families_id":params.families_id},"select-product").then(data => {
                this.items_defectuosas = data.data
            })
        },

         submit(action, param_amount){

            let info_to_send = {
                    id:this.info.intervalo,   
                    amonut:param_amount,
                    jobs_id:this.info.idjob,
                    code_module: 'sx_manual',
                    wscode:this.info.centrotrabajo,
                    scrap_code_id:this.itemselected.scrap_code_id
                }

            infoproduction.reportproduction(info_to_send,action).then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Guardar registro","¡Error Guardando el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                }

                this.manual_report=false
            })
        }
    },
    created(){
         this.ordercode=this.$route.params.orderid
    },
}
</script>
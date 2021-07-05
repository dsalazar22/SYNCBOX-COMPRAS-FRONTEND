<template>
    <div>
        <!-- {{info}} -->
        <notifications group="notifications-default" />
        <div class="w-100" v-if="selected_report == ''">
            <div class="h2 w-100 text-center">
                Seleccione una opción
            </div>
            <div class="w-100">
                <b-btn variant="outline-success" block @click.prevent="selected_report = 'production'"> Reportar Producción</b-btn>
            </div>
            <div class="w-100 mt-2">
                <b-btn variant="outline-danger" block @click.prevent="selected_report = 'scrap'"> Reportar Desperdicio</b-btn>
            </div>
        </div>

        <div v-if="selected_report == 'scrap'">
            <h2 class="text-danger">Reportar Unidades Defectuosas</h2>
            <h3>{{info.description}}</h3>
            <h5>Orden de Producción: {{info.consecutive_order}}</h5>

            <h4 class="text-center text-danger mt-2">Revise la siguiente información con Atención</h4>
            <h5>
                Cantidad Actual :
                {{info.programmed_amount}} - {{info.total_produced}} = {{info.programmed_amount - info.total_produced}}
            </h5>

            <h5>
                Cantidad Futura :
                {{info.programmed_amount}} - ({{info.total_produced}} - {{item.amount_scrap}}) = <span class="text-danger"> {{info.programmed_amount - (info.total_produced-item.amount_scrap)}} </span>
            </h5>

             <multiselect
                v-model="itemselected"
                :options="items_defectuosas"
                label="description"
                :searchable="true"
                :show-labels="false"
                placeholder="Codigo del Defecto"
            />

            <b-input type="number" step="0.1" placeholder="Cantidad a Reportar" class="mt-2" v-model="item.amount_scrap"/>

            <div class="w-100 mt-2 text-right">
               <b-btn variant="primary" @click="selected_report=''">Cancelar</b-btn>
                <b-btn variant="success" v-if="info.total_produced >= item.amount_scrap" @click="submit('scrap', item.amount_scrap)">Guardar</b-btn>
            </div>

        </div>

        <div v-if="selected_report == 'production'">
            <b-table small striped hover :items="activeorders" :fields="columns" style="font-size:12px">
                <template v-slot:cell(consecutive_order)="row">
                    <div class="text-center">
                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item)"><i class="ion ion-md-checkmark"></i></b-btn>
                        {{row.item.consecutive_order}}
                    </div>
                </template>
            </b-table>

            <h2 class="text-success">Reportar Unidades Buenas</h2>

            <h3>{{info.description}}</h3>
            <h5>Orden de Producción: {{info.consecutive_order}}</h5>
            
            <h4 class="text-center text-danger mt-2">Revise la siguiente información con Atención</h4>
            <h5>
                Cantidad Actual :
                {{info.programmed_amount}} - {{info.total_produced}} = {{info.programmed_amount - info.total_produced}}
            </h5>

            <h5>
                Cantidad Futura :
                {{info.programmed_amount}} - ({{info.total_produced}} + {{item.amount}}) = <span class="text-danger"> {{parseFloat(info.programmed_amount) - (parseFloat(info.total_produced)+parseFloat(item.amount))}} </span>
            </h5>

            <b-input type="number" step="0.1" placeholder="Cantidad a Reportar" class="mt-2" v-model="item.amount"/>

            <div class="w-100 mt-2 text-right">
                <b-btn variant="primary" @click="selected_report=''">Cancelar</b-btn>
                <b-btn variant="success" @click="submit('production', item.amount)">Guardar</b-btn>
            </div>
        </div>
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>
import Vue from 'vue'
import { infomaster } from "@/components/i40/js/master";
import { infoproduction } from "@/components/i40/js/production";
import Multiselect from 'vue-multiselect'
import Notifications from 'vue-notification'
Vue.use(Notifications)

export default {
    components:{
        Multiselect
    },
    data() {
        return {
            info:{},
            item:{},
            items_defectuosas:[],
            itemselected:[],
            current_production:0,

            selected_report:'',

            activeorders:[],

            columns:[
                    {"key":"consecutive_order", "sortable": true, "label":"# Orden"},
                    {"key":"code", "sortable": true, "label":"Código"},
                    {"key":"description", "sortable": true, "label":"Descripción"},
                    {"key":"activity_description", "sortable": true, "label":"Actividad"},
                    {"key":"programed_amount", "sortable": true, "label":"Programado"},
                    {"key":"produced", "sortable": true, "label":"Producido"},
                    {"key":"pending", "sortable": true, "label":"Pendiente"},
                ]
        }
    },
    methods: {
        data_change(item){
            this.info.interval_id = item.interval_id
            this.info.job_id = item.job_id
            this.info.programmed_amount = item.programed_amount
            this.info.total_produced = item.produced
            this.info.consecutive_order = item.consecutive_order
            this.info.description = item.description
        },

        showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
        },
        
        getInfo(value){
            this.info = JSON.parse(value.wsinfo)[0]
            this.info["current"] = JSON.parse(value.infocalculada).nro_ciclos * this.info.real_unit_cycle
            //this.info["total_produced"] = this.info["total_produced"] //+this.info["current"]
            this.selected_report = ''

            if(this.info["current"]>0){
                this.info["total_produced"] = this.info["total_produced"]+this.info["current"]
            }

            infomaster.scrapcode({"families_id":this.info.families_id},"select-product").then(data => {
                this.items_defectuosas = data.data
            })

            infoproduction.getcurrentorders(this.info.wscode).then(data => {
                console.log(data.data, this.info.wscode)
                this.activeorders = data.data
            })
        },

        submit(action, param_amount){

            let info_to_send = {
                    id:this.info.interval_id,   
                    amonut:param_amount,
                    jobs_id:this.info.job_id,
                    code_module: 'sx_manual',
                    wscode:this.info.wscode,
                    scrap_code_id:this.itemselected.scrap_code_id
                }

            infoproduction.reportproduction(info_to_send,action).then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Guardar registro","¡Error Guardando el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                }
            })
        }
    },
}
</script>
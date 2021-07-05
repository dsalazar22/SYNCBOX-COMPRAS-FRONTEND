<template>
<!-- :fields="columns" -->
    <div>
        <notifications group="notifications-default" />
        <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
            <div>Facturar Despachos</div> 
        </h4>



        <b-table small show-empty stacked="md" :items="dataresult" :fields="columnsDeliveries">
            <template  v-slot:cell(code_deliveries_header_id)="row">
                <div class="text-left">
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click="open_details(row.item);showEntregas=true;" ><i class="ion ion-md-create"></i></b-btn>
                    {{row.item.code_deliveries_header_id}}
                </div>
            </template>
        </b-table>

        
         <b-modal id="modals-top" v-model="showEntregas"  class="modal-center" size="xl">
            <div slot="modal-title">
                Entregas <span class="font-weight-light">Información General</span><br>
            </div>

            <div class="text-center">
                <h3>
                    {{this.selectedOrderDetail.name}}
                    <br>
                    {{this.selectedOrderDetail.code_deliveries_header_id}}
                    <br>
                    {{this.selectedOrderDetail.shipping_address}}
                </h3>                
            </div>
                    <div class="border rounded">
                        <div class="m-2">
                            <b-row>
                                <b-col sm="12" md="6" lg="6" class="mt-2">
                                    <small class="font-weight-bold">Transportadora</small>
                                   <b-input autocomplete="off" size="sm" placeholder="Transportadora" v-model.trim="selectedOrderDetail.transportation_company"/>
                                </b-col>
                                <b-col sm="12" md="6" lg="6" class="mt-2">
                                    <small class="font-weight-bold">Placa</small>
                                    <b-input autocomplete="off" size="sm" placeholder="Placa" v-model.trim="placa"/>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="12" md="6" lg="6" class="mt-2">
                                    <small class="font-weight-bold">Nro de Guia</small>
                                   <b-input autocomplete="off" size="sm" placeholder="Nro de Guia" v-model.trim="guia"/>
                                </b-col>
                                <b-col sm="12"  md="6" lg="6" class="mt-2">
                                    <small class="font-weight-bold">Numero Factura</small>
                                    <b-input autocomplete="off" size="sm" placeholder="Numero Factura" v-model.trim="invoice"/>
                                </b-col>
                            </b-row>
                        </div>
                        <div class="m-2 text-right">
                            <b-btn size="sm" variant="success" @click="setinfo()"><i class="fas fa-check"></i> Guardar </b-btn>
                        </div>
                    </div>

            <b-table responsive :items="selectedOrderDetail.array_to_json" :fields="columns" class="mt-2">           
                <template v-slot:cell(box_count)="row">
                    <div class="text-nowrap"> {{ row.item.box_count>0?numberWithCommas(row.item.delivery_amount/row.item.box_count):0}}</div>
                </template>
                <template v-slot:cell(total_price)="row">
                    <div class="text-nowrap"> {{numberWithCommas(row.item.delivery_amount*row.item.sale_price)}}</div>
                </template>
            </b-table>

            <div slot="modal-footer" class="w-100">
                <div class="text-right">
                        <b-btn @click="showEntregas=false">Cerrar</b-btn>
                </div>
            </div> 

        </b-modal>

    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>

import Vue from 'vue'
import { infotrade } from "@/components/i40/js/trade";
import { infoinventory } from "@/components/i40/js/inventory";
import Multiselect from 'vue-multiselect'
import Notifications from 'vue-notification'
Vue.use(Notifications)
export default {
    components:{
        Multiselect
    },

    data() {
        return {
            // Customer Code	Customer Description
            transportador:null,
            messageContent:false,
            pedidonro:null,
            invoice:null,
            guia:null,
            placa:null,
            dataresult:[],
            columns: [
                {key:'product_code', label:"Codigo"},
                {key:'product_description', label:"Descripcion"},
                {key:'sale_price', label:"Precio de Venta"},
                {key:'delivery_amount', label:"Cantidad Entregada"},
                {key:'total_price', label:"Valor Total"},
                {key:'box_count', label:"Cajas"},
            ],
            documentCode:null,
            selectedOrderDetail:{},
            amountDelivery:null,
            tableDeliveries: [],
            columnsDeliveries: [
                {key:'code_deliveries_header_id',label:"Remision"},
                {key:'order_code',label:"Pedido"},
                {key:'nit',label:"NIT"},
                {key:'name',label:"Nombre"},
                {key:'transportation_company',label:"Transportadora"},
                {key:'invoice_number',label:"Factura"},
            ],
            showEntregas:false,

            tableWarehouse:[],
            selectedWarehouse:{
                ubications:[]
            },
            selectedUbication:{},
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

        openform(){
            this.pedidonro=null
        },


        numberWithCommas(x) {
            if(x == null)
                x=0
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },


        checkorder(){
            infotrade.orders(this.pedidonro, "detail").then(data =>{
                this.dataresult = []
                if(data.data != ""){
                    this.dataresult = data.data
                }
                // this.open_deliveries(this.selectedOrderDetail)
            })
        },

        loadinfo(){
            infotrade.deliveries({}, "get-pending-invoice").then(data =>{
                this.dataresult = []
                if(data.data != ''){
                    this.dataresult = data.data
                }
            })
        },

        setinfo(){
            infotrade.deliveries({deliveries_header_id: this.selectedOrderDetail.deliveries_header_id, 
            invoice:this.invoice, transportation_company: this.selectedOrderDetail.transportation_company, 
            placa:this.placa, guia:this.guia,}, "fa-invoice").then(data =>{
                if(data.status == 200){
                    this.showCustom("bg-success", "Factura Almacenada", "¡El registro se ha guardado con Éxito!")
                }else{
                    this.showCustom("bg-danger", "Error", "¡El registro no se ha guardado con Éxito!")
                }
            })
        },

        addremission(){
            // console.log(this.selectedOrderDetail)
            infotrade.deliveries({deliveries_header_id: this.selectedOrderDetail.deliveries_header_id, 
                invoice:this.invoice, placa:this.placa, guia:this.guia, 
                transportation_company: this.selectedOrderDetail.transportation_company}, "fa-invoice").then(data =>{
                // this.checkorder()
            })
        },


        open_details(item){
            this.selectedOrderDetail = item
        }
    },
    created() {
        this.loadinfo()
    },
}
</script>
<template>
<!-- :fields="columns" -->
    <div>
        <notifications group="notifications-default" />
        <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
            <div>Ver Despachos</div> 
        </h4>

        <input-tag class="input-tag-primary" v-model="filter" />

        <b-table small show-empty stacked="md" :items="dataresult" :fields="columnsDeliveries">
            <template  v-slot:cell(code_deliveries_header_id)="row">
                <div class="text-left">
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click="open_details(row.item);showEntregas=true;" ><i class="ion ion-md-create"></i></b-btn>
                    {{row.item.code_deliveries_header_id}}
                </div>
            </template>
        </b-table>

        
         <b-modal id="modals-top" v-model="showEntregas"  class="modal-center" size="lg">
            <div slot="modal-title">
                Entregas <span class="font-weight-light">Información General</span><br>
            </div>

            <div class="text-center">
                <h3>
                    {{this.selectedOrderDetail.name}}
                    <br>
                    {{this.selectedOrderDetail.code_deliveries_header_id}}
                </h3>                
            </div>

            <b-input-group>
                <b-form-input disabled v-model="this.selectedOrderDetail.transportation_company" placeholder="Transportadora" autocomplete="off"></b-form-input>
                <b-form-input disabled v-model="this.selectedOrderDetail.invoice_number" placeholder="Numero Factura" autocomplete="off"></b-form-input>
                <!-- <b-input-group-append>
                    <b-btn variant="success icon-btn" @click="setinfo()"><i class="fas fa-check"></i></b-btn>
                </b-input-group-append> -->
            </b-input-group>

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
<style src="@/vendor/libs/vue-input-tag/vue-input-tag.scss" lang="scss"></style>
<script>

import Vue from 'vue'
import { infotrade } from "@/components/i40/js/trade";
import { infoinventory } from "@/components/i40/js/inventory";
import Multiselect from 'vue-multiselect'
import Notifications from 'vue-notification'
import InputTag from 'vue-input-tag'
Vue.use(Notifications)
export default {
    components:{
        Multiselect,
        InputTag
    },

    watch: {
        'filter':function(array){
            this.dataresult = this.dataresult_filter

            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                this.dataresult = this.dataresult.filter(function (el) {
                    let group = ''
                    
                    if(el.code_deliveries_header_id.toLowerCase().includes(element) || el.deliv_created.toLowerCase().includes(element) ||
                        el.order_code.toLowerCase().includes(element) || el.nit.toLowerCase().includes(element)
                        || el.name.toLowerCase().includes(element) || el.transportation_company.toLowerCase().includes(element)
                         || el.invoice_number.toLowerCase().includes(element)){
                            return el
                    }
                });
            }
            // this.totalRows= this.dataresult_filter.length

            // this.dataresult = this.dataresult_filter.filter(function (task) {
            //     if(task.wscode.toLowerCase().includes(value.toLowerCase()))
            //         return task
            // });
        },
    },
    data() {
        return {
            // Customer Code	Customer Description
            filter:[],
            transportador:null,
            messageContent:false,
            pedidonro:null,
            invoice:null,
            dataresult:[],
            dataresult_filter:[],
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
                {key:'deliv_created',label:"Fecha"},
                {key:'order_code',label:"Pedido"},
                {key:'nit',label:"NIT"},
                {key:'name',label:"Nombre"},
                {key:'transportation_company',label:"Transportadora"},
                {key:'placa',label:"Placa"},
                {key:'guia',label:"Guia"},
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

        loadinfo(){
            infotrade.deliveries({}, "get-invoice").then(data =>{
                this.dataresult = []
                this.dataresult_filter = []
                if(data.data != ''){
                    this.dataresult = data.data
                    this.dataresult_filter=data.data
                }
            })
        },

        setinfo(){
            infotrade.deliveries({deliveries_header_id: this.selectedOrderDetail.deliveries_header_id, invoice:this.invoice, transportation_company: this.selectedOrderDetail.transportation_company}, "fa-invoice").then(data =>{
                if(data.status == 200){
                    this.showCustom("bg-success", "Factura Almacenada", "¡El registro se ha guardado con Éxito!")
                }else{
                    this.showCustom("bg-danger", "Error", "¡El registro no se ha guardado con Éxito!")
                }
            })
        },

        addremission(){
            // console.log(this.selectedOrderDetail)
            infotrade.deliveries({deliveries_header_id: this.selectedOrderDetail.deliveries_header_id, invoice:this.invoice, transportation_company: this.selectedOrderDetail.transportation_company}, "fa-invoice").then(data =>{
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
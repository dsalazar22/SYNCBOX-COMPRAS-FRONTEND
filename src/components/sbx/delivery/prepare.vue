<template>
<!-- :fields="columns" -->
    <div>
        <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
            <div>Control de Entregas</div> 
        </h4>

        <b-input-group class="mt-2 mb-2">
            <b-form-input v-model="pedidonro" :disabled="dataresult[0] != null" placeholder="Numero del Pedido" />
            <b-input-group-append>
            <b-btn variant="success" @click="checkorder"> <span class="fas fa-check" ></span> </b-btn>
            </b-input-group-append>
        </b-input-group>

        <h2 class="text-center" style="margin-bottom: 5px">{{dataresult[0] != null ? dataresult[0].customer_name : ''}}</h2>
        <h4 class="text-center" >{{dataresult[0] != null ? 'OC:'+dataresult[0].customer_code : ''}}</h4>

        <!-- <div class="text-right mb-2">
            <b-btn variant="primary rounded-pill" @click="openform(); messageContent=true"><span class="ion ion-md-add"></span>&nbsp; Crear Remision</b-btn>
        </div> -->

        <b-input-group class="mt-2 mb-2" v-if="dataresult[0] != null">
            <b-form-input v-model="transportador"  placeholder="Transportador" />
            <!-- <b-form-input v-model="pedidonro" v-if="dataresult[0] != null" placeholder="Placa" /> -->
            <b-input-group-append>
                <b-btn variant="success" v-if="dataresult[0].deliveries_header_id==null" @click="addremission"> <span class="fas fa-check" ></span> Crear Remision </b-btn>
            </b-input-group-append>
        </b-input-group>



        <b-table small show-empty stacked="md" :items="dataresult" :fields="columns">
            <template  v-slot:cell(product_code)="row">
                <div class="text-left">
                    <b-btn v-if="dataresult[0].deliveries_header_id!=null" variant="outline-success borderless icon-btn" class="btn-xs" @click="open_deliveries(row.item);showEntregas=true;" ><i class="ion ion-md-create"></i></b-btn>
                    {{row.item.product_code}}
                </div>
            </template>
            <template slot="tipo_pregunta" slot-scope="row">
                <div class="text-left">
                    {{row.item.tipo_pregunta == 0 ? 'Bool':'Texto'}}
                </div>
            </template>

            <template v-slot:cell(requested_amount)="row">
                {{numberWithCommas(row.item.requested_amount)}}
            </template>
            <template v-slot:cell(delivered_quantity)="row">
                {{numberWithCommas(row.item.delivered_quantity)}}
            </template>
            <template v-slot:cell(pending_amount)="row">
                {{numberWithCommas(row.item.pending_amount)}}
            </template>
            <template v-slot:cell(current_delivery_amount)="row">
                {{numberWithCommas(row.item.current_delivery_amount)}}
            </template>
        </b-table>

         <b-modal id="modals-top" v-model="messageContent"  class="modal-center" size="xl" hide-footer title="Control de Entregas">
            <div>

            </div>

            <!-- <div class="w-100 text-right mt-2">
                <b-btn variant="primary" @click="messageContent=false">Cancelar</b-btn>
                <b-btn variant="success" @click="submit()">Guardar</b-btn>
            </div> -->
        </b-modal>

         <b-modal id="modals-top" v-model="showEntregas"  class="modal-center" size="lg">
            <div slot="modal-title">
                Entregas <span class="font-weight-light">Información General</span><br>
            </div>

            <div class="text-center">
                <h3>
                    {{this.selectedOrderDetail.customer_name}}
                    <br>
                    {{this.selectedOrderDetail.product_code}} - {{this.selectedOrderDetail.product_description}}
                </h3>
                <h4>
                    
                </h4>
                <div>
                    <b>Pendiente por Entregar: </b> {{numberWithCommas(this.selectedOrderDetail.pending_amount)}}
                    <b>Inventario Disponible: </b>{{numberWithCommas(this.selectedOrderDetail.invtotal)}}
                </div>
                
            </div>

            <div class="row mb-2">
                <div class="col">
                    <multiselect
                        v-model="selectedWarehouse"
                        :options="tableWarehouse"
                        label="warehouse"
                        :searchable="true"
                        :show-labels="false"
                        placeholder="Codigo del Estado"
                    />
                </div>
                <div class="col">
                    <multiselect
                        v-model="selectedUbication"
                        :options="selectedWarehouse.ubications"
                        label="ubication"
                        :searchable="true"
                        :show-labels="false"
                        placeholder="Codigo del Estado"
                    />
                </div>
            </div>
            <b-input-group>
                <b-form-input v-model="amountDelivery" placeholder="Cantidad a Entregar" type="number" autocomplete="off"></b-form-input>
                <b-input-group-append>
                    <b-btn variant="success icon-btn" @click="controllerAmount()"><i class="fas fa-check"></i></b-btn>
                </b-input-group-append>
            </b-input-group>

            <b-table responsive :fields="columnsDeliveries" :items="tableDeliveries" class="mt-2">                
                <template v-slot:cell(amount)="row">
                    <div class="text-nowrap"> {{numberWithCommas(row.item.amount)}}</div>
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
<script>


import { infotrade } from "@/components/i40/js/trade";
import { infoinventory } from "@/components/i40/js/inventory";
import Multiselect from 'vue-multiselect'
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
            dataresult:[],
            columns: [
                {key:'product_code', label:"Codigo"},
                {key:'product_description', label:"Descripcion"},
                {key:'requested_amount', label:"Cantidad Solicitada"},
                {key:'delivered_quantity', label:"Cantidad Entregada"},
                {key:'pending_amount', label:"Cantidad Pendiente"},
                {key:'deadline', label:"Fecha Entrega"},
                {key:'delivery_amount', label:"Entrega Actual"},
            ],
            documentCode:null,
            selectedOrderDetail:{},
            amountDelivery:null,
            tableDeliveries: [],
            columnsDeliveries: [
                {key:'code_header',label:"Documento"},
                {key:'deliveries_id',label:"Consecutivo"},
                {key:'amount',label:"Cantidad"},
                {key:'creater',label:"Creado Por"},
                {key:'created',label:"Fecha Creacion"},
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
                    this.transportador = this.dataresult[0].transportation_company
                }
                // this.open_deliveries(this.selectedOrderDetail)
            })
        },

        controllerAmount(){
            if(this.amountDelivery != 0 && this.amountDelivery != null){
                infotrade.deliveries({deliveries_header_id:this.dataresult[0].deliveries_header_id,orders_details_id: this.selectedOrderDetail.orders_details_id, amount: this.amountDelivery, ubications_id: this.selectedUbication.ubications_id, product_id: this.selectedOrderDetail.product_id}, "insert").then(data =>{
                    this.open_deliveries(this.selectedOrderDetail)
                    this.checkorder()
                })
            }
        },

        addremission(){
            // console.log(this.selectedOrderDetail)
            infotrade.deliveries({orders_id: this.dataresult[0].orders_id, transportation_company: this.transportador}, "insert-header").then(data =>{
                this.checkorder()
            })
        },


        open_deliveries(item){
            // console.log(item)
            this.selectedOrderDetail = item
            this.tableWarehouse=[]
            this.selectedWarehouse={
                ubications:[]
            }
            this.selectedUbication={}
            
            
            infoinventory.controllerinventory(item.product_id, "get-per-product").then(data =>{

                this.selectedOrderDetail.invtotal = 0
                if(data.data != ""){
                    let vls = data.data
                    
                    for (let index = 0; index < vls.length; index++) {
                        const element = vls[index];
                        this.selectedOrderDetail.invtotal = this.selectedOrderDetail.invtotal+element.total
                    }
                }

                if(this.selectedOrderDetail.invtotal > 0){
                    this.tableWarehouse = data.data
                }
                
            })
            
            infotrade.deliveries(this.dataresult[0].deliveries_header_id, "get").then(data =>{
                // console.log(data)
                if(data.data != "")
                    this.tableDeliveries = data.data
                else
                    this.tableDeliveries = []
            })
            this.amountDelivery = null
        },
    },
}
</script>
<template>
<!-- :fields="columns" -->
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-0"> Pendiente por Aprobar </h4>

        <div class="row">
            <div class="col">
                <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            <b-row>

                <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->
                <b-col md="6" class="my-1">
                    <b-input-group>
                        <b-form-input v-model="filter" placeholder="Buscar..." />
                        <b-input-group-append>
                        <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
                <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->

                <!-- ESTE ES EL PAGINADOR -->
                <b-col md="6" class="my-1">
                    <b-form-select :options="pageOptions" v-model="perPage" />
                </b-col>
                
                <!-- ESTE ES EL PAGINADOR -->

                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->

                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
                <b-table  :sticky-header="false" :no-border-collapse="false" responsive style="font-size:14px; min-height:300px"
                    :items="tableCommercialsOrders"  :fields="columnsCommercialsOrders"  :current-page="currentPage" :per-page="perPage">


                            <template v-slot:cell(edit)="row">
                                <b-dropdown variant="default btn-xs icon-btn md-btn-flat hide-arrow">
                                    <!-- {{props.item}} -->
                                    <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                    <!-- <b-dropdown-item href="javascript:void(0)">Ver Perfil</b-dropdown-item> -->
                                    <!-- <b-dropdown-item v-if="props.item.produced_amount == 0" @click.prevent="$refs.cancelarJob.open();selected_production_order=props.item; type_event_selected_order='cancel'" ><i class="ion ion-md-close text-danger"></i> &nbsp;&nbsp;Cancelar Activadad</b-dropdown-item> -->
                                    <b-dropdown-item  v-if="check_access('appr_comm', 'w')" href="#" @click="itemtoapp=row.item.order_id; $refs.confirmApproved.open()"> &nbsp;&nbsp;Aprobar Pedido</b-dropdown-item>
                                    <b-dropdown-item :href="'/comm/newrq/' + (row.item.is_national?'local':'international') + '/' + row.item.order_id" > &nbsp;&nbsp;Editar Pedido</b-dropdown-item>

                                    <!-- <b-dropdown-item href="javascript:void(0)"><i class="ion ion-md-resize"></i> &nbsp;&nbsp;Dividir Actividad</b-dropdown-item> -->

                                    <!-- <b-btn variant="outline-success icon-btn m-r-1" class="btn-xs" @click.prevent="showEditOrder=true;infosend=props.item"><i class="ion ion-md-create"></i></b-btn> -->
                                    <!-- <b-dropdown-item href="javascript:void(0)">Eliminar</b-dropdown-item> -->
                                </b-dropdown>
                               <!-- <span> <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/cfpr/routes/details/'}" target="_blank"><i class="ion ion-md-create"></i></b-btn> </span>{{props.item.code}} -->
                            </template>


                            <template v-slot:cell(nit)="row">
                                <div class="text-left text-nowrap">
                                    {{row.item.nit}}
                                </div>
                            </template>

                            <template v-slot:cell(customer_name)="row">
                                <div class="text-left text-nowrap">
                                    {{row.item.customer_name}}
                                </div>
                            </template>

                            <template v-slot:cell(order_created)="row">
                                <div class="text-left text-nowrap">
                                    {{row.item.order_created}}
                                </div>
                            </template>

                            <template v-slot:cell(orders)="row">
                                <div class="text-left text-nowrap">
                                    {{formatAmount(row.item.orders)}}
                                </div>
                            </template>

                            <template v-slot:cell(invoices)="row">
                                <div class="text-left text-nowrap">
                                    {{formatAmount(row.item.invoices)}}
                                </div>
                            </template>

                            <template v-slot:cell(quota)="row">
                                <div class="text-left text-nowrap">
                                    {{formatAmount(row.item.quota)}}
                                </div>
                            </template>

                            <template v-slot:cell(days)="row">
                                <div class="text-left text-nowrap">
                                    {{formatAmount(row.item.days)}}
                                </div>
                            </template>

                            <template v-slot:cell(limit_day)="row">
                                <div class="text-left text-nowrap">
                                    {{formatAmount(row.item.limit_day)}}
                                </div>
                            </template>

                            <template v-slot:cell(saldo)="row">
                                <div :class="'text-left text-nowrap text-' + (row.item.quota-(row.item.orders+row.item.invoices) >=0?'success':'danger font-weight-bold')">
                                    {{formatAmount(row.item.quota-(row.item.orders+row.item.invoices))}}
                                </div>
                            </template>
                            
                            <template v-slot:cell(disponible_dias)="row">
                                <div :class="'text-left text-nowrap text-' + ((row.item.limit_day-row.item.days) >=0?'success':'danger font-weight-bold')">
                                    {{formatAmount(row.item.limit_day-row.item.days)}}
                                </div>
                            </template>

                    </b-table>
                    
                <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div  class="w-25">
                        <small class="text-muted"> Total Clientes Cartera: {{totalRows}} </small>
                    </div>
                </div>
            </div>
        </div>

        <sweet-modal icon="success" title="Aprobar Pedido" ref="confirmApproved">
            <div class="w-100 text-danger"> <strong></strong> </div>
            
            <div class="w-100 text-center">
                ¿Está seguro que desea aprobar este pedido?
            </div>
            
            <template slot="button"><b-btn @click="aprobarOrden()" variant="success" class="mr-2">Aprobar</b-btn></template>
            <template slot="button"><b-btn @click="$refs.confirmApproved.close()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>  
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<script>
import Vue from 'vue'
import Notifications from 'vue-notification'
import { infotrade } from "@/components/i40/js/trade";
import Multiselect from 'vue-multiselect'
import VueMarkdown from 'vue-markdown'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import {infousers} from '@/components/i40/js/users'
import { infosysconfig } from "@/components/i40/js/sysconfig";
import * as numeral from 'numeral'
Vue.use(Notifications)

function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
    
    metaInfo: {
       title: ' Pendiente por Aprobar'
    },
    components: {
            VueMarkdown,
            SweetModal,
            Multiselect
        },

    watch:{
        'filter':function(value){
            this.tableCommercialsOrders = this.filter_tableData.filter(function (task) {
                if(task.nit.toLowerCase().includes(value.toLowerCase()) || task.name.toLowerCase().includes(value.toLowerCase()))
                    return task
            });
            this.totalRows = this.tableCommercialsOrders.length
            this.currentPage = 1
            // this.onFiltered(this.tableCommercialsOrders)
        },
    },

    data() {
        return {
            itemtoapp:0,
            tableCommercialsOrders:[],
            filter_tableData:[],
            columnsCommercialsOrders: [
        
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    // {key:' id_workplace', label:"id_workplace", thClass: 'd-none', tdClass: 'd-none'},
                    // {key:' workstation_type_id', label:"workstation_type_id", thClass: 'd-none', tdClass: 'd-none'},
                    {key:'document_customer', label:"OC"},
                    // {key:'order_code', label:"Numero Orden"},
                    {key:'nit', label:"NIT", stickyColumn: true},
                    {key:'customer_name', label:"Cliente", stickyColumn: true},
                    {key:'order_created', label:"Fecha Creación"},
                    {key:'orders', label:"Pedidos"},
                    {key:'invoices', label:"Facturas"},
                    {key:'quota', label:"Cupo"},
                    {key:'saldo', label:"Saldo"},
                    {key:'days', label:"Dias"},
                    {key:'limit_day', label:"Plazo"},
                    {key:'disponible_dias', label:"Disponible"},
                    
                    {key:'edit', label:"Action"},
                ],

            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla

            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },
        }
    },
    methods: {

        aprobarOrden(){

            infotrade.addheadorders({"orders_id":this.itemtoapp},"approved").then(data =>{
                if(data.status == 200)
                {
                    this.showCustom('bg-success text-white', "Pedido Aprobado",`¡El pedido se ha Aprobado con Éxito!`)
                    this.loadcartera()
                    this.$refs.confirmApproved.close()
                }
            })
        },
            ///Funcion para envio de alertas lateral superior derecha
        showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
        },

        formatAmount (p) {
            return numeral(p).format('0,0.00')
        },

        numberWithCommas(x) {
            if(x == null)
                x=0
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },

        loadcartera(){
            infotrade.orders("--", "approved-orders").then(data => {
                this.tableCommercialsOrders = []
                this.filter_tableData = []
                if(data.data != ""){
                    this.tableCommercialsOrders = data.data
                    this.filter_tableData = data.data
                    this.totalRows = this.tableCommercialsOrders.length
                }
            })
        },

        
        check_access(control, action){
            return infousers.check_access(control,action)
        }, 
         ///Funcion para cargar la ayuda del helper
             openHelp: function(){
                //  this.contentWiki = "# FFFF"
                ApiWikiHelp(this.version, this.name).then(data => {
                    this.contentWiki = data.data
                })
                .catch(data =>{
                    this.contentWiki = data.data
                })
                this.$refs.longModal.open()
            },
    },
    created(){
        this.loadcartera()

    },
}
</script>
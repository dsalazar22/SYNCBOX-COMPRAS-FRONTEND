<template>
<!-- :fields="columns" -->
    <div>
        <h4 class="font-weight-bold py-3 mb-0"> Información Cartera </h4>

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


                
                <b-table  :sticky-header="false" :no-border-collapse="false" responsive style="font-size:14px"
                    :items="tableCommercialsOrders"  :fields="columnsCommercialsOrders"  :current-page="currentPage" :per-page="perPage">


                        <template v-slot:cell(nit)="row">
                            <div class="text-nowrap"> {{row.item.nit}}</div>
                        </template>
                        <template v-slot:cell(name)="row">
                            <div class="text-nowrap"> {{row.item.name}}</div>
                        </template>
                        <template v-slot:cell(phone)="row">
                            <div class="text-nowrap"> {{row.item.phone}}</div>
                        </template>
                        <template v-slot:cell(30_days)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item["30_days"])}}</div>
                        </template>
                        <template v-slot:cell(quota)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item["quota"])}}</div>
                        </template>
                        <template v-slot:cell(31_to_60_days)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item["31_to_60_days"])}}</div>
                        </template>
                        <template v-slot:cell(61_to_90_days)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item["61_to_90_days"])}}</div>
                        </template>
                        <template v-slot:cell(mas_90_days)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item["mas_90_days"])}}</div>
                        </template>
                        <template v-slot:cell(total)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item["total"])}}</div>
                        </template>

                          <!-- <template v-slot:head(order_created)="scope">
                            <div class="text-nowrap">Fecha Ingreso</div>
                        </template>
                        <template v-slot:head(deadline)="scope">
                            <div class="text-nowrap">Fecha Compromiso</div>
                        </template>


                        <template v-slot:cell(order_code)="row">
                            <div class="text-nowrap"> {{row.item.order_code == '' ? row.item.orders_id : row.item.order_code}}</div>
                        </template>
                        <template v-slot:cell(total_sale)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.sale_price * row.item.requested_amount)}}</div>
                        </template>
                        <template v-slot:cell(requested_amount)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.requested_amount)}}</div>
                        </template>
                        <template v-slot:cell(delivered_quantity)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.delivered_quantity)}}</div>
                        </template>
                        <template v-slot:cell(available_inventory)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.available_inventory)}}</div>
                        </template>
                        <template v-slot:cell(total_pending)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.total_pending)}}</div>
                        </template>
                        <template v-slot:cell(product_code)="row">
                            <div class="text-nowrap"> {{row.item.customer_code != '' && row.item.customer_code != row.item.product_code ? row.item.customer_code + ' ('+row.item.product_code +')' : row.item.product_code}}</div>
                        </template> -->
                         <template v-slot:cell(edit)="row">
                            <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                            {{ row.detailsShowing ? 'Ocultar' : 'Detalles'}}
                            </b-button>
                         </template>

                        <template v-slot:row-details="row">
                            <b-card>

                                <b-table responsive style="font-size:14px" :items="row.item.details"  :fields="columnsDetails" >
                                    <template v-slot:cell(total)="row">
                                        <div class="text-nowrap"> {{numberWithCommas(row.item["total"])}}</div>
                                    </template>
                                </b-table>
                            <div class="text-center">
                                <b-button block size="sm" @click="row.toggleDetails">Ocultar Details</b-button>
                            </div>
                            </b-card>
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
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<script>
import { infotrade } from "@/components/i40/js/trade";
import Multiselect from 'vue-multiselect'
import VueMarkdown from 'vue-markdown'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import {infousers} from '@/components/i40/js/users'
import { infosysconfig } from "@/components/i40/js/sysconfig";

export default {
    
    metaInfo: {
       title: 'Información Cartera'
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
            tableCommercialsOrders:[],
            filter_tableData:[],
            columnsDetails:[
                {key:'document', label:"Documento"},
                {key:'deadline',sortable:true, label:"Fecha Vence"},
                {key:'days', sortable:true, label:"Dias Transcurridos"},
                {key:'total',sortable:true, label:"Total"},
            ],
            columnsCommercialsOrders: [
        
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    // {key:' id_workplace', label:"id_workplace", thClass: 'd-none', tdClass: 'd-none'},
                    // {key:' workstation_type_id', label:"workstation_type_id", thClass: 'd-none', tdClass: 'd-none'},
                    {key:'nit', label:"NIT", stickyColumn: true},
                    {key:'name', label:"Cliente", stickyColumn: true},
                    {key:'phone', label:"Telefono"},
                    {key:'term_days', label:"Dias"},
                    {key:'quota', label:"Cupo"},
                    {key:'30_days', sortable:true, label:"30 Días"},
                    {key:'31_to_60_days', sortable:true, label:"31 a 60"},
                    {key:'61_to_90_days', sortable:true, label:"61 a 90"},
                    {key:'mas_90_days', sortable:true, label:"+90"},
                    {key:'total', sortable:true, label:"Total"},
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

        numberWithCommas(x) {
            if(x == null)
                x=0
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },

        loadcartera(){
            infotrade.getcartera("--", "get").then(data => {
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
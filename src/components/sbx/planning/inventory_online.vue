<template>
    <div>
          
        <h4 class="font-weight-bold py-3 mb-4">Inventario en Línea</h4>

        <b-row>
            <b-col md="6" class="my-1">
                <b-input-group>
                    <b-form-input v-model="filter" placeholder="Buscar..." />
                    <b-input-group-append>
                    <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
            <b-col md="6" class="my-1">
                <b-form-select :options="pageOptions" v-model="perPage" />            
            </b-col>
            <!-- <b-col md="2" class="my-1">
                <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="newstopcode"><i class="ion ion-md-add"></i></b-btn>
                <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
            </b-col> -->
        </b-row>

        <b-table small show-empty stacked="md" :items="filter_tableData" :fields="columns" :current-page="currentPage" 
            :per-page="perPage" class="mt-2" style="font-size:12px">
            <!-- <template v-slot:cell(edit)="row">
                <div class="text-left">
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="open_details(row.item)"><i class="ion ion-md-create"></i></b-btn>
                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="onCalendar(row.item)"><i class="fas fa-calendar"></i></b-btn>
                </div>
            </template> -->
            <template v-slot:cell(totalprogrammed)="row">
                <div class="text-right">
                    {{numberWithCommas(row.item.totalprogrammed.toFixed(2))}}
                </div>
            </template>
            <template v-slot:cell(programmed)="row">
                <div class="text-right">
                    {{numberWithCommas(row.item.programmed.toFixed(2)) }}
                </div>
            </template>
            <template v-slot:cell(projected)="row">
                <div class="text-right">
                     {{numberWithCommas(row.item.projected.toFixed(2))}} <i class="fas fa-circle text-success" v-if="row.item.projected>0"></i> <i class="fas fa-circle text-danger" v-if="row.item.projected<0"></i>
                </div>
            </template>
            <template v-slot:cell(available)="row">
                <div class="text-right">
                    {{numberWithCommas(row.item.available.toFixed(2))}}
                </div>
            </template>
            <template v-slot:cell(inventory)="row">
                <div class="text-right">
                    {{numberWithCommas((row.item.inventory).toFixed(2))}}
                </div>
            </template>
            <template v-slot:cell(code)="row">
                <div class="text-nowrap"> {{row.item.code}} </div>
            </template>
            <template v-slot:cell(description)="row">
                <div class="text-nowrap"> {{row.item.description}} </div>
            </template>
        </b-table>
        <div class="d-flex justify-content-between">
            <div>
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
            </div>
            <div class="text-muted">
                <small> Total: {{this.totalRows}} </small>
            </div>
        </div>

          <b-modal id="modals-top" v-model="show_details"  class="modal-center" size="lg">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Tipos de Documentos</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <h4>Ordenes de Producción (Consumo)</h4>
             <div class="table-responsive">
                <b-table small show-empty stacked="md" :fields="columns_order_childs" :items="orders_child">
                    <template v-slot:cell(equired_amount)="row">
                        <div>
                            {{Math.round((row.item.pending_amount * row.item.child_amount_per_parent)*100)/100}}
                        </div>
                    </template>
                </b-table>
            </div>
             <!-- <div class="table-responsive">
                <b-table small show-empty stacked="md" :items="orders_parent">
                    <template slot="required_amount" slot-scope="props">
                        <div>
                            {{Math.round((props.item.pending_amount * props.item.child_amount_per_parent)*100)/100}}
                        </div>
                    </template>
                </b-table>
            </div> -->

            <h4>Pedidos (Consumo)</h4>
             <div class="table-responsive">
                <b-table small show-empty stacked="md" :items="commercial_child" :fields="columns_commercial_child">
                    <template v-slot:cell(required_amount)="row">
                        <div>
                            {{Math.round((row.item.pending_amount * row.item.child_amount_per_parent)*100)/100}}
                        </div>
                    </template>
                </b-table>
            </div>

            <h4>Ordenes de Producción</h4>
             <div class="table-responsive">
                <b-table small show-empty stacked="md" :items="orders_parent" :fields="columns_orders_parent" >
                    <template v-slot:cell(pending_amount)="row">
                        <div>
                            {{Math.round((row.item.programmed_amount - row.item.pending_amount)*100)/100}}
                        </div>
                    </template>
                </b-table>
            </div>

            <h4>Compras</h4>
             <div class="table-responsive">
                <b-table small show-empty stacked="md" :items="purchase" :fields="columns_purchases">
                    <template v-slot:cell(required_amount)="row">
                        <div>
                            {{Math.round((row.item.pending_amount * row.item.child_amount_per_parent)*100)/100}}
                        </div>
                    </template>
                </b-table>
            </div>
        </b-modal>

        <b-modal id="modals-top" v-model="show_calendar"  class="modal-center" size="lg">
            <div slot="modal-title">
            Información <span class="font-weight-light">Calendario</span><br>
            </div>
            
             <b-table small show-empty stacked="md" :items="calendar">
                    <template v-slot:cell(required_amount)="row">
                        <div>
                            {{Math.round((row.item.pending_amount * row.item.child_amount_per_parent)*100)/100}}
                        </div>
                    </template>
                </b-table>
           
        </b-modal>

    </div>
</template>
<script>
import { infoplanning } from "@/components/i40/js/iplanning";

export default {
    metaInfo: {
        title: 'Inventario en Linea (Comercial)'
    },
    watch: {
        'filter':function(value){
            // // if(value.length > 3){
                // console.log(value)
                        this.filter_tableData = this.tableData.filter(function (task) {
                            if(task.code.toLowerCase().includes(value.toLowerCase()) || task.description.toLowerCase().includes(value.toLowerCase()))
                                return task
                        });
            // }

            this.filter_tableData.sort(this.GetSortOrder("code"))
            this.totalRows = this.filter_tableData.length
            this.currentPage = 1
        },

        '$route.params.module': function(value){

            this.selectedModule = value
            // console.log(this.selectedModule)
            this.obtenerProductos()
            // console.log(value)
        }
    },

    data() {
        return {
            columns: [
                {key:'code',sortable: true, label:"Código"},
                {key:'description', sortable: true,label:"Descripción"},
                // {key:'unity_measure', label:"Unidad Medida"},
                // {key:'type_product', label:"Tipo de Producto"},
                {key:'inventory',sortable: true, label:"Inventario"},
                {key:'totalprogrammed', sortable: true, label:"Cantidad Pedida"},
                {key:'available', sortable: true, label:"Disponible"},
                {key:'programmed', sortable: true, label:"Cantidad Programada"},
                {key:'projected', sortable: true, label:"Disponible Proyectado"}
            ],

            tableData:[],
            filter_tableData:[],

            
            columns_order_childs:[
                {key:'consecutive_order',label:'# Orden'},
                {key:'parent_code',label:'Código'},
                {key:'parent_description',label:'Descripción'},
                {key:'parent_programmed_amount',label:'Cantidad Pendiente'},
                {key:'child_amount_per_parent',label:'Cant x Padre'},
                {key:'programmed_amount',label:'Requerido'},
            ],
            orders_child:[],

            // columns_order_parent:[
            //     {key:'consecutive_order',label:'# Orden'},
            //     {key:'parent_code',label:'Código'},
            //     {key:'parent_description',label:'Descripción'},
            //     {key:'pending_amount',label:'Cantidad Pendiente'},
            //     {key:'child_amount_per_parent',label:'Cant x Padre'},
            //     {key:'required_amount',label:'Requerido'},
            // ],


            columns_commercial_child:[
                {key:'order_id',label:'# Pedido'},
                {key:'parent_code',label:'Código'},
                {key:'parent_description',label:'Descripción'},
                {key:'pending_amount',label:'Cantidad Pendiente'},
                {key:'child_amount_per_parent',label:'Cant x Padre'},
                {key:'required_amount',label:'Requerido'},
            ],
            commercial_child:[],

            commercial_parent:[],

            columns_purchases:[
                // {key:'order_id',label:'# Pedido'},
                {key:'code',label:'Código'},
                {key:'description',label:'Descripción'},
                {key:'requested_amount',label:'Requerido'},
                {key:'delivered_quantity',label:'Cant x Padre'},
                {key:'pending_amount',label:'Pendiente'},
            ],
            purchase:[],

              columns_orders_parent:[
                // {key:'order_id',label:'# Pedido'},
                {key:'parent_code',label:'Código'},
                {key:'parent_description',label:'Descripción'},
                {key:'programmed_amount',label:'Requerido'},
                {key:'produced_amount',label:'Cant x Padre'},
                {key:'pending_amount',label:'Pendiente'},
            ],
            orders_parent:[],

            calendar:[],
            
            show_details: false,
            show_calendar:false,

            currentPage: 1,
            perPage: 50,
            totalRows: 0,
            pageOptions: [ 50, 100, 200 ],
            filter: null,
            show:false,
        }
    },

    methods: {
        numberWithCommas(x) {
            if(x == null)
                x=0
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
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
        ///Funcion para cargar la ayuda del helper
        showData: function(){
            infoplanning.getinventary().then(data =>{
                if(data.data!=""){
                    this.tableData = data.data
                    this.filter_tableData = this.tableData
                    this.totalRows= this.tableData.length
                }else{
                    this.tableData = []
                    this.filter_tableData = []
                    this.totalRows=0
                }
            })
        },

        onCalendar(item){
            infoplanning.getcalendarmps([],item.product_id).then(data =>{
                if(data.data!=""){
                    // console.log(data.data)
                    this.calendar = JSON.parse(data.data)
                }
            })

            this.show_calendar = true
        },

        open_details(item){
            infoplanning.getinventarydetail([],item.code).then(data =>{
                if(data.data!=""){
                    // console.log(data.data)
                    this.orders_child = JSON.parse(data.data.orders_child)
                    this.commercial_child = JSON.parse(data.data.commercial_child)
                    this.commercial_parent = JSON.parse(data.data.commercial_parent)
                    this.orders_parent = JSON.parse(data.data.orders_parent)
                    this.purchase  = JSON.parse(data.data.purchase)
                }
            })

            this.show_details = true
        },

        GetSortOrder(prop) {    
            return function(a, b) {    
                if (a[prop] > b[prop]) {    
                    return 1;    
                } else if (a[prop] < b[prop]) {    
                    return -1;    
                }    
                return 0;    
            }    
        }  
    },

    created() {
        this.showData()
    },
}
</script>

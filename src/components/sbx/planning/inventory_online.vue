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

        <b-table  show-empty stacked="md" :items="filter_tableData" :fields="columns" :current-page="currentPage" 
            :per-page="perPage" class="mt-2" small style="font-size:12px">
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
                <div class="text-nowrap"> 
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="show_details_info=true;info_details=selectedDetails(row.item)"><i class="ion ion-md-create"></i></b-btn>
                    {{row.item.code}} </div>
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

         <b-modal id="modals-top" v-model="show_details_info"  class="modal-center" size="xl">
            <div slot="modal-title">
            Información <span class="font-weight-light">Consumos</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <h4>{{info_details.code}} - {{info_details.description}}</h4>

            <b-nav class="justify-content-end mt-2">
                <b-nav tabs class="nav-sm tabs-alt">
                    <b-nav-item :active="selectTab=='resumen'" @click="selectTab = 'resumen'">Resumen General</b-nav-item>
                    <b-nav-item :active="selectTab=='ordenes'" @click="selectTab = 'ordenes'">Ordenes de Consumo</b-nav-item>
                    <b-nav-item :active="selectTab=='pedido'" @click="selectTab = 'pedido'">Pedidos de Consumo</b-nav-item>
                </b-nav>
            </b-nav>
            
             <div class="table-responsive" v-show="selectTab=='resumen'">
                <b-table small style="font-size:12px" show-empty stacked="md" :fields="info_details_fields" :items="info_details.productsdetails">
                    <template v-slot:cell(programmed)="row">
                        <div>
                            {{numberWithCommas(Math.round(row.item.orders>row.item.programmed ? row.item.orders : row.item.programmed))}}
                        </div>
                    </template>
                    <template v-slot:cell(amountperparent)="row">
                        <div>
                            {{numberWithCommas(row.item.amountperparent)}}
                        </div>
                    </template>
                    <template v-slot:cell(childamount)="row">
                        <div>
                            {{numberWithCommas(row.item.childamount)}}
                        </div>
                    </template>
                </b-table>
            </div>


            <div v-show="selectTab=='ordenes'">
                <b-table responsive small :items="orderProduction" :fields="columnsCommercialsOrders" 
                            style="font-size:12px"
                            class="h-100 w-100 bg-white mt-2" :no-border-collapse="false" 
                            :sticky-header="true" :hover="true" :striped="true" :bordered="true"
                        >
                            <!-- <template slot="top-row" slot-scope="{ fields }">
                                <td v-for="field in fields" :key="field.key">
                                    <input v-model="filters[field.key]" :placeholder="field.label">
                                </td>
                            </template> -->
                            <template v-slot:cell(consume_buffer)="row">
                                <div  style="width:80px">
                                    {{row.item.consume_buffer}}
                                </div>
                            </template>

                             <template v-slot:cell(consecutive_order)="row" style="font-weight:bold; text-align: right">
                                <router-link target="_blank" :to="{path:'/drum/searchop/'+row.item.consecutive_order}">
                                    {{row.item.consecutive_order}}
                                </router-link>
                            </template>

                            <template v-slot:head(deadline)="scope">
                                <div class="text-nowrap">Fecha Compromiso</div>
                            </template>
                            <template v-slot:head(requested_date)="scope">
                                <div class="text-nowrap">Fecha Solicitada</div>
                            </template>
                            <template v-slot:head(planning_date)="scope">
                                <div class="text-nowrap">Fecha Planeada</div>
                            </template>
                            <template v-slot:head(projected_date)="scope">
                                <div class="text-nowrap">Fecha Proyectada</div>
                            </template>

                            <template v-slot:cell(products_description)="row">
                                <div class="text-nowrap">{{row.item.products_description}}</div>
                            </template>

                            <template v-slot:cell(produced_amount)="row">
                                <div class="text-nowrap text-right">
                                    {{numberWithCommas(row.item.produced_amount)}}
                                </div>
                            </template>

                            <template v-slot:cell(code)="row">
                                <div class="text-nowrap">{{row.item.code}}</div>
                            </template>

                            <template v-slot:cell(deadline)="row">
                                <div class="text-nowrap">{{row.item.deadline}}</div>
                            </template>
                            <template v-slot:cell(name)="row">
                                <div class="text-nowrap">{{row.item.name}}</div>
                            </template>

                            <template v-slot:cell(activity_description)="row">
                                <div class="text-nowrap">{{row.item.activity_description}}</div>
                            </template>
                            <template v-slot:cell(planning_date)="row">
                                <div class="text-nowrap">{{row.item.planning_date}}</div>
                            </template>
                            <template v-slot:cell(projected_date)="row">
                                <div class="text-nowrap">{{row.item.projected_date}}</div>
                            </template>

                            <template v-slot:cell(workstation_groups)="row">
                                <div class="text-nowrap">{{row.item.workstation_groups}}</div>
                            </template>

                            <template v-slot:cell(workstation_code)="row">
                                <div class="text-nowrap">{{row.item.workstation_code}}</div>
                            </template>

                            <template v-slot:cell(workstation_group)="row">
                                <div class="text-nowrap">{{row.item.workstation_group}}</div>
                            </template>

                            <template v-slot:cell(programed_amount)="row">
                                <div class="text-nowrap text-right">{{numberWithCommas(row.item.programed_amount)}}</div>
                            </template>

                            <template v-slot:cell(hours_remaining)="row">
                                <div class="text-nowrap text-right">
                                    <!-- {{numberWithCommas(row.item.programed_amount)}} -->

                                    <!-- {{numberWithCommas((row.item.programed_amount/row.item.production_per_hour).toFixed(2))}} -->
                                    {{hourprepare(row.item.pending_amount / row.item.production_per_hour)}}
                                </div>
                            </template>
                            <template v-slot:cell(percentaje)="row">
                                <div class="text-nowrap text-right">
                                    <!-- {{numberWithCommas(row.item.programed_amount)}} -->

                                    <!-- {{numberWithCommas((row.item.programed_amount/row.item.production_per_hour).toFixed(2))}} -->
                                    {{((1-(row.item.pending_amount / row.item.programed_amount))*100).toFixed(2)}}%
                                </div>
                            </template>
                            <template v-slot:cell(pending_amount)="row">
                                <div class="text-nowrap text-right">{{numberWithCommas(row.item.pending_amount)}}
                                    <i class="fas fa-circle text-success" v-if="(row.item.pending_amount/row.item.programed_amount)>=0.2"></i>
                                    <i class="fas fa-circle text-danger" v-if="(row.item.pending_amount/row.item.programed_amount)<=0.10"></i> 
                                    <i class="fas fa-circle text-warning" v-if="(row.item.pending_amount/row.item.programed_amount)>0.10 && (row.item.pending_amount/row.item.programed_amount)<=0.20"></i> 
                                </div>
                            </template>

                            <template v-slot:cell(priority)="row">
                                        {{row.item.priority}}
                                    <!-- </div> -->
                                    <!-- <b-input-group size="sm"  v-if="editPriority">
                                        <b-form-input type="number" v-model="row.item.priority" min="0.00"></b-form-input>
                                        <b-input-group-append>
                                            <b-btn variant="outline-success borderless icon-btn" class="btn"  @click.prevent="data_change_priority(row.item)"><i class="ion ion-md-checkmark"></i></b-btn>
                                            <b-btn variant="outline-danger borderless icon-btn" class="btn" @click.prevent="cancelEditPrioty(row.item,row.item.priority)"><i class="ion ion-md-close"></i></b-btn>
                                        </b-input-group-append>
                                    </b-input-group> -->


                                <!-- </div> -->
                            </template>

                            <template v-slot:cell(edit)="row">
                                <!-- <b-dropdown v-if="check_access('planning_order', 'w')" variant="default btn-xs icon-btn md-btn-flat hide-arrow" :right="!isRTL">
                                    <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                    <b-dropdown-item @click.prevent="$refs.cancelarJob.open();selected_production_order=row.item;" ><i class="ion ion-md-remove-circle text-warning"></i> &nbsp;&nbsp;Cambiar Estado</b-dropdown-item>
                                    <b-dropdown-item @click="showEditContentOrder=true;infosend=row.item" ><i class="ion ion-md-hammer"></i> &nbsp;&nbsp;Ajustes Generales</b-dropdown-item>
                                    <b-dropdown-item @click.prevent="showEditOrder=true;infosend=row.item"><i class="ion ion-md-create text-success"></i> &nbsp;&nbsp;Cambiar Cantidad</b-dropdown-item>
                                        v-if="listContent.length>0"
                                </b-dropdown> -->
                                <div class="text-nowrap">
                                   
                                </div>
                            </template>
                    </b-table>
            </div>
         </b-modal>

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
import { infoproduction } from "@/components/i40/js/production";
import Columns from '@/vendor/sbx/json/columns.json';

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
        },

        'info_details':function(value){
            if(value.productsdetails.length > 0){
                let totalProducts = ""
                for (let index = 0; index < value.productsdetails.length; index++) {
                    const element = value.productsdetails[index];
                    totalProducts = totalProducts + `'${element.parent}',` + `'${element.code}',`
                }
                // console.log(totalProducts, totalProducts.length-1, totalProducts.substring(0,(totalProducts.length-1)))

                infoproduction.production(totalProducts.substring(0,(totalProducts.length-1)),"select-complete-production-order-tac-products").then(data =>{
                    // console.log(data.data)
                    this.orderProduction = data.data
                })
            }
        }
    },

    data() {
        return {
            show_details_info:false,
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

            orderProduction:[],
            columnsCommercialsOrders:[],

            tableData:[],
            filter_tableData:[],
            selectTab:"resumen",
            info_details:[],
            info_details_fields:[
                {key:'code',label:'Cod Padre'},
                {key:'description',label:'Desc Padre'},
                {key:'programmed',label:'Cant Programada'},
                {key:'parent',label:'Cod Hijo'},
                {key:'parentdescription',label:'Desc Hijo'},
                {key:'amountperparent',label:'Cant x Padre'},
                {key:'childamount',label:'Cant Hijo'},
            ],

            
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
        selectedDetails(items){
            items.productsdetails.sort((a,b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))
            return items
        },
        hourprepare(value){
            let hh = value.toString().split('.')[0]
            let mm = ((60/100) * parseFloat((value.toFixed(2)).toString().split('.')[1])).toFixed(0).toString()
            hh = hh.length == 1 ? '0'+hh:hh
            mm = mm.length == 1 ? '0'+mm:mm
            return  hh +':'+ mm
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
                    console.log(this.tableData)
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
        this.columnsCommercialsOrders =[
            {"key":"consecutive_order", "sortable": true, "label":"# Orden"},
            {"key":"consume_buffer", "sortable": true, "label":"Buffer"},
            {"key":"priority", "sortable": true, "label":"Prioridad"},
            {"key":"status_modules_code", "sortable": true, "label":"Estado"},
            {"key":"name", "sortable": true, "label":"Cliente"},
            {"key":"code", "sortable": true, "label":"Código"},
            {"key":"products_description", "sortable": true, "label":"Descripción"},
            {"key":"deadline", "sortable": true, "label":"Fecha Comprometida"},
            {"key":"programed_amount", "sortable": true, "label":"Programada"},
            {"key":"pending_amount", "sortable": true, "label":"Pendiente"},
            {"key":"activity_description", "sortable": true, "label":"Actividad"},
            {"key":"workstation_code", "sortable": true, "label":"CT"},
        ]
    },
}
</script>

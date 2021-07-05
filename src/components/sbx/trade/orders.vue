<template>
<!-- :fields="columns" -->
    <div>
        <h4 class="font-weight-bold py-3 mb-0"> Tambor de Pedidos </h4>

        <div class="row">
            <div class="col">
                <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            <b-row>

                <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->
                <b-col md="5" class="my-1">
                    <b-input-group>
                        <b-form-input v-model="filter" placeholder="Buscar..." />
                        <b-input-group-append>
                        <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
                <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->

                <!-- ESTE ES EL PAGINADOR -->
                <b-col md="4" class="my-1">
                    <b-form-select :options="pageOptions" v-model="perPage" />
                </b-col>
                
                <!-- ESTE ES EL PAGINADOR -->

                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
                <b-col md="3" class="d-flex justify-content-center my-1">
                    <label class="switcher switcher-success mt-2">
                        <input type="checkbox" class="switcher-input"  v-model="order_active" @click="ejecutar_cambio()">
                        <span class="switcher-indicator">
                        <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                        <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                        </span>
                        <span class="switcher-label">{{order_active ? "Activas" : "Cerradas"}}</span>
                    </label>
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->


                <!-- <div class="table-responsive" >  -->
                <!-- <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive 
                    stacked="sm" :items="cptItems"  :fields="columnsCommercialsOrders" 
                    :current-page="currentPage" :per-page="perPage"
                    :style="{'max-height': (windowHeight-280).toString()+'px'}" 
                    class="h-100 w-100 bg-white" :no-border-collapse="false" 
                    :sticky-header="true" striped="true" :bordered="true"> -->
                        <!-- <template slot="visible_buffer" slot-scope="props">
                                {{props.item}}
                            </template> -->

                            <!-- {{columnsCommercialsOrders}} -->

                            <b-table responsive :items="cptItems" :fields="columnsCommercialsOrders" 
                                :current-page="currentPage" :per-page="perPage"
                                :style="{'max-height': (windowHeight-280).toString()+'px'}" 
                                class="h-100 w-100 bg-white mt-2" :no-border-collapse="false" 
                                style="font-size:12px"
                                :sticky-header="true" :hover="true" :striped="true" :bordered="true"
                            >

                             <template v-slot:head(deadline)="scope">
                                <div class="text-nowrap">Fecha Compromiso</div>
                            </template>

                             <template v-slot:head(order_created)="scope">
                                <div class="text-nowrap">Fecha Ingreso</div>
                            </template>

                             <template v-slot:head(order_code)="scope">
                                <div class="text-nowrap"># Pedido</div>
                            </template>
                             <template v-slot:head(product_code)="scope">
                                <div class="text-nowrap">Codigo</div>
                            </template>
                             <template v-slot:head(product_description)="scope">
                                <div class="text-nowrap">Descripcion</div>
                            </template>
                             <template v-slot:head(customer_name)="scope">
                                <div class="text-nowrap">Cliente</div>
                            </template>

                            <template v-slot:cell(total_pending)="row">
                                <div class="text-nowrap text-right"> {{numberWithCommas(row.item.total_pending)}}</div>
                            </template>
                            <template v-slot:cell(available_inventory)="row">
                                <div class="text-nowrap text-right"> {{numberWithCommas(row.item.available_inventory)}}</div>
                            </template>
                            <template v-slot:cell(delivered_quantity)="row">
                                <div class="text-nowrap text-right"> {{numberWithCommas(row.item.delivered_quantity)}}</div>
                            </template>
                            <template v-slot:cell(requested_amount)="row">
                                <div class="text-nowrap text-right"> {{numberWithCommas(row.item.requested_amount)}}</div>
                            </template>

                            <template v-slot:cell(order_code)="row">
                                <div class="text-nowrap"> {{row.item.order_code}}</div>
                            </template>
                            <template v-slot:cell(product_description)="row">
                                <div class="text-nowrap"> {{row.item.product_description}}</div>
                            </template>
                            <template v-slot:cell(customer_name)="row">
                                <div class="text-nowrap"> {{row.item.customer_name}}</div>
                            </template>
                            

                            <template v-slot:cell(edit)="row">
                                <b-dropdown v-if="check_access('drump_commercial', 'w')" variant="default btn-xs icon-btn md-btn-flat hide-arrow" :right="!isRTL">
                                    <!-- {{props.item}} -->
                                    <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                    <!-- <b-dropdown-item href="javascript:void(0)">Ver Perfil</b-dropdown-item> -->
                                    <!-- <b-dropdown-item v-if="props.item.produced_amount == 0" @click.prevent="$refs.cancelarJob.open();selected_production_order=props.item; type_event_selected_order='cancel'" ><i class="ion ion-md-close text-danger"></i> &nbsp;&nbsp;Cancelar Activadad</b-dropdown-item> -->
                                    <b-dropdown-item @click="open_order_to_edit(row.item);showEditContentOrder=true;" > &nbsp;&nbsp;Modificar Pedido</b-dropdown-item>

                                    <!-- <b-dropdown-item href="javascript:void(0)"><i class="ion ion-md-resize"></i> &nbsp;&nbsp;Dividir Actividad</b-dropdown-item> -->

                                    <!-- <b-btn variant="outline-success icon-btn m-r-1" class="btn-xs" @click.prevent="showEditOrder=true;infosend=props.item"><i class="ion ion-md-create"></i></b-btn> -->
                                    <!-- <b-dropdown-item href="javascript:void(0)">Eliminar</b-dropdown-item> -->
                                </b-dropdown>
                               <!-- <span> <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/cfpr/routes/details/'}" target="_blank"><i class="ion ion-md-create"></i></b-btn> </span>{{props.item.code}} -->
                            </template>
                    </b-table>
                <!-- </div> -->
                <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div  class="w-25">
                        <small class="text-muted"> Total Pedidos: {{totalRows}} </small>
                           <div class="small">
                                Buffer Pedidos <div class="float-right"> {{cntBlack}} de {{totalRows}} ({{Math.round((cntBlack/totalRows)*100)}}%)</div>
                            </div>
                            <div class="progress mb-1" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-dark':true}" :style="{width: String((cntBlack/totalRows)*100)+'%' }"></div>
                            </div>

                            <div class="small">
                                Buffer Pedidos <div class="float-right"> {{cntDanger}} de {{totalRows}} ({{Math.round((cntDanger/totalRows)*100)}}%)</div>
                            </div>
                            <div class="progress mb-1" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':true}" :style="{width: String((cntDanger/totalRows)*100)+'%' }"></div>
                            </div>

                            <div class="small">
                                Buffer Pedidos <div class="float-right"> {{cntWarning}} de {{totalRows}} ({{Math.round((cntWarning/totalRows)*100)}}%)</div>
                            </div>
                            <div class="progress mb-1" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-warning':true}" :style="{width: String((cntWarning/totalRows)*100)+'%' }"></div>
                            </div>
                                        <div class="small">
                                Buffer Pedidos <div class="float-right"> {{cntSuccess}} de {{totalRows}} ({{Math.round((cntSuccess/totalRows)*100)}}%)</div>
                            </div>
                            <div class="progress mb-1" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-success':true}" :style="{width: String((cntSuccess/totalRows)*100)+'%' }"></div>
                            </div>
                                        <div class="small">
                                Buffer Pedidos <div class="float-right"> {{cntInfo}} de {{totalRows}} ({{Math.round((cntInfo/totalRows)*100)}}%)</div>
                            </div>
                            <div class="progress mb-1" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-info':true}" :style="{width: String((cntInfo/totalRows)*100)+'%' }"></div>
                            </div>

                       
                            <!-- <div class="small">
                                Número de Centros de Trabajo <div class="float-right"> {{centrosTrabajo.length}} de {{numeroEquipos}} ({{Math.round((centrosTrabajo.length/numeroEquipos)*100)}}%)</div>
                            </div>
                            <div class="progress mb-3" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':((centrosTrabajo.length/numeroEquipos)*100)>=80, 'bg-success':((centrosTrabajo.length/numeroEquipos)*100)<80}" :style="{width: String((centrosTrabajo.length/numeroEquipos)*100)+'%' }"></div>
                            </div>

                            <div class="small">
                                Número de Dispositvos <div class="float-right"> {{dispositivos.length}} de {{numeroDispositivos}} ({{Math.round((dispositivos.length/numeroDispositivos)*100)}}%)</div>
                            </div>
                            <div class="progress mb-3" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':((dispositivos.length/numeroDispositivos)*100)>=80, 'bg-success':((dispositivos.length/numeroDispositivos)*100)<80}" :style="{width: String((dispositivos.length/numeroDispositivos)*100)+'%' }"></div>
                            </div>

                            <div class="small">
                                Número de Tags <div class="float-right"> {{variablesDispositivosUsers.length}} de {{tagsAutorizados}} ({{Math.round((variablesDispositivosUsers.length/tagsAutorizados)*100)}}%)</div>
                            </div>
                            <div class="progress mb-3" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':((variablesDispositivosUsers.length/tagsAutorizados)*100)>=80, 'bg-success':((variablesDispositivosUsers.length/tagsAutorizados)*100)<80}" :style="{width: String((variablesDispositivosUsers.length/tagsAutorizados)*100)+'%' }"></div>
                            </div> -->

                    </div>
                </div>
            </div>
            <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>
        </div>


            <b-modal id="modals-top" v-model="showEditContentOrder"  class="modal-center" size="lg">
                <div slot="modal-title">
                    Modificar <span class="font-weight-light">Ordenes Comerciales</span><br>
                </div>

                <h3 class="text-danger text-center">ATENCIÓN</h3>
                <div>
                    <!-- {{infosend}} -->
                </div>
              

                <div>
                    <!-- {{infosend}} -->
                </div>

                <h5 class="mt-2">Ingrese una nueva Fecha:</h5>
                <b-input placeholder="Prioridad" v-model="infosend.deadline"/>

                <h5 class="mt-2">Seleccione un estado:</h5>
                

                <multiselect
                    v-model="itemselected"
                    :options="tableData"
                    label="description"
                    :searchable="true"
                    :show-labels="false"
                    placeholder="Codigo del Estado"
                />

                <div slot="modal-footer" class="w-100">
                    <div class="d-flex justify-content-between">
                        <div>
                            <b-btn @click="showEditContentOrder=false">Cerrar</b-btn>
                        </div>
                        <div>
                            <b-btn variant="warning" @click="update_details_order()">Guardar</b-btn>
                        </div>
                    </div>
                </div> 
            </b-modal>
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
       title: 'Tambor de Pedidos'
    },
    components: {
            VueMarkdown,
            SweetModal,
            Multiselect
        },
        watch:{

            'filter':function(value){
                this.filterInfo(value)
            },
        },
        computed: {
            cptItems(){
                this.cntBlack = 0
                this.cntDanger = 0
                this.cntWarning = 0
                this.cntSuccess = 0
                this.cntInfo = 0

                return this.tableCommercialsOrders.map((item)=>{
                    let tmp=item;
                    let color=''
                    if(tmp.visible_buffer>100){
                        color = 'dark'
                        this.cntBlack = this.cntBlack+1
                    }
                    else if(tmp.visible_buffer<=100 && tmp.visible_buffer>66){
                        color = 'danger'
                        this.cntDanger = this.cntDanger+1
                    }
                    else if(tmp.visible_buffer<=66 && tmp.visible_buffer>33){
                        color = 'warning'
                        this.cntWarning = this.cntWarning+1
                    }
                    else if(tmp.visible_buffer<=33 && tmp.visible_buffer>=0){
                        color = 'success'
                        this.cntSuccess = this.cntSuccess+1
                    }else{
                        color='info'
                        this.cntInfo = this.cntInfo+1
                    }


                    tmp._cellVariants = {visible_buffer: color};

                    

                    return tmp;
                }) 
            }
        },
    data() {
        return {

            windowHeight: 0,
            tableData:[],
            filter_tableData:[],
            itemselected:{},
            infosend:{},
            showEditContentOrder:false,
            order_active : true,
            name: 'commercial_orders',
            version: 'v1.0.0.0',
            contentWiki: "",
            cntBlack:0,
            cntDanger:0,
            cntWarning:0,
            cntSuccess:0,
            cntInfo:0,
            tableCommercialsOrders:[],
            columnsCommercialsOrders: [
        
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    // {key:' id_workplace', label:"id_workplace", thClass: 'd-none', tdClass: 'd-none'},
                    // {key:' workstation_type_id', label:"workstation_type_id", thClass: 'd-none', tdClass: 'd-none'},
                    {key:'visible_buffer',sortable:true, label:"Buffer"},
                    {key:'code_status', label:"Estado"},
                    {key:'order_code', label:"#Pedido"},
                    {key:'product_code',sortable:true, label:"Código"},
                    {key:'product_description',sortable:true, label:"Descripción"},
                    {key:'customer_name',sortable:true, label:"Cliente"},
                    {key:'requested_amount',sortable:true, label:"Pedida"},
                    {key:'delivered_quantity',sortable:true, label:"Entregada"},
                    {key:'available_inventory',sortable:true, label:"Inventario"},
                    {key:'total_pending',sortable:true, label:"Pendiente"},
                    {key:'order_created',sortable:true, label:"Ingreso"},
                    {key:'deadline',sortable:true, label:"Fecha Comprometida"},
                    {key:'edit', label:"Action"},
                    
                    // {key:'wsplant', label:"Planta"},
                    // {key:'wsgroup', label:"Grupo"},
                    // {key:'wstype', label:"Tipo"},
                    // {key:'edit', label:"Edit"}
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
        numberWithCommas(num) {
            if(num == null)
                num=0
            num = num.toFixed(2)
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
            // return x //.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },

        isRTL () {
            return document.documentElement.getAttribute('dir') === 'rtl' ||
                document.body.getAttribute('dir') === 'rtl'
        },

        onResize() {
            this.windowHeight = window.innerHeight
        },

        open_order_to_edit(item){
            this.infosend=item
            for (let index = 0; index < this.tableData .length; index++) {
                    const element = this.tableData [index];
                    if(element.code == this.infosend.code_status){
                        this.itemselected = element
                    }
                }
        },

        filterInfo(value){
            if(value != null){
                this.tableCommercialsOrders = this.filter_tableData.filter(function (task) {
                    if(task.order_code.toLowerCase().includes(value.toLowerCase()) || task.product_code.toLowerCase().includes(value.toLowerCase())
                    || task.customer_name.toLowerCase().includes(value.toLowerCase()) || task.product_description.toLowerCase().includes(value.toLowerCase()))
                        return task
                });

                this.totalRows = this.tableCommercialsOrders.length
                this.currentPage = 1
                this.onFiltered(this.tableCommercialsOrders)
            }
        },

        update_details_order(){
            this.infosend.status_id=this.itemselected.status_id
            infotrade.update_order_status({status_id:this.itemselected.status_id, dline:this.infosend.deadline, ordid: this.infosend.orders_id, odetailid:this.infosend.orders_details_id},"order-edit").then(data =>{
                if(data.status == 200){
                    this.loadCommercialsOrders()
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
        ///Funcion para cargar la ayuda del helper
        loadCommercialsOrders(){
            infotrade.orders([],"select-active-"+this.order_active).then(data =>{
                // console.log(data)

                if(data.data != ""){
                    this.tableCommercialsOrders = data.data
                    this.filter_tableData=data.data
                    this.totalRows = this.tableCommercialsOrders.length
                    this.filterInfo(this.filter)
                    this.showEditContentOrder=false
                }else{
                    this.filter_tableData=[]
                    this.tableCommercialsOrders=[]
                    this.totalRows = 0
                }
                
                
            })
        },
        ejecutar_cambio(){


            infotrade.orders([],"select-active-"+!this.order_active).then(data =>{
                this.tableCommercialsOrders = data.data
                this.filter_tableData=data.data
                this.totalRows = this.tableCommercialsOrders.length
            })
        },

        onFiltered (filteredItems) {
                this.totalRows = filteredItems.length
                this.currentPage = 1

                this.cntBlack = 0
                this.cntDanger = 0
                this.cntWarning = 0
                this.cntSuccess = 0
                this.cntInfo = 0

                for (let index = 0; index < filteredItems.length; index++) {
                    const element = filteredItems[index];

                    if(element._cellVariants.visible_buffer === "dark"){
                        this.cntBlack = this.cntBlack+1
                    }
                    else if(element._cellVariants.visible_buffer === "danger"){
                        this.cntDanger = this.cntDanger+1
                    }
                    else if(element._cellVariants.visible_buffer === "warning"){
                        this.cntWarning = this.cntWarning+1
                    }
                    else if(element._cellVariants.visible_buffer === "success"){
                        this.cntSuccess = this.cntSuccess+1
                    }else{
                        this.cntInfo = this.cntInfo+1
                    }
                    
                }

            },
    },
    created(){
        this.loadCommercialsOrders()

        infosysconfig.documentstatus({module:"orders"}, "select").then(data => {     
            if(data.data != ''){
                this.tableData = data.data
            }else{
                this.tableData = []
                // this.totalRows= 0
            }
        })
    },
    beforeDestroy() { 
        window.removeEventListener('resize', this.onResize); 
    },

    mounted() {
        window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
        })
    },
    beforeCreate(){
        
    }
}
</script>

<style>
    .font-table {font-size: 12px;}
    .table .table-warning, .table .table-warning > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #ffff00;
        color: #292b2c;
    }
    .table .table-dark, .table .table-dark > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #292b2c;
        color: #f7f7f7;
    }
    .table .table-danger, .table .table-danger > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #d9534f;
        color: #f7f7f7;
    }
    .table .table-success, .table .table-success > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #5cb85c;
        color: #f7f7f7;
    }
</style>
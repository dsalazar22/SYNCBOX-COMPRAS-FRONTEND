<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Estado de los Pedidos
      <!-- <div class="text-muted text-tiny mt-1"><small class="font-weight-normal">Today is Tuesday, 8 February 2018</small></div> -->
    </h4>

    <!-- {{commercial_data[0].detallecolor}} -->
    
    <h1 class="display-3 text-center">
        {{numberWithCommas(valorTotal)}}
        <hr>
        <p style="font-size: 1.6rem;">
                Pendiente por Facturar
        </p>
    </h1>
    <b-card no-body :class="'shadow mb-1 border border-secondary bg-white'">
        <h1 class="display-4 text-center text-dark mt-2">
            Facturacion Por Consumo de Buffer
        <hr>
    </h1>
    <div class="mt-4 ml-4 mr-4">
    <b-row>
        <b-col md="4">
            <b-row>
                    <b-col xs="12">
                        <b-card no-body :class="'shadow mb-1 border border-dark bg-dark text-white text-center'">

                            <h1 class="display-4 mt-3">
                                {{numberWithCommas(getinfopercolor(commercial_data, "dark").totalprice)}}
                            </h1>
                            
                        </b-card>
                    </b-col>

                    <b-col xs="12">
                        <b-card no-body :class="'shadow mb-1 border border-danger bg-danger text-white text-center'">
                            <h1 class="display-4 mt-3">
                                {{numberWithCommas(getinfopercolor(commercial_data, "danger").totalprice)}}
                            </h1>
                            
                        </b-card>
                    </b-col>
                    
                    <b-col xs="12">
                        <b-card no-body :class="'shadow mb-1 border border-warning bg-warning text-center'" >
                            <h1 class="display-4 mt-3">
                                {{numberWithCommas(getinfopercolor(commercial_data, "warning").totalprice)}}
                            </h1>
                            
                        </b-card>
                        
                    </b-col>
                    <b-col xs="12">
                        <b-card no-body :class="'shadow mb-1 border border-success bg-success text-center'">
                            <h1 class="display-4 mt-3">
                                {{numberWithCommas(getinfopercolor(commercial_data, "success").totalprice)}}
                            </h1>
                        </b-card>
                    </b-col>
                    <b-col xs="12">
                        <b-card no-body :class="'shadow mb-1 border border-info bg-info text-center'">
                            <h1 class="display-4 mt-3">
                                {{numberWithCommas(getinfopercolor(commercial_data, "info").totalprice)}}
                            </h1>
                            
                        </b-card>
                    </b-col>
                </b-row>


        </b-col>
        <b-col xs="12" md="7">
            <div id="contenedor"></div>
        </b-col>
        <b-col md="1"></b-col>
    </b-row>


 <b-row class="mt-4">
     <b-col xs="12" md="12">
        <b-row>
            <b-col v-for="a in cptItems" xs="12" md="4" class="mb-2">
                <b-btn block :variant="eventColorSelected" @click="detalle_cliente(a)">
                    {{a.customer_name}} <br> {{numberWithCommas(a.totalprice)}}
                </b-btn>
            </b-col>
        </b-row>
     </b-col>
 </b-row>

    <!-- <div v-for="a in cptItems">
        {{a.customer_name}} <br> {{numberWithCommas(a.totalprice)}}
        
    </div> -->

<!-- :current-page="currentPage" :per-page="perPage" -->

    <b-table v-if="arrayOrders[0]!=null" :sticky-header="false" :no-border-collapse="false" responsive style="font-size:12px"
                   :items="arrayOrders" :fields="columnsCommercialsOrders" >

                        <template v-slot:head(order_created)="scope">
                            <div class="text-nowrap">Fecha Ingreso</div>
                        </template>
                        <template v-slot:head(deadline)="scope">
                            <div class="text-nowrap">Fecha Compromiso</div>
                        </template>
                        <!-- <template v-slot:cell(description)="scope">
                            <div class="text-nowrap">{{scope.description}}</div>
                        </template> -->
                        <template v-slot:cell(product_description)="row">
                            <div class="text-nowrap"> {{row.item.product_description}}</div>
                        </template>
                        <template v-slot:cell(customer_name)="row">
                            <div class="text-nowrap"> {{row.item.customer_name}}</div>
                        </template>
                        <template v-slot:cell(order_code)="row">
                            <div class="text-nowrap"> {{row.item.order_code == '' ? row.item.orders_id : row.item.order_code}}</div>
                        </template>
                        <template v-slot:cell(total_sale)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.sale_price * row.item.requested_amount)}}</div>
                        </template>
                        <template v-slot:cell(sale_price)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.sale_price)}}</div>
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
                            <div class="text-nowrap"> {{row.item.customer_code != undefined && row.item.customer_code != '' && row.item.customer_code != row.item.product_code ? row.item.customer_code + ' ('+row.item.product_code +')' : row.item.product_code}}</div>
                        </template>

                        <!-- <template slot="visible_buffer" slot-scope="props">
                                {{props.item}}
                            </template> -->
                            <template v-slot:cell(edit)="row">
                                <b-dropdown v-if="check_access('drump_commercial', 'w')" variant="default btn-xs icon-btn md-btn-flat hide-arrow" :right="!isRTL">
                                    <!-- {{props.item}} -->
                                    <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                    <!-- <b-dropdown-item href="javascript:void(0)">Ver Perfil</b-dropdown-item> -->
                                    <!-- <b-dropdown-item v-if="props.item.produced_amount == 0" @click.prevent="$refs.cancelarJob.open();selected_production_order=props.item; type_event_selected_order='cancel'" ><i class="ion ion-md-close text-danger"></i> &nbsp;&nbsp;Cancelar Activadad</b-dropdown-item> -->
                                    <b-dropdown-item @click="open_order_to_edit(row.item);showEditContentOrder=true;" > &nbsp;&nbsp;Cambio de Fecha y Estado</b-dropdown-item>
                                    <b-dropdown-item :href="'/comm/newrq/' + (row.item.is_national?'local':'international') + '/' + row.item.orders_id" > &nbsp;&nbsp;Editar Pedido</b-dropdown-item>
                                    <b-dropdown-item @click="open_deliveries(row.item);showEntregas=true;" > &nbsp;&nbsp;Adicionar Entrega</b-dropdown-item>

                                    <!-- <b-dropdown-item href="javascript:void(0)"><i class="ion ion-md-resize"></i> &nbsp;&nbsp;Dividir Actividad</b-dropdown-item> -->

                                    <!-- <b-btn variant="outline-success icon-btn m-r-1" class="btn-xs" @click.prevent="showEditOrder=true;infosend=props.item"><i class="ion ion-md-create"></i></b-btn> -->
                                    <!-- <b-dropdown-item href="javascript:void(0)">Eliminar</b-dropdown-item> -->
                                </b-dropdown>
                               <!-- <span> <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/cfpr/routes/details/'}" target="_blank"><i class="ion ion-md-create"></i></b-btn> </span>{{props.item.code}} -->
                            </template>
                    </b-table>
    </div>

</b-card>

<b-card no-body :class="'shadow mb-1 border border-secondary bg-white text-white'">
        <h1 class="display-4 text-center text-dark mt-2">
                Facturacion Por Mes
            <hr>
        </h1>
    <div class="mt-4 ml-4 mr-4">
        <div id="contenedorMonth"></div>
    </div>

     <b-table v-if="arrayOrdersMonth[0]!=null" :sticky-header="false" :no-border-collapse="false" responsive style="font-size:12px"
                   :items="arrayOrdersMonth" :fields="columnsCommercialsOrders" >

                        <template v-slot:head(order_created)="scope">
                            <div class="text-nowrap">Fecha Ingreso</div>
                        </template>
                        <template v-slot:head(deadline)="scope">
                            <div class="text-nowrap">Fecha Compromiso</div>
                        </template>
                        <!-- <template v-slot:cell(description)="scope">
                            <div class="text-nowrap">{{scope.description}}</div>
                        </template> -->
                        <template v-slot:cell(product_description)="row">
                            <div class="text-nowrap"> {{row.item.product_description}}</div>
                        </template>
                        <template v-slot:cell(customer_name)="row">
                            <div class="text-nowrap"> {{row.item.customer_name}}</div>
                        </template>
                        <template v-slot:cell(order_code)="row">
                            <div class="text-nowrap"> {{row.item.order_code == '' ? row.item.orders_id : row.item.order_code}}</div>
                        </template>
                        <template v-slot:cell(total_sale)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.sale_price * row.item.requested_amount)}}</div>
                        </template>
                        <template v-slot:cell(sale_price)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.sale_price)}}</div>
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
                            <div class="text-nowrap"> {{row.item.customer_code != undefined && row.item.customer_code != '' && row.item.customer_code != row.item.product_code ? row.item.customer_code + ' ('+row.item.product_code +')' : row.item.product_code}}</div>
                        </template>

                        <!-- <template slot="visible_buffer" slot-scope="props">
                                {{props.item}}
                            </template> -->
                            <template v-slot:cell(edit)="row">
                                <b-dropdown v-if="check_access('drump_commercial', 'w')" variant="default btn-xs icon-btn md-btn-flat hide-arrow" :right="!isRTL">
                                    <!-- {{props.item}} -->
                                    <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                    <!-- <b-dropdown-item href="javascript:void(0)">Ver Perfil</b-dropdown-item> -->
                                    <!-- <b-dropdown-item v-if="props.item.produced_amount == 0" @click.prevent="$refs.cancelarJob.open();selected_production_order=props.item; type_event_selected_order='cancel'" ><i class="ion ion-md-close text-danger"></i> &nbsp;&nbsp;Cancelar Activadad</b-dropdown-item> -->
                                    <b-dropdown-item @click="open_order_to_edit(row.item);showEditContentOrder=true;" > &nbsp;&nbsp;Cambio de Fecha y Estado</b-dropdown-item>
                                    <b-dropdown-item :href="'/comm/newrq/' + (row.item.is_national?'local':'international') + '/' + row.item.orders_id" > &nbsp;&nbsp;Editar Pedido</b-dropdown-item>
                                    <b-dropdown-item @click="open_deliveries(row.item);showEntregas=true;" > &nbsp;&nbsp;Adicionar Entrega</b-dropdown-item>

                                    <!-- <b-dropdown-item href="javascript:void(0)"><i class="ion ion-md-resize"></i> &nbsp;&nbsp;Dividir Actividad</b-dropdown-item> -->

                                    <!-- <b-btn variant="outline-success icon-btn m-r-1" class="btn-xs" @click.prevent="showEditOrder=true;infosend=props.item"><i class="ion ion-md-create"></i></b-btn> -->
                                    <!-- <b-dropdown-item href="javascript:void(0)">Eliminar</b-dropdown-item> -->
                                </b-dropdown>
                               <!-- <span> <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/cfpr/routes/details/'}" target="_blank"><i class="ion ion-md-create"></i></b-btn> </span>{{props.item.code}} -->
                            </template>
                    </b-table>

</b-card>
  

<b-card no-body :class="'shadow mb-1 border border-secondary bg-white text-white'">
            <h1 class="display-4 text-center text-dark mt-2">
                Facturacion Por Semana
            <hr>
        </h1>
    <div class="mt-4 ml-4 mr-4">
        <div id="contenedorMonthWW"></div>
    </div>

     <b-table v-if="arrayOrdersMonthWW[0]!=null" :sticky-header="false" :no-border-collapse="false" responsive style="font-size:12px"
                   :items="arrayOrdersMonthWW" :fields="columnsCommercialsOrders" >

                        <template v-slot:head(order_created)="scope">
                            <div class="text-nowrap">Fecha Ingreso</div>
                        </template>
                        <template v-slot:head(deadline)="scope">
                            <div class="text-nowrap">Fecha Compromiso</div>
                        </template>
                        <!-- <template v-slot:cell(description)="scope">
                            <div class="text-nowrap">{{scope.description}}</div>
                        </template> -->
                        <template v-slot:cell(product_description)="row">
                            <div class="text-nowrap"> {{row.item.product_description}}</div>
                        </template>
                        <template v-slot:cell(customer_name)="row">
                            <div class="text-nowrap"> {{row.item.customer_name}}</div>
                        </template>
                        <template v-slot:cell(order_code)="row">
                            <div class="text-nowrap"> {{row.item.order_code == '' ? row.item.orders_id : row.item.order_code}}</div>
                        </template>
                        <template v-slot:cell(total_sale)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.sale_price * row.item.requested_amount)}}</div>
                        </template>
                        <template v-slot:cell(sale_price)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item.sale_price)}}</div>
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
                            <div class="text-nowrap"> {{row.item.customer_code != undefined && row.item.customer_code != '' && row.item.customer_code != row.item.product_code ? row.item.customer_code + ' ('+row.item.product_code +')' : row.item.product_code}}</div>
                        </template>

                        <!-- <template slot="visible_buffer" slot-scope="props">
                                {{props.item}}
                            </template> -->
                            <template v-slot:cell(edit)="row">
                                <b-dropdown v-if="check_access('drump_commercial', 'w')" variant="default btn-xs icon-btn md-btn-flat hide-arrow" :right="!isRTL">
                                    <!-- {{props.item}} -->
                                    <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                    <!-- <b-dropdown-item href="javascript:void(0)">Ver Perfil</b-dropdown-item> -->
                                    <!-- <b-dropdown-item v-if="props.item.produced_amount == 0" @click.prevent="$refs.cancelarJob.open();selected_production_order=props.item; type_event_selected_order='cancel'" ><i class="ion ion-md-close text-danger"></i> &nbsp;&nbsp;Cancelar Activadad</b-dropdown-item> -->
                                    <b-dropdown-item @click="open_order_to_edit(row.item);showEditContentOrder=true;" > &nbsp;&nbsp;Cambio de Fecha y Estado</b-dropdown-item>
                                    <b-dropdown-item :href="'/comm/newrq/' + (row.item.is_national?'local':'international') + '/' + row.item.orders_id" > &nbsp;&nbsp;Editar Pedido</b-dropdown-item>
                                    <b-dropdown-item @click="open_deliveries(row.item);showEntregas=true;" > &nbsp;&nbsp;Adicionar Entrega</b-dropdown-item>

                                    <!-- <b-dropdown-item href="javascript:void(0)"><i class="ion ion-md-resize"></i> &nbsp;&nbsp;Dividir Actividad</b-dropdown-item> -->

                                    <!-- <b-btn variant="outline-success icon-btn m-r-1" class="btn-xs" @click.prevent="showEditOrder=true;infosend=props.item"><i class="ion ion-md-create"></i></b-btn> -->
                                    <!-- <b-dropdown-item href="javascript:void(0)">Eliminar</b-dropdown-item> -->
                                </b-dropdown>
                               <!-- <span> <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/cfpr/routes/details/'}" target="_blank"><i class="ion ion-md-create"></i></b-btn> </span>{{props.item.code}} -->
                            </template>
                    </b-table>

</b-card>

  </div>
</template>

<script>
// import Vue from 'vue'
// import VueChartJs from 'vue-chartjs'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import { infotrade } from "@/components/i40/js/trade";
import {reports} from "@/components/i40/js/globals"
// import VueResource from 'vue-resource'

// Vue.use(VueResource)


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
  name: 'dashboard-commercial',
  metaInfo: {
    title: 'Estado de los Pedidos'
  },
  components: {
    PerfectScrollbar
  },

  // Resize charts
  //

  data() {
      return {
          commercial_data:[],
          arrayColors:[],
          arrayBack:[],
          arrayOrders:[],
          arrayOrdersMonth:[],
          arrayOrdersMonthWW:[],

          eventColorSelected:'',
          eventTextColorSelected:'',

          valorTotal:0,
          cptItems:[],
          columnsCommercialsOrders: [
        
                ///Este objeto es fijo en caso de que se necesite modificar la info
                // {key:' id_workplace', label:"id_workplace", thClass: 'd-none', tdClass: 'd-none'},
                // {key:' workstation_type_id', label:"workstation_type_id", thClass: 'd-none', tdClass: 'd-none'}, 
                {key:'consumed_buffer',sortable:true, label:"Buffer"},
                {key:'code_status',sortable:true, label:"Estado"},
                {key:'order_code',sortable:true, label:"#Pedido"},
                // {key:'document_customer', label:"#OC"},
                {key:'product_code',sortable:true, label:"Código", stickyColumn: true},
                {key:'product_description',sortable:true, label:"Descripción", stickyColumn: true},
                {key:'customer_name',sortable:true, label:"Cliente"},
                {key:'requested_amount',sortable:true, label:"Pedida"},
                {key:'delivered_quantity',sortable:true, label:"Entregada"},
                // {key:'available_inventory',sortable:true, label:"Inventario"},
                {key:'pending_amount',sortable:true, label:"Pendiente"},
                {key:'sale_price', label:"Precio Venta"},
                {key:'total_sale', label:"Venta Total"},
                {key:'order_created',sortable:true, label:"Fecha Ingreso"},
                {key:'deadline',sortable:true, label:"Fecha Compromiso"},
                // {key:'edit', label:"Action"},
                
                // {key:'wsplant', label:"Planta"},
                // {key:'wsgroup', label:"Grupo"},
                // {key:'wstype', label:"Tipo"},
                // {key:'edit', label:"Edit"}
            ],
      }
  },

  methods: {
    numberWithCommas(x) {
        if(x == null)
            x=0
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    },

    getContentResumen(){
        infotrade.globalordersreport().then(data =>{
            // console.log(data.data)
            this.commercial_data = data.data
            this.valorTotal = this.gettotal(this.commercial_data);
        })
    },

    getinfopercolor(array, color){
        if(array[0] != undefined){
            array = array[0].detallecolor
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if(element.color == color){
                    return element
                }
                
            }
        }   
        return 0
    },

    gettotal(array){
        let total = 0
        this.arrayColors=[]
        this.arrayBack=[]

            let arrayTiempo = array[0].detalletiempo
            let arrayMonths = {timestamp:[], valores:[]}
            let arrayMonthsWW = {timestamp:[], valores:[]}

        if(array[0]!=undefined){
            let arrayColors = array[0].detallecolor
            for (let index = 0; index < arrayColors.length; index++) {
                const element = arrayColors[index];
                total += element.totalprice
                this.arrayColors.push({name:element.color, y:element.totalprice})

                if(element.color=='dark')
                    this.arrayBack.push('#181C21')
                else if(element.color=='danger')
                    this.arrayBack.push('#D9534F')
                else if(element.color=='warning')
                    this.arrayBack.push('#FFd950')
                else if(element.color=='success')
                    this.arrayBack.push('#02BC77')
                else if(element.color=='info')
                    this.arrayBack.push('#28C3D7')
            }


            // console.log(array)

            for (let index = 0; index < arrayTiempo.length; index++) {
                const element = arrayTiempo[index];
                
                arrayMonths.timestamp.push([element.aaaamm])
                arrayMonths.valores.push([element.totalprice])
            }

            arrayTiempo = array[0].detallesemana

            for (let index = 0; index < arrayTiempo.length; index++) {
                const element = arrayTiempo[index];
                arrayTiempo[index].aaaamm = element.aaaa+`[${element.ww}]`
                
                arrayMonthsWW.timestamp.push([element.aaaa+`[${element.ww}]`])
                arrayMonthsWW.valores.push([element.totalprice])
            }
        }
        
        this.charts(this)
        this.chartsMonth(this, arrayMonths, 'contenedorMonth')
        this.chartsMonth(this, arrayMonthsWW, 'contenedorMonthWW')

        // console.log(this.arrayMonths)

        return total.toFixed(2)
    },

    detalle_cliente(item){
        this.arrayOrders=item.ordersdetails
        // console.log(item)
    },

    getmonthcat(item){

    },

    charts(infoback){
        Highcharts.setOptions({
            colors: this.arrayBack
        }) ;
        Highcharts.chart("contenedor", {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: "pie"
            },
            title: {
              text: ""
            },
            tooltip: {
              pointFormat: "<b>{point.percentage:.1f}%</b>"
            },
            plotOptions: {
               pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                  enabled: true,
                  format: "{point.percentage:.1f}%",
                  style: {
                    color:
                      (Highcharts.theme &&
                        Highcharts.theme.contrastTextColor) ||
                      "black"
                  }
                },
                events: {
                    click: function (event) {
                            if(event.point.selected != true){
                            // console.log(event.point.selected)
                            infoback.eventColorSelected=event.point.name
                            infoback.eventTextColorSelected= event.point.name == 'dark' || event.point.name == 'danger' ? 'text-white' : ''
                            // console.log(infoback.getinfopercolor(infoback.commercial_data,event.point.options.name).customerdetails)
                            infoback.cptItems = infoback.getinfopercolor(infoback.commercial_data,event.point.options.name).customerdetails
                        }else{
                            infoback.cptItems = []
                            infoback.arrayOrders = []
                        }
                    
                    
                    }
                },
              }
            },
            series: [
              {
                name: "name",
                colorByPoint: true,
                data:  this.arrayColors,
            }]
          });
      
    },

    chartsMonth(infoback, arrayInfo, contenedor){

       Highcharts.setOptions({
            colors: ['#2f7ed8']
        }) ;

        Highcharts.chart(contenedor, {
            chart: {
            },
            title: {
              text: ""
            },
            tooltip: {
            //   pointFormat: "<b>{point.value:.1f}%</b>"
            },
            plotOptions: {
               area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null,
                

                allowPointSelect: true,
                cursor: "pointer",
         
                events: {
                    click: function (event) {

                        

                        if(event.point.category[0].includes('[')){
                            // console.log(event.point.category[0])
                            if(event.point.selected != true){
                                let array = infoback.commercial_data[0].detallesemana
                                
                                for (let index = 0; index < array.length; index++) {
                                    const element = array[index];
                                    // console.log(element)
                                    if(element.aaaamm == event.point.category[0]){
                                        infoback.arrayOrdersMonthWW=element.array_to_json
                                    }
                                    
                                }
                                
                            }else{
                                infoback.arrayOrdersMonthWW = []
                            }

                        }else{
                            if(event.point.selected != true){
                                // console.log(event.point)
                                // console.log(infoback.commercial_data[0].detalletiempo)

                                let array = infoback.commercial_data[0].detalletiempo
                                for (let index = 0; index < array.length; index++) {
                                    const element = array[index];
                                    if(element.aaaamm == event.point.category[0]){
                                        infoback.arrayOrdersMonth=element.pedidosmes
                                    }
                                    
                                }
                                
                            }else{
                                infoback.arrayOrdersMonth = []
                            }
                        }
                    }
                },
              }
            },
            xAxis: {
                categories: arrayInfo.timestamp,
            },
            series: [
              {
                type: 'area',
                name: "Facturacion",
                data:  arrayInfo.valores
            }]
          });
    }

  },

  mounted(){
      
  },

  created() {
      
      this.getContentResumen()
  },
  
  beforeDestroy () {
  },
}
</script>

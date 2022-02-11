<template>
  <div>
    <notifications group="notifications-default" />
    <h4 class="font-weight-bold py-3 mb-0">Crear Compra</h4>
    <!-- {{tableDataProducts}} -->
<!-- BUSCADOR  -->
                                <div class="position-relative mb-3 border rounded">
                                    <b-input-group>
                                        <b-input-group-text slot="prepend" v-if="loading">
                                            <i class="ion ion-md-sync"></i>
                                        </b-input-group-text>

                                        <b-input-group-text  slot="prepend" v-if="!loading">
                                            <i class="ion ion-ios-search"></i>
                                        </b-input-group-text>
                                        <input type="text" class="form-control"
                                            placeholder="Seleccione un proveedor"
                                            autocomplete="off"
                                            v-model="valueSelectedSupplier"
                                            @keydown.down="down"
                                            @keydown.up="up"
                                            @keydown.enter="hit"
                                            @keydown.esc="reset"
                                            @blur="reset"
                                            @input="updateQuerySupplier" />
                                             <b-input-group slot="append" v-if="isDirty || valueSelectedSupplier">
                                            <b-button variant="success" class="btn-md" @click="searchSupplier()">Buscar</b-button>
                                        </b-input-group>
                                            
                                        <b-input-group-text slot="append" v-if="isDirty || valueSelectedSupplier" @click="resetInput" >
                                            <i class="ion ion-md-close" ></i>
                                        </b-input-group-text>
                                        
                                    </b-input-group>
                                    <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                                        <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                            <span class="name" v-text="item.nit"></span>
                                            <span class="text-muted">{{ item.name }}</span>
                                        </a>
                                    </div>
                                </div>
    <b-button variant="outline-success icon-btn" class="btn-md" @click.prevent="create(); closeSpplr(); loadProducts()"><i class="ion ion-md-add"></i></b-button>
  
<!-- FIN BUSCADOR-->


    <!-- <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="tableData"   
 :fields="columnsSuppliers" >
              <template v-slot:cell(edit)="row">
                <div class="text-center">
                  <b-btn variant="outline-success bordeless icon-btn" class="btn-xs" @click="edit(row.item)"><i class="ion ion-md-create"></i></b-btn>
                   <b-btn variant="outline-danger bordeless icon-btn" class="btn-xs" @click="edit(row.item)"><i class="ion ion-md-close"></i></b-btn>
                </div>
              </template>
     </b-table> -->
   

<!-- COMPRAS -->
    <div v-show="show" style="background-color:white"> 
      <b-row  >
        <b-col md="8" sm="12" style="margin-left:250px">
          <h4 class="font-weight-bold py-3 mb-0">Factura Compra</h4>
          <h5 class="font-weight-bold py-3 mb-0">Factura numero: {{factura}}</h5>
          <b-row class="my-2">
            <b-col sm="2" class="my-2">
            
              <h5>Productos:</h5>
            </b-col>
            <b-col>
              <!-- <b-input-group >
                  <b-input-group-text slot="prepend" v-if="loading">
                      <i class="ion ion-md-sync"></i>
                  </b-input-group-text>

                  <b-input-group-text  slot="prepend" v-if="!loading">
                      <i class="ion ion-ios-search"></i>
                  </b-input-group-text>
                   <input type="text" class="form-control"
                      placeholder="Ingrese la cantidad"
                      autocomplete="off"
                      v-model="valueSelectedProduct"
                      @keydown.down="down"
                      @keydown.up="up"
                      @keydown.enter="hit"
                      @keydown.esc="reset"
                      @blur="reset"
                      @input="updateQueryProduct"
                      />
                      <b-input-group-text slot="append" v-if="isDirty || valueSelectedProduct" @click="resetInput">
                        <i class="ion ion-md-close" ></i>
                    </b-input-group-text>
              </b-input-group> -->
              <multiselect
                        v-model="valueSelectedProduct"
                        :options="tableDataProducts"
                        :searchable="true"
                        :show-labels="false"
                        label="description"
                        track-by="description"
                        placeholder="Seleccione un Producto"
                    ></multiselect>
            
            </b-col>
           
          </b-row>
          <b-row class="my-2">
            <b-col sm="2" class="my-2">
              <h5>Fecha:</h5>
            </b-col>
            <b-col sm="10">
              <b-form-datepicker v-model="valueDate" :config="options" placeholder="Seleccione la Fecha"></b-form-datepicker>
            </b-col>
          </b-row>

          <b-row class="my-2">
            <b-col sm="2" class="my-2">
              <h5>Cantidad:</h5>
            </b-col>
            <b-col>
              <b-input-group >
                  <b-input-group-text slot="prepend" v-if="loading">
                      <i class="ion ion-md-sync"></i>
                  </b-input-group-text>

                  <b-input-group-text  slot="prepend" v-if="!loading">
                      <i class="ion ion-ios-filing"></i>
                  </b-input-group-text>
                  <input type="number" class="form-control"
                      placeholder="Ingrese la cantidad"
                      autocomplete="off"
                      v-model="valueAmount"
                      @keydown.down="down"
                      @keydown.up="up"
                      @keydown.enter="hit"
                      @keydown.esc="reset"
                      @blur="reset"
                      />
                      <b-input-group-text slot="append" v-if="isDirty || valueAmount" @click="resetInput">
                        <i class="ion ion-md-close" ></i>
                    </b-input-group-text>
              </b-input-group>
            </b-col>
          </b-row>

          <b-row class="my-2">
            <b-col sm="2" class="my-1">
              <h5>Valor de Negociacion:</h5>
            </b-col>
            <b-col>
              <b-input-group >
                  <b-input-group-text slot="prepend" v-if="loading">
                      <i class="ion ion-md-sync"></i>
                  </b-input-group-text>

                  <b-input-group-text  slot="prepend" v-if="!loading">
                      <i class="ion ion-logo-usd"></i>
                  </b-input-group-text>
                  <input type="number" class="form-control"
                      placeholder="Ingrese el Valor "
                      autocomplete="off"
                      v-model="tradingValue"
                      @keydown.down="down"
                      @keydown.up="up"
                      @keydown.enter="hit"
                      @keydown.esc="reset"
                      @blur="reset"
                      />
                      <b-input-group-text slot="append" v-if="isDirty || tradingValue" @click="resetInput">
                        <i class="ion ion-md-close" ></i>
                    </b-input-group-text>
              </b-input-group>
            </b-col>
          </b-row>

             <b-col class="my-2" style="margin-top:20px; margin-left:90px">
                <b-btn size="sm" variant="outline-danger" @click="close()"><i class="fas fa-trash-alt"></i>&nbsp;Cancelar Compra</b-btn>
                <b-btn size="sm" variant="outline-success" @click="saveOrder(); editOrderCreated=false"><i class="fas fa-plus"></i>&nbsp; Crear Compra</b-btn>
            </b-col>
        </b-col>

      </b-row>
      <br>
      <div>
        <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="itemsSelectedOrder"   :fields="columnsDetails">
              
        </b-table>
       <b-col class="my-2 text-center"> <b-btn style="text-align-center" size="sm" variant="primary" @click="confirmOrder(); editOrderCreated=false"><i class="icon ion-ios-checkmark"></i>&nbsp; Comfirmar Compra</b-btn></b-col>
      <b-row>
        <b-col v-show="valores">
        <h5>Total Compra: {{total}}$</h5>
        <h5>Valor neto: {{totalNeto}}$</h5>
        <h5>IVA 19%: {{iva}}$</h5>
        
        </b-col>
      </b-row>
      </div>
    </div>

    
  
  <div class="d-flex justify-content-between">
     <div>
       <br>
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
     </div>
  </div>
     
  </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css" ></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
import { GetActiveProducts} from "@/vendor/sbx/sbx/product";
import Axios from 'axios'
import { infomaster } from "@/components/i40/js/master";
import { config,master } from "@/components/i40/js/globals";
import Vue from "vue";
import { realtime } from "@/vendor/sbx/sbx-realtime/realtime";
import Notifications from "vue-notification";
import Multiselect from "vue-multiselect";
import VueTypeahead from 'vue-typeahead'
import datePicker from 'vue-bootstrap-datetimepicker';
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
Vue.prototype.$http = Axios;

Vue.use(Notifications);
export default {
  name: "app",

  metaInfo: {
    title: "Nueva Compra",
  },

  extends: VueTypeahead,

  components: {
    Multiselect,
  },
  data() {
    return {

      valueSelectedSupplier:'',
      itemSelectedSupplier:{},
      itemSupplierProduct:{},

      showSupplier: false,

      // BUSCADOR Y PAGINA
        currentPage:1,
        perPage:50,
        filter: null,
      // fin 

      totalRows:0,
      tableData: [],
      itemsSelectedOrder:[],
      itemSelectedOrder:{},
      selectedProduct: {},
      show: false,



      // ORDEN
      tableDataProducts:[],
      totalRowsProducts: 0,
      valueSelectedProduct:'',
      valueDate:'',
      valueAmount:'',
      tradingValue:'',
      totalValue:0,
      selectedModule:'',
      product_ppal:{},
      products:[],
      total:0,
      totalNeto:0,
      iva:0,
      factura:1,
      valores:false,
      numFactura:'',

      columnsDetails:[
          {key:"code", label:"Codigo del Producto"},
          {key:"description", label:"Descripcion del Producto"},
          {key:"date", label:"Fecha"},
          {key:"amount",  label:"Cantidad"},
          {key:"trade_value", label:"Valor de Negociación"},
          {key:"value", label:"Valor Total"},
          
      ],

      columnsSuppliers:[
        {key:'nit', label:'NIT'},
        {key:'name', label:'Nombre'},
        {key:'phone', label:'Teléfono'},
        {key:'address', label:'Dirección'},
        {key:'principal_contact', label:'Contacto'},
        {key:'edit', label:'Editar'}
      ],
      options: {
                format: "YYYY-MM-DD HH:mm",
                // useCurrent: false
                // minDate:Date(),
            },
    };
  },

  mounted(){
    this.loadSupplier();
  },

  methods: {
    isRTL () {
      return false
    },

    loadSupplier() {
      infomaster.supplier([], "0","select").then(data => {
          if(data.data != ""){
            console.log(data.data)
            this.tableData = data.data
            this.totalRows= this.tableData.length
          }else{
            this.tableData = []
            this.totalRows= 0
          }
      })
      
    },

    updateQuerySupplier(){
      this.query = this.valueSelectedSupplier
      console.log(this.query)
      this.update()
    },

   

    resetInput() {
        this.valueSelectedSupplier=''
        this.valueSelectedProduct = ''
        this.valueDate = ''
        this.valueAmount = ''
        this.tradingValue = ''
        this.reset()
        
    },

    create() {
      this.show = true
      
    },

    close(){
        this.show = false
        this.resetInput()
        this.valores = false
        this.itemsSelectedOrder = []
    },
     searchSupplier(){
    infomaster.supplier([], "0","select").then(data => {
           console.log(data.data)
          let supplier = data.data
          this.tableData = []
          console.log(data.data)  
          for (let index = 0; index < supplier.length; index++) {
            const element = supplier[index];
            if(element.nit.includes(this.valueSelectedSupplier))
            {
              this.tableData.push(element)
            }
            
          }
      })
  },
   loadProducts(){
      infomaster.products([],'0',"select").then(data => {
                if(data.data != ""){
                  console.log(data.data)
                    this.tableDataProducts = data.data
                    this.totalRowsProducts= this.tableDataProducts.length
                    
                }else{
                    this.tableDataProducts = []
                    this.totalRows=0
                }
            })

        },

    //  updateQueryProducto () {
    //         let uri = encodeURIComponent(this.valueSelectedProduct)
    //         this.query = uri
    //         this.update()
    //     },

    

    //  onHit (item) {
    //    this.product_ppal = {
    //             product_id: item.product_id,
    //             description: item.description,
    //             amount: 0
    //         }
    // },

    // obtenerProductos: function(){
    //         GetActiveProducts().then(data => {
    //             this.tableData = data.data
    //             this.totalRows= this.tableData.length
    //         })
    //     },

    onFiltered(filteredItems){
      this.totalRows = filteredItems.length
      this.currentPage = 1
      
    },

    showSpplr(){
      this.showSupplier = true
    },

    closeSpplr(){
    this.showSupplier = false
  },


  saveOrder(){

    if(this.valueSelectedProduct != '' && this.valueDate != '' && this.valueAmount != '' && this.tradingValue != '')
    {
    this.itemSelectedOrder = {}
    this.itemSelectedOrder['amount'] = this.valueAmount
    this.itemSelectedOrder['date'] = this.valueDate
    this.itemSelectedOrder['trade_value'] = this.tradingValue
    this.itemSelectedOrder['code'] = this.valueSelectedProduct.code
    this.itemSelectedOrder['description'] = this.valueSelectedProduct.description

    this.totalValue = this.valueAmount * this.tradingValue
    this.itemSelectedOrder['value'] = this.totalValue
    this.itemsSelectedOrder.push(this.itemSelectedOrder)
    this.totalNeto= this.totalNeto + this.totalValue
    this.iva = this.totalNeto * 0.19
    this.total = this.iva + this.totalNeto
    this.valores = true
    this.resetInput()
    }else{
      this.showCustom("bg-danger", "Error", "¡La informacion esta incompleta, por favor valide!")
    }
    
    
  },

  confirmOrder(){
    if(Object.entries(this.itemsSelectedOrder).length === 0){
      this.showCustom("bg-danger", "Compra fallida", "¡Orden vacia!")
    } else{

      this.factura += 1

      this.showCustom("bg-success", "Compra Realizada", "¡Orden Facturada Correctamente!")
// AQUI ES DONDE TRATO DE ENVIAR LOS DATOS DE LA COMPRA AL API
      // this.itemSelectedOrder = this.itemsSelectedOrder
      // realtime.sendPurchaseOrder(this.itemSelectedOrder).then(data =>{
      //   console.log(data.data)
      //   if(data.status == 200){
          
      //      this.showCustom("bg-success", "Compra Realizada", "¡La compra se ha enviado con exito!")
      //   }else{
      //     this.showCustom("bg-danger", "Compra fallida", "¡No se envio correctamente!")
      //   }
      // })
      // this.showCustom("bg-success", "Compra Enviada", "¡Orden facturada correctamente!")
    this.resetInput()
    this.itemsSelectedOrder = []
    this.itemSelectedOrder = {}
    this.totalNeto = 0
    this.total = 0
    this.iva = 0
    this.valores = false
      // this.factura()
    }
  },

 

  // factura(){
  //   if(this.factura < 10){
  //       numFactura = '000000' + this.factura
  //       this.factura ++
  //   } else if(this.factura < 100)
  //     {
  //       this.numFactura = '0000' + this.factura
  //       this.factura ++
  //     }
  // },

  showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
        },

  },

  

  created(){
    this.src = master+'suppliersearch/'
  },
 
}
</script>


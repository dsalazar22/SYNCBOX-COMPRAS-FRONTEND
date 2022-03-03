<template>
  <div>
    <notifications group="notifications-default" />
    <h4 class="font-weight-bold py-3 mb-0">Crear Compra</h4>
    <!-- {{tableDataProducts}} -->
<!-- BUSCADOR  -->
                             <!-- <div class="position-relative mb-3 border rounded">
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
                                </div> -->
    <b-button variant="outline-success icon-btn" class="btn-md" @click.prevent="create();   datos()"><i class="ion ion-md-add"></i></b-button>
  
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
          <h4 style="margin-left:120px" class="font-weight-bold py-3 mb-0">Factura Compra</h4>
          <h5 style="margin-left:120px; margin-top:-15px" class="font-weight-bold py-3 mb-0">Factura numero: {{invoice()}}</h5>
          
          <b-row class="my-2">
            <b-col style="margin-left:-170px" md="3" class="my-2">
            
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
               <div class="position-relative mb-3 border rounded">
                  <b-input-group >
                      <b-input-group-text slot="prepend" v-if="loading">
                         <i class="ion ion-md-sync"></i>
                      </b-input-group-text>

                      <b-input-group-text  slot="prepend" v-if="!loading">
                        <i class="ion ion-ios-search"></i>
                      </b-input-group-text>
                          <input type="text" class="form-control"
                              placeholder="Seleccione un producto"
                              autocomplete="off"
                              v-model="valueSelectedProduct"
                              @keydown.down="down"
                              @keydown.up="up"
                              @keydown.enter="hit"
                              @keydown.esc="reset"
                              @blur="reset"
                              @input="updateQueryProduct" 
                              :readonly="readProduct"/>
                                            
                          <b-input-group-text slot="append" v-if="isDirty || valueSelectedProduct" @click="resetProduct" >
                              <i class="ion ion-md-close" ></i>
                          </b-input-group-text>
                          
                         </b-input-group>
                           <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                             <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                              <span class="name" v-text="item.code"></span>
                               <span class="text-muted">{{ item.description}}</span>
                             </a>
                            </div>
                 </div>
            
            </b-col>
           
          </b-row>
          <b-row class="my-2">
            <b-col style="margin-left:-170px" md="3" class="my-2">
            
              <h5>Proveedor:</h5>
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
                              @input="updateQuerySupplier" 
                              :readonly="readSupplier" />
                                            
                          <b-input-group-text slot="append" v-if="isDirty || valueSelectedSupplier" @click="resetSupplier" >
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
            
            </b-col>
           
          </b-row>
          <b-row class="my-2">
            <b-col style="margin-left:-170px" sm="3" class="my-2">
              <h5>Fecha:</h5>
            </b-col>
            <b-col sm="12">
              <b-form-datepicker v-model="valueDate" :config="options" placeholder="Seleccione la Fecha"></b-form-datepicker>
            </b-col>
          </b-row>

          <b-row class="my-2">
            <b-col style="margin-left:-170px" sm="3" class="my-2">
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
                      <b-input-group-text slot="append" v-if="isDirty || valueAmount" @click="resetAmount">
                        <i class="ion ion-md-close" ></i>
                    </b-input-group-text>
              </b-input-group>
            </b-col>
          </b-row>

          <b-row class="my-2">
            <b-col style="margin-left:-170px" sm="3" class="my-1">
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
                      <b-input-group-text slot="append" v-if="isDirty || tradingValue" @click="resetTradingValue">
                        <i class="ion ion-md-close" ></i>
                    </b-input-group-text>
              </b-input-group>
            </b-col>
          </b-row>

             <b-col class="my-2" style="margin-top:20px; margin-left:50px">
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
      itemSelectedProduct:{},
      itemSupplierProduct:{},

     

      // BUSCADOR Y PAGINA
        currentPage:1,
        perPage:50,
        filter: null,
        readSupplier:true,
        readProduct: false,
        link: 'productsearch/',
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
          {key:"code", label:"Codigo"},
          {key:"description", label:"Descripcion"},
          {key:"name", label:"Proveedor"},
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
  },

  methods: {
    isRTL () {
      return false
    },

    invoice(){
        let res = "";
            if(this.factura>=1000)
            {
                res = "" + this.factura;
            }
            if(this.factura>=100)
            {
                res = "0" + this.factura;
             }
         if(this.factura>=10)
            {
                res = "00" + this.factura;
            }
        if(this.factura>=1)
            {
                res = "000" + this.factura;
        }
   return res;
  },
    // PROVEEDORES
    // loadSupplier() {
    //   infomaster.supplier([], "0","select").then(data => {
    //       if(data.data != ""){
    //         console.log(data.data)
    //         this.tableData = data.data
    //         this.totalRows= this.tableData.length
    //       }else{
    //         this.tableData = []
    //         this.totalRows= 0
    //       }
    //   })
      
    // },

    updateQuerySupplier(){
      this.query = this.valueSelectedSupplier
      console.log(this.query)
      this.update()
    },

     updateQueryProduct(){
      this.query = this.valueSelectedProduct
      console.log(this.query)
      this.update()
    },

   resetSupplier(){
     if(this.readSupplier === false || this.readSupplier === true) 
     {
       this.valueSelectedSupplier = ''
       this.readSupplier = false
       this.readProduct = true
       this.link = 'suppliersearch/'
       this.datos()
     }
   },
   resetProduct(){
    
       this.valueSelectedProduct = ''
       this.readProduct = false
       this.readSupplier = true
       this.link = 'productsearch/'
       this.datos()
     
   },
   resetAmount(){
     
       this.valueAmount = ''
     
   },
   resetTradingValue(){

     
       this.tradingValue = ''
     
   },

    resetInput() {

        this.valueSelectedSupplier=''
        this.valueSelectedProduct = ''
        this.valueDate = ''
        this.valueAmount = ''
        this.tradingValue = ''
        this.readSupplier = true
        this.readProduct = false
        this.link = 'productsearch/'
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
  //  loadProducts(){
  //     infomaster.products([],'0',"select").then(data => {
  //               if(data.data != ""){
  //                 console.log(data.data)
  //                   this.tableDataProducts = data.data
  //                   this.totalRowsProducts= this.tableDataProducts.length
                    
  //               }else{
  //                   this.tableDataProducts = []
  //                   this.totalRows=0
  //               }
  //           })

  //       },

    //  updateQueryProducto () {
    //         let uri = encodeURIComponent(this.valueSelectedProduct)
    //         this.query = uri
    //         this.update()
    //     },

    

      onHit (item) {
       
        if(this.readProduct === false)
        {
          this.itemSelectedProduct=item
          this.valueSelectedProduct=item.description
          this.itemSupplierProduct.product_code = item.code

          

          if(this.valueSelectedSupplier.length != 0)
          {
            this.readSupplier = true
            this.readProduct = true
          } else{
            this.readSupplier = false
          }
          
          
        } 
         if(this.readSupplier === false ){

          this.link = 'suppliersearch/'
          this.datos()
          this.itemSelectedSupplier=item
          this.valueSelectedSupplier=item.name
          this.itemSupplierProduct.supplier_id = item.id

          this.readProduct = true

          if(this.valueSelectedSupplier.length != 0)
          {
            this.readSupplier = true
          }
          
        }
      
    
      
    },

    datos(){
     this.src = master + this.link

    },

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

  


  saveOrder(){

    if(this.valueSelectedProduct != '' && this.valueDate != '' && this.valueAmount != '' && this.tradingValue != '')
    {
    this.itemSelectedOrder = {}
    this.itemSelectedOrder['amount'] = this.valueAmount
    this.itemSelectedOrder['date'] = this.valueDate
    this.itemSelectedOrder['trade_value'] = this.tradingValue
    this.itemSelectedOrder['code'] = this.itemSelectedProduct.code
    this.itemSelectedOrder['description'] = this.itemSelectedProduct.description
    this.itemSelectedOrder['name'] = this.itemSelectedSupplier.name

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
    //this.src = master+this.src
  },
 
}
</script>


<template>
    <div>
        <div>
         <notifications group="notifications-default" />
         <h3 class="font-weight-bold py-3 mb-0"> Nuevo Requerimiento</h3>
         
        <b-btn  variant="outline-primary" @click.prevent="create(); datos()"><i class="fas fa-plus"></i>&nbsp; Crear Requerimiento</b-btn>
        </div>

        <div v-show="show" style="background-color:white">
            <br>
        <div style="background-color:white">
            <h4 class="font-weight-bold py-3 mb-0 text-center">Agregar Requerimiento</h4>
            <h5 class="font-weight-bold py-3 mb-0 text-center">Requisición de compra No: {{this.invoice()}}</h5>
            <br>
            <b-row> 
                <b-col style="margin-left:20px" md="auto" class="my-2">
                        <h5>Producto:</h5>
                </b-col>
                <b-col style="margin-left:-5px" md="4">
              
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
                                            
                          <b-input-group-text slot="append" v-if="isDirty || valueSelectedProduct" @click="resetInput" >
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
                <b-col style="margin-left:35px" md="auto" class="my-2">
                     <h5>Proveedor:</h5>
                </b-col>

               <b-col style="margin-left:-5px" md="4"> 
              
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
            
            </b-col>

            </b-row>
<br>
            <b-row>
                <b-col style="margin-left:60px" md="0" class="my-2">
                    <h5>Fecha sugerida: </h5>
                </b-col>
                 <b-col md="3" style="margin-left:1px"> 
                    <b-form-datepicker v-model="dateRequired" :config="options" placeholder="Seleccione la Fecha"></b-form-datepicker>
                 </b-col>

                 <b-col style="margin-left:50px" md="0" class="my-2">
                    <h5>Fecha requerida: </h5>
                </b-col>
                 <b-col md="3" style="margin-left:1px"> 
                    <b-form-datepicker v-model="dateSuggested" :config="options" placeholder="Seleccione la Fecha"></b-form-datepicker>
                 </b-col>
                 
            </b-row>
<br>

            <b-row>
                <b-col md="auto" class="my-2" style="margin-left:130px">
                    <h5>Cantidad:</h5>
                </b-col>
                <b-col md="7" style="margin-left:-10px">
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
            
        </div>
               <br>
        <b-row>
            <b-col class="text-center">
          <b-btn size="sm" variant="outline-danger" @click="close()"><i class="fas fa-trash-alt"></i>&nbsp;Cancelar Requerimiento</b-btn>
                <b-btn size="sm" variant="outline-success" @click="saveOrder(); editOrderCreated=false"><i class="fas fa-plus"></i>&nbsp; Crear Requerimiento</b-btn>
            </b-col>
        </b-row>
<br>
         <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="itemsSelectedOrder"   :fields="columnsRequirements">
              
        </b-table>

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
    title: "Nuevo Requerimiento",
  },



  components: {
    Multiselect,
  },
  data() {
    return {
    //BUSCADOR
    readProduct:false,
    readSupplier:true,
    itemSelectedSupplier:{},
    itemSelectedProduct:{},
    itemSupplierProduct:{},
    link: 'productsearch/',

        //div formulario
      show:false,

      //productos
      tableDataProducts:[],
      totalRowsProducts: 0,
      valueSelectedProduct:'',

        //proveedor
      tableDataSupplier:[],
      totalRowsSupplier:0,
        valueSelectedSupplier:'',

        //# de requerimiento
        factura:1,
      //tabla
      columnsRequirements:[
          {key:"code", label:"Codigo"},
          {key:"description", label:"Descripcion"},
          {key:"supplier", label:"proveedor"},
          {key:"amount", label:"Cantidad"},
          {key:"dateSuggested", label:"Fecha sugerida"},
          {key:"dateRequired", label:"Fecha Requerida"}
      ]
    }
  },

  mounted(){
   
  },

  methods: {
       isRTL () {
      return false
    },
    create(){
        this.show = true
    },

    close(){
        this.show = false
    },

    resetInput(){

    },

    //    loadProducts(){
    //   infomaster.products([],'0',"select").then(data => {
    //             if(data.data != ""){
    //               console.log(data.data)
    //                 this.tableDataProducts = data.data
    //                 this.totalRowsProducts= this.tableDataProducts.length
                    
    //             }else{
    //                 this.tableDataProducts = []
    //                 this.totalRows=0
    //             }
    //         })

    //     },

    //     loadSupplier() {
    //   infomaster.supplier([], "0","select").then(data => {
    //       if(data.data != ""){
    //         console.log(data.data)
    //         this.tableDataSupplier = data.data
    //         this.totalRowsSupplier= this.tableDataSupplier.length
    //       }else{
    //         this.tableDataSupplier = []
    //         this.totalRowsSupplier= 0
    //       }
    //   })
      
    // },
    showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
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
    
    onHit (item) {
       
        if(this.readProduct === false)
        {
          this.itemSelectedProduct=item
          this.valueSelectedProduct=item.description
          this.itemSupplierProduct.product_code = item.code

          this.readSupplier = false

          this.link = 'suppliersearch/'
          this.datos()
          
        } 
         if(this.readSupplier === false){

          this.itemSelectedSupplier=item
          this.valueSelectedSupplier=item.name
          this.itemSupplierProduct.supplier_id = item.id

          this.readProduct = true
          
          
        }
      
    
      
    },

    datos(){
     this.src = master + this.link

    },

    onFiltered(filteredItems){
      this.totalRows = filteredItems.length
      this.currentPage = 1
      
    },

  },

   created(){
    //this.src = master+this.link
  },

  

  
 
}
</script>

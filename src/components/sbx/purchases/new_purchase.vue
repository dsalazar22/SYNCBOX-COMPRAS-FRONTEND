<template>
  <div>
    <notifications group="notifications-default" />
    <h4 class="font-weight-bold py-3 mb-0">Crear Compra</h4>
<!-- BUSCADOR  -->
    <b-form-group label="Buscar Proveedor">
      <b-input-group>
        <b-form-input v-model="filter" placeholder="Buscar..."/>
        <b-input-group-append>
            <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
          <b-button variant="outline-success icon-btn" class="btn-md" @click.prevent="create()"><i class="ion ion-md-add"></i></b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
<!-- FIN BUSCADOR-->


 <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="tableData"   
 :fields="columnsSuppliers" :filter="filter" @filtered="onFiltered">
              
        </b-table>
   

    <div v-show="show"> 
      <b-row class="border rounded border-white" >
        <b-col md="8" sm="12" style="margin-left:250px">
          <h4 class="font-weight-bold py-3 mb-0">Crear Compra</h4>
          <b-row class="my-2">
            <b-col sm="4">
              <h5>Productos:</h5>
            </b-col>
            <b-col sm="4">
              <b-form-select size="sm" v-model="f" :options="f"></b-form-select>
            </b-col>
          </b-row>
          <b-row class="my-2">
            <b-col sm="4">
              <h5>Fecha:</h5>
            </b-col>
            <b-col sm="4">
              <b-form-datepicker v-model="value"></b-form-datepicker>
            </b-col>
          </b-row>

          <b-row class="my-2">
            <b-col sm="4">
              <h5>Cantidad:</h5>
            </b-col>
            <b-col sm="4">
              <b-form-input
                v-model="cant"
                placeholder="Ingrese la cantidad..."
              ></b-form-input>
            </b-col>
          </b-row>

             <b-col class="text-center" style="margin-top:20px">
                <b-btn size="sm" variant="outline-danger" @click="close()"><i class="fas fa-trash-alt"></i>&nbsp;Cancelar Compra</b-btn>
                <b-btn size="sm" variant="outline-success" @click="close(); editOrderCreated=false"><i class="fas fa-plus"></i>&nbsp; Crear Compra</b-btn>
            </b-col>
        </b-col>

      </b-row>
      <br>
      <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="tableData"   :fields="columnsDetails">
              
        </b-table>
    </div>
    
  <div class="d-flex justify-content-between">
     <div>
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
     </div>
  </div>
     
  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" ></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
import { infomaster } from "@/components/i40/js/master";
import Vue from "vue";
import { realtime } from "@/vendor/sbx/sbx-realtime/realtime";
import Notifications from "vue-notification";
import Multiselect from "vue-multiselect";
Vue.use(Notifications);
export default {
  name: "app",

  metaInfo: {
    title: "Nueva Compra",
  },

  components: {
    Multiselect,
  },
  data() {
    return {


      // BUSCADOR Y PAGINA
        currentPage:1,
        perPage:50,
        filter: null,
      // fin 

      totalRows:0,
      tableData: [],
      selectedProduct: {},
      show: false,

      columnsDetails:[
          {key:"code", "sortable": true, label:"Codigo del Producto"},
          {key:"description", "sortable": true, label:"Descripcion del Producto"},
          {key:"amount", "sortable": true, label:"Cantidad"},
          {key:"trade_value", "sortable": true, label:"Valor de Negociación"},
          {key:"value", "sortable": true, label:"Valor Total"},
      ],

      columnsSuppliers:[
        {key:'nit', label:'NIT'},
        {key:'name', label:'Nombre'},
        {key:'phone', label:'Teléfono'},
        {key:'address', label:'Dirección'},
        {key:'principal_contact', label:'Contacto'}
      ]
    };
  },

  mounted(){
    this.loadSupplier();
  },

  methods: {
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

    create() {
      this.show = true
    },

    close(){
        this.show = false
    },

    onFiltered(filteredItems){
      this.totalRows = filteredItems.length
      this.currentPage = 1
      
    }
  }
}
</script>


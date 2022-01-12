<template>
  <div>
    <notifications group="notifications-default" />
    <h4 class="font-weight-bold py-3 mb-0">Crear Compra</h4>

    <b-form-group label="Buscar Proveedor">
      <b-input-group>
        <b-form-input v-model="param" placeholder="Buscar..."></b-form-input>
        <b-input-group-append>
            <b-input-group-text slot="prepend" v-if="!loading">
                 <i class="ion ion-ios-search"></i>
            </b-input-group-text>
          <b-button variant="success" @click="create()">Crear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>

   

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
                <b-btn size="sm" variant="outline-info" :to="'/purch/new_purchase'"><i class="fas fa-trash-alt"></i>&nbsp; Nueva Compra</b-btn>
                <b-btn size="sm" variant="outline-success" @click="h(); editOrderCreated=false"><i class="fas fa-plus"></i>&nbsp; Crear Pedido</b-btn>
            </b-col>
        </b-col>

      </b-row>
      <br>
      <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="i"   :fields="columnsDetails">
              
        </b-table>
    </div>
    
    
     
  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" ></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
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
      param: null,
      productsTable: [],
      selectedProduct: {},
      show: false,

      columnsDetails:[
          {key:"code", "sortable": true, label:"Codigo del Producto"},
          {key:"description", "sortable": true, label:"Descripcion del Producto"},
          {key:"amount", "sortable": true, label:"Cantidad"},
          {key:"trade_value", "sortable": true, label:"Valor de Negociación"},
          {key:"value", "sortable": true, label:"Valor Total"},
      ]
    };
  },

  methods: {
    loadSupplier() {},

    create() {
      this.show = true
    },

    close(){
        this.show = false
    }
  }
}
</script>


<template>
  <div>
    <notifications group="notifications-default" />
    <h4 class="font-weight-bold py-3 mb-0 mx-2">Crear Orden de Compra</h4>

    <!-- BUSCAR REQUERIMIENTO -->

    <div class="row mb-3 mx-0" style="background-color:white">

      <div class="col-12 py-2">

        <h5>Seleccione un Requerimiento</h5>


        <multiselect v-model="valueSelectedRequirement" :options="requirements" :custom-label="requirementWithProduct"
          :searchable="true" :show-labels="false" placeholder="Requerimientos activos...">

        </multiselect>

        <br>


      </div>

    </div>

    <!-- FIN BUSCAR REQUERIMIENTO -->




    <!-- COMPRAS -->

    <div>

      <!-- REQUERIMIENTO -->

      <div style="background-color: white">
        <h4 class="font-weight-bold py-3 mx-2">
          Información del Requerimiento <span style="font-weight:normal; font-size:1.1rem">
            {{ valueSelectedRequirement.requirement_id }}</span>
        </h4>

        <div class="row">


          <div class="col  mx-2 mb-2">
            <h5>Producto:</h5>

            <h5 class="mt-4">Codigo del Producto: <span id="spanRequirement">
                {{ valueSelectedRequirement.product_code }}</span></h5>

            <h5 class="mt-4">Descripcion del Producto: <span id="spanRequirement">
                {{ valueSelectedRequirement.product_description }}</span></h5>

            <h5 class="mt-4">Cantidad Solicitada:<span id="spanRequirement">
                {{ valueSelectedRequirement.quantity }}</span>
            </h5>

            <h5 class="mt-4">Precio Unitario: <span id="spanRequirement">
                {{ valueSelectedRequirement.price_list }}</span>
            </h5>

            <br>

          </div>

          <div class="col mb-2">
            <h5>Fechas:</h5>

            <h5 class="mt-4">Fecha de Creación: <span id="spanRequirement">{{ valueSelectedRequirement.created }}</span>
            </h5>

            <h5 class="mt-4">Fecha Solicitada: <span id="spanRequirement">
                {{ valueSelectedRequirement.delivery_date }}</span></h5>


          </div>

        </div>


      </div>
      <br>
      <!-- </b-container> -->


      <!-- SECCIÓN DE ORDEN DE COMPRA -->

      <!-- CANTIDAD PACTADA -->
      <div style="background-color:white">

        <h4 class="font-weight-bold py-3 mb-0 mx-2">
          Nueva Orden de Compra
        </h4>
        <h5 class="font-weight-bold py-3 mb-3 mx-2">
          Orden No: {{ this.orderNumber }}
        </h5>

        <div class="row mb-3">

          <div class="col-2 offset-0 my-2 mx-2" md="2">
            <h5>Cantidad Pactada: </h5>
          </div>

          <div class="col-9">
            <b-input-group>

              <b-input-group-text slot="prepend" v-if="loading">
                <i class="ion ion-md-sync"></i>
              </b-input-group-text>

              <b-input-group-text slot="prepend" v-if="!loading">
                <i class="ion ion-ios-filing"></i>
              </b-input-group-text>

              <input type="number" class="form-control" placeholder="Ingrese la cantidad" autocomplete="off"
                v-model="valueQuantityAgreed" @keydown.down="down" @keydown.up="up" @keydown.enter="hit"
                @keydown.esc="reset" @blur="reset" />

              <b-input-group-text slot="append" v-if="(isDirty || valueQuantityAgreed)" @click="resetQuantityAgreed">
                <i class="ion ion-md-close"></i>
              </b-input-group-text>

            </b-input-group>
          </div>

        </div>


        <!-- VALOR DE NEGOCIACION -->

        <div class="row mb-3 row ">

          <div class="col-2 mx-2 my-2">
            <h5>Valor de Negociación:</h5>
          </div>

          <div class="col-9">
            <b-input-group>

              <b-input-group-text slot="prepend" v-if="loading">
                <i class="ion ion-md-sync"></i>
              </b-input-group-text>

              <b-input-group-text slot="prepend" v-if="!loading">
                <i class="ion ion-ios-cash"></i>
              </b-input-group-text>

              <input type="number" class="form-control" placeholder="Ingrese el valor de negociación" autocomplete="off"
                v-model="tradingValue" @keydown.down="down" @keydown.up="up" @keydown.enter="hit" @keydown.esc="reset"
                @blur="reset" />

              <b-input-group-text slot="append" v-if="(isDirty || tradingValue)" @click="resetTradingValue">
                <i class="ion ion-md-close"></i>
              </b-input-group-text>

            </b-input-group>
          </div>


        </div>

        <!-- FECHA PACTADA -->

        <div class="row mb-3">

          <div class="col-2 mx-2 my-2">
            <h5>Fecha Pactada:</h5>
          </div>

          <div class="col-9">
            <b-form-datepicker today-button reset-button close-button v-model="valueDateAgreed" :config="options"
              placeholder="Seleccione la Fecha">
            </b-form-datepicker>
          </div>

        </div>


        <!-- PROVEEDOR -->

        <div class="row justify-content-start mb-3">
          <div class="col-2 mx-2 my-2">
            <h5>
              Proveedor:</h5>

          </div>

          <div class="col-9 ">
            <multiselect v-model="valueSupplier" :options="infoSupplier" :custom-label="supplierWithNit"
              :searchable="true" :show-labels="false" placeholder="Seleccione un proveedor" />
          </div>
        </div>

        <br>

      </div>







      <br />
      <b-row class="my-1">
        <b-col class="text-center">
          <b-btn size="" variant="primary" @click="openModalWarningAmounts();
          "><i class="fas fa-plus"></i>&nbsp; Crear Orden de Compra</b-btn>
        </b-col>
      </b-row>





    </div>


    <!--INICIO MODAL PARA ADVERTIR SI LAS CANTIDADES SON DIFERENETS -->
    <b-modal v-model="modalWarningAmounts">
      <div slot="modal-title">
        ¡ADVERTENCIA!
      </div>

      <h6>
        ¡Las cantidades del requerimiento y la orden de compra son Diferentes!
      </h6>
      <br>
      <div class="input-group">
        <h6>
          ¡Si desea continuar haga clcik en el boton
        </h6>
        <h6 class="ml-2" style="color:#53bdf4 ">
          CONFIRMAR!
        </h6>
      </div>

      <div slot="modal-footer">
        <b-button class="btn btn-danger" @click.prevent="closeModalWarningAmounts()">Cancelar</b-button>
        <b-button class="btn btn-primary" @click.prevent="openModalWarningDate()">Continuar</b-button>
      </div>

    </b-modal>

    <!-- FIN -->

    <!-- INICIO MODAL PARA ADVERTIR QUE LA FECHA PACTADA ES MAS ANTIGUA QUE LA ACTUAL -->
    <b-modal v-model="modalWarningDate">
      <div slot="modal-title">
        ¡ADVERTENCIA!
      </div>

      <h6>
        ¡La fecha pactada es mas antigua que la actual!
      </h6>
      <br>
      <div class="input-group">
        <h6>
          ¡Si desea continuar haga click en el boton
        </h6>
        <h6 class="ml-2" style="color:#53bdf4 ">
          CONFIRMAR!
        </h6>
      </div>

      <div slot="modal-footer">
        <b-button class="btn btn-danger" @click.prevent="closeModalWarningDate()">Cancelar</b-button>
        <b-button class="btn btn-primary" @click.prevent="saveOrder()">Continuar</b-button>
      </div>

    </b-modal>

    <!-- FIN MODAL PARA ADVERTIR QUE LA FECHA PACTADA ES MAS ANTIGUA QUE LA ACTUAL-->
  </div>


</template>
<style>
#spanRequirement {
  margin-top: -0.1rem;
  font-weight: normal;
  font-size: 0.9rem;
}
</style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss">

</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css">

</style>

<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss">

</style>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss">

</style>

<script>
import { GetActiveProducts } from "@/vendor/sbx/sbx/product";
import Axios from "axios";
import { infomaster } from '@/components/i40/js/master'
import { infotrade } from "@/components/i40/js/trade";
import { infousers } from '@/components/i40/js/users'
import { config, master } from "@/components/i40/js/globals";
import Vue from "vue";
import { realtime } from "@/vendor/sbx/sbx-realtime/realtime";
import Notifications from "vue-notification";
import Multiselect from 'vue-multiselect'
import VueTypeahead from "vue-typeahead";
import datePicker from "vue-bootstrap-datetimepicker";
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
import bootstrapDatetimepicker from "pc-bootstrap4-datetimepicker";
import M from "minimatch";
Vue.prototype.$http = Axios;

Vue.use(Notifications);

export default {
  name: "app",

  metaInfo: {
    title: "Orden de Compra",
  },

  extends: VueTypeahead,

  components: {
    Multiselect,
  },
  watch: {
    'valueSelectedRequirement':function(item){
      console.log(item)
      this.tradingValue = item.price_list
      this.valueDateAgreed = item.delivery_date
      this.valueQuantityAgreed = item.quantity
    }
  },
  data() {
    return {

      //REQUERIMIENTO
      requirements: [],
      valueSelectedRequirement: "",

      //FAMILIES
      familiesData: "",


      // ORDEN
      valueQuantityAgreed: "",
      tradingValue: "",
      valueDateAgreed: "",
      valueSupplier: "",
      orderNumber: "",


      //ADVERTENCIAS
      modalWarningAmounts: false,
      modalWarningDate: false,
      textWarningDate:"",


      //PROVEEDORES
      infoSupplier: [],
      flagSupplier: false,

      //tabla
      showTable: true,

      options: {
        format: "YYYY-MM-DD HH:mm",
        // useCurrent: false
        // minDate:Date(),
      },

      //PAGINACION
      currentPage: 1,
      perPage: 50,
      totalRows: 0,
      pageOptions: [50, 100, 200],
    };
  },

  mounted() {
    this.getRequirements()

    this.getNumberPurchaseOrders()

    this.multiselectSupplier()

  },

  methods: {
    quantity() {
      this.valueQuantityAgreed = this.valueSelectedRequirement.quantity

      console.log("hola", this.valueQuantityAgreed)
    },

    isRTL() {
      return false;
    },

    resetProduct() {
      this.valueSelectedRequirement = "";
    },


    //CANTIDAD PACTADA
    resetQuantityAgreed() {
      this.valueQuantityAgreed = ""
    },


    //VALOR DE NEGOCIACIÓN
    resetTradingValue() {
      this.tradingValue = ""
    },

    //PRECIO BASE
    resetBasePrice() {
      this.valueBasePrice = ""
    },



    //INICIO ORDEN DE COMPRA
    async getNumberPurchaseOrders() {
      await infotrade.purchases([], "get-number-purchase-order").then(data => {
        if (data.data != "") {

          this.orderNumber = data.data[0].purchase_order_number

          //console.log("ORDEN DE COMPRA", data.data[0])
        }
      })

    },


    //INICIO MODALES DE VALIDACION
    openModalWarningAmounts() {

      if (this.valueSelectedRequirement == "" ||
        this.valueQuantityAgreed == "" ||
        this.tradingValue == "" ||
        this.valueDateAgreed == "" ||
        this.valueSupplier == "") {

        this.showCustom('bg-danger text-white', "Error", "¡Por favor complete todos los campos!")

      }
      else if (this.valueQuantityAgreed != this.valueSelectedRequirement.quantity) {
        console.log("CANTIDAD DIFERENTE")
        this.modalWarningAmounts = true

      } else {

        this.openModalWarningDate()

      }
    },

    closeModalWarningAmounts() {

      this.modalWarningAmounts = false

    },

    openModalWarningDate() {
      this.modalWarningAmounts = false

      let date = new Date(this.valueDateAgreed)

      if(date.getTime() < Date.now()){
        console.log("FECHA ANTIGUA")
        this.textWarningDate = "¡La fecha es mas antigua que la actual!"
        this.modalWarningDate = true
      } else {
        console.log("FECHA CORRECTA")
        this.saveOrder()
      }

    },

    closeModalWarningDate(){
      this.modalWarningDate = false
    },
        //FIN

        //GUARDAR ORDEN DE COMPRA
    async saveOrder() {
      //console.log(this.valueSelectedRequirement)
      this.modalWarningDate = false
      let info = {}

      console.log(this.valueSupplier)
      //INFORMACION DE LA ORDEN DE COMPRA
      info.requirement_id = this.valueSelectedRequirement.requirement_id
      info.product_id = this.valueSelectedRequirement.product_id
      info.date_agreed = this.valueDateAgreed
      info.quantity = this.valueQuantityAgreed
      info.trading_value = this.tradingValue
      info.supplier_nit = this.valueSupplier.nit
      info.quantity_delivered = 0
      info.total_sale = info.trading_value * info.quantity
      info.is_active = true

      console.log("iNFO", info)

      //BUFFER
      //await this.getBuffer(info)

      // console.log(info)

      await infotrade.addpurchaseorder(info).then(data => {
        if (data.status != 200) {
          this.showCustom('bg-danger text-white', "Error", "¡Error al crear la orden de compra!")

        } else {
          // console.log("enviada")
          // console.log(data)
          this.showCustom(
            "bg-success",
            "Correcto",
            "¡Orden de Compra guardada correctamente!"
          );
          // setTimeout(function(){
          //   window.location.reload()
          // },2000)
          info = {}
          this.resetInputs()
          this.getRequirements()
          this.getNumberPurchaseOrders()

        }
      })


    },

    resetInputs() {
      this.valueSelectedRequirement = ""
      this.valueQuantityAgreed = ""
      this.valueBasePrice = ""
      this.tradingValue = ""
      this.valueDateAgreed = ""
      this.valueSupplier = ""
    },

    //FIN ORDEN DE COMPRA


    //OBTENER REQUERIMIENTOS
    async getRequirements() {
      this.requirements = []

      await infotrade.getrequirementsforpurchaseorders().then(info => {

        if (info.data != "") {

          console.log(info.data)

          for (let i = 0; i < info.data.length; i++) {
            if (info.data[i].is_active == true) {
              this.requirements.push(info.data[i])
            }
          }
          //console.log(info.data)

          //console.log(this.requirements)

          //  console.log("REQUERIMIENTOS", this.requirements)


          //modificar formato de fecha de creación
          for (let i = 0; i < this.requirements.length; i++) {
            this.requirements[i].created = this.requirements[i].created.toString().substr(0, 10)
          }
        } else {
          //  console.log("entro a requerimiento vacio")
          this.requirements = []
        }

      })


      //console.log(this.requirements)



    },


    showCustom: function (classes, title, text) {
      this.$notify({
        group: "notifications-default",
        type: classes,
        title: title,
        text: text,
      });
    },


    //BUSCADOR REQUERIMIENTOS
    //items del buscador
    onHit(item) {
      //  console.log(item)
      this.itemSelectedRequirement = item;
      this.valueSelectedRequirement = item.description;

      //console.log(this.valueSelectedProduct)

    },
    requirementWithProduct({ requirement_id, product_description }) {
      return `${requirement_id} — [${product_description}]`
    },


    //PROVEEDORES
    supplierWithNit({ name, nit }) {
      return `${nit} - [${name}]`
    },


    multiselectSupplier() {
      this.block = false

      infomaster.supplier([], "0", "select").then(data => {
        if (data.data != "") {
          this.infoSupplier = data.data
          // console.log("PROVEEDORES", this.infoSupplier)
        } else {
          this.infoSupplier = []
        }
      })

    },

  },

  created() {
    // this.src = master + "productsearch/"
    //this.getFamilies()
  },
};
</script>


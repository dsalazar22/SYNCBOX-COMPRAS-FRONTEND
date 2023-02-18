<template>
  <div>
    <div>
      <notifications group="notifications-default" />
      <h4 class="font-weight-bold py-3 mb-0">Nuevo Requerimiento</h4>

      <b-btn variant="outline-primary" @click.prevent="create(); datos();"><i class="fas fa-plus"></i>&nbsp; Crear
        Requerimiento</b-btn>


    </div>
    <br>

    <!--INICIO TABLA CON LOS REQUERIMIENTOS CREADOS -->

    <div v-show="showTable" class="table-responsive">
      <h4 class="text-center font-weight-bold py-3 mb-0">Requerimientos Activos</h4>
      <b-table :striped="true" :bordered="true" tbody-class="h6 font-weight-normal" style="font-size:15px" show-empty
        hover responsive stacked="sm" :items="requirement" :fields="columnsDetails">
        <template v-slot:cell(edit)="row">
          <div class="center" slot="button-content">
            <b-btn variant="outline-success borderless icon-btn" class="btn-xs"
              @click.prevent="showModalEditRequirement(row.item)">
              <i class="ion ion-md-create"></i></b-btn>

            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
              @click.prevent="showModalDeleteRequirement(row.item)">
              <i class="ion ion-md-trash"></i></b-btn>
          </div>
        </template>
      </b-table>

      <div class="d-flex justify-content-between">
        <div>
          <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
        </div>
        <div class="text-muted">
          <small> Total: {{ this.totalRows }} </small>
        </div>
      </div>

    </div>


    <!-- FIN TABLA CON LOS REQUERIMIENTOS CREADOS -->


    <!-- INICIO FORMULARIO PARA CREAR UN NUEVO REQUERIMIENTO -->
    <div v-show="showForm" style="background-color: white">
      <br />
      <!-- <h1> Datos: {{requerimientos}}</h1> -->
      <h4 class="font-weight-bold py-3 mb-0 text-center">
        Agregar Requerimiento
      </h4>
      <h5 class="font-weight-bold py-3 mb-0 text-center">
        Requisición de compra No: {{ this.invoice() }}
        <br>
      </h5>

      <br />
      <b-row>
        <b-col style="margin-left: 18%" md="2" class="my-2">
          <h5>Producto:</h5>
        </b-col>
        <b-col md="6" style="margin-left:-3%">
          <div class="position-relative mb-3 border rounded">
            <b-input-group>
              <b-input-group-text slot="prepend" v-if="loading">
                <i class="ion ion-md-sync"></i>
              </b-input-group-text>

              <b-input-group-text slot="prepend" v-if="!loading">
                <i class="ion ion-ios-search"></i>
              </b-input-group-text>
              <input type="text" class="form-control" placeholder="Seleccione un producto" autocomplete="off"
                v-model="valueSelectedProduct" @keydown.down="down" @keydown.up="up" @keydown.enter="hit"
                @keydown.esc="reset" @blur="reset" @input="updateQueryProduct" :readonly="readProduct" />

              <b-input-group-text slot="append" v-if="isDirty || valueSelectedProduct" @click="resetProduct">
                <i class="ion ion-md-close"></i>
              </b-input-group-text>
            </b-input-group>
            <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{
              left: isRTL ? 'auto' : 0,
              right: isRTL ? 0 : 'auto',
            }">
              <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items"
                :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)" v-if="item.input">
                <span class="name" v-text="item.code"></span>
                <span class="text-muted">{{ item.description }}</span>
              </a>
            </div>
          </div>
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-col style="margin-left: 18%" md="2" class="my-2">
          <h5>Fecha sugerida:</h5>
        </b-col>
        <b-col md="6" style="margin-left: -3%">
          <b-form-datepicker today-button reset-button close-button v-model="valueSelectedDate" :config="options"
            placeholder="Seleccione la Fecha">
          </b-form-datepicker>
        </b-col>
      </b-row>
      <br />

      <b-row>
        <b-col md="2" class="my-2" style="margin-left: 18%">
          <h5>Cantidad Sugerida:</h5>
        </b-col>
        <b-col md="6" style="margin-left: -3%">
          <b-input-group>
            <b-input-group-text slot="prepend" v-if="loading">
              <i class="ion ion-md-sync"></i>
            </b-input-group-text>

            <b-input-group-text slot="prepend" v-if="!loading">
              <i class="ion ion-ios-filing"></i>
            </b-input-group-text>
            <input type="number" class="form-control" placeholder="Ingrese la cantidad" autocomplete="off"
              v-model="valueAmount" @keydown.down="down" @keydown.up="up" @keydown.enter="hit" @keydown.esc="reset"
              @blur="reset" />
            <b-input-group-text slot="append" v-if="isDirty || valueAmount" @click="resetAmount">
              <i class="ion ion-md-close"></i>
            </b-input-group-text>
          </b-input-group>
        </b-col>
      </b-row>

      <br />
      <b-row>
        <b-col class="text-center">
          <b-btn size="sm" variant="outline-danger" @click="cerrar();"><i class="fas fa-trash-alt"></i>&nbsp;Cerrar
            Requerimiento</b-btn>
          <b-btn size="sm" variant="outline-primary" @click="
  saveRequirement();
          "><i class="fas fa-plus"></i>&nbsp; Crear Requerimiento</b-btn>
        </b-col>
      </b-row>

      <br />

    </div>

    <div id="Table" v-show="showTable2">

      <h4 class="text-center mt-3 font-weight-bold py-3 mb-0">Requerimientos Activos</h4>
      <b-table small tbody-class="h6 font-weight-normal " style="font-size:15px" show-empty hover responsive
        stacked="sm" :items="requirement" :fields="columnsDetails">
        <template v-slot:cell(edit)="row">
          <div class="center">
            <b-btn variant="outline-success borderless icon-btn" size="xs"
              @click.prevent="showModalEditRequirement(row.item)">
              <i class="ion ion-md-create"></i></b-btn>

            <b-btn variant="outline-danger borderless icon-btn" size="xs"
              @click.prevent="showModalDeleteRequirement(row.item)">
              <i class="ion ion-md-close"></i></b-btn>
          </div>
        </template>
      </b-table>

      <div class="d-flex justify-content-between">
        <div>
          <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
        </div>
        <div class="text-muted">
          <small> Total: {{ this.totalRows }} </small>
        </div>
      </div>

    </div>

    <!-- FIN FORMULARIO PARA CREAR NUEVO REQUERIMIENTO -->


    <!-- MODAL ELIMINAR REQUERIMIENTO -->
    <b-modal v-model="modalDeleteRequirement" class="modal-center">
      <div slot="modal-title">
        <span>Eliminar Requerimiento Numero : {{ this.requirementToDelete.requirement_id }}</span>

      </div>

      <div>
        <h3>Informacion del requerimiento:</h3>
        <br>
        <div class="input-group mb-3">
          <h5>Estado: </h5>
          <span style="padding-left:2px; margin-top: -0.2%;">{{ this.requirementToDelete.is_active }}</span>
        </div>

        <div class="input-group mb-3">
          <h5>Codigo del producto: </h5>
          <span style="padding-left:2px; margin-top: -0.1%;">{{ this.requirementToDelete.product_code }}</span>
        </div>

        <div class="input-group mb-3">
          <h5>Descripción del producto: </h5>
          <span style="padding-left:2px; margin-top: -0.1%;">{{ this.requirementToDelete.product_description }}</span>
        </div>

        <div class="input-group mb-3">
          <h5>Fecha de creación: </h5>
          <span style="padding-left:2px; margin-top: -0.2%;">{{ this.requirementToDelete.created }}</span>
        </div>

        <div class="input-group mb-3">
          <h5>Fecha sugerida: </h5>
          <span style="padding-left:2px; margin-top: -0.2%;">{{ this.requirementToDelete.delivery_date }}</span>
        </div>

        <div class="input-group mb-3">
          <h5>Cantidad: </h5>
          <span style="padding-left:2px; margin-top: -0.2%;">{{ this.requirementToDelete.quantity }}</span>
        </div>


      </div>

      <template #modal-footer>
        <b-button class="btn btn-secondary" @click.prevent="closeModalDeleteRequirement()">Cancelar</b-button>
        <b-button class="btn btn-danger" @click.prevent="deleteRequirement()">Eliminar</b-button>
      </template>
    </b-modal>


    <!-- INICIO MODAL EDITAR REQUEIMIENTO -->

    <b-modal v-model="modalEditRequirement" class="modal-center" size="lg">
      <div slot="modal-title">
        <span>Editar Requerimiento Numero: {{ this.requirementToEdit.requirement_id }}</span>
      </div>
      <div>
        <h3>Informacion del requerimiento</h3>
        <br>



        <b-input-group class="mx-5 mb-1">
          <h5>Codigo del producto: </h5>
          <span style="padding-left:2px; margin-top: -0.1%;">{{ this.requirementToEdit.product_code }}</span>
        </b-input-group>



        <b-input-group class=" mx-5 mb-1">
          <h5>Descripción del producto: </h5>
          <span style="padding-left:2px; margin-top: -0.1%;">{{ this.requirementToEdit.product_description }}</span>
        </b-input-group>


        <b-input-group class=" mx-5">
          <h5>Fecha de creación: </h5>
          <span style="padding-left:2px; margin-top: -0.2%;">{{ this.requirementToEdit.created }}</span>
        </b-input-group>

        <h4 style="margin-top:1%">Editar:</h4>

        <b-input-group class="mt-4 mx-5">
          <h5 style="margin-top:1%">Fecha sugerida: </h5>
          <b-form-datepicker class="col-sm-8" today-button reset-button close-button
            style="margin-left:5%; margin-top: -0.1%;" v-model="editDeliveryDate" :config="options"
            placeholder="Seleccione la nueva fecha...">
          </b-form-datepicker>
        </b-input-group>

        <b-input-group class="mt-4 mx-5">
          <h5>Cantidad sugerida: </h5>
          <input type="number" class="form-control col-sm-8"
            style="margin-left:2%;margin-top:-1.7%; height:5vh; width: 40.5vh;"
            placeholder="Ingrese la nueva cantidad..." v-model="editQuantity">
        </b-input-group>

        <div class="input-group mt-4 mx-5">
          <h5>Estado: </h5>
          <b-dropdown style="margin-left: 13%;" variant="primary" id="dropdown-1" text="Seleccione una opción">
            <b-dropdown-item v-for="option in optionsStaus" :key="option.value" @click="editStatus = option.text">{{
              option.text
            }}</b-dropdown-item>
          </b-dropdown>
          <h5 class="ml-2">Opción Seleccionada:</h5>
          <span class="ml-2">{{ editStatus }}</span>
        </div>
        <br>
        <span class="ml-4 font-weight-bold" style="color:red">¡Advertencia, si cambias el estado a "Inactivo" el
          requerimiento sera eliminado de la lista de disponibles!</span>

      </div>

      <template #modal-footer>
        <b-button class="btn btn-danger" @click.prevent="closeModalEditRequirement()">Cancelar</b-button>
        <b-button class="btn btn-primary" @click.prevent="editRequirement()">Editar</b-button>
      </template>
    </b-modal>

    <!-- FIN MODAL EDITAR REQUERIMIENTO -->

  </div>





</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss">

</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css">

</style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss">

</style>

<script>
import { GetActiveProducts } from "@/vendor/sbx/sbx/product";
import Axios from "axios";
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
Vue.prototype.$http = Axios;

Vue.use(Notifications);
export default {
  name: "app",

  extends: VueTypeahead,

  metaInfo: {
    title: "Nuevo Requerimiento",
  },

  components: {
    Multiselect
  },
  data() {
    return {
      //BUSCADOR
      readProduct: false,
      readSupplier: true,
      itemSelectedProduct: {},
      link: "productsearch/",

      valueAmount: "",

      //div formulario
      showForm: false,

      //fecha
      valueSelectedDate: "",

      //productos
      tableData: {},
      requirement: [],
      totalRowsProducts: 0,
      valueSelectedProduct: "",

      //# de requerimiento
      factura: "",
      numberFactura: "",
      id_requirement: "####",

      //tabla  
      showTable2: false,
      showTable: true,
      columnsDetails: [
        { key: "requirement_id", sortable: true, label: "Id Requerimiento" },
        { key: "product_id", sortable: true, label: "Id Producto" },
        { key: "product_code", label: "Codigo Producto" },
        { key: "product_description", label: "Descripcion Producto" },
        { key: "delivery_date", label: "Fecha Sugerida" },
        { key: "quantity", sortable: true, label: "Cantidad Sugerida" },
        { key: "created", sortable: true, label: "Fecha de Creación" },
        { key: "is_active", sortable: true, label: "Estado" },
        { key: "edit", label: "Acciones" }
      ],

      options: {
        format: "YYYY-MM-DD",
        // useCurrent: false
        // minDate:Date(),
      },

      //MODAL EDITAR REQUERIMIENTO
      modalEditRequirement: false,
      requirementToEdit: "",
      editDeliveryDate: "",
      editQuantity: "",
      editStatus: "Activo",
      optionsStaus: [
        { text: "Inactivo", value: 1 },
        { text: "Activo", value: 2 },
      ],

      //MODAL ELIMINAR REQUERIMIENTO
      modalDeleteRequirement: false,
      requirementToDelete: "",

      //PAGINACION
      currentPage: 1,
      perPage: 50,
      totalRows: 0,
      pageOptions: [50, 100, 200],
    };
  },

  mounted() {
    this.getRequirements()
  },

  methods: {
    isRTL() {
      return false;
    },
    create() {
      this.showForm = true;
      this.showTable = false;
      this.showTable2 = true;
    },


    cerrar() {
      this.showForm = false;
      this.showTable = true;
      this.showTable2 = false;
      //this.requeriment = []
      this.resetInput()

    },


    //borrar inputs
    resetInput() {
      // this.tableData = {}
      this.valueAmount = ""
      this.valueSelectedDate = ""
      this.valueSelectedProduct = ""
    },



    //alertas
    showCustom: function (classes, title, text) {
      this.$notify({
        group: "notifications-default",
        type: classes,
        title: title,
        text: text,
      });
    },

    //# requerimiento
    invoice() {
      let res = "";

      if (this.factura >= 1000) {
        res = "" + this.factura;
      }
      if (this.factura >= 100) {
        res = "0" + this.factura;
      }
      if (this.factura >= 10) {
        res = "00" + this.factura;
      }
      if (this.factura >= 1) {
        res = "000" + this.factura;
      }

      if (this.factura == "####") {
        res = "####"
      }


      return res;
    },
    updateQuerySupplier() {
      this.query = this.valueSelectedSupplier;
      //console.log(this.query);
      this.update();
    },

    updateQueryProduct() {
      this.query = this.valueSelectedProduct;
      //console.log(this.query);
      this.update();
    },


    //items del buscador
    onHit(item) {
      //console.log(item)
      this.itemSelectedProduct = item;
      this.valueSelectedProduct = item.description

      //console.log(this.valueSelectedProduct)

    },

    //guardar el requerimiento
    saveRequirement() {

      if (this.valueSelectedProduct != ""
        && this.valueSelectedDate != ""
        && this.valueAmount != "") {

        //this.options.minDate  = Date.now()
        //var delivery_date = Date.now();

        this.tableData["product_id"] = this.itemSelectedProduct.product_id
        this.tableData["product_description"] = this.itemSelectedProduct.description
        this.tableData["product_code"] = this.itemSelectedProduct.code
        //this.tableData["delivery_date"] = this.valueSelectedDate
        this.tableData["quantity"] = this.valueAmount
        this.tableData["delivery_date"] = this.valueSelectedDate
        //this.requeriment.push(this.tableData)

        // delete this.requirement.description


        //console.log("r")
        //console.log(this.requeriment)
        this.resetInput()

        this.sendRequirement()

      } else {
        this.showCustom(
          "bg-danger",
          "Error",
          "¡La informacion esta incompleta, por favor valide!"
        );
      }

    },


    //enviar el requerimiento a la bd
    async sendRequirement() {

      if (this.tableData.length != 0) {
        //console.log("Requerimientos:")
        //this.factura += 1
        // const json2 = JSON.stringify(this.requeriment)
        let info = {}
        info.requirement_id = 3
        info.product_id = this.tableData.product_id
        info.product_code = this.tableData.product_code
        info.product_description = this.tableData.product_description
        info.delivery_date = this.tableData.delivery_date
        info.quantity = this.tableData.quantity

        //console.log(info)

        await infotrade.addrequirements(info).then(data => {

          if (data.status != 200) {
            this.showCustom('bg-danger text-white', "Error", "¡Error al Crear el Registro!")

          } else {
            //console.log("enviada")
            console.log(data)
            this.showCustom(
              "bg-success",
              "Correcto",
              "¡Requerimiento guardado correctamente!"
            );
            // setTimeout(function(){
            //   window.location.reload()
            // },2000)
            this.getRequirements()
            this.tableData = {}
          }
        })



      } else {
        this.showCustom(
          "bg-danger",
          "Error",
          "¡Requerimiento vacio!"
        );
      }

    },

    //MODAL EDITAR REQUERIMIENTO 
    showModalEditRequirement(item) {
      //console.log("Editar Requerimiento ", item)

      this.modalEditRequirement = true

      this.requirementToEdit = item

      this.editQuantity = this.requirementToEdit.quantity

      this.editDeliveryDate = this.requirementToEdit.delivery_date



    },

    closeModalEditRequirement() {
      this.modalEditRequirement = false

    },

    //Editar requerimiento
    async editRequirement() {
      let infor = {}
      let flag = false

      let quantity = this.requirementToEdit.quantity
      let delivery_date = this.requirementToEdit.delivery_date

      //console.log("entro al editar")

      infor.requirement_id = this.requirementToEdit.requirement_id

      if (this.editStatus == "Inactivo") {
        infor.delivery_date = delivery_date
        infor.quantity = quantity
        infor.is_active = false
        flag = true
      } else if (
        (this.editDeliveryDate == "" && this.editQuantity == "") ||
        (this.editDeliveryDate == delivery_date && this.editQuantity == quantity) ||
        (this.editDeliveryDate == "" && this.editQuantity == quantity) ||
        (this.editDeliveryDate == delivery_date && this.editQuantity == "")
      ) {
        this.showCustom(
          "bg-danger",
          "Error",
          "¡Por favor ingrese un valor nuevo para poder que sea actualizado!"
        );
      } else if (this.editDeliveryDate == "" || this.editDeliveryDate == delivery_date) {
        //console.log("b")
        infor.delivery_date = delivery_date
        infor.quantity = this.editQuantity
        infor.is_active = true
        flag = true
      } else if (this.editQuantity == "" || this.editQuantity == quantity) {
        //console.log("c")
        infor.delivery_date = this.editDeliveryDate
        infor.quantity = quantity
        infor.is_active = true
        flag = true
      } else {
        //console.log("a")
        infor.delivery_date = this.editDeliveryDate
        infor.quantity = this.editQuantity
        infor.is_active = true
        flag = true
      }


      if (flag) {
        //console.log(infor)
        await infotrade.editrequirement(infor).then(data => {
          // console.log("enviada")
          // console.log(data)

          if (data.status != 200) {
            this.showCustom('bg-danger text-white', "Error", "¡Error al editar el requerimiento!")

          } else {
            this.showCustom(
              "bg-success",
              "Correcto",
              "¡Requerimiento editado correctamente!"
            );
          }

          infor = {}
          this.editDeliveryDate = ""
          this.editQuantity = ""
          this.requirementToEdit = ""
          this.closeModalEditRequirement()
          this.getRequirements()

        })
      }

    },


    // MODAL ELIMINAR REQUERIMIENTO
    showModalDeleteRequirement(item) {
      //console.log(item)

      this.modalDeleteRequirement = true

      this.requirementToDelete = item


      // this.requirementToDelete.created = this.requirementToDelete.created.toString().substr(0,10)
    },

    closeModalDeleteRequirement() {
      this.modalDeleteRequirement = false
    },

    //Eliminar requerimiento
    async deleteRequirement() {

      let infor = {}
      //console.log("entro")
      infor.requirement_id = this.requirementToDelete.requirement_id

      await infotrade.deleterequirement(infor).then(data => {
        // console.log("enviada")
        //  console.log(data)
        if (data.status != 200) {
          this.showCustom('bg-danger text-white', "Error", "¡Error al eliminar el requerimiento!")

        } else {
          this.showCustom(
            "bg-success",
            "Correcto",
            "¡Requerimiento eliminado correctamente!"
          );
          // setTimeout(function(){
          //   window.location.reload()
          // },2000)

        }

        this.requirementToDelete = ""
        this.getRequirements()
        this.closeModalDeleteRequirement()
      })



    },

    //resetear el input de producto
    resetProduct() {
      this.valueSelectedProduct = "";
    },

    //resetear el input de cantidad
    resetAmount() {
      this.valueAmount = ""
    },

    //traer los datos
    datos() {
      this.src = master + this.link;
    },


    //OBTENER REQUERIMIENTOS
    getRequirements() {

      this.requirement = []
      //console.log("entro a obtener requerimientos")

      infotrade.getrequirements().then(datosr => {

        console.log(datosr.data)

        if (datosr.data != "") {
          this.requirement = datosr.data

          this.requirement.sort(function (a, b) {
            return a.requirement_id - b.requirement_id;
          });

          // console.log("Requerimientos")
          // console.log(this.requirement)

          for (let i = 0; i < this.requirement.length; i++) {
            this.requirement[i].created = this.requirement[i].created.toString().substr(0, 10)
            this.requirement[i].is_active = "Activo"
          }
          
          infotrade.requirements([], "get-number-requirement").then(data => {
            //console.log(data.data)
            this.factura = data.data[0].requirement_number
          })
        
          this.totalRows = this.requirement.length
          // console.log(this.factura)
        } else {
          //console.log("Entro al requerimiento vacio")
          this.requirement = []
          this.totalRows = 0
          this.factura = "####"
        }


      })


    },


  },

  created() {
    // this.src = master + "productsearch/";
  },
};
</script>

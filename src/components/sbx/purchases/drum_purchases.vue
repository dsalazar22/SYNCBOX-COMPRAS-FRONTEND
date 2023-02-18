<template>
    <div>
        <notifications group="notifications-default" />
        <div v-show="showDrumPurchases">

            <h4 class="font-weight-bold py-3 mb-0">Tambor de Compras</h4>

            <div class="row">
                <div class="col">

                    <b-row>
                        <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->

                        <b-col md="5" class="my-1">
                            <b-input-group>
                                <b-form-input v-model="filter" placeholder="Buscar..." />
                                <b-input-group-append>
                                    <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete"></span>
                                    </b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </b-col>
                        <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->

                        <!-- ESTE ES EL PAGINADOR -->
                        <b-col md="4" class="my-1">
                            <b-form-select :options="pageOptions" v-model="perPage" />
                        </b-col>
                        <!-- ESTE ES EL PAGINADOR -->




                    </b-row>
                </div>
            </div>

            <div class="table-responsive">
                <!-- TABLA ORDEN DE COMPRA -->
                <b-table tbody-class="h6 font-weight-normal" @filtered="onFiltered" responsive :items="cptItems"
                    :fields="columnsPurchaseOrder" :current-page="currentPage" :per-page="perPage"
                    :no-border-collapse="false" style="font-size:12px; margin-top: 1%;" :striped="true" :bordered="true"
                    :filter="filter">


                    <template v-slot:cell(edit)="row">
                        <b-dropdown variant="default btn-xs icon-btn md-btn-flat hide-arrow">
                            <template slot="button-content"><i class="ion ion-ios-settings"></i></template>

                            <b-dropdown-item @click="showNewDelivery(row.item)">Reportar Nueva Entrega</b-dropdown-item>
                            <b-dropdown-item @click="showCompletePurchaseOrder(row.item)">Finalizar Orden de
                                Compra</b-dropdown-item>
                            <b-dropdown-item @click="openChangeDeliveryDate(row.item)">Modificar Fecha de
                                Compromiso</b-dropdown-item>
                        </b-dropdown>
                    </template>


                </b-table>
            </div>
            <!-- TABLA ORDEN DE COMPRA -->

            <!-- PAGINACIÓN E INFORMACION -->

            <div class="d-flex justify-content-between">
                <div>
                    <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                </div>
                <div class="w-25">
                    <small class="text-muted"> Total Ordenes de Compras: {{ totalRows }} </small>
                    <div class="small">
                        Buffer Compras <div class="float-right"> {{ cntWarning }} de {{ totalRows }}
                            ({{ Math.round((cntWarning / totalRows) * 100) }}%)</div>
                    </div>
                    <div class="progress mb-1" style="height: 4px;">
                        <div :class="{ 'progress-bar': true, 'bg-warning': true }"
                            :style="{ width: String((cntWarning / totalRows) * 100) + '%' }"></div>
                    </div>
                    <div class="small">
                        Buffer Compras <div class="float-right"> {{ cntSuccess }} de {{ totalRows }}
                            ({{ Math.round((cntSuccess / totalRows) * 100) }}%)</div>
                    </div>
                    <div class="progress mb-1" style="height: 4px;">
                        <div :class="{ 'progress-bar': true, 'bg-success': true }"
                            :style="{ width: String((cntSuccess / totalRows) * 100) + '%' }"></div>
                    </div>
                    <div class="small">
                        Buffer Compras <div class="float-right"> {{ cntInfo }} de {{ totalRows }}
                            ({{ Math.round((cntInfo / totalRows) * 100) }}%)</div>
                    </div>
                    <div class="progress mb-1" style="height: 4px;">
                        <div :class="{ 'progress-bar': true, 'bg-info': true }"
                            :style="{ width: String((cntInfo / totalRows) * 100) + '%' }"></div>
                    </div>
                </div>
            </div>

            <!--FINAL PAGINACIÓN E INFORMACION -->

        </div>

        <!--REPORTAR NUEVA ENTREGA-->
        <div v-show="showNewDeliveryInterface">
            <h4 class="font-weight-bold py-3">Reportar Entrega</h4>
            <div style="background-color:white">
                <div class="mx-2">
                    <h4 class="py-1">Informacion:</h4>

                    <h5>Orden de Compra Numero:
                        <span id="span">{{ purchaseSelected.purchases_id }}</span>
                    </h5>
                </div>

                <div class="row py-2">
                    <div class="col mx-2">
                        <h5>
                            Producto:
                        </h5>

                        <h5>
                            Fecha de Compromiso
                            <span id="span">{{ purchaseSelected.requested_date }}</span>
                        </h5>

                        <h5>Descripcion del Producto:
                            <span id="span">{{ purchaseSelected.product_description }}</span>
                        </h5>

                        <h5>
                            Codigo del Producto:
                            <span id="span"> {{ purchaseSelected.product_code }}</span>
                        </h5>

                    </div>

                    <div class="col">

                        <h5>Cantidades:</h5>

                        <h5>
                            Cantidad Pedida:
                            <span id="span"> {{ purchaseSelected.requested_amount }}</span>
                        </h5>

                        <h5>
                            Cantidad Entregada:
                            <span id="span"> {{ purchaseSelected.delivered_quantity }}</span>
                        </h5>

                        <h5>
                            Cantidad Pendiente:
                            <span id="span"> {{ purchaseSelected.pending_amount }}</span>
                        </h5>
                    </div>

                </div>


            </div>

            <br>

            <div style="background-color:white" class="mb-4">
                <h4 class="font-weight-bold py-3 mx-2">
                    Agregar Cantidad:
                </h4>
                <div class="mx-2">
                    <h5>Por favor ingrese la cantidad de producto que se entregó</h5>

                    <div class="input-group">
                        <i class="input-group-text ion ion-ios-basket"></i>
                        <input type="number" class="form-control" v-model="newQuantityDelivered" placeholder="Ej: 100">
                        <i class="input-group-text ion ion-md-close" v-if="(newQuantityDelivered)"
                            @click="resetNewQuantityDelivered"></i>
                    </div>

                    <br>
                    <h5>Por favor ingrese el precio </h5>

                    <div class="input-group">
                        <i class="input-group-text ion ion-ios-cash"></i>
                        <input type="number" class="form-control" v-model="newPrice" placeholder="Ej: 100000">
                        <i class="input-group-text ion ion-md-close" v-if="(newPrice)" @click="resetNewPrice"></i>
                    </div>

                </div>

                <br>
            </div>

            <div class="text-center mb-4">

                <button class="btn btn-danger" @click="hideNewDelivery()">
                    volver
                </button>
                <button class="btn btn-primary" @click="newDelivery()">
                    Confirmar
                </button>

            </div>

            <div style="background-color:white">
                <b-table tbody-class="h6 font-weight-normal" :fields="columnsDeliveryReports" :items="deliveryReports"
                    hover :striped="true" :bordered="true">

                </b-table>
            </div>

            <!-- INCIO MODAL PARA TERMINAR UNA ORDEN DE COMPRA DESPUES DE UNA ENTREGA -->
            <b-modal v-model="showModalCompletePurchaseOrder">
                <template #modal-title>
                    <h4>Terminar Orden de Compra</h4>
                </template>

                <div class="text-center">
                    <h5>{{ informativeText }}</h5>

                    <h5>¿Quieres Finalizar la orden de compra numero: {{ purchaseSelected.purchases_id }}?
                    </h5>
                </div>

                <template #modal-footer>
                    <button class="btn btn-danger" @click="closeModalCompletePurchaseOrder()">
                        Volver
                    </button>
                    <button class="btn btn-primary" @click="completePurchaseOrder()">
                        Confirmar
                    </button>
                </template>
            </b-modal>
            <!-- FIN MODAL PARA TERMINAR UNA ORDEN DE COMPRA DESPUES DE UNA ENTREGA -->

        </div>

        <!--FIN REPORTAR NUEVA ENTREGA -->


        <!-- INICIO TERMINAR ORDEN DE COMPRA DESDE LA TABLA DEL TAMBOR DE COMPRAS-->
        <div v-show="showCompletePurchaseOrderInterface">
            <h4 class="font-weight-bold py-3">Finalizar Orden de Compra</h4>
            <div style="background-color:white">
                <div class="mx-2">
                    <h4 class="mb-4 py-1">Información:</h4>
                    <h5>Orden de compra Numero: {{ purchaseSelected.purchases_id }}</h5>

                </div>
                <div class="row py-2">
                    <div class="col mx-2">
                        <h5>
                            Producto:
                        </h5>

                        <h5>
                            Buffer:
                            <span id="span"> {{ purchaseSelected.visible_buffer }}</span>
                        </h5>

                        <h5>
                            Fecha de Compromiso
                            <span id="span">{{ purchaseSelected.requested_date }}</span>
                        </h5>

                        <h5>Descripcion del Producto:
                            <span id="span">{{ purchaseSelected.product_description }}</span>
                        </h5>

                        <h5>
                            Codigo del Producto:
                            <span id="span"> {{ purchaseSelected.product_code }}</span>
                        </h5>

                    </div>

                    <div class="col">

                        <h5>Cantidades:</h5>

                        <h5>
                            Cantidad Pedida:
                            <span id="span"> {{ purchaseSelected.requested_amount }}</span>
                        </h5>

                        <h5>
                            Cantidad Entregada:
                            <span id="span"> {{ purchaseSelected.delivered_quantity }}</span>
                        </h5>

                        <h5>
                            Cantidad Pendiente:
                            <span id="span"> {{ purchaseSelected.pending_amount }}</span>
                        </h5>
                    </div>

                </div>


            </div>
            <br>

            <div class="text-center">

                <button class="btn btn-danger" @click="hideCompletePurchaseOrder()">
                    volver
                </button>
                <button class="btn btn-primary" @click="openModalConfirmCompletePurchase()">
                    Confirmar
                </button>

            </div>

            <b-modal v-model="showModalConfirm">
                <template #modal-title>
                    <h4>Terminar Orden de Compra</h4>
                </template>

                <div class="text-center">

                    <h5>¿Seguro quieres Finalizar la orden de compra numero: {{
                        purchaseSelected.purchases_id
                    }}?</h5>
                </div>

                <template #modal-footer>
                    <button class="btn btn-danger" @click="closeModalConfirmCompletePurchase()">
                        Cerrar
                    </button>
                    <button class="btn btn-primary" @click="completePurchaseOrder()">
                        Confirmar
                    </button>
                </template>
            </b-modal>


        </div>
        <!-- FIN FINALIZAR ORDEN DE COMPRA DESDE LA TABLA DEL TAMBOR DE COMPRAS-->

        <!-- INICIO MODIFICAR FECHA DE ENTREGA -->
        <div v-show="showChangeDeliveryDate">
            <h4 class="font-weight-bold py-3">Modificar Fecha de Compromiso </h4>
            <div style="background-color:white">
                <div class="mx-2">
                    <h4 class="mb-4 py-1">Información:</h4>
                    <h5>Orden de compra Numero: {{ purchaseSelected.purchases_id }}</h5>

                </div>
                <div class="row py-2">
                    <div class="col mx-2">
                        <h5>
                            Producto:
                        </h5>

                        <h5>
                            Buffer:
                            <span id="span"> {{ purchaseSelected.visible_buffer }}</span>
                        </h5>

                        <h5>
                            Fecha de Compromiso
                            <span id="span">{{ purchaseSelected.requested_date }}</span>
                        </h5>

                        <h5>Descripcion del Producto:
                            <span id="span">{{ purchaseSelected.product_description }}</span>
                        </h5>

                        <h5>
                            Codigo del Producto:
                            <span id="span"> {{ purchaseSelected.product_code }}</span>
                        </h5>

                    </div>

                    <div class="col">

                        <h5>Cantidades:</h5>

                        <h5>
                            Cantidad Pedida:
                            <span id="span"> {{ purchaseSelected.requested_amount }}</span>
                        </h5>

                        <h5>
                            Cantidad Entregada:
                            <span id="span"> {{ purchaseSelected.delivered_quantity }}</span>
                        </h5>

                        <h5>
                            Cantidad Pendiente:
                            <span id="span"> {{ purchaseSelected.pending_amount }}</span>
                        </h5>
                    </div>

                </div>
            </div>

            <div class="mt-4" style="background-color:white">
                <div class="p-2 pb-3">
                    <h5>Por favor seleccione la nueva fecha de compromiso</h5>
                    <b-form-datepicker today-button reset-button close-button v-model="newDeliveryDate"
                        :config="options" placeholder="Seleccione la Fecha">
                    </b-form-datepicker>
                </div>

            </div>

            <div class="text-center mt-4">

                <button class="btn btn-danger" @click="closeChangeDeliveryDate()">
                    volver
                </button>
                <button class="btn btn-primary" @click="changeDeliveryDate()">
                    Confirmar
                </button>

            </div>
        </div>
        <!-- FIN MODIFICAR FECHA DE ENTREGA -->
    </div>



</template>



<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss">

</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css" >

</style>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss">

</style>


<script>
import { infoinventory } from "@/components/i40/js/inventory";
import { infotrade } from "@/components/i40/js/trade";
import Notifications from "vue-notification";
import Multiselect from 'vue-multiselect'
import VueMarkdown from 'vue-markdown'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import { infousers } from '@/components/i40/js/users'
import { infosysconfig } from "@/components/i40/js/sysconfig";
import datePicker from 'vue-bootstrap-datetimepicker';
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
import Vue from "vue";
import Axios from "axios";
Vue.prototype.$http = Axios;

Vue.use(Notifications);



export default {
    metaInfo: {
        title: 'Tambor de Compras'
    },

    components: {
        datePicker,
        VueMarkdown,
        SweetModal,
        Multiselect
    },

    watch: {
        'showChangeDeliveryDate': function (item) {
            item = this.purchaseSelected
            console.log("ITEM", item)
            this.newDeliveryDate = item.requested_date
        }
    },

    data() {
        return {
            windowHeight: 0,
            showDrumPurchases: true,

            //CONTADORES DE BUFFER
            cntBlack: 0,
            cntDanger: 0,
            cntWarning: 0,
            cntSuccess: 0,
            cntInfo: 0,

            //MODIFICAR FECHA DE ENTREGA
            showChangeDeliveryDate: false,
            newDeliveryDate: "",

            //TERMINAR ORDEN DE COMPRA
            showCompletePurchaseOrderInterface: false,
            showModalConfirm: false,

            //REPORTE NUEVA ENTREGA
            showNewDeliveryInterface: false,
            purchaseSelected: "",
            newQuantityDelivered: "",
            newPrice: "",
            showModalCompletePurchaseOrder: false,
            informativeText: "",

            //INFORMES DE RECEPCION DE ENTREGAS
            deliveryReports: [],
            columnsDeliveryReports: [
                { key: 'date_creation', sortable: true, label: "Fecha de Creación" },
                { key: 'delivered_amount', sortable: true, label: "Cantidad Entregada" },
                { key: 'price', sortable: true, label: "Precio" }
            ],

            //ORDENES DE COMPRA
            //purchaseOrders: [],
            purchaseOrdersActives: [],

            columnsPurchaseOrder: [
                { key: 'consumed_buffer', sortable: true, label: "Buffer" },
                { key: 'edit', sortable: true, label: "Acción" },
                { key: 'purchases_id', sortable: true, label: "Orden de Compra" },
                { key: 'product_code', sortable: true, label: "Codigo Producto" },
                { key: 'product_description', sortable: true, label: "Descripcion" },
                { key: 'requested_amount', sortable: true, label: "Cantidad Pedida" },
                { key: 'delivered_quantity', sortable: true, label: "Cantidad Entregada" },
                { key: 'pending_amount', sortable: true, label: "Cantidad Pendiente" },
                { key: 'order_created', sortable: true, label: "Fecha Ingreso" },
                { key: 'requested_date', sortable: true, label: "Fecha Compromiso" },
                { key: 'sale_price', sortable: true, label: "Precio Venta" },

            ],

            //Info de filtro y paginas para la tabla
            currentPage: 1,
            perPage: 50,
            totalRowsActives: 0,
            totalRowsDisabled: 0,
            totalRows: 0,
            pageOptions: [50, 100, 200],
            filter: null,

            options: {
                format: "YYYY-MM-DD HH:mm",
                // useCurrent: false
                // minDate:Date(),
            },
        }
    },

    computed: {
        cptItems() {
            return this.purchaseOrdersActives.map((item) => {
                let tmp = item;
                let color = ''

                if (tmp.consumed_buffer > 100) {
                    color = 'dark'
                }
                else if (tmp.consumed_buffer <= 100 && tmp.consumed_buffer > 66) {
                    color = 'danger'
                }
                else if (tmp.consumed_buffer <= 66 && tmp.consumed_buffer > 33) {
                    color = 'warning'
                }
                else if (tmp.consumed_buffer <= 33 && tmp.consumed_buffer >= 0) {
                    color = 'success'
                } else {
                    color = 'info'
                }

                tmp.consumed_buffer += "%"
                tmp._cellVariants = { consumed_buffer: color };
                return tmp;
            })
        }
    },

    mounted() {
        this.getPurchasesOrders()

        this.increaseBuffer()


    },
    methods: {
        //-------------------------------------------------------------------------------------
        //INICIO MODIFICAR FECHA DE ENTREGA
        //ABRIR INTERFAZ
        openChangeDeliveryDate(item) {
            this.showDrumPurchases = false
            this.showChangeDeliveryDate = true

            this.purchaseSelected = item
            console.log(this.purchaseSelected)
        },
        //CERRAR INTERFAZ
        closeChangeDeliveryDate() {
            this.showChangeDeliveryDate = false

            this.showDrumPurchases = true
        },

        async changeDeliveryDate() {
            let info = {}
            if (this.newDeliveryDate != "") {

                if (this.newDeliveryDate == this.purchaseSelected.requested_date) {

                    this.showCustom('bg-danger text-white', "Error", "¡Elija una nueva fecha de compromiso!")

                } else {

                    info.purchases_id = this.purchaseSelected.purchases_id
                    info.new_delivery_date = this.newDeliveryDate
                    await infotrade.purchases(info, "change-delivery-date").then(data => {
                        if (data.status != 200) {
                            this.showCustom('bg-danger text-white', "Error", "¡Error al modificar la fecha de compromiso!")
                        } else {
                            this.showCustom('bg-success text-white', "EXITO", "¡La fecha de compromiso se modificó!")
                            this.purchaseSelected.requested_date = info.new_delivery_date
                        }
                    })

                }

            } else {

                this.showCustom('bg-danger text-white', "Error", "¡Por favor elija la nueva fecha de compromiso!")

            }


        },
        //FIN MODIFICAR FECHA DE ENTREGA
        //-------------------------------------------------------------------------------------

        //-------------------------------------------------------------------------------------
        //INICIO TERMINAR ORDEN DE COMPRA DESDE LA TABLA DE TAMBOR DE COMPRAS
        showCompletePurchaseOrder(item) {
            //MOSTRAR PANTALLA Y ESCONDER TAMBOR
            this.showCompletePurchaseOrderInterface = true
            this.showDrumPurchases = false

            this.purchaseSelected = item

        },

        hideCompletePurchaseOrder() {
            //OCULTAR PANTALLA Y MOSTRAR TAMBOR
            this.showCompletePurchaseOrderInterface = false
            this.showDrumPurchases = true

            //REINICIAR ORDEN SELECCIONADA
            this.purchaseSelected = ""
        },

        //ABRIR MODAL DE CONFIRMACION FINALIZAR COMPRA
        openModalConfirmCompletePurchase() {
            this.showModalConfirm = true
        },
        //CERRAR MODAL DE CONFIRMACION FINALIZAR COMPRA
        closeModalConfirmCompletePurchase() {
            this.showModalConfirm = false
        },

        //FINALIZAR ORDEN DE COMPRA
        async completePurchaseOrder() {
            let info = {}

            info.purchase_id = this.purchaseSelected.purchases_id

            await infotrade.purchases(info, "close-purchase-order").then(data => {
                if (data.status != 200) {
                    this.showCustom('bg-danger text-white', "Error", "¡Error al guardar el terminar la orden de compra!")
                } else {
                    this.getPurchasesOrders()
                    this.closeModalConfirmCompletePurchase()
                    this.hideCompletePurchaseOrder()

                    //CERRAR MODAL E INTERFAZ DE REPORTAR NUEVA ENTREGA
                    this.showModalCompletePurchaseOrder = false
                    this.showNewDeliveryInterface = false

                    this.showCustom('bg-success text-white', "Terminada", "¡Orden de compra terminada!")
                }
            })




        },
        //FIN TERMINAR ORDEN DE COMPRA DESDE LA TABLA DE TAMBOR DE COMPRAS
        //-------------------------------------------------------------------------------------


        //-------------------------------------------------------------------------------------
        //INICIO REPORTE NUEVA ENTREGA
        showNewDelivery(item) {
            //LLAMADO A LA FUNCION PARA OBTENER LOS INFORMES DE ENTREGA
            this.getDeliveryReports(item)

            //MOSTRAR PANTALLA Y ESCONDER TAMBOR
            this.showNewDeliveryInterface = true
            this.showDrumPurchases = false

            this.purchaseSelected = item
        },

        hideNewDelivery() {
            //OCULTAR PANTALLA Y MOSTRAR TAMBOR
            this.showNewDeliveryInterface = false
            this.showDrumPurchases = true

            //actualizar ordenes de compra
            this.getPurchasesOrders()

            //reset inputs
            this.resetInputsNewDelivery()

            //reiniciar orden seleccionada
            this.purchaseSelected = ""
        },

        //NUEVA ENTREGA 
        async newDelivery() {
            let info = {}

            if (this.newQuantityDelivered != "" &&
                this.newPrice != ""
            ) {
                info.purchases_id = this.purchaseSelected.purchases_id
                info.quantity_delivered = this.newQuantityDelivered
                info.price = this.newPrice

                // console.log("entro")
                await infotrade.purchases(info, "report-new-delivery").then(data => {
                    console.log("guardada", data)
                    if (data.status != 200) {
                        this.showCustom('bg-danger text-white', "Error", "¡Error al guardar el reporte de la entrega!")
                    } else {
                        this.showCustom('bg-success text-white', "Guardada", "¡Reporte de entrega guardado correctamente!")
                        this.purchaseSelected.delivered_quantity = parseInt(this.purchaseSelected.delivered_quantity) + parseInt(this.newQuantityDelivered)
                        this.purchaseSelected.pending_amount = (this.purchaseSelected.requested_amount - this.purchaseSelected.delivered_quantity)

                        if (this.purchaseSelected.pending_amount < 0) {
                            this.purchaseSelected.pending_amount = 0
                        }

                        this.resetInputsNewDelivery()
                        this.getDeliveryReports(this.purchaseSelected)

                    }
                })



            } else {
                this.showCustom('bg-danger text-white', "Error", "¡Por favor complete todos los campos!")
            }


            //VERIFICAR SI SE ENTREGO LA CANTIDAD QUE SE NECESITABA O MAS
            if (this.purchaseSelected.delivered_quantity == this.purchaseSelected.requested_amount) {
                this.openModalCompletePurchaseOrder("¡La cantidad entregada es igual a la pedida!")
            } else if (this.purchaseSelected.delivered_quantity > this.purchaseSelected.requested_amount) {
                this.openModalCompletePurchaseOrder("¡La cantidad entregada es mayor a la pedida!")
            }


        },

        //MODAL PARA FINALIZAR LA ORDEN DE COMPRA DESPUES DE UNA ENTREGA
        openModalCompletePurchaseOrder(text) {
            this.informativeText = text
            this.showModalCompletePurchaseOrder = true
        },

        closeModalCompletePurchaseOrder() {
            this.showModalCompletePurchaseOrder = false

        },

        resetInputsNewDelivery() {
            this.newQuantityDelivered = ""
            this.newPrice = ""
        },

        resetNewQuantityDelivered() {
            this.newQuantityDelivered = ""
        },

        resetNewPrice() {
            this.newPrice = ""
        },

        //OBTENER INFORMES DE ENTREGAS
        async getDeliveryReports(item) {
            this.deliveryReports = []
            let info = {}
            info.purchases_id = item.purchases_id
            await infotrade.purchases(info, "get-delivery-reports").then(data => {
                //console.log("INFORMES", data)
                if (data.data != "") {
                    this.deliveryReports = data.data

                    for (let i = 0; i < this.deliveryReports.length; i++) {
                        this.deliveryReports[i].date_creation = this.deliveryReports[i].date_creation.toString().substr(0, 10)
                    }
                }

            })
        },
        //FIN REPORTAR NUEVA ENTREGA
        //-------------------------------------------------------------------------------------


        //FUNCION PARA AUMENTAR EL BUFFER
        increaseBuffer() {
            let today = new Date()
            let hour = today.getHours()
            console.log("HORA", hour)


        },


        //OBTENER ORDENES DE COMPRA
        async getPurchasesOrders() {
            //this.purchaseOrders = []
            this.purchaseOrdersActives = []
            await infotrade.purchases([], "select-active-true").then(data => {
                if (data.data != "") {
                    this.purchaseOrdersActives = data.data
                    console.log("ORDENES DE COMPRA", this.purchaseOrdersActives)

                    for (let i = 0; i < this.purchaseOrdersActives.length; i++) {
                        this.purchaseOrdersActives[i].consumed_buffer = this.purchaseOrdersActives[i].consumed_buffer.toFixed(3)
                        //this.purchaseOrdersActives[i].quantity_delivered = (this.purchaseOrdersActives[i].requested_amount - this.purchaseOrdersActives[i].pending_amount)
                    }
                    //console.log("ACTIVAS", this.purchaseOrdersActives)

                    //INFORMACION DE LA CANTIDAD DE ORDENES DE COMPRA
                    this.totalRows = this.purchaseOrdersActives.length


                }

            })




        },
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length
            this.currentPage = 1

            this.cntBlack = 0
            this.cntDanger = 0
            this.cntWarning = 0
            this.cntSuccess = 0
            this.cntInfo = 0

            for (let index = 0; index < filteredItems.length; index++) {
                const element = filteredItems[index];

                if (element._cellVariants.visible_buffer === "dark") {
                    this.cntBlack = this.cntBlack + 1
                }
                else if (element._cellVariants.visible_buffer === "danger") {
                    this.cntDanger = this.cntDanger + 1
                }
                else if (element._cellVariants.visible_buffer === "warning") {
                    this.cntWarning = this.cntWarning + 1
                }
                else if (element._cellVariants.visible_buffer === "success") {
                    this.cntSuccess = this.cntSuccess + 1
                } else {
                    this.cntInfo = this.cntInfo + 1
                }

            }

        },


        //NOTIFICACIONES 
        showCustom: function (classes, title, text) {
            this.$notify({
                group: "notifications-default",
                type: classes,
                title: title,
                text: text,
            });
        },




    }
}
</script>

<style>
#span {
    margin-top: -0.1rem;
    font-weight: normal;
    font-size: 0.9rem;
}

.font-table {
    font-size: 12px;
}

.table .table-warning,
.table .table-warning>th,
.table .table-warning>td {
    border-color: rgba(0, 0, 0, 0.035) !important;
    background-color: #ffff00;
    color: #292b2c;
}

.table .table-dark,
.table .table-dark>th,
.table .table-warning>td {
    border-color: rgba(0, 0, 0, 0.035) !important;
    background-color: #292b2c;
    color: #f7f7f7;
}

.table .table-danger,
.table .table-danger>th,
.table .table-warning>td {
    border-color: rgba(0, 0, 0, 0.035) !important;
    background-color: #d9534f;
    color: #f7f7f7;
}

.table .table-success,
.table .table-success>th,
.table .table-warning>td {
    border-color: rgba(0, 0, 0, 0.035) !important;
    background-color: #5cb85c;
    color: #f7f7f7;
}
</style>
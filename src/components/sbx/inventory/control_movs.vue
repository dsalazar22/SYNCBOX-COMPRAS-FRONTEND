<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Control de Movimientos de Inventario</h4>
        <div class="w-100 text-right"></div>
        <div class="text-right mt-2 mb-2" v-if="!addInvMovs">
            <b-btn variant="outline-success borderless" class="btn-xs" @click.prevent="addInvMovs=true"><i class="ion ion-md-add"></i> Crear Movimiento </b-btn>
        </div>
        <div class="row">
            <div class="col">
                <b-input-group>
                    <b-input-group-text slot="prepend" v-if="loading">
                        <i class="ion ion-md-sync"></i>
                    </b-input-group-text>
                    <b-input-group-text slot="prepend" v-if="!loading">
                        <i class="ion ion-ios-search"></i>
                    </b-input-group-text>
                    <b-input-group-text slot="append" @click="resetInput">
                        <i class="ion ion-md-close" ></i>
                    </b-input-group-text>
                    <input type="text" class="form-control"
                        placeholder="Seleccione un Producto"
                        autocomplete="off"
                        v-model="valueProduct"
                        @keydown.down="down"
                        @keydown.up="up"
                        @keydown.enter="hit"
                        @keydown.esc="reset"
                        @blur="reset"
                        @input="updateQueryProducto" />
                    <!-- <b-input-group-text slot="append" v-if="isDirty || valueProduct" @click="resetInput">
                        <i class="ion ion-md-checkmark" ></i>
                    </b-input-group-text> -->
                </b-input-group>
                <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                    <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                        <span class="name" v-text="item.code"></span>
                        <span class="text-muted">{{ item.description }}</span>
                    </a>
                </div>
            </div>
            <!-- <div class="col">
                <b-form-input v-model="product_ppal.amount" id="type-env" type="number" autocomplete="off"></b-form-input>
            </div> -->
        </div>
        <div v-if="addInvMovs">
            <div class="row mt-2">
                <div class="col">
                    Cantidad
                    <b-form-input v-model="product_ppal.amount" id="type-env" type="number" autocomplete="off"></b-form-input>
                </div>
                <div class="col">
                    Tipo de Movimiento
                    <b-select v-model="product_ppal.selectedmove_id" placeholder="Movimientos" :options="optionsMovs" class="flex-grow-1" @change="changeMovs()" />
                </div>
            </div>
            
            <!-- CONFIGURACION PARA MOVIMIENTO DE TRASLADOS -->
            <div v-if="product_ppal.traslado">
                <div class="row mt-2">
                    <div class="col">
                        Bodega Origen
                        <b-select @change="changeUbicationsOptionsFrom(product_ppal.selectedwarehousefrom_id)" v-model="product_ppal.selectedwarehousefrom_id" placeholder="Bodega" :options="optionsWarehouse" class="flex-grow-1"/>
                    </div> 
                    <div class="col">
                        Ubicacion Origen
                        <b-select v-model="product_ppal.selectedubicationfrom" placeholder="Bodega" :options="ubicationsOptionsFrom" class="flex-grow-1" />
                    </div> 
                </div>
                <div class="row mt-2">
                    <div class="col">
                        Bodega Destino
                        <b-select @change="changeUbicationsOptions(product_ppal.selectedwarehouse_id)" v-model="product_ppal.selectedwarehouse_id" placeholder="Bodega" :options="optionsWarehouse" class="flex-grow-1"/>
                    </div> 
                    <div class="col">
                        Ubicacion Destino
                        <b-select v-model="product_ppal.selectedubication" placeholder="Bodega" :options="ubicationsOptions" class="flex-grow-1" />
                    </div> 
                </div>
            </div>
            <!-- CONFIGURACION PARA MOVIMIENTO DE TRASLADOS -->

            <!-- CONFIGURACION PARA MOVIMIENTO CONSUMO PARTES -->
            <div v-if="product_ppal.consume_components">
                <div class="row mt-2" >
                    <div class="col">
                        Bodega de Componentes
                        <b-select @change="changeUbicationsOptionsFrom(product_ppal.selectedwarehousefrom_id)" v-model="product_ppal.selectedwarehousefrom_id" placeholder="Bodega" :options="optionsWarehouse" class="flex-grow-1"/>
                    </div> 
                    <div class="col">
                        Ubicacion Componentes
                        <b-select v-model="product_ppal.selectedubicationfrom" placeholder="Bodega" :options="ubicationsOptionsFrom" class="flex-grow-1" />
                    </div> 
                </div>
                <div class="row mt-2">
                    <div class="col">
                        Bodega Destino
                       <b-select @change="changeUbicationsOptions(product_ppal.selectedwarehouse_id)" v-model="product_ppal.selectedwarehouse_id" placeholder="Bodega" :options="optionsWarehouse" class="flex-grow-1"/>
                    </div>  
                    <div class="col">
                        Ubicacion Destino
                        <b-select v-model="product_ppal.selectedubication" placeholder="Bodega" :options="ubicationsOptions" class="flex-grow-1" />
                    </div> 
                </div>
            </div>
            <!-- CONFIGURACION PARA MOVIMIENTO CONSUMO PARTES -->

            <!-- CONFIGURACION PARA MOVIMIENTO ENTRE UBICACIONES -->
            <div v-if="product_ppal.ubications_movs">
                <div class="row mt-2" >
                    <div class="col">
                        Bodega Origen
                        <b-select @change="changeUbicationsOptionsFrom(product_ppal.selectedwarehousefrom_id)" v-model="product_ppal.selectedwarehousefrom_id" placeholder="Bodega" :options="optionsWarehouse" class="flex-grow-1"/>
                    </div> 
                </div>
                <div class="row mt-2">
                    <div class="col">
                        Ubicacion Origen
                        <b-select v-model="product_ppal.selectedubication" placeholder="Bodega" :options="ubicationsOptionsFrom" class="flex-grow-1" />
                    </div>  
                    <div class="col">
                        Ubicacion Destino
                        <b-select v-model="product_ppal.selectedubicationfrom" placeholder="Bodega" :options="ubicationsOptionsFrom" class="flex-grow-1" />
                    </div> 
                </div>
            </div>
            <!-- CONFIGURACION PARA MOVIMIENTO ENTRE UBICACIONES -->

            <!-- CONFIGURACION PARA MOVIMIENTO DE ENTRADAS Y SALIDAS -->
            <div class="row mt-2" v-if="!product_ppal.traslado && !product_ppal.ubications_movs && !product_ppal.consume_components">
                <div class="col">
                    Bodega Destino
                    <b-select @change="changeUbicationsOptions(product_ppal.selectedwarehouse_id)" v-model="product_ppal.selectedwarehouse_id" placeholder="Bodega" :options="optionsWarehouse" class="flex-grow-1"/>
                </div> 
                <div class="col">
                    Ubicacion Destino
                    <b-select v-model="product_ppal.selectedubication" placeholder="Bodega" :options="ubicationsOptions" class="flex-grow-1" />
                </div> 
            </div>
            <!-- CONFIGURACION PARA MOVIMIENTO DE ENTRADAS Y SALIDAS -->
            <div class="w-100 text-right mt-2">
                <b-btn variant="primary" @click="cancelMovs()">Cancelar</b-btn>
                <b-btn variant="success" @click="submit()">Guardar</b-btn>
            </div>
        </div>

        <div class="row">
            <div class="col-4">
                <!-- {{totals_warehouse}}
                <div v-for="item of totals_warehouse">
                    {{item}}
                </div> -->
                <div class="card bg-light mb-3 mt-3">
                    <div class="card-header">Inventario Total</div>
                    <div class="card-body bg-white">
                        <h2 class="text-center">{{numberWithCommas(total)}}</h2>
                    </div>
                </div>
                 <b-list-group class="mt-2">
                    <b-list-group-item style="padding:5px;"> 
                        <div>
                            <b>Totales por Bodega</b>
                        </div>
                    </b-list-group-item>
                    <b-list-group-item style="padding:5px;" v-for="(value, name) in totals_warehouse"> 
                        <div>
                            <b>{{name}}</b>
                            <div class="float-right mr-2"> {{numberWithCommas(value)}} </div>
                        </div>
                    </b-list-group-item>
                 </b-list-group>
                 <b-list-group class="mt-2">
                    <b-list-group-item style="padding:5px;"> 
                        <div>
                            <b>Totales por Ubicaciones</b>
                        </div>
                    </b-list-group-item>
                    <b-list-group-item style="padding:5px;" v-for="(value, name) in totals_ubications" v-if="value['total']>0"> 
                        <div v-for="(value, name) in value['ubiq']">
                            <div>
                                <b>{{name}}</b>
                                <div class="float-right mr-2"> {{numberWithCommas(value)}} </div>
                            </div>
                        </div>
                        <div class="border-top">
                            <b>{{name}}</b>
                            <div class="float-right mr-2"> {{numberWithCommas(value['total'])}} </div>
                        </div>
                    </b-list-group-item>
                 </b-list-group>
                <!-- <div v-for="(value, name) in totals_warehouse">
                    {{ name }}: {{ value }}
                </div> -->
            </div>
            <div class="col-8">
                <b-table small tbody-class="h6 font-weight-normal" class="mt-2" show-empty hover responsive stacked="sm" :items="itemsInventory"  :fields="columnsFields" >
                    <!-- <template slot="visible_buffer" slot-scope="props">
                            {{props.item}}
                        </template> -->
                    <template v-slot:cell(amount)="row">

                        {{numberWithCommas(row.item.amount)}}
                        <!-- <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="select_product(row.item)" target="_blank"><i class="ion ion-md-checkmark"></i></b-btn>
                        </div> -->
                    </template>
                </b-table>
            </div>
        </div>
    </div>
</template>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>

import Vue from 'vue'
import Axios from 'axios'

import Notifications from 'vue-notification'
import VueTypeahead from 'vue-typeahead'
import { infomaster } from '@/components/i40/js/master'
import { infoinventory } from "@/components/i40/js/inventory";
import { infosysconfig } from "@/components/i40/js/sysconfig";
import { config,master } from "@/components/i40/js/globals";

Vue.use(Notifications)
// Vue.prototype.$http = Axios


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
    extends: VueTypeahead,
    components: {
    },
    data() {
        return {
            src: '',
            valueProduct:'',
            selectedProductItem:{},
            product_ppal:{},
            itemsInventory:[],
            columnsFields:[ 
                {key:'warehouse', label:'Bodega'},
                {key:'ubication', label:'Ubicacion'},
                {key:'description', label:'Tipo Movimiento'},
                {key:'amount', label:'Cantidad'},
                
                {key:'created', label:'Fecha'},
                {key:'username', label:'Usuario'}
            ],
            allUbications:[],
            ubicationsOptionsFrom:[],
            ubicationsOptions:[],
            movs:[],
            optionsMovs:[],
            selectedMovs:null,

            warehouse:[],
            optionsWarehouse:[],
            selectedWarehouse:null,
            addInvMovs:false,
            total : 0,
            totals_warehouse : {},
            totals_ubications: {}
        }
    },
    methods: {
        numberWithCommas(x) {
            if(x == null)
                x=0
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },

        totals(datos){
            this.total = 0
            this.totals_warehouse = {}
            this.totals_ubications = {}
            for (let index = 0; index < datos.length; index++) {
                const element = datos[index];
                this.total = this.total + element.amount
                if(this.totals_warehouse[element.warehouse] == undefined){
                    this.totals_warehouse[element.warehouse] = 0
                    this.totals_ubications[element.warehouse] = {}
                    this.totals_ubications[element.warehouse]["total"] = 0
                    this.totals_ubications[element.warehouse]["ubiq"] = {}

                    this.totals_ubications[element.warehouse]["ubiq"][element.ubication] = 0
                }

                if (this.totals_ubications[element.warehouse]["ubiq"][element.ubication] == undefined) {
                    this.totals_ubications[element.warehouse]["ubiq"][element.ubication] = 0
                }
                
                this.totals_warehouse[element.warehouse] = this.totals_warehouse[element.warehouse] + element.amount 
                this.totals_ubications[element.warehouse]["total"] = this.totals_ubications[element.warehouse]["total"] + element.amount
                this.totals_ubications[element.warehouse]["ubiq"][element.ubication] = this.totals_ubications[element.warehouse]["ubiq"][element.ubication] + element.amount
            }

            // console.log(this.totals_ubications)
        },

        onHit (item) {
            this.selectedProductItem = item
            this.valueProduct = `(${item.code}) ${item.description}`

            this.product_ppal = {
                product_id: item.product_id,
                traslado: false,
                amount: 0,
                selectedwarehousefrom_id:null,
                selectedwarehouse_id:null,
                traslado:false,
                selectedmove_id:null,
                factor_converter:1,
                is_incoming:false,
                selectedubicationfrom:null,
                selectedubication:null,
                ubications_movs:false,
                consume_components:false
            }            
            
            infoinventory.controllerinventory(item.product_id, "get-kardex").then(data =>{
                this.itemsInventory = data.data
                this.totals(this.itemsInventory)
            })
        },

        updateQueryProducto () {
            let uri = encodeURIComponent(this.valueProduct)
            this.query = uri
            this.update()
        },

        resetInput () {
            this.valueProduct = ''
            this.selectedProductItem={}
        },

        changeMovs(){
            this.product_ppal.traslado = false
            this.product_ppal.consume_components = false
            this.product_ppal.ubications_movs = false

            for (let index = 0; index < this.movs.length; index++) {
                const element = this.movs[index];
                
                if(element.code == this.product_ppal.selectedmove_id){
                    // console.log(element)
                    this.product_ppal.is_income = element.is_income
                    if(element.warehouse_required)
                        this.product_ppal.traslado = true
                    if(element.consume_components)
                        this.product_ppal.consume_components = true
                    if(element.ubications_movs){
                        this.product_ppal.ubications_movs = true
                    }
                }
            }
        },

        submit(){
            // console.log(this.product_ppal)
            let typemove =  "add-manual"
            if(this.product_ppal.ubications_movs){
                typemove = "move-ubiq"
            }else if(this.product_ppal.consume_components){
                typemove = "move-consume"
            }

            infoinventory.controllerinventory(this.product_ppal, typemove).then(data =>{
                infoinventory.controllerinventory(this.selectedProductItem.product_id, "get-kardex").then(data =>{
                    this.itemsInventory = data.data
                    this.totals(this.itemsInventory)

                    this.product_ppal = {
                        product_id: null,
                        traslado: false,
                        amount: 0,
                        consume_components:false,
                        selectedwarehousefrom_id:null,
                        selectedwarehouse_id:null,
                        selectedmove_id:null,
                        factor_converter:1,
                        is_incoming:false,
                        selectedubicationfrom:null,
                        selectedubication:null,
                        ubications_movs:false,
                    }

                    this.product_ppal.product_id = this.selectedProductItem.product_id

                })
            })
        },

        cancelMovs(){
            this.addInvMovs=false
            this.product_ppal = {
                product_id: null,
                traslado: false,
                amount: 0,
                consume_components:false,
                selectedwarehousefrom_id:null,
                selectedwarehouse_id:null,
                selectedmove_id:null,
                factor_converter:1,
                is_incoming:false,
                selectedubicationfrom:null,
                selectedubication:null,
                ubications_movs:false,
            }

            this.product_ppal.product_id = this.selectedProductItem.product_id
        },

        changeUbicationsOptionsFrom(){
            this.ubicationsOptionsFrom = []
            for (let index = 0; index < this.allUbications.length; index++) {
                const element = this.allUbications[index];
                if(element.warehouse_id == this.product_ppal.selectedwarehousefrom_id){
                    this.ubicationsOptionsFrom.push({value:element.ubications_id, text:`(${element.code}) - ${element.name}`})
                }

                if(element.code == "0000"){
                    this.product_ppal.selectedubicationfrom = element.ubications_id
                }
                
            }
        },

        changeUbicationsOptions(item){
            this.ubicationsOptions = []
            for (let index = 0; index < this.allUbications.length; index++) {
                const element = this.allUbications[index];
                
                if(element.warehouse_id == item){
                    this.ubicationsOptions.push({value:element.ubications_id, text:`(${element.code}) - ${element.name}`})

                    if(element.code == "0000"){
                        this.product_ppal.selectedubication = element.ubications_id
                    }
                } 
            }
        },
    },
    created() {
        this.src = master+'productsearch/'
         this.product_ppal = {
                product_id: null,
                traslado: false,
                amount: 0,
                selectedwarehousefrom_id:null,
                selectedwarehouse_id:null,
                traslado:false,
                selectedmove_id:null,
                factor_converter:1,
                traslado: false,
                consume_components: false,
                ubications_movs: false,
                selectedubication: null,
                selectedubicationfrom: null
            }

        infoinventory.warehouse([],"get").then(data => {
            if(data.data != ""){
                this.warehouse = data.data
                
                for (let index = 0; index < data.data.length; index++) {
                    const element = data.data[index];
                    this.optionsWarehouse.push({value:element.warehouse_id, text:element.name})
                }

            }else{
                this.warehouse = []
            }
        })

        infoinventory.ubications([],"get").then(data => {
            if(data.data != ""){
                this.allUbications = []
                if(data.data != ""){
                    this.allUbications = data.data
                }
            }else{
                this.warehouse = []
            }
        })

        infosysconfig.movtype([],"select").then(data => {
            if(data.data != ""){
                this.movs = data.data
                
                for (let index = 0; index < data.data.length; index++) {
                    const element = data.data[index];
                    this.optionsMovs.push({value:element.code, text:element.description})
                }

            }else{
                this.movs = []
            }
        })
    },
    
}
</script>
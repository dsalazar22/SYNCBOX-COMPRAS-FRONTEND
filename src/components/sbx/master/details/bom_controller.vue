<template>
    <div>
        <b-table small show-empty stacked="md" :items="tableBOM2" :fields="columnsBOM">
            <template v-slot:cell(sequence)="row">
                <!-- -->
                <!-- <b-button size="sm" @click="row.toggleDetails() ; loadRecetas(row.item.child_id);" class="mr-2">
                {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
                </b-button> -->

                <b-btn variant="outline-success borderless" class="btn-sm" @click="loadRecetas(row);">
                    <span class="ion ion-md-add" v-if="!row.detailsShowing"></span>
                    <span class="ion ion-md-remove" v-if="row.detailsShowing"></span>
                </b-btn>

                {{row.item.sequence}}
            </template>

            <template v-slot:cell(default)="row">
                <div class="text-center">
                    <span class="text-success" v-if="row.item.default"><i class="ion ion-md-checkmark"></i></span> 
                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="setDefaulBOMProduct(row.item)" v-if="!row.item.default">
                        <i class="ion ion-md-close"></i>
                    </b-btn>
                </div>
            </template>

            <template v-slot:cell(edit)="row">
                <div class="text-left">
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="editChildProduct(row.item)" target="_blank"><i class="ion ion-md-create"></i></b-btn>
                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="delete_option_mp = 'grid'; loadInfoToDelete(row.item)"><i class="ion ion-md-close"></i></b-btn>
                </div>
            </template>

            <template v-slot:row-details="row">
               
                <b-card class="border border-info">
                      <b-tabs content-class="mt-3">
                            <b-tab v-for="(item, index) in listDefinitionBOM['key_'+row.item.child_id.toString()]" :key="item.bill_of_materials_id" :active="index == 0" @click="selectedVersion = item.bill_of_materials_id">
                                <template slot="title">
                                    <div>
                                        {{item.name}} 
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click="setDefaulBOMroduct(item)" v-if="!item.default"><i class="pe-7s-pin"></i></b-btn> -->
                                            <i class="oi oi-pin text-success" v-if="item.default"></i>
                                            <i class="pe-7s-pin text-danger" v-if="!item.default"></i>
                                            <!-- <b-btn variant="outline-info borderless  icon-btn" class="btn-xs"  @click="editMeterials(item); verPreparacion=false"><i class="fas fa-info"></i></b-btn>
                                            <b-btn variant="outline-success borderless  icon-btn" class="btn-xs" @click.prevent="editMeterials(item);verPreparacion=true"><i class="ion ion-md-create"></i></b-btn> 
                                            <b-btn variant="outline-danger borderless  icon-btn" class="btn-xs" @click.prevent="sdelete_option_mp = 'tab'; loadInfoToDelete(item)" v-if="!item.default"><i class="ion ion-md-close"></i></b-btn>  -->
                                        </div>
                                        <div>
                                            Versión {{item.version}}
                                        </div>
                                    </div>
                                </template>
                                
                                <bom-controller :tableBOM="item.details_materials" :src="src" :id_product="row.item.child_id" :bill_of_materials_id="item.bill_of_materials_id"></bom-controller>
                            
                            </b-tab>
                        </b-tabs>
                    
                </b-card>
            </template>
        </b-table>


         <!-- FROMULARIO NUEVO PRODUCTO DE RECETA -->
                        <div v-if="showAddEditMaterialsDetails">
                            <div class="position-relative mb-2 mt-2">
                                <b-card header="Adicionar Nuevo Producto" header-tag="h6" class="mb-4">
                                    <div class="row">
                                        <div class="col">
                                            <div class="position-relative">
                                                <b-input-group>
                                                    <b-input-group-text slot="prepend" v-if="loading">
                                                        <i class="ion ion-md-sync"></i>
                                                    </b-input-group-text>
                                                    <b-input-group-text slot="prepend" v-if="!loading">
                                                        <i class="ion ion-ios-search"></i>
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
                                                    <b-input-group-text slot="append" v-if="isDirty || valueProduct" @click="resetInput">
                                                        <i class="ion ion-md-close" ></i>
                                                    </b-input-group-text>
                                                </b-input-group>

                                                <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: 1}">
                                                    <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                                        <span class="name" v-text="item.code"></span>
                                                        <span class="text-muted">{{ item.description }}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <b-form-row class="mt-2">
                                        <b-form-group class="col-md-6" label="Secuencia">
                                            <b-input type="number" placeholder="Secuencia" required v-model.trim="itemNewDetailBOM.sequence"/>
                                        </b-form-group>
                                        
                                        <b-form-group class="col-md-6" label="Cantidad por Padre">
                                            <b-input type="number" placeholder="Cantidad por Padre" required v-model.trim="itemNewDetailBOM.amount_per_parent"/>
                                        </b-form-group>
                                    </b-form-row>

                                    <b-form-row class="mt-2">
                                        <b-form-group class="col-md-6" label="Unidad de Medida">
                                            <b-input type="number" placeholder="Unidad de Medida" required v-model.trim="itemNewDetailBOM.sequence"/>
                                        </b-form-group>
                                        
                                        <b-form-group class="col-md-6" label="Operacion de Consumo ">
                                            <b-input type="number" placeholder="Operacion de Consumo" required v-model.trim="itemNewDetailBOM.amount_per_parent"/>
                                        </b-form-group>
                                    </b-form-row>
                                    <div class="text-right">
                                        <b-button size="md" variant="primary" autocomplete="off" @click="showAddEditMaterialsDetails=false; itemNewDetailBOM = {sequence:null,
                                                itemTransactionType:null,
                                                amount_per_parent:null,
                                                parent_id:0,
                                                child_id:0,
                                                details_bill_of_materials_id:0,
                                                bill_of_materials_id:0}; valueProduct = ''">Cancelar</b-button>
                                        <b-button size="md" variant="success" @click="save_new_product(bill_of_materials_id)">Guardar</b-button>
                                    </div>
                                </b-card>
                            </div>
                        </div>
                        <!-- FORMULARIO NUEVO PRODUCTO DE RECETA -->

                        <div class="d-flex justify-content-between">
                            <div>
                                <!-- <b-btn variant="outline-info borderless" class="btn-sm" @click.prevent="show_tree=true; tree_product_info(index, item.bill_of_materials_id, item.parent_id);">
                                        <span class="fas fa-project-diagram"></span>&nbsp;&nbsp;Cargar Árbol
                                    </b-btn> -->
                            </div>
                            <div class="text-right mb-2">
                            
                                <b-btn variant="outline-success borderless" class="btn-sm" @click.prevent="showAddEditMaterialsDetails=true">
                                    <span class="ion ion-md-add"></span>&nbsp;&nbsp;Adicionar Nuevo Material
                                </b-btn>
                            </div>
                        </div>


            <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
                <div class="w-100 text-danger"> <strong></strong> </div>
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                    {{mensaje_borrado}}
                </div>
                
                <template slot="button"><b-btn @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="$refs.errorWithButtonAlert.close()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>  


    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>

import Vue from 'vue'
import Axios from 'axios'
import VueTypeahead from 'vue-typeahead'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { infoconfig } from "@/components/i40/js/config";
import BOMController from '@/components/sbx/master/details/bom_controller'
Vue.prototype.$http = Axios

function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
    extends: VueTypeahead,
      props: {
        route_product_id: {
            type: Number
        },
        id_product: {
            type: Number
        },
        tableBOM: {
            type: Array
        },
        src: {
            type: String
        },
        bill_of_materials_id:{
            type:Number
        },
        depth:{
            type: Number
        },
        infoProduct:{
            type: Object
        }
    },
    components:{

        SweetModal,
        SweetModalTab,
        'bom-controller': () => import('./bom_controller.vue')
    },

    data() {
        return {
                tableBOM2: this.tableBOM,
                showAddEditMaterialsDetails:false,
                valueProduct:'',
                mensaje_borrado:'',
                itemDelete:{},
                itemNewDetailBOM: {sequence:null,
                                                itemTransactionType:null,
                                                amount_per_parent:null,
                                                parent_id:0,
                                                child_id:0,
                                                details_bill_of_materials_id:0,
                                                bill_of_materials_id:0},
                columnsBOM: [
                    // {key:'complete', label:"Completo"},
                    {key:'sequence', label:"Orden"},
                    {key:'code', label:"Código"},
                    {key:'description', label:"Descripción"},
                    {key:'amount_per_parent', label:"Cantidad x Padre"},
                    {key:'unity_measure_id', label:"UM"},
                    // {key:'uom', label:"Unidad de Medida"},
                    // {key:'opc', label:"Operacion Consumo"},
                    {key:'cst', label:"Costo"},
                    {key:'edit', label:"Edit"}],

                itemProductSelected:{},
                listDefinitionBOM:[],
                selectedVersion:null,
        }
    },

    methods: {

        async loadRecetas(row){
            this.listDefinitionBOM['key_'+row.item.child_id.toString()]=[]
            var result = []
            await infoconfig.billofmaterialscontrol([], row.item.child_id, "select").then(data => {
                // console.log(data)
                if (data.status === 202){
                    // console.log(data)
                    // this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
                }else{
                    if (data.data != ""){
                        row.details = data.data
                        this.listDefinitionBOM['key_'+row.item.child_id.toString()] = data.data

                        result = data.data
                    }
                }
            })
            row.toggleDetails()
            // return result
        },

        resultado(item){
            return $createElement(BOMController)
        },

        showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
        },
        
        loadInfoToDelete(item){
            this.$refs.errorWithButtonAlert.open(); 
            this.itemDelete=item;
            this.itemDelete.product_id = this.id_product
        },
        
        deleteRecord(){
           infoconfig.detailsbillofmaterialscontrol(this.itemDelete, 0, "delete").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Registro Creado","¡El Registro se ha Creado con Éxito!")
                    this.$emit('refresh',data.data)



                    for (let index = 0; index < data.data.length; index++) {
                        const element = data.data[index];
                        if(element.bill_of_materials_id == this.itemDelete.bill_of_materials_id)
                            this.tableBOM2 = element.details_materials
                        
                    }

                    // this.listDefinitionBOM = data.data
                    this.showAddEditMaterials=false
                    this.itemNewDetailBOM = {
                        sequence:null,
                        itemTransactionType:null,
                        amount_per_parent:null,
                        parent_id:0,
                        child_id:0,
                        details_bill_of_materials_id:0,
                        bill_of_materials_id:0
                    }

                    this.valueProduct = ''
                    this.$refs.errorWithButtonAlert.close(); 
                }
            })
        },
        /// recetas
            save_new_product(item){
                this.itemNewDetailBOM.bill_of_materials_id = item
                if( this.itemNewDetailBOM.child_id == 0)
                    this.itemNewDetailBOM.child_id = this.itemProductSelected.product_id

                this.itemNewDetailBOM.parent_id = this.id_product

                infoconfig.detailsbillofmaterialscontrol(this.itemNewDetailBOM, 0, this.itemNewDetailBOM.details_bill_of_materials_id == 0 ? "insert" : "update").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Creado","¡El Registro se ha Creado con Éxito!")
                        // this.$emit('refresh',data.data)
                        for (let index = 0; index < data.data.length; index++) {
                            const element = data.data[index];
                            if(element.bill_of_materials_id == item)
                                this.tableBOM2 = element.details_materials
                            
                        }
                        
                        // this.tableBOM = data.data.details_materials
                        this.showAddEditMaterials=false
                        this.itemNewDetailBOM = {
                            sequence:null,
                            itemTransactionType:null,
                            amount_per_parent:null,
                            parent_id:0,
                            child_id:0,
                            details_bill_of_materials_id:0,
                            bill_of_materials_id:0
                        }
                        this.valueProduct = ''
                    }
                })
            },

            editChildProduct(item){
                this.showAddEditMaterialsDetails=true; 
                this.itemNewDetailBOM= JSON.parse(JSON.stringify(item)); 
                this.valueProduct = item.description
            },

            editMeterials(item){
                this.itemNewDefinitionBOM = item
                this.showAddEditMaterials = true
            },
        
        updateQueryProducto () {
            this.query = this.valueProduct
            this.update()
        },

        resetInput () {
            this.valueProduct = ''
            this.reset()
        },

        onHit (item) {
            this.valueProduct = item.description
            this.itemProductSelected = item
        }
    },
}
</script>
<template>
    <div>
        <b-table small show-empty stacked="md" :items="tableParts" :fields="columnsBOM">
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
                    <b-btn v-if="row.item.product_id!=null && row.item.details != null" variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="addDuration=true; infoMeasure=row.item.details"><i class="fas fa-heartbeat"></i></b-btn>
                    <b-btn v-if="row.item.product_id!=null && row.item.details == null" variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="addDuration=true; infoMeasure=row.item.details"><i class="fas fa-heartbeat"></i></b-btn>
                </div>
            </template>

            <template v-slot:row-details="row">
                <b-card class="border border-info">
                     
                    <bom-controller :assets_parent_id="row.item.assets_parts_id" :assets_child_id="row.item.assets_parts_id" :tableBOM="listDefinitionBOM['key_'+row.item.assets_parts_id.toString()]" :src="src" ></bom-controller>
                    
                </b-card>
            </template>
        </b-table>

        <b-modal id="bv-modal-example" hide-footer v-model="addDuration" size="xl">
            <template v-slot:modal-title>
                Estado de los Componentes
            </template>

            <div class="d-block text-center mt-1 mb-3"> 
                <b-table small show-empty stacked="md" :items="infoMeasure" :fields="columnsMeasure">
                </b-table>
            </div>
            <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Cerrar</b-button>
        </b-modal>


         <!-- FROMULARIO NUEVO PRODUCTO DE RECETA -->
                        <div v-if="showAddEditMaterialsDetails">
                            <div class="position-relative mb-2 mt-2">
                                <b-card header="Adicionar Nueva Parte" header-tag="h6" class="mb-4">
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

                                                <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                                                    <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                                        <span class="name" v-text="item.code"></span>
                                                        <span class="text-muted">{{ item.description }}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <b-form-row class="mt-2">
                                        <b-form-group class="col-md-6" label="Codigo">
                                            <b-input  placeholder="Codigo" required v-model.trim="itemNewDetailBOM.code"/>
                                        </b-form-group>
                                        
                                        <b-form-group class="col-md-6" label="Descripción">
                                            <b-input  placeholder="Descripción" required v-model.trim="itemNewDetailBOM.description"/>
                                        </b-form-group>
                                    </b-form-row>

                                    <b-form-row class="mt-2">
                                        <b-form-group class="col-md-6" label="Secuencia">
                                            <b-input type="number" placeholder="Secuencia" required v-model.trim="itemNewDetailBOM.sequence"/>
                                        </b-form-group>
                                        
                                        <b-form-group class="col-md-6" label="Cantidad por Padre">
                                            <b-input type="number" placeholder="Cantidad por Padre" required v-model.trim="itemNewDetailBOM.amount_per_parent"/>
                                        </b-form-group>
                                    </b-form-row>
                                    <div class="text-right">
                                        <b-button size="md" variant="primary" autocomplete="off" @click="showAddEditMaterialsDetails=false; itemNewDetailBOM = {
                                                sequence:null,
                                                assets_parts_id:0,
                                                amount_per_parent:null,
                                                parent_id:0,
                                                assets_parts_child_id:null,
                                                assets_id:null,product_id:null
                                                }; valueProduct = ''">Cancelar</b-button>
                                        <b-button size="md" variant="success" @click="save_new_product()">Guardar</b-button>
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
                                    <span class="ion ion-md-add"></span>&nbsp;&nbsp;Adicionar Nueva Parte
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


import VueTypeahead from 'vue-typeahead'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { infoconfig } from "@/components/i40/js/config";
import { infomainten } from '@/components/i40/js/maintenance'
// import BOMController from '@/components/sbx/maintenance/parts_controller'


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
    extends: VueTypeahead,
    
      props: {
        assets_parent_id: {
            type: Number
        },
        assets_child_id: {
            type: Number
        },
        src: {
            type: String
        },
        tableBOM:{
            type: Array
        }
    },
    components:{

        SweetModal,
        SweetModalTab,
        'bom-controller': () => import('./parts_controller.vue')
    },

    watch: {
        'assets_parent_id':function(value){
            // console.log(value)
        }
    },

    data() {
        return {
                addDuration:false,
                showAddEditMaterialsDetails:false,
                unityMeasure:null,
                infoMeasure:[],
                columnsMeasure:[
                    // {key:'complete', label:"Completo"},
                    {key:'duration', label:"Medida"},
                    {key:'max_value', label:"Valor Maximo"},
                    {key:'current_value', label:"Valor Actual"},
                    {key:'pending_value', label:"Pendiente"},
                    {key:'percentage_pending_value', label:"% Consumo"}],
                valueProduct:'',
                mensaje_borrado:'',
                itemDelete:{},
                itemNewDetailBOM: { sequence:null,
                                                assets_parts_id:0,
                                                amount_per_parent:null,
                                                parent_id:0,
                                                assets_parts_child_id:null,
                                                assets_id:null,
                                                product_id:null},
                columnsBOM: [
                    // {key:'complete', label:"Completo"},
                    {key:'sequence', label:"Orden"},
                    {key:'code', label:"Código"},
                    {key:'description', label:"Descripción"},
                    {key:'amount_per_parent', label:"Cantidad x Padre"},
                    {key:'edit', label:"Edit"}],

                itemProductSelected:{},
                listDefinitionBOM:[],
                selectedVersion:null,
                tableParts: this.tableBOM,
        }
    },

    methods: {

        async loadRecetas(row){
            var result = []
            this.listDefinitionBOM['key_'+row.item.assets_parts_id.toString()]=[]
            await infomainten.assetsParts(row.item.assets_parts_id,"select-child").then(data => {
                    
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error!")
                    }else{
                        if(data.data != ''){
                            this.details_materials = data.data
                            this.listDefinitionBOM['key_'+row.item.assets_parts_id.toString()] = data.data
                        }
                    }
                    }).catch(function (error) {
                        console.log(error.status)
                    })
            row.toggleDetails()
            return result
            
        
            // this.listDefinitionBOM['key_'+row.item.child_id.toString()]=[]
            // var result = []
            // await infoconfig.billofmaterialscontrol([], row.item.child_id, "select").then(data => {
            //     if (data.status === 202){
            //         console.log(data)
            //         // this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
            //     }else{
            //         if (data.data != ""){
            //             row.details = data.data
            //             this.listDefinitionBOM['key_'+row.item.child_id.toString()] = data.data

            //             result = data.data
            //         }
            //     }
            // })
            // row.toggleDetails()
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
           infomainten.assetsParts(this.itemDelete, "delete").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error al Eliminar el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Registro Borrado","¡El Registro se ha Borrado con Éxito!")
                    this.tableParts = []
                    for (let index = 0; index < data.data.length; index++) {
                        const element = data.data[index];
                        if(element.bill_of_materials_id == this.itemDelete.bill_of_materials_id)
                            this.tableParts = element.details_materials
                        
                    }
                    if(data.data != "" && this.tableParts == undefined)
                        this.tableParts = data.data

                    // this.listDefinitionBOM = data.data
                    this.showAddEditMaterials=false
                    this.itemNewDetailBOM = { sequence:null,
                                                assets_parts_id:0,
                                                amount_per_parent:null,
                                                parent_id:0,
                                                assets_parts_child_id:null,
                                                assets_id:null,
                                                product_id:null,
                        
                    }

                    this.valueProduct = ''
                    this.$refs.errorWithButtonAlert.close(); 
                }
            })
        },
        /// recetas
            save_new_product(){
                
                this.itemNewDetailBOM.assets_id = this.$route.params.id

                if(this.assets_child_id==0){
                    this.itemNewDetailBOM.assets_child_id = null
                }else{
                    this.itemNewDetailBOM.parent_id = this.itemNewDetailBOM.assets_parts_id
                    this.itemNewDetailBOM.assets_parts_child_id = this.itemNewDetailBOM.assets_parts_id
                }

                if( this.itemNewDetailBOM.child_id == 0)
                    this.itemNewDetailBOM.child_id = this.itemProductSelected.product_id

                this.itemNewDetailBOM.parent_id = this.assets_parent_id

                if(this.itemNewDetailBOM.description == null || this.itemNewDetailBOM.code == null || this.itemNewDetailBOM.sequence == null || this.itemNewDetailBOM.amount_per_parent == null){
                    this.showCustom('bg-danger text-white', "Error","¡La información está incompleta!")
                }else{
                    var action = "insert"
                    if (this.itemNewDetailBOM.assets_parts_id != 0 ){
                        action = "update"
                    }
                    
                    infomainten.assetsParts(this.itemNewDetailBOM, action).then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
                        }else{
                            this.showCustom('bg-success text-white', "Registro Creado","¡El Registro se ha Creado con Éxito!")
                            // this.$emit('refresh',data.data)
                            this.tableParts = []
                            if(data.data != ""){
                                this.tableParts = data.data
                                // for (let index = 0; index < data.data.length; index++) {
                                //     const element = data.data[index];
                                //     if(element.bill_of_materials_id == item)
                                //         this.tableParts = element.details_materials
                                    
                                // }
                                
                                // this.tableBOM = data.data.details_materials
                                this.showAddEditMaterials=false
                                this.itemNewDetailBOM = { sequence:null,
                                                        assets_parts_id:0,
                                                        amount_per_parent:null,
                                                        parent_id:0,
                                                        assets_parts_child_id:null,
                                                        assets_id:null,
                                                        product_id:null
                                
                                }
                                this.valueProduct = ''
                            }
                        }
                    })
                }
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
            this.itemNewDetailBOM.description = item.description
            this.itemNewDetailBOM.code = item.code
            this.itemNewDetailBOM.product_id = item.product_id
            this.valueProduct = item.description
            this.itemProductSelected = item
        }
    },
}
</script>
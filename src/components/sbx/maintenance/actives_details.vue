<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Detalle de Activos</h4>
        <div class="w-100 text-right"></div>
        <!-- <b-container fluid> -->


<div class="card card-default">
    <div class="card-header">Información Básica</div>
        <div class="card-body">
            <b-row>
                <b-col sm="3" class="text-center">

                <img v-if="image != null" v-bind:src="image != null ? image.dataUrl: null" class="img-thumbnail" alt="Responsive image">

                <image-uploader
                    :preview="false"
                    :className="['sr-only', 'fileinput', { 'fileinput--loaded': hasImage }]"
                    capture="environment"
                    :debug="1"
                    doNotResize="gif"
                    :autoRotate="true"
                    outputFormat="verbose"
                    @input="setImage"
                    v-if="infoProduct.assets_id != 0"
                >
                
                <label for="fileInput" slot="upload-label">
                   <i class="fas fa-camera"></i>
                   <br>
                    <span class="upload-caption">{{
                        hasImage ? "Cambiar Imagen" : "Click para cargar la imagen"
                    }}</span>
                    </label>
                </image-uploader> 
                            
                </b-col>
                <b-col sm="9">
                    <b-row>
                        <b-col sm="12">
                            <b-form-input v-model="infoProduct.code" id="input-large" size="lg" placeholder="Nombre del Equipo"></b-form-input>
                        </b-col>
                        <b-col sm="12">
                            <b-row class="mt-2">
                                <b-col sm="6">
                                    <b-row>
                                        <b-col sm="5">
                                            <label for="textarea-small">Nº Activo:</label>
                                        </b-col>
                                        <b-col sm="7">
                                        <b-form-input
                                            v-model="infoProduct.active_nro"
                                            id="textarea-small"
                                            size="sm"
                                            placeholder="Numero de Activo"></b-form-input>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col sm="5">
                                            <label for="textarea-small">Modelo:</label>
                                        </b-col>
                                        <b-col sm="7">
                                        <b-form-input
                                            v-model="infoProduct.model"
                                            id="textarea-small"
                                            size="sm"
                                            placeholder="Small textarea"></b-form-input>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col sm="5">
                                        <label for="textarea-small">Nº Serie:</label>
                                        </b-col>
                                        <b-col sm="7">
                                        <b-form-input
                                            v-model="infoProduct.nro_serie"
                                            id="textarea-small"
                                            size="sm"
                                            placeholder="Numero de Serie"></b-form-input>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col sm="5">
                                            <label for="textarea-small">Centro de Costos:</label>
                                        </b-col>
                                        <b-col sm="7">
                                        <b-form-input
                                           v-model="infoProduct.cost_center"
                                            id="textarea-small"
                                            size="sm"
                                            placeholder="Centro de Costos"></b-form-input>
                                        </b-col>
                                    </b-row>

                                </b-col>
                                <b-col sm="6">
                                    <b-row>
                                        <b-col sm="5">
                                        <label for="textarea-small">Garantía Expira:</label>
                                        </b-col>
                                        <b-col sm="7">
                                        <b-form-input
                                            v-model="infoProduct.warranty_expiration"
                                            type="date"
                                            
                                            id="textarea-small"
                                            size="sm"
                                            placeholder="Expiración de Garanía"></b-form-input>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col sm="5">
                                            <label for="textarea-small">Costo:</label>
                                        </b-col>
                                        <b-col sm="7">
                                        <b-form-input
                                           v-model="infoProduct.price"
                                            id="textarea-small"
                                            size="sm"
                                            placeholder="Costo"></b-form-input>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col sm="5">
                                        <label for="textarea-small">Categoría:</label>
                                        </b-col>
                                        <b-col sm="7">
                                            <!-- v-model="objToEditRouteOperation.type_route_operation_id" :options="typeRouteOp" -->
                                        <b-select size="sm" v-model="infoProduct.category_id" :options="infoCategories" />
                                        </b-col>
                                    </b-row>
<!-- 
                                    <b-row>
                                        <b-col sm="5">
                                        <label for="textarea-small">Formulario Complementario:</label>
                                        </b-col>
                                        <b-col sm="7">
                                        <b-select size="sm" v-model="infoProduct.forms_id" :options="infoForms"/>
                                        </b-col>
                                    </b-row> -->

                                    <b-row>
                                        <b-col sm="5">
                                            <label for="textarea-small">Proveedor:</label>
                                        </b-col>
                                        <b-col sm="7">
                                            <!-- <b-form-input
                                                id="textarea-small"
                                                size="sm"
                                                placeholder="Proveedor"></b-form-input> -->
                                                <div class="position-relative mb-3">
                                                <b-input-group size="sm">
                                                    <b-input-group-text slot="prepend" v-if="loading" size="sm">
                                                        <i class="ion ion-md-sync"></i>
                                                    </b-input-group-text>
                                                    <b-input-group-text slot="prepend" v-if="!loading" size="sm">
                                                        <i class="ion ion-ios-search"></i>
                                                    </b-input-group-text>
                                                    <b-form-input type="text" class="form-control"
                                                        size="sm"
                                                        placeholder="Seleccione un proveedor"
                                                        autocomplete="off"
                                                        v-model="valueSelectedSupplier"
                                                        @keydown.down="down"
                                                        @keydown.up="up"
                                                        @keydown.enter="hit"
                                                        @keydown.esc="reset"
                                                        @blur="reset"
                                                        @input="updateQuerySupplier" />
                                                    <!-- <b-input-group-text size="sm" slot="append" v-if="isDirty || valueSelectedSupplier" @click="resetInput">
                                                        <i class="ion ion-md-close" ></i>
                                                    </b-input-group-text> -->
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
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <div class="text-right">
                <b-btn variant="success" @click="submit()">Guardar</b-btn>
            </div>
            </div>
                </div>
        <!-- </b-container> -->

        <div class="mt-2">
            <b-tabs content-class="mt-3" v-if="infoProduct.assets_id != 0" active>
                
                <b-tab title="Mantenimientos">
                    <div class="text-right">
                        <b-btn variant="outline-success borderless" class="btn-sm" @click.prevent="newMantenim()">
                            <span class="ion ion-md-add"></span>&nbsp;&nbsp;Adicionar Nuevo Mantenimiento
                        </b-btn>
                    </div>
                    <b-table small show-empty stacked="md" :fields="mantenimientoColumns" :items="mantenimientoTableData" class="mt-3">
                        <template v-slot:cell(description)="row">
                            {{row.item.description}}  &nbsp; &nbsp; <b-badge :variant="getInfoState(row.item.state, 'color')">{{getInfoState(row.item.state,'text')}}</b-badge> 
                        </template>
                        <template v-slot:cell(priority)="row">
                            <b-badge :variant="getInfoState(row.item.priority, 'priority')">{{row.item.priority}}</b-badge> 
                        </template>
                        <template v-slot:cell(edit)="row">
                            

                            <b-button size="xs" variant="outline-secondary" v-if="row.item.state == 'CE'" @click.prevent="mantConfig=true; infoDetalleMant = row.item"><i class="far fa-eye"></i> &nbsp; Cerrar OT</b-button>

                            <div class="text-left" v-if="row.item.state != 'CE'">
                                <b-dd variant="default" text="Acciones" :right="isRTL" size="xs">
                                    <b-dd-item @click.prevent="mantConfig=true; infoDetalleMant = row.item" v-if="accessControl(row.item.state, 'edit')"> <i class="ion ion-md-create text-success"></i> &nbsp; Editar</b-dd-item>
                                    <b-dd-item v-if="accessControl(row.item.state, 'edit') && row.item.maintenance_type=='preventivo' && row.item.percentage_use_pending == null"> <b-badge variant="danger">AJUSTAR FRECUENCIAS</b-badge> </b-dd-item>
                                    
                                    <b-dd-item @click.prevent="openActionConfirm(row.item,'AC')"  v-if=" row.item.maintenance_type!='preventivo' || (accessControl(row.item.state, 'edit') && row.item.percentage_use_pending != null)"> <i class="fas fa-exclamation text-warning"></i> &nbsp; Liberar</b-dd-item>
                                    <b-dd-divider></b-dd-divider>
                                    <b-dd-item  @click.prevent="openActionConfirm(row.item,'CN')"  v-if="accessControl(row.item.state, 'edit')"> <i class="ion ion-md-close text-danger"></i> &nbsp; Cancelar</b-dd-item>
                                </b-dd>
                                <!-- <b-btn variant="outline-success borderless icon-btn"  target="_blank"><i class="ion ion-md-create"></i></b-btn>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="delete_option_mp = 'grid'; loadInfoToDelete(row.item)"><i class="fas fa-exclamation"></i></b-btn> -->
                            </div>
                        </template>
                    </b-table>
                </b-tab>
                <b-tab title="Partes" @click="infobom()">
                    <bom-controller :assets_parent_id="infoProduct.assets_id" :src="src2" :assets_child_id="0" ref="bompt"></bom-controller>
                </b-tab>
                <b-tab title="Documentos">
                    <files-controller module="MNT" :module_id="infoProduct.assets_id" module_detail="docs"> </files-controller>
                </b-tab>
                <b-tab title="Información">

                </b-tab>
            </b-tabs>
        </div>
       
        <b-modal id="bv-modal-example" hide-footer v-model="mantConfig" size="xl">
            <template v-slot:modal-title>
                Creación de Orden de Trabajo
            </template>
            <maintenance-definition :assets_id="this.infoProduct.assets_id" :infoDetalle="infoDetalleMant" v-on:refresh="infoCreateMantn = $event"></maintenance-definition>
        </b-modal>

        <b-modal v-model="actionConfirm" hide-footer centered title="Confirmación de Acción">
            <h3 :class="infoDetalleMant.new_state == 'AC'?'text-success text-center':'text-danger text-center'">{{infoDetalleMant.new_state == "AC" ? 'Liberar Orden de Trabajo' : 'Cancelar la Orden de Trabajo' }}</h3>
            <h4 class="text-center">¿Desea Continuar?</h4>
            <b-form-group label-cols="12" label="" v-if="infoDetalleMant.new_state != 'AC'">
                <b-form-textarea
                    v-model="infoDetalleMant.comment"
                    id="textarea"
                    placeholder="Detalle..."
                    rows="3"
                    max-rows="6"></b-form-textarea>
            </b-form-group>
            <hr>
            <div class="text-right">
                <b-button size="md" variant="secondary" @click="actionConfirm = false">Cancelar</b-button>
                <b-button size="md" :variant="infoDetalleMant.new_state == 'AC'?'success':'danger'" :disabled="infoDetalleMant.new_state != 'AC' && infoDetalleMant.comment == ''" @click="updateState()">Confirmar</b-button>
            </div>
        </b-modal>

    </div>
</template>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
import Vue from "vue";
import Axios from 'axios'
import ImageUploader from 'vue-image-upload-resize'
import { infomaster } from '@/components/i40/js/master'
import { infosysconfig } from "@/components/i40/js/sysconfig";
import { config,master } from "@/components/i40/js/globals";
import { infomainten } from '@/components/i40/js/maintenance'

import Notifications from 'vue-notification'
import VueTypeahead from 'vue-typeahead'
// import BOMController from '@/components/sbx/maintenance/parts_controller'

import FilesController from '@/components/sbx/controls/files_controller'


Vue.use(ImageUploader);
Vue.use(Notifications)
// Vue.prototype.$http = Axios


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})

  export default {
    extends: VueTypeahead,
    watch: {

        '$route.params.id':function(value){
            // console.log('created2')
            this.valorID = value
            infomainten.plan(this.valorID, 'plan','select-id').then(data => {
                if(data.data != ""){
                    this.mantenimientoTableData = data.data
                }
            })
            if(this.valorID != "0"){    
                // console.log('created3')
                infomainten.assetsParts(this.valorID,"select").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error!")
                    }else{
                        if(data.data != ""){
                            this.details_materials = data.data
                        }else{
                            this.details_materials = []
                        }
                    }
                    }).catch(function (error) {
                        console.log(error.status)
                })
            }
        },

        'infoCreateMantn':function(value){
            this.valorID = this.$route.params.id
            infomainten.plan(this.valorID, 'plan','select-id').then(data => {
                if(data.data != ""){
                    this.mantenimientoTableData = data.data
                }
            })
            if(this.valorID != "0"){    
                infomainten.assetsParts(this.valorID,"select").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error!")
                    }else{
                        if(data.data != ""){
                            this.details_materials = data.data
                        }else{
                            this.details_materials = []
                        }
                    }
                    }).catch(function (error) {
                        console.log(error.status)
                })
            }
        }
    },
      components:{
          'maintenance-definition': () => import('./maintenance_definition.vue'),
          'files-controller':FilesController,
          'bom-controller': () => import('./parts_controller.vue'),
      },

    metaInfo: {
        title:"Detalle de Activos",
    },
    data() {
      return {
            actionConfirm:false,
            infoCreateMantn:0,
            infoDetalleMant:{
                plan_id:0,
                assets_id:this.assets_id,
                description:'',
                maintenance_type:null,
                priority:null,
                problem_definition:'',
                comment:''
             },
            mantConfig:false,
            hasImage: false,
            image: null,
            src: '',
            src2:'',
            valueSelectedSupplier:'',
            itemSelectedSupplier:{},
            itemSupplierProduct:{},
            infoProduct:{assets_id:0},
            mantenimientoTableData:[],
            mantenimientoColumns:[
                    {key:'plan_id', label:"OT"},
                    {key:'description', label:"Descripción"},
                    {key:'chart_created', label:"Fecha de Creacion"},
                    {key:'date_last_state_change', label:"Ultimo Estado"},
                    {key:'username', label:"Usuario"},
                    {key:'maintenance_type', label:"Tipo"},
                    {key:'priority', label:"Prioridad"},
                    {key:'edit', label:"Editar"},],

            infoFamilies:[],
            infoForms:[],
            infoCategories:[],
            details_materials:[],

            valorID: this.$route.params.id,

      }
    },
    methods: {
        getInfoState(state, cual){           
            if(cual=="color"){
                return infomainten.getColorState(state)
            }else if (cual=="text"){
                return infomainten.getTextState(state)
            }else if(cual == "priority"){
                return infomainten.getPriority(state)
            }
        },
        accessControl(state, cual){
            if(state=="CR"){
                if(cual == 'edit' || cual == "cancelar" || cual == "iniciar"){
                    return true
                }else{
                    return false
                }
            }else if(state=="CN" || state=="NA"){
                return false
            }else if(state=="CN"){
                if(cual == 'iniciar'){
                    return true
                }else{
                    return false
                }
            }
        },
        newMantenim(){
            this.infoDetalleMant={
                plan_id:0,
                assets_id:this.assets_id,
                description:'',
                maintenance_type:null,
                priority:null,
                problem_definition:'',
                comment:''
            }; 
            this.mantConfig=true
        },
        openActionConfirm(item, state){
            this.infoDetalleMant = item; 
            this.infoDetalleMant.new_state =state
            this.actionConfirm=true
            this.infoDetalleMant.comment = ''
        },

        updateState(){
            this.infoDetalleMant.assets_id = this.infoProduct.assets_id
            infomainten.plan(this.infoDetalleMant, 'plan', 'update-state').then(data =>{
                this.$emit('refresh',data.data)
                // console.log(data.data)
                this.mantenimientoTableData = data.data
            })
        },

        showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
        },

        submit(){
            if(this.validate_content()){
                infomainten.assets(this.infoProduct, this.infoProduct.assets_id === 0 ? "insert" : "update").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        if(this.infoProduct.assets_id === 0){
                            this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                            this.infoProduct = data.data[0]
                            this.$route.params.id = this.infoProduct.assets_id
                            this.$router.replace({ name: "assets_details", params: {id:this.infoProduct.assets_id}})
                        }
                        else
                            this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                        this.showData()
                        this.cancel()
                        
                    }
                    }).catch(function (error) {
                        console.log(error.status)
                    })
            }else{
                this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
            }
        },

        setImage: function(output) {
            this.hasImage = true;
            this.image = output;
            // console.log('Info', output)
            // console.log('Exif', output.exif)
        },

        onHit (item) {
            this.itemSelectedSupplier=item
                this.valueSelectedSupplier=item.name
                this.itemSupplierProduct.supplier_id = item.supplier_id
        },

        updateQueryTools () {
            this.query = this.valueSelectedTool
            this.update()
        },


        updateQueryCustomer(){
            this.query = this.valueSelectedCustomer
            this.update()
        },

        updateQuerySupplier(){
            this.query = this.valueSelectedSupplier
            this.update()
        },


        updateQuery () {
            this.query = this.value
            this.update()
        },

        resetInput () {
            this.value = ''
            this.valueSelectedTool=''
            this.reset()
        },

        formconfig(){
            this.infoForms = []
            this.infoCategories = []
            this.infoForms.push({value:null, text: ''})
            infosysconfig.forms([],"select").then(data => {
                if(data.data != "")
                    var array = data.data

                    // console.log(data.data)

                for (let index = 0; index < array.length; index++) {
                    const element = array[index];

                    if(element.forms_id == this.infoProduct.forms_id)
                        this.selected_forms = element
                    
                    this.infoForms.push({value: element.forms_id, text: element.description})
                }

            })

            infomainten.categories([],"select","").then(data => {
                    if(data.data != ""){
                        var array = data.data

                    // console.log(data.data)

                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            
                            this.infoCategories.push({value: element.categories_id, text: element.description})
                        }
                    }else{
                        // this.tableData = []
                        // this.totalRows= 0
                    }
                })
        },
        validate_content(){

                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este es un Campo Obligatorio'

            
                if (this.infoProduct.code == ''){
                    this.objState.code = 'invalid'
                    isOK = false;
                }else{
                    this.objState.code = 'valid'
                }

                return isOK
        ///Espacio para metodos propios del control
        ///Espacio para metodos propios del control
        
        },

        infobom(){
            if(this.valorID != "0"){    
                infomainten.assetsParts(this.valorID,"select").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error!")
                }else{
                    if(data.data != ""){
                        this.details_materials = data.data
                        this.$refs.bompt.tableParts = data.data 
                    }else{
                        this.details_materials = []
                    }
                }
                }).catch(function (error) {
                    console.log(error)
                })
        }
        }
    },
    mounted() {
        this.src2 = master+'productsearchmt/'
        if(this.valorID != "0"){
            infomainten.assets(this.valorID,"select-id").then(data => {
                    
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error!")
                    }else{
                        this.infoProduct = data.data[0]
                    }
                    }).catch(function (error) {
                        console.log(error.status)
                    })
        }
        this.src = master+'suppliersearch/'
        this.formconfig()
        infomainten.plan(this.valorID, 'plan','select-id').then(data => {
            if(data.data != ""){
                this.mantenimientoTableData = data.data
            }
        })


    },

    created() {
     this.valorID = this.$route.params.id
    this.infoProduct.assets_id = parseInt(this.$route.params.id)

    //    this.infobom()

    },
  }
</script>
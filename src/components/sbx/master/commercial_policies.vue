<template>
    <div>
                <!-- <notifications group="notifications-default" /> -->
        <h4 class="font-weight-bold py-3 mb-0">Configuración Comercial</h4>

        <div>
            <div class="row">
                <div class="col text-center">
                    <!-- <h3>Propiedades</h3> -->
                    <b-form-group class="text-left">
                        <label class="switcher switcher-success">
                            <input type="checkbox" class="switcher-input"  v-model="ctrlOrdersSyncBox" @change="changeStatus('ctrl', ctrlOrdersSyncBox)">
                            <span class="switcher-indicator">
                            <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                            <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                            </span>
                            <span class="switcher-label">¿Activar el Control del Pedido desde SyncBox?</span>
                        </label>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col text-center">
                    <!-- <h3>Propiedades</h3> -->
                    <b-form-group class="text-left">
                        <label class="switcher switcher-success">
                            <input type="checkbox" class="switcher-input"  v-model="autoConsecutive" @change="changeStatus('consec', autoConsecutive)">
                            <span class="switcher-indicator">
                            <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                            <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                            </span>
                            <span class="switcher-label">¿El consecutivo de este modulo depende de otro sistema de información?</span>
                        </label>
                    </b-form-group>
                </div>
            </div>
            <!-- <div class="row">
                <div class="col">
                    <b-form-group label-cols="4" label-cols-lg="2" label="Bodega De Entregas" label-for="input-sm">
                        <b-form-select id="`type-pedido`" v-model="selectedWarehouse" :options="warehouse"  @change="changeStatus('warehouse', warehouse)"></b-form-select>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <b-form-group label-cols="4" label-cols-lg="2" label="Movimiento de Salidas por Defecto" label-for="input-sm">
                        <b-form-select id="`type-pedido`" v-model="selectedMoves" :options="moves"  @change="changeStatus('moves', moves)"></b-form-select>
                    </b-form-group>
                </div>
            </div> -->
        </div>


        <b-nav class="justify-content-center mt-2 mb-2">
            <b-nav tabs class="nav-sm tabs-alt">
                <b-nav-item :active="localSelectTab=='local_orders'" @click="controlState('local_orders', 'local')">Pedidos Nacionales </b-nav-item>
                <b-nav-item :active="localSelectTab=='local_quotation'" @click="controlState('local_quotation', 'local')">Cotizaciones Nacionales</b-nav-item>
                <b-nav-item :active="localSelectTab=='international_orders'" @click="controlState('international_orders', 'international')">Pedidos Internacionales </b-nav-item>
                <b-nav-item :active="localSelectTab=='international_quotation'" @click="controlState('international_quotation', 'international')">Cotizaciones Internacionales</b-nav-item>
            </b-nav>
        </b-nav>

        <div v-if="localSelectTab=='local_orders' || localSelectTab=='international_orders'">

            <b-tabs class="w-100 nav-tabs-left mb-2">
                <b-tab  title="General" active>
                    <div class="m-2">
                        <b-row class="mt-2">
                            <b-col sm="4">
                                <label class="mt-2" for="type-pedido">Tipo de Documento por Defecto:</label>
                            </b-col>
                            <b-col sm="8">
                                <b-form-select id="`type-pedido`" v-model="selectedDoc" :options="document_types"></b-form-select>
                            </b-col>
                        </b-row>
                        <b-row class="mt-2">
                            <b-col sm="4">
                                <label class="mt-2" for="type-state">Estado de Creación:</label>
                            </b-col>
                            <b-col sm="8">
                                <b-form-select id="`type-state`" v-model="selectedActiveState" :options="info_states"></b-form-select> 
                            </b-col>
                        </b-row>
                        <b-row class="mt-2">
                            <b-col sm="4">
                                <label class="mt-2" for="type-del">Estado Cancelado/Eliminado:</label>
                            </b-col>
                            <b-col sm="8">
                                    <b-form-select id="`type-del`" v-model="selectedDisabledState" :options="info_states"></b-form-select>
                            </b-col>
                        </b-row>
                        <b-row class="mt-2">
                            <b-col sm="4">
                                <label class="mt-2" for="type-del">% Descuento Comercial General:</label>
                            </b-col>
                            <b-col sm="8">
                                    <b-input id="`type-del`" v-model="percentaje_max_comm"></b-input>
                            </b-col>
                        </b-row>
                        <b-row class="mt-2">
                            <b-col sm="4">
                                <label class="mt-2" for="type-del">Equipo de Ventas:</label>
                            </b-col>
                            <b-col sm="8">
                                <multiselect
                                    v-model="salesTeams"
                                    label="username"
                                    track-by="username"
                                    placeholder=""
                                    :options="optionsTeams"
                                    :multiple="true"
                                    :searchable="true"
                                    :internal-search="true"
                                    :clear-on-select="false"
                                    :close-on-select="false"
                                    :hide-selected="true">
                                    <span slot="noResult">No found.</span>
                                </multiselect>
                            </b-col>
                        </b-row>
                        <b-row class="mt-2">
                            <b-col sm="12">
                                <div class="row">
                                    <div class="col text-center">
                                        <!-- <h3>Propiedades</h3> -->
                                        <b-form-group class="text-left">
                                            <label class="switcher switcher-success">
                                                <input type="checkbox" class="switcher-input"  v-model="millarUm">
                                                <span class="switcher-indicator">
                                                <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                                <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                                </span>
                                                <span class="switcher-label">Activar Cambio de Unidad de Medida a Millar, lo que se traduce en que las cantidades serán dividas por 1.000 (mil)</span>
                                            </label>
                                        </b-form-group>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>
                        <div class="text-right">
                            <b-btn variant="success" @click="saveConfig()">Guardar Configuración</b-btn>
                        </div>
                    </div>
                </b-tab>
                <b-tab  title="Acuerdos">
                    <div class="m-2">
                        <b-input-group>
                            <b-form-input v-model="labelOrderPol" placeholder="Etiqueta" autocomplete="off"></b-form-input>
                            <b-form-input v-model="defaultValueOrderPol" placeholder="Valor por Defecto" autocomplete="off"></b-form-input>
                            <b-input-group-prepend is-text>
                               <input v-model="isEditOrderPol" type="checkbox" aria-label="Campo Editable">
                            </b-input-group-prepend>
                            <b-input-group-append>
                                <b-btn variant="success icon-btn" @click="saveOrderPolic()"><i class="fas fa-plus"></i></b-btn>
                            </b-input-group-append>
                        </b-input-group>

                        <b-table :fields="columns" :items="jsonOrderPolicies">
                            <template v-slot:cell(edit)="row">
                                <div>
                                    <b-btn variant="outline-warning borderless icon-btn" class="btn-xs" @click.prevent="data_changeOrderPoli(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_changeOrderPoli(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                                </div>
                            </template>
                        </b-table>
                    </div>
                </b-tab>
                <b-tab  title="Formato">
                    <div class="m-2">
                        <!-- <b-row>
                            <b-col class="d-none d-sm-none d-md-block"> -->
                                <b-form-group label=" Titulo Superior" class="mt-1 ml-1">
                                    <b-form-textarea placeholder="Titulo Superior"
                                        rows="5"
                                        max-rows="50"
                                        v-model="header"
                                    ></b-form-textarea>
                                </b-form-group>
                            <!-- </b-col>
                            <b-col class="d-none d-sm-none d-md-block" > -->
                                <b-form-group label=" Texto Superior Pie de Pagina" class="mt-1">
                                    <!-- <b-form-textarea placeholder="Notas de la Transportadora"
                                        rows="5"
                                        max-rows="1"
                                        v-model="commenttransp"
                                    ></b-form-textarea> -->
                                    <b-form-input v-model="footer1" placeholder="Etiqueta" autocomplete="off"></b-form-input>
                                </b-form-group>
                                <hr style="padding:0px;margin:0px">
                                <b-form-group label=" Informacion de Pagos" class="mt-1">
                                    <b-form-textarea placeholder="Informacion de Pagos"
                                        rows="1"
                                        max-rows="50"
                                        v-model="footer"
                                    ></b-form-textarea>
                                </b-form-group>
                            <!-- </b-col>
                        </b-row> -->
                        <b-btn block variant="success" @click="saveConfig()">Guardar Configuración</b-btn>
                    </div>
                </b-tab>
            </b-tabs>


        </div>

        <div v-if="localSelectTab=='local_quotation' || localSelectTab=='international_quotation'" class="mt-2">
             <b-tabs class="w-100 nav-tabs-left mb-2">
                <b-tab  title="Acuerdos de Negociación" active>
                    <div class="m-2">
                        <b-input-group>
                            <b-form-input v-model="labelPol" placeholder="Etiqueta" autocomplete="off"></b-form-input>
                            <b-form-input v-model="defaultValuePol" placeholder="Valor por Defecto" autocomplete="off"></b-form-input>
                            <b-input-group-prepend is-text>
                               <input v-model="isEditPol" type="checkbox" aria-label="Campo Editable">
                            </b-input-group-prepend>
                            <b-input-group-append>
                                <b-btn variant="success icon-btn" @click="savePolic()"><i class="fas fa-plus"></i></b-btn>
                            </b-input-group-append>
                        </b-input-group>

                        <b-table :fields="columns" :items="jsonPolicies">
                            <template v-slot:cell(edit)="row">
                                <div>
                                    <b-btn variant="outline-warning borderless icon-btn" class="btn-xs" @click.prevent="data_changePoli(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_changePoli(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                                </div>
                            </template>
                        </b-table>
                    </div>
                </b-tab>
                <b-tab  title="Información de Pagos">
                    <div class="m-2">
                        <b-input-group>
                            <b-form-input v-model="labelPay" placeholder="Etiqueta" autocomplete="off"></b-form-input>
                            <b-form-input v-model="defaultValuePay" placeholder="Valor por Defecto" autocomplete="off"></b-form-input>
                            <b-input-group-prepend is-text>
                               <input  v-model="isEditPay" type="checkbox" aria-label="Campo Editable">
                            </b-input-group-prepend>
                            <b-input-group-append>
                                <b-btn variant="success icon-btn" @click="savePays()"><i class="fas fa-plus"></i></b-btn>
                            </b-input-group-append>
                        </b-input-group>

                        <b-table :fields="columns" :items="jsonPays">
                            <template v-slot:cell(edit)="row">
                                <div>
                                    <b-btn variant="outline-warning borderless icon-btn" class="btn-xs" @click.prevent="data_changePays(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_changePays(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                                </div>
                            </template>
                        </b-table>
                    </div>
                </b-tab>
             </b-tabs>
        </div>
           
          
    </div>
</template>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import { infosysconfig } from "@/components/i40/js/sysconfig";
import { infoconfig } from "@/components/i40/js/config";
import Multiselect from 'vue-multiselect'
import {infousers} from '@/components/i40/js/users'
import { infoinventory } from "@/components/i40/js/inventory";

export default {

        metaInfo: {
            title: 'Configuración Comercial'
        },
        components: {
            Multiselect,
        },
    data() {
        return {
            warehouse:[],
            moves:[],

            header:null,
            footer:null,
            footer1:null,

            selectedWarehouse:null, 
            selectedMoves:null,
            
            salesTeams:[],
            optionsTeams:[],
            item_result:{},
            ctrlOrdersSyncBox:false,
            autoConsecutive:false,
            selectedNacionalState:null,

            selectedDoc:null,
            selectedActiveState:null,
            selectedDisabledState:null,
            millarUm:false,
            localSelectTab:'local_orders',
            internationalSelectTab:'local_orders',
            moduleDependency:false,
            info_order_type:[],
            document_type:null,

            info_states: [],
            document_types:[],

            jsonPolicies:[],
            jsonPays:[],
            labelPol:'',
            defaultValuePol:'',
            percentaje_max_comm:0,
            isEditPol:false,

            jsonOrderPolicies:[],
            jsonPays:[],
            labelOrderPol:'',
            defaultValueOrderPol:'',
            isEditOrderPol:false,

            labelPay:'',
            defaultValuePay:'',
            isEditPay:false,
            mod:'local',

            columns: [
                {key:'label', label:'Etiqueta'},
                {key:'default', label:'Valor por Defecto'},
                {key:'isEdit', label:'Es Editable'},
                
                {key:'edit', label:"Edit"}
            ],

        }
    },
    methods: {
        
        loadConfig(){
            let result = {}
            result.code = '001'
            result.module = this.mod
            infosysconfig.commercialcontroller(result, "get").then(data => {

                // console.log(data.data)
                this.selectedDoc=data.data[0].document_default
                this.selectedActiveState=data.data[0].status_created_id
                this.selectedDisabledState=data.data[0].status_deleted_id
                this.millarUm=data.data[0].millar
                this.jsonPolicies=data.data[0].national_policies
                this.jsonPays=data.data[0].pay_policies
                this.jsonOrderPolicies=data.data[0].orders_policies
                this.header = data.data[0].header
                this.footer = data.data[0].footer
                this.footer1 = data.data[0].footer1
                this.percentaje_max_comm = data.data[0].percentaje_max_comm
                // console.log(this.jsonOrderPolicies)

            })
        },

        saveConfig(){
            let result = {}
            result.code = '001'
            result.module = this.mod
            result.profile_name = 'default'
            result.document_default = this.selectedDoc
            result.status_created_id = this.selectedActiveState
            result.status_deleted_id = this.selectedDisabledState
            result.millar = this.millarUm
            result.national_policies = this.jsonPolicies
            result.pay_policies = this.jsonPays
            result.orders_policies = this.jsonOrderPolicies
            result.header = this.header
            result.footer = this.footer
            result.footer1 = this.footer1
            result.percentaje_max_comm = this.percentaje_max_comm
            
            infosysconfig.commercialcontroller(result, "update").then(data => {})
            
            this.salesTeams.module = this.localSelectTab

            for (let index = 0; index < this.salesTeams.length; index++) {
                this.salesTeams[index].module = this.localSelectTab
            }

            infoconfig.teamsconfig(this.salesTeams, "update").then(team =>{
                
            })

        },

        savePolic(){
            let pos = -1
            for (let index = 0; index < this.jsonPolicies.length; index++) {
                const element = this.jsonPolicies[index];
                if(element.label == this.labelPol){
                    pos = index
                }
            }

            if(pos == -1)
                this.jsonPolicies.push({label:this.labelPol, default: this.defaultValuePol, isEdit: this.isEditPol})
            else{
                this.jsonPolicies[pos].label = this.labelPol
                this.jsonPolicies[pos].default = this.defaultValuePol
                this.jsonPolicies[pos].isEdit = this.isEditPol
            }

            this.saveConfig()

            this.labelPol = null
            this.defaultValuePol = null
            this.isEditPol = null
        },
        
        saveOrderPolic(){

            let pos = -1
            for (let index = 0; index < this.jsonOrderPolicies.length; index++) {
                const element = this.jsonOrderPolicies[index];

                if(element.label == this.labelOrderPol){
                    pos = index
                }
                
            }

            if(pos == -1)
                this.jsonOrderPolicies.push({label:this.labelOrderPol, default: this.defaultValueOrderPol, isEdit: this.isEditOrderPol})
            else{
                this.jsonOrderPolicies[pos].label = this.labelOrderPol
                this.jsonOrderPolicies[pos].default = this.defaultValueOrderPol
                this.jsonOrderPolicies[pos].isEdit = this.isEditOrderPol
            }

            this.saveConfig()

            this.labelOrderPol = null
            this.defaultValueOrderPol = null
            this.isEditOrderPol = null
        },

        savePays(){
            let pos = -1
            for (let index = 0; index < this.jsonPays.length; index++) {
                const element = this.jsonPays[index];

                if(element.label == this.labelPay){
                    pos = index
                }
                
            }

            if(pos == -1)
                this.jsonPays.push({label:this.labelPay, default: this.defaultValuePay, isEdit: this.isEditPay})
            else{
                this.jsonPays[pos].label = this.labelPay
                this.jsonPays[pos].default = this.defaultValuePay
                this.jsonPays[pos].isEdit = this.isEditPay
            }


            this.saveConfig()

            this.labelPay = null
            this.defaultValuePay = null
            this.isEditPay = null
        },

        data_changePoli(value, event){

            let pos = -1

            for (let index = 0; index < this.jsonPolicies.length; index++) {
                const element = this.jsonPolicies[index];

                if(element.label == value.label){
                    pos = index
                }
                
            }

            if(pos != -1){
                if(event == 'delete'){
                    this.jsonPolicies.splice(pos,1)
                    this.saveConfig()
                }
                else{
                    this.labelPol = value.label
                    this.defaultValuePol = value.default
                    this.isEditPol = value.isEdit
                }
            }
        },

        data_changeOrderPoli(value, event){
            console.log(value, event)

            let pos = -1

            for (let index = 0; index < this.jsonOrderPolicies.length; index++) {
                const element = this.jsonOrderPolicies[index];

                if(element.label == value.label){
                    pos = index
                }
                
            }

            if(pos != -1){
                if(event == 'delete'){
                    this.jsonOrderPolicies.splice(pos,1)
                    this.saveConfig()
                }
                else{
                    this.labelOrderPol = value.label
                    this.defaultValueOrderPol = value.default
                    this.isEditOrderPol = value.isEdit
                }
            }
        },

        data_changePays(value,event){
            let pos = -1

            for (let index = 0; index < this.jsonPays.length; index++) {
                const element = this.jsonPays[index];

                if(element.label == value.label){
                    pos = index
                }
            }
            if(pos != -1){
                if(event == 'delete'){
                    this.jsonPays.splice(pos,1)
                    this.saveConfig()
                }
                else{
                    this.labelPay = value.label
                    this.defaultValuePay = value.default
                    this.isEditPay = value.isEdit
                }
            }
        },

        controlState:function(value, mod){
            this.salesTeams=[]
            this.optionsTeams=[]
            this.mod=mod
            this.localSelectTab=value

            this.selectedActiveState={}
            this.selectedDisabledState={}
            this.selectedDoc={}


            this.selectedDoc=null
            this.selectedActiveState=null
            this.selectedDisabledState=null
            this.millarUm=null
            this.jsonPolicies=[]
            this.jsonOrderPolicies=[]
            this.jsonPays=[]

            this.loadConfig()
            this.teamsConfig()
        },

        changeStatus(code, value){
            infosysconfig.sbxconfig("orders", code, value, "update").then(data => {})
        },

        showData: function(){
            let objInfo = {}
            objInfo.module = "orders"
            infosysconfig.documentstatus(objInfo, "select").then(data => {
                if(data.data != ''){
                    for (let index = 0; index < data.data.length; index++) {
                        const element = data.data[index];
                        this.info_states.push({value:element.status_id,text:element.description})
                    }
                }else{
                    this.info_states = []
                }
            })

            infosysconfig.documenttype([],"select").then(data => {
                if(data.data != ""){
                    for (let index = 0; index < data.data.length; index++) {
                        const element = data.data[index];
                        if(element.module=="1")
                        this.document_types.push({value:element.code,text:element.description})
                    }
                }else{
                    this.document_types = []
                }
            })

            infosysconfig.sbxconfig("orders","_", "_", "get").then(data => {
                if(data.data != ""){
                    for (let index = 0; index < data.data.length; index++) {
                        const element = data.data[index];

                        if(element.code=="ctrl")
                            this.ctrlOrdersSyncBox = element.value == "true" ? true : false
                        if(element.code=="consec")
                            this.autoConsecutive = element.value == "true" ? true : false
                        
                    }
                }
            })
        },

        teamsConfig(){

            infousers.getnumber().then(data =>{
                this.optionsTeams = data.data

                infoconfig.teamsconfig({module: this.localSelectTab}, "get").then(team =>{
                    let values = team.data
                    for (let index = 0; index < values.length; index++) {
                        const elementTeams = values[index];
                        for (let index = 0; index < this.optionsTeams.length; index++) {
                            const elementOptions = this.optionsTeams[index];
                            if(elementOptions.iduser == elementTeams.user_id){
                                this.salesTeams.push(elementOptions)
                            }
                        }
                    }
                })
            })
        },
    },

    created() {
        this.showData()
        this.loadConfig()
        this.teamsConfig()



        infoinventory.warehouse([],"get").then(data => {
            if(data.data != ""){
                for (let index = 0; index < data.data.length; index++) {
                    const element = data.data[index];
                    this.warehouse.push({value:element.warehouse_id,text:element.name})
                }
            }else{
                this.warehouse = []
            }
        })

        infosysconfig.movtype([],"select").then(data => {
            if(data.data != ""){
                for (let index = 0; index < data.data.length; index++) {
                    const element = data.data[index];
                    this.moves.push({value:element.code,text:element.description})
                }
            }else{
                this.moves = []
            }
        })

    },
}
</script>
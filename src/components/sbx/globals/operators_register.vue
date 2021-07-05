<template>
    <div>

        <div v-if="itemselected.wscode != null" class="alert alert-warning text-center" role="alert">
            Este Usuario Está Conectado en el Centro de Trabajo <b>{{itemselected.wscode}}</b>.
        </div>
        <div class="row" v-if="!show_all_operators">
            <div class="col-9">
                <multiselect
                    v-model="itemselected"
                    :options="info_operator"
                    label="concat"
                    :searchable="true"
                    :show-labels="false"
                    placeholder="Codigo del Paro"
                />
            </div>
            <div class="col-3">
                <b-button :variant="this.itemselected.wscode == null ? 'success' : 'warning'" @click="add_operator()">Adicionar Operario</b-button>
            </div>
        </div>

        <div class="mt-2 mb-2"></div>

        <b-table small show-empty stacked="md" :items="tableData" :fields="columns">
            <template v-slot:cell(edit)="row">
                <div class="text-center">
                    <!-- <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="showDetailsProductionOrders"><i class="ion ion-md-information-circle-outline"></i></b-btn> -->
                    <!-- <b-btn v-b-tooltip.html variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="selectOrder(props.item)"><i class="ion ion-md-checkmark"></i></b-btn> -->
                    <b-btn variant="outline-danger borderless icon-btn" v-if="show_panel_confirm == false" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                    <div v-if="show_panel_confirm && row.item.personal_id == selected_item.personal_id">
                        <b-btn variant="danger" class="btn-xs" @click.prevent="data_change(row.item,'confirm')">Confirmar</b-btn>
                        <b-btn variant="success" class="btn-xs" @click.prevent="data_change(row.item,'cancel')">Cancelar</b-btn>
                    </div>
                </div>
            </template>
        </b-table>
        <div class="d-flex justify-content-between">
            <div>
                
            </div>
            <div class="text-muted">
                <small> Total Operarios: {{this.totalRows}} </small>
            </div>
        </div>
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<script>
import Multiselect from 'vue-multiselect';
import { infoproduction } from "@/components/i40/js/production";

export default {
    components:{
        Multiselect
    },
    data() {
        return {
            info_base:{},
            totalRows:0,
            tableData:[],
            columns: [
                    {key:'concat', label:"Nombre"},
                    {key:'elapsed_time', label:"Minutos Conectado"},
                    // {key:'salary', label:"Salario"},
                    // {key:'date_of_admission', label:"Fecha de Ingreso"},
                
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Edit"}
                ],

            itemselected:{},
            info_operator:[],
            show_panel_confirm: false,
            selected_item:{},
            show_all_operators:false,
        }
    },

    methods: {
        loadinfo(info){
            this.info_base = info
            this.show_all_operators = false
            this.itemselected = {}
            this.columns= [
                {key:'concat', label:"Nombre"},
                {key:'last_connection', label:"Fecha Conexion"},
                {key:'elapsed_time', label:"Minutos Conectado"},
                    // {key:'salary', label:"Salario"},
                    // {key:'date_of_admission', label:"Fecha de Ingreso"},
                
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                {key:'edit', label:"Edit"}
            ],

            infoproduction.loadoperators("select", "{}").then(data =>{
                this.info_operator=data.data
            })
            
            infoproduction.loadoperators("select_ws", this.info_base.wscode).then(data =>{
                this.tableData = []
                this.totalRows = 0
                if(data.data != ""){
                    this.tableData=data.data
                    this.totalRows= this.tableData.length
                }
            })
        },

        load_all_operators(){
            this.show_all_operators = true
            this.itemselected = {}
            this.columns= [
                {key:'concat', label:"Nombre"},
                {key:'last_connection', label:"Fecha Conexion"},
                {key:'elapsed_time', label:"Minutos Conectado"},
                {key:'wscode', label:"Centro Trabajo"},
                {key:'edit', label:"Edit"}
            ],
            
            infoproduction.loadoperators("select_all", "{}").then(data =>{
                this.tableData=data.data
                this.totalRows= this.tableData.length
            })
        },

        add_operator(){
            if(this.itemselected.workstation_id == null){
                this.itemselected.workstation_id=JSON.parse(this.info_base.wsinfo)[0].workstation_id
            }
            infoproduction.loadoperators("add_working", '{"personal_id":' + this.itemselected.personal_id +',"workstation_id":' + this.itemselected.workstation_id + '}').then(data =>{
                this.tableData=data.data
                this.totalRows= this.tableData.length
                this.itemselected={}
            })
        },

        data_change(item, action){
            if(action == "delete"){
                this.show_panel_confirm = true
                this.selected_item = item
            } else if (action == "confirm"){
                infoproduction.loadoperators("remove", '{"personal_id":'+ this.selected_item.personal_id +',"workstation_id":'+ this.selected_item.workstation_id + '}').then(data =>{
                    this.load_all_operators()

                    infoproduction.loadoperators("select_ws", this.info_base.wscode).then(data =>{
                        this.tableData = []
                        this.totalRows = 0
                        if(data.data != ""){
                            this.tableData=data.data
                            this.totalRows= this.tableData.length
                        }
                    })
                    this.show_panel_confirm = false
                })
            } else if(action == "cancel"){
                this.show_panel_confirm = false
            }
        }
    },
}
</script>

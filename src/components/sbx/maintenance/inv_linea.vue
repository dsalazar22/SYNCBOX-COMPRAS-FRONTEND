<template>
    <div>
          
        <h4 class="font-weight-bold py-3 mb-4">Inventario en Línea Mantenimiento</h4>

        <b-row>
            <b-col md="6" class="my-1">
                <b-input-group>
                    <b-form-input v-model="filter" placeholder="Buscar..." />
                    <b-input-group-append>
                    <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
            <b-col md="6" class="my-1">
                <b-form-select :options="pageOptions" v-model="perPage" />            
            </b-col>
            <!-- <b-col md="2" class="my-1">
                <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="newstopcode"><i class="ion ion-md-add"></i></b-btn>
                <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
            </b-col> -->
        </b-row>

        <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" :filter="filter" @filtered="onFiltered">
            <template v-slot:cell(edit)="row">
                <div class="text-left">
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="open_details(row.item)"><i class="ion ion-md-create"></i></b-btn>
                    <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="onCalendar(row.item)"><i class="fas fa-calendar"></i></b-btn> -->
                </div>
            </template>
            <template v-slot:cell(requested_amount)="row">
                <div class="text-right">
                    {{Math.floor(row.item.requested_amount * 100) / 100}}
                </div>
            </template>
            <template v-slot:cell(programmed_amount)="row">
                <div class="text-right">
                    {{Math.floor(row.item.programmed_amount * 100) / 100}}
                </div>
            </template>
            <!-- <template v-slot:cell(total)="row">
                <div class="text-right">
                    {{Math.floor(row.item.total * 100) / 100}}
                </div>
            </template> -->
        </b-table>
        <div class="d-flex justify-content-between">
            <div>
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
            </div>
            <div class="text-muted">
                <small> Total Código de Paro: {{this.totalRows}} </small>
            </div>
        </div>

        <b-modal id="modals-top" v-model="show_details"  class="modal-center" size="lg">
            <div slot="modal-title">
            Información <span class="font-weight-light">Detalle</span><br>
            </div>
            
             <b-table small show-empty stacked="md" :fields="columnsDetail" :items="dataDetail">
                </b-table>
           
        </b-modal>

    </div>
</template>
<script>
import { infoplanning } from "@/components/i40/js/iplanning";
import { infomainten } from '@/components/i40/js/maintenance'

export default {
    data() {
        return {
            columns: [
                {key:'code', label:"Código"},
                {key:'description', label:"Descripción"},
                {key:'unity_measure', label:"Unidad Medida"},
                // {key:'type_product', label:"Tipo de Producto"},
                {key:'pending', label:"Inventario"},
                {key:'total_requerido', sortable: true, label:"Total Requerido"},
                {key:'inventary', sortable: true, label:"Cantidad Pedida"},
                {key:'programmed', sortable: true, label:"Cantidad Programada"},
                {key:'total', sortable: true, label:"Total"},
                {key:'edit', label:"Edit"}
            ],

            tableData:[],
        

            columnsDetail:[
                // {key:'order_id',label:'# Pedido'},
                {key:'assets_code',label:'Código'},
                {key:'active_nro',label:'Activo'},
                {key:'amount_per_parent',label:'Cantidad Requerida'}
            ],
            dataDetail:[],
            show_details:false,
            currentPage: 1,
            perPage: 50,
            totalRows: 0,
            pageOptions: [ 50, 100, 200 ],
            filter: null,
            show:false,
        }
    },

    methods: {
        ///Funcion para cargar la ayuda del helper
            openHelp: function(){
                //  this.contentWiki = "# FFFF"
                ApiWikiHelp(this.version, this.name).then(data => {
                    this.contentWiki = data.data
                })
                .catch(data =>{
                    this.contentWiki = data.data
                })
                this.$refs.longModal.open()
            },
        ///Funcion para cargar la ayuda del helper
            showData: function(){
                infomainten.invLinea([],'select').then(data =>{
                    // console.log(JSON.parse(data.data))
                    if(data.data!=""){
                        this.tableData = data.data
                        this.totalRows= this.tableData.length
                    }
                })
            },

        onFiltered (filteredItems) {
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },

        onCalendar(item){
            infoplanning.getcalendarmps([],item.product_id).then(data =>{
                if(data.data!=""){
                    // console.log(data.data)
                    this.calendar = JSON.parse(data.data)
                }
            })

            this.show_calendar = true
        },

        open_details(item){
           this.dataDetail=item.details
           this.show_details=true
        }
    },

    created() {
        this.showData()
    },
}
</script>

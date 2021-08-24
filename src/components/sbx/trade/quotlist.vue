<template>
<!-- :fields="columns" -->
    <div>
        <h4 class="font-weight-bold py-3 mb-0"> Lista de Cotizaciones </h4>

        <div class="row">
            <div class="col">
                <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            <b-row>

                <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->
                <b-col md="6" class="my-1">
                    <b-input-group>
                        <b-form-input v-model="filter" placeholder="Buscar..." />
                        <b-input-group-append>
                        <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
                <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->

                <!-- ESTE ES EL PAGINADOR -->
                <b-col md="6" class="my-1">
                    <b-form-select :options="pageOptions" v-model="perPage" />
                </b-col>
                
                <!-- ESTE ES EL PAGINADOR -->

                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->

                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->


                
                <b-table :sticky-header="false" :no-border-collapse="false" responsive style="font-size:14px"
                    :items="tableCommercialsOrders"  :fields="columnsCommercialsOrders"  :current-page="currentPage" :per-page="perPage">
                            <template v-slot:cell(edit)="row">
                                <b-dropdown variant="default btn-xs icon-btn md-btn-flat hide-arrow">
                                    <!-- {{props.item}} -->
                                    <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                    <!-- <b-dropdown-item href="javascript:void(0)">Ver Perfil</b-dropdown-item> -->
                                    <!-- <b-dropdown-item v-if="props.item.produced_amount == 0" @click.prevent="$refs.cancelarJob.open();selected_production_order=props.item; type_event_selected_order='cancel'" ><i class="ion ion-md-close text-danger"></i> &nbsp;&nbsp;Cancelar Activadad</b-dropdown-item> -->
                                    
                                    <b-dropdown-item :href="'/comm/cot/local/' + row.item.quotation_id" > &nbsp;&nbsp;Editar Cotizacion</b-dropdown-item>

                                    <!-- <b-dropdown-item href="javascript:void(0)"><i class="ion ion-md-resize"></i> &nbsp;&nbsp;Dividir Actividad</b-dropdown-item> -->

                                    <!-- <b-btn variant="outline-success icon-btn m-r-1" class="btn-xs" @click.prevent="showEditOrder=true;infosend=props.item"><i class="ion ion-md-create"></i></b-btn> -->
                                    <!-- <b-dropdown-item href="javascript:void(0)">Eliminar</b-dropdown-item> -->
                                </b-dropdown>
                               <!-- <span> <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/cfpr/routes/details/'}" target="_blank"><i class="ion ion-md-create"></i></b-btn> </span>{{props.item.code}} -->
                            </template>
                  
                    </b-table>
                    
                <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div  class="w-25">
                        <small class="text-muted"> Total Clientes Cartera: {{totalRows}} </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<script>
import { infotrade } from "@/components/i40/js/trade";
import Multiselect from 'vue-multiselect'
import VueMarkdown from 'vue-markdown'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import {infousers} from '@/components/i40/js/users'
import { infosysconfig } from "@/components/i40/js/sysconfig";


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
    
    metaInfo: {
       title: ' Lista de Cotizaciones'
    },
    components: {
            VueMarkdown,
            SweetModal,
            Multiselect
        },

    watch:{
        'filter':function(value){
            this.tableCommercialsOrders = this.filter_tableData.filter(function (task) {
                if(task.nit.toLowerCase().includes(value.toLowerCase()) || task.name.toLowerCase().includes(value.toLowerCase()))
                    return task
            });
            this.totalRows = this.tableCommercialsOrders.length
            this.currentPage = 1
            // this.onFiltered(this.tableCommercialsOrders)
        },
    },

    data() {
        return {
            tableCommercialsOrders:[],
            filter_tableData:[],
            columnsCommercialsOrders: [
                    {key:'username', label:"Asesor", stickyColumn: true},
                    {key:'nit', label:"NIT"},
                    {key:'name', label:"Cliente"},
                    {key:'date', label:"Fecha Creación"},
                    {key:'total_versions', label:"#Versiones"},
                    
                    {key:'edit', label:"Action"},
                ],

            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla

            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },
        }
    },
    methods: {

        numberWithCommas(x) {
            if(x == null)
                x=0
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },

        loadcartera(){
            infotrade.quotcontroller([],"getall").then(data =>{
                // console.log(data.data)
                if(data.status == 200){
                    if(data.data != '')
                        this.tableCommercialsOrders = []
                        this.filter_tableData = []
                        if(data.data != ""){
                            this.tableCommercialsOrders = data.data
                            this.filter_tableData = data.data
                            this.totalRows = this.tableCommercialsOrders.length
                        }
                    }
            })
        },

        
        check_access(control, action){
            return infousers.check_access(control,action)
        }, 
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
    },
    created(){
        this.loadcartera()
    },
}
</script>
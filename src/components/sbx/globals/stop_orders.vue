<template>
    <div>
    
        <div>
            <strong> Razón de Paro </strong>

             <multiselect
                v-model="itemselected"
                :options="infoParos"
                label="description"
                :searchable="true"
                :show-labels="false"
                placeholder="Codigo del Paro"
            />

             <p class="mb-3 lead"> {{itemselected["definition"]}} </p>

             <div v-if="itemselected.root_code != null">

                <strong> Detalle Razón de Paro </strong>
                <multiselect
                    v-model="itemselectedSubCode"
                    :options="itemselected.root_code == null ? [] : itemselected.root_code"
                    label="description"
                    :searchable="true"
                    :show-labels="false"
                    placeholder="Codigo del Paro"
                />
            </div>
            <!-- <p class="mb-3 lead"> {{itemselected["definition"]}} </p> -->
            <strong> Información complementaria </strong>
              <b-form-textarea
                id="textarea1"
                v-model="commentedStopCode"
                placeholder="Desea adicionar alguna información sobre esta acción?"
                rows="3"
                max-rows="6"
                class="mb-3"
            />

    <div v-if="itemselected['next_order']">
        <strong> Seleccione la órden de producción a la que se le asiganará el tiempo de paro de este centro de trabajo </strong>
            <!-- TABLA ORDENES DE PRODUCCION -->
                
                            <!-- <template v-slot:cell(edit)="row">
                                <div class="text-center">
                                    <i v-if="props.item.order_id == wsinfo.order_id" class="ion ion-md-hammer"></i>
                                    <b-btn v-if="props.item.order_id != orderSelected.order_id && props.item.order_id != wsinfo.order_id" variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="selectOrder(row.item)"><i class="ion ion-md-checkmark"></i></b-btn>
                                </div>
                            </template> -->
                           
            <!-- TABLA ORDENES DE PRODUCCION -->

                  <!-- TABLA ORDENES DE PRODUCCION -->
      <div>
        <b-tabs content-class="mt-3">
          <b-tab title="Ordenes de Producción Planeadas" active  v-if="visiblePlanning">
              <div class="mb-2" >
              <h4>Ordenes de Producción Planeadas</h4>
              <div class="row">
                <div class="col">
                  <b-row>
                    <b-col md="6" class="my-1">
                      <!-- <b-form-group horizontal label="Filtrar" class="mb-0"> -->
                      <b-input-group>
                        <b-form-input v-model="filterPlanning" placeholder="Buscar..." />
                        <b-input-group-append>
                          <b-btn :disabled="!filterPlanning" @click="filterPlanning = ''">Limpiar</b-btn>
                        </b-input-group-append>
                      </b-input-group>
                      <!-- </b-form-group> -->
                    </b-col>
                    <b-col md="6" class="my-1">
                      <b-form-select :options="pageOptions" v-model="perPagePlanning" />
                    </b-col>
                    <!-- <b-col md="1" class="my-1 ml-3">
                                        <div class="row">
                                            <div class="col-6">
                                                <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="addData"><i class="ion ion-md-add"></i></b-btn>
                                            </div>
                                            <div class="col-6">
                                                <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                                            </div>
                                        </div>
                      </b-col>-->
                  </b-row>

                  <b-table
                    small
                    show-empty
                    stacked="md"
                    :items="tableDataPlanning"
                    :fields="columnsOrders"
                    :current-page="currentPagePlanning"
                    :per-page="perPage"
                    :filter="filterPlanning"
                    @filtered="onFilteredPlanning"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    style="font-size:12px"
                    >

                    <template v-slot:cell(programed_amount)="row">
                      <div>
                      {{formatAmount(row.item.programed_amount.toFixed(2))}}
                      </div>
                    </template>
                    <template v-slot:cell(produced_amount)="row">
                      <div>
                      {{formatAmount(row.item.produced_amount.toFixed(2))}}
                      </div>
                    </template>
                    <template v-slot:cell(pending_amount)="row">
                      <div class="text-nowrap">
                        {{formatAmount(row.item.pending_amount.toFixed(2))}}

                        <i class="fas fa-circle text-success" v-if="(row.item.pending_amount/row.item.programed_amount)>=0.2"></i>
                        <i class="fas fa-circle text-danger" v-if="(row.item.pending_amount/row.item.programed_amount)<=0.10"></i> 
                        <i class="fas fa-circle text-warning" v-if="(row.item.pending_amount/row.item.programed_amount)>0.10 && (row.item.pending_amount/row.item.programed_amount)<=0.20"></i> 
                      </div>
                    </template>
                    
                    <template v-slot:cell(edit)="row">
                      <div class="text-center">


                        <!-- <b-btn
                          v-b-tooltip.html
                          v-if="(sendOrder && row.item.is_active == null) || !sendOrder"
                          :variant="{'outline-warning':(sendOrder && row.item.status_modules_id != null), 'outline-success': !(sendOrder && row.item.status_modules_id != null), 'borderless icon-btn': true}"
                          class="btn-sm"
                          @click.prevent="selectOrder(row.item)">
                          <i v-if="!sendOrder" class="ion ion-md-checkmark"></i>
                          <i
                            v-if="sendOrder && row.item.status_modules_id == null"
                            class="fas fa-map-marker-alt"
                          ></i>
                          <i v-if="sendOrder && row.item.status_modules_id != null" class="fas fa-ban"></i>



                        </b-btn> -->

                        <div class="text-center">
                            <i v-if="row.item.order_production_process_id == wsinfo.order_production_process_id" class="ion ion-md-hammer"></i>
                            <b-btn v-if="row.item.order_production_process_id == orderSelected.order_production_process_id"  variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="orderSelected={}"><i class="fas fa-tools"></i></b-btn>
                            <b-btn v-if="row.item.order_production_process_id != orderSelected.order_production_process_id && row.item.order_production_process_id != wsinfo.order_production_process_id"  variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="selectOrder(row.item)"><i class="ion ion-md-checkmark"></i></b-btn>
                        </div>

                        <!-- <i v-if="sendOrder && row.item.is_active != null" class="fas fa-cogs text-success"></i> -->
                        <!-- <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="showDetailsProductionOrders"><i class="ion ion-md-information-circle-outline"></i></b-btn> -->
                        <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn> -->
                      </div>
                    </template>
                    <template v-slot:cell(consecutive_order)="row">
                      
                        <div>
                          {{row.item.consecutive_order}}
                          <!-- <b-form-checkbox-group
                              id="checkbox-group-2"
                              v-model="selectedOrders"
                            >
                              <b-form-checkbox :value="row.item">{{row.item.consecutive_order}}</b-form-checkbox>
                          </b-form-checkbox-group> -->
                          
                        </div>
                      
                    </template>
                    <template v-slot:cell(order_id)="row">
                      <div class="d-flex justify-content-between">
                        <div>
                          <span>
                            <i v-if="row.item.is_global" class="ion ion-ios-globe"></i>
                          </span>
                        </div>
                        <div>{{row.item.order_id}}</div>
                      </div>
                    </template>
                    <template v-slot:cell(show)="row">
                      <div class="text-center">
                        <!-- <i class="ion ion-md-create"></i> -->
                        <span style="color:red" v-if="!row.item.show">
                          <i class="ion ion-md-remove-circle"></i>
                        </span>
                        <span style="color:green" v-if="row.item.show">
                          <i class="ion ion-md-add-circle"></i>
                        </span>
                      </div>
                    </template>
                    <template v-slot:cell(active)="row">
                      <div class="text-center">
                        <!-- <i class="ion ion-md-create"></i> -->
                        <span style="color:red" v-if="!row.item.active">
                          <i class="ion ion-md-remove-circle"></i>
                        </span>
                        <span style="color:green" v-if="row.item.active">
                          <i class="ion ion-md-add-circle"></i>
                        </span>
                      </div>
                    </template>
                    <template v-slot:cell(deadline)="row">
                      <div class="text-center">
                        {{customFormatter(row.item.deadline)}}
                        <!-- {{moment(row.item.deadline).toDate()}} -->
                      </div>
                    </template>
                  </b-table>
                  <b-row>
                    <b-col md="6" class="my-1">
                      <b-pagination
                        :total-rows="totalRowsPlanning"
                        :per-page="perPage"
                        v-model="currentPagePlanning"
                        class="my-0"
                      />
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </b-tab>
          <b-tab title="Ordenes de Producción Disponibles">
            <h4>Ordenes de Producción Disponibles</h4>
              <div class="row">
                <div class="col">
                  <b-row>
                    <b-col md="6" class="my-1">
                      <!-- <b-form-group horizontal label="Filtrar" class="mb-0"> -->
                      <b-input-group>
                        <b-form-input v-model="filter" placeholder="Buscar..." />
                        <b-input-group-append>
                          <b-btn :disabled="!filter" @click="filter = ''">Limpiar</b-btn>
                        </b-input-group-append>
                      </b-input-group>
                      <!-- </b-form-group> -->
                    </b-col>
                    <b-col md="6" class="my-1">
                      <b-form-select :options="pageOptions" v-model="perPage" />
                    </b-col>
                  </b-row>
                  <b-table
                    small
                    show-empty
                    stacked="md"
                    :items="tableData"
                    :fields="columnsOrders"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    @filtered="onFiltered"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    style="font-size:12px"
                  >
                  <!-- order_id -->
                    <template v-slot:cell(edit)="row">
                      <div class="text-center">
                        <div class="text-center">
                            <i v-if="row.item.order_production_process_id == wsinfo.order_production_process_id" class="ion ion-md-hammer"></i>
                            <!-- <i v-if="row.item.order_production_process_id == orderSelected.order_production_process_id" class="fas fa-tools text-success"></i> -->
                            <b-btn v-if="row.item.order_production_process_id == orderSelected.order_production_process_id"  variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="orderSelected={}"><i class="fas fa-tools"></i></b-btn>
                            <b-btn v-if="row.item.order_production_process_id != orderSelected.order_production_process_id && row.item.order_production_process_id != wsinfo.order_production_process_id"  variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="selectOrder(row.item)"><i class="ion ion-md-checkmark"></i></b-btn>
                        </div>
                      </div>
                    </template>
                    <template v-slot:cell(consecutive_order)="row">
                      
                        <div>

                          {{row.item.consecutive_order}}
                          <!-- <b-form-checkbox-group
                              id="checkbox-group-2"
                              v-model="selectedOrders"
                            >
                              <b-form-checkbox :value="row.item">{{row.item.consecutive_order}}</b-form-checkbox>
                          </b-form-checkbox-group> -->
                          
                        </div>
                        
                    </template>
                    <template v-slot:cell(order_id)="row">
                      <div class="d-flex justify-content-between">
                        <div>
                          <span>
                            <i v-if="row.item.is_global" class="ion ion-ios-globe"></i>
                          </span>
                        </div>
                        <div>{{row.item.order_id}}</div>
                      </div>
                    </template>
                    <template v-slot:cell(show)="row">
                      <div class="text-center">
                        <!-- <i class="ion ion-md-create"></i> -->
                        <span style="color:red" v-if="!row.item.show">
                          <i class="ion ion-md-remove-circle"></i>
                        </span>
                        <span style="color:green" v-if="row.item.show">
                          <i class="ion ion-md-add-circle"></i>
                        </span>
                      </div>
                    </template>
                    <template v-slot:cell(active)="row">
                      <div class="text-center">
                        <!-- <i class="ion ion-md-create"></i> -->
                        <span style="color:red" v-if="!row.item.active">
                          <i class="ion ion-md-remove-circle"></i>
                        </span>
                        <span style="color:green" v-if="row.item.active">
                          <i class="ion ion-md-add-circle"></i>
                        </span>
                      </div>
                    </template>
                    <template v-slot:cell(programed_amount)="row">
                      <div>
                      {{formatAmount(row.item.programed_amount.toFixed(2))}}
                      </div>
                    </template>
                    <template v-slot:cell(produced_amount)="row">
                      <div>
                      {{formatAmount(row.item.produced_amount.toFixed(2))}}
                      </div>
                    </template>
                    <template v-slot:cell(pending_amount)="row">
                      <div class="text-nowrap">
                      {{formatAmount(row.item.pending_amount.toFixed(2))}}
                      <i class="fas fa-circle text-success" v-if="(row.item.pending_amount/row.item.programed_amount)>=0.2"></i>
                      <i class="fas fa-circle text-danger" v-if="(row.item.pending_amount/row.item.programed_amount)<=0.10"></i> 
                      <i class="fas fa-circle text-warning" v-if="(row.item.pending_amount/row.item.programed_amount)>0.10 && (row.item.pending_amount/row.item.programed_amount)<=0.20"></i> 
                      </div>
                    </template>
                    <template v-slot:cell(deadline)="row">
                      <div>
                        {{customFormatter(row.item.deadline)}}
                        <!-- {{moment(row.item.deadline).toDate()}} -->
                      </div>
                    </template>
                  </b-table>
                  <b-row>
                    <b-col md="6" class="my-1">
                      <b-pagination
                        :total-rows="totalRows"
                        :per-page="perPage"
                        v-model="currentPage"
                        class="my-0"
                      />
                    </b-col>
                  </b-row>
                </div>
              </div>
          </b-tab>
        </b-tabs>
      </div>
      <!-- TABLA ORDENES DE PRODUCCION -->
        </div>
            <hr>
            <div class="w-100 text-right mt-2" v-if="is_multiple == false">
                <b-button :variant="openControlForm == 'stop' ? 'danger' : 'warning'" v-if="button_action" @click="finOrdenProduccion()">{{openControlForm == 'stop' ? 'Suspender/Finalizar Orden de Producción' : 'Cambiar de Paro'}}</b-button>
            </div>
            <div class="w-100 mt-3" v-if="itemselected.stop_code_id != undefined">
                <h4>Resumen</h4>
                <div class="row">
                    <div class="col-md-4 col-sm-12">

                      <!-- {{orderSelected}} -->

                        <div style="font-size: 1rem;" class="font-weight-bold mb-1">{{itemselected.code}} - {{itemselected.description}}</div>
                        <div class="d-flex justify-content-between"> Afecta Orden Actual <i class="ion ion-md-checkmark text-success" v-if="itemselected.affect_order" ></i> <i class="ion ion-md-close text-danger" v-if="!itemselected.affect_order"></i> </div>
                        <div class="d-flex justify-content-between"> Afecta Orden Siguiente <i class="ion ion-md-checkmark text-success" v-if="itemselected.next_order" ></i> <i class="ion ion-md-close text-danger" v-if="!itemselected.next_order"></i> </div>
                        <div class="d-flex justify-content-between"> Inicio Automático <i class="ion ion-md-checkmark text-success" v-if="itemselected.auto_start" ></i> <i class="ion ion-md-close text-danger" v-if="!itemselected.auto_start"></i> </div>
                        <div class="d-flex justify-content-between"> Afecta Disponibilidad <i class="ion ion-md-checkmark text-success" v-if="itemselected.availability" ></i> <i class="ion ion-md-close text-danger" v-if="!itemselected.availability"></i></div>
                        <div class="d-flex justify-content-between"> Afecta Eficiencia <i class="ion ion-md-checkmark text-success" v-if="itemselected.performance" ></i> <i class="ion ion-md-close text-danger" v-if="!itemselected.performance"></i></div>
                        <div class="d-flex justify-content-between"> Tiempo de Preparación <i class="ion ion-md-checkmark text-success" v-if="itemselected.setup_time" ></i> <i class="ion ion-md-close text-danger" v-if="!itemselected.setup_time"></i></div>

                    </div>
                    <div class="col-md-8 col-sm-12">
                        <div style="font-size: 1rem;" class="font-weight-bold mb-1">Información Complementaria</div>
                        {{commentedStopCode == ""?" - Sin Comentarios - " : commentedStopCode}}
                    </div>
                </div>
                <div>
                    <div class="row">
                        <div v-if="openControlForm == 'stop'" class="col-md-6 col-sm-6">
                            <div style="font-size: 1rem;" class="font-weight-bold mb-1 mt-2">Orden Actual</div>
                            <div class="d-flex justify-content-between"> Número de Orden: {{wsinfo.order_id}} </div>
                            <!-- {{JSON.parse(selectedWorkstation.infocalculada.replace(/'/g, '"'))}} -->
                            <div class="d-flex justify-content-between"> Código: {{JSON.parse(selectedWorkstation.infocalculada.replace(/'/g, '"')).code}} - {{wsinfo.description}}</div>
                            <div class="d-flex justify-content-between"> Cantidad Pendiente: {{JSON.parse(selectedWorkstation.infocalculada.replace(/'/g, '"')).totalPendiente}} </div>
                            <div class="d-flex justify-content-between"> Total Producido: {{JSON.parse(selectedWorkstation.infocalculada.replace(/'/g, '"')).totalProducido}} </div>
                            <div class="d-flex justify-content-between"> Tiempo Total Trabajado (hh:mm:ss): {{JSON.parse(selectedWorkstation.infocalculada.replace(/'/g, '"')).tiempotrabajado}} </div>
                            <div class="d-flex justify-content-between"> Tiempo de Paro (hh:mm:ss): {{JSON.parse(selectedWorkstation.infocalculada.replace(/'/g, '"')).stop_time}} </div>
                            <!-- {{selectedWorkstation}} -->

                            
                        </div>
                        <div v-if="itemselected.next_order" class="col-md-6 col-sm-6">
                            <div style="font-size: 1rem;" class="font-weight-bold mb-1 mt-2">Orden Siguiente</div>
                            <div class="d-flex justify-content-between"> Número de Orden: {{orderSelected.consecutive_order}} </div>
                            <div class="d-flex justify-content-between"> Código: {{orderSelected.code}} - {{orderSelected.description}}</div>
                            <div class="d-flex justify-content-between"> Cantidad Pendiente: {{orderSelected.pending_amount}} </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<script>
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import { realtime } from '@/vendor/sbx/sbx-realtime/realtime'
import { orderAvailable } from "@/vendor/sbx/sbx/production_order";
import Notifications from 'vue-notification'
import { infoproduction } from "@/components/i40/js/production";
import uuidv1 from 'uuid/v4';
import Columns from "./columns.json";
import * as numeral from 'numeral'
Vue.use(Notifications)

export default {
    
    metaInfo: {
        
    },

    components:{
        Multiselect
    },

    watch:{
        'itemselected' :function(params) {
            this.itemselectedSubCode = {}
        }
    },
    
    data() {
        return {
            columnsOrders:[], 

            selectedWorkstation:{},
            stopOrden: false,

            sortBy: "id",
            sortDesc: false,
            ///Info de filtro y paginas para la tabla
            currentPage: 1,
            perPage: 10,
            totalRows: 0,
            pageOptions: [10, 15, 20, 25, 50, 100],
            filter: null,
            ///Info de filtro y paginas para la tabla

            ///Info de filtro y paginas para la tabla


            visiblePlanning:true,
            ///Info de filtro y paginas para la tabla
            currentPagePlanning: 1,
            perPagePlanning: 10,
            totalRowsPlanning: 0,
            pageOptionsPlanning: [10, 15, 20, 25, 50, 100],
            filterPlanning: null,
            ///Info de filtro y paginas para la tabla

            /// Columnas de las tablas
            tableData: [],
            tableDataPlanning: [],
            columns: [],

            options:[],
            infoParos:[],
            selected: null,
            itemselected:{},
            openControlForm:'',
            commentedStopCode:'',
            selectedWorkstationGroup:[],
            is_multiple:false,

            orderSelected:{},
            itemselectedSubCode:{},
            button_action: true,


             ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla

            /// Columnas de las tablas
                tableData: [],
                columns: [
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'order_id', label:"# Orden"},
                    {key:'code', label:"Código"},
                    {key:'description', label:"Descripción"},
                    {key:'programmed_amount', label:"Programado"},
                    {key:'total_amount', label:"Producido"},
                    {key:'total_pending', label:"Pendiente"},
                    // {key:'centrotrabajo', label:"Centro Trabajo"},
                    // {key:'deadline', label:"Comprometida"},
                    {key:'edit', label:"Seleccione"},
                ],
            /// Columnas de las tablas
            
        }
        
    },
    methods: {
          formatAmount (p) {
        return numeral(p).format('0,0.00')
    },
    ///Filtros Para las Tablas
    onFilteredPlanning(filteredItems) {
      this.totalRowsPlanning = filteredItems.length;
      this.currentPagePlanning = 1;
    },


    abrirOrdenes: function(item) {


        infoproduction.production(
          {
            plant_id: this.$route.params["idfloor"],
            group_id: this.$route.params["idgroup"],
            workstation_code: item.wscode
          },
          "select-workstation-realtime-planning"
        )
        .then(data => {
          this.visiblePlanning = true
          if(data.status == 200){
            if(data.data != ""){
              this.tableDataPlanning = data.data;
              this.totalRowsPlanning = this.tableDataPlanning.length;
            }else{
              this.visiblePlanning = false
              this.tableDataPlanning = [];
              this.totalRowsPlanning = 0;
            }
          }else{
            this.visiblePlanning = false
            this.tableDataPlanning = []
            this.totalRowsPlanning = 0
          }
        });

      realtime.apirundb("0", "LocalConfig:EstadoDispositivos")
        .then(data => {
          this.hrdw = data.data
        })

      infoproduction.production(
          {
            workstation_code: item.wscode,
            plant_id: this.$route.params["idfloor"],
            group_id: this.$route.params["idgroup"]
          },
          "select-workstation-realtime"
        )
        
        .then(data => {
          // console.log(data)
          if(data.data != ""){
            this.tableData = data.data;
            this.totalRows = this.tableData.length;
          }else{
            this.tableData =[]
            this.totalRows =0
          }
        });


    },
        getParos(item, controlForm){
            this.selected=  null
            this.is_multiple = false
            this.commentedStopCode= ''

            this.orderSelected= {}
            this.openControlForm = controlForm
            this.selectedWorkstation = item
            
            this.wsinfo = this.selectedWorkstation.wsinfo == undefined || this.selectedWorkstation.wsinfo == "" ? {} : JSON.parse(this.selectedWorkstation.wsinfo)[0]
            this.stopOrden=false
            this.button_action =true
           

            realtime.getStopCode(item.wscode).then(data => {
                // console.log(data.data)
                this.infoParos = data.data
                this.options=[]
                for(var i=0;i<this.infoParos.length;i++){
                    this.options.push({value:this.infoParos[i].stop_code_id, text:this.infoParos[i].description})
                }
            })
            
        },
        
        getParosContent(item, controlForm){

            this.itemselectedSubCode={}
            this.itemselected={}

            this.selected=  null
            this.is_multiple = true
            this.commentedStopCode= ''

            this.orderSelected= {}
            this.openControlForm = controlForm
            this.selectedWorkstation = item
            
            this.wsinfo = this.selectedWorkstation.wsinfo == undefined || this.selectedWorkstation.wsinfo == "" ? {} : JSON.parse(this.selectedWorkstation.wsinfo)[0]
            this.stopOrden=false
            this.button_action =true

            realtime.getStopCode(item.wscode).then(data => {
                this.infoParos = data.data
                this.options=[]
                for(var i=0;i<this.infoParos.length;i++){
                    this.options.push({value:this.infoParos[i].stop_code_id, text:this.infoParos[i].description})
                }
            })
        },

        getStopMultiple(items, controlForm){
            this.selected=  null
            this.is_multiple = true
            this.orderSelected= {}
            this.openControlForm = controlForm

            for (let index = 0; index < items.length; index++) {
                this.stopOrden=false
                // this.button_action =true
                const element = items[index];
                this.selectedWorkstation = element
                this.wsinfo = element.wsinfo == undefined || element.wsinfo == "" ? {} : JSON.parse(element.wsinfo)[0]
                this.finish_order_production(element)
            }
            
            // this.wsinfo = this.selectedWorkstation.wsinfo == undefined || this.selectedWorkstation.wsinfo == "" ? {} : JSON.parse(this.selectedWorkstation.wsinfo)[0]
            // this.stopOrden=false
            // this.button_action =true
           

            // realtime.getStopCode(items[0].wscode).then(data => {
            //     this.infoParos = data.data
            //     this.options=[]
            //     for(var i=0;i<this.infoParos.length;i++){
            //         this.options.push({value:this.infoParos[i].stop_code_id, text:this.infoParos[i].description})
            //     }
            // })
        },

        change_stop_code(){
            let item = {}
            this.commentedStopCode=''
            this.orderSelected={}

            for(var i=0;i<this.infoParos.length;i++){
                   if(this.infoParos[i].stop_code_id == this.selected){
                       item =  this.infoParos[i]
                        orderAvailable(this.selectedWorkstation.wscode).then(data => {
                            this.tableData = data.data
                            this.totalRows= this.tableData.length
                        })
                       break
                   }
            }
        },

        selectOrder(item){
            this.orderSelected = item
            this.orderSelected.order_id= item.production_order_id
        },

        showCustom: function(classes, title, text) {
                this.$notify({
                    group: 'notifications-default',
                    type: classes,
                    title: title,
                    text: text
                })
            },

        finOrdenProduccion(){
            this.finish_order_production(this.orderSelected)
        },

        finish_order_production(item){
             this.button_action = false
            // this.showCustom('bg-warning text-white', "Modificar registro","El registro se ha modificado con éxito!")
            let result={}
            let auto_start_order = true

            // console.log(this.itemselected)

            if(this.itemselected.next_order && item.order_production_process_id == undefined){
                this.showCustom('bg-danger text-white', "Error","Seleccione la orden que sigue a continuación")
            }else if(this.itemselected.stop_code_id == undefined){
                this.showCustom('bg-danger text-white', "Error","No hay un paro seleccionado")
            }else{
                result={id: this.wsinfo.interval_id == undefined ? 0 : this.wsinfo.interval_id, stop_code_id: this.itemselected.stop_code_id, workstation_id: this.wsinfo.workstation_id == undefined ? 0 : this.wsinfo.workstation_id, notes: this.commentedStopCode}
                
                ///Se valida si la orden de produccion siguiente será afectada por el paro
                // if(this.itemselected.next_order){

                //     //result["jobs_id"] = item.jobs_id
                //     auto_start_order = item.jobs_id

                // }

                result["job_auto"]= this.itemselected.auto_start
                result["order_production_process_id"]= item.order_production_process_id
                result["info_jobs_id"] = this.wsinfo.job_id
                result["jobs_id"] = this.wsinfo.job_id
                result["stop_code_root_cause_id"] = this.itemselectedSubCode.stop_code_root_cause_id
                
                realtime.actionProductionOrder(result, this.selectedWorkstation.wscode, this.openControlForm).then(data =>{
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Detener la Orden de Producción!")
                        this.button_action = true
                    }else{
                        this.showCustom('bg-success text-white', "Orden Detenida","¡La Orden se ha Detenido Correctamente!")
                    }
                })
            }
        },

         ///Filtros Para las Tablas
            onFiltered (filteredItems) {
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
        ///Filtros Para las Tablas
    },

    created() {
      this.columnsOrders = Columns.start_production_orders;
    }
}
</script>

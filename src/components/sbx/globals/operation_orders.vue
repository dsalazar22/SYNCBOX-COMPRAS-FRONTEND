<template>
  <div>
    <div v-if="start_global">
      <b-form-group label="Seleccione los Centros de Trabajo a Finalizar">
        <b-form-checkbox-group
          :options="optionsToStart"
          v-model="selectedToStart"
          name="flavour-3a"
        ></b-form-checkbox-group>
      </b-form-group>
    </div>
    <div v-if="!startOrden">
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
                    :fields="columns"
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
                        <b-btn
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
                        </b-btn>

                        <i v-if="sendOrder && row.item.is_active != null" class="fas fa-cogs text-success"></i>
                        <!-- <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="showDetailsProductionOrders"><i class="ion ion-md-information-circle-outline"></i></b-btn> -->
                        <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn> -->
                      </div>
                    </template>
                    <template v-slot:cell(consecutive_order)="row">
                      
                        <div>
                          <b-form-checkbox-group
                              id="checkbox-group-2"
                              v-model="selectedOrders"
                            >
                              <b-form-checkbox :value="row.item">{{row.item.consecutive_order}}</b-form-checkbox>
                          </b-form-checkbox-group>
                          
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
                    :fields="columns"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    @filtered="onFiltered"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    style="font-size:12px"
                  >
                    <template v-slot:cell(edit)="row">
                      <div class="text-center">
                        <b-btn
                          v-b-tooltip.html
                          v-if="(sendOrder && row.item.is_active == null) || !sendOrder"
                          :variant="get_variant(row)"
                          class="btn-sm"
                          @click.prevent="selectOrder(row.item)"
                        >
                          <i v-if="!sendOrder" class="ion ion-md-checkmark"></i>
                          <i v-if="sendOrder && row.item.status_modules_id == null"
                            class="fas fa-map-marker-alt"
                          ></i>
                          <i v-if="sendOrder && row.item.status_modules_id != null" class="fas fa-ban"></i>
                        </b-btn>

                        <i v-if="sendOrder && row.item.is_active != null" class="fas fa-cogs text-success"></i>
                        <!-- <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="showDetailsProductionOrders"><i class="ion ion-md-information-circle-outline"></i></b-btn> -->
                        <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn> -->
                      </div>
                    </template>
                    <template v-slot:cell(consecutive_order)="row">
                      
                        <div>
                          <b-form-checkbox-group
                              id="checkbox-group-2"
                              v-model="selectedOrders"
                            >
                              <b-form-checkbox :value="row.item">{{row.item.consecutive_order}}</b-form-checkbox>
                          </b-form-checkbox-group>
                          
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
      <!-- TABLA ORDENES DE PRODUCCION -->
      </div>
    </div>

    <div v-if="startOrden">
      <div class="h3">
        # Orden: {{contentStartOrder.consecutive_order}}
        <span
          class="font-weight-light"
        >| {{contentStartOrder.code}} - {{contentStartOrder.products_description}}</span>
      </div>

      <div class="h4 mt-4">Velocidades Disponibles</div>
      <b-table
        small
        show-empty
        stacked="md"
        :fields="columnsSpeeds"
        :items="speedTableData"
        class="mt-1"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      >
        <template v-slot:cell(unity_expected_cycle)="row">
          <div class="text-center">{{row.item.unity_expected_cycle}}</div>
        </template>
        <template v-slot:cell(standard_time_cycle)="row">
          <div class="text-center">{{row.item.standard_time_cycle}}</div>
        </template>
        <template v-slot:cell(default)="row">
          <div class="text-center">
            <!-- <i class="ion ion-md-create"></i> -->
            <span style="color:red" v-if="!row.item.default">
              <i class="ion ion-md-remove-circle"></i>
            </span>
            <span style="color:green" v-if="row.item.default">
              <i class="ion ion-md-add-circle"></i>
            </span>
          </div>
        </template>
        <template v-slot:cell(modify_unity_expected)="row">
          <div class="text-center">
            <!-- <i class="ion ion-md-create"></i> -->
            <span style="color:red" v-if="!row.item.modify_unity_expected">
              <i class="ion ion-md-remove-circle"></i>
            </span>
            <span style="color:green" v-if="row.item.modify_unity_expected">
              <i class="ion ion-md-add-circle"></i>
            </span>
          </div>
        </template>
        <template v-slot:cell(edit)="row">
          <div class="text-center">
            <!-- {{checkDefaultSpeed(row.item)}} -->
            <b-btn
              v-if="!(row.item.tools_id == itemTimeSelected.tools_id)"
              variant="outline-dark borderless icon-btn"
              class="btn-xs"
              @click.prevent="selectedSpeed(row.item)"
            >
              <i class="ion ion-md-checkmark"></i>
            </b-btn>

            <i v-if="(row.item.tools_id == itemTimeSelected.tools_id)" class="fas fa-circle text-success"></i>

            <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="removeSpeed(row.item)"><i class="ion ion-md-close"></i></b-btn> -->
          </div>
        </template>
      </b-table>

      <hr />

      <div class="h4 mt-4">{{title_modal}}</div>
      <p>Seleccione la configuración correcta, modifique los datos a la forma de operar en el recurso actual. Luego de clic en el botón verde para iniciar la operación en planta.</p>

      <!-- {{itemTimeSelected}} -->
      <div class="row">
        <div class="col">
          Tiempo de Ciclo (s):
          <b-form-input
            placeholder="Unidades por Ciclo"
            type="number"
            min="0.01"
            v-model="itemTimeSelected.standard_time_cycle"
            :disabled="!itemTimeSelected.modify_time_expected"
          />
        </div>
        <div class="col">
          Unidades por Ciclo:
          <b-form-input
            placeholder="Unidades por Ciclo"
            type="number"
            min="0.01"
            v-model="itemTimeSelected.unity_expected_cycle"
            :disabled="!itemTimeSelected.modify_unity_expected"
          />
        </div>
      </div>
      {{selectedToStart.lenght}}

      <div class="mt-2" v-if="items_hwd!=undefined && items_hwd.length>0">
        <h3>Asignar Hardware Adicional</h3>
        
        <div class="row">
          <div v-for="item of items_hwd" :key="item.code" class="col">
            <h4>{{item.text}}</h4> 
            <div v-for="botones of grupos_eventos(item)" class="mb-1">
              <b-button block :disabled="botones['selected']" :variant="botones.estado" size="sm" @click="enviar_dispositivo(item['key'], botones['codigo'])">{{botones["codigo"]}}</b-button>
            </div>
          </div>    
        </div>
       
      </div>


      <div class="mt-2 text-right" v-if="!start_global">
        <b-button
          variant="success"
          v-if="((button_action && sendOrder) && !status_send) && check_values()"
          @click="sendOrderWorkstation()"
        >Enviar a Máquina</b-button>
        <b-button
          variant="danger"
          v-if="(button_action && sendOrder) && status_send"
          @click="removeOrderWorkstation()"
        >Retirar Orden de Máquina</b-button>
        <b-button
          variant="success"
          v-if="button_action && !sendOrder"
          @click="startProductionOrder()"
        >Iniciar Orden de Producción</b-button>
        <b-button variant="warning" v-if="button_action" @click="startOrden=false">Regresar</b-button>
      </div>
       <div class="mt-2 text-right" v-else>
          <b-button
            variant="success"
            v-if="button_action && selectedToStart.length>0"
            @click="startProductionOrderGlobal()"
          >Iniciar Orden de Producción Global</b-button>
          <b-button variant="warning" v-if="button_action" @click="startOrden=false">Regresar</b-button>
        </div>
    </div>
   
    <!-- {{contentStartOrder}} -->
  </div>
</template>
<script>
import Vue from "vue";
import { orderAvailable } from "@/vendor/sbx/sbx/production_order";
import { SpeedController } from "@/vendor/sbx/sbx/speed_config";
import { realtime } from "@/vendor/sbx/sbx-realtime/realtime";
import Notifications from "vue-notification";
import { infoproduction } from "@/components/i40/js/production";
import Columns from "./columns.json";
import * as numeral from 'numeral'
import { infomaster } from "@/components/i40/js/master";
Vue.use(Notifications);

export default {
  data() {
    return {
      selectedOrders:[],
      wsdetails:{},
      visiblePlanning:true,
      start_global: false,
      selectedWorkstation: {},
      title_modal: "",

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
      
      /// Columnas de las tablas

      ///Columnas de Tiempos
      speedTableData: [],
      columnsSpeeds: [
        {
          key: "tools_id",
          sortable: true,
          label: "tools_id",
          thClass: "d-none",
          tdClass: "d-none"
        },
        {
          key: "speed_config_id",
          sortable: true,
          label: "id",
          thClass: "d-none",
          tdClass: "d-none"
        },
        { key: "code", sortable: true, label: "Código" },
        { key: "description", sortable: true, label: "Descripción" },
        {
          key: "standard_time_cycle",
          sortable: true,
          label: "Tiempo base (s)"
        },
        {
          key: "unity_expected_cycle",
          sortable: true,
          label: "Unidades por Ciclo"
        },
        // {key:'default', sortable: true,  label:"Por Defecto"},
        {
          key: "modify_unity_expected",
          sortable: true,
          label: "Modificar Unidades"
        },
        { key: "edit", sortable: true, label: "Seleccione" }
      ],
      itemTimeSelected: {},
      ///Columnas de Tiempos

      startOrden: false,
      contentStartOrder: {},
      unityPerCicle: 0,

      button_action: true,
      sendOrder: false,
      status_send: false,
      optionsToStart: [],
      selectedToStart: [],

      items_hwd:[],
      selectedWorkstation2:[]
    };
  },
  methods: {
    formatAmount (p) {
        return numeral(p).format('0,0.00')
    },

    check_values(){
       return (this.unityPerCicle!=undefined && this.itemTimeSelected.standard_time_cycle != 0 && this.itemTimeSelected.standard_time_cycle != undefined && this.itemTimeSelected.standard_time_cycle != 0)
    },

    grupos_eventos(item){
      let datos = []
      for (let index = 0; index < this.hrdw.length; index++) {
        const element = this.hrdw[index];
        if (element["CodigoDispositivo"].includes(item["code"])){
          let code_dev = this.selectedWorkstation2[item["key"]] != undefined ? this.selectedWorkstation2[item["key"]] : ""
          let selected = (code_dev == element["CodigoDispositivo"])

          datos.push({codigo: element["CodigoDispositivo"], estado: selected ? "outline-secondary" : element["EnLinea"]?"outline-success":"outline-danger", selected:  selected})
        }
      }
      return datos
    },

    enviar_dispositivo(codigo, valor){
      
      realtime.sendredis("0", "ws:realtime:"+this.selectedWorkstation2.wscode,codigo,valor)
        .then(data => {


           realtime.apihget("0", "ws:realtime:"+this.selectedWorkstation2.wscode)
            .then(data => {
              this.selectedWorkstation2 = data.data
            
            })

        })

    },

    get_variant(row){
      if(this.sendOrder && row.item.status_modules_id != null)
        return 'outline-warning'
      else if (!(this.sendOrder && row.item.status_modules_id != null))
        return 'outline-success'
      else 
        return'borderless icon-btn'
    },

    abrirOrdenes: function(item) {
      this.selectedOrders=[]
      
      if(item["add_hwd"] != undefined && item["add_hwd"] != null){
        this.items_hwd = JSON.parse(item["add_hwd"])
      }

      this.title_modal = "Iniciar Ordenes de Producción";
      this.start_global = false;
      this.sendOrder = false;
      this.selectedWorkstation = item;
      this.selectedWorkstation2 = item;
      this.startOrden = false;
      this.button_action = true;
      this.status_send = false;
      // console.log({workstation_code:item.wscode, plant_id:this.$route.params['idfloor'], group_id:this.$route.params['idgroup']})

        infomaster.workstation([],"select").then(data => {
            if(data.data != ""){
                
                if( data.data[0].workstation != null){

                    for (let index = 0; index < data.data[0].workstation.length; index++) {
                      const element = data.data[0].workstation[index];

                      if (element.code == item.wscode) {
                        this.wsdetails = element
                      }
                      
                    }
                    
                }
            }
        })

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

    openOrdersToSend: function(item) {
      this.title_modal = "Enviar Ordenes de Producción";
      this.start_global = false;
      this.sendOrder = true;
      this.selectedWorkstation = item;
      this.startOrden = false;
      this.button_action = true;
      // console.log({workstation_code:item.wscode, plant_id:this.$route.params['idfloor'], group_id:this.$route.params['idgroup']})
      infoproduction
        .production(
          {
            workstation_code: item.wscode,
            plant_id: this.$route.params["idfloor"],
            group_id: this.$route.params["idgroup"],
            workstation_code: item.wscode
          },
          "select-send-workstation-realtime"
        )
        .then(data => {
          this.tableData = data.data;
          this.totalRows = this.tableData.length;
        });

      infoproduction
        .production(
          {
            plant_id: this.$route.params["idfloor"],
            group_id: this.$route.params["idgroup"],
            workstation_code: item.wscode
          },
          "select-workstation-realtime-planning"
        )
        .then(data => {
          if(data.data != ""){
            this.tableDataPlanning = data.data;
            this.totalRowsPlanning = this.tableDataPlanning.length;
          }else{
            this.tableDataPlanning = [];
            this.totalRowsPlanning = 0;
          }
        });
    },

    abrirOrdenesPerGroups: function(items) {
      this.title_modal = "Iniciar Ordenes de Producción";
      this.sendOrder = false;
      this.selectedToStart = [];
      this.start_global = true;
      this.startOrden = false;
      this.button_action = true;
      this.status_send = false;
      this.optionsToStart = items;
      // console.log({workstation_code:item.wscode, plant_id:this.$route.params['idfloor'], group_id:this.$route.params['idgroup']})
      infoproduction
        .production(
          {
            plant_id: this.$route.params["idfloor"],
            group_id: this.$route.params["idgroup"]
          },
          "select-groups-globals-realtime"
        )
        .then(data => {
          if(data.data != ""){
            this.tableData = data.data;
            this.totalRows = this.tableData.length;
          }else{
            this.tableData = [];
            this.totalRows = 0;
          }
        });

      infoproduction
        .production(
          {
            plant_id: this.$route.params["idfloor"],
            group_id: this.$route.params["idgroup"],
            workstation_code: items.wscode
          },
          "select-workstation-realtime-planning"
        )
        .then(data => {
          if(data.data){
            this.tableDataPlanning = data.data;
            this.totalRowsPlanning = this.tableDataPlanning.length;
          }else{
            this.tableDataPlanning = []
            this.totalRowsPlanning = 0
          }
        });
    },

    workstation_selected() {
      return this.selectedToStart.lenght > 0;
    },

    selectOrder: function(item) {
      // console.log(item)
      // SpeedController({
      //     id: 0,
      //     speed_config_id: 0,
      //     product_id: item.product_id,
      //     code: '',
      //     description: '',
      //     standard_time_cycle: 0,
      //     unity_expected_cycle: 0,
      //     default: false,
      //     modify_unity_expected: false
      //     }, "select").then(data => {
      //         this.speedTableData = data.data
      //         for(let i=0;i<this.speedTableData.length;i++){
      //             if(this.speedTableData[i].default){
      //                 this.itemTimeSelected = this.speedTableData[i]
      //                 this.unityPerCicle = this.speedTableData[i].unity_expected_cycle
      //             }
      //         }
      //     })

      this.status_send =
        item.status_modules_id != null && item.status_modules_id == 150;

      infoproduction
        .production(
          {
            product_id: item.product_id,
            route_operation_id: item.route_operation_id,
            number_operator: item.number_operator,
            workstation_group_id: this.$route.params["idgroup"]
          },
          "select-tools-start-order"
        )
        .then(data => {
          if(data.data != ""){
            this.speedTableData = data.data;
            let first = true;
            for (let i = 0; i < this.speedTableData.length; i++) {
              if (this.speedTableData[i].default) {
                first = false;
                this.itemTimeSelected = this.speedTableData[i];
                this.unityPerCicle = this.speedTableData[i].unity_expected_cycle;
              }

              if (first) {
                if (this.speedTableData.length > 0) {
                  this.itemTimeSelected = this.speedTableData[0];
                  this.unityPerCicle = this.speedTableData[0].unity_expected_cycle;
                }
              }
            }
          }else{
            this.speedTableData = [];
          }
        });

      this.contentStartOrder = item;
      this.startOrden = true;
      // console.log(this.contentStartOrder)
    },

    submit: function() {
      orderProductionController(this.objInfo, "")
        .then(data => {
          if (data.status === 202) {
            this.showCustom(
              "bg-danger text-white",
              "Error",
              "¡Error Guardando el Registro!"
            );
          } else {
            if (this.objInfo.id === 0)
              this.showCustom(
                "bg-success text-white",
                "Guardar registro",
                "¡El Registro se ha Guardado con Éxito!"
              );
            else
              this.showCustom(
                "bg-warning text-white",
                "Modificar registro",
                "¡El Registro se ha Modificado con Éxito!"
              );

            this.showData();
            this.cancel();
          }
        })
        .catch(function(error) {
          console.log(error.status);
        });
    },

    ///Filtros Para las Tablas
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    ///Filtros Para las Tablas

    ///Filtros Para las Tablas
    onFilteredPlanning(filteredItems) {
      this.totalRowsPlanning = filteredItems.length;
      this.currentPagePlanning = 1;
    },
    ///Filtros Para las Tablas

    ////INTERACCION INICIO - FIN ORDEN
    selectedSpeed: function(item) {
      this.itemTimeSelected = item;
    },

    showCustom: function(classes, title, text) {
      this.$notify({
        group: "notifications-default",
        type: classes,
        title: title,
        text: text
      });
    },

    startProductionOrderGlobal: function() {
      let result = {
        job_id: this.contentStartOrder.job_id,
        standard_unit_cycle: this.itemTimeSelected.unity_expected_cycle,
        real_unit_cycle: this.unityPerCicle,
        expected_time_cycle: this.itemTimeSelected.standard_time_cycle,
        // workstation_id: this.selectedWorkstation.wsinfo == undefined ? 0: JSON.parse(this.selectedWorkstation.wsinfo)[0].workstation_id,
        order_production_process_id: this.contentStartOrder
          .order_production_process_id,
        qty_pending: this.contentStartOrder.pending_amount
      };

      for (let index = 0; index < this.selectedToStart.length; index++) {
        const element = this.selectedToStart[index];
        // console.log(result, element, "start")
        realtime.actionProductionOrder(result, element, "start").then(data => {
          if (data.status === 202) {
            this.button_action = true;
            this.showCustom(
              "bg-danger text-white",
              "Error",
              "¡Error al Iniciar la Orden de Producción!"
            );
          } else {
            this.showCustom(
              "bg-success text-white",
              "Iniciado",
              "¡La Orden se ha Iniciado Correctamente!"
            );
          }
        });
      }
    },

    sendOrderWorkstation: function() {
      this.button_action = false;

      realtime
        .sendProductionOrder("send", this.contentStartOrder)
        .then(data => {
          // console.log("send", this.contentStartOrder);
          // console.log(data);
          if (data.status === 202) {
            this.button_action = true;
            this.showCustom(
              "bg-danger text-white",
              "Error",
              "¡Error al Iniciar la Orden de Producción!"
            );
          } else {
            this.showCustom(
              "bg-success text-white",
              "Iniciado",
              "¡La Orden se ha Iniciado Correctamente!"
            );
          }
        });
    },

    removeOrderWorkstation: function() {
      this.button_action = false;

      realtime
        .sendProductionOrder("remove", this.contentStartOrder)
        .then(data => {
          // console.log(data);
          if (data.status === 202) {
            this.button_action = true;
            this.showCustom(
              "bg-danger text-white",
              "Error",
              "¡Error al Iniciar la Orden de Producción!"
            );
          } else {
            this.showCustom(
              "bg-success text-white",
              "Iniciado",
              "¡La Orden se ha Iniciado Correctamente!"
            );
          }
        });
    },
    
    startProductionOrder: function() {
        this.button_action = false;

      if(this.selectedOrders.length > 0){
        for (let index = 0; index < this.selectedOrders.length; index++) {
          const element = this.selectedOrders[index];

          var result = {
            job_id: element.job_id,
            standard_unit_cycle: this.itemTimeSelected.unity_expected_cycle,
            real_unit_cycle: this.unityPerCicle,
            expected_time_cycle: this.itemTimeSelected.standard_time_cycle,
            // workstation_id: this.selectedWorkstation.wsinfo == undefined ? 0: JSON.parse(this.selectedWorkstation.wsinfo)[0].workstation_id,
            order_production_process_id: element.order_production_process_id,
            qty_pending: element.pending_amount,
            wscode:this.selectedWorkstation.wscode
          };

          if(index == 0){
            

            realtime
              .actionProductionOrder(result, this.selectedWorkstation.wscode, "start")
              .then(data => {
                if (data.status === 202) {
                  // console.log(data)
                  this.button_action = true;
                  this.showCustom(
                    "bg-danger text-white",
                    "Error",
                    "¡Error al Iniciar la Orden de Producción!"
                  );
                } else {
                  this.showCustom(
                    "bg-success text-white",
                    "Iniciado",
                    "¡La Orden se ha Iniciado Correctamente!"
                  );
                }
              });
          }else{

            realtime
              .concurrentOrders(result, "start").then(data => {
                this.showCustom(
                  "bg-success text-white",
                  "Iniciado",
                  `¡La Orden se ha Iniciado Correctamente! ${element.order_production_process_id}`
                );
              })
            
          }
          
        }

      }else{
        let result = {
          job_id: this.contentStartOrder.job_id,
          standard_unit_cycle: this.itemTimeSelected.unity_expected_cycle,
          real_unit_cycle: this.unityPerCicle,
          expected_time_cycle: this.itemTimeSelected.standard_time_cycle,
          // workstation_id: this.selectedWorkstation.wsinfo == undefined ? 0: JSON.parse(this.selectedWorkstation.wsinfo)[0].workstation_id,
          order_production_process_id: this.contentStartOrder
            .order_production_process_id,
          qty_pending: this.contentStartOrder.pending_amount
        };

        realtime
          .actionProductionOrder(result, this.selectedWorkstation.wscode, "start")
          .then(data => {
            if (data.status === 202) {
              // console.log(data)
              this.button_action = true;
              this.showCustom(
                "bg-danger text-white",
                "Error",
                "¡Error al Iniciar la Orden de Producción!"
              );
            } else {
              this.showCustom(
                "bg-success text-white",
                "Iniciado",
                "¡La Orden se ha Iniciado Correctamente!"
              );
            }
          });
      }

      


    }
    ////
  },

  created() {
    this.selectedOrders=[]
    this.columns = Columns.start_production_orders;
  }
};
</script>
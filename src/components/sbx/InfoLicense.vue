<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-0"><span><b-btn variant="outline-info icon-btn" class="btn-sm"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn></span> Información de la Licencia </h4>
    
    <p>Los cambios en la configuración, tomarán efecto luego de reiniciar todos los servicios que contiene SyncBox i4.0</p>
    <!-- <p><button class="btn btn-primary btn-lg">Button</button></p> -->
      
    <!-- Información general de las opciones adquiridas -->
      <div class="row">
        <div class="col-xs-12 col-md-7">
          <b-card no-body :header="tituloEstado" header-tag="h6" class="mb-4 align-middle" 
            :header-bg-variant="headerColor" :header-text-variant="textHeaderColor">
            <b-card-body>
              <b-form>
                <b-form-group horizontal :label-cols="2">
                  <div slot="label" class="text-sm-right pr-sm-2">Código:</div>
                  <b-input type="text" placeholder="Codigo" v-model.trim="serverCode"/>
                </b-form-group>
                <b-form-group horizontal :label-cols="2">
                  <div slot="label" class="text-sm-right pr-sm-2">Licencia:</div>
                  <b-input type="text" placeholder="Licencia" v-model.trim="license" />
                </b-form-group>
                <b-form-row>
                  <div class="col-sm-10 ml-sm-auto text-right">
                    <b-btn :variant="estadoRegistro" @click="setLicense()">Asignar Licencia</b-btn>
                  </div>
                </b-form-row>
              </b-form>
            </b-card-body>
          </b-card>
        </div>
        <div class="col-xs-12 col-md-5">
          <b-card no-body header="Informacion Licencia" header-tag="h6" class="mb-4 align-middle" 
            :header-bg-variant="headerColor" :header-text-variant="textHeaderColor">
            <b-card-body>
              <div class="small mb-2">Fecha de Activación<div class="float-right">{{ fechaLicencia }}</div></div>

              <div class="small">
                Número de Centros de Trabajo <div class="float-right"> {{centrosTrabajo.length}} de {{numeroEquipos}} ({{Math.round((centrosTrabajo.length/numeroEquipos)*100)}}%)</div>
              </div>
              <div class="progress mb-3" style="height: 4px;">
                <div :class="{'progress-bar':true, 'bg-danger':((centrosTrabajo.length/numeroEquipos)*100)>=80, 'bg-success':((centrosTrabajo.length/numeroEquipos)*100)<80}" :style="{width: String((centrosTrabajo.length/numeroEquipos)*100)+'%' }"></div>
              </div>

              <div class="small">
                Número de Dispositvos <div class="float-right"> {{dispositivos.length}} de {{numeroDispositivos}} ({{Math.round((dispositivos.length/numeroDispositivos)*100)}}%)</div>
              </div>
              <div class="progress mb-3" style="height: 4px;">
                <div :class="{'progress-bar':true, 'bg-danger':((dispositivos.length/numeroDispositivos)*100)>=80, 'bg-success':((dispositivos.length/numeroDispositivos)*100)<80}" :style="{width: String((dispositivos.length/numeroDispositivos)*100)+'%' }"></div>
              </div>

              <div class="small">
                Número de Tags <div class="float-right"> {{variablesDispositivosUsers.length}} de {{tagsAutorizados}} ({{Math.round((variablesDispositivosUsers.length/tagsAutorizados)*100)}}%)</div>
              </div>
              <div class="progress mb-3" style="height: 4px;">
                <div :class="{'progress-bar':true, 'bg-danger':((variablesDispositivosUsers.length/tagsAutorizados)*100)>=80, 'bg-success':((variablesDispositivosUsers.length/tagsAutorizados)*100)<80}" :style="{width: String((variablesDispositivosUsers.length/tagsAutorizados)*100)+'%' }"></div>
              </div>
            </b-card-body>
          </b-card>
        </div>
      </div>
    <!-- Información general de las opciones adquiridas -->

    <!-- Tabs de las opciones contenidas en la licencia -->
      <b-tabs class="nav-tabs-top nav-responsive-xl">
        <b-tab title="Centros de Trabajo" active>
          <div class="card-body">
            <p>
              <b-row>
                  <b-col md="6" class="my-1">
                    <b-form-group horizontal label="Filtrar" class="mb-0">
                      <b-input-group>
                        <b-form-input v-model="filterCentrosTrabajo" placeholder="Buscar..." />
                        <b-input-group-append>
                        <b-btn :disabled="!filterCentrosTrabajo" @click="filterCentrosTrabajo = ''"> <span class="oi oi-delete" ></span> </b-btn>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col md="5" class="my-1">
                      <b-form-group horizontal class="mb-0">
                      <b-form-select :options="pageOptionsCentrosTrabajo" v-model="perPageCentrosTrabajo" />
                      </b-form-group>
                  </b-col>
                  <b-col md="1" class="my-1">
                    <b-btn variant="outline-success borderless icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="addCentroTrabajo(); objState={}"><i class="ion ion-md-add"></i></b-btn>
                  </b-col>
              </b-row>
              <b-table small show-empty  stacked="md" :items="centrosTrabajo" :fields="centroTrabajoColumns"
                          :current-page="currentPageCentrosTrabajo"
                          :per-page="perPageCentrosTrabajo"
                          :filter="filterCentrosTrabajo" 
                          @filtered="onFilteredCentrosTrabajo">
                  <template v-slot:cell(edit)="row">
                    <div>
                      <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-on:click.stop.prevent="editarCentroTrabajo(row.item)" ><i class="ion ion-md-create"></i></b-btn>
                      <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="alarmRemoveCentroTrabajo(row.item)"><i class="ion ion-md-close"></i></b-btn>
                    </div>
                  </template>
              </b-table>
          </p>
          </div>
        </b-tab>
        <b-tab title="Dispositivos">
          <div class="card-body">
            <div class="row">
              <div class="col text-right">
                  <b-btn variant="outline-success borderless icon-btn" class="btn-md mb-1" @click.prevent="openAddDispositivo"><i class="ion ion-md-add"></i></b-btn>
              </div>
            </div>
            <p>
                <b-table small show-empty  stacked="md" :items="dispositivos" :fields="dispositivosColumns">
                  <template v-slot:cell(edit)="row">
                    <div>
                      <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="openUpdateDispositivo(row.item)"><i class="ion ion-md-create"></i></b-btn>
                      <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="openDeleteDispositivo(row.item)"><i class="ion ion-md-close"></i></b-btn>
                    </div>
                  </template>
                </b-table>
            </p>
          </div>
        </b-tab>
        <b-tab title="Mis Tags">
          <div class="card-body">
              <div class="row">
                  <div class="col">
                      <b-row>
                          <b-col md="6" class="my-1">
                              <b-form-group horizontal label="Filtrar" class="mb-0">
                                <b-input-group>
                                    <b-form-input v-model="filterVariablesUsers" placeholder="Buscar..." />
                                    <b-input-group-append>
                                    <b-btn :disabled="!filterVariablesUsers" @click="filterVariablesUsers = ''"> <span class="oi oi-delete" ></span> </b-btn>
                                    </b-input-group-append>
                                </b-input-group>
                              </b-form-group>
                          </b-col>
                          <b-col md="5" class="my-1">
                              <b-form-group horizontal class="mb-0">
                              <b-form-select :options="pageOptionsVariablesUsers" v-model="perPageVariablesUsers" />
                              </b-form-group>
                          </b-col>
                          <b-col md="1" class="my-1">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-md" @click="openAddCustomTags()"><i class="ion ion-md-add"></i></b-btn>
                          </b-col>
                      </b-row>
                      <b-table small show-empty  stacked="md" :items="variablesDispositivosUsers" 
                        :fields="variablesColumnsUsers" 
                        :current-page="currentPageVariablesUsers"
                        :per-page="perPageVariablesUsers"
                        :filter="filterVariablesUsers" 
                        @filtered="onFilteredVariablesUsers">
                        <template v-slot:cell(nombrevariable)="row">
                          <div>
                            <i v-if="row.item.is_timeseries" class="fas fa-circle text-success"></i>
                            <i v-if="!row.item.is_timeseries" class="fas fa-circle text-warning"></i>
                            {{row.item.nombrevariable}}
                          </div>
                        </template>
                        <template v-slot:cell(edit)="row">
                            <div>
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs"><i class="ion ion-md-create" @click="openUpdateCustomTags(row.item)"></i></b-btn>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" 
                                @click.prevent="openDeleteCustomTags(row.item)"><i class="ion ion-md-close"></i></b-btn>
                            </div>
                        </template>
                      </b-table>
                        <b-row>
                          <b-col md="6" class="my-1">
                              <b-pagination :total-rows="totalRowsVariablesUsers" :per-page="perPageVariables" v-model="currentPageVariablesUsers" class="my-0" />
                          </b-col>
                        </b-row>
                  </div>
              </div>
          </div>
        </b-tab>
        <b-tab title="FB SyncBox">
          <div class="card-body">
              <div class="row">
                  <div class="col">
                      <b-row>
                          <b-col md="6" class="my-1">
                            <b-form-group horizontal label="Filtrar" class="mb-0">
                              <b-input-group>
                                  <b-form-input v-model="filterVariables" placeholder="Buscar..." />
                                  <b-input-group-append>
                                  <b-btn :disabled="!filterVariables" @click="filterVariables = ''"> <span class="oi oi-delete" ></span> </b-btn>
                                  </b-input-group-append>
                              </b-input-group>
                            </b-form-group>
                          </b-col>
                          <b-col md="6" class="my-1">
                              <b-form-select :options="pageOptionsVariables" v-model="perPageVariables" />
                          </b-col>
                      </b-row>
                        <b-table small show-empty  stacked="md" :items="variablesDispositivos" 
                          :fields="variablesColumns" 
                          :current-page="currentPageVariables"
                          :per-page="perPageVariables"
                          :filter="filterVariables" 
                          @filtered="onFilteredVariables">
                        </b-table>
                        <b-row>
                          <b-col md="6" class="my-1">
                              <b-pagination :total-rows="totalRowsVariables" :per-page="perPageVariables" v-model="currentPageVariables" class="my-0" />
                          </b-col>
                      </b-row>
                  </div>
                </div>
          </div>
        </b-tab>
        <b-tab title="FB">
          <div class="card-body">
            <p>
                <b-table small show-empty  stacked="md" :items="itemsFB" :fields="fbColumns">
                </b-table>
            </p>
          </div>
        </b-tab>
      </b-tabs>
    <!-- Tabs de las opciones contenidas en la licencia -->


    <!-- Modal para la configuracion de los Dispositivos -->
      <b-modal size="md" v-model="showDispositivo">
        <div slot="modal-title">
          Dispositivos <span class="font-weight-light">Información</span><br>
          <small class="text-muted">Información necesaria para crear un nuevo dispositivo</small>
        </div>
        <b-row>
          <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Tipo Dispositivo:</div>
              <b-select v-model="idTypeDevice" :options="optionsDevicesType" />
            </b-form-group>
          </b-col>
          <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Código:</div>
              <b-input type="text" placeholder="Codigo Dispositivo" v-model.trim="codeDevices" :state="objState.codeDevices" v-on:input="objState.codeDevices = 'valid'; objState.codeDevices= objInfo.codeDevices==''?'invalid':'valid'"/>
            </b-form-group>
          </b-col>
          <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Ubicación:</div>
              <b-input type="text" placeholder="Ubicacion del Dispositivo" v-model.trim="locationDevices" :state="objState.locationDevices" v-on:input="objState.locationDevices = 'valid'; objState.locationDevices= objInfo.locationDevices==''?'invalid':'valid'"/>
            </b-form-group>
          </b-col>
          <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">IP:</div>
              <div class="border rounded" v-bind:class="statusIP">
                <vue-ip :ip="ipDevices" :port="portDevices" :on-change="change" class="mt-2 mb-1 ml-2"></vue-ip>
              </div>
              </b-form-group>
            <!-- <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">IP:</div>
              <b-input type="text" placeholder="Dirección IP del Dispositivo" v-model.trim="ipDevices" />
            </b-form-group> -->
          </b-col>
          <b-col md="12" >
            <!-- <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Puerto:</div>
              <b-input type="text" placeholder="Puerto de Comunicación" v-model.trim="portDevices" />
            </b-form-group> -->
          </b-col>
          <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Protocolo:</div>
              <b-select v-model="protocolDevices" >
                <option value="Tcp">Tcp</option>
                  <option value="Udp">Udp</option>
              </b-select>

            </b-form-group>
          </b-col>
        </b-row>
        <div slot="modal-footer" class="w-100 text-right">
          <b-btn variant="primary" @click="showDispositivo=false">
              Cerrar
          </b-btn>
            <b-btn :variant="estadoGuardarDispositivo" v-if="check_access('info_licence', 'c')" @click="saveDispositivo()">Guardar</b-btn>
          </div>
      </b-modal>
    <!-- Modal para la configuracion de los Dispositivos -->

    <!-- Modal para la configuracion de los centros de trabajo -->
      <b-modal size="lg" v-model="show">
        <div slot="modal-title">
          Centros de Trabajo <span class="font-weight-light">Información</span><br>
          <small class="text-muted">Información necesaria para monitorear este centro de trabajo</small>
        </div>
        <b-row>
          <b-col md="6" >
            <b-form-group horizontal :label-cols="2" :feedback="objState.message">
              <div slot="label" class="text-sm-right pr-sm-2">Código:</div>
              <b-input type="text" placeholder="Código Centro Trabajo" v-model.trim="codigoCentroTrabajoFB" :disabled="idCentroTrabajoFB!=null" :state="objState.codigoCentroTrabajoFB" v-on:input="objState.codigoCentroTrabajoFB = 'valid'; objState.codigoCentroTrabajoFB= objInfo.codigoCentroTrabajoFB==''?'invalid':'valid'"/>
            </b-form-group>
          </b-col>
          <b-col md="6" >
            <b-form-group horizontal :label-cols="2" :feedback="objState.message">
              <div slot="label" class="text-sm-right pr-sm-2">Descrip:</div>
              <b-input type="text" placeholder="Descripción Centro Trabajo" v-model.trim="descripcionCentroTrabajoFB" :state="objState.descripcionCentroTrabajoFB" v-on:input="objState.descripcionCentroTrabajoFB = 'valid'; objState.descripcionCentroTrabajoFB= objInfo.descripcionCentroTrabajoFB==''?'invalid':'valid'"/>
             </b-form-group>
          </b-col>
        </b-row>
        <div class="w-100 text-right mb-3 mt-0">
          <b-btn :variant="estadoGuardarCentroTrabajo" v-if="check_access('info_licence', 'c')" @click="saveWorkStation()">Guardar</b-btn>
        </div>
        <b-table small show-empty  stacked="md" :items="variablesCentroTrabajoFB" :fields="fbCentrosTrabajo">
            <template v-slot:cell(edit)="row">
                <div>
                  <b-button size="sm" v-if="row.item.start_value == null" @click.stop="row.toggleDetails" variant="outline-success borderless icon-btn">
                    <!-- {{ row.detailsShowing ? 'Hide' : 'Show' }}  -->
                  
                    <i class="ion ion-md-create" v-if="!row.detailsShowing"></i>
                    <i class="ion ion-ios-arrow-up" v-if="row.detailsShowing"></i>
                  </b-button>
                    <!-- <b-btn variant="outline-success borderless icon-btn" v-if="props.item.start_value === null" class="btn-xs" 
                    @click.stop="row.toggleDetails"
                    ><i class="ion ion-md-create"></i></b-btn>
                    -->
                    <b-btn variant="outline-danger borderless icon-btn" v-if="row.item.start_value != null" size="sm" @click="alertDeleteFB(row.item)"><i class="ion ion-md-close"></i></b-btn>
                </div>
            </template>
            <template v-slot:row-details="row">
              <b-card>
                <div class="row">
                  <div class="col">
                    <b-input type="number" min="0" step="1" placeholder="Posición de Inicio" v-model.trim="fbStartPosition"/>
                  </div>
                  <div class="col">
                    <b-select v-model="plcSelected" :options="optionsPLC" />
                  </div>
                </div>
                <div class="w-100 text-right mt-2 mb-0">
                  <b-btn variant="outline-success" v-if="check_access('info_licence', 'c')" @click="setFunctionBlock(row.item.fb_id, fbStartPosition, plcSelected)">Guardar</b-btn>
                </div>
              </b-card>
            </template>
          </b-table>
          <div slot="modal-footer" class="w-100">
              <!-- <p class="float-left">Modal Footer Content</p> -->
              <b-btn class="float-right" variant="primary" @click="show=false">
                Cerrar
              </b-btn>
            </div>
      </b-modal>

    <!-- Modal para la configuracion de los centros de trabajo -->

<!--:custom-label="nameWithLang"-->

    <!-- Modal para la configuracion de Custom Tags -->
      <b-modal size="md" v-model="showCustomTags">
        <div slot="modal-title">
          Mis Tags <span class="font-weight-light">Información</span><br>
          <small class="text-muted">Información necesaria para crear un nuevo Tag</small>
        </div>
        <b-row>
          <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Nombre del Tag:</div>
              <b-input type="text" placeholder="Nombre del Tag" v-model.trim="customTagName" :state="objState.customTagName" v-on:input="objState.customTagName = 'valid'; objState.customTagName= objInfo.customTagName==''?'invalid':'valid'"/>
            </b-form-group>
          </b-col>
          <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Centro de Trabajo:</div>
                <multiselect
                  v-model="selectedCentroTrabajo"
                  :options="centrosTrabajo"
                  
                  placeholder="Seleccione un Centro de Trabajo"
                  label="codigoCentroTrabajo"
                  track-by="codigoCentroTrabajo" />
            </b-form-group>
          </b-col>
          <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Dispositivo:</div>
              <b-select v-model="plcSelected" :options="optionsPLC" />
            </b-form-group>
          </b-col>
          <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Tipo Dato:</div>
              <b-select v-model="selectedTipoDatos" :options="tipoDatos" />

            </b-form-group>
          </b-col>
          <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Tipo Área:
              </div>
              <b-select v-model="tipoAreaMemoria" >
                <option value="D">DM</option>
              </b-select>
            </b-form-group>
          </b-col>
           <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Área de Memoria:</div>
              <b-input type="number" placeholder="Area de Memoria" min="0" step="1" v-model.trim="areaMemoriaPosition"  />
            </b-form-group>
          </b-col>
        </b-row>
           <b-col md="12" >
            <b-form-group horizontal :label-cols="3">
              <div slot="label" class="text-sm-right pr-sm-2">Serie de Tiempo:</div>
              <b-check v-model.trim="is_timeseries"  />
            </b-form-group>
           </b-col>
        <div slot="modal-footer" class="w-100 text-right">
          <b-btn variant="primary" @click="showCustomTags=false">
              Cerrar
          </b-btn>
            <b-btn :variant="estadoGuardarCustomTags" v-if="check_access('info_licence', 'c')" @click="saveAddCustomTags()">Guardar</b-btn>
          </div>
      </b-modal>
    <!-- Modal para la configuracion de Custom Tags -->


    <!-- Alertas -->
        <!-- Eliminar Dispositivos -->
          <sweet-modal icon="warning" :title="'Eliminar Dispositivo'" ref="alertDeleteDispositivo">
            <b>¡ATENCIÓN! </b>
            <div class="w-100"></div>
            Con esta acción eliminará el dispositivo <b>{{codeDevices}}</b>, las áreas de memoria configuradas previamente en todos los centros de trabajo que dependan del mismo dispositivo, incluyendo las configuración de los FB.
            <div class="w-100 text-danger">Esta acción <b>NO</b> se podrá deshacer</div>
            <div class="w-100"></div>
            ¿Realmente desea proceder?
                    
            <template slot="button">
              <div class="d-flex justify-content-between">
                <b-btn class="btn-warning" @click="DropDispositivo">Eliminar</b-btn>
                    <!-- <div>{{codigoCentroTrabajoFB}}</div> -->
                <b-btn @click="$refs.alertDeleteDispositivo.close()">Cerrar</b-btn>
                
              </div>
            </template>
          </sweet-modal>
        <!-- Eliminar Dispositivos -->

        <!-- Eliminar SyncBox FB -->
          <sweet-modal icon="warning" :title="'Eliminar SyncBox FB'" ref="alertDeleteFB">
                    <b>¡ATENCIÓN! </b>
                    <div class="w-100"></div>
                    Con esta acción eliminará las áreas de memoria configuradas previamente, impidiendo que este centro de trabajo operen de forma correcta.
                    <div class="w-100 text-danger">Esta acción <b>NO</b> se podrá deshacer</div>
                    <div class="w-100"></div>
                    ¿Realmente desea Continuar?
                      
            <template slot="button">
              <div class="d-flex justify-content-between">
                <b-btn class="btn-warning" @click="deleteFB">Eliminar</b-btn>
                      <!-- <div>{{codigoCentroTrabajoFB}}</div> -->
                    <b-btn @click="$refs.alertDeleteFB.close()">Cerrar</b-btn>
                  
                    </div>
            </template>
          </sweet-modal>
        <!-- Eliminar SyncBox FB -->

        <!-- Eliminar Centros de Trabajo -->
          <sweet-modal icon="warning" :title="'Eliminar Centro Trabajo: '+codigoCentroTrabajoFB" ref="errorWithButtonAlert">
                    <b>¡ATENCIÓN! </b>
                    <div class="w-100"></div>
                    Con esta acción eliminará la configuración de SyncBox i4.0 en la plataforma local y no podrá ver la información generada por el Centro de Trabajo <b>{{codigoCentroTrabajoFB}}</b>.
                    <div class="w-100 text-danger">Esta acción <b>NO</b> se podrá deshacer</div>
                    <div class="w-100"></div>
                    ¿Realmente desea Continuar?
                      
              <template slot="button">
                <div class="d-flex justify-content-between">
                  <b-btn class="btn-warning" @click="deleteWorkStation">Eliminar</b-btn>
                      <!-- <div>{{codigoCentroTrabajoFB}}</div> -->
                  <b-btn @click="$refs.errorWithButtonAlert.close()">Cerrar</b-btn>
                  
                </div>
              </template>
          </sweet-modal>
        <!-- Eliminar Centros de Trabajo -->

        <!-- Eliminar Custom Tags -->
          <sweet-modal icon="warning" :title="'Eliminar Mis Variables'" ref="alertaDeleteCustomTag">
            <b>¡ATENCIÓN! </b>
            <div class="w-100"></div>
            Con esta acción eliminará una variable personalizada, podría ocasionar una perdida en la información o generar problemas en el correcto funcionamiento de los servicios que dependan de ello.
            <div class="w-100 text-danger">Esta acción <b>NO</b> se podrá deshacer</div>
            <div class="w-100"></div>
            ¿Realmente desea Continuar?
                    
            <template slot="button">
              <div class="d-flex justify-content-between">
                <b-btn class="btn-warning" @click="eliminarCustomTag">Eliminar</b-btn>
                    <!-- <div>{{codigoCentroTrabajoFB}}</div> -->
                <b-btn @click="$refs.alertaDeleteCustomTag.close()">Cerrar</b-btn>
                
              </div>
            </template>
          </sweet-modal>
        <!-- Eliminar Custom Tags -->

    <!-- Alertas -->
        <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>
    <notifications group="notifications-default" />
  </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
import axios from 'axios'
import moment from 'moment'
import Vue from 'vue'
import VueIp from 'vue-ip';
import Multiselect from 'vue-multiselect'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

import { ObtenerInfoLicense, SetInfoLicense } from "@/vendor/sbx/sbx-cloud/cloud_control";
import { GetVariablesFB, AddVariablesFB, DeleteVariablesFB } from "@/vendor/sbx/sbx-cloud/cloud_FB";
import { UpdateCentrosTrabajo, AddCentrosTrabajo, DropWorkStation } from "@/vendor/sbx/sbx-cloud/cloud_workcenter";
import { UpdateDevices,AddDevices,DropDevices } from "@/vendor/sbx/sbx-cloud/cloud_devices";
import { AddCustomVariables,UpdateCustomVariables,DeleteCustomVariables } from "@/vendor/sbx/sbx-cloud/cloud_customvars";
import VueMarkdown from 'vue-markdown'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";

import Notifications from 'vue-notification'
import {infousers} from '@/components/i40/js/users'

Vue.use(Notifications)

export default {
  
  metaInfo: {
    title: 'Licencia'
  },
  components: {
    Multiselect,
    SweetModal,
    SweetModalTab,
    'vue-ip':VueIp,
    VueMarkdown
  },
  data: () => ({
      name: 'InfoLicense',
      version: 'v1.0.0.0',
      contentWiki:'',
        anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },

      items:null,
      license:"",
      serverCode: "",
      estadoRegistro:"outline-info",
      tituloEstado:"",
      headerColor:"withe",
      textHeaderColor:"dark",

    ///DatosLicencia
      fechaLicencia:"",
      numeroEquipos:0,
      numeroDispositivos:0,
      tagsAutorizados:0,
    ///

    ///Tablas
      centrosTrabajo:[],
      dispositivos:[],
      variablesDispositivos:[],
      variablesDispositivosUsers:[],
    ///
    objState:{},

    ///Titulos Tablas
      variablesColumns: [
        {key:'idVariablesDispositivos', label:"Código"},
        {key:'codigoCentroTrabajo', label:"Código Centro Trabajo"},
        {key:'codigoDispositivo', label:"Código Dispositivo"},
        {key:'codigoTipoDato', label:"Tipo Dato"},
        {key:'nombreVariable', label:"Nombre Variable"},

        {key:'idCentroTrabajo', label:"Código", thClass: 'd-none', tdClass: 'd-none'},
        {key:'controlCritico', label:"Código", thClass: 'd-none', tdClass: 'd-none'},
      ],

      variablesColumnsUsers: [
        {key:'idvariablesdispositivos', label:"Código"},
        {key:'codigocentrotrabajo', label:"Centro Trabajo"},
        {key:'codigodispositivo', label:"Dispositivo"},
        {key:'nombrevariable', label:"Nombre Variable"},
        {key:'tipodato', label:"Tipo Dato"},
        {key:'tipomemoria', label:"Tipo Memoria"},
        {key:'areamemoria', label:"Área Memoria"},

        {key:'iddispositivo', label:"Código", thClass: 'd-none', tdClass: 'd-none'},
        {key:'idtiposdatos', label:"Código", thClass: 'd-none', tdClass: 'd-none'},
        {key:'idcentrostrabajo', label:"Código", thClass: 'd-none', tdClass: 'd-none'},
        {key:'edit', label:"Editar"},
      ],

      dispositivosColumns: [
        {key:'idDispositivo', label:"Identificador"},
        {key:'nombretiposdispositivo', label:"Dispositivo"},
        {key:'ubicacion', label:"Ubicación"},
        {key:'codigoDispositivo', label:"Código Dispositivo"},
        {key:'ipDispositivo', label:"IP Dispositivo"},
        {key:'puerto', label:"Puerto"},
        {key:'protocolo', label:"Protocolo"},
        {key:'edit', label:"Editar"},
      ],

      centroTrabajoColumns: [
        {key:'idCentrosTrabajo', label:"Id Centro Trabajo"},
        {key:'codigoCentroTrabajo', label:"Centro Trabajo"},
        {key:'descripcioncentrotrabajo', label:"Descripción"},
        {key:'sbxcode', label:"SBX"},
        {key:'edit', label:"Editar"},

        {key:'idCentroTrabajo', label:"Código", thClass: 'd-none', tdClass: 'd-none'},
      ],

      fbColumns:[ {key:'fb_id', label:"fb_id", thClass: 'd-none', tdClass: 'd-none'},
        {key:'name', label:"Bloque de Función"},
        {key:'type', label:"Tipo"},
        {key:'version', label:"Versión"},
        {key:'status', label:"Estado"}],
      itemsFB:[],

      fbCentrosTrabajo:[ {key:'fb_id', label:"fb_id", thClass: 'd-none', tdClass: 'd-none'},
        {key:'name', label:"Blóque de Función"},
        {key:'type', label:"Tipo"},
        {key:'version', label:"Versión"},
        {key:'status', label:"Estado"},
        {key:'start_value', label:"Posición Inicio"},
        {key:'dispositivo', label:"Dispositivo"},
        {key:'edit', label:"Editar"}],

    ///

    ///Filtros y Paginación
      ///Variables
      currentPageVariables: 1,
      totalRowsVariables: 0,
      perPageVariables: 30,
      pageOptionsVariables: [ 30, 60, 90, 120, 150, 180 ],
      filterVariables: null,

      ///Custom Tags
      currentPageVariablesUsers: 1,
      totalRowsVariablesUsers: 0,
      perPageVariablesUsers: 30,
      pageOptionsVariablesUsers: [ 30, 60, 90, 120, 150, 180 ],
      filterVariablesUsers: null,

      ///Centros de Trabajo
      currentPageCentrosTrabajo: 1,
      totalRowsCentrosTrabajo: 0,
      perPageCentrosTrabajo: 30,
      pageOptionsCentrosTrabajo: [ 30, 60, 90, 120, 150, 180 ],
      filterCentrosTrabajo: null,

      ///Tablas Modals
      variablesCentroTrabajoFB:[],
      plcSelected:0,
      fbStartPosition:null,
    ///

    ///Variables
      ///
      idFB: null,
      idCentroTrabajoFB: null,
      codigoCentroTrabajoFB: "",
      descripcionCentroTrabajoFB: "",
      estadoGuardarCentroTrabajo: "outline-success",
      ///

      ///Combo PLC Selected
      optionsPLC:[],

      ///Modal Status
      show:false,

      ///Variables Dispositivos
      showDispositivo:false,
      estadoGuardarDispositivo:"success",
      optionsDevicesType: [],
      idTypeDevice:0,
      idDevice: 0,
      ipDevices: "",
      portDevices: 0,
      codeDevices: "",
      locationDevices: "",
      protocolDevices: null,
      statusIP: "",
    ///

    ///Custom Tags
      estadoGuardarCustomTags:"success",
      idCustomTags:0,
      showCustomTags:false,
      selectedCentroTrabajo:{},
      customTagName:"",
      selectedTipoDatos:null,
      tipoDatos:[],
      tipoAreaMemoria:null,
      areaMemoriaPosition:null,
      is_timeseries:false,
    ///


  }),
methods: {
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
        ///Funcion para cargar la ayuda del helper

    showCustom: function(classes, title, text) {
       this.$notify({
           group: 'notifications-default',
           type: classes,
           title: title,
           text: text
       })
    },

    infoLimitsLicense(actuales,maximo){
      let porcentaje = parseInt((actuales/maximo)*100);
      let result = {
        width: String(porcentaje)+'%'
      }
      return result
    },

  ///Licencia
    infoLicence(datosLicencia){
      this.centrosTrabajo=[]
      this.dispositivos=[]
      this.variablesDispositivos=[]
      this.optionsDevicesType=[]
      
      this.fechaLicencia = ""
      this.numeroEquipos = ""
      this.numeroDispositivos = ""

      if(this.license === ""){

        this.estadoRegistro= "outline-warning"
        this.tituloEstado="Estado de Licencia: Sin Asignar"
        this.headerColor="warning",
        this.textHeaderColor="dark"

      }else{
        try{
          
          var info = JSON.parse(datosLicencia.data.Informacion)
          if(JSON.parse(info)[0].activacion === null){
           
            this.estadoRegistro= "outline-danger"
            this.tituloEstado="Estado de Licencia: Error en activación"

            this.headerColor="danger"
            this.textHeaderColor="white"
            
          } else {
            this.estadoRegistro= "outline-success"
            this.tituloEstado="Estado de Licencia: Licencia Validada Correctamente"

            this.headerColor="success",
            this.textHeaderColor="white"

            var content = JSON.parse(info)[0]
            
            if(content.centrosTrabajo!=null)
              this.centrosTrabajo = content.centrosTrabajo
            
            if(content.dispositivos!=null){
              this.dispositivos = content.dispositivos
             this.optionsPLC.push({value:0,text:"Seleccione"})
              for(var i=0;i<this.dispositivos.length;i++){
                 this.optionsPLC.push({value:this.dispositivos[i].idDispositivo,text:this.dispositivos[i].codigoDispositivo})
              }
            }
            
            for(var i=0;i<content.tiposdisp.length;i++){
              this.optionsDevicesType.push({value:content.tiposdisp[i].idtiposdispositivo,text:content.tiposdisp[i].codigotiposdispositivo})
            }

            if(content.variablesDispositivos!=null)
              this.variablesDispositivos = content.variablesDispositivos

            if(content.variablesDispositivosUsers!=null)
              this.variablesDispositivosUsers = content.variablesDispositivosUsers
            
            if(content.fb!=null)
              this.itemsFB = content.fb
            

            for(var i=0;i<content.tiposdatos.length;i++){
                 this.tipoDatos.push({value:content.tiposdatos[i].idtiposdatos,text:content.tiposdatos[i].codigo})
              }
            
            this.fechaLicencia = moment(content.activacion[0].fechaactivacion).format("YYYY-MM-DD hh:mm")
            this.numeroEquipos = content.activacion[0].numerocentrotrabajo
            this.numeroDispositivos = content.activacion[0].numerodispositivos
            this.tagsAutorizados = content.activacion[0].tags_autorizados
          }
        }
        catch(e){}
      }
    },

    setLicense(){
      SetInfoLicense(this.serverCode, this.license).then(data =>{
        this.infoLicence(data)
      })
    },
  ///Licencia

  ///Filtros Tablas  
    fetchEventsList: function() {
      // axios
      // .get('https://datosinside.syncbox.cloud/getVars')
      // .then(response => (this.items = response.data ))

    },

    onFilteredVariables (filteredItems) {
        this.totalRowsVariables = filteredItems.length
        this.currentPageVariables = 1
    },

    onFilteredVariablesUsers (filteredItems) {
        this.totalRowsVariablesUsers = filteredItems.length
        this.currentPageVariables = 1
    },

    onFilteredCentrosTrabajo (filter) {
        this.totalRowsCentrosTrabajo = filter.length
        this.currentPageCentrosTrabajo = 1
    },
  ///Filtros Tablas

  ///Methods Modals Centros Trabajo
    editarCentroTrabajo(item){
      
      if(item.idCentrosTrabajo != null){
        this.estadoGuardarCentroTrabajo="outline-warning"
      }
      else{
        this.estadoGuardarCentroTrabajo="outline-success"
      }
      
      this.idCentroTrabajoFB=item.idCentrosTrabajo
      this.codigoCentroTrabajoFB=item.codigoCentroTrabajo
      this.descripcionCentroTrabajoFB=item.descripcioncentrotrabajo

      if(this.idCentroTrabajoFB != null){
        GetVariablesFB(this.serverCode,this.license,item.idCentrosTrabajo).then(data =>{
          this.variablesCentroTrabajoFB = data.data 
        })
      }

       this.show=true
    },

    addCentroTrabajo(){
      
      this.estadoGuardarCentroTrabajo="outline-success"

      this.idCentroTrabajoFB=null
      this.codigoCentroTrabajoFB=""
      this.descripcionCentroTrabajoFB=""
      this.variablesCentroTrabajoFB=[]

      this.show=true
    },

    alarmRemoveCentroTrabajo(item){
      this.idCentroTrabajoFB=item.idCentrosTrabajo
      this.codigoCentroTrabajoFB=item.codigoCentroTrabajo
      this.descripcionCentroTrabajoFB=item.descripcioncentrotrabajo
      this.$refs.errorWithButtonAlert.open()
    },

    alertDeleteFB(item){
      this.idFB=item.fb_id
      this.$refs.alertDeleteFB.open()
    },

    saveWorkStation(){
      if(this.validate_content()){
        if(this.idCentroTrabajoFB == null){
          AddCentrosTrabajo({
            NumeroValidacion: this.serverCode,
            Licencia: this.license,
            Codigo: this.codigoCentroTrabajoFB,
            Descripcion: this.descripcionCentroTrabajoFB
          }).then(data => {
            if(data.status == 200){
                this.showCustom("bg-success", "Registro Creado", "¡El Centro de Trabajo se ha Creado con Éxito!")
                this.centrosTrabajo=data.data[0].centros
                this.idCentroTrabajoFB=data.data[0].id[0].max
                this.variablesCentroTrabajoFB=data.data[0].fb
              }else{
                this.showCustom("bg-danger", "Error", data.data)
              }
          }).catch(error => {
              this.showCustom("bg-danger", "Error " + error.response.statusText, error.response.data)
          });
        }else{
          UpdateCentrosTrabajo({
            IdCentroTrabajo: this.idCentroTrabajoFB, 
            NumeroValidacion: this.serverCode,
            Licencia: this.license,
            Codigo: this.codigoCentroTrabajoFB,
            Descripcion: this.descripcionCentroTrabajoFB}).then(data =>{
              if(data.status == 200){
                this.showCustom("bg-warning", "Registro Modificado", "¡El Centro de Trabajo se ha Modificado con Éxito!")
                this.centrosTrabajo=data.data
              }else{
                this.showCustom("bg-danger", "Error", data.data)
              }
          })
        }
      }else{
        this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
      }
    },

    deleteWorkStation(){
      DropWorkStation({
         IdCentroTrabajo: this.idCentroTrabajoFB, 
          NumeroValidacion: this.serverCode,
          Licencia: this.license,
      }).then(data =>{
        if(data.status == 200){
          this.showCustom("bg-warning", "Registro Eliminado", "¡El Centro de Trabajo se ha Eliminado con éxito!")
          
          if(data.data[0].ct == null){
            this.centrosTrabajo=[]
          }else{
            this.centrosTrabajo=data.data[0].ct
          }

          if(data.data[0].vars == null){
            this.variablesDispositivos=[]
          }else{
            this.variablesDispositivos=data.data[0].vars
          }
            
          }else{
             this.showCustom("bg-danger", "Error", data.data)
          }

      })
      
      this.$refs.errorWithButtonAlert.close()
      
    },

    setFunctionBlock(idFunctionBlock, startPosition, idPLC){
      if( this.variablesCentroTrabajoFB != null){
        AddVariablesFB({
          NumeroValidacion: this.serverCode,
          Licencia: this.license,
	        IdFB             : idFunctionBlock,
	        StartPosition    : parseInt(startPosition),
	        IdCentroTrabajo  : this.idCentroTrabajoFB,
	        IdDispositivo    : idPLC
        }).then(data =>{
          this.variablesCentroTrabajoFB=data.data[0].array_to_json
          this.variablesDispositivos = data.data[0].vars

           this.showCustom("bg-success", "FB Creados", "¡FB Creado con Éxito!")
        })
      }
    },

    deleteFB(){
      DeleteVariablesFB({
        NumeroValidacion: this.serverCode,
        Licencia: this.license,
        IdCentroTrabajo: this.idCentroTrabajoFB, 
        IdFB: this.idFB
      }).then(data => {

         if(data.data[0].vars == null){
            this.variablesDispositivos=[]
          }else{
            this.variablesDispositivos=data.data[0].vars
          }

          if(data.data[0].array_to_json == null){
            this.variablesCentroTrabajoFB=[]
          }else{
            this.variablesCentroTrabajoFB=data.data[0].array_to_json
          }

          this.showCustom("bg-warning", "Registro Eliminado", "¡El Centro de Trabajo se ha Eliminado con Éxito!")
          
          this.$refs.alertDeleteFB.close()
        
      })
    },
  ///Methods Modals Centros Trabajo

  ///Metodos Modals Dispositivos
    openAddDispositivo(){
      this.codeDevices="";
      this.locationDevices="";
      this.idTypeDevice="";
      this.idDevice=null;
      this.ipDevices="0.0.0.0";
      this.portDevices=0;
      this.protocolDevices=null;
      this.showDispositivo=true
    },
    openUpdateDispositivo(item){
      this.codeDevices=item.codigoDispositivo;
      this.locationDevices=item.ubicacion;
      this.idTypeDevice=item.idtiposdispositivo;
      this.idDevice=item.idDispositivo;
      this.ipDevices=item.ipDispositivo;
      this.portDevices=item.puerto;
      this.protocolDevices=item.protocolo;
      this.estadoGuardarDispositivo="warning";
      this.showDispositivo=true
    },
    openDeleteDispositivo(item){
      this.codeDevices=item.codigoDispositivo;
      this.idDevice=item.idDispositivo;
      this.$refs.alertDeleteDispositivo.open()
    },
    AddDevices(){
      if(this.validate_content_AddDevices()){
      AddDevices({
          NumeroValidacion: this.serverCode,
          Licencia: this.license,
          CodigoDispositivo: this.codeDevices,
          Ubicacion: this.locationDevices,
          IdTipoDispositivo: this.idTypeDevice,
          IpDispositivo: this.ipDevices,
          Puerto: parseInt(this.portDevices),
          Protocolo: this.protocolDevices
        }).then(data => {
          if(data.status == 200){
            if(data.data != null){
              this.dispositivos=data.data
              this.showCustom("bg-success", "Registro Creado", "¡El Dispositivo se ha Creado con Éxito!")
              this.showDispositivo=false
            }
          }else{
            this.showCustom("bg-warning", "Advertencia ", data.data)
          }
        }).catch(error => {
            this.showCustom("bg-danger", "Error " + error.response.statusText, error.response.data)
        });
      }else{
            this.showCustom("bg-danger", "Error ", "¡La Información esta Incompleta, Por Favor Valide!")
      }
    },
    UpdateDispositivo(){
      UpdateDevices({
        NumeroValidacion: this.serverCode,
        Licencia: this.license,
        CodigoDispositivo: this.codeDevices,
        Ubicacion: this.locationDevices,
        IdTipoDispositivo: this.idTypeDevice,
        IpDispositivo: this.ipDevices,
        Puerto: parseInt(this.portDevices),
        Protocolo: this.protocolDevices,
        IdDispositivo: this.idDevice
      }).then(data => {
          if(data.status == 200){
            if(data.data != null){
              this.dispositivos=data.data
              this.showCustom("bg-warning", "Registro Modificado", "¡El Dispositivo se ha Modificado con Éxito!")
              this.showDispositivo=false
            }
          }else{
            this.showCustom("bg-warning", "Advertencia ", data.data)
          }
        }).catch(error => {
            this.showCustom("bg-danger", "Error " + error.response.statusText, error.response.data)
        });
    },

    DropDispositivo(){
      DropDevices({
        NumeroValidacion: this.serverCode,
        Licencia: this.license,
        IdDispositivo: this.idDevice
      }).then(data => {
          if(data.status == 200){
            if(data.data != null){
              this.showCustom("bg-warning", "Dispositivo Eliminado", "¡El Dispositivo se ha Eliminado con Éxito!")
               var content = data.data[0]
              
              if(content.dispositivos!=null){
                this.dispositivos = content.dispositivos
                this.optionsPLC = []
                this.optionsPLC.push({value:0,text:"Seleccione"})
                for(var i=0;i<this.dispositivos.length;i++){
                  this.optionsPLC.push({value:this.dispositivos[i].idDispositivo,text:this.dispositivos[i].codigoDispositivo})
                }
              }

              if(content.variablesDispositivos!=null)
                this.variablesDispositivos = content.variablesDispositivos
                
              if(content.variablesDispositivosUsers!=null)
                this.variablesDispositivosUsers = content.variablesDispositivosUsers
              
              if(content.fb!=null)
                this.itemsFB = content.fb

              this.$refs.alertDeleteDispositivo.close()
            }
          }else{
            this.showCustom("bg-warning", "Advertencia ", data.data)
          }
        }).catch(error => {
            this.showCustom("bg-danger", "Error " + error.response.statusText, error.response.data)
        });
    },
    openDeleteCustomTags(item){
      this.idCustomTags=item.idvariablesdispositivos;
      this.$refs.alertaDeleteCustomTag.open()
    },
    saveDispositivo(){
      if (this.idDevice == null){
        this.AddDevices();
      }else{
        this.UpdateDispositivo();
      }
    },
    change(ip, port, valid) {
      this.ipDevices=ip
      this.portDevices = port

      if(!valid){
        this.statusIP="border-top-0 border-left-0 border-right-0 rounded-0 border-danger"
      }else{
        this.statusIP="border-top-0 border-left-0 border-right-0 rounded-0 border-success"
      }
    },
  ///

  ///Metodos Mis Tags SyncBox
    openAddCustomTags(){
      this.estadoGuardarCustomTags="success";
      this.idCustomTags=0;
      this.selectedCentroTrabajo=null;
      this.customTagName="";
      this.selectedTipoDatos=null;
      this.plcSelected=null;
      this.tipoAreaMemoria=null;
      this.areaMemoriaPosition=null;

      this.showCustomTags = true;
    },

    openUpdateCustomTags(item){
      this.estadoGuardarCustomTags="warning";
      var i=0
      for(i=0;i<this.centrosTrabajo.length;i++){
        if(this.centrosTrabajo[i].idCentrosTrabajo === item.idcentrostrabajo){
          this.selectedCentroTrabajo=this.centrosTrabajo[i]
        }
      }

      this.idCustomTags=item.idvariablesdispositivos;
      this.customTagName=item.nombrevariable;
      this.plcSelected=item.iddispositivo;
      this.selectedTipoDatos=item.idtiposdatos;
      this.tipoAreaMemoria=item.tipomemoria;
      this.areaMemoriaPosition=item.areamemoria;
      this.showCustomTags=true
      this.is_timeseries=item.is_timeseries
    },
    
    addCustomTag(){
      if(this.validate_addCustomTag()){
        AddCustomVariables({
          NumeroValidacion: this.serverCode,
          Licencia: this.license,
          IdCentroTrabajo: this.selectedCentroTrabajo.idCentrosTrabajo,
          IdDispositivo: this.plcSelected,
          IdTipoDato: this.selectedTipoDatos,
          NombreVariable: this.customTagName,
          AreaMemoria: this.tipoAreaMemoria,
          ComandoLectura: this.areaMemoriaPosition,
          ComandoEscritura: this.areaMemoriaPosition,
          ControlCritico: false,
          timeseries:this.is_timeseries,
        }).then(data => {
          if(data.status == 200){
            if(data.data != null){
              this.variablesDispositivosUsers=data.data
              this.showCustom("bg-success", "Registro Creado", "¡El Tag se ha Creado con Éxito!")
              this.showCustomTags=false
            }
          }else{
            this.showCustom("bg-warning", "Advertencia ", data.data)
          }
        }).catch(error => {
            this.showCustom("bg-danger", "Error " + error.response.statusText, error.response.data)
        });
      }else
        this.showCustom("bg-danger", "Error ", "¡La Información esta Incompleta, Por Favor Valide!")
    
    },


    updateCustomTag(){
      UpdateCustomVariables({
          NumeroValidacion: this.serverCode,
          Licencia: this.license,
          IdCentroTrabajo: this.selectedCentroTrabajo.idCentrosTrabajo,
          IdDispositivo: this.plcSelected,
          IdTipoDato: this.selectedTipoDatos,
          NombreVariable: this.customTagName,
          AreaMemoria: this.tipoAreaMemoria,
          ComandoLectura: this.areaMemoriaPosition,
          ComandoEscritura: this.areaMemoriaPosition,
          ControlCritico: false,
          IdVariablesDispositivos: this.idCustomTags,
          timeseries:this.is_timeseries,
        }).then(data => {
          if(data.status == 200){
            if(data.data != null){
              this.variablesDispositivosUsers=data.data
              this.showCustom("bg-warning", "Registro Actualizado", "¡El Tag se ha Actualizado con Éxito!")
              this.showCustomTags=false
            }
          }else{
            this.showCustom("bg-warning", "Advertencia ", data.data)
          }
        }).catch(error => {
            this.showCustom("bg-danger", "Error " + error.response.statusText, error.response.data)
        });
    },

    eliminarCustomTag(){
      DeleteCustomVariables({
        NumeroValidacion: this.serverCode,
        Licencia: this.license,
        IdVariablesDispositivos: this.idCustomTags
      }).then(data => {
          if(data.status == 200){
            if(data.data != null){
              this.showCustom("bg-warning", "Mi Variable Eliminada", "¡Mi Variable se ha Eliminado con éxito!")
              this.variablesDispositivosUsers=data.data
            }
          }else{
            this.showCustom("bg-warning", "Advertencia ", data.data)
          }
        }).catch(error => {
            this.showCustom("bg-danger", "Error " + error.response.statusText, error.response.data)
        });
      this.$refs.alertaDeleteCustomTag.close()
    },

    saveAddCustomTags(){
      if(this.idCustomTags === 0){
        this.addCustomTag()
      }else{
        this.updateCustomTag()
      }
    },
  ///
  ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
  
  validate_content(){
    let isOK = true;
    this.objState = {}
    this.objState.message = 'Este Campo es Oblogatorio'
    if (this.codigoCentroTrabajoFB == ''){
        this.objState.codigoCentroTrabajoFB = 'invalid'
        isOK = false;
    }else{
        this.objState.codigoCentroTrabajoFB = 'valid'
    }
    if (this.descripcionCentroTrabajoFB == ''){
         this.objState.descripcionCentroTrabajoFB = 'invalid'
         isOK = false;
    }else{
        this.objState.descripcionCentroTrabajoFB = 'valid'
    }
  
    return isOK
  },
          
    
     validate_content_AddDevices(){
        let isOK = true;
        this.objState = {}
        this.objState.message = 'Este Campo es Oblogatorio'
        // if (this.objInfo.serverCode == ''){
        //     this.AddDevices.serverCode = 'invalid'
        //     isOK = false;
        // }else{
        //     this.objState.serverCode = 'valid'
        // }
        // if (this.AddDevices.license == ''){
        //      this.objState.license = 'invalid'
        //      isOK = false;
        // }else{
        //     this.objState.license = 'valid'
        // }
        if (this.codeDevices == ''){
             this.objState.codeDevices = 'invalid'
             isOK = false;
        }else{
            this.objState.codeDevices = 'valid'
        }
        if (this.locationDevices == ''){
             this.objState.locationDevices = 'invalid'
             isOK = false;
        }else{
            this.objState.locationDevices = 'valid'
        }
        // if (this.AddDevices.idTypeDevice == ''){
        //      this.objState.idTypeDevice = 'invalid'
        //      isOK = false;
        // }else{
        //     this.objState.idTypeDevice = 'valid'
        // }
        // if (this.AddDevices.ipDevices == ''){
        //      this.objState.ipDevices = 'invalid'
        //      isOK = false;
        // }else{
        //     this.objState.ipDevices = 'valid'
        // }
        // if (this.AddDevices.protocolDevices == ''){
        //      this.objState.protocolDevices = 'invalid'
        //      isOK = false;
        // }else{
        //     this.objState.protocolDevices = 'valid'
        return isOK
   },

   validate_addCustomTag(){
      let isOK = true;
      this.objState = {}
      this.objState.message = 'Este Campo es Oblogatorio'
     if (this.customTagName == ''){
          this.objState.customTagName = 'invalid'
          isOK = false;
      }else{
          this.objState.customTagName = 'valid'
      }
        // }
      return isOK 
    }
},

mounted () {
    ObtenerInfoLicense().then( data => {
      this.license = data.data.Licencia
      this.serverCode = data.data.NumeroValidacion
      this.infoLicence(data)
    }).catch(function (error) {
        console.log("ERR", error.status)
    });

    // this.fetchEventsList();
    // this.timer = setInterval(this.fetchEventsList, 1000)
  }
}
//SYNCBOX13-75C4-486C-BC97-E71CA3573DA2
</script>

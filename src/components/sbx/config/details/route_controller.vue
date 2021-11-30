<template>
    <div>
        <notifications group="notifications-default" />

        <div v-if="!showEditProduct">
            <h4> <span> <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click="showEditProduct=true" >
                <i class="ion ion-md-create"></i></b-btn></span>  {{this.objInfo.code}} <span class="font-weight-light "> {{this.objInfo.description}} </span> <span class="font-weight-light " v-if="objInfo.template" >(Plantilla)</span> </h4>
            <!-- <h5><span class="ion ion-md-checkmark text-success" v-if="objInfo.template"></span>
                <span class="ion ion-md-close text-danger" v-if="!objInfo.template"></span>
                <span class="switcher-label">Plantilla</span></h5> -->
        </div>

        <div v-if="showEditProduct">
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group label="" :feedback="objState.message" >
                    <b-input placeholder="Código" :disabled="disabledcode" aria-describedby="inputCode" v-model.trim="objInfo.code" :state="objState.code != ''" v-on:input="objState.code = 'valid'; objState.code= objInfo.code==''?'invalid':'valid'"/>
                </b-form-group>
                <b-form-group label="" :feedback="objState.message" >
                    <b-input placeholder="Descripción" required v-model.trim="objInfo.description" :state="objState.description != ''" v-on:input="objState.description = 'valid'; objState.description= objInfo.description==''?'invalid':'valid'"/>
                </b-form-group>
                <b-form-group label="" :feedback="objState.message" v-if="is_product">
                    <b-input placeholder="Version" v-model.trim="objInfo.version" type="Number"/>
                </b-form-group>
                <!-- <div>
                    <div class="row">
                        <div class="col text-center">
                            <b-form-group class="text-left">
                                <label class="switcher switcher-success mt-2">
                                    <input type="checkbox" class="switcher-input" v-model="objInfo.template">
                                    <span class="switcher-indicator">
                                    <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                    <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                    </span>
                                    <span class="switcher-label">Plantilla</span>
                                </label>
                            </b-form-group>
                        </div>
                    </div>
                </div> -->
                <div class="h4 text-center"></div>

            </fieldset>
            <div class="text-right">
                <b-btn variant="primary" @click="showEditProduct=false" v-if="this.objInfo.route_id!=0">Cancelar</b-btn>
                <b-btn variant="success" @click="submit()">Guardar</b-btn>
            </div>
        </div>
        
        <hr>

        <div>
            <h5>Operaciones y Centros de Trabajo</h5>
            
            <div v-for="item of tableRouteOperation" :key="item.route_operation_id"> 
                <b-card no-body class="mb-3">
                    <b-card-header> 
                        <div class="row">
                            <div class="col-1 text-center">
                                <b-badge variant="outline-primary"> {{item.sequence}} </b-badge>
                            </div>
                            <div class="col-11">
                                    <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle="'acc'+item.route_operation_id">
                                        {{item.description}}
                                        <div class="collapse-icon"></div>
                                    </a>
                            </div>
                        </div>
                        <!-- </div> -->
                    </b-card-header>
                    <b-collapse :id="'acc'+item.route_operation_id" :accordion="'acc'+item.route_operation_id">
                        <b-card-body>
                            <!-- INFORMACION GENERADA DESDE LA BASE DE DATOS -->
                                
                            <div class="row">
                                <!-- INFORMACION OPERACION RUTA DE PROCESO -->
                                <b-tabs class="w-100 nav-tabs-left mb-2">
                                    <b-tab title="Configuración del Proceso" active>
                                        <div class="card-body">
                                             <!-- <b-card bg-variant="transparent" border-variant="info"  class="mb-4 box-shadow-none"> -->
                                                <table class="table table-sm">
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Secuencia:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.sequence}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-input v-model="objToEditRouteOperation.sequence" type="number" placeholder="Secuencia Preferencia de Uso" />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Número de Operarios:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.number_operators}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-input v-model="objToEditRouteOperation.number_operators" type="number" placeholder="Número de Operarios" />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Descripción de la Operación:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.description}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-input v-model="objToEditRouteOperation.description" placeholder="Descripción de la Operación" v-on:input="objState.description = 'valid'; objState.description= objInfo.description==''?'invalid':'valid'"/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Tipo de Operación:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.type_route_operation_description}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-select v-model="objToEditRouteOperation.type_route_operation_id" :options="typeRouteOp" />
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Definición de Proceso:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.process_definition_description}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-select v-model="objToEditRouteOperation.process_definition_id" :options="infoProcess" />
                                                            </td>
                                                        </tr>
                                                        
                                                        <!-- <tr>
                                                            <td><strong>Grupo Centros de Trabajo (Default):</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.workstation_group_description}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-select v-model="objToEditRouteOperation.group_workstation_default_id" :options="optionsGroup(objToEditRouteOperation.process_definition_id)" />
                                                            </td>
                                                        </tr> -->

                                                        <tr>
                                                            <td><strong>Reporte de Cuarentena:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{getArrayInfo(item.quarantine_method, arrCuarentenaMetodo)}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-select v-model="objToEditRouteOperation.quarantine_method" :options="arrCuarentenaMetodo" />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Reporte de Defectuosas:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{getArrayInfo(item.scrap_method, arrReporteDefectuosasMetodo)}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-select v-model="objToEditRouteOperation.scrap_method" :options="arrReporteDefectuosasMetodo" />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Reporte de Producción:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{getArrayInfo(item.reporting_method, arrReporteProduccionMetodo)}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-select v-model="objToEditRouteOperation.reporting_method" :options="arrReporteProduccionMetodo" />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Reporte de Inventarios:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{getArrayInfo(item.inventory_method, arrReporteInventario)}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-select v-model="objToEditRouteOperation.inventory_method" :options="arrReporteInventario" />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>% Desperdicio del Proceso:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.percentaje_process_scrap}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-input v-model="objToEditRouteOperation.percentaje_process_scrap" />
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Producción por Hora Estimado Proceso:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.production_per_hour}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-input v-model="objToEditRouteOperation.production_per_hour" />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Producción por Hora Hombre:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.h_production_per_hour}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                
                                                                <b-input v-model="objToEditRouteOperation.h_production_per_hour" />

                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Unidades por KWs:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.kws_per_hour}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-input v-model="objToEditRouteOperation.kws_per_hour" />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Consumo Kcal por Hora:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.m3_per_hour}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-input v-model="objToEditRouteOperation.m3_per_hour" />
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Tiempo Estimado de Preparación (min):</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.minute_preparation}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-input v-model="objToEditRouteOperation.minute_preparation" />
                                                            </td>
                                                        </tr>
                                                         <!-- <tr>
                                                            <td><strong>Controlar la Liberación:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation"><span class="ion ion-md-checkmark text-success" v-if="item.control_release"></span>
                                                                <span class="ion ion-md-close text-danger" v-if="!item.control_release"></span></td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-check v-model="objToEditRouteOperation.control_release">Controlar la liberación</b-check>
                                                            </td>
                                                        </tr> -->
                                                         <!-- <tr>
                                                            <td><strong>Configurar Proceso Paralelizable:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation"><span class="ion ion-md-checkmark text-success" v-if="item.global_process"></span>
                                                                <span class="ion ion-md-close text-danger" v-if="!item.global_process"></span></td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-check v-model="objToEditRouteOperation.global_process">Configurar Proceso Paralelizable</b-check>
                                                            </td>
                                                        </tr> -->
                                                        <tr>
                                                            <td><strong>Operación Restricción:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation"><span class="ion ion-md-checkmark text-success" v-if="item.restriction_operation"></span>
                                                                <span class="ion ion-md-close text-danger" v-if="!item.restriction_operation"></span></td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-check v-model="objToEditRouteOperation.restriction_operation">Operación Restricción</b-check>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Última Operación:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation"><span class="ion ion-md-checkmark text-success" v-if="item.last_operation"></span>
                                                                <span class="ion ion-md-close text-danger" v-if="!item.last_operation"></span></td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-check v-model="objToEditRouteOperation.last_operation">Última Operación</b-check>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Bodega de Ingreso de Producción:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation">{{item.last_operation ? item.warehouse_name : '---------'}}</td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                 <b-select v-model="objToEditRouteOperation.warehouse_id" :options="infoWarehouse" />
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Habilitar Todos los Centros de Trabajo:</strong></td>
                                                            <td v-if="item.route_operation_id != selectedEditRouteOperation"><span class="ion ion-md-checkmark text-success" v-if="!item.restrict_workstation"></span>
                                                                <span class="ion ion-md-close text-danger" v-if="item.restrict_workstation"></span></td>
                                                            <td v-if="item.route_operation_id == selectedEditRouteOperation">
                                                                <b-check v-model="objToEditRouteOperation.restrict_workstation">{{objToEditRouteOperation.restrict_workstation ? 'Centros de Trabajo con Restricción' : 'Todos los Centros de Trabajo Habilitados'}}</b-check>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div class="w100 text-right mt-0">
                                                    <b-btn variant="primary" class="btn-sm" @click="cancelEditRouteProcess()" v-if="item.route_operation_id == selectedEditRouteOperation">Cancelar</b-btn>
                                                    <b-btn variant="success" class="btn-sm" @click="submitParticularOperation()" v-if="item.route_operation_id == selectedEditRouteOperation">Guardar</b-btn>

                                                    <b-btn variant="outline-success icon-btn mt-0" class="btn-sm" @click="editRouteProcess(item)" v-if="item.route_operation_id != selectedEditRouteOperation">
                                                    <i class="ion ion-md-create"></i></b-btn>
                                                </div>
                                            <!-- </b-card> -->
                                        </div>
                                    </b-tab>
                                    <b-tab title="Centros de Trabajo">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-between">
                                            <div>
                                                <b-check @change="checkRestrictWorkstation(item, item.restrict_workstation)" v-model="item.restrict_workstation">{{item.restrict_workstation ? 'Centros de Trabajo con Restricción' : 'Todos los Centros de Trabajo Habilitados'}}</b-check>
                                            </div>

                                            <div class="text-right mb-2" v-show="!showEditOperationProcess">
                                                <b-btn variant="outline-success" class="btn-sm" @click.prevent="itemSelectedToEdit=item; addNewOperationProcess(true)">
                                                    <span class="ion ion-md-add"></span>&nbsp;&nbsp;Nuevo Centro de Trabajo
                                                </b-btn>
                                            </div>
                                            </div>
                                            <!-- {{item.array_to_json}} -->
                                            <b-table small :fields="ws_fields" :items="item.array_to_json == null ? [] : item.array_to_json ">
                                                <template v-slot:cell(edit)="row">
                                                    <b-btn v-if="!row.item.configured" variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="itemSelectedToEdit=row.item;showEditOperationProcess=true;objInfoOperationProcess=row.item;objInfoOperationProcess.selectedWorkstation=row.item.wsselected" ><i class="ion ion-md-add"></i></b-btn>
                                                    <b-btn v-if="row.item.configured" variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="itemSelectedToEdit=row.item;showEditOperationProcess=true;objInfoOperationProcess=row.item;objInfoOperationProcess.selectedWorkstation=row.item.wsselected" ><i class="ion ion-md-create"></i></b-btn>
                                                    <b-btn v-if="row.item.configured" variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="submitPrepareToDelete('ws',row.item)"><i class="ion ion-md-close"></i></b-btn>
                                                </template> 
                                            </b-table>
                                        </div>
                                    </b-tab>
                                </b-tabs>

                                <b-modal size="lg" title="Opciones para Operaciones por Proceso" v-model="showEditOperationProcess">
                                    <b-form>
                                        <b-form-row>
                                            <b-form-group label="Seleccione un Centro de Trabajo"  class="col-md-12">
                                                <multiselect
                                                    v-model="objInfoOperationProcess.selectedWorkstation"
                                                    placeholder=""
                                                    :options="tableWorkstation"
                                                    label="description"
                                                    track-by="workstation_id" />
                                            </b-form-group>
                                        </b-form-row>
                                        <b-form-row>
                                            <b-form-group label="Prioridad"  class="col-md-6">
                                                <b-input v-model="objInfoOperationProcess.priority" type="number" placeholder="Prioridad" />
                                            </b-form-group>
                                            <b-form-group label="Preparación (minutos)"  class="col-md-6">
                                                <b-input  v-model="objInfoOperationProcess.minute_preparation" type="number" placeholder="Tiempo de Preparación" />
                                            </b-form-group>
                                        </b-form-row>
                                        <b-form-row>
                                            <b-form-group label="Producción por Hora"  class="col-md-6">
                                                <b-input v-model="objInfoOperationProcess.production_per_hour" type="number" placeholder="Producción por Hora" />
                                            </b-form-group>
                                            <b-form-group label="Producción por Hora Hombre"  class="col-md-6">
                                                <b-input  v-model="objInfoOperationProcess.h_production_per_hour" type="number" placeholder="Producción por Hora Hombre" />
                                            </b-form-group>
                                        </b-form-row>
                                        <!-- <b-form-row>
                                            <b-form-group label="Consumo de KW por hora"  class="col-md-6">
                                                <b-input v-model="objInfoOperationProcess.kws_per_hour" type="number" placeholder="Consumo de KW por hora" />
                                            </b-form-group>
                                            <b-form-group label="Consumo de m3 por Hora"  class="col-md-6">
                                                <b-input v-model="objInfoOperationProcess.m3_per_hour" type="number" placeholder="Consumo de m3 por Hora" />
                                            </b-form-group>
                                        </b-form-row> -->
                                    </b-form>
                                    <div slot="modal-footer" class="w-100 text-right">
                                        <b-btn variant="primary"  class="btn-sm" @click="addNewOperationProcess(false)">Cancelar</b-btn>
                                        <b-btn variant="success" v-if="check_access('products_route', 'c')" class="btn-sm" @click="submitOperacionProcess(item)">Guardar</b-btn>
                                    </div>
                                </b-modal>

                                <!-- INFORMACION OPERACION RUTA DE PROCESO -->
                            </div>
                            
                            <!-- INFORMACION GENERADA DESDE LA BASE DE DATOS -->

                            <div class="w-100 text-right mt-2">
                                <b-btn variant="danger" @click="submitPrepareToDelete('op',item)">Eliminar Operación</b-btn>
                            </div>
                            
                        </b-card-body>
                        
                    </b-collapse>
                
                </b-card>
            </div>
        </div>

        <b-card header="Operación Ruta" header-tag="h6" class="mb-4" v-if="showEditOperation">

            <b-form>

                <b-form-row>
                    <b-form-group label="Secuencia de la Operación" class="col-md-4">
                        <b-input v-model="objInfoOperation.sequence" type="number" placeholder="Secuencia Preferencia de Uso" v-on:input="objState.sequence = 'valid'; objState.sequence= objInfoOperation.sequence==undefined?'invalid':'valid'"/>
                    </b-form-group>
                    <b-form-group label="Número de Operarios" class="col-md-4">
                        <b-input v-model="objInfoOperation.number_operators" type="number" placeholder="Número de Operarios" v-on:input="objState.number_operators = 'valid'; objState.number_operators= objInfoOperation.number_operators==undefined?'invalid':'valid'"/>
                    </b-form-group>
                    <b-form-group label="Descripción de la Operación" class="col-md-4">
                        <b-input v-model="objInfoOperation.description" placeholder="Descripción de la Operación" v-on:input="objState.description = 'valid'; objState.description= objInfoOperation.description==''?'invalid':'valid'"/>
                    </b-form-group>
                </b-form-row>

                <b-form-row>
                    <b-form-group class="col-md-4" label="Tipo de Operación">
                        <b-select v-model="objInfoOperation.type_route_operation_id" :options="typeRouteOp" />
                    </b-form-group>
                    <b-form-group class="col-md-4" label="Definición de Proceso">
                        <b-select v-model="objInfoOperation.process_definition_id" :options="infoProcess" />
                    </b-form-group>
                    <b-form-group class="col-md-4" label="Reporte de Cuarentena">
                        <b-select v-model="objInfoOperation.quarantine_method" :options="arrCuarentenaMetodo" />
                    </b-form-group>
                    <!-- <b-form-group class="col-md-4" label="Grupo Centros de Trabajo (Default):">
                        <b-select v-model="objInfoOperation.group_workstation_default_id" :options="optionsGroup(objInfoOperation.process_definition_id)" />
                    </b-form-group> -->
                </b-form-row>

                <b-form-row>
                    <b-form-group class="col-md-4" label="Reporte de Defectuosas">
                        <b-select v-model="objInfoOperation.scrap_method" :options="arrReporteDefectuosasMetodo" />
                    </b-form-group>
                    <b-form-group class="col-md-4" label="Reporte de Producción">
                        <b-select v-model="objInfoOperation.reporting_method" :options="arrReporteProduccionMetodo" />
                    </b-form-group>
                    <b-form-group class="col-md-4" label="Reporte de Inventarios">
                        <b-select v-model="objInfoOperation.inventory_method" :options="arrReporteInventario" />
                    </b-form-group>
                </b-form-row>
                
                <b-form-row>
                    <b-form-group class="col-md-4" label="Tiempo Estimado de Preparación">
                        <b-input type="number" v-model="objInfoOperation.minute_preparation" />
                    </b-form-group>
                    <b-form-group class="col-md-4" label="% Desperdicion por Proceso">
                        <b-input type="number" v-model="objInfoOperation.percentaje_process_scrap" />
                    </b-form-group>
                    <b-form-group class="col-md-4" label="Producción por Hora">
                        <b-input type="number" v-model="objInfoOperation.production_per_hour" />
                    </b-form-group> 
                </b-form-row>

                <b-form-row>
                    <b-form-group class="col-md-4" label="Produccion por Hora Hombre">
                        <b-input type="number" v-model="objInfoOperation.h_production_per_hour" />
                    </b-form-group>
                    <b-form-group class="col-md-4" label="Consumo de KWs por Hora">
                        <b-input type="number" v-model="objInfoOperation.kws_per_hour" />
                    </b-form-group>
                    <b-form-group class="col-md-4" label="Consumo m3 por Hora">
                        <b-input type="number" v-model="objInfoOperation.m3_per_hour" />
                    </b-form-group> 
                </b-form-row>

                <b-form-row>
                    <b-form-group class="col-md-6" label="Seleccione">
                        <div>
                            
                            <b-check v-model="objInfoOperation.restriction_operation">Operación Restricción</b-check>
                            <b-check v-model="objInfoOperation.restrict_workstation" :state="!objInfoOperation.restrict_workstation">{{objInfoOperation.restrict_workstation ? 'Centros de Trabajo con Restricción' : 'Todos los Centros de Trabajo Habilitados'}}</b-check>
                            <b-check v-model="objInfoOperation.last_operation">Última Operación</b-check>
                            <!-- <b-check v-model="objInfoOperation.global_process">Configurar Proceso Paralelizable</b-check> -->
                            <!-- <b-check v-model="objInfoOperation.control_release">Controlar la liberación</b-check> -->
                        </div>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Seleccione Una Bodega" v-if="objInfoOperation.last_operation">
                        <b-select v-model="objInfoOperation.warehouse_id" :options="infoWarehouse" />
                    </b-form-group> 
                
                </b-form-row>

                <!-- <div class="d-flex flex-sm-row flex-column mt-2">
                    <div class="mr-auto">
                        <b-check v-model="objInfoOperation.restrict_workstation" :state="!objInfoOperation.restrict_workstation">{{objInfoOperation.restrict_workstation ? 'Centros de Trabajo con Restricción' : 'Todos los Centros de Trabajo Habilitados'}}</b-check>
                    </div>

                </div> -->

                <div class="text-right">
                    <b-btn variant="primary" @click="addNewRoute(false)" v-if="this.objInfo.route_id!=0">Cancelar</b-btn>
                    <b-btn variant="success" v-if="check_access('products_route', 'w')" @click="submitOperacion()">Guardar</b-btn>
                </div>

                
            </b-form>
        </b-card>

        <div class="text-right mb-2" v-if="objInfo.route_id != 0">
            <!-- <div class="col-6"> -->
                <b-btn variant="outline-success icon-btn" v-if="check_access('products_route', 'c')" class="btn-md" @click.prevent="addNewRoute(true)"><i class="ion ion-md-add"></i></b-btn>
            <!-- </div>
            <div class="col-6"> -->
                <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
            <!-- </div> -->
        </div>

            <!-- <b-nav class="justify-content-end mt-2">
                <b-nav tabs class="nav-sm tabs-alt">
                    <b-nav-item active>Rutas de Proceso</b-nav-item>
                    <b-nav-item>Listas de Materiales </b-nav-item>
                    <b-nav-item>Proveedores</b-nav-item>
                    <b-nav-item>Clientes</b-nav-item>
                </b-nav>
            </b-nav> -->

        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
                <div class="w-100 text-danger"> <strong> {{tituloDelete}} </strong> </div> 
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                    El registro será borrado de forma lógica, pero su información será visible en reportes. 
                </div>
                
                <template slot="button"><b-btn @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
            <sweet-modal ref="longModal">
                <div class="text-left">
                    <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
                </div>
            </sweet-modal>
        </div>
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>


<script>

import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import { infoconfig } from '@/components/i40/js/config'
import { infomaster } from "@/components/i40/js/master";
import { infoinventory } from "@/components/i40/js/inventory";
import Notifications from 'vue-notification'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import VueMarkdown from 'vue-markdown'
import {infousers} from '@/components/i40/js/users'

import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'

Vue.use(Notifications)

export default {
    components: {
        Multiselect,
        PerfectScrollbar,
        SweetModal,
        SweetModalTab,
        VueMarkdown
    },
    props: {
        route_product_id: {
            type: Number
        },
        id_route: {
            type: Number
        },
        id_route_from_product: {
            type: Number
        },
        is_product: {
            type: Boolean
        },
        id_product: {
            type: Number
        },
    },
    computed:{
        groupedWorkstations(workstations) {
            var i,j,temparray,chunk = 4;
            var result=[];

            for (i=0,j=workstations.length; i<j; i+=chunk) {
                temparray = workstations.slice(i,i+chunk);
                result.push(temparray)
                
                // do whatever
            }
    
            return result
            // returns a nested array: 
            // [[article, article, article], [article, article, article], ...]
        },
    },
    data() {
        return {
            name:'details_routes',
            version:'v1.0.0.0',

            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },
            
            title:"Administración y Edición de Rutas",
            disabledcode : false,
            description:"",

            objInfo:{
                route_id: 0, 
                code: '', 
                description: '', 
                template: true,
                version: 0,
            },

            objInfoOperation:{
                route_operation_id:0,
                description:'',
                sequence:0,
                restriction_operation: false,
                global_process:false,
                last_operation: false,
                reporting_method: 1,
                quarantine_method: 1,
                scrap_method:1,
                active: true,
                type_route_operation_id: 0,
                route_id:0,
                process_definition_id:0,
                number_operators:0,
                inventory_method:1,
                infoWarehouse: 0,
            },

            objInfoOperationProcess:{
                route_operation_process_id:0,
                priority:0,
                minute_preparation:0,
                production_per_hour: 0,
                route_operation_id: 0,
                workstation_id: 0,
                active: true,
            },

            objToEditRouteOperation:{},
            objToEditOperationProcess:{
                wsselected:{}
            },
            selectedEditRouteOperation:0,

            default_type_route_operation_id:0,
            default_process_definition_id:0,


            tableRouteOperation:[],
            typeRouteOp:[],

            tableWorkstation:[],
            selectedWorkstation:0,
            
            arrReporteDefectuosasMetodo:[{ value: 1, text: 'No Habilitar Reporte' },{ value: 2, text: 'Reportar Automaticamente' },{ value: 3, text: 'Reporte Manual' },{ value: 4, text: 'Reporte Por Diferencia' },{ value: 5, text: 'Reporte Manual + Automático' }],
            arrCuarentenaMetodo:[{ value: 1, text: 'No Habilitar Reporte' },{ value: 2, text: 'Reportar Automaticamente' },{ value: 3, text: 'Reporte Manual' }],
            arrReporteProduccionMetodo:[{ value: 0, text: 'No Habilitar Reporte' }, { value: 1, text: 'Reporte Automático' }, { value: 2, text: 'Reporte Manual/Validado' }, { value: 3, text: 'Manuales/Validados + Atomáticos' }],
            arrReporteInventario:[{ value: 1, text: 'No Reportar' }, { value: 1, text: 'Reporte Automático' }, { value: 2, text: 'Reporte Manual/Validado' }, { value: 3, text: 'Manuales/Validados + Atomáticos' }],
            infoFamilies:[],
            infoUnityMeasurement:[],

            showEditProduct : false,
            showEditOperation: false,
            showEditOperationProcess:false,

            infoProcess:[],
            infoWorkstationGroupProcess:[],
            infoProcessComplete:[],
            infoWarehouse:[],

            tituloDelete:'',
            codeDelete:'',
            valueToDelete:{},

            objState:{},

            ws_fields:[{key:'priority', label:'Prioridad'},
            {key:'code', label:'Codigo'},
                {key:'production_per_hour', label:'Producción por Hora'},
                {key:'minute_preparation', label:'Tiempo de Preparación'},
                {key:'h_production_per_hour', label:'Producción por Hora Hombre'},
                // {key:'kws_per_hour', label:'Consumo KWs por Hora'},
                // {key:'m3_per_hour', label:'Consumo m3 por Hora'},
                {key:'edit', label:'Editar'}],

            restrict_workstation:false,
            itemSelectedToEdit:{},
        }
    },
    methods: {
        check_access(control, action){
            return infousers.check_access(control,action)
        }, 

        showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
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
        
        submit(){
            if (this.validate_content_product()){

                let action = this.objInfo.route_id == "0" ? "insert" : "update"

                if(this.is_product){
                    action = 'update-product'
                    this.objInfo.product_id = this.id_product
                }
                    
                infoconfig.routes(this.objInfo, '0', action).then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Guardar registro","¡Error Guardando el Registro!")
                    }else{
                        if(this.objInfo.route_id === 0){
                            this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                            this.objInfo = data.data[0]
                        }
                        else
                            this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Modificado con Éxito!")
                        // this.tableData = data.data
                        this.showEditProduct=false
                        this.objInfoOperation.route_id = this.objInfo.route_id
                    }

                    this.$emit('refresh',data.data)
                    
                })
            }else{
                this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
            }
        },

        submitOperacion(){
            if(this.validate_content_operation()){
                this.tableRouteOperation = []
                this.objInfoOperation.route_id = this.objInfo.route_id
                this.objInfoOperation.route_product_id = this.route_product_id
                infoconfig.routeOperations(this.objInfoOperation, '0',"insert").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Guardar registro","¡Error Guardando el Registro!")
                    }else{
                        if(this.objInfoOperation.route_operation_id === 0){
                            this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                            this.objInfoOperation = data.data[0]
                            let new_route = {route_product_id: this.route_product_id}
                            infoconfig.routeOperations(new_route,0,"select").then(data => {
                                if(data.data[0] != undefined){
                                    this.tableRouteOperation = data.data
                                }
                            })
                            this.addNewRoute(false)
                        }
                        else
                            this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Modificado con Éxito!")
                    }
                })
            }else{
                this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
            }
        },

        submitOperacionProcess(item){
            this.objInfoOperationProcess.route_operation_id = this.itemSelectedToEdit.route_operation_id
            this.objInfoOperationProcess.workstation_id = this.objInfoOperationProcess.selectedWorkstation.workstation_id
            this.objInfoOperationProcess.selectedWorkstation = {}
            this.objInfoOperationProcess.route_id = this.itemSelectedToEdit.route_id
            this.objInfoOperationProcess.route_product_id = this.route_product_id
            
            infoconfig.routeOperationsProcess(this.objInfoOperationProcess, this.objInfoOperation.process_definition_id, this.objInfoOperationProcess.route_operation_process_id, this.objInfoOperationProcess.route_operation_process_id == 0 ? "insert" : "update").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Guardar registro","¡Error Guardando el Registro!")
                }else{
                    if(this.objInfoOperationProcess.route_operation_process_id === 0){
                        this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                        // this.objInfoOperation = data.data[0]
                    }
                    else
                        this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Modificado con Éxito!")
                    
                    if (this.route_product_id != undefined){
                            this.tableRouteOperation = []
                            let new_route = {route_product_id: this.route_product_id}
                            infoconfig.routeOperations(new_route,0,"select").then(data => {
                                if(data.data[0] != undefined){
                                    this.tableRouteOperation = data.data
                                }
                            })
                        }
                        
                    this.addNewOperationProcess(false)
                }
            })

            if (this.route_product_id == undefined){
                this.start_form(this.id_route)
            }
        },

        getArrayInfo(key,array){
            for (let index = 0; index < array.length; index++) {
                if(array[index].value===key){
                    return array[index].text
                }
            }
        },

        addNewRoute(state){
            this.showEditOperation = state
            this.objInfoOperation = {
                route_operation_id:0,
                description:'',
                sequence:0,
                restriction_operation: false,
                global_process: false,
                last_operation: false,
                reporting_method: 1,
                quarantine_method: 1,
                active: true,
                type_route_operation_id: this.default_type_route_operation_id,
                route_id:0,
                process_definition_id: this.default_process_definition_id,
                number_operators:0,
                inventory_method:1
            }
        },

        addNewOperationProcess(state){
            this.showEditOperationProcess = state

            this.objInfoOperationProcess={
                route_operation_process_id:0,
                priority:0,
                minute_preparation:0,
                production_per_hour: 0,
                route_operation_id: 0,
                workstation_id: 0,
                active: true,
            }
        },

        submitParticularOperation(){
            let tosave = JSON.parse(JSON.stringify(this.objToEditRouteOperation))
            tosave.array_to_json = []
            this.objToEditRouteOperation.route_product_id = this.route_product_id
            infoconfig.routeOperations(this.objToEditRouteOperation, '0', "update").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Guardar registro","¡Error Guardando el Registro!")
                }else{
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Modificado con Éxito!")
                    
                    this.tableRouteOperation = []
                    let new_route = {route_product_id: this.route_product_id}
                    infoconfig.routeOperations(new_route,0,"select").then(data => {
                        if(data.data[0] != undefined){
                            this.tableRouteOperation = data.data
                        }
                    })
                        
                    this.selectedEditRouteOperation = 0
                }
            })
        },

        submitParticularOperacionProcess(){
            this.objToEditOperationProcess.route_product_id = this.route_product_id
            this.objToEditOperationProcess.workstation_id = this.objToEditOperationProcess.wsselected.workstation_id

            infoconfig.routeOperationsProcess(this.objToEditOperationProcess, this.objToEditOperationProcess.process_definition_id, '0',"update").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Guardar registro","¡Error Guardando el Registro!")
                }else{
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Modificado con Éxito!")
                    let new_route = {route_product_id: this.route_product_id}
                    infoconfig.routeOperations(new_route,0,"select").then(data => {
                        if(data.data[0] != undefined){
                            this.tableRouteOperation = data.data
                        }
                    })
                }
            })
        },

        checkRestrictWorkstation(item, value){
            this.objToEditRouteOperation = item
            this.objToEditRouteOperation.restrict_workstation = !value
            this.submitParticularOperation()
        },

        editRouteProcess(item){
            this.selectedEditRouteOperation = item.route_operation_id
            this.objToEditRouteOperation = item
        },

        cancelEditRouteProcess(){
            this.selectedEditRouteOperation = 0
        },

        submitPrepareToDelete(code, value){
            this.codeDelete = code
            this.valueToDelete = value
            this.tituloDelete = (code == 'op' ? 'Eliminar Operación: ' : 'Eliminar Centro de Trabajo: ') + value.description
            this.$refs.errorWithButtonAlert.open()
        },

        deleteRecord(){
            this.valueToDelete.route_product_id = this.route_product_id
            if(this.codeDelete == 'op'){
                infoconfig.routeOperations(this.valueToDelete, '0', "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Guardar registro","¡Error Eliminando el Registro!")
                    }else{
                        this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Eliminado con Éxito!")
                        if (this.route_product_id != undefined){
                            this.tableRouteOperation = []
                            let new_route = {route_product_id: this.route_product_id}
                            infoconfig.routeOperations(new_route,0,"select").then(data => {
                                if(data.data[0] != undefined){
                                    this.tableRouteOperation = data.data
                                }
                            })
                        }
                        this.selectedEditRouteOperation = 0
                    }
                })
            }else{
                infoconfig.routeOperationsProcess(this.valueToDelete, this.valueToDelete.process_definition_id, '0',"delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Guardar registro","¡Error Eliminando el Registro!")
                    }else{
                        this.showCustom('bg-warning text-white', "Modificar registro","¡El Registro se ha Eliminado con Éxito!")
                       
                       if (this.route_product_id != undefined){
                            this.tableRouteOperation = []
                            let new_route = {route_product_id: this.route_product_id}
                            infoconfig.routeOperations(new_route,0,"select").then(data => {
                                if(data.data[0] != undefined){
                                    this.tableRouteOperation = data.data
                                }
                            })
                        }
                    }
                })
            }


            /// EN CASO DE QUE SE ESTE MODIFICANDO UN TEMPLATE
            if (this.route_product_id == undefined){
                this.start_form(this.id_route)
            }

            this.$refs.errorWithButtonAlert.close()
        },

        closeDeleteRecord(){
            this.codeDelete = ''
            this.valueToDelete = {}
            this.$refs.errorWithButtonAlert.close()
        },

         ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

            validate_content_product(){
                
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este Campo es Obligatorio'
                
                
                if (this.objInfo.code == ''){
                    this.objState.code = 'invalid'
                    isOK = false;
                }else{
                    this.objState.code = 'valid'
                }
                if (this.objInfo.description == ''){
                     this.objState.description = 'invalid'
                     isOK = false;
                }else{
                    this.objState.description = 'valid'
                }
                return isOK
            },

            validate_content_operation(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este Campo es Obligatorio'

               if (this.objInfoOperation.number_operators <= 0 || this.objInfoOperation.number_operators == ''){
                    this.objState.number_operators = 'invalid'
                    isOK = false;
                }else{
                    this.objState.number_operators = 'valid'
                }
                if (this.objInfoOperation.number_operators <= 0 || this.objInfoOperation.number_operators == ''){
                    this.objState.sequence = 'invalid'
                    isOK = false;
                }else{
                    this.objState.sequence = 'valid'
                }
                if (this.objInfoOperation.description == ''){
                     this.objState.description = 'invalid'
                     isOK = false;
                }else{
                    this.objState.description = 'valid'
                }
                return isOK
            },

            optionsGroup(value_selected){
                let groups_work = []
                for (let index = 0; index < this.infoProcessComplete.length; index++) {
                    const element = this.infoProcessComplete[index];
                    if(element.process_definition_id === value_selected){
                        for (let index2 = 0; index2 < element.workstation_groups_selected.length; index2++) {
                            const element2 = element.workstation_groups_selected[index2];
                            groups_work.push({value: element2.workstation_group_id, text: element2.description})
                        }
                    }
                }
                return groups_work
            },

            start_form(param_id){
                // console.log(param_id)
                param_id = param_id || -1;
                if(this.id_route != -1){
                    this.objInfoOperation.route_id = param_id
                    infoconfig.routes([],param_id,"select").then(data => {
                        if(data.data != "")
                            if(data.data[0] != undefined){
                                let route_result = {}
                                for (let index = 0; index < data.data.length; index++) {
                                    const element = data.data[index];
                                    if(element.route_id == param_id){
                                        route_result = element
                                    }
                                }

                                this.objInfo =route_result
                                this.showEditProduct=false
                                 if(this.objInfo.template){
                                    //  console.log('1')
                                    let new_route = {route_id: param_id}
                                    infoconfig.routeOperations(new_route,0,"select-template").then(data => {
                                        if(data.data[0] != undefined){
                                            this.tableRouteOperation = data.data
                                        }
                                    })
                                }else if(this.id_route_from_product != undefined){
                                    // console.log('AQUI ESTOY:',this.id_route_from_product )
                                    let new_route = {route_product_id: this.route_product_id}
                                    infoconfig.routeOperations(new_route,0,"select").then(data => {
                                        if(data.data[0] != undefined){
                                            this.tableRouteOperation = data.data
                                        }
                                    })
                                }else{
                                    // console.log('3')
                                    let new_route = {route_id: this.id_route_from_product}
                                    infoconfig.routeOperations(new_route,0,"select").then(data => {
                                        if(data.data[0] != undefined){
                                            this.tableRouteOperation = data.data
                                        }
                                    })
                                }
                            }else{
                                this.showEditProduct=true
                            }
                    })

                    infomaster.workstation([],"select-productive").then(data => {
                        if(data.data != null && data.data != ""){
                            this.tableWorkstation = data.data
                        }
                    })

                }else{
                    this.showEditProduct=true
                }

                infoconfig.process([],"select").then(data => {
                    if(data.data != ''){
                        let array = data.data
                        this.infoProcessComplete = data.data
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            if(index===0){
                                this.objInfoOperation.process_definition_id = element.process_definition_id
                                this.default_process_definition_id = element.process_definition_id
                            }
                        
                        this.infoProcess.push({value: element.process_definition_id, text: element.description})
                        }
                    }
                })

                infoconfig.typeroute().then(data => {
                    if(data.data != ''){
                        this.typeRouteOp = data.data
                        this.objInfoOperation.type_route_operation_id= this.typeRouteOp[0].value
                        this.default_type_route_operation_id= this.typeRouteOp[0].value
                    }
                })

                infoinventory.warehouse([],"get").then(data => {
                    this.infoWarehouse = []
                    if(data.data != ''){
                        let array = data.data
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            this.infoWarehouse.push({value: element.warehouse_id, text: element.name})
                        }
                    }
                })
            }

    },
    created(){
        if(this.id_route_from_product != undefined){
            // console.log(this.id_route_from_product)
            this.start_form(this.id_route)
        }else{

        }
    }
}
</script>

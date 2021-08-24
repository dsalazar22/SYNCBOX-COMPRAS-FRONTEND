<template>
<!-- :fields="columns" -->
    <div>
        <notifications group="notifications-default" />
        <div class="row">
            <div class="col">
                <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
       
            <multiselect
                v-model="selectedWorkstation"
                :options="workstations"
                placeholder="Centros de Trabajo"
                label="code"
                track-by="code" v-if="!isFromRealTime"/>

                <b-btn v-if="!isFromRealTime" size="xs" class="mt-1 btn-outline-info" block @click="wsload=true;content_load()"> Ver Carga del Centro de Trabajo </b-btn>

                        <b-table responsive small :items="orderProduction" :fields="columnsCommercialsOrders" 
                            :current-page="currentPage" :per-page="perPage" style="font-size:12px"
                            :style="{'max-height': (windowHeight+600).toString()+'px'}" 
                            class="h-100 w-100 bg-white mt-2" :no-border-collapse="false" 
                            :sticky-header="true" :hover="true" :striped="true" :bordered="true"
                        >
                            <!-- <template slot="top-row" slot-scope="{ fields }">
                                <td v-for="field in fields" :key="field.key">
                                    <input v-model="filters[field.key]" :placeholder="field.label">
                                </td>
                            </template> -->
                            <template v-slot:cell(consume_buffer)="row">
                                <div  style="width:80px">
                                    {{row.item.consume_buffer}}
                                </div>
                            </template>

                             <template v-slot:cell(consecutive_order)="row" style="font-weight:bold; text-align: right">
                                <router-link target="_blank" :to="{path:'/drum/searchop/'+row.item.consecutive_order}">
                                    {{row.item.consecutive_order}}
                                </router-link>
                            </template>

                            <template v-slot:head(deadline)="scope">
                                <div class="text-nowrap">Fecha Compromiso</div>
                            </template>
                            <template v-slot:head(requested_date)="scope">
                                <div class="text-nowrap">Fecha Solicitada</div>
                            </template>
                            <template v-slot:head(planning_date)="scope">
                                <div class="text-nowrap">Fecha Planeada</div>
                            </template>
                            <template v-slot:head(projected_date)="scope">
                                <div class="text-nowrap">Fecha Proyectada</div>
                            </template>

                            <template v-slot:cell(products_description)="row">
                                <div class="text-nowrap">{{row.item.products_description}}</div>
                            </template>

                            <template v-slot:cell(produced_amount)="row">
                                <div class="text-nowrap text-right">
                                    {{numberWithCommas(row.item.produced_amount)}}
                                </div>
                            </template>

                            <template v-slot:cell(code)="row">
                                <div class="text-nowrap">{{row.item.code}}</div>
                            </template>

                            <template v-slot:cell(deadline)="row">
                                <div class="text-nowrap">{{row.item.deadline}}</div>
                            </template>
                            <template v-slot:cell(name)="row">
                                <div class="text-nowrap">{{row.item.name}}</div>
                            </template>

                            <template v-slot:cell(activity_description)="row">
                                <div class="text-nowrap">{{row.item.activity_description}}</div>
                            </template>
                            <template v-slot:cell(planning_date)="row">
                                <div class="text-nowrap">{{row.item.planning_date}}</div>
                            </template>
                            <template v-slot:cell(projected_date)="row">
                                <div class="text-nowrap">{{row.item.projected_date}}</div>
                            </template>

                            <template v-slot:cell(workstation_groups)="row">
                                <div class="text-nowrap">{{row.item.workstation_groups}}</div>
                            </template>

                            <template v-slot:cell(workstation_code)="row">
                                <div class="text-nowrap">{{row.item.workstation_code}}</div>
                            </template>

                            <template v-slot:cell(workstation_group)="row">
                                <div class="text-nowrap">{{row.item.workstation_group}}</div>
                            </template>

                            <template v-slot:cell(programed_amount)="row">
                                <div class="text-nowrap text-right">{{numberWithCommas(row.item.programed_amount)}}</div>
                            </template>

                            <template v-slot:cell(hours_remaining)="row">
                                <div class="text-nowrap text-right">
                                    <!-- {{numberWithCommas(row.item.programed_amount)}} -->

                                    <!-- {{numberWithCommas((row.item.programed_amount/row.item.production_per_hour).toFixed(2))}} -->
                                    {{hourprepare(row.item.pending_amount / row.item.production_per_hour)}}
                                </div>
                            </template>
                            <template v-slot:cell(percentaje)="row">
                                <div class="text-nowrap text-right">
                                    <!-- {{numberWithCommas(row.item.programed_amount)}} -->

                                    <!-- {{numberWithCommas((row.item.programed_amount/row.item.production_per_hour).toFixed(2))}} -->
                                    {{((1-(row.item.pending_amount / row.item.programed_amount))*100).toFixed(2)}}%
                                </div>
                            </template>
                            <template v-slot:cell(pending_amount)="row">
                                <div class="text-nowrap text-right">{{numberWithCommas(row.item.pending_amount)}}
                                    <i class="fas fa-circle text-success" v-if="(row.item.pending_amount/row.item.programed_amount)>=0.2"></i>
                                    <i class="fas fa-circle text-danger" v-if="(row.item.pending_amount/row.item.programed_amount)<=0.10"></i> 
                                    <i class="fas fa-circle text-warning" v-if="(row.item.pending_amount/row.item.programed_amount)>0.10 && (row.item.pending_amount/row.item.programed_amount)<=0.20"></i> 
                                </div>
                            </template>

                            <template v-slot:cell(priority)="row">
                                        {{row.item.priority}}
                                    <!-- </div> -->
                                    <b-input-group size="sm"  v-if="editPriority">
                                        <b-form-input type="number" v-model="row.item.priority" min="0.00"></b-form-input>
                                        <b-input-group-append>
                                            <b-btn variant="outline-success borderless icon-btn" class="btn"  @click.prevent="data_change_priority(row.item)"><i class="ion ion-md-checkmark"></i></b-btn>
                                            <b-btn variant="outline-danger borderless icon-btn" class="btn" @click.prevent="cancelEditPrioty(row.item,row.item.priority)"><i class="ion ion-md-close"></i></b-btn>
                                        </b-input-group-append>
                                    </b-input-group>


                                <!-- </div> -->
                            </template>

                            <template v-slot:cell(edit)="row">
                                <!-- <b-dropdown v-if="check_access('planning_order', 'w')" variant="default btn-xs icon-btn md-btn-flat hide-arrow" :right="!isRTL">
                                    <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                    <b-dropdown-item @click.prevent="$refs.cancelarJob.open();selected_production_order=row.item;" ><i class="ion ion-md-remove-circle text-warning"></i> &nbsp;&nbsp;Cambiar Estado</b-dropdown-item>
                                    <b-dropdown-item @click="showEditContentOrder=true;infosend=row.item" ><i class="ion ion-md-hammer"></i> &nbsp;&nbsp;Ajustes Generales</b-dropdown-item>
                                    <b-dropdown-item @click.prevent="showEditOrder=true;infosend=row.item"><i class="ion ion-md-create text-success"></i> &nbsp;&nbsp;Cambiar Cantidad</b-dropdown-item>
                                        v-if="listContent.length>0"
                                </b-dropdown> -->
                                <div class="text-nowrap">
                                    <b-dropdown variant="default btn-xs icon-btn md-btn-flat hide-arrow" :right="!isRTL" v-if="check_access('drump_production', 'w')">
                                        <!-- {{props.item}} -->
                                        <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
                                        <!-- <b-dropdown-item href="javascript:void(0)">Ver Perfil</b-dropdown-item> -->
                                        <!-- <b-dropdown-item v-if="props.item.produced_amount == 0" @click.prevent="$refs.cancelarJob.open();selected_production_order=props.item; type_event_selected_order='cancel'" ><i class="ion ion-md-close text-danger"></i> &nbsp;&nbsp;Cancelar Activadad</b-dropdown-item> -->
                                        <b-dropdown-item @click="editPriority=true" > <i class="fas fa-arrows-alt-v"></i> &nbsp;&nbsp;Cambiar Prioridad</b-dropdown-item>
                                        <b-dropdown-item @click.prevent="showEditOrder=true;infosend=row.item"><i class="ion ion-md-create text-success"></i> &nbsp;&nbsp;Cambiar Cantidad</b-dropdown-item>
                                        <b-dropdown-item @click="cambiarCentroTrabajo(row.item)" > <i class="fas fa-exchange-alt"></i> &nbsp;&nbsp;Cambiar Centro de Trabajo</b-dropdown-item>
                                        <b-dropdown-item @click.prevent="$refs.cancelarJob.open();selected_production_order=row.item;" ><i class="ion ion-md-remove-circle text-warning"></i> &nbsp;&nbsp;Cambiar Estado</b-dropdown-item>
                                        <b-dropdown-divider></b-dropdown-divider>
                                        <b-dropdown-item @click="reportsDetails(row.item)" ><i class="fas fa-info text-info"></i> &nbsp;&nbsp;Detalle de la Orden</b-dropdown-item>
                                        <b-dropdown-item @click="addReports(row.item)" ><i class="ion ion-md-hand"></i> &nbsp;&nbsp;Adicionar Reporte de Produccion Manual</b-dropdown-item>
                                        <!-- <b-dropdown-item href="javascript:void(0)"><i class="ion ion-md-resize"></i> &nbsp;&nbsp;Dividir Actividad</b-dropdown-item> -->

                                        <!-- <b-btn variant="outline-success icon-btn m-r-1" class="btn-xs" @click.prevent="showEditOrder=true;infosend=props.item"><i class="ion ion-md-create"></i></b-btn> -->
                                        <!-- <b-dropdown-item href="javascript:void(0)">Eliminar</b-dropdown-item> -->
                                    </b-dropdown>
                                    <b-btn v-b-modal.modal-tall @click="loadMessage(row.item.order_production_process_id);selectedformessage={message:'',id:row.item.order_production_process_id, title:'', wscode:row.item.workstation_code}" variant="outline-info icon-btn borderless btn-xs"><span class="fas fa-comments"></span>
                                        <span class="badge indicator" v-if="row.item.messages > 0">{{row.item.messages}}</span>
                                    </b-btn>
                                    <b-btn v-if="row.item.released && check_access('drump_production', 'w')" @click="hideOrder(row.item.order_production_process_id)" variant="outline-success icon-btn borderless btn-xs" ><span class="fas fa-eye"></span>
                                    </b-btn>
                                    <b-btn v-if="!row.item.released && check_access('drump_production', 'w')" @click="showOrder(row.item.order_production_process_id)" variant="outline-danger icon-btn borderless btn-xs"><span class="fas fa-eye-slash"></span>
                                    </b-btn>
                                    <!-- <b-btn variant="outline-success icon-btn borderless btn-xs"><span class="fas fa-comments"></span>
                                        <span class="badge badge-primary badge-dot indicator"></span>
                                    </b-btn> -->

                                    <!-- {{row.item}} -->
                                </div>
                            </template>
                    </b-table>
                
                <b-modal id="modal-tall" scrollable title="Mensajes Ordenes de Produccion">
                    <div class="my-1 border border-light rounded" v-for="item in messages">
                        <div class="ml-1 mr-1 mt-1">
                            <h4 v-if="item.title != '' && item.title != null" style="margin:0px" >{{item.title}}</h4>
                            
                            {{item.message}}    
                            <div class="text-right">
                                <small class="text-light">{{item.created}} | {{item.username}}</small>
                            </div>
                        </div>
                    </div>

                    <template #modal-footer>
                        <div class="w-100">
                        <b-form-input size="sm" v-model="selectedformessage.title" placeholder="Titulo (Opcional)"></b-form-input>
                       <b-form-textarea
                            id="textarea"
                            v-model="selectedformessage.message"
                            placeholder="Mensaje..."
                            rows="3"
                            size="sm" 
                            max-rows="6"
                            class="mt-2"
                            ></b-form-textarea>
                            <div class="mt-2 text-right">
                                <b-button
                                    variant="success"
                                    size="sm"
                                    :disabled="selectedformessage.message.trim().length<5"
                                    @click="submitMessage()">
                                    Guardar Mensaje
                                </b-button>
                            </div>
                        </div>
                    </template>

                </b-modal>
                    
                <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    
                    <div  class="w-50">
                        <small class="text-muted"> Total Ordenes de Producción: {{totalRows}} </small>
                        <div class="small">
                            Buffer Ordenes de Producción <div class="float-right"> {{cntBlack}} de {{totalRows}} ({{Math.round((cntBlack/totalRows)*100)}}%)</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-dark':true}" :style="{width: String((cntBlack/totalRows)*100)+'%' }"></div>
                        </div>
                        <div class="small">
                            Buffer Ordenes de Producción <div class="float-right"> {{cntDanger}} de {{totalRows}} ({{Math.round((cntDanger/totalRows)*100)}}%)</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-danger':true}" :style="{width: String((cntDanger/totalRows)*100)+'%' }"></div>
                        </div>
                        <div class="small">
                            Buffer Ordenes de Producción <div class="float-right"> {{cntWarning}} de {{totalRows}} ({{Math.round((cntWarning/totalRows)*100)}}%)</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-warning':true}" :style="{width: String((cntWarning/totalRows)*100)+'%' }"></div>
                        </div>
                        <div class="small">
                            Buffer Ordenes de Producción <div class="float-right"> {{cntSuccess}} de {{totalRows}} ({{Math.round((cntSuccess/totalRows)*100)}}%)</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-success':true}" :style="{width: String((cntSuccess/totalRows)*100)+'%' }"></div>
                        </div>
                                    <div class="small">
                            Buffer Ordenes de Producción <div class="float-right"> {{cntInfo}} de {{totalRows}} ({{Math.round((cntInfo/totalRows)*100)}}%)</div>
                        </div>
                        <div class="progress mb-1" style="height: 4px;">
                            <div :class="{'progress-bar':true, 'bg-info':true}" :style="{width: String((cntInfo/totalRows)*100)+'%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
            <sweet-modal ref="longModal">
                <div class="text-left">
                    <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
                </div>
            </sweet-modal>

            <b-modal id="modals-top" v-model="showEditOrder"  class="modal-center" size="lg">
                <div slot="modal-title">
                    Modificar <span class="font-weight-light">Ordenes de Producción</span><br>
                </div>

                <h3 class="text-danger text-center">ATENCIÓN</h3>
                <div>
                    <h4 class="text-center">
                       {{infosend.code}} {{infosend.products_description}}
                       <span> <div>Cantidad: {{infosend.programed_amount}}</div>  </span>
                    </h4>
                </div>
                <div>
                    <!-- {{infosend}} -->
                </div>
                Al modificar estos valores con cantidades erroneas, puede generar algunas conseceuncias, dentro del 
                proceso, verifique muy bien antes de aprobar la cantidad escrita.

                <div>
                    <!-- {{infosend}} -->
                </div>

                <h5 class="mt-2">Ingrese una nueva Cantidad:</h5>
                <b-input type="number" min="0" step="1" placeholder="Cantidad" v-model.trim="infosend.programed_amount"/>

                <div slot="modal-footer" class="w-100">
                    <div class="d-flex justify-content-between">
                        <div>
                            <b-btn @click="showEditOrder=false">Cerrar</b-btn>
                        </div>
                        <div>
                            <b-btn variant="warning" @click="update_production_order()">Guardar</b-btn>
                        </div>
                    </div>
                </div> 
            </b-modal>


            <b-modal id="modals-top" v-model="showEditContentOrder"  class="modal-center" size="lg">
                <div slot="modal-title">
                    Modificar <span class="font-weight-light">Ordenes de Producción</span><br>
                </div>

                <h3 class="text-danger text-center">ATENCIÓN</h3>
                <div>
                    <h4 class="text-center">
                       <span> <div>Prioridad de Ejecucion: {{infosend.priority}}</div>  </span>
                    </h4>
                </div>
                <div>
                    <!-- {{infosend}} -->
                </div>
              

                <div>
                    <!-- {{infosend}} -->
                </div>

                <h5 class="mt-2">Ingrese una nueva Prioridad:</h5>
                <b-input type="number" min="0" step="1" placeholder="Prioridad" v-model.trim="infosend.priority"/>

                <div slot="modal-footer" class="w-100">
                    <div class="d-flex justify-content-between">
                        <div>
                            <b-btn @click="showEditContentOrder=false">Cerrar</b-btn>
                        </div>
                        <div>
                            <b-btn variant="warning" @click="update_details_order()">Guardar</b-btn>
                        </div>
                    </div>
                </div> 
            </b-modal>

            <b-modal id="modals-top" v-model="showReportOrder"  class="modal-center" size="lx">
                <div slot="modal-title">
                    Reportar <span class="font-weight-light">Ordenes de Producción</span><br>
                </div>

                <h5 class="mt-2">Cantidad a Reportar:</h5>
                <b-input type="number" step="1" placeholder="Prioridad" v-model.trim="amountManualReport"/>

                <div slot="modal-footer" class="w-100">
                    <div class="d-flex justify-content-between">
                        <div>
                            <b-btn @click="showReportOrder=false">Cerrar</b-btn>
                        </div>
                        <div>
                            <b-btn variant="warning" @click="submitReport()">Guardar</b-btn>
                        </div>
                    </div>
                </div> 
            </b-modal>


            <!-- CONFIRMACION BORRADO DE REGISTRO -->
                    <!-- <div class="d-inline-block"> -->
                        <sweet-modal :icon="type_event_selected_order == 'cancel'?'error':'warning'" title="Cambiar Estado" ref="cancelarJob">
                            
                            <!-- <div class="w-100 text-center" v-if="type_event_selected_order == 'finish'">
                                ¿Está seguro que desea cerrar esta operación del producto? <br>
                                Si confirma esta acción la orden de producción, no será visible en ningun momento, pero las cantidades reportadas seran alamacenada y conservadas de manera continua.
                            </div>

                             <div class="w-100 text-center" v-if="type_event_selected_order == 'cancel'">
                                ¿Está seguro que desea cancelar esta operación del producto? <br>
                                Si confirma esta acción la orden de producción, no será visible en ningun momento y no será posible ejecutar esta operación.
                            </div> -->
                            
                            <!-- <template slot="button"><b-btn @click="updateJobs()" :variant="type_event_selected_order == 'cancel'?'danger':'warning'" class="mr-2">{{type_event_selected_order == 'cancel'?'Cancelar':'Finalizar'}}</b-btn></template> -->
                            <multiselect
                                v-model="itemStatus"
                                :options="optionsStatus"
                                label="description"
                                :searchable="true"
                                :show-labels="false"
                                placeholder="Seleccione un Estado"
                            />
                            <template slot="button"><b-btn @click="updateJobs()" :variant="type_event_selected_order == 'cancel'?'danger':'warning'" class="mr-2">Ejecutar Cambio</b-btn></template>
                            <template slot="button"><b-btn @click="closeUpdateJobs()" variant="primary">Cerrar</b-btn></template> 
                        </sweet-modal>
                    <!-- </div> -->
            <!-- CONFIRMACION BORRADO DE REGISTRO -->
        </div>

        <b-modal id="modals-top" v-model="showEditForm"  class="modal-center" size="lg">
        <!-- <div slot="modal-title">
            Modificar <span class="font-weight-light">Ordenes de Producción</span><br>
        </div> -->
            <vue-gantt ref="gantt_detail"></vue-gantt>
            
             <div slot="modal-footer">
            <b-btn @click="showEditForm=false">Cerrar</b-btn>
        </div> 
     </b-modal>

    <sweet-modal width="100%" ref="reportsDetails">
        <div class="text-left">
            <h2>Detalle Reporte de Producción por Actividad</h2>
            <b-table  small tbody-class="h6 font-weight-normal font-table" :items="itemsReportsDetails"  :fields="fieldsReportDetails" >
                <template v-slot:cell(sequence)="row">
                    <b-btn variant="outline-success icon-btn m-r-1" class="btn-xs" @click.prevent="itemsItemsReportsDetails=row.item.reports_details"><i class="ion ion-md-create"></i></b-btn>
                    {{row.item.sequence}}
                </template>
           </b-table>
        </div>
        <div class="text-left" v-if="itemsItemsReportsDetails.length>0">
            <h2>Detalle de los Reportes Ingresados</h2>
            <b-table  small tbody-class="h6 font-weight-normal font-table" :items="itemsItemsReportsDetails"  :fields="fieldsItemsReportDetails" >
           </b-table>
        </div>
    </sweet-modal>





        <b-modal id="modals-top" v-model="showEditOrder"  class="modal-center" size="lg">
                <div slot="modal-title">
                    Modificar <span class="font-weight-light">Ordenes de Producción</span><br>
                </div>

                <h3 class="text-danger text-center">ATENCIÓN</h3>
                <div>
                    <h4 class="text-center">
                       {{infosend.code}} {{infosend.products_description}}
                       <span> <div>Cantidad: {{infosend.programed_amount}}</div>  </span>
                    </h4>
                </div>
                <div>
                    <!-- {{infosend}} -->
                </div>
                Al modificar estos valores con cantidades erroneas, puede generar algunas conseceuncias, dentro del 
                proceso, verifique muy bien antes de aprobar la cantidad escrita.

                <div>
                    <!-- {{infosend}} -->
                </div>

                <h5 class="mt-2">Ingrese una nueva Cantidad:</h5>
                <b-input type="number" min="0" step="1" placeholder="Cantidad" v-model.trim="infosend.programed_amount"/>

                <div slot="modal-footer" class="w-100">
                    <div class="d-flex justify-content-between">
                        <div>
                            <b-btn @click="showEditOrder=false">Cerrar</b-btn>
                        </div>
                        <div>
                            <b-btn variant="warning" @click="update_production_order()">Guardar</b-btn>
                        </div>
                    </div>
                </div> 
            </b-modal>

        <b-modal v-model="wschange" size="xl" title="Centros de Trabajo" hide-footer>
            <b-form-select v-model="wsselected" :options="wsoption"></b-form-select>
                <div class="w-100 text-right mt-1">
                    <b-button
                        variant="primary"
                        size="sm"
                        @click="wschange=false">
                        Cerrar
                    </b-button> 
                    &nbsp;
                    <b-button
                        variant="success"
                        size="sm"
                        @click="setChange()">
                        Aplicar Cambio
                    </b-button>
                </div>
        </b-modal>

        <b-modal v-model="wsload" size="xl" title="Carga del Centro de Trabajo" hide-footer>
            <div id="container"></div>
        </b-modal>

        <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
            ¿Está seguro que desea retirar esta orden?
            <div class="w-100 text-center">
                Al retirar la orden de producción, lo hará con todas las partes y los procesos que dependan de esta misma.
            </div>
            
            <template slot="button"><b-btn @click="deleteRecord()" variant="danger" class="mr-2">Retirar</b-btn></template>
            <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>

        <sweet-modal :icon="type_event_selected_order == 'cancel'?'error':'warning'" title="Cambiar Estado" ref="cancelarJob">
            
            <!-- <div class="w-100 text-center" v-if="type_event_selected_order == 'finish'">
                ¿Está seguro que desea cerrar esta operación del producto? <br>
                Si confirma esta acción la orden de producción, no será visible en ningun momento, pero las cantidades reportadas seran alamacenada y conservadas de manera continua.
            </div>
             <div class="w-100 text-center" v-if="type_event_selected_order == 'cancel'">
                ¿Está seguro que desea cancelar esta operación del producto? <br>
                Si confirma esta acción la orden de producción, no será visible en ningun momento y no será posible ejecutar esta operación.
            </div> -->
            
            <!-- <template slot="button"><b-btn @click="updateJobs()" :variant="type_event_selected_order == 'cancel'?'danger':'warning'" class="mr-2">{{type_event_selected_order == 'cancel'?'Cancelar':'Finalizar'}}</b-btn></template> -->
            <multiselect
                v-model="itemStatus"
                :options="optionsStatus"
                label="description"
                :searchable="true"
                :show-labels="false"
                placeholder="Seleccione un Estado"
            />
            <template slot="button"><b-btn @click="updateJobs()" :variant="type_event_selected_order == 'cancel'?'danger':'warning'" class="mr-2">Ejecutar Cambio</b-btn></template>
            <template slot="button"><b-btn @click="closeUpdateJobs()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>


    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<script>
import { infoplanning } from "@/components/i40/js/iplanning";
import Vue from 'vue'
import gantt from '../planning/gantt'
import { infoproduction } from "@/components/i40/js/production";
import Columns from '@/vendor/sbx/json/columns.json';
import VueMarkdown from 'vue-markdown'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import moment from 'moment'
import Notifications from 'vue-notification'
import {infousers} from '@/components/i40/js/users'
import { infouser } from "@/vendor/sbx/sbx-users/users";
import Multiselect from 'vue-multiselect'
import { infosysconfig } from "@/components/i40/js/sysconfig";
import { infomaster } from "@/components/i40/js/master";
import { infotraza } from "@/components/i40/js/traza";

Vue.use(Notifications)

export default {
    components: {
        VueMarkdown,
        SweetModal,
        'vue-gantt': gantt,
        Multiselect
    },
    props: {
        fromRealTime: {
            type: Boolean
        },
        code_workstation: {
            type: String
        },
    },
    watch:{

        'selectedWorkstation': function(value){
            if(value.code != null && value.code != undefined){
                infoproduction.production(value.code,"select-complete-production-order-tac").then(data =>{
                    this.info_result_orders = data.data
                    this.selected_source()
                })
            }
        },
    },
    data() {
        return {
            isFromRealTime:false,
            wsload:false,
            wschange:false,
            editPriority: false,

            wsselected:null,
            wsoption:[],

            itemOrderSelected:{},
            
            windowHeight: 0,
            selectedWorkstation:{},
            workstations:[],
            amountManualReport:0,
            showReportOrder:false,
            reportInfoParam:{},
            optionsStatus:[],
            itemStatus:{},
            itemsReportsDetails:[],
            fieldsReportDetails:[
                {key:'sequence', label:"Secuencia"},
                {key:'activity_description', label:"Actividad"},
                {key:'programmed_amount', label:"Programado"},
                {key:'produced_amount', label:"Producido"},
                {key:'pending_amount', label:"Pendiente"},
            ],

            itemsItemsReportsDetails:[],
            fieldsItemsReportDetails:[
                {key:'production_report_id', label:"ID"},
                {key:'code_module', label:"Modulo Reporte"},
                {key:'amount', label:"Cantidad"},
                {key:'is_scrap', label:"Desperdicio"},
                {key:'created', label:"Fecha Creacion"},
                {key:'user_report', label:"Usuario"},
            ],

            sortBy: 'id',
            sortDesc: false,
            
            name: 'production',
            version: 'v1.0.0.0',
            contentWiki: "",
            showEditForm:false,
            showEditOrder:false,
            cntBlack:0,
            cntDanger:0,
            cntWarning:0,
            cntSuccess:0,
            cntInfo:0,
            tableCommercialsOrders:[],
            info_result_orders:[],
            infosend:{},
            selectTab:'totals',

            selected_production_order:{},
            type_event_selected_order:'',
            showEditContentOrder:false,

            selectedformessage:{
                message:'',
            },

            filters: {
                name: '',
                code: '',
                products_description: ''
            },

            // columnsCommercialsOrders: [
            //     ///Este objeto es fijo en caso de que se necesite modificar la info
            //     // {key:' id_workplace', label:"id_workplace", thClass: 'd-none', tdClass: 'd-none'},
            //     // {key:' workstation_type_id', label:"workstation_type_id", thClass: 'd-none', tdClass: 'd-none'},
            //     {key:'consume_buffer', label:"Buffer"},
            //     {key:'status_modules_code', label:"Estado"},
            //     {key:'consecutive_order', label:"#Orden"},
            //     {key:'customer_order_id', label:"#Pedido"},
            //     {key:'name', label:"Cliente"},
            //     {key:'code', label:"Código"},
            //     {key:'products_description', label:"Descripción"},
            //     {key:'deadline', label:"Fecha Comprometida"},
            //     {key:'programed_amount', label:"Programada"},
            //     {key:'pending_amount', label:"Pendiente"},
            //     {key:'activity_description', label:"Actividad"},
            //     {key:'sequence', label:"Secuencia"},
            //     {key:'workstation_code', label:"CT"},
            //     {key:'workstation_groups', label:"Grupos"},
                
            //     // {key:'wsplant', label:"Planta"},
            //     // {key:'wsgroup', label:"Grupo"},
            //     // {key:'wstype', label:"Tipo"},
            //     // {key:'edit', label:"Edit"}
            // ],

            columnsCommercialsOrders:[],

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

            orderProduction: [],

            userInfo:{},
            messages:[],
        }
    
    },
    methods: {
        loadMessage: function(id){
            infotraza.production('get', id).then(data =>{
                this.messages = []
                if(data.data != ""){
                    this.messages = data.data
                }
            })
        },

        hideOrder: function(id){
            infoproduction.hideorder(id).then(data =>{
                infoproduction.production(this.selectedWorkstation.code,"select-complete-production-order-tac").then(data =>{
                    this.info_result_orders = data.data
                    this.selected_source()
                })
            })
        },

        showOrder: function(id){
            infoproduction.showorder(id).then(data =>{
                infoproduction.production(this.selectedWorkstation.code,"select-complete-production-order-tac").then(data =>{
                    this.info_result_orders = data.data
                    this.selected_source()
                })
            })
        },

        submitMessage: function() {

            // this.messageStatus = false

            this.selectedformessage.user_id =this.userInfo.iduser

            infotraza.production('add', this.selectedformessage).then(data =>{
                // this.messageStatus = true
                this.loadMessage(this.selectedformessage.id)
                this.selectedformessage.message=''
                this.selectedformessage.title=''

                infoproduction.production(this.selectedWorkstation.code,"select-complete-production-order-tac").then(data =>{
                            this.info_result_orders = data.data
                            this.selected_source()
                        })
            })
        },
        isRTL () {
            return document.documentElement.getAttribute('dir') === 'rtl' ||
                document.body.getAttribute('dir') === 'rtl'
        },

        hourprepare(value){
            let hh = value.toString().split('.')[0]
            let mm = ((60/100) * parseFloat((value.toFixed(2)).toString().split('.')[1])).toFixed(0).toString()
            hh = hh.length == 1 ? '0'+hh:hh
            mm = mm.length == 1 ? '0'+mm:mm
            return  hh +':'+ mm
        },

        content_load(){


            this.objInfo1 = {"workstation_id":this.selectedWorkstation.workstation_id}
            let categories = []
            let planned = []
            let programmed = []
            let order_info = []
            let activity_info = []
            let rows = []

            // console.log(this.objInfo1) DataTable
            infoplanning.calendarcontroller(this.objInfo1, "select-workstation-slots").then(data =>{
                    if(data.data.length >0 && data.data != "Invalid Option" ){

                        this.calendar1 = data.data

                        for (let index = 0; index < this.calendar1.length; index++) {
                            const element = this.calendar1[index];
                            categories.push(element.start_date)
                            programmed.push(element.programed_hours)
                            planned.push(element.planned_hours)
                            order_info.push(element.consecutive_order)
                            activity_info.push(element.activity_description)
                        }

                        let chart_info_calc = {}
                        chart_info_calc.categories = categories
                        chart_info_calc.hoursPlanned = planned
                        chart_info_calc.hoursProgrammers = programmed
                        chart_info_calc.order_info = order_info
                        chart_info_calc.activity_info = activity_info
                        chart_info_calc.title =""

                        this.load_chart(chart_info_calc,'container', 'Centro de Trabajo por Día')
                    }
                })
            
        },


        load_chart(chartInfo, docid, subtitle){
            // console.log(chartInfo.categories)
            Highcharts.chart(docid, {
                chart: {
                    zoomType: 'x',
                    type: 'column'
                },
                title: {
                    text: 'Horas Programadas vs Horas Planeadas'
                },
                subtitle: {
                    text: subtitle
                },
                xAxis: [{
                    categories: chartInfo.categories,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Horas Planeadas',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        //text: 'Rainfall',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} mm',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true,
                    visible: false
                }
                ],
                tooltip: {
                    
                    useHTML: true,
                        formatter: function() {
                                      
                            var point = this.point.x;
                            return `
                                <div>
                                    <div class="text-center">
                                    <h3> ${chartInfo.activity_info[point] == null ? '-----' : chartInfo.activity_info[point]} </h3>
                                    <h4> OP ${chartInfo.order_info[point] == null ? '0' : chartInfo.order_info[point]} </h4>
                                    </div>
                                    <b>Horas Programadas:</b> ${chartInfo.hoursProgrammers[point]} <br/>
                                    <b>Horas Planeadas:</b> ${chartInfo.hoursPlanned[point]} <br/>                               
                                </div>
                            
                            `;
                        }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 0,
                    verticalAlign: 'top',
                    y: 0,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255,255,255,0.25)'
                },
                series: [{
                    name: 'Horas Programadas',
                    type: 'column',
                    data: chartInfo.hoursProgrammers

                }, {
                    name: 'Horas Planeadas',
                    type: 'line',
                    data: chartInfo.hoursPlanned
                }]
            });
        },

        data_change_priority(item){
            this.editPriority=false

            infoplanning.changepriority(item).then(data =>{
                if(data.data.length >0 && data.data != "Invalid Option" ){
                    if(this.selectedWorkstation.code != null && this.selectedWorkstation.code != undefined){
                        infoproduction.production(this.selectedWorkstation.code,"select-complete-production-order-tac").then(data =>{
                            this.info_result_orders = data.data
                            this.selected_source()
                        })
                    }
                }
            })

        },

        cancelEditPrioty(item, value){
            // this.startContent()
            this.editPriority=false
        },

        cambiarCentroTrabajo(item){
            this.wschange = true
            this.itemOrderSelected = {}
            this.itemOrderSelected = item
            this.wsoption = []

            infoplanning.calendarcontroller(item.order_production_process_id, "select-workstation-available").then(data =>{
                if(data.data.length >0 && data.data != "Invalid Option" ){
                    if(data.data != ""){
                        for (let index = 0; index < data.data.length; index++) {
                            const element = data.data[index];
                            this.wsoption.push({value:element.workstation_id, text:element.code+' '+element.description})
                            
                        }
                    }
                }
            })
        },

        setChange(){
            // console.log(this.itemOrderSelected)
            infoplanning.calendarcontroller({ws_planning_default_id: this.itemOrderSelected.ws_planning_default_id, workstation_id:this.wsselected}, "select-change-workstation").then(data =>{
                 this.loadCommercialsOrders()
            })
        },

        preparInfo(){
            let result = this.tableCommercialsOrders.map((item)=>{
                let tmp=item;
                let color=''

                tmp.consume_buffer = 0

                if(tmp.buffer_days != 0){
                    var now = moment(new Date()); //todays date
                    var end = moment(tmp.deadline);
                    var duration = moment.duration(now.diff(end));
                    var days = duration.asDays();

                    tmp.consume_buffer = Math.round(((days/tmp.buffer_days)*100)*100) / 100 
                }

                if(tmp.consume_buffer>100){
                    color = 'dark'
                }
                else if(tmp.consume_buffer<=100 && tmp.consume_buffer>66){
                    color = 'danger'
                }
                else if(tmp.consume_buffer<=66 && tmp.consume_buffer>33){
                    color = 'warning'
                }
                else if(tmp.consume_buffer<=33 && tmp.consume_buffer>=0){
                    color = 'success'
                }else{
                    color='info'
                }

                tmp._cellVariants = {consume_buffer: color};
                tmp._showDetails = true
                return tmp;
            })

            this.totalRows = result.length

            if(this.selectTab == 'totals')
                result.sort((a, b) => parseFloat(b.consume_buffer) - parseFloat(a.consume_buffer));

            this.orderProduction = result
        },

        check_access(control, action){
            return infousers.check_access(control,action)
        }, 
         onResize() {
            this.windowHeight = window.innerHeight
        },

        numberWithCommas(num) {
            if(num == null)
                num=0
            num = num.toFixed(2)
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
            // return x //.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },

        addReports(item){
            this.showReportOrder = true
            this.reportInfoParam = item
            this.amountManualReport=0
        },
        
        submitReport(action, param_amount){

            let info_to_send = {
                workstation_id:this.reportInfoParam.workstation_id,   
                amonut:this.amountManualReport,
                order_production_process_id: this.reportInfoParam.order_production_process_id,
                jobs_id:this.reportInfoParam.job_id,
            }

            infoproduction.reportproduction(info_to_send,"tac").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Guardar registro","¡Error Guardando el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Guardar registro","¡El Registro se ha Guardado con Éxito!")
                    
                    if(this.$route.params.wscode != undefined){
                        this.selectTab='totals_workstation'
                    }
                    this.loadCommercialsOrders()
                    
                    this.showReportOrder = false

                }
            })
        },

        reportsDetails(item){

            this.itemsItemsReportsDetails=[]
            infoproduction.detailsReports(item.consecutive_order).then(data =>{

                if (data.status === 202){
                    // this.showCustom('bg-danger text-white', "Error","¡Error Modificando el Registro!")
                }else{
                    if (data.data == ""){
                        this.itemsReportsDetails = []
                    }else
                        this.itemsReportsDetails = data.data
                }

                
            })
            
            this.$refs.reportsDetails.open()
        },

        selected_source(){
            this.tableCommercialsOrders = []
            if(this.isFromRealTime){
                for (let index = 0; index < this.info_result_orders.length; index++) {
                    const element = this.info_result_orders[index];

                    if(element.released || this.check_access('drump_production', 'w')){
                        this.tableCommercialsOrders.push(element)
                    }
                }
            }else{
                this.tableCommercialsOrders = this.info_result_orders
            }
                this.columnsCommercialsOrders = Columns.columns_drump_totals_workstation  

                this.cntBlack = 0
                this.cntDanger = 0
                this.cntWarning = 0
                this.cntSuccess = 0
                this.cntInfo = 0

                for (let index = 0; index < this.tableCommercialsOrders.length; index++) {
                    const element = this.tableCommercialsOrders[index];
                    
                    if(element.consume_buffer>100){
                        this.cntBlack = this.cntBlack+1
                    }
                    else if(element.consume_buffer<=100 && element.consume_buffer>66){
                        this.cntDanger = this.cntDanger+1
                    }
                    else if(element.consume_buffer<=66 && element.consume_buffer>33){
                        this.cntWarning = this.cntWarning+1
                    }
                    else if(element.consume_buffer<=33 && element.consume_buffer>=0){
                        this.cntSuccess = this.cntSuccess+1
                    }else{
                        this.cntInfo = this.cntInfo+1
                    }
                }

                this.preparInfo()
        },

        updateJobs(){
            this.selected_production_order.status = this.itemStatus.status_id
            infoproduction.changestatusorderprocess(this.selected_production_order).then(data =>{

                 if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Modificando el Registro!")
                }else{
                    // this.info_result_orders = data.data
                    this.$refs.cancelarJob.close()
                    this.selected_source()
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                    this.loadCommercialsOrders()
                    // this.cptItems()
                }
                
            })
        },

        closeUpdateJobs(){
            this.$refs.cancelarJob.close()
        },

        eventSelectedTab(tab){
            this.selectTab = tab
            this.selected_source()
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
            
            showCustom: function(classes, title, text) {
                this.$notify({
                    group: 'notifications-default',
                    type: classes,
                    title: title,
                    text: text
                })
            },
        ///Funcion para cargar la ayuda del helper
        loadCommercialsOrders(){
            if(this.selectedWorkstation.code != null && this.selectedWorkstation.code != undefined){
                infoproduction.production(this.selectedWorkstation.code,"select-complete-production-order-tac").then(data =>{
                    // console.log(data.data)
                    this.info_result_orders = data.data
                    this.selected_source()
                })
            }

            infosysconfig.documentstatus({module:'production_order'}, "select").then(data => {
                // console.log("-----_", data.data)
                if(data.data != ''){
                    this.optionsStatus = data.data
                }else{
                    this.tableData = []
                }
            })

        },
        
        update_production_order(){
            infoproduction.updateproductionorder(this.infosend).then(data =>{

                 if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Modificando el Registro!")
                }else{
                    this.loadCommercialsOrders()
                    this.showEditOrder = false
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                }
                
            })
        },

        update_details_order(){
            infoproduction.updatedetailproductionorder(this.infosend).then(data =>{

                 if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error Modificando el Registro!")
                }else{
                    this.loadCommercialsOrders()
                    this.showEditOrder = false
                    this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                }
                
            })
        }
    },
    created(){
        // console.log(this.code_workstation)
        this.isFromRealTime = this.fromRealTime

        if(this.$route.params.wscode != undefined){
            this.selectTab='totals_workstation'
        }

        infouser.currentUser().then(response =>{
                this.userInfo=response.data
            }).catch(e => {
        });

        infomaster.workstation([],"select").then(data => {
                
                // this.workstationType = data.data[0].wstype
                // this.workstationPlant = data.data[0].wsplant
                this.workstations= data.data[0].workstation
                
                // if( data.data[0].workstation != null){
                //     this.tableData = data.data[0].workstation
                //     this.totalRows= this.tableData.length
                // }
            })


        if(this.code_workstation != '' && this.code_workstation != null && this.code_workstation != undefined){
            this.selectedWorkstation = {code:this.code_workstation}
        }

        this.loadCommercialsOrders()
    },
    beforeDestroy() { 
        window.removeEventListener('resize', this.onResize); 
    },

    mounted() {
        window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
        })
    },
}
</script>
<style>
    .font-table {font-size: 12px;}
    .table .table-warning, .table .table-warning > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #ffff00;
        color: #292b2c;
    }
    .table .table-dark, .table .table-dark > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #292b2c;
        color: #f7f7f7;
    }
    .table .table-danger, .table .table-danger > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #d9534f;
        color: #f7f7f7;
    }
    .table .table-success, .table .table-success > th, .table .table-warning > td {
        border-color: rgba(0, 0, 0, 0.035) !important;
        background-color: #5cb85c;
        color: #f7f7f7;
    }
</style>
<template>
    <div>

        <!-- ENCABEZADO DE LA OP -->

        <div v-if="infoMantenimiento.state=='CR' || infoMantenimiento.plan_id == 0">
            <b-alert :variant="varianMessage" dismissible fade :show="showMessage" @dismissed="showMessage=false">
                {{messageAlert}}
            </b-alert>
            <b-row>
                <b-col md="6">
                    <b-form-group label="Nombre del Mantenimiento" label-for="input-default" >
                        <b-form-input id="input-default" v-model="infoMantenimiento.description" :disabled="infoMantenimiento.state=='AC'"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group label="Duración en Horas del Mantenimiento" label-for="input-default" >
                        <b-form-input v-model="infoMantenimiento.hours_duration" :disabled="infoMantenimiento.state=='AC'"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>

            <b-row>
                <b-col md="6">
                    <b-form-group label="Tipo de Mantenimiento" label-for="input-default" 
                        v-if="infoMantenimiento.maintenance_type== null || (infoMantenimiento.maintenance_type=='preventivo' || infoMantenimiento.maintenance_type=='correctivo' || infoMantenimiento.maintenance_type=='mejora')">
                        <b-select v-model="infoMantenimiento.maintenance_type" :disabled="infoMantenimiento.state=='AC'">
                            <option value="preventivo">Preventivo</option>
                            <option value="correctivo">Correctivo</option>
                            <option value="mejora">Mejora</option>
                        </b-select>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group label="Prioridad" label-for="input-default">
                        <b-select v-model="infoMantenimiento.priority" :disabled="infoMantenimiento.state=='AC'">
                            <option value="alta">Alta</option>
                            <option value="media">Media</option>
                            <option value="baja">Baja</option>
                        </b-select>
                    </b-form-group>
                </b-col>
            </b-row>

            <b-form-group label-cols="12" label="Descripción">
                <b-form-textarea
                :disabled="infoMantenimiento.state=='AC'"
                id="textarea"
                v-model="infoMantenimiento.problem_definition"
                placeholder="Descripción..."
                rows="3"
                max-rows="6"
                ></b-form-textarea>
            </b-form-group>
            <!-- <b-form-group label-cols="12" label="Detalle" v-if="infoMantenimiento.state=='AC'">
                <b-form-textarea
                v-model="infoMantenimiento.event_definition"
                id="textarea"
                placeholder="Detalle..."
                rows="3"
                max-rows="6"
                ></b-form-textarea>
            </b-form-group> -->


            <div class="text-right">
                <b-button size="md" variant="success" @click="savePlan()">Guardar</b-button>
            </div>

        </div>

        <div v-if="infoMantenimiento.state!='CR' && infoMantenimiento.plan_id != 0" class="text-center">
            <h3 style="margin-bottom:5px">
                {{infoMantenimiento.description}}
            </h3>
            <h4>
                # OT: <small class="text-muted">{{infoMantenimiento.plan_id}}</small> Duracion: <small class="text-muted">{{infoMantenimiento.hours_duration}} (h)</small> Tipo: <small class="text-muted">{{infoMantenimiento.maintenance_type}} </small> Prioridad: <small class="text-muted">{{infoMantenimiento.priority}}</small>
            </h4>
            <p>
                {{infoMantenimiento.problem_definition}}
            </p>
        </div>

        <!-- ENCABEZADO DE LA OP -->


        <b-tabs content-class="mt-3" active>
            <b-tab title="Frecuencias" :disabled="infoMantenimiento.plan_id == 0" v-if="infoMantenimiento.maintenance_type=='preventivo'">
                <div class="row" v-if="infoMantenimiento.state == 'CR'">
                    <div class="col-md-5">
                        <b> Unidades de Medida </b>
                        <b-select v-model="infoDuration.code_duration" >
                            <option value="hours_operations">Horas de Operación</option>
                            <option value="max_days">Número de Días</option>
                            <option value="cycles">Ciclos</option>
                            <option value="km">Kilometros</option>
                        </b-select>
                    </div>
                    <div class="col-md-4">
                        <b> Valor Maximo </b>
                        <b-input type="number" v-model="infoDuration.max_value"></b-input>
                    </div>
                    <div class="col-md-3">
                        &nbsp;&nbsp; 
                        <b-btn variant="outline-success" @click="saveDuration" block><i class="ion ion-md-add"></i>&nbsp;&nbsp; Adicionar Configuracion </b-btn>
                    </div>
                </div>

                <div>
                    <b-table small show-empty stacked="md" :items="infoMeasure" :fields="columnsMeasure" class="mt-2">
                        <template v-slot:cell(edit)="row">
                            <div class="text-center" v-if="infoMantenimiento.state == 'CR'">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="infoDuration=row.item;"><i class="ion ion-md-create"></i></b-btn>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="removeDuration(row.item)"><i class="ion ion-md-close"></i></b-btn>
                            </div>
                        </template>
                    </b-table>
                </div>
            </b-tab>





            <b-tab title="Actividades" :disabled="infoMantenimiento.plan_id == 0" @click="getActivities()">

                <b-card no-body class="mb-2">
                    <b-card-header>
                        <a class="d-flex justify-content-between text-body" href="javascript:void(0)" v-b-toggle.accordion2-1>
                            Adicionar Informacion
                            <div class="collapse-icon"></div>
                        </a>
                    </b-card-header>
                    <b-collapse id="accordion2-1" :visible="false" accordion="accordion2">
                        <b-card-body>
                            <b-row>
                                <b-col md="6">
                                    <b-form-group label="Tipo de Acción">
                                        <b-select v-model="infoActivities.activity_action">
                                            <option value="1">Reemplazo</option>
                                            <option value="2">Matenimiento</option>
                                            <option value="3">Inspección</option>
                                            <option value="4">Revisión</option>
                                            <option value="5">Otra</option>
                                        </b-select>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group  label="Descripción de la Actividad" >
                                        <b-form-input v-model="infoActivities.description"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>

                            <b-form-row>
                                <b-form-group class="col-md-6" label="Seleccione una Parte" >
                                        <b-input-group>
                                            <b-input-group-text slot="prepend" v-if="loading">
                                                <i class="ion ion-md-sync"></i>
                                            </b-input-group-text>
                                            <b-input-group-text slot="prepend" v-if="!loading">
                                                <i class="ion ion-ios-search"></i>
                                            </b-input-group-text>
                                            <input type="text" class="form-control"
                                                placeholder="Seleccione una Parte"
                                                autocomplete="off"
                                                v-model="valueSelectedSupplier"
                                                @keydown.down="down"
                                                @keydown.up="up"
                                                @keydown.enter="hit"
                                                @keydown.esc="reset"
                                                @blur="reset"
                                                @input="updateQuerySupplier" />
                                            <b-input-group-text slot="append" v-if="isDirty || valueSelectedSupplier" @click="resetInput">
                                                <i class="ion ion-md-close" ></i>
                                            </b-input-group-text>
                                        </b-input-group>
                                        <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                                            <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                                <span class="name" v-text="item.code"></span>
                                                <span class="text-muted">{{ item.description }}</span>
                                            </a>
                                        </div>
                                </b-form-group>
                                <b-form-group class="col-md-6"  label="Cantidad de Partes Incluidas" >
                                    <b-form-input type="number" v-model="infoActivities.amount"></b-form-input>
                                </b-form-group>
                            </b-form-row>
                            <div class="text-right">
                                <div>
                                    <b-btn variant="outline-info" class="btn-sm" v-b-modal.modals-default @click.prevent="infoProviders = {}; valueSelectedSupplier = ''"><i class="ion ion-md-close"> Borrar </i></b-btn>
                                    <b-btn variant="outline-success" class="btn-sm"  v-b-modal.modals-default @click.prevent="saveActivities();"><i class="ion ion-md-checkmark"></i> Adicionar </b-btn>
                                </div>
                            </div>
                        </b-card-body>
                    </b-collapse>
                </b-card>
                    

                <b-table small show-empty stacked="md" :items="dataActivities" :fields="columnsActivities" class="mt-2">
                    <template v-slot:cell(activity_action_code)="row">
                        <div class="text-left" > 
                            <b-btn v-if="row.item.done" variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="deleteActivities(row.item, 'change-done')"><i class="fas fa-circle"></i></b-btn>
                            <b-btn v-if="!row.item.done" variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="deleteActivities(row.item, 'change-done')"><i class="fas fa-circle"></i></b-btn>
                            {{row.item.activity_action_code}}
                        </div>
                    </template>

                    <template v-slot:cell(action)="row">
                        <div class="text-left"  v-if="infoMantenimiento.state == 'CR' || (infoMantenimiento.state != 'CR' && !row.item.is_planned)" > 
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="infoActivities=row.item; valueSelectedSupplier=row.item.part"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="deleteActivities(row.item, 'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                </b-table>
            </b-tab>





            <b-tab title="Recursos Sugeridos" :disabled="infoMantenimiento.plan_id == 0" @click="calcularPartes()">
                <b-table small show-empty stacked="md" :items="dataParts" :fields="columnsParts" class="mt-2">
                    
                    <template v-slot:cell(action)="row">
                        <div class="text-left" v-if="infoMantenimiento.state=='AC'">
                            <b-dd variant="default" text="Acciones" :right="isRTL" size="xs">
                                <b-dd-item @click.prevent="changePart(row.item, 'event', 1)" :variant="row.item.action == 1 ? 'success':'danger'"> <i class="fas fa-sync"></i> &nbsp; Reemplazar Parte</b-dd-item>
                                <b-dd-item  @click.prevent="changePart(row.item, 'event', 2)" :variant="row.item.action == 2 ? 'success':'danger'"> <i class="fas fa-exclamation"></i> &nbsp; Ejecutar Mantenimiento</b-dd-item>
                                <b-dd-divider></b-dd-divider>
                                <b-dd-item v-if="row.item.plan_assets_parts_id != null"  @click.prevent="changePart(row.item, 'delete')" > <i class="ion ion-md-close text-danger"></i> &nbsp; Eliminar Acción</b-dd-item>
                            </b-dd>
                        </div>
                        <div v-else>
                            {{row.item.action == "1" ? "Reemplazar Parte" : "Ejecutar Mantenimiento" }}
                        </div>
                    </template>

                    <template v-slot:cell(description)="row">
                        <div class="text-left">
                            {{row.item.description}}
                            &nbsp; &nbsp; <b-badge v-if="row.item.plan_assets_parts_id != null" :variant="row.item.action_part == 1 ? 'success':'warning' ">{{row.item.action_part == 1 ? 'Reemplazo':'Mantenimiento' }}</b-badge> 
                        </div>
                    </template>
                    
                    <template v-slot:cell(percentage_use_pending)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="row.toggleDetails"><i class="fas fa-info"></i></b-btn>
                            <span>
                                {{row.item.percentage_use_pending}}
                            </span>
                        </div>
                    </template>

                    <template v-slot:row-details="row">
                        
                        <b-table small show-empty stacked="md" :items="row.item.details" :fields="[{key:'duration', label:'Unidade de Medida'},{key:'max_value', label:'Valor Maximo'},{key:'current_value', label:'Valor Actual'},{key:'pending_use', label:'Uso Pendiente'},{key:'percentage_use_pending', label:'% de Uso'}]" class="mt-2">
                        
                            <template v-slot:cell(duration)="row">
                                <div class="text-left">
                                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="row.toggleDetails"><i class="fas fa-info"></i></b-btn>
                                    <span>
                                        {{row.item.duration}}
                                    </span>
                                </div>
                            </template>
                            <template v-slot:row-details="row">
                                <b>Accion Sugerida</b> 
                                <hr>
                                {{row.item.details}}
                            </template>
                        </b-table>
                    </template>
                </b-table>
            </b-tab>


            <!-- Quien Ejecuta -->


            <b-tab title="Personal a Cargo" :disabled="infoMantenimiento.plan_id == 0"  @click="getPersonl()">
                <b-card no-body class="mb-2">
                    <b-card-header>
                        <a class="d-flex justify-content-between text-body" href="javascript:void(0)" v-b-toggle.accordion3-1>
                            Adicionar Informacion
                            <div class="collapse-icon"></div>
                        </a>
                    </b-card-header>
                    <b-collapse id="accordion3-1" :visible="false" accordion="accordion3">
                        <b-card-body>
                            <b-row>
                                <b-col md="5">
                                    <b-form-group label="Personal Estimado" label-for="input-default" >
                                        <multiselect
                                            v-model="itemselected"
                                            :options="info_operator"
                                            label="concat"
                                            :searchable="true"
                                            :show-labels="false"
                                            placeholder="Asiste Llamado"
                                        />
                                    </b-form-group>
                                </b-col>
                                <b-col md="5">
                                    <b-form-group label="Tiempo Estimado (h)" label-for="input-default" >
                                        <b-form-input v-model="infoPersonal.expected_time_hour" type="number"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col md="2">
                                    <b-form-group label=" . " label-for="input-default" >
                                        <b-button :variant="this.itemselected.wscode == null ? 'outline-success icon-btn' : 'outline-warning icon-btn'" @click="savePersonl()"><i class="ion ion-md-checkmark"></i></b-button>
                                        <b-button :variant="this.itemselected.wscode == null ? 'outline-info icon-btn' : 'outline-warning icon-btn'" @click="getPersonl(); itemselected={}; infoPersonal={}"><i class="ion ion-md-close"></i></b-button>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-card-body>
                    </b-collapse>
                </b-card>



                <b-table small show-empty stacked="md" :items="dataPersonal" :fields="columnsPersonal" class="mt-2">
                    <template v-slot:cell(personal)="row">
                        <div class="text-left">
                            {{row.item.name + ' ' + row.item.lastname}}
                        </div>
                    </template>
                    <template v-slot:cell(realtime_hour)="row"> 
                        <div class="w-100 text-left">
                            <div v-show="!modify_realtime_hour[row.index]['id'+row.item.plan_personal_id]">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click="changeStateEditValue(row);"><i class="ion ion-md-create"></i></b-btn>
                                {{row.item.realtime_hour == null ? 0 : row.item.realtime_hour}}
                            </div>
                            <b-input-group v-show="modify_realtime_hour[row.index]['id'+row.item.plan_personal_id]"  size="sm">
                                <b-form-input placeholder="Duración Real (h)" v-model="infoPersonal.realtime_hour" ></b-form-input>
                                <b-input-group-append>
                                    <b-btn variant="success" @click="editValuePersonal()"> <span class="ion ion-md-checkmark"></span> </b-btn>
                                    <b-btn variant="danger" @click="getPersonl(); modify_realtime_hour[row.index]['id'+row.item.plan_personal_id]=false"> <span class="ion ion-md-close"></span> </b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </template>
                    <template v-slot:cell(action)="row">
                        <div class="text-left" v-if="infoMantenimiento.state == 'CR' || (infoMantenimiento.state != 'CR' && !row.item.is_planned)" >
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="loadPersonalEdit(row.item)"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="deletePersonal(row.item)"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                </b-table>
            </b-tab>

            <b-tab title="Proveedores" :disabled="infoMantenimiento.plan_id == 0" @click="getSupplier()">
                <b-card no-body class="mb-2">
                    <b-card-header>
                        <a class="d-flex justify-content-between text-body" href="javascript:void(0)" v-b-toggle.accordion4-1>
                            Adicionar Informacion
                            <div class="collapse-icon"></div>
                        </a>
                    </b-card-header>
                    <b-collapse id="accordion4-1" :visible="false" accordion="accordion4">
                        <b-card-body>
                            <b-form>
                                <b-form-row>
                                    <b-form-group class="col-md-6" label="Actividad a Realizar">
                                        <b-input placeholder="Actividad a Realizar" v-model="infoProviders.activity"/>
                                    </b-form-group>
                                    <b-form-group class="col-md-6" label="Seleccione un Proveedor">
                                            <b-input-group>
                                                <b-input-group-text slot="prepend" v-if="loading">
                                                    <i class="ion ion-md-sync"></i>
                                                </b-input-group-text>
                                                <b-input-group-text slot="prepend" v-if="!loading">
                                                    <i class="ion ion-ios-search"></i>
                                                </b-input-group-text>
                                                <input type="text" class="form-control"
                                                    placeholder="Seleccione un proveedor"
                                                    autocomplete="off"
                                                    v-model="valueSelectedSupplier"
                                                    @keydown.down="down"
                                                    @keydown.up="up"
                                                    @keydown.enter="hit"
                                                    @keydown.esc="reset"
                                                    @blur="reset"
                                                    @input="updateQuerySupplier" />
                                                <b-input-group-text slot="append" v-if="isDirty || valueSelectedSupplier" @click="resetInput">
                                                    <i class="ion ion-md-close" ></i>
                                                </b-input-group-text>
                                            </b-input-group>
                                            <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                                                <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                                    <span class="name" v-text="item.nit"></span>
                                                    <span class="text-muted">{{ item.name }}</span>
                                                </a>
                                            </div>
                                    </b-form-group>
                                </b-form-row>
                                <b-form-row>
                                    <b-form-group class="col-md-4" label="Orden de Compra">
                                        <b-input   placeholder="Orden de Compra" v-model="infoProviders.oc"/>
                                    </b-form-group>
                                    <b-form-group class="col-md-4" label="Tiempo Estimado (h)">
                                        <b-input placeholder="Tiempo Estimado" v-model="infoProviders.expected_time_hour"/>
                                    </b-form-group>
                                    <b-form-group class="col-md-4" label="Precio">
                                    <b-input type="number" step="0.1" placeholder="Precio" v-model="infoProviders.cost_per_hour"/>
                                    </b-form-group>
                                </b-form-row>
                                <div class="text-right">
                                    <div>
                                        <b-btn variant="outline-info" class="btn-sm" v-b-modal.modals-default @click.prevent="infoProviders = {}; valueSelectedSupplier = ''"><i class="ion ion-md-close"> Borrar </i></b-btn>
                                        <b-btn variant="outline-success" class="btn-sm"  v-b-modal.modals-default @click.prevent="saveSupplier();"><i class="ion ion-md-checkmark"></i> Adicionar </b-btn>
                                    </div>
                                </div>
                            </b-form>
                        </b-card-body>
                    </b-collapse>
                </b-card>



                <b-table small show-empty stacked="md" :items="dataSupplier" :fields="columnsSupplier" class="mt-2">
                    <!-- v-if="infoMantenimiento.state != 'AC'"
                    v-if="infoMantenimiento.state != 'AC'" -->
                                        
                    <template v-slot:cell(realtime_hour)="row"> 
                        <div class="w-100 text-left">
                            <div v-show="!modify_realtime_hour_supplier[row.index]['idx'+row.item.plan_supplier_id]">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click="changeStateEditValueSupplir(row);"><i class="ion ion-md-create"></i></b-btn>
                                {{row.item.realtime_hour == null ? 0 : row.item.realtime_hour}}
                            </div>
                            <b-input-group v-show="modify_realtime_hour_supplier[row.index]['idx'+row.item.plan_supplier_id]"  size="sm">
                                <b-form-input placeholder="Duración Real (h)" v-model="infoProviders.realtime_hour" ></b-form-input>
                                <b-input-group-append>
                                    <b-btn variant="success" @click="editValueSupplier()"> <span class="ion ion-md-checkmark"></span> </b-btn>
                                    <b-btn variant="danger" @click="getSupplier(); modify_realtime_hour_supplier[row.index]['idx'+row.item.plan_supplier_id]=false"> <span class="ion ion-md-close"></span> </b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </template>

                    <template v-slot:cell(realtime_hour)="row"> 
                        <div class="w-100 text-left">
                            <div v-show="!modify_realtime_hour_supplier[row.index]['idx'+row.item.plan_supplier_id]">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click="changeStateEditValueSupplir(row);"><i class="ion ion-md-create"></i></b-btn>
                                {{row.item.realtime_hour == null ? 0 : row.item.realtime_hour}}
                            </div>
                            <b-input-group v-show="modify_realtime_hour_supplier[row.index]['idx'+row.item.plan_supplier_id]"  size="sm">
                                <b-form-input placeholder="Duración Real (h)" v-model="infoProviders.realtime_hour" ></b-form-input>
                                <b-input-group-append>
                                    <b-btn variant="success" @click="editValueSupplier()"> <span class="ion ion-md-checkmark"></span> </b-btn>
                                    <b-btn variant="danger" @click="getSupplier(); modify_realtime_hour_supplier[row.index]['idx'+row.item.plan_supplier_id]=false"> <span class="ion ion-md-close"></span> </b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </template>
                    <template v-slot:cell(real_cost)="row"> 
                        <div class="w-100 text-left">
                            <div v-show="!modify_realtime_hour_supplier[row.index]['idx'+row.item.plan_supplier_id]">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click="changeStateEditValueSupplir(row);"><i class="ion ion-md-create"></i></b-btn>
                                {{row.item.real_cost == null ? 0 : row.item.real_cost}}
                            </div>
                            <b-input-group v-show="modify_realtime_hour_supplier[row.index]['idx'+row.item.plan_supplier_id]"  size="sm">
                                <b-form-input placeholder="Duración Real (h)" v-model="infoProviders.real_cost" ></b-form-input>
                                <b-input-group-append>
                                    <b-btn variant="success" @click="editValueSupplier()"> <span class="ion ion-md-checkmark"></span> </b-btn>
                                    <b-btn variant="danger" @click="getSupplier(); modify_realtime_hour_supplier[row.index]['idx'+row.item.plan_supplier_id]=false"> <span class="ion ion-md-close"></span> </b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </template>
                    <template v-slot:cell(action)="row">
                        <div class="text-left" v-if="infoMantenimiento.state == 'CR' || (infoMantenimiento.state != 'CR' && !row.item.is_planned)">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="loadSupplierEdit(row.item)"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="deleteSupplier(row.item.plan_supplier_id)"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                </b-table>
            </b-tab>

            <b-tab title="Otros Costos" :disabled="infoMantenimiento.plan_id == 0" @click="infoProviders={}">
                <b-card no-body class="mb-2">
                    <b-card-header>
                        <a class="d-flex justify-content-between text-body" href="javascript:void(0)" v-b-toggle.accordion5-1>
                            Adicionar Informacion
                            <div class="collapse-icon"></div>
                        </a>
                    </b-card-header>
                    <b-collapse id="accordion5-1" :visible="false" accordion="accordion5">
                        <b-card-body>
                            <b-form>
                                <b-form-row>
                                    <b-form-group class="col-md-4" label="Actividad a Realizar">
                                        <b-input placeholder="Actividad a Realizar" v-model="infoProviders.activity"/>
                                    </b-form-group>
                                    <b-form-group class="col-md-4" label="Costo Estimado" :disabled="infoProviders.is_planned && infoMantenimiento.state != 'CR'">
                                        <b-input type="number" placeholder="Costo Estimado" v-model="infoProviders.estimated_cost"/>
                                    </b-form-group>
                                    <b-form-group class="col-md-4" label="Costo Real">
                                        <b-input type="number" placeholder="Costo Real" v-model="infoProviders.real_cost"/>
                                    </b-form-group>
                                </b-form-row>

                            
                                <div class="text-right">
                                    <div>
                                        <b-btn variant="outline-info" class="btn-sm" v-b-modal.modals-default @click.prevent="infoProviders={}"><i class="ion ion-md-close"> Borrar </i></b-btn>
                                        <b-btn variant="outline-success" class="btn-sm"  v-b-modal.modals-default @click.prevent="addCostsInfo();"><i class="ion ion-md-checkmark"></i> Adicionar </b-btn>
                                    </div>
                                </div>

                            </b-form> 
                        </b-card-body>
                    </b-collapse>
                </b-card>
                
                <b-table small show-empty stacked="md" :items="infoMantenimiento.costs" :fields="itemCostos" class="mt-2">
                    <template v-slot:cell(action)="row">
                        <div class="text-left"  >
                            <b-btn  variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="loadSupplierEdit(row.item)"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn v-if="infoMantenimiento.state == 'CR' || (infoMantenimiento.state != 'CR' && !row.item.is_planned)" variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="deleteSupplier(row.item.plan_supplier_id)"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                </b-table>
            </b-tab>

            <b-tab title="Historial" :disabled="infoMantenimiento.plan_id == 0" @click="historyChangeStates()">

                <b-form-group label-cols="12" label="Detalle" v-if="infoMantenimiento.state!='CR'">
                    <b-form-textarea
                    v-model="infoMantenimiento.event_definition"
                    id="textarea"
                    placeholder="Detalle..."
                    rows="3"
                    max-rows="6"
                    ></b-form-textarea>
                </b-form-group>

                <div class="text-right">
                    <b-button size="sm" variant="outline-success" @click="savePlan()">Guardar</b-button>
                </div>

                <h4>Historial Cambio de Estados</h4> 

                <b-table small show-empty stacked="md" :items="infoStatesLogs" :fields="[{key:'fecha', label:'Fecha'}, {key:'description', label:'Estado'}, {key:'Usuario', label:'Usuario'}, {key:'comentario', label:'Comentario'}]" class="mt-2">
                </b-table>


            </b-tab>
            <b-tab title="Resultados" :disabled="infoMantenimiento.plan_id == 0" @click="getFinalResult()">

                <div class="text-center">
                    <i class="fas fa-minus text-danger">&nbsp; Costos No Planeados</i>&nbsp;&nbsp;&nbsp;<i class="fas fa-check text-success">&nbsp; Costos Planeados</i>
                </div>

                <b-table small show-empty stacked="md" :items="totalCostPlan" :fields="[{key:'entity', label:'Origen'}, {key:'expected_time_hours', label:'Horas Estimadas'}, {key:'realtime_hour', label:'Horas Reales'} , {key:'desviacion_h', label:'% Desviacion (h)'}, {key:'estimated_cost', label:'Costo Estimado'}, {key:'real_cost', label:'Costo Real'} , {key:'desviacion', label:'% Desviacion ($)'}]" class="mt-2">
                    <template v-slot:cell(entity)="row"> 
                        <div class="w-100 text-left">
                            
                            <div v-if="row.item.entity != 'TOTAL'">
                                <i class="fas fa-minus text-danger" v-if="!row.item.is_planned && row.item.is_planned != null"></i>
                                <i class="fas fa-check text-success" v-if="row.item.is_planned"></i>
                                {{row.item.entity}}
                            </div>
                            <div v-else>
                                <b>{{row.item.entity}}</b> 
                            </div>
                               
                        </div>
                    </template>

                    <template v-slot:cell(desviacion)="row"> 
                        <div class="w-100 text-left">
                            
                            {{((row.item.estimated_cost == 0 ? 0 : 1-(row.item.estimated_cost/ row.item.real_cost))*100).toFixed(2)}}
                        </div>
                    </template>

                    <template v-slot:cell(desviacion_h)="row"> 
                        <div class="w-100 text-left">
                            
                            {{((row.item.expected_time_hours == 0 ? 0 : 1-(row.item.expected_time_hours/ row.item.realtime_hour))*100).toFixed(2)}}
                        </div>
                    </template>
                </b-table>
                <div class="text-right">
                    <b-button size="md" variant="danger" @click="liquidarOrden()">Liquidar Orden</b-button>
                </div>
                
            </b-tab>
        </b-tabs>

        <!-- <b-modal v-model="actionConfirm" hide-footer centered title="Confirmación de Acción">
            <h3 :class="infoDetalleMant.new_state == 'AC'?'text-success text-center':'text-danger text-center'">{{infoDetalleMant.new_state == "AC" ? 'Liberar Orden de Trabajo' : 'Terminar la Solicitud' }}</h3>
            <h4 class="text-center">¿Desea Continuar?</h4>
            <b-form-group label-cols="12" label="">
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
                <b-button size="md" :variant="infoDetalleMant.new_state == 'AC'?'success':'danger'" :disabled="infoDetalleMant.new_state != 'AC' && (infoDetalleMant.comment == '' || this.infoDetalleMant.comment == null)" @click="updateState(); actionConfirm=false">Confirmar</b-button>
            </div>
        </b-modal> -->
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<script >
import Vue from 'vue'
import Axios from 'axios'
import VueTypeahead from 'vue-typeahead'
import { infomainten } from '@/components/i40/js/maintenance'
import Multiselect from 'vue-multiselect';
import { config,master,mainten } from "@/components/i40/js/globals";
// Vue.prototype.$http = Axios


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
      props: {
        assets_id: {
            type: Number
        },
        infoDetalle:{
            type: Object
        }
    },
    extends: VueTypeahead,
    components:{
        Multiselect
    },
    data() {
        return {
            totalCostPlan:[],
            showMessage:false,
            messageAlert:'',
            varianMessage:'',
            columnsSupplier:[{key:'activity', label:"Actividad"},
                {key:'supplier', label:"Proveedor"},
                {key:'oc', label:"Orden Compra / Trabajo"},
                {key:'cost_per_hour', label:"Costo por Hora"},
                {key:'expected_time_hour', label:"Duración Estimada (h)"},
                {key:'realtime_hour', label:"Duración Real (h)"},
                {key:'real_cost', label:"Costo Real"},
                {key:'action', label:'Accion'}],
            dataSupplier:[],

            infoStatesLogs:[],

            itemCostos:[{key:'activity', label:"Actividad"},{key:'estimated_cost', label:'Costo Estimado'}, {key:'real_cost', label:'Costo Real'}, {key:'action', label:'Accion'}],

            src:'',
            modify_realtime_hour:[],
            infoPersonal:{},
            infoPersonal_2:{},
            dataPersonal:[],
            columnsPersonal:[ 
                {key:'personal', label:"Personal"},
                {key:'position', label:"Cargo"},
                // {key:'cost_per_hour', label:"Costo por Hora"},
                {key:'expected_time_hour', label:"Duración Estimada (h)"},
                {key:'realtime_hour', label:"Duración Real (h)"},
                {key:'action', label:'Accion'}],

            info_operator:[],
            itemselected:{},
            infoSupplier_2:{},

            infoProviders:{},
            valueSelectedSupplier:'',
            modify_realtime_hour_supplier:[],

            infoMantenimiento:this.infoDetalle,
            infoDuration:{
                plan_frecuency_id:0,
                code_duration:null,
                max_value:0,
            },

            infoMeasure:[],
            columnsMeasure:[],
            columnsMeasure:[
                // {key:'complete', label:"Completo"},
                {key:'description_duration', label:"Unidade de Medida"},
                {key:'max_value', label:"Valor Maximo"},
                // {key:'currentValue', label:"Valor Actual"},
                {key:'edit', label:"Edit"}],

            columnsActivities:[
                {key:'activity_action_code', label:"Actividad"},
                {key:'description', label:"Descripcion"},
                {key:'amount', label:"Cantidad de Partes"},
                {key:'part', label:"Parte Seleccionada"},
                {key:'action', label:"Acciones"},],
            dataActivities:[],

            columnsParts:[
                {key:'code', label:"Codigo"},
                {key:'description', label:"Descripcion"},
                {key:'amount_per_parent', label:"Cantidad"},
                {key:'price_list', label:"Precio de Lista"},
                {key:'percentage_use_pending', label:"% de Uso"},
                {key:'action', label:'Accion'}
            ],
            dataParts:[],

            infoActivities:{
                plan_activities_id:0,
                plan_activities_id:null,
                is_planned:false,
                description:''
            }
        }
    },

    methods: {
        onHit (item) {
            if(!this.src.includes("partssearch")){
                this.valueSelectedSupplier=item.name
                this.infoProviders.supplier_id=item.supplier_id
            }else{
                // console.log(item)
                this.valueSelectedSupplier=item.code + ' ' + item.description
                this.infoActivities.assets_parts_id=item.assets_parts_id
                this.infoActivities.cost_part = item.price_list
            }
        },

        updateQuerySupplier(){
            this.query = this.valueSelectedSupplier
            this.update()
        },

        resetInput () {
            this.value = ''
            this.valueSelectedTool=''
            this.reset()
        },

        changePart(item, action, code){
            item.plan_id = this.infoMantenimiento.plan_id
            item.action_part = code
            infomainten.plan(item,'parts',action).then(data =>{
                this.calcularPartes()
            })
        },

        historyChangeStates(){
            infomainten.plan(this.infoMantenimiento.plan_id,'plan','state-history').then(data =>{
                this.infoStatesLogs =data.data
            })
        },

        getFinalResult(){
            infomainten.plan(this.infoMantenimiento.plan_id,'plan','get-total-cost').then(data =>{
                this.totalCostPlan =data.data
            })
        },

        liquidarOrden(){
            this.$emit('close', false)
        },

        savePlan(){
            // infoProviders valueSelectedSupplier
            // {{this.infoMantenimiento}}
            // console.log(this.infoMantenimiento)

            this.infoMantenimiento.assets_id= this.assets_id

            infomainten.plan(this.infoMantenimiento,'plan',this.infoMantenimiento.plan_id == 0 ? 'insert': 'update').then(data =>{
                
                // console.log(data.data)
                if(this.infoMantenimiento.plan_id == 0)
                    this.infoMantenimiento.plan_id = data.data
                else{
                    // this.infoCostos=this.infoMantenimiento.costs
                    this.$emit('refresh',data.data)
                }

            })
        },

        addCostsInfo(){
            if(this.infoMantenimiento.costs == null)
                this.infoMantenimiento.costs = []

            let exists = false

            for (let index = 0; index < this.infoMantenimiento.costs.length; index++) {
                const element = this.infoMantenimiento.costs[index];
                if(element.activity == this.infoProviders.activity)
                    exists = true   
            }

            if(!exists)
                this.infoMantenimiento.costs.push({'activity': this.infoProviders.activity, 'estimated_cost': this.infoProviders.estimated_cost, 'real_cost': this.infoProviders.real_cost, 'is_planned': this.infoMantenimiento.state=='CR' })

            infomainten.plan(this.infoMantenimiento,'plan',this.infoMantenimiento.plan_id == 0 ? 'insert': 'update').then(data =>{
                    this.infoProviders = {}
                
                // console.log(data.data)
                if(this.infoMantenimiento.plan_id == 0){
                    this.infoMantenimiento.plan_id = data.data
                }else{
                    // this.infoCostos=this.infoMantenimiento.costs
                    this.$emit('refresh',data.data)
                }

            })
        },

        saveDuration(){
            this.infoDuration.plan_id = this.infoMantenimiento.plan_id
            // this.infoDuration.product_id=this.infoProduct.product_id
            infomainten.plan(this.infoDuration,'frecuency',this.infoDuration.plan_frecuency_id == 0 ? 'insert': 'update').then(data => {
                if(data.data != ""){
                    this.infoMeasure = data.data

                    this.infoDuration={
                        plan_frecuency_id:0,
                        code_duration:null,
                        max_value:0,
                    }
                }else{
                    this.infoMeasure = []
                }
            })
        },

        loadDuration(){
            infomainten.plan(this.infoMantenimiento.plan_id,'frecuency','select').then(data => {
                if(data.data != ""){
                    this.infoMeasure = data.data

                    this.infoDuration={
                        plan_frecuency_id:0,
                        code_duration:null,
                        max_value:0,
                    }
                }else{
                    this.infoMeasure = []
                }
            })
        },

        removeDuration(item){
            infomainten.plan(item,'frecuency','delete').then(data => {
                if(data.data != ""){
                    this.infoMeasure = data.data

                    this.infoDuration={
                        plan_frecuency_id:0,
                        code_duration:null,
                        max_value:0,
                    }
                }else{
                    this.infoMeasure = []
                }
            })
        },


        getActivities(){
            this.valueSelectedSupplier=''
            this.src = mainten+`partssearch/${this.infoMantenimiento.assets_id}/`

            infomainten.plan(this.infoMantenimiento.plan_id,'activities','select').then(data => {
                if(data.data != ""){
                    this.dataActivities = data.data

                    this.infoActivities={
                        plan_activities_id:0,
                        plan_activities_id:null,
                        is_planned:false,
                        description:''
                    }
                }else{
                    this.dataActivities = []
                }
            })
        },


        saveActivities(){
            this.infoActivities.plan_id = this.infoMantenimiento.plan_id
            this.infoProviders.is_planned = this.infoMantenimiento.state=='CR' 
            infomainten.plan(this.infoActivities,'activities',this.infoActivities.plan_activities_id == 0 || this.infoActivities.plan_activities_id == null ? 'insert':'update').then(data => {
                if(data.status == 200){
                    this.getActivities()

                    this.infoActivities={
                        plan_activities_id:0,
                        plan_activities_id:null,
                        is_planned:false,
                        description:''
                    }
                }else{
                    this.infoMeasure = []
                }
            })
        },

        deleteActivities(item, event){
            item.plan_id = this.infoMantenimiento.plan_id
            infomainten.plan(item,'activities',event).then(data => {
                if(data.status == 200){
                     this.getActivities()

                    this.infoActivities={
                        plan_activities_id:0,
                        plan_activities_id:null,
                        is_planned:false,
                        description:''
                    }
                }else{
                    // this.dataActivities = []
                }
            })
        },

        deletePersonal(row){
            infomainten.plan(row.plan_personal_id,'personal','delete').then(data => {
                this.getPersonl()
            })
        },


        changeStateEditValue(row){
            this.infoPersonal.realtime_hour = row.item.realtime_hour
            this.infoPersonal_2 = row.item
            for (let index = 0; index < this.modify_realtime_hour.length; index++) {
                const element = this.modify_realtime_hour[index];
                let key = Object.keys(element)[0]
                if(key != "id"+row.item.plan_personal_id){
                    this.modify_realtime_hour[index][key] = false
                }
                
            }
            this.modify_realtime_hour[row.index]["id"+row.item.plan_personal_id] = !this.modify_realtime_hour[row.index]["id"+row.item.plan_personal_id]
        },

        editValuePersonal(){
            this.infoPersonal_2.realtime_hour = this.infoPersonal.realtime_hour
            this.infoPersonal_2.plan_id = this.infoMantenimiento.plan_id

            infomainten.plan(this.infoPersonal_2,'personal',this.infoPersonal_2.plan_personal_id == 0 || this.infoPersonal_2.plan_personal_id == null ? 'insert':'update').then(data => {
                this.getPersonl()
            })
            
        },

        loadPersonalEdit(row){
            this.infoPersonal = row
            for (let index = 0; index < this.info_operator.length; index++) {
                const element = this.info_operator[index];
                if(element.personal_id==row.personal_id)
                    this.itemselected=element
            }
        },

        getPersonl(){
            infomainten.plan(this.infoMantenimiento.plan_id,'personal','select').then(data => {
                if(data.data != ""){
                    this.dataPersonal = data.data
                    this.modify_realtime_hour = []
                    for (let index = 0; index < this.dataPersonal.length; index++) {
                        let obj = {}
                        obj["id"+this.dataPersonal[index].plan_personal_id] = false;
                        this.modify_realtime_hour.push(obj)
                    }
                }else{
                    this.dataPersonal = []
                }
            })
        },


        savePersonl(){
            this.infoPersonal.plan_id = this.infoMantenimiento.plan_id
            this.infoPersonal.personal_id = this.itemselected.personal_id
            this.infoPersonal.is_planned  = this.infoMantenimiento.state=='CR' 
            this.infoPersonal.cost_per_hour = this.itemselected.salary
            this.infoPersonal.realtime_hour =0
            infomainten.plan(this.infoPersonal,'personal',this.infoPersonal.plan_personal_id == 0 || this.infoPersonal.plan_personal_id == null ? 'insert':'update').then(data => {
                this.getPersonl()
            })
        },

        deletePersonl(item){
            infomainten.plan(item,'personal','delete').then(data => {
                this.getPersonl()
            })
        },

        calcularPartes(){
            infomainten.plan(this.infoMantenimiento.plan_id,'parts','select-all-parts').then(data => {
                if(data.data != ""){
                    this.dataParts = data.data
                }else{
                    this.dataParts = []
                }
            })
        },

        changeStateEditValueSupplir(row){
            this.infoSupplier_2 = row.item
            this.infoProviders.realtime_hour = row.item.realtime_hour
            this.infoProviders.real_cost = (row.item.real_cost == null || row.item.real_cost == null )?0 :row.item.real_cost

            for (let index = 0; index < this.modify_realtime_hour.length; index++) {
                const element = this.modify_realtime_hour[index];
                let key = Object.keys(element)[0]
                if(key != "id"+row.item.plan_personal_id){
                    this.modify_realtime_hour[index][key] = false
                }
                
            }

            this.modify_realtime_hour_supplier[row.index]["idx"+row.item.plan_supplier_id] = !this.modify_realtime_hour_supplier[row.index]["idx"+row.item.plan_supplier_id]
        },

        editValueSupplier(){
            this.infoSupplier_2.real_cost = this.infoProviders.real_cost
            this.infoSupplier_2.realtime_hour = this.infoProviders.realtime_hour
            this.infoSupplier_2.plan_id = this.infoMantenimiento.plan_id

            infomainten.plan(this.infoSupplier_2,'supplier',this.infoSupplier_2.plan_supplier_id == 0 || this.infoSupplier_2.plan_supplier_id == null ? 'insert':'update').then(data => {
                this.getSupplier()
            })
            
        },

        loadSupplierEdit(row){
            this.infoProviders = row
            this.valueSelectedSupplier = row.supplier
        },


        getSupplier(){
            this.valueSelectedSupplier=''
            this.src = master+'suppliersearch/'

            infomainten.plan(this.infoMantenimiento.plan_id,'supplier','select').then(data => {
                if(data.data != ""){
                    this.dataSupplier = data.data

                    this.modify_realtime_hour_supplier = []
                    for (let index = 0; index < this.dataSupplier.length; index++) {
                        let obj = {}
                        obj["idx"+this.dataSupplier[index].plan_supplier_id] = false;
                        this.modify_realtime_hour_supplier.push(obj)
                    }

                }else{
                    this.dataSupplier = []
                }
            })

        },

        saveSupplier(){
            this.infoProviders.plan_id = this.infoMantenimiento.plan_id
            this.infoProviders.is_planned  = this.infoMantenimiento.state=='CR' 
            this.infoProviders.realtime_hour = 0
            this.showMessage=false
            infomainten.plan(this.infoProviders,'supplier',this.infoProviders.plan_supplier_id == 0 || this.infoProviders.plan_supplier_id == null ? 'insert':'update').then(data => {
                if(data.status == 200){
                    this.getSupplier()
                    this.infoProviders = {}
                    this.valueSelectedSupplier = ''
                    
                    this.showMessage=true
                    this.messageAlert='El registro se ha guardado exitosamente'
                    this.varianMessage='success'
                }
                else{
                    this.showMessage=true
                    this.messageAlert='Error al guardar registro, valide que todo este completo'
                    this.varianMessage='danger'
                }
            })
        },

        deleteSupplier(item){
            infomainten.plan(item,'supplier','delete').then(data => {
                this.getSupplier()
            })
        },

        calcularPartes(){
            infomainten.plan(this.infoMantenimiento.plan_id,'parts','select-all-parts').then(data => {
                if(data.data != ""){
                    this.dataParts = data.data
                }else{
                    this.dataParts = []
                }
            })
        }
    },

    created() {        
        this.src = master+'suppliersearch/'

        infomainten.loadoperators("select", "{}").then(data =>{
            this.info_operator=data.data
        })

        if(this.infoMantenimiento.costs == null){
            this.infoMantenimiento.costs=[]
        }

        
        this.loadDuration()
        this.getActivities()
    },
}
</script>

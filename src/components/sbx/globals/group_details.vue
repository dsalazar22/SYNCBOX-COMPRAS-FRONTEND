<template>
    <div>
        <notifications group="notifications-default" />
         <div class="row">
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
               <radial-gauge :value="indicadores.disponibilidad" :options="configGauge('Disponibilidad')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                  <radial-gauge :value="indicadores.eficiencia" :options="configGauge('Eficiencia')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                 <radial-gauge :value="indicadores.calidad" :options="configGauge('Calidad')"></radial-gauge>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center">
                 <radial-gauge :value="indicadores.oee" :options="configGauge('OEE')"></radial-gauge>
            </div>
        </div>  
        <div class="text-left mb-1">
             <div>
                <b-btn variant="outline-danger " v-if="check_access('stop_multiple','w')" size="sm" @click="prepare_group_stop();" ><i class="fas fa-stop"></i> Detener Múltiples Centros de Trabajo </b-btn>
                <b-btn variant="outline-success " v-if="check_access('start_multiple','w')"  size="sm" @click="prepare_group_start();"><i class="fas fa-play"></i> Iniciar Múltiples Centros de Trabajo </b-btn>
                <b-btn variant="outline-secondary " v-if="check_access('stop_multiple','w')" size="sm" @click="openAllOperators()" ><i class="fas fa-id-card"></i> Gestión de Personal </b-btn>
             </div>
        </div>
    
        <b-tabs class="nav-tabs-top nav-responsive-xl mt-4">
            <b-tab title="Centros de Trabajo" :active="true">
                <!-- <div class="d-flex justify-content-between">-->
                     <div class="text-right mt-1 mb-1 mr-3">
                        <b-btn size="sm" @click="visual_content='show-cards'" class="icon-btn borderless" :variant="visual_content=='show-cards' ? 'outline-dark' : 'outline-secondary'"><span class="ion ion-md-apps"></span></b-btn>
                        <b-btn size="sm" @click="visual_content='show-table'" class="icon-btn borderless" :variant="visual_content=='show-table' ? 'outline-dark' : 'outline-secondary'"><span class="ion ion-md-reorder"></span></b-btn>
                    </div>
                <!-- </div> -->

                <!-- <div class="row ml-1 mr-2" v-show="visual_content == 'show-table'">
                        <b-table striped hover :fields="field_items" :items="wsinfoTable">
                            <template v-slot:cell(wscode)="row">
                                <div>
                                    <span>
                                        <b-badge :variant="row.item.trade_status == 'available' ? 'success' : 'danger'" class="badge-dot" />
                                    </span>
                                    {{row.item.wscode}}
                                </div>
                            </template>
                            <template v-slot:cell(actions)="row">
                                <div>
                                    <b-btn size="sm" v-if=" (row.item.wsstatus == undefined || row.item.wsstatus == 'stopped') " @click="editProductionOrder(row.item.complete)" variant="outline-success icon-btn borderless"><span class="fas fa-play"></span></b-btn>
                                    <b-btn size="sm" v-if=" (row.item.wsstatus == 'running') " variant="outline-secondary icon-btn borderless" @click="open_manual_report(row.item.complete)"><span class="fas fa-hand-paper"></span></b-btn>
                                    <b-btn size="sm" v-if=" (row.item.wsstatus == 'running') " @click="openFinOrder(row.item.complete)" variant="outline-danger icon-btn borderless"><span class="fas fa-stop"></span></b-btn>
                                    <b-btn size="sm" v-if=" (row.item.wsstatus == undefined || row.item.wsstatus == 'stopped') " @click="openChangeState(row.item.complete)" variant="outline-info icon-btn borderless"><span class="fas fa-random"></span></b-btn>
                                    <b-btn size="sm" :id="row.item.wscode" variant="outline-secondary icon-btn borderless"><span class="ion ion-ios-more"></span></b-btn>
                                </div>
                            </template>
                        </b-table>
                </div> -->
                
                <div class="row ml-1 mr-2" v-show="visual_content == 'show-cards'">
                    <!-- <div > -->
                        <div v-for="itemws in wsinfo" class="col-sm-6 col-md-3 col-lg-3 col-xl-3">
                            <b-card no-body :class="'shadow mb-4 border border-'+getInfoContent(itemws.infocalculada,'StatusStateCurrentColor','info')" 
                            
                            :footer="getInfoContent(itemws.infocalculada,'StatusStateCurrentTitle','----')"
                            footer-tag="footer"
                            :footer-bg-variant="getInfoContent(itemws.infocalculada,'StatusStateCurrentColor','info')"
                            :footer-border-variant="getInfoContent(itemws.infocalculada,'StatusStateCurrentColor','info')"
                            footer-text-variant="white">
                                <div class="mt-2 ml-2 mb-2">
                                    <b-badge :variant="itemws.trade_status == 'available' ? 'success' : 'danger'" class="badge-dot" />
                                    <!-- <b-btn variant="primary btn-round icon-btn mr-1"> </b-btn> -->
                                    {{itemws.wscode}}
                                    
                                    <div class="text-muted small">{{ getInfoContent(itemws.infocalculada,'description',0) }} {{getInfoContent(itemws.infocalculada,'prod_description',0) }}</div>
                                    <div class="text-muted small"> # OP: {{ getInfoContent(itemws.infocalculada,'order_id',0) }} </div>
                                </div>
                                <hr class="m-0">
                                <!-- <b-card-body class="d-flex justify-content-between align-items-start pb-2"> -->
                                    <!-- <b-dropdown variant="default icon-btn borderless btn-round md-btn-flat hide-arrow" size="sm" :right="!isRTL">
                                    <template slot="button-content"><i class="ion ion-ios-more"></i></template>
                                    <b-dropdown-item href="javascript:void(0)">View</b-dropdown-item>
                                    <b-dropdown-item href="javascript:void(0)">Edit</b-dropdown-item>
                                    <b-dropdown-item href="javascript:void(0)">Remove</b-dropdown-item>
                                    </b-dropdown> -->
                                <!-- </b-card-body> -->

                                <div class="small mt-2">
                                    <strong class="ml-2">Completado {{getInfoContent(itemws.infocalculada,'percentage_complete',0)}}%</strong>  <div class="float-right mr-2"> {{ getInfoContent(itemws.infocalculada,'programmed',0) }} - {{getInfoContent(itemws.infocalculada,'totalProducido',0)}} = {{getInfoContent(itemws.infocalculada,'totalPendiente',0)}} </div>
                                </div>

                                <b-progress :variant=" infoColorsCurrenVelocity(getInfoContent(itemws.infocalculada,'percentage_complete',0)) " :value="getInfoContent(itemws.infocalculada,'percentage_complete',0)" height="3px" class="rounded-0" />
                                <div class="card-body small pt-2 pb-0">
                                </div>

                                <!-- <b-card-body class="pb-0">
                                </b-card-body> -->
                                

                                <div class="row mb-1">
                                    <div class="col text-center">
                                    <div class="text-muted small">Número de Ciclos</div>
                                        <div class="font-weight-bold">{{ getInfoContent(itemws.infocalculada,'nro_ciclos',0) }}</div>
                                    </div>
                                    <div class="col text-center">
                                        <div class="text-muted small">Defectuosas</div>
                                        <!-- completedPercent((itemws.PresetMinute*60)+(itemws.Preset01s/10.0), (itemws.LastCycleTimeMinutes*60)+(itemws.LastCycleTime01s/10.0)) -->
                                        <!-- <b-progress :value="0" height="3px" class="rounded-0" /> -->
                                        <div class="font-weight-bold">{{getInfoContent(itemws.infocalculada,'scrap_counter',0)}}</div>
                                        <div class="card-body small pt-2 pb-0">
                                            <!-- <strong>{{completedPercent(project.tasks, project.completedTasks)}}%</strong>  -->
                                        </div>
                                    </div>
                                </div>


                                <div class="row mb-1">
                                        <div class="col text-center">
                                        <div class="text-muted small">Tiempo de Trabajo</div>
                                            <div class="font-weight-bold">{{ getInfoContent(itemws.infocalculada,'tiempotrabajado',0) }}</div>
                                        </div>
                                        <div class="col text-center">
                                            <div class="text-muted small">Tiempo de Paro</div>
                                            <!-- completedPercent((itemws.PresetMinute*60)+(itemws.Preset01s/10.0), (itemws.LastCycleTimeMinutes*60)+(itemws.LastCycleTime01s/10.0)) -->
                                            <!-- <b-progress :value="0" height="3px" class="rounded-0" /> -->
                                            <div class="font-weight-bold">{{ getInfoContent(itemws.infocalculada,'stop_time',0) }}</div>
                                            <div class="card-body small pt-2 pb-0">
                                                <!-- <strong>{{completedPercent(project.tasks, project.completedTasks)}}%</strong>  -->
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row mb-2">
                                        <div class="col">
                                            <div class="text-muted small ml-2">
                                                Ciclo Actual
                                                <div class="float-right mr-2"> {{ getInfoContent(itemws.infocalculada,'percentage_current_cycle',0) }}% </div>
                                            </div>
                                            <b-progress :variant="infoColorsCurrenVelocity(getInfoContent(itemws.infocalculada,'percentage_current_cycle',0))" :value=" getInfoContent(itemws.infocalculada,'percentage_current_cycle',0) " height="3px" class="rounded-0" />
                                            <div class="font-weight-bold text-center">{{ getInfoContent(itemws.infocalculada,'tiempocicloactual',0) }}</div>
                                        </div>
                                        <div class="col">
                                            <div class="text-muted small ml-2">Velocidad<div class="float-right mr-2"> {{getInfoContent(itemws.infocalculada,'percentage_last_cycle',0)}}% </div></div>
                                            <b-progress :variant="infoColorsVelocity(getInfoContent(itemws.infocalculada,'percentage_last_cycle',0))" :value="getInfoContent(itemws.infocalculada,'percentage_last_cycle',0)" height="3px" class="rounded-0" />
                                            <div class="font-weight-bold text-center">{{getInfoContent(itemws.infocalculada,'tiempoultimociclo',0)}}</div>
                                            <div class="card-body small pt-2 pb-0">
                                                <!-- <strong>{{completedPercent(project.tasks, project.completedTasks)}}%</strong>  -->
                                            </div>
                                        </div>
                                    </div>

                                <!-- <b-card-body class="pt-0 text-center"> -->
                                    
                                

                                    

                                    <!-- <div class="row">

                                    <div class="col" v-bind:style="{ color: infoForeColorsOEE(itemws.disponibilidad)}">
                                                <div class="card border my-1" v-bind:style="{ 'background-color': infoBackgroudColorsOEE(itemws.disponibilidad)}">
                                                    <div class="small">Disponibilidad</div>
                                                    <div class="font-weight-bold">{{itemws.disponibilidad == undefined ? 0.0 :  itemws.disponibilidad}}%</div>
                                                </div>
                                        </div>
                                        <div class="col" v-bind:style="{ color: infoForeColorsOEE(itemws.eficiencia)}">
                                                <div class="card border my-1" v-bind:style="{ 'background-color': infoBackgroudColorsOEE(itemws.eficiencia)}">
                                                    <div class="small">Eficiencia</div>
                                                    <div class="font-weight-bold">{{ itemws.eficiencia == undefined ? 0.0 :  itemws.eficiencia}}%</div>
                                                </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col" v-bind:style="{ color: infoForeColorsOEE(itemws.calidad)}">
                                                <div class="card border my-1" v-bind:style="{ 'background-color': infoBackgroudColorsOEE(itemws.calidad)}">
                                                    <div class="small">Calidad</div>
                                                    <div class="font-weight-bold">{{itemws.calidad == undefined ? 0.0 :  itemws.calidad}}%</div>
                                                </div>
                                        </div>
                                        <div class="col" v-bind:style="{ color: infoForeColorsOEE(itemws.oee)}">
                                                <div class="card border my-1" v-bind:style="{ 'background-color': infoBackgroudColorsOEE(itemws.oee)}">
                                                    <div class="small">OEE</div>
                                                    <div class="font-weight-bold">{{itemws.oee == undefined ? 0.0 :  itemws.oee}}%</div>
                                                    
                                                </div>
                                        </div>
                                    </div> -->

                                
                                <!-- </b-card-body> -->
                                <div class="mb-2">
                                        <!-- <linear-gauge :value="getInfoContent(itemws.infocalculada,'disponibilidad',0)" :options="configGaugeL('Disponibilidad')"></linear-gauge>
                                            <linear-gauge :value="getInfoContent(itemws.infocalculada,'eficiencia',0)" :options="configGaugeL('Eficiencia')"></linear-gauge>
                                            <linear-gauge :value="getInfoContent(itemws.infocalculada,'calidad',0)" :options="configGaugeL('Calidad')"></linear-gauge>
                                            <linear-gauge :value="getInfoContent(itemws.infocalculada,'oee',0)" :options="configGaugeL('OEE')"></linear-gauge> -->
                                    <!-- <div class="d-flex"> -->
                                        <!-- <div> -->
                                            <div class="row">
                                                <div class="col">
                                                        <div class="small">
                                                            <strong class="ml-1">Disponibilidad </strong>  
                                                            <div class="float-right mr-1"> {{ getInfoContent(itemws.infocalculada,"disponibilidad",0) }}% </div>
                                                        </div>
                                                            
                                                        <b-progress :variant="infoColorsOEE(getInfoContent(itemws.infocalculada,'disponibilidad',0))"  :value="getInfoContent(itemws.infocalculada,'disponibilidad',0)" height="10px" class="rounded-0" />
                                                    </div>
                                                    <div class="col">
                                                        <div class="small">
                                                            <strong class="ml-1">Eficiencia </strong>  
                                                            <div class="float-right mr-1"> {{ getInfoContent(itemws.infocalculada,'eficiencia',0) }}% </div>
                                                        </div>

                                                        <b-progress :variant="infoColorsOEE(getInfoContent(itemws.infocalculada,'eficiencia',0))"  :value="getInfoContent(itemws.infocalculada,'eficiencia',0)" height="10px" class="rounded-0" />
                                                    </div>
                                            </div>

                                            <div class="row mt-2">
                                                <div class="col">
                                                        <div class="small">
                                                            <strong class="ml-1">Calidad </strong>  
                                                            <div class="float-right mr-1"> {{getInfoContent(itemws.infocalculada,'calidad',0)}}% </div>
                                                        </div>

                                                        <b-progress :variant="infoColorsOEE(getInfoContent(itemws.infocalculada,'calidad',0))"  :value="getInfoContent(itemws.infocalculada,'calidad',0)" height="10px" class="rounded-0" />
                                                    </div>
                                                    <div class="col">
                                                        <div class="small">
                                                            <strong class="ml-1">OEE </strong>  
                                                            <div class="float-right mr-1"> {{getInfoContent(itemws.infocalculada,'oee',0)}}% </div>
                                                        </div>

                                                        <b-progress :variant="infoColorsOEE(getInfoContent(itemws.infocalculada,'oee',0))" :value="getInfoContent(itemws.infocalculada,'oee',0)" height="10px" class="rounded-0" />
                                                    </div>
                                            </div> 
                                        <!-- </div> -->
                                        <!-- <div>
                                            <apexchart width="150" type="bar" :options="options" :series="series"></apexchart>
                                        </div> -->
                                    <!-- </div> -->
                                </div>
                                <!-- <apexchart type="radialBar" :options="chartOptions" :series="series"></apexchart> -->
                                <hr class="m-0">

                                <!-- <b-card-body class="py-3 text-center"> -->
                                    <!-- <div class="text-muted small mb-2">Team</div> -->
                                    <!-- <div class="d-flex flex-wrap">
                                    <a v-for="member in project.team" href="javascript:void(0)" class="d-block mr-1 mb-1"><img :src="`/static/img/avatars/${member.avatar}`" alt="" class="ui-w-30 rounded-circle"></a>
                                    </div> -->
                                    <!-- <b-btn variant="outline-primary icon-btn btn-xl borderless"><span class="far fa-paper-plane"></span></b-btn> -->
                                    <!-- <div class="d-flex justify-content-between"> -->
                                        <div class="mt-2 mb-2 ml-2">
                                            <b-btn size="sm" v-if="(itemws['mods'][0] == undefined || itemws['mods'][0] == 1) && ((check_access('start_order','w') && (itemws.wsstatus == 'stopped'  || itemws.wsstatus == undefined))) " @click="editProductionOrder(itemws)" variant="outline-success icon-btn borderless"><span class="fas fa-play"></span></b-btn>
                                            <b-btn size="sm" v-if="(itemws['mods'][0] == undefined || itemws['mods'][0] == 1) && ((check_access('stop_order','w') &&  (itemws.wsstatus == 'running'))) " @click="openFinOrder(itemws)" variant="outline-danger icon-btn borderless"><span class="fas fa-stop"></span></b-btn>
                                            <b-btn size="sm" v-if="(itemws['mods'][0] == undefined || itemws['mods'][0] == 1) && ((check_access('report_unities','w') && (itemws.wsstatus == 'running'))) " variant="outline-secondary icon-btn borderless" @click="open_manual_report(itemws)"><span class="fas fa-hand-paper"></span></b-btn>
                                            <b-btn size="sm" v-if="(itemws['mods'][0] == undefined || itemws['mods'][0] == 1) && ((check_access('change_state_workstation','w') && (itemws.wsstatus == 'stopped'  || itemws.wsstatus == undefined))) " @click="openChangeState(itemws)" variant="outline-info icon-btn borderless"><span class="fas fa-random"></span></b-btn>
                                            <b-btn size="sm" v-if="(itemws['mods'][1] == undefined || itemws['mods'][1] == 1)" @click="openOperators(itemws)" variant="outline-success icon-btn borderless"><span class="badge badge-light">{{itemws.operators == undefined ? 0 : itemws.operators}}</span> </b-btn>
                                            <b-btn size="sm" v-if="(itemws['mods'][2] == 1) && (check_access('change_state_workstation','w')) " @click="openSendProductionOrder(itemws)" variant="outline-info icon-btn borderless"><span class="fas fa-map-marker"></span></b-btn>
                                            <b-btn size="sm" v-if="(itemws['mods'][0] == undefined || itemws['mods'][0] == 1) && (check_access('edit_control_vars','w')) " @click="openVarsControl(itemws)" variant="outline-danger icon-btn borderless"><span class="fas fa-asterisk"></span></b-btn>

                                            <!-- <b-btn size="sm" @click="openMessageContent(itemws)" variant="outline-info icon-btn borderless"><span class="fas fa-comments"></span></b-btn> -->
                                            <b-link size="sm" variant="outline-secondary icon-btn borderless" :to="getRoute(itemws.wscode)"><span class="ion ion-ios-more"></span></b-link>
                                        </div>
                                        <!-- <div class="mt-2 mr-2">
                                            <b-badge class="align-text-bottom" :variant="getInfoContent(itemws.infocalculada,'StatusStateCurrentColor','info')">{{getInfoContent(itemws.infocalculada,'StatusStateCurrentTitle','----')}}</b-badge>
                                        </div> -->
                                    <!-- </div>  -->
                                    <!--<b-btn size="sm" variant="outline-warning icon-btn btn-xs borderless"><span class="ion ion-md-bulb"></span></b-btn> -->
                                <!-- </b-card-body> -->
<!-- 
                                <template v-slot:footer>
                                    <div class="danger">
                                        <em>Footer Slot</em>
                                    </div>
                                    
                                </template> -->

                            </b-card>

                             <b-popover
                                :target="itemws.wscode"
                                triggers="click"
                                placement="auto"
                                ref="popover">
                                <template slot="title">
                                    <div>
                                        <b-badge :variant="itemws.trade_status == 'available' ? 'success' : 'danger'" class="badge-dot" />
                                        <!-- <b-btn variant="primary btn-round icon-btn mr-1"> </b-btn> -->
                                        {{itemws.wscode}}
                                    </div>
                                </template>
                                    <div>
                                        <div class="text-muted small">{{ getInfoContent(itemws.infocalculada,'description',0) }} {{getInfoContent(itemws.infocalculada,'prod_description',0) }}</div>
                                        <div class="text-muted small"> # OP: {{ getInfoContent(itemws.infocalculada,'order_id',0) }} </div>
                                    </div>

                                        <hr class="m-0">

                                        <div class="small mt-2">
                                            <strong class="ml-2">Completado {{getInfoContent(itemws.infocalculada,'percentage_complete',0)}}%</strong>  <div class="float-right mr-2"> {{ getInfoContent(itemws.infocalculada,'programmed',0) }} - {{getInfoContent(itemws.infocalculada,'totalProducido',0)}} = {{getInfoContent(itemws.infocalculada,'totalPendiente',0)}} </div>
                                        </div>

                                        <b-progress :variant=" infoColorsCurrenVelocity(getInfoContent(itemws.infocalculada,'percentage_complete',0)) " :value="getInfoContent(itemws.infocalculada,'percentage_complete',0)" height="3px" class="rounded-0" />
                                        <div class="card-body small pt-2 pb-0">
                                        </div>

                                        <!-- <b-card-body class="pb-0">
                                        </b-card-body> -->
                                        

                                        <div class="row mb-1">
                                                <div class="col text-center">
                                                <div class="text-muted small">Número de Ciclos</div>
                                                    <div class="font-weight-bold">{{ getInfoContent(itemws.infocalculada,'nro_ciclos',0) }}</div>
                                                </div>
                                                <div class="col text-center">
                                                    <div class="text-muted small">Defectuosas</div>
                                                    <!-- completedPercent((itemws.PresetMinute*60)+(itemws.Preset01s/10.0), (itemws.LastCycleTimeMinutes*60)+(itemws.LastCycleTime01s/10.0)) -->
                                                    <!-- <b-progress :value="0" height="3px" class="rounded-0" /> -->
                                                    <div class="font-weight-bold">{{getInfoContent(itemws.infocalculada,'scrap_counter',0)}}</div>
                                                    <div class="card-body small pt-2 pb-0">
                                                        <!-- <strong>{{completedPercent(project.tasks, project.completedTasks)}}%</strong>  -->
                                                    </div>
                                                </div>
                                            </div>


                                        <div class="row mb-1">
                                                <div class="col text-center">
                                                <div class="text-muted small">Tiempo de Trabajo</div>
                                                    <div class="font-weight-bold">{{ getInfoContent(itemws.infocalculada,'tiempotrabajado',0) }}</div>
                                                </div>
                                                <div class="col text-center">
                                                    <div class="text-muted small">Tiempo de Paro</div>
                                                    <!-- completedPercent((itemws.PresetMinute*60)+(itemws.Preset01s/10.0), (itemws.LastCycleTimeMinutes*60)+(itemws.LastCycleTime01s/10.0)) -->
                                                    <!-- <b-progress :value="0" height="3px" class="rounded-0" /> -->
                                                    <div class="font-weight-bold">{{ getInfoContent(itemws.infocalculada,'stop_time',0) }}</div>
                                                    <div class="card-body small pt-2 pb-0">
                                                        <!-- <strong>{{completedPercent(project.tasks, project.completedTasks)}}%</strong>  -->
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="row mb-2">
                                                <div class="col">
                                                    <div class="text-muted small ml-2">
                                                        Ciclo Actual
                                                        <div class="float-right mr-2"> {{ getInfoContent(itemws.infocalculada,'percentage_current_cycle',0) }}% </div>
                                                    </div>
                                                    <b-progress :variant="infoColorsCurrenVelocity(getInfoContent(itemws.infocalculada,'percentage_current_cycle',0))" :value=" getInfoContent(itemws.infocalculada,'percentage_current_cycle',0) " height="3px" class="rounded-0" />
                                                    <div class="font-weight-bold text-center">{{ getInfoContent(itemws.infocalculada,'tiempocicloactual',0) }}</div>
                                                </div>
                                                <div class="col">
                                                    <div class="text-muted small ml-2">Velocidad<div class="float-right mr-2"> {{getInfoContent(itemws.infocalculada,'percentage_last_cycle',0)}}% </div></div>
                                                    <b-progress :variant="infoColorsVelocity(getInfoContent(itemws.infocalculada,'percentage_last_cycle',0))" :value="getInfoContent(itemws.infocalculada,'percentage_last_cycle',0)" height="3px" class="rounded-0" />
                                                    <div class="font-weight-bold text-center">{{getInfoContent(itemws.infocalculada,'tiempoultimociclo',0)}}</div>
                                                    <div class="card-body small pt-2 pb-0">
                                                        <!-- <strong>{{completedPercent(project.tasks, project.completedTasks)}}%</strong>  -->
                                                    </div>
                                                </div>
                                            </div>
                                        <div class="mb-2">
                                                    <div class="row">
                                                        <div class="col">
                                                                <div class="small">
                                                                    <strong class="ml-1">Disponibilidad </strong>  
                                                                    <div class="float-right mr-1"> {{ getInfoContent(itemws.infocalculada,"disponibilidad",0) }}% </div>
                                                                </div>
                                                                    
                                                                <b-progress :variant="infoColorsOEE(getInfoContent(itemws.infocalculada,'disponibilidad',0))"  :value="getInfoContent(itemws.infocalculada,'disponibilidad',0)" height="10px" class="rounded-0" />
                                                            </div>
                                                            <div class="col">
                                                                <div class="small">
                                                                    <strong class="ml-1">Eficiencia </strong>  
                                                                    <div class="float-right mr-1"> {{ getInfoContent(itemws.infocalculada,'eficiencia',0) }}% </div>
                                                                </div>

                                                                <b-progress :variant="infoColorsOEE(getInfoContent(itemws.infocalculada,'eficiencia',0))"  :value="getInfoContent(itemws.infocalculada,'eficiencia',0)" height="10px" class="rounded-0" />
                                                            </div>
                                                    </div>

                                                    <div class="row mt-2">
                                                        <div class="col">
                                                                <div class="small">
                                                                    <strong class="ml-1">Calidad </strong>  
                                                                    <div class="float-right mr-1"> {{getInfoContent(itemws.infocalculada,'calidad',0)}}% </div>
                                                                </div>

                                                                <b-progress :variant="infoColorsOEE(getInfoContent(itemws.infocalculada,'calidad',0))"  :value="getInfoContent(itemws.infocalculada,'calidad',0)" height="10px" class="rounded-0" />
                                                            </div>
                                                            <div class="col">
                                                                <div class="small">
                                                                    <strong class="ml-1">OEE </strong>  
                                                                    <div class="float-right mr-1"> {{getInfoContent(itemws.infocalculada,'oee',0)}}% </div>
                                                                </div>

                                                                <b-progress :variant="infoColorsOEE(getInfoContent(itemws.infocalculada,'oee',0))" :value="getInfoContent(itemws.infocalculada,'oee',0)" height="10px" class="rounded-0" />
                                                            </div>
                                                    </div> 
                                                <!-- </div> -->
                                                <!-- <div>
                                                    <apexchart width="150" type="bar" :options="options" :series="series"></apexchart>
                                                </div> -->
                                            <!-- </div> -->
                                        </div>
                                        <!-- <apexchart type="radialBar" :options="chartOptions" :series="series"></apexchart> -->
                                        <hr class="m-0">

                                        <!-- <b-card-body class="py-3 text-center"> -->
                                            <!-- <div class="text-muted small mb-2">Team</div> -->
                                            <!-- <div class="d-flex flex-wrap">
                                            <a v-for="member in project.team" href="javascript:void(0)" class="d-block mr-1 mb-1"><img :src="`/static/img/avatars/${member.avatar}`" alt="" class="ui-w-30 rounded-circle"></a>
                                            </div> -->
                                            <!-- <b-btn variant="outline-primary icon-btn btn-xl borderless"><span class="far fa-paper-plane"></span></b-btn> -->
                                            <div class="d-flex justify-content-between">
                                                <div class="mt-2 mb-2 ml-2">
                                                    <!-- <b-btn size="sm" v-if=" (itemws.wsstatus == 'stopped'  || itemws.wsstatus == undefined) " @click="editProductionOrder(itemws)" variant="outline-success icon-btn borderless"><span class="fas fa-play"></span></b-btn>
                                                    <b-btn size="sm" v-if=" (itemws.wsstatus == 'running') " @click="openFinOrder(itemws)" variant="outline-danger icon-btn borderless"><span class="fas fa-stop"></span></b-btn>
                                                    <b-btn size="sm" v-if=" (itemws.wsstatus == 'stopped'  || itemws.wsstatus == undefined) " @click="openChangeState(itemws)" variant="outline-info icon-btn borderless"><span class="fas fa-random"></span></b-btn> -->
                                                    <b-link size="sm" variant="outline-secondary icon-btn borderless" :to="getRoute(itemws.wscode)"><span class="ion ion-ios-more"></span></b-link>
                                                </div>
                                                <div class="mt-2 mr-2">
                                                    <b-badge class="align-text-bottom" :variant="getInfoContent(itemws.infocalculada,'StatusStateCurrentColor','info')">{{getInfoContent(itemws.infocalculada,'StatusStateCurrentTitle','----')}}</b-badge>
                                                </div>
                                            </div>
                            </b-popover>
                        </div>
                    <!-- </div> -->
                </div>

            </b-tab>
            <b-tab title="Estadística">
                 <b-card no-body class="mb-0 mt-0">
                    <b-card-header header-tag="h6" class="with-elements">
                         <div class="card-header-title">Estadística</div>
                         <div class="card-header-elements ml-auto">
                             <div class="d-flex justify-content-end mb-1">
                                 <b-nav tabs class="nav-sm tabs-alt mr-2 ml-2">
                                     <b-nav-item :active="seleccion == 'paros'" @click="seleccionPestana('paros')">Tiempos de Paro</b-nav-item>
                                     <b-nav-item :active="seleccion == 'ttotales'" @click="seleccionPestana('ttotales')">Tiempos Totales</b-nav-item>
                                     <b-nav-item :active="seleccion == 'undtotales'" @click="seleccionPestana('undtotales')">Unidades Totales</b-nav-item>
                                     <b-nav-item :active="seleccion == 'ord_prod'" @click="seleccionPestana('ord_prod')">Productos</b-nav-item>
                                     <!-- <b-nav-item >Total Productos</b-nav-item> -->
                                     <b-nav-item :active="seleccion == 'oee'" @click="seleccionPestana('oee')">OEE</b-nav-item>
                                     <!-- <b-nav-item >Timeline</b-nav-item> -->
                                 </b-nav>
                             </div>
                         <!-- <label class="text m-0">
                             <span class="text-light text-tiny font-weight-semibold align-middle">
                             SHOW STATS
                             </span>
                             <span class="switcher switcher-sm d-inline-block align-middle mr-0 ml-2">
                             <input type="checkbox" class="switcher-input" checked>
                             <span class="switcher-indicator">
                                 <span class="switcher-yes"></span>
                                 <span class="switcher-no"></span>
                             </span>
                             </span>
                         </label> -->
                         </div>
                    </b-card-header>
                    <div class="row mt-2">
                        <div class="col-md-1"></div>
                            <div class="col-md-4">
                                    <flat-pickr v-model="startDate" :config="datetimeConfig" :placeholder="'Fecha Inicial'" />
                            </div>
                            <div class="col-md-4">
                                    <flat-pickr v-model="finishDate" :config="datetimeConfig" :placeholder="'Fecha Final'" />
                            </div>
                        <div class="col-md-3">
                            <button type="button" class="btn btn-success" v-on:click="cargarDatos('')">Consultar</button>
                                <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
                        </div>
                    </div>
                    <chartspie ref="stoptimes" class="m-2"/>
                </b-card>
            </b-tab>

            <b-tab title="Tambor">
                <drump class="ml-2 mr-2 mt-2" :id_plant="$route.params['idfloor']" :code_group="$route.params['codegroup']"></drump>
            </b-tab>

            <b-tab title="Resumen">
                <div v-html="resumen_content"></div>
            </b-tab>

        </b-tabs>

        <!-- <b-modal id="modals-top" v-model="showEditForm"  class="modal-center" size="lg"> -->
        <sweet-modal ref="showEditForm" title="Control Ordenes de Producción" width="90%">
            <!-- <div slot="modal-title">
                Iniciar <span class="font-weight-light">Ordenes de Producción</span><br>
            </div> -->
                <div class="h4 text-center">{{selected_item.wscode}}</div>

                <!-- <perfect-scrollbar style="height: 500px; width:100%"> -->
                    <orders ref="open_orders" style="width:98%"/>
                <!-- </perfect-scrollbar> -->

                <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="closeProductionOrder()">Cerrar</b-btn>
            </div>
        </sweet-modal>
        <!-- </b-modal> -->

        <sweet-modal ref="showStopOrders" title="Asignar Razones de Paro" width="90%">
            <!-- <div slot="modal-title">
                Finalizar <span class="font-weight-light">Ordenes de Producción</span><br>
            </div> -->

            <div class="h4 text-center">{{selected_item.wscode}}</div>

            <!-- <perfect-scrollbar style="height: 500px; width:100%"> -->
                <stoporders ref="stop_orders" style="width:98%"/>
            <!-- </perfect-scrollbar> -->

             <div slot="modal-footer" class="w-100 text-right">
                <!-- <b-btn variant="primary" @click="closeFinOrder()">Cerrar</b-btn> -->
            </div>
            
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="closeStopOrder()">Cerrar</b-btn>
            </div>
        </sweet-modal>

        <sweet-modal ref="showOperators" title="Registros de Operarios" width="90%">
            <!-- <div slot="modal-title">
                Registro <span class="font-weight-light">Operarios</span><br>
            </div> -->

            <div class="h4 text-center">{{selected_item.wscode}}</div>

            <!-- <perfect-scrollbar style="height: 500px; width:100%"> -->
                <operatorsregister ref="operators_register" style="width:98%"/>
            <!-- </perfect-scrollbar> -->

             <div slot="modal-footer" class="w-100 text-right">
                <!-- <b-btn variant="primary" @click="closeFinOrder()">Cerrar</b-btn> -->
            </div>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="closeOperators()">Cerrar</b-btn>
            </div>
        </sweet-modal>
        

            <sweet-modal ref="manual_report" width="90%">

                <div class="h2 text-center">{{selected_ws_to_report['wscode']}}</div>
                
                <mreport ref="mreport"></mreport>
                    <!-- <div slot="modal-footer" class="w-100 text-right"> -->
                    <!-- </div> -->
            </sweet-modal>

        <!-- <b-modal id="modals-top" v-model="showFinOrdersGroupal"  class="modal-center" size="lg"> -->
            
            <sweet-modal ref="showFinOrdersGroupal" width="90%">

            <div slot="modal-title">
                Finalizar <span class="font-weight-light">Ordenes de Producción</span><br>
            </div>

            <div class="h4 text-center">{{selected_item.wscode}}</div>

            <div class="text-left">
              <b-form-group label="Seleccione los Centros de Trabajo a Finalizar">
                    <b-form-checkbox
                        v-for="option in optionsToStop"
                        v-model="selectedToStop"
                        :key="option.value"
                        :value="option.value"
                        name="flavour-3a">
                    {{ option.text }}
                    </b-form-checkbox>
                </b-form-group>
            </div>
            
            <!-- {{wsinfoTable}} -->


            <!-- <perfect-scrollbar style="height: 500px; width:100%"> -->
                <stoporders ref="stop_orders_groups" style="width:98%"/>
            <!-- </perfect-scrollbar> -->

            <div class="w-100 text-right mt-2">
                <b-button variant="danger" @click="selected_ws_to_stop()" v-if="button_action">Finalizar Orden de Producción</b-button>
                <!-- <b-button variant="success">Button</b-button> -->
            </div>

             <div slot="modal-footer" class="w-100 text-right">
                <!-- <b-btn variant="primary" @click="closeFinOrder()">Cerrar</b-btn> -->
            </div>
        <!-- </b-modal> -->
            </sweet-modal>


        <b-modal id="modals-top" v-model="messageContent"  class="modal-center" size="xl"> 
            <b-row>
                <b-col sm="6">
                    <b-form-textarea
                        id="textarea-auto-height"
                        placeholder="Auto height textarea"
                        rows="3"
                        max-rows="50"
                        v-model="content"
                    ></b-form-textarea>
                </b-col>

                <b-col sm="6">
                    <markdown-it-vue class="md-body" :content="content" />
                </b-col>
        </b-row>
         
            
        </b-modal>

          <div>
  </div>

        <b-modal id="modals-top" v-model="varscontroller"  class="modal-center" size="lg">
            <div slot="modal-title">
                Centro Trabajo <span class="font-weight-light">Control Variables</span><br>
            </div>

            <div class="h2 text-center">{{selected_item_control_vars.wscode}}</div>
            <div class="text-center text-danger">
                <h3>¡Atención!</h3> 
                En esta ventana usted puede generar cambios que alterarán el funcionamiento de la operación y los valores en tiempo real, si no esta seguro de lo que va a ejecutar, por favor no toque nada.
            </div>
            <!-- {{selected_item_control_vars.control_vars_json}} -->
            <div> 

                <table class="table table-sm mt-3">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Variable</th>
                            <th scope="col">Valor Actual</th>
                            <th scope="col">Nuevo Valor</th>
                        </tr>
                    </thead>
                    <tbody  v-for="(item,ix) of control_vars_json">
                        <tr>
                            <th scope="row">{{ix}}</th>
                            <td>{{ item.NombreVariable }} </td>
                            <td>{{ item.Value }}</td>
                            <td> 
                                  <b-input-group
                                        size="sm"
                                        prepend="Nuevo Valor a Enviar">
                                        <b-form-input v-model="selected_item_control_vars[ix]"></b-form-input>
                                        <b-input-group-append>
                                            <b-button size="sm" text="Button" variant="success" @click="send_new_value(item,ix)">Enviar</b-button>
                                        </b-input-group-append>
                                    </b-input-group>
                            </td>
                        </tr>
                    </tbody>
                </table>
         
                </div>
            
            <div slot="modal-footer" class="w-100 text-right">
                <!-- <b-btn variant="primary" @click="closeFinOrder()">Cerrar</b-btn> -->
            </div>
        </b-modal>
    </div>
</template>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import Vue from 'vue'

import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component'

import Notifications from 'vue-notification'
import VueMarkdown from 'vue-markdown'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
  
import { realtime } from '@/vendor/sbx/sbx-realtime/realtime'
import LinearGauge from 'vue-canvas-gauges/src/LinearGauge'
import RadialGauge from 'vue-canvas-gauges/src/RadialGauge'
// import VueApexCharts from 'vue-apexcharts'

import stoporders from './stop_orders'
import orders from './operation_orders'
import operatorsregister from './operators_register'

import chartspie from './charts/charts_pie'
import drump from '@/components/sbx/production/drump.vue'
import mreport from '@/components/sbx/production/reports/manual_reports'
import {infousers} from '@/components/i40/js/users'

import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'

import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

Vue.use(Notifications)

function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
    name: 'sbx-glb-realtime',
    metaInfo: {
        title: 'Real Time'
    },

    components:{
        MarkdownItVue,
        stoporders,
        drump,
        mreport,
        LinearGauge,
        RadialGauge,
        orders,
        operatorsregister,
        chartspie,
        Datepicker, 
        flatPickr,
        SweetModal,
        SweetModalTab,
    },

    data: () => ({
        content: '',
        messageContent:false,

        varscontroller:false,
        selected_ws_to_report:{},

        order_global_selected:false,
        // showFinOrdersGroupal: false,
        showEditFormStartGroup:false,
        // showOperators:false,
        field_items:[],

        wsinfo :{},
        wsinfoTable :[],

        indicadores:{
            disponibilidad:0,
            eficiencia:0,
            calidad:0,
            oee:0.0
        },

        startDate:null,
        finishDate:null,
        
        manual_report: false,

        // showEditForm:false,
        showFinOrders:false,
        wscode:'',
        datetimeConfig: {
            dateFormat: 'Y-m-d H:i',
            enableTime: true,
            altInput: true,
            animate: !isRTL()
        },
        
        seleccion:'paros',

        visual_content:'show-cards',
        popoverShow:false,

        selectedToStop: [], // Must be an array reference!
        optionsToStop: [],
        button_action:false,

        resumen_content:"",
        selected_item:{},
        selected_item_control_vars:{},
        control_vars_json:[],

        options: {
  markdownIt: {
    linkify: true
  },
  linkAttributes: {
    attrs: {
      target: '_blank',
      rel: 'noopener'
    }
  },
  katex: {
    throwOnError: false,
    errorColor: '#cc0000'
  },
  icons: 'font-awesome',
  githubToc: {
    tocFirstLevel: 2,
    tocLastLevel: 3,
    tocClassName: 'toc',
    anchorLinkSymbol: '',
    anchorLinkSpace: false,
    anchorClassName: 'anchor',
    anchorLinkSymbolClassName: 'octicon octicon-link'
  }
}

    }),
    methods: {

        send_new_value(item,ix){
            if(item.DB == "plc"){
                realtime.apirunset("2", "w:"+item.NombreVariable+":"+this.selected_item_control_vars.wscode.split(' ').join('-'), this.selected_item_control_vars[ix]).then(data => {
                    // console.log(data)
                })
            }else{
                realtime.sendredis("0", "ws:realtime:"+this.selected_item_control_vars.wscode, item.NombreVariable, this.selected_item_control_vars[ix], ).then(data => {
                    // console.log(data)
                })
            }
        },

        closeStopOrder(){
            // this.showEditForm=false
            this.$refs.showStopOrders.close()
        },

        closeOperators(){
            // this.showEditForm=false
            this.$refs.showOperators.close()
        },

        openAllOperators(){
            this.selected_item.wscode=""
            this.$refs.showOperators.open()
            this.$refs.operators_register.load_all_operators()
        },

        openMessageContent(item){

            this.content =''

             this.messageContent = true
        },

        openOperators(item){

            this.$refs.showOperators.open()
            // this.$refs.stop_orders.getParos(item, 'stop')
            this.$refs.operators_register.loadinfo(item)
            this.selected_item = item
            // this.showOperators = true
        },

        check_access(control, action){
            return infousers.check_access(control,action)
        },

        prepare_group_stop(){
            this.button_action=true
            // this.showFinOrdersGroupal=true

            this.selectedToStop = []
            this.optionsToStop = []
            for (let index = 0; index < this.wsinfoTable.length; index++) {
                const element = this.wsinfoTable[index];

                if(index == 0){
                    this.$refs.stop_orders_groups.getParosContent(element.complete, 'stop')
                }

                if(element.order_id != 0){
                    this.optionsToStop.push({
                        text: element.wscode,
                        value: element.wscode,
                    })
                }
            }

            this.$refs.showFinOrdersGroupal.open()
        },

        prepare_group_start(){
            this.button_action=true
            // this.showEditForm=true
            this.$refs.showEditForm.open()
            this.selectedToStop = []
            this.optionsToStop = []
            
            for (let index = 0; index < this.wsinfoTable.length; index++) {
                const element = this.wsinfoTable[index];
                
                if(element.order_id == 0){
                    this.optionsToStop.push({
                        text: element.wscode,
                        value: element.wscode,
                    })
                }
            }

            this.$refs.open_orders.abrirOrdenesPerGroups(this.optionsToStop)
        },

        selected_ws_to_stop(){
            this.button_action=false
            var selected = []

            for (let index = 0; index < this.selectedToStop.length; index++) {
                const element = this.selectedToStop[index];
                for (let wsindex = 0; wsindex < this.wsinfoTable.length; wsindex++) {
                    const wselement = this.wsinfoTable[wsindex];
                    if(wselement.wscode == element){
                        selected.push(wselement.complete)
                    }
                }
            }
            this.$refs.stop_orders_groups.getStopMultiple(selected, 'stop')
        },
        open_manual_report(prop1){
            this.selected_ws_to_report = prop1
            this.$refs.mreport.getInfo(prop1)
            this.$refs.manual_report.open() 
            // this.manual_report = true
        },

        openVarsControl(param){
            this.selected_item_control_vars = param
            this.selected_item_control_vars["json_vars"] = JSON.parse(param["control_vars"])
            this.varscontroller = true
        },
        
        get_info_realtime(param){
            let value =  document.getElementById(param)
            return value
        },
        
        completedPercent (tasks, completed) {
            if(tasks == 0)
                return 0
            return Math.round((completed / tasks) * 100)
        },

        configGauge(title){
                return {
                        minValue: 0,
                        // startAngle: 90,
                        // ticksAngle: 180,
                        colorPlate: "#f7f7f7",
                        borderShadowWidth: 0,
                        borders: false,
                        needleType: "arrow",
                        needleWidth: 2,
                        needleCircleSize: 5,
                        needleCircleOuter: false,
                        needleCircleInner: true,
                        animationDuration: 500,
                        animationRule: "linear",
                        units: title,
                        valueBox: true,
                        maxValue: 100,

                        valueTextShadow: false,
                        valueDec: 2,
                        barBeginCircle: 0,
                        fontNumbersSize: 24,
                        fontUnitsSize: 25,
                        fontValueSize: 30,
                        majorTicks: [
                            "0",
                            "10",
                            "20",
                            "30",
                            "40",
                            "50",
                            "60",
                            "70",
                            "80",
                            "90",
                            "100",
                        ],
                        width: 200,
                        height: 200,
                        minorTicks: 5,
                        strokeTicks: true,
                            highlights: [
                                {
                                    "from": 50,
                                    "to": 65,
                                    "color": "#d93749"
                                },
                                {
                                    "from": 65,
                                    "to": 75,
                                    "color": "#FF8C00"
                                },
                                {
                                    "from": 75,
                                    "to": 85,
                                    "color": "#FFD700"
                                },
                                {
                                    "from": 85,
                                    "to": 95,
                                    "color": "#40a070"
                                },
                                {
                                    "from": 95,
                                    "to": 100,
                                    "color": "#00C5CD"
                                }
                            ],
                    }
        
        },

        infoColorsOEE(value){
            return realtime.infoColorsOEE(value)
        },

        infoColorsVelocity(value){
            return realtime.infoColorsVelocity(value)
        },

        infoColorsCurrenVelocity(value){
            return realtime.infoColorsCurrenVelocity(value)
        },

        getContent(){

            try{
                let group= this.$route.params['idgroup']
                let plant=this.$route.params['idfloor']

                realtime.infoContentOEE(plant, group).then(data => {
                    if(data.status == 200){
                        // console.log(data.data)
                        if(data.data != "" && data.data != null && data.data != undefined){
                            this.wsinfo = data.data
                            
                            let prepareslice= []

                            for (let index = 0; index < this.wsinfo.length; index++) {
                                const element = this.wsinfo[index];
                                if(this.selected_item_control_vars.wscode == element.wscode){
                                    if(this.selected_item_control_vars["control_vars"] != undefined)
                                        this.control_vars_json = JSON.parse(element["control_vars"])
                                }
                                if(element.infocalculada != undefined){
                                    // console.log(element.infocalculada)
                                    let value =  JSON.parse(element.infocalculada)
                                    value["trade_status"] = element.trade_status
                                    value["wscode"] = element.wscode
                                    value["wsstatus"] = element.wsstatus
                                    value["complete"] = element
                                    
                                    if(element.mods == undefined){
                                        this.wsinfo[index]["mods"] = "1100000"
                                    }
                                    prepareslice.push(value)
                                }else {
                                    prepareslice.push(element)
                                }
                            }

                            if(prepareslice.length>0){
                                this.wsinfoTable = JSON.parse(JSON.stringify(prepareslice))
                            }
                        }
                    }
                })

                realtime.getOEEGroup(plant, group).then(data => {
                    // console.log(data.data)
                    if(data.status == 200){
                        this.indicadores = data.data[0]
                        // this.indicadores = data.data[0].content_general[0]
                        // this.tableData =  data.data[0].content_resources
                    }
                })

                try {
                    realtime.getresumen("company").then(data => {
                        // console.log(data)
                        if(data.status == 200){
                            // console.log(data.data)
                            this.resumen_content = data.data
                            
                            // this.indicadores = data.data[0].content_general[0]
                            // this.tableData =  data.data[0].content_resources
                        }
                    }).catch(function (error) {
                    })
                    
                } catch (error) {
                    
                }

                
            }
            catch(ex){}
        },

        editProductionOrder(item){
            this.selected_item = item
            this.$refs.open_orders.abrirOrdenes(item)
            // this.showEditForm=true
            this.$refs.showEditForm.open()
        },


        openSendProductionOrder(item){
            this.selected_item = item
            this.$refs.open_orders.openOrdersToSend(item)
            // this.showEditForm=true
            this.$refs.showEditForm.open()
        },

        closeFinOrder(){
            this.showFinOrders=false
        },

        openFinOrder(item){
            this.selected_item = item
            // this.showFinOrders = true
            // console.log(stoporders)
            this.$refs.showStopOrders.open()
            this.$refs.stop_orders.getParos(item, 'stop')
        },

        openChangeState(item){
            this.$refs.showStopOrders.open()
            this.selected_item = item
            this.$refs.stop_orders.getParos(item, 'change_status')
            // this.showFinOrders = true
        },

        closeProductionOrder(){
            // this.showEditForm=false
            this.$refs.showEditForm.close()
        },

        getInfoContent(value, variable, retorno){
            if(value != undefined){
                let result = JSON.parse(value.replace(/'/g, '"'))[variable]
                if(variable == 'StatusStateCurrentColor' && result == 0)
                    result = 'danger'
                return result
            }else{
                return retorno
            }
        },

        getRoute(itemwscode){
            let count = 0
            let link = '/info'
            let text = ''

            for (const item in this.$route.params) {
                count=count+1
                if(count ==1){
                    text = this.$route.params[item]
                }

                if(count ==2) {
                    count = 0
                    link += '/'+text+'/' + this.$route.params[item]
                }
            }
            return link + '/' + itemwscode
        },
        
        cargarDatos(start,finish,code){
            this.$refs.stoptimes.openCharts(this.seleccion, "group",this.wscode,this.startDate+":00", this.finishDate+":59")
        },

        ///pestana
        seleccionPestana(item){
            this.seleccion = item

            if(this.startDate != "" && this.finishDate != ""){
                this.$refs.stoptimes.openCharts(this.seleccion, "group",this.wscode,this.startDate+":00", this.finishDate+":59")
            }
        }
    },
    created() {

        this.$options.interval = setInterval(this.getContent, 1000)

        let count = 0
        let text = ''
        for (const item in this.$route.params) {
            count=count+1
            if(count ==1){
                text = this.$route.params[item]
            }
            if(count ==2) {
                count = 0
            }
        }

        this.wscode = text

        let group= this.$route.params['idgroup']
        let plant=this.$route.params['idfloor']

        realtime.gettables().then(data => {
            if(data.status == 200){
                
                this.field_items = data.data["columns_principal_board"]

                if(data.data[`columns_principal_board_${plant}_${group}`] != undefined){
                    this.field_items = data.data[`columns_principal_board_${plant}_${group}`]
                }
            }
        })

    },
    beforeDestroy () {
        clearInterval(this.$options.interval)
    }
}
</script>

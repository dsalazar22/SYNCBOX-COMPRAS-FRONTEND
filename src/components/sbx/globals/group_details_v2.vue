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
                <div class="text-right mt-1 mb-1 mr-3">
                    <b-btn size="sm" @click="visual_content='show-table'" class="icon-btn borderless" :variant="visual_content=='show-table' ? 'outline-dark' : 'outline-secondary'"><span class="ion ion-md-reorder"></span></b-btn>
                    <b-btn size="sm" @click="visual_content='show-cards'" class="icon-btn borderless" :variant="visual_content=='show-cards' ? 'outline-dark' : 'outline-secondary'"><span class="ion ion-md-apps"></span></b-btn>
                </div>
                <div class="row ml-1 mr-2" v-show="visual_content == 'show-cards'">
                    <div v-for="itemws in wsinfo" class="col-sm-6 col-md-3 col-lg-3 col-xl-3">
                            <b-card no-body :class="'shadow mb-4 border border-'+getInfoContent(itemws.infocalculada,'StatusStateCurrentColor','info')" 
                            
                            :footer="getInfoContent(itemws.infocalculada,'StatusStateCurrentTitle','----')"
                            footer-tag="footer"
                            :footer-bg-variant="getInfoContent(itemws.infocalculada,'StatusStateCurrentColor','info')"
                            :footer-border-variant="getInfoContent(itemws.infocalculada,'StatusStateCurrentColor','info')"
                            footer-text-variant="white">
                                <div class="mt-2 ml-2 mb-2">
                                    <b-badge :variant="itemws.trade_status == 'available' ? 'success' : 'danger'" class="badge-dot" />
                                    {{itemws.wscode}}
                                    
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
                                <div class="row mb-1">
                                    <div class="col text-center">
                                    <div class="text-muted small">Número de Ciclos</div>
                                        <div class="font-weight-bold">{{ getInfoContent(itemws.infocalculada,'nro_ciclos',0) }}</div>
                                    </div>
                                    <div class="col text-center">
                                        <div class="text-muted small">Defectuosas</div>
                                        <div class="font-weight-bold">{{getInfoContent(itemws.infocalculada,'scrap_counter',0)}}</div>
                                        <div class="card-body small pt-2 pb-0">
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
                                            <div class="font-weight-bold">{{ getInfoContent(itemws.infocalculada,'stop_time',0) }}</div>
                                            <div class="card-body small pt-2 pb-0">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mb-2">
                                        <div class="col">
                                            <div class="text-muted small ml-2">
                                                Ciclo Actual
                                                <div class="float-right mr-2">
                                                    {{ getInfoContent(itemws.infocalculada,'percentage_current_cycle',0) }}% </div>
                                            </div>
                                            <b-progress :variant="infoColorsCurrenVelocity(getInfoContent(itemws.infocalculada,'percentage_current_cycle',0))" :value=" getInfoContent(itemws.infocalculada,'percentage_current_cycle',0) " height="3px" class="rounded-0" />
                                            <div class="font-weight-bold text-center">{{ getInfoContent(itemws.infocalculada,'tiempocicloactual',0) }}</div>
                                        </div>
                                        <div class="col">
                                            <div class="text-muted small ml-2">Velocidad<div class="float-right mr-2"> {{getInfoContent(itemws.infocalculada,'percentage_last_cycle',0)}}% </div></div>
                                            <b-progress :variant="infoColorsVelocity(getInfoContent(itemws.infocalculada,'percentage_last_cycle',0))" :value="getInfoContent(itemws.infocalculada,'percentage_last_cycle',0)" height="3px" class="rounded-0" />
                                            <div class="font-weight-bold text-center">{{getInfoContent(itemws.infocalculada,'tiempoultimociclo',0)}}</div>
                                            <div class="card-body small pt-2 pb-0">
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
                                    </div>
                                    <hr class="m-0">
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
                            </b-card>
                    </div>
                </div>
                <div class="row" v-show="visual_content == 'show-table'">
                    <div v-if="!fullscreen" :class=" fullscreen ?  'col-12' : setstacked ? 'col-4' : 'col-12'">
                        <b-table-simple hover small responsive style="font-size:12px">
                            <b-thead>
                                <b-tr>
                                <b-th></b-th>
                                <b-th>Centro Trabajo</b-th>
                                <b-th v-if="!setstacked" v-for="item in fields"> <div class="text-nowrap">{{item.new_description}}</div></b-th>
                                
                                <b-th><div class="text-nowrap">Ciclo Actual</div></b-th>
                                <b-th><div class="text-nowrap">% Inst</div></b-th>
                                <b-th>Pendiente</b-th>
                                <b-th>Disponibilidad</b-th>
                                <b-th>Eficiencia</b-th>
                                <b-th>Calidad</b-th>
                                <b-th>OEE</b-th>
                                </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr v-for="itemws in wsinfo" :key="itemws.wscode" v-if="itemws.wscode == activeDrump || activeDrump == ''">
                                    <b-th>
                                        <div class="text-nowrap">
                                            <b-dropdown class="contacts-dropdown" :variant="getInfoContent(itemws.infocalculada,'StatusStateCurrentColor','info')+' default icon-btn borderless rounded-pill md-btn-flat hide-arrow'" size="xs" :right="!isRtlMode">
                                                <template slot="button-content"><i class="ion ion-ios-more"></i></template>
                                                    <b-dropdown-item  @click="setstacked=true;iselecteditemws=itemws"><i class="text-success fas fa-papper"></i> Detalles</b-dropdown-item>
                                                    <b-dropdown-item v-if="(itemws['mods'][0] == undefined || itemws['mods'][0] == 1) && ((check_access('start_order','w') && (itemws.wsstatus == 'stopped'  || itemws.wsstatus == undefined))) " @click="editProductionOrder(itemws)"><i class="text-success fas fa-play"></i> Iniciar Orden de Produccion</b-dropdown-item>
                                                    <b-dropdown-item v-if="(itemws['mods'][0] == undefined || itemws['mods'][0] == 1) && ((check_access('stop_order','w') &&  (itemws.wsstatus == 'running'))) " @click="openFinOrder(itemws)"><i class="text-danger fas fa-stop"></i> Detener Orden de Produccion</b-dropdown-item>
                                                    <b-dropdown-item v-if="(itemws['mods'][0] == undefined || itemws['mods'][0] == 1) && ((check_access('report_unities','w') && (itemws.wsstatus == 'running'))) "  @click="open_manual_report(itemws)"><i class="text-secondary fas fa-hand-paper"></i> Ingreso de Reportes Manuales</b-dropdown-item>
                                                    <b-dropdown-item v-if="(itemws['mods'][0] == undefined || itemws['mods'][0] == 1) && ((check_access('change_state_workstation','w') && (itemws.wsstatus == 'stopped'  || itemws.wsstatus == undefined))) "  @click="openChangeState(itemws)" ><i class="text-info fas fa-random"></i> Cambiar de Paro</b-dropdown-item>
                                            </b-dropdown> 
                                            <b-btn v-if="activeDrump == ''" @click="selectedDrump(itemws.wscode)" variant="outline-info icon-btn borderless btn-xs"><span class="fas fa-drum"></span>
                                            </b-btn>
                                            <b-btn v-if="activeDrump != ''" @click="activeDrump=''" variant="outline-warning icon-btn borderless btn-xs"><span class="fas fa-drum"></span>
                                            </b-btn>
                                        </div>
                                    </b-th>
                                    <b-td style="min-width:130px">
                                        <div class="text-nowrap">
                                            <b-btn pill block size="xs" @click="setstacked=true;iselecteditemws=itemws;selectTab='infogral'" :variant="'outline-secondary'">
                                                {{itemws.wscode}}
                                            </b-btn>
                                        </div>
                                    </b-td>
                                    <td v-for="it in itemws.htmltable" v-if="!setstacked">
                                        <div class="text-nowrap">
                                            {{ isNaN(it.valor) ? it.valor :numberWithCommas(it.valor) }}
                                        </div> 
                                    </td>
                                    <b-td class="text-right" :class="'text-'+  (getInfoContent(itemws.infocalculada,'StatusStateCurrentColor','info') == 'dark' ? 'transparent' : ((getInfoContent(itemws.infocalculada,'second_total_current_ciclye_time',0)>getInfoContent(itemws.infocalculada,'expected_cycle_time',0))?'danger':'success' ))">
                                        <b> {{getInfoContent(itemws.infocalculada,'tiempocicloactual',0)}} </b>
                                    </b-td>
                                    <b-td class="text-right" :class="'text-'+  (getInfoContent(itemws.infocalculada,'StatusStateCurrentColor','info') == 'dark' ? 'transparent' : ((getInfoContent(itemws.infocalculada,'second_total_current_ciclye_time',0)>getInfoContent(itemws.infocalculada,'percentage_last_cycle',0))?'danger':'success' ))">
                                        <b> {{getInfoContent(itemws.infocalculada,'percentage_last_cycle',0)}}% </b>
                                    </b-td>
                                    <b-td v-if="!setstacked" class="text-right text-white" :class="'bg-'+ ((getInfoContent(itemws.infocalculada,'totalPendienteUnd',0)/getInfoContent(itemws.infocalculada,'programmed',0))<=0.1?'danger':'success' )">{{numberWithCommas(getInfoContent(itemws.infocalculada,'totalPendienteUnd',0))}}</b-td>
                                    <b-td :class="'text-right bg-'+infoColorsOEE(getInfoContent(itemws.infocalculada,'disponibilidad',0)) ">
                                        <div :class="'text-'+(infoColorsOEE(getInfoContent(itemws.infocalculada,'disponibilidad',0))=='success' || infoColorsOEE(getInfoContent(itemws.infocalculada,'disponibilidad',0))=='danger' || infoColorsOEE(getInfoContent(itemws.infocalculada,'disponibilidad',0))=='primary' ?'white':'dark')">
                                            {{getInfoContent(itemws.infocalculada,'disponibilidad',0)}}%
                                        </div>
                                    </b-td>
                                    <b-td :class="'text-right bg-'+infoColorsOEE(getInfoContent(itemws.infocalculada,'eficiencia',0)) ">
                                        <div :class="'text-'+(infoColorsOEE(getInfoContent(itemws.infocalculada,'eficiencia',0))=='success' || infoColorsOEE(getInfoContent(itemws.infocalculada,'eficiencia',0))=='danger' || infoColorsOEE(getInfoContent(itemws.infocalculada,'eficiencia',0))=='primary' ?'white':'dark')">
                                            {{getInfoContent(itemws.infocalculada,'eficiencia',0)}}%
                                        </div>
                                    </b-td>
                                    <b-td :class="'text-right bg-'+infoColorsOEE(getInfoContent(itemws.infocalculada,'calidad',0)) ">
                                        <div :class="'text-'+(infoColorsOEE(getInfoContent(itemws.infocalculada,'calidad',0))=='success' || infoColorsOEE(getInfoContent(itemws.infocalculada,'calidad',0))=='danger' || infoColorsOEE(getInfoContent(itemws.infocalculada,'calidad',0))=='primary' ?'white':'dark')">
                                            {{getInfoContent(itemws.infocalculada,'calidad',0)}}%
                                        </div>
                                    </b-td>
                                    <b-td :class="'text-right bg-'+infoColorsOEE(getInfoContent(itemws.infocalculada,'oee',0)) ">
                                        <div :class="'text-'+(infoColorsOEE(getInfoContent(itemws.infocalculada,'oee',0))=='success' || infoColorsOEE(getInfoContent(itemws.infocalculada,'oee',0))=='danger' || infoColorsOEE(getInfoContent(itemws.infocalculada,'oee',0))=='primary' ?'white':'dark')">
                                            {{getInfoContent(itemws.infocalculada,'oee',0)}}%
                                        </div>
                                    </b-td>
                                </b-tr>
                            </b-tbody>
                        
                        </b-table-simple>

                        <wsdrump v-if="activeDrump != ''" :fromRealTime="true" :code_workstation="activeDrump"></wsdrump>

                        <!-- <drump class="ml-2 mr-2 mt-2" :id_plant="$route.params['idfloor']" :code_group="$route.params['codegroup']"></drump> -->
                    </div>
                    <div v-if="setstacked || fullscreen" :class="fullscreen ? 'col-12':'col-8'">
                        <b-card class="mb-2" no-body>
                            <div style="padding:0.5rem" >
                                <div class="contact-content-about">
                                <h3 class="contact-content-name text-center mb-1"><a href="javascript:void(0)" class="text-body">{{iselecteditemws.wscode}}</a></h3>
                                <div class="contact-content-user text-center mb-2"><span v-html="getInfoContent(iselecteditemws.infocalculada,'description2',0)"></span></div>
                                <hr class="border-light" >
                                <b-nav class="justify-content-end mb-2">
                                    <b-nav tabs class="nav-sm tabs-alt">
                                        <b-nav-item :active="selectTab=='infogral'"  @click="selectTab='infogral'">Informacion General</b-nav-item>
                                        <b-nav-item :active="selectTab=='produccionhh'"  @click="selectedTab('e'); selectTab='produccionhh'">OEE por Hora</b-nav-item>
                                        <b-nav-item :active="selectTab=='infohh'"  @click="selectedTab('h'); selectTab='infohh'">Control Hora a Hora</b-nav-item>
                                        <b-nav-item :active="selectTab=='details'"  @click="selectTab='details'">Detalles</b-nav-item>
                                    </b-nav>
                                </b-nav>
                                <div v-show="selectTab=='details'" >
                                    <div>
                                        <h2 class="text-center">TIMELINE</h2>
                            
                                        <perfect-scrollbar style="height: 300px; width:98%" class="ml-3 mb-3">
                                            <div v-for="activity in infows[iselecteditemws.wscode].timeline" :key="activity.tipo+'-'+activity.fechainicio" class="media ml-3 pb-1 mb-3">
                                                <div class="ui-feed-icon-container">
                                                <span v-if="activity.tipo === 'TF'" class="ui-icon ui-feed-icon ion ion-md-checkmark bg-success text-white"></span>
                                                <span v-if="activity.tipo === 'TFF'" class="ui-icon ui-feed-icon ion ion-md-arrow-dropright bg-success text-white"></span>
                                                <span v-if="activity.tipo === 'ST' && activity.color=='FF8C00'" class="ui-icon ui-feed-icon ion ion-md-close bg-warning text-body"></span>
                                                <span v-if="activity.tipo === 'ST' && activity.color!='FF8C00'" class="ui-icon ui-feed-icon ion ion-md-close bg-danger text-white"></span>
                                                <span v-if="activity.tipo === 'TSS' && activity.color=='FF8C00'" class="ui-icon ui-feed-icon ion ion-md-arrow-dropright bg-warning text-body"></span>
                                                <span v-if="activity.tipo === 'TSS' && activity.color!='FF8C00'" class="ui-icon ui-feed-icon ion ion-md-arrow-dropright bg-danger text-white "></span>
                                                </div>
                                                <div class="media-body align-self-center ml-3">
                                                    <div v-if="activity.tipo === 'TF'">Tiempo Operativo <strong>{{activity.descripcion}}</strong></div>
                                                    <div v-if="activity.tipo === 'ST'">Tiempo Detenido <strong>{{activity.descripcion}} | {{activity.root_cause}}</strong></div>
                                                    <div v-if="activity.tipo === 'TFF'">En Operacion <strong>{{activity.descripcion}}</strong></div>
                                                    <div v-if="activity.tipo === 'TSS'">Detenido <strong>{{activity.descripcion}}</strong></div>
                                                    <!-- TFF -->
                                                    <div v-if="activity.tipo === 'TF' || activity.tipo === 'TFF'" class="row ml-1 mr-1 mt-0">
                                                                <div class="col"  style="padding:0">
                                                                    <b-card class="ml-1 mb-1 text-center" no-body>
                                                                        <div>
                                                                            <div class="ml-2 mr-2">
                                                                                <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                                    {{ numberWithCommas(activity.tiempototal) }}
                                                                                </h5>
                                                                            </div>
                                                                            <hr class="border-light m-0">
                                                                            <div class="bg-light text-dark">
                                                                                <small><b>Tiempo Total</b></small>
                                                                            </div>
                                                                        </div>
                                                                    </b-card>
                                                                </div>
                                                                <div class="col"  style="padding:0">
                                                                    <b-card class="ml-1 mb-1 text-center"  no-body>
                                                                        <div>
                                                                            <div class="ml-2 mr-2">
                                                                                <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                                {{numberWithCommas(activity.unidadesreales)}}
                                                                                </h5>
                                                                            </div>
                                                                            <hr class="border-light m-0">
                                                                            <div class="bg-light text-dark">
                                                                                <small> <b>Unidades Esperadas</b></small>
                                                                            </div>
                                                                        </div>
                                                                    </b-card>
                                                                </div>
                                                                <div class="col" style="padding:0">
                                                                    <b-card class="ml-1 mb-1 text-center" style="padding:0; margin-bottom:0;" no-body>
                                                                        <div>
                                                                            <div class="ml-2 mr-2">
                                                                                <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                                    {{numberWithCommas(activity.unidadesproducidas)}}
                                                                                </h5>
                                                                            </div>
                                                                            <hr class="border-light m-0">
                                                                            <div class="bg-light text-dark">
                                                                                <small><b>Unidades Reales</b></small>
                                                                            </div>
                                                                        </div>
                                                                    </b-card>
                                                                </div>
                                                    </div>
                                                    <div v-if="activity.tipo === 'ST' || activity.tipo === 'SST'" class="text-muted small"> {{activity.detalle}}</div>
                                                    <div class="text-muted small">{{activity.cinicio}} - {{activity.cfin}}</div>
                                                    <div v-if="activity.tipo === 'ST' || activity.tipo === 'SST'" class="text-muted small"><strong>Tiempo Total:</strong> {{activity.tiempototal}}</div>
                                                </div>
                                            </div>
                                        </perfect-scrollbar>
                                    </div>
                                </div>
                                <div id="container" v-show="selectTab=='produccionhh' || selectTab=='infohh'" ></div>
                                <div v-if="selectTab=='infogral'">
                                    <div class="small">
                                    </div>
                                    <h5 class="ml-1" style="margin:0">Informacion de Cantidades</h5>
                                    <div class="row ml-1 mr-1 mt-0">
                                        <div class="col"  style="padding:0">
                                            <b-card class="ml-0 mb-1 text-center" no-body>
                                                <div>
                                                    <div class="ml-2 mr-2">
                                                        <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                            {{ numberWithCommas(getInfoContent(iselecteditemws.infocalculada,'programmed',0)) }}
                                                        </h5>
                                                    </div>
                                                    <hr class="border-light m-0">
                                                    <div class="bg-light text-dark">
                                                        <small> <b> Cantidad Programada </b> </small>
                                                    </div>
                                                </div>
                                            </b-card>
                                        </div>
                                        <div class="col"  style="padding:0">
                                            <b-card class="ml-1 mb-1 text-center"  no-body>
                                                <div>
                                                    <div class="ml-2 mr-2">
                                                        <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                            {{numberWithCommas(getInfoContent(iselecteditemws.infocalculada,'totalProducidoUnd',0))}}
                                                        </h5>
                                                    </div>
                                                    <hr class="border-light m-0">
                                                    <div class="bg-light text-dark">
                                                        <small> <b>Cantidad Producida</b></small>
                                                    </div>
                                                </div>
                                            </b-card>
                                        </div>
                                        <div class="col" style="padding:0">
                                            <b-card class="ml-1 mb-1 text-center" style="padding:0; margin-bottom:0;" no-body>
                                                <div>
                                                    <div class="ml-2 mr-2">
                                                        <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                            {{numberWithCommas(getInfoContent(iselecteditemws.infocalculada,'totalPendienteUnd',0))}}
                                                        </h5>
                                                    </div>
                                                    <hr class="border-light m-0">
                                                    <div class="bg-light text-dark">
                                                        <small><b>Cantidad Pendiente</b></small>
                                                    </div>
                                                </div>
                                            </b-card>
                                        </div>
                                    </div>
                                    <div class="row ml-1 mr-1 mt-0">
                                                <div class="col"  style="padding:0">
                                                    <b-card class="ml-1 mb-1 text-center" no-body>
                                                        <div>
                                                            <div class="ml-2 mr-2">
                                                                <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                    {{ numberWithCommas(getInfoContent(iselecteditemws.infocalculada,'programmed',0)) }}
                                                                </h5>
                                                            </div>
                                                            <hr class="border-light m-0">
                                                            <div class="bg-light text-dark">
                                                                <small><b>Empaque Programado</b></small>
                                                            </div>
                                                        </div>
                                                    </b-card>
                                                </div>
                                                <div class="col"  style="padding:0">
                                                    <b-card class="ml-1 mb-1 text-center"  no-body>
                                                        <div>
                                                            <div class="ml-2 mr-2">
                                                                <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                {{numberWithCommas(getInfoContent(iselecteditemws.infocalculada,'totalProducido',0))}}
                                                                </h5>
                                                            </div>
                                                            <hr class="border-light m-0">
                                                            <div class="bg-light text-dark">
                                                                <small> <b>Empaque Producido</b></small>
                                                            </div>
                                                        </div>
                                                    </b-card>
                                                </div>
                                                <div class="col" style="padding:0">
                                                    <b-card class="ml-1 mb-1 text-center" style="padding:0; margin-bottom:0;" no-body>
                                                        <div>
                                                            <div class="ml-2 mr-2">
                                                                <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                    {{numberWithCommas(getInfoContent(iselecteditemws.infocalculada,'totalPendiente',0))}}
                                                                </h5>
                                                            </div>
                                                            <hr class="border-light m-0">
                                                            <div class="bg-light text-dark">
                                                                <small><b>Empaque Pendiente</b></small>
                                                            </div>
                                                        </div>
                                                    </b-card>
                                                </div>
                                    </div>
                                    <h5 class="ml-1 mt-2" style="margin:0">Informacion de Tiempos</h5>
                                        <div class="row ml-0 mr-1 mt-0">
                                            <div class="col"  style="padding:0">
                                                <b-card class="ml-1 mb-1 text-center" no-body>
                                                    <div>
                                                        <div class="ml-2 mr-2">
                                                            <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                {{getInfoContent(iselecteditemws.infocalculada,'tiempoultimociclo',0)}}
                                                            </h5>
                                                        </div>
                                                        <hr class="border-light m-0">
                                                        <div class="bg-light text-dark">
                                                            <small><b>Ciclo Base</b></small>
                                                        </div>
                                                    </div>
                                                </b-card>
                                            </div>
                                            <div class="col"  style="padding:0">
                                                <b-card class="ml-1 mb-1 text-center"  no-body>
                                                    <div>
                                                        <div class="ml-2 mr-2">
                                                            <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                {{getInfoContent(iselecteditemws.infocalculada,'tiempocicloactual',0)}}
                                                            </h5>
                                                        </div>
                                                        <hr class="border-light m-0">
                                                        <div class="bg-light text-dark">
                                                            <small><b>Ciclo Real</b></small>
                                                        </div>
                                                    </div>
                                                </b-card>
                                            </div>
                                            <div class="col" style="padding:0">
                                                <b-card class="ml-1 mb-1 text-center" :class="'text-'+infoColorsCurrenVelocity(getInfoContent(iselecteditemws.infocalculada,'percentage_current_cycle',0))" style="padding:0; margin-bottom:0;" no-body>
                                                    <div>
                                                        <div class="ml-2 mr-2">
                                                            <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                {{getInfoContent(iselecteditemws.infocalculada,'percentage_last_cycle',0)}}%
                                                            </h5>
                                                        </div>
                                                        <hr class="border-light m-0">
                                                        <div class="bg-light text-dark">
                                                            <small><b>Porcentaje</b></small>
                                                        </div>
                                                    </div>
                                                </b-card>
                                            </div>                              
                                            <div class="col"  style="padding:0">
                                                <b-card class="ml-1 mb-1 text-center" no-body>
                                                    <div>
                                                        <div class="ml-2 mr-2">
                                                            <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                {{ getInfoContent(iselecteditemws.infocalculada,'tiempotrabajado',0) }}
                                                            </h5>
                                                        </div>
                                                        <hr class="border-light m-0">
                                                        <div class="bg-light text-dark">
                                                            <small><b>T Operativo</b></small>
                                                        </div>
                                                    </div>
                                                </b-card>
                                            </div>
                                            <div class="col"  style="padding:0">
                                                <b-card class="ml-1 mb-1 text-center"  no-body>
                                                    <div>
                                                        <div class="ml-2 mr-2">
                                                            <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                            {{ getInfoContent(iselecteditemws.infocalculada,'stop_time',0) }}
                                                            </h5>
                                                        </div>
                                                        <hr class="border-light m-0">
                                                        <div class="bg-light text-dark">
                                                            <small> <b> T de Paro </b> </small>
                                                        </div>
                                                    </div>
                                                </b-card>
                                            </div>
                                            <div class="col" style="padding:0">
                                                <b-card class="ml-1 mb-1 text-center" style="padding:0; margin-bottom:0;" no-body>
                                                    <div>
                                                        <div class="ml-2 mr-2">
                                                            <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                <!-- sencondHHMMSS -->
                                                                {{sencondHHMMSS((getInfoContent(iselecteditemws.infocalculada,'totalPendienteUnd',0) / getInfoContent(iselecteditemws.infocalculada,'unidades_ciclo_reales',0))*(getInfoContent(iselecteditemws.infocalculada,'crealss',0)/100)) }}
                                                            </h5>
                                                        </div>
                                                        <hr class="border-light m-0">
                                                        <div class="bg-light text-dark">
                                                            <small><b>T Proyectado</b> </small>
                                                        </div>
                                                    </div>
                                                </b-card>
                                            </div>
                                        </div>
                                        <div class="row ml-1 mr-1 mt-0">
                                            <div class="col"  style="padding:0">
                                                <b-card class="m-0 text-center" :class="'bg-'+infoColorsOEE(infows[iselecteditemws.wscode].disponibilidad)" no-body>
                                                    <div :class="'text-'+(infoColorsOEE(infows[iselecteditemws.wscode].disponibilidad)=='success' || infoColorsOEE(infows[iselecteditemws.wscode].disponibilidad)=='danger' || infoColorsOEE(infows[iselecteditemws.wscode].disponibilidad)=='primary'?'white':'dark')">
                                                        <div class="ml-2 mr-2">
                                                            <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                {{infows[iselecteditemws.wscode].disponibilidad}}%
                                                            </h5>
                                                        </div>
                                                        <hr class="border-light m-0">
                                                        <div class="bg-light text-dark">
                                                            <small><b>Disponibilidad</b></small>
                                                        </div>
                                                    </div>
                                                </b-card>
                                            </div>
                                            <div class="col"  style="padding:0">
                                                <b-card class="m-0 text-center" :class="'bg-'+infoColorsOEE(infows[iselecteditemws.wscode].eficiencia)" no-body>
                                                    <div :class="'text-'+(infoColorsOEE(infows[iselecteditemws.wscode].eficiencia)=='success' || infoColorsOEE(infows[iselecteditemws.wscode].eficiencia)=='danger' || infoColorsOEE(infows[iselecteditemws.wscode].eficiencia)=='primary' ?'white':'dark')">
                                                        <div class="ml-2 mr-2">
                                                            <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                {{infows[iselecteditemws.wscode].eficiencia}}%
                                                            </h5>
                                                        </div>
                                                        <hr class="border-light m-0">
                                                        <div class="bg-light text-dark">
                                                            <small><b>Eficiencia</b></small>
                                                        </div>
                                                    </div>
                                                </b-card>
                                            </div>
                                            <div class="col" style="padding:0">
                                                <b-card class="m-0 text-center" :class="'bg-'+infoColorsOEE(infows[iselecteditemws.wscode].calidad)" no-body>
                                                    <div :class="'text-'+(infoColorsOEE(infows[iselecteditemws.wscode].calidad)=='success' || infoColorsOEE(infows[iselecteditemws.wscode].calidad)=='danger' || infoColorsOEE(infows[iselecteditemws.wscode].calidad)=='primary'?'white':'dark')">
                                                        <div class="ml-2 mr-2">
                                                            <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                {{infows[iselecteditemws.wscode].calidad}}%
                                                            </h5>
                                                        </div>
                                                        <hr class="border-light m-0">
                                                        <div class="bg-light text-dark">
                                                            <small><b>Calidad</b></small>
                                                        </div>
                                                    </div>
                                                </b-card>
                                            </div>
                                            <div class="col" style="padding:0">
                                                <b-card class="ml-0 text-center" :class="'bg-'+infoColorsOEE(infows[iselecteditemws.wscode].oee)" no-body>
                                                    <div :class="'text-'+(infoColorsOEE(infows[iselecteditemws.wscode].oee)=='success' || infoColorsOEE(infows[iselecteditemws.wscode].oee)=='danger' || infoColorsOEE(infows[iselecteditemws.wscode].oee)=='primary' ? 'white':'dark')">
                                                        <div class="ml-2 mr-2">
                                                            <h5 class="mt-1" style="padding:0; margin-bottom:0;">
                                                                {{infows[iselecteditemws.wscode].oee}}%
                                                            </h5>
                                                        </div>
                                                        <hr class="border-light m-0">
                                                        <div class="bg-light text-dark">
                                                            <small><b>OEE</b></small>
                                                        </div>
                                                    </div>
                                                </b-card>
                                            </div>
                                        </div>
                                </div>
                                <hr class="border-light" >
                                    <div>
                                        <b-btn size="sm" v-if="(iselecteditemws['mods'][0] == undefined || iselecteditemws['mods'][0] == 1) && ((check_access('start_order','w') && (iselecteditemws.wsstatus == 'stopped'  || iselecteditemws.wsstatus == undefined))) " @click="editProductionOrder(iselecteditemws)" variant="outline-success icon-btn borderless"><span class="fas fa-play"></span></b-btn>
                                        <b-btn size="sm" v-if="(iselecteditemws['mods'][0] == undefined || iselecteditemws['mods'][0] == 1) && ((check_access('stop_order','w') &&  (iselecteditemws.wsstatus == 'running'))) " @click="openFinOrder(iselecteditemws)" variant="outline-danger icon-btn borderless"><span class="fas fa-stop"></span></b-btn>
                                        <b-btn size="sm" v-if="(iselecteditemws['mods'][0] == undefined || iselecteditemws['mods'][0] == 1) && ((check_access('report_unities','w') && (iselecteditemws.wsstatus == 'running'))) " variant="outline-secondary icon-btn borderless" @click="open_manual_report(iselecteditemws)"><span class="fas fa-hand-paper"></span></b-btn>
                                        <b-btn size="sm" v-if="(iselecteditemws['mods'][0] == undefined || iselecteditemws['mods'][0] == 1) && ((check_access('change_state_workstation','w') && (iselecteditemws.wsstatus == 'stopped'  || iselecteditemws.wsstatus == undefined))) " @click="openChangeState(iselecteditemws)" variant="outline-info icon-btn borderless"><span class="fas fa-random"></span></b-btn>
                                        <b-btn size="sm" v-if="(iselecteditemws['mods'][1] == undefined || iselecteditemws['mods'][1] == 1)" @click="openOperators(iselecteditemws)" variant="outline-success icon-btn borderless"><span class="badge badge-light">{{iselecteditemws.operators == undefined ? 0 : iselecteditemws.operators}}</span> </b-btn>
                                        <b-btn size="sm" v-if="(iselecteditemws['mods'][2] == 1) && (check_access('change_state_workstation','w')) " @click="openSendProductionOrder(iselecteditemws)" variant="outline-info icon-btn borderless"><span class="fas fa-map-marker"></span></b-btn>
                                        <b-btn size="sm" v-if="(iselecteditemws['mods'][0] == undefined || iselecteditemws['mods'][0] == 1) && (check_access('edit_control_vars','w')) " @click="openVarsControl(iselecteditemws)" variant="outline-danger icon-btn borderless"><span class="fas fa-asterisk"></span></b-btn>
                                        <!-- <b-btn size="sm" @click="openSaldos=true;" variant="outline-secondary icon-btn borderless"><span class="fas fa-box"></span></b-btn> -->
                                        <span class="text-lighter">|</span> &nbsp;&nbsp;
                                        <b-btn size="sm" v-if="!fullscreen" @click="fullscreen=true" variant="outline-info icon-btn borderless"><span class="fas fa-expand"></span></b-btn>
                                        <b-btn size="sm" v-if="fullscreen" @click="fullscreen=false" variant="outline-info icon-btn borderless"><span class="fas fa-minus"></span></b-btn>
                                        <b-btn size="sm" @click="setstacked=false;fullscreen=false" variant="outline-danger icon-btn borderless"><span class="fas fa-times-circle"></span></b-btn>
                                    </div>
                                </div>
                            </div>
                        </b-card>
                    </div>
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
import LightTimeline from "vue-light-timeline"
  
import { realtime } from '@/vendor/sbx/sbx-realtime/realtime'
import LinearGauge from 'vue-canvas-gauges/src/LinearGauge'
import RadialGauge from 'vue-canvas-gauges/src/RadialGauge'
// import VueApexCharts from 'vue-apexcharts'

import stoporders from './stop_orders'
import orders from './operation_orders'
import operatorsregister from './operators_register'

import chartspie from './charts/charts_pie'
import wsdrump from '@/components/sbx/production/wsdrump.vue'
import mreport from '@/components/sbx/production/reports/manual_reports'
import {infousers} from '@/components/i40/js/users'

import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import { infoconfig } from "@/components/i40/js/config";

import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

Vue.use(Notifications)
Vue.use(LightTimeline)

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
        wsdrump,
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
        PerfectScrollbar,
    },

    data: () => ({
        activeDrump:"",
        infows:[],
        selectTab:'infogral',
        fields:[],
        detallecompleto:[],
        fullscreen:false,
        setstacked:false,
        content: '',
        messageContent:false,
        iselecteditemws:{},

        varscontroller:false,
        selected_ws_to_report:{},

        order_global_selected:false,
        // showFinOrdersGroupal: false,
        showEditFormStartGroup:false,
        // showOperators:false,
        field_items:[],

        wsinfo :{},
        wsinfoTable :[],
        
        columns: [
            {key:'wscode', label:"Centro Trabajo"},
            {key:'code', label:"Codigo"},
            {key:'description', label:"Descripcion"},
            {key:'totalPendienteUnd', label:"Cantidad Pendiente"},
            {key:'tiempocicloactual', label:"Tiempo Ciclo"},
            {key:'tiempocicloactual', label:"Ciclo Actual"},
            {key:'eficiencia', label:"Eficiencia"},
            // {key:'decimal_quantity', label:"Cifras Decimales"},
            ///Este objeto es fijo en caso de que se necesite modificar la info
            // {key:'edit', label:"Editar/Eliminar"}
        ],

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

        visual_content:'show-table',
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
        selectedDrump(wscode){
            this.activeDrump=wscode
            
        },
        selectedTab(item){
            let content = []
            let array = this.detallecompleto.hh_centrostrabajo
            let eficiencia = 70
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if(element.wscode == this.iselecteditemws.wscode)
                if(item == 'e'){

                    let ef =(element.eficiencia)
                    let cal =(element.calidad)
                    let disp = (element.disponibilidad)
                    
                    
                    content.push({name:element.hh, color: parseFloat(((disp*cal*ef) * 100).toFixed(2))<eficiencia?'#EF5350':'#5BD34D', y:parseFloat(((disp*cal*ef) * 100).toFixed(2))})
                }else{
                    content.push({name:element.hh,color: (element.toperativo*100)<eficiencia?'#EF5350':'#5BD34D', y:element.toperativo*100})
                }
            }

            this.plot_stoptime2("container", content, "", this, "column", eficiencia)
        },

        plot_stoptime2(div_info, items, name, compo, type, meta){

            var pieColors = (function () {
            var colors = [],
                base = Highcharts.getOptions().colors[0],
                i;

                for (i = 0; i < 10; i += 1) {
                    // Start out with a darkened base color (negative brighten), and end
                    // up with a much brighter color
                    colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
                }
                return colors;
            }());


        Highcharts.chart(div_info, {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: type,

              spacing: [0, 0, 0, 0],
              backgroundColor: null 
            },
            title: {
              text: "",
            },
            
            legend:{ enabled:false },
            tooltip: {
              pointFormat: `{point.name}: <b>{point.y:.1f}${type=="column"?'%':''}</b>`
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,

                  format: "{point.y:.1f}%",
                        style: {
                            fontSize: '16px',
                            // color:'#32A9E1',
                        }
                    }
                }
            },
            xAxis: {
                startOnTick: false,
                type: 'category',
                labels: {
                    rotation: 0,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif',
                        // color:'#32A9E1',
                    }
                }
            },
            yAxis: {
               labels: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                min:0,
                max:110,
                minPadding: 0,
                maxPadding: 0,
                gridLineWidth: 0,
                title: null,

                plotLines: [{
                  zIndex: 1000,
                  value: meta,
                  color: '#32A9E1',
                  // dashStyle: 'shortdash',
                  width: 5,
                  label: {
                      text: `${meta}%   p`,
                      align: 'right',
                      y:-70,
                      x:12,
                    style: {
                        fontSize: '20px',
                        fontFamily: 'Verdana, sans-serif',
                        color:'#32A9E1',
                    }
                }
              }]
            },
            series: [
              {
                
                name: name,
                colorByPoint: true,
                data: items
              }
            ]
        });

                
    },
        //superinteligencia
        sencondHHMMSS(value){
            if(isNaN(value))
                return 0
            return new Date(value * 1000).toISOString().substr(11, 8)
        },

        numberWithCommas(num) {
            if(num == null)
                num=0
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
            // return x //.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },

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

            // console.log(item)

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

        infoColorsCurrenComplete(value){
            return realtime.infoColorsCurrenComplete(value)
        },

        getContent(){
            try{
                let group= this.$route.params['idgroup']
                let plant=this.$route.params['idfloor']

                realtime.infoContentOEE(plant, group).then(data => {
                    if(data.status == 200){
                        if(data.data != "" && data.data != null && data.data != undefined){
                            this.wsinfo = data.data
                            for (let indexData = 0; indexData < data.data.length; indexData++) {
                                const element = data.data[indexData];
                                let definedfields = []
                                try{
                                    let array = JSON.parse(element.infocalculada)
                                    let htmlTable = []
                                    // console.log(element['infocalculada'])
                                    for (let indexFields = 0; indexFields < this.fields.length; indexFields++) {
                                        const elementField = this.fields[indexFields];
                                        definedfields.push({fieldid:elementField.field_id, value:JSON.parse(element.infocalculada)[elementField.field_id]})
                                        htmlTable.push({'valor':array[elementField.field_id]})
                                    }
                                    this.wsinfo[indexData]['htmltable'] = htmlTable
                                }catch{
                                    this.wsinfo[indexData]['htmltable'] = []
                                }
                            }

                            // console.log(this.wsinfo)
                            
                            let prepareslice= []

                            for (let index = 0; index < this.wsinfo.length; index++) {
                                const element = this.wsinfo[index];
                                if(element.wscode == this.iselecteditemws.wscode){
                                    this.iselecteditemws = element
                                }
                                if(this.selected_item_control_vars.wscode == element.wscode){
                                    if(this.selected_item_control_vars["control_vars"] != undefined)
                                        this.control_vars_json = JSON.parse(element["control_vars"])
                                }
                                if(element.infocalculada != undefined){
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

                realtime.obteneroeeinfocomplete().then(data => {
                    this.detallecompleto = data.data[0]
                    let array = data.data[0].totales_grupos
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];

                        if(element.workstation_group_id == this.$route.params['idgroup']){
                            let ef =(element.eficiencia)
                            let cal =(element.calidad)
                            let disp = (element.disponibilidad)

                            this.indicadores.eficiencia = parseFloat((ef * 100).toFixed(2))
                            this.indicadores.disponibilidad =parseFloat((disp * 100).toFixed(2))
                            this.indicadores.calidad=parseFloat((cal * 100).toFixed(2))
                            this.indicadores.oee =parseFloat(((disp*cal*ef) * 100).toFixed(2))
                        }
                    }
                    
                    array = data.data[0].totales_centrotrabajo
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];

                        let ef =(element.eficiencia)
                        let cal =(element.calidad)
                        let disp = (element.disponibilidad)

                        element.eficiencia = parseFloat((ef * 100).toFixed(2))
                        element.disponibilidad =parseFloat((disp * 100).toFixed(2))
                        element.calidad=parseFloat((cal * 100).toFixed(2))
                        element.oee =parseFloat(((disp*cal*ef) * 100).toFixed(2))

                        this.infows[element.wscode]=element
                    }
                })

                try {
                    realtime.getresumen("company").then(data => {
                        if(data.status == 200 && data.data != ''){
                            this.resumen_content = data.data
                        }
                    })
                } catch (error) {
                    
                } finally {
                    // console.log('error')
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
            this.$refs.stop_orders.abrirOrdenes(item)
            this.$refs.showStopOrders.open()
            this.$refs.stop_orders.getParos(item, 'stop')
        },

        openChangeState(item){
            this.$refs.stop_orders.abrirOrdenes(item)
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
    beforeCreate(){
        infoconfig.fieldsconfig(this.$route.params['idgroup'],"select").then(data => {
            this.fields=[]
            
            if(data.data != ''){
               let array = data.data

               for (let index = 0; index < array.length; index++) {
                   const element = array[index];
                    if(element.fields_options_wsgroup_id != null){
                        this.fields.push({field_id:element.field_id, new_description:element.new_description})
                    }
               }
            }
        })
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

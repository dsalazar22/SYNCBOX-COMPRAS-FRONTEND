<template>
    <div>
        <!-- <div class="content-heading">
            <div>
                {{titleHeader}}
                <small> Centro de Trabajo</small>
            </div>
        </div> -->
        <h4 class="font-weight-bold py-3 mb-1">
               Resumen General de la Operacion
                <!-- <small>Tiempo de Paro - Grupo de Centro de Trabajo</small> -->
        </h4>
        <div>
            Seleccione Los Centros de Trabajo
            <multiselect
                v-model="selectedWorkstation"
                :options="workstationGroup"
                :multiple="true"
                :searchable="true"
                :internal-search="true"
                :clear-on-select="false"
                :hide-selected="true"
                placeholder="Seleccione Los Centros de Trabajo"
                label="code"
                track-by="code" />
        </div>

        <div class="row mt-2">
            <div class="col-md-12 col-sm-12 col-lg-12">
                <div class="row mb-1">
                    <div class="col-md-1">
                    </div>
                    <div class="col-md-4">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                            <date-picker v-model="dateStart" :config="options"></date-picker>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                            <date-picker v-model="dateFinsh" :config="options"></date-picker>
                        </div> 
                    </div>
                    <div class="col-md-3">
                        <div class="row">
                            <button type="button" class="btn btn-success" v-on:click="cargarDatos('')">Consultar</button>
                            <b-btn class="ml-1 " variant="outline-success" @click="download">Imprimir</b-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats -->
        {{detalleIndicadores}}
    <div>
      <div class="row" >
        <div class="col-sm-6 col-md-6 col-lg-3 col-xl-3">
            <div class="card">
                <div class="card-header">DISPONIBILIDAD</div>
                <div class="card-body">
                    <div id="disponibilidad" style="height: 200px; max-width: 300px; margin: 0 auto"></div>
                </div>
            </div>
        </div>        
        <div class="col-sm-6 col-md-6 col-lg-3 col-xl-3">
            <div class="card">
                <div class="card-header">EFICIENCIA</div>
                <div class="card-body">
                    <div id="eficiencia" style="height: 200px; max-width: 300px; margin: 0 auto"></div>
                </div>
            </div>
        </div>        
        <div class="col-sm-6 col-md-6 col-lg-3 col-xl-3">
            <div class="card">
                <div class="card-header">CALIDAD</div>
                <div class="card-body">
                    <div id="calidad" style="height: 200px; max-width: 300px; margin: 0 auto"></div>
                </div>
            </div>
        </div>        
        <div class="col-sm-6 col-md-6 col-lg-3 col-xl-3">
            <div class="card">
                <div class="card-header">OEE</div>
                <div class="card-body">
                    <div id="oee" style="height: 200px; max-width: 300px; margin: 0 auto"></div>
                </div>
            </div>
        </div>
      </div>
      <!-- / Stats -->
</div>
        <b-nav class="justify-content-end mt-2">
            <b-nav tabs class="nav-sm tabs-alt">
                <b-nav-item :active="selectTab=='info_general'" @click="selectTab='info_general'">Información General</b-nav-item>
                <b-nav-item :active="selectTab=='info_detalle'" @click="selectTab='info_detalle'">Información Detalle</b-nav-item>
                <b-nav-item :active="selectTab=='info_bitacora'" @click="selectTab='info_bitacora'">Información Bitacora</b-nav-item>
                <b-nav-item :active="selectTab=='info_bitacora_calls'" @click="selectTab='info_bitacora_calls'">Detalle de Llamadas</b-nav-item>
            <!-- <b-nav-item disabled>Disabled</b-nav-item> -->
            </b-nav>
        </b-nav>

        <div v-show="selectTab == 'info_general' || selectTab == 'info_detalle' ">
            <multiselect 
                        v-model="selectedStopCodeDescriptions"
                        :options="stopcodeDescriptions"
                        :multiple="true"
                        :searchable="true"
                        :internal-search="true"
                        :clear-on-select="false"
                        :hide-selected="true"
                        placeholder="Seleccione Los Centros de Trabajo"
                        label="code"
                        track-by="code" />
        </div>

        <div class="row" v-show="selectTab == 'info_general'">
                    
            <div class="col-12">
                <div class="card card-default">
                    <div class="card-header">Resultados de Tiempos</div>
                    <div class="card-body">

                        <!-- <div class="position-static">1 sfa sdf dsa fs fd asdf d sf asd f a <br> asadsadasd sad sa das d sad asd asd as  </div> -->
                        <div class="row">
                            
                            <div class="col-lg-12 col-xl-8">
                                <div id="container"></div>
                            </div>
                            <div class="col-lg-12 col-xl-4" >
                                <div v-if="timesResult.length>0">
                                    <h4>Tiempos</h4>

                                    <div v-for="a in timesResult" >
                                        <div class="row">
                                            <div class="col-8">
                                                <b> {{a.detalle}}: </b>
                                            </div>
                                            <div class="col-4">
                                                {{a.total}}
                                            </div>
                                        </div>
                                    </div>

                                    <h4 class="mt-3">Unidades</h4>

                                    <div v-for="a in detalleUnidades">
                                        <div class="row">
                                            <div class="col-8">
                                                <b> {{a.detalle}}: </b>
                                            </div>
                                            <div class="col-4">
                                                {{a.total}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                <!-- <div v-if="totales_minutes > 0">
                                    <div class="row">
                                        <div class="col text-right">
                                            <b>Tiempo Total (min): </b> 
                                        </div>
                                        <div class="col">
                                            {{tiempo_total_operacion}}
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col  text-right">
                                            <b>Tiempo Total Paros (min): </b> 
                                        </div>
                                        <div class="col">
                                            {{totales_minutes}}
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col  text-right">
                                            <b>Ciclos Totales Paro: </b> 
                                        </div>
                                        <div class="col">
                                            {{ciclos_paros}}
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col  text-right">
                                            <b>Unidades Totales Producidas:</b> 
                                        </div>
                                        <div class="col">
                                            {{undsprod}}
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col  text-right">
                                            <b>Total Microparos:</b> 
                                        </div>
                                        <div class="col">
                                            {{undsprod}}
                                        </div>
                                    </div>

                                </div> 
                            </div> -->
                        </div>
                        
                        
                        <!-- <br>
                        <div v-if="totales_minutes > 0">
                            <div class="row">
                                <div class="col">
                                    <b>Tiempo Total (min): </b> 
                                </div>
                                <div class="col">
                                    {{tiempo_total_operacion}}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <b>Tiempo Total Paros (min): </b> 
                                </div>
                                <div class="col">
                                    {{totales_minutes}}
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col">
                                    <b>Ciclos Totales Paro: </b> 
                                </div>
                                <div class="col">
                                    {{ciclos_paros}}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <b>Unidades Totales Producidas:</b> 
                                </div>
                                <div class="col">
                                    {{undsprod}}
                                </div>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>

        <div class="row" v-show="selectTab == 'info_detalle'">
            <div class="col">
                <div class="list-group mb-3">
                    <table class="wd-wide">
                        <tbody>
                            <tr>
                                <div class="card card-default">
                                    <div class="card-header">
                                        Razones de Paro (Tiempos dados en minutos)
                                    </div>
                                    <div :height="430">
                                        <b-table striped hover :foot-clone="true" :fields="fields" :items="donutdata">
                                            <template v-slot:cell(name)="row">
                                                    <div>
                                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if='row.item.detalle != ""' @click.prevent="content_details(row.item)"><i class="ion ion-md-create"></i></b-btn>
                                                        {{row.item.name}}
                                                    </div>
                                                </template>
                                <!-- total_cost  htime_total hcost_minutes ciclosparos -->
                                                <template v-slot:cell(total_cost)="row">
                                                    <div>
                                                        {{numberWithCommas(row.item.total_cost)}}
                                                    </div>
                                                </template>

                                                <template v-slot:cell(htime_total)="row">
                                                    <div>
                                                        {{numberWithCommas(row.item.htime_total)}}
                                                    </div>
                                                </template>

                                                <template v-slot:cell(hcost_minutes)="row">
                                                    <div>
                                                        {{numberWithCommas(row.item.hcost_minutes)}}
                                                    </div>
                                                </template>

                                                <template v-slot:cell(ciclosparos)="row">
                                                    <div>
                                                        {{numberWithCommas(row.item.ciclosparos)}}
                                                    </div>
                                                </template>

                                        </b-table>
                                    </div>
                                </div>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div v-if="selectTab == 'info_bitacora' || selectTab=='info_bitacora_calls'" >
            <div class="flex-grow-1 position-relative" style="height:600px">

            <perfect-scrollbar style="height: 600px; width:98%" class="ml-3 mb-3">
<!-- {{chatData}} -->
                    <div class="media ml-3 pb-1 mb-2" v-for="ll in chatData[0].llamadas" v-if="selectTab=='info_bitacora_calls'">
                        <div class="ui-feed-icon-container">
                            <span class="ui-icon ui-feed-icon fas fa-phone bg-success text-white"></span>
                        </div>
                        <div class="media-body align-self-center ml-3">
                            <h4 style="margin-bottom:0px"> {{ll.title}}</h4> 
                            <div class="text-muted small text-nowrap mt-0"><b>Fecha Inicio: </b>{{ll.start_date}} &nbsp; | &nbsp; <b>Fecha Fin: </b>{{ll.finish_date}} </div>
                            <div class="text-muted small text-nowrap mt-0"><b>Tiempo Transcurrido: </b>{{ll.elapsed_minutes}}</div>
                            <hr class="border-light" style="margin:0px">
                            
                                
                                    <markdown-it-vue class="md-body" :content="ll.message" />
                                    <div class="font-weight-semibold mb-1">
                                        {{ll.name}} {{ll.lastname}} | {{ll.created}}
                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/btc/det/'+ll.message_id}"  target='_blank' v-if="ll.documents" ><i class="fa fa-paperclip"></i></b-btn>
                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/btc/det/'+ll.message_id}"  target='_blank' v-if="!ll.documents" ><i class="fa fa-asterisk"></i></b-btn>
                                    </div>
                                
                            
                        </div>
                    </div>
                

                <div v-for="(message, index) in chatData" :key="message.id" class="mt-2" v-if="selectTab=='info_bitacora'">
                    
                    <!-- <span v-if="activity.tipo === 'TF'" class="ui-icon ui-feed-icon ion ion-md-checkmark bg-success text-white"></span>
                    <span v-if="activity.tipo === 'TFF'" class="ui-icon ui-feed-icon ion ion-md-arrow-dropright bg-success text-white"></span> -->
<!-- 
                    <div class="media ml-3 pb-1 mb-3" v-if="message.modulo == 'TP'">
                        <div class="ui-feed-icon-container">
                            <span  class="ui-icon ui-feed-icon ion ion-md-close bg-danger text-white"></span>
                        </div>
                        <div class="media-body align-self-center ml-3">
                            <h4 style="margin-bottom:0px"> {{message.codigo}} - {{message.producto}}</h4> 
                            <div class="text-muted small text-nowrap mt-0"><b>Fecha Inicio: </b>{{message.fechainicio}} &nbsp; | &nbsp; <b>Fecha Fin: </b>{{message.fechafin}} </div>
                            <hr class="border-light" >
                            <div v-for="msg in message.messages" :key="msg.created" :class="`chat-message-${msg.user_id == userInfo.iduser ? 'right' : 'left'}`" class="mb-4">
                                <div class="flex-shrink-1 rounded py-2 px-3" :class="msg.user_id == userInfo.iduser ? 'mr-3' : 'ml-3'">
                                    <markdown-it-vue class="md-body" :content="msg.message" />
                                    <div class="font-weight-semibold mb-1">
                                        
                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/btc/det/'+msg.message_id}"  target='_blank' v-if="msg.documents" ><i class="fa fa-paperclip"></i></b-btn>
                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/btc/det/'+msg.message_id}"  target='_blank' v-if="!msg.documents" ><i class="fa fa-asterisk"></i></b-btn>
                                        
                                        {{msg.user_id == userInfo.iduser ? 'Usted' : msg.username}} | {{msg.created}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> -->

                    <div class="media ml-3 pb-1 mb-2" v-if="message.modulo != 'CT'">
                        <div class="ui-feed-icon-container">
                            <span v-if="message.modulo == 'TP'" class="ui-icon ui-feed-icon ion ion-md-close bg-danger text-white"></span>
                            <span v-if="message.modulo == 'PD'" class="ui-icon ui-feed-icon ion ion-md-checkmark bg-success text-white"></span>
                        </div>
                        <div class="media-body align-self-center ml-3">
                            <h4 style="margin-bottom:0px"> {{message.codigo}} - {{message.producto}}</h4> 
                            <div class="text-muted small text-nowrap mt-0"><b>Fecha Inicio: </b>{{message.fechainicio}} &nbsp; | &nbsp; <b>Fecha Fin: </b>{{message.fechafin}} </div>
                            <hr class="border-light" style="margin:0px">
                            <div v-for="msg in message.messages" :key="msg.created" :class="`chat-message-${msg.user_id == userInfo.iduser ? 'right' : 'left'}`" class="mb-4">
                                <div class="flex-shrink-1 border-lighter rounded py-2 px-3" :class="msg.user_id == userInfo.iduser ? 'mr-3' : 'ml-3'">
                                    <markdown-it-vue class="md-body" :content="msg.message" />
                                    <div class="font-weight-semibold mb-1">
                                        {{msg.user_id == userInfo.iduser ? 'Usted' : msg.username}} | {{msg.created}}
                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/btc/det/'+msg.message_id}"  target='_blank' v-if="msg.documents" ><i class="fa fa-paperclip"></i></b-btn>
                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/btc/det/'+msg.message_id}"  target='_blank' v-if="!msg.documents" ><i class="fa fa-asterisk"></i></b-btn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="media ml-0 pb-1 rounded mb-2 bg-lighter" v-if="message.modulo == 'CT'">
                        <!-- <div class="ui-feed-icon-container">
                            <span v-if="message.modulo == 'TP'" class="ui-icon ui-feed-icon ion ion-md-close bg-danger text-white"></span>
                            <span v-if="message.modulo == 'PD'" class="ui-icon ui-feed-icon ion ion-md-checkmark bg-success text-white"></span>
                        </div> -->
                        <div class="media-body align-self-center ml-3">
                            <!-- <h4 style="margin-bottom:0px"> {{message.codigo}} - {{message.producto}}</h4> 
                            <div class="text-muted small text-nowrap mt-0"><b>Fecha Inicio: </b>{{message.fechainicio}} &nbsp; | &nbsp; <b>Fecha Fin: </b>{{message.fechafin}} </div>
                            <hr class="border-light" > -->
                            <div class="text-center mt-2">
                                    <h4> Informacion de Cierre de Turno</h4>
                                    <p>
                                        {{message.message == null ? 'Informacion no Disponible' : message.message}}
                                    </p>
                                </div>
                                 <b-table small show-empty stacked="md" :items="message.performance" :fields="[{key:'idordenproduccion', label:'# OP'},{key:'codigo', label:'Codigo'},{key:'producto', label:'Producto'},{key:'esperado', label:'Und Esperadas'},{key:'totalproducido', label:'Und Producido'},{key:'tiempototaltrabajo', label:'Min Trabajado'},{key:'microparos', label:'Min Perdidos'},{key:'eficiencia', label:'Eficiencia'}]">

                                    <template v-slot:cell(eficiencia)="row">
                                        <div class="text-left">
                                            {{((row.item.totalproducido / row.item.esperado)*100).toFixed(2)}}
                                        </div>
                                    </template>

                                 </b-table>
                            <!-- <div v-for="msg in message.messages" :key="msg.created" :class="`chat-message-${msg.user_id == userInfo.iduser ? 'right' : 'left'}`" class="mb-4">
                                <div class="flex-shrink-1 border-lighter rounded py-2 px-3" :class="msg.user_id == userInfo.iduser ? 'mr-3' : 'ml-3'">
                                    <markdown-it-vue class="md-body" :content="msg.message" />
                                    <div class="font-weight-semibold mb-1">
                                        {{msg.user_id == userInfo.iduser ? 'Usted' : msg.username}} | {{msg.created}}
                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/btc/det/'+msg.message_id}"  target='_blank' v-if="msg.documents" ><i class="fa fa-paperclip"></i></b-btn>
                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/btc/det/'+msg.message_id}"  target='_blank' v-if="!msg.documents" ><i class="fa fa-asterisk"></i></b-btn>
                                    </div>
                                </div>
                            </div> -->
                        </div>
                    </div>

                    <!-- <span v-if="activity.tipo === 'TSS' && activity.color=='FF8C00'" class="ui-icon ui-feed-icon ion ion-md-arrow-dropright bg-warning text-body"></span>
                    <span v-if="activity.tipo === 'TSS' && activity.color!='FF8C00'" class="ui-icon ui-feed-icon ion ion-md-arrow-dropright bg-danger text-white "></span> -->
                    <!-- <div v-if="index == 0" class="mb-2">
                    </div>
                    <div class="flex-shrink-1 rounded py-2 px-0" :class="message.modulo == 'TP' ? 'border border-warning' : message.modulo == 'CL' ? 'border border-info' : 'border border-success'">
                        <div v-if="message.modulo != 'CT'" class="font-weight-semibold mb-1 boder border-bottom" :class="message.modulo == 'TP' ? 'border-warning' : message.modulo == 'CL' ? 'border-info' : 'border-success'">
                            <div class="mr-2 text-center">
                                {{message.codigo}} - {{message.producto}}
                                <div class="text-muted small text-nowrap mt-0"><b>Fecha Inicio: </b>{{message.fechainicio}}  <b>Fecha Fin: </b>{{message.fechafin}} </div>
                            </div>
                        </div>
                        <div v-if="message.modulo == 'CT'" class="font-weight-semibold mb-1 boder border-bottom" :class="message.modulo == 'TP' ? 'border-warning' : message.modulo == 'CL' ? 'border-info' : 'border-success'">
                            <div class="mr-2 text-center">
                                {{message.codigo}} - {{message.producto}}
                                <div class="text-muted small text-nowrap mt-0"><b>Fecha Inicio: </b>{{message.fechainicio}}  <b>Fecha Fin: </b>{{message.fechafin}}</div>                                
                            </div>
                        </div>
                            <div v-if="message.modulo == 'CT'" class="mb-2">
                                <div class="text-center">
                                    <h4> Informacion de Cierre de Turno</h4>
                                    <p>
                                        {{message.message == null ? 'Informacion no Disponible' : message.message}}
                                    </p>
                                </div>
                                 <b-table small show-empty stacked="md" :items="message.performance" :fields="[{key:'idordenproduccion', label:'# OP'},{key:'codigo', label:'Codigo'},{key:'producto', label:'Producto'},{key:'esperado', label:'Und Esperadas'},{key:'totalproducido', label:'Und Producido'},{key:'tiempototaltrabajo', label:'Min Trabajado'},{key:'microparos', label:'Min Perdidos'},{key:'eficiencia', label:'Eficiencia'}]">

                                    <template v-slot:cell(eficiencia)="row">
                                        <div class="text-left">
                                            {{((row.item.totalproducido / row.item.esperado)*100).toFixed(2)}}
                                        </div>
                                    </template>

                                 </b-table>
                            </div>

                        <div v-for="msg in message.messages" :key="msg.created" :class="`chat-message-${msg.user_id == userInfo.iduser ? 'right' : 'left'}`" class="mb-4">
                            <div class="flex-shrink-1 bg-lighter rounded py-2 px-3" :class="msg.user_id == userInfo.iduser ? 'mr-3' : 'ml-3'">
                            <div class="font-weight-semibold mb-1">
                                
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/btc/det/'+msg.message_id}"  target='_blank' v-if="msg.documents" ><i class="fa fa-paperclip"></i></b-btn>
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/btc/det/'+msg.message_id}"  target='_blank' v-if="!msg.documents" ><i class="ion ion-md-create"></i></b-btn>
                                
                                {{msg.user_id == userInfo.iduser ? 'Usted' : msg.username}} | {{msg.created}}</div>
                            
                            <markdown-it-vue class="md-body" :content="msg.message" />
                            </div>
                            
                        </div> 
                    </div>-->
                </div> 

            </perfect-scrollbar>
          </div>
        </div>

        <div v-for="wscode in selectedWorkstation" v-if="selectedWorkstation.length==1">
            <!-- {{wscode.code}} -->
            <div :id="wscode.code+'velocity'" style="height:140px"></div>
            <div :id="wscode.code+'timeline'" style="height: 110px;"></div>
        </div>



        <sweet-modal ref="detallestopcode" width="90%" title="Detalle Tiempo de Paro">
            <!-- <b-tabs class="nav-tabs-top nav-responsive-xl"> -->
                <!-- <b-tab title="Detalle Tiempos de Paro" active>
                    <h4 class="ml-2 mt-4">Detalle Tiempo de Paro</h4>
                    <b-table striped hover small :fields="fields_details" :items="items_details">
                    </b-table>
                </b-tab>
                <b-tab title="Detalle Causa Raiz"> -->
                    <h4 class="ml-2 mt-4">Detalle Causa Raiz</h4>
                    <div id="containerroot" style="min-width: 250px; height: 400px; max-width: 600px; margin: 0 auto"></div>
                    <b-table striped hover small :fields="fields_details" :items="items_details">
                    </b-table>
                <!-- </b-tab>
            </b-tabs> -->
        </sweet-modal>
        <sweet-modal ref="detallevelocidades" width="90%" title="Detalle de Velocidades">
            <b-table striped hover small :fields="fields_details" :items="items_details">
            </b-table>
        </sweet-modal>
    </div>
</template>
<style src="@/vendor/styles/pages/chat.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import Multiselect from 'vue-multiselect'
import {reports} from "@/components/i40/js/globals"
import moment from "moment";
import { infotimeseries } from "@/components/i40/js/timeseries";
import ObtenerColorOEE from "@/components/i40/js/floor/colorsOEE.js"
// Import this component
import datePicker from "vue-bootstrap-datetimepicker";
// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

import Vue from "vue";
import VueResource from 'vue-resource'
import LightTimeline from "vue-light-timeline";
import { infomaster } from "@/components/i40/js/master";
import { infotraza } from "@/components/i40/js/traza";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import DoughnutChart from 'vue-doughnut-chart'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'

import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'

Vue.use(VueResource)
import { CrearPDF } from "@/vendor/js/funx"

Vue.use(LightTimeline);
const theme = "red";

export default {
    metaInfo: {
        title: 'Resumen General de la Operacion'
    },
  components: {
      MarkdownItVue,
    'donut-chart': DoughnutChart,
    Multiselect,
    // Scrollable,
    datePicker,
    SweetModal, 
    SweetModalTab ,
    PerfectScrollbar
  },
watch:{
    'selectedStopCodeDescriptions':function(params) {
        this.plot_stoptime("container", params, "a2", this)
        this.donutdata = params //.sort(this.GetSortOrder("y"))
    }
},
  data() {
    return {
        chatData:[],                                                                                            
        messageContent:false,
        shortContent:'',
        content:'',
        selectedformessage:{},
        userInfo:{},
        titleHeader:"",
      days:1,
      sideboxOpen: false,

      // wsselected = '',

      user: {
        avatar: '1-small.png'
      },

      chatUser:{},

      contactsData: [],

      chatData: {},
        timesResult:[],
        detalleUnidades:[],
        selectTab:'info_general',
        infoOEE:null,
        detalleIndicadores:null,
        titleHeader:"",
        workstationGroup:[],
        selectedWorkstation:null,
        donutdata: [],
        items: [],
        items2: [],
        dateStart:null,
        dateFinsh:null,
        options: {
            format: "YYYY-MM-DD HH:mm",
            //useCurrent: false
            // minDate:Date(), 
        },
        fields: [
            {
                key: 'name',
                label: 'Descripción',
            },
            {
                key: 'y',
                label: 'Tiempo (m)',
            },
            {
                key: 'total_cost',
                label: '$ Total',
            },
            {
                key: 'htime_total',
                label: 'Personal (min)',
            },
            {
                key: 'hcost_minutes',
                label: '$ Personal',
            },
            {
                key: 'ciclosparos',
                label: 'Ciclos',
            },
        ],
        fields_details: [
            {
                key: 'fechainicio',
                label: 'Inicio',
            },
            {
                key: 'fechafin',
                label: 'Fin',
            },
            {
                key: 'tiempototal',
                label: 'Min',
            },
            {
                key: 'ciclosparos',
                label: 'Ciclos',
            },
            {
                key: 'notas',
                label: 'Notas',
            },
        ],
        json_fields : {
            "descripcion"      : "String",
            "turno"      : "Number",
            "inicio"   : "String",
            "Fin" : "String",
            "TiempoTotal"    : "Number"
        },
        json_meta: [
            [{
                "key": "charset",
                "value": "utf-8"
            }]
        ],
        tiempo_total_operacion: 0,
        totales_minutes: 0,
        ciclos_paros: 0,
        undsprod: 0,
        items_details :[],
        fields_root: [
            {
                key: 'code',
                label: 'Codigo',
            },
            {
                key: 'description',
                label: 'Descripcion',
            },
            {
                key: 'tt',
                label: 'Tiempo (Min)',
            },
            {
                key: 'ciclos',
                label: 'Ciclos',
            },
        ],
        items_root: [],
        stopcodeDescriptions:[],
        selectedStopCodeDescriptions:[],
    };
  },
  methods: {

    GetSortOrder(prop) {    
        return function(a, b) {    
            if (a[prop] > b[prop]) {    
                return 1;    
            } else if (a[prop] > b[prop]) {    
                return -1;    
            }    
            return 0;    
        }    
    },
    
    numberWithCommas(x) {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    },
    
    getColor(value){
        value = value == null?0:value
        return ObtenerColorOEE(value)
    },

    loadOEEIndicators(chart, value){
        Highcharts.chart(chart, {
            chart: {
                type: 'pie',
            },
            title: {
                verticalAlign: 'middle',
                floating: true,
                text: `${value}%`
            },
            tooltip: {
            enabled: false
        },
        plotOptions: {
            pie: {
                innerSize: '85%',
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                enabled: false,
                format: "{point.name}: {point.percentage:.1f}%",
                },
            },
        },
        series: [{
            data: [{name: 'Disponibilidad', y:value, color: this.getColor(value)}, {name:'', y:value>100 ? value : 100-value, color:"#ececec"}]
            }]
        });
    },

    loadVelocity(nameControl, data, setpoint){
        Highcharts.chart(nameControl, {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Ciclos por Tiempo'
            },
       
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Ciclos'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: 'Ciclos por Tiempo',
                data: data
            },{
                type: 'line',
                name: 'Ciclos Esperados',
                data: setpoint
            }]
        });
    },

    content_details(item){
        if(!item.description.includes("TT -")){
            this.fields_details= [
                {
                    key: 'codigo',
                    label: 'Codigo',
                },
                {
                    key: 'description',
                    label: 'Descripción',
                },
                {
                    key: 'tiempototal',
                    label: 'Tiempo Total Paros (Min)',
                },
                {
                    key: 'fechainicio',
                    label: 'Fecha Inicio',
                },
                {
                    key: 'fechafin',
                    label: 'Fecha Fin',
                },
                {
                    key: 'atiende',
                    label: 'Atiende',
                },
            ],
            
            this.items_details = JSON.parse(item.detalle)
            this.items_root = JSON.parse(item.detalle_root)
            // console.log(this.items_details)
            if(this.items_root != ""){
                let root_plot = []

                for (let index = 0; index < this.items_root.length; index++) {
                    const element = this.items_root[index];
                    root_plot.push({y:element.tt, name:element.description})
                    
                    
                }
                // console.log(root_plot)
                this.plot_stoptime("containerroot", root_plot,"a1")
                this.$refs.detallestopcode.open()
            }
        }else{
            this.items_details = JSON.parse(item.detalle)

            this.fields_details= [
                {
                    key: 'codigo',
                    label: 'Codigo',
                },
                {
                    key: 'producto',
                    label: 'Producto',
                },
                {
                    key: 'tiemporealw',
                    label: 'Tiempo Real Trabajo (Min)',
                },
                {
                    key: 'undsproducidas',
                    label: 'Unds Producidas',
                },
                {
                    key: 'valocidadxminuto',
                    label: 'Unidades x Minuto',
                },
            ],

            this.$refs.detallevelocidades.open()
        }
    },

    download (){
        var columns = [
            {title: "Descripcion", dataKey: "descripcion"},
            {title: "Turno", dataKey: "turno"}, 
            {title: "Inicio", dataKey: "inicio"},
            {title: "Fin", dataKey: "Fin"},
            {title: "Tiempo Total", dataKey: "TiempoTotal"},
        ];

        var columnsx = [
            {
                dataKey: 'name',
                title: 'Descripción',
            },
            {
                dataKey: 'time',
                title: 'Tiempo (m)',
            },
        ]
        var items_resumen = []
        for (let index = 0; index < this.donutdata.length; index++) {
            const element = this.donutdata[index];
            if(!element.name.includes('TIEMPO DE TRANSFORMACION')){
                
                items_resumen.push({name: element.name, time: element.y})
            }
            
        }

        
        var titlePDF = '                       CENTRO DE TRABAJO: '+this.titleHeader
        var infoFecha = 'Fecha Inicial: '+this.dateStart+' - Fecha Final: '+ this.dateFinsh

        let logo_company = `${this.publicUrl}img/logo_compania.jpg`
        let logo = `${this.publicUrl}img/logo.png`

        var doc = CrearPDF(titlePDF, infoFecha, columns, this.items2,logo_company,logo)
        let first = doc.autoTable.previous;
                // console.log(this.data)

                // doc.autoTable(columnsx, items_resumen, {
                //     startY: first.finalY + 10,
                //     showHeader: 'firstPage',
                //     styles: { fontSize: 6},
                //                 columnStyles: {
                //                     id: {fontSize: 6}
                //                 },
                    
                // });

            doc.setFontSize(12);
            doc.text("Total de Paros", 40, first.finalY + 20);
            

           doc.autoTable(columnsx, items_resumen, {
            startY: first.finalY + 30,
            styles: { fontSize: 7},
            columnStyles: {
                id: {fontSize: 7}
            },
            margin: {top: 30}})

        first = doc.autoTable.previous;

        // console.log(this.items2)

        
        doc.setFontSize(8);
        doc.text("----------------FIN DEL INFORME ----------------", 210, first.finalY + 20);
        doc.setFontSize(9);
        doc.text("Observaciones:", 60, first.finalY + 30);
        doc.setFontSize(9);
        doc.text("Revisó:", 60, first.finalY + 70);

        doc.save('paros_por_centros_trabajo.pdf');
    },

    informacionReporte: function(){
        var paramtros =
                this.selectedWorkstation.description +
                "/" +
                this.dateStart +
                ":00/" +
                this.dateFinsh +
                ":59";
                
        this.$http
                .get(reports+"/obtenerDetalleReporteParosCentroTrabajo/" + paramtros
                )
                .then(respuesta => {
                    return respuesta.json();
                })
                .then(usuarios => {
                    this.items2 = usuarios;
                });

    },

    getColorTimeline(element, series){
        if(series != undefined){
            for (let index = 0; index < series.length; index++) {
                const e = series[index];
                if(element.color == '#40a070'){
                    if(e.name.includes('TIEMPO DE TRANSFORMACION')){
                        return e.color
                    }
                }else{
                    if(e.name.includes(element.descripcion)){
                        return e.color
                    }        
                }
            }
        }
    },
      
    async cargarDatos(valor) {

        let wscodes = ""
        let firstCode = ''

        for (let index = 0; index < this.selectedWorkstation.length; index++) {
            const element = this.selectedWorkstation[index];
            if(index ==0){
                firstCode = element.code
            }
            wscodes = wscodes + `'${element.code}'` + (index+1 < this.selectedWorkstation.length ? ',':'')
        }
        // console.log(wscodes)

        // this.informacionReporte()

        this.titleHeader = this.selectedWorkstation.description
        var paramtros = this.selectedWorkstation.code + "/" + this.dateStart + ":00/" + this.dateFinsh + ":59";

        infotraza.getinfows(firstCode + "/" + this.dateStart + ":00/" + this.dateFinsh + ":59").then(data =>{
            this.chatData = data.data
        })


        this.$http.post(reports+'/obtenerDetalleOEEWorkPlace/'+paramtros, wscodes)
        .then(respuesta =>{
            return respuesta
        })
        .then(resultado =>{
            for (let index = 0; index < resultado.data.length; index++) {
                const element = resultado.data[index];
                if (element.detalle == "OEE") {
                    this.infoOEE =  JSON.parse(element.resultados)[0]

                    this.loadOEEIndicators('oee', this.infoOEE.oee)
                    this.loadOEEIndicators('disponibilidad', this.infoOEE.disponibilidad)
                    this.loadOEEIndicators('eficiencia', this.infoOEE.eficiencia)
                    this.loadOEEIndicators('calidad', this.infoOEE.calidad)
                }  

                if (element.detalle == "ResultadoTiempos") {
                    this.timesResult = JSON.parse(element.resultados)
                }

                if (element.detalle == "DetalleUnidades") {
                    this.detalleUnidades = JSON.parse(element.resultados)
                }
            }
        });

        this.stopcodeDescriptions = []

        await this.$http
            .post(
                reports+"/obtenerDetalleParosCentroTrabajo/" + paramtros, wscodes
            )
            .then(respuesta => {
                return respuesta.json();
            })
            .then(usuarios => {
                this.totales_minutes = 0
                this.ciclos_paros = 0
                this.undsprod = 0
                this.tiempo_total_operacion=0
                let info_chart = []

                for (let index = 0; index < usuarios.length; index++) {
                    const element = usuarios[index];
                    if(!element.description.includes("TT -")){
                        this.totales_minutes += element.y
                        this.ciclos_paros += element.ciclosParos
                    }

                    this.tiempo_total_operacion += element.y
                    this.undsprod += element.undsprod
                    info_chart.push({name: (element.detalle != null?"* ":"" )+ element.name + ' (' + element.y + ')', y: element.y, fullcontent:element })
                    this.stopcodeDescriptions.push({code:element.name, description:element.name, 
                    ciclosparos: element.ciclosparos, description: element.description, detalle: element.detalle, detalle_root: element.detalle_root, hcost_minutes: element.hcost_minutes, 
                        htime_total: element.htime_total, total_cost: element.total_cost, undsprod: element.undsprod, y: element.y,
                    name: (element.detalle != null?"* ":"" )+ element.name + ' (' + element.y + ')', y: element.y, fullcontent:element })
                }
                this.selectedStopCodeDescriptions = this.stopcodeDescriptions
                this.donutdata = usuarios;
                this.plot_stoptime("container", info_chart, "ax2", this)
            });

            



        if (this.selectedWorkstation.length==1){
           let series = []

            for (let index = 0; index < Highcharts.charts.length; index++) {
                const element = Highcharts.charts[index];
                if(element != undefined)
                    if(element["renderTo"].id == "container")
                        series=element.series[0].data
            }

            for (let index = 0; index < this.selectedWorkstation.length; index++) {
                const element = this.selectedWorkstation[index];
                paramtros = element.code + "/" + this.dateStart + ":00/" + this.dateFinsh + ":59";
                
                this.$http.get(reports+"/obtenerfulltimelinecentrotrabajo/" + paramtros)
                .then(respuesta => {
                    return respuesta.json();
                })
                .then(usuarios => {
                    var container = document.getElementById(element.code+'timeline');
                    var chart = new google.visualization.Timeline(container);
                    var dataTable = new google.visualization.DataTable();
                    dataTable.addColumn({ type: 'string', id: 'Eventos' });
                    dataTable.addColumn({ type: 'string', id: 'Evento' });
                    dataTable.addColumn({ type: 'string', role: 'style' });
                    dataTable.addColumn({ type: 'date', id: 'Start' });
                    dataTable.addColumn({ type: 'date', id: 'End' });

                    let color = []
                    let rows = []

                    for (let index = 0; index < usuarios.length; index++) {
                        const element = usuarios[index];
                        var dt = new Date(element.fechainicio);
                        var dtf = new Date(element.fechafin);
                        rows.push(['Timeline',element.descripcion, this.getColorTimeline(element, series), new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds()), new Date(dtf.getFullYear(), dtf.getMonth(), dtf.getDate(), dtf.getHours(), dtf.getMinutes(), dtf.getSeconds())])
                    }

                    var options = {timeline: { showBarLabels: false }};
                    dataTable.addRows(rows);
                    chart.draw(dataTable, options);

                    this.items = usuarios
                });

                var params = "tags:"+element.code + ":velocity" + "/" + this.dateStart.replace(/ /g, "T") + ":00Z/" + this.dateFinsh.replace(/ /g, "T") + ":00Z";

                let velocity = []
                let setpoint = []
                await infotimeseries.get_content_time_series([],params).then(data =>{
                    velocity = data.data
                    
                });

                params = "tags:"+element.code + ":velocity:set" + "/" + this.dateStart.replace(/ /g, "T") + ":00Z/" + this.dateFinsh.replace(/ /g, "T") + ":00Z";

                await infotimeseries.get_content_time_series([],params).then(data =>{
                    setpoint = data.data
                });

                // console.log(element.code+'velocity', velocity)


                this.loadVelocity(element.code+'velocity', velocity)
                // this.loadVelocity(element.code+'velocity', setpoint)
                
            }
        }
    },
    
    plot_stoptime(div_info, items, name, compo){
        // console.log(items)
        Highcharts.chart(div_info, {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: "pie"
            },
            title: {
              text: ""
            },
            tooltip: {
              pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                    enabled: true,
                    format: "{point.name}: {point.percentage:.1f}%",
                    style: {
                        color:
                        (Highcharts.theme &&
                            Highcharts.theme.contrastTextColor) ||
                        "black"
                    }
                },

                events: {
                    click: function (event) {
                        if(event.point.options.fullcontent.detalle != ""){
                            compo.content_details(event.point.options.fullcontent)
                        }
                       
                    }
                }
            },

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
    
  },

  mounted() {
    this.loadOEEIndicators('oee', 0)
    this.loadOEEIndicators('disponibilidad', 0)
    this.loadOEEIndicators('eficiencia', 0)
    this.loadOEEIndicators('calidad', 0)

    this.plot_stoptime("container", {name:"-", y: 0 }, "a2", this)
  },

  created() {
        google.charts.load('current', {'packages':['timeline']});
        infomaster.workstation([],"select").then(data => {
            // console.log(data.data[0].workstation)
            this.workstationGroup = data.data[0].workstation
        })
     },
};
</script>
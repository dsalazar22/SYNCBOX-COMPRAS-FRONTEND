<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Presupuesto  <span class="font-weight-light"> | {{pptotipo == 'cmr' ? 'COMERCIAL' : 'PRODUCCION'}}</span></h4>
        <div class="w-100 text-right"></div>
        
         <b-nav class="justify-content-end mt-2 mb-2">
                <b-nav tabs class="nav-sm tabs-alt">
                    <b-nav-item :active="selectTab=='ver_registros'" @click="selectTab='ver_registros'">Ver Registros</b-nav-item>
                    <b-nav-item :disabled="disabled_loadfile" :active="selectTab=='subir_archivos'" @click="selectTab='subir_archivos'">Subir Maestros</b-nav-item>
                <!-- <b-nav-item disabled>Disabled</b-nav-item> -->
                </b-nav>
            </b-nav>

            <div v-if="selectTab=='ver_registros'">

                <div v-if="datosCompletos != null" class="text-center">
                    <div class="h4" style="margin-bottom:0px">
                        PRESUPUESTO ACTUAL | <span class="font-weight-light">{{datosCompletos[0].pp_year}}</span>
                    </div>
                    <b> FECHA DE CREACION: </b> {{datosCompletos[0].created}} | <b>CREADO POR:</b> {{datosCompletos[0].username}}
                    <div class="row" v-if="!datosCompletos[0].is_active">
                        <div class="col">
                            <b-btn variant="danger" block @click="cancelPresupuesto"><i class="ion ion-md-close"> </i> &nbsp;&nbsp; CANCELAR PRESUPUESTO</b-btn>
                        </div>
                        <div class="col">
                            <b-btn variant="warning" block @click="activatePresupuesto"><i class="ion ion-md-checkmark"> </i> &nbsp;&nbsp; ACTIVAR PRESUPUESTO</b-btn>
                        </div>
                    </div>

                    <div v-if="datosCompletos[0].is_active">
                        <b-btn size="xs" variant="danger" block @click="$refs.descartarPresupuesto.open()"><i class="ion ion-md-close"> </i> &nbsp;&nbsp; DESCARTAR ESTE PRESUPUESTO</b-btn>
                    </div>
                    
                </div>


                <!-- <input-tag class="input-tag-primary" v-model="tagsCCostos" /> -->
                
                <b-table responsive small show-empty :items="tblOriginal" :fields="columns"
                    :filter="filter" @filtered="onFiltered"  :style="{'max-height': (windowHeight+600).toString()+'px'}" 
                    class="h-100 w-100 bg-white mt-2" :no-border-collapse="false" 
                    style="font-size:12px"
                    :sticky-header="true" :hover="true" :striped="true" :bordered="true">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="check_access('admin_um', 'c')" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>

                    <template v-slot:cell(description)="row">
                        <div class="text-left text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{row.item.description}}
                        </div>
                    </template>

                    <template v-slot:cell(code)="row">
                        <div class="text-left text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{row.item.code}}
                        </div>
                    </template>

                    <template v-slot:cell(costo)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.costo)}}
                        </div>
                    </template>

                    <template v-slot:cell(enero)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.enero)}}
                        </div>
                    </template>

                    <template v-slot:cell(febrero)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.febrero)}}
                        </div>
                    </template>

                    <template v-slot:cell(marzo)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.marzo)}}
                        </div>
                    </template>

                    <template v-slot:cell(abril)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.abril)}}
                        </div>
                    </template>

                    <template v-slot:cell(mayo)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.mayo)}}
                        </div>
                    </template>

                    <template v-slot:cell(junio)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.junio)}}
                        </div>
                    </template>

                    <template v-slot:cell(julio)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.julio)}}
                        </div>
                    </template>

                    <template v-slot:cell(agosto)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.agosto)}}
                        </div>
                    </template>

                    <template v-slot:cell(septiembre)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.septiembre)}}
                        </div>
                    </template>

                    <template v-slot:cell(octubre)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.octubre)}}
                        </div>
                    </template>

                    <template v-slot:cell(noviembre)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.noviembre)}}
                        </div>
                    </template>

                    <template v-slot:cell(diciembre)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.diciembre)}}
                        </div>
                    </template>

                    <template v-slot:cell(total)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.total)}}
                        </div>
                    </template>

                    <template v-slot:cell(prom)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.prom)}}
                        </div>
                    </template>

                </b-table>
                 <div class="d-flex justify-content-between">
                    <div>
                        <!-- <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" /> -->
                    </div>
                    <div class="text-muted">
                        <small> Total Registros: {{this.totalRows}} </small>
                    </div>
                </div>
            </div>

            <div v-if="selectTab=='subir_archivos'">
                
                <b-form-file
                    v-if="!file1"
                        v-model="file1"
                        :state="Boolean(file1)"
                        placeholder="Seleccion un archivo o arrastre aqui..."
                        drop-placeholder="Arrastre un archivo aqui..."
                        ></b-form-file>
                    <div v-if="file1" class="text-center">
                        <b>Archivo Seleccionado:</b> {{ file1 ? file1.name : '' }}
                    </div>
                    <div class="row" v-if="file1">
                        <div class="col">
                            <b-btn variant="warning" block @click="file1=null; title_import=''; tableData=[]; infook=false"><i class="ion ion-md-close"> </i> &nbsp;&nbsp; Cargar Otro Presupuesto</b-btn>
                        </div>
                        <div class="col">
                            <b-btn v-if="!infook" variant="info" block @click="cargarArchivo" ><i class="ion ion-md-checkmark"></i> &nbsp;&nbsp; Subir Presupuesto</b-btn>
                            <b-btn v-if="infook" variant="success" block @click="showSaveFile=true" ><i class="ion ion-md-checkmark"></i> &nbsp;&nbsp; Guardar Presupuesto</b-btn>
                        </div>
                    </div>

                    <div :class="'h4 mt-2 text-center text-' + (infook ? 'success' : 'danger')"> {{this.title_import}}</div>

                <b-table small show-empty stacked="md" :items="tblOriginal" :fields="columns" class="mt-2"
                    :filter="filter" @filtered="onFiltered">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="check_access('admin_um', 'c')" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                    <template v-slot:cell(ccontablecode)="row">
                        <div class="text-left text-nowrap">
                            <b-btn v-if="!row.item.puc_id && row.item.ccontablecode !=''" variant="outline-danger borderless icon-btn" class="btn-xs" 
                                @click="openPUC(row.item)"><i class="ion ion-md-remove-circle"></i></b-btn>
                            <span style="color:green" v-if="row.item.puc_id && row.item.ccontablecode !=''"><i class="ion ion-md-add-circle"></i></span>
                            {{row.item.ccontablecode}}
                        </div>
                    </template>
                    <template v-slot:cell(ccostoscode)="row">
                        <div class="text-left text-nowrap">
                            <b-btn v-if="!row.item.cc_id && row.item.ccontablecode !=''" variant="outline-danger borderless icon-btn" class="btn-xs" 
                            @click="openCC(row.item)"><i class="ion ion-md-remove-circle"></i></b-btn>
                            <span style="color:green" v-if="row.item.cc_id && row.item.ccontablecode !=''"><i class="ion ion-md-add-circle"></i></span>
                            {{row.item.ccostoscode}}
                        </div>
                    </template>

                    <template v-slot:cell(ccosctoddesc)="row">
                        <div class="text-left text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{row.item.ccosctoddesc}}
                        </div>
                    </template>

                    <template v-slot:cell(ccontabledesc)="row">
                        <div class="text-left text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{row.item.ccontabledesc}}
                        </div>
                    </template>

                    <template v-slot:cell(costo)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.costo)}}
                        </div>
                    </template>

                    <template v-slot:cell(enero)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.enero)}}
                        </div>
                    </template>

                    <template v-slot:cell(febrero)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.febrero)}}
                        </div>
                    </template>

                    <template v-slot:cell(marzo)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.marzo)}}
                        </div>
                    </template>

                    <template v-slot:cell(abril)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.abril)}}
                        </div>
                    </template>

                    <template v-slot:cell(mayo)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.mayo)}}
                        </div>
                    </template>

                    <template v-slot:cell(junio)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.junio)}}
                        </div>
                    </template>

                    <template v-slot:cell(julio)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.julio)}}
                        </div>
                    </template>

                    <template v-slot:cell(agosto)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.agosto)}}
                        </div>
                    </template>

                    <template v-slot:cell(septiembre)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.septiembre)}}
                        </div>
                    </template>

                    <template v-slot:cell(octubre)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.octubre)}}
                        </div>
                    </template>

                    <template v-slot:cell(noviembre)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.noviembre)}}
                        </div>
                    </template>

                    <template v-slot:cell(diciembre)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.diciembre)}}
                        </div>
                    </template>

                    <template v-slot:cell(total)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.total)}}
                        </div>
                    </template>

                    <template v-slot:cell(prom)="row">
                        <div class="text-right text-nowrap">
                            <!-- <i class="ion ion-md-create"></i> -->
                            {{numberWithCommas(row.item.prom)}}
                        </div>
                    </template>

                </b-table>

            </div>

        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                    El registro será borrado de forma lógica, pero su información será visible en reportes. 
                </div>
                
                <template slot="button"><b-btn v-if="check_access('admin_um', 'd')" @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

            <sweet-modal icon="error" title="Borrar registro" ref="descartarPresupuesto">
                ¿Está seguro que desea descartar el presupuesto?
                <div class="w-100 text-center">
                    Si descata este presupuesto, debera volverlo a cargar.
                </div>
                
                <template slot="button"><b-btn @click="ejecutarDescartePPTO()" variant="danger" class="mr-2">Descartar Presupuesto</b-btn></template>
                <template slot="button"><b-btn @click="$refs.descartarPresupuesto.close()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>

          <b-modal id="modals-top" v-model="showFormularioPUC"  class="modal-center" size="md">
            <div slot="modal-title">
                Plan Unico de Cuentas <span class="font-weight-light">PUC</span><br>
                <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group label="Numero de Cuenta">
                    <b-input placeholder="Numero de Cuenta" v-model.trim="objInfo.code"/>
                </b-form-group>
                <b-form-group label="Descripción">
                    <b-input placeholder="Descripción" v-model.trim="objInfo.description" />
                </b-form-group>
                <b-form-group label="Tipo de Cuenta">
                    <multiselect
                        v-model="selectedTipoCuenta"
                        :options="tipoCuentas"
                        placeholder="Tipo de Cuenta"
                        label="description"
                        track-by="description" />
                </b-form-group>
                <b-form-group label="Factor">
                    <div class="row">
                        <div class="col"><b-check v-model="objInfo.type_primary" >Cuenta Primaria</b-check></div>
                    </div>
                </b-form-group>
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="showFormularioPUC = false">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" v-if="check_access('admin_um', 'c')" @click="submitPUC()">Guardar</b-btn>
            </div>
        </b-modal>

        <b-modal id="modals-top" v-model="showFormularioCC"  class="modal-center" size="lg">
            <div slot="modal-title">
            Maestros <span class="font-weight-light">Centros de Costos</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group :feedback="objState.message" label="Codigo Centros de Costos">
                    <b-input placeholder="Codigo Centros de Costos" v-model.trim="objInfo.code"/>
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Descripción">
                    <b-input placeholder="Descripción" v-model.trim="objInfo.description" />
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Planta/CEDI">
                    <multiselect
                        v-model="itemPC"
                        :options="itemsPC"
                        placeholder="Planta/CEDI"
                        label="description" 
                        track-by="description" />
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Clase Centro de Costos">
                     <!-- <b-form-select v-model="itemCCC" :options="itemsCCC"></b-form-select> -->
                        <multiselect
                            v-model="itemCCC"
                            :options="itemsCCC"
                            placeholder="Clase Centro de Costos"
                            label="ssp"
                            track-by="ssp" />
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Fecha de Validez">
                        <div class="row">
                            <div class="col">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                                    <date-picker v-model="objInfo.start_date" :config="options"></date-picker>
                                </div>
                            </div>
                            <div class="col">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                                    <date-picker v-model="objInfo.finish_date" :config="options"></date-picker>
                                </div> 
                            </div>
                        </div>
                </b-form-group>
                <div>
                    <b-form-checkbox v-model="objInfo.inactive">{{objInfo.inactive ? 'Activo' : 'Inactivo'}}</b-form-checkbox>
                </div>
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="showFormularioCC=false">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" v-if="check_access('admin_um', 'c')" @click="submitCC()">Guardar</b-btn>
            </div>
        </b-modal>

        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="lg">
            <div slot="modal-title">
            Informacion <span class="font-weight-light">Presupuesto</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group :feedback="objState.message" label="Centro de Costos">
                     <b-form-select v-model="itemPC" :options="itemsPC"></b-form-select>
                </b-form-group>
                <b-form-group :feedback="objState.message" label="Plan Unico de Cuentas">
                     <b-form-select v-model="itemCCC" :options="itemsCCC"></b-form-select>
                </b-form-group>
                <div class="row">
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Enero">
                        <b-input placeholder="Enero" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Febrero">
                        <b-input placeholder="Febrero" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Marzo">
                        <b-input placeholder="Marzo" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Abril">
                        <b-input placeholder="Abril" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Mayo">
                        <b-input placeholder="Mayo" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Junio">
                        <b-input placeholder="Junio" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Julio">
                        <b-input placeholder="Julio" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Agosto">
                        <b-input placeholder="Agosto" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Septiembre">
                        <b-input placeholder="Septiembre" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Octubre">
                        <b-input placeholder="Octubre" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Noviembre">
                        <b-input placeholder="Noviembre" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                    <div class="col">
                        <b-form-group :feedback="objState.message" label="Diciembre">
                        <b-input placeholder="Diciembre" v-model.trim="objInfo.code"/>
                        </b-form-group>
                    </div>
                </div>

            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn variant="success" @click="cargarArchivo()">Guardar</b-btn>
            </div>
        </b-modal>

        <b-modal id="modals-top" v-model="showSaveFile"  class="modal-center" size="lg">
            <div slot="modal-title">
            Guardar <span class="font-weight-light">Presupuesto</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>
            <fieldset class="demo-vertical-spacing-sm">
                <b-form-group label="Ingrese el Año del Presupuesto">
                    <b-input placeholder="Ingrese el Año del Presupuesto" v-model.trim="pp_year"/>
                </b-form-group>
            </fieldset>
            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="showSaveFile=false">Cancelar</b-btn>
                <b-btn variant="success" @click="guardarArchivoDB()">Guardar</b-btn>
            </div>
        </b-modal>

        <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>

    </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/libs/vue-input-tag/vue-input-tag.scss" lang="scss"></style>

<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { infosysconfig } from "@/components/i40/js/sysconfig";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
    import { infocosts } from "@/components/i40/js/costs";
    import { infomaster } from "@/components/i40/js/master";
    import Multiselect from 'vue-multiselect'

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import {infousers} from '@/components/i40/js/users'
    import moment from "moment";
    // Import this component
    import datePicker from "vue-bootstrap-datetimepicker";
    // Import date picker css
    import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";


    import InputTag from 'vue-input-tag'
  
    Vue.use(Notifications)
    Vue.use(datePicker);

    export default {
    
        metaInfo: {
            title: 'Presupuesto Centro de Costos'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab,
            Multiselect,
            InputTag
            // datePicker,
        },
        watch: {
            '$route.path':function(value){
                this.pptotipo = this.$route.path.split('/')[this.$route.path.split('/').length-1]

                this.variantSaveButton="success",
                this.disabledcode=false,
                this.modified=false,
                this.tableData= [],
                this.tblOriginal= [],
                this.title_import='',
                this.infook=false,
                this.showSaveFile=false,
                this.pp_year=null,
                this.disabled_loadfile=false,
                this.datosCompletos=null,
                this.confirmDescartar=false,
                
                
                this.selectedTipoCuenta={}
                this.tipoCuentas=[]

                this.showData()
            },
            'tableData' :function(value) {
                this.tblOriginal = JSON.parse(JSON.stringify(value))
                let obj = {
                    cc_description:'',
                    cc_id:0,

                    total:0,
                    abril:0,
                    agosto:0,
                    diciembre:0,
                    enero:0,
                    febrero:0,
                    julio:0,
                    junio:0,
                    marzo:0,
                    mayo:0,
                    noviembre:0,
                    octubre:0,
                    septiembre:0,
                }
                for (let index = 0; index < value.length; index++) {
                    const element = value[index];

                    obj.abril = obj.abril + element.abril
                    obj.agosto = obj.agosto + element.agosto
                    obj.diciembre = obj.diciembre + element.diciembre
                    obj.enero = obj.enero + element.enero
                    obj.febrero = obj.febrero + element.febrero
                    obj.julio = obj.julio + element.julio
                    obj.junio = obj.junio + element.junio
                    obj.marzo = obj.marzo + element.marzo
                    obj.mayo = obj.mayo + element.mayo
                    obj.noviembre = obj.noviembre + element.noviembre
                    obj.octubre = obj.octubre + element.octubre
                    obj.septiembre = obj.septiembre + element.septiembre
                    obj.total = obj.total + element.total   
                }

                 obj.prom = obj.total/12

                this.tblOriginal.push(obj)

                this.totalRows = this.tblOriginal.length-1
            }
        },
        data: () => ({
            pptotipo:'',
            name: 'um',
            version: 'v1.0.0.0',
            selectTab:'ver_registros',

            file1:null,
            showFormularioCC : false,
            showFormularioPUC : false,
            
            objInfo:{},

            windowHeight: 0,

            itemPC:null,
            itemsPC:[],

            itemCCC:null,
            itemsCCC:[],

            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },
            
            options: {
                format: "YYYY-MM-DD",
                //useCurrent: false
                // minDate:Date(),
            },

            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla


            showFormulario:false,

            variantSaveButton:"success",
            disabledcode:false,
            modified:false,
            tableData: [],
            tblOriginal: [],
            title_import:'',
            infook:false,
            showSaveFile:false,
            pp_year:null,
            disabled_loadfile:false,
            datosCompletos:null,
            confirmDescartar:false,
            
            
            selectedTipoCuenta:{},
            tipoCuentas:[],


            /**
            columns: [
                {key:'description', label:"Descripcion"},
                {key:'workstation_plant_id', label:"workstation_plant_id", thClass: 'd-none', tdClass: 'd-none'},
            ], 
             */

            /// Columnas de las tablas
                columns: [
                    {key:'planta', label:"Planta"},
                    {key:'codigo', label:"Codigo"},
                    {key:'description', label:"Descripcion"},
                    {key:'unity_measure', label:"UM"},
                    {key:'total', label:"Acumulado"},
                    {key:'prom', label:"Promedio"},
                    // {key:'costo', label:"Costo"},
                    {key:'enero', label:"Enero"},
                    {key:'febrero', label:"Febrero"},
                    {key:'marzo', label:"Marzo"},
                    {key:'abril', label:"Abril"},
                    {key:'mayo', label:"Mayo"},
                    {key:'junio', label:"Junio"},
                    {key:'julio', label:"Julio"},
                    {key:'agosto', label:"Agosto"},
                    {key:'septiembre', label:"Septiembre"},
                    {key:'octubre', label:"Octubre"},
                    {key:'noviembre', label:"Noviembre"},
                    {key:'diciembre', label:"Diciembre"},
                    // {key:'rounding', label:"Redondeo"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    // {key:'edit', label:"Editar/Eliminar"}
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    code:"",
                    description:"",
                    type_primary:true,
                },
                objState:{},
            ///

        }),
        methods:{
            onResize() {
                this.windowHeight = window.innerHeight
            },

            ejecutarDescartePPTO(){
                infocosts.ctrlpresupuestoproductos(this.datosCompletos[0].presupuesto_id, "descartar/"+this.pptotipo).then(data =>{
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error descartando el Presupuesto!")
                    }else{
                        this.showCustom('bg-success text-white', "Descartar el Presupuesto","¡El presupuesto se ha descartado con exito!")
                        this.disabled_loadfile=false
                        this.datosCompletos=null
                        this.tableData = []
                        this.file1=null
                        this.title_import=''
                        this.infook=false
                        this.$refs.descartarPresupuesto.close()
                    }
                })
            },

            activatePresupuesto(){
                 infocosts.ctrlpresupuestoproductos(this.datosCompletos[0].presupuesto_id, "activateppto/"+this.pptotipo).then(data =>{
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Activando el Presupuesto!")
                    }else{
                        this.showCustom('bg-success text-white', "Activar el Presupuesto","¡El presupuesto se ha activado con exito!")
                        this.disabled_loadfile=false
                        this.datosCompletos=data.data
                        this.tableData = this.datosCompletos[0].presupuesto_cc
                    }
                })
            },

            cancelPresupuesto(){
                infocosts.ctrlpresupuestoproductos(this.datosCompletos[0].presupuesto_id, "cancel/"+this.pptotipo).then(data =>{
                    if (data.status === 202){
                        // this.disabled_loadfile=true
                        // this.datosCompletos=null
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Cancelar Presupuesto","¡El presupuesto se ha cancelado con exito!")
                        this.disabled_loadfile=false
                        this.datosCompletos=null
                        this.tableData = []
                        // this.selectTab = 'ver_registros'
                    }
                })
            },
            
            closePresupuesto(){
                infocosts.ctrlpresupuestoproductos(this.datosCompletos[0].presupuesto_id, "cancel/"+this.pptotipo).then(data =>{
                    if (data.status === 202){
                        // this.disabled_loadfile=true
                        // this.datosCompletos=null
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Cancelar Presupuesto","¡El presupuesto se ha cancelado con exito!")
                        this.disabled_loadfile=false
                        this.datosCompletos=null
                        this.tableData = []
                        // this.selectTab = 'ver_registros'
                    }
                })
            },

            guardarArchivoDB(){
                infocosts.uploadFile('savepresupuestocc'+this.pptotipo+'|'+this.pp_year, this.file1).then(data =>{
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                        this.disabled_loadfile=false
                        this.datosCompletos=null
                    }else{
                        this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
                        this.showSaveFile = false
                        this.datosCompletos=data.data
                        this.selectTab = 'ver_registros'
                        this.disabled_loadfile=true
                        this.tableData = this.datosCompletos[0].presupuesto_cc

                        this.showData()
                    }
                })
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

            check_access(control, action){
                return infousers.check_access(control,action)
            },

        ///Funcion para reiniciar los datos
            restartInfo(){
                 this.objInfo= {
                    code:"",
                    description:"", 
                    type_primary:true,
                    type_secundary:false, 
                }
            },
        ///Funcion para reiniciar los datos

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

        ///Filtros Para las Tablas
            onFiltered (filteredItems) {
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
        ///Filtros Para las Tablas

        ///Funcion para envio de alertas lateral superior derecha
            showCustom: function(classes, title, text) {
                this.$notify({
                    group: 'notifications-default',
                    type: classes,
                    title: title,
                    text: text
                })
            },
        /// Funcion para envio de alertas lateral superior derecha

        ///Adicionar un nuevo dato, cancelar el ingreso, cancelar el borrado de un dato
            addData:function(){
                this.restartInfo()
                this.showFormulario=true
            },

            cancel: function(){
                this.restartInfo()
                this.showFormulario=false
            },

            closeDeleteRecord: function(){
                this.restartInfo()
                this.$refs.errorWithButtonAlert.close()
            },
        ///Adicionar un nuevo dato, cancelar el ingreso, cancelar el borrado de un dato

        ///Eventos CRUD
             cargarArchivo(){
                this.tableData=[]
                this.title_import=''
                this.infook=false
               
                infocosts.uploadFile('pptocrmpdn', this.file1).then(data =>{
                    let errors = []
                    for (let index = 0; index < data.data.length; index++) {
                        const element = data.data[index];
                        if(element.codigo == null){
                            errors.push(element)
                        }
                    }

                    if(errors.length > 0){
                        this.infook = false
                        this.title_import = 'ERROR CREE LOS MAESTROS FALTANTES'
                        this.tableData=errors
                    }else{
                        this.infook = true
                        this.title_import = 'INFORMACION OK'
                        this.tableData=data.data
                    }
                })
                    
            },
        ///Eventos CRUD

        showData: function(){
                infocosts.ctrlpresupuestoproductos([], "select/"+this.pptotipo).then(data =>{
                    if (data.data === ""){
                        this.disabled_loadfile=false
                        this.datosCompletos=null
                        // this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        this.datosCompletos=data.data
                        this.tableData = this.datosCompletos[0].presupuesto_cc
                        this.selectTab = 'ver_registros'
                        this.disabled_loadfile=true
                        this.totalRows = this.tableData.length
                    }
                })
            },

        

        ///Espacio para metodos propios del control
        ///Espacio para metodos propios del control
        
        },
        created(){
            this.pptotipo = this.$route.path.split('/')[this.$route.path.split('/').length-1]
            this.showData()

            
        },

        mounted() {
            window.addEventListener('resize', () => {
            this.windowHeight = window.innerHeight
            })
        },

        beforeDestroy() { 
            window.removeEventListener('resize', this.onResize); 
        },
    }
</script>

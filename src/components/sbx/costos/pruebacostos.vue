<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Costo por Codigo Detalle</h4>
        <div class="w-100 text-right"></div>

<!-- {{itemSelected}} -->

<div v-if="arraytblOriginal.length==0">


        <b-input-group>
            <b-form-input v-model="filter" placeholder="Buscar..." />
            <b-input-group-append>
            <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
            </b-input-group-append>
        </b-input-group>
        <b-btn class="mt-2" variant="success" size="xs" block @click="guardarInformacion=true"> Guardar Informacion </b-btn>
        <div id="chart_div"></div>
            <!-- <multipane class="vertical-panes" layout="vertical" style="height:600px"> v-if="operations.length==0" -->
            <div class="pane overflow-auto" :style="{ padding: '0.5rem' }" >
                <div>
                    <div>
                        <div >
                            <b-table-simple small style="font-size:12px">
                                <b-thead>
                                <b-tr class style="text-align: left;">
                                    <b-th class="text-nowrap">Codigo</b-th>
                                    <b-th class="text-nowrap">Descripcion</b-th>
                                    <b-th class="text-nowrap">Unidad Medida</b-th>
                                    <b-th class="text-nowrap">Desperdicio</b-th>
                                    <b-th class="text-nowrap">Programado</b-th>
                                    <b-th class="text-nowrap">V/H Procesos</b-th>
                                    <b-th class="text-nowrap">Valor Materiales</b-th>
                                    <!-- <b-th class="text-nowrap">Tarifa 1</b-th> -->
                                    <b-th class="text-nowrap">Tarifa Final</b-th>
                                </b-tr>
                                </b-thead>
                                <b-tbody>
                                    <b-tr v-for="(itemx ,index)  in (resultadoPrimero)" :key="index" >
                                        <b-td data-th="Codigo" class="text-nowrap" @click="selectedCode(itemx)" >
                                            <span>                
                                                <i :class="'text-success fas fa-'+ (itemx.detalle>0 ? 'check': 'circle')"></i>
                                            </span> {{itemx.Code}}
                                        </b-td>
                                        <b-td data-th="Descripcion">
                                            <div class="text-nowrap"> {{itemx.Description}} </div> 
                                        </b-td>
                                        <b-td data-th="Unidad Medida"> {{itemx.UnityMeasure}} </b-td>
                                        <b-td data-th="Desperdicio"> {{formatAmount(itemx.ScrapTotal.toFixed(2))}} </b-td>
                                        <b-td data-th="Programado"> {{formatAmount(itemx.TotalProgrammed.toFixed(2))}} </b-td>
                                        <b-td data-th="Total Procesos"> {{formatAmount(itemx.RateComponents.toFixed(2))}} </b-td>
                                        <b-td data-th="Valor Materiales"> {{formatAmount(itemx.TotalMaterials.toFixed(2))}} </b-td>
                                        <!-- <b-td data-th="Valor/Unidad"> {{formatAmount((itemx.Tarifa1).toFixed(2))}} </b-td> -->
                                        <b-td data-th="Valor/Unidad"> {{formatAmount((itemx.Tarifa).toFixed(2))}} </b-td>
                                    </b-tr>
                                </b-tbody>
                            </b-table-simple>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="arraytblOriginal.length>0">
            <div id="chart_div"></div>
            <!-- <multipane class="vertical-panes" layout="vertical" style="height:600px"> v-if="operations.length==0" -->
            <div class="pane overflow-auto" :style="{ padding: '0.5rem' }" >
                <div>
                    <div>
                        <div >
                            <b-table-simple small style="font-size:12px">
                                <b-thead>
                                <b-tr class style="text-align: left;">
                                    <b-th class="text-nowrap">Codigo</b-th>
                                    <b-th class="text-nowrap">Descripcion</b-th>
                                    <b-th class="text-nowrap">Unidad Medida</b-th>
                                    <b-th class="text-nowrap">Desperdicio</b-th>
                                    <b-th class="text-nowrap">Programado</b-th>
                                    <b-th class="text-nowrap">V/H Procesos</b-th>
                                    <b-th class="text-nowrap">Valor Materiales</b-th>
                                    <b-th class="text-nowrap">Tarifa</b-th>
                                    <b-th class="text-nowrap">Tarifa Final</b-th>
                                </b-tr>
                                </b-thead>
                                <b-tbody>
                                    <b-tr v-for="(item ,index)  in (arraytblOriginal)" :key="index" :class="(itemSelected.Code == item.Code ? 'bg-warning' : '')" v-show="itemSelected.Parent == null || itemSelected.Parent == item.Parent" >
                                        <b-td data-th="Codigo" class="text-nowrap" @click="toggle(item, index)" >
                                            <span v-bind:style="setPadding(item)">                
                                                <i :class="'text-success fas fa-'+ iconName(item)"></i>
                                            </span> {{item.Code}}
                                        </b-td>
                                        <b-td data-th="Descripcion" @click="operations=item.Operations; itemSelected=item;">
                                            <div class="text-nowrap"> {{item.Description}} </div> 
                                        </b-td>
                                        <b-td data-th="Unidad Medida"> {{item.UnityMeasure}} </b-td>
                                        <b-td data-th="Desperdicio"> {{formatAmount(item.ScrapTotal.toFixed(2))}} </b-td>
                                        <b-td data-th="Programado"> {{formatAmount(item.TotalProgrammed.toFixed(2))}} </b-td>
                                        <b-td data-th="Total Procesos"> {{formatAmount(item.RateComponents.toFixed(2))}} </b-td>
                                        <b-td data-th="Valor Materiales"> {{formatAmount(item.TotalMaterials.toFixed(2))}} </b-td>
                                        <b-td data-th="Valor/Unidad"> {{formatAmount((item.Tarifa1).toFixed(2))}} </b-td>
                                        <b-td data-th="Valor/Unidad"> {{formatAmount((item.Tarifa).toFixed(2))}} </b-td>
                                    </b-tr>
                                </b-tbody>
                            </b-table-simple>
                        </div>
                    </div>
                </div>
            </div>


            <!-- <multipane-resizer></multipane-resizer> -->
            <div>
            <hr>
            <div class="overflow-auto" :style="{ padding: '0.5rem' }">
                <div style="width:100%;">
                    <h4>Operaciones</h4>
                    <b-table-simple small style="width:100%; font-size:12px">
                        <b-thead>
                        <b-tr class style="text-align: left;">
                            <b-th class="text-nowrap">Actividad</b-th>
                            <b-th class="text-nowrap">HM</b-th>
                            <b-th class="text-nowrap">HH</b-th>
                            <b-th class="text-nowrap">Kw/h</b-th>
                            <b-th class="text-nowrap">Kcal/h</b-th>
                            <b-th class="text-nowrap">Valor Proceso</b-th>
                        </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr v-for="(item ,index)  in (operations)" :key="index" >
                                <b-td v-if="item.leaf == false || item.leaf == undefined" class="text-nowrap" data-th="Actividad" @click="toggle2(item, index);" >
                                    <span v-bind:style="setPadding(item)"> 
                                        <i :class="'text-success fas fa-'+ iconName2(item)"></i>
                                    </span> 
                                    <b-btn variant="outline-warning borderless icon-btn" class="btn-xs" @click.prevent="abrirDetalle(item)"><i class="ion ion-md-create"></i></b-btn>
                                    {{item.Description}}
                                </b-td>
                                
                                
                                
                                
                                <b-td v-if="item.leaf == false || item.leaf == undefined" data-th="HM"> {{formatAmount(item.TotalProductionPerHours.toFixed(2))}} </b-td>
                                <b-td v-if="item.leaf == false || item.leaf == undefined" data-th="HH"> {{formatAmount(item.TotalProductionManPerHours.toFixed(2))}} </b-td>
                                <b-td v-if="item.leaf == false || item.leaf == undefined" data-th="Kw/h"> {{formatAmount(item.TotalEnergyPerHour.toFixed(2))}} </b-td>
                                <b-td v-if="item.leaf == false || item.leaf == undefined" data-th="Kcal/h"> {{formatAmount(item.TotalFuelPerHour.toFixed(2))}} </b-td>
                                <b-td v-if="item.leaf == false || item.leaf == undefined" data-th="Valor Proceso"> {{formatAmount(item.Tarifa.toFixed(2))}} </b-td>

                                <b-td v-if="item.leaf == true" colspan="6">
                                    
                                    <h4>Drivers</h4>
                                    <b-table-simple small style="width:100%; font-size:12px">
                                        <b-thead>
                                        <b-tr class style="text-align: left;">
                                            <b-th class="text-nowrap">Codigo</b-th>
                                            <b-th class="text-nowrap">Descripcion</b-th>
                                            <b-th class="text-nowrap">Driver</b-th>
                                            <b-th class="text-nowrap">Precio Total</b-th>
                                            <b-th class="text-nowrap">Tarifa</b-th>
                                            <b-th class="text-nowrap">Valor Proceso</b-th>
                                            <!-- <b-th class="text-nowrap">Valor Final</b-th> -->
                                        </b-tr>
                                        </b-thead>
                                        <b-tbody>
                                            <b-tr v-for="(itemx ,index)  in (item.DriversDetails)" :key="index" >
                                                <b-td class="text-nowrap" data-th="Codigo" >
                                                {{itemx.DriverCode}}
                                                </b-td>
                                                <b-td data-th="Descripcion" class="text-nowrap"> {{itemx.DriverDescription}} </b-td>
                                                <b-td data-th="Descripcion" class="text-nowrap"> {{itemx.DriverRoute}} </b-td>
                                                <b-td data-th="Precio Total"> {{formatAmount(itemx.PriceTotal.toFixed(2))}} </b-td>
                                                <b-td data-th="Tarifa"> {{formatAmount(itemx.PricePerHour.toFixed(2))}} </b-td>
                                                <b-td data-th="Valor Proceso"> {{formatAmount(itemx.Tarifa.toFixed(2))}} </b-td>
                                                <!-- <b-td data-th="Valor Final"> {{formatAmount(item.FinalPrice.toFixed(2))}} </b-td> -->
                                            </b-tr>
                                        </b-tbody>
                                    </b-table-simple>


                                </b-td>

                            </b-tr>
                        </b-tbody>
                    </b-table-simple>

                    <!-- <h4>Drivers Totales</h4>
                        <b-table-simple small style="width:100%; font-size:12px">
                            <b-thead>
                            <b-tr class style="text-align: left;">
                                <b-th class="text-nowrap">Codigo</b-th>
                                <b-th class="text-nowrap">Descripcion</b-th>
                                <b-th class="text-nowrap">Precio Total</b-th>
                                <b-th class="text-nowrap">Precio Hora</b-th>
                                <b-th class="text-nowrap">Valor Final</b-th>
                            </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr v-for="(item ,index)  in (itemSelected.DriversTotales)" :key="index" >
                                    <b-td class="text-nowrap" data-th="Codigo" >
                                    {{item.driver_code}}
                                    </b-td>
                                    <b-td data-th="Descripcion" class="text-nowrap"> {{item.driver_description}} </b-td>
                                    <b-td data-th="Precio Total"> {{formatAmount(item.total.toFixed(2))}} </b-td>
                                    <b-td data-th="Precio Hora"> {{formatAmount(item.TotalPerHour.toFixed(2))}} </b-td>
                                    <b-td data-th="Valor Final"> {{formatAmount(item.value.toFixed(2))}} </b-td>
                                </b-tr>
                            </b-tbody>
                        </b-table-simple> -->

                    <h4><i class="fab fa-atlassian"></i> Materias Primas</h4>
                        <b-table-simple small style="width:100%; font-size:12px">
                            <b-thead>
                            <b-tr class style="text-align: left;">
                                <b-th class="text-nowrap">Codigo</b-th>
                                <b-th class="text-nowrap">Descripcion</b-th>
                                <b-th class="text-nowrap">Unidad Medida</b-th>
                                <b-th class="text-nowrap">Cantidad x Padre</b-th>
                                <b-th class="text-nowrap">Programado</b-th>
                                <b-th class="text-nowrap">Costo Estandar</b-th>
                                <b-th class="text-nowrap">Costo Unidad</b-th>
                            </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr v-for="(item ,index)  in (itemSelected.Materials)" :key="index" >
                                    <b-td class="text-nowrap" data-th="Codigo" >
                                    {{item.child_code}}
                                    </b-td>
                                    <b-td data-th="Descripcion" class="text-nowrap"> {{item.child_description}} </b-td>
                                    <b-td data-th="Unidad Medida"> {{item.unity_measure}} </b-td>
                                    <b-td data-th="Cantidad x Padre"> {{item.amount_per_parent}} </b-td>
                                    <b-td data-th="Programado"> {{formatAmount(item.child_programmed.toFixed(2))}} </b-td>
                                    <b-td data-th="Costo Estandar"> {{formatAmount(item.standard_cost_child.toFixed(2))}} </b-td>
                                    <b-td data-th="Costo Unidad"> {{formatAmount((item.standard_cost_child/item.child_programmed).toFixed(2))}} </b-td>
                                </b-tr>
                                <b-tr>
                                    <b-td class="text-nowrap text-right" colspan="6" > <b> Total: </b> </b-td> 
                                    <b-td data-th="Costo Unidad"> {{sumTotalMaterials(itemSelected.Materials)}} </b-td>
                                </b-tr>
                            </b-tbody>
                        </b-table-simple>
                    </div>
                </div>
            </div>
            <b-btn block variant="info" size="xs" @click="itemSelected={};operations=[]; resultadoTotal=[]" v-if="arraytblOriginal.length>0">
                CERRAR INFORMACION REFERENCIA SELECCIONADA / BORRAR SELECCION
            </b-btn>
            <!-- </multipane> -->
        </div>

        <!-- <b-modal v-model="detalleCodigo" size="lg" title="Detalle Codigo">

            <b-table small show-empty stacked="md" :items="codeDetails" :fields="columnsDetails" class="mt-2">
                <template v-slot:cell(production_per_hh)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_hh)}}
                    </div>
                </template>
                <template v-slot:cell(production_per_hm)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_hm)}}
                    </div>
                </template>
                <template v-slot:cell(production_per_kw)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_kw)}}
                    </div>
                </template>
                <template v-slot:cell(production_per_kc)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_kc)}}
                    </div>
                </template>
            </b-table>

        </b-modal> -->
        <b-modal hide-footer v-model="guardarInformacion" title="Guardar Informacion">
            <div class="text-center">
                Desea guardar estos costos?
                <!-- <b-form-input v-model="text" placeholder="Ingrese una Descripcion"></b-form-input> -->
            </div>
            <div class="row">
                <div class="col">
                    <b-btn class="mt-2" variant="warning" size="sm" block @click="saveinfo"> Guardar </b-btn>
                </div>
                <div class="col">
                    <b-btn class="mt-2" variant="info" size="sm" block @click="guardarInformacion = false"> Cancelar </b-btn>
                </div>
            </div>
        </b-modal>

        <b-modal v-model="detalleCodigo" size="xl" :title="`${productDetails.CCCode} - ${productDetails.CCDescription}`">
        <!--  -->
        <!-- {{productDetails.Products}} -->
            <b-table small show-empty stacked="md" :items="productDetails.Products" :fields="columnsDetails" class="mt-2">
                <template v-slot:cell(production_per_hh)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_hh)}}
                    </div>
                </template>
                <template v-slot:cell(production_per_hm)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_hm)}}
                    </div>
                </template>
                <template v-slot:cell(production_per_kw)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_kw)}}
                    </div>
                </template>
                <template v-slot:cell(production_per_kc)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_kc)}}
                    </div>
                </template>
                <template v-slot:cell(child_programmed)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.child_programmed)}}
                    </div>
                </template>

                        <template v-slot:cell(t_production_per_hh)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_hh > 0 ? row.item.child_programmed/row.item.production_per_hh : 0)}}
                    </div>
                </template>
                <template v-slot:cell(t_production_per_hm)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_hm > 0 ? row.item.child_programmed/row.item.production_per_hm : 0)}}
                    </div>
                </template>
                <template v-slot:cell(t_production_per_kw)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_kw > 0 ? row.item.child_programmed/row.item.production_per_kw : 0)}}
                    </div>
                </template>
                <template v-slot:cell(t_production_per_kc)="row">
                    <div class="text-left text-nowrap">
                        {{formatAmount(row.item.production_per_kc > 0 ? row.item.child_programmed/row.item.production_per_kc : 0)}}
                    </div>
                </template>
            </b-table>

            <!-- {{productDetails}} -->
            Total HM: {{formatAmount(productDetails.TotalProductionPerHours)}}<br>
            Total HH: {{formatAmount(productDetails.TotalProductionManPerHours)}}<br>
            Total KW: {{formatAmount(productDetails.TotalEnergyPerHour)}}<br>
            Total KCAL: {{formatAmount(productDetails.TotalFuelPerHour)}}<br>
        </b-modal>



    </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
    import Vue from 'vue'

    import * as numeral from 'numeral'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { infocosts } from "@/components/i40/js/costs";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import {infousers} from '@/components/i40/js/users'
    import { Multipane, MultipaneResizer } from 'vue-multipane';
  
    Vue.use(Notifications)

    export default {
    
        metaInfo: {
            title: 'Clase CC'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab,
            Multipane,
            MultipaneResizer,
        },
        computed: {
            arraytblOriginal() {
                let vm = this;
                var newObj = [];
                vm.recursive(vm.resultadoTotal, newObj, 0, vm.itemId, vm.isExpanded);
                return newObj;
            },

            arrayOperations() {
                let vm = this;
                var newObj = [];
                vm.recursive(vm.operations, newObj, 0, vm.itemId2, vm.isExpanded2);
                return newObj;
            }
        },
        watch:{
             'filter':function(value){
                this.resultadoPrimero = this.resultadoPrimeroGeneral.filter(function (task) {
                    if(task.Code.toLowerCase().includes(value.toLowerCase()) || task.Description.toLowerCase().includes(value.toLowerCase()))
                        return task
                });

                // this.totalRows = this.tableCommercialsOrders.length
                // this.currentPage = 1
            },

            'itemSelected':function(value){
                document.getElementById('chart_div').innerHTML=''

                if(value.Code != undefined){
                    let vm = this;

                    var newObj = [];
                    newObj.push([{'v':`${value.Code}`, 'f':`${value.Code} <br> ${value.Description}`},
                                '', ''])
                    if(value.Materials != null){
                        for (let index = 0; index < value.Materials.length; index++) {
                            const element = value.Materials[index];
                            newObj.push([`<div style="display: none;">${value.Code}</div>${element.child_code}<br>${element.child_description}<div style="color:red; font-style:italic">MP</div>`, value.Code, ''])
                            
                        }
                    }
                    
                    vm.prepareChart(vm.itemSelected, newObj)

                    this.arrChart = newObj
                    google.charts.setOnLoadCallback(this.drawChart);
                }

            }
        },
        data: () => ({
            name: 'um',
            version: 'v1.0.0.0',
            code:null,
            quant:null,
            resultado:[],
            splitterModel: 150,

            resultadoPrimero:[],
            resultadoPrimeroGeneral:[],
            filter:'',

            infoRoute:{},
            infoMP:[],

            productDetails:[],

            codeDetails:[],
            columnsDetails:[
                {key:'parent_code', label:"Padre"},
                {key:'child_code', label:"Codigo"},
                {key:'child_description', label:"Descripcion"},
                {key:'unity_measure', label:"UM"},
                {key:'child_programmed', label:"Programado"},
                // {key:'Value', label:"Valor Total"},
                // {key:'DriverRoute', label:"Kw/h"},
                
                {key:'production_per_hm', label:"HM"},
                {key:'production_per_hh', label:"HH"},
                {key:'production_per_kw', label:"Kw"},
                {key:'production_per_kc', label:"Kcal"},

                {key:'t_production_per_hm', label:"THM"},
                {key:'t_production_per_hh', label:"THH"},
                {key:'t_production_per_kw', label:"TKw"},
                {key:'t_production_per_kc', label:"TKcal"},
            ],

            detalleCodigo:false,

            rsOperacion:null,
            selectedDD2:[],
            selectedDD:[],
            selected:null,

            // Description: "EMPAQUE HILO GRUESO"
            // DriversDetails: Array(6)
            // EnergyPerHour: 0
            // FuelPerHour: 0
            // PricePerHour: 1053.6442
            // ProductionManPerHours: 0
            // ProductionPerHours: 453
            // Rate: 2.3259254
            // ScrapTotal: 0
            // TotalProgrammed: 5000

            columnsDrivers: [
                {key:'DriverCode', label:"Actividad"},
                {key:'DriverDescription', label:"Prod x Hora"},
                // {key:'Value', label:"Valor Total"},
                // {key:'DriverRoute', label:"Kw/h"},
                {key:'PriceTotal', label:"Precio Total"},
                {key:'PricePerHour', label:"Precio Hora"},
                {key:'FinalPrice', label:"Final"},
            ],

            columnsDetalle: [
                {key:'Description', label:"Actividad"},
                {key:'ProductionPerHours', label:"HM"},
                {key:'ProductionManPerHours', label:"HH"},
                {key:'EnergyPerHour', label:"Kw/h"},
                {key:'FuelPerHour', label:"Kcal/h"},
                {key:'Rate', label:"Valor/Und"},
            ],

            // columns: [
            //         {key:'Code', label:"Codigo"},
            //         {key:'Description', label:"Descripcion"},
            //         {key:'ScrapTotal', label:"Desperdicio"},
            //         {key:'TotalProgrammed', label:"Programado"},
            //         {key:'Rate', label:"Valor/Und"},
            //     ],


            resultadoTotal:[],
            itemsChilds:[],
            itemId:null,
            isExpanded: true,

            operations:[],
            materials:[],
            itemId2:null,
            isExpanded2: true,
            itemSelected:{},

            itemsproductstotales:{},
            chart:null,
            arrChart:null,
            guardarInformacion :false,

        }),
        methods:{
            saveinfo(){
                infocosts.saveproductscode({}).then(data =>{
                    infocosts.detallecostoppto('3').then(data =>{
                        // console.log(data.data)
                        this.resultadoPrimeroGeneral = data.data
                        this.resultadoPrimero = data.data
                    })

                    this.guardarInformacion = false
                })
            },

            prepareChart(value, newObj){
                let vm = this
                if(value.Materials != null){
                    
                    for (let index = 0; index < value.Materials.length; index++) {
                        const elm = value.Materials[index];
                        // console.log(value.Code,elm)
                        newObj.push([`<div style="display: none;">${value.Code}</div>${elm.child_code}<br>${elm.child_description}<div style="color:red; font-style:italic">MP</div>`, value.Code, ''])
                        
                    }
                }
                if(value.detalle != null){
                    value.detalle.forEach(function(element) { {
                            newObj.push([{'v':element.Code, 'f':`${element.Code} <br> ${element.Description}`},
                                value.Code, ''])
                            vm.prepareChart(element, newObj)
                        }
                    })
                }
            },

            selectHandler(e) {
                // console.log(e, this.chart.getSelection())
            },


            drawChart() {

                // [{'v':'Mike', 'f':'Mike<div style="color:red; font-style:italic">President</div>'},
                //     '', ''],
                //     [{'v':'Jim', 'f':'Jim<div style="color:red; font-style:italic">Vice President</div>'},
                //     'Mike', 'VP'],
                //     ['Alice', 'Mike', ''],
                //     ['Bob', 'Jim', 'Bob Sponge'],
                //     ['Carol', 'Bob', ''],
                //     ['Uno', 'Alice', '']

                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Name');
                data.addColumn('string', 'Manager');
                data.addColumn('string', 'ToolTip');

                // For each orgchart box, provide the name, manager, and tooltip to show.
                data.addRows(
                    this.arrChart
                );

                data.setRowProperty(0, 'selectedStyle', 'background-color:#00FF00');

                // Create the chart.

                let ch = new google.visualization.OrgChart(document.getElementById('chart_div'));
                
                this.chart = ch
                
                google.visualization.events.addListener(ch, 'select', this.selectHandler);
                // Draw the chart, setting the allowHtml option to true for the tooltips.
                ch.draw(data, {'allowHtml':true});

                
            },
            
            calcularInfo(valor, item, itemop){
                let total = 0
                if( itemop.DriverRoute == "PrdHH"){
                    if(item.TotalProductionManPerHours > 0){
                        total = valor/item.TotalProductionManPerHours
                    }
                }
                if( itemop.DriverRoute == "PrdHM"){
                    if(item.TotalProductionPerHours > 0){
                        total = valor/item.TotalProductionPerHours
                    }
                }
                if( itemop.DriverRoute == "kw"){
                    if(item.TotalEnergyPerHour > 0){
                        total = valor/item.TotalEnergyPerHour
                    }
                }
                if( itemop.DriverRoute == "kcal"){
                    if(item.TotalFuelPerHour > 0){
                        total = valor/item.TotalFuelPerHour
                    }
                }

                return total
            },
            abrirDetalle(item){
                // console.log(item)
                this.productDetails = item
                this.detalleCodigo=true

                this.itemsproductstotales.production_per_hh = 0
                this.itemsproductstotales.production_per_hm = 0
                this.itemsproductstotales.production_per_kw = 0
                this.itemsproductstotales.production_per_kc = 0
                
                for (let index = 0; index < this.productDetails.Products.length; index++) {
                    const element = this.productDetails.Products[index];

                    this.itemsproductstotales.production_per_hh = this.itemsproductstotales.production_per_hh + (element.production_per_hh > 0 ? element.child_programmed/element.production_per_hh:0);
                    this.itemsproductstotales.production_per_hm = this.itemsproductstotales.production_per_hm + (element.production_per_hm > 0 ? element.child_programmed/element.production_per_hm:0);
                    this.itemsproductstotales.production_per_kw = this.itemsproductstotales.production_per_kw + (element.production_per_kw > 0 ? element.child_programmed/element.production_per_kw:0);
                    this.itemsproductstotales.production_per_kc = this.itemsproductstotales.production_per_kc + (element.production_per_kc > 0 ? element.child_programmed/elementproduction_per_kc:0);
                    
                }
            },
            sumTotalMaterials(items){
                let total = 0
                if(items != undefined && items != null){
                    for (let index = 0; index < items.length; index++) {
                        const element = items[index];
                        total = total + (element.standard_cost_child/element.child_programmed)
                    }
                }
                return this.formatAmount(total.toFixed(2))
            },
            toggle2(item) {

                let operations2=[]
                let ixx = JSON.parse( JSON.stringify(item))

                for (let index = 0; index < this.operations.length; index++) {
                    const element = this.operations[index];
                    
                    if(item.Description == element.Description){
                        if(this.operations[index]["expend"] == true){
                            index = index+1
                            element["expend"] = false
                            element["leaf"] = false
                            operations2.push(element)
                        }else if(this.operations[index]["expend"] == undefined || this.operations[index]["expend"] == false){
                            if(ixx["leaf"] ==  undefined || ixx["leaf"] == false){
                                ixx["leaf"] = true
                                this.operations[index]["leaf"] = false
                                this.operations[index]["expend"] = true
                                operations2.push(this.operations[index])
                                operations2.push(ixx)
                            }
                        }
                    }else{
                        operations2.push(element)
                    }
                    
                }
                this.operations=operations2
            },



            recursive(obj, newObj, level, itemId, isExpend) {
                let vm = this;
                obj.forEach(function(o) {
                    if (o.detalle && o.detalle.length != 0) {
                        o.level = level;
                        o.leaf = false;
                        newObj.push(o);
                        if (o.code == itemId) {
                            o.expend = isExpend;
                        }
                        if (o.expend == true) {
                            vm.recursive(o.detalle, newObj, o.level + 1, itemId, isExpend);
                        }
                    } else {
                        o.level = level;
                        o.leaf = true;
                        newObj.push(o);
                        return false;
                    }
                });
            },

            toggle(item, index) {
                let vm = this;
                vm.itemId = item.code;

                item.leaf = false;

                // console.log(item)
                //show  sub items after click on + (more)
                if (
                    item.leaf == false &&
                    item.expend == undefined &&
                    item.detalle != undefined
                ) {
                    if (item.detalle.length != 0) {
                        // for (let index = 0; index < item.detalle.length; index++) {
                        //     item.detalle[index]['parentvalue'] = (item.prom_total < 0 ? -1*item.prom_total :item.prom_total )
                        // }
                        vm.recursive(item.detalle, [], item.level + 1, item.id, true);
                    }
                }

                if (item.expend == true && item.detalle != undefined) {
                    var __subindex = 0;
                    item.detalle.forEach(function(o) {
                        o.expend = undefined;
                    });

                    vm.$set(item, "expend", undefined);
                    vm.$set(item, "leaf", false);
                    vm.itemId = null;
                }
            },

            iconName(item) {
                if (item.expend == true) {
                    return "minus";
                }

                if (item.detalle && item.detalle.length > 0) {
                    return "plus";
                }

                return "circle";
            },

            iconName2(item) {
                if (item.expend == true) {
                    return "minus";
                }

                return "plus";
            },

            setPadding(item) {
                return `padding-left: ${item.level * 30}px;`;
            },


            formatPrice (p) {
                return numeral(p).format('$0,0.00')
            },
            formatAmount (p) {
                return numeral(p).format('0,0.00')
            },
            // details(item){
            //     // console.log(item.Operations)
            //     this.rsOperacion = item.Operations
            //     this.itemsChilds = []

            //     for (let index = 0; index < this.resultadoTotal.length; index++) {
            //         const element = this.resultadoTotal[index];

            //         if(element.Parent == item.Code && element.Parent != element.Code){
            //             this.itemsChilds.push(element)
            //         }
                    
            //     }
            // },

            submit: function(){
                infocosts.detalleproducto(this.code, this.quant).then(data => {
                    // console.log(data)

                    this.resultado =data.data
                    // if (data.status === 202){
                        
                    // }else{
                       
                    // }
                })
                .catch(function (error) {
                    console.log(error.status)
                })
            },
            selectedCode(item){
                infocosts.selectedCode(item.Code).then(data =>{
                    console.log(data.data)
                    this.resultadoTotal = data.data
                })
            }
        
        },
        created(){
            infocosts.detallecostoppto('3').then(data =>{
                // console.log(data.data)
                this.resultadoPrimeroGeneral = data.data
                this.resultadoPrimero = data.data
            })
            
            google.charts.load('current', {packages:["orgchart"]});
                    
        },
    }
</script>

<style>
  /* @import 'https://unpkg.com/quasar-framework@^0.16.0/dist/umd/quasar.mat.min.css'; */

.vertical-panes {
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
}
.vertical-panes > .pane {
  text-align: left;
  padding: 15px;
  overflow: hidden;
  /* background: #eee; */
}
.vertical-panes > .pane ~ .pane {
  border-left: 1px solid #ccc;
}
</style>
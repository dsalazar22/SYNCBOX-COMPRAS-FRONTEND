<template>
    <div>

        <div class="h3">    
               Lista de Productos y Rendimientos
        </div>
        
            <div class="row mt-2">
                <div class="col-md-2"></div>
                <div class="col-md-4">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                        <date-picker v-model="dateStart" :config="optionsCalendar"></date-picker>
                    </div>
                </div> 
                <div class="col-md-4">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                        <date-picker v-model="dateFinsh" :config="optionsCalendar"></date-picker>
                    </div> 
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-success" v-on:click="loadData()">Consultar</button>
                    <!-- <b-button class="mr-1 mb-1" type="button" variant="outline-success" key="Consultar" :event="counter += 1">Consultar {{ counter }}</b-button> -->
                </div>
            </div>

            <!-- <b-col md="3" class="my-1"> -->
                <b-input-group>
                    <b-form-input v-model="minVariacion" placeholder="Variación Minima" ></b-form-input>
                    <b-form-input v-model="maxVariacion" placeholder="Variación Maxima" ></b-form-input>
                    <b-input-group-append>
                        <b-btn variant="success" @click="setVariacion()"> <i class="fas fa-check" ></i> </b-btn>
                    </b-input-group-append>
                </b-input-group>
            <!-- </b-col> -->



            <b-nav class="justify-content-end mt-2">
                <b-nav tabs class="nav-sm tabs-alt">
                    <b-nav-item :active="selectTab=='resumen'" @click="selectTab='resumen'">Resumen</b-nav-item>
                    <b-nav-item :active="selectTab=='details'" @click="selectTab='details'">Detalle</b-nav-item>
                </b-nav>
            </b-nav>


            <div v-if="selectTab=='resumen'">
                    <!-- {{totals_warehouse}}
                    <div v-for="item of totals_warehouse">
                        {{item}}
                    </div> -->

                    <div class="row">
                        <div class="col">
                            <b-list-group class="mt-2">
                                <b-list-group-item style="padding:5px;"> 
                                    <div>
                                        <b>Totales Generales</b>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding:5px;"> 
                                    <div>
                                        <b>Total Entregado a Produccion (kg)</b>
                                        <div class="float-right mr-2"> {{globalinfo.length>0? numberWithCommas(globalinfo[0].total_leido):0}} </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding:5px;"> 
                                    <div>
                                        <b>Cantidad Inicial (kg)</b>
                                        <div class="float-right mr-2"> {{numberWithCommas(total)}} </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding:5px;"> 
                                    <div>
                                        <b>Cantidad Producida (kg)</b>
                                        <div class="float-right mr-2"> {{numberWithCommas(totalConsume)}} </div>
                                    </div>
                                </b-list-group-item>
                                <!-- <b-list-group-item style="padding:5px;"> 
                                    <div>
                                        <b>Variación %</b>
                                        <div class="float-right mr-2"> {{numberWithCommas((total-totalConsume)/total)*100}} </div>
                                    </div>
                                </b-list-group-item> -->
                                <b-list-group-item style="padding:5px;"> 
                                    <div>
                                        <b>Unidades x Kg</b>
                                        <div class="float-right mr-2"> {{numberWithCommas(undsTotals/totalConsume)}} </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding:5px;"> 
                                    <div>
                                        <b>Cantidad Manga (kg)</b>
                                        <div class="float-right mr-2"> {{numberWithCommas(mangakg)}} </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding:5px;"> 
                                    <div>
                                        <b>Cantidad Manga (Und)</b>
                                        <div class="float-right mr-2"> {{numberWithCommas(manga)}} </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding:5px;"> 
                                    <div>
                                        <b>Unidades Entregada a Producción</b>
                                        <div class="float-right mr-2"> {{globalinfo.length>0? numberWithCommas(globalinfo[0].cantidad_leida):0}} </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding:5px;"> 
                                    <div>
                                        <b>Unidades de Empaque Filtradas</b>
                                        <div class="float-right mr-2"> {{numberWithCommas(totalRows)}} </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding:5px;"> 
                                    <div>
                                        <b>Diferencia de Unidades de Empaque Filtradas</b>
                                        <div class="float-right mr-2"> {{numberWithCommas(undsIniciales-totalRows)}} </div>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                        </div>
                        <div class="col">
                            <h1 class="text-center h-4" style="margin-bottom:0px; font-size: 12rem;font-weight: 300;line-height: 1.2;">
                                {{ `${((undsIniciales-totalRows) == 0 ? 1 : numberWithCommas(1 - (undsIniciales-totalRows)/totalRows))*100}%`}}
                            </h1>
                            <h1 class="text-center display-3">
                               Total de la Muestra
                            </h1>
                            
                        </div>
                    </div>

                    <h3 class="mt-4">Totales por Producto</h3>
                    <div id="container"></div>
                    <b-table small show-empty stacked="md" :items="totalProduct"  :fields="columnsprod">
                        <template v-slot:cell(start_amount)="row">
                            {{numberWithCommas(row.item.start_amount)}}
                        </template>
                        <template v-slot:cell(total_consume)="row">
                            {{numberWithCommas(row.item.total_consume)}}
                        </template>
                        <template v-slot:cell(unds)="row">
                            {{numberWithCommas(row.item.unds)}}
                        </template>
                        <template v-slot:cell(undsxkg)="row">
                            {{numberWithCommas(row.item.unds/row.item.total_consume)}}
                        </template>
                        <template v-slot:cell(variacion)="row">
                            {{numberWithCommas((row.item.start_amount-row.item.total_consume)/row.item.start_amount)*100}}
                        </template>
                    </b-table>



                    <h3 class="mt-4">Totales por Proveedores</h3>
                    <div id="container_prov" v-if="selectTab=='resumen'"></div>
                    <b-table small show-empty stacked="md" :items="totalSupp"  :fields="columnsprv">
                        <template v-slot:cell(start_amount)="row">
                            {{numberWithCommas(row.item.start_amount)}}
                        </template>
                        <template v-slot:cell(total_consume)="row">
                            {{numberWithCommas(row.item.total_consume)}}
                        </template>
                        <template v-slot:cell(unds)="row">
                            {{numberWithCommas(row.item.unds)}}
                        </template>
                         <template v-slot:cell(undsxkg)="row">
                            {{numberWithCommas(row.item.unds/row.item.total_consume)}}
                        </template>
                        <template v-slot:cell(variacion)="row">
                            {{numberWithCommas((row.item.start_amount-row.item.total_consume)/row.item.start_amount)*100}}
                        </template>
                    </b-table>

                </div>

                <div v-if="selectTab=='details'" >
                    <b-row>
                        <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->
                        <b-col md="6" class="my-1">
                            <b-input-group>
                                <b-form-input v-model="filter" placeholder="Buscar..." />
                                <b-input-group-append>
                                <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </b-col>
                        <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->

                        <!-- ESTE ES EL PAGINADOR -->

                        <b-col md="6" class="my-1">
                            <b-form-select :options="pageOptions" v-model="perPage" />
                        </b-col>
                        <!-- ESTE ES EL PAGINADOR -->
                    </b-row>
                            <!--   -->
                    <b-table :sticky-header="false" :no-border-collapse="false" responsive style="font-size:12px"
                        :items="tableData" :current-page="currentPage" :per-page="perPage" :fields="columns"
                        :filter="filter" @filtered="onFiltered">

                        <template v-slot:head(start_amount)="scope">
                            <div class="text-nowrap">Cantidad Inicial Kg</div>
                        </template>
                        <template v-slot:head(total)="scope">
                            <div class="text-nowrap">Total Kg</div>
                        </template>
                        <template v-slot:head(scrap)="scope">
                            <div class="text-nowrap">Manga kg/und</div>
                        </template>

                        <template v-slot:cell(created)="row">
                            <div class="text-nowrap"> {{row.item.created}}</div>
                        </template>

                        <template v-slot:cell(code)="row">
                            <div class="text-nowrap"> {{row.item.code}}</div>
                        </template>

                        <template v-slot:cell(description)="row">
                            <div class="text-nowrap"> {{row.item.description}}</div>
                        </template>

                        <template v-slot:cell(product_lote)="row">
                            <div class="text-nowrap"> {{row.item.product_lote}}</div>
                        </template>

                        <template v-slot:cell(edit)="row">
                            <div class="text-left">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" v-if="check_access('admin_um', 'c')" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                            </div>
                        </template>
                        <template v-slot:cell(show)="row">
                            <div class="text-left">
                                <!-- <i class="ion ion-md-create"></i> -->
                            <span style="color:red" v-if="!row.item.show"><i class="ion ion-md-remove-circle"></i></span>
                                <span style="color:green" v-if="row.item.show"><i class="ion ion-md-add-circle"></i></span>
                            </div>
                        </template>
                        <template v-slot:cell(scrap)="row">
                            <div class="text-left">
                                {{row.item.scrap}} / {{row.item.unds_scrap}}
                                <!-- <i class="ion ion-md-create"></i> -->
                                <!-- <span style="color:red" v-if="!row.item.active"><i class="ion ion-md-remove-circle"></i></span>
                                <span style="color:green" v-if="row.item.active"><i class="ion ion-md-add-circle"></i></span> -->
                            </div>
                        </template>
                    </b-table>

                    <div class="d-flex justify-content-between">
                        <div>
                            <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                        </div>
                        <div class="text-muted">
                            <small> Total Registros: {{this.totalRows}} </small>
                        </div>
                    </div>
                </div>
    </div>
</template>
<script>
import VueResource from "vue-resource"
import Vue from 'vue'
import moment from "moment";
// Import this component
import datePicker from "vue-bootstrap-datetimepicker";
// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
import {inventory} from "@/components/i40/js/globals"
Vue.use(VueResource);
export default {
    components: {
        datePicker,
    },
    data() {
        return {
            undsIniciales:0,
            image:null,
            selectTab:'resumen',
            manga:0,
            mangakg:0,
            total:0,
            totalConsume:0,
            undsTotals:0,
            totalProduct:[],
            totalSupp :[],
            totals:{},
            dateStart:"",
            dateFinsh:"",
            tableCompleteData:[],
            tableData:[],
            maxVariacion:null,
            minVariacion:null,
            globalinfo:{},
            optionsCalendar: {
                format: "YYYY-MM-DD",
                //useCurrent: false
                // minDate:Date(),
             },

             columnsprod:[
                {key:"code", sortable: true, label:"Codigo", stickyColumn: true},
                {key:"description", sortable: true, label:"Descripcion", stickyColumn: true},
                {key:"start_amount", sortable: true, label:"Consumo Inicial (kg)"},
                {key:"total_consume", sortable: true, label:"Consumo Real (kg)"},
                {key:"variacion", sortable: true, label:"Variacion %"},
                {key:"undsxkg", sortable: true, label:"Unidades por (Kg)"},
             ],

             columnsprv:[
                {key:"code", sortable: true, label:"Codigo", stickyColumn: true},
                {key:"start_amount", sortable: true, label:"Consumo Inicial (kg)"},
                {key:"total_consume", sortable: true, label:"Consumo Real (kg)"},
                {key:"variacion", sortable: true, label:"Variacion %"},
                {key:"undsxkg", sortable: true, label:"Unidades por (Kg)"},
             ],

             columns:[
                {key:"code", sortable: true, label:"Codigo", stickyColumn: true},
                {key:"description", sortable: true, label:"Descripcion", stickyColumn: true},
                {key:"created", sortable: true, label:"Fecha"},
                {key:"supp", sortable: true, label:"Proveedor"},
                {key:"product_lote", sortable: true, label:"Lote"},
                {key:"start_amount", sortable: true, label:"Cantidad Inicial Kg"},
                {key:"total", sortable: true, label:"Total Kg"},
                {key:"scrap", sortable: true, label:"Manga kg/und"},
                {key:"variacion", sortable: true, label:"%Variacion"},
             ],

            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 100,
                totalRows: 0,
                pageOptions: [ 100, 150, 200, 250, 500, 1000 ],
                filter: null,
            ///Info de filtro y paginas para la tabla
        }
    },
    methods: {
        numberWithCommas(x) {
            if(x == null)
                x=0
            x = x.toFixed(2)
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },

        setVariacion(){
            this.tableData = []
            for (let index = 0; index < this.tableCompleteData.length; index++) {
                const element = this.tableCompleteData[index];
                let addElement = false
                let max = this.maxVariacion
                let min = this.minVariacion

                if(this.maxVariacion == 0 || this.maxVariacion == null){
                    max = 10000000
                }

                if(this.minVariacion == 0 || this.minVariacion == null){
                    min = -10000000
                }

                if(element.variacion > min && element.variacion < max){
                    this.tableData.push(element)
                }
                
                if((this.maxVariacion == null && this.minVariacion == null) || (this.maxVariacion == 0 && this.minVariacion == 0)){
                    this.tableData =  this.tableCompleteData
                }
            }
            this.calcinfototal()

            this.totalRows = this.tableData.length
            this.currentPage = 1
        },

        calcinfototal(){
            this.total=0
            this.totalConsume=0
            this.manga=0
            this.mangakg=0
            this.undsTotals = 0
            this.totalProduct = []
            this.totalSupp = []
            this.totals = {}
            
            for (let index = 0; index < this.tableData.length; index++) {
                const element = this.tableData[index];
                this.total = this.total+element.start_amount
                this.totalConsume = this.totalConsume+element.total
                this.undsTotals = this.undsTotals + element.unds
                this.manga=this.manga+element.unds_scrap
                this.mangakg=this.mangakg+element.scrap

                let exists = false
                let existsSupp = false
                

                if(this.totalProduct != undefined){

                    for (let indexX = 0; indexX < this.totalProduct.length; indexX++) {
                        const elementX = this.totalProduct[indexX];
                        if (element.code == elementX.code) {
                            exists = true
                            this.totalProduct[indexX]["start_amount"] = this.totalProduct[indexX]["start_amount"]+element.start_amount
                            this.totalProduct[indexX]["total_consume"] = this.totalProduct[indexX]["total_consume"]+element.total
                            this.totalProduct[indexX]["unds"] = this.totalProduct[indexX]["unds"]+element.total
                        }
                    }
                    
                    for (let indexX = 0; indexX < this.totalSupp.length; indexX++) {
                        const elementX = this.totalSupp[indexX];
                        if (element.supp == elementX.code) {
                            existsSupp = true
                            this.totalSupp[indexX]["start_amount"] = this.totalSupp[indexX]["start_amount"]+element.start_amount
                            this.totalSupp[indexX]["total_consume"] = this.totalSupp[indexX]["total_consume"]+element.total
                            this.totalSupp[indexX]["unds"] = this.totalSupp[indexX]["unds"]+element.total
                        }
                    }
                }

                if(!exists){
                    this.totalProduct.push({code:element.code,description:element.description,start_amount:element.start_amount,total_consume:element.total,unds:element.unds})
                }

                if(!existsSupp){
                    this.totalSupp.push({code:element.supp,start_amount:element.start_amount,total_consume:element.total,unds:element.unds})
                }
            }

            let info_chart = []
            for (let index = 0; index < this.totalProduct.length; index++) {
                const element = this.totalProduct[index];
                info_chart.push({name:`${element.code} - ${element.description}`, y: ((element.start_amount-element.total_consume)/element.start_amount)*100 })
            }

            let info_chart2 = []
            for (let index = 0; index < this.totalSupp.length; index++) {
                const element = this.totalSupp[index];
                info_chart2.push({name:`${element.code}`, y: ((element.start_amount-element.total_consume)/element.start_amount)*100 })
            }
            this.chartsprepare("container", 'Porcentaje de Variacion por Producto', info_chart)
            this.chartsprepare("container_prov", 'Porcentaje de Variacion por Proveedor', info_chart2)

            // console.log(total, totalConsume, this.totalSupp, this.totalProduct)
        },

        chartsprepare(name, title, infodata){
            Highcharts.chart(name, {
                data: {
                    table: 'datatable'
                },
                chart: {
                    type: 'column'
                },
                title: {
                    text: title
                },
                yAxis: {
                    allowDecimals: false,
                    title: {
                        text: 'Units'
                    }
                },
                // tooltip: {
                //     formatter: function () {
                //         return '<b>' + this.series.name + '</b><br/>' +
                //             this.point.y + ' ' + this.point.name.toLowerCase();
                //     }
                // },
                series: [{
                    name: 'Variacion',
                    data: infodata
                }]
            });
        },
        ///Filtros Para las Tablas
        onFiltered (filteredItems) {
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        ///Filtros Para las Tablas
        loadData(){
            if(this.dateStart != "" && this.dateStart != null)
            {
                this.$http
                .get(
                    inventory+`datasetinfomp/${moment(this.dateStart).format("YYYY-MM-DD")}/${moment(this.dateFinsh).format("YYYY-MM-DD")}`
                )
                .then(
                    function(response) {
                        this.tableData = []
                        console.log(response)
                        // this.tableData = response.body
                        let dtinfo = response.body[0].detalle
                        this.globalinfo= response.body[0].totales
                        for (let index = 0; index < dtinfo.length; index++) {
                            const element = dtinfo[index];
                            element["supp"] = element.product_lote.substring(0,3)

                            if(element.scrap >= element.start_amount){
                                element.scrap=0
                                element.unds_scrap=0
                            }
                            this.tableData.push(element)
                        }
                        this.tableCompleteData = this.tableData
                        this.calcinfototal()

                        this.totalRows = this.tableData.length
                        this.undsIniciales = this.tableData.length
                        this.currentPage = 1
                    },
                    function(response) {}
                );

                
            }
        },
    },
}
</script>
<template>
    <div>
        <h4 class="font-weight-bold py-3 mb-1">Planeador</h4>
     
        <b-nav class="justify-content-center mt-2">
            <b-nav tabs class="nav-sm tabs-alt">
                <b-nav-item :active="wizard_selectTab=='production_orders'" @click="eventSelectedTab('production_orders')">1 Orden de Producción</b-nav-item>
                <b-nav-item :active="wizard_selectTab=='sequence'" :disabled="slot_sequence" @click="eventSelectedTab('sequence')">2 Secuencia</b-nav-item>
                <b-nav-item :active="wizard_selectTab=='assembly'" :disabled="slot_assembly" @click="eventSelectedTab('assembly')">3 Montaje</b-nav-item>
                <b-nav-item :active="wizard_selectTab=='machine'" :disabled="slot_machine" @click="eventSelectedTab('machine')">4 Máquina</b-nav-item>
            </b-nav>
        </b-nav>

        <!-- Buttons -->
        <!-- <b-btn variant="default" slot="prev">Anterior</b-btn>
        <b-btn variant="default" slot="next">Siguiente</b-btn>
        <b-btn @click="finished_basic_order = false; crear_orden()" variant="primary" slot="finish">Finalizar</b-btn> -->

        <!-- <div v-show="wizard_selectTab=='sequence'"> -->
            <div id="viewport3d" class="w-100 overflow-auto" style="height:1000px"></div>
        <!-- </div> -->

        <div>
            <h4 class="text-right">Orden de Producción</h4>

            <div>
                <h3 class="text-center"> 
                    {{order_selected.products_code}}
                    <br>
                    {{order_selected.products_description}}
                    <h4> Número de Orden: {{order_selected.consecutive_order}}</h4>
                </h3>
                <div class="w-100 text-center">
                    <b-btn variant="success" @click="load_info_programmer" v-if="slot_sequence" >Confirmar</b-btn>
                    <b-btn variant="danger">Cancelar</b-btn>
                </div>
            </div>
            

                <b-row v-if="slot_sequence  && wizard_selectTab=='production_orders'">
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
                    <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
                    <!-- <b-col md="2" class="d-flex justify-content-center my-1">
                        <b-btn variant="outline-success icon-btn" class="btn-md" v-if="check_access('admin_um', 'c')" v-b-modal.modals-default @click.prevent="addData();objState={}"><i class="ion ion-md-add"></i></b-btn>&nbsp;
                        <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                    </b-col> -->
                    <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
                </b-row>
                <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
                <b-table small show-empty stacked="md" :items="tableData" :fields="columns">
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="schedule_order(row.item)"><i class="ion ion-md-create"></i></b-btn>
                            <!-- <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn> -->
                        </div>
                    </template>
                </b-table>
                <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div class="text-muted">
                        <small> Total Ordenes Pendientes: {{this.totalRows}} </small>
                    </div>
                </div>
        </div>

         <!-- <form-wizard class="form-wizard-boxed-steps" v-if="finished_basic_order">
            <template slot="step" slot-scope="props">
                <wizard-step :tab="props.tab" @click.native="props.navigateToTab(props.index)" @keyup.enter.native="props.navigateToTab(props.index)" :transition="props.transition" :index="props.index">
                <span slot="title" :class="{'text-danger':props.tab.validationError}" v-html="props.tab.title"></span>
                </wizard-step>
            </template>

            <tab-content title='Orden de Producción '>
                <b-card class="mb-3">
                

                </b-card>
            </tab-content>

            <tab-content title="<div class='small text-muted'>Secuencia</div>">
                <b-card class="mb-3">
                    <h5>Secuencia</h5>
                    <div class="w-100 overflow-auto" style="height:1000px">
                        <div id="viewport3d"></div>
                    </div>
                    
                </b-card>
            </tab-content>

            <tab-content title="Montaje">
                <b-card class="mb-3">
                    <h5>Montaje</h5> 
                </b-card>
            </tab-content>

            <tab-content title="<div class='small text-muted'>Máquina</div>">
                <b-card class="mb-3">
                    <h5>Máquina</h5> 
                    <b-nav class="justify-content-end mt-2">
                        <b-nav tabs class="nav-sm tabs-alt">
                            <b-nav-item :active="selectTab=='plant'"  @click="eventSelectedTab('plant')">Visualización 3D</b-nav-item>
                            <b-nav-item :active="selectTab=='machines'"  @click="eventSelectedTab('machines')">Visualización 2D</b-nav-item>
                            <b-nav-item :active="selectTab=='orders'" @click="eventSelectedTab('orders')">Ordenes</b-nav-item>
                            <b-nav-item :active="selectTab=='ideal'" @click="eventSelectedTab('ideal')">Situación Ideal</b-nav-item>
                        </b-nav>
                    </b-nav>
                </b-card>
            </tab-content>
            <b-btn variant="default" slot="prev">Anterior</b-btn>
            <b-btn variant="default" slot="next">Siguiente</b-btn>
            <b-btn @click="finished_basic_order = false; crear_orden()" variant="primary" slot="finish">Finalizar</b-btn>
        </form-wizard> -->

    </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-form-wizard/vue-form-wizard.scss" lang="scss"></style>
<script>
import { infoplanning } from "@/components/i40/js/iplanning";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

import {FormWizard, TabContent, WizardStep} from 'vue-form-wizard'
export default {
    components: {
    
        SweetModal,
        SweetModalTab,

        WizardStep,
        TabContent,
        FormWizard,

    },
    data() {
        return {
            selectTab:"plant",
            wizard_selectTab:'production_orders',

            finished_basic_order: true,

            show_tree:false,

            primerItem: "<div class='small text-muted'>PRODUCTO</div> ",
            segundoItem: "<div class='small text-muted'>RECETA</div> ",
            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla

            /// Columnas de las tablas
                columns: [
                    {key:'consecutive_order', label:"OP"},
                    {key:'products_code', label:"Código"},
                    {key:'products_description', label:"Descripción"},
                    {key:'customer_name', label:"Cliente"},
                    {key:'programmed_amount', label:"Programado"},
                    {key:'programmed_amount', label:"Planeado"},
                    {key:'deadline', label:"Fecha Limite"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Acciones"}
                ],
            /// Columnas de las tablas
            tableData: [],
            order_id:'0',
            slot_sequence:true,
            slot_assembly:true,
            slot_machine:true,

            order_selected:{}
        }
    },

    methods: {
        eventSelectedTab(value){
            this.wizard_selectTab = value
            // this.load_info_programmer()
        },     

        load_info_programmer(){
            document.getElementById('viewport3d').innerHTML = ''
            planning.display(document.getElementById('viewport3d'), "ideal", this.order_id)
            this.slot_sequence=false
            // planning.display(document.getElementById("viewport3d"),"ideal","90021")
            // console.log(this.order_id, this.selectTab)
        },
        
        schedule_order(item){
            this.order_selected = item
            this.order_id = item.production_order_id
            // this.load_info_programmer()
        },

        open_to_planning(){
            

            this.$refs.showFormulario.open()
        },

         ///Filtros Para las Tablas
            onFiltered (filteredItems) {
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
        ///Filtros Para las Tablas
    },

    mounted() {
        // planning.display(document.getElementById("viewport3d"),"ideal","90021")
    },
    
    beforeCreate() {
        
        // console.log('beforeCreate')
        // const psc = document.createElement("script")
        // //psc.async = true
        // //psc.defer = true
        // psc.src = "/static/three/three.js"
        // psc.onLoad = function(){
        //     console.log("Ya cargué el three")
        //     const psc1 = document.createElement("script")
        //     psc1.src = "/static/three/DragControls.js"
        //     document.head.appendChild(psc1)

        //     const psc2 = document.createElement("script")
        //     psc2.src = "/static/three/TrackballControls.js"
        //     psc2.onLoad = function() {
        //         console.log("Ya cargué los controles")
        //         const psc3 = document.createElement("script")
        //         psc3.src = "/static/min3d.js"
        //         document.body[0].appendChild(psc3)

        //     }
        //     document.head.appendChild(psc2)

        // }
        // document.head.appendChild(psc)
        
    },
    created() {
        
        infoplanning.getinforesources('parent-to-program').then(data =>{
                if(data.data != null && data.data != "")
                    this.tableData = data.data 
                else
                    this.tableData = []   
            })
        // console.log(planning)
        // google.charts.load("current", {packages:["timeline"]});
        // google.charts.setOnLoadCallback(drawChart());
        // function drawChart() {
        //     var container = document.getElementById('example3');
        //     console.log(container)
            
        //     var chart = new google.visualization.Timeline(container);
        //     var dataTable = new google.visualization.DataTable();
        //     dataTable.addColumn({ type: 'string', id: 'Position' });
        //     dataTable.addColumn({ type: 'string', id: 'Name' });
        //     dataTable.addColumn({ type: 'date', id: 'Start' });
        //     dataTable.addColumn({ type: 'date', id: 'End' });
            
        //     dataTable.addRows([
        //     [ 'President', 'George Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
        //     [ 'President', 'John Adams', new Date(1797, 2, 4), new Date(1801, 2, 4) ],
        //     [ 'President', 'Thomas Jefferson', new Date(1801, 2, 4), new Date(1809, 2, 4) ],
        //     [ 'Vice President', 'John Adams', new Date(1789, 3, 21), new Date(1797, 2, 4)],
        //     [ 'Vice President', 'Thomas Jefferson', new Date(1797, 2, 4), new Date(1801, 2, 4)],
        //     [ 'Vice President', 'Aaron Burr', new Date(1801, 2, 4), new Date(1805, 2, 4)],
        //     [ 'Vice President', 'George Clinton', new Date(1805, 2, 4), new Date(1812, 3, 20)],
        //     [ 'Secretary of State', 'John Jay', new Date(1789, 8, 25), new Date(1790, 2, 22)],
        //     [ 'Secretary of State', 'Thomas Jefferson', new Date(1790, 2, 22), new Date(1793, 11, 31)],
        //     [ 'Secretary of State', 'Edmund Randolph', new Date(1794, 0, 2), new Date(1795, 7, 20)],
        //     [ 'Secretary of State', 'Timothy Pickering', new Date(1795, 7, 20), new Date(1800, 4, 12)],
        //     [ 'Secretary of State', 'Charles Lee', new Date(1800, 4, 13), new Date(1800, 5, 5)],
        //     [ 'Secretary of State', 'John Marshall', new Date(1800, 5, 13), new Date(1801, 2, 4)],
        //     [ 'Secretary of State', 'Levi Lincoln', new Date(1801, 2, 5), new Date(1801, 4, 1)],
        //     [ 'Secretary of State', 'James Madison', new Date(1801, 4, 2), new Date(1809, 2, 3)]
        //     ]);

            
        //     chart.draw(dataTable);
        // }
        // const psc3 = document.createElement("script")
        // psc3.src = "@/i40/planner.js"
        // document.head.appendChild(psc3)

        // const psc4 = document.createElement("script")
        // psc4.src = "@/i40/viewer.js"
        // document.head.appendChild(psc4)
    }, 
    beforeMount() {
    },
}
</script>

<style>
			#workspace { padding:4px; font-size: 9pt; width: 64px;}
			#machines { overflow-x: auto; white-space: nowrap; }
			#machines div {
				font-family: 'Verdana';
				font-size: 9pt;
			}
			.date {
				display: inline-block;
				border: 1px solid black;
        overflow-x: hidden;
				min-width: 24px;
				padding: 4px;
				margin: 2px;
			}
			.slot {
				display: inline-block;
				border: 1px solid black;
        overflow-x: hidden;
				text-overflow: ellipsis;
				min-width: 2px;
				padding: 4px;
				margin: 0px;
				cursor:pointer;
			}
			.inactive {
				background-color: #c0c0c0;
			}
			.empty {
				background-color: #c0c0f0;
			}
			.programmed {
				background-color: #c0f0c0;
			}
			.error {
				border-color: #f00000;
			}
</style>
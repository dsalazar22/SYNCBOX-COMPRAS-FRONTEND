<template>
    <div>

        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Subrepartos  <span class="font-weight-light">INFO ---</span></h4>

        

            <div class="mb-2" v-if="arraytblOriginal[2] != null">
                <b-btn v-if="arraytblOriginal[2].enero != null" size="xs" variant="danger" block @click="cancelarLiquidacion()"><i class="ion ion-md-checkmark"> </i> &nbsp;&nbsp; Cancelar Liquidación SERPRO</b-btn>
                <b-btn v-if="arraytblOriginal[2].enero == null" size="xs" variant="success" block @click="ejecutarLiquidacion()"><i class="ion ion-md-checkmark"> </i> &nbsp;&nbsp; Liquidar SERPRO</b-btn>
            </div>

        <div id="wsinfo" class="text-center"></div>    

            <div>
                <div>
                    <b-table-simple style="font-size:12px;">
                        <b-thead>
                        <b-tr>
                            <b-th>Codigo</b-th>
                            <b-th>Descripcion</b-th>
                            <b-th>Promedio</b-th>
                            <b-th class="text-center">Detalle</b-th>
                            <b-th class="text-center">Mes a Mes</b-th>
                        </b-tr>
                        </b-thead>
                        <b-tbody>

                            <!-- @click="selectedRow(item)" -->

                        <b-tr v-for="(item ,index)  in (arraytblOriginal)" :key="index" >
                            <b-td data-th="Codigo" @click="toggle(item, index);" >

                            <span class="q-tree-link q-tree-label" v-bind:style="setPadding(item)">                
                                <!-- <q-icon  style="cursor: pointer;" 
                                :name="iconName(item)" color="secondary"  ></q-icon> -->
                                <i :class="'text-success fas fa-'+ iconName(item)"></i>
                                {{item.code}}
                            </span>

                            </b-td>
                            <b-td data-th="Descripcion">{{item.description}}</b-td>
                            <b-td width="20%" data-th="Promedio"> {{numberWithCommas(item.prom_total)}} </b-td>
                            <b-td width="20%" data-th="Detalle" >
                                    <div class="text-center">
                                        <small>  {{ item.parentvalue==null ? '100' : ((item.prom_total / (item.parentvalue))*100).toFixed(2) }} %</small>
                                    </div>
                                    <b-progress :max="1" height="0.3rem"  style="border-radius: 0.2rem;">
                                        <b-progress-bar :value="item.parentvalue==null ? 1 : item.prom_total / item.parentvalue">
                                        </b-progress-bar>
                                    </b-progress>
                            </b-td>
                            <b-td width="20%" data-th="Mes a Mes" class="text-center">
                                    <sparkline>
                                        <sparklineBar
                                        :data="calcChartData(item)"
                                        :margin="spMargin4"
                                        :limit="calcChartData(item).length"
                                        :styles="spBarStyles4"
                                        :refLineStyles="spRefLineStyles4" />
                                    </sparkline>
                            </b-td>
                        </b-tr>
                        </b-tbody>
                    </b-table-simple>
                </div>
            </div>

            <div class="accordion" role="tablist">
                <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block v-b-toggle.accordion-1 variant="warning">Codigos Con Problemas</b-button>
                </b-card-header>
                <b-collapse id="accordion-1" :visible='false' accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <b-table-simple style="font-size:12px;">
                            <b-thead>
                                <b-tr>
                                    <b-th>Codigo</b-th>
                                    <b-th>Descripcion</b-th>
                                    <b-th>Operacion</b-th>
                                    <b-th>Codigo CT</b-th>
                                    <b-th>Descripcion CT</b-th>
                                </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr v-for="(item ,index)  in (arrayCCProblems)" :key="index" >
                                    <b-td data-th="Codigo"> {{item.code}} </b-td>
                                    <b-td data-th="Descripcion"> {{item.product_description}} </b-td>
                                    <b-td data-th="Operacion"> {{item.operation_description}} </b-td>
                                    <b-td data-th="Codigo CT"> {{item.ws_code}} </b-td>
                                    <b-td data-th="Descripcion CT"> {{item.ws_description}} </b-td>
                                </b-tr>
                            </b-tbody>
                        </b-table-simple>
                    </b-card-body>
                </b-collapse>
                </b-card>
            </div>

    </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/libs/vue-input-tag/vue-input-tag.scss" lang="scss"></style>

<script>
    import Vue from 'vue'
    import Sparkline from 'vue-sparklines'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { infocosts } from "@/components/i40/js/costs";
    import Multiselect from 'vue-multiselect'

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    // Import this component
    import datePicker from "vue-bootstrap-datetimepicker";
    // Import date picker css
    import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

    import InputTag from 'vue-input-tag'
  
    Vue.use(Notifications)
    Vue.use(datePicker);
    Vue.use(Sparkline)


    export default {
    
        metaInfo: {
            title: 'Presupuesto Centro de Costos'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab,
            Multiselect,
            InputTag,
            // datePicker,
        },

        computed: {
            arraytblOriginal() {
                let vm = this;
                var newObj = [];
                vm.recursive(vm.tblOriginal, newObj, 0, vm.itemId, vm.isExpanded);
                return newObj;
            }
        },
       
        data: () => ({

            spData4: (() => {
                const len = 10
                return Array.from({
                length: len
                }, () => Math.floor(Math.random() * len))
            })(),

            spMargin4: 2,
            spBarStyles4: {
                fill: '#54a5ff'
            },
            spLineStyles4: {
                stroke: '#d14'
            },
            spRefLineStyles4: {
                stroke: '#d14',
                strokeOpacity: 1,
                strokeDasharray: '3, 3'
            },
            
            isExpanded: true,
            itemId: null,

            name: 'um',
            version: 'v1.0.0.0',
            tblFilter:[],
            windowHeight: 0,
            totalRows:0,
            tblOriginal:[],

            arrayCCProblems:[],

            wsresultado:'uno'

        }),
        methods:{
            cancelarLiquidacion(){
                
                infocosts.delliquidarserpro().then(data =>{
                    this.showData()
                })
            },
            
            calcChartData(item){
                var chart = []
                if(item.enero != null)
                chart = [item.enero.toFixed(0),item.febrero.toFixed(0),item.marzo.toFixed(0),item.abril.toFixed(0),item.mayo.toFixed(0),item.junio.toFixed(0),item.julio.toFixed(0),item.agosto.toFixed(0),item.septiembre.toFixed(0),item.octubre.toFixed(0),item.noviembre.toFixed(0),item.diciembre.toFixed(0)]

                return chart

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

            iconName(item) {
                if (item.expend == true) {
                    return "minus";
                }

                if (item.detalle && item.detalle.length > 0) {
                    return "plus";
                }

                return "check";
            },

            toggle(item, index) {
                let vm = this;
                vm.itemId = item.code;
                item.detalle.sort((a,b) => (a.prom_total < b.prom_total) ? 1 : -1)

                item.leaf = false;

                // console.log(item)
                //show  sub items after click on + (more)
                if (
                    item.leaf == false &&
                    item.expend == undefined &&
                    item.detalle != undefined
                ) {
                    if (item.detalle.length != 0) {
                        for (let index = 0; index < item.detalle.length; index++) {
                            item.detalle[index]['parentvalue'] = (item.prom_total < 0 ? -1*item.prom_total :item.prom_total )
                        }
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

            setPadding(item) {
                return `padding-left: ${item.level * 30}px;`;
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
           
            showData: function(){
                infocosts.getSubreparto().then(data =>{
                    if (data.data === ""){
                        this.tblOriginal=[]
                        this.totalRows=0
                    }else{
                        this.tblOriginal=data.data
                        this.totalRows = this.tblOriginal.length
                    }
                })

                infocosts.getroutesproblems().then(data =>{
                    // console.log(data)
                    if(data.data != ""){
                        this.arrayCCProblems = data.data
                    }else{
                        this.arrayCCProblems = []
                    }
                })
            },

            ejecutarLiquidacion: function(){


                infocosts.ejecutarLiquidacion().then(data =>{
                    if(data.data == "ok")
                        this.showData()
                })


            },

            validarLiquidacion: function(){
                for (let index = 0; index < this.tblOriginal.length; index++) {
                    const element = this.tblOriginal[index];
                    if(element.cc_clase == "LIQUIDACION"){
                        // console.log(element.prom_total)
                        if(element.prom_total != 0 && element.prom_total != null){
                            return false
                        }else{
                            return true
                        }
                    }
                    
                }
            }
        },

        created(){
            this.showData()


                const socket = infocosts.costsrt()
                socket.on("connection", function(data){
                    console.log(data)
                });
                socket.on("costs-state", function(data){
                    // console.log(data)
                    this.wsresultado = data
                    
                    var s = document.getElementById("wsinfo");
                    s.innerHTML = data;

                    // console.log(document)
                });

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
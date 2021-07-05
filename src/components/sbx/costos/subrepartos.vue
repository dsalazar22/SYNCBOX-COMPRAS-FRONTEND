<template>
    <div>

        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-4">Subrepartos  <span class="font-weight-light">INFO ---</span></h4>

            <div class="mb-2">
                <b-btn v-if="arraytblOriginal[2].enero != null" size="xs" variant="danger" block @click="cancelarLiquidacion()"><i class="ion ion-md-checkmark"> </i> &nbsp;&nbsp; Cancelar Liquidación SERPRO</b-btn>
                <b-btn v-if="arraytblOriginal[2].enero == null" size="xs" variant="success" block @click="ejecutarLiquidacion()"><i class="ion ion-md-checkmark"> </i> &nbsp;&nbsp; Liquidar SERPRO</b-btn>
            </div>

            <div class="q-table-container q-table-dense">
                <div class="q-table-middle scroll">
                    <table class="q-table">
                        <thead>
                        <tr class style="text-align: left;">
                            <th>Codigo</th>
                            <th>Descripcion</th>
                            <th>Promedio</th>
                            <th class="text-center">Detalle</th>
                            <th class="text-center">Mes a Mes</th>
                        </tr>
                        </thead>
                        <tbody>

                            <!-- @click="selectedRow(item)" -->

                        <tr v-for="(item ,index)  in (arraytblOriginal)" :key="index" >
                            <td data-th="Codigo" @click="toggle(item, index);" >

                            <span class="q-tree-link q-tree-label" v-bind:style="setPadding(item)">                
                                <!-- <q-icon  style="cursor: pointer;" 
                                :name="iconName(item)" color="secondary"  ></q-icon> -->
                                <i :class="'text-success fas fa-'+ iconName(item)"></i>
                                {{item.code}}
                            </span>

                            </td>
                            <td data-th="Descripcion">{{item.description}}</td>
                            <td width="20%" data-th="Promedio"> {{numberWithCommas(item.prom_total)}} </td>
                            <td width="20%" data-th="Detalle" >

        
                                    <div class="text-center">
                                        <small>  {{ item.parentvalue==null ? '100' : ((item.prom_total / (item.parentvalue))*100).toFixed(2) }} %</small>
                                    </div>
                                    <b-progress :max="1" height="0.3rem"  style="border-radius: 0.2rem;">
                                        <b-progress-bar :value="item.parentvalue==null ? 1 : item.prom_total / item.parentvalue">
                                        </b-progress-bar>
                                    </b-progress>
                            </td>
                            <td width="20%" data-th="Mes a Mes" class="text-center">
                                    <sparkline>
                                        <sparklineBar
                                        :data="calcChartData(item)"
                                        :margin="spMargin4"
                                        :limit="calcChartData(item).length"
                                        :styles="spBarStyles4"
                                        :refLineStyles="spRefLineStyles4" />
                                    </sparkline>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

    </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/libs/vue-input-tag/vue-input-tag.scss" lang="scss"></style>
<script src="https://unpkg.com/quasar-framework@^0.16.0/dist/umd/quasar.mat.umd.min.js"></script>

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

<style>
  @import 'https://unpkg.com/quasar-framework@^0.16.0/dist/umd/quasar.mat.min.css';
</style>
<template>
    <div>
        <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
            <div>Cierre de Turno</div> 
        </h4>

        <b-modal id="modals-top" v-model="messageContent"  class="modal-center" size="md" hide-footer title="Adicionar Contenido"> 
            <div>
                <b-form-group label="Valor Real" class="mt-2">
                    <b-input placeholder="Valor Real" type="number" v-model.trim="valorreal" />
                </b-form-group>
            </div>
            <div>
                <b-form-group label="Unidades Programadas" class="mt-2">
                    <b-input placeholder="Unidades Programadas" type="number" v-model.trim="unidsProgramadas" />
                </b-form-group>
            </div>
            <b-form-group label="Comentarios" class="mt-2">
                <b-form-textarea placeholder="Comentarios...."
                    rows="4"
                    max-rows="50"
                    v-model="content"
                ></b-form-textarea>
            </b-form-group>

            <div class="w-100 text-right mt-2">
                <b-btn variant="primary" @click="messageContent=false">Cancelar</b-btn>
                <b-btn variant="success" @click="submit()">Guardar</b-btn>
            </div>
        </b-modal>

        <b-modal id="modals-top" v-model="resumenturno"  class="modal-center" size="xl" hide-footer title="Adicionar Contenido"> 

            <b-form-group label="Comentarios" class="mt-2">
                <b-form-textarea placeholder="Comentarios...."
                    rows="4"
                    max-rows="50"
                    v-model="contentPpal"
                ></b-form-textarea>
            </b-form-group>

            <div class="w-100 text-right mt-2">
                <!-- <b-btn variant="primary" @click="resumenturno=false">Cancelar</b-btn> -->
                <b-btn variant="success" @click="submitppalcomm()">Guardar</b-btn>
            </div>

             <div class="flex-grow-1 position-relative" style="height:600px">

                <perfect-scrollbar :options="{ suppressScrollX: true, wheelPropagation: true }" class="chat-messages chat-scroll p-4">

                    <div v-for="(message, index) in chatData" :key="message.id" >
                            <!-- {{message.turno}} {{selectedTurn}} -->
                        <div v-if="message.turno == selectedTurn && message.fechaproduccion == fechaproduccion" class="mb-2">
                            <div v-if="index == 0" class="mb-2">
                                <!-- <b-btn block >Cargar Información Anterior</b-btn> -->
                            </div>
                            <div v-if="message.modulo != 'CT'">
                                <div class="flex-shrink-1 rounded py-2 px-0" :class="message.modulo == 'TP' ? 'border border-warning' : message.modulo == 'CL' ? 'border border-info' : 'border border-success'">
                                    <div v-if="message.modulo != 'CT'" class="font-weight-semibold mb-1 boder border-bottom" :class="message.modulo == 'TP' ? 'border-warning' : message.modulo == 'CL' ? 'border-info' : 'border-success'">
                                        <div class="mr-2 text-center">
                                            {{message.codigo}} - {{message.producto}}
                                            <div class="text-muted small text-nowrap mt-0"><b>Fecha Produccion: </b>{{fechaproduccion}}  <b>Turno: </b>{{selectedTurn}}  </div>
                                            <div class="text-muted small text-nowrap mt-0"><b>Fecha Inicio: </b>{{message.fechainicio}}  <b>Fecha Fin: </b>{{message.fechafin}}  </div>
                                        </div>
                                    </div>
                                
                                <!-- <div v-if="message.modulo == 'CT'" class="font-weight-semibold mb-1 boder border-bottom" :class="message.modulo == 'TP' ? 'border-warning' : message.modulo == 'CL' ? 'border-info' : 'border-success'">
                                    <div class="mr-2 text-center">
                                        {{message.codigo}} - {{message.producto}}
                                        <div class="text-muted small text-nowrap mt-0"><b>Fecha Inicio: </b>{{message.fechainicio}}  <b>Fecha Fin: </b>{{message.fechafin}}  </div>
                                    </div>
                                </div>

                                    <div v-if="message.modulo == 'CT'" class="mb-2">
                                        <b-table small show-empty stacked="md" :items="message.performance" :fields="[{key:'idordenproduccion', label:'# OP'},{key:'codigo', label:'Codigo'},{key:'producto', label:'Producto'},{key:'esperado', label:'Und Esperadas'},{key:'totalproducido', label:'Und Producido'},{key:'tiempototaltrabajo', label:'Min Trabajado'},{key:'microparos', label:'Min Perdidos'},{key:'eficiencia', label:'Eficiencia'}]">

                                            <template v-slot:cell(eficiencia)="row">
                                                <div class="text-left">
                                                    {{((row.item.totalproducido / row.item.esperado)*100).toFixed(2)}}
                                                </div>
                                            </template>

                                        </b-table>
                                    </div> -->

                                    

                                <div v-for="msg in message.messages" :key="msg.created" :class="`chat-message-${msg.user_id == userInfo.iduser ? 'right' : 'left'}`" class="mb-4">
                        
                        
                                    <div class="flex-shrink-1 bg-lighter rounded py-2 px-3" :class="msg.user_id == userInfo.iduser ? 'mr-3' : 'ml-3'">
                                    <div class="font-weight-semibold mb-1">{{msg.user_id == userInfo.iduser ? 'Usted' : msg.username}} | {{msg.created}}</div>
                                    {{msg.message}}
                                    <!-- <markdown-it-vue class="md-body" :content="msg.message" /> -->
                                    </div>
                                    <!-- <br>
                                    <div class="text-muted small text-nowrap mt-2">{{msg.created}}</div> -->
                                </div> 
                                </div>
                                    <!-- <div class="text-right"> -->
                                        <!-- <b-btn variant="primary rounded-pill icon-btn mr-1" @click="openMessageContent(message)" ><i class="fas fa-comments"></i></b-btn> -->
                                        <!-- <b-btn size="sm" @click="cargarDatos()" variant="outline-info icon-btn borderless"><span class="fas fa-comments"></span></b-btn> -->
                                    <!-- </div> -->
                            </div>
                        </div>
                    </div>

                </perfect-scrollbar>
                <!-- / .chat-messages -->
            </div>
        </b-modal>

        <div class="col-sm-12 col-md-12 col-lg-12">
            <div class="row mb-1">
                <div class="col-md-1">
                </div>
                <div class="col-md-5">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                        <date-picker v-model="dateStart" :config="options"></date-picker>
                    </div>
                </div>
                    
                <div class="col-md-5">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                        <date-picker v-model="dateFinsh" :config="options"></date-picker>
                    </div> 
                </div>
                <div class="col-md-1">
                </div>
            </div>
        </div>
        
        <div class="text-center mb-2">
            <button type="button" class="btn btn-success" v-on:click="searchInfo('')">Consultar</button>
            <!-- <button type="button" class="btn btn-success" v-on:click="exportExcel('')">Exportar</button>             -->
        </div>

        <div class="text-center mb-2">
            {{contentPpal}} 
            <br>
            <b-btn variant="primary rounded-pill" size="xs"  @click="resumenturno=true"><span class="ion ion-md-add"></span>&nbsp; Adicionar Cierre</b-btn>
        </div>
        

        <b-row>
            <b-col md="2">
                <b-list-group v-for="item in itemsDates">
                    <b-list-group-item :variant="selectedDate==`${item.fecha}T${item.turn}`?'dark':'white'" button @click="seleccionarFecha(`${item.fecha}T${item.turn}`);contentPpal=item.message">{{item.fecha}} Turno {{item.turn}}</b-list-group-item>
                </b-list-group>
            </b-col>
            <b-col md="10">
                <b-table small show-empty stacked="md" :items="tableDataInfoFiltred"  :fields="columns">
                    <template v-slot:cell(centrotrabajo)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click="openform(row.item);messageContent=true"><i class="ion ion-md-create"></i></b-btn>
                            {{row.item.centrotrabajo}}
                        </div>
                    </template>
                    <template v-slot:cell(producto)="row">
                        <div class="text-left">
                            {{row.item.codigo}} {{row.item.producto}}
                        </div>
                    </template>
                </b-table>
            </b-col>
        </b-row>

    </div>
</template>
<style src="@/vendor/styles/pages/chat.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
// require("@/i40/vendor/highcharts.js");
import { infoplanning } from "@/components/i40/js/iplanning";
import { infotraza } from "@/components/i40/js/traza";
import Multiselect from 'vue-multiselect'
import { infomaster } from "@/components/i40/js/master";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue' 
// Datepicker
import moment from 'moment'
// Import this component
import datePicker from 'vue-bootstrap-datetimepicker';
// Import date picker css
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
import { infouser } from "@/vendor/sbx/sbx-users/users";
import { inforundb } from "@/components/i40/js/rundb";
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'

export default {
    metaInfo: {
        title: 'Bitácora'
    },
    components: {
        Multiselect,
        SweetModal,
        datePicker,
        SweetModalTab,
        PerfectScrollbar
        // Scrollable,
        // datePicker
    },
    watch: {
        "selectedWorkstation": function (values) {
            this.loadTimeline(values.code)
        },

        "$route.params.code":function(values){
            this.codearea = values

            infotraza.bitacora({area_info:values}, 1, 'area').then(data =>{
                this.tableData = []
                if(data.data != "")
                this.tableData = data.data
                // // console.log(data)
                // this.content = ''
                // this.messageContent = false
                // this.cargarDatos(this.chatUser)
            })
        }
    },
    data() {
        return {
            contentPpal:"",
            resumenturno:false,
            chatData:[], 
            
            itemsDates:[],
            workstationdata:[],
            userInfo:{},
            columnsInfo:[],
            workstations:[],
            selectedWorkstation:{},
            infodetails:"",
            recommend:"",
            messageid:"",
            selectedTurn:null,
            dateStart:null,
            dateFinsh:null,
            
            valorreal:null,
            unidsProgramadas:null,
            content:"",
            intervalid:null,

            selectedDate:"",

            module_id:0,
            selectedFiles:[],
            messageContent:false,
            options: {
                format: 'YYYY-MM-DD',
                // useCurrent: false,
                // minDate:Date(),
            } ,

            tableData:[],
            tableDataInfo:[],
            tableDataInfoFiltred:[],

            columns: [
                {key:'centrotrabajo', label:"CT"},
                {key:'producto', label:"Producto"},
                {key:'tiempototaltrabajo', label:"Min Trabajo"},
                {key:'programmed_amount', label:"Und Programadas"},
                {key:'real_value', label:"Und Reales"},
                {key:'esperado', label:"Und Esperadas"},
                {key:'cumplimiento', label:"Cumplimiento"},
                // {key:'message', label:"Comentario"},
                // {key:'details', label:"Detalles"},
            ]
        }
    },

    methods: {
        submitppalcomm(){
            
            let selectedformessage = {}
            selectedformessage.user_id =this.userInfo.iduser
            selectedformessage.message =this.contentPpal
            selectedformessage.date_turn=this.selectedDate.split('T')[0]
            selectedformessage.turn=this.selectedDate.split('T')[1]

            infotraza.savecloseturn(selectedformessage).then(data =>{
            })
        },

        seleccionarFecha(item){
            this.selectedDate=item
            this.tableDataInfoFiltred = []
            this.selectedTurn = item.split('T')[1]
            this.fechaproduccion = item.split('T')[0]

            for (let index = 0; index < this.tableDataInfo.length; index++) {
                const element = this.tableDataInfo[index];
                if(element.fechaproduccion+'T'+element.turno == item)
                    this.tableDataInfoFiltred.push(element)

            }
        },

        openform: function(item) {
            this.valorreal=item.real_value
            this.unidsProgramadas=item.programmed_amount
            this.content=item.message
            this.intervalid = item.intervalo
        },

        submit: function() {

            let selectedformessage = {}
            selectedformessage.user_id =this.userInfo.iduser
            selectedformessage.message =this.content
            selectedformessage.valorreal=this.valorreal
            selectedformessage.unidsprogramadas=this.unidsProgramadas
            selectedformessage.id=this.intervalid

            infotraza.saverealvalue(selectedformessage).then(data =>{
                infotraza.getinfodates(this.dateStart+'/'+this.dateFinsh).then(data =>{
                        this.tableDataInfo = []
                        if(data.data != ""){
                            this.tableDataInfo = data.data

                            this.seleccionarFecha(this.selectedDate)

                        }
                    })
                this.messageContent = false
            })
        },

        formatNames(files) {
            this.selectedFiles = files
            if (files.length === 1) {
                return files[0].name
            } else {
                return `${files.length} files selected`
            }
        },

        loadTimeline(wscode){
            infotraza.timeline(wscode).then(data => {
                this.columnsInfo=data.data
                var container = document.getElementById('timeline');
                this.chart = new google.visualization.Timeline(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ type: 'string', id: 'Eventos' });
                dataTable.addColumn({ type: 'string', id: 'Evento' });
                dataTable.addColumn({ type: 'string', role: 'style' });
                // dataTable.addColumn({ type: 'string', role: 'tooltip' });
                dataTable.addColumn({ type: 'date', id: 'Start' });
                dataTable.addColumn({ type: 'date', id: 'End' });
                let color = []
                let rows = []

                for (let index = 0; index < data.data.length; index++) {
                    const element = data.data[index];
                    var dt = new Date(element.fechainicio);
                    var dtf = new Date(element.fechafin);
                    rows.push(['Timeline',element.descripcion, element.color, new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds()), new Date(dtf.getFullYear(), dtf.getMonth(), dtf.getDate(), dtf.getHours(), dtf.getMinutes(), dtf.getSeconds())])
                }
                var options = {timeline: { showBarLabels: false }};
                dataTable.addRows(rows);
                this.chart.draw(dataTable, options);
                this.chart.mx = this
                let ix = this.chart
                google.visualization.events.addListener(ix, 'select', function() {
                    var selection = ix.getSelection();
                    if (selection.length > 0) {
                        let vvvv = {}
                        let rowvalue = ix.mx.columnsInfo[selection[0].row].descripcion
                        vvvv.module = rowvalue.split(' - ')[0].substring(0,2)
                        vvvv.id = rowvalue.split(' - ')[0].substring(2,vvvv.id = rowvalue.split(' - ')[0].split('| ')[0].length-1)
                        // ix.mx.messageContent = true
                        // ix.mx.selectedformessage.modulo =  vvvv.module
                        // ix.mx.selectedformessage.id =  vvvv.id
                        ix.mx.module_id = rowvalue.split(' - ')[0].substring(2,vvvv.id = rowvalue.split(' - ')[0].split('| ')[0].length-1)
                        ix.mx.modulo = rowvalue.split(' - ')[0].substring(0,2)
                        ix.mx.messageid = ix.mx.columnsInfo[selection[0].row].descripcion.split("|")[0]
                        ix.mx.dateStart = ix.mx.columnsInfo[selection[0].row].fechainicio
                        ix.mx.dateFinsh = ix.mx.columnsInfo[selection[0].row].fechafin
                        ix.mx.title = ix.mx.columnsInfo[selection[0].row].descripcion.split("|")[1]
                    }
                });
            });
        },

        getWorkstations(){
            infotraza.getworkstation().then(data =>{
                this.workstationdata = data.data
            })
        },

        formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;

            return [year, month, day].join('-');
        },

        searchInfo(){
            // console.log(this.dateStart, this.formatDate(this.dateStart))

            // console.log(this.dateFinsh)
            Date.prototype.addHours = function(dd, h) {
            this.setTime(dd + (h*60*60*1000));
                return this;
            }


            infotraza.getinfodates(this.dateStart+'/'+this.dateFinsh).then(data =>{
                this.tableDataInfo = []
                if(data.data != ""){
                    this.tableDataInfo = data.data
                    // console.log(data.data)
                    // this.tableDataInfoFiltred = data.data
                }

                infotraza.getdate(this.dateStart+'/'+this.dateFinsh).then(data =>{
                    this.itemsDates = []
                    if(data.data != "")
                        this.itemsDates = data.data
                    })

            var date = new Date();
            let finish = this.formatDate(date.addHours(Date.parse(this.dateFinsh),48))

                infotraza.getinfows("all_wscode/" + this.dateStart + " 00:00:00/" + finish + " 23:59:59").then(data =>{
                    this.chatData = data.data
                })

            })
        },

        exportExcel: function () {
            let content = []
            for (let index = 0; index < this.tableData.length; index++) {
                const element = this.tableData[index];

                content.push({centro_trabajo:element.wscode, titulo: element.title, 
                    mensaje:element.message, detalles:element.details, usuario:element.username, fecha_creacion:element.created, 
                    fecha_inicio:element.start_date, fecha_fin: element.finish_date})
            }
            let data = XLSX.utils.json_to_sheet(content)
            const workbook = XLSX.utils.book_new()
            const filename = 'bitacora'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
    },

    created() {
        infouser.currentUser().then(response =>{
                this.userInfo=response.data
            }).catch(e => {
        });
        Date.prototype.addHours = function(h) {
            this.setTime(this.getTime() + (h*60*60*1000));
            return this;
        }
        this.codearea = this.$route.params.code 
        google.charts.load('current', {'packages':['timeline']});

        this.dateStart = this.formatDate(new Date())
        this.dateFinsh = this.formatDate(new Date())
        this.getWorkstations()
        this.$options.interval = setInterval(this.getWorkstations, 5000)


    },
    beforeDestroy () {
        clearInterval(this.$options.interval)
    }
}
</script>

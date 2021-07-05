<template>
    <div>
        <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
            <div>Bitácora</div> 
            <b-btn variant="primary rounded-pill" class="d-block" @click="openform(); messageContent=true"><span class="ion ion-md-add"></span>&nbsp; Adicionar Nuevo Reporte</b-btn>
        </h4>

        <b-modal id="modals-top" v-model="messageContent"  class="modal-center" size="xl" hide-footer title="Adicionar Contenido"> 
            <div>
                <b-form-group label="Seleccione un Centro de Trabajo" class="mt-2">
                    <multiselect
                    v-model="selectedWorkstation"
                    :options="workstations"
                    placeholder="Centro de Trabajo"
                    label="code"
                    track-by="code" />
                </b-form-group>
            </div>

            <div :id="'timeline'" style="height: 110px;" ></div>

            <div>
                <b-form-group v-if="arrModulo.length>0" label="Titulos Predefinidos" >
                    <b-select v-model="moduleSelected" :options="arrModulo" />  
                </b-form-group>
                <b-form-group label="Tipo de Actividad" class="mt-2">
                    <b-input placeholder="Tipo de Actividad" v-model.trim="title" />
                </b-form-group>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-group label="Fecha Real Inicial">
                        <date-picker v-model="dateStart" :config="options"></date-picker>
                    </b-form-group>
                </div>
                    
                <div class="col-md-6">
                    <b-form-group label="Fecha Real Final">
                        <date-picker v-model="dateFinsh" :config="options"></date-picker>
                    </b-form-group>
                </div>
            </div>
            <b-form-group label="Detalle de la Actvidad Realizada / Comentarios" class="mt-2">
                <b-form-textarea placeholder="Detalle...."
                    rows="4"
                    max-rows="50"
                    v-model="content"
                ></b-form-textarea>
            </b-form-group>
            <b-form-group label="Actividades Pendientes / Recomendaciones" class="mt-2">
                <b-form-textarea placeholder="Actividades/Recomendaciones...."
                    rows="4"
                    max-rows="50"
                    v-model="recommend"
                ></b-form-textarea>
            </b-form-group>

            <template>
                <b-form-file multiple :file-name-formatter="formatNames"></b-form-file>
            </template>

            <div class="w-100 text-right mt-2">
                <b-btn variant="primary" @click="messageContent=false">Cancelar</b-btn>
                <b-btn variant="success" @click="submit()" :disabled="!messageStatus">Guardar</b-btn>
            </div>
        </b-modal>

        <div class="col-sm-12 col-md-12 col-lg-12">
            <div class="row mb-1">
                <div class="col-md-1">
                </div>
                <div class="col-md-5">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Fecha Inicial:</span>
                        <date-picker v-model="dateStartSearch" :config="options"></date-picker>
                    </div>
                </div>
                    
                <div class="col-md-5">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Fecha Final:</span>
                        <date-picker v-model="dateFinshSearch" :config="options"></date-picker>
                    </div> 
                </div>
                <div class="col-md-1">
                </div>
            </div>
        </div>
        
        <div class="text-center mb-2">
            <button type="button" class="btn btn-success" v-on:click="searchInfo('')">Consultar</button>
            <button type="button" class="btn btn-success" v-on:click="exportExcel('')">Exportar</button>            
        </div>

        <b-nav class="justify-content-end mb-2">
            <b-nav tabs class="nav-sm tabs-alt">
                <b-nav-item :active="selectTab=='bitacora'"  @click="selectTab='bitacora'">Bitacora</b-nav-item>
                <b-nav-item :active="selectTab=='llamados'"  @click="selectTab='llamados'">Llamados</b-nav-item>
            </b-nav>
        </b-nav> 

        <b-input-group>
            <b-form-input v-model="filter" placeholder="Buscar..." />
            <b-input-group-append>
            <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
            </b-input-group-append>
        </b-input-group>



                <div class="row" :class="`contacts-col-view`">
                    <div v-for="item in this.tableData" :key="'ID'+item.message_id" class="contacts-col col-xs-12 col-sm-12 col-md-12">
                        <b-card class="m-1"  no-body>

                            <!-- {{contact}} -->
                             
                            <div class="contact-content m-2">
                                <div class="contact-content-about">
                                    <h5 class="contact-content-name mb-1"><i v-if="item.details" class="fas fa-circle text-warning"></i> <router-link :to="{path:'det/'+item.message_id}"  target='_blank' class="text-body">{{item.wscode}}</router-link> <span class="text-lighter">{{item.title}} </span> </h5>
                                    <div class="small">
                                        <div v-if="item.title">  </div>
                                        <div v-if="item.username"> <strong>Por:</strong>  {{item.username}}  &nbsp; <span class="text-lighter">|</span> &nbsp; <strong>Fecha de Creacion:</strong>  {{item.created}}  </div>
                                        <!-- <div v-if="item.phone"> Direccion: {{item.address}}   </div>
                                        <div v-if="item.phone"> Telefono: {{item.phone}} </div> -->
                                    </div>
                                    <hr class="my-1 border-light">

                                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'det/'+item.message_id}"  target='_blank' v-if="item.docs != 0 && item.module != 'CL'" ><i class="fa fa-paperclip"></i></b-btn> {{item.message}}

                                    <!-- <hr class="my-1 border-light">
                                    <div>

                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="customerSelected=contact; data_change(contact,'edit')"><i class="ion ion-md-create"></i></b-btn>
                                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="customerSelected=contact; data_change(contact,'delete'); selectTab = 'gral'"><i class="ion ion-md-close"></i></b-btn>
                                        
                                         &nbsp;&nbsp; <span class="text-lighter">|</span> &nbsp;&nbsp; 

                                         <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="customerSelected=contact; data_change(contact,'edit'); selectTab = 'direcciones'"><i class="fas fa-map-marker"></i></b-btn>
                                         <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="customerSelected=contact; data_change(contact,'edit'); selectTab = 'contactos'; getCustomerContacts()"><i class="fas fa-address-card"></i></b-btn>
                                         <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="customerSelected=contact; data_change(contact,'edit'); getProducts(contact); valueSelectedProduct=''; selectTab = 'products'"><i class="fas fa-barcode"></i></b-btn>

                                    </div> -->
                                </div>
                            </div>
                        </b-card>
                    </div>
                </div>


        

        <!-- <b-table small show-empty stacked="md" :items="selectTab=='bitacora'?tableData:tableDataCL" :fields="columns" >
            <template v-slot:cell(wscode)="row">
                <div class="text-left" style="width: 250px">
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'det/'+row.item.message_id}"  target='_blank' v-if="row.item.docs != 0 && row.item.module != 'CL'" ><i class="fa fa-paperclip"></i></b-btn>
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'det/'+row.item.message_id}"  target='_blank' v-if="row.item.docs == 0 && row.item.module != 'CL'" ><i class="ion ion-md-create"></i></b-btn>
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'det/'+row.item.message_id}"  target='_blank' v-if="row.item.module == 'CL'" ><i class="fa fa-phone"></i></b-btn>
                    <i v-if="row.item.details" class="fas fa-circle text-warning"></i>
                    {{row.item.wscode}}
                </div>
            </template>
            <template v-slot:cell(created)="row">
                <div class="text-left" style="width: 120px">
                    {{row.item.created}}
                </div>
            </template>
            <template v-slot:cell(start_date)="row">
                <div class="text-left" style="width: 120px">
                    {{row.item.start_date}}
                </div>
            </template>
            <template v-slot:cell(finish_date)="row">
                <div class="text-left" style="width: 120px">
                    {{row.item.finish_date}}
                </div>
            </template>
            <template v-slot:cell(title)="row">
                <div class="text-left" style="width: 170px">
                    {{row.item.title}}
                </div>
            </template>
            <template v-slot:cell(message)="row">
                <div class="text-left">
                    {{row.item.message}} <small>  ({{row.item.username}}) </small> 
                </div>
            </template>

        </b-table> -->
        
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/styles/pages/projects.scss" lang="scss"></style>
<script>
import { infoplanning } from "@/components/i40/js/iplanning";
import { infotraza } from "@/components/i40/js/traza";
import Multiselect from 'vue-multiselect'
import { infomaster } from "@/components/i40/js/master";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue' 
import { infosysconfig } from "@/components/i40/js/sysconfig";
// Datepicker
import moment from 'moment'
// Import this component
import datePicker from 'vue-bootstrap-datetimepicker';
// Import date picker css
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
import { infouser } from "@/vendor/sbx/sbx-users/users";
import { inforundb } from "@/components/i40/js/rundb";

export default {
    metaInfo: {
        title: 'Bitácora'
    },
    components: {
        Multiselect,
        SweetModal,
        datePicker,
        SweetModalTab
        // Scrollable,
        // datePicker
    },
    watch: {

        'moduleSelected':function(value){
            console.log(value)
            this.title = value
        },

        'filter':function(value){

            this.tableData = []
            this.tableDataCL = []
            let filteredData = []

            filteredData = this.tablefilter.filter(function (task) {
                if(task.wscode.toLowerCase().includes(value.toLowerCase()))
                    return task
            });

            for (let index = 0; index < filteredData.length; index++) {
                const element = filteredData[index];
                if(element.module != 'CL' || (element.message!='' && element.details!='')){
                    this.tableData.push(element)
                }else{
                    this.tableDataCL.push(element)
                }
            }
        },

        "selectedWorkstation": function (values) {
            this.loadTimeline(values.code)
        },

        "$route.params.code":function(values){
            this.codearea = values

            infotraza.bitacora({area_info:values}, 1, 'area').then(data =>{
                this.tableData = []
                this.tablefilter = []

                if(data.data != ""){
                    this.tableData = data.data
                    this.tablefilter = data
                }
            })

            this.prepareTitles(values)
        }
    },
    data() {
        return {
            selectTab:'bitacora',
            messageStatus:true,
            arrModulo:[],
            moduleSelected:{},
            filter:null,
            tablefilter:[],
            workstationdata:[],
            userInfo:{},
            columnsInfo:[],
            workstations:[],
            selectedWorkstation:{},
            infodetails:"",
            recommend:"",
            messageid:"",
            dateStart:null,
            dateFinsh:null,
            dateStartSearch:null,
            dateFinshSearch:null,
            title:"",
            content:"",
            modulo:"--",
            module_id:0,
            selectedFiles:[],
            messageContent:false,
            options: {
                format: 'YYYY-MM-DD HH:mm',
                // useCurrent: false,
                // minDate:Date(),
            } ,

            tableData:[],
            tableDataCL:[],

            columns: [
                {key:'wscode', label:"Codigo"},
                {key:'title', label:"Actividad"},
                {key:'created', label:"Fecha"},
                // {key:'start_date', label:"F Inicial"},
                // {key:'finish_date', label:"F Final"},
                {key:'message', label:"Comentario"},
                // {key:'details', label:"Detalles"},
                ]
        }
    },

    methods: {
        prepareTitles(values){
            infosysconfig.btctypes([],"select").then(data => {
                this.arrModulo = []
                    if(data.data != ""){

                        for (let index = 0; index < data.data.length; index++) {
                            const element = data.data[index];
                            if(element.module == values){
                                this.arrModulo.push({ value: element.description, text: element.description })
                            }
                            
                        }
                    }
                })
        },
        openform: function() {
            this.selectedWorkstation={}
            this.infodetails=""
            this.recommend=""
            this.messageid=""
            this.dateStart=null
            this.dateFinsh=null
            this.title=""
            this.content=""
            this.modulo="--"
            this.module_id=0
            this.selectedFiles=[]
        },

        submit: function() {

            this.messageStatus = false

            let selectedformessage = {}
            selectedformessage.user_id =this.userInfo.iduser

            if(this.modulo != '--'){
                selectedformessage.modulo = this.modulo
                selectedformessage.id =this.module_id
            }else{
                for (let index = 0; index < this.workstationdata.length; index++) {
                    const element = this.workstationdata[index];
                    if(element.wscode == this.selectedWorkstation.code){
                        selectedformessage.modulo = element.status == "down" ? "ST" : "TF"
                        selectedformessage.id = element.interval_id
                    }
                }
            }
            
            selectedformessage.message =this.content
            selectedformessage.area_info=this.codearea
            selectedformessage.title=this.title
            selectedformessage.start_date =this.dateStart
            selectedformessage.finish_date =this.dateFinsh
            selectedformessage.details =this.recommend
            selectedformessage.wscode =this.selectedWorkstation.code

            infotraza.bitacora(selectedformessage, 1, 'add').then(data =>{
                this.tableData = []
                // console.log(data)
                if(data.data != ""){
                    // this.tableData = data.data
                    // this.tablefilter = data.data

                    if(this.selectedFiles.length>0){
                        
                        let postAction = 'btc/'+data.data+'/btc'
                        

                        for (let index = 0; index < this.selectedFiles.length; index++) {
                            const element = this.selectedFiles[index];
                            inforundb.uploadFile(postAction, element).then(data=>{
                            })
                        }
                    }

                    // for (let index = 0; index < this.tablefilter.length; index++) {
                    //     const element = this.tablefilter[index];
                    //     // console.log(element)
                    //     if(element.module != 'CL' || (element.message!='' || element.details!='')){
                    //         this.tableData.push(element)
                    //     }else{
                    //         this.tableDataCL.push(element)
                    //     }
                    // }
                }
                this.messageContent = false
                this.messageStatus = true

                this.searchInfo()
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
                // console.log(data)
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
        searchInfo(){
            infotraza.bitacora({area_info:this.codearea, start_date_search: this.dateStartSearch,finish_date_search: this.dateFinshSearch}, 1, 'area').then(data =>{
                this.tableData = []
                this.tablefilter = []
                this.tableDataCL= []

                if(data.data != ""){
                    this.tablefilter = data.data

                    for (let index = 0; index < this.tablefilter.length; index++) {
                        const element = this.tablefilter[index];
                        // console.log(element)
                        if(element.module != 'CL' || (element.message!='' || element.details!='')){
                            this.tableData.push(element)
                        }else{
                            this.tableDataCL.push(element)
                        }
                    }
                }
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
        Date.prototype.addHours = function(h) {
            this.setTime(this.getTime() + (h*60*60*1000));
            return this;

        }
        let hour = new Date().addHours(-8)
        this.dateStartSearch=hour
        this.dateFinshSearch=new Date()
        this.codearea = this.$route.params.code 
        google.charts.load('current', {'packages':['timeline']});

        infouser.currentUser().then(response =>{
                this.userInfo=response.data
            }).catch(e => {
        });


        infomaster.workstation([],"select").then(data => {
            this.workstations= data.data[0].workstation
        })

        this.searchInfo()

        this.dateStart = new Date()
        this.dateFinsh = new Date()
        this.getWorkstations()
        this.prepareTitles(this.$route.params.code)
        this.$options.interval = setInterval(this.getWorkstations, 5000)


    },
    beforeDestroy () {
        clearInterval(this.$options.interval)
    }
}
</script>
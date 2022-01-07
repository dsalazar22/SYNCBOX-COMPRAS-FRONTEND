<template>
    <div>
         <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-0"> Reimpresion de Lotes</h4>

        <b-form-group label="Busque lote a reimprimir">
            <b-input-group>
          <b-form-input  v-model="ordercode" placeholder="Buscar..." ></b-form-input> 
                <b-input-group-append>
                    <b-button variant="success"    @click="loadBatches()" >Buscar Lotes</b-button>
             
                </b-input-group-append>
            </b-input-group>
        </b-form-group>

        <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="tabledata" :fields="columnsDetails" 
        >
        <template v-slot:cell(list)="row">
            <div class="text-center">
                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="loadPrinters(row.item)"><i class="ion ion-md-list"></i></b-btn>
                     
            </div>
        </template>
        </b-table>


        <b-modal hide-footer v-model="modal" size="xl">

        <div class=" text-center">
            <h3 class="font-weight-bold py-3 mb-0">Seleccionar impresora</h3>

         
            
            <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="itemsSelectedBatch"   :fields="printersColumns">
              
        </b-table>

        

            
            <b-form-group class="text-center " label="Impresora">
             
            
            <multiselect 
                v-model="selectedPrinter"
                :options="printersTable"
                placeholder="Impresoras"
                label="CodigoDispositivo"
                track-by="CodigoDispositivo"
                :searchable="true"
                :show-labels="false"/>
                
            

                 </b-form-group>

                    <div class="row">
                        <div class="col"><b-btn  @click="load() " variant="success" class="btn-block mr-2" >Imprimir</b-btn></div>
                        <div class="col"> <b-btn  @click="exit()" variant="danger" class="btn-block mr-2">Cerrar</b-btn></div>
                    </div>
                 
                
            </div>
       

          
            
       
        </b-modal>
    

    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>
import Vue from 'vue'
import { infoproduction } from "@/components/i40/js/production"
import Multiselect from 'vue-multiselect'
import { realtime } from "@/vendor/sbx/sbx-realtime/realtime"
import Notifications from 'vue-notification'
Vue.use(Notifications)
export default {
    name: 'app',
   
    metaInfo: {
       title: 'Reimpresion de lotes'
    },
    components: {
        Multiselect
        
    },
    data() {
        
        return {
        selectedPrinter:{},
         itemsSelectedBatch:[],
        itemSelectedBatch:{},

        currentPage: 1,
        perPage: 50,
        totalRows:0,
        ordercode:null,


        show: false,
        modal: false,
        table:{},
        tabledata:[],
        columnsDetails:[
            {key:"code", "sortable": true, label:"Codigo"},
            {key:"description", "sortable": true, label:"Descripcion"},
            {key:"batch", "sortable": true, label:"Lote"},
            {key:"workstation_code", "sortable": true, label:"Codigo estacion de trabajo"},
            {key:"amount", "sortable": true, label:"Cantidad"},
            {key:"amount_2", "sortable": true, label:"Cantidad 2"},
            {key:"created", "sortable": true, label:"Fecha"},
            {key:"ean13", "sortable": true, label:"EAN13"},
            {key:"list", "sortable": true, label:"Imprimir"}
            

        ],
        printersTable:[],
        printersColumns:[
            {key:"code", "sortable": true, label:"Codigo"},
            {key:"description", "sortable": true, label:"Descripcion"},
            {key:"batch", "sortable": true, label:"Lote"},
            {key:"workstation_code", "sortable": true, label:"Codigo estacion de trabajo"},
            {key:"amount", "sortable": true, label:"Cantidad"},
            {key:"amount_2", "sortable": true, label:"Cantidad 2"},
            {key:"created", "sortable": true, label:"Fecha"},
            {key:"ean13", "sortable": true, label:"EAN13"},
            {key:"printer", "sortable": true, label:"Impresora"},
            
        ],
        
        info: {
            code:0,
            description:"",
            batch:0,
            workstation_code:"",
            amount:0,
            amount_2:0,
            created:"",
            ean13:"",
            parametro:0,
            
        }
    

        }
    },
    methods: {
         loadBatches(){
             if(this.ordercode == null)
             {
                this.showCustom("bg-danger", "Busqueda Fallida", "¡No hay parametro de busqueda!")
             } else{
                infoproduction.getbatch(this.ordercode).then(data =>{
                console.log(data.data)
                let batch = data.data
                this.tabledata = []
                console.log(tabledata)

                for (let index = 0; index < batch.length; index++) {
                    const element = batch[index];
                    if(element.code.includes(this.ordercode))
                    {
                        this.tabledata.push(element)
                    }
                }
                }) 
            }

           

        },

        searcBatch(){
             infoproduction.getbatch(this.ordercode).then(data =>{
                console.log(data.data)
                let batch = data.data
                this.tabledata = []

                for (let index = 0; index < batch.length; index++) {
                    const element = batch[index];
                    if(element.code == this.ordercode)
                    {
                        this.tabledata.push(element)
                    }
                }
                
            
            })
        },

        // printer: function(item){

        //     this.itemSelectedBatch = item

        //     this.itemsSelectedBatch = []

        //     // this.info.code = item.code
        //     // this.info.description = item.description
        //     // this.info.batch = item.batch
        //     // this.info.workstation_code = item.workstation_code
        //     // this.info.amount = item.amount
        //     // this.info.amount_2 = item.amount_2
        //     // this.info.created = item.created
        //     // this.info.ean13 = item.ean13
            

        //     this.modal = true
           

        //     this.itemsSelectedBatch.push(this.itemSelectedBatch)
            

          
            
        // },

        exit(){
            this.modal = false;

            
        },

        showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
        },

        load(){

            if(this.selectedPrinter.IpDispositivo != undefined)
            {
                this.itemsSelectedBatch = []

                console.log(this.itemSelectedBatch)
                

                this.itemSelectedBatch['printer'] = this.selectedPrinter.IpDispositivo

            
                this.itemsSelectedBatch.push(this.itemSelectedBatch)

                realtime.sendbatchprint(this.itemSelectedBatch).then(data =>{ 
                    if(data.status == 200){
                        this.showCustom("bg-success", "Impresion Enviada", "¡La impresion se ha enviado con éxito!")
                    }else{
                        this.showCustom("bg-danger", "Impresion Fallida", "¡No hay impresora seleccionada!")
                    }
                })
            
            } else {
                this.showCustom("bg-danger", "Impresion fallida", "¡No hay impresora seleccionada!")
                //alert('Por favor seleccione una impresora')
            }

        },

          loadPrinters(item){

             this.itemSelectedBatch = item

            this.itemsSelectedBatch = []

            // this.info.code = item.code
            // this.info.description = item.description
            // this.info.batch = item.batch
            // this.info.workstation_code = item.workstation_code
            // this.info.amount = item.amount
            // this.info.amount_2 = item.amount_2
            // this.info.created = item.created
            // this.info.ean13 = item.ean13
            

            this.modal = true
           

            this.itemsSelectedBatch.push(this.itemSelectedBatch)

              this.selectedPrinter = {}

            realtime.getdevices(this.ordercode).then(data =>{
                console.log(data.data)
                let printers = data.data
                this.printersTable = []
                for (let index = 0; index < printers.length; index++) {
                    const element = printers[index];

                    if(element.EnLinea == true && element.CodigoDispositivo.includes('PRINT')){
                        this.printersTable.push(element)
                    }   
                }

                this.printersTable.sort(s => s.CodigoDispositivo)
            })
        },

       onFiltered (filteredItems)
       {
           this.totalRows = filteredItems.length
          
       }

       
        
       
    }
}
</script>

<style>
    
</style>

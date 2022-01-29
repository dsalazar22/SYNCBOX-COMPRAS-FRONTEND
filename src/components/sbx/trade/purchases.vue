<template>
<!-- :fields="columns" -->
    <div>
        <h4 class="font-weight-bold py-3 mb-0"> Tambor de Compras  </h4>

        

        <div class="row">
            <div class="col">
                <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->
            <b-row>

                <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->
                <b-col md="5" class="my-1">
                    <b-input-group>
                        <b-form-input v-model="filter" placeholder="Buscar..." />
                        <b-input-group-append>
                        <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
                <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->

                <!-- ESTE ES EL PAGINADOR -->
                <b-col md="5" class="my-1">
                    <b-form-select :options="pageOptions" v-model="perPage" />
                </b-col>
                <!-- ESTE ES EL PAGINADOR -->

                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
                <b-col md="2" class="d-flex justify-content-center my-1">
                    <label class="switcher switcher-success mt-2">
                        <input type="checkbox" class="switcher-input"  v-model="order_active" @click="ejecutar_cambio()">
                        <span class="switcher-indicator">
                        <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                        <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                        </span>
                        <span class="switcher-label">{{order_active ? "Activas" : "Cerradas"}}</span>
                    </label>
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col>
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
            </b-row>
            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->


                <div class="table-responsive" > 
                    <b-table small tbody-class="h6 font-weight-normal" show-empty hover responsive stacked="sm" :items="cptItems"  :fields="columnsCommercialsOrders" :current-page="currentPage" :per-page="perPage" :filter="filter" @filtered="onFiltered">
                        <!-- <template slot="visible_buffer" slot-scope="props">
                                {{props.item}}
                            </template> -->
                    </b-table>
                </div>
                <div class="my-4">
                     <b-btn size="sm" variant="outline-primary" @click="openModal()"><i class="fas fa-plus"></i>&nbsp; Cantidad a Recibir</b-btn>
                </div>


            <!-- <b-modal hide-footer v-model="modal" size="xl">
            <div>
                <b-row>
                    <b-col sm="2" class="my-2">
                        <h5>Cantidad a Recibir:</h5>
                    </b-col>
                    <b-col>
                        <b-input-group >
                            <b-input-group-text slot="prepend" v-if="loading">
                                <i class="ion ion-md-sync"></i>
                        </b-input-group-text>

                        <b-input-group-text  slot="prepend" v-if="!loading">
                                <i class="ion ion-ios-basket"></i>
                        </b-input-group-text>
                        <input type="number" class="form-control"
                            placeholder="Ingrese la cantidad..."
                             autocomplete="off"
                            v-model="t"
                             @keydown.down="down"
                             @keydown.up="up"
                            @keydown.enter="hit"
                             @keydown.esc="reset"
                            @blur="reset"
                         />
                        <b-input-group-text slot="append" v-if="isDirty || t" @click="resetInput">
                          <i class="ion ion-md-close" ></i>
                         </b-input-group-text>
                     </b-input-group>
                  </b-col>
             </b-row>

            <b-row>
                <b-col sm="2" class="my-2">
                    <h5>Subir archivo:</h5>
                </b-col>
                 <b-col>
                    <b-input-group >

                     <b-input-group-text  slot="prepend" v-if="!loading">
                        <i class="ion ion-md-archive"></i>
                     </b-input-group-text>
                    <input type="file" accept=".pdf" 
                         @change="onFileSelected" 
                         @keydown.enter="hit"
                         @keydown.esc="reset"
                         @blur="reset"
                      />
                    </b-input-group>
                 </b-col>
             </b-row>

             <b-row>
                 <b-col class="text-center">
                    <b-btn size="x" variant="danger" @click="close()"><i class="fas fa-trash"></i>&nbsp;Cerrar</b-btn>
                     <b-btn size="x" variant="success" @click="saveOrder(); editOrderCreated=false"><i class="fas fa-save"></i>&nbsp;Guardar</b-btn>
                </b-col>
             </b-row>
         </div>
        </b-modal> -->
<b-modal hide-footer v-model="modal" size="xl">

        <div class=" text-center">
            <h3 class="font-weight-bold py-3 mb-0">Ingrese Los Siguientes Datos:</h3>
            <div class="text-center">
                <b-row>
                    <b-col sm="8">
                        <h5 class="font-weight-bold py-3 mb-0"> Producto:  </h5>
                    </b-col>
                 </b-row>
                <b-row>
                    <b-col sm="8">
                         <h5 class="font-weight-bold py-3 mb-0"> Proveedor:  </h5>
                    </b-col>
                </b-row>
             </div>

            <b-row>
                    <b-col sm="2" class="my-2">
                        <h5>Cantidad a Recibir:</h5>
                    </b-col>
                    <b-col>
                        <b-input-group >
                            <b-input-group-text slot="prepend" v-if="loading">
                                <i class="ion ion-md-sync"></i>
                             </b-input-group-text>

                             <b-input-group-text  slot="prepend" v-if="!loading">
                                <i class="ion ion-ios-basket"></i>
                             </b-input-group-text>
                            <b-input type="number" class="form-control"
                                placeholder="Ingrese la cantidad..."
                                autocomplete="off"
                                 v-model="amount"
                                 @keydown.down="down"
                                 @keydown.up="up"
                                 @keydown.enter="hit"
                                 @keydown.esc="reset"
                                 @blur="reset"></b-input>
                            <b-input-group-text slot="append" v-if="isDirty || amount" @click="resetInput">
                                <i class="ion ion-md-close" ></i>
                             </b-input-group-text>
                     </b-input-group>
                  </b-col>
             </b-row>
            
             <b-row>
                <b-col sm="2" class="my-2">
                    <h5>Subir archivo:</h5>
                </b-col>
                 <b-col>
                    <b-input-group >

                     <b-input-group-text  slot="prepend" v-if="!loading">
                        <i class="ion ion-md-archive"></i>
                     </b-input-group-text>
                    <b-form-file
                    v-model="file1"
                    accept=".pdf"
                    placeholder="Seleccione un Archivo..."
                    drop-placeholder="Coloque el archivo aqui..."
                     ></b-form-file>
                    </b-input-group>
                 </b-col>
             </b-row>


        

           
                 
              <b-row>
                 <b-col class="text-center">
                    <b-btn size="x" variant="danger" @click="close()"><i class="fas fa-trash"></i>&nbsp;Cerrar</b-btn>
                     <b-btn size="x" variant="success" @click="saveAmount(); editOrderCreated=false"><i class="fas fa-save"></i>&nbsp;Guardar</b-btn>
                </b-col>
             </b-row>   
            </div>
       

          
            
       
        </b-modal>
        

                <div class="d-flex justify-content-between">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div  class="w-25">
                        <small class="text-muted"> Total Compras: {{totalRows}} </small>
                           <div class="small">
                                Buffer Compras <div class="float-right"> {{cntBlack}} de {{totalRows}} ({{Math.round((cntBlack/totalRows)*100)}}%)</div>
                            </div>
                            <div class="progress mb-1" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-dark':true}" :style="{width: String((cntBlack/totalRows)*100)+'%' }"></div>
                            </div>

                            <div class="small">
                                Buffer Compras <div class="float-right"> {{cntDanger}} de {{totalRows}} ({{Math.round((cntDanger/totalRows)*100)}}%)</div>
                            </div>
                            <div class="progress mb-1" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':true}" :style="{width: String((cntDanger/totalRows)*100)+'%' }"></div>
                            </div>

                            <div class="small">
                                Buffer Compras <div class="float-right"> {{cntWarning}} de {{totalRows}} ({{Math.round((cntWarning/totalRows)*100)}}%)</div>
                            </div>
                            <div class="progress mb-1" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-warning':true}" :style="{width: String((cntWarning/totalRows)*100)+'%' }"></div>
                            </div>
                                        <div class="small">
                                Buffer Compras <div class="float-right"> {{cntSuccess}} de {{totalRows}} ({{Math.round((cntSuccess/totalRows)*100)}}%)</div>
                            </div>
                            <div class="progress mb-1" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-success':true}" :style="{width: String((cntSuccess/totalRows)*100)+'%' }"></div>
                            </div>
                                        <div class="small">
                                Buffer Compras <div class="float-right"> {{cntInfo}} de {{totalRows}} ({{Math.round((cntInfo/totalRows)*100)}}%)</div>
                            </div>
                            <div class="progress mb-1" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-info':true}" :style="{width: String((cntInfo/totalRows)*100)+'%' }"></div>
                            </div>
                            <!-- <div class="small">
                                Número de Centros de Trabajo <div class="float-right"> {{centrosTrabajo.length}} de {{numeroEquipos}} ({{Math.round((centrosTrabajo.length/numeroEquipos)*100)}}%)</div>
                            </div>
                            <div class="progress mb-3" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':((centrosTrabajo.length/numeroEquipos)*100)>=80, 'bg-success':((centrosTrabajo.length/numeroEquipos)*100)<80}" :style="{width: String((centrosTrabajo.length/numeroEquipos)*100)+'%' }"></div>
                            </div>

                            <div class="small">
                                Número de Dispositvos <div class="float-right"> {{dispositivos.length}} de {{numeroDispositivos}} ({{Math.round((dispositivos.length/numeroDispositivos)*100)}}%)</div>
                            </div>
                            <div class="progress mb-3" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':((dispositivos.length/numeroDispositivos)*100)>=80, 'bg-success':((dispositivos.length/numeroDispositivos)*100)<80}" :style="{width: String((dispositivos.length/numeroDispositivos)*100)+'%' }"></div>
                            </div>

                            <div class="small">
                                Número de Tags <div class="float-right"> {{variablesDispositivosUsers.length}} de {{tagsAutorizados}} ({{Math.round((variablesDispositivosUsers.length/tagsAutorizados)*100)}}%)</div>
                            </div>
                            <div class="progress mb-3" style="height: 4px;">
                                <div :class="{'progress-bar':true, 'bg-danger':((variablesDispositivosUsers.length/tagsAutorizados)*100)>=80, 'bg-success':((variablesDispositivosUsers.length/tagsAutorizados)*100)<80}" :style="{width: String((variablesDispositivosUsers.length/tagsAutorizados)*100)+'%' }"></div>
                            </div> -->

                    </div>
                </div>
            </div>
            <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>
        </div>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>
import { infotrade } from "@/components/i40/js/trade";
import VueMarkdown from 'vue-markdown'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
export default {
    
    metaInfo: {
       title: 'Tambor de Compras'
    },
    components: {
    
        VueMarkdown,
        SweetModal,
        SweetModalTab

        },
        computed: {
            cptItems(){
            return this.tableCommercialsOrders.map((item)=>{
                let tmp=item;
                let color=''
                
                if(tmp.visible_buffer>100){
                    color = 'dark'
                }
                else if(tmp.visible_buffer<=100 && tmp.visible_buffer>66){
                    color = 'danger'
                }
                else if(tmp.visible_buffer<=66 && tmp.visible_buffer>33){
                    color = 'warning'
                }
                else if(tmp.visible_buffer<=33 && tmp.visible_buffer>=0){
                    color = 'success'
                }else{
                    color='info'
                }


                tmp._cellVariants = {visible_buffer: color};
                return tmp;
            })  
        }
    },
    data() {
        return {
            order_active : true,
            name: 'purchases',
            version: 'v1.0.0.0',
            contentWiki: "",
            cntBlack:0,
            cntDanger:0,
            cntWarning:0,
            cntSuccess:0,
            cntInfo:0,
            tableCommercialsOrders:[],
            columnsCommercialsOrders: [
        

                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    // {key:' id_workplace', label:"id_workplace", thClass: 'd-none', tdClass: 'd-none'},
                    // {key:' workstation_type_id', label:"workstation_type_id", thClass: 'd-none', tdClass: 'd-none'},
                    {key:'visible_buffer', label:"Buffer"},
                    {key:'purchases_id', label:"# OC"},
                    {key:'code_status', label:"Estado"},
                    {key:'product_code', label:"Código"},
                    {key:'product_description', label:"Descripción"},
                    {key:'supplier_name', label:"Proveedor"},
                    {key:'requested_amount', label:"Pedida"},
                    {key:'delivered_quantity', label:"Entregada"},
                    {key:'pending_amount', label:"Pendiente"},
                    {key:'order_created', label:"Ingreso"},
                    {key:'deadline', label:"Fecha Comprometida"},
                    
                    // {key:'wsplant', label:"Planta"},
                    // {key:'wsgroup', label:"Grupo"},
                    // {key:'wstype', label:"Tipo"},
                    // {key:'edit', label:"Edit"}
                ],

            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla

            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },

            //cantidad a recibir
            modal: false,
            amount:''
        }
    },
    methods: {
        openModal(){
            this.modal = true;
        },

        close(){
            this.modal = false;
        },

        saveAmount(){
            this.close()
        },

         ejecutar_cambio(){
             this.order_active = !this.order_active
            this.loadCommercialsOrders()
        },
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
        loadCommercialsOrders(){
            infotrade.purchases([],"select-active-"+this.order_active).then(data =>{
                this.tableCommercialsOrders = data.data
                this.totalRows = data.data.length

                this.cntBlack = 0
                this.cntDanger = 0
                this.cntWarning = 0
                this.cntSuccess = 0
                this.cntInfo = 0

                for (let index = 0; index < this.tableCommercialsOrders.length; index++) {
                    const element = this.tableCommercialsOrders[index];
                    if(element.visible_buffer>100){
                        this.cntBlack = this.cntBlack+1
                    }
                    else if(element.visible_buffer<=100 && element.visible_buffer>66){
                        this.cntDanger = this.cntDanger+1
                    }
                    else if(element.visible_buffer<=66 && element.visible_buffer>33){
                        this.cntWarning = this.cntWarning+1
                    }
                    else if(element.visible_buffer<=33 && element.visible_buffer>=0){
                        this.cntSuccess = this.cntSuccess+1
                    }else{
                        this.cntInfo = this.cntInfo+1
                    }
                    
                }

            })
        },

        onFiltered (filteredItems) {
                this.totalRows = filteredItems.length
                this.currentPage = 1

                this.cntBlack = 0
                this.cntDanger = 0
                this.cntWarning = 0
                this.cntSuccess = 0
                this.cntInfo = 0

                for (let index = 0; index < filteredItems.length; index++) {
                    const element = filteredItems[index];

                    if(element._cellVariants.visible_buffer === "dark"){
                        this.cntBlack = this.cntBlack+1
                    }
                    else if(element._cellVariants.visible_buffer === "danger"){
                        this.cntDanger = this.cntDanger+1
                    }
                    else if(element._cellVariants.visible_buffer === "warning"){
                        this.cntWarning = this.cntWarning+1
                    }
                    else if(element._cellVariants.visible_buffer === "success"){
                        this.cntSuccess = this.cntSuccess+1
                    }else{
                        this.cntInfo = this.cntInfo+1
                    }
                    
                }

            },
    },
    created(){
        this.currentPage = 1
        this.loadCommercialsOrders("true")
    },
    beforeCreate(){
        
    }
}
</script>

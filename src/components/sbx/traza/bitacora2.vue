<template>




            


<div class=" h-75">

        <div>
        <!-- <div class="content-heading">
            <div>
                {{titleHeader}}
                <small> Centro de Trabajo</small>
            </div>
        </div> -->
        <h4 class="font-weight-bold py-3 mb-1">
               Bitácora Por Centro de Trabajo
                <!-- <small>Tiempo de Paro - Grupo de Centro de Trabajo</small> -->
        </h4>
        <div>
        Seleccione un Centro de Trabajo
        <multiselect
            v-model="selectedGroup"
            :options="workstationGroup"
            
            placeholder="Grupo de Centros de Trabajo"
            label="code"
            track-by="code" />

            <div class="text-right mt-2"><button type="button" class="btn btn-success" v-on:click="cargarDatos()">Consultar</button></div>
            </div>
    </div>



<div class="chat-wrapper  h-100 mt-4" :class="{'chat-sidebox-open': true}">

    <!-- Make card full height of `.chat-wrapper` -->
    <b-card no-body class="flex-grow-1 position-relative overflow-hidden" >

      <!-- Make row full height of `.card` -->
      <div class="row no-gutters h-100">

        <div class="d-flex col flex-column">

          <!-- Chat header -->
          <div class="flex-grow-0 py-3 pr-4 pl-lg-4">

           <div class="media align-items-center">
              <a @click.prevent="sideboxOpen = !sideboxOpen" href="#" class="chat-sidebox-toggler d-lg-none d-block text-muted text-large px-4 mr-2"><i class="ion ion-md-more"></i></a>

              <div class="position-relative">
                <!-- <span class="badge badge-dot indicator" :class="`badge-${false ? 'success' : 'danger'}`"></span> -->
                
              </div>
              <div class="media-body pl-3">
                <strong>{{'Bitácora Ultimas 4 Horas'}}</strong>
                <!-- <div class="text-muted small"><em>{{chatData.status}}</em></div> -->
              </div>
              <div>
                <!-- <b-btn variant="primary rounded-pill icon-btn mr-1"><i class="ion ion-ios-call"></i></b-btn>
                <b-btn variant="secondary rounded-pill icon-btn mr-1"><i class="ion ion-md-videocam"></i></b-btn>
                <b-btn variant="default rounded-pill icon-btn"><i class="ion ion-ios-more"></i></b-btn> -->
              </div>
            </div> 

          </div>
          <hr class="flex-grow-0 border-light m-0">
          <!-- / Chat header -->

          <!-- Wrap `.chat-scroll` to properly position scroll area. Remove this wtapper if you don't need scroll -->
          <div class="flex-grow-1 position-relative">

            <!-- Remove `.chat-scroll` and add `.flex-grow-1` if you don't need scroll -->
            <perfect-scrollbar :options="{ suppressScrollX: true, wheelPropagation: true }" class="chat-messages chat-scroll p-4">
                <div v-for="message in chatData" :key="message.id" class="mb-4">
                    
                        
                    <div class="flex-shrink-1 rounded py-2 px-3" :class="message.modulo == 'TP' ? 'border border-warning' : message.modulo == 'CL' ? 'border border-info' : 'border border-success'">
                        <div class="font-weight-semibold mb-1">{{message.code}} - {{message.description}}

                            <div class="text-muted small text-nowrap mt-0"><b>Fecha Inicio: </b>{{message.fechainicio}}  <b>Fecha Fin: </b>{{message.fechafin}}  </div>

                        </div>
                        
                        <!-- {{message}} -->

                        <div v-for="msg in message.messages" :key="msg.created" :class="`chat-message-${msg.user_id == userInfo.iduser ? 'right' : 'left'}`" class="mb-4">
                
                            <div class="flex-shrink-1 bg-lighter rounded py-2 px-3" :class="msg.user_id == userInfo.iduser ? 'mr-3' : 'ml-3'">
                            <div class="font-weight-semibold mb-1">{{msg.user_id == userInfo.iduser ? 'Usted' : msg.username}}</div>
                            <!-- {{msg.message}} -->
                            <markdown-it-vue class="md-body" :content="msg.message" />
                            </div>
                            <!-- <br>
                            <div class="text-muted small text-nowrap mt-2">{{msg.created}}</div> -->
                        </div> 

                            <div class="text-right">
                                <b-btn variant="primary rounded-pill icon-btn mr-1" @click="openMessageContent(message)" ><i class="fas fa-comments"></i></b-btn>
                                <!-- <b-btn size="sm" @click="openMessageContent(message)" variant="outline-info icon-btn borderless"><span class="fas fa-comments"></span></b-btn> -->
                            </div>

                    </div>
                </div>

                <!-- {{this.chatData}} -->



            </perfect-scrollbar><!-- / .chat-messages -->
          </div>

          <!-- Chat footer -->
        
          <!-- / Chat footer -->

        </div>
      </div><!-- / .row -->

    </b-card><!-- / .card -->

  </div><!-- / .chat-wrapper -->


        <b-modal id="modals-top" v-model="messageContent"  class="modal-center" size="xl" hide-footer title="Adicionar Contenido"> 
            <b-row>
                <b-col sm="6">
                    <b-form-textarea
                        id="textarea-auto-height"
                        placeholder="Por favor escriba"
                        rows="3"
                        max-rows="50"
                        v-model="content"
                    ></b-form-textarea>
                </b-col>

                <b-col sm="6">
                    <markdown-it-vue class="md-body" :content="content" />
                </b-col>

                <div class="w-100 text-right">
                    <b-btn variant="primary" @click="messageContent=false">Cancelar</b-btn>
                    <b-btn variant="success" @click="submit()">Guardar</b-btn>
                </div>
        </b-row>
        </b-modal>


</div>

</template>
<style src="@/vendor/styles/pages/chat.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Multiselect from 'vue-multiselect'
import {reports} from "@/components/i40/js/globals"
import moment from "moment";
// Import this component
import datePicker from "vue-bootstrap-datetimepicker";
// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

import Vue from "vue";
import VueResource from 'vue-resource'
import { infomaster } from "@/components/i40/js/master";
import { infotraza } from "@/components/i40/js/traza";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import { infouser } from "@/vendor/sbx/sbx-users/users";

Vue.use(VueResource)

const theme = "red";
export default {
  components: {
    MarkdownItVue,
    Multiselect,
    // Scrollable,
    datePicker,
    SweetModal, 
    SweetModalTab,
    PerfectScrollbar
  },
  computed: {
       

  },
  data() {
    return {
        messageContent:false,
        content:'',
        selectedformessage:{},
        userInfo:{},
            titleHeader:"",
            workstationGroup:[],
            selectedGroup:{},
            donutdata: [],
            items: [],
            items2: [],
            dateStart:null,
            dateFinsh:null,
            options: {
                format: "YYYY-MM-DD HH:mm",
                //useCurrent: false
                // minDate:Date(),
            },

            sideboxOpen: false,

    chatData: {
        //   user: 'kfrazier',
        //   status: 'Typing...',
        //   messages: [
        //     { you: true, text: 'Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.', date: '20202-03-03 2:33 am' },
        //     { you: false, text: 'Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.', date: '2:34 am' },
        //     { you: true, text: 'Cum ea graeci tractatos.', date: '2:35 am' },
        //     { you: false, text: 'Sed pulvinar, massa vitae interdum pulvinar, risus lectus porttitor magna, vitae commodo lectus mauris et velit. Proin ultricies placerat imperdiet. Morbi varius quam ac venenatis tempus.', date: '2:36 am' },
        //     { you: false, text: 'Cras pulvinar, sapien id vehicula aliquet, diam velit elementum orci.', date: '2:37 am' },
        //     { you: true, text: 'Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.', date: '2:38 am' },
        //     { you: false, text: 'Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.', date: '2:39 am' },
        //     { you: true, text: 'Cum ea graeci tractatos.', date: '2:40 am' },
        //     { you: true, text: 'Morbi finibus, lorem id placerat ullamcorper, nunc enim ultrices massa, id dignissim metus urna eget purus.', date: '2:41 am' },
        //     { you: false, text: 'Sed pulvinar, massa vitae interdum pulvinar, risus lectus porttitor magna, vitae commodo lectus mauris et velit. Proin ultricies placerat imperdiet. Morbi varius quam ac venenatis tempus.', date: '2:42 am' },
        //     { you: true, text: 'Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.', date: '2:43 am' },
        //     { you: false, text: 'Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.', date: '2:44 am' }
        //   ]
        }
    }

            
  },
  methods: {


    openMessageContent(item){
        this.selectedformessage = item
        this.messageContent = true
    },

    content_details(item){
        this.items_details = item.details
        this.$refs.detallestopcode.open()
        
    },
      
    cargarDatos: function() {

        infotraza.bitacora(this.selectedGroup.code, 'get').then(data =>{
            this.chatData = data.data
        })

        // this.titleHeader=this.selectedGroup.code
    },

    submit: function() {
        this.selectedformessage.message=this.content
        this.selectedformessage.user_id=this.userInfo.iduser

        infotraza.bitacora(this.selectedformessage, 'add').then(data =>{
            //this.chatData = data.data
            this.cargarDatos()
        })

        // this.titleHeader=this.selectedGroup.code
    }

  },
  created() {
        infouser.currentUser().then(response =>{
            this.userInfo=response.data
        }).catch(e => {
        
        });
        infomaster.workstation([],"select").then(data => {
            // this.workstationType = data.data[0].wstype
            // this.workstationPlant = data.data[0].wsplant
            this.workstationGroup = data.data[0].workstation
            // if( data.data[0].workstation != null){
            //     this.tableData = data.data[0].workstation
            //     this.totalRows= this.tableData.length
            // }
        })
     },
};
</script>
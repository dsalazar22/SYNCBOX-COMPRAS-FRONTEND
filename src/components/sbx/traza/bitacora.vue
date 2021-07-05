<template>
  <!-- `.chat-wrapper` fills all available space of container -->
  <!-- <div> -->
    <!--  -->
  
  <div class="chat-wrapper container-p-x container-p-y h-100" :class="{'chat-sidebox-open': sideboxOpen}">

    <!-- Make card full height of `.chat-wrapper` -->
    <b-card no-body class="flex-grow-1 position-relative overflow-hidden">
      <div :id="'timeline'" style="height: 110px;"></div>
      <!-- Make row full height of `.card` -->
      <div class="row no-gutters h-100">
        <div class="chat-sidebox col">

          <!-- Chat contacts header -->
          <div class="flex-grow-0 px-4">
            <div class="media align-items-center">
              <div class="media-body">
                <!-- <b-input class="chat-search my-3" placeholder="Buscar..." /> -->
              </div>
              <a @click.prevent="sideboxOpen = !sideboxOpen" href="#" class="chat-sidebox-toggler d-lg-none d-block text-muted text-large font-weight-light pl-3">&times;</a>
            </div>
            <hr class="border-light m-0">
          </div>
          <!-- / Chat contacts header -->

          <!-- Wrap `.chat-scroll` to properly position scroll area. Remove this wtapper if you don't need scroll -->
          <div class="flex-grow-1 position-relative">
            <perfect-scrollbar :options="{ suppressScrollX: true, wheelPropagation: true }" class="chat-contacts list-group chat-scroll py-3">
<!-- :class="{online: contact.online, active: chatData && chatData.user === contact.wscode}" -->
              <a v-for="contact in contactsData" :key="contact.wscode" :class="{online: contact.status == 'working', active: contact.wscode == chatUser.wscode}" @click="cargarDatos(contact);loadTimeline(contact.wscode)" class="list-group-item list-group-item-action">
                <!-- <img :src="`${publicUrl}img/avatars/${contact.avatar}`" class="d-block ui-w-40 rounded-circle" alt=""> -->
                <div class="media-body ml-3">
                  {{contact.wscode}}
                  <div v-if="contact.status == 'working'" class="chat-status small"><span class="badge badge-dot"></span>&nbsp; {{contact.description}}</div>
                  <div v-if="contact.status == 'stop'" class="chat-status small"><span class="badge badge-dot"></span>&nbsp; {{contact.description}}</div>

                  <div v-if="contact.status == 'down'" class="chat-status small text-dark"><span class="badge badge-dot dark"></span>&nbsp; {{contact.description}}</div>
                </div>
                <!-- <div v-if="contact.newMessages" class="badge badge-outline-success">{{contact.newMessages}}</div> -->
              </a>

            </perfect-scrollbar><!-- / .chat-contacts -->
          </div>

          

        </div>
        <div v-if="!chatData" class="d-flex col justify-content-center align-items-center">
          <div class="text-lighter text-large">Seleccione un Centro de Trabajo</div>
        </div>
        <div v-else class="d-flex col flex-column">

          <!-- Chat header -->
          <div class="flex-grow-0 py-3 pr-4 pl-lg-4">

            <div class="media align-items-center">
              <a @click.prevent="sideboxOpen = !sideboxOpen" href="#" class="chat-sidebox-toggler d-lg-none d-block text-muted text-large px-4 mr-2"><i class="ion ion-md-more"></i></a>

              <div class="position-relative">
                <span class="badge badge-dot indicator" :class="`badge-${chatUser.status == 'working' ? 'success' : 'danger'}`"></span>
                <!-- <img :src="`${publicUrl}img/avatars/${chatUser.avatar}`" class="ui-w-40 rounded-circle" alt=""> -->
              </div>
              <div class="media-body pl-3">
                <strong>{{chatUser.wscode}}</strong>
                <div class="text-muted small"><em>{{chatUser.description}}</em></div>
              </div>
              <div>
                <!-- <b-btn variant="primary rounded-pill icon-btn mr-1"><i class="ion ion-ios-call"></i></b-btn> -->
                <!-- <b-btn variant="secondary rounded-pill icon-btn mr-1"><i class="ion ion-md-videocam"></i></b-btn> -->
                <b-btn variant="default rounded-pill icon-btn"><i class="ion ion-ios-more"></i></b-btn>
              </div>
            </div>

          </div>
          <hr class="flex-grow-0 border-light m-0">
          <!-- / Chat header -->

          <!-- Wrap `.chat-scroll` to properly position scroll area. Remove this wtapper if you don't need scroll -->
          <div class="flex-grow-1 position-relative">

            <!-- Remove `.chat-scroll` and add `.flex-grow-1` if you don't need scroll -->
            <perfect-scrollbar :options="{ suppressScrollX: true, wheelPropagation: true }" class="chat-messages chat-scroll p-4">

              <!-- <div v-for="message in chatData.messages" :key="message.date" :class="`chat-message-${message.you ? 'right' : 'left'}`" class="mb-4">
                <div>
                  <img :src="`${publicUrl}img/avatars/${message.you ? user.avatar : chatUser.avatar}`" class="ui-w-40 rounded-circle" alt>
                  <div class="text-muted small text-nowrap mt-2">{{message.date}}</div>
                </div>
                <div class="flex-shrink-1 bg-lighter rounded py-2 px-3" :class="message.you ? 'mr-3' : 'ml-3'">
                  <div class="font-weight-semibold mb-1">{{message.you ? 'You' : chatUser.name}}</div>
                  {{message.text}}
                </div>
              </div> -->


                <div v-for="(message, index) in chatData" :key="message.id" class="mb-4">
                    <div v-if="index == 0" class="mb-2">
                        <!-- <b-btn block >Cargar Información Anterior</b-btn> -->
                    </div>
                    <div class="flex-shrink-1 rounded py-2 px-0" :class="message.modulo == 'TP' ? 'border border-warning' : message.modulo == 'CL' ? 'border border-info' : 'border border-success'">
                        <div v-if="message.modulo != 'CT'" class="font-weight-semibold mb-1 boder border-bottom" :class="message.modulo == 'TP' ? 'border-warning' : message.modulo == 'CL' ? 'border-info' : 'border-success'">
                            <div class="mr-2 text-center">
                                {{message.codigo}} - {{message.producto}}
                                <div class="text-muted small text-nowrap mt-0"><b>Fecha Inicio: </b>{{message.fechainicio}}  <b>Fecha Fin: </b>{{message.fechafin}}  </div>
                            </div>
                        </div>
                        <div v-if="message.modulo == 'CT'" class="font-weight-semibold mb-1 boder border-bottom" :class="message.modulo == 'TP' ? 'border-warning' : message.modulo == 'CL' ? 'border-info' : 'border-success'">
                            <div class="mr-2 text-center">
                                {{message.codigo}} - {{message.producto}}
                                <div class="text-muted small text-nowrap mt-0"><b>Fecha Inicio: </b>{{message.fechainicio}}  <b>Fecha Fin: </b>{{message.fechafin}}  </div>
                            </div>
                        </div>
                        <!-- {{message}} -->

                            <div v-if="message.modulo == 'CT'" class="mb-2">
                                <!-- {{message.performance}} -->
                                 <b-table small show-empty stacked="md" :items="message.performance" :fields="[{key:'idordenproduccion', label:'# OP'},{key:'codigo', label:'Codigo'},{key:'producto', label:'Producto'},{key:'esperado', label:'Und Esperadas'},{key:'totalproducido', label:'Und Producido'},{key:'tiempototaltrabajo', label:'Min Trabajado'},{key:'microparos', label:'Min Perdidos'},{key:'eficiencia', label:'Eficiencia'}]">

                                    <template v-slot:cell(eficiencia)="row">
                                        <div class="text-left">
                                            {{((row.item.totalproducido / row.item.esperado)*100).toFixed(2)}}
                                        </div>
                                    </template>

                                 </b-table>
                            </div>

                        <div v-for="msg in message.messages" :key="msg.created" :class="`chat-message-${msg.user_id == userInfo.iduser ? 'right' : 'left'}`" class="mb-4">

                  
                
                            <div class="flex-shrink-1 bg-lighter rounded py-2 px-3" :class="msg.user_id == userInfo.iduser ? 'mr-3' : 'ml-3'">
                            <div class="font-weight-semibold mb-1">{{msg.user_id == userInfo.iduser ? 'Usted' : msg.username}} | {{msg.created}}</div>
                            <!-- {{msg.message}} -->
                            <markdown-it-vue class="md-body" :content="msg.message" />
                            </div>
                            <!-- <br>
                            <div class="text-muted small text-nowrap mt-2">{{msg.created}}</div> -->
                        </div> 
                            <div class="text-right">
                                <b-btn variant="primary rounded-pill icon-btn mr-1" @click="openMessageContent(message)" ><i class="fas fa-comments"></i></b-btn>
                                <!-- <b-btn size="sm" @click="cargarDatos()" variant="outline-info icon-btn borderless"><span class="fas fa-comments"></span></b-btn> -->
                            </div>
                    </div>
                </div>

            </perfect-scrollbar><!-- / .chat-messages -->
          </div>

          <!-- Chat footer -->
          <hr class="border-light m-0">
          <div class="flex-grow-0 py-3 px-4">
            <b-input-group>
              <b-input v-model="shortContent" placeholder="Enviar Mensaje Corto" />
              <b-btn variant="primary" slot="append"  @click="submitShort(chatData[chatData.length-1])">Enviar</b-btn>
            </b-input-group>
          </div>
          <!-- / Chat footer -->

        </div>
      </div><!-- / .row -->

    </b-card><!-- / .card -->

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

  </div><!-- / .chat-wrapper -->
  <!-- </div> -->
</template>

<!-- Page -->
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

export default {
  name: 'bitacora',
  metaInfo: {
    title: 'Bitácora'
  },
  components: {
    MarkdownItVue,
    Multiselect,
    // Scrollable,
    datePicker,
    SweetModal, 
    SweetModalTab,
    PerfectScrollbar
  },
  data: () => ({
       messageContent:false,
        shortContent:'',
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
      days:1,
      sideboxOpen: false,

      // wsselected = '',

      user: {
        avatar: '1-small.png'
      },

      chatUser:{},

      contactsData: [],

      chatData: {},
      chart:null
  }),

  watch: {
    'chart.messageContent':function(valaue){
      // console.log(value,'aaaa')
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
      
    cargarDatos: function(ws) {
        this.chatUser = ws
        infotraza.bitacora(this.chatUser.wscode, this.days ,'get').then(data =>{
            this.chatData = {}

            if(data.data != ""){
                this.chatData = data.data
                if(this.chatUser != {})
                    this.cargarDatos(this.chatUser)
            }
        })
    },

    getWorkstations(){

        infotraza.getworkstation().then(data =>{
            this.contactsData = data.data
        })

    },

    submit: function() {
        this.selectedformessage.message=this.content
        this.selectedformessage.user_id=this.userInfo.iduser

        // console.log(this.selectedformessage)

        infotraza.bitacora(this.selectedformessage, this.days, 'add').then(data =>{
          // console.log(data)
          this.content = ''
          this.messageContent = false
          this.cargarDatos(this.chatUser)
        })

        // this.titleHeader=this.selectedGroup.code
    },

    submitShort: function(message) {
        message.message=this.shortContent
        message.user_id=this.userInfo.iduser

        infotraza.bitacora(message, this.days, 'add').then(data =>{
            this.cargarDatos(this.chatUser)
            this.shortContent = ''
        })
    },

    loadTimeline(wscode){
      infotraza.timeline(wscode).then(data => {
        var container = document.getElementById('timeline');
        this.chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: 'string', id: 'Eventos' });
        dataTable.addColumn({ type: 'string', id: 'Evento' });
        dataTable.addColumn({ type: 'string', role: 'style' });
        dataTable.addColumn({ type: 'string', role: 'tooltip' });
        dataTable.addColumn({ type: 'date', id: 'Start' });
        dataTable.addColumn({ type: 'date', id: 'End' });
        let color = []
        let rows = []
        for (let index = 0; index < data.data.length; index++) {
            const element = data.data[index];
            var dt = new Date(element.fechainicio);
            var dtf = new Date(element.fechafin);
            rows.push(['Timeline',element.descripcion, element.color,element.descripcion, new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds()), new Date(dtf.getFullYear(), dtf.getMonth(), dtf.getDate(), dtf.getHours(), dtf.getMinutes(), dtf.getSeconds())])
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
              let rowvalue = dataTable.getValue(selection[0].row, 1)
              vvvv.module = rowvalue.split(' - ')[0].substring(0,2)
              vvvv.id = rowvalue.split(' - ')[0].substring(2,vvvv.id = rowvalue.split(' - ')[0].split('| ')[0].length-1)
              ix.mx.messageContent = true
              ix.mx.selectedformessage.modulo =  vvvv.module
              ix.mx.selectedformessage.id =  vvvv.id
            }
          });
      });
    },
  },
  
  computed: {
    // chatUser () {
    //   for (let i = 0, l = this.contactsData.length; i < l; i++) {
    //     if (this.contactsData[i].username === this.chatData.user) return this.contactsData[i]
    //   }

    //   return {
    //     avatar: '',
    //     name: '',
    //     username: '',
    //     online: false,
    //     newMessages: 0
    //   }
    // },
    chatContacts () {
      //
      // Sort contacts (online then offline)
      //
    //   return [].concat(
    //     // Online
    //     this.contactsData.reduce((c, i) => {
    //       if (i.online) c.push(i)
    //       return c
    //     }, []).sort(function (a, b) {
    //       const nameA = a.name.toUpperCase()
    //       const nameB = b.name.toUpperCase()

    //       if (nameA < nameB) return -1
    //       if (nameA > nameB) return 1
    //       return 0
    //     })
    //   ).concat(
    //     // Offline
    //     this.contactsData.reduce((c, i) => {
    //       if (!i.online) c.push(i)
    //       return c
    //     }, []).sort(function (a, b) {
    //       const nameA = a.name.toUpperCase()
    //       const nameB = b.name.toUpperCase()

    //       if (nameA < nameB) return -1
    //       if (nameA > nameB) return 1
    //       return 0
    //     })
    //   )
    }

    
  },
  created() {
      google.charts.load('current', {'packages':['timeline']});
      infouser.currentUser().then(response =>{
              this.userInfo=response.data
          }).catch(e => {
      });

      this.$options.interval = setInterval(this.getWorkstations, 5000)
    },
    beforeDestroy () {
        clearInterval(this.$options.interval)
    }
}
</script>

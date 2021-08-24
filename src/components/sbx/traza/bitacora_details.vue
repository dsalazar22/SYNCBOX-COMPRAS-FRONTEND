<template>
    <div>
        <!-- <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
            <div>Bitácora - Detalle</div>
        </h4> -->

        <!-- {{dataMessage[0].call_info}} -->

        <div class="text-center mb-4">
            <h2 style="margin-bottom: 1px;">
                <i v-if="(dataMessage[0] == undefined ? 'NA' : dataMessage[0].module) == 'CL'" class="fa fa-phone"></i> {{dataMessage[0] != undefined ? dataMessage[0].title: ''}}
            </h2>
            <h3 style="margin-bottom: 1px;">
                {{dataMessage[0] != undefined ? dataMessage[0].wscode : ''}}
            </h3>
            <h4 style="margin-bottom: 1px;">
                Por: {{dataMessage[0] != undefined ? dataMessage[0].username : ''}}
            </h4>
            <h5 style="margin-bottom: 1px;">
                Fecha de Creación:  {{dataMessage[0] != undefined ? dataMessage[0].created : ''}}
            </h5>
            <h6 style="margin-bottom: 1px;">
               Fecha Inicio: {{dataMessage[0] != undefined ? dataMessage[0].start_date  : ''}} | Fecha Fin: {{dataMessage[0] != undefined ? dataMessage[0].finish_date : ''}}
            </h6>
            <div>
                <b-btn variant="outline-success borderless" size="sm" @click="messageContent=true;content=dataMessage[0].message;recommend=dataMessage[0].details;" v-if="(dataMessage[0] == undefined ? 'NA' : dataMessage[0].module)  == 'CL'" ><i class="ion ion-md-create"></i> Editar Informacion Bitacora</b-btn>
            </div>
        </div>

        <h4 style="margin-bottom: 1px;">
           Detalle de la Actividad Realizada / Comentarios
        </h4>

        <div>
            <table class="table table-sm mb-3" v-if="(dataMessage[0] == undefined ? 'NA' : dataMessage[0].module) == 'CL'">
                <thead>
                    <tr>
                    <th>Descripcion</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Tiempo Total</th>
                    <th>Atiende</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in dataMessage[0].call_info" :key="`CL${item.calls_history_id}`">
                        
                        <td>
                            {{item.description}}
                        </td>
                        <td>
                            {{item.start_date}}
                        </td>
                        <td>
                            {{item.finish_date}}
                        </td>
                        <td>
                            {{item.elapsed_time}}
                        </td>
                        <td>
                            {{item.name}} {{item.lastname}}
                        </td>
                    </tr>
                </tbody>
            </table>



            {{dataMessage[0] != undefined ? dataMessage[0].message : ""}}
        </div>
        

        <h4 class="mt-3" style="margin-bottom: 1px;">
            Actividades Pendientes / Recomendaciones
        </h4>
        <div>
            {{dataMessage[0] != undefined ? dataMessage[0].details : "" }}
        </div>

        <h4 class="mt-3" style="margin-bottom: 1px;">
            Documentos
        </h4>
        
        
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Tamaño</th>
                    <!-- <th>Acceso Global</th> -->
                    <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(file, index) in tableData" :key="file.documents_id">
                        
                        <td>
                            <a @click="test(index)" style="cursor: pointer;">
                                <b-img thumbnail v-bind:src="images[index]" class="rounded mx-auto d-block" style="width:50px"></b-img>
                            </a>
                        </td>
                        <td>
                            
                             {{file != undefined ? file.name: ""}}
                                
                        </td>
                        <td>{{file != undefined ?  (file.size/1024/1024 | file.size) : "" }} MB</td>
                        <!-- <td>{{file.global_access}}</td> -->
                        <td>
                            <b-dd text="Acción" size="sm" :right="!isRTL">
                            <b-dd-item @click="downloadFile(file)">Descargar</b-dd-item>
                            <!-- <b-dd-divider /> -->
                            <!-- <b-dd-item @click="$refs.upload.remove(file)">Borrar</b-dd-item> -->
                            </b-dd>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <b-modal id="modals-top" v-model="messageContent"  class="modal-center" size="xl" hide-footer title="Adicionar Contenido"> 
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

         <b-modal v-model="imgDetails" hide-footer>
            <b-img thumbnail v-bind:src="images[indexSelectedImages]" class="rounded mx-auto d-block"></b-img>
            <b-button class="mt-3" block @click="imgDetails=false">Cerrar Ventana</b-button>
        </b-modal>
    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import axios from 'axios'
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


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

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
        "$route.params.code":function(values){
            this.codearea = values

            infotraza.bitacora({area_info:values}, 1, 'area').then(data =>{
                this.tableData = []
                if(data.data != "")
                this.tableData = data.data
                // console.log(data)
                // this.content = ''
                // this.messageContent = false
                // this.cargarDatos(this.chatUser)
            })
        }
    },
    data() {
        return {
            content:'',
            recommend:'',
            userInfo:{},
            messageContent:false,
            messageStatus:true,
            selectedFiles:[],

            tableData:[],
            dataMessage:[],
            images:[],
            imgDetails:false,

            indexSelectedImages:null,
        }
    },

    methods: {
        async submit() {

            this.messageStatus = false

            let selectedformessage = {}
            selectedformessage.user_id =this.userInfo.iduser
            selectedformessage.message =this.content
            selectedformessage.details =this.recommend
            selectedformessage.message_id =this.dataMessage[0].message_id
            

            await infotraza.bitacora(selectedformessage, 1, 'edit').then(data =>{
                // if(data.data != ""){

                    if(this.selectedFiles.length>0){
                        
                        let postAction = 'btc/'+this.dataMessage[0].message_id.toString()+'/btc'

                        for (let index = 0; index < this.selectedFiles.length; index++) {
                            const element = this.selectedFiles[index];
                            // console.log(element)
                            inforundb.uploadFile(postAction, element).then(data=>{
                                this.infoLoad()
                            })
                        }
                    }else{
                        this.infoLoad()
                    }
                // }
                this.infoLoad()
                this.messageContent = false
                this.messageStatus = true
            })
        },

        test(ix){
            // console.log('aaaaaa')
            this.imgDetails=true
            this.indexSelectedImages = ix
        },
        downloadFile(item){
            inforundb.download(item.documents_id, item.physical_name, 'blob').then(({ data }) => {

                const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', item.physical_name); //any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();

            });
        },

        getDataUrl(img) {
            return axios.get(img, { responseType: 'arraybuffer' })
            .then((response) => {
                let image = btoa(
                new Uint8Array(response.data)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                return `data:${response.headers['content-type'].toLowerCase()};base64,${image}`;
            });
        },

        async downloadProfilePicture(index, item) {
            let img = null
            if(item != undefined && item.mime_type.includes('image')){
                await inforundb.downloadImgs(item.documents_id, item.physical_name,'arraybuffer').then( data  => {
                    try{
                        if(data.data.byteLength>0){
                            var _imageEncode = function (arrayBuffer) {
                                let u8 = new Uint8Array(arrayBuffer)
                                let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer),function(p,c){return p+String.fromCharCode(c)},''))
                                let mimetype="image/jpeg"
                                return "data:"+mimetype+";base64,"+b64encoded
                            }
                            let image = _imageEncode(data.data)
                            
                            // this.images.push(image);
                            this.images.push(image)
                            
                        }

                    }catch{
                    }

                });
            }

            // console.log(this.images)
            return(img)
        },

        formatNames(files) {
            this.selectedFiles = files
            if (files.length === 1) {
                return files[0].name
            } else {
                return `${files.length} files selected`
            }
        },

        infoLoad(){
            let codearea = this.$route.params.code 
            this.tableData = []
            this.images=[]
            inforundb.getfiles('btc/'+codearea+'/btc').then(data => {
                // console.log(data)
                if(data.data != ""){
                    // console.log(data.data)
                    this.tableData = data.data
                    for (let index = 0; index < this.tableData.length; index++) {
                        const element = this.tableData[index];
                        if(element != undefined)
                            this.downloadProfilePicture(index, element)
                    }
                }
            })

            infotraza.bitacora(codearea, 1, 'areabyid').then(data =>{
                this.dataMessage = []
                if(data.data != "")
                    this.dataMessage = data.data
                // console.log(this.dataMessage )
            })
        }

        // downloadProfilePicture (item) {
        //    inforundb.download(item.documents_id, item.physical_name).then(({ data }) => {
        //         const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        //          document.getElementById("img0").src = downloadUrl; //any other extension
        //           document.getElementById()
        //     })
        // },
    },

    created() {
        infouser.currentUser().then(response =>{
                this.userInfo=response.data
            }).catch(e => {
        });

        this.infoLoad()
    },
}
</script>
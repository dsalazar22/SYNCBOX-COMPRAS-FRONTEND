<template>
     <div>

        <b-tabs content-class="mt-3">
            <b-tab title="Documentos Disponibles" active @click="getFiles()">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Tamaño</th>
                            <th>Acceso Global</th>
                            <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(file, index) in uploadsFiles" :key="file.documents_id">
                                <td>{{index}}</td>
                                <td>
                                    <div class="filename">
                                    {{file.name}}
                                    </div>
                                </td>
                                <td>{{ file.size/1024/1024 | file.size }} MB</td>
                                <td>{{file.global_access}}</td>
                                <td>
                                    <b-dd text="Acción" size="sm" :right="!isRTL">
                                    <b-dd-item @click="downloadFile(file)">Descargar</b-dd-item>
                                    <b-dd-divider />
                                    <b-dd-item @click="$refs.upload.remove(file)">Borrar</b-dd-item>
                                    </b-dd>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </b-tab>
            <b-tab title="Subir Documentos">

                <file-upload class="sr-only"
                    :name="name"
                    :post-action="postAction"
                    :multiple="multiple"
                    :directory="directory"
                    :size="size || 0"
                    :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
                    :drop="drop"
                    :drop-directory="dropDirectory"
                    :add-index="addIndex"
                    v-model="files"
                    @input-filter="inputFilter"
                    @input-file="inputFile"
                    ref="upload" />
                        
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>Thumb</th>
                                <th>Nombre</th>
                                <th>Tamaño</th>
                                <th>Velocidad</th>
                                <th>Estado</th>
                                <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!files.length">
                                    <td colspan="7">
                                        <div class="text-center p-5">
                                        <h4>Arrastre los archivos a aquí <div class="text-muted small my-3">o</div></h4>
                                        <label :for="name" class="btn btn-primary btn-lg">Seleccionar Archivos</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-for="(file, index) in files" :key="file.id">
                                    <td>{{index}}</td>
                                    <td>
                                        <img v-if="file.thumb" :src="file.thumb" width="40" height="auto" />
                                        <span v-else>No Image</span>
                                    </td>
                                    <td>
                                        <div class="filename">
                                        {{file.name}}
                                        </div>
                                        <b-progress :value="Number(file.progress)" :variant="file.error ? 'danger' : ''" :animated="file.active" v-if="file.active || file.progress !== '0.00'" height="6px" style="margin: 4px 0 0 0" />
                                    </td>
                                    <td>{{ file.size/1024/1024 | fileSize }} MB</td>
                                    <td>{{file.speed}}</td>
                                    <td v-if="file.error">{{file.error}}</td>
                                    <td v-else-if="file.success">success</td>
                                    <td v-else-if="file.active">active</td>
                                    <td v-else></td>
                                    <td>
                                        <b-dd text="Acción" size="sm" :right="!isRTL">
                                        <b-dd-item :disabled="!file.active" @click="file.active ? $refs.upload.update(file, {error: 'cancel'}) : false">Cancelar</b-dd-item>
                                        <b-dd-item v-if="file.active" @click="$refs.upload.update(file, {active: false})">Abort</b-dd-item>
                                        <b-dd-item v-else-if="file.error && $refs.upload.features.html5" @click="$refs.upload.update(file, {active: true, error: '', progress: '0.00'})">Reintentar Carga</b-dd-item>
                                        <b-dd-item v-else :disabled="file.success" @click="file.success ? false : $refs.upload.update(file, {active: true})">Cargar</b-dd-item>
                                        <b-dd-divider />
                                        <b-dd-item @click="$refs.upload.remove(file)">Borrar</b-dd-item>
                                        </b-dd>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 

                <b-btn @click="$refs.upload.$el.querySelector('input').click()" variant="secondary">
                    <i class="ion ion-md-add"></i> Seleccionar Archivos
                </b-btn>

                <b-btn v-if="!$refs.upload || !$refs.upload.active" @click="$refs.upload.active = true" variant="success">
                    <i class="ion ion-md-arrow-up" aria-hidden="true"></i> Iniciar Carga
                </b-btn>
                <b-btn v-else @click="$refs.upload.active = false" variant="danger">
                    <i class="ion ion-md-close" aria-hidden="true"></i> Detener Carga
                </b-btn>   
            </b-tab>
        </b-tabs>                   
    </div>
</template>

<script>
import Vue from "vue";
import VueUploadComponent from 'vue-upload-component'
import { inforundb } from "@/components/i40/js/rundb";

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

  export default {
      props: {
        module: {
            type: String
        },
        module_id: {
            type: Number
        },
        module_detail: {
            type: String
        },
    },
      components:{
          FileUpload: VueUploadComponent
      },
    data() {
      return {
        uploadsFiles:[],

        files: [],
        name: 'file',

        accept: 'image/png,image/gif,image/jpeg,image/webp',
        extensions: 'gif,jpg,jpeg,png,webp',
        // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
        // extensions: /\.(gif|jpe?g|png|webp)$/i,
        minSize: 1024,
        size: 1024 * 1024 * 10,
        multiple: true,
        directory: false,
        drop: true,
        dropDirectory: true,
        addIndex: false,
        thread: 3,
        postAction: ''
      }
    },
    methods: {
         onAddFolder () {
            if (!this.$refs.upload.features.directory) {
                alert('Your browser does not support')
                return
            }
            let input = this.$refs.upload.$el.querySelector('input')
            input.directory = true
            input.webkitdirectory = true
            this.directory = true
            input.onclick = null
            input.click()
            input.onclick = (e) => {
                this.directory = false
                input.directory = false
                input.webkitdirectory = false
            }
        },
        inputFilter (newFile, oldFile, prevent) {
            if (newFile && !oldFile) {
                // Before adding a file
                // Filter system files or hide files
                if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
                return prevent()
                }
                // Filter php html js file
                if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
                return prevent()
                }
            }
            if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
                // Create a blob field
                newFile.blob = ''
                let URL = window.URL || window.webkitURL
                if (URL && URL.createObjectURL) {
                newFile.blob = URL.createObjectURL(newFile.file)
                }
                // Thumbnails
                newFile.thumb = ''
                if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
                newFile.thumb = newFile.blob
                }
            }
        },
    // add, update, remove File Event
        inputFile (newFile, oldFile) {
            if (newFile && oldFile) {
                // update
                if (newFile.active && !oldFile.active) {
                    // beforeSend
                    // min size
                    if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
                        this.$refs.upload.update(newFile, { error: 'size' })
                    }
                }
            }
        },

        getFiles(){
            inforundb.getfiles(this.module+'/'+this.module_id.toString()+'/'+this.module_detail).then(data => {
                // console.log(data)
                if(data.data != ""){
                    this.uploadsFiles = data.data
                }else{
                    this.uploadsFiles = []
                }

            })
        },
        downloadFile(item){
            inforundb.download(item.documents_id, item.physical_name,'blob').then(({ data }) => {

                const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', item.physical_name); //any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();

            });
        }
    },
    created() {
        this.postAction = inforundb.gethost()+'upload/'+this.module+'/'+this.module_id.toString()+'/'+this.module_detail
        this.getFiles()
    },
  }
</script>
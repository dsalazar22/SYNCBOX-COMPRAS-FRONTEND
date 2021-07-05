<template>
  <div>
        <notifications group="notifications-default" />
    <h4 class="font-weight-bold py-3 mb-4">
      Editar Usuario <span class="text-muted">{{userInfo.user}}</span>
    </h4>
    
    <b-tabs class="nav-tabs-top nav-responsive-sm">
      <b-tab title="Crear Perfil" active>
        <b-card-body>

          <!-- <div class="media align-items-center" v-if="false">
            <img :src="`/static/img/avatars/${userData.avatar}`" alt="" class="d-block ui-w-80">
            <div class="media-body ml-3">
              <label class="form-label d-block mb-2">Avatar</label>
              <b-btn variant="outline-primary" size="sm">Cambiar</b-btn>&nbsp;
              <b-btn variant="default md-btn-flat" size="sm">Restablecer</b-btn>
            </div>
          </div> -->

        </b-card-body>
        <hr class="border-light m-0">
        
        <b-card-body class="pb-2">
          <b-form-group label="Usuario">
            <b-input v-model="userInfo.username" :disabled="$route.params['id'] != null"/>
          </b-form-group>

          <b-form-group label="Nombre">
            <b-input v-model="userInfo.name" />
          </b-form-group>

          <b-form-group label="Apellido">
            <b-input v-model="userInfo.lastname" class="mb-1" />
          </b-form-group>

          <b-form-group label="Email">
            <b-input v-model="userInfo.email" class="mb-1" />
          </b-form-group>

           <b-form-group label="Password" v-if="$route.params['id'] == null">
            <b-input v-model="userInfo.password" type="password" />
          </b-form-group>

          <b-form-group label="Password" v-if="$route.params['id'] != null">
            <b-input-group>
              <!-- <b-input v-model="userInfo.reset_password" type="password" /> -->
              <b-form-input  v-model="userInfo.reset_password" type="password" ></b-form-input>
              <b-input-group-append>
                <b-button variant="warning" @click="reset_password()">Cambiar Contraseña</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-card-body>
        <hr class="border-light m-0">



          <!-- <b-input-group prepend="Asignar una Nueva Contraseña" class="mt-2 ml-2 mr-2">
            <b-form-input></b-form-input>
            <b-input-group-append>
              <b-button variant="outline-success">Button</b-button>
              <b-button variant="info">Button</b-button>
            </b-input-group-append>
          </b-input-group> -->

        <!-- <b-card-body class="pb-2">

          <b-form-group label="Rol">
            <b-select v-model="userData.role" :options="{1: 'Usuario', 2:  'Autorizado', 3: 'Personal', 4: 'Admin'}" />
          </b-form-group>

          <b-form-group label="Estado">
            <b-select v-model="userData.status" :options="{1: 'Activo', 2: 'Inactivo', 3: ' Bloqueado'}" />
          </b-form-group>

          <b-form-group>
            <b-check v-model="userData.verified">Verificar</b-check>
          </b-form-group>

        </b-card-body> -->
        <hr class="border-light m-0">
        <div class="table-responsive" v-if="$route.params['id'] != null">

          <b-table :disabled="true" :fields="userData.title_permissions" :items="userData.permissions" class="card-table m-0">
            
            <template v-slot:cell(module)="data"> 
              <!-- <b-check v-if="data.item.read != null" v-model="data.item.read" class="px-2 m-0" /> -->
              <div :class="{'font-weight-bold':data.item.read == null && data.item.write == null}">
                {{data.item.module}}
              </div>
            </template>

            <template v-slot:cell(read)="data">
              <b-check v-if="data.item.read != null && !['start_multiple','stop_multiple','start_order','stop_order','report_unities','change_state_workstation'].includes(data.item.opcion)" v-model="data.item.read" class="px-2 m-0" @change="clic_read(data)" />
            </template>

            <template v-slot:cell(write)="data">
              <b-check v-if="data.item.write != null" v-model="data.item.write" @change="clic_write(data)" class="px-2 m-0" />
            </template>
            <template  v-slot:cell(create)="data">
              <b-check v-if="data.item.create != null && !['start_multiple','stop_multiple','start_order','stop_order','report_unities','change_state_workstation'].includes(data.item.opcion)" v-model="data.item.create" @change="clic_create(data)" class="px-2 m-0" />
            </template>
            <template v-slot:cell(delete)="data">
              <b-check v-if="data.item.delete != null && !['start_multiple','stop_multiple','start_order','stop_order','report_unities','change_state_workstation'].includes(data.item.opcion)" v-model="data.item.delete" @change="clic_delete(data)" class="px-2 m-0" />
            </template>
          </b-table>

        </div>
      </b-tab>
      <b-tab title="Información" v-if="false">
        <b-card-body class="pb-2">

        <h6 class="mb-4">Información Personal</h6>
        </b-card-body>
        <hr class="border-light m-0">
        <b-card-body class="pb-2">
          <b-form-group label="Número Celular">
            <b-input v-model="userData.info.phone" />
          </b-form-group>
           <b-form-group label="Fecha de cumpleaños">
            <b-input v-model="filterbrithday" :config="{ altInput: true, animate: !isRTL, dateFormat: 'm/d/Y', altFormat: 'm/d/Y', mode: 'range' }" :placeholder="'Any'" />
          </b-form-group>
          <hr class="form-label ml-1">

        </b-card-body>
      </b-tab>
    </b-tabs>

    <div class="text-right mt-3">
      <b-btn variant="primary" @click="save_info">Guardar</b-btn>&nbsp;
      <b-btn variant="default">Cancelar</b-btn>
    </div>
  </div>
</template>
<!-- Page -->
<style src="@/vendor/styles/pages/users.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
import Vue from 'vue'
import {infousers} from '@/components/i40/js/users'
import { ObtenerInfoLicense } from "@/vendor/sbx/sbx-cloud/cloud_control";
import Notifications from 'vue-notification'

Vue.use(Notifications)


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
  name: 'user_edit',

  metaInfo: {
    title: 'Editar Usuario'
  },
  components: {
  },
  data: () => ({
    userInfo:{},
    
    userData: {
      title_permissions: [
                        /* {key:'opcion', label:'Opción'}, */
                        {key:'module', label:'Módulo'},
                        {key:'read', label:'Leer'},
                        {key:'write', label:'Escribir'},
                        {key:'create', label:'Crear'},
                        {key:'delete', label:'Eliminar'}],
      
      specific_permissions: [
        {
          key:'option', label:'Opción',
          key:'edit', label:'Si',
        }
      ],

      // specifics: [
      //   {option:'Iniciar Orden de Producción', edit: false},
      //   {option:'Finalizar Orden de Producción', edit: false},
      //   {option:'Cambiar Paro', edit: false},
      //   {option:'Reportar Unidades', edit: false},
      // ],
      
      // unique_access:['start_order','stop_order','report_unities','change_state_workstation'],

      permissions: [
        { module:'Informes'},
        { opcion:'show_gerencial', module: 'Reporte Gerencial', read: false, write: false, create: false, delete: false},
        { opcion:'show_comm', module: 'Reporte Comercial', read: false, write: false, create: false, delete: false},
        { opcion:'show_cap', module: 'Reporte Capacidades', read: false, write: false, create: false, delete: false},

        { module:'Tambor'},
        { opcion:'drump_production', module: 'Tambor de producción', read: false, write: false, create: false, delete: false},
        { opcion:'drump_commercial', module: 'Tambor de Pedidos', read: false, write: false, create: false, delete: false },
        { opcion:'drump_purchase', module: 'Tambor de Compras', read: false, write: false, create: false, delete: false },

        { module:'Planeación'  },
        { opcion:'planning_resources', module: 'Planeación de Recursos', read: false, write: false, create: false, delete: false },
        { opcion:'planning_online', module: 'Inventario en linea', read: false, write: false, create: false, delete: false },
        // { opcion:'planning_manual', module: 'Reporte Manual', read: false, write: false, create: false, delete: false },
        { opcion:'planning_order', module: 'Crear/Editar Orden', read: false, write: false, create: false, delete: false },

        /* { opcion:'Calidad', module: 'Calidad', read: false, write: false, create: false, delete: false },
        { opcion:'', module: 'Cuarentena', read: false, write: false, create: false, delete: false }, */

        /* { opcion:'Comercial', module: 'Comercial', read: false, write: false, create: false, delete: false },
        { opcion:'', module: 'Forescast', read: false, write: false, create: false, delete: false }, */

        { module: 'Productos' },
        { opcion:'products_route', module: 'Ruta de Productos', read: false, write: false, create: false, delete: false },
        { opcion:'products_fammily', module: 'Familia de Productos', read: false, write: false, create: false, delete: false },
        { opcion:'products_products', module: 'Productos', read: false, write: false, create: false, delete: false },
        // { opcion:'products_add', module: 'Crear/Editar Orden', read: false, write: false, create: false, delete: false },

        { module: 'Operaciones'},
        { opcion:'operations_tools', module: 'Herramentales', read: false, write: false, create: false, delete: false },
        { opcion:'operations_plants', module: 'plantas', read: false, write: false, create: false, delete: false },
        { opcion:'operations_workstation_groups', module: 'Grupos Centros de Trabajo', read: false, write: false, create: false, delete: false },
        { opcion:'operations_workstation', module: 'Centros de Trabajo', read: false, write: false, create: false, delete: false },
        { opcion:'operations_process', module: 'Definición de Procesos', read: false, write: false, create: false, delete: false },

        { opcion:'Control de Piso', module: 'Control de Piso' },
        { opcion:'floor_stopcode', module: 'Código de Paro', read: false, write: false, create: false, delete: false },
        { opcion:'floor_root', module: 'Códigos Causa Raiz', read: false, write: false, create: false, delete: false },
        { opcion:'floor_scrap', module: 'Códigos de Defectos', read: false, write: false, create: false, delete: false },
        { opcion:'floor_tags', module: 'Configuracíon Tags', read: false, write: false, create: false, delete: false },

        /* { opcion:'Inventarios', module: 'Inventario', read: false, write: false, create: false, delete: false },
        { opcion:'', module: 'Bodega', read: false, write: false, create: false, delete: false }, */
        { module: 'Capacidades' },
        { opcion:'capacity_holidays', module: 'Festivos', read: false, write: false, create: false, delete: false },
        { opcion:'capacity_capacity', module: 'Capacidades', read: false, write: false, create: false, delete: false },
        { opcion:'capacity_calendar', module: 'Calendario', read: false, write: false, create: false, delete: false },

        { opcion:'Generales', module: 'Generales' },
        { opcion:'general_customer', module: 'Clientes', read: false, write: false, create: false, delete: false },
        { opcion:'general_providers', module: 'Proveedores', read: false, write: false, create: false, delete: false },

        { module:'Administración'},
        { opcion:'admin_um', module: 'Unidad de Medidas', read: false, write: false, create: false, delete: false },
        { opcion:'admin_tools_type', module: 'Tipos de Herramentales', read: false, write: false, create: false, delete: false },
        { opcion:'admin_workstation_type', module: 'Tipos Centros de Trabajo', read: false, write: false, create: false, delete: false },
        { opcion:'admin_document_status', module: 'Estado de Documentos', read: false, write: false, create: false, delete: false },
        { opcion:'admin_documents_types', module: 'Tipo de Documentos', read: false, write: false, create: false, delete: false },
        { opcion:'admin_funcitonal_area', module: 'Áreas Funcionales', read: false, write: false, create: false, delete: false },
        { opcion:'admin_personal', module: 'Personal', read: false, write: false, create: false, delete: false },


        { module: 'Costos' },
        { opcion:'costs_opr', module: 'Costos Operacion', read: false, write: false, create: false, delete: false },
        { opcion:'costs_cnfg', module: 'Costos Configuracion', read: false, write: false, create: false, delete: false },

        { module: 'Usuarios' },
        { opcion:'users', module: 'Lista de Usuarios', read: false, write: false, create: false, delete: false },
        { opcion:'users_edit', module: 'Editar Usuarios', read: false, write: false, create: false, delete: false },

        { module: 'Menu Comercial' },
        { opcion:'tmb_visual_comm', module: 'Tambor Comercial - Visual Comercial', read: false, write: false, create: false, delete: false },
        { opcion:'cot_comm', module: 'Listado de Cotizaciones', read: false, write: false, create: false, delete: false },
        { opcion:'new_order_comm', module: 'Nuevo Pedido', read: false, write: false, create: false, delete: false },
        { opcion:'new_quot_comm', module: 'Nueva Cotizacion', read: false, write: false, create: false, delete: false },
        { opcion:'liberar_comm', module: 'Liberar Pedidos', read: false, write: false, create: false, delete: false },
        { opcion:'appr_comm', module: 'Aprobar Pedidos', read: false, write: false, create: false, delete: false },
        { opcion:'bill_comm', module: 'Cartera', read: false, write: false, create: false, delete: false },

        { module: 'Información de SyncBox' },
        { opcion:'admin_services', module: 'Administración de Procesos', read: false, write: false, create: false, delete: false },
        { opcion:'info_check', module: 'Diagnostico', read: false, write: false, create: false, delete: false },
        { opcion:'info_licence', module: 'Licencia', read: false, write: false, create: false, delete: false },

        { module:'Acciones Producción' },
        { opcion:'report_manual_tac', module: 'Reporte de Produccion TAC', read: false, write: false, create: false, delete: false },
        { opcion:'start_order', module: 'Iniciar Orden de Producción', read: false, write: false, create: false, delete: false },
        { opcion:'stop_order', module: 'Finalizar Orden de Producción', read: false, write: false, create: false, delete: false },
        { opcion:'change_state_workstation', module: 'Cambiar de Estado la Máquina', read: false, write: false, create: false, delete: false },
        { opcion:'report_unities', module: 'Reportar Ordenes de Producción', read: false, write: false, create: false, delete: false },
        { opcion:'stop_multiple', module: 'Detener Multiples Ordenes de Produccion', read: false, write: false, create: false, delete: false },
        { opcion:'start_multiple', module: 'Iniciar Multiples Ordenes de Producción', read: false, write: false, create: false, delete: false },
        { opcion:'edit_control_vars', module: 'Editar Variables Configuradas en Maquina', read: false, write: false, create: false, delete: false }
      ],
      serverCode:0,
    }
  }),
  methods: {
    showCustom: function(classes, title, text) {
        this.$notify({
            group: 'notifications-default',
            type: classes,
            title: title,
            text: text
        })
    },

    clic_read(item){
      /* if(item.item.delete){ */
      if (item.item.read != null){
        item.item.write = false
        item.item.delete = false
        item.item.create = false
      }
      /* } */
    },
    clic_write(item){
      if(!item.item.write){
        if (item.item.read != null){
          item.item.read = true
        }
      }
    },
    clic_create(item){
      if(!item.item.create){
        if (item.item.read != null){
          item.item.read = true
        }
      }
    },
    clic_delete(item){
      if(!item.item.delete){
        if (item.item.read != null){
          item.item.read = true
        }
      }
    },

    save_info(){
      var objInfo = {
        InfoUser : this.userInfo,
        InfoAccess: this.userData.permissions
      }
      
      if(this.$route.params['id'] != null){
        infousers.updateinfousers(objInfo, this.serverCode).then(data =>{
          this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
          // console.log(data.data)
          // this.userInfo = data.data
        })
      }else{
        infousers.newlocaluser({
          	user: this.userInfo.username,
            password: this.userInfo.password,
            name: this.userInfo.name,
            lastname: this.userInfo.lastname,
            email: this.userInfo.email
        }, this.serverCode ).then(data =>{
          if(data.data != ""){
            this.$router.push(this.$route.query.redirect || '/users/users_list')
            // this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
          }
          // this.userInfo = data.data
        })
      }
    },

    reset_password(){
      let param = {
          	NewPassword: this.userInfo.reset_password,
            CodeUser: this.$route.params['id'],
        }
// console.log(param)
        infousers.resetpassword(param).then(data =>{
          this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
        })
    },

    addMusicTag (newTag) {
      this.userData.info.music.push(newTag)
    },

    addMovieTag (newTag) {
      this.userData.info.movies.push(newTag)
    }
  },

  created() {
     ObtenerInfoLicense().then( data => {
        this.serverCode = data.data.NumeroValidacion
       
        if(this.$route.params['id'] != null){
          infousers.getinfouser(this.$route.params['id'], this.serverCode).then(data =>{
          
            this.userInfo = JSON.parse(data.data)[0].infouser[0]
            
            var accessdetails = JSON.parse(data.data)[0].accessdetails
            for (let index = 0; index < accessdetails.length; index++) {
              const accesselement = accessdetails[index];
              for (let permisionindex = 0; permisionindex < this.userData.permissions.length; permisionindex++) {
                const permissionelement = this.userData.permissions[permisionindex];
                if(accesselement.code_option_id == permissionelement.opcion){
                  if(accesselement.access_type >= 1000){
                    let aval = accesselement.access_type.toString()
                    this.userData.permissions[permisionindex].read = aval[0] == 1;
                    this.userData.permissions[permisionindex].write = aval[1] == 1;
                    this.userData.permissions[permisionindex].create = aval[2] == 1;
                    this.userData.permissions[permisionindex].delete = aval[3] == 1;
                  }
                }
              }
            }
          })
        }

    }).catch(function (error) {
        console.log("ERR", error.status)
    });
  }
}
</script>
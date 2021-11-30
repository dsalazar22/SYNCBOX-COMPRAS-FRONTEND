<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Usuarios
    </h4>

     <b-alert
      :show="dismissCountDown"
      dismissible
      variant="warning"
      @dismissed="saveAction()"
      @dismiss-count-down="countDownChanged"
    >
      <p>Este cambió será ejecutado en {{ dismissCountDown }} segundos...</p>
      <b-progress
        variant="warning"
        :max="dismissSecs"
        :value="dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>

    <!-- Filters -->
    <!-- <div class="ui-bordered px-4 pt-4 mb-4">
      <div class="form-row align-items-center">
        <div class="col-md mb-4">
          <label class="form-label ml-1">Verificado</label>
          <b-select v-model="filterVerified" :options="['Si', 'No']" />
        </div>
        <div class="col-md mb-4">
          <label class="form-label ml-1">Rol</label>
          <b-select v-model="filterRole" :options="[ 'Usuario', 'Autorizado', 'Personal', 'Admin']" />
        </div>
        <div class="col-md mb-4">
          <label class="form-label ml-1">Estado</label>
          <b-select v-model="filterStatus" :options="[ 'Activo', 'Inactivo', 'Bloqueado']" />
        </div>
        <div class="col-md mb-4">
          <label class="form-label ml-1">Última Actividad</label>
          <flat-pickr v-model="filterLatestActivity" :config="{ altInput: true, animate: !isRTL, dateFormat: 'm/d/Y', altFormat: 'm/d/Y', mode: 'range' }" :placeholder="!isIE ? 'Any' : null" />
        </div>
        <div class="col-md col-xl-2 mb-4">
          <label class="form-label d-none d-md-block">&nbsp;</label>
          <b-btn variant="success" :block="true">Filtrar</b-btn>
        </div>
      </div>
    </div> -->
    <!-- / Filters -->

    <!-- <b-card no-body> -->

     
      <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->
      <!-- <b-row> -->
                <!-- <b-col md="5" class="my-1">
                    <b-input-group>
                        <b-form-input v-model="filter" placeholder="Buscar..." />
                        <b-input-group-append>
                        <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </b-col> -->
                <!-- ESTE ES EL BUSCADOR Y EL BOTON PARA BORRAR -->

                 <!-- ESTE ES EL PAGINADOR -->
                <!-- <b-col md="5" class="my-1">
                    <b-form-select :options="pageOptions" v-model="perPage" />
                </b-col> -->
                <!-- ESTE ES EL PAGINADOR -->
                 
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
                <!-- <b-col md="2" class="d-flex justify-content-center my-1">
                    <b-btn variant="outline-info icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="openHelp"><i class="fas fa-chalkboard-teacher"></i></b-btn>
                </b-col> -->
                <!-- BOTONES PARA CREAR NUEVOS REGISTROS Y PARA OPCION DE AYUDA -->
      <!-- </b-row> -->
      <!-- Table -->
      <hr class="border-light m-2">
      <div class="table-responsive">

        <b-table
          :items="usersData"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :striped="true"
          :bordered="true"
          :current-page="currentPage"
          :per-page="perPage"
          class="card-table">

          <template v-slot:cell(account)="row">
            <a href="javascript:void(0)">{{row.item.account}}</a>
          </template>

          <template v-slot:cell(confirmemail)="row">
            <span class="ion" :class="{'ion-md-checkmark text-primary': row.item.confirmemail, 'ion-md-close text-light': !row.item.confirmemail}"></span>
          </template>

          <!-- <template slot="role" v-slot:cell(edit)="row">>
            <span v-if="row.item.role === 1">Usuario</span>
            <span v-if="row.item.role === 2">Autorizado</span>
            <span v-if="row.item.role === 3">Personal</span>
            <span v-if="row.item.role === 4">Admin</span>
          </template> -->

          <template v-slot:cell(useractive)="row">
            <!-- {{row.item}} -->
            <b-badge variant="outline-success" v-if="row.item.useractive === true">Activo</b-badge>
            <b-badge variant="outline-danger" v-if="row.item.useractive === false">Inactivo</b-badge>
          </template>

          <template v-slot:cell(edit)="row">
            <!-- <router-link :to="{ path: '/users/users_edit/' + row.item.iduser }">
              <i class="ion ion-md-create"></i>
            </router-link> -->
            <!-- <b-btn variant="default btn-xs icon-btn md-btn-flat" v-b-tooltip.hover title="Edit"><i class="ion ion-md-create"></i></b-btn> -->
            <b-dropdown variant="default btn-xs icon-btn md-btn-flat hide-arrow" :right="!isRTL">
              <template slot="button-content"><i class="ion ion-ios-settings"></i></template>
              <!-- <b-dropdown-item href="javascript:void(0)">Ver Perfil</b-dropdown-item> -->
              <b-dropdown-item :to="{ path: '/users/users_edit/' + row.item.iduser }">Editar Usuario</b-dropdown-item>
              <b-dropdown-item-button @click="deactivated(row.item)"> {{row.item.useractive === true ? 'Desactivar Usuario': 'Activar Usuario'}}</b-dropdown-item-button>
              <!-- <b-dropdown-item href="javascript:void(0)">Eliminar</b-dropdown-item> -->
            </b-dropdown>
          </template>
        </b-table>

      </div>

      <!-- Pagination -->
      <b-card-body class="pt-0 pb-3">

        <div class="row">
          <div class="col-sm text-sm-left text-center pt-3">
            <span class="text-muted" v-if="totalItems">Page {{ currentPage }} of {{ totalPages }}</span>
          </div>
          <div class="col-sm pt-3">
            <b-pagination class="justify-content-center justify-content-sm-end m-0"
              v-if="totalItems"
              v-model="currentPage"
              :total-rows="totalItems"
              :per-page="perPage"
              size="sm" />
          </div>
        </div>

      </b-card-body>
      <!-- / Pagination -->

    <!-- </b-card> -->
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import flatPickr from 'vue-flatpickr-component'
import {infousers} from '@/components/i40/js/users'
import { ObtenerInfoLicense } from "@/vendor/sbx/sbx-cloud/cloud_control";


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
  name: 'users_list',

  metaInfo: {
    title: 'Lista Usuarios'
  },
  components: {
    flatPickr
  },
  data: () => ({
    // Options
    dataUrl: '/static/json/pages_users_list.json',
    searchKeys: ['id', 'account', 'email', 'name'],
    sortBy: 'id',
    sortDesc: false,

    ///Info de filtro y paginas para la tabla
        currentPage: 1,
        perPage: 50,
        totalRows: 0,
        pageOptionpageOptions: [ 50, 100, 200 ],
        // filter: null,
     ///Info de filtro y paginas para la tabla


        showFormulario:false,
        variantSaveButton:"success",
        disabledcode:false,
        modified:false,
        tableData: [], 
        selectedUser:{}, 

        dismissSecs: 5,
        dismissCountDown: 0,
        showDismissibleAlert: false,

    fields: [
     
      { key: 'username',label: 'Usuario', sortable: true, tdClass: 'align-middle' },
      { key: 'email', label: 'Email', sortable: true, tdClass: 'align-middle' },
      { key: 'name',label: 'Nombre', sortable: true, tdClass: 'align-middle' },
      { key: 'lastname',label: 'Apellido', sortable: true, tdClass: 'align-middle' },
      { key: 'confirmemail', label: 'Verificado', sortable: true, tdClass: 'align-middle' },
      { key: 'useractive', label: 'Estado', sortable: true, tdClass: 'align-middle' },
      { key: 'edit', label: 'Edit', tdClass: 'text-nowrap align-middle text-center' }
    ],

    // Filters
    filterVerified: 'Any',
    filterRole: 'Any',
    filterStatus: 'Any',
    filterLatestActivity: null,

    usersData: [],
    originalUsersData: [],

    currentPage: 1,

    serverCode:0
  }),

  computed: {
    totalItems () {
      return this.usersData.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  methods: {
    check_access(control, action){
    return infousers.check_access(control,action)
    },
    filter (value) {
      const val = value.toLowerCase()
      const filtered = this.originalUsersData.filter(d => {
        return Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      })
      this.usersData = filtered
    },

    deactivated(user){
      this.selectedUser=user

      this.dismissCountDown = this.dismissSecs
    },

    saveAction(){
      this.dismissCountDown=0
    },

    countDownChanged(dismissCountDown) {
      if(this.dismissCountDown -1 == dismissCountDown ){
        if(dismissCountDown == 0){
          infousers.deactivated(this.selectedUser).then(data =>{
            infousers.getnumber().then(datax =>{
                this.usersData = datax.data
            })
          })
        }
      }

      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    }
  },

  created () {
    infousers.getnumber().then(data =>{
      console.log(data)
      this.usersData = data.data
    })
  }
}
</script>

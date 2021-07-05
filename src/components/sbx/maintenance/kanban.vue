<template>
  <div>

    <h4 class="font-weight-bold py-3 mb-4">
      Tablero General Mantenimiento
    </h4>

    <div class="form-row">
      <div class="col-md">
        <b-card no-body class="mb-3">

          <b-card-header header-tag="h6" class="text-center">Solicitudes Activas</b-card-header>

          <!-- <draggable v-model="newTasks" v-bind="draggableOptions" class="kanban-box px-2 pt-2"> -->

            <div v-for="task in solicitudesActivas" :key="task.text" class="ui-bordered p-2 mb-2">
              <b-dropdown variant="default btn-xs rounded-pill icon-btn borderless md-btn-flat hide-arrow" class="kanban-board-actions float-right ml-2" :right="!isRTL">
                <template slot="button-content"><i class="ion ion-ios-more"></i></template>
                <b-dropdown-item @click.prevent="infoDetalleMant = task; mantConfig=true"  > <i class="fas fa-exclamation text-warning"></i> &nbsp; Gestionar</b-dropdown-item>
                <b-dd-divider></b-dd-divider>
                <b-dropdown-item  @click.prevent="openActionConfirm(task,'PV')" > <i class="ion ion-md-close text-danger"></i> &nbsp; Verificar</b-dropdown-item>
              </b-dropdown>
              <div>
                  <b>{{task.plan_id}} {{task.code}}</b>   <span :class="`badge-${tags[task.priority].color}`" class="badge ml-1">{{tags[task.priority].title}}</span>
              </div>
              {{task.description}}
              <!-- <span v-if="task.tags && task.tags.length"> -->
                <!-- <span :class="`badge-${tags[tag].color}`" class="badge ml-1">{{tags[tag].title}}</span> -->
              <!-- </span> -->
            </div>

          <!-- </draggable> -->
<!-- 
          <b-card-footer class="text-center py-2">
            <a href="javascript:void(0)"><i class="ion ion-md-add"></i>&nbsp; Addicionar Solicitud</a>
          </b-card-footer> -->
        </b-card>

      </div>
      <div class="col-md">
        <b-card no-body border-variant="warning" class="mb-3">
          <b-card-header header-tag="h6" header-text-variant="warning" class="text-center">OT Activas &#62; 80% </b-card-header>
          <!-- <draggable v-model="inProgressTasks" v-bind="draggableOptions" class="kanban-box px-2 pt-2"> -->
            <div v-for="task in otsActivas" :key="task.text" class="ui-bordered p-2 mb-2" v-show="task.percentage_use_pending<80">
                
                    <b-dropdown variant="default btn-xs rounded-pill icon-btn borderless md-btn-flat hide-arrow" class="kanban-board-actions float-right ml-2" :right="!isRTL">
                        <template slot="button-content"><i class="ion ion-ios-more"></i></template>
                        <b-dropdown-item @click.prevent="infoDetalleMant = task; mantConfig=true"  > <i class="fas fa-exclamation text-warning"></i> &nbsp; Gestionar</b-dropdown-item>
                        <b-dd-divider></b-dd-divider>
                        <b-dropdown-item  @click.prevent="openActionConfirm(task,'PV')" > <i class="ion ion-md-close text-danger"></i> &nbsp; Verificar</b-dropdown-item>
                    </b-dropdown>
                    <div>
                        <b>{{task.plan_id}} {{task.code}}</b>   <span :class="`badge-${tags[task.priority].color}`" class="badge ml-1">{{tags[task.priority].title}}</span>
                    </div>
                    {{task.description}}
                </div>
              <!-- <span v-if="task.tags && task.tags.length"> -->
                <!-- <span :class="`badge-${tags[tag].color}`" class="badge ml-1">{{tags[tag].title}}</span> -->
              <!-- </span> -->
            
          <!-- </draggable> -->
        </b-card>
      </div>

      <div class="col-md">
        <b-card no-body border-variant="danger" class="mb-3">
          <b-card-header header-tag="h6" header-text-variant="danger" class="text-center"> OT Activas &#60; 80%  </b-card-header>
          <!-- <draggable v-model="testTasks" v-bind="draggableOptions" class="kanban-box px-2 pt-2"> -->
                      <!-- <draggable v-model="inProgressTasks" v-bind="draggableOptions" class="kanban-box px-2 pt-2"> -->
            <div v-for="task in otsActivas" :key="task.text" class="ui-bordered p-2 mb-2" v-show="task.percentage_use_pending>=80">
                
                    <b-dropdown variant="default btn-xs rounded-pill icon-btn borderless md-btn-flat hide-arrow" class="kanban-board-actions float-right ml-2" :right="!isRTL">
                        <template slot="button-content"><i class="ion ion-ios-more"></i></template>
                        <b-dropdown-item @click.prevent="infoDetalleMant = task; mantConfig=true"  > <i class="fas fa-exclamation text-warning"></i> &nbsp; Gestionar</b-dropdown-item>
                        <b-dd-divider></b-dd-divider>
                        <b-dropdown-item  @click.prevent="openActionConfirm(task,'PV')" > <i class="ion ion-md-close text-danger"></i> &nbsp; Verificar</b-dropdown-item>
                    </b-dropdown>
                    <div>
                        <b>{{task.plan_id}} {{task.code}}</b>   <span :class="`badge-${tags[task.priority].color}`" class="badge ml-1">{{tags[task.priority].title}}</span>
                    </div>
                    {{task.description}}
              <!-- <span v-if="task.tags && task.tags.length"> -->
                <!-- <span :class="`badge-${tags[tag].color}`" class="badge ml-1">{{tags[tag].title}}</span> -->
              <!-- </span> -->
            </div>
          <!-- </draggable> -->
        </b-card>
      </div>

      
      <div class="col-md">
        <b-card no-body border-variant="success" class="mb-3">
          <b-card-header header-tag="h6" header-text-variant="success" class="text-center">Pendientes por Cerrar</b-card-header>
          <!-- <draggable v-model="inProgressTasks" v-bind="draggableOptions" class="kanban-box px-2 pt-2"> -->
            <div v-for="task in otsToClose" :key="task.text" class="ui-bordered p-2 mb-2" v-show="task.percentage_use_pending<80">
                
                    <b-dropdown variant="default btn-xs rounded-pill icon-btn borderless md-btn-flat hide-arrow" class="kanban-board-actions float-right ml-2" :right="!isRTL">
                        <template slot="button-content"><i class="ion ion-ios-more"></i></template>
                        <b-dropdown-item @click.prevent="infoDetalleMant = task; mantConfig=true"  > <i class="far fa-eye"></i> &nbsp; Cerrar OT </b-dropdown-item>
                    </b-dropdown>
                    <div>
                        <b>{{task.plan_id}} {{task.code}}</b>   <span :class="`badge-${tags[task.priority].color}`" class="badge ml-1">{{tags[task.priority].title}}</span>
                    </div>
                    {{task.description}}
                </div>
              <!-- <span v-if="task.tags && task.tags.length"> -->
                <!-- <span :class="`badge-${tags[tag].color}`" class="badge ml-1">{{tags[tag].title}}</span> -->
              <!-- </span> -->
            
          <!-- </draggable> -->
        </b-card>
      </div>
    </div>

                
        <b-modal v-model="actionConfirm" hide-footer centered title="Confirmación de Acción">
            <h3 :class="infoDetalleMant.new_state == 'AC'?'text-success text-center':'text-danger text-center'">{{infoDetalleMant.new_state == "AC" ? 'Liberar Orden de Trabajo' : 'Terminar la Solicitud' }}</h3>
            <h4 class="text-center">¿Desea Continuar?</h4>
            <b-form-group label-cols="12" label="" v-if="infoDetalleMant.new_state != 'AC'">
                <b-form-textarea
                    v-model="infoDetalleMant.comment"
                    id="textarea"
                    placeholder="Detalle..."
                    rows="3"
                    max-rows="6"></b-form-textarea>
            </b-form-group>
            <hr>
            <div class="text-right">
                
                <b-button size="md" variant="secondary" @click="actionConfirm = false">Cancelar</b-button>
                <b-button size="md" :variant="infoDetalleMant.new_state == 'AC'?'success':'danger'" :disabled="infoDetalleMant.new_state != 'AC' && (infoDetalleMant.comment == '' || this.infoDetalleMant.comment == null)" @click="updateState()">Confirmar</b-button>
            </div>
        </b-modal>

    <b-modal hide-footer v-model="mantConfig" size="xl">
        <template v-slot:modal-title>
            Gestionar Solicitudes
        </template>
        <maintenance-definition :assets_id="this.infoDetalleMant.assets_id" :infoDetalle="infoDetalleMant"></maintenance-definition>
    </b-modal>

  </div>
</template>

<script>
import draggable from 'vuedraggable/src/vuedraggable'
import { infomainten } from '@/components/i40/js/maintenance'


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
  name: 'pages-kanban-board',
  metaInfo: {
    title: 'Información'
  },
  components: {
    draggable,
    'maintenance-definition': () => import('./maintenance_definition.vue')
    },
  data: () => ({
    mantConfig:false,
    actionConfirm:false,
    infoDetalleMant:{comment:'',new_state:''},
    // Tags
    tags: {
      alta: { title: 'Alta', color: 'danger' },
      media: { title: 'Media', color: 'warning' },
      baja: { title: 'Baja', color: 'info' },
      other: { title: 'Otra', color: 'secondary' }
    },

    newTasks: [
      { text: 'New blog layout' },
      { text: 'Create UI design model', tags: ['clients'] },
      { text: 'Another icon set' },
      { text: 'iOS application design mockups' }
    ],

    inProgressTasks: [
      { text: 'New icons set for an iOS app', tags: ['other'] },
      { text: 'Create ad campaign banners set' }
    ],

    testTasks: [
      { text: 'Help Web devs with HTML integration' },
      { text: 'UI/UX design review', tags: ['important'] },
      { text: 'Marketing campaign review' },
      { text: 'Fix website issues on mobile' },
      { text: 'Create landing page for a new app', tags: ['social'] }
    ],

    doneTasks: [
      { text: 'Edit the draft for the icons', tags: ['important'] },
      { text: 'Create sketch for the "FAQ" page' }
    ],

    draggableOptions: {
      animation: 150,
      group: {
        name: 'kanban-board',
        put: true,
        pull: true
      }
    },
    solicitudesActivas:[],
    otsActivas:[],
    otsToClose:[],
  }),

  methods: {
    openActionConfirm(item, state){
        this.infoDetalleMant = item; 
        this.infoDetalleMant.new_state =state
        // this.infoDetalleMant.comment = null
        this.actionConfirm=true
    },

    updateState(){
        infomainten.plan(this.infoDetalleMant, 'plan', 'update-state').then(data =>{
            this.loadSolicitudesActivas()
            this.loadOTs()
            this.loadToClose()
        })
    },

    loadSolicitudesActivas(){
        infomainten.plan("AC",'plan-request','select-state').then(data =>{
            this.solicitudesActivas = []
            if(data.data != ""){
                this.solicitudesActivas = data.data
            }
        })
    },

    loadOTs(){
        infomainten.plan(0, 'plan','select-actives').then(data => {
            this.otsActivas = []
            if(data.data != ""){
                this.otsActivas = data.data
            }
        })
    },


    loadToClose(){
        infomainten.plan(0, 'plan','select-to-close').then(data => {
            this.otsToClose = []
            if(data.data != ""){
                this.otsToClose = data.data
            }
        })
    },

    accessControl(state, cual){
            if(state=="CR"){
                if(cual == 'edit' || cual == "cancelar" || cual == "iniciar"){
                    return true
                }else{
                    return false
                }
            }else if(state=="CN" || state=="NA"){
                return false
            }else if(state=="CN"){
                if(cual == 'iniciar'){
                    return true
                }else{
                    return false
                }
            }
        },

        editOrden(item){
            this.mantConfig=true; 
            this.infoMantenimiento = item; 

            for (let index = 0; index < this.tableAssets.length; index++) {
                const element = this.tableAssets[index];
                if(element.assets_id == item.assets_id){
                    this.objinfo = element
                }
            }
        },
  },

  created() {
      this.loadSolicitudesActivas()
      this.loadOTs()
  },
}
</script>

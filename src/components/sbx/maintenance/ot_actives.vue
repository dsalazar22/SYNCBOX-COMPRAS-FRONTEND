<template>
    <div> 
            <h4 class="font-weight-bold py-3 mb-4">Ordenes de Trabajo Activas</h4>
    <div class="w-100 text-right"></div>

        <b-table small show-empty stacked="md" :fields="mantenimientoColumns" :items="mantenimientoTableData" class="mt-3">
            <template v-slot:cell(description)="row">
                {{row.item.description}}  &nbsp; &nbsp; <b-badge :variant="getInfoState(row.item.state, 'color')">{{getInfoState(row.item.state,'text')}}</b-badge> 
            </template>
            <template v-slot:cell(priority)="row">
                <b-badge :variant="getInfoState(row.item.priority, 'priority')">{{row.item.priority}}</b-badge> 
            </template>
            <template v-slot:cell(edit)="row">
                <div class="text-left">
                    <b-dd variant="default" text="Acciones" :right="isRTL" size="xs">
                        <b-dd-item @click.prevent="infoDetalleMant = row.item; mantConfig=true"  > <i class="fas fa-exclamation text-warning"></i> &nbsp; Gestionar</b-dd-item>
                        <b-dd-divider></b-dd-divider>
                        <b-dd-item  @click.prevent="openActionConfirm(row.item,'CE')" > <i class="ion ion-md-close text-danger"></i> &nbsp; Cerrar</b-dd-item>
                    </b-dd>
                    <!-- <b-btn variant="outline-success borderless icon-btn"  target="_blank"><i class="ion ion-md-create"></i></b-btn>
                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="delete_option_mp = 'grid'; loadInfoToDelete(row.item)"><i class="fas fa-exclamation"></i></b-btn> -->
                </div>
            </template>
        </b-table>

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
                Gestionar OT
            </template>
            <maintenance-definition :assets_id="this.infoDetalleMant.assets_id" :infoDetalle="infoDetalleMant"></maintenance-definition>
        </b-modal>
    </div>
</template>

<script>
import { config,master } from "@/components/i40/js/globals";
import { infomainten } from '@/components/i40/js/maintenance'


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
    components:{
        'maintenance-definition': () => import('./maintenance_definition.vue')
    },
    metaInfo: {
        title:"OT Activas",
    },
    data() {
        return {
            actionConfirm:false,
            mantConfig:false,
            infoDetalleMant:{comment:null},
            mantenimientoTableData:[],
            mantenimientoColumns:[
                {key:'plan_id', label:"OT"},
                {key:'code', label:"Codigo"},
                {key:'description', label:"Descripción"},
                {key:'chart_created', label:"Fecha de Creacion"},
                {key:'date_last_state_change', label:"Ultimo Estado"},
                {key:'username', label:"Usuario"},
                {key:'maintenance_type', label:"Tipo"},
                {key:'priority', label:"Prioridad"},
                {key:'percentage_use_pending', label:"% de Uso"},
                
                {key:'edit', label:"Editar"},],
        }
    },
    methods: {
        getInfoState(state, cual){           
            if(cual=="color"){
                return infomainten.getColorState(state)
            }else if (cual=="text"){
                return infomainten.getTextState(state)
            }else if(cual == "priority"){
                return infomainten.getPriority(state)
            }
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
        openActionConfirm(item, state){
            this.infoDetalleMant = item; 
            this.infoDetalleMant.new_state =state
            // this.infoDetalleMant.comment = null
            this.actionConfirm=true
        },

        updateState(){
            infomainten.plan(this.infoDetalleMant, 'plan', 'update-state').then(data =>{
                this.loadInfo()
            })
        },

        loadInfo(){
            infomainten.plan(0, 'plan','select-actives').then(data => {
                this.mantenimientoTableData = []
                if(data.data != ""){
                    this.mantenimientoTableData = data.data
                }
            })
        }
    },
    created() {
        this.loadInfo()
    },
}
</script>
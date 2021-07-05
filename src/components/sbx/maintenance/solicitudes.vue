<template>
    <div>

                <!-- <notifications group="notifications-default" /> -->
        <h4 class="font-weight-bold py-3 mb-4">Control de Solicitudes</h4>
        <div class="w-100 text-right"></div>

        <div class="text-right">     
            <label class="switcher switcher-success">
                        <input type="checkbox" class="switcher-input" @change="changeRequestsState(active_requests)" v-model="active_requests">
                        <span class="switcher-indicator">
                        <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                        <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                        </span>
                        <span class="switcher-label">Ver Solicitudes Activas</span>
                    </label>

                    
                        <b-btn variant="outline-success borderless" class="btn-sm" @click.prevent="newRequest()">
                            <span class="ion ion-md-add"></span>&nbsp;&nbsp;Adicionar Nueva Solicitud
                        </b-btn>
        </div>

        <b-modal hide-footer v-model="mantConfig" size="xl">
            <template v-slot:modal-title>
                Creación de Solicitud
            </template>
            <b-form-group label="Seleccione un Activo">
                <multiselect
                    v-model="objinfo"
                    :options="tableAssets"
                    
                    placeholder="Seleccione un Activo"
                    label="code"
                    track-by="code" />
            </b-form-group>

            <b-form-group label-cols-sm="12" label-cols-md="5" label-cols-lg="3" label="Definición Corta" label-for="input-default">
                    <b-form-input id="input-default" v-model="infoMantenimiento.description"></b-form-input>
                    </b-form-group>
                <b-form-group label-cols-sm="12" label-cols-md="5" label-cols-lg="3" label="Prioridad" label-for="input-default">
                <b-select v-model="infoMantenimiento.priority" >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                </b-select>
            </b-form-group>

            <b-form-group label-cols="12" label="Descripción">
                <b-form-textarea
                id="textarea"
                v-model="infoMantenimiento.problem_definition"
                placeholder="Descripción..."
                rows="3"
                max-rows="6"
                ></b-form-textarea>
            </b-form-group>
                <div class="text-right">
                    <b-button size="md" variant="success" @click="savePlan()">Guardar</b-button>
                </div>
        </b-modal>


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
                        <b-dd-item @click.prevent="editOrden(row.item)" v-if="accessControl(row.item.state, 'edit')"> <i class="ion ion-md-create text-success"></i> &nbsp; Editar</b-dd-item>
                        <b-dd-item @click.prevent="openActionConfirm(row.item,'AC')" v-if="row.item.state == 'PV'"> <i class="ion ion-md-create text-success"></i> &nbsp; Reabrir Solicitud</b-dd-item>
                        <b-dd-divider></b-dd-divider>
                        <b-dd-item  @click.prevent="openActionConfirm(row.item,'CN')"  v-if="accessControl(row.item.state, 'edit')"> <i class="ion ion-md-close text-danger"></i> &nbsp; Cancelar</b-dd-item>
                        <b-dd-item  @click.prevent="openActionConfirm(row.item,'CE')"  v-if="row.item.state == 'PV'"> <i class="ion ion-md-checkmark text-danger"></i> &nbsp; Terminar Solicitud</b-dd-item>
                    </b-dd>
                    <!-- <b-btn variant="outline-success borderless icon-btn"  target="_blank"><i class="ion ion-md-create"></i></b-btn>
                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="delete_option_mp = 'grid'; loadInfoToDelete(row.item)"><i class="fas fa-exclamation"></i></b-btn> -->
                </div>
            </template>
        </b-table>

        <b-modal v-model="actionConfirm" hide-footer centered title="Confirmación de Acción">
            <h3 :class="infoDetalleMant.new_state == 'AC'?'text-success text-center':'text-danger text-center'">{{infoDetalleMant.new_state == "AC" ? 'Liberar Orden de Trabajo' : 'Terminar la Solicitud' }}</h3>
            <h4 class="text-center">¿Desea Continuar?</h4>
            <b-form-group label-cols="12" label="">
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
                <b-button size="md" :variant="infoDetalleMant.new_state == 'AC'?'success':'danger'" :disabled="infoDetalleMant.new_state != 'AC' && (infoDetalleMant.comment == '' || this.infoDetalleMant.comment == null)" @click="updateState(); actionConfirm=false">Confirmar</b-button>
            </div>
        </b-modal>



    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>

import Multiselect from 'vue-multiselect'
import { config,master } from "@/components/i40/js/globals";
import { infomainten } from '@/components/i40/js/maintenance'


function isRTL () {
  return document.documentElement.getAttribute('dir') === 'rtl' ||
         document.body.getAttribute('dir') === 'rtl'
}

export default {
    components: {
       Multiselect,
    },
    metaInfo: {
        title:"Control de Solicitudes",
    },
    data() {
        return {
            tableAssets:[],
            objinfo:{},
            infoMantenimiento:{plan_id : 0,assets_id:null, description:null,priority:null,problem_definition:null},
            mantConfig:false,
            infoDetalleMant:{comment:null},
            actionConfirm:false,

            active_requests:true,

            mantenimientoTableData:[],
            mantenimientoColumns:[
                    {key:'plan_id', label:"OT"},
                    {key:'code', label:"Activo"},
                    {key:'description', label:"Descripción"},
                    {key:'chart_created', label:"Fecha de Creacion"},
                    {key:'date_last_state_change', label:"Ultimo Estado"},
                    {key:'username', label:"Usuario"},
                    {key:'maintenance_type', label:"Tipo"},
                    {key:'priority', label:"Prioridad"},
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

        updateState(){
            infomainten.plan(this.infoDetalleMant, 'plan', 'update-state').then(data =>{
                this.loadInfo()
            })
        },

        openActionConfirm(item, state){
            this.infoDetalleMant = item; 
            this.infoDetalleMant.new_state =state
            // this.infoDetalleMant.comment = ''
            this.actionConfirm=true
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

        newRequest(){
            
            this.infoMantenimiento={plan_id : 0,assets_id:null, description:null,priority:null,problem_definition:null, hours_duration:0, comment:''}
            this.objinfo={}
            this.mantConfig = true
        },

        savePlan(){
            // {{this.infoMantenimiento}}
            this.infoMantenimiento.assets_id = this.objinfo.assets_id
            this.infoMantenimiento.state = 'CR'
            this.infoMantenimiento.maintenance_type = 'solicitud'
            infomainten.plan(this.infoMantenimiento,'plan-request',this.infoMantenimiento.plan_id == 0 ? 'insert': 'update').then(data =>{
                // console.log(data)
                // ifdata.data
                this.loadInfo()
            })
        },

        changeRequestsState(item){
            this.loadInfo()
        },

        loadInfo(){
            infomainten.plan([],'plan-request',this.active_requests?'select-active':'select-deactive').then(data =>{
                this.mantenimientoTableData = []
                if(data.data != "")
                    this.mantenimientoTableData = data.data
            })
        }
    },
    created() {
        this.loadInfo()

        infomainten.assets([],"select").then(data => {
            if(data.data != ""){
                this.tableAssets = data.data
            }else{
                this.tableAssets = []
            }
        })
    },


}
</script>
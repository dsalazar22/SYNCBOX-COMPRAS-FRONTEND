<template>
    <div>
        <h4 class="font-weight-bold py-3 mb-4">Registro de Información Manual</h4>
        <div class="w-100 text-right"></div>

        <div class="text-right">     

            <b-btn variant="outline-success borderless" class="btn-sm" @click.prevent="newRegister()">
                <span class="ion ion-md-add"></span>&nbsp;&nbsp;Adicionar Nuevo Registro
            </b-btn>
        </div>

         <b-table small show-empty stacked="md" :items="dataDuration" :fields="columnsDuration" class="mt-2">
             <template v-slot:cell(percentage_use_pending)="row">
                <div class="text-left">
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="row.toggleDetails"><i class="fas fa-info"></i></b-btn>
                    <span>
                        {{row.item.percentage_use_pending}}
                    </span>
                </div>
            </template>

            <template v-slot:row-details="row">
                <b-table small show-empty stacked="md" :items="row.item.details" :fields="[{key:'duration', label:'Unidade de Medida'},{key:'max_value', label:'Valor Maximo'},{key:'current_value', label:'Valor Actual'},{key:'pending_use', label:'Uso Pendiente'},{key:'percentage_use_pending', label:'% de Uso'}]" class="mt-2">
                </b-table>
                
            </template>
         </b-table>


           <b-modal hide-footer v-model="mantConfig" size="xl">
            <template v-slot:modal-title>
                Registro de Tiempos / Variables de Consumo
            </template>
            <b-form-group label="Seleccione un Activo">
                <multiselect
                    v-model="objinfo"
                    :options="tableAssets"
                    
                    placeholder="Seleccione un Activo"
                    label="code"
                    track-by="code" />
            </b-form-group>

            <b-form-group label-cols-sm="12" label-cols-md="5" label-cols-lg="3" label="Codigo Duracion" label-for="input-default">
                <b-select v-model="code_duration" >
                    <option value="hours_operations">Horas de Operación</option>
                    <option value="max_days">Número de Días</option>
                    <option value="cycles">Ciclos</option>
                    <option value="km">Kilometros</option>
                </b-select>
            </b-form-group>

            
            <b-form-group label-cols-sm="12" label-cols-md="5" label-cols-lg="3" label="Valor" label-for="input-default">
                    <b-form-input type="number" id="input-default" v-model="value"></b-form-input>
                    </b-form-group>
                <div class="text-right">
                    <b-button size="md" variant="success" @click="saveInfo()">Guardar</b-button>
                </div>
        </b-modal>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>

import Multiselect from 'vue-multiselect'
import { config,master } from "@/components/i40/js/globals";
import { infomainten } from '@/components/i40/js/maintenance'

export default {
    components: {
       Multiselect,
    },
    metaInfo: {
        title:"Registro de Información Manual",
    },
    data() {
        return {
            mantConfig:false,
            objinfo:{},
            tableAssets:[],
            dataDuration:[],
            columnsDuration:[ {key:'assets_code', label:"Activo"},
                    {key:'code', label:"Codigo de la Parte"},
                    {key:'description', label:"Descripción"},
                    {key:'price_list', label:"Precio de Lista"},
                    {key:'percentage_use_pending', label:"% de Uso"},],

            code_duration:null,
            value:null

        }
    },

    methods: {
        newRegister(){
            this.mantConfig = true
            this.code_duration=null
            this.value=null
        },
        saveInfo(){
            infomainten.registroDatos(this.value==null?"[]":this.value, "update", this.code_duration==null?'a':this.code_duration,this.objinfo.assets_id==undefined?'a':this.objinfo.assets_id).then(data => {
                this.loadInfo()
            })
        },

        loadInfo(){
            infomainten.registroDatos(this.value==null?"[]":this.value, "select", this.code_duration==null?'a':this.code_duration,this.objinfo.assets_id==undefined?'a':this.objinfo.assets_id).then(data => {
            if(data.data != ""){
                this.dataDuration = data.data
            }else{
                this.dataDuration = []
            }
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
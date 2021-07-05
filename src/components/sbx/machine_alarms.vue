<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">Alarmas Centro de Trabajo</h4>
   
   <div class="row ml-0">
        <div class="col-xl-4">
            <b-card header="Producto" header-tag="h6" class="mb-4">
                <fieldset class="demo-vertical-spacing-sm">
                    <b-form-group>
                        <b-input placeholder="Código" />
                    </b-form-group>
                    <b-form-group>
                        <b-input placeholder="Descripción" />
                    </b-form-group>
                    <b-form-group>
                        <b-input placeholder="Frecuencia" />
                    </b-form-group>
                    <b-form-group>
                        <b-select v-model="selected" :options="optionsTime" class="flex-grow-1" />
                    </b-form-group>
                    <b-form-group>
                        <b-input placeholder="Dirección de Memoria" />
                    </b-form-group>
                    <b-form-group>
                        <b-select v-model="selected" :options="optionsDataType" class="flex-grow-1" />
                    </b-form-group>
                    <b-btn variant="primary">Guardar</b-btn>
                </fieldset>
            </b-card>
        </div>
        <div class="col-xl-8">
            <b-table small :data="tableData" :fields="columns" >
                <template v-slot:cell(edit)="row">
                    <div>
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="edit(row.item)"><i class="ion ion-md-create"></i></b-btn>
                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="remove(row.item)"><i class="ion ion-md-close"></i></b-btn>
                    </div>
                </template>
                <!-- <template slot="child_row" slot-scopropspe="">
                    <div><b>First name:</b> {{props.row.first_name}}</div>
                    <div><b>Last name:</b> {{props.row.last_name}}</div>
                </template> -->
            </b-table>
            
        </div>
   </div>
  </div>
</template>

<style src="@/vendor/libs/vue-data-tables/vue-data-tables.scss" lang="scss"></style>

<script>
import Vue from 'vue'
import {ClientTable} from 'vue-tables-2'

Vue.use(ClientTable)

export default {

  metaInfo: {
    title: 'Alarmas Centros de Trabajo'
  },
   data: () => ({
    name: 'machine_alarms',
    version: 'v1.0.0.0',

    tableData: [],
    columns: [{key:'code', label:"Código"},
    {key:'description', label:"Descripción"},
    {key:'frecuency', label:"Frecuencia"},
    {key:'memory_address', label:"Área Memoria"}],
   optionsDataType: [
      { text: 'INT', value: '1' },
      { text: 'DINT', value: '2' },
      { text: 'REAL', value: '3' }
    //   { text: 'Grape', value: 'grape', disabled: true }
    ],
    optionsTime: [
      { text: 'Segundos', value: '1' },
      { text: 'Minutos', value: '2' },
      { text: 'Horas', value: '3' }
    //   { text: 'Grape', value: 'grape', disabled: true }
    ],
  }),
}
</script>

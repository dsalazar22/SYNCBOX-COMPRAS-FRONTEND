<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">Configurar Formularios</h4>
   
   <div class="row ml-0">
        <!-- <div class="col-xl-4">
            <b-card header="Producto" header-tag="h6" class="mb-4">
                <fieldset class="demo-vertical-spacing-sm">
                    <b-form-group>
                    <b-input placeholder="Codigo" />
                    </b-form-group>
                    <b-form-group>
                    <b-input placeholder="Descripcion" />
                    </b-form-group>
                    <b-form-group>
                    <b-input placeholder="Unidades por Ciclo" />
                    </b-form-group>
                    <b-form-group>
                    <b-input placeholder="Tiempo de Ciclo" />
                    </b-form-group>
                    <b-btn variant="primary">Guardar</b-btn>
                </fieldset>
            </b-card>
        </div>
        <div class="col-xl-8"> -->
            <b-table small :data="tableData" :fields="columns" >
                <template v-slot:cell(edit)="row">
                    <div>
                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="edit(row.item)"><i class="ion ion-md-create"></i></b-btn>
                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="remove(row.item)"><i class="ion ion-md-close"></i></b-btn>
                    </div>
                </template>
                
            </b-table>
        <!-- </div> -->
        
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
    title: 'Configurar Formularios'
  },
   data: () => ({
    name: 'ConfigForms',
    version: 'v1.0.0.0',

    tableData: [],
    columns: [{key:'code', label:"Código"},
    {key:'description', label:"Descripción"},
    // {key:'cycletime', label:"Tiempo Ciclo"},
    // {key:'unitypercycle', label:"Unidades por Ciclo"}
    ],
   
  }),
}
</script>

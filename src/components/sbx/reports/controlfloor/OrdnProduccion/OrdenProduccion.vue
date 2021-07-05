<template>

    <div>
        <div class="h3">
               Detalle Orden de Producción
                <!-- <small>Analisis Orden de Producción</small> -->
        </div>

<h4>{{producto}}</h4>
<h4>{{codigo}}</h4>
 <!-- <v-client-table :data="tableData" :columns="columns" :options="options" class="mt-4"> -->
   <b-table striped hover :items="tableData" :fields="columns">
  
        <template v-slot:cell(centrotrabajo)="row">
          <div style="font-weight:bold; text-align: right">
             <b-btn variant="outline-info borderless" class="btn-sm" @click.prevent="details_product(row.item);">
                                        <!-- <span class="fas fa-project-diagram"></span>&nbsp;  -->
                                        {{row.item.centrotrabajo}}
             </b-btn>
        </div>
        </template>

        
        <template v-slot:cell(oee)="row">
          <div style="font-weight:bold; text-align: right" :style="{ color: color(row.item.oee) }">
              {{row.item.oee}}
          </div>
        </template>

        <template v-slot:cell(disponibilidad)="row">
          <div style="font-weight:bold; text-align: right" :style="{ color: color(row.item.disponibilidad) }">
              {{row.item.disponibilidad}}
          </div>
        </template>

        <template v-slot:cell(eficiencia)="row">
          <div style="font-weight:bold; text-align: right" :style="{ color: color(row.item.eficiencia) }">
              {{row.item.eficiencia}}
          </div>
        </template>

        <template v-slot:cell(calidad)="row">
          <div style="font-weight:bold; text-align: right" :style="{ color: color(row.item.calidad) }">
              {{row.item.calidad}}
          </div>
        </template>

        <template v-slot:cell(tiempobase)="row">
          <div style="font-weight:bold; text-align: right">
              {{row.item.tiempobase}}
          </div>
        </template>

        <template v-slot:cell(tiemporeal)="row">
          <div style="font-weight:bold; text-align: right" :style="{ color: colorTiempoReal(row.item.tiempobase,row.item.tiemporeal) }">
              {{row.item.tiemporeal}}
          </div> 
        </template>

      <!-- <template slot="edit" slot-scope="props"> -->
        <!-- <div>
          <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="edit(props.row)"><i class="ion ion-md-create"></i></b-btn>
          <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="remove(props.row)"><i class="ion ion-md-close"></i></b-btn>
        </div> -->
      <!-- </template> -->
      <!-- <template slot="child_row" slot-scope="props">
          <div><b>First name:</b> {{props.row.descproceso}}</div> -->
        <!-- <div><b>First name:</b> {{props.row.first_name}}</div>
        <div><b>Last name:</b> {{props.row.last_name}}</div> -->
      <!-- </template> -->
    </b-table >


      <div class="row">
        <div class="col-xl-3 col-lg-5 mt-3">
            <div class="card b">
                <div class="card-header">
                    <h4 class="m-0">Totales Generales</h4>
                </div>
                <div :height="330">
                    <div class="list-group" v-for="item in datosTotalizados">
                        <div class="list-group-item list-group-item-action" >
                            <div class="media">
                                <div class="media-body text-truncate">
                                    <p class="mb-1">
                                        <strong class="text-primary">
                                            <span>{{item.nombre}}</span>
                                        </strong>
                                    </p>
                                </div>
                                <div class="ml-auto">
                                    {{item.total}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-9 col-lg-7 mt-3">
            <h2>{{centroTrabajo}}</h2>
             <b-table striped hover :items="tableDatadetail" :fields="columns_details">
            <!-- <v-client-table :data="tableDatadetail" :columns="columns_details" :options="options" class="mt-4"> -->
                <template v-slot:cell(tiempobase)="row">
                  <div  style="font-weight:bold; text-align: right">
                      {{row.item.tiempobase}}
                  </div>
                </template>

                <template v-slot:cell(tiemporeal)="row" >
                  <div style="font-weight:bold; text-align: right" :style="{ color: colorTiempoReal(row.item.tiempobase,row.item.tiemporeal) }">
                      {{row.item.tiemporeal}}
                  </div>
                </template>

              <!-- <template slot="edit" slot-scope="props">
              </template> -->
             </b-table>
        </div>
        </div>
    </div>
</template>
<script>
// import Scrollable from "@/components/Common/Scrollable";
import VueResource from "vue-resource"
import {reports} from "@/components/i40/js/globals"
import ObtenerColorOEE from "@/components/i40/js/floor/colorsOEE.js"

import Vue from 'vue'
import {ClientTable} from 'vue-tables-2'
 

// import Scrollable from "@/components/Common/Scrollable";

Vue.use(ClientTable)
Vue.use(VueResource)

export default {
  components: {
        // Scrollable,
        ObtenerColorOEE
  },
  data () {
    return {
      producto:"",
      codigo:"",
      datosTotalizados:[],
      centroTrabajo:"",
      tableDatadetail:[],
      columns_details: ['fechainicio','fechafin', 'totalproducido', 'unddefectuosas','tiempototaltrabajo','microparos'],

       tableData: [],
        columns: [
          {key:'idorden',label:'ID Orden'},
          {key:'centrotrabajo',label:'Centro Trabajo'},
          {key:'activity_description',label:'Actividad'},
          {key:'unidaesesperadas',label:'Und Esperadas'},
          {key:'totalproducido',label:'Total Prod'},
          {key:'unidadesdefectuosas',label:'Und Defect'},
          {key:'unidadestotales',label:'Und Totales'},
          // {key:'cajas',label:'Cajas'},
          // {key:'mpunidadesproducidas',label:'MP Prod (L)'},
          // {key:'mpunidadesdefectuosas',label:'MP Defec (L)'},
          {key:'tiempototaltrabajo',label:'Tiempo Total Trabajo'},
          {key:'microparos',label:'Microparos'},
          {key:'tiemporealtrabajado',label:'Tiempo Real Trabajado'},
          {key:'tiempoparo',label:'Tiempo Paro'},
          {key:'tiempobase',label:'Tiempo Base'},
          {key:'tiemporeal',label:'Tiempo Real'},
          {key:'disponibilidad',label:'Disponibilidad'},
          {key:'eficiencia',label:'Eficiencia'},
          {key:'calidad',label:'Calidad'},
          {key:'oee', label:'OEE'}
        ],
        options: {
            pagination: { chunk: 5 },
            filterable: [],
            sortIcon: {
                // is: 'fa-sort',
                // base: 'fas',
                 up: 'fa-sort-up',
                 down: 'fa-sort-down'
            }
        },
    }
  },
  methods: {
        color:function(valor){
            return ObtenerColorOEE(valor)
        },
        colorTiempoReal:function(valorideal, valorreal){
            return ObtenerColorOEE((valorideal/valorreal)*100)
        },
        details_product(item){
          this.centroTrabajo=item.centrotrabajo
          
            this.$http.get(reports+'/obtenerDetalleOrdenProduccionCentroTrabajo/'+item.idorden+'/'+item.centrotrabajo)
            .then(resultado =>{
                this.tableDatadetail =  resultado.body
            })
        }
  },
  created () {
    this.$http.get(reports+'/obtenerInfoOrdenProduccion/'+this.$route.params.id)
                .then(respuesta =>{
                    return respuesta.json()
                })
                
                .then(resultado =>{
                    this.datosTotalizados = resultado[0].indicadores
                    this.producto = resultado[0].infoproducto[0].valor
                    this.codigo = resultado[0].infoproducto[1].valor

                    this.tableData = resultado[0].detallecentrotrabajo
                })
  }
}
</script>
<style lang="scss">
$background_color: #404142;
$github_color: #DBA226;
$facebook_color: #3880FF;
.box {
  background: white;
  overflow: hidden;
  width: 656px;
  height: 400px;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0 0 40px black;
  color: #8b8c8d;
  font-size: 0;
  .box-part {
    display: inline-block;
    position: relative;
    vertical-align: top;
    box-sizing: border-box;
    height: 100%;
    width: 50%;
    &#bp-right {
      background: url("/static/panorama.jpg") no-repeat top left;
      border-left: 1px solid #eee;
    }
  }
  .box-messages {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .box-error-message {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    height: 0;
    line-height: 32px;
    padding: 0 12px;
    text-align: center;
    width: 100%;
    font-size: 11px;
    color: white;
    background: #F38181;
  }
  .partition {
    width: 100%;
    height: 100%;
    .partition-title {
      box-sizing: border-box;
      padding: 30px;
      width: 100%;
      text-align: center;
      letter-spacing: 1px;
      font-size: 20px;
      font-weight: 300;
    }
    .partition-form {
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
  input[type=password],
  input[type=text] {
    display: block;
    box-sizing: border-box;
    margin-bottom: 4px;
    width: 100%;
    font-size: 12px;
    line-height: 2;
    border: 0;
    border-bottom: 1px solid #DDDEDF;
    padding: 4px 8px;
    font-family: inherit;
    transition: 0.5s all;
    outline: none;
  }
  button {
    background: white;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 10px;
    letter-spacing: 1px;
    font-family: "Open Sans", sans-serif;
    font-weight: 400;
    min-width: 140px;
    margin-top: 8px;
    color: #8b8c8d;
    cursor: pointer;
    border: 1px solid #DDDEDF;
    text-transform: uppercase;
    transition: 0.1s all;
    font-size: 10px;
    outline: none;
    &:hover {
      border-color: mix(#DDDEDF, black, 90%);
      color: mix(#8b8c8d, black, 80%);
    }
  }
  .large-btn {
    width: 100%;
    background: white;
    span {
      font-weight: 600;
    }
    &:hover {
      color: white !important;
    }
  }
  .button-set {
    margin-bottom: 8px;
  }
  #register-btn,
  #signin-btn {
    margin-left: 8px;
  }
  .facebook-btn {
    border-color: $facebook_color;
    color: $facebook_color;
    &:hover {
      border-color: $facebook_color;
      background: $facebook_color;
    }
  }
  .github-btn {
    border-color: $github_color;
    color: $github_color;
    &:hover {
      border-color: $github_color;
      background: $github_color;
    }
  }
  .autocomplete-fix {
    position: absolute;
    visibility: hidden;
    overflow: hidden;
    opacity: 0;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
  }
}
.pop-out-enter-active,
.pop-out-leave-active {
  transition: all 0.5s;
}
.pop-out-enter,
.pop-out-leave-active {
  opacity: 0;
  transform: translateY(24px);
}
</style>
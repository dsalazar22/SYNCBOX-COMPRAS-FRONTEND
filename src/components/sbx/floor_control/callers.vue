<template>
  <div>
    <notifications group="notifications-default" />
    <h4 class="font-weight-bold py-3 mb-4">Configuración de Llamados</h4>

    <!-- <p>This page is an example of basic layout. For more options use <strong>Vue starter template generator</strong> in the docs.</p> -->
    <!-- <p><button class="btn btn-primary btn-lg">Button</button></p> -->
    <div class="w-100 text-right"></div>
    <div class="row">
      <div class="col">
        <b-row>
          <b-col md="6" class="my-1">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="Buscar..." />
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''">
                  <span class="oi oi-delete"></span>
                </b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col md="4" class="my-1">
            <b-form-select :options="pageOptions" v-model="perPage" />
          </b-col>
          <b-col md="2" class="my-1">
            <b-btn
              variant="outline-success icon-btn"
              class="btn-md"
              v-if="check_access('floor_root', 'c')"
              v-b-modal.modals-default
              @click.prevent="newstopcode"
            >
              <i class="ion ion-md-add"></i>
            </b-btn>
            <b-btn
              variant="outline-info icon-btn"
              class="btn-md"
              v-b-modal.modals-default
              @click.prevent="openHelp"
            >
              <i class="fas fa-chalkboard-teacher"></i>
            </b-btn>
          </b-col>
        </b-row>
        <b-table
          small
          show-empty
          stacked="md"
          :items="tableData"
          :fields="columns"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          @filtered="onFiltered"
        >
          <template v-slot:cell(edit)="row">
            <div class="text-left">
              <b-btn
                variant="outline-success borderless icon-btn"
                v-if="check_access('floor_root', 'c')"
                class="btn-xs"
                @click.prevent="edit(row.item)"
              >
                <i class="ion ion-md-create"></i>
              </b-btn>
              <b-btn
                variant="outline-danger borderless icon-btn"
                class="btn-xs"
                @click.prevent="remove(row.item)"
              >
                <i class="ion ion-md-close"></i>
              </b-btn>
            </div>
          </template>
        </b-table>
        <div class="d-flex justify-content-between">
          <div>
            <b-pagination
              :total-rows="totalRows"
              :per-page="perPage"
              v-model="currentPage"
              class="my-0"
            />
          </div>
          <div class="text-muted">
            <small>Total Código de Paro: {{this.totalRows}}</small>
          </div>
        </div>
      </div>
    </div>
    <div class="d-inline-block">
      <sweet-modal icon="error" title="Borrar Registro" ref="errorWithButtonAlert">
        ¿Está seguro que desea borrar el registro?
        <div class="w-100 text-center">
          El registro será borrado de forma lógica, su información será visible en reportes.
          Pero para dejar disponible este consecutivo el sistema conservará el código original y se modificará al final
          parte de su código. Lo que significaría una estructura similar a:
          <span
            class="font-italic font-weight-bold"
          >{{deleteCode}}-DEL-{{Math.round((new Date()).getTime() / 1000)}}</span>
        </div>
        <div class="w-100 text-center font-weight-bold">
          {{deleteCode}}
          <div class="w-100"></div>
          {{deleteDescripcion}}
        </div>
        <template slot="button">
          <b-btn
            v-if="check_access('floor_root', 'd')"
            @click="deleteregistro()"
            variant="danger"
            class="mr-2"
          >Eliminar</b-btn>
        </template>
        <template slot="button">
          <b-btn @click="closeErrorAlarm()" variant="primary">Cerrar</b-btn>
        </template>
      </sweet-modal>
    </div>

    <b-modal id="modals-center" v-model="show" class="modal-center" size="md">
      <div slot="modal-title">
        Administrar
        <span class="font-weight-light">Configuración de Llamados</span>
        <br />
        <!-- <small :class="infostatus">{{subtitle}}</small> -->
      </div>
      <fieldset class="demo-vertical-spacing-sm">
        <b-form-group :feedback="objState.message" label="Código">
          <b-input
            placeholder="Código"
            v-model.trim="detailRow.code"
            :state="objState.code"
            v-on:input="objState.code = 'valid'; objState.code= detailRow.code==''?'invalid':'valid'"
          />
        </b-form-group>
        <b-form-group :feedback="objState.message" label="Descripción">
          <b-input
            placeholder="Descripción"
            v-model.trim="detailRow.description"
            :state="objState.description"
            v-on:input="objState.description = 'valid'; objState.description= detailRow.description==''?'invalid':'valid'"
          />
        </b-form-group>

        <b-input-group>
            <b-input-group-text slot="prepend">
                <input type="checkbox" v-model="bitacoraActive" aria-label="Activar Bitacora"> &nbsp; Activar Bitacora
            </b-input-group-text>
            <input type="text" class="form-control" v-model="codeBitacora" :disabled="!bitacoraActive"/>
        </b-input-group>

      </fieldset>
      <div slot="modal-footer" class="w-100 text-right">
        <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
        <b-btn
          :variant="variantSaveButton"
          v-if="check_access('floor_root', 'c')"
          @click="submit()"
        >Guardar</b-btn>
      </div>
      <!-- </b-card> -->
    </b-modal>

    <!-- <div class="d-inline-block">
          <b-btn @click="$refs.ultraWide.open()">Ultra wide</b-btn>
          <sweet-modal title="Ultra Wide" width="100%" ref="ultraWide">
            This is a very wide modal.
          </sweet-modal>
    </div>-->
    <sweet-modal ref="longModal">
      <div class="text-left">
        <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
      </div>
    </sweet-modal>

    
  </div>
</template>


<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/libs/vue-color/vue-color.scss" lang="scss"></style>

<script>
var vueColor = require('vue-color')
import Vue from "vue";
import { SweetModal, SweetModalTab } from "sweet-modal-vue";
import {
  NewStopCode,
  UpdateStopCode,
  GetActiveStopCode,
  DeleteStopCode
} from "@/vendor/sbx/sbx/stop_code";
import Notifications from "vue-notification";
import { infousers } from "@/components/i40/js/users";
import VueMarkdown from "vue-markdown";
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import { infomaster } from "@/components/i40/js/master";
import Multiselect from "vue-multiselect";

Vue.use(Notifications);

export default {
  metaInfo: {
    title: "Configuración de Llamados"
  },
  components: {
        'chrome-picker': vueColor.Chrome,
        'compact-picker': vueColor.Compact,
        'material-picker': vueColor.Material,
        'sketch-picker': vueColor.Sketch,
        'slider-picker': vueColor.Slider,
        'swatches-picker': vueColor.Swatches,
        'photoshop-picker': vueColor.Photoshop,
    VueMarkdown,
    SweetModal,
    SweetModalTab,
    Multiselect,
    ApiWikiHelp
  },
  data: () => ({
    name: "Callers",
    version: "v1.0.0.0",

    bitacoraActive:false,
    codeBitacora:'',

     colors: {
            hex: '#194d33',
            hsl: {
                h: 150,
                s: 0.5,
                l: 0.2,
                a: 1
            },
            hsv: {
                h: 150,
                s: 0.66,
                v: 0.30,
                a: 1
            },
            rgba: {
                r: 25,
                g: 77,
                b: 51,
                a: 1
            },
            a: 1
        },

    bg_color:{hex: '#000000'},
    text_color:{hex: '#000000'},

    contentWiki: "",
    anchorAttrs: {
      target: "_blank",
      rel: "noopener noreferrer nofollow"
    },
    deleteCode: "",
    deleteDescripcion: "",

    variantSaveButton: "success",
    modified: false,
    tableData: [],

    columns: [
      { key: "code", label: "Código" },
      { key: "description", label: "Descripción" },
      { key: "edit", label: "Edit" }
    ],

    currentPage: 1,
    perPage: 10,
    totalRows: 0,
    pageOptions: [10, 15, 20, 25, 50, 100],
    filter: null,
    show: false,
    objState: {},
    detailRow: {}
  }),
  methods: {
    check_access(control, action) {
      return infousers.check_access(control, action);
    },

    ///Funcion para cargar la ayuda del helper
    openHelp: function() {
      //  this.contentWiki = "# FFFF"
      ApiWikiHelp(this.version, this.name)
        .then(data => {
          this.contentWiki = data.data;
        })
        .catch(data => {
          this.contentWiki = data.data;
        });
      this.$refs.longModal.open();
    },
    ///Funcion para cargar la ayuda del helper

    newstopcode: function() {
      this.show = true;
      this.bitacoraActive = false
      this.codeBitacora = ''
    },

    cancel: function() {
      this.detailRow = {};
      this.modified = false;
      this.variantSaveButton = "success";
      this.show = false;
    },

    submit: function() {
    
      if (this.validate_content()) {

        this.detailRow.bg_color =  this.bg_color['hex']
        this.detailRow.text_color =  this.text_color['hex']


        this.detailRow.binnacle_active = this.bitacoraActive
        this.detailRow.binnacle_code = this.codeBitacora

        infomaster
          .callercontroll(this.detailRow, !this.modified ? "insert" : "update")
          .then(data => {
            if (data.status === 202) {
              this.showCustom(
                "bg-danger text-white",
                "Error",
                "¡Error al Guardar el Registro!"
              );
            } else {
              this.showCustom(
                "bg-success text-white",
                "Guardar Registro",
                "¡El Registro se ha Guardado con Éxito!"
              );
              this.tableData = data.data;
              this.totalRows = this.tableData.length;
              this.cancel();
            }
          })
          .catch(function(error) {
            console.log(error.status);
          });
      }
    },

    showCustom: function(classes, title, text) {
      this.$notify({
        group: "notifications-default",
        type: classes,
        title: title,
        text: text
      });
    },

    showData: function() {
      infomaster.callercontroll([], "select").then(data => {
        if (data.data != "") {
          this.tableData = data.data;
          this.totalRows = this.tableData.length;
        }
      });
    },

    edit: function(row) {
      this.objState.code = "valid";
      this.objState.description = "valid";
      this.variantSaveButton = "warning";
      this.bg_color['hex'] = row.bg_color
      this.text_color['hex'] = row.text_color
      this.modified = true;
      this.detailRow = JSON.parse(JSON.stringify(row));
      this.show = true;

      this.bitacoraActive = this.detailRow.binnacle_active
      this.codeBitacora = this.detailRow.binnacle_code
    },

    remove: function(row) {
      this.detailRow = row;
      this.deleteDescripcion = row.description;
      this.$refs.errorWithButtonAlert.open();
    },

    deleteregistro: function() {
      infomaster
        .callercontroll(this.detailRow, "delete")
        .then(data => {
          if (data.status === 202) {
            this.showCustom(
              "bg-danger text-white",
              "Error",
              "¡Error al Guardar el Registro!"
            );
          } else {
            this.showCustom(
              "bg-success text-white",
              "Guardar Registro",
              "¡El Registro se ha Guardado con Éxito!"
            );
            if (data.data != "") {
              this.tableData = data.data;
              this.totalRows = this.tableData.length;
            }
            this.cancel();
          }
        })
        .catch(function(error) {
          console.log(error.status);
        });

      this.$refs.errorWithButtonAlert.close();
    },

    closeErrorAlarm: function() {
      this.deleteCode = "";
      this.deleteDescripcion = "";
      this.$refs.errorWithButtonAlert.close();
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

    validate_content() {
      let isOK = true;
      this.objState = {};
      this.objState.message = "Este es un Campo Obligatorio";

      if (this.detailRow.code == "") {
        this.objState.code = "invalid";
        isOK = false;
      } else {
        this.objState.code = "valid";
      }
      if (this.detailRow.description == "") {
        this.objState.description = "invalid";
        isOK = false;
      } else {
        this.objState.description = "valid";
      }

      return isOK;
    }
  },
  created() {
    // infomaster.stop_code_root_cause([],"start-form").then(data => {

    //         this.tableData = []
    //         this.totalRows = 0
    // })
    this.showData();
  }
};
</script>

<template>
    <div>
         <notifications group="notifications-default" />
         <h4 class="font-weight-bold py-3 mb-0"> Nuevo Requerimiento</h4>
         
         <b-button variant="success" @click="kl" >Crear nuevo requerimiento</b-button>
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
import Vue from 'vue'
import { realtime } from "@/vendor/sbx/sbx-realtime/realtime"
import Notifications from 'vue-notification'
import { component } from 'vue/types/umd'

export default{
    name: 'app',

metaInfo:{
    title: 'Nuevo Requerimiento'
},

components: {

},
data(){

}
}

<template>
  <!-- <div class="authentication-wrapper authentication-2 ui-bg-cover ui-bg-overlay-container px-4" style="background-image: url('/static/imgs/1.jpg');"> -->
  <div class="authentication-wrapper authentication-2 ui-bg-cover ui-bg-overlay-container px-4" :style="{ backgroundImage: 'url(' + require('@/components/i40/imgs/3.jpg') + ')' }">
    <div class="ui-bg-overlay bg-dark opacity-25"></div>

    <div class="authentication-inner py-5">
      <b-card no-body>
        <div class="p-4 p-sm-5">
          <!-- Logo -->
          <div class="d-flex justify-content-center align-items-center pb-2 mb-4">
            <div class="ui-w-150">
              <img :src="require('@/components/i40/imgs/logosyncbox.png')" class="img-fluid">
            </div>
          </div>
          <!-- / Logo -->
          <h5 class="text-center text-muted font-weight-normal mb-4">Bienvenido a SyncBox i4.0</h5>




          <div class="form-group">
              <div slot="label" class="d-flex justify-content-start align-items-end">
                <div>Email</div>
              </div>
              <div class="input-group with-focus">
                <input
                  :class="{'form-control border-right-0':true}"
                  placeholder="Usuario"
                  v-model="credentials.email"
                  type="text"
                  name="email"
                >
                <div class="input-group-append">
                  <span class="input-group-text text-muted bg-transparent border-left-0">
                    <em class="ion ion-ios-mail"></em>
                  </span>
                </div>
                <!-- <div
                  v-show="errors.has('credentials.email')"
                  class="w-100 invalid-feedback">{{ errors.first('credentials.email') }}</div> -->
              </div>
            </div>
            <div class="form-group">
              <div slot="label" class="d-flex justify-content-between align-items-end">
                <div>Password</div>
                <!-- <a href="javascript:void(0)" class="d-block small">¿Olvidó su Contraseña?</a> -->
              </div>
              <div class="input-group with-focus">
                <input
                  :class="{'form-control  border-right-0':true}"
                  v-model="credentials.password"
                  type="password"
                  name="password"
                  placeholder="Clave">
                <div class="input-group-append">
                  <span class="input-group-text text-muted bg-transparent border-left-0">
                    <em class="ion ion-md-key"></em>
                  </span>
                </div>
                <!-- <div
                  v-show="errors.has('credentials.password')"
                  class="w-100 invalid-feedback">{{ errors.first('credentials.password') }}</div> -->
              </div>
            </div>
            <div class="d-flex justify-content-end align-items-center m-0">
              <!-- <b-check v-model="credentials.rememberMe" class="m-0">Remember me</b-check> -->
              <b-btn variant="primary" @click="validateBeforeSubmit">Ingresar</b-btn>
            </div>
 









        </div>
        <b-card-footer class="py-3 px-4 px-sm-5">
          <div class="text-center text-muted">
            INNOVATING SOLUTIONS

            <!-- No tienes cuenta, registráte? <a href="javascript:void(0)">Crear cuenta</a> -->
          </div>
        </b-card-footer>
      </b-card>
    </div>
    <notifications group="notifications-custom-template" :duration="5000" animation-name="v-fade-left" position="bottom right">
      <template v-slot:cell(body)="row">
        <div :class="messageClass" @click="row.close">
          <div class="media align-items-center w-100">
            <div class="mr-3">
              <i :class="messageIcons" style="font-size: 250%;"></i>
            </div>
            <div class="media-body">
              <strong>{{ row.item.title }}</strong><br>
              {{ row.item.text }}
            </div>
          </div>
        </div>
      </template>
    </notifications>
  </div>
</template>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-toasted/vue-toasted.scss" lang="scss"></style>
<!-- Page -->
<style src="@/vendor/styles/pages/authentication.scss" lang="scss"></style>
<style>
  .v-fade-left-enter-active,
  .v-fade-left-leave-active,
  .v-fade-left-move {
    transition: all .5s;
  }
  .v-fade-left-enter,
  .v-fade-left-leave-to {
    opacity: 0;
    transform: translateX(-500px) scale(0.2);
  }
</style>
<script>
import Vue from "vue";
// import VeeValidate from "vee-validate";
import axios from "axios";
import VueResource from "vue-resource"

import Notifications from 'vue-notification'
import Toasted from 'vue-toasted'

import { InfoConfig } from '@/vendor/sbx/conn';



Vue.use(Notifications)
Vue.use(Toasted)

// Vue.use(VeeValidate, {
//   fieldsBagName: "formFields" // fix issue with b-table
// });
Vue.use(VueResource);

export default {
  metaInfo: {
    title: "Login"
  },
  data: () => ({
    name: 'Login',
    version: 'v1.0.0.0',

    credentials: {
      email: "",
      password: ""
    },
    messageClass: "",
    messageIcons: "",
    // info : `http://10.1.1.11/datacontrollerloginx/`
    info : InfoConfig.login()
    // info : `http://10.50.0.134/datacontrollerloginx/`
    //  info : `https://sw.syncbox.cloud/datacontrollerloginx/`
    // info : `http://192.168.115.48:1900/loginx/`
    // info : "10.50.0.134"
  }),
  methods: {
    // validateBeforeSubmit(scope) {
      // if(this.credentials.email != "" && this.credentials.password != "")
      //   this.$validator.validateAll(scope).then((result) => {
      //       if (result) {
      //           this.$http.get(this.info+this.credentials.email+`/`+this.credentials.password,
      //           {
      //             name: this.credentials.email,
      //             password: this.credentials.password
      //           }).then(function (response) {
      //               // console.log(response)
      //               localStorage.removeItem('syncbox.cloud')
      //               localStorage.setItem('syncbox.cloud', JSON.stringify(response.data));
      //               this.$router.push(this.$route.query.redirect || '/')
      //           },function (response) {
      //               this.$notify({
      //                 group: 'notifications-custom-template',
      //                 title: 'Error Validación',
      //                 text: 'El usuario ingresado no existe o contraseña incorrecta, ¡por favor valide!'
      //               })
      //               this.messageClass="media text-white p-3 mb-2 bg-danger"
      //               this.messageIcons="pe-7s-close-circle"
      //           });
      //           return;
      //       }
      //   });
    // }

    validateBeforeSubmit() {
            if (this.credentials.email != "" && this.credentials.password != "") {
                    axios.get(this.info+`${this.credentials.email}/${this.credentials.password}`)
                        .then(response => {
                                localStorage.removeItem('syncbox.cloud')
                                localStorage.setItem('syncbox.cloud', JSON.stringify( response.data));
                                this.$router.push(this.$route.query.redirect || '/')
                            })
                            .catch(e => {
                    this.$notify({
                      group: 'notifications-custom-template',
                      title: 'Error Validación',
                      text: 'El usuario ingresado no existe o contraseña incorrecta, ¡por favor valide!',
                      type:'error'
                    })
                });
                return;
            }else{
              this.$notify({
                group: 'notifications-custom-template',
                title: 'Error Validación',
                text: 'Por favor ingrese los datos',
                type:'error'
              })
              // this.messageClass="media text-white p-3 mb-2 bg-danger"
              // this.messageIcons="pe-7s-close-circle"
            }
    }
  },

  created() {
    // console.log(this.info)
  },

  beforeCreate() {

    this.info = InfoConfig.login()

    // console.log(JSON.parse(localStorage.getItem('syncbox.cloud')) == null ? null : JSON.parse(localStorage.getItem('syncbox.cloud')))
    
    // if(JSON.parse(localStorage.getItem('syncbox.cloud')) == null ? null : JSON.parse(localStorage.getItem('syncbox.cloud')) != null){
    //   let axiosConfig = {
    //     headers: {
    //         'Authorization': JSON.parse(localStorage.getItem('syncbox.cloud')) == null ? null : JSON.parse(localStorage.getItem('syncbox.cloud')).token
    //     }
    //   };
    
    //   this.$http.get(this.info+`/%20/%20`,axiosConfig).then(
    //     function(response) {
    //       this.$router.push(this.$route.query.redirect || "/");
    //     },
    //     function(response) {
    //       // Error
    //     }
    //   );
    // }
  }
};
</script>

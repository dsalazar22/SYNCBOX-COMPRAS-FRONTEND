<template>
  <b-navbar toggleable="lg" :variant="getLayoutNavbarBg()" class="layout-navbar align-items-lg-center container-p-x">

    <!-- Brand demo (see demo.css) -->
       <b-navbar-nav class="layout-sidenav-toggle d-lg-none align-items-lg-center mr-auto" v-if="sidenavToggle">
      <a class="nav-item nav-link px-0 mr-lg-4" href="javascript:void(0)" @click="toggleSidenav">
        <i class="ion ion-md-menu text-large align-middle" />
      </a>
    </b-navbar-nav>
    
    <b-navbar-brand to="/" class="app-brand demo d-lg-none py-0 mr-4">
      <!-- <span class="app-brand-logo"> -->
        
      <img :src="require('@/components/i40/imgs/logosyncbox.png')" class="img-responsive mt-0 mb-0" width="130" alt="Responsive image" />
      <!-- </span> -->
      <!-- <span class="app-brand-text demo font-weight-normal ml-2">Appwork</span> -->
    </b-navbar-brand>

    <!-- Sidenav toggle (see demo.css) -->
 

    <b-navbar-toggle target="app-layout-navbar"></b-navbar-toggle>

    <b-collapse is-nav id="app-layout-navbar">
      <!-- Divider -->
      <hr class="d-lg-none w-100 my-2">

      <b-navbar-nav class="align-items-lg-center">
        <!-- Search -->
        <!-- <label class="nav-item navbar-text navbar-search-box p-0 active">
          <i class="ion ion-ios-search navbar-icon align-middle"></i>
          <span class="navbar-search-input pl-2">
            <input type="text" class="form-control navbar-text mx-2" placeholder="Search..." style="width:200px">
          </span>
        </label> -->

      </b-navbar-nav>

      <b-navbar-nav class="align-items-lg-center ml-auto">
        <b-nav-item-dropdown no-caret class="demo-navbar-notifications mr-lg-3">
          <template slot="button-content">
            <i class="ion ion-md-notifications-outline navbar-icon align-middle"></i>
            <span class="badge badge-primary badge-dot indicator" v-if="listContent.length>0"></span>
            <span class="d-lg-none align-middle">&nbsp; Notifications</span>
          </template>

          <div class="bg-primary text-center text-white font-weight-bold p-3">
            {{listContent.length}} Nueva Notificación
          </div>
          <b-btn class="mt-1" variant="outline-danger" block size="xs" @click="removeallalarm()"><span class="ion ion-md-close"></span>&nbsp; Descartar Todas las Notificaciones</b-btn>
          <b-list-group flush  v-for="item of listContent">
            <b-list-group-item class="media d-flex align-items-center">
              <div class="ui-icon ui-icon-sm fas fa-clipboard-list bg-secondary border-0 text-white"></div>
              <div class="media-body line-height-condenced ml-3">
                <!-- {{item}} -->
                <div class="text-dark">{{item.title}}</div>
                <!-- <b-list-group-item  href="javascript:void(0)"> -->
                  <div class="text-light small mt-1">
                    {{item.message}}
                  </div>
                  <div class="text-light small mt-1">{{item.username}} {{item.created}}

                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/btc/det/'+item.module_id}"  target='_blank'  ><i class="fas fa-link"></i></b-btn>

                  </div>
                <!-- </b-list-group-item> -->
                <!-- <div class="row bt-2">
                  <div class="col" style="padding-right:5px;">
                    <b-btn variant="success" block size="xs" @click="messageContent=true"><span class="ion ion-md-checkmark"></span>&nbsp; Leído</b-btn>
                  </div>
                  <div class="col"  style="padding-left: 5px;">
                    <b-btn variant="danger" block size="xs" @click="messageContent=true"><span class="ion ion-md-close"></span>&nbsp; Eliminar</b-btn>
                  </div>
                </div> -->
                <b-btn variant="outline-danger" block size="xs" @click="removealarm(item)"><span class="ion ion-md-close"></span>&nbsp; Eliminar</b-btn>
              </div>
              
            </b-list-group-item>

            <!-- <b-list-group-item href="javascript:void(0)" class="media d-flex align-items-center">
              <div class="ui-icon ui-icon-sm ion ion-md-person-add bg-info border-0 text-white"></div>
              <div class="media-body line-height-condenced ml-3">
                <div class="text-dark">You have <strong>4</strong> new followers</div>
                <div class="text-light small mt-1">
                  Phasellus nunc nisl, posuere cursus pretium nec, dictum vehicula tellus.
                </div>
              </div>
            </b-list-group-item> -->

            <!-- <b-list-group-item href="javascript:void(0)" class="media d-flex align-items-center">
              <div class="ui-icon ui-icon-sm ion ion-md-power bg-danger border-0 text-white"></div>
              <div class="media-body line-height-condenced ml-3">
                <div class="text-dark">Server restarted</div>
                <div class="text-light small mt-1">
                  19h ago
                </div>
              </div>
            </b-list-group-item>

            <b-list-group-item href="javascript:void(0)" class="media d-flex align-items-center">
              <div class="ui-icon ui-icon-sm ion ion-md-warning bg-warning border-0 text-dark"></div>
              <div class="media-body line-height-condenced ml-3">
                <div class="text-dark">99% server load</div>
                <div class="text-light small mt-1">
                  Etiam nec fringilla magna. Donec mi metus.
                </div>
                <div class="text-light small mt-1">
                  20h ago
                </div>
              </div>
            </b-list-group-item> -->
          </b-list-group>

          <!-- <a href="javascript:void(0)" class="d-block text-center text-light small p-2 my-1">Show all notifications</a> -->
        </b-nav-item-dropdown>

        <!-- <b-nav-item-dropdown no-caret :right="!isRTL" class="demo-navbar-messages mr-lg-3">
          <template slot="button-content">
            <i class="ion ion-ios-mail navbar-icon align-middle"></i>
            <span class="badge badge-primary badge-dot indicator"></span>
            <span class="d-lg-none align-middle">&nbsp; Messages</span>
          </template>

          <div class="bg-primary text-center text-white font-weight-bold p-3">
            4 New Messages
          </div>
          <b-list-group flush>
            <b-list-group-item href="javascript:void(0)" class="media d-flex align-items-center">
              <img src="/static/img/avatars/6-small.png" class="d-block ui-w-40 rounded-circle" alt>
              <div class="media-body ml-3">
                <div class="text-dark line-height-condenced">Sit meis deleniti eu, pri vidit meliore docendi ut.</div>
                <div class="text-light small mt-1">
                  Mae Gibson &nbsp;·&nbsp; 58m ago
                </div>
              </div>
            </b-list-group-item>

            <b-list-group-item href="javascript:void(0)" class="media d-flex align-items-center">
              <img src="/static/img/avatars/4-small.png" class="d-block ui-w-40 rounded-circle" alt>
              <div class="media-body ml-3">
                <div class="text-dark line-height-condenced">Mea et legere fuisset, ius amet purto luptatum te.</div>
                <div class="text-light small mt-1">
                  Kenneth Frazier &nbsp;·&nbsp; 1h ago
                </div>
              </div>
            </b-list-group-item>

            <b-list-group-item href="javascript:void(0)" class="media d-flex align-items-center">
              <img src="/static/img/avatars/5-small.png" class="d-block ui-w-40 rounded-circle" alt>
              <div class="media-body ml-3">
                <div class="text-dark line-height-condenced">Sit meis deleniti eu, pri vidit meliore docendi ut.</div>
                <div class="text-light small mt-1">
                  Nelle Maxwell &nbsp;·&nbsp; 2h ago
                </div>
              </div>
            </b-list-group-item>

            <b-list-group-item href="javascript:void(0)" class="media d-flex align-items-center">
              <img src="/static/img/avatars/11-small.png" class="d-block ui-w-40 rounded-circle" alt>
              <div class="media-body ml-3">
                <div class="text-dark line-height-condenced">Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.</div>
                <div class="text-light small mt-1">
                  Belle Ross &nbsp;·&nbsp; 5h ago
                </div>
              </div>
            </b-list-group-item>
          </b-list-group>

          <a href="javascript:void(0)" class="d-block text-center text-light small p-2 my-1">Show all messages</a>
        </b-nav-item-dropdown> -->

        <!-- Divider -->
        <div class="nav-item d-none d-lg-block text-big font-weight-light line-height-1 opacity-25 mr-3 ml-1">|</div>

        <b-nav-item-dropdown class="demo-navbar-user">
          <template slot="button-content">
            <span class="d-inline-flex flex-lg-row-reverse align-items-center align-middle">
              <!-- <img :src="require('@/vendor/avatars/default.png')" alt class="d-block ui-w-30 rounded-circle"> -->
              
              <span class="px-1 mr-lg-2 ml-2 ml-lg-0">{{userInfo.name + ' ' + userInfo.lastname}}</span>
            </span>
          </template>

          <!-- <b-dd-item><i class="ion ion-ios-person text-lightest"></i> &nbsp; My profile</b-dd-item>
          <b-dd-item><i class="ion ion-ios-mail text-lightest"></i> &nbsp; Messages</b-dd-item>
          <b-dd-item><i class="ion ion-md-settings text-lightest"></i> &nbsp; Account settings</b-dd-item>
          <b-dd-divider /> -->
          <b-dd-item @click="logout"><i class="ion ion-ios-log-out text-danger"></i> &nbsp; Log Out</b-dd-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { infouser } from "@/vendor/sbx/sbx-users/users";
import { infonotify } from "@/components/i40/js/notify";
import { Sidenav, SidenavLink, SidenavRouterLink, SidenavMenu, SidenavHeader, SidenavBlock, SidenavDivider } from '@/vendor/libs/sidenav'
export default {
  name: 'app-layout-navbar',

  props: {
    sidenavToggle: {
      type: Boolean,
      default: true
    }
  },

  components: {
    Sidenav,
    SidenavLink,
    SidenavRouterLink,
    SidenavMenu,
    SidenavHeader,
    SidenavBlock,
    SidenavDivider
  },
  
  data() {
    return {
      userInfo: {},
      listContent:[],
    }
  },

  methods: {
    getnotify(){
      infonotify.notifycontroller("get","get").then(data =>{
        this.listContent=[]
        if(data.data != ""){
          // console.log(data.data)
          this.listContent=data.data
        }
      })
    },
    removeallalarm(){
      infonotify.notifycontroller([],"delete_all").then(data =>{
        this.getnotify()
      })
    },
    removealarm(item){
      infonotify.notifycontroller(item.notifications_id,"delete").then(data =>{
        this.getnotify()
      })
    },
    toggleSidenav () {
      this.layoutHelpers.toggleCollapsed()
    },

    getLayoutNavbarBg () {
      return this.layoutNavbarBg
    },
    logout: function(){
        localStorage.removeItem('syncbox.cloud')
        this.$router.push(this.$route.query.redirect || '/login')
    }
  },
  created(){
    this.getnotify()
    this.$options.interval = setInterval(this.getnotify, 20000)
  },
  beforeCreate(){

    let rs = infouser.currentUser()
    if(rs != "ERROR"){
      rs.then(response =>{
        this.userInfo=response.data
      }).catch(e => {
        
      });
    }else{
      this.$router.push(this.$route.query.redirect || '/login')
    }
  },
}
</script>

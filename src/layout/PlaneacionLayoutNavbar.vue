<template>

    <sidenav orientation="horizontal" :showDropdownOnHover="false" class="bg-white layout-navbar align-items-lg-center container-p-x" style="position: relative;z-index: 99">
      <div class="sidenav-inner">

        <sidenav-menu icon="fas fa-cogs">
          <template slot="link-text">Configuración</template>
          <sidenav-router-link v-if="check_access('capacity_holidays', 'r')" to="/cfpl/holidays" :exact="true">Festivos</sidenav-router-link>
          <sidenav-router-link v-if="check_access('capacity_capacity', 'r')" to="/cfpl/capacity" :exact="true">Capacidades</sidenav-router-link>
          <sidenav-router-link v-if="check_access('capacity_calendar', 'r')" to="/cfpl/calendar" :exact="true">Calendario</sidenav-router-link>
        </sidenav-menu>

        <sidenav-menu icon="fas fa-sitemap">
          <template slot="link-text">Operación</template>
          <sidenav-router-link  class="ml-0"  to="/pp/grcapacity" :exact="true">Planeación de Grupos</sidenav-router-link>
          <sidenav-router-link  class="ml-0" v-if="check_access('planning_resources', 'r')" to="/pp/capacity" :exact="true">Planeación de Recursos</sidenav-router-link>
          <sidenav-router-link class="ml-0" v-if="check_access('planning_online', 'r')" to="/pp/invonl" :exact="true">Inventario en Línea</sidenav-router-link>
          <!-- <sidenav-router-link class="ml-0" to="/pp/listplanned" :exact="true">Ordenes Planeadas</sidenav-router-link> -->
          <sidenav-router-link class="ml-0" v-if="check_access('planning_order', 'r')" to="/pp/production_order" :exact="true">Crear Orden</sidenav-router-link>
          <sidenav-router-link class="ml-0" to="/pp/order_programming" :exact="true">Programar Orden</sidenav-router-link>
          <sidenav-router-link class="ml-0" to="/pp/planner" :exact="true">Planeador</sidenav-router-link>
        </sidenav-menu>

        
        <sidenav-router-link class="ml-0" v-if="check_access('drump_production', 'r')"  to="/drum/tacproduction" :exact="true" icon="fas fa-drum">TAC de Producción</sidenav-router-link>

        <div class="mt-3">|</div>
        
        <sidenav-menu icon="ion ion-ios-contact">
          <template slot="link-text">{{userInfo.name + ' ' + userInfo.lastname}}</template>
          <sidenav-link href="#"><i class="ion ion-ios-log-out text-danger"></i> &nbsp; <a style="color: inherit;" href="#" @click.prevent="logout()">Log Out</a></sidenav-link>
        </sidenav-menu>

      </div>
    </sidenav>
</template>

<script>
import { Sidenav, SidenavLink, SidenavRouterLink, SidenavMenu, SidenavHeader, SidenavBlock, SidenavDivider } from '@/vendor/libs/sidenav'
import { infousers } from '@/components/i40/js/users';
import { infouser } from "@/vendor/sbx/sbx-users/users";
import { infonotify } from "@/components/i40/js/notify";
import { infomaster } from "@/components/i40/js/master";
export default {
  name: 'app-layout-navbar',

  props: {
    sidenavToggle: {
      type: Boolean,
      default: false
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

    async exportExcel (param) {
      let datainfo = []
        await infomaster.getcontentdownload(param).then(data => {
          datainfo = data.data
        })
        
        let data = XLSX.utils.json_to_sheet(datainfo)
        const workbook = XLSX.utils.book_new()
        const filename = param
        XLSX.utils.book_append_sheet(workbook, data, filename)
        XLSX.writeFile(workbook, `${filename}.xlsx`)
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
    },

    check_access (control, action) {
      return infousers.check_access(control, action)
      // return true
    },
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

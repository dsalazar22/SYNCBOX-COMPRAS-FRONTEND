<template>

    <sidenav orientation="horizontal" :showDropdownOnHover="false" class="bg-white layout-navbar align-items-lg-center container-p-x" style="position: relative;z-index: 99">
      <div class="sidenav-inner">
        <!-- <sidenav-router-link to="/complete-ui/libs" icon="ion ion-md-link">Router link</sidenav-router-link> -->
        <!-- <sidenav-link href="javascript:void(0)" icon="ion ion-md-notifications-outline">Some Long Long Long Long Long Item</sidenav-link> -->
        <!-- <sidenav-menu icon="ion ion-ios-settings">
          <template slot="link-text">Item 1</template>
          <sidenav-link href="javascript:void(0)">Item 1.1</sidenav-link>
          <sidenav-link href="javascript:void(0)">Item 1.2</sidenav-link>
          <sidenav-link href="javascript:void(0)">Item 1.3</sidenav-link>
        </sidenav-menu> -->
        <!-- <sidenav-menu icon="ion ion-md-paper">
          <template slot="link-text">Item 2</template>
          <sidenav-link href="javascript:void(0)">Item 2.1</sidenav-link>
          <sidenav-menu>
            <template slot="link-text">Item 2.2</template>
            <sidenav-link href="javascript:void(0)">Item 2.2.1</sidenav-link>
            <sidenav-link href="javascript:void(0)">Item 2.2.2</sidenav-link>
            <sidenav-link href="javascript:void(0)">Item 2.2.3</sidenav-link>
          </sidenav-menu>
          <sidenav-menu>
            <template slot="link-text">Item 2.3</template>
            <sidenav-link href="javascript:void(0)">Item 2.3.1</sidenav-link>
            <sidenav-link href="javascript:void(0)">Item 2.3.2</sidenav-link>
            <sidenav-link href="javascript:void(0)">Item 2.3.3</sidenav-link>
          </sidenav-menu>
        </sidenav-menu>
        <sidenav-link href="javascript:void(0)" icon="ion ion-ios-flask">Item 3</sidenav-link>
        <sidenav-link href="javascript:void(0)" icon="ion ion-md-basketball" :active="true">Item 4</sidenav-link>
        <sidenav-link href="javascript:void(0)" icon="ion ion-ios-bonfire">Item 5</sidenav-link>
        <sidenav-link href="javascript:void(0)" icon="ion ion-ios-cafe">Item 6</sidenav-link>
        <sidenav-link href="javascript:void(0)" icon="ion ion-ios-cloud-outline">Item 7</sidenav-link>
        <sidenav-link href="javascript:void(0)" icon="ion ion-md-code">Item 8</sidenav-link> -->

        <sidenav-menu icon="fas fa-barcode">
          <template slot="link-text">Productos</template>
          <sidenav-router-link v-if="check_access('products_fammily', 'r')" to="/cfpr/families/prd" :exact="true">Familias de Productos</sidenav-router-link>
          <sidenav-router-link v-if="check_access('products_fammily', 'r')" to="/cfpr/lines/prd" :exact="true">Lineas de Productos</sidenav-router-link>
          <sidenav-router-link v-if="check_access('products_products', 'r')" to="/cfpr/product/prd" :exact="true">Listar Productos</sidenav-router-link>
        </sidenav-menu>

        <sidenav-menu icon="fas fa-download">
          <template slot="link-text">Descargar</template>
          <sidenav-link href="#"><a style="color: inherit;" href="#" @click.prevent="exportExcel('prd')">Exportar Productos (Configuracion Basica)</a></sidenav-link>
          <sidenav-link href="#"><a style="color: inherit;" href="#" @click.prevent="exportExcel('rshort')">Exportar Rutas (Configuracion Basica)</a></sidenav-link>
          <sidenav-link href="#"><a style="color: inherit;" href="#" @click.prevent="exportExcel('rcomplete')">Exportar Rutas (Configuracion Completa)</a></sidenav-link>
          <sidenav-link href="#"><a style="color: inherit;" href="#" @click.prevent="exportExcel('bom')">Exportar BOM</a></sidenav-link>
        </sidenav-menu>

        <sidenav-menu icon="fas fa-upload">
          <template slot="link-text">Importar</template>
          <!-- <sidenav-router-link v-if="check_access('products_fammily', 'r')" to="/cfpr/import/pt" :exact="true">Subir Productos (Configuracion Basica)</sidenav-router-link> -->
          <sidenav-router-link v-if="check_access('products_fammily', 'r')" to="/cfpr/import/rshort" :exact="true">Subir Rutas (Configuracion Basica)</sidenav-router-link>
          <!-- <sidenav-router-link v-if="check_access('products_fammily', 'r')" to="/cfpr/import/rcomplete" :exact="true">Subir Rutas (Configuracion Completa)</sidenav-router-link> -->
          <!-- <sidenav-router-link v-if="check_access('products_products', 'r')" to="/cfpr/import/bom" :exact="true">Subir Listas de Materiales</sidenav-router-link> -->
        </sidenav-menu>

        <sidenav-router-link to="/cfpr/product/product_detail/prd/0" icon="ion ion-md-add">Nuevo Producto</sidenav-router-link>
        <sidenav-router-link to="/bcf/um" icon="fas fa-ruler">Unidades de Medida</sidenav-router-link>

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

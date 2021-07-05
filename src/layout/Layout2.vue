<template>
  <div class="layout-wrapper layout-2">
    <div class="layout-inner">
      
      <app-layout-sidenav />
      

      <div class="layout-container">
        <app-layout-navbar v-if="option == 'cfpr'" />
        <costos-app-menu v-else-if="option == 'cst'" />
        <planeacion-app-menu v-else-if="option == 'pp' || option == 'cfpl' || option == 'drum' " />
        <comercial-app-menu v-else-if="option == 'comm'"/>
        <default-app-menu v-else/>
        

        <div class="layout-content">
          <div class="router-transitions container-fluid flex-grow-1 container-p-y">
            <router-view />
          </div>

          <app-layout-footer />
        </div>
      </div>
    </div>
    <div class="layout-overlay" @click="closeSidenav"></div>
  </div>
</template>

<script>
import LayoutNavbar from './LayoutNavbar'
import DefaultLayoutNavbar from './DefaultLayoutNavbar'
import CostosLayoutNavbar from './CostosLayoutNavbar'
import PlaneacionLayoutNavbar from './PlaneacionLayoutNavbar'
import ComercialLayoutNavbar from './ComercialLayoutNavbar'
import LayoutSidenav from './LayoutSidenav'
import LayoutFooter from './LayoutFooter'

export default {
  name: 'app-layout-2',
  components: {
    'app-layout-navbar': LayoutNavbar,
    'app-layout-sidenav': LayoutSidenav,
    'app-layout-footer': LayoutFooter,
    'default-app-menu': DefaultLayoutNavbar,
    'costos-app-menu': CostosLayoutNavbar,
    'planeacion-app-menu': PlaneacionLayoutNavbar,
    'comercial-app-menu': ComercialLayoutNavbar
  },

  watch:{
    '$route.path' : function(value) {
      if(value.split('/').length > 0){
        this.option=value.split('/')[1]
      }else{
        this.option = ""
      }
    }
  },

  data(){
    return{
      parameters:null,
      option: "",
    }
  },

  created(){
      if(this.$route.path.split('/').length > 0){
        this.option=this.$route.path.split('/')[1]
      }else{
        this.option = ""
      }
  },

  mounted () {
    this.layoutHelpers.init()
    this.layoutHelpers.update()
    this.layoutHelpers.setAutoUpdate(true)
  },

  beforeDestroy () {
    this.layoutHelpers.destroy()
  },

  methods: {
    closeSidenav () {
      this.layoutHelpers.setCollapsed(true)
    }
  }
}
</script>

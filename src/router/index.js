import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import globals from '@/globals'

// Layouts
import Layout1 from '@/layout/Layout2'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  base: '/',
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: () => import('@/components/sbx/Login')
    },

    {
      path: '/print/:id',
      component: () => import('@/components/sbx/trade/invoicePrint.vue')
    }, 

    {
    path: '/',
    component: Layout1,
    children: [{
      path: '',
      component: () => import('@/components/sbx/globals/realtime_view_v2')
    }, 

    {
      path: 'calls',
      component: () => import('@/components/sbx/globals/calls')
    }, 

    {
      path: 'dash/gerencial',
      component: () => import('@/components/sbx/dashboard/gerencial')
    }, 
    {
      path: 'dash/comm',
      component: () => import('@/components/sbx/dashboard/commercial')
    }, 
    {
      path: 'dash/cap',
      component: () => import('@/components/sbx/dashboard/planning')
    }, 



    {
      path: 'btc/clst',
      component: () => import('@/components/sbx/traza/cierreturno')
    }, 
    {
      path: 'btc/btc',
      component: () => import('@/components/sbx/traza/bitacora')
    }, 
    {
      path: 'btc/det/:code',
      component: () => import('@/components/sbx/traza/bitacora_details')
    },

    {
      path: 'btc/:code',
      component: () => import('@/components/sbx/traza/bitacora3')
    },
    
    {
      path: 'ts/timeseries',
      component: () => import('@/components/sbx/timeseries/time_series')
    }, 
    {
      path: 'ts/rttimeseries',
      component: () => import('@/components/sbx/timeseries/rttimeseries')
    },
    {
      path: 'ts/alarms',
      component: () => import('@/components/sbx/timeseries/alarms')
    }, 
    {
      path: 'info/:codefloor/:idfloor',
      component: () => import('@/components/sbx/globals/realtime_view_v2')
    },
    {
      path: 'info/:codefloor/:idfloor/:codegroup/:idgroup',
      component: () => import('@/components/sbx/globals/realtime_view_v2')
    },
    {
      path: 'info/:codefloor/:idfloor/:codegroup/:idgroup/:wscode',
      component: () => import('@/components/sbx/globals/realtime_view_v2')
    },

    {
      path: 'drum/reprint_batches',
      component: () => import('@/components/sbx/production/reprint_batches')
    },
    {
      path: 'drum/tacproduction',
      component: () => import('@/components/sbx/production/tacproduction')
    }, 
    {
      path: 'drum/productionorders',
      component: () => import('@/components/sbx/production/production')
    }, 
    {
      path: 'drum/searchop',
      component: () => import('@/components/sbx/production/search_production_order')
    }, 
    {
      path: 'drum/searchop/:orderid',
      component: () => import('@/components/sbx/production/search_production_order')
    }, 
    {
      path: 'drum/orders',
      component: () => import('@/components/sbx/trade/orders')
    }, 
    {
      path: 'drum/purchases',
      component: () => import('@/components/sbx/trade/purchases')
    }, 

    {
      path: 'pp/order',
      component: () => import('@/components/sbx/controls/Info_Orders')
    },  

    {
      path: 'pp/capacity',
      component: () => import('@/components/sbx/planning/wsload')
    },  
    {
      path: 'pp/grcapacity',
      component: () => import('@/components/sbx/planning/grload')
    },  
    {
      path: 'pp/invonl',
      component: () => import('@/components/sbx/planning/inventory_online')
    },
    {
      path: 'pp/gantt',
      component: () => import('@/components/sbx/planning/gantt')
    },
    {
      path: 'pp/manual_report',
      component: () => import('@/components/sbx/planning/manual_report')
    },
    {
      path: 'pp/production_order',
      component: () => import('@/components/sbx/planning/create_order_production')
      // component: () => import('@/components/sbx/planning/cr_planning_order')
    },
    {
      path: 'pp/group_planning',
      component: () => import('@/components/sbx/planning/group_planning')
      // component: () => import('@/components/sbx/planning/cr_planning_order')
    },
    {
      path: 'pp/order_programming',
      component: () => import('@/components/sbx/planning/order_programming')
    },
    {
      path: 'pp/planner',
      component: () => import('@/components/sbx/planning/planner_prepared')
    },
    {
      path: 'pp/listplanned',
      component: () => import('@/components/sbx/planning/list_order_planning')
    },
    // {
    //   path: 'product',
    //   component: () => import('@/components/sbx/Products')
    // }, 
    ////Configuracion
    {
      path: 'cfpr/families/:module',
      component: () => import('@/components/sbx/master/groups')
    }, 
    {
      path: 'cfpr/lines/:module',
      component: () => import('@//components/sbx/master/productsLine')
    },
    {
      path: 'cfpr/import/:op',
      component: () => import('@//components/sbx/master/import_info')
    },
    {
      path: 'cfpr/product/:module',
      component: () => import('@/components/sbx/master/products')
    }, 
    // {
    //   path: 'cfpr/product/product_detail',
    //   component: () => import('@/components/sbx/master/details/product_detail')
    // }, 
    {
      path: 'cfpr/product/product_detail/:module/:idproduct',
      name: 'products_details',
      component: () => import('@/components/sbx/master/details/product_detail')
    }, 
    {
      path: 'cfgn/supplier',
      component: () => import('@/components/sbx/master/supplier')
    },
    {
      path: 'cfgn/customer',
      component: () => import('@/components/sbx/master/customers')
    },
    {
      path: 'cfgn/poli',
      component: () => import('@/components/sbx/master/commercial_policies')
    },

    /////MAINTENANCE

    {
      path: 'cfmnt/ctg',
      component: () => import('@/components/sbx/maintenance/categories')
    },
    {
      path: 'cfmnt/groups/:module',
      component: () => import('@/components/sbx/master/groups')
    }, 
    {
      path: 'cfmnt/ra',
      component: () => import('@/components/sbx/maintenance/actives')
    }, 
    {
      path: 'cfmnt/acf/:id',
      name: 'assets_details',
      component: () => import('@/components/sbx/maintenance/actives_details')
    }, 
    {
      path: 'cfmnt/product/:module',
      component: () => import('@/components/sbx/master/products')
    }, 
    {
      path: 'cfmnt/product/product_detail/:module/:idproduct',
      name: 'products_details_mnt',
      component: () => import('@/components/sbx/master/details/product_detail')
    }, 

    {
      path: 'mnt/kanban',
      component: () => import('@/components/sbx/maintenance/kanban')
    }, 
    {
      path: 'mnt/newrq',
      component: () => import('@/components/sbx/maintenance/solicitudes')
    }, 
    {
      path: 'mnt/auth',
      component: () => import('@/components/sbx/maintenance/authorization')
    }, 
    {
      path: 'mnt/rqactives',
      component: () => import('@/components/sbx/maintenance/requests_actives')
    }, 
    {
      path: 'mnt/register',
      component: () => import('@/components/sbx/maintenance/registro_info')
    }, {
      path: 'mnt/otact',
      component: () => import('@/components/sbx/maintenance/ot_actives')
    },
    {
      path: 'mnt/otce',
      component: () => import('@/components/sbx/maintenance/ot_to_finish')
    },
    {
      path: 'mnt/invonl',
      component: () => import('@/components/sbx/maintenance/inv_linea')
    }, 
    {
      path: 'mnt/purch',
      component: () => import('@/components/sbx/maintenance/compras')
    },  
    {
      path: 'comm/newrq/:type/:id',
      name: 'commercial-orders-rq',
      component: () => import('@/components/sbx/commercial/createorders.vue')
    },  
    {
      path: 'comm/cot/list',
      component: () => import('@/components/sbx/trade/quotlist.vue')
    },   
    {
      path: 'comm/cot/:type/:id',
      name: 'commercial-cot-rq',
      component: () => import('@/components/sbx/commercial/createcot.vue')
    }, 
    {
      path: 'comm/cart',
      component: () => import('@/components/sbx/trade/cartera.vue')
    }, 
    {
      path: 'comm/rel',
      component: () => import('@/components/sbx/trade/pendingreleased.vue')
    }, 
    {
      path: 'comm/appr',
      component: () => import('@/components/sbx/trade/pendingapproved.vue')
    }, 
    {
      path: '/comm/drump',
      component: () => import('@/components/sbx/trade/commercial_orders.vue')
    }, 


    ///DESPACHOS
    {
      path: '/deliv/prep',
      component: () => import('@/components/sbx/delivery/prepare.vue')
    }, 
    {
      path: '/deliv/conf',
      component: () => import('@/components/sbx/delivery/check_deliv.vue')
    }, 
    {
      path: '/deliv/inv',
      component: () => import('@/components/sbx/delivery/deliveries.vue')
    }, 

    ///INVENTORY
    {
      path: '/invent/movs',
      component: () => import('@/components/sbx/inventory/control_movs.vue')
    }, 
    {
      path: '/invent/detubq',
      component: () => import('@/components/sbx/inventory/invubq.vue')
    }, 
    {
      path: '/invent/invgral',
      component: () => import('@/components/sbx/inventory/invtotal.vue')
    }, 
    {
      path: '/invent/details',
      component: () => import('@/components/sbx/trade/commercial_orders.vue')
    }, 


    ////CONFIGURACION
    ///Configuracion Rutas
    {
      path: 'cfpr/routes',
      component: () => import('@/components/sbx/config/routes')
    }, 
    {
      path: 'cfpr/routes/details',
      component: () => import('@/components/sbx/config/details/details_routes')
    }, 
    {
      path: 'cfpr/routes/details/:id/:routeproductid/:productid',
      component: () => import('@/components/sbx/config/details/details_routes')
    }, 
    ///Configuracion Rutas
    {
      path: 'cfsw/process',
      component: () => import('@/components/sbx/config/process_operations')
    }, 

    {
      path: 'cfws/tools',
      component: () => import('@/components/sbx/config/tools')
    }, 
    {
      path: 'cfws/workstations',
      component: () => import('@//components/sbx/master/workstation')
    }, 
    {
      path: 'cfws/plants',
      component: () => import('@//components/sbx/master/workstation_plant')
    },
    {
      path: 'cfws/wsgroup',
      component: () => import('@//components/sbx/master/workstation_group')
    },
    {
      path: 'alarms',
      component: () => import('@/components/sbx/machine_alarms')
    }, 

    /// CONFIGURACIÓN PLANEACIÓN
    {
      path: 'cfpl/calendar',
      component: () => import('@/components/sbx/planning/config_capacity')
    },
    {
      path: 'cfpl/holidays',
      component: () => import('@/components/sbx/planning/config_holidays')
    },
    {
      path: 'cfpl/capacity',
      component: () => import('@/components/sbx/planning/config_workstation_capacity')
    },
    /// CONFIGURACIÓN PLANEACIÓN

    /// CONFIGURACIÓN CALIDAD
    {
      path: 'quality/quarantine',
      component: () => import('@/components/sbx/quality/quarantine')
    },
    
    /// CONFIGURACIÓN CALIDAD

    /// CONFIGURACIÓN COMERCIAL
    {
      path: '/commercial/forescast',
      component: () => import('@/components/sbx/commercial/forescast')
    },
    
    /// CONFIGURACIÓN COMERCIAL

    /////CONTROL DE PISO

    {
      path: 'cfcp/configtags',
      component: () => import('@/components/sbx/config_tags')
    }, 
    {
      path: 'cfcp/stopcode',
      component: () => import('@/components/sbx/floor_control/stop_code')
    }, 
    {
      path: 'cfcp/rootcause',
      component: () => import('@/components/sbx/floor_control/code_root_cause')
    }, 
    {
      path: 'cfcp/scrap',
      component: () => import('@/components/sbx/floor_control/scrap')
    },
    {
      path: 'cfcp/alarms',
      component: () => import('@/components/sbx/floor_control/alarms')
    },
    {
      path: 'cfcp/oee',
      component: () => import('@/components/sbx/floor_control/oee')
    },
    {
      path: 'cfcp/alarmcount',
      component: () => import('@/components/sbx/floor_control/counters_programmer')
    },
    {
      path: 'cfcp/callers',
      component: () => import('@/components/sbx/floor_control/callers')
    }, 


    /////CONTROL DE PISO

    /////CONTROL DE INVENTARIO

    {
      path: 'cfwh/warehouse',
      component: () => import('@/components/sbx/inventory/warehouse')
    }, 
    {
      path: 'cfwh/ubc',
      component: () => import('@/components/sbx/inventory/ubications')
    },     

    /////CONTROL DE INVENTARIO

    /////CONTROL DE USUARIOS

    {
      path: 'users/users_edit',
      component: () => import('@/components/sbx/users/users_edit')
    }, 
    {
      path: 'users/users_edit/:id',
      component: () => import('@/components/sbx/users/users_edit')
    }, 
    {
      path: 'users/users_list',
      component: () => import('@/components/sbx/users/users_list')
    }, 
    {
      path: 'users/users_view',
      component: () => import('@/components/sbx/users/users_view')
    }, 
    

    /////CONTROL DE USUARIOS


    ///EXTRA
    {
      path: 'bcf/tooltype',
      component: () => import('@/components/sbx/sysconfig/tools_types')
    }, 
    {
      path: 'bcf/areas',
      component: () => import('@/components/sbx/config/functional_areas')
    }, 
    {
      path: 'bcf/um',
      component: () => import('@/components/sbx/sysconfig/um')
    },
    {
      path: 'bcf/forms',
      component: () => import('@/components/sbx/sysconfig/forms')
    }, 
    {
      path: 'bcf/workstation_types',
      component: () => import('@/components/sbx/sysconfig/workstation_types')
    },
    {
      path: 'bcf/documents_types',
      component: () => import('@/components/sbx/sysconfig/documents_types')
    }, 
    {
      path: 'bcf/mov_types',
      component: () => import('@/components/sbx/sysconfig/mov_types')
    }, 
    {
      path: 'bcf/btctpa',
      component: () => import('@/components/sbx/sysconfig/bitacora_tipo_actividad')
    }, 
    {
      path: 'bcf/documentstatus',
      component: () => import('@/components/sbx/sysconfig/status_module')
    },
    {
      path: 'bcf/operator',
      component: () => import('@/components/sbx/production/operator')
    },
    // {
    //   path: 'sys/products_types',
    //   component: () => import('@/components/sbx/sysconfig/product_type')
    // }, 
    {
      path: 'sys/task_scheduler',
      component: () => import('@/components/sbx/sysconfig/task_scheduler')
    }, 
    {
      path: 'sys/devices',
      component: () => import('@/components/sbx/InfoDevices')
    }, 
    {
      path: 'sys/infolicense',
      component: () => import('@/components/sbx/InfoLicense')
    },
    ///EXTRA



    ///COSTOS
    {
      path: 'cst/prb',
      component: () => import('@/components/sbx/costos/pruebacostos.vue')
    },
    {
      path: 'cst/clcc',
      component: () => import('@/components/sbx/costos/clase_cc.vue')
    },
    {
      path: 'cst/tdc',
      component: () => import('@/components/sbx/costos/tipos_de_cuentas.vue')
    }, 
    {
      path: 'cst/puc',
      component: () => import('@/components/sbx/costos/plan_unico_cuenta.vue')
    }, 
    {
      path: 'cst/mcc',
      component: () => import('@/components/sbx/costos/maestro_centro_costos.vue')
    }, 
    {
      path: 'cst/ca',
      component: () => import('@/components/sbx/costos/clase_de_actividad.vue')
    }, 
    {
      path: 'cst/syf',
      component: () => import('@/components/sbx/costos/sociedades.vue')
    }, 
    {
      path: 'cst/ep',
      component: () => import('@/components/sbx/costos/esquema_particion.vue')
    }, 
    {
      path: 'cst/bgt',
      component: () => import('@/components/sbx/costos/presupuesto.vue')
    }, 
    {
      path: 'cst/cmr',
      component: () => import('@/components/sbx/costos/presupuesto_cm_prd.vue')
    }, 
    { 
      path: 'cst/prd',
      component: () => import('@/components/sbx/costos/presupuesto_cm_prd.vue')
    },
    { 
      path: 'cst/cecosact',
      component: () => import('@/components/sbx/costos/reportececos.vue')
    },
    { 
      path: 'cst/sbrp',
      component: () => import('@/components/sbx/costos/subrepartos.vue')
    }, 
    ///COSTOS


    ////REPORTS

    {
      path: 'reprt/oee_planta',
      component: () => import('@/components/sbx/reports/controlfloor/oee/oee_planta')
    }, 
    {
      path: 'reprt/oeeworkgroup',
      component: () => import('@/components/sbx/reports/controlfloor/oee/OEEGroupWork')
    }, 
    {
      path: 'reprt/oeeworkstationdetails',
      component: () => import('@/components/sbx/reports/controlfloor/oee/OEEWorkPlaceDetalle.vue')
    }, 
    // {
    //   path: 'reprt/workstationdetails',
    //   component: () => import('@/components/sbx/reports/controlfloor/OrdnProduccion/DetalleCentroTrabajo')
    // },
    {
      path: 'reprt/detalleOrdenProduccion/:id',
      component: () => import('@/components/sbx/reports/controlfloor/OrdnProduccion/OrdenProduccion'), name:'detalleOrdenProduccion'
    },
    {
      path: 'reprt/reportproduction',
      component: () => import('@/components/sbx/reports/controlfloor/OrdnProduccion/ReportesProduccion'), name:'reportproduction'
    },
    {
      path: 'reprt/products',
      component: () => import('@/components/sbx/reports/controlfloor/Productos/Productos')
    },
    {
      path: 'reprt/productiontime',
      component: () => import('@/components/sbx/reports/controlfloor/Productos/ProductosRangoTiempo')
    },
    {
      path: 'reprt/stopcodepergroup',
      component: () => import('@/components/sbx/reports/controlfloor/StopTimes/StopCodeGroup')
    },
    {
      path: 'reprt/general',
      component: () => import('@/components/sbx/reports/controlfloor/totals/totalesgenerales')
    },
    {
      path: 'reprt/stopcodeperworkstation',
      component: () => import('@/components/sbx/reports/controlfloor/StopTimes/StopCodeWorkPlace')
    },
    {
      path: 'reprt/cmp',
      component: () => import('@/components/sbx/reports/inventory/infomp')
    },
    {
      path: 'reprt/calls',
      component: () => import('@/components/sbx/reports/calls/calls')
    },

    {
      path: 'mttoreport/disp',
      component: () => import('@/components/sbx/reports/mtto/disponibilidad')
    }, 
    {
      path: 'mttoreport/mtbf',
      component: () => import('@/components/sbx/reports/mtto/mtbf')
    }, 
    {
      path: 'mttoreport/mttr',
      component: () => import('@/components/sbx/reports/mtto/mttr')
    },
    {
      path: 'mttoreport/mttrmtbf',
      component: () => import('@/components/sbx/reports/mtto/mttrmtbf')
    },
    {
      path: 'mttoreport/mttrmtbfmonth',
      component: () => import('@/components/sbx/reports/mtto/mttrmtbflastmonths')
    },
    ]
  }]
})

router.afterEach(() => {
  // On small screens collapse sidenav
  if (window.layoutHelpers && window.layoutHelpers.isSmallScreen() && !window.layoutHelpers.isCollapsed()) {
    setTimeout(() => window.layoutHelpers.setCollapsed(true, true), 10)
  }

  // Scroll to top of the page
  globals().scrollTop(0, 0)
})

router.beforeEach((to, from, next) => {
  // Set loading state
  document.body.classList.add('app-loading')

  // Add tiny timeout to finish page transition
  setTimeout(() => next(), 10)
})

export default router

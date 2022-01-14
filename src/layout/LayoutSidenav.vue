<template>
  <sidenav :orientation="orientation" :class="curClasses">
<!-- {{layoutHelpers}} -->
    <!-- Brand demo (see src/demo.css) -->
    <div class="app-brand demo" v-if="orientation !== 'horizontal'">
      <!-- <span class="app-brand-logo demo bg-primary"> -->
        <img :src="`${publicUrl}img/logo.png`" class="w-75 ml-2 mt-2 mb-2" alt="">
      <!-- </span> -->
      <!-- <router-link to="/" class="app-brand-text demo sidenav-text font-weight-normal ml-2">Appwork</router-link> -->
      <a href="javascript:void(0)" class="layout-sidenav-toggle sidenav-link text-large ml-auto" @click="toggleSidenav()">
        <i class="ion ion-md-menu align-middle"></i>
      </a>
      <!-- {{userInfo.name + ' ' + userInfo.lastname}} -->
    </div>
    <div class="sidenav-divider mt-0" v-if="orientation !== 'horizontal'"></div>

    <!-- Links -->
    <div class="sidenav-inner" :class="{ 'py-1': orientation !== 'horizontal' }">
      <sidenav-router-link icon="ion ion-md-home" to="/" :exact="true">Home</sidenav-router-link>
      <sidenav-menu icon="fas fa-chart-pie" :active="isMenuActive('/dash')" :open="isMenuOpen('/dash')">
        <template slot="link-text">Dashboards</template>
        <!-- icon="fas fa-dollar-sign"  -->
        <sidenav-router-link to="/dash/gerencial" :exact="true" v-if="check_access('show_gerencial', 'r')">Gerencial</sidenav-router-link>
        <sidenav-router-link to="/dash/comm" :exact="true" v-if="check_access('show_comm', 'r')">Comercial</sidenav-router-link>
        <sidenav-router-link to="/dash/cap" :exact="true" v-if="check_access('show_cap', 'r')">Capacidades</sidenav-router-link>
        </sidenav-menu>
      <sidenav-router-link icon="fas fa-phone" to="/calls" :exact="true">Llamados</sidenav-router-link>
      
<sidenav-header class="small font-weight-semibold">MOVIMIENTOS</sidenav-header>
<sidenav-divider class="mb-0 mt-0"></sidenav-divider>
      <!-- Dashboards -->
      <sidenav-menu icon="fas fa-book" :active="isMenuActive('/btc')" :open="isMenuOpen('/btc')">
        <template slot="link-text">Bitacora</template>
        <sidenav-router-link class="ml-0" to="/btc/btc" :exact="true">Bitácora</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/btc/clst" :exact="true">Cierre de Turno</sidenav-router-link>


        <!-- <sidenav-router-link class="ml-0" to="/btc/prd" :exact="true">Produccion</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/btc/qual" :exact="true">Calidad</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/btc/mnt" :exact="true">Mantenimiento</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/btc/gral" :exact="true">General</sidenav-router-link> -->

        <sidenav-router-link class="ml-0" v-for="item in binnacle" :to="`/btc/${item.code}`" :exact="true">{{item.text}}</sidenav-router-link>

      </sidenav-menu>

      <sidenav-menu icon="ion ion-md-contract" :active="isMenuActive('/drum')" :open="isMenuOpen('/drum')">
        <template slot="link-text">Tambor</template>
        <sidenav-router-link class="ml-0" to="/drum/searchop" :exact="true">Buscar Orden de Producción</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('drump_production', 'r')"  to="/drum/reprint_batches" :exact="true">Reimpresion de Lotes</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('drump_production', 'r')"  to="/drum/tacproduction" :exact="true">TAC de Producción</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('drump_production', 'r')"  to="/drum/productionorders" :exact="true">Tambor de Producción</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('drump_commercial', 'r')" to="/drum/orders" :exact="true">Tambor de Pedidos</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('drump_purchase', 'r')"  to="/drum/purchases" :exact="true">Tambor de Compras</sidenav-router-link>
      </sidenav-menu>

      <!-- Layouts -->
      <sidenav-menu icon="fas fa-sitemap" :active="isMenuActive('/pp')" :open="isMenuOpen('/pp')">
        <template slot="link-text">Planeación</template>
        <sidenav-router-link  class="ml-0"  to="/pp/grcapacity" :exact="true">Planeación de Grupos</sidenav-router-link>
        <sidenav-router-link  class="ml-0" v-if="check_access('planning_resources', 'r')" to="/pp/capacity" :exact="true">Planeación de Recursos</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('planning_online', 'r')" to="/pp/invonl" :exact="true">Inventario en Línea</sidenav-router-link>
        <!-- <sidenav-router-link class="ml-0" to="/pp/listplanned" :exact="true">Ordenes Planeadas</sidenav-router-link> -->
        <sidenav-router-link class="ml-0" to="/pp/order_programming" :exact="true">Planear Orden Simple</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('planning_order', 'r')" to="/pp/production_order" :exact="true">Planear Procesos</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('planning_order', 'r')" to="/pp/group_planning" :exact="true">Planear Orden Grupal</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/pp/planner" :exact="true">Planeador</sidenav-router-link>
     </sidenav-menu>

      <sidenav-menu icon="fas fa-cogs" :active="isMenuActive('/mnt')" :open="isMenuOpen('/mnt')">
        <template slot="link-text">Mantenimiento</template>
        <sidenav-router-link class="ml-0" to="/mnt/kanban" :exact="true">Tablero General</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mnt/newrq" :exact="true">Crear Solicitud</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mnt/rqactives" :exact="true">Solicitudes Activas</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mnt/otact" :exact="true">OT Activas</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mnt/otce" :exact="true">OT Pendientes</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mnt/auth" :exact="true">Pendiente por Aprobar</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mnt/register" :exact="true">Registro de Información</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mnt/invonl" :exact="true">Inventario en Línea</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mnt/purch" :exact="true">Compras</sidenav-router-link>
     </sidenav-menu>

      <sidenav-menu icon="fas fa-cash-register" :active="isMenuActive('/comm')" :open="isMenuOpen('/comm')">
        <template slot="link-text">Comercial</template>
        <sidenav-router-link class="ml-0" v-if="check_access('tmb_visual_comm', 'r')" to="/comm/drump" :exact="true">Tambor Comercial</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('cot_comm', 'r')" to="/comm/cot/list" :exact="true">Listado Cotizaciones</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('new_order_comm', 'r')" to="/comm/newrq/local/0" :exact="true">Nuevo Pedido</sidenav-router-link>
        <!-- <sidenav-router-link class="ml-0" v-if="check_access('planning_resources', 'r')" to="/comm/newrq/international/0" :exact="true">Pedido Internacional</sidenav-router-link> -->
        <sidenav-router-link class="ml-0" v-if="check_access('new_quot_comm', 'r')" to="/comm/cot/local/0" :exact="true">Nueva Cotizacion</sidenav-router-link>
        <!-- <sidenav-router-link class="ml-0" v-if="check_access('planning_resources', 'r')" to="/comm/cotintnal/0" :exact="true">Cotizacion Internacional</sidenav-router-link> -->
        <sidenav-router-link class="ml-0" v-if="check_access('liberar_comm', 'r')" to="/comm/rel" :exact="true">Liberar Pedidos</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('appr_comm', 'r')" to="/comm/appr" :exact="true">Aprobar Pedidos</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('bill_comm', 'r')" to="/comm/cart" :exact="true">Cartera</sidenav-router-link>
     </sidenav-menu>

      <sidenav-menu icon="fas fa-truck" :active="isMenuActive('/deliv')" :open="isMenuOpen('/deliv')">
        <template slot="link-text">Despachos</template>
        <sidenav-router-link class="ml-0" to="/deliv/prep" :exact="true">Preparar Despacho</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/deliv/conf" :exact="true">Confirmar Despacho</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/deliv/inv" :exact="true">Ver Despachos</sidenav-router-link>
     </sidenav-menu>

      <sidenav-menu icon="fas fa-boxes" :active="isMenuActive('/invent')" :open="isMenuOpen('/invent')">
        <template slot="link-text">Inventarios</template>
        <sidenav-router-link class="ml-0" to="/invent/invgral" :exact="true">Inventario General</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/invent/detubq" :exact="true">Detalle por Ubicaciones</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/invent/movs" :exact="true">Movimientos</sidenav-router-link>
        <!-- <sidenav-router-link class="ml-0" to="/invent/details" :exact="true">Detalle de Movimientos</sidenav-router-link> -->
     </sidenav-menu>

    <sidenav-menu icon="fas fa-calculator" v-if="check_access('costs_opr', 'r')" :active="isMenuActive('/cst')" :open="isMenuOpen('/cst')">
        <template slot="link-text">Costos</template>
        <sidenav-router-link class="ml-0" to="/cst/prb" :exact="true">Costo Producto</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/cst/sbrp" :exact="true">Subreparto</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/cst/bgt" :exact="true">Presupuesto Contable</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/cst/cmr" :exact="true">Presupuesto Comercial</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/cst/prd" :exact="true">Presupuesto Produccion</sidenav-router-link>
        <!-- <sidenav-router-link class="ml-0" to="/invent/details" :exact="true">Detalle de Movimientos</sidenav-router-link> -->
     </sidenav-menu>

      <!-- Layouts -->
      <sidenav-header class="small font-weight-semibold">INFORMES</sidenav-header>
      <sidenav-divider class="mb-0 mt-0"></sidenav-divider>

      <sidenav-menu  icon="ion ion-md-analytics" :active="isMenuActive('/ts')" :open="isMenuOpen('/reprt')">
        <template slot="link-text">Series / Alarmas</template>
        <sidenav-router-link to="/ts/timeseries" :exact="true">Consulta de Series</sidenav-router-link>
        <sidenav-router-link to="/ts/rttimeseries" :exact="true">Series Tiempo Real</sidenav-router-link>
        <sidenav-router-link to="/ts/alarms" :exact="true">Visualizacion Alarmas</sidenav-router-link>
      </sidenav-menu>
      <sidenav-menu icon="fas fa-chart-bar" :active="isMenuActive('/reprt')" :open="isMenuOpen('/reprt')">
        <template slot="link-text">Control de Piso</template>
        <!-- <sidenav-router-link class="ml-0" to="/reprt/oeeworkgroup" :exact="true">OEE Grupos</sidenav-router-link> -->
        <!-- <sidenav-router-link class="ml-0" to="/reprt/oeeworkstationdetails" :exact="true">OEE Centros de Trabajo</sidenav-router-link> -->
        <sidenav-router-link class="ml-0" to="/reprt/stopcodepergroup" :exact="true">Tiempo de Paro Grupos</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/reprt/stopcodeperworkstation" :exact="true">Resumen General</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/reprt/general" :exact="true">Totales Generales</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/reprt/oee_planta" :exact="true">Tendencias OEE</sidenav-router-link>
        <!-- <sidenav-router-link class="ml-0" to="/reprt/workstationdetails" :exact="true">Detalle Centros de Trabajo</sidenav-router-link> -->
        <!-- <sidenav-router-link class="ml-0" to="/reprt/orderproduction" :exact="true">Ordenes de Producción</sidenav-router-link> -->
        <sidenav-router-link class="ml-0" to="/reprt/products" :exact="true">Busqueda por Producto</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/reprt/productiontime" :exact="true">Productos Rango de Tiempo</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/reprt/cmp" :exact="true">Consumo de Materiales</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/reprt/reportproduction" :exact="true">Reportes</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/reprt/calls" :exact="true">Llamados</sidenav-router-link>
      </sidenav-menu>

      <sidenav-menu icon="fas fa-wrench" :active="isMenuActive('/mttoreport')" :open="isMenuOpen('/mttoreport')">
        <template slot="link-text">Mantenimiento</template>
        <sidenav-router-link class="ml-0" to="/mttoreport/disp" :exact="true">Disponibilidad por Centro Trabajo</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mttoreport/mtbf" :exact="true">MTBF por Centro Trabajo</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mttoreport/mttr" :exact="true">MTTR por Centro Trabajo</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mttoreport/mttrmtbf" :exact="true">MTBF y MTTR por Centro Trabajo</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/mttoreport/mttrmtbfmonth" :exact="true">MTBF y MTTR por Mes</sidenav-router-link>
      </sidenav-menu>


      <sidenav-header class="small font-weight-semibold">CONFIGURACIÓN</sidenav-header>

      <sidenav-divider class="mb-0 mt-0"></sidenav-divider>
        <sidenav-menu icon="fas fa-barcode" :active="isMenuActive('/cfpr')" :open="isMenuOpen('/cfpr')">
          <template slot="link-text">Productos</template>
          <sidenav-router-link v-if="check_access('products_route', 'r')" to="/cfpr/routes" :exact="true">Rutas de Productos</sidenav-router-link>
          <sidenav-router-link v-if="check_access('products_fammily', 'r')" to="/cfpr/families/prd" :exact="true">Familias de Productos</sidenav-router-link>
          <sidenav-router-link v-if="check_access('products_fammily', 'r')" to="/cfpr/lines/prd" :exact="true">Lineas de Productos</sidenav-router-link>
          <sidenav-router-link v-if="check_access('products_products', 'r')" to="/cfpr/product/prd" :exact="true">Productos</sidenav-router-link>
      </sidenav-menu>

      <sidenav-menu icon="ion ion-ios-business" :active="isMenuActive('/cfws')" :open="isMenuOpen('/cfws')">
        <template slot="link-text">Operaciones</template>
        <sidenav-router-link v-if="check_access('operations_tools', 'r')" to="/cfws/tools" :exact="true">Herramentales</sidenav-router-link>
        <sidenav-router-link v-if="check_access('operations_plants', 'r')" to="/cfws/plants" :exact="true">Plantas</sidenav-router-link>
        <sidenav-router-link v-if="check_access('operations_workstation_groups', 'r')" to="/cfws/wsgroup" :exact="true">Grupos Centro Trabajo</sidenav-router-link>
        <sidenav-router-link v-if="check_access('operations_workstation', 'r')" to="/cfws/workstations" :exact="true">Centros Trabajo</sidenav-router-link>
        <sidenav-router-link v-if="check_access('operations_process', 'r')" class="ml-0" to="/cfsw/process" :exact="true">Definición de Procesos</sidenav-router-link>
      </sidenav-menu>

      <sidenav-menu icon="ion ion-ios-albums" :active="isMenuActive('/cfcp')" :open="isMenuOpen('/cfcp')">
        <template slot="link-text">Control de Piso</template>
        <sidenav-router-link v-if="check_access('floor_stopcode', 'r')" to="/cfcp/stopcode" :exact="true">Códigos de Paro</sidenav-router-link>
        <sidenav-router-link v-if="check_access('floor_root', 'r')" to="/cfcp/rootcause" :exact="true">Códigos Causa Raíz</sidenav-router-link>
        <sidenav-router-link v-if="check_access('floor_scrap', 'r')" to="/cfcp/scrap" :exact="true">Códigos de Defectos</sidenav-router-link>
        <sidenav-router-link v-if="check_access('floor_scrap', 'r')" to="/cfcp/alarms" :exact="true">Alarmas</sidenav-router-link>
        <sidenav-router-link v-if="check_access('floor_scrap', 'r')" to="/cfcp/alarmcount" :exact="true">Códigos de Contadores</sidenav-router-link>
        <sidenav-router-link v-if="check_access('floor_tags', 'r')" to="/cfcp/callers" :exact="true">Llamados</sidenav-router-link>
        <sidenav-router-link v-if="check_access('floor_tags', 'r')" to="/cfcp/configtags" :exact="true">Configuración Tags</sidenav-router-link>
        <sidenav-router-link v-if="check_access('floor_tags', 'r')" to="/cfcp/oee" :exact="true">Variables OEE</sidenav-router-link>
     </sidenav-menu>

      <sidenav-menu icon="ion ion-md-options" :active="isMenuActive('/cfpl')" :open="isMenuOpen('/cfpl')">
        <template slot="link-text">Capacidades</template>
        <sidenav-router-link v-if="check_access('capacity_holidays', 'r')" to="/cfpl/holidays" :exact="true">Festivos</sidenav-router-link>
        <sidenav-router-link v-if="check_access('capacity_capacity', 'r')" to="/cfpl/capacity" :exact="true">Capacidades</sidenav-router-link>
        <sidenav-router-link v-if="check_access('capacity_calendar', 'r')" to="/cfpl/calendar" :exact="true">Calendario</sidenav-router-link>
      </sidenav-menu>


      <sidenav-menu icon="fas fa-warehouse" :active="isMenuActive('/cfwh')" :open="isMenuOpen('/cfwh')">
        <template slot="link-text">Almacenes</template>
        <sidenav-router-link to="/cfwh/warehouse" :exact="true">Bodegas</sidenav-router-link>
        <sidenav-router-link to="/cfwh/ubc" :exact="true">Ubicaciones</sidenav-router-link>
      </sidenav-menu>

      <sidenav-menu icon="fas fa-cog" :active="isMenuActive('/cfmnt')" :open="isMenuOpen('/cfmnt')">
        <template slot="link-text">Mantenimiento</template>
        <sidenav-router-link to="/cfmnt/groups/mnt" :exact="true">Grupo de Partes</sidenav-router-link>
        <sidenav-router-link to="/cfmnt/product/mnt" :exact="true">Registro de Partes</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/cfmnt/ra" :exact="true">Registro de Activos</sidenav-router-link>
        <sidenav-router-link class="ml-0" to="/cfmnt/ctg" :exact="true">Categorías</sidenav-router-link>
     </sidenav-menu>


    <sidenav-menu icon="fas fa-calculator"  v-if="check_access('costs_opr', 'r')" :active="isMenuActive('/cst')" :open="isMenuOpen('/cst')">
        <template slot="link-text" >Costos</template>
        <sidenav-router-link class="ml-0" v-if="check_access('costs_opr', 'r')" to="/cst/syf" :exact="true">Sociedades Financieras</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('costs_opr', 'r')" to="/cst/clcc" :exact="true">Clase de CC</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('costs_opr', 'r')" to="/cst/tdc" :exact="true">Tipos de Cuenta</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('costs_opr', 'r')" to="/cst/puc" :exact="true">Plan de Cuentas</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('costs_opr', 'r')" to="/cst/mcc" :exact="true">Maestros de Centros de Costos</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('costs_opr', 'r')" to="/cst/ca" :exact="true">Clase de Actividad</sidenav-router-link>
        <sidenav-router-link class="ml-0" v-if="check_access('costs_opr', 'r')" to="/cst/ep" :exact="true">Esquema de Partición</sidenav-router-link>
        <!-- <sidenav-router-link class="ml-0" to="/cst/bgt" :exact="true">Presupuesto</sidenav-router-link> -->
        <!-- <sidenav-router-link class="ml-0" to="/invent/details" :exact="true">Detalle de Movimientos</sidenav-router-link> -->
     </sidenav-menu>

      <sidenav-menu icon="ion ion-ios-filing" :active="isMenuActive('/cfgn')" :open="isMenuOpen('/cfgn')">
        <template slot="link-text">Generales</template>
        <sidenav-router-link v-if="check_access('general_customer', 'r')" to="/cfgn/poli" :exact="true">Modulo Comercial</sidenav-router-link>
        <sidenav-router-link v-if="check_access('general_customer', 'r')" to="/cfgn/customer" :exact="true">Clientes</sidenav-router-link>
        <sidenav-router-link v-if="check_access('general_providers', 'r')" to="/cfgn/supplier" :exact="true">Proveedores</sidenav-router-link>
      </sidenav-menu>

      <sidenav-header class="small font-weight-semibold">PLATAFORMA</sidenav-header>
      <sidenav-divider class="mb-0 mt-0"></sidenav-divider>
      <sidenav-menu icon="fas fa-object-group" :active="isMenuActive('/bcf')" :open="isMenuOpen('/bcf')">
        <template slot="link-text">Administración</template>
        <sidenav-router-link v-if="check_access('admin_um', 'r')" to="/bcf/um" :exact="true">Unidades de Medida</sidenav-router-link>
        <sidenav-router-link v-if="check_access('floor_stopcode', 'r')" to="/bcf/forms" :exact="true">Formularios</sidenav-router-link>
        <!-- <sidenav-router-link to="/bcf/um" :exact="true">Transacciones</sidenav-router-link> -->
        <sidenav-router-link v-if="check_access('admin_tools_type', 'r')" to="/bcf/tooltype" :exact="true">Tipos de Herramentales</sidenav-router-link>
        <sidenav-router-link v-if="check_access('admin_workstation_type', 'r')" to="/bcf/workstation_types" :exact="true">Tipos Centros de Trabajo</sidenav-router-link>
        <!-- <sidenav-router-link to="/bcf/products_types" :exact="true">Tipos de Productos</sidenav-router-link> -->
        <sidenav-router-link v-if="check_access('admin_document_status', 'r')" to="/bcf/documentstatus" :exact="true">Estado de Documentos</sidenav-router-link>
        <sidenav-router-link v-if="check_access('admin_documents_types', 'r')" to="/bcf/documents_types" :exact="true"> Tipos de Documentos</sidenav-router-link>
        <sidenav-router-link v-if="check_access('admin_documents_types', 'r')" to="/bcf/btctpa" :exact="true"> Bitácora Tipo Actividad</sidenav-router-link>
        <sidenav-router-link v-if="check_access('admin_documents_types', 'r')" to="/bcf/mov_types" :exact="true"> Tipos de Movimientos</sidenav-router-link>
        <sidenav-router-link v-if="check_access('admin_funcitonal_area', 'r')" to="/bcf/areas" :exact="true">Áreas Funcionales</sidenav-router-link>
        <sidenav-router-link v-if="check_access('admin_personal', 'r')" to="/bcf/operator" :exact="true">Personal</sidenav-router-link>
      </sidenav-menu>
      <sidenav-menu icon="fas fa-users" :active="isMenuActive('/users')" :open="isMenuOpen('/users')">
        <template slot="link-text">Usuarios</template>
        <sidenav-router-link v-if="check_access('users', 'r')" to="/users/users_list" :exact="true">Lista Usuario</sidenav-router-link>
        <!-- <sidenav-router-link to="/users/users_view" :exact="true">Perfil Usuario</sidenav-router-link> -->
        <sidenav-router-link v-if="check_access('users_edit', 'r')" to="/users/users_edit" :exact="true">Crear Usuario</sidenav-router-link>
      </sidenav-menu>
        <sidenav-menu icon="fas fa-info-circle" :active="isMenuActive('/sys')" :open="isMenuOpen('/sys')">
        <template slot="link-text">Información SyncBox</template>
        <sidenav-router-link v-if="check_access('admin_services', 'r')" to="/sys/task_scheduler" :exact="true">Tareas Programadas</sidenav-router-link>
        <sidenav-router-link v-if="check_access('info_check', 'r')" to="/sys/devices" :exact="true">Diagnóstico</sidenav-router-link>
        <sidenav-router-link v-if="check_access('info_licence', 'r')" to="/sys/infolicense" :exact="true">Licencia</sidenav-router-link>
      </sidenav-menu>

    </div>
  </sidenav>
</template>

<script>
import { Sidenav, SidenavLink, SidenavRouterLink, SidenavMenu, SidenavHeader, SidenavBlock, SidenavDivider } from '@/vendor/libs/sidenav'
import { infousers } from '@/components/i40/js/users'
import { infosysconfig } from "@/components/i40/js/sysconfig";

export default {
  name: 'app-layout-sidenav',
  components: {
    /* eslint-disable vue/no-unused-components */
    Sidenav,
    SidenavLink,
    SidenavRouterLink,
    SidenavMenu,
    SidenavHeader,
    SidenavBlock,
    SidenavDivider
    /* eslint-enable vue/no-unused-components */
  },

  props: {
    orientation: {
      type: String,
      default: 'vertical'
    }
  },

  computed: {
    curClasses () {
      let bg = this.layoutSidenavBg

      if (this.orientation === 'horizontal' && (bg.indexOf(' sidenav-dark') !== -1 || bg.indexOf(' sidenav-light') !== -1)) {
        bg = bg
          .replace(' sidenav-dark', '')
          .replace(' sidenav-light', '')
          .replace('-darker', '')
          .replace('-dark', '')
      }

      return `bg-${bg} ` + (
        this.orientation !== 'horizontal'
          ? 'layout-sidenav'
          : 'layout-sidenav-horizontal container-p-x flex-grow-0'
      )
    }
  },

  data: () => ({
    binnacle: []
  }),

  methods: {
    isMenuActive (url) {
      return this.$route.path.indexOf(url) === 0
    },

    isMenuOpen (url) {
      return this.$route.path.indexOf(url) === 0 && this.orientation !== 'horizontal'
    },

    toggleSidenav () {
      this.layoutHelpers.toggleCollapsed()
    },

    check_access (control, action) {
      return infousers.check_access(control, action)
    }
  },

  beforeCreate(){
    infosysconfig.functionalarea([],"select").then(data => {
        this.binnacle = []
        if(data.data != ""){
            for (let index = 0; index < data.data.length; index++) {
              const element = data.data[index];
              if(element.binnacle_active)
              this.binnacle.push({text:element.description, code:element.binnacle_code}) 
            }
        }
    })
  }

  
}
</script>

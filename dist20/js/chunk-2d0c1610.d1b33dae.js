(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c1610"],{4691:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[e.loading?a("BlockUI",{attrs:{message:"",html:e.html}}):e._e(),e._v(" "),a("notifications",{attrs:{group:"notifications-default"}}),e._v(" "),a("h4",{staticClass:"font-weight-bold py-3 mb-1"},[e._v("Planeador")]),e._v(" "),a("table",{staticClass:"table table-striped mt-2"},[a("thead",{staticClass:"thead-dark"},[a("tr",[a("th",{attrs:{scope:"col"}},[e._v("Buffer")]),e._v(" "),a("th",{attrs:{scope:"col"}},[e._v("OP")]),e._v(" "),a("th",{attrs:{scope:"col"}},[e._v("Pedido")]),e._v(" "),a("th",{attrs:{scope:"col"}},[e._v("Cliente")]),e._v(" "),a("th",{attrs:{scope:"col"}},[e._v("Código")]),e._v(" "),a("th",{attrs:{scope:"col"}},[e._v("Descripción")]),e._v(" "),a("th",{attrs:{scope:"col"}},[e._v("Programado")]),e._v(" "),a("th",{attrs:{scope:"col"}},[e._v("Fecha Programada")]),e._v(" "),e.sandbox_active?a("th",{attrs:{scope:"col"}},[e._v("Nueva Fecha")]):e._e(),e._v(" "),a("th",{attrs:{scope:"col"}},[e._v("Fecha Comprometida")])])]),e._v(" "),a("draggable",{attrs:{tag:"tbody"},model:{value:e.tableData,callback:function(t){e.tableData=t},expression:"tableData"}},e._l(e.tableData,(function(t){return a("tr",{key:t.consecutive_order},[a("td",{attrs:{scope:"row"}},[a("b-btn",{staticClass:"btn-xs",attrs:{variant:"outline-danger borderless icon-btn"},on:{click:function(a){return a.preventDefault(),e.data_change(t,"delete")}}},[a("i",{staticClass:"ion ion-md-close"})]),e._v(" "+e._s(t.consumed_buffer))],1),e._v(" "),a("td",[e._v(e._s(t.consecutive_order))]),e._v(" "),a("td",[e._v(e._s(t.client_order))]),e._v(" "),a("td",[e._v(e._s(t.customer_name))]),e._v(" "),a("td",[e._v(e._s(t.products_code))]),e._v(" "),a("td",[e._v(e._s(t.products_description))]),e._v(" "),a("td",[e._v(e._s(t.programmed_amount))]),e._v(" "),a("td",[e._v(e._s(t.deadline))]),e._v(" "),e.sandbox_active?a("td",[e._v(e._s(t.NuevaFecha))]):e._e(),e._v(" "),a("td",[e._v(e._s(t.requested_date))])])})),0)],1),e._v(" "),a("div",{staticClass:"text-right"},[a("b-btn",{staticClass:"mb-2",attrs:{variant:"default"},on:{click:function(t){return e.cancel_sandbox()}}},[e._v("Cancelar Sandbox")]),e._v(" "),a("b-btn",{staticClass:"mb-2",attrs:{variant:"warning"},on:{click:function(t){return e.sandbox_planning()}}},[e._v("Ejecutar Sandbox")]),e._v(" "),a("b-btn",{staticClass:"mb-2",attrs:{variant:"danger"},on:{click:function(t){return e.sandbox_planning()}}},[e._v("Confirmar Sandbox")])],1)],1)},r=[],o=(a("99af"),a("a434"),a("d3b7"),a("acd8"),a("25f0"),a("3ca3"),a("ddb0"),a("96cf"),a("1da1")),s=a("2b0e"),i=a("42b1"),c=a("b0ae"),l=a("2ee4"),d=a("ee98"),u=a.n(d),v=a("310e"),_=a.n(v),h=a("0213");s["default"].use(h["default"]),s["default"].use(u.a);var m={components:{SweetModal:c["a"],SweetModalTab:c["b"],WizardStep:l["WizardStep"],TabContent:l["TabContent"],FormWizard:l["FormWizard"],draggable:_.a},data:function(){return{loading:!1,html:'\n                <div class="sk-folding-cube sk-primary"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>\n                <h5 class="text-center mb-0">LOADING...</h5>',selectedOrder:{},partial:!1,sandbox_active:!1,dragging:!1,recovery_order:!1,orders_planned:!1,recovery_order_partial:!1,item_order:{},selectTab:"plant",active_reload:!1,finished_basic_order:!0,show_tree:!1,resumen_planning:[],primerItem:"<div class='small text-muted'>PRODUCTO</div> ",segundoItem:"<div class='small text-muted'>RECETA</div> ",currentPage:1,perPage:50,totalRows:0,pageOptions:[50,100,200],filter:null,columns:[{key:"consumed_buffer",label:"Buffer"},{key:"consecutive_order",label:"OP"},{key:"client_order",label:"# Pedido"},{key:"customer_name",label:"Cliente"},{key:"products_code",label:"Código"},{key:"products_description",label:"Descripción"},{key:"programmed_amount",label:"Programado"},{key:"programmed_amount",label:"Planeado"},{key:"deadline",label:"Fecha Limite"},{key:"edit",label:"Acciones"}],tableData:[],order_id:"0",columns_resumen:[{key:"IsActive",label:"Activo"},{key:"WorkstationID",label:"ID"},{key:"Code",label:"Codigo"},{key:"StartDate",label:"Fecha Inicio"},{key:"DateFinish",label:"Fecha Fin"},{key:"ProductionPerHour",label:"Produccion x hr"},{key:"TotalMinutes",label:"Minutos"}]}},methods:{content_load_order_planned:function(e){this.$refs.detalle_orden_produccion.open(),document.getElementById("visor_planned_order").innerHTML="",planning.mount(document.getElementById("visor_planned_order"),e),this.recovery_order=!1},content_load:function(e){var t=this;this.objInfo1={workstation_id:e.WorkstationID};var a=[],n=[],r=[];i["a"].calendarcontroller(this.objInfo1,"select-workstation-slots").then((function(o){if(o.data.length>0&&"Invalid Option"!=o.data){t.calendar1=o.data;for(var s=0;s<t.calendar1.length;s++){var i=t.calendar1[s];a.push(i.start_date),r.push(i.programed_hours),n.push(i.planned_hours)}var c={};c.categories=a,c.hoursPlanned=n,c.hoursProgrammers=r,c.title="",t.load_chart(c,"container","Centro de Trabajo "+e.Code+" por Día")}})),i["a"].calendarcontroller(this.objInfo1,"select-workstation-details-slots").then((function(e){e.data.length>0&&"Invalid Option"!=e.data&&e.data})),this.$refs.wsloadchart.open()},cancel_sandbox:function(){var e=this;this.sandbox_active=!1,i["a"].getinforesources("order-parent-programmed").then((function(t){null!=t.data&&""!=t.data?e.tableData=t.data:e.tableData=[]}))},sandbox_planning:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){var a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.loading=!0,t.next=3,i["a"].removesandbox().then((function(e){}));case 3:a=regeneratorRuntime.mark((function t(a){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n=e.tableData[a].production_order_id,t.next=3,i["a"].sandbox_planning(n).then((function(t){e.tableData[a]["NuevaFecha"]=t.data,e.html='\n                        <div class="sk-folding-cube sk-primary"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>\n                        <h5 class="text-center mb-0">REPROGRAMANDO ORDEN NRO '.concat(e.tableData[a].consecutive_order,'</h5>\n                        <h5 class="text-center mb-0">TOTAL ').concat(a," / ").concat(e.tableData.length,"</h5>")}));case 3:case"end":return t.stop()}}),t)})),n=0;case 5:if(!(n<e.tableData.length)){t.next=10;break}return t.delegateYield(a(n),"t0",7);case 7:n++,t.next=5;break;case 10:e.sandbox_active=!0,e.loading=!1;case 12:case"end":return t.stop()}}),t)})))()},load_chart:function(e,t,a){Highcharts.chart(t,{chart:{zoomType:"x"},title:{text:"Horas Programadas vs Horas Planeadas"},subtitle:{text:a},xAxis:[{categories:e.categories,crosshair:!0}],yAxis:[{labels:{format:"{value}",style:{color:Highcharts.getOptions().colors[1]}},title:{text:"Horas Planeadas",style:{color:Highcharts.getOptions().colors[1]}}},{title:{style:{color:Highcharts.getOptions().colors[0]}},labels:{format:"{value} mm",style:{color:Highcharts.getOptions().colors[0]}},opposite:!0,visible:!1}],tooltip:{shared:!0},legend:{layout:"vertical",align:"left",x:0,verticalAlign:"top",y:0,floating:!0,backgroundColor:Highcharts.theme&&Highcharts.theme.legendBackgroundColor||"rgba(255,255,255,0.25)"},series:[{name:"Horas Programadas",type:"column",data:e.hoursProgrammers,tooltip:{valueSuffix:" h"}},{name:"Horas Planeadas",type:"line",data:e.hoursPlanned,tooltip:{valueSuffix:" h"}}]})},ejecutar_cambio:function(e,t,a){for(var n=0;n<this.resumen_planning.length;n++){var r=this.resumen_planning[n];if(r.ProductCode==e)for(var o=0;o<r.ResumenActivities.length;o++){var s=r.ResumenActivities[o];if(s.ProcessName==t)for(var i=0;i<s.ResumenWorkstations.length;i++){var c=s.ResumenWorkstations[i];if(c.Code==a.Code)return void(this.resumen_planning[n].ResumenActivities[o].ResumenWorkstations[i].IsActive=a.IsActive)}}}},change_productionperhour:function(e,t,a){for(var n=0;n<this.resumen_planning.length;n++){var r=this.resumen_planning[n];if(r.ProductCode==e)for(var o=0;o<r.ResumenActivities.length;o++){var s=r.ResumenActivities[o];if(s.ProcessName==t)for(var i=0;i<s.ResumenWorkstations.length;i++){var c=s.ResumenWorkstations[i];if(c.Code==a.Code){var l=a.ProductionPerHour.toString();return void(this.resumen_planning[n].ResumenActivities[o].ResumenWorkstations[i].ProductionPerHour=parseFloat(l))}}}}},change_confirmed:function(e,t,a){for(var n=0;n<this.resumen_planning.length;n++){var r=this.resumen_planning[n];if(r.ProductCode==e)for(var o=0;o<r.ResumenActivities.length;o++){var s=r.ResumenActivities[o];s.ProcessName==t&&(this.resumen_planning[n].ResumenActivities[o].Confirmed=a)}}},change_parallels:function(e,t,a){for(var n=0;n<this.resumen_planning.length;n++){var r=this.resumen_planning[n];if(r.ProductCode==e)for(var o=0;o<r.ResumenActivities.length;o++){var s=r.ResumenActivities[o];s.ProcessName==t&&(this.resumen_planning[n].ResumenActivities[o].Parallels=a.Parallels)}}},reload_content:function(){var e=this;i["a"].getinforesources("order-parent-programmed").then((function(t){null!=t.data&&""!=t.data?e.tableData=t.data:e.tableData=[]}))},closeDeleteRecord:function(){this.item_order={},this.$refs.errorWithButtonAlert.close()},deleteRecord:function(){var e=this;i["a"].removeorderplanned(this.item_order.production_order_id).then((function(t){e.reload_content(!0),e.$refs.errorWithButtonAlert.close()}))},data_change:function(e,t){this.item_order=e,this.$refs.errorWithButtonAlert.open()},exec_cancel:function(){this.resumen_planning=[]},exec_confirm:function(){var e=this;i["a"].setorderplanned(this.order_id,this.resumen_planning).then((function(t){e.validateMontaje()}))},remove_workstation:function(e,t,a){for(var n=0;n<this.resumen_planning.length;n++){var r=this.resumen_planning[n];if(r.ProductCode==e)for(var o=0;o<r.ResumenActivities.length;o++){var s=r.ResumenActivities[o];if(s.ProcessName==t)for(var i=0;i<s.ResumenWorkstations.length;i++){var c=s.ResumenWorkstations[i];if(c.Code==a.Code)return void(0==i?this.resumen_planning[n].ResumenActivities[o].ResumenWorkstations.shift():this.resumen_planning[n].ResumenActivities[o].ResumenWorkstations.splice(i,i))}}}},exec_info:function(){var e=this;i["a"].getorderplanned(this.order_id).then((function(t){null!=t.data&&""!=t.data?e.resumen_planning=t.data:e.resumen_planning=[]}))},showCustom:function(e,t,a){this.$notify({group:"notifications-default",type:e,title:t,text:a})},remove_planned_order:function(){var e=this;i["a"].deleteorderplanned(this.order_id).then((function(t){e.exec_cancel(),e.validateMontaje(),e.recovery_order=!1}))},recovery_planned_order:function(){this.exec_cancel(),this.validateMontaje(),this.recovery_order=!1}},created:function(){google.charts.load("current",{packages:["timeline"]}),this.reload_content()},beforeMount:function(){}},g=m,p=(a("8e35"),a("0c18"),a("2877")),f=Object(p["a"])(g,n,r,!1,null,null,null);t["default"]=f.exports}}]);
//# sourceMappingURL=chunk-2d0c1610.d1b33dae.js.map
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d213f06"],{af8c:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("h4",{staticClass:"font-weight-bold py-3 mb-4"},[t._v("\n    Dashboard\n    ")]),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col-sm-6 col-xl-3"},[a("b-card",{staticClass:"mb-4"},[a("div",{staticClass:"d-flex align-items-center"},[a("div",{staticClass:"lnr lnr-cart display-4 text-success"}),t._v(" "),a("div",{staticClass:"ml-3"},[a("div",{staticClass:"text-muted small"},[t._v("Esperado por Facturar")]),t._v(" "),a("div",{staticClass:"text-large"},[t._v(t._s(t.numberWithCommas(t.contentResumen[1]["result"][2]["total_price"])))])])])])],1),t._v(" "),a("div",{staticClass:"col-sm-6 col-xl-3"},[a("b-card",{staticClass:"mb-4"},[a("div",{staticClass:"d-flex align-items-center"},[a("div",{staticClass:"lnr lnr-thumbs-up display-4 text-info"}),t._v(" "),a("div",{staticClass:"ml-3"},[a("div",{staticClass:"text-muted small"},[t._v("Real Facturado")]),t._v(" "),a("div",{staticClass:"text-large"},[t._v(t._s(t.numberWithCommas(t.contentResumen[1]["result"][2]["total_real_price"])))])])])])],1),t._v(" "),a("div",{staticClass:"col-sm-6 col-xl-3"},[a("b-card",{staticClass:"mb-4"},[a("div",{staticClass:"d-flex align-items-center"},[a("div",{staticClass:"lnr lnr-thumbs-down display-4 text-danger"}),t._v(" "),a("div",{staticClass:"ml-3"},[a("div",{staticClass:"text-muted small"},[t._v("Perdido")]),t._v(" "),a("div",{staticClass:"text-large"},[t._v(t._s(t.numberWithCommas(t.contentResumen[1]["result"][2]["total_price"]-t.contentResumen[1]["result"][2]["total_real_price"])))])])])])],1),t._v(" "),a("div",{staticClass:"col-sm-6 col-xl-3"},[a("b-card",{staticClass:"mb-4"},[a("div",{staticClass:"d-flex align-items-center"},[a("div",{staticClass:"lnr lnr-sad display-4 text-warning"}),t._v(" "),a("div",{staticClass:"ml-3"},[a("div",{staticClass:"text-muted small"},[t._v("Costos por Paros")]),t._v(" "),a("div",{staticClass:"text-large"},[t._v(t._s(t.numberWithCommas(t.contentResumen[1]["result"][1]["workstation_cost"])))])])])])],1)]),t._v(" "),a("b-card",{staticClass:"mb-4",attrs:{"no-body":""}},[a("b-card-header",{staticClass:"with-elements",attrs:{"header-tag":"h6"}},[a("div",{staticClass:"card-header-title"},[t._v("Información Totalizada")]),t._v(" "),a("div",{staticClass:"card-header-elements ml-auto"})]),t._v(" "),a("div",{staticClass:"table-responsive"},[a("b-table",{attrs:{small:"","show-empty":"",stacked:"md",items:t.contentResumen[1]["result"],fields:[{key:"tipo",label:"Concepto"},{key:"time_worked",label:"Tiempo Total"},{key:"total_losttime",label:"Microparos"},{key:"total_price",label:"Venta Esperada"},{key:"total_real_price",label:"Venta Real"},{key:"total_real_diff",label:"Diferencia"},{key:"total_price_lost",label:"Costo Microparos"},{key:"workstation_cost",label:"Costo Centro Trabajo"}]},scopedSlots:t._u([{key:"cell(time_worked)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.time_worked))+"\n                  ")])]}},{key:"cell(total_losttime)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_losttime))+"\n                  ")])]}},{key:"cell(total_price)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_price))+"\n                  ")])]}},{key:"cell(total_real_price)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_real_price))+"\n                  ")])]}},{key:"cell(total_real_diff)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_real_diff))+"\n                  ")])]}},{key:"cell(total_price_lost)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_price_lost))+"\n                  ")])]}},{key:"cell(workstation_cost)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.workstation_cost))+"\n                  ")])]}}])})],1)],1),t._v(" "),a("b-tabs",{staticClass:"nav-tabs-top mb-4"},[a("b-tab",{attrs:{title:"Centro de Trabajo Tiempo Real",active:""}},[a("b-table",{attrs:{small:"","show-empty":"",stacked:"md",items:t.realtimeResult,fields:[{key:"centrotrabajo",label:"CT"},{key:"description",label:"Descripcion"},{key:"total_price",label:"Por Facturar"},{key:"total_real_price",label:"Facturado"},{key:"total_real_diff",label:"Diferencia"},{key:"total_price_lost",label:"Microparos"},{key:"total_price_lost",label:"Costo Microparos"},{key:"workstation_cost",label:"Costo Centro Trabajo"},{key:"total",label:"Total"}]},scopedSlots:t._u([{key:"cell(centrotrabajo)",fn:function(e){return[a("div",{staticClass:"text-left"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-4"},[(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)<=0||(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)>=90?a("i",{staticClass:"fas fa-circle text-success"}):t._e(),t._v(" "),(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)>0&&(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)<=80?a("i",{staticClass:"fas fa-circle text-danger"}):t._e(),t._v(" "),(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)>80&&(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)<90?a("i",{staticClass:"fas fa-circle text-warning"}):t._e(),t._v("\n\n                              "+t._s(null==e.item.total_price||0==e.item.total_price?0:(e.item.total_real_price/e.item.total_price*100).toFixed(2))+" %\n\n\n                          ")]),t._v(" "),a("div",{attrs:{lass:"col-8"}},[t._v("\n                              "+t._s(e.item.centrotrabajo)+"\n                          ")])])])]}},{key:"cell(time_worked)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.time_worked))+"\n                  ")])]}},{key:"cell(total)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total.toFixed(2)))+"\n                  ")])]}},{key:"cell(total_price)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_price.toFixed(2)))+"\n                  ")])]}},{key:"cell(total_real_price)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_real_price.toFixed(2)))+"\n                  ")])]}},{key:"cell(total_real_diff)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_real_diff.toFixed(2)))+"\n                  ")])]}},{key:"cell(total_price_lost)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_price_lost.toFixed(2)))+"\n                  ")])]}},{key:"cell(workstation_cost)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.workstation_cost.toFixed(2)))+"\n                  ")])]}}])})],1),t._v(" "),a("b-tab",{attrs:{title:"Centro de Trabajo Acumulado"}},[a("b-table",{attrs:{small:"","show-empty":"",stacked:"md",items:t.contentResumen[0]["result"],fields:[{key:"centrotrabajo",label:"CT"},{key:"total_price",label:"Por Facturar"},{key:"total_real_price",label:"Facturado"},{key:"total_real_diff",label:"Diferencia"},{key:"total_price_lost",label:"Microparos"},{key:"total_price_lost",label:"Costo Microparos"},{key:"workstation_cost",label:"Costo Centro Trabajo"},{key:"total",label:"Total"}]},scopedSlots:t._u([{key:"cell(centrotrabajo)",fn:function(e){return[a("div",{staticClass:"text-left"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-4"},[(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)<=0||(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)>=90?a("i",{staticClass:"fas fa-circle text-success"}):t._e(),t._v(" "),(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)>0&&(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)<=80?a("i",{staticClass:"fas fa-circle text-danger"}):t._e(),t._v(" "),(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)>80&&(null==e.item.total_price||0==e.item.total_price?0:e.item.total_real_price/e.item.total_price*100)<90?a("i",{staticClass:"fas fa-circle text-warning"}):t._e(),t._v("\n\n                              "+t._s(null==e.item.total_price||0==e.item.total_price?0:(e.item.total_real_price/e.item.total_price*100).toFixed(2))+" %\n\n\n                          ")]),t._v(" "),a("div",{attrs:{lass:"col-8"}},[t._v("\n                              "+t._s(t.numberWithCommas(e.item.centrotrabajo))+"\n                          ")])])])]}},{key:"cell(time_worked)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.time_worked))+"\n                  ")])]}},{key:"cell(total)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total))+"\n                  ")])]}},{key:"cell(total_price)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_price))+"\n                  ")])]}},{key:"cell(total_real_price)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_real_price))+"\n                  ")])]}},{key:"cell(total_real_diff)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_real_diff))+"\n                  ")])]}},{key:"cell(total_price_lost)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.total_price_lost))+"\n                  ")])]}},{key:"cell(workstation_cost)",fn:function(e){return[a("div",{staticClass:"text-left"},[t._v("\n                      "+t._s(t.numberWithCommas(e.item.workstation_cost))+"\n                  ")])]}}])})],1)],1)],1)},l=[],s=(a("e01a"),a("4de4"),a("4160"),a("4e82"),a("b680"),a("d3b7"),a("e25e"),a("ac1f"),a("25f0"),a("5319"),a("1276"),a("159b"),a("ade3")),o=a("2b0e"),r=a("1fca"),n=a("3e86"),c=a("86c7"),_=a("28dd");o["default"].use(_["a"]),o["default"].component("dashboard1-chart1",{extends:r["a"].Line,mounted:function(){this.renderChart({labels:["2016-10","2016-11","2016-12","2017-01","2017-02","2017-03","2017-04","2017-05"],datasets:[{label:"Visits",data:[93,25,95,59,46,68,4,41],borderWidth:1,backgroundColor:"rgba(28,180,255,.05)",borderColor:"rgba(28,180,255,1)"},{label:"Returns",data:[83,1,43,28,56,82,80,66],borderWidth:1,borderDash:[5,5],backgroundColor:"rgba(136, 151, 170, 0.1)",borderColor:"#8897aa"}]},{scales:{xAxes:[{gridLines:{display:!1},ticks:{fontColor:"#aaa"}}],yAxes:[{gridLines:{display:!1},ticks:{fontColor:"#aaa",stepSize:20}}]},responsive:!1,maintainAspectRatio:!1})}}),o["default"].component("dashboard1-chart2",{extends:r["a"].Line,mounted:function(){this.renderChart({datasets:[{data:[24,92,77,90,91,78,28,49,23,81,15,97,94,16,99,61,38,34,48,3,5,21,27,4,33,40,46,47,48,18],borderWidth:1,backgroundColor:"rgba(0,0,0,0)",borderColor:"#009688",pointBorderColor:"rgba(0,0,0,0)",pointRadius:1,lineTension:0}],labels:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]},{scales:{xAxes:[{display:!1}],yAxes:[{display:!1}]},legend:{display:!1},responsive:!1,maintainAspectRatio:!1})}}),o["default"].component("dashboard1-chart3",{extends:r["a"].Bar,mounted:function(){this.renderChart({datasets:[{data:[24,92,77,90,91,78,28,49,23,81,15,97,94,16,99,61,38,34,48,3,5,21,27,4,33,40,46,47,48,18],borderWidth:0,backgroundColor:"#673AB7"}],labels:["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]},{scales:{xAxes:[{display:!1}],yAxes:[{display:!1}]},legend:{display:!1},responsive:!1,maintainAspectRatio:!1})}}),o["default"].component("dashboard1-chart4",{extends:r["a"].Line,mounted:function(){this.renderChart({datasets:[{data:[24,92,77,90,91,78,28,49,23,81,15,97,94,16,99,61,38,34,48,3,5,21,27,4,33,40,46,47],borderWidth:1,backgroundColor:"rgba(206, 221, 54, 0.2)",borderColor:"#cedd36",pointBackgroundColor:"rgba(0,0,0,0)",pointBorderColor:"rgba(0,0,0,0)",pointRadius:1}],labels:["","","","","","","","","","","","","","","","","","","","","","","","","","","",""]},{scales:{xAxes:[{display:!1}],yAxes:[{display:!1}]},legend:{display:!1},responsive:!1,maintainAspectRatio:!1})}}),o["default"].component("dashboard1-chart5",{extends:r["a"].Doughnut,mounted:function(){this.renderChart({datasets:[{data:[85,15],backgroundColor:["#fff","rgba(255,255,255,0.3)"],hoverBackgroundColor:["#fff","rgba(255,255,255,0.3)"],borderWidth:0}]},{scales:{xAxes:[{display:!1}],yAxes:[{display:!1}]},legend:{display:!1},tooltips:{enabled:!1},cutoutPercentage:94,responsive:!1,maintainAspectRatio:!1})}}),o["default"].component("dashboard1-chart6",{extends:r["a"].Pie,mounted:function(){this.renderChart({labels:["Desktops","Smartphones","Tablets"],datasets:[{data:[1225,654,211],backgroundColor:["rgba(99,125,138,0.5)","rgba(28,151,244,0.5)","rgba(2,188,119,0.5)"],borderColor:["#647c8a","#2196f3","#02bc77"],borderWidth:1}]},{scales:{xAxes:[{display:!1}],yAxes:[{display:!1}]},legend:{position:"right",labels:{boxWidth:12}},responsive:!1,maintainAspectRatio:!1})}});var d=Object(s["a"])({name:"dashboard-1",metaInfo:{title:"Costos Planta Tiempo Real"},components:{PerfectScrollbar:n["a"]},data:function(){return{contentResumen:[],realtimeResult:[],lastValues:[]}},methods:{numberWithCommas:function(t){return null==t&&(t=0),t.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",")},getContentResumen:function(){var t=this;this.$http.get(c["j"]+"/getgerenciareport").then((function(t){return t.json()})).then((function(e){t.getRealTimeInfo(e)}))},getRealTimeInfo:function(t){var e=this;this.$http.get(c["j"]+"/getrrealtimeinfows").then((function(t){return t.json()})).then((function(a){var i=Object.keys(a),l=[];e.contentResumen=t;for(var s=0;s<i.length;s++){var o=i[s],r=a[o];if(void 0!=r["wsinfo"]&&void 0!=r["infocalculada"]&&void 0!=r["realtimecontent"])try{var n=JSON.parse(r["wsinfo"]),c=JSON.parse(r["infocalculada"]),_=(JSON.parse(r["realtimecontent"]),c["tiempotrabajado"]),d=c["stop_time"],m=!1,u=!1;if(void 0!=c["stoptimeinterval_id"]?n[0].affect&&(_=c["stop_time"],u=!0):(_=c["tiempotrabajado"],m=!0),0!=_&&(_=parseInt(60*_.split(":")[0])+parseInt(_.split(":")[1])),d=parseInt(d.split(":")[0])+parseInt(d.split(":")[1]),m||u)if(m){var p=60*_/n[0].expected_time_cycle*n[0].standard_unit_cycle*n[0].price_list,f=c["nro_ciclos"]*n[0]["real_unit_cycle"]*n[0].price_list,b=d*n[0].price_list,v=_*n[0].price_list;l.push({centrotrabajo:o,description:n[0].description,total_price:p,total_real_price:f,total_real_diff:p-f,total_price_lost:b,workstation_cost:v,total:p-f+v,isworking:!0}),e.contentResumen[1]["result"][2]["total_price"]=e.contentResumen[1]["result"][2]["total_price"]+f,e.contentResumen[1]["result"][2]["total_real_price"]=(e.contentResumen[1]["result"][2]["total_real_price"]+(p-f)).toFixed(2),e.contentResumen[1]["result"][2]["total_real_diff"]=e.contentResumen[1]["result"][2]["total_real_diff"]+b}else{var C=60*_/n[0].expected_time_cycle*n[0].standard_unit_cycle*n[0].price_list,h=c["nro_ciclos"]*n[0]["real_unit_cycle"]*n[0].price_list,y=d*n[0].price_list,k=y,x=0;void 0!=n[0].standard_unit_cycle?x=C:(C=0,x=k),l.push({centrotrabajo:o,description:n[0].stopcode_description,total_price:C,total_real_price:0,total_real_diff:h,total_price_lost:y,workstation_cost:k,total:x,isworking:!1})}}catch(g){}}l.sort((function(t,e){return t.total<e.total?1:-1})),e.realtimeResult=l}))},getInfoEvents:function(){this.getContentResumen()}},created:function(){this.getInfoEvents(),this.$options.interval=setInterval(this.getInfoEvents,5e3)},beforeDestroy:function(){clearInterval(this.$options.interval)},mounted:function(){var t=this.$children.filter((function(t){return/-chart\d+$/.test(t.$options._componentTag)})),e=function(){return t.forEach((function(t){return t._data._chart.resize()}))};e(),this.layoutHelpers.on("resize.dashboard-1",e)}},"beforeDestroy",(function(){this.layoutHelpers.off("resize.dashboard-1")})),m=d,u=a("2877"),p=Object(u["a"])(m,i,l,!1,null,null,null);e["default"]=p.exports}}]);
//# sourceMappingURL=chunk-2d213f06.3b72dc80.js.map
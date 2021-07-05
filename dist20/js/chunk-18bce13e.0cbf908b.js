(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-18bce13e"],{"62e4":function(t,a){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},ce2c:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("div",{staticClass:"h3"},[t._v("    \n           Lista de Productos y Rendimientos\n    ")]),t._v(" "),e("div",{staticClass:"row mt-2"},[e("div",{staticClass:"col-md-2"}),t._v(" "),e("div",{staticClass:"col-md-4"},[e("div",{staticClass:"input-group-prepend"},[e("span",{staticClass:"input-group-text",attrs:{id:"basic-addon1"}},[t._v("Fecha Inicial:")]),t._v(" "),e("date-picker",{attrs:{config:t.optionsCalendar},model:{value:t.dateStart,callback:function(a){t.dateStart=a},expression:"dateStart"}})],1)]),t._v(" "),e("div",{staticClass:"col-md-4"},[e("div",{staticClass:"input-group-prepend"},[e("span",{staticClass:"input-group-text",attrs:{id:"basic-addon1"}},[t._v("Fecha Final:")]),t._v(" "),e("date-picker",{attrs:{config:t.optionsCalendar},model:{value:t.dateFinsh,callback:function(a){t.dateFinsh=a},expression:"dateFinsh"}})],1)]),t._v(" "),e("div",{staticClass:"col-md-2"},[e("button",{staticClass:"btn btn-success",attrs:{type:"button"},on:{click:function(a){return t.loadData()}}},[t._v("Consultar")])])]),t._v(" "),e("b-input-group",[e("b-form-input",{attrs:{placeholder:"Variación Minima"},model:{value:t.minVariacion,callback:function(a){t.minVariacion=a},expression:"minVariacion"}}),t._v(" "),e("b-form-input",{attrs:{placeholder:"Variación Maxima"},model:{value:t.maxVariacion,callback:function(a){t.maxVariacion=a},expression:"maxVariacion"}}),t._v(" "),e("b-input-group-append",[e("b-btn",{attrs:{variant:"success"},on:{click:function(a){return t.setVariacion()}}},[e("i",{staticClass:"fas fa-check"})])],1)],1),t._v(" "),e("b-nav",{staticClass:"justify-content-end mt-2"},[e("b-nav",{staticClass:"nav-sm tabs-alt",attrs:{tabs:""}},[e("b-nav-item",{attrs:{active:"resumen"==t.selectTab},on:{click:function(a){t.selectTab="resumen"}}},[t._v("Resumen")]),t._v(" "),e("b-nav-item",{attrs:{active:"details"==t.selectTab},on:{click:function(a){t.selectTab="details"}}},[t._v("Detalle")])],1)],1),t._v(" "),"resumen"==t.selectTab?e("div",[e("div",{staticClass:"row"},[e("div",{staticClass:"col"},[e("b-list-group",{staticClass:"mt-2"},[e("b-list-group-item",{staticStyle:{padding:"5px"}},[e("div",[e("b",[t._v("Totales Generales")])])]),t._v(" "),e("b-list-group-item",{staticStyle:{padding:"5px"}},[e("div",[e("b",[t._v("Total Entregado a Produccion (kg)")]),t._v(" "),e("div",{staticClass:"float-right mr-2"},[t._v(" "+t._s(t.globalinfo.length>0?t.numberWithCommas(t.globalinfo[0].total_leido):0)+" ")])])]),t._v(" "),e("b-list-group-item",{staticStyle:{padding:"5px"}},[e("div",[e("b",[t._v("Cantidad Inicial (kg)")]),t._v(" "),e("div",{staticClass:"float-right mr-2"},[t._v(" "+t._s(t.numberWithCommas(t.total))+" ")])])]),t._v(" "),e("b-list-group-item",{staticStyle:{padding:"5px"}},[e("div",[e("b",[t._v("Cantidad Producida (kg)")]),t._v(" "),e("div",{staticClass:"float-right mr-2"},[t._v(" "+t._s(t.numberWithCommas(t.totalConsume))+" ")])])]),t._v(" "),e("b-list-group-item",{staticStyle:{padding:"5px"}},[e("div",[e("b",[t._v("Unidades x Kg")]),t._v(" "),e("div",{staticClass:"float-right mr-2"},[t._v(" "+t._s(t.numberWithCommas(t.undsTotals/t.totalConsume))+" ")])])]),t._v(" "),e("b-list-group-item",{staticStyle:{padding:"5px"}},[e("div",[e("b",[t._v("Cantidad Manga (kg)")]),t._v(" "),e("div",{staticClass:"float-right mr-2"},[t._v(" "+t._s(t.numberWithCommas(t.mangakg))+" ")])])]),t._v(" "),e("b-list-group-item",{staticStyle:{padding:"5px"}},[e("div",[e("b",[t._v("Cantidad Manga (Und)")]),t._v(" "),e("div",{staticClass:"float-right mr-2"},[t._v(" "+t._s(t.numberWithCommas(t.manga))+" ")])])]),t._v(" "),e("b-list-group-item",{staticStyle:{padding:"5px"}},[e("div",[e("b",[t._v("Unidades Entregada a Producción")]),t._v(" "),e("div",{staticClass:"float-right mr-2"},[t._v(" "+t._s(t.globalinfo.length>0?t.numberWithCommas(t.globalinfo[0].cantidad_leida):0)+" ")])])]),t._v(" "),e("b-list-group-item",{staticStyle:{padding:"5px"}},[e("div",[e("b",[t._v("Unidades de Empaque Filtradas")]),t._v(" "),e("div",{staticClass:"float-right mr-2"},[t._v(" "+t._s(t.numberWithCommas(t.totalRows))+" ")])])]),t._v(" "),e("b-list-group-item",{staticStyle:{padding:"5px"}},[e("div",[e("b",[t._v("Diferencia de Unidades de Empaque Filtradas")]),t._v(" "),e("div",{staticClass:"float-right mr-2"},[t._v(" "+t._s(t.numberWithCommas(t.undsIniciales-t.totalRows))+" ")])])])],1)],1),t._v(" "),e("div",{staticClass:"col"},[e("h1",{staticClass:"text-center h-4",staticStyle:{"margin-bottom":"0px","font-size":"12rem","font-weight":"300","line-height":"1.2"}},[t._v("\n                            "+t._s(100*(t.undsIniciales-t.totalRows==0?1:t.numberWithCommas(1-(t.undsIniciales-t.totalRows)/t.totalRows))+"%")+"\n                        ")]),t._v(" "),e("h1",{staticClass:"text-center display-3"},[t._v("\n                           Total de la Muestra\n                        ")])])]),t._v(" "),e("h3",{staticClass:"mt-4"},[t._v("Totales por Producto")]),t._v(" "),e("div",{attrs:{id:"container"}}),t._v(" "),e("b-table",{attrs:{small:"","show-empty":"",stacked:"md",items:t.totalProduct,fields:t.columnsprod},scopedSlots:t._u([{key:"cell(start_amount)",fn:function(a){return[t._v("\n                        "+t._s(t.numberWithCommas(a.item.start_amount))+"\n                    ")]}},{key:"cell(total_consume)",fn:function(a){return[t._v("\n                        "+t._s(t.numberWithCommas(a.item.total_consume))+"\n                    ")]}},{key:"cell(unds)",fn:function(a){return[t._v("\n                        "+t._s(t.numberWithCommas(a.item.unds))+"\n                    ")]}},{key:"cell(undsxkg)",fn:function(a){return[t._v("\n                        "+t._s(t.numberWithCommas(a.item.unds/a.item.total_consume))+"\n                    ")]}},{key:"cell(variacion)",fn:function(a){return[t._v("\n                        "+t._s(100*t.numberWithCommas((a.item.start_amount-a.item.total_consume)/a.item.start_amount))+"\n                    ")]}}],null,!1,1739358922)}),t._v(" "),e("h3",{staticClass:"mt-4"},[t._v("Totales por Proveedores")]),t._v(" "),"resumen"==t.selectTab?e("div",{attrs:{id:"container_prov"}}):t._e(),t._v(" "),e("b-table",{attrs:{small:"","show-empty":"",stacked:"md",items:t.totalSupp,fields:t.columnsprv},scopedSlots:t._u([{key:"cell(start_amount)",fn:function(a){return[t._v("\n                        "+t._s(t.numberWithCommas(a.item.start_amount))+"\n                    ")]}},{key:"cell(total_consume)",fn:function(a){return[t._v("\n                        "+t._s(t.numberWithCommas(a.item.total_consume))+"\n                    ")]}},{key:"cell(unds)",fn:function(a){return[t._v("\n                        "+t._s(t.numberWithCommas(a.item.unds))+"\n                    ")]}},{key:"cell(undsxkg)",fn:function(a){return[t._v("\n                        "+t._s(t.numberWithCommas(a.item.unds/a.item.total_consume))+"\n                    ")]}},{key:"cell(variacion)",fn:function(a){return[t._v("\n                        "+t._s(100*t.numberWithCommas((a.item.start_amount-a.item.total_consume)/a.item.start_amount))+"\n                    ")]}}],null,!1,1739358922)})],1):t._e(),t._v(" "),"details"==t.selectTab?e("div",[e("b-row",[e("b-col",{staticClass:"my-1",attrs:{md:"6"}},[e("b-input-group",[e("b-form-input",{attrs:{placeholder:"Buscar..."},model:{value:t.filter,callback:function(a){t.filter=a},expression:"filter"}}),t._v(" "),e("b-input-group-append",[e("b-btn",{attrs:{disabled:!t.filter},on:{click:function(a){t.filter=""}}},[e("span",{staticClass:"oi oi-delete"})])],1)],1)],1),t._v(" "),e("b-col",{staticClass:"my-1",attrs:{md:"6"}},[e("b-form-select",{attrs:{options:t.pageOptions},model:{value:t.perPage,callback:function(a){t.perPage=a},expression:"perPage"}})],1)],1),t._v(" "),e("b-table",{staticStyle:{"font-size":"12px"},attrs:{"sticky-header":!1,"no-border-collapse":!1,responsive:"",items:t.tableData,"current-page":t.currentPage,"per-page":t.perPage,fields:t.columns,filter:t.filter},on:{filtered:t.onFiltered},scopedSlots:t._u([{key:"head(start_amount)",fn:function(a){return[e("div",{staticClass:"text-nowrap"},[t._v("Cantidad Inicial Kg")])]}},{key:"head(total)",fn:function(a){return[e("div",{staticClass:"text-nowrap"},[t._v("Total Kg")])]}},{key:"head(scrap)",fn:function(a){return[e("div",{staticClass:"text-nowrap"},[t._v("Manga kg/und")])]}},{key:"cell(created)",fn:function(a){return[e("div",{staticClass:"text-nowrap"},[t._v(" "+t._s(a.item.created))])]}},{key:"cell(code)",fn:function(a){return[e("div",{staticClass:"text-nowrap"},[t._v(" "+t._s(a.item.code))])]}},{key:"cell(description)",fn:function(a){return[e("div",{staticClass:"text-nowrap"},[t._v(" "+t._s(a.item.description))])]}},{key:"cell(product_lote)",fn:function(a){return[e("div",{staticClass:"text-nowrap"},[t._v(" "+t._s(a.item.product_lote))])]}},{key:"cell(edit)",fn:function(a){return[e("div",{staticClass:"text-left"},[t.check_access("admin_um","c")?e("b-btn",{staticClass:"btn-xs",attrs:{variant:"outline-success borderless icon-btn"},on:{click:function(e){return e.preventDefault(),t.data_change(a.item,"edit")}}},[e("i",{staticClass:"ion ion-md-create"})]):t._e(),t._v(" "),e("b-btn",{staticClass:"btn-xs",attrs:{variant:"outline-danger borderless icon-btn"},on:{click:function(e){return e.preventDefault(),t.data_change(a.item,"delete")}}},[e("i",{staticClass:"ion ion-md-close"})])],1)]}},{key:"cell(show)",fn:function(a){return[e("div",{staticClass:"text-left"},[a.item.show?t._e():e("span",{staticStyle:{color:"red"}},[e("i",{staticClass:"ion ion-md-remove-circle"})]),t._v(" "),a.item.show?e("span",{staticStyle:{color:"green"}},[e("i",{staticClass:"ion ion-md-add-circle"})]):t._e()])]}},{key:"cell(scrap)",fn:function(a){return[e("div",{staticClass:"text-left"},[t._v("\n                            "+t._s(a.item.scrap)+" / "+t._s(a.item.unds_scrap)+"\n                            ")])]}}],null,!1,549111808)}),t._v(" "),e("div",{staticClass:"d-flex justify-content-between"},[e("div",[e("b-pagination",{staticClass:"my-0",attrs:{"total-rows":t.totalRows,"per-page":t.perPage},model:{value:t.currentPage,callback:function(a){t.currentPage=a},expression:"currentPage"}})],1),t._v(" "),e("div",{staticClass:"text-muted"},[e("small",[t._v(" Total Registros: "+t._s(this.totalRows)+" ")])])])],1):t._e()],1)},i=[],n=(e("e01a"),e("99af"),e("b680"),e("d3b7"),e("ac1f"),e("25f0"),e("5319"),e("28dd")),o=e("2b0e"),l=e("c1df"),r=e.n(l),c=e("133f"),u=e.n(c),d=(e("ca56"),e("86c7"));o["default"].use(n["a"]);var m={components:{datePicker:u.a},data:function(){return{undsIniciales:0,image:null,selectTab:"resumen",manga:0,mangakg:0,total:0,totalConsume:0,undsTotals:0,totalProduct:[],totalSupp:[],totals:{},dateStart:"",dateFinsh:"",tableCompleteData:[],tableData:[],maxVariacion:null,minVariacion:null,globalinfo:{},optionsCalendar:{format:"YYYY-MM-DD"},columnsprod:[{key:"code",sortable:!0,label:"Codigo",stickyColumn:!0},{key:"description",sortable:!0,label:"Descripcion",stickyColumn:!0},{key:"start_amount",sortable:!0,label:"Consumo Inicial (kg)"},{key:"total_consume",sortable:!0,label:"Consumo Real (kg)"},{key:"variacion",sortable:!0,label:"Variacion %"},{key:"undsxkg",sortable:!0,label:"Unidades por (Kg)"}],columnsprv:[{key:"code",sortable:!0,label:"Codigo",stickyColumn:!0},{key:"start_amount",sortable:!0,label:"Consumo Inicial (kg)"},{key:"total_consume",sortable:!0,label:"Consumo Real (kg)"},{key:"variacion",sortable:!0,label:"Variacion %"},{key:"undsxkg",sortable:!0,label:"Unidades por (Kg)"}],columns:[{key:"code",sortable:!0,label:"Codigo",stickyColumn:!0},{key:"description",sortable:!0,label:"Descripcion",stickyColumn:!0},{key:"created",sortable:!0,label:"Fecha"},{key:"supp",sortable:!0,label:"Proveedor"},{key:"product_lote",sortable:!0,label:"Lote"},{key:"start_amount",sortable:!0,label:"Cantidad Inicial Kg"},{key:"total",sortable:!0,label:"Total Kg"},{key:"scrap",sortable:!0,label:"Manga kg/und"},{key:"variacion",sortable:!0,label:"%Variacion"}],currentPage:1,perPage:100,totalRows:0,pageOptions:[100,150,200,250,500,1e3],filter:null}},methods:{numberWithCommas:function(t){return null==t&&(t=0),t=t.toFixed(2),t.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",")},setVariacion:function(){this.tableData=[];for(var t=0;t<this.tableCompleteData.length;t++){var a=this.tableCompleteData[t],e=this.maxVariacion,s=this.minVariacion;0!=this.maxVariacion&&null!=this.maxVariacion||(e=1e7),0!=this.minVariacion&&null!=this.minVariacion||(s=-1e7),a.variacion>s&&a.variacion<e&&this.tableData.push(a),(null==this.maxVariacion&&null==this.minVariacion||0==this.maxVariacion&&0==this.minVariacion)&&(this.tableData=this.tableCompleteData)}this.calcinfototal(),this.totalRows=this.tableData.length,this.currentPage=1},calcinfototal:function(){this.total=0,this.totalConsume=0,this.manga=0,this.mangakg=0,this.undsTotals=0,this.totalProduct=[],this.totalSupp=[],this.totals={};for(var t=0;t<this.tableData.length;t++){var a=this.tableData[t];this.total=this.total+a.start_amount,this.totalConsume=this.totalConsume+a.total,this.undsTotals=this.undsTotals+a.unds,this.manga=this.manga+a.unds_scrap,this.mangakg=this.mangakg+a.scrap;var e=!1,s=!1;if(void 0!=this.totalProduct){for(var i=0;i<this.totalProduct.length;i++){var n=this.totalProduct[i];a.code==n.code&&(e=!0,this.totalProduct[i]["start_amount"]=this.totalProduct[i]["start_amount"]+a.start_amount,this.totalProduct[i]["total_consume"]=this.totalProduct[i]["total_consume"]+a.total,this.totalProduct[i]["unds"]=this.totalProduct[i]["unds"]+a.total)}for(var o=0;o<this.totalSupp.length;o++){var l=this.totalSupp[o];a.supp==l.code&&(s=!0,this.totalSupp[o]["start_amount"]=this.totalSupp[o]["start_amount"]+a.start_amount,this.totalSupp[o]["total_consume"]=this.totalSupp[o]["total_consume"]+a.total,this.totalSupp[o]["unds"]=this.totalSupp[o]["unds"]+a.total)}}e||this.totalProduct.push({code:a.code,description:a.description,start_amount:a.start_amount,total_consume:a.total,unds:a.unds}),s||this.totalSupp.push({code:a.supp,start_amount:a.start_amount,total_consume:a.total,unds:a.unds})}for(var r=[],c=0;c<this.totalProduct.length;c++){var u=this.totalProduct[c];r.push({name:"".concat(u.code," - ").concat(u.description),y:(u.start_amount-u.total_consume)/u.start_amount*100})}for(var d=[],m=0;m<this.totalSupp.length;m++){var p=this.totalSupp[m];d.push({name:"".concat(p.code),y:(p.start_amount-p.total_consume)/p.start_amount*100})}this.chartsprepare("container","Porcentaje de Variacion por Producto",r),this.chartsprepare("container_prov","Porcentaje de Variacion por Proveedor",d)},chartsprepare:function(t,a,e){Highcharts.chart(t,{data:{table:"datatable"},chart:{type:"column"},title:{text:a},yAxis:{allowDecimals:!1,title:{text:"Units"}},series:[{name:"Variacion",data:e}]})},onFiltered:function(t){this.totalRows=t.length,this.currentPage=1},loadData:function(){""!=this.dateStart&&null!=this.dateStart&&this.$http.get(d["d"]+"datasetinfomp/".concat(r()(this.dateStart).format("YYYY-MM-DD"),"/").concat(r()(this.dateFinsh).format("YYYY-MM-DD"))).then((function(t){this.tableData=[],console.log(t);var a=t.body[0].detalle;this.globalinfo=t.body[0].totales;for(var e=0;e<a.length;e++){var s=a[e];s["supp"]=s.product_lote.substring(0,3),s.scrap>=s.start_amount&&(s.scrap=0,s.unds_scrap=0),this.tableData.push(s)}this.tableCompleteData=this.tableData,this.calcinfototal(),this.totalRows=this.tableData.length,this.undsIniciales=this.tableData.length,this.currentPage=1}),(function(t){}))}}},p=m,v=e("2877"),_=Object(v["a"])(p,s,i,!1,null,null,null);a["default"]=_.exports}}]);
//# sourceMappingURL=chunk-18bce13e.0cbf908b.js.map
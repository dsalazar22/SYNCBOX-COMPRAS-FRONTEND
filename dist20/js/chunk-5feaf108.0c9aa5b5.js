(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5feaf108"],{"1a82":function(t,e,o){},"39ba":function(t,e,o){"use strict";o.r(e);var s=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("notifications",{attrs:{group:"notifications-default"}}),t._v(" "),o("h4",{staticClass:"font-weight-bold py-3 mb-2"},[t._v("Rutas de Productos")]),t._v(" "),o("div",{staticClass:"w-100 text-right"}),t._v(" "),o("div",{staticClass:"row"},[o("div",{staticClass:"col"},[o("b-row",[o("b-col",{staticClass:"my-1",attrs:{md:"5"}},[o("b-input-group",[o("b-form-input",{attrs:{placeholder:"Buscar..."},model:{value:t.filter,callback:function(e){t.filter=e},expression:"filter"}}),t._v(" "),o("b-input-group-append",[o("b-btn",{attrs:{disabled:!t.filter},on:{click:function(e){t.filter=""}}},[o("span",{staticClass:"oi oi-delete"})])],1)],1)],1),t._v(" "),o("b-col",{staticClass:"my-1",attrs:{md:"5"}},[o("b-form-select",{attrs:{options:t.pageOptions},model:{value:t.perPage,callback:function(e){t.perPage=e},expression:"perPage"}})],1),t._v(" "),o("b-col",{staticClass:"d-flex justify-content-center my-1",attrs:{md:"2"}},[t.check_access("products_route","c")?o("b-btn",{directives:[{name:"b-modal",rawName:"v-b-modal.modals-default",modifiers:{"modals-default":!0}}],staticClass:"btn-md",attrs:{variant:"outline-success icon-btn",to:"routes/details"}},[o("i",{staticClass:"ion ion-md-add"})]):t._e(),t._v(" \n                            "),o("b-btn",{directives:[{name:"b-modal",rawName:"v-b-modal.modals-default",modifiers:{"modals-default":!0}}],staticClass:"btn-md",attrs:{variant:"outline-info icon-btn"},on:{click:function(e){return e.preventDefault(),t.openHelp(e)}}},[o("i",{staticClass:"fas fa-chalkboard-teacher"})])],1)],1),t._v(" "),o("b-table",{attrs:{small:"","show-empty":"",stacked:"md",items:t.tableData,fields:t.columns,"current-page":t.currentPage,"per-page":t.perPage,filter:t.filter},on:{filtered:t.onFiltered},scopedSlots:t._u([{key:"cell(edit)",fn:function(e){return[o("div",{staticClass:"text-center"},[t.check_access("products_route","w")?o("b-btn",{staticClass:"btn-xs",attrs:{variant:"outline-success borderless icon-btn",to:{path:"routes/details/"+e.item.route_id+"/"+e.item.route_product_id+"/"+e.item.product_id}}},[o("i",{staticClass:"ion ion-md-create"})]):t._e(),t._v(" "),t.check_access("products_route","d")?o("b-btn",{staticClass:"btn-xs",attrs:{variant:"outline-danger borderless icon-btn"},on:{click:function(o){return o.preventDefault(),t.data_change(e.item,"delete")}}},[o("i",{staticClass:"ion ion-md-close"})]):t._e()],1)]}}])}),t._v(" "),o("div",{staticClass:"d-flex justify-content-between"},[o("div",[o("b-pagination",{staticClass:"my-0",attrs:{"total-rows":t.totalRows,"per-page":t.perPage},model:{value:t.currentPage,callback:function(e){t.currentPage=e},expression:"currentPage"}})],1),t._v(" "),o("div",{staticClass:"text-muted"},[o("small",[t._v(" Total Rutas de Productos: "+t._s(this.totalRows)+" ")])])])],1)]),t._v(" "),o("div",{staticClass:"d-inline-block"},[o("sweet-modal",{ref:"errorWithButtonAlert",attrs:{icon:"error",title:"Borrar registro"}},[t._v("\n            ¿Está seguro que desea borrar el registro?\n            "),o("div",{staticClass:"w-100 text-center"},[t._v("\n                El registro será borrado de forma lógica, pero su información será visible en reportes. \n            ")]),t._v(" "),o("template",{slot:"button"},[o("b-btn",{staticClass:"mr-2",attrs:{variant:"danger"},on:{click:function(e){return t.deleteRecord()}}},[t._v("Eliminar")])],1),t._v(" "),o("template",{slot:"button"},[o("b-btn",{attrs:{variant:"primary"},on:{click:function(e){return t.closeDeleteRecord()}}},[t._v("Cerrar")])],1)],2)],1),t._v(" "),o("b-modal",{staticClass:"modal-center",attrs:{id:"modals-top",size:"md"},model:{value:t.showFormulario,callback:function(e){t.showFormulario=e},expression:"showFormulario"}},[o("div",{attrs:{slot:"modal-title"},slot:"modal-title"},[t._v("\n        Administrar "),o("span",{staticClass:"font-weight-light"},[t._v("Grupos de Centros de Trabajo")]),o("br"),t._v(" "),o("small",{class:t.infostatus},[t._v("El código del centro de trabajo, enlaza el equipo que esta siendo monitoreado desde el PLC.")])]),t._v(" "),o("fieldset",{staticClass:"demo-vertical-spacing-sm"},[o("b-form-group",[o("b-input",{attrs:{placeholder:"Descripción",disabled:t.disabledcode},model:{value:t.objInfo.description,callback:function(e){t.$set(t.objInfo,"description","string"===typeof e?e.trim():e)},expression:"objInfo.description"}})],1),t._v(" "),o("div",[o("div",{staticClass:"row"},[o("div",{staticClass:"col text-center"},[o("b-form-group",{staticClass:"text-left"},[o("label",{staticClass:"switcher switcher-success"},[o("input",{directives:[{name:"model",rawName:"v-model",value:t.objInfo.show,expression:"objInfo.show"}],staticClass:"switcher-input",attrs:{type:"checkbox",disabled:!t.objInfo.active},domProps:{checked:Array.isArray(t.objInfo.show)?t._i(t.objInfo.show,null)>-1:t.objInfo.show},on:{change:function(e){var o=t.objInfo.show,s=e.target,a=!!s.checked;if(Array.isArray(o)){var r=null,n=t._i(o,r);s.checked?n<0&&t.$set(t.objInfo,"show",o.concat([r])):n>-1&&t.$set(t.objInfo,"show",o.slice(0,n).concat(o.slice(n+1)))}else t.$set(t.objInfo,"show",a)}}}),t._v(" "),o("span",{staticClass:"switcher-indicator"},[o("span",{staticClass:"switcher-yes"},[o("span",{staticClass:"ion ion-md-checkmark"})]),t._v(" "),o("span",{staticClass:"switcher-no"},[o("span",{staticClass:"ion ion-md-close"})])]),t._v(" "),o("span",{staticClass:"switcher-label"},[t._v("Publica")])]),t._v(" "),o("label",{staticClass:"switcher switcher-success mt-2"},[o("input",{directives:[{name:"model",rawName:"v-model",value:t.objInfo.active,expression:"objInfo.active"}],staticClass:"switcher-input",attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.objInfo.active)?t._i(t.objInfo.active,null)>-1:t.objInfo.active},on:{change:[function(e){var o=t.objInfo.active,s=e.target,a=!!s.checked;if(Array.isArray(o)){var r=null,n=t._i(o,r);s.checked?n<0&&t.$set(t.objInfo,"active",o.concat([r])):n>-1&&t.$set(t.objInfo,"active",o.slice(0,n).concat(o.slice(n+1)))}else t.$set(t.objInfo,"active",a)},function(e){return t.checkActive(t.objInfo.active)}]}}),t._v(" "),o("span",{staticClass:"switcher-indicator"},[o("span",{staticClass:"switcher-yes"},[o("span",{staticClass:"ion ion-md-checkmark"})]),t._v(" "),o("span",{staticClass:"switcher-no"},[o("span",{staticClass:"ion ion-md-close"})])]),t._v(" "),o("span",{staticClass:"switcher-label"},[t._v("Activa")])])])],1)])])],1),t._v(" "),o("div",{staticClass:"w-100 text-right",attrs:{slot:"modal-footer"},slot:"modal-footer"},[o("b-btn",{attrs:{variant:"primary"},on:{click:function(e){return t.cancel()}}},[t._v("Cancelar")]),t._v(" "),o("b-btn",{attrs:{variant:t.variantSaveButton},on:{click:function(e){return t.submit()}}},[t._v("Guardar")])],1)]),t._v(" "),o("sweet-modal",{ref:"longModal"},[o("div",{staticClass:"text-left"},[o("vue-markdown",{attrs:{source:t.contentWiki,"anchor-attributes":t.anchorAttrs}})],1)])],1)},a=[],r=(o("b0c0"),o("2b0e")),n=o("b0ae"),i=o("d5a1"),c=o("be23"),l=o("48fc"),u=o("ee98"),d=o.n(u),f=o("9ce6"),p=o.n(f);r["default"].use(d.a);var b={metaInfo:{title:"Rutas de Productos"},components:{VueMarkdown:p.a,SweetModal:n["a"],SweetModalTab:n["b"]},data:function(){return{name:"routes",version:"v1.0.0.0",contentWiki:"",anchorAttrs:{target:"_blank",rel:"noopener noreferrer nofollow"},currentPage:1,perPage:50,totalRows:0,pageOptions:[50,100,200],filter:null,showFormulario:!1,variantSaveButton:"success",disabledcode:!1,modified:!1,tableData:[],columns:[{key:"product_code",label:"Código"},{key:"product_description",label:"Producto"},{key:"description",label:"Ruta"},{key:"version",label:"Version"},{key:"edit",label:"Edit"}],objInfo:{id:0}}},methods:{restartInfo:function(){this.objInfo={id:0}},openHelp:function(){var t=this;Object(c["a"])(this.version,this.name).then((function(e){t.contentWiki=e.data})).catch((function(e){t.contentWiki=e.data})),this.$refs.longModal.open()},onFiltered:function(t){this.totalRows=t.length,this.currentPage=1},showCustom:function(t,e,o){this.$notify({group:"notifications-default",type:t,title:e,text:o})},addData:function(){this.restartInfo(),this.showFormulario=!0},cancel:function(){this.restartInfo(),this.showFormulario=!1},closeDeleteRecord:function(){this.restartInfo(),this.$refs.errorWithButtonAlert.close()},deleteRecord:function(){var t=this;i["a"].routes(this.objInfo,"delete").then((function(e){202===e.status?t.showCustom("bg-danger text-white","Error","Error al Eliminar el Registro!"):(t.showCustom("bg-success text-white","Registro Eliminado","El Registro se ha Eliminado con Éxito!"),t.tableData=e.data,t.totalRows=t.tableData.length,t.restartInfo()),t.dismissCountDown=t.dismissSecs,t.showData()})).catch((function(t){console.log(t.status)})),this.$refs.errorWithButtonAlert.close()},showData:function(){var t=this;i["a"].routes([],"0","select-template").then((function(e){t.tableData=e.data,t.totalRows=t.tableData.length}))},data_change:function(t,e){this.variantSaveButton="warning",this.objInfo=t,"edit"===e?this.showFormulario=!0:this.$refs.errorWithButtonAlert.open()},check_access:function(t,e){return l["a"].check_access(t,e)}},created:function(){this.showData()}},m=b,v=(o("8e35"),o("d717"),o("2877")),h=Object(v["a"])(m,s,a,!1,null,null,null);e["default"]=h.exports},"6b9d":function(t,e,o){},"8e35":function(t,e,o){"use strict";var s=o("1a82"),a=o.n(s);a.a},d5a1:function(t,e,o){"use strict";o.d(e,"a",(function(){return i}));var s=o("bc3a"),a=o.n(s),r=o("86c7"),n={headers:{Authorization:null==localStorage.getItem("syncbox.cloud")?"":JSON.parse(localStorage.getItem("syncbox.cloud")).token}},i={routes:function(t,e,o){return a.a.post(r["a"]+"routes/"+o+"/"+e,t,n)},routeOperations:function(t,e,o){return a.a.post(r["a"]+"routeoperations/"+o+"/"+e,t,n)},routeOperationsProcess:function(t,e,o,s){return a.a.post(r["a"]+"routeoperationsprocess/"+s+"/"+e+"/"+o,t,n)},products:function(t,e,o){return a.a.post(r["a"]+"productscontrol/"+o+"/"+e,t,n)},process:function(t,e){return a.a.post(r["a"]+"processDefinition/"+e,t,n)},workstationprocess:function(t,e){return a.a.post(r["a"]+"workstationprocess/"+e,t,n)},tools:function(t,e){return a.a.post(r["a"]+"tools/"+e,t,n)},producttools:function(t,e,o){return a.a.post(r["a"]+"producttools/"+o+"/"+e,t,n)},customerproducts:function(t,e){return a.a.post(r["a"]+"customerproducts/"+e,t,n)},supplierproducts:function(t,e){return a.a.post(r["a"]+"supplierproducts/"+e,t,n)},typeroute:function(){return a.a.post(r["a"]+"typerouteoperation",n)},routeproduct:function(t,e,o){return a.a.post(r["a"]+"routeproduct/"+o+"/"+e,t,n)},billofmaterialscontrol:function(t,e,o){return a.a.post(r["a"]+"billofmaterialscontrol/"+o+"/"+e,t,n)},detailsbillofmaterialscontrol:function(t,e,o){return a.a.post(r["a"]+"detailsbillofmaterialscontrol/"+o+"/"+e,t,n)},productstructure:function(t,e){return a.a.get(r["a"]+"productstructure/"+t+"/"+e,n)},teamsconfig:function(t,e){return a.a.post(r["a"]+"teamsconfig/"+e,t,n)},controllercontact:function(t,e){return a.a.post(r["a"]+"controllercontact/"+e,t,n)},fieldsconfig:function(t,e){return a.a.post(r["a"]+"fieldsconfig/"+e,t,n)},userswsgroup:function(t){return a.a.post(r["a"]+"userswsgroup",t,n)},getuserswsgroup:function(t){return a.a.get(r["a"]+"userswsgroup/"+t,n)}}},d717:function(t,e,o){"use strict";var s=o("6b9d"),a=o.n(s);a.a}}]);
//# sourceMappingURL=chunk-5feaf108.0c9aa5b5.js.map
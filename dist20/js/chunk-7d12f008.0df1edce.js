(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7d12f008"],{"1a82":function(t,e,s){},"8e35":function(t,e,s){"use strict";var a=s("1a82"),i=s.n(a);i.a},c616:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("b-table",{attrs:{small:"","show-empty":"",stacked:"md",items:t.tableParts,fields:t.columnsBOM},scopedSlots:t._u([{key:"cell(sequence)",fn:function(e){return[s("b-btn",{staticClass:"btn-sm",attrs:{variant:"outline-success borderless"},on:{click:function(s){return t.loadRecetas(e)}}},[e.detailsShowing?t._e():s("span",{staticClass:"ion ion-md-add"}),t._v(" "),e.detailsShowing?s("span",{staticClass:"ion ion-md-remove"}):t._e()]),t._v("\n\n            "+t._s(e.item.sequence)+"\n        ")]}},{key:"cell(default)",fn:function(e){return[s("div",{staticClass:"text-center"},[e.item.default?s("span",{staticClass:"text-success"},[s("i",{staticClass:"ion ion-md-checkmark"})]):t._e(),t._v(" "),e.item.default?t._e():s("b-btn",{staticClass:"btn-xs",attrs:{variant:"outline-danger borderless icon-btn"},on:{click:function(s){return s.preventDefault(),t.setDefaulBOMProduct(e.item)}}},[s("i",{staticClass:"ion ion-md-close"})])],1)]}},{key:"cell(edit)",fn:function(e){return[s("div",{staticClass:"text-left"},[s("b-btn",{staticClass:"btn-xs",attrs:{variant:"outline-success borderless icon-btn",target:"_blank"},on:{click:function(s){return s.preventDefault(),t.editChildProduct(e.item)}}},[s("i",{staticClass:"ion ion-md-create"})]),t._v(" "),s("b-btn",{staticClass:"btn-xs",attrs:{variant:"outline-danger borderless icon-btn"},on:{click:function(s){s.preventDefault(),t.delete_option_mp="grid",t.loadInfoToDelete(e.item)}}},[s("i",{staticClass:"ion ion-md-close"})]),t._v(" "),null!=e.item.product_id&&null!=e.item.details?s("b-btn",{staticClass:"btn-xs",attrs:{variant:"outline-success borderless icon-btn"},on:{click:function(s){s.preventDefault(),t.addDuration=!0,t.infoMeasure=e.item.details}}},[s("i",{staticClass:"fas fa-heartbeat"})]):t._e(),t._v(" "),null!=e.item.product_id&&null==e.item.details?s("b-btn",{staticClass:"btn-xs",attrs:{variant:"outline-danger borderless icon-btn"},on:{click:function(s){s.preventDefault(),t.addDuration=!0,t.infoMeasure=e.item.details}}},[s("i",{staticClass:"fas fa-heartbeat"})]):t._e()],1)]}},{key:"row-details",fn:function(e){return[s("b-card",{staticClass:"border border-info"},[s("bom-controller",{attrs:{assets_parent_id:e.item.assets_parts_id,assets_child_id:e.item.assets_parts_id,tableBOM:t.listDefinitionBOM["key_"+e.item.assets_parts_id.toString()],src:t.src}})],1)]}}])}),t._v(" "),s("b-modal",{attrs:{id:"bv-modal-example","hide-footer":"",size:"xl"},scopedSlots:t._u([{key:"modal-title",fn:function(){return[t._v("\n            Estado de los Componentes\n        ")]},proxy:!0}]),model:{value:t.addDuration,callback:function(e){t.addDuration=e},expression:"addDuration"}},[t._v(" "),s("div",{staticClass:"d-block text-center mt-1 mb-3"},[s("b-table",{attrs:{small:"","show-empty":"",stacked:"md",items:t.infoMeasure,fields:t.columnsMeasure}})],1),t._v(" "),s("b-button",{staticClass:"mt-3",attrs:{block:""},on:{click:function(e){return t.$bvModal.hide("bv-modal-example")}}},[t._v("Cerrar")])],1),t._v(" "),t.showAddEditMaterialsDetails?s("div",[s("div",{staticClass:"position-relative mb-2 mt-2"},[s("b-card",{staticClass:"mb-4",attrs:{header:"Adicionar Nueva Parte","header-tag":"h6"}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col"},[s("div",{staticClass:"position-relative"},[s("b-input-group",[t.loading?s("b-input-group-text",{attrs:{slot:"prepend"},slot:"prepend"},[s("i",{staticClass:"ion ion-md-sync"})]):t._e(),t._v(" "),t.loading?t._e():s("b-input-group-text",{attrs:{slot:"prepend"},slot:"prepend"},[s("i",{staticClass:"ion ion-ios-search"})]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.valueProduct,expression:"valueProduct"}],staticClass:"form-control",attrs:{type:"text",placeholder:"Seleccione un Producto",autocomplete:"off"},domProps:{value:t.valueProduct},on:{keydown:[function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"])?null:t.down(e)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"])?null:t.up(e)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.hit(e)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"esc",27,e.key,["Esc","Escape"])?null:t.reset(e)}],blur:t.reset,input:[function(e){e.target.composing||(t.valueProduct=e.target.value)},t.updateQueryProducto]}}),t._v(" "),t.isDirty||t.valueProduct?s("b-input-group-text",{attrs:{slot:"append"},on:{click:t.resetInput},slot:"append"},[s("i",{staticClass:"ion ion-md-close"})]):t._e()],1),t._v(" "),s("div",{staticClass:"dropdown-menu",class:{"d-block":t.hasItems},style:{left:t.isRTL?"auto":0,right:t.isRTL?0:"auto"}},t._l(t.items,(function(e,a){return s("a",{staticClass:"dropdown-item",class:t.activeClass(a),attrs:{href:"javascript:void(0)"},on:{mousedown:t.hit,mousemove:function(e){return t.setActive(a)}}},[s("span",{staticClass:"name",domProps:{textContent:t._s(e.code)}}),t._v(" "),s("span",{staticClass:"text-muted"},[t._v(t._s(e.description))])])})),0)],1)])]),t._v(" "),s("b-form-row",{staticClass:"mt-2"},[s("b-form-group",{staticClass:"col-md-6",attrs:{label:"Codigo"}},[s("b-input",{attrs:{placeholder:"Codigo",required:""},model:{value:t.itemNewDetailBOM.code,callback:function(e){t.$set(t.itemNewDetailBOM,"code","string"===typeof e?e.trim():e)},expression:"itemNewDetailBOM.code"}})],1),t._v(" "),s("b-form-group",{staticClass:"col-md-6",attrs:{label:"Descripción"}},[s("b-input",{attrs:{placeholder:"Descripción",required:""},model:{value:t.itemNewDetailBOM.description,callback:function(e){t.$set(t.itemNewDetailBOM,"description","string"===typeof e?e.trim():e)},expression:"itemNewDetailBOM.description"}})],1)],1),t._v(" "),s("b-form-row",{staticClass:"mt-2"},[s("b-form-group",{staticClass:"col-md-6",attrs:{label:"Secuencia"}},[s("b-input",{attrs:{type:"number",placeholder:"Secuencia",required:""},model:{value:t.itemNewDetailBOM.sequence,callback:function(e){t.$set(t.itemNewDetailBOM,"sequence","string"===typeof e?e.trim():e)},expression:"itemNewDetailBOM.sequence"}})],1),t._v(" "),s("b-form-group",{staticClass:"col-md-6",attrs:{label:"Cantidad por Padre"}},[s("b-input",{attrs:{type:"number",placeholder:"Cantidad por Padre",required:""},model:{value:t.itemNewDetailBOM.amount_per_parent,callback:function(e){t.$set(t.itemNewDetailBOM,"amount_per_parent","string"===typeof e?e.trim():e)},expression:"itemNewDetailBOM.amount_per_parent"}})],1)],1),t._v(" "),s("div",{staticClass:"text-right"},[s("b-button",{attrs:{size:"md",variant:"primary",autocomplete:"off"},on:{click:function(e){t.showAddEditMaterialsDetails=!1,t.itemNewDetailBOM={sequence:null,assets_parts_id:0,amount_per_parent:null,parent_id:0,assets_parts_child_id:null,assets_id:null,product_id:null},t.valueProduct=""}}},[t._v("Cancelar")]),t._v(" "),s("b-button",{attrs:{size:"md",variant:"success"},on:{click:function(e){return t.save_new_product()}}},[t._v("Guardar")])],1)],1)],1)]):t._e(),t._v(" "),s("div",{staticClass:"d-flex justify-content-between"},[s("div"),t._v(" "),s("div",{staticClass:"text-right mb-2"},[s("b-btn",{staticClass:"btn-sm",attrs:{variant:"outline-success borderless"},on:{click:function(e){e.preventDefault(),t.showAddEditMaterialsDetails=!0}}},[s("span",{staticClass:"ion ion-md-add"}),t._v("  Adicionar Nueva Parte\n                            ")])],1)]),t._v(" "),s("sweet-modal",{ref:"errorWithButtonAlert",attrs:{icon:"error",title:"Borrar registro"}},[s("div",{staticClass:"w-100 text-danger"},[s("strong")]),t._v("\n                    ¿Está seguro que desea borrar el registro?\n                    "),s("div",{staticClass:"w-100 text-center"},[t._v("\n                        "+t._s(t.mensaje_borrado)+"\n                    ")]),t._v(" "),s("template",{slot:"button"},[s("b-btn",{staticClass:"mr-2",attrs:{variant:"danger"},on:{click:function(e){return t.deleteRecord()}}},[t._v("Eliminar")])],1),t._v(" "),s("template",{slot:"button"},[s("b-btn",{attrs:{variant:"primary"},on:{click:function(e){return t.$refs.errorWithButtonAlert.close()}}},[t._v("Cerrar")])],1)],2)],1)},i=[],r=(s("e01a"),s("a9e3"),s("d3b7"),s("25f0"),s("96cf"),s("1da1")),n=s("ff5a"),o=s.n(n),l=s("b0ae"),u=(s("d5a1"),s("9b97"));var c={extends:o.a,props:{assets_parent_id:{type:Number},assets_child_id:{type:Number},src:{type:String},tableBOM:{type:Array}},components:{SweetModal:l["a"],SweetModalTab:l["b"],"bom-controller":function(){return Promise.resolve().then(s.bind(null,"c616"))}},watch:{assets_parent_id:function(t){}},data:function(){return{addDuration:!1,showAddEditMaterialsDetails:!1,unityMeasure:null,infoMeasure:[],columnsMeasure:[{key:"duration",label:"Medida"},{key:"max_value",label:"Valor Maximo"},{key:"current_value",label:"Valor Actual"},{key:"pending_value",label:"Pendiente"},{key:"percentage_pending_value",label:"% Consumo"}],valueProduct:"",mensaje_borrado:"",itemDelete:{},itemNewDetailBOM:{sequence:null,assets_parts_id:0,amount_per_parent:null,parent_id:0,assets_parts_child_id:null,assets_id:null,product_id:null},columnsBOM:[{key:"sequence",label:"Orden"},{key:"code",label:"Código"},{key:"description",label:"Descripción"},{key:"amount_per_parent",label:"Cantidad x Padre"},{key:"edit",label:"Edit"}],itemProductSelected:{},listDefinitionBOM:[],selectedVersion:null,tableParts:this.tableBOM}},methods:{loadRecetas:function(t){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function s(){var a;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return a=[],e.listDefinitionBOM["key_"+t.item.assets_parts_id.toString()]=[],s.next=4,u["a"].assetsParts(t.item.assets_parts_id,"select-child").then((function(s){202===s.status?e.showCustom("bg-danger text-white","Error","¡Error!"):""!=s.data&&(e.details_materials=s.data,e.listDefinitionBOM["key_"+t.item.assets_parts_id.toString()]=s.data)})).catch((function(t){console.log(t.status)}));case 4:return t.toggleDetails(),s.abrupt("return",a);case 6:case"end":return s.stop()}}),s)})))()},resultado:function(t){return $createElement(BOMController)},showCustom:function(t,e,s){this.$notify({group:"notifications-default",type:t,title:e,text:s})},loadInfoToDelete:function(t){this.$refs.errorWithButtonAlert.open(),this.itemDelete=t,this.itemDelete.product_id=this.id_product},deleteRecord:function(){var t=this;u["a"].assetsParts(this.itemDelete,"delete").then((function(e){if(202===e.status)t.showCustom("bg-danger text-white","Error","¡Error al Eliminar el Registro!");else{t.showCustom("bg-success text-white","Registro Borrado","¡El Registro se ha Borrado con Éxito!"),t.tableParts=[];for(var s=0;s<e.data.length;s++){var a=e.data[s];a.bill_of_materials_id==t.itemDelete.bill_of_materials_id&&(t.tableParts=a.details_materials)}""!=e.data&&void 0==t.tableParts&&(t.tableParts=e.data),t.showAddEditMaterials=!1,t.itemNewDetailBOM={sequence:null,assets_parts_id:0,amount_per_parent:null,parent_id:0,assets_parts_child_id:null,assets_id:null,product_id:null},t.valueProduct="",t.$refs.errorWithButtonAlert.close()}}))},save_new_product:function(){var t=this;if(this.itemNewDetailBOM.assets_id=this.$route.params.id,0==this.assets_child_id?this.itemNewDetailBOM.assets_child_id=null:(this.itemNewDetailBOM.parent_id=this.itemNewDetailBOM.assets_parts_id,this.itemNewDetailBOM.assets_parts_child_id=this.itemNewDetailBOM.assets_parts_id),0==this.itemNewDetailBOM.child_id&&(this.itemNewDetailBOM.child_id=this.itemProductSelected.product_id),this.itemNewDetailBOM.parent_id=this.assets_parent_id,null==this.itemNewDetailBOM.description||null==this.itemNewDetailBOM.code||null==this.itemNewDetailBOM.sequence||null==this.itemNewDetailBOM.amount_per_parent)this.showCustom("bg-danger text-white","Error","¡La información está incompleta!");else{var e="insert";0!=this.itemNewDetailBOM.assets_parts_id&&(e="update"),u["a"].assetsParts(this.itemNewDetailBOM,e).then((function(e){202===e.status?t.showCustom("bg-danger text-white","Error","¡Error al Crear el Registro!"):(t.showCustom("bg-success text-white","Registro Creado","¡El Registro se ha Creado con Éxito!"),t.tableParts=[],""!=e.data&&(t.tableParts=e.data,t.showAddEditMaterials=!1,t.itemNewDetailBOM={sequence:null,assets_parts_id:0,amount_per_parent:null,parent_id:0,assets_parts_child_id:null,assets_id:null,product_id:null},t.valueProduct=""))}))}},editChildProduct:function(t){this.showAddEditMaterialsDetails=!0,this.itemNewDetailBOM=JSON.parse(JSON.stringify(t)),this.valueProduct=t.description},editMeterials:function(t){this.itemNewDefinitionBOM=t,this.showAddEditMaterials=!0},updateQueryProducto:function(){this.query=this.valueProduct,this.update()},resetInput:function(){this.valueProduct="",this.reset()},onHit:function(t){this.itemNewDetailBOM.description=t.description,this.itemNewDetailBOM.code=t.code,this.itemNewDetailBOM.product_id=t.product_id,this.valueProduct=t.description,this.itemProductSelected=t}}},d=c,p=(s("8e35"),s("2877")),m=Object(p["a"])(d,a,i,!1,null,null,null);e["default"]=m.exports},d5a1:function(t,e,s){"use strict";s.d(e,"a",(function(){return o}));var a=s("bc3a"),i=s.n(a),r=s("86c7"),n={headers:{Authorization:null==localStorage.getItem("syncbox.cloud")?"":JSON.parse(localStorage.getItem("syncbox.cloud")).token}},o={routes:function(t,e,s){return i.a.post(r["a"]+"routes/"+s+"/"+e,t,n)},routeOperations:function(t,e,s){return i.a.post(r["a"]+"routeoperations/"+s+"/"+e,t,n)},routeOperationsProcess:function(t,e,s,a){return i.a.post(r["a"]+"routeoperationsprocess/"+a+"/"+e+"/"+s,t,n)},products:function(t,e,s){return i.a.post(r["a"]+"productscontrol/"+s+"/"+e,t,n)},process:function(t,e){return i.a.post(r["a"]+"processDefinition/"+e,t,n)},workstationprocess:function(t,e){return i.a.post(r["a"]+"workstationprocess/"+e,t,n)},tools:function(t,e){return i.a.post(r["a"]+"tools/"+e,t,n)},producttools:function(t,e,s){return i.a.post(r["a"]+"producttools/"+s+"/"+e,t,n)},customerproducts:function(t,e){return i.a.post(r["a"]+"customerproducts/"+e,t,n)},supplierproducts:function(t,e){return i.a.post(r["a"]+"supplierproducts/"+e,t,n)},typeroute:function(){return i.a.post(r["a"]+"typerouteoperation",n)},routeproduct:function(t,e,s){return i.a.post(r["a"]+"routeproduct/"+s+"/"+e,t,n)},billofmaterialscontrol:function(t,e,s){return i.a.post(r["a"]+"billofmaterialscontrol/"+s+"/"+e,t,n)},detailsbillofmaterialscontrol:function(t,e,s){return i.a.post(r["a"]+"detailsbillofmaterialscontrol/"+s+"/"+e,t,n)},productstructure:function(t,e){return i.a.get(r["a"]+"productstructure/"+t+"/"+e,n)},teamsconfig:function(t,e){return i.a.post(r["a"]+"teamsconfig/"+e,t,n)},controllercontact:function(t,e){return i.a.post(r["a"]+"controllercontact/"+e,t,n)},fieldsconfig:function(t,e){return i.a.post(r["a"]+"fieldsconfig/"+e,t,n)},userswsgroup:function(t){return i.a.post(r["a"]+"userswsgroup",t,n)},getuserswsgroup:function(t){return i.a.get(r["a"]+"userswsgroup/"+t,n)}}}}]);
//# sourceMappingURL=chunk-7d12f008.0df1edce.js.map
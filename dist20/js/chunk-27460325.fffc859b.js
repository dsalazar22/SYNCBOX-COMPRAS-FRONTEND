(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-27460325"],{"06c5":function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));n("a630"),n("fb6a"),n("b0c0"),n("d3b7"),n("25f0"),n("3ca3");var a=n("6b75");function i(t,e){if(t){if("string"===typeof t)return Object(a["a"])(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Object(a["a"])(t,e):void 0}}},"23ca":function(t,e,n){"use strict";(function(t){n.d(e,"c",(function(){return l})),n.d(e,"a",(function(){return s})),n.d(e,"b",(function(){return i})),n.d(e,"d",(function(){return c}));n("ac1f"),n("5319");function a(){return"undefined"!==typeof window?window.console:t.console}var i=a();function o(t){var e=Object.create(null);return function(n){var a=e[n];return a||(e[n]=t(n))}}var r=/-(\w)/g,s=o((function(t){return t.replace(r,(function(t,e){return e?e.toUpperCase():""}))}));function c(t){null!==t.parentElement&&t.parentElement.removeChild(t)}function l(t,e,n){var a=0===n?t.children[0]:t.children[n-1].nextSibling;t.insertBefore(e,a)}}).call(this,n("c8ba"))},2909:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var a=n("6b75");function i(t){if(Array.isArray(t))return Object(a["a"])(t)}n("e01a"),n("d28b"),n("a630"),n("d3b7"),n("3ca3"),n("ddb0");function o(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}var r=n("06c5");function s(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(t){return i(t)||o(t)||Object(r["a"])(t)||s()}},"5e15":function(t,e,n){"use strict";n("99af"),n("4de4"),n("4160"),n("c975"),n("d81d"),n("13d5"),n("a434"),n("2ca0");function a(t){if(Array.isArray(t))return t}n("e01a"),n("d28b"),n("d3b7"),n("3ca3"),n("ddb0");function i(t,e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t)){var n=[],a=!0,i=!1,o=void 0;try{for(var r,s=t[Symbol.iterator]();!(a=(r=s.next()).done);a=!0)if(n.push(r.value),e&&n.length===e)break}catch(c){i=!0,o=c}finally{try{a||null==s["return"]||s["return"]()}finally{if(i)throw o}}return n}}var o=n("06c5");function r(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function s(t,e){return a(t)||i(t,e)||Object(o["a"])(t,e)||r()}var c=n("2909"),l=n("8a23"),d=n("23ca");function u(t,e,n){return void 0===n||(t=t||{},t[e]=n),t}function f(t,e){return t.map((function(t){return t.elm})).indexOf(e)}function p(t,e,n,a){if(!t)return[];var i=t.map((function(t){return t.elm})),o=e.length-a,r=Object(c["a"])(e).map((function(t,e){return e>=o?i.length:i.indexOf(t)}));return n?r.filter((function(t){return-1!==t})):r}function v(t,e){var n=this;this.$nextTick((function(){return n.$emit(t.toLowerCase(),e)}))}function h(t){var e=this;return function(n){null!==e.realList&&e["onDrag"+t](n),v.call(e,t,n)}}function m(t){return["transition-group","TransitionGroup"].includes(t)}function b(t){if(!t||1!==t.length)return!1;var e=s(t,1),n=e[0].componentOptions;return!!n&&m(n.tag)}function g(t,e,n){return t[n]||(e[n]?e[n]():void 0)}function _(t,e,n){var a=0,i=0,o=g(e,n,"header");o&&(a=o.length,t=t?[].concat(Object(c["a"])(o),Object(c["a"])(t)):Object(c["a"])(o));var r=g(e,n,"footer");return r&&(i=r.length,t=t?[].concat(Object(c["a"])(t),Object(c["a"])(r)):Object(c["a"])(r)),{children:t,headerOffset:a,footerOffset:i}}function C(t,e){var n=null,a=function(t,e){n=u(n,t,e)},i=Object.keys(t).filter((function(t){return"id"===t||t.startsWith("data-")})).reduce((function(e,n){return e[n]=t[n],e}),{});if(a("attrs",i),!e)return n;var o=e.on,r=e.props,s=e.attrs;return a("on",o),a("props",r),Object.assign(n.attrs,s),n}var x=["Start","Add","Remove","Update","End"],w=["Choose","Unchoose","Sort","Filter","Clone"],y=["Move"].concat(x,w).map((function(t){return"on"+t})),O=null,A={options:Object,list:{type:Array,required:!1,default:null},value:{type:Array,required:!1,default:null},noTransitionOnDrag:{type:Boolean,default:!1},clone:{type:Function,default:function(t){return t}},element:{type:String,default:"div"},tag:{type:String,default:null},move:{type:Function,default:null},componentData:{type:Object,required:!1,default:null}},D={name:"draggable",inheritAttrs:!1,props:A,data:function(){return{transitionMode:!1,noneFunctionalComponentMode:!1}},render:function(t){var e=this.$slots.default;this.transitionMode=b(e);var n=_(e,this.$slots,this.$scopedSlots),a=n.children,i=n.headerOffset,o=n.footerOffset;this.headerOffset=i,this.footerOffset=o;var r=C(this.$attrs,this.componentData);return t(this.getTag(),r,a)},created:function(){null!==this.list&&null!==this.value&&d["b"].error("Value and list props are mutually exclusive! Please set one or another."),"div"!==this.element&&d["b"].warn("Element props is deprecated please use tag props instead. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#element-props"),void 0!==this.options&&d["b"].warn("Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props")},mounted:function(){var t=this;if(this.noneFunctionalComponentMode=this.getTag().toLowerCase()!==this.$el.nodeName.toLowerCase()&&!this.getIsFunctional(),this.noneFunctionalComponentMode&&this.transitionMode)throw new Error("Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ".concat(this.getTag()));var e={};x.forEach((function(n){e["on"+n]=h.call(t,n)})),w.forEach((function(n){e["on"+n]=v.bind(t,n)}));var n=Object.keys(this.$attrs).reduce((function(e,n){return e[Object(d["a"])(n)]=t.$attrs[n],e}),{}),a=Object.assign({},this.options,n,e,{onMove:function(e,n){return t.onDragMove(e,n)}});!("draggable"in a)&&(a.draggable=">*"),this._sortable=new l["default"](this.rootContainer,a),this.computeIndexes()},beforeDestroy:function(){void 0!==this._sortable&&this._sortable.destroy()},computed:{rootContainer:function(){return this.transitionMode?this.$el.children[0]:this.$el},realList:function(){return this.list?this.list:this.value}},watch:{options:{handler:function(t){this.updateOptions(t)},deep:!0},$attrs:{handler:function(t){this.updateOptions(t)},deep:!0},realList:function(){this.computeIndexes()}},methods:{getIsFunctional:function(){var t=this._vnode.fnOptions;return t&&t.functional},getTag:function(){return this.tag||this.element},updateOptions:function(t){for(var e in t){var n=Object(d["a"])(e);-1===y.indexOf(n)&&this._sortable.option(n,t[e])}},getChildrenNodes:function(){if(this.noneFunctionalComponentMode)return this.$children[0].$slots.default;var t=this.$slots.default;return this.transitionMode?t[0].child.$slots.default:t},computeIndexes:function(){var t=this;this.$nextTick((function(){t.visibleIndexes=p(t.getChildrenNodes(),t.rootContainer.children,t.transitionMode,t.footerOffset)}))},getUnderlyingVm:function(t){var e=f(this.getChildrenNodes()||[],t);if(-1===e)return null;var n=this.realList[e];return{index:e,element:n}},getUnderlyingPotencialDraggableComponent:function(t){var e=t.__vue__;return e&&e.$options&&m(e.$options._componentTag)?e.$parent:!("realList"in e)&&1===e.$children.length&&"realList"in e.$children[0]?e.$children[0]:e},emitChanges:function(t){var e=this;this.$nextTick((function(){e.$emit("change",t)}))},alterList:function(t){if(this.list)t(this.list);else{var e=Object(c["a"])(this.value);t(e),this.$emit("input",e)}},spliceList:function(){var t=arguments,e=function(e){return e.splice.apply(e,Object(c["a"])(t))};this.alterList(e)},updatePosition:function(t,e){var n=function(n){return n.splice(e,0,n.splice(t,1)[0])};this.alterList(n)},getRelatedContextFromMoveEvent:function(t){var e=t.to,n=t.related,a=this.getUnderlyingPotencialDraggableComponent(e);if(!a)return{component:a};var i=a.realList,o={list:i,component:a};if(e!==n&&i&&a.getUnderlyingVm){var r=a.getUnderlyingVm(n);if(r)return Object.assign(r,o)}return o},getVmIndex:function(t){var e=this.visibleIndexes,n=e.length;return t>n-1?n:e[t]},getComponent:function(){return this.$slots.default[0].componentInstance},resetTransitionData:function(t){if(this.noTransitionOnDrag&&this.transitionMode){var e=this.getChildrenNodes();e[t].data=null;var n=this.getComponent();n.children=[],n.kept=void 0}},onDragStart:function(t){this.context=this.getUnderlyingVm(t.item),t.item._underlying_vm_=this.clone(this.context.element),O=t.item},onDragAdd:function(t){var e=t.item._underlying_vm_;if(void 0!==e){Object(d["d"])(t.item);var n=this.getVmIndex(t.newIndex);this.spliceList(n,0,e),this.computeIndexes();var a={element:e,newIndex:n};this.emitChanges({added:a})}},onDragRemove:function(t){if(Object(d["c"])(this.rootContainer,t.item,t.oldIndex),"clone"!==t.pullMode){var e=this.context.index;this.spliceList(e,1);var n={element:this.context.element,oldIndex:e};this.resetTransitionData(e),this.emitChanges({removed:n})}else Object(d["d"])(t.clone)},onDragUpdate:function(t){Object(d["d"])(t.item),Object(d["c"])(t.from,t.item,t.oldIndex);var e=this.context.index,n=this.getVmIndex(t.newIndex);this.updatePosition(e,n);var a={element:this.context.element,oldIndex:e,newIndex:n};this.emitChanges({moved:a})},updateProperty:function(t,e){t.hasOwnProperty(e)&&(t[e]+=this.headerOffset)},computeFutureIndex:function(t,e){if(!t.element)return 0;var n=Object(c["a"])(e.to.children).filter((function(t){return"none"!==t.style["display"]})),a=n.indexOf(e.related),i=t.component.getVmIndex(a),o=-1!==n.indexOf(O);return o||!e.willInsertAfter?i:i+1},onDragMove:function(t,e){var n=this.move;if(!n||!this.realList)return!0;var a=this.getRelatedContextFromMoveEvent(t),i=this.context,o=this.computeFutureIndex(a,t);Object.assign(i,{futureIndex:o});var r=Object.assign({},t,{relatedContext:a,draggedContext:i});return n(r,e)},onDragEnd:function(){this.computeIndexes(),O=null}}};"undefined"!==typeof window&&"Vue"in window&&window.Vue.component("draggable",D);e["a"]=D},"6b75":function(t,e,n){"use strict";function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}n.d(e,"a",(function(){return a}))},"9b97":function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));var a=n("bc3a"),i=n.n(a),o=n("86c7"),r={headers:{Authorization:null==localStorage.getItem("syncbox.cloud")?"":JSON.parse(localStorage.getItem("syncbox.cloud")).token}},s={categories:function(t,e){return i.a.post(o["e"]+"categoriescontrol/"+e,t,r)},assets:function(t,e){return i.a.post(o["e"]+"assetscontrol/"+e,t,r)},assetsParts:function(t,e){return i.a.post(o["e"]+"assetspartscontrol/"+e,t,r)},durationProducts:function(t,e){return i.a.post(o["e"]+"durationsproducts/"+e,t,r)},plan:function(t,e,n){return i.a.post(o["e"]+"plan/"+e+"/"+n,t,r)},registroDatos:function(t,e,n,a){return i.a.post(o["e"]+"durationcontrol/"+e+"/"+n+"/"+a,t,r)},invLinea:function(){return i.a.get(o["e"]+"invlinea",r)},loadoperators:function(t,e){return i.a.post(o["e"]+"eventsoperators/"+t,e,r)},getColorState:function(t){return"CR"==t?"default":"CN"==t?"dark":"AC"==t?"info":"CE"==t?"secondary":"FI"==t?"success":"NA"==t?"danger":"EO"==t||"PV"==t?"warning":void 0},getTextState:function(t){return"CR"==t?"Creado":"CN"==t?"Cancelado":"AC"==t?"Activo":"CE"==t?"Terminado":"FI"==t?"Finalizado":"NA"==t?"No Autorizado":"EO"==t?"En Operacion":"PV"==t?"Por Verificar":void 0},getPriority:function(t){return"alta"==t?"danger":"media"==t?"warning":"baja"==t?"info":void 0}}},d7ea:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("h4",{staticClass:"font-weight-bold py-3 mb-4"},[t._v("\n      Tablero General Mantenimiento\n    ")]),t._v(" "),n("div",{staticClass:"form-row"},[n("div",{staticClass:"col-md"},[n("b-card",{staticClass:"mb-3",attrs:{"no-body":""}},[n("b-card-header",{staticClass:"text-center",attrs:{"header-tag":"h6"}},[t._v("Solicitudes Activas")]),t._v(" "),t._l(t.solicitudesActivas,(function(e){return n("div",{key:e.text,staticClass:"ui-bordered p-2 mb-2"},[n("b-dropdown",{staticClass:"kanban-board-actions float-right ml-2",attrs:{variant:"default btn-xs rounded-pill icon-btn borderless md-btn-flat hide-arrow",right:!t.isRTL}},[n("template",{slot:"button-content"},[n("i",{staticClass:"ion ion-ios-more"})]),t._v(" "),n("b-dropdown-item",{on:{click:function(n){n.preventDefault(),t.infoDetalleMant=e,t.mantConfig=!0}}},[n("i",{staticClass:"fas fa-exclamation text-warning"}),t._v("   Gestionar")]),t._v(" "),n("b-dd-divider"),t._v(" "),n("b-dropdown-item",{on:{click:function(n){return n.preventDefault(),t.openActionConfirm(e,"PV")}}},[n("i",{staticClass:"ion ion-md-close text-danger"}),t._v("   Verificar")])],2),t._v(" "),n("div",[n("b",[t._v(t._s(e.plan_id)+" "+t._s(e.code))]),t._v(" "),n("span",{staticClass:"badge ml-1",class:"badge-"+t.tags[e.priority].color},[t._v(t._s(t.tags[e.priority].title))])]),t._v("\n              "+t._s(e.description)+"\n              ")],1)}))],2)],1),t._v(" "),n("div",{staticClass:"col-md"},[n("b-card",{staticClass:"mb-3",attrs:{"no-body":"","border-variant":"warning"}},[n("b-card-header",{staticClass:"text-center",attrs:{"header-tag":"h6","header-text-variant":"warning"}},[t._v("OT Activas > 80% ")]),t._v(" "),t._l(t.otsActivas,(function(e){return n("div",{directives:[{name:"show",rawName:"v-show",value:e.percentage_use_pending<80,expression:"task.percentage_use_pending<80"}],key:e.text,staticClass:"ui-bordered p-2 mb-2"},[n("b-dropdown",{staticClass:"kanban-board-actions float-right ml-2",attrs:{variant:"default btn-xs rounded-pill icon-btn borderless md-btn-flat hide-arrow",right:!t.isRTL}},[n("template",{slot:"button-content"},[n("i",{staticClass:"ion ion-ios-more"})]),t._v(" "),n("b-dropdown-item",{on:{click:function(n){n.preventDefault(),t.infoDetalleMant=e,t.mantConfig=!0}}},[n("i",{staticClass:"fas fa-exclamation text-warning"}),t._v("   Gestionar")]),t._v(" "),n("b-dd-divider"),t._v(" "),n("b-dropdown-item",{on:{click:function(n){return n.preventDefault(),t.openActionConfirm(e,"PV")}}},[n("i",{staticClass:"ion ion-md-close text-danger"}),t._v("   Verificar")])],2),t._v(" "),n("div",[n("b",[t._v(t._s(e.plan_id)+" "+t._s(e.code))]),t._v(" "),n("span",{staticClass:"badge ml-1",class:"badge-"+t.tags[e.priority].color},[t._v(t._s(t.tags[e.priority].title))])]),t._v("\n                    "+t._s(e.description)+"\n                ")],1)}))],2)],1),t._v(" "),n("div",{staticClass:"col-md"},[n("b-card",{staticClass:"mb-3",attrs:{"no-body":"","border-variant":"danger"}},[n("b-card-header",{staticClass:"text-center",attrs:{"header-tag":"h6","header-text-variant":"danger"}},[t._v(" OT Activas < 80%  ")]),t._v(" "),t._l(t.otsActivas,(function(e){return n("div",{directives:[{name:"show",rawName:"v-show",value:e.percentage_use_pending>=80,expression:"task.percentage_use_pending>=80"}],key:e.text,staticClass:"ui-bordered p-2 mb-2"},[n("b-dropdown",{staticClass:"kanban-board-actions float-right ml-2",attrs:{variant:"default btn-xs rounded-pill icon-btn borderless md-btn-flat hide-arrow",right:!t.isRTL}},[n("template",{slot:"button-content"},[n("i",{staticClass:"ion ion-ios-more"})]),t._v(" "),n("b-dropdown-item",{on:{click:function(n){n.preventDefault(),t.infoDetalleMant=e,t.mantConfig=!0}}},[n("i",{staticClass:"fas fa-exclamation text-warning"}),t._v("   Gestionar")]),t._v(" "),n("b-dd-divider"),t._v(" "),n("b-dropdown-item",{on:{click:function(n){return n.preventDefault(),t.openActionConfirm(e,"PV")}}},[n("i",{staticClass:"ion ion-md-close text-danger"}),t._v("   Verificar")])],2),t._v(" "),n("div",[n("b",[t._v(t._s(e.plan_id)+" "+t._s(e.code))]),t._v(" "),n("span",{staticClass:"badge ml-1",class:"badge-"+t.tags[e.priority].color},[t._v(t._s(t.tags[e.priority].title))])]),t._v("\n                    "+t._s(e.description)+"\n              ")],1)}))],2)],1),t._v(" "),n("div",{staticClass:"col-md"},[n("b-card",{staticClass:"mb-3",attrs:{"no-body":"","border-variant":"success"}},[n("b-card-header",{staticClass:"text-center",attrs:{"header-tag":"h6","header-text-variant":"success"}},[t._v("Pendientes por Cerrar")]),t._v(" "),t._l(t.otsToClose,(function(e){return n("div",{directives:[{name:"show",rawName:"v-show",value:e.percentage_use_pending<80,expression:"task.percentage_use_pending<80"}],key:e.text,staticClass:"ui-bordered p-2 mb-2"},[n("b-dropdown",{staticClass:"kanban-board-actions float-right ml-2",attrs:{variant:"default btn-xs rounded-pill icon-btn borderless md-btn-flat hide-arrow",right:!t.isRTL}},[n("template",{slot:"button-content"},[n("i",{staticClass:"ion ion-ios-more"})]),t._v(" "),n("b-dropdown-item",{on:{click:function(n){n.preventDefault(),t.infoDetalleMant=e,t.mantConfig=!0}}},[n("i",{staticClass:"far fa-eye"}),t._v("   Cerrar OT ")])],2),t._v(" "),n("div",[n("b",[t._v(t._s(e.plan_id)+" "+t._s(e.code))]),t._v(" "),n("span",{staticClass:"badge ml-1",class:"badge-"+t.tags[e.priority].color},[t._v(t._s(t.tags[e.priority].title))])]),t._v("\n                    "+t._s(e.description)+"\n                ")],1)}))],2)],1)]),t._v(" "),n("b-modal",{attrs:{"hide-footer":"",centered:"",title:"Confirmación de Acción"},model:{value:t.actionConfirm,callback:function(e){t.actionConfirm=e},expression:"actionConfirm"}},[n("h3",{class:"AC"==t.infoDetalleMant.new_state?"text-success text-center":"text-danger text-center"},[t._v(t._s("AC"==t.infoDetalleMant.new_state?"Liberar Orden de Trabajo":"Terminar la Solicitud"))]),t._v(" "),n("h4",{staticClass:"text-center"},[t._v("¿Desea Continuar?")]),t._v(" "),"AC"!=t.infoDetalleMant.new_state?n("b-form-group",{attrs:{"label-cols":"12",label:""}},[n("b-form-textarea",{attrs:{id:"textarea",placeholder:"Detalle...",rows:"3","max-rows":"6"},model:{value:t.infoDetalleMant.comment,callback:function(e){t.$set(t.infoDetalleMant,"comment",e)},expression:"infoDetalleMant.comment"}})],1):t._e(),t._v(" "),n("hr"),t._v(" "),n("div",{staticClass:"text-right"},[n("b-button",{attrs:{size:"md",variant:"secondary"},on:{click:function(e){t.actionConfirm=!1}}},[t._v("Cancelar")]),t._v(" "),n("b-button",{attrs:{size:"md",variant:"AC"==t.infoDetalleMant.new_state?"success":"danger",disabled:"AC"!=t.infoDetalleMant.new_state&&(""==t.infoDetalleMant.comment||null==this.infoDetalleMant.comment)},on:{click:function(e){return t.updateState()}}},[t._v("Confirmar")])],1)],1),t._v(" "),n("b-modal",{attrs:{"hide-footer":"",size:"xl"},scopedSlots:t._u([{key:"modal-title",fn:function(){return[t._v("\n            Gestionar Solicitudes\n        ")]},proxy:!0}]),model:{value:t.mantConfig,callback:function(e){t.mantConfig=e},expression:"mantConfig"}},[t._v(" "),n("maintenance-definition",{attrs:{assets_id:this.infoDetalleMant.assets_id,infoDetalle:t.infoDetalleMant}})],1)],1)},i=[],o=(n("d3b7"),n("5e15")),r=n("9b97");var s={name:"pages-kanban-board",metaInfo:{title:"Información"},components:{draggable:o["a"],"maintenance-definition":function(){return Promise.all([n.e("chunk-2d0e97b4"),n.e("chunk-616c3b3f"),n.e("chunk-cddab694")]).then(n.bind(null,"f182"))}},data:function(){return{mantConfig:!1,actionConfirm:!1,infoDetalleMant:{comment:"",new_state:""},tags:{alta:{title:"Alta",color:"danger"},media:{title:"Media",color:"warning"},baja:{title:"Baja",color:"info"},other:{title:"Otra",color:"secondary"}},newTasks:[{text:"New blog layout"},{text:"Create UI design model",tags:["clients"]},{text:"Another icon set"},{text:"iOS application design mockups"}],inProgressTasks:[{text:"New icons set for an iOS app",tags:["other"]},{text:"Create ad campaign banners set"}],testTasks:[{text:"Help Web devs with HTML integration"},{text:"UI/UX design review",tags:["important"]},{text:"Marketing campaign review"},{text:"Fix website issues on mobile"},{text:"Create landing page for a new app",tags:["social"]}],doneTasks:[{text:"Edit the draft for the icons",tags:["important"]},{text:'Create sketch for the "FAQ" page'}],draggableOptions:{animation:150,group:{name:"kanban-board",put:!0,pull:!0}},solicitudesActivas:[],otsActivas:[],otsToClose:[]}},methods:{openActionConfirm:function(t,e){this.infoDetalleMant=t,this.infoDetalleMant.new_state=e,this.actionConfirm=!0},updateState:function(){var t=this;r["a"].plan(this.infoDetalleMant,"plan","update-state").then((function(e){t.loadSolicitudesActivas(),t.loadOTs(),t.loadToClose()}))},loadSolicitudesActivas:function(){var t=this;r["a"].plan("AC","plan-request","select-state").then((function(e){t.solicitudesActivas=[],""!=e.data&&(t.solicitudesActivas=e.data)}))},loadOTs:function(){var t=this;r["a"].plan(0,"plan","select-actives").then((function(e){t.otsActivas=[],""!=e.data&&(t.otsActivas=e.data)}))},loadToClose:function(){var t=this;r["a"].plan(0,"plan","select-to-close").then((function(e){t.otsToClose=[],""!=e.data&&(t.otsToClose=e.data)}))},accessControl:function(t,e){return"CR"==t?"edit"==e||"cancelar"==e||"iniciar"==e:"CN"!=t&&"NA"!=t&&("CN"==t?"iniciar"==e:void 0)},editOrden:function(t){this.mantConfig=!0,this.infoMantenimiento=t;for(var e=0;e<this.tableAssets.length;e++){var n=this.tableAssets[e];n.assets_id==t.assets_id&&(this.objinfo=n)}}},created:function(){this.loadSolicitudesActivas(),this.loadOTs()}},c=s,l=n("2877"),d=Object(l["a"])(c,a,i,!1,null,null,null);e["default"]=d.exports}}]);
//# sourceMappingURL=chunk-27460325.fffc859b.js.map
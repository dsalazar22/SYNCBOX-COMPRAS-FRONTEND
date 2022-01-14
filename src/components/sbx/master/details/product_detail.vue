<template>
    <div>
        <notifications group="notifications-default" />
        <h4 class="font-weight-bold py-3 mb-0">{{title}}</h4>
        <!-- ADICIONAR SI EL PRODUCTO ES GENERICO -->
            <hr class="border-light container-m--x mt-0 mb-4">
            <div class="w-100 text-right">
        </div>

        <!-- TITULO DEL PRODUCTO -->
        <div v-if="!showEditProduct" class="row">
            <div class="col-sm-12 col-md-4 d-md-flex flex-row-reverse bd-highlight">
                <div class="text-center">
                    <img v-if="image != null" v-bind:src="image != null ? image.dataUrl: null" class="rounded mx-auto d-block" style="width:200px">

                        <image-uploader
                            :preview="false"
                            :className="['sr-only', 'fileinput', { 'fileinput--loaded': hasImage }]"
                            capture="environment"
                            :debug="1"
                            doNotResize="gif"
                            :autoRotate="true"
                            outputFormat="verbose"
                            @input="setImage"
                        >
                        
                            <label for="fileInput" slot="upload-label">
                        <i class="fas fa-camera"></i>
                        <br>
                            <span class="upload-caption">{{
                                hasImage ? "Cambiar Imagen" : "Click para cargar la imagen"
                            }}</span>
                            </label>
                    </image-uploader> 
                </div>
            </div>
            <div class="col-sm-12 col-md-8 ">
                <!-- {{this.infoProduct}} -->
                <!-- <h4> <span> <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click="showEditProduct=true" ><i class="ion ion-md-create"></i></b-btn></span>  -->
                <h3>
                    {{this.infoProduct.code}} <span class="font-weight-light "> {{this.infoProduct.description}} </span>
                
                    <br>
                    <small class="font-weight-light "> <strong> Precio de Lista:</strong> {{this.infoProduct.price_list=='' || this.infoProduct.price_list==null || this.infoProduct.price_list==undefined?'0':this.infoProduct.price_list}}</small>
                    <br>
                    <small class="font-weight-light "> <strong> Costo Estandar:</strong> {{this.infoProduct.standard_cost=='' || this.infoProduct.standard_cost==null || this.infoProduct.standard_cost==undefined?'0':this.infoProduct.standard_cost}}</small>
                    <br>
                    <div><small class="font-weight-light "> <strong>Familia:</strong> {{this.infoProduct.family}} días de Buffer  {{this.infoProduct.buffer}}</small> 
                    <br>
                    <small class="font-weight-light "> <strong> Unidad de Medida:</strong> {{this.infoProduct.selectedum == null ? "" : this.infoProduct.selectedum.description}} ({{this.infoProduct.selectedum == null ? "" : this.infoProduct.selectedum.code}})</small>
                    <br>
                    <small class="font-weight-light "> <strong> Tipo de Producto:</strong> {{this.infoProduct.type_product}}</small>
                    <!-- <h5> Producto: {{this.infoProduct.type_product}}</h5> -->
                    <small class="font-weight-light "> {{infoProduct.input?' Insumo':''}}</small> 
                    <br>
                    <b-btn variant="outline-success" class="btn-sm" @click.prevent="showEditProduct=true">
                        <span class="ion ion-md-create"></span>&nbsp;&nbsp;Editar Producto
                    </b-btn>
                    </div>
                </h3>
            </div>
        </div>
        <!-- TITULO DEL PRODUCTO -->

        <!-- EDITAR PRODUCTO -->
        <div v-if="showEditProduct">
            <div class="row">
                <div class="col"> 
                    <fieldset class="demo-vertical-spacing-sm">
                        <b-form-row>
                            <b-form-group class="col-md-4" label="Código" :feedback="objState.message">
                                <b-input placeholder="Código" :disabled="disabledcode" aria-describedby="inputCode" v-model.trim="infoProduct.code" :state="objState.code!=''" v-on:input="objState.code = 'valid'; objState.code= infoProduct.code==''?'invalid':'valid'"/>
                            </b-form-group>
                            <b-form-group class="col-md-8" label="Descripción" :feedback="objState.message">
                                <b-input placeholder="Descripción" required v-model.trim="infoProduct.description" :state="objState.description!=''" v-on:input="objState.description = 'valid'; objState.description= infoProduct.description==''?'invalid':'valid'"/>
                            </b-form-group>
                        </b-form-row>
                        <b-form-row>
                            <b-form-group class="col-md-4" label="Familia">
                                <multiselect
                                    v-model="familyselected"
                                    :options="infoFamilies"
                                    :custom-label="nameWithLang"
                                    :searchable="true"
                                    :show-labels="false"
                                    placeholder="Familia de Producto"
                                />
                            </b-form-group>
                            <b-form-group class="col-md-4 align-bottom" label="Linea">
                                <multiselect
                                    v-model="lineselected"
                                    :options="infoLines"
                                    :custom-label="nameWithLang"
                                    :searchable="true"
                                    :show-labels="false"
                                    placeholder="Familia de Producto"
                                />
                            </b-form-group>
                            <b-form-group class="col-md-4" label="Tipo de Producto">
                                <multiselect
                                    v-model="infoProduct.type_product"
                                    :options="product_type"
                                    :searchable="true"
                                    :show-labels="false"
                                    placeholder="Tipo de Producto"
                                />
                            </b-form-group>
                        </b-form-row>
                        <b-form-row>
                            <b-form-group class="col-md-4" label="Precio de Lista" :feedback="objState.message">
                                <b-input placeholder="Precio de Lista" required v-model.trim="infoProduct.price_list" type="number"/>
                            </b-form-group>
                            
                            <b-form-group class="col-md-4" label="Costo Estandar" :feedback="objState.message">
                                <b-input placeholder="Costo Estandar" required v-model.trim="infoProduct.standard_cost" type="number"/>
                            </b-form-group>

                            <b-form-group class="col-md-4" label="Empaque Estandar">
                                <b-input placeholder="Empaque Estandar" required v-model.trim="infoProduct.standard_packing" type="number"/>
                            </b-form-group>
                            
                        </b-form-row>
                        <b-form-row>
                            <b-form-group class="col-md-4" label="Unidad de Medida">
                                <multiselect
                                    v-model="infoProduct.selectedum"
                                    :options="infoUnityMeasurement"
                                    :custom-label="nameUm"
                                    :searchable="true"
                                    :show-labels="false"
                                    placeholder="Unidad de Medida"
                                />
                            </b-form-group>
                            <b-form-group class="col-md-4 align-bottom" label="Formulario Detalles">
                                <multiselect
                                    v-model="selected_forms"
                                    :options="infoForms"
                                    label="description"
                                    :searchable="true"
                                    :show-labels="false"
                                    placeholder="Fromularios"
                                />
                            </b-form-group>
                            <b-form-group class="col-md-4 align-bottom" label="">
                                <b-check :disabled="moduleSelected == 'mnt' || infoProduct.service" v-model="infoProduct.input" @change="infoProduct.input?selectTab='route':selectTab='proveedores'">¿Éste Producto es un Insumo?</b-check>
                                <b-check :disabled="moduleSelected == 'mnt' || infoProduct.input || infoProduct.item_control" v-model="infoProduct.service" @change="infoProduct.input?selectTab='route':selectTab='proveedores'">¿Éste Producto es un Servicio?</b-check>
                                <b-check :disabled="infoProduct.service" v-model="infoProduct.item_control">¿Controlar Inventario?</b-check>
                            </b-form-group>
                        </b-form-row>                        
                        <div class="h4 text-center"></div>
                    </fieldset>
                </div>
            </div>
                
            <div class="row">
                <div class="col">
                        <b-form-group label="Detalles">
                    <b-check v-model="infoProduct.is_discount" inline>Desvincular Descuento</b-check>
                                <b-check v-model="infoProduct.apply_tax" inline>Aplicar IVA</b-check>

                    </b-form-group>
                </div>
                <div class="col text-right">
                    <b-btn variant="primary" @click="showEditProduct=false" v-if="this.infoProduct.product_id != 0">Cancelar</b-btn>
                    <b-btn variant="success" @click="submit()">Guardar</b-btn>
                    <b-btn variant="outline-info" class="btn-md" @click.prevent="openHelp">Ayuda </b-btn>
                </div>
            </div>
            
        </div>
        <!-- EDITAR PRODUCTO -->

        <b-nav class="justify-content-end mt-2">
            <b-nav tabs class="nav-sm tabs-alt">
                <b-nav-item :active="selectTab=='lista_materiales'" v-if="!infoProduct.input && !infoProduct.service" @click="eventSelectedTab('lista_materiales')">Listas de Materiales</b-nav-item>
                <b-nav-item :active="selectTab=='route'" v-if="!infoProduct.input && !infoProduct.service" @click="eventSelectedTab('route')">Rutas de Proceso</b-nav-item>
                <b-nav-item :active="selectTab=='proveedores'" v-if="infoProduct.input || infoProduct.service" @click="eventSelectedTab('proveedores')">Proveedores</b-nav-item>
                <b-nav-item :active="selectTab=='herramentales'" v-if="!infoProduct.input && !infoProduct.service" @click="eventSelectedTab('herramentales')">Asiganción de Herramentales</b-nav-item>
                <b-nav-item :active="selectTab=='clientes'" v-if="moduleSelected != 'mnt'" @click="eventSelectedTab('clientes')">Clientes</b-nav-item>
                <b-nav-item :active="selectTab=='detalles'" @click="eventSelectedTab('detalles')">Detalles</b-nav-item>
                <b-nav-item :active="selectTab=='documents'" @click="eventSelectedTab('documents')">Documentos</b-nav-item>
                <b-nav-item :active="selectTab=='costos'" @click="selectTab='costos'">Costos</b-nav-item>
                <b-nav-item :active="selectTab=='frecuencia'" @click="eventSelectedTab('frecuencia')"  v-if="moduleSelected == 'mnt'">Frecuencia de Mantenimiento</b-nav-item>
            <!-- <b-nav-item disabled>Disabled</b-nav-item> -->
            </b-nav>
        </b-nav>

       <div v-if="selectTab=='costos'">
            <h3 class="mt-2" style="margin-bottom:0px;">Cantidad Base</h3>
            <!-- <b-input placeholder="Costo Real" required v-model.trim="infoProduct.price_list" type="number"/> -->

            <b-input-group class="mt-2 mb-2">
                <b-form-input v-model="infoProduct.base_quantity"  placeholder="Cantidad Base" />
                <!-- <b-form-input v-model="pedidonro" v-if="dataresult[0] != null" placeholder="Placa" /> -->
                <b-input-group-append>
                    <b-btn variant="success" > <span class="fas fa-check" ></span> Asignar Cantidad Base </b-btn>
                </b-input-group-append>
            </b-input-group>

            <div v-for="item of itemsPlants" :key="item.plant_id"> 
                <b-card no-body class="mb-3">
                    <b-card-header> 
                        <div class="row">
                            <div>
                                <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle="'acc'+item.plant_id">
                                    {{item.description}}
                                    <div class="collapse-icon"></div>
                                </a>
                            </div>
                            <!-- <div class="col-1 text-center">
                                <b-badge variant="outline-primary"> {{item.sequence}} </b-badge>
                            </div>
                            <div class="col-11">
                                    <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle="'acc'+item.route_operation_id">
                                        {{item.description}}
                                        <div class="collapse-icon"></div>
                                    </a>
                            </div> -->
                        </div>
                        <!-- </div> -->
                    </b-card-header>
                    <b-collapse :id="'acc'+item.plant_id" :accordion="'acc'+item.plant_id">
                        <b-card-body>
                            Check en los tres para escoger con cual se va a comparar el real
                            <b-form-row>
                                
                                <b-form-group class="col-md-4" label="Costo Estandar Informado" :feedback="objState.message">
                                    <b-input placeholder="Costo Estandar Informado" required v-model.trim="infoProduct.price_list" type="number"/>
                                    CAMPO MES/AÑO
                                </b-form-group>
                                <b-form-group class="col-md-4" label="Costo Estandar Dinamico" :feedback="objState.message">
                                    <b-input placeholder="Costo Estandar Dinamico" required v-model.trim="infoProduct.standard_cost" type="number"/>
                                    CAMPO MES/AÑO
                                    <b-btn variant="outline-success " class="btn-sm" @click.prevent="showAddEditMaterials=true;verPreparacion=true">
                                <span class="ion ion-md-add"></span>&nbsp;&nbsp;Calcular Nuevo Costo
                            </b-btn>
                                </b-form-group>
                                <b-form-group class="col-md-4" label="Costo Estandar Congelado">
                                    <b-input disabled placeholder="Costo Estandar Congelado" required v-model.trim="infoProduct.standard_packing" type="number"/>
                                    CAMPO MES/AÑO - Cuando existe una variacion constante entre un 5 y un 8% | este campo se habilita unicamente por permisos
                                </b-form-group>
                            </b-form-row>
                        </b-card-body>
                    </b-collapse>
                </b-card>
            </div>


            <!-- <h3 class="mt-2">Definicion de Planta</h3>
            
                Check en los tres para escoger con cual se va a comparar el real
            <b-form-row>
                
                <b-form-group class="col-md-4" label="Costo Estandar Informado" :feedback="objState.message">
                    <b-input placeholder="Costo Estandar Informado" required v-model.trim="infoProduct.price_list" type="number"/>
                    CAMPO MES/AÑO
                </b-form-group>
                <b-form-group class="col-md-4" label="Costo Estandar Dinamico" :feedback="objState.message">
                    <b-input placeholder="Costo Estandar Dinamico" required v-model.trim="infoProduct.standard_cost" type="number"/>
                    CAMPO MES/AÑO
                     <b-btn variant="outline-success " class="btn-sm" @click.prevent="showAddEditMaterials=true;verPreparacion=true">
                <span class="ion ion-md-add"></span>&nbsp;&nbsp;Calcular Nuevo Costo
            </b-btn>
                </b-form-group>
                <b-form-group class="col-md-4" label="Costo Estandar Congelado">
                    <b-input disabled placeholder="Costo Estandar Congelado" required v-model.trim="infoProduct.standard_packing" type="number"/>
                    CAMPO MES/AÑO - Cuando existe una variacion constante entre un 5 y un 8% | este campo se habilita unicamente por permisos
                </b-form-group>
            </b-form-row> -->

            <!-- <h3>Informacion de Costo Real</h3>
            <b-form-row>
                <b-form-group class="col-md-3" label="Costo Real Mes Actual" :feedback="objState.message">
                    <b-input placeholder="Costo Real" required v-model.trim="infoProduct.price_list" type="number"/>
                </b-form-group>
                <b-form-group class="col-md-3" label="Costo Real Mes Anterior" :feedback="objState.message">
                    <b-input placeholder="Costo Real" required v-model.trim="infoProduct.price_list" type="number"/>
                </b-form-group>
                <b-form-group class="col-md-3" label="Variacion Costo Real" :feedback="objState.message">
                    <b-input placeholder="Costo Real" required v-model.trim="infoProduct.price_list" type="number"/>
                </b-form-group>
                <b-form-group class="col-md-3" label="Porcentaje Costo Real" :feedback="objState.message">
                    <b-input placeholder="Costo Real" required v-model.trim="infoProduct.price_list" type="number"/>
                </b-form-group>
            </b-form-row>

            <h3>Tipo de Costo</h3>
            <b-form-group :feedback="objState.message" >
                
                    <b-check v-model="infoProduct.type_primary" @change="infoProduct.type_secundary = infoProduct.type_primary" >Variable</b-check>
                    <b-check v-model="infoProduct.type_secundary" @change="infoProduct.type_primary = infoProduct.type_secundary">Fijo</b-check>
                
            </b-form-group> -->
            

            <!-- <h3>Inventario Cantidad por Costo</h3>
            <b-form-select v-model="itemPC" :options="infoProduct.plant"></b-form-select>


            <h3>Causacion de Cuentas</h3>
            Seleccion de Cuentas COMBO <br/>
            DEBITO | CREDITO | NOMBRE | NOMBRE -->



        </div>

        <!-- LISTA DE MATERIALES -->
        <div v-if="selectTab=='lista_materiales'">
            <div class="w-100 text-left mt-2 mb-2"  >
                    <b-btn variant="outline-success borderless" class="btn-sm" @click.prevent="showAddEditMaterials=true;verPreparacion=true">
                        <span class="ion ion-md-add"></span>&nbsp;&nbsp;Crear Nueva Receta
                    </b-btn>
            </div>

            <!-- FORMULARIO DEFINICION NUEVA RECETA -->

            <b-modal id="modals-top" v-model="showAddEditMaterials"  class="modal-center" size="md">
                <div slot="modal-title">
                    Adicionar Receta <span class="font-weight-light"> </span>
                </div>
            
                <b-form-row>
                    <b-form-group class="col-md-12" label="Nombre" >
                        <b-input placeholder="Nombre" :disabled="disabledcode" v-model.trim="itemNewDefinitionBOM.name" />
                    </b-form-group>
                </b-form-row>
                <b-form-row>
                    <b-form-group class="col-md-12" label="Versión" >
                        <b-input placeholder="Versión" v-model.trim="itemNewDefinitionBOM.version" />
                    </b-form-group>
                </b-form-row>
                <b-form-row>
                    <b-form-group class="col-md-12" label="Preparación" >
                    <b-textarea rows="10" max-rows="10"  v-model="itemNewDefinitionBOM.comment"/>
                    </b-form-group>
                </b-form-row>
                <!-- <b-form-row>      
                    <b-form-group class="col-md-12 text-right">
                    <b-btn variant="success">
                            Guardar
                        </b-btn>
                    </b-form-group>
                </b-form-row> -->
                <div slot="modal-footer" class="w-100 text-right">
                    
                    <b-button size="md" variant="primary" @click="showAddEditMaterials=false; itemNewDefinitionBOM = { bill_of_materials_id:0,
                        name:null,
                        comments:null,
                        default:false,
                        parent_id:0};">Cancelar</b-button>
                    <b-button size="md" variant="success" v-if="verPreparacion" @click="save_new_definition()">Guardar</b-button>
                   
    
                </div>
            </b-modal>
            
            <!-- FORMULARIO DEFINICION NUEVA RECETA -->
            <b-tabs content-class="mt-3" v-if="selectTab=='lista_materiales'">
                <!-- <div v-if="selectTab=='lista_materiales'" v-for="(item, index) in listDefinitionBOM" v-for-key="'mts'+item.version"> -->
                    
                    <!-- <hr>
                    <div class="d-flex justify-content-between mt-0">
                        <h4><span> <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click="editMeterials(item)" ><i class="ion ion-md-create"></i></b-btn></span> {{item.name}}</h4>
                    </div> -->
                    <b-tab  v-for="(item, index) in listDefinitionBOM" :key="item.bill_of_materials_id" :active="index == 0" @click="info_product_map = {}; show_tree=false;">
                        <template slot="title">
                            <div>
                                {{item.name}} 
                            </div>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click="setDefaulBOMroduct(item)" v-if="!item.default"><i class="pe-7s-pin"></i></b-btn>
                                      <i class="oi oi-pin text-success" v-if="item.default"></i>
                                    <b-btn variant="outline-info borderless  icon-btn" class="btn-xs"  @click="editMeterials(item); verPreparacion=false"><i class="fas fa-info"></i></b-btn>
                                    <b-btn variant="outline-success borderless  icon-btn" class="btn-xs" @click.prevent="editMeterials(item);verPreparacion=true"><i class="ion ion-md-create"></i></b-btn> 
                                    <b-btn variant="outline-danger borderless  icon-btn" class="btn-xs" @click.prevent="sdelete_option_mp = 'tab'; loadInfoToDelete(item)" v-if="!item.default"><i class="ion ion-md-close"></i></b-btn> 
                                </div>
                                <div>
                                    Versión {{item.version}}
                                </div>
                            </div>
                        </template>
                        <!-- <div class="text-muted"> -->
                            <!-- <small>{{item.comment}}</small> -->
                        <!-- </div> -->

                        <!-- TABLA DE PRODUCTOS QUE COMPONEN LA RECETA -->    

                        <div class="row">
                            <div class="col-12">
                                <bom-controller :tableBOM="item.details_materials" :src="src" :bill_of_materials_id="item.bill_of_materials_id" :infoProduct="infoProduct" :id_product="parseInt(infoProduct.product_id)" v-on:refresh="listDefinitionBOM = $event"> </bom-controller>
                            </div>
                        </div>

                        <!-- {{item}} -->


                        <!-- TABLA DE PRODUCTOS QUE COMPONEN LA RECETA -->

                       

                        <!-- {{info_product_map}} -->
                        <!-- <div v-if="show_tree">
                            <tree :data="info_product_map" class="tree" node-text="name" layoutType="euclidean" :zoomable="true">
                            </tree>
                        </div> -->
                    </b-tab>
                <!-- </div> -->
            </b-tabs>

        </div>
        <!-- LISTA DE MATERIALES -->

         <!-- RUTAS DE PROCESO -->
        <div v-if="selectTab=='route'">
            <!-- BUSCADOR RUTAS DE PROCESO -->
            <div class="position-relative mb-2 mt-2">
                <!-- <b-input-group>
                    <b-input-group-text slot="prepend" v-if="loading">
                        <i class="ion ion-md-sync"></i>
                    </b-input-group-text>
                    <b-input-group-text slot="prepend" v-if="!loading">
                        <i class="ion ion-ios-search"></i>
                    </b-input-group-text>
                    <input type="text" class="form-control"
                        placeholder="Seleccione una Ruta"
                        autocomplete="off"
                        v-model="value"
                        @keydown.down="down"
                        @keydown.up="up"
                        @keydown.enter="hit"
                        @keydown.esc="reset"
                        @blur="reset"
                        @input="updateQuery" />
                    <b-input-group-text slot="append" v-if="isDirty || value" @click="resetInput">
                        <i class="ion ion-md-close" ></i>
                    </b-input-group-text>
                </b-input-group> -->

                <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: 0, right: 'auto'}">
                    <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                        <span class="name" v-text="item.code"></span>
                        <span class="text-muted">{{ item.description }}</span>
                    </a>
                </div>
                <div class="text-right mt-2 mb-2">
                    <b-btn variant="outline-success borderless" class="btn-xs" @click.prevent="openNewRoute()"><i class="ion ion-md-add"></i> Crear Nueva Ruta </b-btn>
                </div>
            </div>
            <!-- BUSCADOR RUTAS DE PROCESO -->

            <!-- <sweet-modal ref="detailSpeedProduct" title="Modificar Tiempos de Fabricación" width="80%" >
                <process-detail> </process-detail>
                <b-btn slot="button" @click="$refs.detailSpeedProduct.close()">Cerrar</b-btn>
            </sweet-modal> -->

            <!--CONFIRMAR ADICION RUTA-->
            <b-modal id="modals-top" v-model="showAddRoute"  class="modal-center" size="md">
                <div slot="modal-title">
                Adicionar Ruta <span class="font-weight-light"> </span>
                </div>
                <div v-if="itemRouteSelected.template">
                    <div class="text-center mb-3">
                        <h3>¡ATENCIÓN!</h3>
                        Esta ruta es una plantilla, por favor adicionele un nuevo código y una descripción para que la información sea clonada.
                    </div>
                    
                    <fieldset class="demo-vertical-spacing-sm">
                        <b-form-row>
                            <b-form-group class="col-md-5" label="Código">
                                <b-input placeholder="Código" :disabled="disabledcode" aria-describedby="inputCode" v-model="itemNewRoute.code" />
                            </b-form-group>
                            <b-form-group class="col-md-7" label="Descripción">
                                <b-input placeholder="Descripción" required v-model.trim="itemNewRoute.description"/>
                            </b-form-group>
                            <div class="w-100"></div>
                                Por favor ingrese el numero de versión
                            <b-input type="number" step="1"  placeholder="Número de Versión" v-model="itemNewRoute.version"/>
                        </b-form-row>
                    </fieldset>
                </div>
                <div v-if="!itemRouteSelected.template">
                    <h3 class="text-center">
                        {{itemRouteSelected.code}} - {{itemRouteSelected.description}}
                    </h3>
                    <div class="text-center">
                        Esta ruta no es una plantilla, si la esta compartiendo con otro(s) producto(s) y genera alguna modificación afectará a los demás productos.
                        <div class="w-100"></div>
                        <strong> ¿Está seguro que desea continuar? </strong>
                        <div class="w-100"></div>
                        Por favor ingrese el numero de versión
                        <b-input type="number" step="1"  placeholder="Número de Versión" v-model="itemNewRoute.version"/>
                    </div>
                </div>

                    <div slot="modal-footer" class="w-100 text-right">
                        <b-button size="md" variant="primary" @click="showAddRoute=false">Cancelar</b-button>
                        <b-button size="md" v-if="itemNewRoute.version != undefined" variant="success" @click="saverouteproduct()" :disabled="this.itemRouteSelected.code == this.itemNewRoute.code && this.itemNewRoute.template">Adicionar</b-button>
                    </div>
            </b-modal>
            <!--CONFIRMAR ADICION RUTA-->
            <b-tabs content-class="mt-3">
                
                    <b-tab v-for="(item_route, index) in tableRutasProcesos" :key="item_route.route_product_id" :active="index == 0">
                        
                        <template slot="title">
                            <div>
                                <!-- {{item_route.description}}  -->
                            </div>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click="setDefaulRouteProduct(item_route)" v-if="!item_route.default">
                                    <i class="pe-7s-pin"></i></b-btn>
                                    
                                    <i class="oi oi-pin text-success"  v-if="item_route.default"></i>

                                    <!-- <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/cfpr/routes/details/'+item_route.route_id}" target="_blank"><i class="ion ion-md-create"></i></b-btn> -->
                                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="loadInfoToDelete(item_route)"><i class="ion ion-md-close"></i></b-btn>
                                </div>
                                <div>
                                    Versión {{item_route.version}} 
                                </div>
                            </div>

                        </template>
                        <div>
                            <!-- {{item_route}} -->
                            <route-controller :id_route_from_product="item_route.route_id" :route_product_id="item_route.route_product_id" :id_route="item_route.route_id" :is_product="true" :id_product="product_selected_id" v-on:refresh="tableRutasProcesos = $event"> </route-controller>
                        </div>
                    </b-tab>
                
            </b-tabs>
            <!-- TABLA INFORMACION RUTA -->

            <!-- <b-table small show-empty stacked="md" :items="tableRutasProcesos" :fields="columnsRutasProcesos">
                 <template slot="unity_expected_cycle" slot-scope="props">
                    <div class="text-center">
                        {{props.item.unity_expected_cycle}}
                    </div>
                </template>
                
                <template slot="standard_time_cycle" slot-scope="props">
                    <div class="text-center">
                        {{props.item.standard_time_cycle}}
                    </div>
                </template>

                <template slot="default" slot-scope="props">
                    <div class="text-center">
                        <span class="text-success" v-if="props.item.default"><i class="ion ion-md-checkmark"></i></span> 
                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="setDefaulRouteProduct(props.item)" v-if="!props.item.default">
                            <i class="ion ion-md-close"></i>
                        </b-btn>
                    </div>
                </template>

                <template slot="edit" slot-scope="props">
                    <div class="text-left">
                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" :to="{path:'/cfpr/routes/details/'+props.item.route_id}" target="_blank"><i class="ion ion-md-create"></i></b-btn>
                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="loadInfoToDelete(props.item)"><i class="ion ion-md-close"></i></b-btn>
                    </div>
                </template>

            </b-table> -->
            <!-- TABLA INFORMACION RUTA -->
        </div>
        <!-- RUTAS DE PROCESO -->

        <!-- HERRAMENTALES -->
        <div v-if="selectTab=='herramentales'">
             <!-- HERRAMENTALES -->
                    <div>
                        <b-card header="Administrar Herramentales" header-tag="h6" class="mb-4 mt-2" v-if="showEditFormTools">
                            <b-form>
                                <div class="position-relative mb-3 mt-2">
                                    <b-input-group>
                                        <b-input-group-text slot="prepend" v-if="loading">
                                            <i class="ion ion-md-sync"></i>
                                        </b-input-group-text>
                                        <b-input-group-text slot="prepend" v-if="!loading">
                                            <i class="ion ion-ios-search"></i>
                                        </b-input-group-text>
                                        
                                        <input type="text" class="form-control"
                                            placeholder="Seleccione un Herramental"
                                            autocomplete="off"
                                            v-model="valueSelectedTool"
                                            @keydown.down="down"
                                            @keydown.up="up"
                                            @keydown.enter="hit"
                                            @keydown.esc="reset"
                                            @blur="reset"
                                            @input="updateQueryTools" />
                                        <b-input-group-text slot="append" v-if="isDirty || valueSelectedTool" @click="resetInput">
                                            <i class="ion ion-md-close" ></i>
                                        </b-input-group-text>
                                    </b-input-group>
                                    <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: 0, right: isRTL ? 0 : 'auto'}">
                                        <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                            <span class="name" v-text="item.code"></span>
                                            <span class="text-muted">{{ item.description }}</span>
                                        </a>
                                    </div>
                                </div>

                                <h3>{{itemSelectedTool.code}} {{itemSelectedTool.description}}</h3>

                                <b-form-row>
                                    <b-form-group class="col-md-6" label="Unidades por Ciclo">
                                        <b-input type="number" step="0.1"  placeholder="Unidades por Ciclo" v-model="itemSelectedTool.unity_expected_cycle" :disabled="true"/>
                                    </b-form-group>
                                    <b-form-group class="col-md-6" label="Tiempo de Ciclo">
                                        <b-input-group append="segundos">
                                        <b-input type="number" step="0.1" placeholder="Tiempo de Ciclo" v-model="itemSelectedTool.standard_time_cycle"/>
                                        </b-input-group>
                                    </b-form-group>
                                </b-form-row>
                                <b-form-group label="Adicione las rutas y operaciones en las que va a usar este herramental">
                                    <multiselect
                                        v-model="itemSelectedTool.selected_route_operations"
                                        label="description"
                                        track-by="description"
                                        placeholder=""
                                        :options="tableRouteOperations"
                                        :multiple="true"
                                        :searchable="true"
                                        :internal-search="false"
                                        :clear-on-select="false"
                                        :close-on-select="false"
                                        :hide-selected="true">
                                        <span slot="noResult">No found.</span>
                                    </multiselect>
                                </b-form-group>
                                    <div class="d-flex justify-content-between">
                                        <div>
                                        <label class="switcher switcher-warning mt-2">
                                            <input type="checkbox" class="switcher-input" v-model="itemSelectedTool.modify_unity_expected">
                                            <span class="switcher-indicator">
                                            <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                            <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                            </span>
                                            <span class="switcher-label">Modificar Unidades por Ciclo</span>
                                        </label>
                                        <label class="switcher switcher-danger mt-2">
                                            <input type="checkbox" class="switcher-input" v-model="itemSelectedTool.change_metrics">
                                            <span class="switcher-indicator">
                                            <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                            <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                            </span>
                                            <span class="switcher-label">Cambiar los estándares sí varía el número de personas en la línea</span>
                                        </label>

                                        </div>
                                        <div>
                                            <b-btn variant="outline-info icon-btn" class="btn-md" v-b-modal.modals-default @click.prevent="showEditFormTools = false"><i class="ion ion-md-close"></i></b-btn>
                                            <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="submitProductTools(); showEditFormTools = false"><i class="ion ion-md-checkmark"></i></b-btn>
                                        </div>
                                    </div>
                            </b-form>
                        </b-card>

                        <div class="w-100 text-right mt-2"  >
                            <b-btn variant="outline-success borderless" class="btn-sm" @click.prevent="showEditFormTools=true; itemSelectedTool={}">
                                <span class="ion ion-md-add"></span>&nbsp;&nbsp;Adicionar un nuevo Herramental
                            </b-btn>
                        </div>
                        <b-table small show-empty stacked="md" :fields="columnsSpeeds" :items="speedTableData" class="mt-3">
                            <template v-slot:cell(unity_expected_cycle)="row">
                                <div class="text-center">
                                    {{row.item.unity_expected_cycle}}
                                </div>
                            </template>
                            <template v-slot:cell(standard_time_cycle)="row">
                                <div class="text-center">
                                    {{row.item.standard_time_cycle}}
                                </div>
                            </template>

                            <template v-slot:cell(change_metrics)="row">
                                <div  class="text-center">
                                    <!-- <i class="ion ion-md-create"></i> -->
                                    <span style="color:red" v-if="!row.item.change_metrics"><i class="ion ion-md-remove-circle"></i></span>
                                    <span style="color:green" v-if="row.item.change_metrics"><i class="ion ion-md-add-circle"></i></span>
                                </div>
                            </template>
                            <template v-slot:cell(modify_unity_expected)="row">
                                <div  class="text-center">
                                    <!-- <i class="ion ion-md-create"></i> -->
                                    <span style="color:red" v-if="!row.item.modify_unity_expected"><i class="ion ion-md-remove-circle"></i></span>
                                    <span style="color:green" v-if="row.item.modify_unity_expected"><i class="ion ion-md-add-circle"></i></span>
                                </div>
                            </template>

                            <template v-slot:cell(edit)="row">
                                <div class="text-center">
                                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="itemSelectedTool=row.item; showEditFormTools = true"><i class="ion ion-md-create"></i></b-btn>
                                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="itemSelectedTool=row.item; $refs.errorWithButtonAlert.open()"><i class="ion ion-md-close"></i></b-btn>
                                </div>
                            </template>
                        </b-table>
                    </div>


                <!-- </sweet-modal-tab> -->

                <!-- <sweet-modal-tab title="Tab 3" id="tab3" :icon="icons.heart" disabled>Tab 3 is disabled</sweet-modal-tab> -->
                <!-- icons is an object containing SVG strings -->

                <!-- <b-btn slot="button" variant="primary" @click="$refs.detailSpeedProduct.close()" class="ml-2">OK</b-btn> -->
          <!-- HERRAMENTALES -->
        </div>
        <!-- HERRAMENTALES -->

        <!-- PROVEEDORES -->
        <div v-if="selectTab=='proveedores'">
            <div>
                <b-card header="Administrar Productos Proveedores" header-tag="h6" class="mb-4 mt-2" v-if="showEditFormSupplier">
                    <b-form>
                        <b-form-row>
                             <b-form-group class="col-md-9" label="Seleccione un Proveedor">
                                <div class="position-relative mb-3">
                                    <b-input-group>
                                        <b-input-group-text slot="prepend" v-if="loading">
                                            <i class="ion ion-md-sync"></i>
                                        </b-input-group-text>
                                        <b-input-group-text slot="prepend" v-if="!loading">
                                            <i class="ion ion-ios-search"></i>
                                        </b-input-group-text>
                                        <input type="text" class="form-control"
                                            placeholder="Seleccione un proveedor"
                                            autocomplete="off"
                                            v-model="valueSelectedSupplier"
                                            @keydown.down="down"
                                            @keydown.up="up"
                                            @keydown.enter="hit"
                                            @keydown.esc="reset"
                                            @blur="reset"
                                            @input="updateQuerySupplier" />
                                        <b-input-group-text slot="append" v-if="isDirty || valueSelectedSupplier" @click="resetInput">
                                            <i class="ion ion-md-close" ></i>
                                        </b-input-group-text>
                                    </b-input-group>
                                    <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                                        <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                            <span class="name" v-text="item.nit"></span>
                                            <span class="text-muted">{{ item.name }}</span>
                                        </a>
                                    </div>
                                </div>
                            </b-form-group>
                            <b-form-group class="col-md-3" label="Precio">
                                <b-input type="number" step="0.1" placeholder="Precio" v-model="itemSupplierProduct.price"/>
                            </b-form-group>
                        </b-form-row>

                        En caso de que se requiera utilizar un código diferente para la misma referencia, complete la siguiente información. Si usted usa el producto actual como producto genérico, por favor no lo haga.
                        <b-form-row class="mt-3">
                            <b-form-group class="col-md-6" label="Código del Proveedor">
                                <b-input   placeholder="Código del Proveedor" v-model="itemSupplierProduct.code"/>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Descripción del Proveedor">
                                <b-input placeholder="Descripción del Proveedor" v-model="itemSupplierProduct.description"/>
                            </b-form-group>
                        </b-form-row>
                        <div class="text-right">
                            <div>
                                <b-btn variant="outline-info icon-btn" class="btn-md" v-b-modal.modals-default @click.prevent="showEditFormSupplier = false"><i class="ion ion-md-close"></i></b-btn>
                                <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="submitSupplierProducts(); showEditFormSupplier = false"><i class="ion ion-md-checkmark"></i></b-btn>
                            </div>
                        </div>
                    </b-form>
                </b-card>

                <div class="w-100 text-right mt-2">
                    <b-btn variant="outline-success borderless" class="btn-sm" @click.prevent="showEditFormSupplier=true; itemSupplierProduct={}; valueSelectedSupplier=''">
                        <span class="ion ion-md-add"></span>&nbsp;&nbsp;Adicionar un nuevo proveedor
                    </b-btn>
                </div>
                <b-table small show-empty stacked="md" :fields="columnsSupplierProducts" :items="tableSupplierProduct" class="mt-3">
                    <template v-slot:cell(edit)="row">
                        <div class="text-center">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="itemSupplierProduct=row.item; showEditFormSupplier = true; valueSelectedSupplier=row.item.name; itemSupplierProduct.supplier_id = row.item.supplier_id"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="itemSupplierProduct=row.item; $refs.errorWithButtonAlert.open()"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                </b-table>
            </div>
        </div>
        <!-- PROVEEDORES -->

        <!-- CLIENTES -->
        <div v-if="selectTab=='clientes'">
            <div>
                <b-card header="Administrar Productos Clientes" header-tag="h6" class="mb-4 mt-2" v-if="showEditFormCustomers">
                    <b-form>
                        <div class="position-relative mb-3 mt-2">
                            <b-input-group>
                                <b-input-group-text slot="prepend" v-if="loading">
                                    <i class="ion ion-md-sync"></i>
                                </b-input-group-text>
                                <b-input-group-text slot="prepend" v-if="!loading">
                                    <i class="ion ion-ios-search"></i>
                                </b-input-group-text>
                                <input type="text" class="form-control"
                                    placeholder="Seleccione un cliente"
                                    autocomplete="off"
                                    v-model="valueSelectedCustomer"
                                    @keydown.down="down"
                                    @keydown.up="up"
                                    @keydown.enter="hit"
                                    @keydown.esc="reset"
                                    @blur="reset"
                                    @input="updateQueryCustomer" />
                                <b-input-group-text slot="append" v-if="isDirty || valueSelectedCustomer" @click="resetInput">
                                    <i class="ion ion-md-close" ></i>
                                </b-input-group-text>
                            </b-input-group>
                            <div class="dropdown-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                                <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                    <span class="name" v-text="item.nit"></span>
                                    <span class="text-muted">{{ item.name }}</span>
                                </a>
                            </div>
                        </div>

                        <!-- <h3>{{itemSelectedCustomer.code}} {{itemSelectedCustomer.description}}</h3> -->

                        <b-form-row>
                            <b-form-group class="col-md-3" label="Código del Cliente" :feedback="objState.message">
                                <b-input   placeholder="Código del Cliente" v-model="itemCustomerProduct.code" :state="objState.code!=''" v-on:input="objState.code = 'valid'; objState.code= itemCustomerProduct.code==''?'invalid':'valid'"/>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="Descripción del Cliente" :feedback="objState.message">
                                <b-input placeholder="Descripción del Cliente" v-model="itemCustomerProduct.description" :state="objState.description!=''" v-on:input="objState.description = 'valid'; objState.description= itemCustomerProduct.description==''?'invalid':'valid'"/>
                            </b-form-group>
                            <b-form-group class="col-md-3" label="Precio" :feedback="objState.message">
                                <b-input type="number" step="0.1" placeholder="Precio" v-model="itemCustomerProduct.price" :state="objState.price!=''" v-on:input="objState.price = 'valid'; objState.price= itemCustomerProduct.price=='' ?'invalid':'valid'"/>
                            </b-form-group>
                        </b-form-row>
                        <div class="text-right">
                            <div>
                                <b-btn variant="outline-info icon-btn" class="btn-md" v-b-modal.modals-default @click.prevent="showEditFormCustomers = false"><i class="ion ion-md-close"></i></b-btn>
                                <b-btn variant="outline-success icon-btn" class="btn-md"  v-b-modal.modals-default @click.prevent="submitCustomersProducts();"><i class="ion ion-md-checkmark"></i></b-btn>
                            </div>
                        </div>
                    </b-form>
                </b-card>

                <div class="w-100 text-right mt-2">
                    <b-btn variant="outline-success borderless" class="btn-sm" @click.prevent="showEditFormCustomers=true; itemCustomerProduct={}; valueSelectedCustomer=''">
                        <span class="ion ion-md-add"></span>&nbsp;&nbsp;Adicionar un nuevo cliente
                    </b-btn>
                </div>
                <b-table small show-empty stacked="md" :fields="columnsCustomerProducts" :items="tableCustomerProduct" class="mt-3">
                    <template v-slot:cell(edit)="row">
                        <div class="text-center">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="itemCustomerProduct=row.item; showEditFormCustomers = true; valueSelectedCustomer=row.item.name; itemCustomerProduct.customer_id = row.item.customer_id"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="itemCustomerProduct=row.item; $refs.errorWithButtonAlert.open()"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                </b-table>
            </div>
        </div>
        <!-- CLIENTES -->
        
        <div v-if="selectTab=='detalles'">
            <div v-for="(item, index) in this.selected_forms.fields">
                <div v-if="item.type == 'titulo'">
                    <h4>{{item.label}}</h4>
                </div>
                <div v-else>
                    <b-row class="my-1">
                        <b-col sm="3">
                            <label :for="item.field_id">{{item.label}}:</label>
                        </b-col>
                        <b-col sm="9">
                            <!-- <b-form-input :id="`type-${type}`" :type="type"></b-form-input> -->
                            <b-form-input :id="item.field_id" :placeholder="item.label" :type="item.type == 'numero' ? 'number' : 'text' " :value="item.value" ></b-form-input>
                        </b-col>
                    </b-row>
                </div>
            </div>
            <div class="text-right" v-if="this.selected_forms.fields.length > 0">
                <b-btn variant="success" @click="submit_form('insert')">Guardar</b-btn>
                <b-btn variant="danger" @click="submit_form('delete')">Borrar</b-btn>
            </div>
        </div>

        <div v-if="selectTab=='frecuencia'">
                <div class="w-100 text-right mt-2 mb-2">
                    <b-btn variant="outline-success borderless" class="btn-sm" @click.prevent="addDuration=true;infoDuration={code_duration: null, max_value: null, product_duration_id:0}">
                        <span class="ion ion-md-add"></span>&nbsp;&nbsp;Adicionar una nueva Frecuencia
                    </b-btn>
                </div>

                <b-table small show-empty stacked="md" :items="infoMeasure" :fields="columnsMeasure">
                    <template v-slot:cell(edit)="row">
                        <div class="text-center">
                            <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="infoDuration=row.item; addDuration = true"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="infoDuration=row.item; $refs.errDeleteMeasure.open()"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                </b-table>
        </div>

        <div v-if="selectTab=='documents'">
            <files-controller module="PR_PR" :module_id="infoProduct.product_id" module_detail="docs"> </files-controller>
        </div>

        <b-modal id="bv-modal-example" hide-footer v-model="addDuration" size="xl">
            <template v-slot:modal-title>
                Definición de Duración de Componentes
            </template>
            <div class="row">
                <div class="col-md-4">
                    <b> Unidades de Medida </b>
                    <b-select v-model="infoDuration.code_duration" >
                        <option value="hours_operations">Horas de Operación</option>
                        <option value="max_days">Número de Días</option>
                        <option value="cycles">Ciclos</option>
                        <option value="km">Kilometros</option>
                    </b-select>
                </div>
                <div class="col-md-4">
                    <b> Valor Maximo </b>
                    <b-input type="number" v-model="infoDuration.max_value"></b-input>
                </div>
                <div class="col-md-4">
                    <b> Acción </b>
                    <b-select v-model="infoDuration.action" >
                        <option value="1">Reemplazar</option>
                        <option value="2">Aplicar Mantenimiento / Ajustar</option>
                    </b-select>
                </div>
            </div>

            <b-form-group label-cols="12" label="Detalle la Acción a Realizar" v-if="infoDuration.details != 'AC'">
                    <b-form-textarea
                        v-model="infoDuration.details"
                        id="textarea"
                        placeholder="Detalle de la acción..."
                        rows="3"
                        max-rows="6"></b-form-textarea>
                </b-form-group>

            <div class="row mt-3">
                <div class="col text-right" >
                    
                    <b-btn variant="outline-danger" @click.prevent="saveDurationAllConfig()" v-if="this.infoProduct.product_id != 0 && infoDuration.product_duration_id != 0"><i class="ion ion-md-add"></i>&nbsp;&nbsp; Aplicar a toda la Configuración </b-btn>
                    <b-btn :variant="infoDuration.product_duration_id == 0 ? 'outline-success': 'outline-warning' " @click.prevent="saveDuration()" v-if="this.infoProduct.product_id != 0"><i class="ion ion-md-add"></i>&nbsp;&nbsp; {{infoDuration.product_duration_id == 0 ? 'Adicionar Configuracion': 'Editar Configuracion'}} </b-btn>
                    
                </div>
                <!-- <div class="col-md-6"><b-button block @click="addDuration = false">Cerrar</b-button></div> -->
            </div>
        </b-modal>

        <b-modal id="bv-modal-example" hide-footer v-model="addNewRoute" size="xs">
            <template v-slot:modal-title>
                Nueva Ruta
            </template>
            <div class="row">
                <div class="col-md">
                    <b> Codigo </b>
                    <b-input v-model="infonewroute.code"></b-input>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-md">
                    <b> Descripción </b>
                    <b-input v-model="infonewroute.description"></b-input>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-md">
                    <b> Version </b>
                    <b-input type="number" v-model="infonewroute.version"></b-input>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col text-right" >
                    <b-btn variant="info" @click.prevent="addNewRoute=false"> Cancelar </b-btn>
                    <b-btn variant="success" v-if="this.infoProduct.product_id != 0" @click="saveNewRoute()"> Crear Ruta </b-btn>
                </div>
                <!-- <div class="col-md-6"><b-button block @click="addDuration = false">Cerrar</b-button></div> -->
            </div>
        </b-modal>
                <!-- BORRADO DE LA RUTA ASOCIADA A LA REFERENCIA -->
        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar registro" ref="errDeleteMeasure">
                <div class="w-100 text-danger"> <strong></strong> </div>
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                   Este movimiento generará cambios en la operacion de este producto en todas las ubicaciones que se tengan. Desea continuar?
                </div>
                
                <template slot="button"><b-btn @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="$refs.errDeleteMeasure.close()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
            <sweet-modal ref="longModal">
                <div class="text-left">
                    <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
                </div>
            </sweet-modal>
        </div>
        <!-- BORRADO DE LA RUTA ASOCIADA A LA REFERENCIA -->
        
        <!-- BORRADO DE LA RUTA ASOCIADA A LA REFERENCIA -->
        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
                <div class="w-100 text-danger"> <strong></strong> </div>
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                    {{mensaje_borrado}}
                </div>
                
                <template slot="button"><b-btn @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="$refs.errorWithButtonAlert.close()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
            <sweet-modal ref="longModal">
                <div class="text-left">
                    <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
                </div>
            </sweet-modal>
        </div>
        <!-- BORRADO DE LA RUTA ASOCIADA A LA REFERENCIA -->
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css" > </style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>

<script>
import Vue from 'vue'
import Axios from 'axios'
import Multiselect from 'vue-multiselect'
import Notifications from 'vue-notification'
import VueTypeahead from 'vue-typeahead'
import process_detail from '@/components/sbx/config/details/details_routes'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import { infomaster } from '@/components/i40/js/master'
import { infomainten } from '@/components/i40/js/maintenance'
import { infoconfig } from "@/components/i40/js/config";
import { infosysconfig } from "@/components/i40/js/sysconfig";
import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";
import { inforundb } from "@/components/i40/js/rundb";
import VueMarkdown from 'vue-markdown';


import ImageUploader from 'vue-image-upload-resize'
import VueUploadComponent from 'vue-upload-component'
Vue.use(ImageUploader);

import RouteController from '@/components/sbx/config/details/route_controller'
import BOMController from '@/components/sbx/master/details/bom_controller'
import FilesController from '@/components/sbx/controls/files_controller'

import { config,master } from "@/components/i40/js/globals";

Vue.use(Notifications)
// Vue.prototype.$http = Axios


export default {
        metaInfo: {
        title: 'Administración y Edición de Productos'
        },

    extends: VueTypeahead,
    components: {
        SweetModal,
        VueMarkdown,
        SweetModalTab,
        Multiselect,
        'process-detail':process_detail,
        'route-controller': RouteController,
        'bom-controller': BOMController,
        'files-controller': FilesController
    },
    data() {
        return {
            itemsPlants:[],
            infonewroute:{},
            addNewRoute:false,
            addDuration:false,
            infoDuration:{code_duration: null, max_value: null, product_duration_id:0},
            infoMeasure:[],
            columnsMeasure:[
                // {key:'complete', label:"Completo"},
                {key:'description_duration', label:"Unidade de Medida"},
                {key:'max_value', label:"Valor Maximo"},
                // {key:'currentValue', label:"Valor Actual"},
                {key:'edit', label:"Edit"}],

            name: 'details_product',
            version: 'v1.0.0.0',
            show_tree:false,

            hasImage: false,
            image: null,
           
            contentWiki: "",

            title:"Administración y Edición Productos",
            mensaje_borrado:'',
            singleStringValue: '',
            product_type: ['MTS', 'MTO'],
            disabledcode : false,
            description:"",
            product_selected_id:0,
            infoProduct:{
                product_id: 0, 
                code: '', 
                description: '', 
                families_id : 0, 
                um:'',
                details: '', 
                active:true, 
                type_product:'MTS',
                selectedum:null,
                input:false,
                lines_id:0,
            },

            selected_forms:{},
            familyselected:{},
            lineselected:{},
            
            infoLines:[],
            infoFamilies:[],
            infoForms:[],
            infoUnityMeasurement:[],
            showEditProduct : false,
            user_form:[],

            info_product_map:{},

            objState:{},

            selectTab:'lista_materiales',

            ///Informacion Lista de Materiales
                delete_option_mp: 'tab',
                verPreparacion:false,
                // tableBOM:[],
                // columnsBOM: [
                //     // {key:'complete', label:"Completo"},
                //     {key:'sequence', label:"Orden"},
                //     {key:'code', label:"Código"},
                //     {key:'description', label:"Descripción"},
                //     {key:'amount_per_parent', label:"Cantidad x Padre"},
                //     {key:'edit', label:"Edit"}],

                showAddEditMaterials:false,
                showAddEditMaterialsDetails:false,

                listDefinitionBOM:[],
                listDetaulsBOM:[],

                itemNewDetailBOM:{
                    sequence:null,
                    itemTransactionType:null,
                    amount_per_parent:null,
                    parent_id:0,
                    child_id:0,
                    details_bill_of_materials_id:0,
                    bill_of_materials_id:0
                },

                itemNewDefinitionBOM:{
                    bill_of_materials_id:0,
                    name:null,
                    comments:null,
                    default:false,
                    parent_id:0,
                    version:0,
                },

                itemProductSelected:{},
            ///Informacion Lista de Materiales


            ////Informacion Rutas de Procesos

                tableRutasProcesos:[],
                showAddRoute:false,
                itemRouteSelected:{},
                itemNewRoute:{},
                itemDelete:{},
                
                columnsRutasProcesos: [
                // {key:'complete', label:"Completo"},
                {key:'code', label:"Código"},
                {key:'description', label:"Descripción"},
                {key:'default', label:"Ruta por Defecto"},
                {key:'edit', label:"Edit"}],

            ////Informacion Rutas de Procesos

            ////Buscar Rutas
                value:'',
                src: '',
                limit: 10,
                minChars: 2,
            ////Buscar Rutas

            ///Buscar Productos
                valueProduct:'',
            ///Buscar Productos

            ///INFO TIEMPOS
                showEditFormTools: false,
                tableRouteOperations:[],
                itemSelectedTool:{},
                valueSelectedTool:'',

                speedTableData:[],
                columnsSpeeds: [
                    {key:'id', label:"id", thClass: 'd-none', tdClass: 'd-none'},
                    {key:'speed_config_id', label:"id", thClass: 'd-none', tdClass: 'd-none'},
                    {key:'code', label:"Código"},
                    {key:'description', label:"Descripción"},
                    {key:'standard_time_cycle', label:"Ciclo Estandar"},
                    {key:'unity_expected_cycle', label:"Unidades por Ciclo"},
                    {key:'change_metrics', label:"Cambiar Metricas/Usuarios"},
                    {key:'modify_unity_expected', label:"Modificar Unidades"},
                    {key:'edit', label:"Edit"}
                ],

                infoTimes: {},

            ///INFO TIEMPOS

            ////INFO CLIENTES
                showEditFormCustomers:false,
                valueSelectedCustomer:'',
                itemSelectedCustomer:{},
                itemCustomerProduct:{},

                tableCustomerProduct:[],
                columnsCustomerProducts: [
                    // {key:'complete', label:"Completo"},
                    {key:'code', label:"Código"},
                    {key:'description', label:"Descripción"},
                    {key:'customer', label:"Cliente"},
                    {key:'price', label:"Precio"},
                    {key:'edit', label:"Editar"}
                ],

            ////INFO CLIENTES

             ////INFO PROVEEDORES
                showEditFormSupplier:false,
                valueSelectedSupplier:'',
                itemSelectedSupplier:{},
                itemSupplierProduct:{},

                tableSupplierProduct:[],
                columnsSupplierProducts: [
                    // {key:'complete', label:"Completo"},
                    {key:'code', label:"Código"},
                    {key:'description', label:"Descripción"},
                    {key:'supplier', label:"Proveedor"},
                    {key:'price', label:"Precio"},
                    {key:'edit', label:"Editar"}
                ],

                item_orginal_form:{},

            ////INFO PROVEEDORES

            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },
            
            moduleSelected:'',
        }
    },
    methods: {

        isRTL () {
        return document.documentElement.getAttribute('dir') === 'rtl' ||
                document.body.getAttribute('dir') === 'rtl'
        },

        saveNewRoute(){
            this.infonewroute.product_id = this.infoProduct.product_id
            infoconfig.routes(this.infonewroute,"0","insert-product").then(data => {
                if(data.status == 200){
                    this.listProductRoute()
                    this.showCustom('bg-success text-white', "Registo Guardad","¡El registro se ha guardado con éxito!")
                    this.addNewRoute = false

                }else{
                    this.showCustom('bg-danger text-white', "Error registro","¡Error Guardando el Registro!")
                }
            })
        },

        openNewRoute(){
            this.infonewroute={
                code:null,
                description:null,
                version:null
            }
            this.addNewRoute = true
        },

        saveDuration(){
            this.infoDuration.product_id=this.infoProduct.product_id
            infomainten.durationProducts(this.infoDuration,this.infoDuration.product_duration_id == 0 ? "insert" : "update").then(data => {
                if(data.data != ""){
                    this.infoMeasure = data.data
                }else{
                    this.infoMeasure = []
                }
            })
        },
        saveDurationAllConfig(){
            this.infoDuration.product_id=this.infoProduct.product_id
            infomainten.durationProducts(this.infoDuration,'update_apply').then(data => {
                if(data.data != ""){
                    this.infoMeasure = data.data
                }else{
                    this.infoMeasure = []
                }
            })
        },

        setImage: function(output) {
            let postAction = 'products/'+this.$route.params['idproduct']+'/profile'
            
            this.hasImage = true;
            this.image = output;

            // console.log(output)

            inforundb.uploadImage(postAction, output).then(data=>{

            })
        },

        downloadProfilePicture: function() {
            let postAction = 'products/'+this.$route.params['idproduct']+'/profile'
            
            inforundb.downloadProfilePicture(postAction).then(data=>{
                try{
                    if(data.data.byteLength>0){
                        // console.log(data.data)
                        var _imageEncode = function (arrayBuffer) {
                            let u8 = new Uint8Array(arrayBuffer)
                            let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer),function(p,c){return p+String.fromCharCode(c)},''))
                            let mimetype="image/jpeg"
                            return "data:"+mimetype+";base64,"+b64encoded
                        }
                        let image = _imageEncode(data.data)
                        this.hasImage = true;
                        this.image = {}
                        this.image["dataUrl"]=image;
                        
                    }
                }catch{
                    this.hasImage = false;
                }
            })
        },

        showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
        },

        tree_product_info(index, product, id_list){
            // console.log("data")
            infoconfig.productstructure(product, id_list).then(data => {
                // console.log(data)
                if (data.status === 202){
                }else{
                    // console.log(data.data)
                    // this.info_product_map = JSON.parse(JSON.stringify(data.data))
                }
            })

        },

         ///Funcion para cargar la ayuda del helper
             openHelp: function(){
                //  this.contentWiki = "# FFFF"
                ApiWikiHelp(this.version, this.name).then(data => {
                    this.contentWiki = data.data
                })
                .catch(data =>{
                    this.contentWiki = data.data
                })
                this.$refs.longModal.open()
            },

        submit_form(value){
            if(value == 'insert'){
                for (let index = 0; index < this.selected_forms.fields.length; index++) {
                    const element = this.selected_forms.fields[index];
                    if(element.type != 'titulo')
                        this.selected_forms.fields[index]["value"] = document.getElementById(element.field_id).value
                }

                this.infoProduct.details = JSON.parse(JSON.stringify(this.selected_forms.fields))
                infomaster.products(this.infoProduct, '0', "update-detail").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error registro","¡Error Guardando el Registro!")
                }else{
                        if(this.infoProduct.product_id === 0){
                            this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                            
                        }else{
                            this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                        }
                    }
                })
            }else{
                this.infoProduct.details = undefined
                infomaster.products(this.infoProduct, '0', "update-detail").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error registro","¡Error Guardando el Registro!")
                }else{
                        if(this.infoProduct.product_id === 0){
                            this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                            
                        }else{
                            this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                            this.infoProduct.details = {}
                        }
                    }
                })
                

                for (let index = 0; index < this.selected_forms.fields.length; index++) {
                    const element = this.selected_forms.fields[index];
                    if(element.type != 'titulo')
                        this.selected_forms.fields[index]["value"] = undefined
                }
            }
            // 
        },

    /// FAMILIAS, DEFINICÓN DE PRODUCTO
        forms_config(){
            this.selected_forms = {}
            this.familyselected = {}
            infosysconfig.forms([],"select").then(data => {
                if(data.data != "")
                    this.infoForms = data.data

                for (let index = 0; index < this.infoForms.length; index++) {
                    const element = this.infoForms[index];
                    if(element.forms_id == this.infoProduct.forms_id)
                        // this.infoProduct.forms_id = this.infoProduct.selected_forms.forms_id
                        this.selected_forms = element
                }
            })

            infosysconfig.um([],"select").then(data => {
                this.infoUnityMeasurement = data.data
            })
        },

        nameWithLang ({ families_id, description }) {
            return `${description}`
        },

        nameUm ({ code, description }) {
            return `${code} - ${description}`
        },

        ///Guarda el encabezado de la referencia
        submit(){
            if(this.validate_content()){

                this.infoProduct.families_id = this.familyselected.families_id
                this.infoProduct.liness_id = this.lineselected.lines_id
                this.infoProduct.unity_measure = this.infoProduct.selectedum.code
                this.infoProduct.module=this.$route.params['module']

                this.infoProduct.price_list = this.infoProduct.price_list == '' || this.infoProduct.price_list == undefined  || this.infoProduct.price_list == null ? 0 : this.infoProduct.price_list
                this.infoProduct.standard_cost = this.infoProduct.standard_cost == '' || this.infoProduct.standard_cost == undefined  || this.infoProduct.standard_cost == null ? 0 : this.infoProduct.standard_cost
                if(this.selected_forms != {})
                    this.infoProduct.forms_id = this.selected_forms.forms_id

                infomaster.products(this.infoProduct, '0', this.infoProduct.product_id == "0" ? "insert" : "update").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error registro","¡Error Guardando el Registro!")
                    }else{
                        if(this.infoProduct.product_id === 0){
                            this.showCustom('bg-success text-white', "Guardar Registro","¡El Registro se ha Guardado con Éxito!")
                            this.infoProduct = data.data[0]
                            this.$route.params.idproduct = this.infoProduct.product_id
                            this.$router.replace({ name: "products_details", params: {idproduct:this.infoProduct.product_id}})
                        }else{
                            this.showCustom('bg-warning text-white', "Modificar Registro","¡El Registro se ha Modificado con Éxito!")
                        }
                        // this.tableRutasProcesos = data.data
                        this.showEditProduct=false
                        this.load_infoproduct()
                        // this.objInfoOperation.route_id = this.objInfo.route_id
                    }
                })
            }else{
                this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
            }

            // console.log(this.infoProduct)
        },
    /// FAMILIAS, DEFINICÓN DE PRODUCTO

    /// CONTROL DE RUTAS DE PROCESO
        saverouteproduct(){
            this.itemNewRoute.product_id=this.infoProduct.product_id

            infoconfig.routeproduct(this.itemNewRoute, 0, this.itemRouteSelected.template ? "insert-clone" : "insert").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Registro Creado","¡El Registro se ha Creado con Éxito!")        
                    this.tableRutasProcesos = data.data
                    this.showAddRoute = false
                }
            })
        },

        loadInfoToDelete(item){
            this.$refs.errorWithButtonAlert.open(); 
            this.itemDelete=item;
            this.itemDelete.product_id = this.infoProduct.product_id
        },

        listProductRoute(){
             infoconfig.routeproduct([], this.infoProduct.product_id, "select").then(data => {
                
                if(data.data != '')
                    this.tableRutasProcesos = data.data
                
            })

            infoconfig.routeproduct([], this.infoProduct.product_id, "select_routes_operations").then(data => {
                this.tableRouteOperations = data.data
            })
            
        },

        setDefaulRouteProduct(item){
            item.product_id=this.infoProduct.product_id
             infoconfig.routeproduct(item, '0', 'update').then(data => {
                this.tableRutasProcesos = data.data
            })
        },

    /// CONTROL DE RUTAS DE PROCESO


    /// BORRADO DE DATOS
        
        deleteRecord(){
            if(this.selectTab == "route"){
                infoconfig.routeproduct(this.itemDelete, 0, "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Creado","¡El Registro se ha Creado con Éxito!")
                        this.tableRutasProcesos = data.data
                         this.$refs.errorWithButtonAlert.close(); 
                    }
                })
            }else if(this.selectTab == "herramentales"){
                infoconfig.producttools(this.itemSelectedTool, 0, "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Borrar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Borrado","¡El Registro se ha Borrado con Éxito!")
                        this.speedTableData = data.data
                         this.$refs.errorWithButtonAlert.close(); 
                    }
                })
            }else if(this.selectTab == "clientes"){
                infoconfig.customerproducts(this.itemCustomerProduct, "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Borrar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Borrado","¡El Registro se ha Borrado con Éxito!")
                        this.tableCustomerProduct = data.data
                         this.$refs.errorWithButtonAlert.close(); 
                    }
                })
            }else if(this.selectTab == "proveedores"){
                infoconfig.supplierproducts(this.itemSupplierProduct, "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Borrar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Borrado","¡El Registro se ha Borrado con Éxito!")
                        this.tableSupplierProduct = data.data
                         this.$refs.errorWithButtonAlert.close(); 
                    }
                })
            }else if(this.selectTab == "frecuencia"){
                infomainten.durationProducts(this.infoProduct.product_id,"select").then(data => {
                    if(data.data != ""){
                        this.infoMeasure = data.data
                    }else{
                        this.infoMeasure = []
                    }
                })
            }else{
                if(this.delete_option_mp == "tab"){
                    infoconfig.billofmaterialscontrol(this.itemDelete, 0, "delete").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
                        }else{
                            this.showCustom('bg-success text-white', "Registro Creado","¡El Registro se ha Creado con Éxito!")
                            this.listDefinitionBOM = data.data
                            this.showAddEditMaterials=false
                             this.$refs.errorWithButtonAlert.close(); 
                        }
                    })
                }else{
                    infoconfig.detailsbillofmaterialscontrol(this.itemDelete, 0, "delete").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
                        }else{
                            this.showCustom('bg-success text-white', "Registro Creado","¡El Registro se ha Creado con Éxito!")
                            this.listDefinitionBOM = data.data
                            this.showAddEditMaterials=false
                            this.itemNewDetailBOM = {sequence:null,
                            itemTransactionType:null,
                            amount_per_parent:null,
                            parent_id:0,
                            child_id:0,
                            details_bill_of_materials_id:0,
                            bill_of_materials_id:0}
                            this.valueProduct = ''
                            this.$refs.errorWithButtonAlert.close(); 
                            this.$refs.errorWithButtonAlert.close(); 
                        }
                    })
                }
            }
        },

    /// BORRADO DE DATOS

    /// recetas
        // save_new_product(item){
        //     this.itemNewDetailBOM.bill_of_materials_id = item
        //     if( this.itemNewDetailBOM.child_id == 0)
        //         this.itemNewDetailBOM.child_id = this.itemProductSelected.product_id

        //     this.itemNewDetailBOM.parent_id = this.infoProduct.product_id

        //     infoconfig.detailsbillofmaterialscontrol(this.itemNewDetailBOM, 0, this.itemNewDetailBOM.details_bill_of_materials_id == 0 ? "insert" : "update").then(data => {
        //         if (data.status === 202){
        //             this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
        //         }else{
        //             this.showCustom('bg-success text-white', "Registro Creado","¡El Registro se ha Creado con Éxito!")
        //             this.listDefinitionBOM = data.data
        //             this.showAddEditMaterials=false
        //             this.itemNewDetailBOM = {sequence:null,
        //                 itemTransactionType:null,
        //                 amount_per_parent:null,
        //                 parent_id:0,
        //                 child_id:0,
        //                 details_bill_of_materials_id:0,
        //                 bill_of_materials_id:0}
        //             this.valueProduct = ''
        //         }
        //     })
        // },

        // editChildProduct(item){
        //     this.showAddEditMaterialsDetails=true; 
        //     this.itemNewDetailBOM= JSON.parse(JSON.stringify(item)); 
        //     this.valueProduct = item.description
        // },

        editMeterials(item){
            this.itemNewDefinitionBOM = item
            this.showAddEditMaterials = true
        },
        save_new_definition(){
            this.itemNewDefinitionBOM.parent_id = this.infoProduct.product_id
            
            infoconfig.billofmaterialscontrol(this.itemNewDefinitionBOM, 0, this.itemNewDefinitionBOM.bill_of_materials_id == 0 ? "insert" : "update").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Registro Creado","¡El Registro se ha Creado con Éxito!")
                    if(data.data != ""){
                        this.listDefinitionBOM = data.data
                        this.showAddEditMaterials=false
                    }
                }
            })
        },

        loadRecetas(){
            infoconfig.billofmaterialscontrol([], this.infoProduct.product_id, "select").then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error al Crear el Registro!")
                }else{
                    // console.log(data.data)
                    if (data.data != "")
                        this.listDefinitionBOM = data.data
                }
            })
        },

        setDefaulBOMroduct(item){
            this.listDefinitionBOM = []
            item.product_id=this.infoProduct.product_id
            infoconfig.billofmaterialscontrol(item, '0', 'update-default').then(data => {
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error al Modificar el Registro!")
                }else{
                    this.listDefinitionBOM = data.data
                    this.showCustom('bg-warning text-white', "Registro Modificado","¡El registro se ha modificado con éxito!")
                }
                 
            })
        },
    /// recetas

    ///Eventos buqueda
        onHit (item) {
            if(this.selectTab == 'route'){
                this.itemRouteSelected = item
                this.itemNewRoute = JSON.parse(JSON.stringify(item))
                this.showAddRoute = true
                this.value = ''
                this.reset()
            }else if(this.selectTab == 'lista_materiales'){
                // this.valueProduct = item.description
                this.itemProductSelected = item
            }else if(this.selectTab == 'herramentales'){
                this.itemSelectedTool=item
                this.itemSelectedTool.change_metrics=false
                this.valueSelectedTool=item.description
            }else if(this.selectTab == 'clientes'){
                this.itemSelectedCustomer=item
                this.valueSelectedCustomer=item.name
                this.itemCustomerProduct.customer_id = item.customers_id
            }else if(this.selectTab == 'proveedores'){
                this.itemSelectedSupplier=item
                this.valueSelectedSupplier=item.name
                this.itemSupplierProduct.supplier_id = item.supplier_id
            }
        },

        updateQueryTools () {
            this.query = this.valueSelectedTool
            this.update()
        },


        updateQueryCustomer(){
            this.query = this.valueSelectedCustomer
            this.update()
        },

        updateQuerySupplier(){
            this.query = this.valueSelectedSupplier
            this.update()
        },


        updateQuery () {
            this.query = this.value
            this.update()
        },

        resetInput () {
            this.value = ''
            this.valueSelectedTool=''
            this.reset()
        },

        eventSelectedTab(tab){
            // if(tab == "detalles"){
            //     for (let index = 0; index < this.infoForms.length; index++) {
            //         const element = this.infoForms[index];
                   
            //         if(element.forms_id == this.infoProduct.forms_id){
            //             this.item_orginal_form = JSON.parse(JSON.stringify(element))
            //             this.infoProduct.selected_forms = element
            //             if( this.infoProduct.details != null){
            //                 if(this.infoProduct.details.length >0){
            //                     this.infoProduct.selected_forms.fields = this.infoProduct.details
            //                 }
            //             }
            //         }
            //     }
            // }
            
            this.show_tree=false
            this.selectTab=tab
            this.mensaje_borrado = 'El registro será borrado de forma lógica, pero su información será visible en reportes.'
            this.configInfoTab()
        },

        configInfoTab(){
            this.listProductRoute()
            if(this.selectTab=='route')
                this.src = config+'routesearch/'
            else if(this.selectTab=='lista_materiales')
                this.src = master+'productsearch/'
            else if(this.selectTab=='clientes'){
                this.src = master+'customersearch/'
                this.mensaje_borrado = 'El registro será borrado de forma permanente, esta acción no se podrá deshacer.'
                this.itemCustomerProduct.product_id = this.infoProduct.product_id
                infoconfig.customerproducts(this.itemCustomerProduct,"select").then(data =>{
                    this.tableCustomerProduct = []
                    if(data.data != "")
                        this.tableCustomerProduct = data.data
                })
            } else if(this.selectTab=='proveedores'){
                this.src = master+'suppliersearch/'
                this.mensaje_borrado = 'El registro será borrado de forma permanente, esta acción no se podrá deshacer.'
                this.itemSupplierProduct.product_id = this.infoProduct.product_id
                infoconfig.supplierproducts(this.itemSupplierProduct,"select").then(data =>{
                    this.tableSupplierProduct = []
                    if(data.data != "")
                        this.tableSupplierProduct = data.data
                })
            }else if(this.selectTab=='herramentales'){
                this.src = config+'toolssearch/'
                this.mensaje_borrado = 'El registro será borrado de forma permanente, esta acción no se podrá deshacer.'
                this.itemSelectedTool.product_id = this.infoProduct.product_id                
                infoconfig.producttools(this.itemSelectedTool,this.infoProduct.product_id,"select").then(data =>{
                    this.speedTableData = []
                    if(data.data != "")
                        this.speedTableData = data.data
                })
            }else if(this.selectTab == "frecuencia"){
                infomainten.durationProducts(this.infoProduct.product_id,"select").then(data => {
                    if(data.data != ""){
                        this.infoMeasure = data.data
                    }else{
                        this.infoMeasure = []
                    }
                })
            }
        },
    ///Eventos buqueda

    ////TOOLS PRODUCT
        submitProductTools(){
            this.itemSelectedTool.product_id = this.infoProduct.product_id
            infoconfig.producttools(this.itemSelectedTool,this.infoProduct.product_id, this.itemSelectedTool.tools_route_operation_product_id == undefined ? "insert" : "update").then(data =>{
                this.speedTableData = []
                if(data.data != "")
                    this.speedTableData = data.data
            })
        },
    ////TOOLS PRODUCT

    ////CUSTOMERS PRODUCTS
        submitCustomersProducts(){
            if(this.customerproducts()){

            this.itemCustomerProduct.product_id = this.infoProduct.product_id
            infoconfig.customerproducts(this.itemCustomerProduct,this.itemCustomerProduct.customer_products_id == undefined ? "insert" : "update").then(data =>{
                this.tableCustomerProduct = []
                if(data.data != "")
                    this.tableCustomerProduct = data.data
                this.showEditFormCustomers = false
            })
            }else{
                this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
            }
        },
    ////CUSTOMERS PRODUCTS

    ////SUPPLIER PRODUCTS
        submitSupplierProducts(){
            this.itemSupplierProduct.product_id = this.infoProduct.product_id
            infoconfig.supplierproducts(this.itemSupplierProduct,this.itemSupplierProduct.supplier_products_id == undefined ? "insert" : "update").then(data =>{
                this.tableSupplierProduct = data.data
            })
        },
         ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

            validate_content(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este es un Campo Obligatorio'

                if (this.infoProduct.code == ''){
                    this.objState.code = 'invalid'
                    isOK = false;
                }else{
                    this.objState.code = 'valid'
                }
                if (this.infoProduct.description == ''){
                     this.objState.description = 'invalid'
                     isOK = false;
                }else{
                    this.objState.description = 'valid'
                }
                return isOK
            },
            
            ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

            customerproducts(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este es un Campo Obligatorio'

                if (this.itemCustomerProduct.code == '' || this.itemCustomerProduct.code == undefined){
                    this.objState.code = 'invalid'
                    isOK = false;
                }else{
                    this.objState.code = 'valid'
                }
                if (this.itemCustomerProduct.description == '' || this.itemCustomerProduct.description == undefined){
                     this.objState.description = 'invalid'
                     isOK = false;
                }else{
                    this.objState.description = 'valid'
                }
                if (this.itemCustomerProduct.price == '' || this.itemCustomerProduct.price == undefined){
                     this.objState.price = 'invalid'
                     isOK = false;
                }else{
                    this.objState.price = 'valid'
                }
                return isOK
            },

            load_infoproduct(){
                let param_id=this.$route.params['idproduct']
                if(param_id!=0 && param_id!=undefined){
                    this.infoProduct.product_id = param_id

                    infomaster.lines(this.moduleSelected,"select").then(datalines => {
                        this.infoLines = []
                        // console.log(datalines)
                        if(datalines.data != ""){
                            var lines = datalines.data
                            for (let index = 0; index < lines.length; index++) {
                                const element = lines[index];
                                this.infoLines.push({
                                    lines_id: element.lines_id,
                                    description: element.description
                                })
                                if(this.infoProduct.lines_id == element.lines_id){
                                    this.lineselected = element
                                }
                            }
                        }
                    })

                    infomaster.products([], param_id, "select-product").then(dataproduct => {
                        if (dataproduct.status === 202){
                            this.showCustom('bg-danger text-white', "Obtener Información","¡Error al Obtener la Información Solicitada!")
                        }else{
                            var info_obtenida = dataproduct.data[0]
                            this.infoProduct = dataproduct.data[0]
                            this.selectTab = this.infoProduct.input?'proveedores':'lista_materiales'

                            infomaster.families(this.moduleSelected,"select","").then(datafamilies => {
                                this.infoFamilies = []
                                if(datafamilies.data != ""){
                                    var families = datafamilies.data
                                    for (let index = 0; index < families.length; index++) {
                                        const element = families[index];
                                        this.infoFamilies.push({
                                            families_id: element.families_id,
                                            description: element.description
                                        })

                                        if(this.infoProduct.families_id == element.families_id){
                                            this.familyselected = element
                                        }
                                    }
                                }

                                infosysconfig.um([],"select").then(dataum => {
                                    let content = dataum.data
                                    this.infoUnityMeasurement = []
                                    for (let index = 0; index < content.length; index++) {
                                        const element = content[index];
                                        this.infoUnityMeasurement.push(element)

                                        if(element.code==this.infoProduct.selectedum){
                                            this.infoProduct.selectedum = element
                                        }
                                    }
                                })

                                infosysconfig.forms([],"select").then(datafms => {
                                    this.selected_forms = {}
                                    if(datafms.data != ""){
                                        this.infoForms = JSON.parse(JSON.stringify(datafms.data))
                                        var start_forms = JSON.parse(JSON.stringify(datafms.data))

                                        for (let index = 0; index < start_forms.length; index++) {
                                            const element = start_forms[index];
                                            if(element.forms_id == info_obtenida.forms_id){
                                                // this.infoProduct.forms_id = this.infoProduct.selected_forms.forms_id
                                                this.selected_forms = JSON.parse(JSON.stringify(element))
                                                start_forms = JSON.parse(JSON.stringify(element))
                                            }
                                        }
                                        this.selected_forms.fields = []

                                        this.showEditProduct=false

                                        for (let index = 0; index < start_forms.fields.length; index++) {
                                            const element = start_forms.fields[index];

                                            var exists = false
                                            
                                            if(this.infoProduct.details != null){
                                                for (let index_1 = 0; index_1 < this.infoProduct.details.length; index_1++) {
                                                    const element_1 = this.infoProduct.details[index_1];
                                                    if(element_1.field_id == element.field_id){
                                                        exists =true
                                                        element.value = element_1.value
                                                    }
                                                }
                                            }
                                            // if(exists)
                                            this.selected_forms.fields.push(element)
                                        }
                                        
                                        this.configInfoTab()
                                    }
                                })
                            })
                            
                        }
                    })
                }else{
                    this.showEditProduct=true


                    infosysconfig.um([],"select").then(dataum => {
                        // this.infoUnityMeasurement = {}
                        if(dataum.data != ""){
                            this.infoUnityMeasurement = dataum.data
                        }
                    })

                    infosysconfig.forms([],"select").then(datafms => {
                        this.selected_forms = {}
                        if( datafms.data != ""){
                            // console.log(datafms.data)
                            this.infoForms = datafms.data
                        }
                    })
                }
            }
        },

    ////SUPPLIER PRODUCTS
    
    mounted() {
        infomaster.families(this.moduleSelected,"select","").then(datafamilies => {
            this.familyselected=null
            if(datafamilies.data != ""){
               this.infoFamilies = datafamilies.data
            }
        })
        
        this.load_infoproduct()
        
        this.listProductRoute()
        this.loadRecetas()

        this.eventSelectedTab(this.moduleSelected != 'mnt'?'lista_materiales':'proveedores')
        this.downloadProfilePicture()
    },
    
    created() {
        this.moduleSelected = this.$route.params['module']
        this.selectTab= this.moduleSelected != 'mnt'?'lista_materiales':'proveedores'

        this.title = this.moduleSelected != 'mnt'?'Administración y Edición Productos':'Administración y Edición de Equipos'
        

        if(this.moduleSelected == 'mnt'){
            this.infoProduct.input = true
        }
    },
}
</script>
<style>
.tree {
  height: 800px;
  border: 1px solid #cccccc;

}
.graph-root {
  height: 800px;
  width: 100%;
}
.feedback{
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
}
.log  {
  height: 200px;
  overflow-x: auto;
  overflow-y: auto;
  overflow: auto;
  text-align: left;
}
</style>

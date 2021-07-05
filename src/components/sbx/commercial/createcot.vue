<template>
<!-- :fields="columns" -->
    <div>
        <b-alert show variant="danger" v-if="headercomplete.deleted">Esta Cotizacion Fue Cancelada</b-alert>
        <!-- {{this.selectedProductItem }} -->
        <notifications group="notifications-default" />
        <b-row>
            <b-col>
                <h4 class="font-weight-bold py-3 mb-0"> Crear Cotizaciones </h4>
            </b-col>
            <b-col>
                <h5 class="font-weight-bold py-3 mb-0 text-center"> Cotizacion Número: {{quotation_id == 0 ? '########' : quotation_id}}</h5>
            </b-col>
        </b-row>

        <b-row class="text-center mb-2" v-if="quotation_id != 0 && editOrderCreated == false">
            <b-col>
                <h4 style="margin-bottom:2px">
                    {{valueSelectedCustomer}}
                </h4>
                <div> 
                    {{document_type_text}}
                </div>
                <div>
                   <b> Direccion de Facturación: </b> {{invoice_address}}
                </div>
                <div>
                   <b> Direccion de Envío de Mercancía: </b> {{shipping_address}}
                </div>
                <div>
                   <b> Días de Vencimiento de la Oferta: </b> {{expiration_days}}
                </div>
                <div>
                    <i class="fas fa-circle text-success" v-if="(customerInfo['quota']-customerInfo['total'])>0"></i>
                    <i class="fas fa-circle text-danger" v-else></i>
                    <b> Cupo Disponible: </b> {{numberWithCommas(customerInfo['quota']-customerInfo['total'])}}
                </div>
                <div>
                    <i class="fas fa-circle text-success" v-if="customerInfo['portfolio_ok']==0"></i>
                    <i class="fas fa-circle text-danger" v-else></i>
                    <b>Plazo: </b> {{customerInfo['term_days']}}
                </div>
                
                <b-btn size="xs" variant="outline-secondary" @click="showCarteraDetail=true"><i class="fas fa-wallet"></i>&nbsp; Detalle Cartera</b-btn>
                <b-btn size="xs" variant="outline-warning" @click="editHeaderOrder()"><i class="fas fa-edit"></i>&nbsp; Editar Cotizacion</b-btn>
                <b-btn size="xs" variant="outline-info" :to="'/comm/cot/'+orderLocation+'/0'"><i class="fas fa-trash-alt"></i>&nbsp; Nueva Cotizacion</b-btn>
                <b-btn size="xs" variant="outline-success" @click="convertToOrder()" v-if="!this.infoHeader.released"><i class="fas fa-check"></i>&nbsp; Convertir en Pedido</b-btn>
                <b-btn size="xs" variant="outline-success" @click="$refs.confirmApproved.open()" v-if="this.infoHeader.released && !this.infoHeader.approved"><i class="fas fa-check"></i>&nbsp; Aprobar Cotizacion</b-btn>
                <b-btn size="xs" variant="outline-success" @click="printOrder()"><i class="fas fa-check"></i>&nbsp; Imprimir Cotizacion</b-btn>
                <!-- <b-btn size="xs" variant="outline-success" :to="'/print/'+quotation_id"><i class="fas fa-check"></i>&nbsp; Imprimir Cotizacion</b-btn> -->
                <b-btn size="xs" variant="outline-danger" @click="$refs.confirmCancelOrder.open()" v-if="!this.infoHeader.released"><i class="fas fa-ban"></i>&nbsp; Cancelar Cotizacion</b-btn>
                <!-- 148936 -->
            </b-col>
        </b-row>
        
        <div v-if="quotation_id == 0 || editOrderCreated == true">
            <b-row class="border rounded border-white">
                <b-col md="8" sm="12">
                    <div class="position-relative mb-3 mt-2">
                        <b-input-group>
                            <b-input-group-text slot="prepend" v-if="loading">
                                <i class="ion ion-md-sync"></i>
                            </b-input-group-text>
                            <b-input-group-text slot="prepend" v-if="!loading">
                                <i class="ion ion-ios-search"></i>
                            </b-input-group-text>
                            <input type="text" class="form-control"
                                :disabled="quotation_id != 0"
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
                        <div class="dropdown-menu scrollable-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                            <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                <span class="name" v-text="item.nit"></span>
                                <span class="text-muted">{{ item.name }}</span>
                            </a>
                        </div>
                    </div>

                    <b-row class="my-1">
                        <b-col sm="4">
                            <label for="`type-pedido`">Tipo de Pedido:</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-select size="sm" id="`type-pedido`" v-model="document_type" :options="info_order_type"></b-form-select>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="4">
                            <label for="`type-pedido`">Dirección Facturación:</label>
                        </b-col>
                        <b-col sm="8">
                              <b-input-group>
                                  
                                <b-input-group-prepend>
                                    <b-button size="sm" v-if="invoiceAddress.length>1" @click="showSelectedInvoice = !showSelectedInvoice" variant="outline-success icon-btn"> <i class="fas fa-exchange-alt"></i></b-button>
                                </b-input-group-prepend>

                                <b-form-input v-if="!showSelectedInvoice" size="sm" id="`type-fact`" v-model="invoice_address" type="text"></b-form-input>
                                <b-form-select v-if="showSelectedInvoice" size="sm" id="`type-fact`" v-model="invoice_address_id" :options="invoiceAddress"></b-form-select>
                            </b-input-group>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="4">
                            <label for="`type-env`">Dirección Envío:</label>
                        </b-col>
                        <b-col sm="8">
                            <b-input-group>
                                <b-input-group-prepend>
                                    <b-button size="sm" v-if="shippingAddress.length>1" @click="showSelectedProduct = !showSelectedProduct" variant="outline-success icon-btn"> <i class="fas fa-exchange-alt"></i></b-button>
                                </b-input-group-prepend>
                                <b-form-select v-if="showSelectedProduct" size="sm" id="`type-fact`" v-model="shipping_address_id" :options="shippingAddress"></b-form-select>
                                <b-form-input v-if="!showSelectedProduct" size="sm" id="`type-fact`" v-model="shipping_address" type="text"></b-form-input>                            
                            </b-input-group>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="4">
                            <label for="`type-oc`">Codigo de Orden:</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input size="sm" id="`type-oc`" type="text" v-model="document_customer"></b-form-input>
                        </b-col>
                    </b-row>     
                    <b-row class="my-1">
                        <b-col sm="4">
                            <label for="`type-oc`">Dias Vencimiento:</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input size="sm" id="`type-oc`" type="text" v-model="expiration_days"></b-form-input>
                        </b-col>
                    </b-row>                    
                    <!-- <b-row class="my-1">
                        <b-col sm="4">
                            <label for="`type-oc`">Asesor:</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-select size="sm" id="`type-fact`" v-model="consultant_id" :options="consultants"></b-form-select>
                        </b-col>
                    </b-row> -->
                    <b-row class="my-1">
                        <b-col sm="12">
                            <div class="col text-center">
                                <!-- <h3>Propiedades</h3> -->
                                <!-- <b-form-group class="text-left">
                                    <label class="switcher switcher-success">
                                        <input type="checkbox" class="switcher-input"  v-model="multipleDelivered">
                                        <span class="switcher-indicator">
                                        <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                        <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                        </span>
                                        <span class="switcher-label">Pedido Programado - Multiples Entregas</span>
                                    </label>
                                </b-form-group> -->
                            </div>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="12">
                            <div class="col text-center">
                                <!-- <h3>Propiedades</h3> -->
                                <!-- <b-form-group class="text-left">
                                    <label class="switcher switcher-success">
                                        <input type="checkbox" class="switcher-input"  v-model="remisionDelivered">
                                        <span class="switcher-indicator">
                                        <span class="switcher-yes"><span class="ion ion-md-checkmark"></span></span>
                                        <span class="switcher-no"><span class="ion ion-md-close"></span></span>
                                        </span>
                                        <span class="switcher-label">Entrega Remisionado</span>
                                    </label>
                                </b-form-group> -->
                            </div>
                        </b-col>
                    </b-row>
                    <!-- <b-row class="my-1">
                        <b-col sm="4">
                            <label for="`type-oc`">Fecha Comprometida:</label>
                        </b-col>
                        <b-col sm="8">
                            <b-form-input size="sm" id="`type-oc`" type="text"></b-form-input>
                        </b-col>
                    </b-row> -->
                    <b-row>
                        <b-col class="text-right mb-1">
                            <b-btn size="sm" v-if="editOrderCreated" variant="outline-secondary" @click.prevent="editOrderCreated=false"><i class="fas fa-edit"></i>&nbsp; Cancelar Edición</b-btn>
                            <b-btn size="sm" variant="outline-info" :to="'/comm/cot/'+orderLocation+'/0'"><i class="fas fa-trash-alt"></i>&nbsp; Nueva Cotizacion</b-btn>
                            <b-btn size="sm" v-if="editOrderCreated" variant="outline-warning" @click.prevent="saveHeader(); editOrderCreated=false"><i class="fas fa-edit"></i>&nbsp; Editar Cotizacion</b-btn>
                            <b-btn size="sm" v-if="!editOrderCreated" variant="outline-success" @click.prevent="saveHeader(); editOrderCreated=false"><i class="fas fa-plus"></i>&nbsp; Crear Cotizacion</b-btn>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col md="4" sm="12">
                    <div>
                        <!-- <b>00 - 30: </b> <div class="text-right"> {{customerInfo['30_days']}}</div> -->
                        <b-list-group class="mt-2">
                            <b-list-group-item style="padding:5px;"> 
                                <div>
                                    <b>0 - 30 Días</b>
                                    <div class="float-right mr-2"> {{numberWithCommas(customerInfo['30_days'])}} </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item style="padding:5px;"> 
                                <div>
                                    <b>31 - 60 Días</b>
                                    <div class="float-right mr-2"> {{numberWithCommas(customerInfo['31_to_60_days'])}} </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item style="padding:5px;"> 
                                <div>
                                    <b>61 - 90 Días</b>
                                    <div class="float-right mr-2"> {{numberWithCommas(customerInfo['61_to_90_days'])}} </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item style="padding:5px;"> 
                                <div>
                                    <b> + de 90 Días</b>
                                    <div class="float-right mr-2"> {{numberWithCommas(customerInfo['mas_90_days'])}} </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item style="padding:5px;"> 
                                <div>
                                    <b> Cupo Habilitado </b>
                                    <div class="float-right mr-2"> {{numberWithCommas(customerInfo['quota'])}} </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item style="padding:5px;"> 
                                <div>
                                    <b> Cupo Utilizado:</b>
                                    <div class="float-right mr-2"> {{numberWithCommas(customerInfo['total'])}} </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item style="padding:5px;"> 
                                <div>
                                    <i class="fas fa-circle text-success" v-if="(customerInfo['quota']-customerInfo['total'])>0"></i>
                                    <i class="fas fa-circle text-danger" v-else></i>
                                    <b> Cupo Disponible:</b>
                                    <div class="float-right mr-2"> {{numberWithCommas(customerInfo['quota']-customerInfo['total'])}} </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item style="padding:5px;"> 
                                <div>
                                    <i class="fas fa-circle text-success" v-if="customerInfo['portfolio_ok']==0"></i>
                                    <i class="fas fa-circle text-danger" v-else></i>
                                    <b>Plazo</b>
                                    <div class="float-right mr-2"> {{customerInfo['term_days']}} </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item style="padding:0px;"> 
                                <b-btn size="sm" block  @click="showCarteraDetail=true">Ver Detalle Facturas</b-btn>
                            </b-list-group-item>
                        </b-list-group>
                    </div>
                </b-col>
            </b-row>
        </div>

        <b-nav class="justify-content-center mt-2">
            <b-nav tabs class="nav-sm tabs-alt" v-for="(item, ix) in headercomplete.versions">
                <b-nav-item :active="selectTab==item.quotation_version_id" @click="isactive=item.state, selectTab=item.quotation_version_id; selectedVersion()">
                     <b-btn v-if="!item.state" variant="outline-warning borderless icon-btn" class="btn-xs" @click.prevent="activeVersion(item, headercomplete.quotation_id)"><i class="fas fa-circle text-warning"></i></b-btn> 
                     <i  v-if="item.state" class="fas fa-circle text-success"></i> Version {{item.consec}}
                </b-nav-item>

                <b-nav-item :active="false" @click="selectTab=item.quotation_version_id" v-if="headercomplete.versions.length == ix+1">
                </b-nav-item>
            </b-nav>
        </b-nav>
        <div class="text-right">
            <b-btn variant="outline-success borderless" class="btn-xs" @click.prevent="addNewVersion(headercomplete)"><i class="fas fa-plus text-success"></i> Adicionar Nueva Version </b-btn> 
        </div>

         <div v-if="quotation_id != 0" class="border rounded border-white">
             <b-row >
                  <b-col>
                    <div class="position-relative mb-3 mt-2">
                        <b-input-group>
                            <b-input-group-text slot="prepend" v-if="loading">
                                <i class="ion ion-md-sync"></i>
                            </b-input-group-text>
                            <b-input-group-text slot="prepend" v-if="!loading">
                                <i class="ion ion-ios-search"></i>
                            </b-input-group-text>
                            <b-input-group-text slot="prepend" v-if="isDirty || valueSelectedCustomer" @click="resetInput">
                                <input type="checkbox" @change="searchAllProducts" v-model="allProducts" aria-label="Checkbox for following text input"> &nbsp; Todos los Productos
                            </b-input-group-text>
                            <input type="text" class="form-control"
                                :disabled="editOrderCreated || orderDetailsId != 0"
                                placeholder="Busque un Producto"
                                autocomplete="off"
                                v-model="valueSelectedProduct" 
                                @keydown.down="down"
                                @keydown.up="up"
                                @keydown.enter="hit"
                                @keydown.esc="reset"
                                @blur="reset"
                                @input="updateQueryProducts" />
                        </b-input-group>
                        <div class="dropdown-menu scrollable-menu" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
                            <a class="dropdown-item" href="javascript:void(0)" v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
                                <div class="row">
                                    <div class="col-xs-2 col-sm-2 col-md-2" >
                                        <img :src="`${publicUrl}img/public/${item.public_picture}`" alt="" class="img-fluid rounded mx-auto d-block" style="max-height:120px">
                                    </div>
                                    <div class="col-xs-10 col-sm-10 col-md-10">
                                        <span class="name" v-text="item.code"></span> <br>
                                        <span class="text-muted">{{ item.description }}</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </b-col>
             </b-row>


            <div class="ml-1 mr-1" v-if="editOrderDetail">
                <div class="row">
                    <div class="col-xs-4 col-sm-4  col-md-4">
                        <!-- :img-src="`${publicUrl}img/public/${selectedProductItem.public_picture}`" img-alt="Card image cap"  -->
                        <b-card no-body img-top class="card-condenced">
                            <b-list-group flush>
                                <b-list-group-item style="padding: 0.325rem 0.375rem;">
                                    <div class="row">
                                        <div class="col-xs-7 col-sm-7 col-md-7">
                                            Precio de Venta:
                                        </div>
                                        <div class="col-xs-5 col-sm-5 col-md-5 text-right">
                                            {{(selectedProductItem.price_list == null ? 0 : selectedProductItem.price_list.toString())}}
                                        </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding: 0.325rem 0.375rem;">
                                    <div class="row">
                                        <div class="col-xs-7 col-sm-7 col-md-7">
                                            Ultimo Valor:
                                        </div>
                                        <div class="col-xs-5 col-sm-5 col-md-5 text-right">
                                            {{(selectedProductItem.last_price == undefined ? 0 : selectedProductItem.last_price)}}
                                        </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding: 0.325rem 0.375rem;">
                                    <div class="row">
                                        <div class="col-xs-7 col-sm-7 col-md-7">
                                            % Descuento:
                                        </div>
                                        <div class="col-xs-5 col-sm-5 col-md-5 text-right">
                                            {{(itemSelectedCustomer.discount== undefined ? 0 : itemSelectedCustomer.discount)}}
                                        </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding: 0.325rem 0.375rem;">
                                    <div class="row">
                                        <div class="col-xs-7 col-sm-7 col-md-7">
                                            Inventario:
                                        </div>
                                        <div class="col-xs-5 col-sm-5 col-md-5 text-right">
                                            {{numberWithCommas(disponible.available > 0 ? disponible.available.toFixed(2) : 0)}}
                                        </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding: 0.325rem 0.375rem;">
                                    <div class="row">
                                        <div class="col-xs-7 col-sm-7 col-md-7">
                                            Unidad de Empaque:
                                        </div>
                                        <div class="col-xs-5 col-sm-5 col-md-5 text-right">
                                            {{(selectedProductItem.standard_packing==undefined || selectedProductItem.standard_packing ==null ? 0 : selectedProductItem.standard_packing ) }}       
                                        </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding: 0.325rem 0.375rem;">
                                    <div class="row">
                                        <div class="col-xs-7 col-sm-7 col-md-7">
                                            Unidad de Medida:
                                        </div>
                                        <div class="col-xs-5 col-sm-5 col-md-5 text-right">
                                            {{um}}       
                                        </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding: 0.325rem 0.375rem;">
                                    <div class="row">
                                        <div class="col-xs-7 col-sm-7 col-md-7">
                                            Dias de Buffer:
                                        </div>
                                        <div class="col-xs-5 col-sm-5 col-md-5 text-right">
                                            {{selectedProductItem.buffer_days}}       
                                        </div>
                                    </div>
                                </b-list-group-item>
                                <b-list-group-item style="padding: 0.325rem 0.375rem;">
                                    <div class="row">
                                        <div class="col-xs-7 col-sm-7 col-md-7">
                                            TRM:
                                        </div>
                                        <div class="col-xs-5 col-sm-5 col-md-5 text-right">
                                            {{trm}}
                                        </div>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                        </b-card>
                    </div>
                    <div class="col">
                        <b-row>
                            <b-col>

                                <h3 style="margin-bottom:0px">{{ selectedProductItem != undefined && selectedProductItem != null ? selectedProductItem.code  : ''}}</h3>
                                <h4>{{ selectedProductItem != undefined && selectedProductItem != null ? selectedProductItem.description : ''}}</h4>
                                <b-row class="my-1">
                                    <b-col sm="4">
                                        <label for="type-env">Cantidad:</label>
                                    </b-col>
                                    <b-col sm="8">
                                        <b-input-group>
                                            <b-form-input v-model="requested_amount" id="type-env" type="number" autocomplete="off" @change="controllerAmount()"></b-form-input>
                                            <b-form-input v-model="packing" placeholder="Total Empaque" type="number" autocomplete="off" @change="controlPacking()"></b-form-input>
                                            <b-form-input v-model="requested_amount_millar" id="type-env" disabled v-if="millarUm"></b-form-input>
                                        </b-input-group>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4">
                                        <label for="type-pedido">Valor:</label>
                                    </b-col>
                                    <b-col sm="8">
                                        <b-input-group>
                                            <b-form-input v-model="sale_price" id="type-pedido" type="number" autocomplete="off" v-on:blur="handleBlur"></b-form-input>
                                        </b-input-group> 
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4">
                                        <label for="type-discount">Descuento:</label>
                                    </b-col>
                                    <b-col sm="8">
                                        <b-input-group>
                                            <b-form-input v-model="discount" id="type-discount" type="number" autocomplete="off" v-on:blur="handleDiscount"></b-form-input>
                                        </b-input-group>
                                    </b-col>
                                </b-row>

                                <b-row class="my-1">
                                    <b-col sm="4">
                                        <label for="type-oc">Fecha Solicitada:</label>
                                    </b-col>
                                    <b-col sm="8">
                                        <!-- <input v-model="requested_date" size="sm" id="`type-oc`" :min="minDate" type="date"></input> -->
                                        <date-picker v-model="requested_date" :config="optionsDate"></date-picker>
                                    </b-col>
                                </b-row>

                                <b-row class="my-1">
                                    <b-col sm="4">
                                        <label for="type-oc">Fecha Comprometida:</label>
                                    </b-col>
                                    <b-col sm="8">
                                        <!-- <input v-model="requested_date" size="sm" id="`type-oc`" :min="minDate" type="date"></input> -->
                                        <!-- <date-picker v-model="requested_date" :config="optionsDate"></date-picker> -->
                                        <date-picker v-model="selectedProductItem.deadline" :config="optionsDate" v-if="requested_amount<=disponible.available && requested_amount>0"></date-picker>
                                         <div v-else>
                                            {{selectedProductItem.deadline}}
                                        </div>
                                    </b-col>
                                </b-row>

                                <b-row>
                                    <b-col class="text-right mb-1">
                                        <b-btn size="sm" :disabled="editOrderCreated" variant="outline-danger" @click.prevent="cancelDetails()"><i class="fas fa-ban"></i>&nbsp; Cancelar</b-btn>
                                        <b-btn size="sm" :disabled="editOrderCreated" variant="outline-info" @click.prevent="clearDetails()"><i class="fas fa-trash-alt"></i>&nbsp; Nuevo</b-btn>
                                        <b-btn size="sm" :disabled="editOrderCreated" variant="outline-success" @click.prevent="addOrderDetail()"><i class="fas fa-plus"></i>&nbsp; Adicionar</b-btn>
                                    </b-col>
                                </b-row>

                            </b-col>
                        
                        </b-row>
                    </div>
                </div>
            </div>

            <b-table small show-empty stacked="md" :items="tableData" :fields="columns" class="mt-2">
               
                <template v-slot:cell(edit)="row">
                    <div class="text-left" v-if="row.item.delivered_quantity > 0 && (row.item.delivered_quantity >= row.item.requested_amount)">
                        <b-badge variant="success">Entregado: {{numberWithCommas(row.item.delivered_quantity)}}</b-badge>
                    </div>
                    <div v-else-if="(row.item.delivered_quantity < row.item.requested_amount) && row.item.delivered_quantity > 0">
                        <b-badge variant="warning">Pendiente: {{numberWithCommas(row.item.requested_amount - row.item.delivered_quantity)}}</b-badge>
                    </div>
                    <div v-else>
                        <b-btn variant="outline-warning borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                    </div>
                </template>
                <template v-slot:cell(sale_price)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.sale_price == null ? 0 : row.item.sale_price.toFixed(2))}}
                    </div>
                </template>
                <template v-slot:cell(total)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.total == null ? 0 :row.item.total.toFixed(2))}}
                    </div>
                </template>
                <template v-slot:cell(requested_amount)="row">
                    <div class="text-left">
                        {{numberWithCommas(row.item.requested_amount == null ? 0 :row.item.requested_amount.toFixed(2))}}
                    </div>
                </template>
            </b-table>
            <b-row>
                <b-col class="d-none d-sm-none d-md-block">
                    <b-form-group label=" Notas del Pedido" class="mt-1 ml-1">
                        <b-form-textarea placeholder="Notas del Pedido"
                            rows="5"
                            max-rows="50"
                            v-model="commentorder"
                            @blur="savenotes('notes', commentorder)"
                        ></b-form-textarea>
                    </b-form-group>
                </b-col>
                <b-col class="d-none d-sm-none d-md-block" >
                    <b-form-group label=" Notas de la Transportadora" class="mt-1">
                        <b-form-textarea placeholder="Notas de la Transportadora"
                            rows="5"
                            max-rows="50"
                            v-model="commenttransp"
                            @blur="savenotes('transporter', commenttransp)"
                        ></b-form-textarea>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label=" Totales" class="mt-1">
                        <b-row>
                            <b-col class="text-right">
                                Total: 
                            </b-col>
                            <b-col class="text-right mr-4">
                                {{numberWithCommas(totalesGenerales.total)}}
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col class="text-right">
                                Total Descuento: 
                            </b-col>
                            <b-col class="text-right mr-4">
                                {{numberWithCommas(totalesGenerales.descuento)}}
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col class="text-right">
                                Subtotal: 
                            </b-col>
                            <b-col class="text-right mr-4">
                                {{numberWithCommas(totalesGenerales.subtotal)}}
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col class="text-right">
                                Total Impuesto: 
                            </b-col>
                            <b-col class="text-right mr-4">
                                {{numberWithCommas(totalesGenerales.impuesto)}}
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col class="text-right">
                                Gran Total: 
                            </b-col>
                            <b-col class="text-right mr-4">
                                {{numberWithCommas(totalesGenerales.grantotal)}}
                            </b-col>
                        </b-row>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-btn  v-if="!isactive" block variant="outline-danger borderless" class="btn-xs" @click.prevent="removeVersion()"><i class="fas fa-times text-danger"></i> Descartar Version </b-btn> 
        </div>

        <sweet-modal icon="warning" title="Borrar registro" ref="deleteItemProductConfirm">
            <div class="w-100 text-danger"> <strong></strong> </div>
            
            <div class="w-100 text-center">
                ¿Está seguro que desea borrar este elemento?
            </div>
            
            <template slot="button"><b-btn @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
            <template slot="button"><b-btn @click="$refs.deleteItemProductConfirm.close()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>  
        <sweet-modal icon="success" title="Enviar Pedido Comercial" ref="confirmReleaseOrder">
            <div class="w-100 text-danger"> <strong></strong> </div>
            
            <div class="w-100 text-center">
                ¿Está seguro que desea envíar este pedido?
            </div>
            
            <div class="w-100 text-center">
                Esto significa, confirmarlo a la fase de planeación. Siempre y cuando cumpla con todos las validaciones comerciales y de cartera.
            </div>

            <template slot="button"><b-btn @click="eventConfirmReleaseOrder()" variant="success" class="mr-2">Enviar</b-btn></template>
            <template slot="button"><b-btn @click="$refs.confirmReleaseOrder.close()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>  

        <sweet-modal icon="error" title="Cancelar Pedido" ref="confirmCancelOrder">
            <div class="w-100 text-danger"> <strong></strong> </div>
            
            <div class="w-100 text-center">
                ¿Está seguro que desea cacelar este pedido?
            </div>
            
            <template slot="button"><b-btn @click="cancelOrder()" variant="danger" class="mr-2">Eliminar</b-btn></template>
            <template slot="button"><b-btn @click="$refs.confirmCancelOrder.close()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>  

        <sweet-modal icon="success" title="Aprobar Pedido" ref="confirmApproved">
            <div class="w-100 text-danger"> <strong></strong> </div>
            
            <div class="w-100 text-center">
                ¿Está seguro que desea aprobar este pedido?
            </div>
            
            <template slot="button"><b-btn @click="aprobarOrden()" variant="success" class="mr-2">Aprobar</b-btn></template>
            <template slot="button"><b-btn @click="$refs.confirmApproved.close()" variant="primary">Cerrar</b-btn></template> 
        </sweet-modal>  


            <b-modal id="modals-top" v-model="showCarteraDetail"  class="modal-center" size="xl">
                <div slot="modal-title">
                    Detalle Cartera <span class="font-weight-light"> </span>
                </div>
               

                    <b-table responsive style="font-size:14px" :items="customerInfo.details"  :fields="carteraColumnsDetails" >
                        <template v-slot:cell(total)="row">
                            <div class="text-nowrap"> {{numberWithCommas(row.item["total"])}}</div>
                        </template>
                    </b-table>
                
                <div slot="modal-footer" class="w-100 text-right">
                    
                    <b-button size="md" variant="primary" @click="showCarteraDetail=false;">Cerrar</b-button>
                   
                </div>
            </b-modal>

            <b-modal id="modals-top" v-model="eventoPedido"  class="modal-center" size="xl">
                <div slot="modal-title">
                    Documento Pedido <span class="font-weight-light"> </span>
                </div>
                    <!-- {{showSendMail}} -->
                    <div class="row" v-if="!showSendMail">
                        <div class="col">
                            <b-button block variant="primary" @click="pdfDownload()">Descargar PDF</b-button>
                        </div>
                        <div class="col">
                            <b-button block variant="primary" @click="showSendMail=true;">Enviar Correo</b-button>
                        </div>
                    </div>
                    <div v-if="showSendMail">
                        <b-form-group
                            id="fieldset-1"
                            description="Si es mas de una direccion separar con ; (punto y coma) uno@cliente.com;dos@cliente.com"
                            label="Correo Electronico"
                            label-for="input-1">
                                <b-form-input id="input-1" v-model="mailto" trim></b-form-input>
                        </b-form-group>

                        <b-form-group
                            id="fieldset-1"
                            label="Asunto del Mensaje"
                            label-for="input-1">
                                <b-form-input id="input-1" v-model="subject" trim></b-form-input>
                        </b-form-group>

                        <b-form-textarea
                        id="textarea"
                        v-model="message"
                        placeholder="Mensaje del correo..."
                        rows="3"
                        max-rows="6"
                        ></b-form-textarea>

                        <div class="row">
                            <div class="col">
                                <b-button :disabled="sendingMail" block class="mt-2" variant="danger" @click="showSendMail=false;">Cancelar Correo</b-button>
                            </div>
                            <div class="col">
                                <b-button :disabled="sendingMail" block class="mt-2" variant="success" @click="sendMail()">
                                    
                                    <div v-if="sendingMail">
                                        <b-spinner small></b-spinner>
                                        <span>Enviando...</span>
                                    </div>
                                    <div v-else>
                                        Enviar Correo
                                    </div>
                                </b-button>
                            </div>
                        </div>
                    </div>
                
                <div slot="modal-footer" class="w-100 text-right">
                    
                    <b-button size="md" variant="primary" @click="showCarteraDetail=false;">Cerrar</b-button>
                   
                </div>
            </b-modal>

    </div>
</template>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<script>

import Vue from 'vue'
import Axios from 'axios'
import Notifications from 'vue-notification'
import VueTypeahead from 'vue-typeahead'
import { infomaster } from '@/components/i40/js/master'
import { infotrade } from '@/components/i40/js/trade'
import { config,master } from "@/components/i40/js/globals";
import { infosysconfig } from "@/components/i40/js/sysconfig";
import { infoconfig } from "@/components/i40/js/config";
import datePicker from "vue-bootstrap-datetimepicker";
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
import { SweetModal } from 'sweet-modal-vue'
import { CrearCommercialPDF } from "@/vendor/js/orderCommercial"
import { infoplanning } from "@/components/i40/js/iplanning";
import { infouser } from "@/vendor/sbx/sbx-users/users";

Vue.use(Notifications)

export default {

    extends: VueTypeahead,

    components: {
        SweetModal,
        datePicker,
    },

    data() {
        return {
            userInfo:{},

            showSendMail:false,
            eventoPedido:false,
            sendingMail:false,

            mailto:'',
            subject:'',
            message:'',

            cityInvoice:'',
            cityDelivery:'',

            isactive:false,
            carteraColumnsDetails:[
                {key:'document', label:"Documento"},
                {key:'deadline',sortable:true, label:"Fecha Vence"},
                {key:'days', sortable:true, label:"Dias Transcurridos"},
                {key:'total',sortable:true, label:"Total"},
            ],

            selectedDeadLine:new Date().getUTCSeconds(),
            expiration_days:30,

            headercomplete: {},
            disponible:{},
            selectTab:null,

            commentorder:'',
            commenttransp:'',
            
            showCarteraDetail:false,
            customerInfo:{},
            consultants:[],
            consultant_id:null,
            packing:null,
            requested_amount_millar:null,
            millarUm:false,
            status_module_id:0,
            allProducts:false,
            quotation_id:0,
            infoHeader: {},
            info_order_type:[],
            invoiceAddress:[],
            shippingAddress:[],
            invoice_address:'',
            showSelectedProduct:false,
            shipping_address:'',
            editOrderCreated:false,
            editOrderDetail:false,

            shipping_address_id:null,
            invoice_address_id:null,

            showSelectedInvoice:false,
            document_customer:'',

            document_type:null,
            document_type_text:'',
            src:'',
            valueSelectedCustomer:'',
            itemSelectedCustomer:{},

            um:'',
            sale_price:0,
            discount:0,
            requested_amount:0,
            requested_date:null,
            infoOrderDetail:{},
            orderDetailsId:0,

            valueSelectedProduct:'',
            optionsDate: {
                format: 'YYYY-MM-DD',
                useCurrent: false,
            },

            remisionDelivered:false,
            multipleDelivered:false,
            totalesGenerales: {},
            selectedProductItem:{},
            tableData:[],
            columns: [
                // {key:'id', label:'id', thClass: 'd-none', tdClass: 'd-none'},
                {key:'code', label:'Codigo'},
                {key:'description', label:'Descripción'},
                {key:'sale_price', label:'Precio'},
                {key:'requested_amount', label:'Cantidad'},
                {key:'discount', label:'Descuento'},
                {key:'tax', label:'Impuesto'},
                {key:'total', label:'Total'},
                {key:'edit', label:"Edit"}
            ],

            trm:0,
            trm_real_value:0,

            orderLocation:'',

            status_deleted_id:0,
            /// Columnas de las tablas
        }
    },
    watch: {
       '$route.params.id':function(value){
            if(value == 0){
                this.tableData=[]
                this.newCommercialOrder()
                this.src = master+'customersearch/'
                this.getTypes(null)
                this.getTRM()
                let value = this.$route.params["id"]
                this.orderLocation = this.$route.params["type"]
                this.loadOrderType(this.orderLocation)
            }
        },
        '$route.params.type':function(value){
            this.orderLocation = value
            this.loadOrderType(value)
        },

        'requested_date':function(value){
            if(this.requested_amount<=this.disponible.available ){
                if(value>this.selectedDeadLine)
                    this.selectedProductItem.deadline = value
                else
                    this.selectedProductItem.deadline = this.selectedDeadLine
            }
        }
    },
    methods: {
        isRTL () {
            return document.documentElement.getAttribute('dir') === 'rtl' ||
                document.body.getAttribute('dir') === 'rtl'
        },

         printOrder(){
            this.eventoPedido = true
            this.showSendMail=false
            this.mailto=''
            this.subject=''
            this.message=''
            this.sendingMail = false
        },

        async prepareDoc(action){
            let headerInfo = {}
            let detailsInfo = []
            let policies = {}
            let versionid=0

            this.sendingMail = true

            await infotrade.quotcontroller(this.headercomplete.quotation_id,"get").then(data =>{
              if(data.status == 200){
                  headerInfo = data.data[0]
                  headerInfo.user = this.userInfo.name + ' ' + this.userInfo.lastname
              }
            })
            


            for (let index = 0; index < this.headercomplete.versions.length; index++) {
                const element = this.headercomplete.versions[index];
                if(element.state){
                    versionid=element.quotation_version_id
                }
            }

            await infotrade.quotcontroller(versionid,"get-details").then(data =>{
                if(data.data != ""){
                    detailsInfo = data.data
                }
            })

            let result = {}
            result.code = '001'
            result.module = 'local'
            await infosysconfig.commercialcontroller(result, "get").then(data => {
                policies = data.data[0]
            })

            let info = {}

            info.header = headerInfo
            info.details = detailsInfo
            info.footer = policies.footer
            info.footer1 = policies.footer1
            info.action = action //'download'
            info.type = "cotizacion"

            if(action=='mail'){
                info.mailto = this.mailto
                info.subject = this.subject
                info.message = this.message     
                info.email = this.userInfo.email  
                await infotrade.sendMail(info).then(data =>{
                    if(data.data.toString().includes('Email sent')){
                        this.showCustom('bg-success text-white', "Correo Enviado","¡El archivo se ha enviado con Éxito! <br/>"+data.data)
                        this.eventoPedido = false
                    }else{
                        this.showCustom('bg-danger text-white', "Error","¡El correo <b>NO</b> se ha enviado! <br/> Valide por favor que los datos esten correctos")
                    }
                })
            }else{
                await infotrade.printOrders(info).then(data =>{
                    let blob = new Blob([data.data], { type:   'application/pdf' } );
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = `${headerInfo.name}-${headerInfo.quotation_id}.pdf`;
                    link.click();
                    this.showCustom('bg-success text-white', "Descargar Archivo","¡El archivo se ha descargado con Éxito!")
                    this.eventoPedido = false
                })
            }

            this.sendingMail = false
        },

        async sendMail(){
            this.prepareDoc('mail')
        },

        async pdfDownload(){
            this.prepareDoc('download')
        },

        async convertToOrder(){
            let info = {}
            info.customer_id=this.itemSelectedCustomer.customers_id
            info.document_type=this.document_type
            info.invoice_address = this.invoice_address
            info.shipping_address = this.shipping_address
            info.document_customer = this.document_customer
            info.cityInvoice = this.cityInvoice
            info.cityDelivery = this.cityDelivery
            info.orders_id = this.order_id
            info.released = false
            info.multiple_deliveries = this.multipleDelivered
            info.referral = this.remisionDelivered
            info.is_national = this.orderLocation != 'international'
            info.approved = false
            info.released = false
            info.consultant_id = this.consultant_id
            info.quotation_id = this.infoHeader.quotation_id
            info.order_notes = this.infoHeader.order_notes
            info.transporter_notes = this.infoHeader.transporter_notes
            let eventT ="insert"
            let headerid=null
            let versionid=null
            let dataDetails = []

            await infotrade.addheadorders(info,eventT).then(data =>{
                if(data.status == 200){
                    headerid = data.data
                }else{
                    this.showCustom('bg-danger text-white', "Error registro","¡El registro no pudo ser guardado, por favor valide que todos los campos este completos!")
                }
            })

            for (let index = 0; index < this.headercomplete.versions.length; index++) {
                const element = this.headercomplete.versions[index];
                if(element.state){
                    versionid=element.quotation_version_id
                }
            }

            await infotrade.quotcontroller(versionid,"get-details").then(data =>{
                if(data.data != ""){
                    dataDetails = data.data
                }
            })

            for (let index2 = 0; index2 < dataDetails.length; index2++) {
                const element2 =dataDetails[index2];
                element2.orders_id = headerid 
                await infotrade.addorderdetails(element2,"insert").then(data =>{})
            }

            this.$router.replace({name:'commercial-orders-rq', params:{id: headerid}})
        },

        defaultVersionSelected(items){
            for (let index = 0; index < items.length; index++) {
                const element = items[index];
                if(element.state)
                this.selectTab =element.quotation_version_id
            } 
            this.isactive = true
            this.selectedVersion()
        },

        addNewVersion(item){
            console.log(item.quotation_id)

            infotrade.quotcontroller(item.quotation_id,"add-version").then(data1 =>{
              if(data1.status == 200){
                  infotrade.quotcontroller(item.quotation_id,"get").then(data =>{
                    if(data.status == 200){
                        this.headercomplete = data.data[0]
                        this.defaultVersionSelected(data.data[0].versions)
                    }
                })
              }
            })
        },

        activeVersion(item,qttid){
            console.log(item)
            infotrade.quotcontroller(item.quotation_version_id,"active-version").then(data1 =>{
              if(data1.status == 200){
                  infotrade.quotcontroller(qttid,"get").then(data =>{
                    if(data.status == 200){
                        this.headercomplete = data.data[0]
                        this.defaultVersionSelected( data.data[0].versions)
                    }
                })
              }
            })
        },

        removeVersion(){
            infotrade.quotcontroller(this.selectTab,"remove-version").then(data1 =>{
              if(data1.status == 200){
                  infotrade.quotcontroller(this.headercomplete.quotation_id,"get").then(data =>{
                    if(data.status == 200){
                        this.headercomplete = data.data[0]
                        this.defaultVersionSelected( data.data[0].versions)
                    }
                })
              }
            })
        },

        selectedVersion(){

            infotrade.quotcontroller(this.selectTab,"get-details").then(data =>{
                this.tableData = []
                if(data.data != ""){
                    this.tableData = data.data
                }
                this.totales()
            })

        },

        handleDiscount(){
            console.log(this.itemSelectedCustomer)
            // if(this.itemSelectedCustomer.discount == undefined)
            //     this.itemSelectedCustomer.discount 0
            
        this.discount = (this.discount>this.itemSelectedCustomer.discount ? 0 : this.discount)
        },
        savenotes(value, text){
            let info = {}
            info.ordid = this.quotation_id
            info.onotes = text
            infotrade.quotcontroller(info,`update-${value}`).then(data =>{})
        },
        
        loadcartera(nit){
            infotrade.getcartera(nit, "get-customer").then(data => {
                this.customerInfo = {
                    total:0,
                    term_days:0,
                    quota:0
                }

                if(data.data != ""){
                    this.customerInfo = data.data[0]
                    // console.log(this.customerInfo)
                }
            })
        },
            ///Funcion para envio de alertas lateral superior derecha
        showCustom: function(classes, title, text) {
            this.$notify({
                group: 'notifications-default',
                type: classes,
                title: title,
                text: text
            })
        },

        controllerAmount(){
            let v = this.requested_amount*1000
            this.requested_amount_millar=this.numberWithCommas(v)
            
            if(this.selectedProductItem.standard_packing > 0){
                if(this.millarUm){
                    this.packing = (this.requested_amount*1000)/this.selectedProductItem.standard_packing
                }else{
                    this.packing = (this.requested_amount)/this.selectedProductItem.standard_packing
                }
            }

            if(this.requested_amount>this.disponible.available && this.requested_date>this.selectedDeadLine){
                this.selectedProductItem.deadline = this.selectedDeadLine
            }else{
                if(this.requested_date>this.selectedDeadLine){
                    this.selectedProductItem.deadline = this.requested_date
                }
            }
        },

        controlPacking(){
            if(this.selectedProductItem.standard_packing > 0){
                if(this.millarUm){
                    this.requested_amount = (this.packing*this.selectedProductItem.standard_packing)/1000
                    this.requested_amount_millar = (this.packing*this.selectedProductItem.standard_packing)
                }else{
                    this.requested_amount = (this.packing*this.selectedProductItem.standard_packing)
                }
            }

            if(this.requested_amount>this.disponible.available && this.requested_date>this.selectedDeadLine){
                this.selectedProductItem.deadline = this.selectedDeadLine
            }else{
                if(this.requested_date>this.selectedDeadLine){
                    this.selectedProductItem.deadline = this.requested_date
                }
            }
        },

        getTRM(){
            infotrade.gettrm("USD").then(data =>{
                this.trm = this.numberWithCommas(data.data.toFixed(2))
                this.trm_real_value =data.data
            })
        },

        totales(){
            if(this.tableData != null && this.tableData != []){
                this.totalesGenerales={}
                this.totalesGenerales.total = null
                this.totalesGenerales.descuento = null
                this.totalesGenerales.impuesto = null
                this.totalesGenerales.subtotal = null
                this.totalesGenerales.grantotal = null
                for (let index = 0; index < this.tableData.length; index++) {
                    const element = this.tableData[index];
                    let elementDescuento = ((element.requested_amount*element.sale_price)*(element.discount/100))
                    let elementTotal = (element.requested_amount*element.sale_price)
                    let elementSubtotal = elementDescuento == 0?elementTotal:elementDescuento

                    this.totalesGenerales.total = this.totalesGenerales.total + elementTotal
                    this.totalesGenerales.descuento = this.totalesGenerales.descuento + elementDescuento
                    this.totalesGenerales.impuesto =  this.orderLocation == "international"?0:this.totalesGenerales.impuesto + (element.tax == 0 ? 0 : (elementSubtotal*(element.tax/100)))
                    this.totalesGenerales.subtotal = this.totalesGenerales.subtotal + (elementSubtotal == elementTotal ? elementTotal: ((element.requested_amount*element.sale_price)-elementSubtotal))
                }

                this.totalesGenerales.grantotal = this.totalesGenerales.subtotal+this.totalesGenerales.impuesto

                if(this.totalesGenerales.total != null)
                    this.totalesGenerales.total = this.totalesGenerales.total.toFixed(2)
                if(this.totalesGenerales.descuento != null)
                    this.totalesGenerales.descuento = this.totalesGenerales.descuento.toFixed(2)
                if(this.totalesGenerales.impuesto != null)
                    this.totalesGenerales.impuesto = this.totalesGenerales.impuesto.toFixed(2)
                if(this.totalesGenerales.subtotal != null)
                    this.totalesGenerales.subtotal = this.totalesGenerales.subtotal.toFixed(2)
                if(this.totalesGenerales.grantotal != null)
                    this.totalesGenerales.grantotal = this.totalesGenerales.grantotal.toFixed(2)
            }
        },

        handleBlur(){
            // if(this.sale_price != 0){
                let price = 0
                // console.log(this.selectedProductItem.last_price)
                if(this.selectedProductItem.last_price == 0 || this.selectedProductItem.last_price == null){
                    price = this.selectedProductItem.price_list
                }else{
                    price = this.selectedProductItem.price_list <  this.selectedProductItem.last_price ? this.selectedProductItem.price_list: this.selectedProductItem.last_price
                }
                if(this.orderLocation == 'international'){
                    price= this.trm_
                    real_value/this.selectedProductItem.price_list
                }
                this.sale_price = ((price == null ? 0 : price) < this.sale_price ? this.sale_price : (price == null ? 0 : price))
            // }
        },

        numberWithCommas(x) {
            if(x == null)
                x=0
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },

        clearDetails(){
            this.infoOrderDetail={}
            this.orderDetailsId = 0
            this.requested_amount = null
            // this.requested_date = null
            this.selectedProduct = null
            this.sale_price = null
            this.discount = null
            this.selectedProductItem = {}
            this.valueSelectedProduct = ''
        },

        searchAllProducts(){
            this.src = master+'commercialsearch/'+this.allProducts+'/'+this.itemSelectedCustomer.nit+'/'
        },

        deleteRecord(){
            infotrade.quotcontroller(this.orderDetailsId,"delete-details").then(data =>{
              if(data.status == 200){
                infotrade.quotcontroller(this.selectTab,"get-details").then(data =>{
                    this.tableData = []
                    if(data.data != ""){
                        this.tableData = data.data
                    }
                })
                this.infoOrderDetail={}
                this.$refs.deleteItemProductConfirm.close()
                this.totales()
                this.showCustom('bg-success text-white', "Eliminar registro","¡El registro se ha Eliminado con Éxito!")
              }else{
                  this.showCustom('bg-danger text-white', "Error","¡Error Eliminando el Registro!")
              }
            })
        },

        data_change(item, event){
            this.infoOrderDetail = item
            this.orderDetailsId = item.quotation_details_id
            if(event == "edit"){
                this.editOrderDetail = true
                this.quotation_id = item.quotation_id
                this.requested_amount = item.requested_amount
                this.requested_date = item.requested_date
                this.um = item.um
                
                this.discount = item.discount
                this.valueSelectedProduct = `(${item.code}) - ${item.description}`
                
                this.sale_price = item.sale_price

                
                if(item.sale_price != 0){
                    let price = item.sale_price
                    if(this.orderLocation == 'international'){
                        price= this.trm_real_value/item.sale_price
                    }
                    this.sale_price = price
                }

                master.commercialsearch(this.itemSelectedCustomer.nit, item.product_id,"specific").then(data =>{
                    this.selectedProductItem = data.data
                })

            }else{
                this.$refs.deleteItemProductConfirm.open()
            }
        },

        editHeaderOrder(){this.src = master+'customersearch/'; this.editOrderCreated=true},
        //INFO HEADER PEDIDO// array
        saveHeader(){
            if(this.invoice_address_id != null && this.invoice_address == ''){
                for (let index = 0; index < this.invoiceAddress.length; index++) {
                    const element = this.invoiceAddress[index];
                    if(element.value == this.invoice_address_id){
                        this.invoice_address = element.text
                    }
                }
            }

            if(this.shipping_address_id != null && this.shipping_address == ''){
                for (let index = 0; index < this.shippingAddress.length; index++) {
                    const element = this.shippingAddress[index];
                    if(element.value == this.shipping_address_id){
                        this.shipping_address = element.text
                    }
                }
            }

            for (let index = 0; index < this.info_order_type.length; index++) {
                const element = this.info_order_type[index];
                if(element.value==this.document_type){
                    this.document_type_text = element.text
                }
            }

            this.infoHeader.customer_id=this.itemSelectedCustomer.customers_id
            this.infoHeader.document_type=this.document_type
            this.infoHeader.invoice_address = this.invoice_address
            this.infoHeader.shipping_address = this.shipping_address
            this.infoHeader.document_customer = this.document_customer
            this.infoHeader.quotation_id = this.quotation_id
            this.infoHeader.released = false
            this.infoHeader.multiple_deliveries = this.multipleDelivered
            this.infoHeader.referral = this.remisionDelivered
            this.infoHeader.is_national = this.orderLocation != 'international'
            this.infoHeader.approved = false
            this.infoHeader.released = false
            this.infoHeader.consultant_id = this.consultant_id
            this.infoHeader.expiration_days = this.expiration_days
            let eventT = (this.infoHeader.quotation_id==null || this.infoHeader.quotation_id==0) ? "insert" : "update"
            
            infotrade.quotcontroller(this.infoHeader,eventT).then(data =>{
              if(data.status == 200){
                if(eventT == "insert"){
                    this.showCustom('bg-success text-white', "Eliminar registro","¡El registro se ha Guardado con Éxito!")
                    this.loadHeader(data.data)
                    this.$router.replace({name:'commercial-cot-rq', params:{id: data.data}})

                }
                else
                    this.showCustom('bg-warning text-dark', "Eliminar registro","¡El registro se ha Editado con Éxito!")
                
                this.infoHeader.quotation_id = data.data  
                this.quotation_id = data.data

                this.src = master+'commercialsearch/'+this.allProducts+'/'+this.itemSelectedCustomer.nit+'/'
              }else{
                  this.showCustom('bg-danger text-white', "Error registro","¡El registro no pudo ser guardado, por favor valide que todos los campos este completos!")
              }
            })
        },

        newCommercialOrder(){
            this.src = master+'customersearch/'
            this.customerInfo={}
            this.infoHeader = {}
            this.invoice_address_id != null
            this.itemSelectedCustomer = {}
            this.document_type = null
            this.invoice_address = null
            this.shipping_address = null
            this.document_customer = null
            this.shipping_address_id = null
            this.consultant_id = null
            this.quotation_id = 0
            this.valueSelectedCustomer=''
            this.multipleDelivered=false
            this.remisionDelivered=false

            this.infoOrderDetail={}
            this.orderDetailsId = 0
            this.requested_amount = null
            // this.requested_date = null
            this.selectedProduct = null
            this.sale_price = null
            this.discount = null
            this.selectedProductItem = {}
            this.valueSelectedProduct = ''
            this.$router.replace({name:'commercial-cot-rq', params:{id: 0}})
        },
        
        getTypes(item){
            infosysconfig.documenttype([],"select").then(data => {
                this.info_order_type =  []
                for (let index = 0; index < data.data.length; index++) {
                    const element = data.data[index];
                    if(element.module == "1"){

                        this.info_order_type.push({value:element.code, text:element.code+' - '+element.description})
                    }
                }

                if(item != null){
                    for (let index = 0; index < this.info_order_type.length; index++) {
                        const element = this.info_order_type[index];
                        if(item==this.document_type){
                            this.document_type_text = element.text
                        }
                        
                    }
                }
            })
        },

        updateQueryCustomer(){
            this.query = this.valueSelectedCustomer
            this.update()
        },

        updateQueryProducts(){
            this.query = this.valueSelectedProduct
            this.update()
        },

        releaseOrder(){
            this.$refs.confirmReleaseOrder.open()
        },

        eventConfirmReleaseOrder(){

            this.infoHeader.quotation_id = this.quotation_id
            this.infoHeader.released = true

            infotrade.addheadorders(this.infoHeader,"released").then(data =>{
            if(data.status == 200)
            {
                this.showCustom('bg-warning text-dark', "Envío del Pedido","¡El pedido se ha enviado con Éxito!")
                this.$refs.confirmReleaseOrder.close()

                if ((this.customerInfo['quota']-this.customerInfo['total'])>0 && this.customerInfo['portfolio_ok']==0) {
                    this.infoHeader.approved = true
                    infotrade.addheadorders(this.infoHeader,"approved").then(data =>{
                        if(data.status == 200)
                        {
                            this.showCustom('bg-success text-white', "Pedido Aprobado","¡El pedido se ha Aprobado con Éxito!")
                        }
                    })
                }
                else{
                    this.showCustom('bg-danger text-white', "Pedido no Aprobado","¡El pedido no se ha Aprobado!")
                }
                this.newCommercialOrder()
                
              }else{
                  this.showCustom('bg-danger text-white', "Error al Enviar","¡El pedido no pudo ser enviado!")
                  this.infoHeader.released = false
              }
            })
        },

        cancelOrder(){
            this.infoHeader.quotation_id = this.quotation_id
            infotrade.quotcontroller(this.infoHeader.quotation_id,"cancel").then(data =>{
              if(data.status == 200){{
                    this.showCustom('bg-warning text-dark', "Cancelar Cotizacion","¡La cotizacion se ha cancelado con Éxito!")
                    this.newCommercialOrder()
                    this.$router.replace({name:'commercial-cot-rq', params:{id: 0}})
                    this.$refs.confirmCancelOrder.close()
                }
              }else{
                  this.infoHeader.released = false
              }
            })
        },

        aprobarOrden(){
            this.infoHeader.quotation_id = this.quotation_id

            infotrade.addheadorders(this.infoHeader,"approved").then(data =>{
                if(data.status == 200)
                {
                    this.showCustom('bg-success text-white', "Pedido Aprobado",`¡El pedido se ha Aprobado con Éxito! Numero: <b>${data.data}</b>`)
                    this.newCommercialOrder()
                    this.$refs.confirmApproved.close()
                }
            })
        },

        cancelDetails(){

            this.infoOrderDetail={}
            this.orderDetailsId = 0
            this.requested_amount = null
            this.requested_date = null
            this.selectedProduct = null
            this.sale_price = null
            this.discount = null
            this.selectedProductItem = {}
            this.valueSelectedProduct = ''

            this.editOrderDetail=false
        },

        addOrderDetail(){
            this.infoOrderDetail.quotation_version_id=this.selectTab
            this.infoOrderDetail.requested_amount=this.requested_amount
            this.infoOrderDetail.requested_date=this.requested_date
            this.infoOrderDetail.product_id=this.selectedProductItem.product_id
            this.infoOrderDetail.sale_price=this.sale_price
            this.infoOrderDetail.discount=this.discount
            this.infoOrderDetail.tax=(this.selectedProductItem.apply_tax == false ||  this.orderLocation == "international") ? 0:19
            this.infoOrderDetail.um = this.um 
            this.infoOrderDetail.status_module_id = this.status_module_id
            this.infoOrderDetail.deadline = this.selectedProductItem.deadline

            let eventT = (this.infoOrderDetail.quotation_details_id==null || this.infoOrderDetail.quotation_details_id==0) ? "insert-details" : "update-details"

            infotrade.quotcontroller(this.infoOrderDetail,eventT).then(data =>{
              if(data.status == 200){

                if(eventT == "insert"){
                    this.showCustom('bg-success text-white', "Eliminar registro","¡El registro se ha Guardado con Éxito!")
                }
                else
                    this.showCustom('bg-warning text-dark', "Eliminar registro","¡El registro se ha Editado con Éxito!")


                infotrade.quotcontroller(this.selectTab,"get-details").then(data =>{
                    this.tableData = []
                    if(data.data != ""){
                        this.tableData = data.data
                    }
                    this.totales()
                })

                this.infoOrderDetail={}
                this.orderDetailsId = 0
                this.requested_amount = null
                // this.requested_date = null
                this.selectedProduct = null
                this.sale_price = null
                this.discount = null
                this.selectedProductItem = {}
                this.valueSelectedProduct = ''
                this.editOrderDetail=false
              }else{
                  this.showCustom('bg-danger text-white', "Error registro","¡El registro no pudo ser guardado, por favor valide que todos los campos esten completos!")
              }
            })
        },

        onHit (item) {
            if(this.quotation_id == 0 || this.editOrderCreated){
                this.loadcartera(item.nit)
                this.customerInfo.quota = item.quota
                this.customerInfo.limit_day = item.limit_day
                this.itemSelectedCustomer=item
                this.valueSelectedCustomer=item.name
                this.showSelectedProduct = false
                this.showSelectedInvoice = false
                this.invoice_address = ''
                this.shipping_address = ''
                this.consultant_id = item.consultant_id
                

                infomaster.customers(item.customers_id, "0", "select-address").then(data => {
                    this.invoiceAddress = []
                    this.shippingAddress = []
                    let array = data.data
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];
                        if(element.type == "product"){
                            this.shippingAddress.push({value:element.customers_address_id,text:element.address+' ('+element.city+' - '+element.country+')'})
                        }else{
                            this.invoiceAddress.push({value:element.customers_address_id,text:element.address+' ('+element.city+' - '+element.country+')'})
                        }
                    }
                    
                    if(this.shippingAddress.length == 1){
                        this.shipping_address = this.shippingAddress[0].text
                    }else if(this.shippingAddress.length == 0){
                        this.shipping_address = item.address
                    }else{
                        this.showSelectedProduct = true
                    }

                    if(this.invoiceAddress.length == 1){
                        this.invoice_address = this.invoiceAddress[0].text
                    }else if(this.invoiceAddress.length == 0){
                        this.invoice_address = item.address
                    }else{
                        this.showSelectedInvoice = true
                    }
                    
                })
                .catch(function (error) {
                    console.log(error.status)
                })
            }else{
                this.selectedProductItem = item
                this.selectedDeadLine = item.deadline
                this.um = this.millarUm ? 'MILL' : item.unity_measure
                this.valueSelectedProduct = '('+item.code+') - ' + item.description
                // this.sale_price = item.price_list
                this.discount = item.is_discount
                this.requested_amount = 0
                // this.requested_date = null

                infoplanning.getinventaryproduct(item.code).then(data =>{
                    if(data.data!=""){
                        this.disponible = data.data
                        
                    }else{
                        this.disponible = {available:0}
                    }
                })

                
                if(item.sale_price == null && this.selectedProductItem.last_price != 0){
                    this.sale_price = this.selectedProductItem.last_price
                    
                }else{
                    this.sale_price = item.sale_price
                }

                
                if(this.sale_price  != 0){
                    let price = this.sale_price 
                    if(this.orderLocation == 'international'){
                        price= this.trm_real_value/this.sale_price 
                    }
                    this.sale_price = price
                }

                this.editOrderDetail=true

            }
            // this.itemSupplierProduct.supplier_id = item.supplier_id
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

        loadOrderType(type){
            let result = {}
            result.code = '001'
            result.module = type

            infoconfig.teamsconfig({module: type == 'local' ? 'local_orders' : 'international_orders'}, "get-commercials").then(team =>{
                this.consultants = []
                for (let index = 0; index < team.data.length; index++) {
                    const element = team.data[index];
                    this.consultants.push({value:element.user_id, text:element.username})
                }
            });
            
            infosysconfig.commercialcontroller(result, "get").then(data => {
                    if(data.data[0] != undefined){
                    this.document_type=data.data[0].document_default
                    this.status_module_id=data.data[0].status_created_id
                    this.millarUm=data.data[0].millar
                    this.status_deleted_id = data.data[0].status_deleted_id
                }
                // this.jsonPolicies=data.data[0].national_policies
                // this.jsonPays=data.data[0].pay_policies
            })
        },
        loadHeader(value){

             infotrade.quotcontroller(value,"get").then(data =>{
              if(data.status == 200){
                // this.infoHeader.quotation_id = data.data  
                // this.quotation_id = data.data

                if (data.data != "")

                    this.headercomplete = data.data[0]
                    this.defaultVersionSelected( data.data[0].versions)
                    this.loadcartera(data.data[0].nit)
                    this.itemSelectedCustomer=data.data[0]
                    this.valueSelectedCustomer = data.data[0].name
                    this.itemSelectedCustomer.nit = data.data[0].nit
                    this.multipleDelivered = data.data[0].multiple_deliveries
                    this.remisionDelivered = data.data[0].referral

                    this.customer_id=data.data[0].customers_id
                    this.infoHeader.quotation_id = data.data[0].quotation_id
                    this.itemSelectedCustomer.customers_id = data.data[0].customers_id
                    this.document_type=data.data[0].document_type
                    this.invoice_address = data.data[0].invoice_address
                    this.shipping_address = data.data[0].shipping_address
                    this.document_customer = data.data[0].document_customer
                    this.quotation_id = data.data[0].quotation_id
                    this.consultant_id = data.data[0].consultant_id
                    this.commentorder = data.data[0].order_notes
                    this.commenttransp = data.data[0].transporter_notes
                    this.infoHeader.released = data.data[0].released
                    this.infoHeader.approved = data.data[0].approved == null ? false : data.data[0].approved
                    this.infoHeader.expiration_days = data.data[0].expiration_days
                    this.expiration_days = data.data[0].expiration_days

                    // console.log(this.infoHeader)
                    
                    this.getTypes(this.document_type)

                    infotrade.quotcontroller(this.selectTab,"get-details").then(data =>{
                        this.tableData = []
                        if(data.data != ""){
                            this.tableData = data.data
                        }
                        this.totales()
                    })
                    this.src = master+'commercialsearch/'+this.allProducts+'/'+this.itemSelectedCustomer.nit+'/'
                }
            })
        }
    },

    created(){
        this.optionsDate.minDate = Date.now()
        this.getTRM()
        let value = this.$route.params["id"]
        this.orderLocation = this.$route.params["type"]
        this.loadOrderType(this.orderLocation)
        if(value == 0){
            this.src = master+'customersearch/'
            this.getTypes(null)
        }else{
            this.loadHeader(value)
        }


        let rs = infouser.currentUser()
        if(rs != "ERROR"){
            rs.then(response =>{
                this.userInfo=response.data
            }).catch(e => {
                
            });
        }

        Vue.prototype.$http = Axios
    }
}
</script>

<style>
.scrollable-menu {
    height: auto;
    max-height: 300px;
    overflow-x: hidden;
}
</style>
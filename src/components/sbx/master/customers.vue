<template>
    <div>
        <notifications group="notifications-default" />


        <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
        <div>Maestro de Clientes</div>
            <b-btn variant="primary rounded-pill" @click.prevent="addData()" class="d-block"><span class="ion ion-md-add"></span>&nbsp; Add Cliente</b-btn>
        </h4>
        
        <div class="row">
            <div class="col">
                <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->


            <!-- OPCIONES DE BUSQUEDA Y BOTONES PARA CREAR NUEVOS REGISTROS -->

                <!-- <b-table small show-empty stacked="md" :items="tableData" :fields="columns" :current-page="currentPage" :per-page="perPage" >
                    <template v-slot:cell(edit)="row">
                        <div class="text-left">
                            <b-btn variant="outline-success borderless icon-btn" v-if="check_access('general_customer', 'c')" class="btn-xs" @click.prevent="data_change(row.item,'edit')"><i class="ion ion-md-create"></i></b-btn>
                            <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="data_change(row.item,'delete')"><i class="ion ion-md-close"></i></b-btn>
                        </div>
                    </template>
                    <template v-slot:cell(show)="row">
                        <div class="text-center">
                        <span style="color:red" v-if="!row.item.show"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.show"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                    <template v-slot:cell(active)="row">
                        <div class="text-center">
                            <span style="color:red" v-if="!row.item.active"><i class="ion ion-md-remove-circle"></i></span>
                            <span style="color:green" v-if="row.item.active"><i class="ion ion-md-add-circle"></i></span>
                        </div>
                    </template>
                </b-table> -->

                

                <div class="ml-1 mr-1">
                    <b-input-group>
                        <b-form-input v-model="filter" placeholder="Buscar..." />
                        <b-input-group-append>
                        <b-btn :disabled="!filter" @click="filter = ''"> <span class="oi oi-delete" ></span> </b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </div>
                <div class="row" :class="`contacts-col-view`">
                    <div v-for="contact in this.tableData[currentPage-1]" :key="contact.nit" class="contacts-col col-xs-12 col-sm-12 col-md-6">
                        <b-card class="m-1"  no-body>

                            <!-- {{contact}} -->
                             
                            <div class="contact-content m-2">
                                <div class="contact-content-about">
                                    <h5 class="contact-content-name mb-1"><a href="javascript:void(0)" class="text-body">{{contact.name}}</a></h5>
                                    <div class="small">
                                        <div v-if="contact.website"> {{contact.website}}  &nbsp;&nbsp; <span class="text-lighter"></span> </div>
                                        <div v-if="contact.principal_contact"> Contacto Principal: {{contact.principal_contact}}  &nbsp;&nbsp; <span class="text-lighter">|</span> &nbsp;&nbsp; {{contact.email}}  </div>
                                        <div v-if="contact.phone"> Direccion: {{contact.address}}   </div>
                                        <div v-if="contact.phone"> Telefono: {{contact.phone}} </div>
                                    </div>
                                    <hr class="my-1 border-light">
                                    <div>

                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="customerSelected=contact; data_change(contact,'edit')"><i class="ion ion-md-create"></i></b-btn>
                                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="customerSelected=contact; data_change(contact,'delete'); selectTab = 'gral'"><i class="ion ion-md-close"></i></b-btn>
                                        
                                         &nbsp;&nbsp; <span class="text-lighter">|</span> &nbsp;&nbsp; 

                                         <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="customerSelected=contact; data_change(contact,'edit'); selectTab = 'direcciones'"><i class="fas fa-map-marker"></i></b-btn>
                                         <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="customerSelected=contact; data_change(contact,'edit'); selectTab = 'contactos'; getCustomerContacts()"><i class="fas fa-address-card"></i></b-btn>
                                         <b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="customerSelected=contact; data_change(contact,'edit'); getProducts(contact); valueSelectedProduct=''; selectTab = 'products'"><i class="fas fa-barcode"></i></b-btn>

                                    </div>
                                </div>
                            </div>
                        </b-card>
                    </div>
                </div>

                 <div class="d-flex justify-content-between ml-2 mr-2">
                    <div>
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                    </div>
                    <div class="text-muted">
                        <small> Total Clientes: {{this.totalRows}} </small>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-inline-block">
            <sweet-modal icon="error" title="Borrar registro" ref="errorWithButtonAlert">
                ¿Está seguro que desea borrar el registro?
                <div class="w-100 text-center">
                    El registro será borrado de forma lógica, pero su información será visible en reportes. 
                </div>
                
                <template slot="button"><b-btn v-if="check_access('general_customer', 'd')" @click="deleteRecord()" variant="danger" class="mr-2">Eliminar</b-btn></template>
                <template slot="button"><b-btn @click="closeDeleteRecord()" variant="primary">Cerrar</b-btn></template> 
            </sweet-modal>
        </div>

        <b-modal id="modals-top" v-model="showFormulario"  class="modal-center" size="xl">
            <div slot="modal-title">
            Administrar <span class="font-weight-light">Clientes</span><br>
            <!-- <small :class="infostatus">El código del centro de trabajo enlaza el equipo que esta siendo monitoreado desde los equipos electrónicos.</small> -->
            </div>

            <h3 class="text-left"> {{selectTab == 'gral' ? 'Información General' : selectTab == 'direcciones' ? 'Direcciones Disponibles' : 'Contactos'}} </h3>

            <b-nav class="justify-content-end mb-2">
                <b-nav tabs class="nav-sm tabs-alt">
                    <b-nav-item :active="selectTab=='gral'" @click="selectTab='gral'">Informacion General</b-nav-item>
                    <b-nav-item :active="selectTab=='direcciones'" @click="selectTab='direcciones'">Direcciones</b-nav-item>
                    <b-nav-item :active="selectTab=='contactos'" @click="selectTab='contactos'; getCustomerContacts()">Contactos</b-nav-item>
                    <b-nav-item :active="selectTab=='products'" @click="getProducts(customerSelected);  valueSelectedProduct=''; selectTab='products'">Productos</b-nav-item>
                </b-nav>
            </b-nav>

            <b-row v-if="selectTab == 'gral'">
                <b-col md="12" lg="6" >
                    <b-form-group label-cols="3" label="NIT" >
                        <b-input size="sm" placeholder="NIT" v-model.trim="objInfo.nit" :state="objState.nit!=''" v-on:input="objState.nit = 'valid'; objState.nit= objInfo.nit==''?'invalid':'valid'"/>
                        <!-- <div class="invalid-tooltip">"{{objState.message}}"</div> -->
                    </b-form-group>
                    <b-form-group label-cols="3" label="Nombre">
                        <b-input size="sm" placeholder="Nombre" v-model.trim="objInfo.name" :state="objState.name!=''" v-on:input="objState.name = 'valid'; objState.name= objInfo.name==''?'invalid':'valid'"/>
                    </b-form-group>
                    <b-form-group label-cols="3"  label="Teléfono">
                        <b-input size="sm" placeholder="Teléfono" v-model.trim="objInfo.phone" :state="objState.phone!=''" v-on:input="objState.phone = 'valid'; objState.phone= objInfo.phone==''?'invalid':'valid'"/>
                    </b-form-group>
                    <b-form-group label-cols="3"  label="Dirección">
                        <b-input size="sm" placeholder="Dirección" v-model.trim="objInfo.address" :state="objState.address!=''" v-on:input="objState.address = 'valid'; objState.address= objInfo.address==''?'invalid':'valid'"/>
                    </b-form-group>
                    <b-form-group  label-cols="3" label="Email">
                        <b-input size="sm" placeholder="Correo Electrónico" v-model.trim="objInfo.email"/>
                    </b-form-group>
                    <b-form-group  label-cols="3" label="Tipo de Cliente">
                        <b-select size="sm" v-model="objInfo.type" >
                            <option value="national">Nacional</option>
                            <option value="international">Internacional</option>
                        </b-select>
                    </b-form-group>

                </b-col>
                <b-col md="12" lg="6">
                    <b-form-group  label-cols="3" label="Web Site">
                        <b-input size="sm" placeholder="Web Site" v-model.trim="objInfo.website" />
                    </b-form-group>
                    <b-form-group  label-cols="3" label="Contacto">
                        <b-input size="sm" placeholder="Contacto" v-model.trim="objInfo.principal_contact"/>
                    </b-form-group>

                    <b-form-group  label-cols="3" label="Cupo">
                        <b-input size="sm" placeholder="Cupo" v-model.trim="objInfo.quota"/>
                    </b-form-group>
                    <b-form-group  label-cols="3" label="Plazo (Dias)">
                        <b-input size="sm" placeholder="Plazo" v-model.trim="objInfo.limit_day"/>
                    </b-form-group>
                    <b-form-group  label-cols="3" label="% Descuento">
                        <b-input size="sm" placeholder="Descuento" v-model.trim="objInfo.discount"/>
                    </b-form-group>
                    <b-form-group  label-cols="3" label="Asesor">
                        <b-select size="sm" v-model="objInfo.consultant_id" :options="consultants">
                        </b-select>
                    </b-form-group>
                </b-col>
            </b-row>

            <b-row v-if="selectTab=='direcciones'">
                <b-col  md="12" lg="6" >
                    <div>
                        <div class="border rounded">
                            <div class="m-2">
                            <!-- <b-card header="Direcciones Disponibles" header-tag="h6" class="mb-4" style="padding: 0.5rem"> -->
                                <b-row>
                                    <b-col md="12" lg="6" class="mt-2">
                                        <b-select size="sm" v-model="ojbAddress.type" >
                                            <option value="product">Envío de Mercancía</option>
                                            <option value="invoice">Envío de Facturas</option>
                                        </b-select>
                                    </b-col>
                                    <b-col md="12" lg="6" class="mt-2">
                                        <b-input size="sm" placeholder="Nombre" v-model.trim="ojbAddress.name"/>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col md="12" lg="6" class="mt-2">
                                        <!-- <b-input size="sm" placeholder="País" v-model.trim="ojbAddress.country"/> -->
                                        <b-select size="sm" v-model="country" :options="listCountries" @change="countrySelected(country)">
                                        </b-select>
                                    </b-col>
                                    <b-col md="12" lg="6" class="mt-2">
                                        <b-select size="sm" v-model="city"  :options="cities">
                                        </b-select>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col md="12" lg="6" class="mt-2">
                                        <b-input size="sm" placeholder="Dirección" v-model.trim="ojbAddress.address" />
                                    </b-col>
                                    <b-col md="12" lg="6" class="mt-2">
                                        <b-input size="sm" placeholder="Teléfono" v-model.trim="ojbAddress.phone"/>
                                    </b-col>
                                </b-row>
                                <div class="text-center mt-2">
                                    <b-row >
                                        <b-col md="12" lg="6" class="mt-2">
                                            <div v-if="ojbAddress.type == 'product'">
                                                <b-input size="sm" placeholder="Días de Envío" v-model.trim="ojbAddress.days"/>
                                            </div>
                                        </b-col>
                                        <b-col md="12" lg="6" class="mt-2 text-right" v-if="ojbAddress.customers_id != 0">
                                            <b-btn size="sm" variant="primary" @click="getAddress(); confirmDeleteAddress=false">Cancelar</b-btn>
                                            <b-btn size="sm" variant="danger" @click="deleteAddress(); confirmDeleteAddress=false" v-if="confirmDeleteAddress">Confirmar</b-btn>


                                            <b-btn size="sm" variant="danger" @click="confirmDeleteAddress=true" v-if="!confirmDeleteAddress && ojbAddress.customers_address_id != 0">Eliminar</b-btn>
                                            <b-btn size="sm"  v-if="!confirmDeleteAddress" :variant="ojbAddress.customers_address_id == 0 ? 'success':'warning'" @click="submitAddress()">Guardar</b-btn>
                                        </b-col>
                                    </b-row>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-col>
                <b-col  md="12" lg="6" >
                    <b-table small show-empty stacked="md" :items="dataAddress" :fields="columnsAddress" class="mt-2">
                        <template v-slot:cell(edit)="row">
                            <div class="text-left">
                                <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="loadSelectedInfo(row.item)"><i class="ion ion-md-create"></i></b-btn>
                            </div>
                        </template>
                    </b-table>
                </b-col>
            </b-row>

            <b-row v-if="selectTab=='contactos'">
                <b-col  md="12" lg="6" >
                    <div class="border rounded">
                        <div class="m-2">
                            <b-row>
                                <b-col md="12" lg="12" class="mt-2">
                                    <small class="font-weight-bold">Nombre Completo</small>
                                   <b-input autocomplete="off" size="sm" placeholder="Nombre Completo" v-model.trim="ojbContacto.customer_name"/>
                                </b-col>
                                <b-col md="12" lg="12" class="mt-2">
                                    <small class="font-weight-bold">Cargo</small>
                                    <b-input autocomplete="off" size="sm" placeholder="Cargo" v-model.trim="ojbContacto.job_title"/>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col md="12" lg="12" class="mt-2">
                                    <small class="font-weight-bold">Telefono Fijo</small>
                                   <b-input autocomplete="off" size="sm" placeholder="Telefono Fijo" v-model.trim="ojbContacto.phone"/>
                                </b-col>
                                <b-col md="12" lg="12" class="mt-2">
                                    <small class="font-weight-bold">Extension</small>
                                    <b-input autocomplete="off" size="sm" placeholder="Extension" v-model.trim="ojbContacto.extension"/>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col md="12" lg="12" class="mt-2">
                                    <small class="font-weight-bold">Celular</small>
                                    <b-input autocomplete="off" size="sm" placeholder="Celular" v-model.trim="ojbContacto.cell"/>
                                </b-col>
                                <b-col md="12" lg="12" class="mt-2">
                                    <small class="font-weight-bold">Correo Electronico</small>
                                    <b-input autocomplete="off" size="sm" placeholder="Correo Electronico" v-model.trim="ojbContacto.email" />
                                </b-col>
                            </b-row>
                            <div class="mt-2 text-right">
                                <b-btn size="sm" variant="primary" @click="ojbContacto={}">Cancelar</b-btn>
                                <b-btn size="sm" variant="danger" @click="deleteCustomerContacts();" v-if="deleteCustomer">Confirmar</b-btn>
                                <b-btn size="sm"  v-if="!deleteCustomer" :variant="ojbAddress.customers_address_id == 0 ? 'success':'warning'" 
                                    @click="submitCustomersContacts()">Guardar</b-btn>
                            </div>
                        </div>
                    </div>
                </b-col>
                <b-col  md="12" lg="6" >
                    <div>
                        <div class="border rounded">
                            <!-- <b-table small show-empty stacked="md" :items="dataAddress" :fields="columnsAddress" class="mt-2">
                                <template v-slot:cell(edit)="row">
                                    <div class="text-left">
                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="loadSelectedInfo(row.item)"><i class="ion ion-md-create"></i></b-btn>
                                    </div>
                                </template>
                            </b-table> -->
                            <div class="row" :class="`contacts-col-view`">
                                <div v-for="contact in contactsData" :key="contact.username" class="contacts-col col-12">
                                    <b-card class="m-2"  no-body>
                                        <div class="contact-content m-2">
                                            <div class="contact-content-about">
                                                <h5 class="contact-content-name mb-1"><a href="javascript:void(0)" class="text-body">{{contact.customer_name}}</a></h5>
                                                <div class="small">
                                                    <div>{{contact.job_title}}</div>
                                                    <div v-if="contact.company"> {{contact.company}}  &nbsp;&nbsp; <span class="text-lighter">|</span>  </div>
                                                    <div v-if="contact.phone"> Telefono: {{contact.phone}}  &nbsp;&nbsp; <span class="text-lighter">|</span> &nbsp;&nbsp; 
                                                        Celular: {{contact.phone}}  &nbsp;&nbsp; <span class="text-lighter">|</span> &nbsp;&nbsp; Correo: {{contact.email}}</div>
                                                </div>
                                                <hr class="my-1 border-light">
                                                <div class="text-left">
                                                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="ojbContacto=contact;deleteCustomer=false;"><i class="ion ion-md-create"></i></b-btn>
                                                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="ojbContacto=contact;deleteCustomer=true;"><i class="ion ion-md-close"></i></b-btn>
                                                    <!-- <a href="javascript:void(0)" class="text-danger"><span class="ion ion-md-close"></span></a> &nbsp;&nbsp;
                                                    <a href="javascript:void(0)" class="text-warning"><span class="fas fa-pen"></span></a> &nbsp;&nbsp; -->
                                                </div>
                                            </div>
                                        </div>
                                    </b-card>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-col>
            </b-row>

            <b-row v-if="selectTab=='products'">
                <!-- <b-col  md="12" lg="6" >
                    <div class="border rounded">
                        <div class="m-2">
                            <b-row>
                                <b-col md="12" lg="12" class="mt-2">
                                   <b-input size="sm" placeholder="Nombre Completo" v-model.trim="ojbContacto.name"/>
                                </b-col>
                                <b-col md="12" lg="12" class="mt-2">
                                    <b-input size="sm" placeholder="Cargo" v-model.trim="ojbContacto.departament"/>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col md="12" lg="12" class="mt-2">
                                   <b-input size="sm" placeholder="Telefono Fijo" v-model.trim="ojbContacto.phone"/>
                                </b-col>
                                <b-col md="12" lg="12" class="mt-2">
                                    <b-input size="sm" placeholder="Extension" v-model.trim="ojbContacto.extension"/>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col md="12" lg="12" class="mt-2">
                                    <b-input size="sm" placeholder="Celular" v-model.trim="ojbContacto.cell"/>
                                </b-col>
                                <b-col md="12" lg="12" class="mt-2">
                                    <b-input size="sm" placeholder="Correo Electronico" v-model.trim="ojbContacto.email" />
                                </b-col>
                            </b-row>
                            <div class="mt-2 text-right">
                                <b-btn size="sm" variant="primary" @click="getAddress(); confirmDeleteAddress=false">Cancelar</b-btn>
                                <b-btn size="sm" variant="danger" @click="deleteAddress(); confirmDeleteAddress=false" v-if="confirmDeleteAddress">Confirmar</b-btn>
                                <b-btn size="sm" variant="danger" @click="confirmDeleteAddress=true" v-if="!confirmDeleteAddress && ojbAddress.customers_address_id != 0">Eliminar</b-btn>
                                <b-btn size="sm"  v-if="!confirmDeleteAddress" :variant="ojbAddress.customers_address_id == 0 ? 'success':'warning'" @click="submitAddress()">Guardar</b-btn>
                            </div>
                        </div>
                    </div>
                </b-col> -->
                <b-col  md="12" lg="12" >
                    <div>
                        <div class="position-relative mb-3 mt-2">
                            <b-input-group>
                                <b-input-group-text slot="prepend" v-if="loading">
                                    <i class="ion ion-md-sync"></i>
                                </b-input-group-text>
                                <b-input-group-text slot="prepend" v-if="!loading">
                                    <i class="ion ion-ios-search"></i>
                                </b-input-group-text>
                                <b-input-group-text slot="prepend" @click="resetInput">
                                    <input type="checkbox" v-model="searchAllProducts" aria-label="Buscar productos"> &nbsp; Buscar en los productos locales
                                </b-input-group-text>
                                <input type="text" class="form-control"
                                    placeholder="Busque un Producto"
                                    autocomplete="off"
                                    v-model="valueSelectedProduct" 
                                    @keydown.down="down"
                                    @keydown.up="up"
                                    @keydown.enter="hit"
                                    @keydown.esc="reset"
                                    @blur="reset"
                                    @input="updateQueryProducts" />
                                <!-- <b-input-group-append>
                                    <b-btn variant="success icon-btn" @click="editHeaderOrder()"><i class="fas fa-plus"></i></b-btn>
                                </b-input-group-append> -->
                            </b-input-group>

                            <div class="dropdown-menu scrollable-menu w-50" :class="{ 'd-block': hasItems }" :style="{left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto'}">
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

                        <div v-if="controllCustomerProduct">
                            <b-row>
                                <b-col sm="12" md="6" lg="6" class="mt-1">
                                    <small class="font-weight-bold"> Codigo Cliente</small>
                                    <b-input autocomplete="off" size="sm" placeholder="Codigo Cliente" v-model.trim="customerProduct.code"/>
                                </b-col>
                                <b-col sm="12" md="6" lg="6" class="mt-2">
                                    <small class="font-weight-bold"> Descripcion del Cliente</small>
                                    <b-input autocomplete="off" size="sm" placeholder="Descripcion del Cliente" v-model.trim="customerProduct.description"/>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="12" md="6" lg="6" class="mt-2">
                                    <small class="font-weight-bold"> Precio Base del Producto</small>
                                    <b-input readonly autocomplete="off" size="sm" placeholder="Precio Base del Producto" v-model.trim="customerProduct.price_base"/>
                                </b-col>
                                <b-col sm="12" md="6" lg="6" class="mt-2">
                                    <small class="font-weight-bold"> Precio Del Cliente</small>
                                    <b-input autocomplete="off" size="sm" placeholder="Precio Del Cliente" v-model.trim="customerProduct.price"/>
                                </b-col>
                            </b-row>   
                            <div>
                                <b-col class="mt-2 text-right" v-if="ojbAddress.customers_id != 0">
                                    <b-btn size="sm" variant="primary" @click="controllCustomerProduct=false;deleteCustomer=false">Cancelar</b-btn>
                                    <b-btn size="sm" variant="danger" @click="deleteCustomerProducts();" v-if="deleteCustomer">Confirmar</b-btn>
                                    <!-- <b-btn size="sm" variant="danger" @click="confirmDeleteAddress=true" v-if="!confirmDeleteAddress && ojbAddress.customers_address_id != 0">Eliminar</b-btn> -->
                                    <b-btn size="sm"  v-if="!deleteCustomer" :variant="ojbAddress.customers_address_id == 0 ? 'success':'warning'" @click="submitCustomersProducts()">Guardar</b-btn>
                                </b-col>                      
                            </div>
                        </div>


                        <!-- <div class="border rounded"> -->
                        <b-table small show-empty stacked="md" :fields="productsFields" :items="products" class="mt-2">
                            <template v-slot:cell(code)="row">
                                <div class="text-left">
                                    <small>
                                        ({{row.item.code}}) {{row.item.description}} 
                                    </small>
                                </div>
                            </template>
                            <template v-slot:cell(customer_code)="row">
                                <div class="text-left">
                                    <!-- {{row.item}} -->
                                    <b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="onHit(row.item);deleteCustomer=false"><i class="ion ion-md-create"></i></b-btn>
                                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="onHit(row.item);deleteCustomer=true"><i class="ion ion-md-close"></i></b-btn>
                                    {{row.item.customer_code}}
                                </div>
                            </template>
                        </b-table>
                        <!-- </div> -->
                    </div>
                </b-col>
            </b-row>


            <div slot="modal-footer" class="w-100 text-right">
                <b-btn variant="primary" @click="cancel()">Cancelar</b-btn>
                <b-btn :variant="variantSaveButton" @click="submit()">Guardar</b-btn>
            </div>

        </b-modal>

        <sweet-modal ref="longModal">
            <div class="text-left">
                <vue-markdown :source="contentWiki" :anchor-attributes="anchorAttrs"></vue-markdown>
            </div>
        </sweet-modal>

    </div>
</template>

<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/styles/pages/projects.scss" lang="scss"></style>

<script>
    import Vue from 'vue'
    import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
    import { infomaster } from "@/components/i40/js/master";

    import { config,master } from "@/components/i40/js/globals";
    // import  countries from "../../i40/resources/countries.json";
    import { ApiWikiHelp } from "@/vendor/sbx/sbx-cloud/cloud_apiwiki";

    import Notifications from 'vue-notification'
    import VueMarkdown from 'vue-markdown'
    import {infousers} from '@/components/i40/js/users'
    import { infoconfig } from "@/components/i40/js/config";

    import Axios from 'axios'
    import VueTypeahead from 'vue-typeahead'

// Set up $hhtp client (required by vue-typeahead)
    // Vue.prototype.$http = Axios
  
    Vue.use(Notifications)

    export default {
        extends: VueTypeahead,
    
        metaInfo: {
            title: 'Clientes'
        },
        components: {
            VueMarkdown,
            SweetModal,
            SweetModalTab
        },
        watch: {
                'filter':function(value){

                    let tblArray = []

                    tblArray = this.filter_tableData.filter(function (task) {
                        if(task.nit.toLowerCase().includes(value.toLowerCase()) || task.name.toLowerCase().includes(value.toLowerCase()))
                            return task
                    });

                    this.totalRows = tblArray.length
                    this.currentPage = 1

                    this.preparePaginator(tblArray)
                },

                'valueSelectedProduct':function(value){

                    if(this.searchAllProducts){

                        let tblArray = []

                        tblArray = this.filter_products.filter(function (task) {
                            if(task.code.toLowerCase().includes(value.toLowerCase()) || task.description.toLowerCase().includes(value.toLowerCase())
                            || task.customer_code.toLowerCase().includes(value.toLowerCase()) || task.customer_description.toLowerCase().includes(value.toLowerCase()))
                                return task
                        });

                        this.products = tblArray
                    }
                }
        },
        data: () => ({
            countries:null,
            selectTab:'gral',
            name: 'customers',
            version: 'v1.0.0.0',

            controllCustomerProduct:false,

            src : '',
            valueSelectedProduct:'',
            searchAllProducts:false,
            value: '',
            deleteCustomer:false,
            
            src: '',
            limit: 20,
            minChars: 0,

            contentWiki: "",
            anchorAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            },

            customerProduct:[],
            products:[],
            filter_products:[],

            contactsData: [
                // {
                //     avatar: '1.jpg',
                //     name: 'Chancho 1',
                //     username: 'Chancho1',
                //     company: 'Camel Inc.',
                //     phone: '+57 (4) 666-00-00',
                //     email: 'syncbox@sbx.cloud',
                //     departament: 'Gerente de Ventas'
                // }, {
                //     avatar: '1.jpg',
                //     name: 'Chancho 2',
                //     username: 'Chancho2',
                //     company: 'Camel Inc.',
                //     phone: '+57 (4) 666-00-00'
                // }, {
                //     avatar: '1.jpg',
                //     name: 'Panda Uno Dos',
                //     username: 'punodos',
                //     company: 'Camel Inc.',
                //     phone: '+57 (4) 666-00-00'
                // }, {
                //     avatar: '1.jpg',
                //     name: 'Nuevo Usuarios',
                //     username: 'nusuario',
                //     company: 'Camel Inc.',
                //     phone: '+57 (4) 666-00-00'
                // }, 
            ],

            ///Info de filtro y paginas para la tabla
                currentPage: 1,
                perPage: 50,
                totalRows: 0,
                pageOptions: [ 50, 100, 200 ],
                filter: null,
            ///Info de filtro y paginas para la tabla


            showFormulario:false,

            variantSaveButton:"success",
            disabledcode:false,
            modified:false,
            tableData: [],   
            filter_tableData:[],

            ojbAddress:{},
            listCountries:[],
            cities:[],  
            consultants:[],


            /**
            columns: [
                {key:'description', label:"Descripcion"},
                {key:'workstation_plant_id', label:"workstation_plant_id", thClass: 'd-none', tdClass: 'd-none'},
            ], 
             */

            productsFields:[
                    {key:'customer_code', label:"Codigo Cliente"},
                    {key:'customer_description', label:"Descripcion Cliente"},
                    {key:'code', label:"Codigo"},
                    // {key:'description', label:"Descripcion"},
                    {key:'price_list', label:"Precio de Lista"},

                    {key:'last_price', label:"Precio Cliente"},
            ],

            confirmDeleteAddress:false,
                columnsAddress: [
                    {key:'type', label:"Tipo"},
                    {key:'name', label:"Nombre"},
                    {key:'address', label:"Dirección"},
                    {key:'phone', label:"Telefono"},
                    {key:'days', label:"Dias"},
                  
                    // {key:'principal_contact', label:"Contacto"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Edit"}
                ],

                dataAddress: [],
                customerSelected: [],

            /// Columnas de las tablas
                columns: [
                    {key:'nit', label:"NIT"},
                    {key:'name', label:"Nombre"},
                    {key:'phone', label:"Teléfono"},
                    {key:'address', label:"Dirección"},
                  
                    // {key:'principal_contact', label:"Contacto"},
                    // {key:'decimal_quantity', label:"Cifras Decimales"},
                    ///Este objeto es fijo en caso de que se necesite modificar la info
                    {key:'edit', label:"Edit"}
                ],
            /// Columnas de las tablas

            /// Objeto que será enviado en las operacion CRUD
                objInfo: {
                    customers_id:0,
                    nit: '',
                    name: '',
                    phone: '',
                    address: '',
                    doc_type:null,
                    email:'',
                    website: '',
                    principal_contact: '',
                },

                ojbContacto:{
                    customer_name:'',
                    job_title:'',
                    phone:'',
                    extension:'',
                    cell:'',
                    email:''},

                objState:{},
                country:'',
                city:'',
            ///

        }),
        methods:{

            isRTL () {
                return document.documentElement.getAttribute('dir') === 'rtl' ||
                    document.body.getAttribute('dir') === 'rtl'
            },
        ///Eventos Para Controlar manejo de informacion de precios por producto
            submitCustomersProducts(){
                infoconfig.customerproducts(this.customerProduct,this.customerProduct.customer_products_id == undefined ? "insert" : "update").then(data =>{
                    this.tableCustomerProduct = []
                    
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Borrar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Borrado","¡El Registro se ha Borrado con Éxito!")
                        this.getProducts(this.customerSelected)
                        this.controllCustomerProduct = false
                    }
                })
            },

            deleteCustomerProducts(){
                infoconfig.customerproducts(this.customerProduct, "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Borrar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Borrado","¡El Registro se ha Borrado con Éxito!")
                        this.getProducts(this.customerSelected)
                        this.controllCustomerProduct = false
                    }
                })
            },

            updateQueryProducts(){
                if(!this.searchAllProducts){
                    this.query = this.valueSelectedProduct
                    this.update()
                }
            },

            updateQuery() {
                this.query = this.value
                this.update()
            },

            onHit(item) {
                this.customerProduct ={}

                this.customerProduct.product_id= item.product_id
                this.customerProduct.code = item.code
                this.customerProduct.description = item.description
                this.customerProduct.price_base = item.price_list
                this.customerProduct.price = item.last_price
                this.customerProduct.customer_products_id = item.customer_products_id
                this.controllCustomerProduct=true
                this.customerProduct.customer_id = this.objInfo.customers_id
                this.reset()
            },

            resetInput () {
                this.value = ''
                this.reset()
            },

        ///Eventos Para Controlar manejo de informacion de precios por producto

        ///Eventos para la administracion de contactos

        submitCustomersContacts(){
            this.ojbContacto.customer_id = this.objInfo.customers_id
            this.contactsData = []
            infoconfig.controllercontact(this.ojbContacto,this.ojbContacto.contacts_customer_id == undefined ? "insert" : "update").then(data =>{
                // console.log(data.data)
                
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error al Borrar el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Registro Borrado","¡El Registro se ha Borrado con Éxito!")
                    this.ojbContacto = {}
                }

                if(data.data != ""){
                    this.contactsData = data.data
                    this.deleteCustomer=false
                }
            })
        },

        deleteCustomerContacts(){
            this.contactsData = []
            this.ojbContacto.customer_id = this.objInfo.customers_id
            infoconfig.controllercontact(this.ojbContacto, "delete").then(data => {
                // console.log(data.data)
                if (data.status === 202){
                    this.showCustom('bg-danger text-white', "Error","¡Error al Borrar el Registro!")
                }else{
                    this.showCustom('bg-success text-white', "Registro Borrado","¡El Registro se ha Borrado con Éxito!")
                    this.ojbContacto = {}
                }

                if(data.data != ""){
                    this.contactsData = data.data
                    this.deleteCustomer=false
                }
            })
        },


        getCustomerContacts(){
            this.contactsData = []
            infoconfig.controllercontact(this.objInfo.customers_id,"select").then(data => {
                if(data.data != ""){
                    this.contactsData = data.data
                    this.deleteCustomer=false
                }
            })
        },

        ///Eventos para la administracion de contactos


        ///Eventos para administracion de direcciones

            loadSelectedInfo(item){
                this.ojbAddress=item;
                this.country=item.country;
                this.countrySelected(item.country)
                this.city=item.city 
            },

            countrySelected(value){
                this.cities=[]
                for (let index = 0; index < this.countries[value].length; index++) {
                    const element = this.countries[value][index];
                    this.cities.push({value:element, text:element})
                }
            },
            
            submitAddress(){
                this.ojbAddress.customers_id = this.objInfo.customers_id
                this.ojbAddress.country = this.country
                this.ojbAddress.city = this.city

                infomaster.customers(this.ojbAddress, "0", this.ojbAddress.customers_address_id === 0 ? "insert-address" : "update-address").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        if(this.ojbAddress.customers_address_id === 0)
                            this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
                        else{
                            this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                            // this.showData()
                            // this.restartInfo()
                            this.ojbAddress = {
                                type: null,
                                name: null,
                                address : null,
                                phone:null,
                                days:null,
                                customers_address_id:0,
                            }
                        }

                        this.getAddress()
                    }
                })
                .catch(function (error) {
                    console.log(error.status)
                })
            },

            getProducts(item){
                this.products = []
                this.filter_products=[]
                infomaster.commercialsearch(item.nit,'espacio','client_product').then(data =>{
                    if(data.data != '')
                        this.products = data.data
                        this.filter_products = data.data
                })
            },

            getAddress(){
                infomaster.customers(this.objInfo.customers_id, "0", "select-address").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        this.dataAddress= []
                        this.ojbAddress = {
                            type: null,
                            name: null,
                            address : null,
                            phone:null,
                            days:null,
                            customers_address_id:0,
                        }
                        if(data.data != "")
                            this.dataAddress= data.data
                    }
                })
                .catch(function (error) {
                    console.log(error.status)
                })
            },

            deleteAddress(){
                infomaster.customers(this.ojbAddress, "0", "delete-address").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                    }else{
                        
                        this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
                            this.ojbAddress = {
                                type: null,
                                name: null,
                                address : null,
                                phone:null,
                                days:null,
                                customers_address_id:0,
                            }
                        
                        this.dataAddress= []
                        if(data.data != "")
                            this.dataAddress= data.data
                    }
                })
                .catch(function (error) {
                    console.log(error.status)
                })
            },

            check_access(control, action){
                return infousers.check_access(control,action)
            },
        
        ///Eventos para administracion de direcciones

        ///Funcion para reiniciar los datos
            restartInfo(){
                 this.objInfo= {
                    customers_id:0,
                    nit: '',
                    name: '',
                    phone: '',
                    address: '',
                    doc_type:null,
                    email:'',
                    website: '',
                    principal_contact: '',
                }
            },
        ///Funcion para reiniciar los datos

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
        ///Funcion para cargar la ayuda del helper


        ///Funcion para envio de alertas lateral superior derecha
            showCustom: function(classes, title, text) {
                this.$notify({
                    group: 'notifications-default',
                    type: classes,
                    title: title,
                    text: text
                })
            },
        /// Funcion para envio de alertas lateral superior derecha

        ///Adicionar un nuevo dato, cancelar el ingreso, cancelar el borrado de un dato
            addData:function(){
                this.restartInfo()
                this.ojbAddress = {
                    type: null,
                    name: null,
                    address : null,
                    phone:null,
                    days:null,
                    customers_address_id:0,
                    customers_id:0,
                }
                this.showFormulario=true
            },

            cancel: function(){
                this.restartInfo()
                this.showFormulario=false
            },

            closeDeleteRecord: function(){
                this.restartInfo()
                this.$refs.errorWithButtonAlert.close()
            },
        ///Adicionar un nuevo dato, cancelar el ingreso, cancelar el borrado de un dato

        ///Eventos CRUD
            submit: function(){
                if(this.validate_content()){
                    infomaster.customers(this.objInfo, "0", this.objInfo.customers_id === 0 ? "insert" : "update").then(data => {
                        if (data.status === 202){
                            this.showCustom('bg-danger text-white', "Error","¡Error Guardando el Registro!")
                        }else{
                            if(this.objInfo.customers_id === 0)
                                this.showCustom('bg-success text-white', "Guardar registro","¡El registro se ha Guardado con Éxito!")
                            else
                                this.showCustom('bg-warning text-white', "Modificar registro","¡El registro se ha Modificado con Éxito!")
                            this.showData()
                            // this.restartInfo()
                        }
                    })
                    .catch(function (error) {
                        console.log(error.status)
                    })
                }else{
                    this.showCustom('bg-danger text-white', "Error","¡La Información esta Incompleta, Por Favor Valide!")
                }
            },
            
            deleteRecord: function(){
                infomaster.customers(this.objInfo, "0", "delete").then(data => {
                    if (data.status === 202){
                        this.showCustom('bg-danger text-white', "Error","¡Error al Eliminar el Registro!")
                    }else{
                        this.showCustom('bg-success text-white', "Registro Eliminado","¡El Registro se ha Eliminado con Éxito!")
                        this.restartInfo()
                    }
                    this.dismissCountDown = this.dismissSecs
                    this.showData()
                }).catch(function (error) {
                    this.showCustom('bg-danger text-white', "Error",error)
                })
                
                this.$refs.errorWithButtonAlert.close()
            },

            showData: function(){
                infomaster.customers([], "0","select").then(data => {
                    if(data.data != ""){ 
                        // this.tableData = data.data
                        this.filter_tableData = data.data
                        this.totalRows = data.data.length

                        this.preparePaginator(data.data)
                    }else{
                        this.tableData = []
                        this.filter_tableData = []
                        this.totalRows = 0
                    }
                })
            },

            preparePaginator(array){
                let page = 0;
                let counter = 1;
                this.tableData = []

                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    if(this.tableData[page] == null)
                        this.tableData[page] = []
                    this.tableData[page].push(element)
                    if(counter == this.perPage){
                        page = page+1
                        counter = 1
                    }else{
                        counter = counter+1
                    }
                }
            },
        ///Eventos CRUD

        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla
            data_change :function(row,action){
                this.variantSaveButton="warning"
                this.objInfo=row
                if(action === "edit"){
                    this.getAddress()
                    this.ojbAddress = {
                        type: null,
                        name: null,
                        address : null,
                        phone: null,
                        days: null,
                        customers_id: this.objInfo.customers_id,
                        customers_address_id: 0,
                    }
                    
                    this.objInfo.code_id = row.code
                    this.showFormulario=true
                }
                else
                    this.$refs.errorWithButtonAlert.open()
            },
        ///Preracion de datos para el borrado y el modificado desde el evento de la tabla

            validate_content(){
                let isOK = true;
                this.objState = {}
                this.objState.message = 'Este es un Campo Obligatorio'

                if (this.objInfo.nit == ''){
                    this.objState.nit = 'invalid'
                    isOK = false;
                }else{
                    this.objState.nit = 'valid'
                }
                if (this.objInfo.name == ''){
                     this.objState.name = 'invalid'
                     isOK = false;
                }else{
                    this.objState.name = 'valid'
                }
                if (this.objInfo.phone == ''){
                     this.objState.phone = 'invalid'
                     isOK = false;
                }else{
                    this.objState.phone = 'valid'
                }
                if (this.objInfo.address == ''){
                     this.objState.address = 'invalid'
                     isOK = false;
                }else{
                    this.objState.address = 'valid'
                }

                return isOK
            },
        
        },
        created(){
            this.src = master+'commercialsearch/true/unodos/'
            let cc = null

            infomaster.getcities().then(data =>{
                this.countries = data.data

                cc = Object.keys(this.countries)

                for (let index = 0; index < cc.length; index++) {
                    const element = cc[index];
                    this.listCountries.push({value:element, text:element})
                }

                for (let index = 0; index < this.countries['Colombia'].length; index++) {
                    const element = this.countries['Colombia'][index];
                    this.cities.push({value:element, text:element})
                }

                this.country='Colombia'

                infoconfig.teamsconfig({}, "get-commercials").then(team =>{
                    this.consultants = []
                    for (let index = 0; index < team.data.length; index++) {
                        const element = team.data[index];
                        this.consultants.push({value:element.user_id, text:element.username})
                        
                    }
                });

            })
            this.showData()
            this.valueSelectedProduct = ''
            this.updateQueryProducts()
        },
    }
</script>


<template>
  <div class="invoice-print p-5">

    <div class="row">
      <div class="col-3 pb-4">
        <div class="media align-items-center mb-1">
          <div class="ui-w-40">
            <div class="w-100 position-relative" style="padding-bottom: 54%">
              <img  :src="`${this.publicUrl}img/logo_compania.jpg`" style="max-height:170px" alt="">
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 text-center pb-4">
       <div v-html="jsonOrderPolicies.header"></div>
      </div>

      <div class="col-3 text-center pb-4">
        <div class="text-big font-weight-bold mb-3">
          {{invoiceData.id}}
          <hr style="margin:0px">
          <small> Numero del Pedido </small>
        </div>

        <div class="text-big font-weight-bold mb-3">
          {{invoiceData.created}}
          <hr style="margin:0px">
          <small> Fecha de Elaboracion </small>
        </div>

        <div class="text-big font-weight-bold mb-3">
          {{invoiceData.deadline}}
          <hr style="margin:0px">
          <small> Fecha de Entrega </small>
        </div>

        <!-- <div class="mb-1">Fecha de Ingreso: <strong class="font-weight-semibold">{{Date()}}</strong></div> -->
        <!-- <div>Fecha de Entrega: <strong class="font-weight-semibold">{{invoiceData.dueDate}}</strong></div> -->

      </div>
    </div>

    <hr style="margin-top: 0rem; margin-bottom: 1rem;">

    <div class="row">
      <div class="col-6 mb-4">
        <table>
          <tbody>

            <tr>
              <td colspan="2" class="h4 text-center">
                Informacion Cliente
              </td>
            </tr>
            <tr>
              <td class="pr-3 font-weight-bold">Cliente:</td>
              <td>{{invoiceData.recipient.name}}</td>
            </tr>
            <tr>
              <td class="pr-3 font-weight-bold">NIT:</td>
              <td>{{invoiceData.recipient.company}}</td>
            </tr>
            <tr>
              <td class="pr-3 font-weight-bold">Direccion Envio:</td>
              <td>{{invoiceData.recipient.shipping_address}}</td>
            </tr>
            <tr>
              <td class="pr-3 font-weight-bold">Direccion Factura:</td>
              <td>{{invoiceData.recipient.invoice_address}}</td>
            </tr>
            <tr>
              <td class="pr-3 font-weight-bold">Orden de Compra:</td>
              <td>{{invoiceData.recipient.document_customer}}</td>
            </tr>
            <tr>
              <td class="pr-3 font-weight-bold">Correo Electronico:</td>
              <td>{{invoiceData.recipient.email}}</td>
            </tr>
            <tr>
              <td class="pr-3 font-weight-bold">Nombre del Contacto:</td>
              <td>{{invoiceData.recipient.contact}}</td>
            </tr>
            <tr>
              <td class="pr-3 font-weight-bold">Telefono de Contacto:</td>
              <td>{{invoiceData.recipient.phone}}</td>
            </tr>
            <tr>
              <td class="pr-3 font-weight-bold">Asesor(a):</td>
              <td>{{invoiceData.recipient.username}}</td>
            </tr>
          </tbody>
        </table>

      </div>
      <div class="d-flex align-items-center col-6 mb-4 ">
        <!-- <div>Acuerdos Comerciales</div> -->

        <!-- {{jsonOrderPolicies}} -->

        <table>
          <tbody>
            <tr>
              <td colspan="2" class="h4 text-center">
                Acuerdos Comerciales
              </td>
            </tr>
            <tr v-for="item in jsonOrderPolicies.orders_policies">
              <td class="pr-3 font-weight-bold">{{item.label}}</td>
              <td>{{item.default}}</td>
            </tr>
          </tbody>
        </table>


        <!-- <div class="font-weight-bold mb-2">Detalles de Pago:</div>
       <table>
          <tbody>
            <tr>
              <td class="pr-3">Pago Total:</td>
              <td><strong>{{formatPrice(invoiceTotal)}}</strong></td>
            </tr>
            <tr>
              <td class="pr-3">Banco:</td>
              <td>{{invoiceData.details.bankName}}</td>
            </tr>
            <tr>
              <td class="pr-3">Pais:</td>
              <td>{{invoiceData.details.country}}</td>
            </tr>
            <tr>
              <td class="pr-3">Ciudad:</td>
              <td>{{invoiceData.details.city}}</td>
            </tr>
            <tr>
              <td class="pr-3">Direccion:</td>
              <td>{{invoiceData.details.address}}</td>
            </tr>
            <tr>
              <td class="pr-3">Cuenta Nro:</td>
              <td>{{invoiceData.details.iban}}</td>
            </tr>
            <tr>
              <td class="pr-3">Tipo de Cuenta:</td>
              <td>{{invoiceData.details.swiftCode}}</td>
            </tr>
          </tbody>
        </table> -->
      </div>
    </div>

    <div class="table-responsive mb-4">
      <table class="table m-0">
        <thead>
          <tr>
            <th class="py-2">Codigo</th>
            <th class="py-2">Producto</th>
            <th class="py-2">Cantidad</th>
            <th class="py-2">Precio</th>
            <th class="py-2">Descuento</th>
            <!-- <th class="py-2">Impuestos</th> -->
            <th class="py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in invoiceData.items" :key="item.code">
            <td class="py-2">
              <!-- <div class="font-weight-semibold">{{item.code}}</div> -->
              <div v-if="item.description" class="text-muted">{{item.code}}</div>
            </td>
            <td class="py-2">
              <!-- <div class="font-weight-semibold">{{item.code}}</div> -->
              <div v-if="item.description" class="text-muted">{{item.description}}</div>
            </td>
            <td class="py-2 text-right">
              <strong>{{formatAmount(item.requested_amount)}}</strong>
            </td>
            <td class="py-2 text-right">
              <strong>{{formatPrice(item.sale_price)}}</strong>
            </td>
            <td class="py-2 text-right">
              <strong>{{formatAmount(item.discount)}}%</strong>
            </td>
            <!-- <td class="py-2 text-right">
              <strong>{{formatPrice(item.tax)}}</strong>
            </td> -->
            <td class="py-2 text-right">
              <strong>{{formatPrice(item.total)}}</strong>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="text-right py-2">
              Subtotal:<br>
              Impuestos:<br>
              <span class="d-block text-big mt-2">Total:</span>
            </td>
            <td class="py-2 text-right">
              <strong>{{formatPrice(invoiceSubtotal)}}</strong><br>
              <strong>{{formatPrice(invoiceTax)}}</strong><br>
              <strong class="d-block text-big mt-2">{{formatPrice(invoiceTotal)}}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-muted">
      <!-- {{invoiceData}} -->
    </div>
    <div class="text-muted mt-2" v-if="invoiceData.order_notes">
      <strong>Notas Generales:</strong> {{invoiceData.order_notes}}
    </div>
    <div class="text-muted mt-2" v-if="invoiceData.transporter_notes">
      <strong>Notas Transportadora:</strong> {{invoiceData.transporter_notes}}
    </div>

    <div class="mt-4 text-center small">
      <div v-html="jsonOrderPolicies.footer1"> </div>
      <!-- <div> <strong>Valor Total: {{formatPrice(invoiceTotal)}}</strong> </div> -->
      <hr style="padding:0px;margin:0px">
      <div v-html="jsonOrderPolicies.footer"> </div>
    </div>

  </div>
</template>

<style>
  html, body { background: #fff !important; }
  body > :not(#app) { display: none !important; }
  .invoice-print { min-width: 768px !important; font-size: 15px !important; }
  .invoice-print * { border-color: #aaa !important; color: #000 !important; }
</style>

<script>
import * as numeral from 'numeral'
import { infotrade } from '@/components/i40/js/trade'
import { infosysconfig } from "@/components/i40/js/sysconfig";

export default {
  name: 'pages-invoice-print',
  metaInfo: {
    title: `Pedido`
  },
  data: () => ({
    invoiceData: {
      id: 49029,
      date: 'January 12, 2015',
      dueDate: 'May 12, 2015',
      taxPercent: 25,
      created:'',
      deadline:'',

      recipient: {
        // name: 'Alice Hampton',
        // company: 'Company LTD',
        // shipping_address: '70 Bowman St.',
        // invoice_address: 'South Windsor, CT 06074',
        // document_customer: 'United States',
        // order_notes:'',
        // transporter_notes:'',
      },

      details: {
        bankName: 'Bancolombia',
        country:'Colombia',
        city:'Medellin',
        address: 'cra. 45 nro 25-90',
        iban: '990086689767',
        swiftCode: 'Cuenta Corriente'
      },

      items: []
    },
    orderid:0,
    jsonOrderPolicies:[],
  }),
  computed: {
    invoiceSubtotal () {
      return this.invoiceData.items.reduce((cnt, item) => {
        cnt += item.total
        return cnt
      }, 0)
    },
    invoiceTax () {
      return this.invoiceSubtotal * 19 / 100
    },
    invoiceTotal () {
      return this.invoiceSubtotal + this.invoiceTax
    }
  },
  watch:{
        '$route.params.id':function(value){
            this.orderid=value
            this.getOrderInfo(value)
        },
  },
  methods: {
    formatPrice (p) {
      return numeral(p).format('$0,0.00')
    },
    formatAmount (p) {
      return numeral(p).format('0,0.00')
    },

    async getOrderInfo(value){
        await infotrade.addheadorders(value,"get").then(data =>{
              if(data.status == 200){
                this.invoiceData.recipient.name= data.data[0].name
                this.invoiceData.created= data.data[0].created
                this.invoiceData.deadline= data.data[0].deadline
                this.invoiceData.recipient.company= data.data[0].nit
                this.invoiceData.recipient.shipping_address= data.data[0].shipping_address
                this.invoiceData.recipient.invoice_address= data.data[0].invoice_address
                this.invoiceData.recipient.document_customer= data.data[0].document_customer
                this.invoiceData.recipient.phone= data.data[0].phone
                this.invoiceData.recipient.email= data.data[0].email
                this.invoiceData.recipient.username= data.data[0].username
                this.invoiceData.recipient.contact= data.data[0].principal_contact
                this.invoiceData.order_notes = null
                this.invoiceData.transporter_notes = null

                if(data.data[0].order_notes != "")
                  this.invoiceData.order_notes = data.data[0].order_notes
                if(data.data[0].transporter_notes != "")
                  this.invoiceData.transporter_notes = data.data[0].transporter_notes

                    infotrade.addorderdetails(value,"get").then(data =>{

                        this.invoiceData.items = data.data
                        
                    })
                }
            })
    },
    

  },
  created(){
    this.getOrderInfo(this.$route.params.id)
            let result = {}
            result.code = '001'
            result.module = 'local'
    infosysconfig.commercialcontroller(result, "get").then(data => {
      // console.log(data)

        this.jsonOrderPolicies=data.data[0]
    })
  },
  mounted () {
  }
}
</script>
<style media="print">
 @page {
        size: auto;
        margin: 7mm 7mm 7mm 7mm;  
    }
</style>
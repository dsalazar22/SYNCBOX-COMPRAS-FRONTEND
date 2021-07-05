<template>
<div>
<vue-html2pdf
    :show-layout="false"
    :float-layout="true"
    :enable-download="true"
    :preview-modal="true"
    filename="hehehe"
    :paginate-elements-by-height="1100"
    :pdf-quality="2"
    pdf-format="a4"
    pdf-orientation="portrait"
    pdf-content-width="800px"
    :manual-pagination="false"
 
    @progress="onProgress($event)"
    @startPagination="startPagination()"
    @hasPaginated="hasPaginated()"
    @beforeDownload="beforeDownload($event)"
    @hasDownloaded="hasDownloaded($event)"
    ref="html2Pdf"
>
    <section slot="pdf-content">


 <div class="invoice-print p-5">

    <div class="row">
      <div class="col-7 pb-4">

        <div class="media align-items-center mb-1">
          <div class="ui-w-40">
            <div class="w-100 position-relative" style="padding-bottom: 54%">
              <img  :src="`${this.publicUrl}img/logo_companiax.jpg`" style="max-height:120px" alt="">
            </div>
          </div>
        </div>

        <div class="mb-1"> <b>REPRESENTACIONES OSCAR JARAMILLO</b></div>
        <div class="mb-1">PLÁSTICOS OJARA S.A.</div>
        <div>NIT 890.920.025-0</div>
        <div>CR 42 54A 155 IN 1050 Itagüí – Antioquia – Colombia</div>
        <div>PBX: (57) (4) 444 8786 – www.ojara.com</div>
        <div>Correo electrónico: cliente@ojara.com</div>
        <div>Somos Auto-Retenedores</div>
        
        

      </div>

      <div class="col-5 text-right pb-4">

        <h6 class="text-big text-large font-weight-bold mb-3">PEDIDO NUMERO #{{invoiceData.id}}</h6>
        <div class="mb-1">Fecha de Ingreso: <strong class="font-weight-semibold">{{Date()}}</strong></div>
        <!-- <div>Fecha de Entrega: <strong class="font-weight-semibold">{{invoiceData.dueDate}}</strong></div> -->

      </div>
    </div>

    <hr class="mb-4">
    <div class="row">
      <div class="col-6 mb-4">

        <div class="font-weight-bold mb-2">Informacion Cliente:</div>
        <div>Cliente: {{invoiceData.recipient.name}}</div>
        <div v-if="invoiceData.recipient.company">NIT: {{invoiceData.recipient.company}}</div>
        <div>Envio: {{invoiceData.recipient.shipping_address}}</div>
        <div>Factura: {{invoiceData.recipient.invoice_address}}</div>
        <div>OC: {{invoiceData.recipient.document_customer}}</div>
        <div v-if="invoiceData.recipient.phone">Telefono: {{invoiceData.recipient.phone}}</div>
        <div>Correo: {{invoiceData.recipient.email}}</div>

      </div>
      <div class="col-6 mb-4">

        <div class="font-weight-bold mb-2">Detalles de Pago:</div>
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
        </table>
      </div>
    </div>

    <div class="table-responsive mb-4">
      <table class="table m-0">
        <thead>
          <tr>
            <th class="py-3">Codigo</th>
            <th class="py-3">Producto</th>
            <th class="py-3">Cantidad</th>
            <th class="py-3">Precio</th>
            <th class="py-3">Descuento</th>
            <th class="py-3">Impuestos</th>
            <th class="py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in invoiceData.items" :key="item.code">
            <td class="py-3">
              <!-- <div class="font-weight-semibold">{{item.code}}</div> -->
              <div v-if="item.description" class="text-muted">{{item.code}}</div>
            </td>
            <td class="py-3">
              <!-- <div class="font-weight-semibold">{{item.code}}</div> -->
              <div v-if="item.description" class="text-muted">{{item.description}}</div>
            </td>
            <td class="py-3">
              <strong>{{formatAmount(item.requested_amount)}}</strong>
            </td>
            <td class="py-3">
              <strong>{{formatPrice(item.sale_price)}}</strong>
            </td>
            <td class="py-3">
              <strong>{{formatAmount(item.discount)}}%</strong>
            </td>
            <td class="py-3">
              <strong>{{formatPrice(item.tax)}}</strong>
            </td>
            <td class="py-3">
              <strong>{{formatPrice(item.total)}}</strong>
            </td>
          </tr>
          <tr>
            <td colspan="6" class="text-right py-3">
              Subtotal:<br>
              Impuestos:<br>
              <span class="d-block text-big mt-2">Total:</span>
            </td>
            <td class="py-3">
              <strong>{{formatPrice(invoiceSubtotal)}}</strong><br>
              <strong>{{formatPrice(invoiceTax)}}</strong><br>
              <strong class="d-block text-big mt-2">{{formatPrice(invoiceTotal)}}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-muted">
      <strong>Notas Pedido:</strong> {{invoiceData.recipient.order_notes}}
    </div>
    <div class="text-muted mt-2">
      <strong>Notas Transportadora:</strong> {{invoiceData.recipient.transporter_notes}}
    </div>
  </div>


    </section>
</vue-html2pdf>

		<button @click="generateReport">Export to PDF</button>
</div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'
import * as numeral from 'numeral'
import { infotrade } from '@/components/i40/js/trade'
 
export default {
    components: {
    VueHtml2pdf
    },

    data: () => ({
    invoiceData: {
      id: 49029,
      date: 'January 12, 2015',
      dueDate: 'May 12, 2015',
      taxPercent: 25,

      recipient: {
        name: 'Alice Hampton',
        company: 'Company LTD',
        shipping_address: '70 Bowman St.',
        invoice_address: 'South Windsor, CT 06074',
        document_customer: 'United States',
        order_notes:'',
        transporter_notes:'',
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
      generateReport () {
            this.$refs.html2Pdf.generatePdf()
        },
        async beforeDownload ({ html2pdf, options, pdfContent }) {
            await html2pdf().set(options).from(pdfContent).toPdf().get('pdf').then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages()
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i)
                    pdf.setFontSize(10)
                    pdf.setTextColor(150)
                    pdf.text('Page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() * 0.88), (pdf.internal.pageSize.getHeight() - 0.3))
                } 
            }).save()
        },

         formatPrice (p) {
      return numeral(p).format('$0,0.00')
    },
    formatAmount (p) {
      return numeral(p).format('0,0.00')
    },

    async getOrderInfo(value){
        await infotrade.addheadorders(value,"get").then(data =>{
              if(data.status == 200){
                  console.log(data.data)
                // this.infoHeader.order_id = data.data  
                // this.order_id = data.data

                this.invoiceData.recipient.name= data.data[0].name
                this.invoiceData.recipient.company= data.data[0].nit
                this.invoiceData.recipient.shipping_address= data.data[0].shipping_address
                this.invoiceData.recipient.invoice_address= data.data[0].invoice_address
                this.invoiceData.recipient.document_customer= data.data[0].document_customer
                this.invoiceData.recipient.phone= ''
                this.invoiceData.recipient.email= ''


                //     this.loadcartera(data.data[0].nit)
                //     this.itemSelectedCustomer={}
                //     this.valueSelectedCustomer = data.data[0].name
                //     this.itemSelectedCustomer.nit = data.data[0].nit
                //     this.multipleDelivered = data.data[0].multiple_deliveries
                //     this.remisionDelivered = data.data[0].referral

                //     this.customer_id=data.data[0].customers_id
                //     this.infoHeader.order_id = data.data[0].order_id
                //     this.itemSelectedCustomer.customers_id = data.data[0].customers_id
                //     this.document_type=data.data[0].document_type
                //     this.invoice_address = data.data[0].invoice_address
                //     this.shipping_address = data.data[0].shipping_address
                //     this.document_customer = data.data[0].document_customer
                //     this.orders_id = data.data[0].order_id
                //     this.order_id = data.data[0].order_id
                //     this.consultant_id = data.data[0].consultant_id
                //     this.commentorder = data.data[0].order_notes
                //     this.commenttransp = data.data[0].transporter_notes
                //     this.infoHeader.released = data.data[0].released
                //     this.infoHeader.approved = data.data[0].approved == null ? false : data.data[0].approved

                //     // console.log(this.infoHeader)
                    
                //     this.getTypes(this.document_type)

                    infotrade.addorderdetails(value,"get").then(data =>{
                        // this.tableData = []
                        // if(data.data != ""){
                        //     this.tableData = data.data
                        // }
                        // this.totales()

                        this.invoiceData.items = data.data
                        
                    })
                //     this.src = master+'commercialsearch/'+this.allProducts+'/'+this.itemSelectedCustomer.nit+'/'
                }
            })
    },
    },
  created(){
    this.getOrderInfo(this.$route.params.id)
  },
}
</script>
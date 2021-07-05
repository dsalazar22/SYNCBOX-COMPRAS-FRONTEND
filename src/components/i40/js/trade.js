import axios from 'axios'
import {trade,pdfconn} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infotrade = {
  orders: function (info, actions) {
    // console.log( JSON.parse(localStorage.getItem('syncbox.cloud')).token)
    // console.log(trade)
    return axios.post(trade + 'commercialsorders/' + actions, info, axiosConfig)
  },

  addheadorders: function (info, actions) {
    return axios.post(trade + 'comercialordercontroller/' + actions, info, axiosConfig)
  },
  
  addorderdetails: function (info, actions) {
    return axios.post(trade + 'comercialorderdetailcontroller/' + actions, info, axiosConfig)
  },

  gettrm: function (divisa) {
    return axios.get(trade + 'gettrm/' + divisa, axiosConfig)
  },
  
  update_order_status: function (info, actions) {
    return axios.post(trade + 'updateorderstatus', info, axiosConfig)
  },

  purchases: function (info, actions) {
    return axios.post(trade + 'commercialpurchases/' + actions, info, axiosConfig)
  },

  getcartera: function (info, actions) {
    return axios.get(trade + 'getoutstandinginvoices/' + actions+ '/' + info, axiosConfig)
  },

  deliveries: function (info, actions) {
    return axios.post(trade + 'deliveries/' + actions,info, axiosConfig)
  },

  globalordersreport: function () {
    return axios.get(trade + 'globalordersreport', axiosConfig)
  },
  quotcontroller: function (info, actions) {
    return axios.post(trade + 'quotcontroller/' + actions, info, axiosConfig)
  },

  printOrders: function(info){
    // return axios.post('http://localhost:3000/orders', info)
    let url = pdfconn+'orders'
    let method = "POST"
    let data = info

    return axios.request({
      url,
      method,
      data,
      responseType: 'blob', //important
    })
  },

  sendMail: function (info) {
    return axios.post(pdfconn+'orders', info, axiosConfig)
  },
}

export {
  infotrade
}

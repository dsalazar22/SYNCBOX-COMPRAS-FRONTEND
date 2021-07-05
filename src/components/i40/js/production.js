import axios from 'axios'
import {production} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infoproduction = {
  production: function (info, actions) {
    return axios.post(production + 'getproductionorders/' + actions, info, axiosConfig)
  },
  reportproduction: function(info,actions) {
    return axios.post(production + 'reportproduction/' + actions, info, axiosConfig)
  },
  createproductionorder: function(info) {
    return axios.post(production + 'createproductionorder', info, axiosConfig)
  },
  preparedorder: function(info) {
    return axios.get(production + 'preparedorder/'+info, axiosConfig)
  },
  updateproductionorder: function(info) {
    return axios.post(production + 'updateorders', info, axiosConfig)
  },
  updatedetailproductionorder: function(info) {
    return axios.post(production + 'updatedetailproductionorder', info, axiosConfig)
  },
  changestatusorderprocess: function(info) {
    return axios.post(production + 'changestatusorderprocess', info, axiosConfig)
  },
  searchproductionorder: function(info) {
    return axios.get(production + 'searchproductionorder/'+ info, axiosConfig)
  },
  loadoperators: function(event, info) {
    return axios.post(production + 'eventsoperators/'+event, info, axiosConfig)
  },
  detailsReports: function(event) {
    return axios.get(production + 'reportsdetail/'+event, axiosConfig)
  },
  hideorder: function(info) {
    return axios.post(production + 'hideorder',info, axiosConfig)
  },
  showorder: function(info) {
    return axios.post(production + 'showorder', info, axiosConfig)
  },
  getcurrentorders: function(info) {
    return axios.get(production + 'getcurrentorders/'+ info, axiosConfig)
  }
}

export {
  infoproduction
}

import axios from 'axios'
import {config} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infoconfig = {
  routes: function (info, id, actions) {
    return axios.post(config + 'routes/' + actions + '/' + id, info, axiosConfig)
  },

  routeOperations: function (info, id, actions) {
    return axios.post(config + 'routeoperations/' + actions + '/' + id, info, axiosConfig)
  },

  routeOperationsProcess: function (info, process, id, actions) {
    return axios.post(config + 'routeoperationsprocess/' + actions + '/' + process + '/' + id, info, axiosConfig)
  },

  products: function (info, id, actions) {
    return axios.post(config + 'productscontrol/' + actions + '/' + id, info, axiosConfig)
  },

  process: function (info, actions) {
    return axios.post(config + 'processDefinition/' + actions, info, axiosConfig)
  },

  workstationprocess: function (info, action) {
    return axios.post(config + 'workstationprocess/' + action, info, axiosConfig)
  },

  tools: function (info, actions) {
    return axios.post(config + 'tools/' + actions, info, axiosConfig)
  },

  producttools: function (info, id, actions) {
    return axios.post(config + 'producttools/' + actions + '/' + id, info, axiosConfig)
  },

  customerproducts: function (info, actions) {
    return axios.post(config + 'customerproducts/' + actions, info, axiosConfig)
  },

  supplierproducts: function (info, actions) {
    return axios.post(config + 'supplierproducts/' + actions, info, axiosConfig)
  },

  typeroute: function () {
    return axios.post(config + 'typerouteoperation', axiosConfig)
  },

  routeproduct: function (info, id, actions) {
    return axios.post(config + 'routeproduct/' + actions + '/' + id, info, axiosConfig)
  },

  billofmaterialscontrol: function (info, id, actions) {
    return axios.post(config + 'billofmaterialscontrol/' + actions + '/' + id, info, axiosConfig)
  },

  detailsbillofmaterialscontrol: function (info, id, actions) {
    return axios.post(config + 'detailsbillofmaterialscontrol/' + actions + '/' + id, info, axiosConfig)
  },

  productstructure: function (id_product, id_bill_of_materials) {
    return axios.get(config + 'productstructure/' + id_product + '/' + id_bill_of_materials, axiosConfig)
  },

  teamsconfig: function (info, action) {
    return axios.post(config + 'teamsconfig/' + action, info, axiosConfig)
  },

  controllercontact: function (info, action) {
    return axios.post(config + 'controllercontact/' + action, info, axiosConfig)
  },

  fieldsconfig: function (info, action) {
    return axios.post(config + 'fieldsconfig/' + action, info, axiosConfig)
  },

  userswsgroup: function (info) {
    return axios.post(config + 'userswsgroup', info, axiosConfig)
  },

  getuserswsgroup: function (info) {
    return axios.get(config + 'userswsgroup/' + info, axiosConfig)
  },
}

export {
  infoconfig
}

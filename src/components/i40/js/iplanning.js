
import axios from 'axios'
import {planning} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infoplanning = {
  holidays: function (info, actions) {
    return axios.post(planning + 'customcalendar/' + actions, info, axiosConfig)
  },

  capabilities: function (info, actions) {
    return axios.post(planning + 'capabilities/' + actions, info, axiosConfig)
  },

  calendarcontroller: function (info, actions) {
    return axios.post(planning + 'calendarcontroller/' + actions, info, axiosConfig)
  },

  workstationload: function (actions) {
    return axios.get(planning + 'workstationload/' + actions, axiosConfig)
  },

  workstationslots: function (actions) {
    return axios.get(planning + 'workstationslots/' + actions, axiosConfig)
  },

  getplanninginfo: function (info, actions) {
    return axios.post(planning + 'planninginfo/' + actions, info, axiosConfig)
  },

  getinventary: function () {
    return axios.get(planning + 'getinventory', axiosConfig)
  },

  getinventarydict: function () {
    return axios.get(planning + 'getinventorydict', axiosConfig)
  },

  getinventaryproduct: function (code) {
    return axios.get(planning + 'getinventoryproduct/'+code, axiosConfig)
  },

  getinventarydetail: function (info, actions) {
    return axios.post(planning + 'getcodedetailinvline/'+actions, info, axiosConfig)
  },

  getcalendarmps: function (info, actions) {
    return axios.post(planning + 'getcalendarmps/'+actions, info, axiosConfig)
  },

  getKeepCapacity: function (info, actions) {
    return axios.post(planning + 'keepcapacity', info, axiosConfig)
  },

  removeorderplanned: function (info) {
    return axios.get(planning + 'removeorderplanned/'+info, axiosConfig)
  },

  getinforesources: function (info) {
    return axios.get(planning + 'getinforesources/'+info, axiosConfig)
  },

  getorderplanned: function (info) {
    return axios.get(planning + 'getorderplanned/'+info, axiosConfig)
  },

  deleteorderplanned: function (info) {
    return axios.get(planning + 'deleteorderplanned/'+info, axiosConfig)
  },

  recoveryorderplanned: function (info) {
    return axios.get(planning + 'recoveryorderplanned/'+info, axiosConfig)
  },

  setorderplanned: function (info, content) {
    return axios.post(planning + 'setorderplanned/'+info,content, axiosConfig)
  },

  sandbox_planning: function (content) {
    return axios.post(planning + 'mountsandbox',content, axiosConfig)
  },

  removesandbox: function () {
    return axios.get(planning + 'removesandbox', axiosConfig)
  },


  operationslots: function (idorder) {
    return axios.get(planning + 'operationslots/'+idorder, axiosConfig)
  },

  mount: function (content) {
    return axios.get(planning + 'mount/'+content, axiosConfig)
  },

  explosionCode: function (info) {
    return axios.post(planning + `getexplosioncode`, info, axiosConfig)
  },

  deleteop: function (info) {
    return axios.get(planning + `deleteop/`+info, axiosConfig)
  },

  changepriority: function (info) {
    return axios.post(planning + `changepriority`, info, axiosConfig)
  },

  changestatusactivity: function (info) {
    return axios.post(planning + `changestatusactivity`, info, axiosConfig)
  },

  addworkstation: function (info) {
    return axios.post(planning + `addworkstation`, info, axiosConfig)
  },

  remoworkstation: function (info) {
    return axios.post(planning + `remoworkstation`, info, axiosConfig)
  },

  getfullinfocapacity: function () {
    return axios.get(planning + `getfullinfocapacity`, axiosConfig)
  },

  setstandard: function (opp,pxh) {
    return axios.get(planning + `setstandard/${opp}/${pxh}`, axiosConfig)
  }
}

export {
    infoplanning
}

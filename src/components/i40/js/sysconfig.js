import axios from 'axios'
import {sysconfig} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infosysconfig = {
  forms: function (info, actions) {
    return axios.post(sysconfig + 'forms/' + actions, info, axiosConfig)
  },

  toolstype: function (info, actions) {
    return axios.post(sysconfig + 'toolstype/' + actions, info, axiosConfig)
  },

  btctypes: function (info, actions) {
    return axios.post(sysconfig + 'btctypes/' + actions, info, axiosConfig)
  },

  um: function (info, actions) {
    return axios.post(sysconfig + 'unitymeasure/' + actions, info, axiosConfig)
  },
  
  forms: function (info, actions) {
    return axios.post(sysconfig + 'forms/' + actions, info, axiosConfig)
  },

  documentstatus: function (info, actions) {
    return axios.post(sysconfig + 'documentstatus/' + actions, info, axiosConfig)
  },

  documenttype: function (info, actions) {
    return axios.post(sysconfig + 'documenttype/' + actions, info, axiosConfig)
  },

  ctrlturns: function (info, actions) {
    return axios.post(sysconfig + 'ctrlturns/' + actions, info, axiosConfig)
  },
  
  functionalarea: function (info, actions) {
    return axios.post(sysconfig + 'functionalarea/' + actions, info, axiosConfig)
  },
  
  workstationtype: function (info, actions) {
    return axios.post(sysconfig + 'workstationtype/' + actions, info, axiosConfig)
  },

  movtype: function (info, actions) {
    return axios.post(sysconfig + 'movtype/' + actions, info, axiosConfig)
  },

  sbxconfig: function (mod, code, value, action) {
    return axios.get(sysconfig + `workstationtype/${code}/${mod}/${value}/${action}`, axiosConfig)
  },

  commercialcontroller: function (info, action) {
    return axios.post(sysconfig + `commercialcontroller/${action}`, info, axiosConfig)
  }

}

export {
  infosysconfig
}

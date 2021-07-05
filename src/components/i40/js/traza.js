import axios from 'axios'
import {traza} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infotraza = {
  production: function (actions, info) {
    return axios.post(traza + `productionmessage/${actions}`, info, axiosConfig)
  },

  bitacora: function (info, days, actions) {
    return axios.post(traza + `bitacora/${days}/` + actions, info, axiosConfig)
  },

  getworkstation: function () {
    return axios.get(traza + 'getwscode', axiosConfig)
  },

  getinfows: function (info) {
    console.log('getinfows/'+info)
    return axios.get(traza + 'getinfows/'+info, axiosConfig)
  },
  
  timeline: function (info) {
    return axios.get(traza + 'timeline/'+info, axiosConfig)
  },



  getdate: function (days) {
    return axios.get(traza + `getdates/${days}`, axiosConfig)
  }, 
  
  getinfodates: function (days) {
    return axios.get(traza + `getinfodates/${days}`, axiosConfig)
  },
  
  saverealvalue: function (info) {
    return axios.post(traza + `saverealvalue`,info, axiosConfig)
  },

  savecloseturn: function (info) {
    return axios.post(traza + `savecloseturn`,info, axiosConfig)
  },
}

export {
  infotraza
}
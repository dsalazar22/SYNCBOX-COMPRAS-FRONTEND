import axios from 'axios'
import {inventory} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infoinventory = {
  warehouse: function (info, actions) {
    return axios.post(inventory + 'warehouse/' + actions, info, axiosConfig)
  },
  ubications: function (info, actions) {
    return axios.post(inventory + 'ubications/' + actions, info, axiosConfig)
  },
  controllerinventory: function (info, actions) {
    return axios.post(inventory + 'controllerinventory/' + actions, info, axiosConfig)
  },
  totalsinventory: function (actions) {
    return axios.get(inventory + 'geinventory/' + actions, axiosConfig)
  },
//   workstationload: function (actions) {
//     return axios.get(warehouse + 'workstationload/' + actions, axiosConfig)
//   },
}

export {
    infoinventory
}

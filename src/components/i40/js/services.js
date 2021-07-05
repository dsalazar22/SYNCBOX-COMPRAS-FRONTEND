import axios from 'axios'
import {services} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infoservices = {
    services: function (info, actions) {
    return axios.post(services + 'services/' + actions, info, axiosConfig)
  },
}

export {
    infoservices
}

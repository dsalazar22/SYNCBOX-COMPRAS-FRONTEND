import axios from 'axios'
import {notify} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? null : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infonotify = {
    notifycontroller: function (info, actions) {
    return axios.post(notify + `notification/` + actions, info, axiosConfig)
  },
}

export {
    infonotify
}

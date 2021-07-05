import axios from 'axios'
import {datacontroller} from '../conn'

var infouser = {
   currentUser: function () {
    if (JSON.parse(localStorage.getItem('syncbox.cloud')) != null){
      return axios.post(datacontroller + 'currentUser' , JSON.parse(localStorage.getItem('syncbox.cloud')) != null ? JSON.parse(localStorage.getItem('syncbox.cloud')).token : "")
    }
    else
      return "ERROR"
  },

   validate: function () {
    if (JSON.parse(localStorage.getItem('syncbox.cloud')) != null)
      return axios.post(datacontroller + 'validate',  JSON.parse(localStorage.getItem('syncbox.cloud')) != null ? JSON.parse(localStorage.getItem('syncbox.cloud')).token : "")
      else
        return "ERROR"
  }
}

export {infouser}

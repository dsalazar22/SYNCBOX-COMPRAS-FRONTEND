import axios from 'axios'
import {embebbed} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': "local--"
  }
}

var infoembebbed = {
  wscontroller: function (info, actions) {
    return axios.post(embebbed + 'wscontroller/' + actions, info)
  },
}  

export {
    infoembebbed
}


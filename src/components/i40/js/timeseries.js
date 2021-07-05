import axios from 'axios'
import {time_series} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infotimeseries = {

    get_content_time_series(info, action) {
        return axios.post(time_series + 'getcontenttimeseries/' + action, info, axiosConfig)
      },

      get_epoch_time_series(action) {
        return axios.get(time_series + 'getepochtimeseries/' + action, axiosConfig)
        // return axios.post(time_series + 'getcontenttimeseries/' + action, info)
      },
  
      tagcontroller(info, key, action) {
        // return axios.post(time_series + 'getcontenttimeseries/' + action, info, axiosConfig)
        return axios.post(time_series + `tagcontroller/${action}/${key}` , info, axiosConfig)
      },
  
      getlastvalue(key) {
        // return axios.post(time_series + 'getcontenttimeseries/' + action, info, axiosConfig)
        return axios.post(time_series + `getlastvalue/${key}` , axiosConfig)
      },
  
      boardcontroller(info, action) {
        // return axios.post(time_series + 'getcontenttimeseries/' + action, info, axiosConfig)
        return axios.post(time_series + `boardcontroller/${action}` , info, axiosConfig)
      },
      
      alarmcontroller(info, action) {
        // return axios.post(time_series + 'getcontenttimeseries/' + action, info, axiosConfig)
        return axios.post(time_series + `alarmcontroller/${action}` , info, axiosConfig)
      },
      
      ownertagscontroller(info, action) {
        // return axios.post(time_series + 'getcontenttimeseries/' + action, info, axiosConfig)
        return axios.post(time_series + `ownertagscontroller/${action}` , info, axiosConfig)
      },
  
      gettimeseries(){
          return time_series
      }
          
}

export {
  infotimeseries
}
    
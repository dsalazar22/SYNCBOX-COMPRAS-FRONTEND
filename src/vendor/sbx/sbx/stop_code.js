
import axios from 'axios'
import {apiconnection} from '../conn'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

function NewStopCode (StopCode) {
  return axios.post(apiconnection + 'newStopCode', {
    code: StopCode.code,
    description: StopCode.description,
    availability: StopCode.availability,
    performance: StopCode.performance,
    setup_time: StopCode.setup_time,
    auto_stop: StopCode.auto_stop,
    next_order: StopCode.next_order,
    affect_order: StopCode.affect_order,
    auto_start: StopCode.auto_start,
    definition: StopCode.definition
  }, axiosConfig)
}

function UpdateStopCode (StopCode) {
  return axios.post(apiconnection + 'updateStopCode', {
    code: StopCode.code,
    description: StopCode.description,
    availability: StopCode.availability,
    performance: StopCode.performance,
    setup_time: StopCode.setup_time,
    auto_stop: StopCode.auto_stop,
    next_order: StopCode.next_order,
    affect_order: StopCode.affect_order,
    auto_start: StopCode.auto_start,
    definition: StopCode.definition
  }, axiosConfig)
}

function DeleteStopCode (code) {
  return axios.get(apiconnection + 'deleteStopCode/' + code, axiosConfig)
}

function GetActiveStopCode () {
  return axios.get(apiconnection + 'getStopCode', axiosConfig)
}
// eslint-disable-next-line standard/object-curly-even-spacing
export {NewStopCode, UpdateStopCode, GetActiveStopCode, DeleteStopCode}

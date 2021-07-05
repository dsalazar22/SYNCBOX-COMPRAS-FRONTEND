import axios from 'axios'
import {apiconnection} from '../conn'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

function SpeedController (info, action) {
  return axios.post(apiconnection + 'speedController/' + action + '/_', {
    id: info.id,
    speed_config_id: info.speed_config_id,
    product_id: info.product_id,
    code: info.code,
    description: info.description,
    standard_time_cycle: info.standard_time_cycle,
    unity_expected_cycle: info.unity_expected_cycle,
    default: info.default,
    modify_unity_expected: info.modify_unity_expected
  }, axiosConfig)
}

export {SpeedController}

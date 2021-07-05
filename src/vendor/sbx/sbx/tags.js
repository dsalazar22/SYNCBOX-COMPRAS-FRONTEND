
import axios from 'axios'
import {apiconnection} from '../conn'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

function TagsController (info, action) {
  return axios.post(apiconnection + 'tagsController/' + action, {
    id: info.id,
    frequency: info.frequency,
    unit_of_measurement: info.unit_of_measurement,
    decimal_places: info.decimal_places,
    lower_limit: info.lower_limit,
    upper_limit: info.upper_limit
  }, axiosConfig)
}

export {TagsController}

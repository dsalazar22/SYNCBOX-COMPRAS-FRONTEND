
import axios from 'axios'
import {apiconnection} from '../conn'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

function WorkStationPlantController (info, action) {
  return axios.post(apiconnection + 'wapiController/' + action + '/wsplant', {
    id: info.id,
    description: info.description,
    active: info.active,
    show: info.show
  }, axiosConfig)
}

function WorkStationGroupController (info, action) {
  return axios.post(apiconnection + 'wapiController/' + action + '/wsgroup', {
    id: info.id,
    description: info.description,
    active: info.active,
    show: info.show
  }, axiosConfig)
}

function WorkStationController (info, action) {
  if (action === 'select') {
    return axios.post(apiconnection + 'wapiController/' + action + '/workstation', {
      code: info.codigo,
      description: info.description
    }, axiosConfig)
  } else {
    return axios.post(apiconnection + 'wapiController/' + action + '/workstation', {
      id: info.id,
      code: info.codigo,
      description: info.description,
      type_id: info.selectedWorkStationType.workstation_type_id,
      plant_id: info.selectedPlant.workstation_plant_id,
      group_id: info.selectedGroup.workstation_group_id
    }, axiosConfig)
  }
}

export {WorkStationPlantController, WorkStationGroupController, WorkStationController}

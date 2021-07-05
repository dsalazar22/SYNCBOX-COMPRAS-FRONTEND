import axios from 'axios'
import {datacontroller} from '../conn'

function ObtenerInfoLicense () {
  return axios.get(datacontroller + 'obtenerInfoLicense')
}

function SetInfoLicense (code, license) {
  return axios.post(datacontroller + 'setInfoLicense', {
    Licencia: license,
    NumeroValidacion: code
  })
}

export { ObtenerInfoLicense, SetInfoLicense }

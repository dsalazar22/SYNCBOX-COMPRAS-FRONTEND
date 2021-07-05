
import axios from 'axios'
import {datacontroller} from '../conn'

function UpdateCentrosTrabajo (parameter) {
  return axios.post(datacontroller + 'bridgeContent/updateCentrosTrabajo', {
    IdCentroTrabajo: parameter.IdCentroTrabajo,
    NumeroValidacion: parameter.NumeroValidacion,
    Licencia: parameter.Licencia,
    Codigo: parameter.Codigo,
    Descripcion: parameter.Descripcion
  })
}

function AddCentrosTrabajo (parameter) {
  return axios.post(datacontroller + 'bridgeContent/addCentrosTrabajo', {
    NumeroValidacion: parameter.NumeroValidacion,
    Licencia: parameter.Licencia,
    Codigo: parameter.Codigo,
    Descripcion: parameter.Descripcion
  })
}

function DropWorkStation (parameter) {
  return axios.post(datacontroller + 'bridgeContent/dropCentrosTrabajo', {
    IdCentroTrabajo: parameter.IdCentroTrabajo,
    NumeroValidacion: parameter.NumeroValidacion,
    Licencia: parameter.Licencia
  })
}
// eslint-disable-next-line standard/object-curly-even-spacing
export {UpdateCentrosTrabajo, AddCentrosTrabajo, DropWorkStation}

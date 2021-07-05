
import axios from 'axios'
import {datacontroller} from '../conn'

function GetCentroTrabajoFB (parameter) {
  return axios.post(datacontroller + 'bridgeContent/updateCentrosTrabajo', {
    IdCentroTrabajo: parameter.IdCentroTrabajo,
    NumeroValidacion: parameter.NumeroValidacion,
    Licencia: parameter.Licencia,
    Codigo: parameter.Codigo,
    Descripcion: parameter.Descripcion
  })
}

function AddVariablesFB (parameter) {
  return axios.post(datacontroller + 'bridgeContent/addVariablesFB', {
    NumeroValidacion: parameter.NumeroValidacion,
    Licencia: parameter.Licencia,
    IdFB: parameter.IdFB,
    StartPosition: parameter.StartPosition,
    IdCentroTrabajo: parameter.IdCentroTrabajo,
    IdDispositivo: parameter.IdDispositivo
  })
}

function GetVariablesFB (code, license, idcentrotrabajo) {
  return axios.post(datacontroller + 'bridgeContent/getCentroTrabajoFB', {
    Licencia: license,
    NumeroValidacion: code,
    IdCentroTrabajo: idcentrotrabajo
  })
}

function DeleteVariablesFB (parameter) {
  return axios.post(datacontroller + 'bridgeContent/deleteVariablesFB', {
    Licencia: parameter.Licencia,
    NumeroValidacion: parameter.NumeroValidacion,
    IdCentroTrabajo: parameter.IdCentroTrabajo,
    IdFB: parameter.IdFB
  })
}
// eslint-disable-next-line standard/object-curly-even-spacing
export {GetCentroTrabajoFB, AddVariablesFB, GetVariablesFB, DeleteVariablesFB}

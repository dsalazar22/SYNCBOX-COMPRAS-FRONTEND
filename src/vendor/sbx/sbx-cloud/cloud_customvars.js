import axios from 'axios'
import {datacontroller} from '../conn'

function GetCustomVariables (parameter) {
  return axios.get(datacontroller + 'bridgeContent/getCustomVariables', {
    NumeroValidacion: parameter.NumeroValidacion,
    Licencia: parameter.Licencia
  })
}

function AddCustomVariables (parameter) {
  return axios.post(datacontroller + 'bridgeContent/addCustomVariables', {
    NumeroValidacion: parameter.NumeroValidacion,
    Licencia: parameter.Licencia,
    IdCentroTrabajo: parameter.IdCentroTrabajo,
    IdDispositivo: parameter.IdDispositivo,
    IdTipoDato: parameter.IdTipoDato,
    NombreVariable: parameter.NombreVariable,
    AreaMemoria: parameter.AreaMemoria,
    ComandoLectura: parameter.ComandoLectura,
    ComandoEscritura: parameter.ComandoEscritura,
    ControlCritico: parameter.ControlCritico,
    timeseries:parameter.timeseries
  })
}

function UpdateCustomVariables (parameter) {
  return axios.post(datacontroller + 'bridgeContent/updateCustomVariables', {
    NumeroValidacion: parameter.NumeroValidacion,
    Licencia: parameter.Licencia,
    IdVariablesDispositivos: parameter.IdVariablesDispositivos,
    IdCentroTrabajo: parameter.IdCentroTrabajo,
    IdDispositivo: parameter.IdDispositivo,
    IdTipoDato: parameter.IdTipoDato,
    NombreVariable: parameter.NombreVariable,
    AreaMemoria: parameter.AreaMemoria,
    ComandoLectura: parameter.ComandoLectura,
    ComandoEscritura: parameter.ComandoEscritura,
    ControlCritico: parameter.ControlCritico,
    timeseries:parameter.timeseries
  })
}

function DeleteCustomVariables (parameter) {
  return axios.post(datacontroller + 'bridgeContent/deleteCustomVariables', {
    NumeroValidacion: parameter.NumeroValidacion,
    Licencia: parameter.Licencia,
    IdVariablesDispositivos: parameter.IdVariablesDispositivos
  })
}

export { GetCustomVariables, AddCustomVariables, UpdateCustomVariables, DeleteCustomVariables }

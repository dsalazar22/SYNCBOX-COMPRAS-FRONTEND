import axios from 'axios'
import {datacontroller} from '../conn'

function ObtenerDispositivos () {
  return axios.get(datacontroller + 'bridgeContent/obtenerDispositivos')
}

function AddDevices (parameter) {
  return axios.post(datacontroller + 'bridgeContent/addDevices', {
    Licencia: parameter.Licencia,
    NumeroValidacion: parameter.NumeroValidacion,
    IdTipoDispositivo: parameter.IdTipoDispositivo,
    Ubicacion: parameter.Ubicacion,
    CodigoDispositivo: parameter.CodigoDispositivo,
    IpDispositivo: parameter.IpDispositivo,
    Puerto: parameter.Puerto,
    Protocolo: parameter.Protocolo
  })
}

function UpdateDevices (parameter) {
  return axios.post(datacontroller + 'bridgeContent/updateDevices', {
    Licencia: parameter.Licencia,
    NumeroValidacion: parameter.NumeroValidacion,
    IdTipoDispositivo: parameter.IdTipoDispositivo,
    Ubicacion: parameter.Ubicacion,
    CodigoDispositivo: parameter.CodigoDispositivo,
    IpDispositivo: parameter.IpDispositivo,
    Puerto: parameter.Puerto,
    Protocolo: parameter.Protocolo,
    IdDispositivo: parameter.IdDispositivo
  })
}

function DropDevices (parameter) {
  return axios.post(datacontroller + 'bridgeContent/dropDevices', {
    Licencia: parameter.Licencia,
    NumeroValidacion: parameter.NumeroValidacion,
    IdDispositivo: parameter.IdDispositivo
  })
}

export { ObtenerDispositivos, AddDevices, UpdateDevices, DropDevices }

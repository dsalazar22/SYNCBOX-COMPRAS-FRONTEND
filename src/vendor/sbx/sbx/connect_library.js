import axios from 'axios'
import {datacontroller} from '../conn'

function ObtenerEstadoDispositivos () {
  return axios.get(datacontroller + 'obtenerEstadoDispositivos')
}

function ObtenerVariables () {
  return axios.get(datacontroller + 'obtenerVariables')
}

function ObtenerInfoServer () {
  return axios.get(datacontroller + 'getServerStatus')
}

function CheckServices () {
  return axios.get(datacontroller + 'getCheckServices')
}

function GetServiceStatus (service) {
  return axios.get(datacontroller + 'getStatusServices/' + service)
}

function ServiceAction (service, action) {
  return axios.get(datacontroller + 'serviceAction/' + service + '/' + action)
}

function RestartServer () {
  return axios.get(datacontroller + 'restartServer')
}

export { ObtenerEstadoDispositivos, ObtenerVariables, ObtenerInfoServer, CheckServices, GetServiceStatus, ServiceAction, RestartServer }

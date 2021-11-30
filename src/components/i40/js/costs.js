import axios from 'axios'
import {costs,wscosts} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infocosts = {
    tiposCuentas: function (info, action) {
        return axios.post(costs + 'tiposdecuentas/' + action, info, axiosConfig)
    },
    claseCC: function (info, action) {
        return axios.post(costs + 'clasecc/' + action, info, axiosConfig)
    },
    puc: function (info, action) {
        return axios.post(costs + 'puc/' + action, info, axiosConfig)
    },
    sf: function (info, action) {
        return axios.post(costs + 'sf/' + action, info, axiosConfig)
    },
    drivers: function (info, action) {
        return axios.post(costs + 'drivers/' + action, info, axiosConfig)
    },
    esquemaparticion: function (info, action) {
        return axios.post(costs + 'ps/' + action, info, axiosConfig)
    },
    centroscostos: function (info, action) {
        return axios.post(costs + 'cc/' + action, info, axiosConfig)
    },

    uploadFile: function (params, file) {
        const data = new FormData()
        data.append('file', file, file.name)
        return axios.post(costs + 'loadfile/'+params, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': JSON.parse(localStorage.getItem('syncbox.cloud')).token
            }
        })
    },

    ctrlpresupuesto: function (info, action) {
        return axios.post(costs + 'ctrlpresupuesto/' + action, info, axiosConfig)
    },

    ctrlpresupuestoproductos: function (info, action) {
        return axios.post(costs + 'ctrlpresupuestoproductos/' + action, info, axiosConfig)
    },

    getSubreparto: function () {
        return axios.get(costs + 'getsubrepartos', axiosConfig)
    },
    
    getroutesproblems: function () {
        return axios.get(costs + 'getroutesproblems', axiosConfig)
    },
    getCeCosPorActividad: function () {
        return axios.get(costs + 'getcecosactividad', axiosConfig)
    },

    workstationdrivers: function (action,info) {
        if(action == "get")
            return axios.get(costs + 'workstationdrivers/'+ info, axiosConfig)
        else {
            return axios.post(costs + 'workstationdrivers', info, axiosConfig)
        }
    },

    tworkstationdrivers: function (action,info) {
        // console.log(axiosConfig)
        if(action == "get")
            return axios.get(costs + 'tworkstationdrivers/'+ info, axiosConfig)
        else {
            return axios.post(costs + 'tworkstationdrivers', info, axiosConfig)
        }
    },

    getSubreparto: function () {
        return axios.get(costs + 'getsubrepartos', axiosConfig)
    },

    detalleproducto: function (code, quant) {
        return axios.get(costs + 'detalleproducto/'+code+'/'+quant, axiosConfig)
    },

    ejecutarLiquidacion: function () {
        return axios.post(costs + 'liquidarserpro', {}, axiosConfig)
    },

    costsrt: function(){
        return io(wscosts,  {transports: ["websocket"]});
    },

    delliquidarserpro: function (info) {
        return axios.post(costs + 'delliquidarserpro', info, axiosConfig)
    },

    selectedCode: function (code) {
        return axios.get(costs + 'selectedcode/'+code, axiosConfig)
    },

    detallecostoppto: function (code) {
        return axios.get(costs + 'calctotalppto/'+code, axiosConfig)
    },

    saveproductscode: function (info) {
        return axios.post(costs + 'saveproductscode', info, axiosConfig)
    },
}

export {
    infocosts
}
import axios from 'axios'
import {mainten} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var infomainten = {
  categories: function (info, actions) {
    return axios.post(mainten + 'categoriescontrol/' + actions, info, axiosConfig)
  },
  assets: function (info, actions) {
    return axios.post(mainten + 'assetscontrol/' + actions, info, axiosConfig)
  },
  
  assetsParts: function (info, actions) {
    return axios.post(mainten + 'assetspartscontrol/' + actions, info, axiosConfig)
  },
  
  durationProducts: function (info, actions) {
    return axios.post(mainten + 'durationsproducts/' + actions, info, axiosConfig)
  },

  plan: function (info, actions, detail) {
    return axios.post(mainten + 'plan/' + actions+'/'+detail, info, axiosConfig)
  },

  registroDatos: function (info, actions, codeDura,assets) {
    return axios.post(mainten + 'durationcontrol/' + actions+'/'+codeDura+'/'+assets, info, axiosConfig)
  },

  invLinea: function () {
    return axios.get(mainten + 'invlinea', axiosConfig)
  },


  loadoperators: function(event, info) {
    return axios.post(mainten + 'eventsoperators/'+event, info, axiosConfig)
  },

  getColorState(state){
      if(state == 'CR'){
          return 'default'
      }else if(state == 'CN'){
          return 'dark'
      }else if(state == 'AC'){
          return 'info'
      }else if(state == 'CE'){
        return 'secondary'
      }else if(state == 'FI'){
        return 'success'
      }else if(state == 'NA'){
          return 'danger'
      }else if(state == 'EO'){
        return 'warning'
    }else if(state == 'PV'){
      return 'warning'
  }
  },

  getTextState(state){
      if(state == 'CR'){
          return 'Creado'
      }else if(state == 'CN'){
          return 'Cancelado'
      }else if(state == 'AC'){
          return 'Activo'
      }else if(state == 'CE'){
          return 'Terminado'
      }else if(state == 'FI'){
        return 'Finalizado'
      }else if(state == 'NA'){
          return 'No Autorizado'
      }else if(state == 'EO'){
        return 'En Operacion'
    }else if(state == 'PV'){
      return 'Por Verificar'
  }
  },

  getPriority(state){
      if(state == 'alta'){
          return 'danger'
      }else if(state == 'media'){
          return 'warning'
      }else if(state == 'baja'){
          return 'info'
      }
  },


}

export {
  infomainten
}

import axios from 'axios'
import {xrundb} from './globals'
let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}

var inforundb = {
  getfiles: function (params) {
    let axconf = {
      headers: {
        'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
      }
    }
    return axios.get(xrundb + 'getfiles/' + params, axconf)
  },

  download: function (params) {
    let axconf = {
      headers: {
        'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
      }
    }
    const method = 'GET';
    const url = xrundb + 'downloadfile/' + params

    return axios.request({
        url,
        method,
        responseType: 'blob', //important
      })

     
    // return axios.get(xrundb + 'downloadfile/' + params, axconf, {
    //   responseType: 'blob',
    //   timeout: 30000,
    // })
  },

  downloadImgs: function (params, rstype) {
    let axconf = {
      headers: {
        'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
      }
    }
    const method = 'GET';
    const url = xrundb + 'downloadfile/' + params

    return axios.request({
        url,
        method,
        responseType: 'arraybuffer', //important
      })

     
    // return axios.get(xrundb + 'downloadfile/' + params, axconf, {
    //   responseType: 'blob',
    //   timeout: 30000,
    // })
  },

  downloadProfilePicture: function (params) {
    let axconf = {
      headers: {
        'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
      }
    }
    const method = 'GET';
    const url = xrundb + 'downloadprofilepicture/' + params

    return axios.request({
        url,
        method,
        responseType: 'arraybuffer', //important
      })

     
    // return axios.get(xrundb + 'downloadfile/' + params, axconf, {
    //   responseType: 'blob',
    //   timeout: 30000,
    // })
  },

  uploadImage: function (params, file) {
    const dataURLtoFile = (dataurl, filename) => {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n) {
        u8arr[n-1] = bstr.charCodeAt(n-1)
        n -= 1 // to make eslint happy
      }
      return new File([u8arr], filename, { type: mime })
    }

    const filePP = dataURLtoFile(file.dataUrl)
  // put file into form data
  const data = new FormData()
  data.append('file', filePP, file.info.name)

    return axios.post(xrundb + 'upload/'+params, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
      }
  })

     
    // return axios.get(xrundb + 'downloadfile/' + params, axconf, {
    //   responseType: 'blob',
    //   timeout: 30000,
    // })
  },

  uploadFile: function (params, file) {
    const data = new FormData()
    data.append('file', file, file.name)

      return axios.post(xrundb + 'upload/'+params, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
        }
    })
  },

  gethost:function(){
      return xrundb
  }
}

export {
    inforundb
}

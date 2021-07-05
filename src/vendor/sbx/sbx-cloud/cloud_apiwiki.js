import axios from 'axios'

let version = 1

let axiosConfig = {
  headers: {
    'Authorization': localStorage.getItem('syncbox.cloud') == null ? '' : JSON.parse(localStorage.getItem('syncbox.cloud')).token
  }
}
function ApiWikiHelp (version, opcion) {
  // console.log('https://apiwiki.syncbox.cloud/help/' + version + '/' + opcion)
  return axios.get('https://apiwiki.syncbox.cloud/help/' + version + '/' + opcion, axiosConfig)
}

export { version, ApiWikiHelp }

/* eslint no-trailing-spaces: "error" */
import axios from 'axios'
// import {users, company_code} from './globals'
import { InfoConfig,protocolo } from '@/vendor/sbx/conn';
let host =  InfoConfig.host()
// let host = '192.168.115.48'
let axiosConfig = {
    headers: {
        'Authorization': JSON.parse(localStorage.getItem('syncbox.cloud')) == null ? null : JSON.parse(localStorage.getItem('syncbox.cloud')).token
    }
}

var infousers = {
    getnumber() {
        return axios.get(protocolo+"://" + host + "/accountgetalllocaluserspercompany", axiosConfig)
    },
    getinfouser(users_dest) {
        return axios.get(protocolo+"://" + host + "/accountgetlocaluserinfo/users" + "/" + users_dest, axiosConfig)
    },
    updateinfousers(info) {
        return axios.post(protocolo+"://" + host + "/accountupdatelocalusercomplete", info, axiosConfig)
    },
    newlocaluser(info) {
        return axios.post(protocolo+"://" + host + "/accountnewlocaluser", info, axiosConfig)
    },
    resetpassword(info) {
        return axios.post(protocolo+"://" + host + "/accountresetpassword", info, axiosConfig)
    },
    deactivated(info) {
        return axios.post(protocolo+"://" + host + "/accountdeactivate", info, axiosConfig)
    },
    // getnumber(company_code) {
    //     return axios.get("https://account.syncbox.cloud/getalluserspercompany/"+company_code, axiosConfig)
    // },
    // getinfouser(users_dest, company_code) {
    //     return axios.get("https://account.syncbox.cloud/getuserinfo/users/" + company_code + "/" + users_dest, axiosConfig)
    // },
    // updateinfousers(info, company_code) {
    //     return axios.post("https://account.syncbox.cloud/updateusercomplete/" + company_code, info, axiosConfig)
    // },
    // newlocaluser(info, company_code) {
    //     return axios.post("https://account.syncbox.cloud/newlocaluser/" + company_code, info, axiosConfig)
    // },
    // resetpassword(info) {
    //     return axios.post("https://account.syncbox.cloud/resetpassword", info, axiosConfig)
    // },

    check_access(control, action) {
        try {
            let dato_access = JSON.parse(JSON.parse(localStorage.getItem('syncbox.cloud')).access)[control]

            if (action == 'r') {
                return dato_access[0] == "1"
            } else if (action == 'w') {
                return dato_access[1] == "1"
            } else if (action == 'c') {
                return dato_access[2] == "1"
            } else if (action == 'd') {
                return dato_access[3] == "1"
            }
        } catch (ex) {
            return false
        }

    }
}

export {
    infousers
}
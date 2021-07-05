
import axios from 'axios'
import {apiconnection} from '../conn'

function NewProduct (product) {
  return axios.post(apiconnection + 'newProduct', {
    code: product.code,
    description: product.description
  })
}

function UpdateProduct (product) {
  return axios.post(apiconnection + 'updateProduct', {
    code: product.code,
    description: product.description
  })
}

function DeleteProduct (code) {
  return axios.get(apiconnection + 'deleteProduct/' + code)
}

function GetActiveProducts () {
  return axios.get(apiconnection + 'getProduct')
}
// eslint-disable-next-line standard/object-curly-even-spacing
export {NewProduct, UpdateProduct, GetActiveProducts, DeleteProduct}

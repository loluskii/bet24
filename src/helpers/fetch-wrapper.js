import CryptoJS from 'crypto-js'
import { useAuthStore } from '@/stores'
import { CLIENT_ID, APP_KEY } from './constants'
import moment from 'moment'
import Cookies from 'js-cookie'

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
  patch: request('PATCH')
}

function aesEncrypt() {
  try {
    // Get the current timestamp as a string: this will be the encryption data
    const timestamp = moment().unix().toString()

    // console.log('timestamp is', timestamp);
    // Generate a random IV (128-bit)
    const iv = CryptoJS.lib.WordArray.random(16)

    const hexKey = generateApiKey()
    // Convert the hex key to a WordArray
    const key = CryptoJS.enc.Hex.parse(hexKey)

    // Encrypt the timestamp using AES with the key and IV
    const encrypted = CryptoJS.AES.encrypt(timestamp, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    // Combine IV and ciphertext in hex format
    const ivHex = iv.toString(CryptoJS.enc.Hex)
    const ciphertextHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex)

    const signature = ivHex + ciphertextHex
    // console.log('signature',signature);
    return signature
  } catch (error) {
    console.error('Encryption failed:', error)
    throw new Error('Encryption failed')
  }
}

function generateApiKey() {
  const key = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(`${CLIENT_ID}:${APP_KEY}`))
  // console.log('api key', key);
  return key
}

function request(method) {
  return (url, body, { credentials } = {}) => {
    const requestOptions = {
      method: method,
      headers: authHeader()
    }
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(body)
    }
    if (credentials) {
      requestOptions.credentials = credentials
    }
    return fetch(url, requestOptions).then(handleResponse)
  }
}

function publicRequest(method) {
  return (url, body) => {
    const requestOptions = {
      method: method,
      headers: { Accept: 'application/json' }
    }
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(body)
    }
    return fetch(url, requestOptions).then(handleResponse)
  }
}

function authHeader() {
  const headers = {
    'SBE-Client-ID': CLIENT_ID,
    'SBE-API-KEY': generateApiKey(),
    'SBE-API-SIGNATURE': aesEncrypt()
  }
  // return auth header with jwt if user is logged in and request is to the api url
  const { isAuthenticated } = useAuthStore()
  const token = Cookies.get('SBE-TOKEN')
  if (isAuthenticated && token) {
    // if it's not authenticated also (i.e. token is null), a 401 is fine
    return { ...headers, Authorization: `Bearer ${token}` }
  } else {
    return headers
  }
}

async function handleResponse(response) {
  const isJson = response.headers?.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  // check for error response
  if (!response.ok) {
    const authStore = useAuthStore()
    if ([401, 403].includes(response.status) && authStore.isAuthenticated) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      await authStore.logout()
      return
    }

    // get error message from body or default to response status
    const error = data ? (data.message ? data.message : JSON.stringify(data)) : response.status
    return Promise.reject(error)
  }

  return {
    data,
    status: response.status
  }
}

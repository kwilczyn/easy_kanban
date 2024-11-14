import axios from 'axios'

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient

export function validateParams(params) {
  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      throw new Error(`Parametr "${key}" is required.`)
    }
  }
}

import CryptoJS from 'crypto-js'

export const encryptPassword = (password: string) => {
  return CryptoJS.SHA256(password).toString()
}

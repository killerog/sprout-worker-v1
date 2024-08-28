const ENCRYPTION_PASS = "[ENCRYPTION_PASS]"
const password = ENCRYPTION_PASS;
var sjcl = require('./node_modules/sjcl/sjcl.js');

export function encryptAndEncode(data) {
  const encrypted = sjcl.encrypt(password, data);
  const encoded = btoa(encrypted);
  return encoded;
}
  
export function decodeAndDecrypt(data) {
  const decoded = atob(data);
  const decrypted = sjcl.decrypt(password, decoded);
  return decrypted;
}
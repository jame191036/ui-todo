import CryptoJS from "crypto-js";

const SECRET_KEY = "secretKey";

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
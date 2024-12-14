import CryptoJS from "crypto-js";
import { SECRETE_KEY } from "../config/globalKey.js";
export const Encrypt = async (data) => {
  return CryptoJS.AES.encrypt(data, SECRETE_KEY).toString();
  // ແມ່ນການເຂົ້າລະຫັດ
};
export const Decrypt = async (data) => {
  return CryptoJS.AES.decrypt(data.SECRETE_KEY).toString(CryptoJS.enc.Utf8);
  // ແມ່ນການຖອດລະຫັດ
};

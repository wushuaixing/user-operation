import CryptoJS from 'crypto-js';

/**
 * 加密字符串
 * @param str
 * @returns {PromiseLike<ArrayBuffer>}
 */
const rsaEncrypt = (str) => {
  const key = CryptoJS.enc.Utf8.parse('7821A8F87E95ACDB');
  const encrypted = CryptoJS.AES.encrypt(str, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};
/**
 * 加密password字段
 * @param info
 * @returns {{password: (PromiseLike<ArrayBuffer>|string)}}
 */
export const encryptInfo = (info = {}) => ({
  ...info,
  password: info.password ? rsaEncrypt(info.password) : '',
  name: info.name ? info.name.trim() : '',
});

// 修改密码加密
export const encryptEditPwd = (info = {}) => ({
  ...info,
  oldPassword: info.oldPassword ? rsaEncrypt(info.oldPassword) : '',
  newPassword: info.newPassword ? rsaEncrypt(info.newPassword) : '',
  confirmPassword: info.confirmPassword
    ? rsaEncrypt(info.confirmPassword)
    : '',
});

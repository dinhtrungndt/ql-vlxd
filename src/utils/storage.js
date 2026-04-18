import CryptoJS from 'crypto-js';
import config from '../config';

const SECRET = config.SECRET_KEY;
const KEY = config.STORAGE_KEY;

// Mã hóa và lưu session
export const saveSession = (data) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString();
    localStorage.setItem(KEY, encrypted);
  } catch (err) {
    console.error('[Storage] Save error:', err);
  }
};

// Đọc và giải mã session
export const loadSession = () => {
  try {
    const encrypted = localStorage.getItem(KEY);
    if (!encrypted) return null;
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null;
    return JSON.parse(decrypted);
  } catch (err) {
    console.error('[Storage] Load error:', err);
    clearSession();
    return null;
  }
};

// Xóa session
export const clearSession = () => {
  localStorage.removeItem(KEY);
};

// Format tiền tệ VND
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format số lượng
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('vi-VN').format(num);
};

// Format ngày giờ
export const formatDate = (dateStr, withTime = false) => {
  if (!dateStr) return '---';
  const date = new Date(dateStr);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  if (withTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return new Intl.DateTimeFormat('vi-VN', options).format(date);
};

// Format ngày để nhập vào input[type=date]
export const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

// Format kích thước file
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

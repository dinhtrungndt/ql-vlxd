// Tên role hiển thị
export const getRoleName = (role) => {
  const names = {
    admin: 'Giám Đốc',
    manager: 'Quản Lý Kho',
    staff: 'Thủ Kho / Nhân Viên',
  };
  return names[role] || role;
};

// Class màu badge role
export const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'badge-red',
    manager: 'badge-blue',
    staff: 'badge-green',
  };
  return classes[role] || 'badge-gray';
};

// Tên loại giao dịch kho
export const getTransactionTypeName = (type) => {
  const names = {
    import: 'Nhập Kho',
    export: 'Xuất Kho',
    adjust: 'Điều Chỉnh',
  };
  return names[type] || type;
};

// Class màu giao dịch
export const getTransactionTypeClass = (type) => {
  if (type === 'import') return 'text-emerald-400';
  if (type === 'export') return 'text-red-400';
  return 'text-blue-400';
};

// Tên lý do giao dịch
export const getReasonName = (reason) => {
  const names = {
    purchase: 'Nhập mua hàng',
    usage: 'Xuất sử dụng / thi công',
    adjustment: 'Điều chỉnh tồn kho',
    damage: 'Hư hỏng / Hủy hàng',
  };
  return names[reason] || reason;
};

// Tên danh mục chi phí
export const getExpenseCategoryName = (category) => {
  const names = {
    nhap_hang: 'Nhập Hàng',
    van_chuyen: 'Vận Chuyển',
    nhan_cong: 'Nhân Công',
    dien_nuoc: 'Điện Nước',
    khac: 'Khác',
  };
  return names[category] || category;
};

// Danh sách danh mục chi phí
export const EXPENSE_CATEGORIES = [
  { value: 'nhap_hang', label: 'Nhập Hàng' },
  { value: 'van_chuyen', label: 'Vận Chuyển' },
  { value: 'nhan_cong', label: 'Nhân Công' },
  { value: 'dien_nuoc', label: 'Điện Nước' },
  { value: 'khac', label: 'Khác' },
];

// Kiểm tra quyền
export const canAccess = (userRole, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(userRole);
};

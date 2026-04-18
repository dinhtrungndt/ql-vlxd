import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="mb-6 text-slate-300">{message}</div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm} disabled={loading}>
          {loading ? 'Đang xử lý...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

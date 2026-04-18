import { PhotoIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { createProductAction, updateProductAction } from '../../stores/redux/actions/productActions';

const ProductFormModal = ({ isOpen, onClose, product = null }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sub_category: '',
    unit: 'Cái',
    import_price: '',
    stock: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name || '',
          category: product.category || '',
          sub_category: product.sub_category || '',
          unit: product.unit || 'Cái',
          import_price: product.import_price || '',
          stock: product.stock || 0,
          description: product.description || '',
        });
        setImagePreview(product.image || '');
        setImageFile(null);
      } else {
        setFormData({
          name: '',
          category: '',
          sub_category: '',
          unit: 'Cái',
          import_price: '',
          stock: 0,
          description: '',
        });
        setImagePreview('');
        setImageFile(null);
      }
    }
  }, [isOpen, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    if (imageFile) {
      form.append('image_file', imageFile);
    }

    let result;
    if (product) {
      result = await dispatch(updateProductAction(product.id, form));
    } else {
      result = await dispatch(createProductAction(form));
    }

    setLoading(false);
    if (result && result.success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Cập nhật Vật tư' : 'Thêm mới Vật tư'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên vật tư *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="VD: Xi măng Hà Tiên 1"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Danh mục *"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="VD: Xi măng"
          />
          <Input
            label="Danh mục con"
            name="sub_category"
            value={formData.sub_category}
            onChange={handleChange}
            placeholder="Có thể bỏ trống"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Đơn vị tính *"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            placeholder="VD: Bao, Khối, Kg"
          />
          <Input
            label="Giá nhập (VNĐ) *"
            name="import_price"
            type="number"
            min="0"
            value={formData.import_price}
            onChange={handleChange}
            required
          />
        </div>

        {!product && (
          <Input
            label="Tồn kho ban đầu"
            name="stock"
            type="number"
            min="0"
            step="any"
            value={formData.stock}
            onChange={handleChange}
            helperText="Nhập tồn kho nếu đang có sẵn hàng"
          />
        )}

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Hình ảnh sản phẩm
          </label>
          <div className="mt-1 flex items-center gap-4">
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-600 bg-slate-800">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <PhotoIcon className="h-8 w-8 text-slate-500" />
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-blue-600/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-400 hover:file:bg-blue-600/30"
              />
              <p className="mt-2 text-xs text-slate-500">
                Chỉ chấp nhận file ảnh. Kích thước tối đa 5MB.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Mô tả thêm
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
            placeholder="Thông số, quy cách..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu lại'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;

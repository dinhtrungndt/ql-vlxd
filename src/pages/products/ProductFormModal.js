import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
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
      title={product ? 'Cập Nhật Thông Tin Vật Tư' : 'Khai Báo Vật Tư Mới'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image and Basic Info */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-widest">
                Hình ảnh vật tư
              </label>
              <div className="relative group">
                <div className={`aspect-square w-full rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden bg-slate-800/50 ${
                  imagePreview ? 'border-blue-500/50' : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800'
                }`}>
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button" 
                          onClick={removeImage}
                          className="p-2 bg-red-500 rounded-full text-white transform hover:scale-110 transition-transform"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-blue-400">
                      <PhotoIcon className="h-10 w-10" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Chọn ảnh</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {!imagePreview && (
                  <p className="mt-2 text-center text-[10px] text-slate-500 italic">
                    JPG, PNG tối đa 5MB
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl bg-slate-900/30 p-4 border border-slate-800">
              <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Phân loại hàng</h5>
              <Input
                label="Danh mục nội bộ *"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="VD: Xi măng, Gạch..."
                className="mb-0"
              />
              <Input
                label="Nhóm chi tiết"
                name="sub_category"
                value={formData.sub_category}
                onChange={handleChange}
                placeholder="VD: Hà Tiên, Đồng Tâm..."
                className="mb-0"
              />
            </div>
          </div>

          {/* Right Column: Detailed Info and Pricing */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest border-b border-slate-800 pb-2">Thông tin định danh</h5>
              <Input
                label="Tên gọi chính xác của vật tư/hàng hóa *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nhập tên vật tư đầy đủ quy cách..."
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Đơn vị tính *"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  placeholder="Bao, Khối, m2..."
                />
                <Input
                  label="Giá nhập dự kiến (VNĐ) *"
                  name="import_price"
                  type="number"
                  min="0"
                  value={formData.import_price}
                  onChange={handleChange}
                  required
                  placeholder="0.000"
                />
              </div>

              {!product && (
                <div className="p-4 rounded-xl bg-amber-600/5 border border-amber-500/20">
                  <Input
                    label="Tồn kho khởi tạo hệ thống"
                    name="stock"
                    type="number"
                    min="0"
                    step="any"
                    value={formData.stock}
                    onChange={handleChange}
                    helperText="Chỉ nhập khi lần đầu khai báo có sẵn hàng thực tế"
                    className="mb-0"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest border-b border-slate-800 pb-2">Mô tả đặc tính kĩ thuật</h5>
              <div className="group">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800/30 p-4 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  rows={4}
                  placeholder="Thông số kĩ thuật, quy cách đóng gói, lưu ý bảo quản..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-800">
          <p className="mr-auto text-[10px] text-slate-500 italic">Dấu (*) là các trường bắt buộc phải nhập</p>
          <Button variant="ghost" onClick={onClose} disabled={loading} className="text-slate-400 hover:text-white px-6">
            Hủy bỏ
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
            className="px-10 shadow-lg shadow-blue-500/20"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Đang xử lý...</span>
              </div>
            ) : (
              <span>Xác nhận lưu thông tin</span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;

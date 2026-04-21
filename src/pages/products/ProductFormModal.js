import { ArrowPathIcon, CameraIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { createCategoryAction, createProductAction, getCategoriesAction, updateProductAction } from '../../stores/redux/actions/productActions';

const ProductFormModal = ({ isOpen, onClose, product = null }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.product);

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    sub_category: '',
    unit: 'Cái',
    import_price: '',
    stock: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(getCategoriesAction());
      if (product) {
        setFormData({
          name: product.name || '',
          category_id: product.category_id || '',
          sub_category: product.sub_category || '',
          unit: product.unit || 'Cái',
          import_price: product.import_price || '',
          stock: product.stock || 0,
          description: product.description || '',
        });
        setImagePreview(product.image || '');
        setImageFile(null);
        setIsNewCategory(false);
        setNewCategoryName('');
      } else {
        setFormData({
          name: '',
          category_id: '',
          sub_category: '',
          unit: 'Cái',
          import_price: '',
          stock: 0,
          description: '',
        });
        setImagePreview('');
        setImageFile(null);
        setIsNewCategory(false);
        setNewCategoryName('');
      }
    }
  }, [isOpen, product, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      stopCamera();
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `captured_image_${Date.now()}.jpg`, { type: 'image/jpeg' });
          setImageFile(file);
          setImagePreview(URL.createObjectURL(blob));
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalCategoryId = formData.category_id;

    if (isNewCategory && newCategoryName.trim()) {
      const resCat = await dispatch(createCategoryAction(newCategoryName));
      if (resCat && resCat.success) {
        finalCategoryId = resCat.data.id;
      } else {
        setLoading(false);
        return;
      }
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== 'category_id') {
        form.append(key, formData[key]);
      }
    });

    if (finalCategoryId) {
      form.append('category_id', finalCategoryId);
    }

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
          <div className="lg:col-span-4 space-y-6">
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-widest">
                Hình ảnh vật tư
              </label>
              <div className="relative group">
                <div className={`aspect-square w-full rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden bg-slate-800/50 ${imagePreview || isCameraActive ? 'border-blue-500/50' : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800'
                  }`}>
                  {isCameraActive ? (
                    <div className="relative h-full w-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="bg-blue-500 p-3 rounded-full text-white shadow-lg hover:bg-blue-600 transition-colors"
                        >
                          <CameraIcon className="h-6 w-6" />
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="bg-slate-700 p-3 rounded-full text-white shadow-lg hover:bg-slate-600 transition-colors"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  ) : imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                          type="button"
                          onClick={removeImage}
                          className="p-2 bg-red-500 rounded-full text-white transform hover:scale-110 transition-transform"
                          title="Xóa ảnh"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={startCamera}
                          className="p-2 bg-emerald-500 rounded-full text-white transform hover:scale-110 transition-transform"
                          title="Chụp lại"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors relative">
                          <PhotoIcon className="h-10 w-10" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Chọn ảnh</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        <div className="w-px h-12 bg-slate-700"></div>
                        <button
                          type="button"
                          onClick={startCamera}
                          className="flex flex-col items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors"
                        >
                          <CameraIcon className="h-10 w-10" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Chụp ảnh</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
                {!imagePreview && !isCameraActive && (
                  <p className="mt-2 text-center text-[10px] text-slate-500 italic">
                    Tải lên hoặc chụp trực tiếp
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl bg-slate-900/30 p-4 border border-slate-800">
              <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Phân loại hàng</h5>

              {isNewCategory ? (
                <div className="space-y-1">
                  <Input
                    label="Danh mục nội bộ mới *"
                    name="newCategoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                    placeholder="Nhập tên danh mục..."
                    className="mb-0"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewCategory(false);
                      setNewCategoryName('');
                    }}
                    className="text-[10px] font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-wider"
                  >
                    ← Chọn từ danh sách
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Danh mục nội bộ *</label>
                  <div className="relative group">
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsNewCategory(true);
                          setFormData(prev => ({ ...prev, category_id: '' }));
                        } else {
                          handleChange(e);
                        }
                      }}
                      required
                      className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3.5 text-sm text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 hover:bg-slate-800"
                    >
                      <option value="" disabled className="bg-slate-800 text-slate-400">-- Chọn danh mục --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-slate-800">{cat.name}</option>
                      ))}
                      <option value="__NEW__" className="bg-slate-900 text-emerald-400 font-bold">+ Thêm danh mục mới...</option>
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-400 transition-colors">
                      ▼
                    </div>
                  </div>
                </div>
              )}

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

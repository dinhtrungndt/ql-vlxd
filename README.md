# Quản Lý Kho VLXD

Ứng dụng web quản lý kho vật liệu xây dựng cho Công Ty VLXD DVN. Hệ thống hỗ trợ quản lý danh mục vật tư, nhập - xuất - điều chỉnh tồn kho, theo dõi lịch sử giao dịch, quản lý chi phí, báo cáo tổng hợp và quản trị người dùng theo vai trò.

Đây là **frontend** được xây dựng bằng React. Ứng dụng giao tiếp với backend thông qua REST API và được thiết kế để chạy phía sau Nginx khi triển khai production.

## Mục lục

- [Tính năng](#tính-năng)
- [Phân quyền](#phân-quyền)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Cài đặt và chạy local](#cài-đặt-và-chạy-local)
- [Biến môi trường](#biến-môi-trường)
- [Các lệnh thường dùng](#các-lệnh-thường-dùng)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Build và triển khai production](#build-và-triển-khai-production)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Luồng dữ liệu và tích hợp API](#luồng-dữ-liệu-và-tích-hợp-api)
- [Kiểm thử](#kiểm-thử)
- [Xử lý lỗi thường gặp](#xử-lý-lỗi-thường-gặp)
- [Lưu ý bảo mật](#lưu-ý-bảo-mật)

## Tính năng

### Xác thực và hồ sơ

- Đăng nhập bằng tên đăng nhập hoặc email.
- Duy trì phiên đăng nhập bằng token.
- Tự động kiểm tra phiên hiện tại khi tải lại trang.
- Tự động đăng xuất và chuyển về trang đăng nhập khi token hết hạn.
- Xem và cập nhật hồ sơ cá nhân: họ tên, số điện thoại và mật khẩu.
- Hiển thị thông báo thành công/lỗi trực tiếp trên giao diện.

### Tổng quan dashboard

Dashboard dành cho quản lý và admin, cung cấp:

- Tổng giá trị tồn kho.
- Số lượt xuất kho trong 30 ngày.
- Tổng chi phí trong 30 ngày.
- Biểu đồ giá trị tồn kho theo danh mục.
- Top 5 vật tư xuất nhiều nhất.
- Thống kê trạng thái kho.
- Các lối tắt tới nghiệp vụ kho, vật tư và báo cáo.

### Danh mục vật tư

- Xem danh sách vật tư và tìm kiếm nhanh theo tên.
- Xem chi tiết vật tư.
- Thêm vật tư mới với:
  - Danh mục và nhóm chi tiết.
  - Tên vật tư, quy cách.
  - Đơn vị tính.
  - Giá nhập dự kiến.
  - Tồn kho khởi tạo.
  - Hình ảnh và thông số kỹ thuật.
- Cập nhật thông tin vật tư.
- Ẩn vật tư không còn sử dụng và khôi phục vật tư đã ẩn.
- Quản lý danh mục nội bộ: thêm, đổi tên và xóa.
- Theo dõi số lượng tồn và giá trị tồn theo giá nhập.

### Quản lý kho

#### Nhập kho

- Chọn vật tư và nhập số lượng.
- Ghi chú thông tin lô hàng, số xe, chứng từ hoặc nhà cung cấp.
- Cập nhật số lượng tồn sau khi giao dịch thành công.

#### Xuất kho

- Xuất vật tư cho thi công/sử dụng hoặc các lý do khác.
- Hỗ trợ ghi nhận hàng hỏng, hủy hàng.
- Kiểm tra số lượng tồn trước khi xuất.
- Hiển thị tồn kho dự kiến sau giao dịch.

#### Điều chỉnh và kiểm kê

- Điều chỉnh tồn kho theo số lượng thực tế kiểm đếm.
- Ghi nhận lý do như kiểm kê định kỳ, hàng hỏng/mất mát hoặc bổ sung hóa đơn thiếu.
- Dùng để đồng bộ số liệu trên hệ thống với số lượng thực tế tại kho.

### Lịch sử giao dịch

- Xem toàn bộ lịch sử nhập, xuất và điều chỉnh.
- Lọc theo vật tư.
- Thống kê số phiếu nhập và xuất.
- Xem chi tiết từng giao dịch, số lượng, loại giao dịch và ghi chú.
- Xuất dữ liệu giao dịch ra CSV.
- Xem trước và in phiếu giao dịch.

### Quản lý chi phí

Dành cho quản lý và admin:

- Khai báo khoản chi mới.
- Nhập tiêu đề/mục đích, số tiền, nhóm chi phí và mô tả.
- Cập nhật khoản chi.
- Xem chi tiết giao dịch chi phí.
- Ẩn khoản chi không muốn hiển thị trong danh sách chính.
- Khôi phục khoản chi đã ẩn.
- Xem riêng danh sách khoản chi đã ẩn.

### Báo cáo tồn kho

Dành cho quản lý và admin:

- Lọc báo cáo theo danh mục.
- Tổng số mã vật tư.
- Tổng trị giá kho hiện thời.
- Danh sách vật tư sắp hết.
- Danh sách vật tư đã hết hàng.
- Biểu đồ cơ cấu giá trị tồn kho.
- Biểu đồ mật độ mã vật tư.
- Làm mới dữ liệu báo cáo.

### Quản lý nhân sự

Dành cho quản lý và admin theo giới hạn quyền:

- Xem danh sách nhân sự.
- Cấp tài khoản nhân viên mới.
- Cập nhật hồ sơ nhân sự.
- Khóa/mở khóa tài khoản.
- Gán vai trò phù hợp với quyền của người thao tác.
- Theo dõi tổng số nhân sự, vai trò và trạng thái hoạt động.

## Phân quyền

| Chức năng | Nhân viên / Thủ kho (`staff`) | Quản lý (`manager`) | Admin (`admin`) |
|---|:---:|:---:|:---:|
| Đăng nhập, xem hồ sơ cá nhân | Có | Có | Có |
| Xem danh mục vật tư | Có | Có | Có |
| Thêm/sửa/ẩn/khôi phục vật tư | Không | Có | Có |
| Quản lý danh mục vật tư | Không | Có | Có |
| Nhập kho, xuất kho | Có | Có | Có |
| Điều chỉnh tồn kho/kiểm kê | Theo chính sách backend | Có | Có |
| Xem lịch sử giao dịch | Có | Có | Có |
| In phiếu và xuất CSV | Có | Có | Có |
| Dashboard | Không | Có | Có |
| Quản lý chi phí | Không | Có | Có |
| Xem báo cáo | Không | Có | Có |
| Quản lý nhân sự | Không | Có giới hạn | Toàn quyền |
| Gán vai trò `manager`/`admin` | Không | Không | Có |
| Khóa/mở khóa tài khoản | Không | Theo chính sách backend | Có |

> Quyền được kiểm tra ở cả giao diện và backend. Việc ẩn nút trên giao diện không thay thế cho kiểm tra phân quyền ở API.

## Công nghệ sử dụng

- **React 19** và **React Router**: xây dựng giao diện và điều hướng.
- **Redux, React Redux, Redux Thunk**: quản lý state và xử lý action bất đồng bộ.
- **Axios**: gọi REST API, gắn token và xử lý lỗi tập trung.
- **Tailwind CSS**: thiết kế giao diện.
- **Recharts**: biểu đồ dashboard và báo cáo.
- **React Hot Toast**: thông báo thao tác.
- **Heroicons**: biểu tượng giao diện.
- **CryptoJS**: mã hóa session lưu trong trình duyệt.
- **Create React App / react-scripts**: development server, test và production build.
- **Nginx**: web server được cấu hình mẫu cho production.

## Yêu cầu môi trường

- Node.js phiên bản LTS hiện hành.
- npm đi kèm Node.js.
- Backend của hệ thống đang chạy và có thể truy cập từ frontend.
- Trình duyệt hiện đại: Chrome, Firefox hoặc Safari.

Kiểm tra phiên bản:

```bash
node --version
npm --version
```

## Cài đặt và chạy local

### 1. Lấy mã nguồn

```bash
git clone <url-repository>
cd ql-vlxd
```

### 2. Cài dependency

```bash
npm install
```

`package-lock.json` được dùng để khóa phiên bản dependency. Khi cài trên CI hoặc server có thể dùng:

```bash
npm ci
```

### 3. Tạo file cấu hình môi trường

Tạo file `.env` ở thư mục gốc:

```env
REACT_APP_API_URL=http://localhost:7111
REACT_APP_SECRET_KEY=thay-bang-chuoi-bi-mat-cua-moi-truong
```

`REACT_APP_API_URL` là địa chỉ gốc của backend. Frontend gọi API dưới tiền tố `/api/v1`, ví dụ:

```text
http://localhost:7111/api/v1/auth/login
```

### 4. Khởi động ứng dụng

```bash
npm start
```

Mở [http://localhost:3000](http://localhost:3000). Khi chỉnh sửa mã nguồn, trình duyệt sẽ tự động tải lại.

## Biến môi trường

| Biến | Bắt buộc | Mô tả | Ví dụ |
|---|:---:|---|---|
| `REACT_APP_API_URL` | Có | URL gốc của backend, không bao gồm `/api/v1` | `http://localhost:7111` |
| `REACT_APP_SECRET_KEY` | Có | Khóa dùng để mã hóa session trong localStorage | Chuỗi bí mật riêng của môi trường |
| `ENABLE_OBFUSCATION` | Không | Bật làm rối JavaScript sau build khi đặt bằng `true` | `true` |

Create React App nhúng các biến `REACT_APP_*` vào bundle lúc build. Không đặt mật khẩu database, private key hoặc secret backend vào các biến này.

## Các lệnh thường dùng

| Lệnh | Mục đích |
|---|---|
| `npm start` | Chạy development server tại cổng 3000 |
| `npm test` | Chạy test bằng Jest/React Testing Library |
| `npm run build` | Build production vào thư mục `build` |
| `npm run eject` | Tách cấu hình Create React App; thao tác một chiều, không nên dùng nếu chưa cần |

Build production mặc định tắt source map thông qua `GENERATE_SOURCEMAP=false`. Script `postbuild` sẽ bỏ qua obfuscation nếu chưa đặt `ENABLE_OBFUSCATION=true`.

## Hướng dẫn sử dụng

### Đăng nhập

1. Mở `/login`.
2. Nhập tên đăng nhập hoặc email và mật khẩu.
3. Chọn **Đăng nhập**.
4. Nếu tài khoản hợp lệ, hệ thống tải thông tin người dùng và điều hướng đến màn hình phù hợp.

### Thực hiện nhập/xuất kho

1. Vào **Quản lý kho** → **Thực hiện giao dịch**.
2. Chọn loại giao dịch: **Nhập kho**, **Xuất kho** hoặc **Điều chỉnh**.
3. Chọn vật tư, nhập số lượng và lý do tương ứng.
4. Bổ sung ghi chú nếu cần.
5. Kiểm tra tồn dự kiến rồi xác nhận.
6. Vào **Lịch sử giao dịch** để kiểm tra hoặc in phiếu.

### Quản lý vật tư

1. Vào **Danh mục vật tư**.
2. Dùng ô tìm kiếm để tìm vật tư.
3. Chọn **Thêm vật tư** để khai báo mới hoặc chọn một dòng để sửa/xem chi tiết.
4. Để ngừng sử dụng, chọn ẩn vật tư. Vật tư đã ẩn có thể được khôi phục từ danh sách tương ứng.

### Khai báo chi phí

1. Vào **Chi phí**.
2. Chọn **Khai báo khoản chi mới**.
3. Nhập mục đích, số tiền, nhóm chi phí và mô tả.
4. Lưu biểu mẫu, sau đó có thể sửa, xem chi tiết hoặc ẩn khoản chi.

### Xem báo cáo

1. Vào **Báo cáo**.
2. Chọn danh mục nếu muốn giới hạn phạm vi.
3. Đọc các chỉ số tổng hợp và biểu đồ.
4. Chọn làm mới khi cần tải lại dữ liệu từ backend.

### Quản lý người dùng

1. Vào **Quản lý nhân sự**.
2. Tạo hoặc cập nhật tài khoản theo đúng vai trò.
3. Dùng khóa/mở khóa khi cần ngăn hoặc cho phép đăng nhập.
4. Chỉ admin được cấp các vai trò quản lý và admin.

## Build và triển khai production

### Build thủ công

Thiết lập biến môi trường production rồi chạy:

```bash
npm ci
npm run build
```

Kết quả nằm trong thư mục `build/`. Có thể phục vụ thư mục này bằng Nginx, Apache, CDN hoặc dịch vụ static hosting.

### Bật obfuscation tùy chọn

Script hiện tại chỉ gọi `javascript-obfuscator` khi biến môi trường được bật:

```bash
set ENABLE_OBFUSCATION=true
npm run build
```

Trên Linux/macOS:

```bash
ENABLE_OBFUSCATION=true npm run build
```

Chỉ bật khi dependency `javascript-obfuscator` đã được cài trong môi trường build. Obfuscation không thay thế cho việc bảo vệ secret; mọi biến `REACT_APP_*` vẫn có thể được người dùng tải xuống trong bundle.

### Triển khai với Nginx

File [`nginx.conf`](./nginx.conf) đã có cấu hình mẫu:

- Phục vụ `build/` tại `/usr/share/nginx/html`.
- Fallback mọi route không phải file tĩnh về `index.html` để React Router hoạt động.
- Cache dài hạn cho JavaScript, CSS, ảnh và font.

Ví dụ Dockerfile tối giản:

```dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

Build image sau khi đã build frontend:

```bash
docker build -t ql-vlxd-web .
docker run --rm -p 8080:80 ql-vlxd-web
```

Mở [http://localhost:8080](http://localhost:8080).

> Khi triển khai phía sau reverse proxy, cần cho phép frontend truy cập backend, cấu hình CORS đúng domain và bảo đảm mọi route client-side đều trả về `index.html`.

## Cấu trúc dự án

```text
.
├── public/                  # favicon, manifest và tài nguyên tĩnh
├── src/
│   ├── components/          # layout, guard và component UI dùng chung
│   ├── config/              # cấu hình runtime từ biến môi trường
│   ├── hooks/               # hook xác thực và kiểm tra quyền
│   ├── pages/               # các màn hình theo nghiệp vụ
│   ├── routers/             # khai báo route và route guard
│   ├── services/            # Axios client và interceptor
│   ├── stores/redux/        # actions, reducers và store
│   └── utils/               # format, validate, storage và nghiệp vụ dùng chung
├── scripts/                 # script hậu xử lý sau build
├── documents/               # tài liệu nội bộ, không đưa vào git
├── nginx.conf               # cấu hình Nginx production
├── package.json             # dependency và npm scripts
└── tailwind.config.js       # cấu hình Tailwind CSS
```

### Các route chính

| Route | Màn hình | Quyền |
|---|---|---|
| `/login` | Đăng nhập | Công khai |
| `/` | Dashboard | `manager`, `admin` |
| `/profile` | Hồ sơ cá nhân | Đã đăng nhập |
| `/products` | Danh mục vật tư | Đã đăng nhập |
| `/inventory` | Trung tâm quản lý kho | Đã đăng nhập |
| `/inventory/manage` | Nhập, xuất, điều chỉnh | Đã đăng nhập |
| `/inventory/history` | Lịch sử giao dịch | Đã đăng nhập |
| `/expenses` | Quản lý chi phí | `manager`, `admin` |
| `/reports` | Báo cáo tồn kho | `manager`, `admin` |
| `/users` | Quản lý nhân sự | `manager`, `admin` |

## Luồng dữ liệu và tích hợp API

Axios client dùng `REACT_APP_API_URL/api/v1` làm `baseURL`, tự động thêm token phiên vào header `Authorization` cho các request cần xác thực.

Các nhóm endpoint backend mà frontend sử dụng:

| Nhóm | Endpoint |
|---|---|
| Xác thực | `POST /auth/login`, `GET /auth/me`, `PUT /auth/me` |
| Người dùng | `GET /auth/users`, `POST /auth/create-employee`, `PUT /auth/users/:id`, `PUT /auth/users/:id/toggle-status` |
| Vật tư | `GET/POST /products`, `GET/PUT /products/:id`, ẩn/khôi phục vật tư |
| Danh mục | `GET /products/categories`, `POST /products/category`, đổi tên/xóa danh mục |
| Kho | `POST /inventory/import`, `POST /inventory/export`, `POST /inventory/adjust` |
| Giao dịch | `GET /inventory/transactions` |
| Chi phí | `GET/POST /expenses/`, `GET /expenses/hidden`, cập nhật/ẩn/khôi phục |
| Báo cáo | `GET /reports/dashboard`, `GET /reports/inventory` |

Khi backend trả về:

- **401**: session bị xóa và người dùng được chuyển về `/login`.
- **403**: hiển thị thông báo không đủ quyền.
- **5xx**: hiển thị thông báo lỗi hệ thống.
- **Không có response**: hiển thị thông báo không thể kết nối máy chủ.

## Kiểm thử

Chạy test ở chế độ interactive:

```bash
npm test
```

Chạy một lần trong CI:

```bash
npm test -- --watchAll=false
```

Trước khi tạo bản production nên kiểm tra tối thiểu:

1. `npm test -- --watchAll=false`.
2. `npm run build`.
3. Đăng nhập, tải lại trang và đăng xuất/đăng nhập lại.
4. Kiểm tra quyền với tài khoản `staff`, `manager` và `admin`.
5. Kiểm tra route trực tiếp sau khi deploy Nginx, ví dụ `/inventory/history`.

## Xử lý lỗi thường gặp

### Không kết nối được backend

- Kiểm tra backend có chạy đúng cổng hay không.
- Kiểm tra `REACT_APP_API_URL` trong `.env`.
- Khởi động lại `npm start` sau khi sửa `.env`.
- Kiểm tra CORS nếu frontend và backend khác domain/port.

### Refresh route bị 404 khi deploy

Đảm bảo Nginx có:

```nginx
try_files $uri $uri/ /index.html;
```

### Đăng nhập xong bị quay lại trang login

- Kiểm tra token backend trả về.
- Kiểm tra secret dùng cho môi trường hiện tại.
- Kiểm tra thời hạn token và endpoint `GET /auth/me`.
- Xóa site data/localStorage rồi đăng nhập lại nếu session cũ không hợp lệ.

### Build không thành công

- Dùng đúng Node.js LTS.
- Xóa `node_modules` và cài lại bằng `npm ci`.
- Kiểm tra biến môi trường và log của `react-scripts`.
- Nếu bật obfuscation, kiểm tra dependency `javascript-obfuscator` có sẵn.

## Lưu ý bảo mật

- Không commit `.env`, token, mật khẩu hoặc khóa bí mật vào Git.
- Không sử dụng khóa mẫu ở môi trường production.
- Khóa frontend chỉ dùng để mã hóa dữ liệu session trong trình duyệt, không phải cơ chế bảo vệ secret tuyệt đối.
- Backend phải tự kiểm tra xác thực, phân quyền, dữ liệu đầu vào và giới hạn số lượng nhập/xuất.
- Không coi việc ẩn menu hoặc nút trên giao diện là biện pháp phân quyền duy nhất.
- Thay đổi hoặc thu hồi các tài khoản demo trước khi đưa hệ thống vào sử dụng thật.
- Luôn dùng HTTPS khi triển khai production.

## Phạm vi repository

Repository này chỉ chứa frontend. Để chạy đầy đủ hệ thống cần có backend tương thích với các endpoint được liệt kê ở trên. Khi thay đổi contract API, cần cập nhật đồng thời Redux actions, reducer, màn hình liên quan và phần tài liệu này.

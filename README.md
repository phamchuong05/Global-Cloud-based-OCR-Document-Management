# 🌐 Global Cloud-based OCR & Document Management

> Hệ thống nhận dạng và quản lý tài liệu thông minh trên nền tảng đám mây — tự động trích xuất văn bản từ ảnh tài liệu ở bất kỳ ngôn ngữ nào, lưu trữ và quản lý kết quả trên cloud theo thời gian thực.

---

## 📌 Giới thiệu dự án

**Global Cloud-based OCR & Document Management** là một hệ thống xử lý tài liệu thông minh được xây dựng hoàn toàn trên nền tảng **Microsoft Azure**. Dự án ra đời nhằm giải quyết bài toán thực tế: làm thế nào để số hóa nhanh chóng các loại tài liệu giấy tờ — hóa đơn, căn cước công dân, biên lai, hợp đồng — từ nhiều ngôn ngữ khác nhau mà không cần cài đặt phần mềm hay can thiệp thủ công.

Người dùng chỉ cần **chụp ảnh và upload**, toàn bộ quá trình nhận dạng chữ viết, lưu trữ và quản lý dữ liệu sẽ được hệ thống tự động xử lý trên cloud.

### Điểm nổi bật

- ☁️ **100% Cloud-native** — không cần cài đặt, chạy được mọi nơi
- ⚡ **Xử lý realtime** — kết quả OCR có ngay sau vài giây upload
- 🌍 **Đa ngôn ngữ** — hỗ trợ tiếng Anh, tiếng Việt, tiếng Nhật và nhiều ngôn ngữ khác
- 📂 **Lưu trữ có cấu trúc** — toàn bộ kết quả được lưu vào database, dễ dàng truy vấn
- 🔒 **Bảo mật** — phân quyền truy cập theo chuẩn Azure IAM

---

## 🏗️ Kiến trúc hệ thống

Hệ thống được xây dựng theo mô hình **Serverless Event-Driven**, gồm các thành phần sau:

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Người dùng │────▶│  Azure Blob      │────▶│ Azure Event │
│  (Web App)  │     │  Storage         │     │    Grid     │
└─────────────┘     │  (container:     │     └──────┬──────┘
                    │   images)        │            │ trigger
                    └──────────────────┘            ▼
                                          ┌─────────────────┐
                                          │  Azure Function  │
                                          │ (Serverless)     │
                                          └────────┬────────┘
                                                   │
                              ┌────────────────────┼────────────────────┐
                              ▼                                         ▼
                   ┌──────────────────┐                      ┌──────────────────┐
                   │  Azure AI        │                      │  Azure Cosmos DB │
                   │  Document        │──── kết quả OCR ────▶│  (lưu trữ)       │
                   │  Intelligence    │                      └──────────────────┘
                   └──────────────────┘
```

---

## ⚙️ Cách hoạt động

### Bước 1 — Upload ảnh
Người dùng truy cập giao diện web, chọn ảnh tài liệu cần xử lý (hóa đơn, CCCD, biên lai...) và nhấn **"Tải Ảnh Lên Cloud"**. Ảnh được gửi thẳng lên **Azure Blob Storage**.

### Bước 2 — Kích hoạt tự động
Ngay khi ảnh xuất hiện trong Blob Storage, **Azure Event Grid** phát hiện sự kiện và kích hoạt **Azure Function** tương ứng — không cần polling, không cần chờ đợi.

### Bước 3 — Nhận dạng văn bản (OCR)
Azure Function tải ảnh xuống và gửi đến **Azure AI Document Intelligence** để phân tích. Dịch vụ AI này trích xuất toàn bộ nội dung văn bản trong ảnh, bao gồm chữ in, chữ viết tay, và các trường dữ liệu có cấu trúc như tên, ngày tháng, số tiền.

### Bước 4 — Lưu trữ kết quả
Kết quả OCR được chuẩn hóa và lưu vào **Azure Cosmos DB** với đầy đủ thông tin: tên file, nội dung văn bản, thời gian xử lý. Dữ liệu sẵn sàng để truy vấn, tìm kiếm và xuất báo cáo.

---

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Giao diện người dùng | HTML, CSS, JavaScript |
| Serverless Backend | Azure Functions (TypeScript) |
| Nhận dạng văn bản | Azure AI Document Intelligence |
| Cơ sở dữ liệu | Azure Cosmos DB |
| Lưu trữ ảnh | Azure Blob Storage |
| Kích hoạt sự kiện | Azure Event Grid |

---

## 🚀 Cài đặt & Chạy local

### Yêu cầu
- Node.js >= 18
- Azure Functions Core Tools v4
- Tài khoản Microsoft Azure

### Các bước

```bash
# 1. Clone repo
git clone https://github.com/phamchuong05/Global-Cloud-based-OCR-Document-Management.git
cd Global-Cloud-based-OCR-Document-Management

# 2. Cài đặt dependencies
npm install

# 3. Khởi động
npm start
```

Tạo file `local.settings.json` với các biến môi trường:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "<connection-string>",
    "ocrstoragechuong_STORAGE": "<connection-string>",
    "COSMOS_DB_CONNECTION": "<connection-string>",
    "OCR_ENDPOINT": "<endpoint>",
    "OCR_KEY": "<key>",
    "FUNCTIONS_WORKER_RUNTIME": "node"
  }
}
```

Mở `index.html` bằng Live Server tại `http://127.0.0.1:5500`.

---

## 👥 Nhóm thực hiện

Dự án được thực hiện bởi nhóm sinh viên với sự phân công rõ ràng theo từng lĩnh vực: hạ tầng cloud, backend serverless, tích hợp AI, giao diện người dùng và nghiên cứu lý thuyết.

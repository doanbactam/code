# Project Configuration (Long-Term Memory)

## Mục Tiêu Dự Án
M4V là một nền tảng giúp người dùng khám phá các giải pháp công cụ AI thay thế cho phần mềm độc quyền. Dự án nhằm mục đích:
- Cung cấp một danh mục các công cụ AI được tổ chức tốt
- Cho phép so sánh giữa các ứng dụng dựa trên tính năng, đánh giá, và yêu cầu kỹ thuật
- Xây dựng cộng đồng xung quanh việc sử dụng và phát triển mã nguồn mở
- Cung cấp nội dung giáo dục về lợi ích của mã nguồn mở

## Tech Stack
- **Framework**: Next.js 15 App Router
- **Ngôn ngữ**: TypeScript
- **UI**: React, Shadcn UI, Radix UI, Tailwind CSS
- **Quản lý trạng thái URL**: nuqs
- **Server Actions**: zsa (với Zod để xác thực)
- **Quản lý gói**: Bun
- **Cơ sở dữ liệu**: Prisma ORM
- **Công cụ phát triển**: Turbo, Biome
- **Kiểm soát phiên bản**: Git

## Mẫu & Quy Ước Quan Trọng

### Phong Cách Và Cấu Trúc Mã
- Viết mã TypeScript ngắn gọn, kỹ thuật với ví dụ chính xác
- Sử dụng mẫu lập trình hàm và khai báo; tránh lớp
- Ưu tiên lặp và module hóa thay vì lặp lại mã
- Sử dụng tên biến mô tả với trợ động từ (ví dụ: isLoading, hasError)
- Cấu trúc tập tin: thành phần xuất, thành phần con, hàm trợ giúp, nội dung tĩnh, kiểu

### Quy Ước Đặt Tên
- Sử dụng chữ thường với dấu gạch ngang cho thư mục (ví dụ: components/auth-wizard)
- Ưu tiên xuất có tên cho các thành phần

### Sử Dụng TypeScript
- Sử dụng TypeScript cho tất cả mã; ưu tiên types hơn interfaces
- Tránh enums; sử dụng maps thay thế
- Sử dụng thành phần hàm với kiểu TypeScript

### Cú Pháp Và Định Dạng
- Sử dụng hàm mũi tên cho các hàm thuần
- Tránh dấu ngoặc nhọn không cần thiết trong điều kiện; sử dụng cú pháp ngắn gọn cho câu lệnh đơn giản
- Sử dụng JSX khai báo

### UI Và Phong Cách
- Sử dụng Shadcn UI, Radix và Tailwind cho thành phần và phong cách
- Triển khai thiết kế đáp ứng với Tailwind CSS; sử dụng phương pháp ưu tiên di động

### Tối Ưu Hóa Hiệu Suất
- Giảm thiểu 'use client', 'useEffect' và 'setState'; ưu tiên React Server Components (RSC)
- Bọc thành phần khách hàng trong Suspense với fallback
- Sử dụng tải động cho thành phần không quan trọng
- Tối ưu hình ảnh: sử dụng định dạng WebP, bao gồm dữ liệu kích thước, triển khai tải lười biếng

### Đặc Điểm Next.js
- Tuân theo tài liệu Next.js cho Lấy Dữ Liệu, Hiển Thị và Định Tuyến
- Sử dụng App Router Next.js 15 mới
- Sử dụng zsa cho tất cả server actions với xác thực Zod
- Sử dụng useQueryState cho tất cả quản lý trạng thái truy vấn

## Ràng Buộc Chính
- Tối thiểu hóa việc sử dụng 'use client' - chỉ khi thực sự cần thiết
- Thiết kế đáp ứng trên mọi thiết bị là bắt buộc
- Mọi hành động phía máy chủ phải được xác thực bằng Zod
- Luôn tối ưu hóa cho Web Vitals (LCP, CLS, FID)

## Thiết Lập Tokenization
- Ký tự trung bình mỗi token: 4
- Kích thước token tối đa: 100,000
- Kích thước cửa sổ ngữ cảnh: 200,000 ký tự 
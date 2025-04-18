# Cấu hình dự án (Bộ nhớ dài hạn - LTM)

_Tệp này chứa ngữ cảnh ổn định, dài hạn cho dự án AIToolsHub._
_Nó nên được cập nhật không thường xuyên, chủ yếu khi các mục tiêu cốt lõi, công nghệ hoặc mẫu thay đổi._

---

## Mục tiêu cốt lõi

AIToolsHub là một nền tảng đơn giản để khám phá, so sánh và dùng thử các công cụ AI. Dự án nhằm mục đích giúp người dùng dễ dàng tìm kiếm các công cụ AI phù hợp với nhu cầu của họ, so sánh các tính năng và chi phí, đồng thời có thể dùng thử trực tiếp các công cụ này.

---

## Công nghệ sử dụng

- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Next.js ISR, API Routes, Server Actions đơn giản
- **Quản lý trạng thái:** React Query, nuqs cho trạng thái truy vấn URL
- **Cơ sở dữ liệu:** PostgreSQL hoặc Supabase
- **Xác thực:** NextAuth.js cơ bản
- **Triển khai:** Vercel
- **Bộ nhớ đệm:** Vercel KV

---

## Mẫu và quy ước quan trọng

- **Cấu trúc dự án:** Đơn giản, không sử dụng monorepo phức tạp
- **Kiến trúc thành phần:** Kết hợp giữa Server Components và Client Components khi cần thiết
- **Lấy dữ liệu:** Sử dụng ISR cho dữ liệu tĩnh, React Query cho dữ liệu động
- **Quản lý trạng thái:** Tham số truy vấn URL với nuqs cho trạng thái có thể chia sẻ
- **Kiểu dáng:** Tailwind CSS với cách tiếp cận ưu tiên di động
- **Xử lý lỗi:** Xử lý lỗi đơn giản với thông báo người dùng thân thiện
- **Quy ước đặt tên:**
  - Chữ thường với dấu gạch nối cho thư mục (ví dụ: components/tool-card)
  - PascalCase cho các thành phần
  - camelCase cho biến và hàm
- **Cấu trúc tệp:** Thành phần xuất, các thành phần con, trợ giúp, kiểu dữ liệu

---

## Mô hình dữ liệu chính

- **AITool:** Thông tin về công cụ AI (tên, mô tả, URL, API, khả năng, giá cả)
- **User:** Thông tin người dùng cơ bản (id, email, tên)
- **Category:** Phân loại công cụ AI (id, tên, slug)
- **Rating:** Đánh giá của người dùng (điểm số, bình luận, người dùng, công cụ)
- **Capability:** Khả năng của công cụ AI (tên, mô tả)

---

## Ràng buộc chính

- **Hiệu suất:** Tối ưu hóa cho Web Vitals (LCP, CLS, FID)
- **Khả năng tiếp cận:** Tuân thủ hướng dẫn WCAG cơ bản
- **Đáp ứng di động:** Đảm bảo giao diện người dùng hoạt động tốt trên thiết bị di động
- **Tích hợp API:** Giới hạn số lượng request API để tránh chi phí cao

---

## Cài đặt tokenization

- **Phương pháp ước tính:** Dựa trên ký tự
- **Số ký tự trên mỗi token (ước tính):** 4

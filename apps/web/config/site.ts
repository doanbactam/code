import { env } from "~/env"

export const siteConfig = {
  name: "M4V",
  tagline: "Khám Phá Công Cụ AI Hữu Ích Cho Công Việc Hàng Ngày",
  description:
    "Bộ sưu tập các công cụ AI tốt nhất cho công việc và cuộc sống hàng ngày. Tiết kiệm thời gian với các công cụ AI đáng tin cậy được chọn lọc cho bạn.",
  email: env.NEXT_PUBLIC_SITE_EMAIL,
  url: env.NEXT_PUBLIC_SITE_URL,

  alphabet: "abcdefghijklmnopqrstuvwxyz",

  affiliateUrl: "https://go.openalternative.co",
}

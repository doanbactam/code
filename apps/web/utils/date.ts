import { formatDistanceToNowStrict } from "date-fns"
import { vi } from "date-fns/locale"

// Cấu hình ghi đè locale tiếng Việt cho date-fns
const viLocaleCustom: Partial<Locale> = {
  ...vi,
  formatDistance: {
    lessThanXSeconds: "dưới {{count}} giây",
    xSeconds: "{{count}} giây",
    halfAMinute: "nửa phút",
    lessThanXMinutes: "dưới {{count}} phút",
    xMinutes: "{{count}} phút",
    aboutXHours: "khoảng {{count}} giờ",
    xHours: "{{count}} giờ",
    xDays: "{{count}} ngày",
    aboutXWeeks: "khoảng {{count}} tuần",
    xWeeks: "{{count}} tuần",
    aboutXMonths: "khoảng {{count}} tháng",
    xMonths: "{{count}} tháng",
    aboutXYears: "khoảng {{count}} năm",
    xYears: "{{count}} năm",
    overXYears: "hơn {{count}} năm",
    almostXYears: "gần {{count}} năm",
  },
}

/**
 * Hàm định dạng khoảng thời gian đến hiện tại với locale tiếng Việt và thay thế các đơn vị thời gian tiếng Anh
 */
export function formatTimeToNow(date: Date | string | number, options?: Parameters<typeof formatDistanceToNowStrict>[1]) {
  if (!date) return ""
  
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  
  // Format bằng locale tiếng Việt
  const formatted = formatDistanceToNowStrict(dateObj, {
    addSuffix: true,
    locale: vi,
    ...options,
  })
  
  // Thay thế các đơn vị thời gian sang tiếng Việt
  return formatted
    .replace(" hour ago", " giờ trước")
    .replace(" hours ago", " giờ trước")
    .replace(" day ago", " ngày trước")
    .replace(" days ago", " ngày trước")
    .replace(" month ago", " tháng trước")
    .replace(" months ago", " tháng trước")
    .replace(" year ago", " năm trước")
    .replace(" years ago", " năm trước")
    .replace(" minute ago", " phút trước")
    .replace(" minutes ago", " phút trước")
    .replace(" second ago", " giây trước")
    .replace(" seconds ago", " giây trước")
    .replace("in ", "trong ")
    .replace(" hour", " giờ")
    .replace(" hours", " giờ")
    .replace(" day", " ngày")
    .replace(" days", " ngày")
    .replace(" month", " tháng")
    .replace(" months", " tháng")
    .replace(" year", " năm")
    .replace(" years", " năm")
    .replace(" minute", " phút")
    .replace(" minutes", " phút")
    .replace(" second", " giây")
    .replace(" seconds", " giây")
} 
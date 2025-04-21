import type { Prisma } from "@openalternative/db/client"

/**
 * Trả về dữ liệu trống vì đã loại bỏ tích hợp với GitHub.
 * Giữ lại hàm này để duy trì tính tương thích với code hiện tại.
 *
 * @param repository - Đường dẫn repository không còn được sử dụng
 * @returns Luôn trả về null (không có dữ liệu GitHub)
 */
export const getToolRepositoryData = async (_repository?: string) => {
  // Không còn lấy dữ liệu từ GitHub
  return null
}

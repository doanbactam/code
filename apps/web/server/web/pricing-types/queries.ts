import { db } from "@m4v/db"
import { PricingType, ToolStatus } from "@m4v/db/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"

/**
 * Find all pricing types with tool counts
 * @returns Array of pricing types with tool counts
 */
export const findPricingTypes = async () => {
  "use cache"

  cacheTag("pricing-types")
  cacheLife("max")

  // Lấy danh sách các giá trị enum PricingType
  const pricingTypes = Object.values(PricingType) as PricingType[]
  
  // Đếm số lượng công cụ cho mỗi loại giá
  const results = await Promise.all(
    pricingTypes.map(async (type: PricingType) => {
      const count = await db.tool.count({
        where: { 
          // Ghi chú: pricingType sẽ hoạt động sau khi migration được áp dụng
          // @ts-ignore - Sẽ hoạt động sau khi migration
          pricingType: type,
          status: ToolStatus.Published 
        },
      })
      
      return {
        slug: type.toLowerCase(),
        name: type,
        _count: { tools: count },
      }
    })
  )

  return results
} 
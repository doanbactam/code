import { joinAsSentence } from "@curiousleaf/utils"
import { ToolStatus } from "@m4v/db/client"
import type { Jsonify } from "inngest/helpers/jsonify"
import type { ToolOne } from "~/server/web/tools/payloads"

type Tool = ToolOne | Jsonify<ToolOne>

export const isToolPublished = (tool: Pick<Tool, "status">) => {
  return tool.status === ToolStatus.Published
}

export const getToolSuffix = (tool: Pick<Tool, "alternatives" | "tagline">) => {
  let suffix = ""

  switch (tool.alternatives.length) {
    case 0:
      suffix = `${tool.tagline}`
      break
    case 1:
      suffix = `Lựa chọn AI thay thế cho ${tool.alternatives[0].name}`
      break
    default:
      suffix = `Lựa chọn AI thay thế cho ${joinAsSentence(tool.alternatives.map(({ name }) => name))}`
  }

  return suffix
}

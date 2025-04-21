"use client"

import type { Tool } from "@openalternative/db/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { ToolScheduleDialog } from "~/app/admin/tools/_components/tool-schedule-dialog"
import { ToolsDeleteDialog } from "~/app/admin/tools/_components/tools-delete-dialog"
import { fetchSimilarWebData } from "~/server/admin/tools/actions"
import type { DataTableRowAction } from "~/types"

type UpdateToolActionProps = {
  tool: Tool
}

const FetchSimilarWebButton = ({ tool }: { tool: Tool }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { execute } = useServerAction(fetchSimilarWebData, {
    onSuccess: () => {
      setIsLoading(false)
      toast.success("Dữ liệu SimilarWeb đã được cập nhật")
    },
    onError: ({ err }) => {
      setIsLoading(false)
      toast.error(err.message)
    },
  })

  const handleClick = () => {
    setIsLoading(true)
    execute({ id: tool.id })
  }

  return (
    <Button 
      onClick={handleClick}
      disabled={isLoading}
      variant="secondary"
      className="mr-2"
      size="sm"
    >
      {isLoading ? (
        <>
          <Icon name="lucide/loader" className="mr-2 h-4 w-4 animate-spin" />
          Đang tải...
        </>
      ) : (
        <>
          <Icon name="lucide/globe" className="mr-2 h-4 w-4" />
          Lấy dữ liệu SimilarWeb
        </>
      )}
    </Button>
  )
}

export const UpdateToolActions = ({ tool }: UpdateToolActionProps) => {
  const router = useRouter()
  const [rowAction, setRowAction] = useState<DataTableRowAction<Tool> | null>(null)

  return (
    <div className="flex items-center">
      <FetchSimilarWebButton tool={tool} />
      <ToolActions tool={tool} setRowAction={setRowAction} />

      <ToolScheduleDialog
        open={rowAction?.type === "schedule"}
        onOpenChange={() => setRowAction(null)}
        tool={rowAction?.data}
        showTrigger={false}
      />

      <ToolsDeleteDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        tools={rowAction?.data ? [rowAction?.data] : []}
        showTrigger={false}
        onSuccess={() => router.push("/admin/tools")}
      />
    </div>
  )
}

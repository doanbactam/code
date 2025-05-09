"use client"

import type { Tool } from "@m4v/db/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { ToolScheduleDialog } from "~/app/admin/tools/_components/tool-schedule-dialog"
import { ToolsDeleteDialog } from "~/app/admin/tools/_components/tools-delete-dialog"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { fetchSimilarWebData } from "~/server/admin/tools/actions"
import type { DataTableRowAction } from "~/types"

type UpdateToolActionProps = {
  tool: Tool
}

export const UpdateToolActions = ({ tool }: UpdateToolActionProps) => {
  const router = useRouter()
  const [rowAction, setRowAction] = useState<DataTableRowAction<Tool> | null>(null)

  return (
    <div className="flex items-center">
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

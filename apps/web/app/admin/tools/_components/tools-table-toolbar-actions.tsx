"use client"

import type { Tool } from "@m4v/db/client"
import type { Table } from "@tanstack/react-table"
import { useState } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { fetchSimilarWebData } from "~/server/admin/tools/actions"
import { ToolsDeleteDialog } from "./tools-delete-dialog"

interface ToolsTableToolbarActionsProps {
  table: Table<Tool>
}

export function ToolsTableToolbarActions({ table }: ToolsTableToolbarActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const selectedTools = table.getFilteredSelectedRowModel().rows.map(row => row.original)
  const hasSelectedTools = selectedTools.length > 0
  
  const { execute } = useServerAction(fetchSimilarWebData, {
    onSuccess: () => {
      toast.success(`Dữ liệu SimilarWeb đã được cập nhật cho ${selectedTools.length} công cụ`)
      table.toggleAllRowsSelected(false)
    },
    onError: ({ err }) => toast.error(err.message),
  })

  const handleFetchSimilarWeb = async () => {
    setIsLoading(true)
    try {
      for (const tool of selectedTools) {
        await execute({ id: tool.id })
      }
    } catch (error) {
      toast.error(`Lỗi khi cập nhật dữ liệu: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {hasSelectedTools ? (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFetchSimilarWeb}
            disabled={isLoading}
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
          
          <ToolsDeleteDialog
            tools={selectedTools}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}

      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </>
  )
}

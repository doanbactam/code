"use client"

import type { Tool } from "@m4v/db/client"
import type { Table } from "@tanstack/react-table"
import { ToolsDeleteDialog } from "./tools-delete-dialog"
import { ToolsGenerateContentDialog } from "./tools-generate-content-dialog"
import { ToolsSimilarWebDialog } from "./tools-similarweb-dialog"
import { ToolsUploadAssetsDialog } from "./tools-upload-assets-dialog"

interface ToolsTableToolbarActionsProps {
  table: Table<Tool>
}

export function ToolsTableToolbarActions({ table }: ToolsTableToolbarActionsProps) {
  const selectedTools = table.getFilteredSelectedRowModel().rows.map(row => row.original)
  const hasSelectedTools = selectedTools.length > 0

  return (
    <>
      {hasSelectedTools ? (
        <>
          <ToolsSimilarWebDialog
            tools={selectedTools}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />

          <ToolsUploadAssetsDialog
            tools={selectedTools}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />

          <ToolsGenerateContentDialog
            tools={selectedTools}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />

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

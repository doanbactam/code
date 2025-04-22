"use client"

import type { Tool } from "@m4v/db/client"
import { EllipsisIcon } from "lucide-react"
import type { ComponentProps, Dispatch, SetStateAction } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import {
  regenerateToolContent,
  reuploadToolAssets,
  fetchSimilarWebData,
} from "~/server/admin/tools/actions"
import type { DataTableRowAction } from "~/types"
import { cx } from "~/utils/cva"

type ToolActionsProps = ComponentProps<typeof Button> & {
  tool: Tool
  setRowAction: Dispatch<SetStateAction<DataTableRowAction<Tool> | null>>
}

export const ToolActions = ({ className, tool, setRowAction, ...props }: ToolActionsProps) => {
  const actions = [
    {
      action: fetchSimilarWebData,
      label: "Lấy dữ liệu SimilarWeb",
      successMessage: "Đã lấy dữ liệu SimilarWeb thành công", 
      show: () => !!tool.websiteUrl,
    },
    {
      action: reuploadToolAssets,
      label: "Tải hình ảnh",
      successMessage: "Đã tải hình ảnh công cụ",
    },
    {
      action: regenerateToolContent,
      label: "Tạo lại nội dung",
      successMessage: "Đã tạo lại nội dung công cụ",
    },
  ] as const

  const toolActions = actions
    .filter(action => !action.show || action.show())
    .map(({ label, action, successMessage }) => ({
      label,
      execute: useServerAction(action, {
        onSuccess: () => toast.success(successMessage),
        onError: ({ err }) => toast.error(err.message),
      }).execute,
    }))

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="secondary"
          size="sm"
          prefix={<EllipsisIcon />}
          className={cx("data-[state=open]:bg-accent", className)}
          {...props}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/tools/${tool.slug}`}>Chỉnh sửa</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/${tool.slug}`} target="_blank">
            Xem
          </Link>
        </DropdownMenuItem>

        {!tool.publishedAt && (
          <DropdownMenuItem
            onSelect={() => setRowAction({ data: tool, type: "schedule" })}
            className="text-green-600"
          >
            Lên lịch
          </DropdownMenuItem>
        )}

        {toolActions.map(({ label, execute }) => (
          <DropdownMenuItem key={label} onSelect={() => execute({ id: tool.id })}>
            {label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={tool.websiteUrl} target="_blank">
            Truy cập trang web
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => setRowAction({ data: tool, type: "delete" })}
          className="text-red-500"
        >
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
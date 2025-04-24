"use client"

import type { Tool } from "@m4v/db/client"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/common/dialog"
import { Icon } from "~/components/common/icon"
import { batchRegenerateToolContent } from "~/server/admin/tools/actions"

type ToolsGenerateContentDialogProps = ComponentProps<typeof Dialog> & {
  tools: Tool[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const ToolsGenerateContentDialog = ({
  tools,
  showTrigger = true,
  onSuccess,
  ...props
}: ToolsGenerateContentDialogProps) => {
  const { execute, isPending } = useServerAction(batchRegenerateToolContent, {
    onSuccess: ({ successCount, totalCount }) => {
      props.onOpenChange?.(false)
      toast.success(`Đã tạo nội dung cho ${successCount}/${totalCount} công cụ`)
      onSuccess?.()
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="md" prefix={<Icon name="lucide/sparkles" />}>
            Tạo nội dung ({tools.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận tạo nội dung</DialogTitle>
          <DialogDescription>
            Thao tác này sẽ tạo lại hoàn toàn nội dung (tiêu đề, mô tả, nội dung) và phân loại (danh
            mục, giá cả) cho <span className="font-medium">{tools.length}</span>
            {tools.length === 1 ? " công cụ" : " công cụ"} đã chọn bằng AI. Quá trình này có thể mất
            một lúc.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Hủy</Button>
          </DialogClose>

          <Button
            aria-label="Tạo nội dung cho các hàng đã chọn"
            size="md"
            variant="primary"
            className="min-w-28"
            onClick={() => execute({ ids: tools.map(({ id }) => id) })}
            isPending={isPending}
          >
            Tạo nội dung
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

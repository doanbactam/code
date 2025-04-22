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
import { batchReuploadToolAssets } from "~/server/admin/tools/actions"

type ToolsUploadAssetsDialogProps = ComponentProps<typeof Dialog> & {
  tools: Tool[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const ToolsUploadAssetsDialog = ({
  tools,
  showTrigger = true,
  onSuccess,
  ...props
}: ToolsUploadAssetsDialogProps) => {
  const { execute, isPending } = useServerAction(batchReuploadToolAssets, {
    onSuccess: ({ successCount, totalCount }) => {
      props.onOpenChange?.(false)
      toast.success(`Đã tải hình ảnh cho ${successCount}/${totalCount} công cụ`)
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
          <Button variant="secondary" size="md" prefix={<Icon name="lucide/gem" />}>
            Tải hình ảnh ({tools.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận tải hình ảnh</DialogTitle>
          <DialogDescription>
            Thao tác này sẽ tải lại favicon và screenshot cho{" "}
            <span className="font-medium">{tools.length}</span>
            {tools.length === 1 ? " công cụ" : " công cụ"} đã chọn. Quá trình này có thể mất một lúc.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Hủy</Button>
          </DialogClose>

          <Button
            aria-label="Tải hình ảnh cho các hàng đã chọn"
            size="md"
            variant="primary"
            className="min-w-28"
            onClick={() => execute({ ids: tools.map(({ id }) => id) })}
            isPending={isPending}
          >
            Tải hình ảnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
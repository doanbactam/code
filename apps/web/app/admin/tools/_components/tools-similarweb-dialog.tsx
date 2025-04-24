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
import { batchFetchSimilarWebData } from "~/server/admin/tools/actions"

type ToolsSimilarWebDialogProps = ComponentProps<typeof Dialog> & {
  tools: Tool[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const ToolsSimilarWebDialog = ({
  tools,
  showTrigger = true,
  onSuccess,
  ...props
}: ToolsSimilarWebDialogProps) => {
  const { execute, isPending } = useServerAction(batchFetchSimilarWebData, {
    onSuccess: result => {
      props.onOpenChange?.(false)
      toast.success(
        `Đã lấy dữ liệu SimilarWeb cho ${result.successCount}/${result.totalCount} công cụ`,
      )
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
          <Button variant="secondary" size="md" prefix={<Icon name="lucide/globe" />}>
            Lấy dữ liệu SimilarWeb ({tools.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận lấy dữ liệu SimilarWeb</DialogTitle>
          <DialogDescription>
            Thao tác này sẽ lấy dữ liệu lượt truy cập từ SimilarWeb cho{" "}
            <span className="font-medium">{tools.length}</span>
            {tools.length === 1 ? " công cụ" : " công cụ"} đã chọn. Quá trình này có thể mất một
            lúc.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Hủy</Button>
          </DialogClose>

          <Button
            aria-label="Lấy dữ liệu SimilarWeb cho các hàng đã chọn"
            size="md"
            variant="primary"
            className="min-w-28"
            onClick={() => execute({ ids: tools.map(({ id }) => id) })}
            isPending={isPending}
          >
            Lấy dữ liệu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

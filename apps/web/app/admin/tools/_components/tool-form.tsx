"use client"

import { slugify } from "@curiousleaf/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { PricingType, ToolStatus } from "@m4v/db/client"
import { formatDate } from "date-fns"
import { redirect } from "next/navigation"
import type { ComponentProps } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { RelationSelector } from "~/components/admin/relation-selector"
import { TopicSelector } from "~/components/admin/topic-selector"
import { Button } from "~/components/common/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Icon } from "~/components/common/icon"
import { Input, inputVariants } from "~/components/common/input"
import { Link } from "~/components/common/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { Switch } from "~/components/common/switch"
import { TextArea } from "~/components/common/textarea"
import { Markdown } from "~/components/web/markdown"
import { useComputedField } from "~/hooks/use-computed-field"
import type { findAlternativeList } from "~/server/admin/alternatives/queries"
import type { findCategoryList } from "~/server/admin/categories/queries"
import { createTool, updateTool } from "~/server/admin/tools/actions"
import type { findToolBySlug } from "~/server/admin/tools/queries"
import { type ToolSchema, toolSchema } from "~/server/admin/tools/schemas"
import { cx } from "~/utils/cva"

// Định nghĩa type cho Topic
type Topic = {
  slug: string
}

type ToolWithRelations = Awaited<ReturnType<typeof findToolBySlug>> & {
  topics?: Topic[]
}

type ToolFormProps = ComponentProps<"form"> & {
  tool?: ToolWithRelations
  alternatives: ReturnType<typeof findAlternativeList>
  categories: ReturnType<typeof findCategoryList>
}

export function ToolForm({
  children,
  className,
  tool,
  alternatives,
  categories,
  ...props
}: ToolFormProps) {
  const [isPreviewing, setIsPreviewing] = useState(false)

  const form = useForm<ToolSchema>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: tool?.name ?? "",
      slug: tool?.slug ?? "",
      websiteUrl: tool?.websiteUrl ?? "",
      affiliateUrl: tool?.affiliateUrl ?? "",
      categories: tool?.categories.map(c => c.id) ?? [],
      alternatives: tool?.alternatives.map(a => a.id) ?? [],
      topics: tool?.topics.map(topic => topic.slug) ?? [],
      status: tool?.status ?? ToolStatus.Draft,
      tagline: tool?.tagline ?? "",
      description: tool?.description ?? "",
      content: tool?.content ?? "",
      faviconUrl: tool?.faviconUrl ?? "",
      screenshotUrl: tool?.screenshotUrl ?? "",
      isFeatured: tool?.isFeatured ?? false,
      submitterName: tool?.submitterName ?? "",
      submitterEmail: tool?.submitterEmail ?? "",
      submitterNote: tool?.submitterNote ?? "",
      hostingUrl: tool?.hostingUrl ?? "",
      discountCode: tool?.discountCode ?? "",
      discountAmount: tool?.discountAmount ?? "",
      pricingType: tool?.pricingType ?? undefined,
      publishedAt: tool?.publishedAt ?? new Date(),
    },
  })

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !tool,
  })

  const [websiteUrl, name, description, content] = form.watch([
    "websiteUrl",
    "name",
    "description",
    "content",
  ])

  // Create tool
  const { execute: createToolAction, isPending: isCreatingTool } = useServerAction(createTool, {
    onSuccess: ({ data }) => {
      toast.success(
        "Đã tạo công cụ thành công. Nội dung và hình ảnh sẽ được tạo tự động trong nền.",
        { id: "tool-submit" },
      )
      redirect(`/admin/tools/${data.slug}`)
    },

    onError: ({ err }) => {
      toast.error(err.message, { id: "tool-submit" })
    },
  })

  // Update tool
  const { execute: updateToolAction, isPending: isUpdatingTool } = useServerAction(updateTool, {
    onSuccess: ({ data }) => {
      toast.success("Đã cập nhật công cụ thành công", { id: "tool-submit" })

      if (data.slug !== tool?.slug) {
        redirect(`/admin/tools/${data.slug}`)
      }
    },

    onError: ({ err }) => {
      toast.error(err.message, { id: "tool-submit" })
    },
  })

  const onSubmit = form.handleSubmit(data => {
    try {
      // Kiểm tra websiteUrl có hợp lệ không
      if (data.websiteUrl && !data.websiteUrl.startsWith("http")) {
        toast.error("Website URL phải bắt đầu bằng http:// hoặc https://")
        return
      }

      // Hiển thị thông báo đang xử lý
      toast.loading(tool ? "Đang cập nhật công cụ..." : "Đang tạo công cụ...", {
        id: "tool-submit",
        duration: 10000,
      })

      // Thực hiện tạo hoặc cập nhật
      if (tool) {
        updateToolAction({ id: tool.id, ...data })
      } else {
        createToolAction(data)
      }
    } catch (error) {
      console.error("Lỗi khi gửi form:", error)
      toast.error(
        `Có lỗi xảy ra: ${error instanceof Error ? error.message : "Lỗi không xác định"}`,
        {
          id: "tool-submit",
        },
      )
    }
  })

  const isPending = isCreatingTool || isUpdatingTool

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cx("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input data-1p-ignore {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliateUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AFFILIATE URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề ngắn</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <TextArea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="col-span-full items-stretch">
              <Stack className="justify-between">
                <FormLabel>Nội dung</FormLabel>

                {field.value && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsPreviewing(prev => !prev)}
                    prefix={
                      isPreviewing ? <Icon name="lucide/pencil" /> : <Icon name="lucide/eye" />
                    }
                    className="-my-1"
                  >
                    {isPreviewing ? "Chỉnh sửa" : "Xem trước"}
                  </Button>
                )}
              </Stack>

              <FormControl>
                {field.value && isPreviewing ? (
                  <Markdown
                    code={field.value}
                    className={cx(inputVariants(), "max-w-none border leading-normal")}
                  />
                ) : (
                  <TextArea {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row gap-4 max-sm:contents">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nổi bật</FormLabel>
                <FormControl>
                  <Switch onCheckedChange={field.onChange} checked={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => {
            // Đảm bảo luôn có giá trị hợp lệ
            const formattedValue = field.value 
              ? new Date(field.value).toISOString().slice(0, 16) 
              : new Date().toISOString().slice(0, 16);
              
            return (
              <FormItem>
                <FormLabel>Thời gian đăng</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={formattedValue}
                    onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : new Date())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Trạng thái</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.values(ToolStatus).map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="submitterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên người gửi</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="submitterEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email người gửi</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="submitterNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú người gửi</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hostingUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hosting URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="faviconUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favicon URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="screenshotUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screenshot URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Amount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pricing Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={value => field.onChange(value === "none" ? undefined : value)}
                  value={field.value || "none"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a pricing type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {(Object.values(PricingType) as string[]).map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alternatives"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Alternatives</FormLabel>
              <FormControl>
                <RelationSelector
                  promise={alternatives}
                  selectedIds={field.value || []}
                  prompt={websiteUrl}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <RelationSelector
                  promise={categories}
                  selectedIds={field.value || []}
                  prompt={`${name}\n${description}`}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topics"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Topics</FormLabel>
              <FormControl>
                <TopicSelector
                  selectedSlugs={field.value || []}
                  websiteUrl={websiteUrl}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/tools">Hủy</Link>
          </Button>

          <Button size="md" variant="primary" isPending={isPending}>
            {tool ? "Cập nhật công cụ" : "Tạo công cụ"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

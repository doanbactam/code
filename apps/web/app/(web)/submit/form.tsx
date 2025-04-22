"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ToolStatus } from "@m4v/db/client"
import { useRouter } from "next/navigation"
import { posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { submitTool } from "~/actions/submit"
import { Button } from "~/components/common/button"
import { Checkbox } from "~/components/common/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Hint } from "~/components/common/hint"
import { Input } from "~/components/common/input"
import { Link } from "~/components/common/link"
import { FeatureNudge } from "~/components/web/feature-nudge"
import { useSession } from "~/lib/auth-client"
import { type SubmitToolSchema, submitToolSchema } from "~/server/web/shared/schemas"
import { cx } from "~/utils/cva"

export const SubmitForm = ({ className, ...props }: ComponentProps<"form">) => {
  const router = useRouter()
  const { data: session } = useSession()

  const form = useForm<SubmitToolSchema>({
    resolver: zodResolver(submitToolSchema),
    values: {
      name: "",
      websiteUrl: "",
      repositoryUrl: "",
      submitterName: session?.user.name || "",
      submitterEmail: session?.user.email || "",
      submitterNote: "",
      newsletterOptIn: true,
    },
  })

  const { error, execute, isPending } = useServerAction(submitTool, {
    onSuccess: ({ data }) => {
      form.reset()

      // Capture event
      posthog.capture("submit_tool", { slug: data.slug })

      if (data.status === ToolStatus.Published) {
        if (data.isFeatured) {
          toast.info(`${data.name} đã được xuất bản trước đó.`)
        } else {
          toast.custom(t => <FeatureNudge tool={data} t={t} />, {
            duration: Number.POSITIVE_INFINITY,
          })
        }
        router.push(`/${data.slug}`)
      } else {
        toast.success(`${data.name} đã được gửi thành công.`)
        router.push(`/submit/${data.slug}`)
      }
    },
  })

  // Hiển thị thông báo đăng nhập nếu người dùng chưa đăng nhập
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-medium">Bạn cần đăng nhập để gửi công cụ</h2>
          <p className="text-muted-foreground max-w-md">
            Để đảm bảo chất lượng và quản lý nội dung, chúng tôi yêu cầu người dùng phải đăng nhập trước khi gửi công cụ AI mới.
          </p>
        </div>
        <Button asChild variant="primary" size="lg">
          <Link href="/auth/signin">Đăng nhập</Link>
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => execute(data))}
        className={cx("grid w-full gap-5 sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Tên công cụ AI:</FormLabel>
              <FormControl>
                <Input type="text" size="lg" placeholder="ChatGPT" data-1p-ignore {...field} />
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
              <FormLabel isRequired>URL Website:</FormLabel>
              <FormControl>
                <Input type="url" size="lg" placeholder="https://chat.openai.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repositoryUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>URL Hướng dẫn sử dụng:</FormLabel>
              <FormControl>
                <Input type="url" size="lg" placeholder="https://help.openai.com/en/collections/3742473-chatgpt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="submitterNote"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Mô tả khả năng:</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  size="lg"
                  placeholder="Công cụ này có thể làm gì? Nó phù hợp với loại công việc nào?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newsletterOptIn"
          render={({ field }) => (
            <FormItem className="flex-row items-center col-span-full">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="font-normal">Tôi muốn nhận các cập nhật về công cụ AI mới qua email</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full">
          <Button variant="primary" isPending={isPending} className="flex min-w-32">
            Gửi
          </Button>
        </div>

        {error && <Hint className="col-span-full">{error.message}</Hint>}
      </form>
    </Form>
  )
}

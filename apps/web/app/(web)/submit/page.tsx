import { Metadata } from "next"
import { SubmitForm } from "./form"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Gửi Công Cụ AI Của Bạn",
  description: "Gửi công cụ AI yêu thích của bạn để chia sẻ với cộng đồng. Giúp mọi người khám phá các giải pháp AI tuyệt vời.",
  openGraph: { ...metadataConfig.openGraph, url: "/submit" },
  alternates: { ...metadataConfig.alternates, canonical: "/submit" },
}

export default function SubmitPage() {
  return (
    <main className="container max-w-screen-md py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col">
        <div className="mb-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Gửi Công Cụ AI</h1>
            <p className="text-muted-foreground">
              Bạn biết một công cụ AI xứng đáng được biết đến nhiều hơn?
              Gửi nó ngay để chúng tôi thêm vào thư viện công cụ.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                <span className="font-medium">Lưu ý:</span> Tất cả các công cụ AI gửi lên phải đáp ứng các tiêu chí sau để được xuất bản:
              </p>
              <ul className="mt-2 list-inside list-disc">
                <li>Công cụ phải có chức năng AI rõ ràng và hữu ích</li>
                <li>Công cụ phải hoạt động và được duy trì tích cực</li>
                <li>Công cụ phải có tài liệu đầy đủ và hướng dẫn sử dụng tốt</li>
                <li>Công cụ phải có trang web chính thức hoặc trang giới thiệu</li>
              </ul>
            </div>
          </div>
        </div>

        <SubmitForm />
      </div>
    </main>
  )
}

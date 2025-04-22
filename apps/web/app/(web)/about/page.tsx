import type { Metadata } from "next"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { ExternalLink } from "~/components/web/external-link"
import { Featured } from "~/components/web/featured"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Về Chúng Tôi",
  description: `${config.site.name} là danh sách các công cụ AI chất lượng để giúp bạn tăng hiệu suất công việc và cuộc sống hàng ngày.`,
  openGraph: { ...metadataConfig.openGraph, url: "/about" },
  alternates: { ...metadataConfig.alternates, canonical: "/about" },
}

export default function AboutPage() {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Featured />

      <Prose>
        <h3 id="what-is-it">{config.site.name} là gì?</h3>

        <p>
          <Link href="/" title={config.site.tagline}>
            {config.site.name}
          </Link>{" "}
          là danh sách các{" "}
          <strong>công cụ AI chất lượng để giúp bạn tăng hiệu suất công việc và cuộc sống hàng ngày</strong> được cộng đồng đóng góp. Mục tiêu của trang web là trở thành điểm dừng đầu tiên của bạn khi tìm kiếm các công cụ AI hữu ích. Nó sẽ giúp bạn tìm các công cụ AI phù hợp với nhu cầu của bạn.
        </p>

        <h3 id="how-did-it-get-started">{config.site.name} bắt đầu như thế nào?</h3>

        <p>
          Dự án bắt đầu khi chúng tôi nhận thấy có quá nhiều công cụ AI mới xuất hiện mỗi ngày và người dùng cần một nơi để dễ dàng tìm kiếm những công cụ phù hợp với nhu cầu của họ. Nó đã thu hút được nhiều sự chú ý ngay từ đầu và rõ ràng là có nhu cầu cho một trang web như thế này.
        </p>

        <p>
          Chúng tôi luôn là người hâm mộ công nghệ AI và muốn đóng góp cho cộng đồng bằng cách giúp mọi người khám phá các công cụ AI hữu ích có thể tăng năng suất và sáng tạo trong công việc hàng ngày của họ.
        </p>

        <h3 id="how-are-rankings-calculated">Xếp hạng được tính toán như thế nào?</h3>

        <p>
          {config.site.name} sử dụng một thuật toán để tính toán điểm hữu ích của từng công cụ AI, điều này quyết định thứ hạng của nó. Điểm số dựa trên một số yếu tố:
        </p>

        <ol>
          <li>
            <strong>Đánh giá người dùng</strong>: Chúng tôi xem xét đánh giá và phản hồi từ người dùng thực tế.
          </li>
          <li>
            <strong>Tính mới</strong>: Các công cụ mới hơn được cập nhật thường xuyên được đánh giá cao hơn.
          </li>
          <li>
            <strong>Tính năng và khả năng</strong>: Chúng tôi đánh giá các công cụ dựa trên tính năng, độ chính xác và khả năng giải quyết vấn đề.
          </li>
          <li>
            <strong>Điều chỉnh thủ công</strong>: Trong một số trường hợp, chúng tôi có thể áp dụng một điều chỉnh thủ công để tính đến các yếu tố mà thuật toán của chúng tôi không thể nắm bắt được.
          </li>
        </ol>

        <h3 id="tools-used">Công cụ được sử dụng</h3>

        <ul>
          {config.links.toolsUsed.map(link => (
            <li key={link.title}>
              <ExternalLink href={link.href} title={link.description}>
                {link.title}
              </ExternalLink>{" "}
              – {link.description}
            </li>
          ))}
        </ul>

        <h3 id="contribute">Đóng góp</h3>

        <p>
          Nếu bạn biết về công cụ AI tuyệt vời nào đó, vui lòng đóng góp vào danh sách. Bạn cũng có thể đóng góp bằng cách đề xuất các danh mục mới hoặc cải thiện trang web. Mã nguồn có sẵn trên{" "}
          <a href={config.links.github} target="_blank" rel="nofollow noreferrer">
            GitHub
          </a>
          .
        </p>

        <p>Hãy tận hưởng và đừng ngần ngại đóng góp!</p>

        <h3 id="affiliate-links">Liên kết liên kết</h3>

        <p>
          Trang web tham gia vào các chương trình liên kết với các nhà cung cấp dịch vụ được chọn, nơi một số liên kết được tự động theo dõi như liên kết liên kết. Chúng tôi cố gắng đảm bảo rằng các dịch vụ này không được đối xử ưu đãi.
        </p>

        <h3 id="about-the-author">Về chúng tôi</h3>

        <p>
          Chúng tôi là một nhóm các nhà phát triển và người đam mê AI. Chúng tôi đã làm việc với các công nghệ AI trong nhiều năm và muốn chia sẻ kiến thức của mình với cộng đồng.
        </p>

        <p>Một số dự án khác của chúng tôi:</p>

        <ul>
          {config.links.family.map(({ href, title, description }) => (
            <li key={title}>
              <ExternalLink href={href} title={description} doFollow>
                {title}
              </ExternalLink>{" "}
              – {description}
            </li>
          ))}
        </ul>

        <p>
          Chúng tôi luôn tìm kiếm các dự án mới để làm việc và những người mới để hợp tác. Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào.
        </p>
      </Prose>
    </>
  )
}

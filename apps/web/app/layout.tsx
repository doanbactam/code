import "./styles.css"
import type { Metadata, Viewport } from "next"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import type { PropsWithChildren } from "react"
import { Toaster } from "~/components/common/toaster"
import { TooltipProvider } from "~/components/common/tooltip"
import { ThemeProvider, ThemeScript } from "~/components/theme-provider"
import { config } from "~/config"

export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  title: {
    template: `%s – ${config.site.name}`,
    default: `${config.site.name} – ${config.site.tagline}`,
  },
  description: config.site.description,
  icons: {
    icon: [{ type: "image/png", url: "/favicon.png" }],
  },
  ...config.metadata,
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
          </NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

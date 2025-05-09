"use client"

import { usePathname } from "next/navigation"
import { type ComponentProps, Suspense, useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Icon } from "~/components/common/icon"
import { Stack } from "~/components/common/stack"
import { ThemeToggle } from "~/components/theme-toggle"
import { SearchForm } from "~/components/web/search-form"
import { Container } from "~/components/web/ui/container"
import { Hamburger } from "~/components/web/ui/hamburger"
import { Logo } from "~/components/web/ui/logo"
import { NavLink, navLinkVariants } from "~/components/web/ui/nav-link"
import { UserMenu } from "~/components/web/user-menu"
import { config } from "~/config"
import type { Session } from "~/lib/auth-types"
import { cx } from "~/utils/cva"

type HeaderProps = ComponentProps<typeof Container> & {
  session: Session | null
}

export const Header = ({ children, className, session, ...props }: HeaderProps) => {
  const pathname = usePathname()
  const [isNavOpen, setNavOpen] = useState(false)

  // Close the mobile navigation when the user presses the "Escape" key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  return (
    <Container
      className={cx(
        "group/menu sticky top-[var(--header-top)] inset-x-0 z-[49] duration-300",
        "max-lg:data-[state=open]:bg-background/90",
        className,
      )}
      id="header"
      role="banner"
      data-state={isNavOpen ? "open" : "close"}
      {...props}
    >
      <div className="absolute top-0 inset-x-0 h-[calc(var(--header-top)+var(--header-height)+2rem)] pointer-events-none bg-linear-to-b from-background via-background to-transparent lg:h-[calc(var(--header-top)+var(--header-height)+3rem)]" />

      <div className="relative flex items-center py-3.5 gap-x-3 text-sm h-[var(--header-height)] isolate duration-300 lg:gap-4">
        <Stack size="sm" wrap={false} className="mr-auto">
          <button
            type="button"
            onClick={() => setNavOpen(!isNavOpen)}
            className="block -m-1 -ml-1.5 lg:hidden"
          >
            <Hamburger className="size-7" />
          </button>

          <Logo />
        </Stack>

        <nav className="contents max-lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className={cx(navLinkVariants({ className: "gap-1" }))}>
              Khám phá{" "}
              <Icon
                name="lucide/chevron-down"
                className="group-data-[state=open]:-rotate-180 duration-200"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <NavLink href="/latest">
                  <Icon name="lucide/calendar-days" className="shrink-0 size-4 opacity-75" /> Mới
                  nhất
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink href="/coming-soon">
                  <Icon name="lucide/clock" className="shrink-0 size-4 opacity-75" /> Sắp ra mắt
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <NavLink href="/categories">
                  <Icon name="lucide/tags" className="shrink-0 size-4 opacity-75" /> Danh mục
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink href="/topics">
                  <Icon name="lucide/tag" className="shrink-0 size-4 opacity-75" /> Chủ đề
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NavLink href="/alternatives">Lựa chọn thay thế</NavLink>
          <NavLink href="/advertise">Quảng cáo</NavLink>
          {/* <NavLink href="/submit">Submit</NavLink> */}
        </nav>

        <Stack size="sm" className="max-sm:hidden">
          <ThemeToggle />

          <Suspense fallback={<Icon name="lucide/search" className="size-4" />}>
            <SearchForm />
          </Suspense>

          {/* <NavLink
            href={config.links.twitter}
            target="_blank"
            rel="nofollow noreferrer"
            title="Follow us on X"
          >
            <Icon name="tabler/brand-x" className="size-4" />
          </NavLink>

          <NavLink
            href={config.links.bluesky}
            target="_blank"
            rel="nofollow noreferrer"
            title="Follow us on Bluesky"
          >
            <Icon name="tabler/brand-bluesky" className="size-4" />
          </NavLink>

          <NavLink
            href={config.links.github}
            target="_blank"
            rel="nofollow noreferrer"
            title="View source code"
          >
            <Icon name="tabler/brand-github" className="size-4" />
          </NavLink> */}
        </Stack>

        <UserMenu session={session} />
      </div>

      <nav
        className={cx(
          "absolute top-full inset-x-0 h-[calc(100dvh-var(--header-top)-var(--header-height))] -mt-px py-4 px-6 grid grid-cols-2 place-items-start place-content-start gap-x-4 gap-y-6 bg-background/90 backdrop-blur-lg transition-opacity lg:hidden",
          isNavOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <NavLink href="/latest" className="text-base">
          Mới nhất
        </NavLink>
        <NavLink href="/coming-soon" className="text-base">
          Sắp ra mắt
        </NavLink>
        <NavLink href="/alternatives" className="text-base">
          Lựa chọn thay thế
        </NavLink>
        <NavLink href="/categories" className="text-base">
          Danh mục
        </NavLink>
        <NavLink href="/topics" className="text-base">
          Chủ đề
        </NavLink>
        <NavLink href="/advertise" className="text-base">
          Quảng cáo
        </NavLink>
        <NavLink href="/about" className="text-base">
          About
        </NavLink>
      </nav>
    </Container>
  )
}

import { useCompletion } from "@ai-sdk/react"
import { slugify } from "@curiousleaf/utils"
import { kebabCase } from "change-case"
import { useEffect, useState } from "react"
import { AnimatedContainer } from "~/components/common/animated-container"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/common/command"
import { Input } from "~/components/common/input"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/common/popover"
import { Separator } from "~/components/common/separator"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { Icon } from "../common/icon"

type Topic = {
  slug: string
}

type TopicSelectorProps = {
  selectedSlugs: string[]
  websiteUrl?: string
  onChange: (selectedSlugs: string[]) => void
}

export const TopicSelector = ({ selectedSlugs, websiteUrl, onChange }: TopicSelectorProps) => {
  const [newTopic, setNewTopic] = useState("")
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { complete } = useCompletion({
    api: "/api/ai/completion",
    onFinish: (_, completion) => {
      if (completion) {
        const topics = completion
          .split(",")
          .map(slug => slug.trim())
          .filter(Boolean)
          .filter((slug, index, self) => self.indexOf(slug) === index)
          .slice(0, 8)

        setSuggestedTopics(topics)
        setIsLoading(false)
      }
    },
  })

  useEffect(() => {
    if (websiteUrl && !selectedSlugs.length && !suggestedTopics.length) {
      setIsLoading(true)
      complete(`Based on the website ${websiteUrl}, suggest 3-8 relevant topic tags for this tool.
        
        Only return the topic tags in comma-separated format, using kebab-case (lowercase words separated by hyphens), and nothing else.
        For example: "ai, machine-learning, text-generation, image-recognition"
        Topics should be single words or short phrases specific to the tool's domain.
        If you cannot determine suitable topics, return "ai, tool".
      `)
    }
  }, [websiteUrl, selectedSlugs])

  const addTopic = (topic: string) => {
    const slug = kebabCase(topic.trim().toLowerCase())
    if (slug && !selectedSlugs.includes(slug)) {
      onChange([...selectedSlugs, slug])
      setNewTopic("")
    }
  }

  const removeTopic = (slug: string) => {
    onChange(selectedSlugs.filter(s => s !== slug))
  }

  return (
    <Stack direction="column" className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="md"
            className="justify-start w-full px-3 gap-2.5"
            prefix={<Icon name="lucide/tag" />}
            suffix={
              <Badge variant="outline" className="ml-auto size-auto">
                {selectedSlugs.length}
              </Badge>
            }
          >
            <Separator orientation="vertical" />

            <Stack size="xs">
              {!selectedSlugs.length && (
                <span className="font-normal text-muted-foreground">Quản lý topics</span>
              )}

              {selectedSlugs.map(slug => (
                <Badge key={slug}>{slug}</Badge>
              ))}
            </Stack>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Tìm hoặc tạo topic mới..."
              value={newTopic}
              onValueChange={setNewTopic}
            />
            <CommandList>
              <CommandEmpty>
                {newTopic ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => addTopic(newTopic)}
                  >
                    Thêm topic <Badge className="ml-2">{kebabCase(newTopic)}</Badge>
                  </Button>
                ) : (
                  "Không có topic nào."
                )}
              </CommandEmpty>
              <CommandGroup>
                {selectedSlugs.map(slug => (
                  <CommandItem key={slug} onSelect={() => removeTopic(slug)} className="gap-2">
                    <input
                      type="checkbox"
                      checked={true}
                      readOnly
                      className="pointer-events-none"
                    />
                    <span>{slug}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>

            <div className="p-2 border-t">
              <form
                className="flex gap-2"
                onSubmit={e => {
                  e.preventDefault()
                  addTopic(newTopic)
                }}
              >
                <Input
                  placeholder="Thêm topic mới"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newTopic}>
                  Thêm
                </Button>
              </form>
            </div>

            {!!selectedSlugs.length && (
              <div className="p-1 border-t">
                <Button variant="ghost" onClick={() => onChange([])} className="w-full">
                  Xóa tất cả
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      <AnimatedContainer height transition={{ ease: "linear", duration: 0.1 }}>
        {!!suggestedTopics.length && (
          <Stack size="sm" className="items-start">
            <Tooltip tooltip="Các topics được đề xuất bởi AI dựa trên nội dung website. Nhấp vào một topic để thêm.">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Đề xuất từ AI:</span>
                {isLoading && <Icon name="lucide/loader-2" className="w-3 h-3 animate-spin" />}
              </div>
            </Tooltip>

            <Stack size="xs" className="flex-1 flex-wrap">
              {suggestedTopics.map(slug => (
                <Badge key={slug} size="sm" variant="warning" asChild>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedSlugs.includes(slug)) {
                        onChange([...selectedSlugs, slug])
                      }
                      setSuggestedTopics(topics => topics.filter(t => t !== slug))
                    }}
                  >
                    {slug}
                  </button>
                </Badge>
              ))}
            </Stack>
          </Stack>
        )}
      </AnimatedContainer>
    </Stack>
  )
}

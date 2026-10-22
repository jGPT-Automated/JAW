import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { siteUrl, type Status } from "@/lc/data"

export function PromptsTab({
  status,
  prompts,
}: {
  status: Status
  prompts: Record<string, string>
}) {
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-2">
      {status.prompts.map((p) => (
        <Card key={p.id} className="min-w-0">
          <CardHeader>
            <CardTitle>{p.title}</CardTitle>
            <CardDescription>{p.summary}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <CodeBlock>
              <CodeBlockHeader>
                <CodeBlockTitle>{p.file}</CodeBlockTitle>
                <CodeBlockActions>
                  <CodeBlockCopyButton value={prompts[p.file] ?? ""} />
                </CodeBlockActions>
              </CodeBlockHeader>
              <CodeBlockContent wrap className="max-h-80">
                {prompts[p.file] ?? ""}
              </CodeBlockContent>
            </CodeBlock>
            <Button variant="outline" size="sm" className="self-start" asChild>
              <a href={siteUrl(`agent/${p.file}`)} target="_blank" rel="noreferrer">
                Open markdown
                <ExternalLink />
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

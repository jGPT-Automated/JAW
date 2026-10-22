import { useMemo, useState } from "react"
import { FileCode2, FileText, FileJson2, ExternalLink } from "lucide-react"

import { FileDiff } from "@/components/agents/file-diff"
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/motion/file-tree"
import { Badge } from "@/components/ui/badge"
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
import { REPO_URL, type Files } from "@/lc/data"

function iconFor(path: string) {
  if (path.endsWith(".json"))
    return <FileJson2 className="size-4 text-amber-500" />
  if (path.endsWith(".md")) return <FileText className="size-4 text-muted-foreground" />
  return <FileCode2 className="size-4 text-sky-500" />
}

export function FilesTab({ files }: { files: Files }) {
  const [selected, setSelected] = useState(files.files[0].path)
  const file = useMemo(
    () => files.files.find((f) => f.path === selected) ?? files.files[0],
    [files, selected]
  )
  const diffText = file.lines?.map((l) => l.content).join("\n") ?? ""

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[18rem_1fr]">
      <Card size="sm" className="min-w-0 self-start">
        <CardHeader>
          <CardTitle>PR #{files.pr}</CardTitle>
          <CardDescription>{files.repo}</CardDescription>
        </CardHeader>
        <CardContent>
          <FileTree
            ariaLabel="Files changed"
            value={selected}
            onValueChange={setSelected}
            defaultExpandedIds={["docs", "runbooks"]}
          >
            <FileTreeFile value="app.json" name="app.json" icon={iconFor("app.json")} />
            <FileTreeFolder value="docs" name="docs">
              <FileTreeFolder value="runbooks" name="runbooks">
                <FileTreeFile
                  value="docs/runbooks/APP_STORE_SUBMISSION.md"
                  name="APP_STORE_SUBMISSION.md"
                  icon={iconFor(".md")}
                />
              </FileTreeFolder>
              <FileTreeFile
                value="docs/CURRENT_STATE.md"
                name="CURRENT_STATE.md"
                icon={iconFor(".md")}
              />
              <FileTreeFile
                value="docs/RELEASE.md"
                name="RELEASE.md"
                icon={iconFor(".md")}
              />
            </FileTreeFolder>
          </FileTree>
        </CardContent>
      </Card>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="min-w-0 text-lg font-semibold break-all">{file.path}</h2>
          <Badge variant="secondary">{file.status}</Badge>
          <Badge variant="outline">
            +{file.adds} −{file.dels}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{file.role}</p>

        {file.lines ? (
          <>
            <FileDiff
              key={file.path}
              file={file.path}
              lines={file.lines.map((l, i) => ({
                ...l,
                oldLine: l.type === "added" ? undefined : i + 1,
                newLine: l.type === "removed" ? undefined : i + 1,
              }))}
              status="complete"
              collapseOnComplete={false}
              maxHeight={360}
              language={file.path.endsWith(".json") ? "json" : "text"}
              copyText={diffText}
            />
            <p className="text-xs text-muted-foreground">{files.source}</p>
          </>
        ) : (
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>{file.path}</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={file.role} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent wrap>{`${file.role}\n\nThe full ${file.adds}-line change is in the pull request.`}</CodeBlockContent>
          </CodeBlock>
        )}

        <Button variant="outline" size="sm" className="self-start" asChild>
          <a
            href={`${REPO_URL}/pull/${files.pr}/files`}
            target="_blank"
            rel="noreferrer"
          >
            Open full diff on GitHub
            <ExternalLink />
          </a>
        </Button>
      </div>
    </div>
  )
}

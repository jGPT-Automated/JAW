import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { LoadError } from "@/hub/components/LoadError";
import { useInstructions, useSaveInstructions } from "@/hub/data/queries";

/** Jesse's standing instructions: added to every voice, phone and web conversation with JAW. */
export default function Instructions() {
  const current = useInstructions();
  const save = useSaveInstructions();
  const [text, setText] = useState("");
  useEffect(() => {
    if (current.data) setText(current.data.text);
  }, [current.data]);

  if (current.isPending) return <Spinner className="text-muted-foreground" />;
  if (current.isError) return <LoadError what="instructions" error={current.error} onRetry={() => current.refetch()} />;
  const changed = text.trim() !== current.data.text.trim();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-subheading font-semibold">Instructions</h2>
        <p className="text-caption text-muted-foreground">
          How JAW should work with you, in every conversation: on the web, on the phone and in texts. You can also say
          &ldquo;from now on…&rdquo; on a call; JAW reads the change back and saves it here when you say yes.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={14}
          maxLength={8000}
          aria-label="Standing instructions"
          placeholder={"For example:\nCall me Jess. Start each call with my top three open tasks.\nWhen I mention LocalCheck, file tasks under the LocalCheck project."}
          className="min-h-64 text-body"
        />
        <div className="flex items-center gap-3">
          <Button
            disabled={!changed || save.isPending}
            onClick={() =>
              save.mutate(text, {
                onSuccess: () => toast.success("Saved. JAW uses these from the next conversation."),
                onError: (e) => toast.error((e as Error).message),
              })
            }
          >
            Save
          </Button>
          {current.data.updated_at ? (
            <span className="text-caption text-muted-foreground">
              Last changed {formatDistanceToNowStrict(new Date(current.data.updated_at), { addSuffix: true })}
            </span>
          ) : null}
        </div>
      </section>

      <Collapsible className="rounded-2xl border bg-card p-4">
        <CollapsibleTrigger className="group flex w-full items-center justify-between text-caption font-medium text-muted-foreground">
          JAW&apos;s built-in rules (always on)
          <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-caption leading-relaxed text-muted-foreground">{current.data.base}</pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

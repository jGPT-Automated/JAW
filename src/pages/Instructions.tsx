import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { LoadError } from "@/hub/components/LoadError";
import { useInstructions, useSaveInstructions } from "@/hub/data/queries";

/** JAW's instructions, all of them: used in every voice, phone and web conversation. */
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
          Everything JAW is told before each conversation, on the web and on the phone. All of it is yours to edit. You can
          also say &ldquo;from now on…&rdquo; on a call; JAW reads the change back and saves it here when you say yes. Your
          memory and current projects are added after this automatically.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={24}
          maxLength={12000}
          aria-label="JAW's instructions"
          className="min-h-96 font-mono text-caption leading-relaxed"
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
          {!current.data.is_default ? (
            <Button
              variant="ghost"
              disabled={save.isPending}
              onClick={() =>
                save.mutate("", {
                  onSuccess: () => toast.success("Back to the default instructions."),
                  onError: (e) => toast.error((e as Error).message),
                })
              }
            >
              Reset to default
            </Button>
          ) : null}
          <span className="text-caption text-muted-foreground">
            {current.data.updated_at
              ? `Last changed ${formatDistanceToNowStrict(new Date(current.data.updated_at), { addSuffix: true })}`
              : "Using the default"}
          </span>
        </div>
      </section>
    </div>
  );
}

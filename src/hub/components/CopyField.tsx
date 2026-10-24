import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

export function CopyField({ value, label, secret = false }: { value: string; label: string; secret?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (insecure context); the value stays selectable.
    }
  };
  return (
    <InputGroup>
      <InputGroupInput
        readOnly
        aria-label={label}
        value={value}
        type={secret ? "password" : "text"}
        className="font-mono text-xs"
        onFocus={(e) => e.currentTarget.select()}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label={`Copy ${label}`} onClick={copy}>
          {copied ? <Check /> : <Copy />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

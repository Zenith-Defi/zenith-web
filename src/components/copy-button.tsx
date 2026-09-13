"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({ value, className, label }: { value: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard denied; leave state unchanged rather than fail loudly.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground", className)}
      aria-label={label ?? "Copy"}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label ?? "Copy"}
    </button>
  );
}

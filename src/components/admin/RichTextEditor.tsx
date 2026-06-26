"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2, Code, Quote, Eraser } from "lucide-react";

/**
 * Lightweight rich text editor (zero external deps).
 * - Visual mode: contentEditable WYSIWYG using execCommand.
 * - HTML mode: raw HTML source editing.
 * Emits HTML via onChange. Use for blog content, service/project body, etc.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write here…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [html, setHtml] = useState(value || "");

  // keep editor DOM in sync when switching back to visual or external value change
  useEffect(() => {
    if (mode === "visual" && ref.current && ref.current.innerHTML !== html) {
      ref.current.innerHTML = html;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function push(next: string) {
    setHtml(next);
    onChange(next);
  }

  function exec(cmd: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    if (ref.current) push(ref.current.innerHTML);
  }

  function onInput() {
    if (ref.current) push(ref.current.innerHTML);
  }

  function makeLink() {
    const url = window.prompt("Link URL (https://…)");
    if (url) exec("createLink", url);
  }

  const btn = "inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink/70 hover:bg-surface hover:text-ink";
  const sep = "mx-1 h-5 w-px self-center bg-line";

  return (
    <div className="rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line px-2 py-1.5">
        <button type="button" title="Bold" className={btn} onClick={() => exec("bold")}><Bold className="h-4 w-4" /></button>
        <button type="button" title="Italic" className={btn} onClick={() => exec("italic")}><Italic className="h-4 w-4" /></button>
        <span className={sep} />
        <button type="button" title="Heading 2" className={btn} onClick={() => exec("formatBlock", "<h2>")}><Heading2 className="h-4 w-4" /></button>
        <button type="button" title="Heading 3" className={btn} onClick={() => exec("formatBlock", "<h3>")}><Heading3 className="h-4 w-4" /></button>
        <button type="button" title="Paragraph" className={btn} onClick={() => exec("formatBlock", "<p>")}><Quote className="h-4 w-4" /></button>
        <span className={sep} />
        <button type="button" title="Bullet list" className={btn} onClick={() => exec("insertUnorderedList")}><List className="h-4 w-4" /></button>
        <button type="button" title="Numbered list" className={btn} onClick={() => exec("insertOrderedList")}><ListOrdered className="h-4 w-4" /></button>
        <button type="button" title="Link" className={btn} onClick={makeLink}><Link2 className="h-4 w-4" /></button>
        <button type="button" title="Clear formatting" className={btn} onClick={() => exec("removeFormat")}><Eraser className="h-4 w-4" /></button>
        <button
          type="button"
          title="HTML source"
          className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${mode === "html" ? "bg-ink text-white" : "text-ink/70 hover:bg-surface"}`}
          onClick={() => setMode((m) => (m === "visual" ? "html" : "visual"))}
        >
          <Code className="h-3.5 w-3.5" /> HTML
        </button>
      </div>

      {mode === "visual" ? (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={onInput}
          data-placeholder={placeholder}
          className="prose-cw min-h-[220px] px-4 py-3 text-[15px] leading-relaxed text-ink outline-none [&_h2]:mt-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_a]:text-accent [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&:empty]:before:text-secondary [&:empty]:before:content-[attr(data-placeholder)]"
        />
      ) : (
        <textarea
          value={html}
          onChange={(e) => push(e.target.value)}
          spellCheck={false}
          className="min-h-[220px] w-full resize-y px-4 py-3 font-mono text-[13px] leading-relaxed text-ink outline-none"
          placeholder="<p>Paste or write HTML…</p>"
        />
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";

/**
 * Injects admin-pasted raw HTML/JS (GTM, Meta Pixel, custom <script> blocks)
 * into <head> or <body>. dangerouslySetInnerHTML does NOT execute <script>
 * tags, so we re-create script nodes manually so they actually run.
 */
export function ScriptInjector({ html, target = "head" }: { html?: string; target?: "head" | "body" }) {
  useEffect(() => {
    const code = (html || "").trim();
    if (!code) return;

    const tpl = document.createElement("template");
    tpl.innerHTML = code;

    const container = target === "head" ? document.head : document.body;
    const added: Node[] = [];

    tpl.content.childNodes.forEach((node) => {
      let toAppend: Node;
      if (node.nodeName === "SCRIPT") {
        const old = node as HTMLScriptElement;
        const s = document.createElement("script");
        for (const attr of Array.from(old.attributes)) s.setAttribute(attr.name, attr.value);
        s.text = old.text;
        toAppend = s;
      } else {
        toAppend = node.cloneNode(true);
      }
      container.appendChild(toAppend);
      added.push(toAppend);
    });

    return () => {
      added.forEach((n) => {
        try {
          container.removeChild(n);
        } catch {
          /* already gone */
        }
      });
    };
  }, [html, target]);

  return null;
}

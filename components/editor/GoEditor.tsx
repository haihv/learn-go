"use client";
import { useRef, useMemo, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { go } from "@codemirror/lang-go";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { indentUnit } from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";

type GoEditorProps = {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  onCmdEnter?: () => void;
};

export default function GoEditor({ value, onChange, readOnly, onCmdEnter }: GoEditorProps) {
  const onCmdEnterRef = useRef(onCmdEnter);
  onCmdEnterRef.current = onCmdEnter;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Capture phase fires on the way DOWN the DOM tree, before CodeMirror's
    // contentDOM listener. stopPropagation() keeps CodeMirror from ever seeing
    // the event, so no newline is inserted.
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && onCmdEnterRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onCmdEnterRef.current();
      }
    };

    container.addEventListener("keydown", handler, { capture: true });
    return () => container.removeEventListener("keydown", handler, { capture: true });
  }, []); // stable — callback is always current via the ref

  const extensions = useMemo(() => [
    go(),
    EditorState.tabSize.of(4),
    indentUnit.of("\t"),
    keymap.of([indentWithTab]),
  ], []);

  return (
    <div ref={containerRef} className="rounded-lg overflow-hidden border border-navy-600">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={oneDark}
        minHeight="280px"
        className="font-mono"
        basicSetup={{ lineNumbers: true }}
        editable={!readOnly}
      />
    </div>
  );
}

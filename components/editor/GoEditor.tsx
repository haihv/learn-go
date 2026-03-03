"use client";
import { useRef, useMemo } from "react";
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
  // Ref pattern: the keymap extension is created once (empty useMemo deps),
  // but always calls the latest onCmdEnter by reading the ref at call time.
  const onCmdEnterRef = useRef(onCmdEnter);
  onCmdEnterRef.current = onCmdEnter;

  const extensions = useMemo(() => [
    go(),
    // Display tab characters as 4-space-wide
    EditorState.tabSize.of(4),
    // Tab key inserts a real tab character (consistent with gofmt style)
    indentUnit.of("\t"),
    keymap.of([
      indentWithTab,
      {
        key: "Mod-Enter",
        // returning true tells CodeMirror the event is handled,
        // which prevents the default newline insertion.
        run: () => { onCmdEnterRef.current?.(); return true; },
      },
    ]),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []); // stable — the ref handles the latest callback without recreating

  return (
    <div className="rounded-lg overflow-hidden border border-navy-600">
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

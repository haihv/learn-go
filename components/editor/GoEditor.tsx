"use client";
import CodeMirror from "@uiw/react-codemirror";
import { go } from "@codemirror/lang-go";
import { oneDark } from "@codemirror/theme-one-dark";

type GoEditorProps = {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
};

export default function GoEditor({ value, onChange, readOnly }: GoEditorProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-navy-600">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[go()]}
        theme={oneDark}
        minHeight="280px"
        className="font-mono"
        basicSetup={{ lineNumbers: true }}
        editable={!readOnly}
      />
    </div>
  );
}

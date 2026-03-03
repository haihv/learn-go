"use client";
import CodeMirror from "@uiw/react-codemirror";
import { go } from "@codemirror/lang-go";
import { oneDark } from "@codemirror/theme-one-dark";

type Props = {
  code: string;
};

export default function CodeBlock({ code }: Props) {
  return (
    <div className="rounded-lg overflow-hidden border border-navy-600 my-4">
      <CodeMirror
        value={code.trim()}
        extensions={[go()]}
        theme={oneDark}
        editable={false}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
          highlightActiveLine: false,
        }}
        className="font-mono text-sm"
      />
    </div>
  );
}

"use client";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CodeBlock = dynamic(() => import("../lesson/CodeBlock"), { ssr: false });

type Props = { instructions: string };

export default function LabInstructions({ instructions }: Props) {
  return (
    <div className="p-4 overflow-y-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ children, className }) {
            const childString = String(children);
            const isBlock =
              childString.includes("\n") ||
              (typeof className === "string" && className.startsWith("language-"));
            if (isBlock) {
              return <CodeBlock code={childString} />;
            }
            return (
              <code className="bg-navy-800 text-go-green text-sm px-1.5 py-0.5 rounded font-mono">
                {children}
              </code>
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-go-cyan text-2xl font-bold font-mono mt-6 mb-3">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-go-blue text-xl font-bold font-mono mt-5 mb-2">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-go-blue text-lg font-bold font-mono mt-4 mb-2">
                {children}
              </h3>
            );
          },
          p({ children }) {
            return <p className="text-slate-300 leading-relaxed mb-3">{children}</p>;
          },
          strong({ children }) {
            return <strong className="text-go-purple font-bold">{children}</strong>;
          },
          ul({ children }) {
            return (
              <ul className="text-slate-300 list-disc list-inside mb-4 space-y-1">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="text-slate-300 list-decimal list-inside mb-4 space-y-1">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="w-full border-collapse border border-navy-600 text-sm">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-navy-800">{children}</thead>;
          },
          tbody({ children }) {
            return <tbody>{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="border-t border-navy-600">{children}</tr>;
          },
          th({ children }) {
            return (
              <th className="px-4 py-2 text-left text-slate-300 font-semibold border-r border-navy-600 last:border-r-0">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-2 text-slate-400 border-r border-navy-600 last:border-r-0">
                {children}
              </td>
            );
          },
        }}
      >
        {instructions}
      </ReactMarkdown>
    </div>
  );
}

"use client";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CodeBlock = dynamic(() => import("./CodeBlock"), { ssr: false });

type Props = {
  content: string;
};

export default function LessonContent({ content }: Props) {
  return (
    <div className="prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const childString = String(children);
            const isBlock =
              childString.includes("\n") ||
              (typeof className === "string" && className.startsWith("language-"));

            if (isBlock) {
              return <CodeBlock code={childString} />;
            }

            return (
              <code
                className="bg-go-green/10 text-go-green border border-go-green/30 text-sm px-1.5 py-0.5 rounded font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-stone-900 text-3xl font-bold font-serif mt-6 mb-3">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-stone-900 text-2xl font-bold font-serif mt-5 mb-2">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-stone-800 text-lg font-bold font-serif mt-4 mb-2">
                {children}
              </h3>
            );
          },
          strong({ children }) {
            return (
              <strong className="text-stone-900 font-bold">{children}</strong>
            );
          },
          p({ children }) {
            return (
              <p className="text-stone-600 leading-relaxed mb-4">{children}</p>
            );
          },
          ul({ children }) {
            return (
              <ul className="text-stone-600 list-disc list-inside mb-4 space-y-1">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="text-stone-600 list-decimal list-inside mb-4 space-y-1">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-6">
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
              <th className="px-4 py-2 text-left text-stone-600 font-semibold border-r border-navy-600 last:border-r-0">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-2 text-stone-500 border-r border-navy-600 last:border-r-0">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

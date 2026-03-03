import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
              return (
                <pre className="bg-navy-800 rounded-lg p-4 overflow-x-auto my-4">
                  <code className="font-mono text-sm text-slate-200">{children}</code>
                </pre>
              );
            }

            return (
              <code
                className="bg-navy-800 text-go-green text-sm px-1.5 py-0.5 rounded font-mono"
                {...props}
              >
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
          strong({ children }) {
            return (
              <strong className="text-go-purple font-bold">{children}</strong>
            );
          },
          p({ children }) {
            return (
              <p className="text-slate-300 leading-relaxed mb-4">{children}</p>
            );
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

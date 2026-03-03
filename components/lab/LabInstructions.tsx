import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { instructions: string };

export default function LabInstructions({ instructions }: Props) {
  return (
    <div className="p-4 overflow-y-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ children, className }) {
            const isBlock = className?.startsWith("language-");
            if (isBlock) {
              return (
                <pre className="bg-navy-800 rounded-lg p-4 overflow-x-auto my-3">
                  <code className="font-mono text-sm text-slate-200">{children}</code>
                </pre>
              );
            }
            return (
              <code className="bg-navy-800 text-go-green text-sm px-1.5 py-0.5 rounded font-mono">
                {children}
              </code>
            );
          },
          h1({ children }) {
            return <h1 className="text-go-cyan font-bold font-mono">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-go-blue font-bold font-mono">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-go-blue font-bold font-mono">{children}</h3>;
          },
          p({ children }) {
            return <p className="text-slate-300 leading-relaxed mb-3">{children}</p>;
          },
          strong({ children }) {
            return <strong className="text-go-purple font-bold">{children}</strong>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside text-slate-300 mb-3">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside text-slate-300 mb-3">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-slate-300 mb-1">{children}</li>;
          },
        }}
      >
        {instructions}
      </ReactMarkdown>
    </div>
  );
}

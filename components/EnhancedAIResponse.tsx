import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';

interface EnhancedAIResponseProps {
  content: string;
  isRateLimited: boolean;
}

const EnhancedAIResponse: React.FC<EnhancedAIResponseProps> = ({ content, isRateLimited }) => {
  if (isRateLimited) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
        <p className="text-destructive font-semibold">Rate limit exceeded</p>
        <p className="text-sm text-muted-foreground mt-2">
          You've reached the maximum number of requests. Please wait a moment before trying again.
        </p>
      </div>
    );
  }

  const components: Components = {
    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-5 mb-3" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-lg font-medium mt-4 mb-2" {...props} />,
    p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
    li: ({node, ...props}) => <li className="mb-1" {...props} />,
    a: ({node, ...props}) => (
      <a
        className="text-blue-500 underline hover:text-blue-700 transition-colors duration-200"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    blockquote: ({node, ...props}) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
    ),
    code: ({node, className, children, ...props}: any) => {
      const { inline } = props;
      const match = /language-(\w+)/.exec(className || '');
      return !inline ? (
        <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 my-4 overflow-x-auto">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
          {children}
        </code>
      );
    },
    pre: ({node, ...props}) => <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 my-4 overflow-x-auto" {...props} />,
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default EnhancedAIResponse;


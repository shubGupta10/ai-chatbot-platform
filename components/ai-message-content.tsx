import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from 'next/link';
import { Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AIMessageContentProps {
  content: string;
  isTyping: boolean;
}

const AIMessageContent: React.FC<AIMessageContentProps> = ({ content, isTyping }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success('Message copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy message');
    });
  };

  const renderContent = (text: string) => {
    const paragraphs = text.split('\n\n');
    return paragraphs.map((paragraph, index) => {
      if (paragraph.trim().startsWith('*')) {
        const items = paragraph.split('*').filter(item => item.trim() !== '');
        return (
          <ul key={index} className="list-disc pl-5 space-y-2 marker:text-primary/60">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-secondary-foreground/90 hover:text-secondary-foreground transition-colors duration-200">
                {renderInlineContent(item.trim())}
              </li>
            ))}
          </ul>
        );
      } else if (paragraph.includes(':')) {
        const [title, ...content] = paragraph.split(':');
        return (
          <div key={index} className="mb-2 group">
            <strong className="text-primary group-hover:text-primary/90 transition-colors duration-200">
              {title.trim()}:
            </strong>
            <span className="text-secondary-foreground/90 group-hover:text-secondary-foreground transition-colors duration-200">
              {content.join(':').trim()}
            </span>
          </div>
        );
      } else {
        return (
          <p key={index} className="mb-4 text-secondary-foreground/90 hover:text-secondary-foreground leading-relaxed transition-colors duration-200">
            {renderInlineContent(paragraph)}
          </p>
        );
      }
    });
  };

  const renderInlineContent = (text: string) => {
    const parts = text.split(/(\[.*?\]$$.*?$$)/);
    return parts.map((part, index) => {
      if (part.startsWith('[')) {
        const linkMatch = part.match(/\[(.*?)\]$$(.*?)$$/);
        if (linkMatch) {
          const [_, linkText, url] = linkMatch;
          return (
            <Link
              key={index}
              href={url}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 underline transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkText}
            </Link>
          );
        }
      }
      return part;
    });
  };

  return (
    <Card className="p-4 bg-secondary/50 dark:bg-secondary/10 backdrop-blur-sm border-secondary/30 shadow-lg relative group transition-all duration-200 hover:shadow-xl hover:shadow-secondary/10">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-secondary/10 to-secondary/20 dark:from-secondary/10 dark:via-secondary/20 dark:to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-secondary dark:bg-secondary/20 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      <ScrollArea className="h-full max-h-[500px] pr-4">
        <div className="space-y-2 relative z-10">
          {renderContent(content)}
          {isTyping && (
            <span className="inline-block animate-pulse text-primary">▋</span>
          )}
        </div>
      </ScrollArea>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-1 rounded-full bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground/70 hover:text-secondary-foreground transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Copy message"
      >
        <Copy size={16} />
      </button>
    </Card>
  );
};

export default AIMessageContent;


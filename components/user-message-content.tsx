import React from 'react';
import { Card } from "@/components/ui/card";
import { Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserMessageContentProps {
  content: string;
}

const UserMessageContent: React.FC<UserMessageContentProps> = ({ content }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success('Message copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy message');
    });
  };

  return (
    <Card className="p-4 bg-primary text-primary-foreground shadow-lg relative overflow-hidden group transition-all duration-200 hover:shadow-xl hover:shadow-primary/10">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      <div className="relative z-10 whitespace-pre-wrap leading-relaxed">{content}</div>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-1 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground/70 hover:text-primary-foreground transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Copy message"
      >
        <Copy size={16} />
      </button>
    </Card>
  );
};

export default UserMessageContent;
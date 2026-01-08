import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Problem } from '@/types/database';

interface ProblemDescriptionProps {
  problem: Problem | null;
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  if (!problem) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a problem to begin
      </div>
    );
  }

  const difficultyColor = {
    easy: 'bg-easy text-success-foreground',
    medium: 'bg-medium text-warning-foreground',
    hard: 'bg-hard text-destructive-foreground',
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{problem.title}</h1>
            <Badge className={difficultyColor[problem.difficulty]}>
              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
            </Badge>
          </div>
          {problem.time_limit_seconds && (
            <p className="text-sm text-muted-foreground">
              Time Limit: {problem.time_limit_seconds} seconds
            </p>
          )}
        </div>

        {/* Problem Statement */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Problem Statement
          </h2>
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {problem.description}
            </ReactMarkdown>
          </div>
        </div>

        {/* Input Format */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Input Format
          </h2>
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {problem.input_format}
            </ReactMarkdown>
          </div>
        </div>

        {/* Output Format */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Output Format
          </h2>
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {problem.output_format}
            </ReactMarkdown>
          </div>
        </div>

        {/* Constraints */}
        {problem.constraints && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Constraints
            </h2>
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {problem.constraints}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

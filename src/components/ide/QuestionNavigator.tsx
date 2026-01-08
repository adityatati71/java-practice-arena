import { CheckCircle, Circle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Problem } from '@/types/database';

interface QuestionNavigatorProps {
  problems: Problem[];
  currentProblemId: string | null;
  solvedProblems: Set<string>;
  attemptedProblems: Set<string>;
  onSelectProblem: (problemId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function QuestionNavigator({
  problems,
  currentProblemId,
  solvedProblems,
  attemptedProblems,
  onSelectProblem,
  isCollapsed,
  onToggleCollapse,
}: QuestionNavigatorProps) {
  const getStatus = (problemId: string) => {
    if (solvedProblems.has(problemId)) return 'solved';
    if (attemptedProblems.has(problemId)) return 'attempted';
    return 'unsolved';
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'solved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'attempted':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const difficultyColor = {
    easy: 'text-easy',
    medium: 'text-medium',
    hard: 'text-hard',
  };

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-ide-sidebar border-r border-ide-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex flex-col gap-2 items-center">
          {problems.map((problem, index) => (
            <Button
              key={problem.id}
              variant={currentProblemId === problem.id ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8 relative"
              onClick={() => onSelectProblem(problem.id)}
            >
              <span className="text-xs">{index + 1}</span>
              <div className="absolute -top-1 -right-1">
                <StatusIcon status={getStatus(problem.id)} />
              </div>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 h-full bg-ide-sidebar border-r border-ide-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ide-border">
        <h2 className="text-sm font-semibold text-foreground">Problems</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onToggleCollapse}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Problem List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {problems.map((problem, index) => {
            const status = getStatus(problem.id);
            const isActive = currentProblemId === problem.id;

            return (
              <button
                key={problem.id}
                onClick={() => onSelectProblem(problem.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors',
                  isActive
                    ? 'bg-primary/20 text-foreground'
                    : 'hover:bg-ide-highlight text-muted-foreground hover:text-foreground'
                )}
              >
                <StatusIcon status={status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {index + 1}. {problem.title}
                  </p>
                  <p className={cn('text-xs capitalize', difficultyColor[problem.difficulty])}>
                    {problem.difficulty}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Stats */}
      <div className="p-4 border-t border-ide-border">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-success">{solvedProblems.size}</p>
            <p className="text-xs text-muted-foreground">Solved</p>
          </div>
          <div>
            <p className="text-lg font-bold text-warning">{attemptedProblems.size}</p>
            <p className="text-xs text-muted-foreground">Attempted</p>
          </div>
          <div>
            <p className="text-lg font-bold text-muted-foreground">
              {problems.length - solvedProblems.size - attemptedProblems.size}
            </p>
            <p className="text-xs text-muted-foreground">Unsolved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

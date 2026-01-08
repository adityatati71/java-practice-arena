import { Terminal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConsoleProps {
  output: string[];
  onClear: () => void;
}

export function Console({ output, onClear }: ConsoleProps) {
  return (
    <div className="h-full flex flex-col bg-ide-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-ide-border bg-ide-header">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Terminal className="h-4 w-4" />
          Console
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Output */}
      <ScrollArea className="flex-1">
        <div className="p-4 font-mono text-sm space-y-1">
          {output.length === 0 ? (
            <p className="text-muted-foreground">
              Click "Run" to execute your code...
            </p>
          ) : (
            output.map((line, index) => (
              <div
                key={index}
                className={
                  line.startsWith('✓') || line.includes('PASSED')
                    ? 'text-success'
                    : line.startsWith('✗') || line.startsWith('❌') || line.includes('FAILED')
                    ? 'text-destructive'
                    : line.startsWith('>')
                    ? 'text-info'
                    : 'text-foreground'
                }
              >
                {line}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

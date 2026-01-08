import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TestCase, TestResult } from '@/types/database';

interface TestCasePanelProps {
  testCases: TestCase[];
  results: TestResult[];
}

export function TestCasePanel({ testCases, results }: TestCasePanelProps) {
  const publicTestCases = testCases.filter(tc => !tc.is_hidden);
  const hiddenCount = testCases.filter(tc => tc.is_hidden).length;

  const getResult = (testCaseId: string) => {
    return results.find(r => r.testCaseId === testCaseId);
  };

  return (
    <div className="h-full flex flex-col bg-ide-panel">
      <Tabs defaultValue="testcases" className="flex-1 flex flex-col">
        <div className="border-b border-ide-border px-4">
          <TabsList className="bg-transparent h-10">
            <TabsTrigger 
              value="testcases"
              className="data-[state=active]:bg-ide-highlight"
            >
              Test Cases
            </TabsTrigger>
            <TabsTrigger 
              value="results"
              className="data-[state=active]:bg-ide-highlight"
            >
              Results
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="testcases" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {publicTestCases.map((testCase, index) => (
                <div 
                  key={testCase.id}
                  className="p-4 rounded-lg bg-ide-bg border border-ide-border"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-foreground">
                      Test Case {index + 1}
                    </span>
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Input:</p>
                      <pre className="bg-secondary p-2 rounded text-sm font-mono text-foreground">
                        {testCase.input}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Expected Output:</p>
                      <pre className="bg-secondary p-2 rounded text-sm font-mono text-foreground">
                        {testCase.expected_output}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}

              {hiddenCount > 0 && (
                <div className="p-4 rounded-lg bg-ide-bg border border-ide-border border-dashed">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <EyeOff className="h-4 w-4" />
                    <span className="text-sm">
                      {hiddenCount} hidden test case{hiddenCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="results" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {results.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Run your code to see results
                </p>
              ) : (
                results.map((result, index) => (
                  <div 
                    key={result.testCaseId}
                    className={`p-4 rounded-lg border ${
                      result.passed 
                        ? 'bg-success/10 border-success/30' 
                        : 'bg-destructive/10 border-destructive/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {result.passed ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-sm font-medium text-foreground">
                        {result.isHidden ? 'Hidden Test' : `Test Case ${index + 1}`}
                      </span>
                      <span className={`text-xs ${result.passed ? 'text-success' : 'text-destructive'}`}>
                        {result.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    
                    {!result.isHidden && (
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Input:</p>
                          <pre className="bg-secondary p-2 rounded font-mono text-foreground">
                            {result.input}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Expected:</p>
                          <pre className="bg-secondary p-2 rounded font-mono text-foreground">
                            {result.expectedOutput}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Actual:</p>
                          <pre className={`p-2 rounded font-mono ${
                            result.passed ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                          }`}>
                            {result.actualOutput}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

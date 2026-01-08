import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { IDEHeader } from '@/components/ide/IDEHeader';
import { QuestionNavigator } from '@/components/ide/QuestionNavigator';
import { ProblemDescription } from '@/components/ide/ProblemDescription';
import { CodeEditor } from '@/components/ide/CodeEditor';
import { Console } from '@/components/ide/Console';
import { TestCasePanel } from '@/components/ide/TestCasePanel';
import { useProblems, useProblem, useTestCases } from '@/hooks/useProblems';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { useToast } from '@/hooks/use-toast';
import type { TestResult } from '@/types/database';

export default function IDE() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: problems = [] } = useProblems();
  const { data: currentProblem } = useProblem(problemId);
  const { data: testCases = [] } = useTestCases(problemId);
  
  const [code, setCode] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [solvedProblems] = useState<Set<string>>(new Set());
  const [attemptedProblems] = useState<Set<string>>(new Set());
  
  const { isRunning, consoleOutput, runCode, runTestCases, clearConsole } = useCodeExecution();

  // Set initial problem and code
  useEffect(() => {
    if (problems.length > 0 && !problemId) {
      navigate(`/ide/${problems[0].id}`, { replace: true });
    }
  }, [problems, problemId, navigate]);

  useEffect(() => {
    if (currentProblem) {
      setCode(currentProblem.boilerplate_code);
      setResults([]);
      clearConsole();
    }
  }, [currentProblem]);

  const handleRun = async () => {
    if (!testCases.length) return;
    const publicTests = testCases.filter(tc => !tc.is_hidden);
    if (publicTests.length > 0) {
      const result = await runTestCases(code, publicTests);
      setResults(result);
    }
  };

  const handleSubmit = async () => {
    if (!testCases.length) return;
    const allResults = await runTestCases(code, testCases);
    setResults(allResults);
    
    const allPassed = allResults.every(r => r.passed);
    if (allPassed) {
      toast({ title: "Success!", description: "All test cases passed!" });
    } else {
      toast({ title: "Some tests failed", description: "Check the results panel", variant: "destructive" });
    }
  };

  const handleSelectProblem = (id: string) => {
    navigate(`/ide/${id}`);
  };

  return (
    <div className="h-screen flex flex-col bg-ide-bg">
      <IDEHeader
        onRun={handleRun}
        onSubmit={handleSubmit}
        isRunning={isRunning}
        problemTitle={currentProblem?.title}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <QuestionNavigator
          problems={problems}
          currentProblemId={problemId || null}
          solvedProblems={solvedProblems}
          attemptedProblems={attemptedProblems}
          onSelectProblem={handleSelectProblem}
          isCollapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
        />
        
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={35} minSize={20}>
              <ProblemDescription problem={currentProblem || null} />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={65} minSize={30}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={60} minSize={30}>
                  <CodeEditor code={code} onChange={setCode} />
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={40} minSize={20}>
                  <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={50}>
                      <Console output={consoleOutput} onClear={clearConsole} />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={50}>
                      <TestCasePanel testCases={testCases} results={results} />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}

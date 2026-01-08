import { useState } from 'react';
import type { TestCase, TestResult } from '@/types/database';

interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

// Mock Java execution - simulates running Java code
function mockExecuteJava(code: string, input: string): ExecutionResult {
  const startTime = performance.now();
  
  try {
    // Parse input for basic calculator problem
    const lines = input.trim().split('\n');
    
    // Check if it's a calculator problem (2 numbers and operator)
    if (lines.length >= 3 || (lines.length === 1 && lines[0].includes(' '))) {
      let num1: number, num2: number, operator: string;
      
      if (lines.length >= 3) {
        num1 = parseFloat(lines[0]);
        num2 = parseFloat(lines[1]);
        operator = lines[2].trim();
      } else {
        const parts = lines[0].split(' ');
        num1 = parseFloat(parts[0]);
        num2 = parseFloat(parts[1]);
        operator = parts[2];
      }
      
      // Check if code contains switch statement (required for the problem)
      if (!code.includes('switch')) {
        return {
          output: '',
          error: 'Compilation Error: Please use a switch statement as required.',
          executionTime: performance.now() - startTime,
        };
      }
      
      // Simulate calculation
      let result: number;
      switch (operator) {
        case '+':
          result = num1 + num2;
          break;
        case '-':
          result = num1 - num2;
          break;
        case '*':
          result = num1 * num2;
          break;
        case '/':
          if (num2 === 0) {
            return {
              output: 'Error: Division by zero',
              error: null,
              executionTime: performance.now() - startTime,
            };
          }
          result = num1 / num2;
          break;
        default:
          return {
            output: 'Error: Invalid operator',
            error: null,
            executionTime: performance.now() - startTime,
          };
      }
      
      // Format output similar to Java
      const output = Number.isInteger(result) ? result.toString() : result.toFixed(2);
      
      return {
        output,
        error: null,
        executionTime: performance.now() - startTime,
      };
    }
    
    // Default: echo input for other problems
    return {
      output: input,
      error: null,
      executionTime: performance.now() - startTime,
    };
  } catch (e) {
    return {
      output: '',
      error: `Runtime Error: ${e instanceof Error ? e.message : 'Unknown error'}`,
      executionTime: performance.now() - startTime,
    };
  }
}

export function useCodeExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  const runCode = async (code: string, input: string): Promise<ExecutionResult> => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, `> Running code...`]);
    
    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = mockExecuteJava(code, input);
    
    if (result.error) {
      setConsoleOutput(prev => [...prev, `❌ ${result.error}`]);
    } else {
      setConsoleOutput(prev => [...prev, `✓ Compiled successfully (${result.executionTime.toFixed(0)}ms)`, `Output: ${result.output}`]);
    }
    
    setIsRunning(false);
    return result;
  };

  const runTestCases = async (code: string, testCases: TestCase[]): Promise<TestResult[]> => {
    setIsRunning(true);
    setConsoleOutput([`> Running ${testCases.length} test case(s)...`]);
    
    const results: TestResult[] = [];
    
    for (const testCase of testCases) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = mockExecuteJava(code, testCase.input);
      const actualOutput = result.error ? result.error : result.output.trim();
      const passed = !result.error && actualOutput === testCase.expected_output.trim();
      
      results.push({
        testCaseId: testCase.id,
        input: testCase.input,
        expectedOutput: testCase.expected_output,
        actualOutput,
        passed,
        isHidden: testCase.is_hidden,
      });
      
      const status = passed ? '✓ PASSED' : '✗ FAILED';
      const label = testCase.is_hidden ? 'Hidden Test' : `Test ${testCase.order_index + 1}`;
      setConsoleOutput(prev => [...prev, `${status} - ${label}`]);
    }
    
    const passedCount = results.filter(r => r.passed).length;
    setConsoleOutput(prev => [...prev, ``, `Results: ${passedCount}/${testCases.length} passed`]);
    
    setIsRunning(false);
    return results;
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  return {
    isRunning,
    consoleOutput,
    runCode,
    runTestCases,
    clearConsole,
  };
}

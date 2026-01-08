export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type AppRole = 'admin' | 'user';

export interface Problem {
  id: string;
  title: string;
  description: string;
  input_format: string;
  output_format: string;
  constraints: string | null;
  difficulty: DifficultyLevel;
  boilerplate_code: string;
  time_limit_seconds: number | null;
  order_index: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TestCase {
  id: string;
  problem_id: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  order_index: number;
  created_at: string;
}

export interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  code: string;
  status: string;
  passed_tests: number;
  total_tests: number;
  execution_time_ms: number | null;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  problem_id: string;
  status: 'unsolved' | 'attempted' | 'solved';
  last_code: string | null;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface TestResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  isHidden: boolean;
}

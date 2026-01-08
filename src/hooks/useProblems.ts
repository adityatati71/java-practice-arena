import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Problem, TestCase, DifficultyLevel } from '@/types/database';

export function useProblems() {
  return useQuery({
    queryKey: ['problems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      return data as Problem[];
    },
  });
}

export function useProblem(id: string | undefined) {
  return useQuery({
    queryKey: ['problem', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Problem;
    },
    enabled: !!id,
  });
}

export function useTestCases(problemId: string | undefined) {
  return useQuery({
    queryKey: ['testCases', problemId],
    queryFn: async () => {
      if (!problemId) return [];
      
      const { data, error } = await supabase
        .from('test_cases')
        .select('*')
        .eq('problem_id', problemId)
        .order('order_index');
      
      if (error) throw error;
      return data as TestCase[];
    },
    enabled: !!problemId,
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (problem: Omit<Problem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('problems')
        .insert(problem)
        .select()
        .single();
      
      if (error) throw error;
      return data as Problem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}

export function useUpdateProblem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Problem> & { id: string }) => {
      const { data, error } = await supabase
        .from('problems')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Problem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: ['problem', data.id] });
    },
  });
}

export function useDeleteProblem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('problems')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}

export function useCreateTestCase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (testCase: Omit<TestCase, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('test_cases')
        .insert(testCase)
        .select()
        .single();
      
      if (error) throw error;
      return data as TestCase;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['testCases', data.problem_id] });
    },
  });
}

export function useDeleteTestCase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, problemId }: { id: string; problemId: string }) => {
      const { error } = await supabase
        .from('test_cases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return problemId;
    },
    onSuccess: (problemId) => {
      queryClient.invalidateQueries({ queryKey: ['testCases', problemId] });
    },
  });
}

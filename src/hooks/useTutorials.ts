
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Tutorial = Tables<'tutoriais'>;
type TutorialInsert = TablesInsert<'tutoriais'>;
type TutorialUpdate = TablesUpdate<'tutoriais'>;

export const useTutorials = () => {
  return useQuery({
    queryKey: ['tutoriais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutoriais')
        .select(`
          *,
          categorias (
            id,
            nome,
            cor
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTutorial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tutorial: TutorialInsert) => {
      const { data, error } = await supabase
        .from('tutoriais')
        .insert([tutorial])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutoriais'] });
    },
  });
};

export const useUpdateTutorial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: TutorialUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('tutoriais')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutoriais'] });
    },
  });
};

export const useDeleteTutorial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tutoriais')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutoriais'] });
    },
  });
};

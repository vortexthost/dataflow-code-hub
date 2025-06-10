
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
      
      if (error) {
        console.error('Erro ao buscar tutoriais:', error);
        throw error;
      }
      return data;
    },
  });
};

export const useCreateTutorial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tutorial: TutorialInsert) => {
      console.log('Tentando criar tutorial:', tutorial);
      const { data, error } = await supabase
        .from('tutoriais')
        .insert([tutorial])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar tutorial:', error);
        throw error;
      }
      console.log('Tutorial criado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutoriais'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de tutorial:', error);
    },
  });
};

export const useUpdateTutorial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: TutorialUpdate & { id: string }) => {
      console.log('Tentando atualizar tutorial:', { id, updates });
      const { data, error } = await supabase
        .from('tutoriais')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar tutorial:', error);
        throw error;
      }
      console.log('Tutorial atualizado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutoriais'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de atualização de tutorial:', error);
    },
  });
};

export const useDeleteTutorial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Tentando deletar tutorial:', id);
      const { error } = await supabase
        .from('tutoriais')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar tutorial:', error);
        throw error;
      }
      console.log('Tutorial deletado com sucesso');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutoriais'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de deleção de tutorial:', error);
    },
  });
};

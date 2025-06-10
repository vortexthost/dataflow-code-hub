
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Demo = Tables<'demos'>;
type DemoInsert = TablesInsert<'demos'>;

export const useDemos = () => {
  return useQuery({
    queryKey: ['demos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar demos:', error);
        throw error;
      }
      return data;
    },
  });
};

export const useCreateDemo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (demo: DemoInsert) => {
      console.log('Tentando criar demo:', demo);
      const { data, error } = await supabase
        .from('demos')
        .insert([demo])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar demo:', error);
        throw error;
      }
      console.log('Demo criado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demos'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de demo:', error);
    },
  });
};

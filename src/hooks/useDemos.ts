
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
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateDemo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (demo: DemoInsert) => {
      const { data, error } = await supabase
        .from('demos')
        .insert([demo])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demos'] });
    },
  });
};

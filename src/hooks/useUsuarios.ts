
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Usuario = Tables<'usuarios_sistema'>;
type UsuarioInsert = TablesInsert<'usuarios_sistema'>;
type UsuarioUpdate = TablesUpdate<'usuarios_sistema'>;

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios_sistema'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuarios_sistema')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (usuario: UsuarioInsert) => {
      const { data, error } = await supabase
        .from('usuarios_sistema')
        .insert([usuario])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios_sistema'] });
    },
  });
};

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: UsuarioUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('usuarios_sistema')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios_sistema'] });
    },
  });
};

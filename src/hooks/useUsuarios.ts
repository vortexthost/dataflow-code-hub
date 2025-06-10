
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
      
      if (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }
      return data;
    },
  });
};

export const useCreateUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (usuario: UsuarioInsert) => {
      console.log('Tentando criar usuário:', usuario);
      const { data, error } = await supabase
        .from('usuarios_sistema')
        .insert([usuario])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
      }
      console.log('Usuário criado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios_sistema'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de usuário:', error);
    },
  });
};

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: UsuarioUpdate & { id: string }) => {
      console.log('Tentando atualizar usuário:', { id, updates });
      const { data, error } = await supabase
        .from('usuarios_sistema')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
      }
      console.log('Usuário atualizado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios_sistema'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de atualização de usuário:', error);
    },
  });
};

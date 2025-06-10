
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Categoria = Tables<'categorias'>;
type CategoriaInsert = TablesInsert<'categorias'>;
type CategoriaUpdate = TablesUpdate<'categorias'>;

export const useCategories = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome');
      
      if (error) {
        console.error('Erro ao buscar categorias:', error);
        throw error;
      }
      return data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoria: CategoriaInsert) => {
      console.log('Tentando criar categoria:', categoria);
      const { data, error } = await supabase
        .from('categorias')
        .insert([categoria])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar categoria:', error);
        throw error;
      }
      console.log('Categoria criada com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de categoria:', error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: CategoriaUpdate & { id: string }) => {
      console.log('Tentando atualizar categoria:', { id, updates });
      const { data, error } = await supabase
        .from('categorias')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar categoria:', error);
        throw error;
      }
      console.log('Categoria atualizada com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de atualização de categoria:', error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Tentando deletar categoria:', id);
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar categoria:', error);
        throw error;
      }
      console.log('Categoria deletada com sucesso');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de deleção de categoria:', error);
    },
  });
};

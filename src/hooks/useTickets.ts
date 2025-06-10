
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Ticket = Tables<'tickets'>;
type TicketInsert = TablesInsert<'tickets'>;
type TicketUpdate = TablesUpdate<'tickets'>;

export const useTickets = () => {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          usuarios_sistema (
            id,
            nome,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar tickets:', error);
        throw error;
      }
      return data;
    },
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ticket: TicketInsert) => {
      console.log('Tentando criar ticket:', ticket);
      const { data, error } = await supabase
        .from('tickets')
        .insert([ticket])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar ticket:', error);
        throw error;
      }
      console.log('Ticket criado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de ticket:', error);
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: TicketUpdate & { id: string }) => {
      console.log('Tentando atualizar ticket:', { id, updates });
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar ticket:', error);
        throw error;
      }
      console.log('Ticket atualizado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de atualização de ticket:', error);
    },
  });
};

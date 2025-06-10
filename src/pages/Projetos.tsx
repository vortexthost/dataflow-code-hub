
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { useTickets, useCreateTicket } from '@/hooks/useTickets';
import { useUsuarios } from '@/hooks/useUsuarios';
import { toast } from 'sonner';

const Projetos = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [newTicket, setNewTicket] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta' | 'urgente'
  });

  const { data: tickets = [], isLoading: loadingTickets } = useTickets();
  const { data: usuarios = [], isLoading: loadingUsuarios } = useUsuarios();
  const createTicket = useCreateTicket();

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast.error('Selecione um usuário');
      return;
    }

    try {
      await createTicket.mutateAsync({
        ...newTicket,
        usuario_id: selectedUser
      });
      
      setNewTicket({ titulo: '', descricao: '', prioridade: 'media' });
      setSelectedUser('');
      setIsDialogOpen(false);
      toast.success('Projeto criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast.error('Erro ao criar projeto. Tente novamente.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto':
        return <Clock className="h-4 w-4" />;
      case 'em_andamento':
        return <AlertCircle className="h-4 w-4" />;
      case 'fechado':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'bg-yellow-600';
      case 'em_andamento':
        return 'bg-blue-600';
      case 'fechado':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa':
        return 'bg-green-600';
      case 'media':
        return 'bg-yellow-600';
      case 'alta':
        return 'bg-orange-600';
      case 'urgente':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loadingTickets || loadingUsuarios) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Carregando projetos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Projetos
            </h1>
            <p className="text-xl text-gray-300">
              Gerencie seus projetos e solicitações
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Novo Projeto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Usuário *
                  </label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Selecione um usuário" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {usuarios.filter(u => u.ativo).map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          {usuario.nome} ({usuario.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Título *
                  </label>
                  <Input
                    type="text"
                    value={newTicket.titulo}
                    onChange={(e) => setNewTicket({ ...newTicket, titulo: e.target.value })}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Título do projeto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição *
                  </label>
                  <Textarea
                    value={newTicket.descricao}
                    onChange={(e) => setNewTicket({ ...newTicket, descricao: e.target.value })}
                    required
                    rows={4}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Descrição detalhada do projeto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prioridade
                  </label>
                  <Select 
                    value={newTicket.prioridade} 
                    onValueChange={(value: 'baixa' | 'media' | 'alta' | 'urgente') => 
                      setNewTicket({ ...newTicket, prioridade: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={createTicket.isPending}
                >
                  {createTicket.isPending ? 'Criando...' : 'Criar Projeto'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg text-white line-clamp-2">
                    {ticket.titulo}
                  </CardTitle>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(ticket.status)}>
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1">
                        {ticket.status === 'aberto' ? 'Aberto' :
                         ticket.status === 'em_andamento' ? 'Em Andamento' : 'Fechado'}
                      </span>
                    </Badge>
                    <Badge className={getPriorityColor(ticket.prioridade)}>
                      {ticket.prioridade === 'baixa' ? 'Baixa' :
                       ticket.prioridade === 'media' ? 'Média' :
                       ticket.prioridade === 'alta' ? 'Alta' : 'Urgente'}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <p>Usuário: {ticket.usuarios_sistema?.nome}</p>
                  <p>Criado: {formatDate(ticket.created_at)}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {ticket.descricao}
                </p>
                {ticket.resposta && (
                  <div className="bg-gray-700 p-3 rounded mb-4">
                    <div className="flex items-center text-green-400 text-sm mb-2">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Resposta
                    </div>
                    <p className="text-gray-300 text-sm">
                      {ticket.resposta}
                    </p>
                    {ticket.respondido_em && (
                      <p className="text-gray-400 text-xs mt-2">
                        Respondido em: {formatDate(ticket.respondido_em)}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Nenhum projeto encontrado. Crie seu primeiro projeto!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Projetos;

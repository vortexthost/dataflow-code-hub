
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, LogIn, LogOut, Ticket, MessageSquare, Clock, CheckCircle } from 'lucide-react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  senha: string;
}

interface Ticket {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em_andamento' | 'fechado';
  usuarioId: string;
  criadoEm: string;
  respostas: TicketResposta[];
}

interface TicketResposta {
  id: string;
  mensagem: string;
  autor: string;
  criadoEm: string;
  isAdmin: boolean;
}

const Projetos = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [loginData, setLoginData] = useState({ email: '', senha: '' });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [novoTicket, setNovoTicket] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media' as const
  });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [novaResposta, setNovaResposta] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loggedUser = localStorage.getItem('helpdesk_user');
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      loadUserTickets(user.id);
    }
  }, []);

  const loadUserTickets = (usuarioId: string) => {
    const ticketsLocal = localStorage.getItem('helpdesk_tickets');
    if (ticketsLocal) {
      const allTickets: Ticket[] = JSON.parse(ticketsLocal);
      const userTickets = allTickets.filter(ticket => ticket.usuarioId === usuarioId);
      setTickets(userTickets);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const usuariosLocal = localStorage.getItem('helpdesk_usuarios');
    if (!usuariosLocal) {
      toast({
        title: "Erro no login",
        description: "Nenhum usuário cadastrado no sistema.",
        variant: "destructive",
      });
      return;
    }

    const usuarios: Usuario[] = JSON.parse(usuariosLocal);
    const usuario = usuarios.find(u => u.email === loginData.email && u.senha === loginData.senha && u.ativo);

    if (usuario) {
      setIsLoggedIn(true);
      setCurrentUser(usuario);
      localStorage.setItem('helpdesk_user', JSON.stringify(usuario));
      loadUserTickets(usuario.id);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${usuario.nome}!`,
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Email, senha incorretos ou usuário inativo.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setTickets([]);
    setSelectedTicket(null);
    setLoginData({ email: '', senha: '' });
    localStorage.removeItem('helpdesk_user');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoTicket.titulo.trim() || !novoTicket.descricao.trim() || !currentUser) {
      toast({
        title: "Erro",
        description: "Título e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const ticket: Ticket = {
      id: Date.now().toString(),
      titulo: novoTicket.titulo,
      descricao: novoTicket.descricao,
      prioridade: novoTicket.prioridade,
      status: 'aberto',
      usuarioId: currentUser.id,
      criadoEm: new Date().toISOString(),
      respostas: []
    };

    const ticketsLocal = localStorage.getItem('helpdesk_tickets');
    const allTickets: Ticket[] = ticketsLocal ? JSON.parse(ticketsLocal) : [];
    const updatedTickets = [...allTickets, ticket];
    
    localStorage.setItem('helpdesk_tickets', JSON.stringify(updatedTickets));
    loadUserTickets(currentUser.id);
    
    setNovoTicket({ titulo: '', descricao: '', prioridade: 'media' });
    setShowNewTicket(false);
    
    toast({
      title: "Projeto criado!",
      description: "Seu projeto foi criado com sucesso.",
    });
  };

  const handleAddResposta = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaResposta.trim() || !selectedTicket || !currentUser) return;

    const resposta: TicketResposta = {
      id: Date.now().toString(),
      mensagem: novaResposta,
      autor: currentUser.nome,
      criadoEm: new Date().toISOString(),
      isAdmin: false
    };

    const ticketsLocal = localStorage.getItem('helpdesk_tickets');
    const allTickets: Ticket[] = ticketsLocal ? JSON.parse(ticketsLocal) : [];
    
    const updatedTickets = allTickets.map(ticket => 
      ticket.id === selectedTicket.id 
        ? { ...ticket, respostas: [...ticket.respostas, resposta] }
        : ticket
    );
    
    localStorage.setItem('helpdesk_tickets', JSON.stringify(updatedTickets));
    loadUserTickets(currentUser.id);
    
    const updatedTicket = updatedTickets.find(t => t.id === selectedTicket.id);
    if (updatedTicket) {
      setSelectedTicket(updatedTicket);
    }
    
    setNovaResposta('');
    
    toast({
      title: "Resposta adicionada!",
      description: "Sua mensagem foi enviada.",
    });
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'fechado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto': return <Ticket className="w-4 h-4" />;
      case 'em_andamento': return <Clock className="w-4 h-4" />;
      case 'fechado': return <CheckCircle className="w-4 h-4" />;
      default: return <Ticket className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl bg-card border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
                  <Ticket className="w-6 h-6" />
                  Área de Projetos
                </CardTitle>
                <CardDescription>
                  Faça login para acessar seus projetos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Digite seu email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <Input
                      id="senha"
                      type="password"
                      value={loginData.senha}
                      onChange={(e) => setLoginData(prev => ({ ...prev, senha: e.target.value }))}
                      placeholder="Digite sua senha"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (selectedTicket) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-foreground">Detalhes do Projeto</h1>
              <div className="flex gap-2">
                <Button onClick={() => setSelectedTicket(null)} variant="outline">
                  Voltar
                </Button>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            <Card className="shadow-lg bg-card border-border mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-primary">{selectedTicket.titulo}</CardTitle>
                    <CardDescription className="mt-2">
                      Criado em {formatDate(selectedTicket.criadoEm)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPrioridadeColor(selectedTicket.prioridade)}>
                      {selectedTicket.prioridade}
                    </Badge>
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedTicket.status)}
                        {selectedTicket.status.replace('_', ' ')}
                      </div>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{selectedTicket.descricao}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Conversas ({selectedTicket.respostas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTicket.respostas.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma conversa ainda
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedTicket.respostas.map((resposta) => (
                      <div 
                        key={resposta.id}
                        className={`p-4 rounded-lg ${
                          resposta.isAdmin 
                            ? 'bg-blue-50 border-l-4 border-blue-500' 
                            : 'bg-gray-50 border-l-4 border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-foreground">
                            {resposta.autor} {resposta.isAdmin && '(Administrador)'}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(resposta.criadoEm)}
                          </span>
                        </div>
                        <p className="text-foreground whitespace-pre-wrap">{resposta.mensagem}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedTicket.status !== 'fechado' && (
              <Card className="shadow-lg bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Adicionar Resposta</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddResposta} className="space-y-4">
                    <Textarea
                      value={novaResposta}
                      onChange={(e) => setNovaResposta(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      rows={4}
                    />
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Enviar Resposta
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Meus Projetos</h1>
              <p className="text-muted-foreground mt-2">
                Bem-vindo, {currentUser?.nome}! Gerencie seus projetos aqui.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowNewTicket(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {showNewTicket && (
            <Card className="shadow-lg bg-card border-border mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Criar Novo Projeto</CardTitle>
                <CardDescription>
                  Preencha os dados do seu novo projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título do Projeto</Label>
                    <Input
                      id="titulo"
                      value={novoTicket.titulo}
                      onChange={(e) => setNovoTicket(prev => ({ ...prev, titulo: e.target.value }))}
                      placeholder="Ex: Problema com integração..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <Select 
                      value={novoTicket.prioridade} 
                      onValueChange={(value: any) => setNovoTicket(prev => ({ ...prev, prioridade: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={novoTicket.descricao}
                      onChange={(e) => setNovoTicket(prev => ({ ...prev, descricao: e.target.value }))}
                      placeholder="Descreva detalhadamente o projeto..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Criar Projeto
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewTicket(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Lista de Projetos</CardTitle>
              <CardDescription>
                Seus projetos ({tickets.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum projeto criado ainda
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Respostas</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">
                          {ticket.titulo}
                        </TableCell>
                        <TableCell>
                          <Badge className={getPrioridadeColor(ticket.prioridade)}>
                            {ticket.prioridade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(ticket.status)}
                              {ticket.status.replace('_', ' ')}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(ticket.criadoEm)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {ticket.respostas.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => setSelectedTicket(ticket)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projetos;

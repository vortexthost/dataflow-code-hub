import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Eye, Edit, Trash2, Plus, Search, Tag, Image, Type, Palette, Mail, Users, Calendar, UserPlus, Ticket, MessageSquare, CheckCircle, Clock } from 'lucide-react';

interface Categoria {
  id: string;
  nome: string;
  cor: string;
}

interface Tutorial {
  id: number;
  titulo: string;
  conteudo: string;
  categoria: string;
  cor?: string;
  tamanhoFonte?: string;
  imagem?: string;
}

interface DemoRegistration {
  id: string;
  nome: string;
  email: string;
  empresa: string;
  objetivo: string;
  timestamp: string;
}

interface EmailSettings {
  subject: string;
  template: {
    subject: string;
    content: string;
  };
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  criadoEm: string;
}

interface HelpdeskTicket {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em_andamento' | 'fechado';
  usuarioId: string;
  usuarioNome?: string;
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

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ usuario: '', senha: '' });
  const [tutoriais, setTutoriais] = useState<Tutorial[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [demoRegistrations, setDemoRegistrations] = useState<DemoRegistration[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [helpdeskTickets, setHelpdeskTickets] = useState<HelpdeskTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(null);
  const [novaResposta, setNovaResposta] = useState('');
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    subject: 'Acesso à Demo - DataMigrate Pro',
    template: {
      subject: 'Acesso à Demo - DataMigrate Pro',
      content: `<h2>Olá, {{nome}}!</h2>
<p>Obrigado por se registrar para nossa demonstração.</p>
<p>Seus dados de acesso:</p>
<ul>
  <li><strong>Nome:</strong> {{nome}}</li>
  <li><strong>Email:</strong> {{email}}</li>
  <li><strong>Empresa:</strong> {{empresa}}</li>
</ul>
<p>Acesse nossa demo clicando no link abaixo:</p>
<a href="https://demo.datamigrate.com" style="background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Acessar Demo</a>
<p>Atenciosamente,<br>Equipe DataMigrate Pro</p>`
    }
  });
  
  const [novoTutorial, setNovoTutorial] = useState({ 
    titulo: '', 
    conteudo: '', 
    categoria: '', 
    cor: '#000000', 
    tamanhoFonte: 'text-sm',
    imagem: ''
  });
  const [novaCategoria, setNovaCategoria] = useState({ nome: '', cor: '#3b82f6' });
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    ativo: true
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCategoriaId, setEditingCategoriaId] = useState<string | null>(null);
  const [editingUsuarioId, setEditingUsuarioId] = useState<string | null>(null);
  const [expandedTutorial, setExpandedTutorial] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTutoriais, setFilteredTutoriais] = useState<Tutorial[]>([]);
  const [activeTab, setActiveTab] = useState<'tutoriais' | 'categorias' | 'demos' | 'email' | 'usuarios' | 'helpdesk'>('tutoriais');
  const { toast } = useToast();

  const coresDisponiveis = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  const tamanhosFont = [
    { value: 'text-xs', label: 'Muito Pequeno' },
    { value: 'text-sm', label: 'Pequeno' },
    { value: 'text-base', label: 'Normal' },
    { value: 'text-lg', label: 'Grande' },
    { value: 'text-xl', label: 'Muito Grande' },
    { value: 'text-2xl', label: 'Extra Grande' }
  ];

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'color', 'background', 'align', 'code-block'
  ];

  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  useEffect(() => {
    let filtered = tutoriais;
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = tutoriais.filter(tutorial =>
        tutorial.titulo.toLowerCase().includes(term) ||
        tutorial.conteudo.toLowerCase().includes(term) ||
        tutorial.categoria.toLowerCase().includes(term)
      );
    }
    
    setFilteredTutoriais(filtered);
  }, [searchTerm, tutoriais]);

  const loadData = () => {
    const categoriasLocal = localStorage.getItem('categorias_admin');
    if (categoriasLocal) {
      setCategorias(JSON.parse(categoriasLocal));
    } else {
      const categoriasDefault: Categoria[] = [
        { id: 'db-migration', nome: 'Database Migration', cor: '#3b82f6' },
        { id: 'api-integration', nome: 'API Integration', cor: '#10b981' },
        { id: 'file-processing', nome: 'File Processing', cor: '#f59e0b' },
        { id: 'data-validation', nome: 'Data Validation', cor: '#8b5cf6' },
        { id: 'monitoring', nome: 'Monitoring', cor: '#ec4899' },
        { id: 'authentication', nome: 'Authentication', cor: '#ef4444' },
        { id: 'cloud-services', nome: 'Cloud Services', cor: '#06b6d4' }
      ];
      setCategorias(categoriasDefault);
      localStorage.setItem('categorias_admin', JSON.stringify(categoriasDefault));
    }

    const tutoriaisLocal = localStorage.getItem('modelos_codigo');
    if (tutoriaisLocal) {
      const data = JSON.parse(tutoriaisLocal);
      const tutoriaisConvertidos = data.map((item: any) => ({
        ...item,
        conteudo: item.codigo || item.conteudo || '',
        cor: item.cor || '#000000',
        tamanhoFonte: item.tamanhoFonte || 'text-sm',
        imagem: item.imagem || ''
      }));
      setTutoriais(tutoriaisConvertidos);
    }

    const demoRegsLocal = localStorage.getItem('demo_registrations');
    if (demoRegsLocal) {
      setDemoRegistrations(JSON.parse(demoRegsLocal));
    }

    const emailSettingsLocal = localStorage.getItem('demo_email_settings');
    if (emailSettingsLocal) {
      setEmailSettings(JSON.parse(emailSettingsLocal));
    }

    const usuariosLocal = localStorage.getItem('helpdesk_usuarios');
    if (usuariosLocal) {
      setUsuarios(JSON.parse(usuariosLocal));
    }

    const ticketsLocal = localStorage.getItem('helpdesk_tickets');
    if (ticketsLocal) {
      const tickets: HelpdeskTicket[] = JSON.parse(ticketsLocal);
      const usuarios: Usuario[] = usuariosLocal ? JSON.parse(usuariosLocal) : [];
      
      const ticketsWithUserNames = tickets.map(ticket => ({
        ...ticket,
        usuarioNome: usuarios.find(u => u.id === ticket.usuarioId)?.nome || 'Usuário não encontrado'
      }));
      
      setHelpdeskTickets(ticketsWithUserNames);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginData.usuario === 'admin' && loginData.senha === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('admin_logged_in', 'true');
      loadData();
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel administrativo.",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_logged_in');
    setLoginData({ usuario: '', senha: '' });
  };

  const handleAddUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoUsuario.nome.trim() || !novoUsuario.email.trim() || !novoUsuario.senha.trim()) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const emailExists = usuarios.some(u => u.email === novoUsuario.email);
    if (emailExists) {
      toast({
        title: "Erro",
        description: "Já existe um usuário com este email.",
        variant: "destructive",
      });
      return;
    }

    const usuario: Usuario = {
      id: Date.now().toString(),
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      senha: novoUsuario.senha,
      ativo: novoUsuario.ativo,
      criadoEm: new Date().toISOString()
    };

    const novosUsuarios = [...usuarios, usuario];
    localStorage.setItem('helpdesk_usuarios', JSON.stringify(novosUsuarios));
    setUsuarios(novosUsuarios);
    setNovoUsuario({ nome: '', email: '', senha: '', ativo: true });
    
    toast({
      title: "Usuário adicionado!",
      description: "Novo usuário foi criado com sucesso.",
    });
  };

  const handleEditUsuario = (usuario: Usuario) => {
    setNovoUsuario({
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
      ativo: usuario.ativo
    });
    setEditingUsuarioId(usuario.id);
  };

  const handleUpdateUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUsuarioId) return;

    const novosUsuarios = usuarios.map(usuario =>
      usuario.id === editingUsuarioId
        ? { 
            ...usuario, 
            nome: novoUsuario.nome, 
            email: novoUsuario.email,
            senha: novoUsuario.senha,
            ativo: novoUsuario.ativo
          }
        : usuario
    );

    localStorage.setItem('helpdesk_usuarios', JSON.stringify(novosUsuarios));
    setUsuarios(novosUsuarios);
    setNovoUsuario({ nome: '', email: '', senha: '', ativo: true });
    setEditingUsuarioId(null);
    
    toast({
      title: "Usuário atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDeleteUsuario = (id: string) => {
    const novosUsuarios = usuarios.filter(usuario => usuario.id !== id);
    localStorage.setItem('helpdesk_usuarios', JSON.stringify(novosUsuarios));
    setUsuarios(novosUsuarios);
    
    toast({
      title: "Usuário removido!",
      description: "O usuário foi excluído com sucesso.",
    });
  };

  const handleTicketStatusChange = (ticketId: string, newStatus: string) => {
    const ticketsLocal = localStorage.getItem('helpdesk_tickets');
    if (!ticketsLocal) return;

    const allTickets: HelpdeskTicket[] = JSON.parse(ticketsLocal);
    const updatedTickets = allTickets.map(ticket =>
      ticket.id === ticketId ? { ...ticket, status: newStatus as any } : ticket
    );

    localStorage.setItem('helpdesk_tickets', JSON.stringify(updatedTickets));
    loadData();
    
    toast({
      title: "Status atualizado!",
      description: "O status do ticket foi alterado.",
    });
  };

  const handleAddAdminResposta = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaResposta.trim() || !selectedTicket) return;

    const resposta: TicketResposta = {
      id: Date.now().toString(),
      mensagem: novaResposta,
      autor: 'Administrador',
      criadoEm: new Date().toISOString(),
      isAdmin: true
    };

    const ticketsLocal = localStorage.getItem('helpdesk_tickets');
    const allTickets: HelpdeskTicket[] = ticketsLocal ? JSON.parse(ticketsLocal) : [];
    
    const updatedTickets = allTickets.map(ticket => 
      ticket.id === selectedTicket.id 
        ? { ...ticket, respostas: [...ticket.respostas, resposta] }
        : ticket
    );
    
    localStorage.setItem('helpdesk_tickets', JSON.stringify(updatedTickets));
    loadData();
    
    const updatedTicket = updatedTickets.find(t => t.id === selectedTicket.id);
    if (updatedTicket) {
      const usuarios: Usuario[] = JSON.parse(localStorage.getItem('helpdesk_usuarios') || '[]');
      setSelectedTicket({
        ...updatedTicket,
        usuarioNome: usuarios.find(u => u.id === updatedTicket.usuarioId)?.nome || 'Usuário não encontrado'
      });
    }
    
    setNovaResposta('');
    
    toast({
      title: "Resposta adicionada!",
      description: "Sua resposta foi enviada ao usuário.",
    });
  };

  const saveTutoriais = (novosTutoriais: Tutorial[]) => {
    localStorage.setItem('modelos_codigo', JSON.stringify(novosTutoriais));
    setTutoriais(novosTutoriais);
  };

  const saveCategorias = (novasCategorias: Categoria[]) => {
    localStorage.setItem('categorias_admin', JSON.stringify(novasCategorias));
    setCategorias(novasCategorias);
  };

  const saveEmailSettings = (settings: EmailSettings) => {
    localStorage.setItem('demo_email_settings', JSON.stringify(settings));
    setEmailSettings(settings);
  };

  const handleSaveEmailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmailSettings(emailSettings);
    toast({
      title: "Configurações salvas!",
      description: "As configurações de e-mail foram atualizadas.",
    });
  };

  const handleDeleteDemoRegistration = (id: string) => {
    const updatedRegistrations = demoRegistrations.filter(reg => reg.id !== id);
    setDemoRegistrations(updatedRegistrations);
    localStorage.setItem('demo_registrations', JSON.stringify(updatedRegistrations));
    
    toast({
      title: "Registro removido!",
      description: "O registro da demo foi excluído com sucesso.",
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
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

  const handleAddCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaCategoria.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    const novoId = Date.now().toString();
    const categoriaParaAdicionar: Categoria = {
      id: novoId,
      nome: novaCategoria.nome,
      cor: novaCategoria.cor
    };

    const novasCategorias = [...categorias, categoriaParaAdicionar];
    saveCategorias(novasCategorias);
    setNovaCategoria({ nome: '', cor: '#3b82f6' });
    
    toast({
      title: "Categoria adicionada!",
      description: "Nova categoria foi criada com sucesso.",
    });
  };

  const handleEditCategoria = (categoria: Categoria) => {
    setNovaCategoria({ nome: categoria.nome, cor: categoria.cor });
    setEditingCategoriaId(categoria.id);
  };

  const handleUpdateCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategoriaId) return;

    const novasCategorias = categorias.map(categoria =>
      categoria.id === editingCategoriaId
        ? { ...categoria, nome: novaCategoria.nome, cor: novaCategoria.cor }
        : categoria
    );

    saveCategorias(novasCategorias);
    setNovaCategoria({ nome: '', cor: '#3b82f6' });
    setEditingCategoriaId(null);
    
    toast({
      title: "Categoria atualizada!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDeleteCategoria = (id: string) => {
    const novasCategorias = categorias.filter(categoria => categoria.id !== id);
    saveCategorias(novasCategorias);
    
    toast({
      title: "Categoria removida!",
      description: "A categoria foi excluída com sucesso.",
    });
  };

  const handleAddTutorial = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoTutorial.titulo.trim() || !novoTutorial.conteudo.trim() || !novoTutorial.categoria.trim()) {
      toast({
        title: "Erro",
        description: "Título, categoria e conteúdo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const novoId = Math.max(...tutoriais.map(m => m.id), 0) + 1;
    const tutorialParaAdicionar = {
      id: novoId,
      titulo: novoTutorial.titulo,
      conteudo: novoTutorial.conteudo,
      categoria: novoTutorial.categoria,
      cor: novoTutorial.cor,
      tamanhoFonte: novoTutorial.tamanhoFonte,
      imagem: novoTutorial.imagem
    };

    const novosTutoriais = [...tutoriais, tutorialParaAdicionar];
    saveTutoriais(novosTutoriais);
    setNovoTutorial({ titulo: '', conteudo: '', categoria: '', cor: '#000000', tamanhoFonte: 'text-sm', imagem: '' });
    
    toast({
      title: "Tutorial adicionado!",
      description: "Novo tutorial foi criado com sucesso.",
    });
  };

  const handleEditTutorial = (tutorial: Tutorial) => {
    setNovoTutorial({ 
      titulo: tutorial.titulo, 
      conteudo: tutorial.conteudo, 
      categoria: tutorial.categoria,
      cor: tutorial.cor || '#000000',
      tamanhoFonte: tutorial.tamanhoFonte || 'text-sm',
      imagem: tutorial.imagem || ''
    });
    setEditingId(tutorial.id);
  };

  const handleUpdateTutorial = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId) return;

    const novosTutoriais = tutoriais.map(tutorial =>
      tutorial.id === editingId
        ? { 
            ...tutorial, 
            titulo: novoTutorial.titulo, 
            conteudo: novoTutorial.conteudo,
            categoria: novoTutorial.categoria,
            cor: novoTutorial.cor,
            tamanhoFonte: novoTutorial.tamanhoFonte,
            imagem: novoTutorial.imagem
          }
        : tutorial
    );

    saveTutoriais(novosTutoriais);
    setNovoTutorial({ titulo: '', conteudo: '', categoria: '', cor: '#000000', tamanhoFonte: 'text-sm', imagem: '' });
    setEditingId(null);
    
    toast({
      title: "Tutorial atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDeleteTutorial = (id: number) => {
    const novosTutoriais = tutoriais.filter(tutorial => tutorial.id !== id);
    saveTutoriais(novosTutoriais);
    
    toast({
      title: "Tutorial removido!",
      description: "O tutorial foi excluído com sucesso.",
    });
  };

  const cancelEdit = () => {
    setNovoTutorial({ titulo: '', conteudo: '', categoria: '', cor: '#000000', tamanhoFonte: 'text-sm', imagem: '' });
    setEditingId(null);
  };

  const cancelEditCategoria = () => {
    setNovaCategoria({ nome: '', cor: '#3b82f6' });
    setEditingCategoriaId(null);
  };

  const cancelEditUsuario = () => {
    setNovoUsuario({ nome: '', email: '', senha: '', ativo: true });
    setEditingUsuarioId(null);
  };

  const toggleExpanded = (id: number) => {
    setExpandedTutorial(expandedTutorial === id ? null : id);
  };

  const getPreviewContent = (conteudo: string, maxLines: number = 3) => {
    const textContent = conteudo.replace(/<[^>]*>/g, '');
    const lines = textContent.split('\n');
    if (lines.length <= maxLines) return textContent;
    return lines.slice(0, maxLines).join('\n') + '...';
  };

  const getCategoriaColor = (categoriaNome: string) => {
    const categoria = categorias.find(cat => cat.nome === categoriaNome);
    return categoria?.cor || '#3b82f6';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl bg-card border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">Área Administrativa</CardTitle>
                <CardDescription>
                  Faça login para acessar o painel de administração
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="usuario">Usuário</Label>
                    <Input
                      id="usuario"
                      type="text"
                      value={loginData.usuario}
                      onChange={(e) => setLoginData(prev => ({ ...prev, usuario: e.target.value }))}
                      placeholder="Digite seu usuário"
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
                    Entrar
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-accent/20 rounded text-sm text-accent-foreground">
                  <strong>Demo:</strong> use "admin" como usuário e "admin123" como senha
                </div>
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
                      Por: {selectedTicket.usuarioNome} - Criado em {formatDate(selectedTicket.criadoEm)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 flex-col">
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
                    <Select 
                      value={selectedTicket.status} 
                      onValueChange={(value) => handleTicketStatusChange(selectedTicket.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aberto">Aberto</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="fechado">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
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

            <Card className="shadow-lg bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Responder como Administrador</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAdminResposta} className="space-y-4">
                  <Textarea
                    value={novaResposta}
                    onChange={(e) => setNovaResposta(e.target.value)}
                    placeholder="Digite sua resposta..."
                    rows={4}
                  />
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enviar Resposta
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">Painel Administrativo</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>

          <div className="flex space-x-4 mb-8 flex-wrap">
            <Button
              onClick={() => setActiveTab('tutoriais')}
              variant={activeTab === 'tutoriais' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Type className="w-4 h-4" />
              Tutoriais
            </Button>
            <Button
              onClick={() => setActiveTab('categorias')}
              variant={activeTab === 'categorias' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              Categorias
            </Button>
            <Button
              onClick={() => setActiveTab('demos')}
              variant={activeTab === 'demos' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Demos ({demoRegistrations.length})
            </Button>
            <Button
              onClick={() => setActiveTab('email')}
              variant={activeTab === 'email' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              E-mail
            </Button>
            <Button
              onClick={() => setActiveTab('usuarios')}
              variant={activeTab === 'usuarios' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Usuários ({usuarios.length})
            </Button>
            <Button
              onClick={() => setActiveTab('helpdesk')}
              variant={activeTab === 'helpdesk' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              Projetos ({helpdeskTickets.length})
            </Button>
          </div>

          {activeTab === 'usuarios' && (
            <div className="grid xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <Card className="shadow-lg bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">
                      {editingUsuarioId ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
                    </CardTitle>
                    <CardDescription>
                      {editingUsuarioId ? 'Modifique os campos abaixo' : 'Crie um novo usuário para acessar os projetos'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={editingUsuarioId ? handleUpdateUsuario : handleAddUsuario} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomeUsuario">Nome</Label>
                        <Input
                          id="nomeUsuario"
                          type="text"
                          value={novoUsuario.nome}
                          onChange={(e) => setNovoUsuario(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Ex: João Silva"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emailUsuario">Email</Label>
                        <Input
                          id="emailUsuario"
                          type="email"
                          value={novoUsuario.email}
                          onChange={(e) => setNovoUsuario(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Ex: joao@empresa.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="senhaUsuario">Senha</Label>
                        <Input
                          id="senhaUsuario"
                          type="password"
                          value={novoUsuario.senha}
                          onChange={(e) => setNovoUsuario(prev => ({ ...prev, senha: e.target.value }))}
                          placeholder="Digite a senha"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="ativoUsuario"
                          checked={novoUsuario.ativo}
                          onCheckedChange={(checked) => setNovoUsuario(prev => ({ ...prev, ativo: checked }))}
                        />
                        <Label htmlFor="ativoUsuario">Usuário ativo</Label>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          type="submit" 
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          {editingUsuarioId ? 'Atualizar Usuário' : 'Adicionar Usuário'}
                        </Button>
                        
                        {editingUsuarioId && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={cancelEditUsuario}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="xl:col-span-2">
                <Card className="shadow-lg bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">Usuários Cadastrados</CardTitle>
                    <CardDescription>
                      Gerencie os usuários do sistema ({usuarios.length} total)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {usuarios.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhum usuário cadastrado ainda
                      </p>
                    ) : (
                      <div className="space-y-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Criado em</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {usuarios.map((usuario) => (
                              <TableRow key={usuario.id}>
                                <TableCell className="font-medium">
                                  {usuario.nome}
                                </TableCell>
                                <TableCell>
                                  {usuario.email}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={usuario.ativo ? "default" : "secondary"}>
                                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {formatDate(usuario.criadoEm)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditUsuario(usuario)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeleteUsuario(usuario.id)}
                                      className="h-8 w-8 p-0 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'helpdesk' && (
            <Card className="shadow-lg bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Projetos (HelpDesk)
                </CardTitle>
                <CardDescription>
                  Visualize e responda aos projetos dos usuários ({helpdeskTickets.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {helpdeskTickets.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum projeto criado ainda
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Prioridade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Criado em</TableHead>
                          <TableHead>Respostas</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {helpdeskTickets.map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium">
                              {ticket.titulo}
                            </TableCell>
                            <TableCell>
                              {ticket.usuarioNome}
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
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {formatDate(ticket.criadoEm)}
                              </div>
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
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'tutoriais' && (
            <div className="space-y-8">
              <Card className="shadow-lg bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    {editingId ? 'Editar Tutorial' : 'Criar Novo Tutorial'}
                  </CardTitle>
                  <CardDescription>
                    {editingId ? 'Modifique os campos abaixo para atualizar o tutorial' : 'Use o editor completo para criar um tutorial rico em conteúdo'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingId ? handleUpdateTutorial : handleAddTutorial} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="titulo">Título do Tutorial</Label>
                        <Input
                          id="titulo"
                          type="text"
                          value={novoTutorial.titulo}
                          onChange={(e) => setNovoTutorial(prev => ({ ...prev, titulo: e.target.value }))}
                          placeholder="Ex: Como configurar um banco de dados PostgreSQL"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="categoria">Categoria</Label>
                        <Select 
                          value={novoTutorial.categoria} 
                          onValueChange={(value) => setNovoTutorial(prev => ({ ...prev, categoria: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map((categoria) => (
                              <SelectItem key={categoria.id} value={categoria.nome}>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: categoria.cor }}
                                  />
                                  {categoria.nome}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conteudo">Conteúdo do Tutorial</Label>
                      <div className="border rounded-lg">
                        <ReactQuill
                          theme="snow"
                          value={novoTutorial.conteudo}
                          onChange={(value) => setNovoTutorial(prev => ({ ...prev, conteudo: value }))}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="Escreva o conteúdo do tutorial aqui... Você pode incluir imagens, formatações de texto, códigos e muito mais!"
                          style={{ 
                            minHeight: '400px',
                            backgroundColor: 'white'
                          }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Use a barra de ferramentas para formatar o texto, inserir imagens, criar listas e muito mais.
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      {editingId && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={cancelEdit}
                        >
                          Cancelar
                        </Button>
                      )}
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90"
                      >
                        {editingId ? 'Atualizar Tutorial' : 'Criar Tutorial'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Tutoriais Cadastrados</CardTitle>
                  <CardDescription>
                    Gerencie os tutoriais existentes ({tutoriais.length} total)
                  </CardDescription>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Buscar por título, conteúdo ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredTutoriais.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      {searchTerm ? `Nenhum tutorial encontrado para "${searchTerm}"` : 'Nenhum tutorial cadastrado ainda'}
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Conteúdo</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTutoriais.map((tutorial) => (
                            <TableRow key={tutorial.id}>
                              <TableCell className="font-medium">
                                <div 
                                  style={{ color: tutorial.cor }}
                                  className={tutorial.tamanhoFonte}
                                >
                                  {tutorial.titulo}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="secondary" 
                                  style={{ backgroundColor: `${getCategoriaColor(tutorial.categoria)}20`, color: getCategoriaColor(tutorial.categoria) }}
                                >
                                  {tutorial.categoria}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="bg-muted rounded p-2 text-xs max-w-xs overflow-hidden">
                                  <div 
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ 
                                      __html: expandedTutorial === tutorial.id 
                                        ? tutorial.conteudo 
                                        : getPreviewContent(tutorial.conteudo, 2) 
                                    }}
                                  />
                                  {tutorial.conteudo.length > 200 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleExpanded(tutorial.id)}
                                      className="mt-1 h-6 text-xs"
                                    >
                                      {expandedTutorial === tutorial.id ? 'Ver menos' : 'Ver mais'}
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditTutorial(tutorial)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteTutorial(tutorial.id)}
                                    className="h-8 w-8 p-0 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'categorias' && (
            <div className="grid xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <Card className="shadow-lg bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">
                      {editingCategoriaId ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
                    </CardTitle>
                    <CardDescription>
                      {editingCategoriaId ? 'Modifique os campos abaixo' : 'Crie uma nova categoria para organizar os tutoriais'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={editingCategoriaId ? handleUpdateCategoria : handleAddCategoria} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomeCategoria">Nome da Categoria</Label>
                        <Input
                          id="nomeCategoria"
                          type="text"
                          value={novaCategoria.nome}
                          onChange={(e) => setNovaCategoria(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Ex: Machine Learning"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="corCategoria">Cor da Categoria</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {coresDisponiveis.map((cor) => (
                            <button
                              key={cor}
                              type="button"
                              onClick={() => setNovaCategoria(prev => ({ ...prev, cor }))}
                              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                novaCategoria.cor === cor ? 'border-primary scale-110' : 'border-border'
                              }`}
                              style={{ backgroundColor: cor }}
                            />
                          ))}
                        </div>
                        <Input
                          id="corCategoria"
                          type="color"
                          value={novaCategoria.cor}
                          onChange={(e) => setNovaCategoria(prev => ({ ...prev, cor: e.target.value }))}
                          className="w-full h-10"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          type="submit" 
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          {editingCategoriaId ? 'Atualizar Categoria' : 'Adicionar Categoria'}
                        </Button>
                        
                        {editingCategoriaId && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={cancelEditCategoria}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="xl:col-span-2">
                <Card className="shadow-lg bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">Categorias Cadastradas</CardTitle>
                    <CardDescription>
                      Gerencie as categorias dos tutoriais ({categorias.length} total)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {categorias.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhuma categoria cadastrada ainda
                      </p>
                    ) : (
                      <div className="space-y-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome</TableHead>
                              <TableHead>Cor</TableHead>
                              <TableHead>Preview</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categorias.map((categoria) => (
                              <TableRow key={categoria.id}>
                                <TableCell className="font-medium">
                                  {categoria.nome}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-4 h-4 rounded-full border" 
                                      style={{ backgroundColor: categoria.cor }}
                                    />
                                    <span className="text-sm text-muted-foreground font-mono">
                                      {categoria.cor}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="secondary" 
                                    style={{ backgroundColor: `${categoria.cor}20`, color: categoria.cor }}
                                  >
                                    {categoria.nome}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditCategoria(categoria)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeleteCategoria(categoria.id)}
                                      className="h-8 w-8 p-0 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'demos' && (
            <Card className="shadow-lg bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registros de Demo
                </CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os registros de demonstração ({demoRegistrations.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {demoRegistrations.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum registro de demo ainda
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Objetivo</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {demoRegistrations.map((registration) => (
                          <TableRow key={registration.id}>
                            <TableCell className="font-medium">
                              {registration.nome}
                            </TableCell>
                            <TableCell>
                              {registration.email}
                            </TableCell>
                            <TableCell>
                              {registration.empresa}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {registration.objetivo}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {formatDate(registration.timestamp)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteDemoRegistration(registration.id)}
                                className="h-8 w-8 p-0 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'email' && (
            <Card className="shadow-lg bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Configurações de E-mail
                </CardTitle>
                <CardDescription>
                  Configure o modelo de e-mail enviado aos usuários que se registram para a demo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveEmailSettings} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="emailSubject">Assunto do E-mail</Label>
                    <Input
                      id="emailSubject"
                      type="text"
                      value={emailSettings.template.subject}
                      onChange={(e) => setEmailSettings(prev => ({
                        ...prev,
                        template: { ...prev.template, subject: e.target.value }
                      }))}
                      placeholder="Ex: Acesso à Demo - DataMigrate Pro"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailContent">Conteúdo do E-mail</Label>
                    <div className="border rounded-lg">
                      <ReactQuill
                        theme="snow"
                        value={emailSettings.template.content}
                        onChange={(value) => setEmailSettings(prev => ({
                          ...prev,
                          template: { ...prev.template, content: value }
                        }))}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Escreva o conteúdo do e-mail aqui..."
                        style={{ 
                          minHeight: '300px',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Use as seguintes variáveis no template:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li><code>{'{{nome}}'}</code> - Nome do usuário</li>
                        <li><code>{'{{email}}'}</code> - E-mail do usuário</li>
                        <li><code>{'{{empresa}}'}</code> - Nome da empresa</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90"
                  >
                    Salvar Configurações
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
};

export default Admin;

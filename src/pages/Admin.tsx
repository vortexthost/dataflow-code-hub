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
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

interface Modelo {
  id: number;
  titulo: string;
  codigo: string;
  categoria: string;
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ usuario: '', senha: '' });
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [novoModelo, setNovoModelo] = useState({ titulo: '', codigo: '', categoria: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedModel, setExpandedModel] = useState<number | null>(null);
  const { toast } = useToast();

  const categorias = [
    'Database Migration',
    'API Integration', 
    'File Processing',
    'Data Validation',
    'Monitoring',
    'Authentication',
    'Cloud Services'
  ];

  // Verificar se já está logado
  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      loadModelos();
    }
  }, []);

  const loadModelos = () => {
    // Simular carregamento do backend
    const modelosLocal = localStorage.getItem('modelos_codigo');
    if (modelosLocal) {
      setModelos(JSON.parse(modelosLocal));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de login (em produção, validar no backend)
    if (loginData.usuario === 'admin' && loginData.senha === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('admin_logged_in', 'true');
      loadModelos();
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

  const saveModelos = (novosModelos: Modelo[]) => {
    localStorage.setItem('modelos_codigo', JSON.stringify(novosModelos));
    setModelos(novosModelos);
  };

  const handleAddModelo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoModelo.titulo.trim() || !novoModelo.codigo.trim() || !novoModelo.categoria.trim()) {
      toast({
        title: "Erro",
        description: "Título, categoria e código são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const novoId = Math.max(...modelos.map(m => m.id), 0) + 1;
    const modeloParaAdicionar = {
      id: novoId,
      titulo: novoModelo.titulo,
      codigo: novoModelo.codigo,
      categoria: novoModelo.categoria
    };

    const novosModelos = [...modelos, modeloParaAdicionar];
    saveModelos(novosModelos);
    setNovoModelo({ titulo: '', codigo: '', categoria: '' });
    
    toast({
      title: "Modelo adicionado!",
      description: "Novo modelo de código foi criado com sucesso.",
    });
  };

  const handleEditModelo = (modelo: Modelo) => {
    setNovoModelo({ 
      titulo: modelo.titulo, 
      codigo: modelo.codigo, 
      categoria: modelo.categoria 
    });
    setEditingId(modelo.id);
  };

  const handleUpdateModelo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId) return;

    const novosModelos = modelos.map(modelo =>
      modelo.id === editingId
        ? { 
            ...modelo, 
            titulo: novoModelo.titulo, 
            codigo: novoModelo.codigo,
            categoria: novoModelo.categoria
          }
        : modelo
    );

    saveModelos(novosModelos);
    setNovoModelo({ titulo: '', codigo: '', categoria: '' });
    setEditingId(null);
    
    toast({
      title: "Modelo atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDeleteModelo = (id: number) => {
    const novosModelos = modelos.filter(modelo => modelo.id !== id);
    saveModelos(novosModelos);
    
    toast({
      title: "Modelo removido!",
      description: "O modelo foi excluído com sucesso.",
    });
  };

  const cancelEdit = () => {
    setNovoModelo({ titulo: '', codigo: '', categoria: '' });
    setEditingId(null);
  };

  const toggleExpanded = (id: number) => {
    setExpandedModel(expandedModel === id ? null : id);
  };

  const getPreviewCode = (codigo: string, maxLines: number = 3) => {
    const lines = codigo.split('\n');
    if (lines.length <= maxLines) return codigo;
    return lines.slice(0, maxLines).join('\n') + '...';
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

          <div className="grid xl:grid-cols-3 gap-8">
            {/* Formulário para adicionar/editar modelo */}
            <div className="xl:col-span-1">
              <Card className="shadow-lg bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    {editingId ? 'Editar Modelo' : 'Adicionar Novo Modelo'}
                  </CardTitle>
                  <CardDescription>
                    {editingId ? 'Modifique os campos abaixo' : 'Preencha os campos para criar um novo modelo de código'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingId ? handleUpdateModelo : handleAddModelo} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título do Modelo</Label>
                      <Input
                        id="titulo"
                        type="text"
                        value={novoModelo.titulo}
                        onChange={(e) => setNovoModelo(prev => ({ ...prev, titulo: e.target.value }))}
                        placeholder="Ex: Conexão MySQL para PostgreSQL"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select 
                        value={novoModelo.categoria} 
                        onValueChange={(value) => setNovoModelo(prev => ({ ...prev, categoria: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="codigo">Código Python</Label>
                      <Textarea
                        id="codigo"
                        rows={12}
                        value={novoModelo.codigo}
                        onChange={(e) => setNovoModelo(prev => ({ ...prev, codigo: e.target.value }))}
                        placeholder="Cole aqui o código Python..."
                        className="font-mono text-sm"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {editingId ? 'Atualizar Modelo' : 'Adicionar Modelo'}
                      </Button>
                      
                      {editingId && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={cancelEdit}
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

            {/* Lista de modelos existentes */}
            <div className="xl:col-span-2">
              <Card className="shadow-lg bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Modelos Cadastrados</CardTitle>
                  <CardDescription>
                    Gerencie os modelos de código existentes ({modelos.length} total)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {modelos.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum modelo cadastrado ainda
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {modelos.map((modelo) => (
                            <TableRow key={modelo.id}>
                              <TableCell className="font-medium">
                                {modelo.titulo}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                                  {modelo.categoria}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="bg-muted rounded p-2 text-xs font-mono max-w-xs overflow-hidden">
                                  <pre className="whitespace-pre-wrap">
                                    {expandedModel === modelo.id 
                                      ? modelo.codigo 
                                      : getPreviewCode(modelo.codigo)
                                    }
                                  </pre>
                                  {modelo.codigo.split('\n').length > 3 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleExpanded(modelo.id)}
                                      className="mt-1 h-6 text-xs"
                                    >
                                      {expandedModel === modelo.id ? 'Ver menos' : 'Ver mais'}
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditModelo(modelo)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteModelo(modelo.id)}
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;

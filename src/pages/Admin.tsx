
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
import { Eye, Edit, Trash2, Plus, Search, Tag } from 'lucide-react';

interface Categoria {
  id: string;
  nome: string;
  cor: string;
}

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
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [novoModelo, setNovoModelo] = useState({ titulo: '', codigo: '', categoria: '' });
  const [novaCategoria, setNovaCategoria] = useState({ nome: '', cor: '#3b82f6' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCategoriaId, setEditingCategoriaId] = useState<string | null>(null);
  const [expandedModel, setExpandedModel] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModelos, setFilteredModelos] = useState<Modelo[]>([]);
  const [activeTab, setActiveTab] = useState<'modelos' | 'categorias'>('modelos');
  const { toast } = useToast();

  const coresDisponiveis = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  // Verificar se já está logado
  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  // Filtrar modelos baseado na busca
  useEffect(() => {
    let filtered = modelos;
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = modelos.filter(modelo =>
        modelo.titulo.toLowerCase().includes(term) ||
        modelo.codigo.toLowerCase().includes(term) ||
        modelo.categoria.toLowerCase().includes(term)
      );
    }
    
    setFilteredModelos(filtered);
  }, [searchTerm, modelos]);

  const loadData = () => {
    // Carregar categorias
    const categoriasLocal = localStorage.getItem('categorias_admin');
    if (categoriasLocal) {
      setCategorias(JSON.parse(categoriasLocal));
    } else {
      // Categorias padrão
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

    // Carregar modelos
    const modelosLocal = localStorage.getItem('modelos_codigo');
    if (modelosLocal) {
      setModelos(JSON.parse(modelosLocal));
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

  const saveModelos = (novosModelos: Modelo[]) => {
    localStorage.setItem('modelos_codigo', JSON.stringify(novosModelos));
    setModelos(novosModelos);
  };

  const saveCategorias = (novasCategorias: Categoria[]) => {
    localStorage.setItem('categorias_admin', JSON.stringify(novasCategorias));
    setCategorias(novasCategorias);
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

  const cancelEditCategoria = () => {
    setNovaCategoria({ nome: '', cor: '#3b82f6' });
    setEditingCategoriaId(null);
  };

  const toggleExpanded = (id: number) => {
    setExpandedModel(expandedModel === id ? null : id);
  };

  const getPreviewCode = (codigo: string, maxLines: number = 3) => {
    const lines = codigo.split('\n');
    if (lines.length <= maxLines) return codigo;
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

          {/* Tabs Navigation */}
          <div className="flex space-x-4 mb-8">
            <Button
              onClick={() => setActiveTab('modelos')}
              variant={activeTab === 'modelos' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Modelos
            </Button>
            <Button
              onClick={() => setActiveTab('categorias')}
              variant={activeTab === 'categorias' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              Categorias
            </Button>
          </div>

          {activeTab === 'modelos' && (
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
                    <div className="mt-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Buscar por título, código ou categoria..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredModelos.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        {searchTerm ? `Nenhum modelo encontrado para "${searchTerm}"` : 'Nenhum modelo cadastrado ainda'}
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
                            {filteredModelos.map((modelo) => (
                              <TableRow key={modelo.id}>
                                <TableCell className="font-medium">
                                  {modelo.titulo}
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="secondary" 
                                    style={{ backgroundColor: `${getCategoriaColor(modelo.categoria)}20`, color: getCategoriaColor(modelo.categoria) }}
                                  >
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
          )}

          {activeTab === 'categorias' && (
            <div className="grid xl:grid-cols-3 gap-8">
              {/* Formulário para adicionar/editar categoria */}
              <div className="xl:col-span-1">
                <Card className="shadow-lg bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">
                      {editingCategoriaId ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
                    </CardTitle>
                    <CardDescription>
                      {editingCategoriaId ? 'Modifique os campos abaixo' : 'Crie uma nova categoria para organizar os modelos'}
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

              {/* Lista de categorias existentes */}
              <div className="xl:col-span-2">
                <Card className="shadow-lg bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">Categorias Cadastradas</CardTitle>
                    <CardDescription>
                      Gerencie as categorias dos modelos ({categorias.length} total)
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;

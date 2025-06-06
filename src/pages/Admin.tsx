
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Modelo {
  id: number;
  titulo: string;
  codigo: string;
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ usuario: '', senha: '' });
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [novoModelo, setNovoModelo] = useState({ titulo: '', codigo: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

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
    
    if (!novoModelo.titulo.trim() || !novoModelo.codigo.trim()) {
      toast({
        title: "Erro",
        description: "Título e código são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const novoId = Math.max(...modelos.map(m => m.id), 0) + 1;
    const modeloParaAdicionar = {
      id: novoId,
      titulo: novoModelo.titulo,
      codigo: novoModelo.codigo
    };

    const novosModelos = [...modelos, modeloParaAdicionar];
    saveModelos(novosModelos);
    setNovoModelo({ titulo: '', codigo: '' });
    
    toast({
      title: "Modelo adicionado!",
      description: "Novo modelo de código foi criado com sucesso.",
    });
  };

  const handleEditModelo = (modelo: Modelo) => {
    setNovoModelo({ titulo: modelo.titulo, codigo: modelo.codigo });
    setEditingId(modelo.id);
  };

  const handleUpdateModelo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId) return;

    const novosModelos = modelos.map(modelo =>
      modelo.id === editingId
        ? { ...modelo, titulo: novoModelo.titulo, codigo: novoModelo.codigo }
        : modelo
    );

    saveModelos(novosModelos);
    setNovoModelo({ titulo: '', codigo: '' });
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
    setNovoModelo({ titulo: '', codigo: '' });
    setEditingId(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-600">Área Administrativa</CardTitle>
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
                  
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Entrar
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Painel Administrativo</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulário para adicionar/editar modelo */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">
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
                    <Label htmlFor="codigo">Código Python</Label>
                    <Textarea
                      id="codigo"
                      rows={15}
                      value={novoModelo.codigo}
                      onChange={(e) => setNovoModelo(prev => ({ ...prev, codigo: e.target.value }))}
                      placeholder="Cole aqui o código Python..."
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
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

            {/* Lista de modelos existentes */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">Modelos Cadastrados</CardTitle>
                <CardDescription>
                  Gerencie os modelos de código existentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {modelos.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhum modelo cadastrado ainda
                    </p>
                  ) : (
                    modelos.map((modelo) => (
                      <div key={modelo.id} className="border rounded p-4 bg-white">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {modelo.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {modelo.codigo.substring(0, 100)}...
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditModelo(modelo)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteModelo(modelo.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;

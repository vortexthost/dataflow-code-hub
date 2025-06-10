
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Eye, Filter, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const Tutoriais = () => {
  const [tutoriais, setTutoriais] = useState<Tutorial[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredTutoriais, setFilteredTutoriais] = useState<Tutorial[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTutoriais();
  }, [searchTerm, selectedCategory, tutoriais]);

  const loadData = () => {
    // Carregar categorias
    const categoriasLocal = localStorage.getItem('categorias_admin');
    if (categoriasLocal) {
      setCategorias(JSON.parse(categoriasLocal));
    }

    // Carregar tutoriais (antigos modelos)
    const tutoriaisLocal = localStorage.getItem('modelos_codigo');
    if (tutoriaisLocal) {
      const data = JSON.parse(tutoriaisLocal);
      // Converter modelos antigos para formato de tutorial
      const tutoriaisConvertidos = data.map((item: any) => ({
        ...item,
        conteudo: item.codigo || item.conteudo || '',
        cor: item.cor || '#000000',
        tamanhoFonte: item.tamanhoFonte || 'text-sm',
        imagem: item.imagem || ''
      }));
      setTutoriais(tutoriaisConvertidos);
    }
  };

  const filterTutoriais = () => {
    let filtered = tutoriais;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.categoria === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tutorial =>
        tutorial.titulo.toLowerCase().includes(term) ||
        tutorial.conteudo.toLowerCase().includes(term) ||
        tutorial.categoria.toLowerCase().includes(term)
      );
    }

    setFilteredTutoriais(filtered);
  };

  const getCategoriaColor = (categoriaNome: string) => {
    const categoria = categorias.find(cat => cat.nome === categoriaNome);
    return categoria?.cor || '#3b82f6';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchTerm.trim() !== '' || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Tutoriais de Migração de Dados
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore nossa biblioteca de tutoriais práticos para migração de dados. 
              Encontre soluções prontas para usar em seus projetos.
            </p>
          </div>

          {/* Filtros e Busca */}
          <Card className="mb-8 shadow-lg bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Buscar Tutoriais</CardTitle>
              <CardDescription className="text-card-foreground/70">
                Use os filtros abaixo para encontrar o tutorial que você precisa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Buscar por título, conteúdo ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="md:w-64">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
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

                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {hasActiveFilters && (
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span>
                    {filteredTutoriais.length} tutorial(is) encontrado(s)
                    {searchTerm && ` para "${searchTerm}"`}
                    {selectedCategory !== 'all' && ` na categoria "${selectedCategory}"`}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Tutoriais em 2 colunas */}
          {filteredTutoriais.length === 0 ? (
            <Card className="text-center py-12 shadow-lg bg-card border-border">
              <CardContent>
                <div className="text-muted-foreground">
                  {hasActiveFilters ? (
                    <>
                      <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2 text-card-foreground">Nenhum tutorial encontrado</h3>
                      <p className="text-card-foreground/70">Tente ajustar os filtros de busca ou limpar os filtros ativos.</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold mb-2 text-card-foreground">Nenhum tutorial disponível</h3>
                      <p className="text-card-foreground/70">Em breve adicionaremos tutoriais aqui.</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredTutoriais.map((tutorial) => (
                <Card key={tutorial.id} className="shadow-lg bg-card border-border hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle 
                          className="text-xl mb-2 text-card-foreground"
                          style={{ 
                            fontSize: tutorial.tamanhoFonte === 'text-lg' ? '1.125rem' : 
                                     tutorial.tamanhoFonte === 'text-xl' ? '1.25rem' : 
                                     tutorial.tamanhoFonte === 'text-2xl' ? '1.5rem' : '1rem'
                          }}
                        >
                          {tutorial.titulo}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary"
                            style={{ 
                              backgroundColor: `${getCategoriaColor(tutorial.categoria)}20`, 
                              color: getCategoriaColor(tutorial.categoria) 
                            }}
                          >
                            {tutorial.categoria}
                          </Badge>
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl mb-4 text-foreground">{tutorial.titulo}</DialogTitle>
                          </DialogHeader>
                          <div className="prose max-w-none prose-invert">
                            <div 
                              dangerouslySetInnerHTML={{ __html: tutorial.conteudo }}
                              className="text-sm text-foreground"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tutoriais;

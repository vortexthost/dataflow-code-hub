
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, Calendar } from 'lucide-react';
import { useTutorials } from '@/hooks/useTutorials';
import { useCategories } from '@/hooks/useCategories';

const Tutoriais = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: tutoriais = [], isLoading: loadingTutoriais } = useTutorials();
  const { data: categorias = [], isLoading: loadingCategorias } = useCategories();

  const filteredTutoriais = tutoriais.filter(tutorial => {
    const matchesSearch = tutorial.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.conteudo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || tutorial.categoria_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewTutorial = (tutorial: any) => {
    setSelectedTutorial(tutorial);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loadingTutoriais || loadingCategorias) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Carregando tutoriais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Tutoriais e Modelos
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Aprenda com nossos guias práticos e modelos prontos para migração de dados
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar tutoriais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Tutoriais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutoriais.map((tutorial) => (
            <Card key={tutorial.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg text-white line-clamp-2">
                    {tutorial.titulo}
                  </CardTitle>
                  {tutorial.categorias && (
                    <Badge 
                      style={{ backgroundColor: tutorial.categorias.cor }}
                      className="text-white"
                    >
                      {tutorial.categorias.nome}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(tutorial.created_at)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {tutorial.conteudo.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                <Button 
                  onClick={() => handleViewTutorial(tutorial)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Tutorial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTutoriais.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Nenhum tutorial encontrado com os filtros aplicados.
            </p>
          </div>
        )}
      </main>

      {/* Dialog para visualizar tutorial */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {selectedTutorial?.titulo}
            </DialogTitle>
          </DialogHeader>
          {selectedTutorial && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {selectedTutorial.categorias && (
                  <Badge 
                    style={{ backgroundColor: selectedTutorial.categorias.cor }}
                    className="text-white"
                  >
                    {selectedTutorial.categorias.nome}
                  </Badge>
                )}
                <span className="text-gray-400 text-sm">
                  {formatDate(selectedTutorial.created_at)}
                </span>
              </div>
              <div 
                className="text-gray-300 prose prose-invert max-w-none"
                style={{ 
                  color: selectedTutorial.cor,
                  fontSize: selectedTutorial.tamanho_fonte === 'text-lg' ? '1.125rem' : 
                           selectedTutorial.tamanho_fonte === 'text-xl' ? '1.25rem' : '0.875rem'
                }}
                dangerouslySetInnerHTML={{ __html: selectedTutorial.conteudo }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Tutoriais;

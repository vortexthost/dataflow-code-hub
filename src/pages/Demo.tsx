
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Send, Database, Shield, Zap } from 'lucide-react';
import { useCreateDemo } from '@/hooks/useDemos';
import { toast } from 'sonner';

const Demo = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    mensagem: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createDemo = useCreateDemo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createDemo.mutateAsync(formData);
      setIsSubmitted(true);
      toast.success('Solicitação enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    {
      icon: <Database className="h-8 w-8 text-blue-400" />,
      title: "Migração Completa",
      description: "Migre dados entre diferentes sistemas de banco de dados com total integridade"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-400" />,
      title: "Segurança Avançada",
      description: "Criptografia end-to-end e conformidade com padrões de segurança"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Performance Otimizada",
      description: "Processamento paralelo para migrações rápidas e eficientes"
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center max-w-2xl mx-auto">
            <CheckCircle className="h-24 w-24 text-green-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4 text-green-400">
              Solicitação Enviada!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Recebemos sua solicitação de demo. Nossa equipe entrará em contato em breve para agendar uma demonstração personalizada.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Voltar ao Início
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Solicite uma Demo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Veja como nossa solução pode transformar seus processos de migração de dados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulário */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Agende sua Demonstração
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Completo *
                  </label>
                  <Input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-mail Corporativo *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="seu.email@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Empresa *
                  </label>
                  <Input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mensagem
                  </label>
                  <Textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    rows={4}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Conte-nos sobre suas necessidades de migração de dados..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={createDemo.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {createDemo.isPending ? 'Enviando...' : 'Solicitar Demo'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações sobre a Demo */}
          <div className="space-y-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  O que você verá na demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-blue-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Agende agora e receba:
                </h3>
                <ul className="space-y-2 text-gray-200">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Demonstração personalizada (30 min)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Análise das suas necessidades
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Proposta técnica customizada
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Suporte especializado
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Demo;


import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Play, ExternalLink } from 'lucide-react';

const Demo = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    objetivo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular registro
    setTimeout(() => {
      setIsSubmitting(false);
      setIsRegistered(true);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Agora você pode acessar nossa aplicação demo.",
      });
    }, 2000);
  };

  const handleAccessDemo = () => {
    // Aqui você pode redirecionar para o site externo
    window.open('https://demo.seuapp.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Demonstração Interativa
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experimente nossa plataforma de migração de dados em tempo real. 
              Veja como é simples e seguro migrar seus dados empresariais com nossa solução completa.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Como usar a demo */}
            <Card className="bg-card border-border shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center gap-2">
                  <Play className="w-6 h-6" />
                  Como usar a Demo
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Siga estes passos simples para experimentar nossa plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Cadastre-se</h4>
                    <p className="text-sm text-muted-foreground">Preencha o formulário ao lado com seus dados básicos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Acesse a Demo</h4>
                    <p className="text-sm text-muted-foreground">Clique no botão para abrir nossa aplicação demo</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Explore os Recursos</h4>
                    <p className="text-sm text-muted-foreground">Teste as funcionalidades de migração com dados simulados</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Monitore o Progresso</h4>
                    <p className="text-sm text-muted-foreground">Acompanhe a migração em tempo real com nossos dashboards</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulário de cadastro */}
            <Card className="bg-card border-border shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">
                  {isRegistered ? 'Cadastro Concluído!' : 'Acesso à Demonstração'}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {isRegistered 
                    ? 'Agora você pode acessar nossa aplicação demo'
                    : 'Preencha seus dados para acessar a demo completa'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isRegistered ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        type="text"
                        placeholder="Seu nome completo"
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail Profissional</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="empresa">Nome da Empresa</Label>
                      <Input
                        id="empresa"
                        type="text"
                        placeholder="Nome da sua empresa"
                        value={formData.empresa}
                        onChange={(e) => handleInputChange('empresa', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="objetivo">Principal Objetivo</Label>
                      <Select onValueChange={(value) => handleInputChange('objetivo', value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu principal objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="migracao-cloud">Migração para Cloud</SelectItem>
                          <SelectItem value="modernizacao-db">Modernização de Database</SelectItem>
                          <SelectItem value="backup-disaster">Backup e Disaster Recovery</SelectItem>
                          <SelectItem value="integracao-sistemas">Integração de Sistemas</SelectItem>
                          <SelectItem value="analytics-bi">Analytics e BI</SelectItem>
                          <SelectItem value="compliance">Compliance e Governança</SelectItem>
                          <SelectItem value="performance">Melhoria de Performance</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={isSubmitting || !formData.nome || !formData.email || !formData.empresa || !formData.objetivo}
                    >
                      {isSubmitting ? 'Cadastrando...' : 'Cadastrar e Acessar Demo'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6 text-center">
                    <div className="flex justify-center">
                      <CheckCircle className="w-16 h-16 text-accent" />
                    </div>
                    <div>
                      <p className="text-foreground mb-2">Olá, <strong>{formData.nome}</strong>!</p>
                      <p className="text-muted-foreground">
                        Seu acesso foi liberado. Clique no botão abaixo para experimentar nossa plataforma.
                      </p>
                    </div>
                    <Button 
                      onClick={handleAccessDemo}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Acessar Aplicação Demo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recursos da plataforma */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-accent">🚀 Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Migração até 10x mais rápida</li>
                  <li>• Processamento paralelo otimizado</li>
                  <li>• Compressão de dados inteligente</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-accent">🔒 Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Criptografia AES-256</li>
                  <li>• Compliance SOC2 e GDPR</li>
                  <li>• Auditoria completa de acessos</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-accent">📊 Monitoramento</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dashboards em tempo real</li>
                  <li>• Alertas automáticos</li>
                  <li>• Relatórios detalhados</li>
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

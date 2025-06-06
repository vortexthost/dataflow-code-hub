
import React from 'react';
import { ArrowRight, Shield, Zap, BarChart3, Code, Database, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Hero = () => {
  const handleDemoClick = () => {
    window.location.href = '/demo';
  };

  const handleModelosClick = () => {
    window.location.href = '/modelos';
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Migração de Dados
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
                  Simples e Segura
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transforme a migração de dados da sua empresa com nossa solução completa. 
                Integração via API, segurança avançada e suporte especializado para garantir 
                a continuidade dos seus negócios.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleDemoClick}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold"
                >
                  Testar o Serviço (Demo)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  onClick={handleModelosClick}
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-semibold"
                >
                  Modelos de Código
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card border border-border rounded-xl p-6 shadow-2xl">
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-primary/20 rounded w-3/4"></div>
                    <div className="h-3 bg-accent/20 rounded w-1/2"></div>
                    <div className="h-3 bg-primary/20 rounded w-5/6"></div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Preview da Interface de Migração
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que escolher nossa solução?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nossa plataforma oferece as ferramentas mais avançadas para migração de dados,
              garantindo segurança, velocidade e confiabilidade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Rápido e Eficiente</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Migração de dados em minutos, não em dias. Nossa API otimizada garante 
                  performance máxima e processamento paralelo para grandes volumes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Segurança Total</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Criptografia de ponta a ponta e conformidade com LGPD. Seus dados sempre 
                  protegidos com certificações de segurança internacionais.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Relatórios Detalhados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Acompanhe cada etapa da migração com relatórios em tempo real, 
                  análises completas e dashboards interativos.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Details Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-xl text-muted-foreground">
              Soluções completas para todas as suas necessidades de migração de dados
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Migração de Bancos de Dados</h3>
                  <p className="text-muted-foreground">
                    Migração segura entre diferentes SGBDs (MySQL, PostgreSQL, Oracle, SQL Server) 
                    com preservação total da integridade dos dados e relacionamentos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Integração de APIs</h3>
                  <p className="text-muted-foreground">
                    Conecte sistemas legados com novas plataformas através de APIs RESTful 
                    robustas, com documentação completa e suporte para webhooks.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Transformação de Dados</h3>
                  <p className="text-muted-foreground">
                    Limpeza, normalização e transformação de dados com algoritmos inteligentes 
                    para garantir qualidade e consistência no destino final.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Processo de Migração</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Análise dos Dados</h4>
                    <p className="text-sm text-muted-foreground">Mapeamento completo da estrutura e relacionamentos</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Planejamento</h4>
                    <p className="text-sm text-muted-foreground">Estratégia personalizada para sua migração</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Execução</h4>
                    <p className="text-sm text-muted-foreground">Migração com monitoramento em tempo real</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Validação</h4>
                    <p className="text-sm text-muted-foreground">Verificação completa e relatório final</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Teste nossa solução gratuitamente ou explore nossos modelos de código 
            para entender como podemos ajudar sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDemoClick}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            >
              Iniciar Demo Gratuito
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={handleModelosClick}
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg"
            >
              Ver Exemplos de Código
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;

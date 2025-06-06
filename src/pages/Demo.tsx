
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Demo = () => {
  const [formData, setFormData] = useState({
    origem: '',
    destino: '',
    tipo: '',
    registros: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Simular processamento
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Demo Executada com Sucesso!",
        description: `Simulação de migração de ${formData.registros} registros do ${formData.origem} para ${formData.destino} concluída.`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Teste Nosso Serviço de Migração
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experimente uma simulação completa do nosso processo de migração de dados. 
              Veja como é simples e seguro migrar seus dados empresariais.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">Configuração da Migração</CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para simular uma migração de dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="origem">Sistema de Origem</Label>
                    <Select onValueChange={(value) => handleInputChange('origem', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o sistema de origem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mysql">MySQL Database</SelectItem>
                        <SelectItem value="postgresql">PostgreSQL</SelectItem>
                        <SelectItem value="oracle">Oracle Database</SelectItem>
                        <SelectItem value="sqlserver">SQL Server</SelectItem>
                        <SelectItem value="mongodb">MongoDB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destino">Sistema de Destino</Label>
                    <Select onValueChange={(value) => handleInputChange('destino', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o sistema de destino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aws">Amazon AWS RDS</SelectItem>
                        <SelectItem value="azure">Microsoft Azure SQL</SelectItem>
                        <SelectItem value="gcp">Google Cloud SQL</SelectItem>
                        <SelectItem value="snowflake">Snowflake</SelectItem>
                        <SelectItem value="bigquery">Google BigQuery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Migração</Label>
                    <Select onValueChange={(value) => handleInputChange('tipo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de migração" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completa">Migração Completa</SelectItem>
                        <SelectItem value="incremental">Migração Incremental</SelectItem>
                        <SelectItem value="diferencial">Migração Diferencial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registros">Número de Registros</Label>
                    <Input
                      id="registros"
                      type="number"
                      placeholder="Ex: 100000"
                      value={formData.registros}
                      onChange={(e) => handleInputChange('registros', e.target.value)}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isSubmitting || !formData.origem || !formData.destino || !formData.tipo || !formData.registros}
                  >
                    {isSubmitting ? 'Processando...' : 'Executar Demo de Migração'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-600">Como Funciona</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Análise dos Dados</h4>
                      <p className="text-sm text-gray-600">Analisamos a estrutura e volume dos seus dados</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">Preparação</h4>
                      <p className="text-sm text-gray-600">Configuramos os ambientes de origem e destino</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Migração</h4>
                      <p className="text-sm text-gray-600">Transferimos os dados com segurança total</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-semibold">Validação</h4>
                      <p className="text-sm text-gray-600">Verificamos a integridade dos dados migrados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-600">Benefícios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Zero downtime durante a migração</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Criptografia em trânsito e em repouso</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Rollback automático em caso de erro</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Monitoramento em tempo real</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Suporte 24/7 durante o processo</span>
                  </div>
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

export default Demo;

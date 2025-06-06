import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Copy, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const Modelos = () => {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredModelos, setFilteredModelos] = useState<Modelo[]>([]);
  const [expandedModel, setExpandedModel] = useState<number | null>(null);

  const { toast } = useToast();

  // Carregar dados
  useEffect(() => {
    // Carregar categorias do admin
    const categoriasLocal = localStorage.getItem('categorias_admin');
    if (categoriasLocal) {
      setCategorias(JSON.parse(categoriasLocal));
    } else {
      // Categorias padrão caso não existam no admin
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
    }

    // Carregar modelos do admin ou usar exemplos
    const modelosLocal = localStorage.getItem('modelos_codigo');
    if (modelosLocal) {
      setModelos(JSON.parse(modelosLocal));
    } else {
      // Dados de exemplo (simulando dados do backend)
      const modelosExemplo: Modelo[] = [
        {
          id: 1,
          titulo: "Conexão MySQL para PostgreSQL",
          categoria: "Database Migration",
          codigo: `import pymysql
import psycopg2
import pandas as pd

def migrate_mysql_to_postgresql():
    # Conexão MySQL
    mysql_conn = pymysql.connect(
        host='localhost',
        user='usuario',
        password='senha',
        database='origem_db'
    )
    
    # Conexão PostgreSQL
    pg_conn = psycopg2.connect(
        host='localhost',
        user='usuario',
        password='senha',
        database='destino_db'
    )
    
    # Migração de dados
    query = "SELECT * FROM tabela_origem"
    df = pd.read_sql(query, mysql_conn)
    
    df.to_sql('tabela_destino', pg_conn, if_exists='replace', index=False)
    
    mysql_conn.close()
    pg_conn.close()
    
    print("Migração concluída com sucesso!")

migrate_mysql_to_postgresql()`
        },
        {
          id: 2,
          titulo: "API REST para Integração de Dados",
          categoria: "API Integration",
          codigo: `import requests
import json
from datetime import datetime

class DataMigrationAPI:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def extract_data(self, endpoint):
        """Extrai dados da API de origem"""
        response = requests.get(f"{self.base_url}/{endpoint}", headers=self.headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Erro na API: {response.status_code}")
    
    def transform_data(self, data):
        """Transforma os dados conforme necessário"""
        transformed = []
        for item in data:
            transformed_item = {
                'id': item.get('id'),
                'name': item.get('name', '').upper(),
                'created_at': datetime.now().isoformat(),
                'status': 'migrated'
            }
            transformed.append(transformed_item)
        return transformed
    
    def load_data(self, data, target_endpoint):
        """Carrega dados na API de destino"""
        payload = {'data': data}
        response = requests.post(
            f"{self.base_url}/{target_endpoint}", 
            headers=self.headers,
            data=json.dumps(payload)
        )
        return response.status_code == 201

# Exemplo de uso
api = DataMigrationAPI('https://api.exemplo.com', 'sua_api_key')
raw_data = api.extract_data('usuarios')
clean_data = api.transform_data(raw_data)
success = api.load_data(clean_data, 'usuarios_migrados')`
        },
        {
          id: 3,
          titulo: "Migração de Arquivos CSV em Lote",
          categoria: "File Processing",
          codigo: `import pandas as pd
import os
import logging
from pathlib import Path

class CSVBatchMigrator:
    def __init__(self, source_dir, target_dir):
        self.source_dir = Path(source_dir)
        self.target_dir = Path(target_dir)
        self.target_dir.mkdir(exist_ok=True)
        
        # Configurar logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def process_file(self, file_path):
        """Processa um único arquivo CSV"""
        try:
            df = pd.read_csv(file_path)
            
            # Limpeza de dados
            df = df.dropna()
            df = df.drop_duplicates()
            
            # Padronização de colunas
            df.columns = [col.lower().replace(' ', '_') for col in df.columns]
            
            # Salvar arquivo processado
            output_file = self.target_dir / f"processed_{file_path.name}"
            df.to_csv(output_file, index=False)
            
            self.logger.info(f"Arquivo processado: {file_path.name}")
            return True
            
        except Exception as e:
            self.logger.error(f"Erro ao processar {file_path.name}: {str(e)}")
            return False
    
    def migrate_all(self):
        """Migra todos os arquivos CSV do diretório"""
        csv_files = list(self.source_dir.glob("*.csv"))
        processed = 0
        
        for file_path in csv_files:
            if self.process_file(file_path):
                processed += 1
        
        self.logger.info(f"Migração concluída: {processed}/{len(csv_files)} arquivos")
        return processed

# Uso
migrator = CSVBatchMigrator('/dados/origem', '/dados/destino')
migrator.migrate_all()`
        },
        {
          id: 4,
          titulo: "Validação de Integridade de Dados",
          categoria: "Data Validation",
          codigo: `import hashlib
import pandas as pd
from typing import Dict, List

class DataIntegrityValidator:
    def __init__(self):
        self.validation_errors = []
    
    def calculate_checksum(self, data: str) -> str:
        """Calcula checksum MD5 dos dados"""
        return hashlib.md5(data.encode()).hexdigest()
    
    def validate_schema(self, df: pd.DataFrame, expected_columns: List[str]) -> bool:
        """Valida se o schema está correto"""
        missing_columns = set(expected_columns) - set(df.columns)
        if missing_columns:
            self.validation_errors.append(f"Colunas ausentes: {missing_columns}")
            return False
        return True
    
    def validate_data_types(self, df: pd.DataFrame, type_mapping: Dict[str, str]) -> bool:
        """Valida tipos de dados das colunas"""
        errors = []
        for column, expected_type in type_mapping.items():
            if column in df.columns:
                actual_type = str(df[column].dtype)
                if expected_type not in actual_type:
                    errors.append(f"Coluna {column}: esperado {expected_type}, encontrado {actual_type}")
        
        if errors:
            self.validation_errors.extend(errors)
            return False
        return True
    
    def validate_record_count(self, source_count: int, target_count: int) -> bool:
        """Valida se o número de registros confere"""
        if source_count != target_count:
            self.validation_errors.append(
                f"Contagem de registros diferente: origem={source_count}, destino={target_count}"
            )
            return False
        return True

# Exemplo de uso
validator = DataIntegrityValidator()
source_data = pd.read_csv('fonte.csv')
target_data = pd.read_csv('destino.csv')

validation_result = validator.validate_data_integrity(source_data, target_data)
print(f"Validação: {'✓ Sucesso' if validation_result['valid'] else '✗ Falhou'}")`
        },
        {
          id: 5,
          titulo: "Monitoramento de Progresso em Tempo Real",
          categoria: "Monitoring",
          codigo: `import time
import threading
from datetime import datetime
from typing import Callable

class MigrationProgressMonitor:
    def __init__(self, total_records: int):
        self.total_records = total_records
        self.processed_records = 0
        self.start_time = None
        self.errors = []
        self.is_running = False
        self._lock = threading.Lock()
    
    def start_monitoring(self):
        """Inicia o monitoramento"""
        self.start_time = datetime.now()
        self.is_running = True
        
        # Thread para exibir progresso
        monitor_thread = threading.Thread(target=self._monitor_progress)
        monitor_thread.daemon = True
        monitor_thread.start()
    
    def update_progress(self, records_processed: int, error_msg: str = None):
        """Atualiza o progresso da migração"""
        with self._lock:
            self.processed_records += records_processed
            if error_msg:
                self.errors.append({
                    'timestamp': datetime.now(),
                    'message': error_msg
                })
    
    def _monitor_progress(self):
        """Thread de monitoramento em background"""
        while self.is_running and self.processed_records < self.total_records:
            self._display_progress()
            time.sleep(1)
    
    def finish_monitoring(self):
        """Finaliza o monitoramento"""
        self.is_running = False
        if self.start_time:
            total_time = datetime.now() - self.start_time
            print(f"\\n\\nMigração concluída em {total_time}")

# Exemplo de uso
monitor = MigrationProgressMonitor(10000)
monitor.start_monitoring()`
        },
        {
          id: 6,
          titulo: "Autenticação JWT para APIs",
          categoria: "Authentication",
          codigo: `import jwt
import datetime
from functools import wraps
from flask import request, jsonify, current_app

class JWTAuthenticator:
    def __init__(self, secret_key, algorithm='HS256'):
        self.secret_key = secret_key
        self.algorithm = algorithm
    
    def generate_token(self, user_id, expires_in_hours=24):
        """Gera um token JWT para o usuário"""
        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=expires_in_hours),
            'iat': datetime.datetime.utcnow()
        }
        
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        return token
    
    def verify_token(self, token):
        """Verifica e decodifica um token JWT"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return {'valid': True, 'user_id': payload['user_id']}
        except jwt.ExpiredSignatureError:
            return {'valid': False, 'error': 'Token expirado'}
        except jwt.InvalidTokenError:
            return {'valid': False, 'error': 'Token inválido'}
    
    def require_auth(self, f):
        """Decorator para proteger rotas com autenticação"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({'error': 'Token não fornecido'}), 401
            
            if token.startswith('Bearer '):
                token = token[7:]
            
            result = self.verify_token(token)
            if not result['valid']:
                return jsonify({'error': result['error']}), 401
            
            request.user_id = result['user_id']
            return f(*args, **kwargs)
        
        return decorated_function

# Uso
auth = JWTAuthenticator('sua_chave_secreta')
token = auth.generate_token(user_id=123)`
        }
      ];
      
      setModelos(modelosExemplo);
    }
  }, []);

  useEffect(() => {
    let filtered = modelos;
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(modelo =>
        modelo.titulo.toLowerCase().includes(term) ||
        modelo.categoria.toLowerCase().includes(term) ||
        modelo.codigo.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(modelo => modelo.categoria === selectedCategory);
    }
    
    setFilteredModelos(filtered);
  }, [searchTerm, selectedCategory, modelos]);

  const copyToClipboard = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    toast({
      title: "Código copiado!",
      description: "O código foi copiado para a área de transferência.",
    });
  };

  const toggleExpanded = (id: number) => {
    setExpandedModel(expandedModel === id ? null : id);
  };

  const getPreviewCode = (codigo: string, maxLines: number = 8) => {
    const lines = codigo.split('\n');
    if (lines.length <= maxLines) return codigo;
    return lines.slice(0, maxLines).join('\n') + '\n...';
  };

  const getCategoriaColor = (categoriaNome: string) => {
    const categoria = categorias.find(cat => cat.nome === categoriaNome);
    return categoria?.cor || '#3b82f6';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Modelos de Código
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Biblioteca completa de exemplos de código para migração de dados. 
              Copie, adapte e implemente em seus projetos.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por título, código ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-lg py-3 pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
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
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {filteredModelos.map((modelo) => (
              <Card key={modelo.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card border-border">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-primary mb-2">{modelo.titulo}</CardTitle>
                      <Badge 
                        variant="secondary" 
                        style={{ backgroundColor: `${getCategoriaColor(modelo.categoria)}20`, color: getCategoriaColor(modelo.categoria) }}
                      >
                        {modelo.categoria}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(modelo.id)}
                        className="hover:bg-secondary"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => copyToClipboard(modelo.codigo)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm text-muted-foreground overflow-hidden">
                      <code>
                        {expandedModel === modelo.id 
                          ? modelo.codigo 
                          : getPreviewCode(modelo.codigo)
                        }
                      </code>
                    </pre>
                  </div>
                  {modelo.codigo.split('\n').length > 8 && (
                    <div className="mt-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(modelo.id)}
                        className="text-primary hover:text-primary/80"
                      >
                        {expandedModel === modelo.id ? 'Ver menos' : 'Ver código completo'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredModelos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchTerm ? `Nenhum modelo encontrado para "${searchTerm}"` : 'Nenhum modelo encontrado'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Modelos;

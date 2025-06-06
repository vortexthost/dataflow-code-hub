
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Modelo {
  id: number;
  titulo: string;
  codigo: string;
  categoria: string;
}

const Modelos = () => {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModelos, setFilteredModelos] = useState<Modelo[]>([]);

  // Dados de exemplo (simulando dados do backend)
  useEffect(() => {
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
    
    def validate_data_integrity(self, source_df: pd.DataFrame, target_df: pd.DataFrame) -> Dict:
        """Executa validação completa"""
        results = {
            'valid': True,
            'errors': [],
            'source_checksum': '',
            'target_checksum': '',
            'records_validated': 0
        }
        
        # Calcular checksums
        source_data = source_df.to_string()
        target_data = target_df.to_string()
        
        results['source_checksum'] = self.calculate_checksum(source_data)
        results['target_checksum'] = self.calculate_checksum(target_data)
        
        # Verificar integridade
        if results['source_checksum'] != results['target_checksum']:
            results['valid'] = False
            results['errors'].append("Checksums não conferem - dados podem estar corrompidos")
        
        results['records_validated'] = len(target_df)
        results['errors'].extend(self.validation_errors)
        
        return results

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
    
    def _display_progress(self):
        """Exibe o progresso atual"""
        if self.start_time:
            elapsed = datetime.now() - self.start_time
            percentage = (self.processed_records / self.total_records) * 100
            
            # Calcular ETA
            if self.processed_records > 0:
                rate = self.processed_records / elapsed.total_seconds()
                remaining_records = self.total_records - self.processed_records
                eta_seconds = remaining_records / rate if rate > 0 else 0
                eta = f"{int(eta_seconds // 60)}m {int(eta_seconds % 60)}s"
            else:
                eta = "Calculando..."
            
            # Barra de progresso visual
            bar_length = 30
            filled_length = int(bar_length * percentage / 100)
            bar = '█' * filled_length + '░' * (bar_length - filled_length)
            
            print(f"\\r[{bar}] {percentage:.1f}% | {self.processed_records}/{self.total_records} | ETA: {eta} | Erros: {len(self.errors)}", end='')
    
    def finish_monitoring(self):
        """Finaliza o monitoramento"""
        self.is_running = False
        if self.start_time:
            total_time = datetime.now() - self.start_time
            print(f"\\n\\nMigração concluída em {total_time}")
            print(f"Taxa de sucesso: {((self.total_records - len(self.errors)) / self.total_records * 100):.1f}%")
            
            if self.errors:
                print(f"\\nErros encontrados: {len(self.errors)}")
                for error in self.errors[-5:]:  # Últimos 5 erros
                    print(f"  {error['timestamp'].strftime('%H:%M:%S')}: {error['message']}")

# Exemplo de uso
def simulate_migration():
    monitor = MigrationProgressMonitor(10000)
    monitor.start_monitoring()
    
    # Simular migração
    for i in range(100):
        # Simular processamento de 100 registros
        time.sleep(0.1)
        monitor.update_progress(100)
        
        # Simular erro ocasional
        if i % 20 == 0 and i > 0:
            monitor.update_progress(0, f"Erro de conectividade no lote {i}")
    
    monitor.finish_monitoring()

# simulate_migration()`
      }
    ];
    
    setModelos(modelosExemplo);
    setFilteredModelos(modelosExemplo);
  }, []);

  useEffect(() => {
    const filtered = modelos.filter(modelo =>
      modelo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modelo.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredModelos(filtered);
  }, [searchTerm, modelos]);

  const copyToClipboard = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Modelos de Código
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Biblioteca completa de exemplos de código para migração de dados. 
              Copie, adapte e implemente em seus projetos.
            </p>
          </div>

          <div className="mb-8">
            <Input
              type="text"
              placeholder="Buscar por título ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md mx-auto block text-lg py-3"
            />
          </div>

          <div className="grid gap-8">
            {filteredModelos.map((modelo) => (
              <Card key={modelo.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-blue-600 mb-2">{modelo.titulo}</CardTitle>
                      <CardDescription className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded inline-block">
                        {modelo.categoria}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(modelo.codigo)}
                      className="hover:bg-blue-50"
                    >
                      Copiar Código
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100">
                      <code>{modelo.codigo}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredModelos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Nenhum modelo encontrado para "{searchTerm}"
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

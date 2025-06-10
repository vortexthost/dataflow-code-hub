
-- Criar tabela de categorias
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  cor TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de tutoriais
CREATE TABLE public.tutoriais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  cor TEXT DEFAULT '#000000',
  tamanho_fonte TEXT DEFAULT 'text-sm',
  imagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de demos
CREATE TABLE public.demos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  empresa TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de configurações de e-mail
CREATE TABLE public.config_email (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assunto TEXT NOT NULL DEFAULT 'Acesso à Demo',
  conteudo TEXT NOT NULL DEFAULT 'Olá! Aqui estão as informações para acessar nossa demo.',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de usuários do sistema (para HelpDesk/Projetos)
CREATE TABLE public.usuarios_sistema (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de tickets (Projetos/HelpDesk)
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuarios_sistema(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_andamento', 'fechado')),
  prioridade TEXT NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  resposta TEXT,
  respondido_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configuração padrão de e-mail
INSERT INTO public.config_email (assunto, conteudo) 
VALUES (
  'Acesso à Demo - Sistema de Migração de Dados',
  '<h2>Bem-vindo à nossa Demo!</h2><p>Olá! Agradecemos seu interesse em nosso sistema de migração de dados.</p><p>Em breve entraremos em contato com você para agendar uma demonstração personalizada.</p><p>Atenciosamente,<br>Equipe de Suporte</p>'
);

-- Habilitar Row Level Security nas tabelas que precisam
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutoriais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config_email ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acesso público de leitura (categorias e tutoriais)
CREATE POLICY "Todos podem visualizar categorias" 
  ON public.categorias 
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Todos podem visualizar tutoriais" 
  ON public.tutoriais 
  FOR SELECT 
  TO public
  USING (true);

-- Políticas RLS para dados administrativos (apenas autenticados podem acessar)
CREATE POLICY "Apenas autenticados podem gerenciar categorias" 
  ON public.categorias 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Apenas autenticados podem gerenciar tutoriais" 
  ON public.tutoriais 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Apenas autenticados podem gerenciar demos" 
  ON public.demos 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Apenas autenticados podem gerenciar config de e-mail" 
  ON public.config_email 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Apenas autenticados podem gerenciar usuários do sistema" 
  ON public.usuarios_sistema 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas RLS para tickets (usuários veem apenas seus próprios tickets)
CREATE POLICY "Usuários podem ver apenas seus próprios tickets" 
  ON public.tickets 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar tickets" 
  ON public.tickets 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Apenas autenticados podem gerenciar todos os tickets" 
  ON public.tickets 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inserir algumas categorias padrão
INSERT INTO public.categorias (nome, cor) VALUES 
  ('SQL Server', '#0078d4'),
  ('MySQL', '#00758f'),
  ('PostgreSQL', '#336791'),
  ('Oracle', '#f80000'),
  ('MongoDB', '#47a248'),
  ('APIs', '#ff6b35'),
  ('CSV/Excel', '#217346'),
  ('Cloud', '#4285f4');

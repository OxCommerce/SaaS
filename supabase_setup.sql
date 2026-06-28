-- 0. RESET DATABASE (OPTIONAL: Drop existing tables to perform a clean reset)
DROP TABLE IF EXISTS public.clientes_fornecedores CASCADE;
DROP TABLE IF EXISTS public.parceiros CASCADE;
DROP TABLE IF EXISTS public.motoristas CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.centros_custo CASCADE;
DROP TABLE IF EXISTS public.bancos CASCADE;
DROP TABLE IF EXISTS public.tipos_parceiro CASCADE;
DROP TABLE IF EXISTS public.categorias CASCADE;

-- 1. Table for Clientes & Fornecedores
CREATE TABLE IF NOT EXISTS public.clientes_fornecedores (
    id text PRIMARY KEY,
    nome text NOT NULL,
    documento text,
    telefone text,
    estado text,
    relacionamento text, -- 'CLI', 'FOR', 'AMB'
    tipo text, -- 'Pessoa Física', 'Pessoa Jurídica'
    fazenda text,
    raw_data jsonb, -- Stores the full form fields (contact, address, banking, etc.)
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and insert open access for prototype phase
ALTER TABLE public.clientes_fornecedores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read/write" ON public.clientes_fornecedores;
CREATE POLICY "Allow anonymous read/write" ON public.clientes_fornecedores
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 2. Table for Parceiros / Corretores
CREATE TABLE IF NOT EXISTS public.parceiros (
    id text PRIMARY KEY,
    nome text NOT NULL,
    contato text,
    telefone text,
    regiao text,
    tipo text,
    raw_data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read/write" ON public.parceiros;
CREATE POLICY "Allow anonymous read/write" ON public.parceiros
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 3. Table for Motoristas & Rodas
CREATE TABLE IF NOT EXISTS public.motoristas (
    id text PRIMARY KEY,
    nome text NOT NULL,
    cnh text,
    placa text,
    transportadora text,
    status text,
    raw_data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.motoristas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read/write" ON public.motoristas;
CREATE POLICY "Allow anonymous read/write" ON public.motoristas
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 4. Table for Equipe e Usuários
CREATE TABLE IF NOT EXISTS public.usuarios (
    id text PRIMARY KEY,
    nome text NOT NULL,
    email text,
    papel text,
    status text,
    matricula text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS matricula text;

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read/write" ON public.usuarios;
CREATE POLICY "Allow anonymous read/write" ON public.usuarios
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 5. Table for Centros de Custo
CREATE TABLE IF NOT EXISTS public.centros_custo (
    id text PRIMARY KEY,
    codigo text UNIQUE NOT NULL,
    nome text NOT NULL,
    tipo text, -- 'Operacional', 'Administrativo', 'Produtivo'
    status text, -- 'Ativo', 'Inativo'
    responsavel text, -- Name of the responsible user
    raw_data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.centros_custo ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read/write" ON public.centros_custo;
CREATE POLICY "Allow anonymous read/write" ON public.centros_custo
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 6. Table for Bancos
CREATE TABLE IF NOT EXISTS public.bancos (
    id text PRIMARY KEY,
    codigo text UNIQUE NOT NULL, -- e.g., '001', '341'
    nome text NOT NULL, -- e.g., 'Banco do Brasil S.A.'
    status text DEFAULT 'Ativo', -- 'Ativo', 'Inativo'
    raw_data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.bancos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read/write" ON public.bancos;
CREATE POLICY "Allow anonymous read/write" ON public.bancos
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 7. Table for Tipos de Parceiro
CREATE TABLE IF NOT EXISTS public.tipos_parceiro (
    id text PRIMARY KEY,
    codigo text UNIQUE NOT NULL, -- e.g., 'LOG', 'FISCAL'
    nome text NOT NULL, -- e.g., 'Logístico', 'Fiscal / Tributário'
    descricao text,
    status text DEFAULT 'Ativo', -- 'Ativo', 'Inativo'
    raw_data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.tipos_parceiro ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read/write" ON public.tipos_parceiro;
CREATE POLICY "Allow anonymous read/write" ON public.tipos_parceiro
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 8. Table for Categorias de Animais
CREATE TABLE IF NOT EXISTS public.categorias (
    id text PRIMARY KEY,
    codigo text UNIQUE NOT NULL, -- e.g., 'BOI', 'VAC'
    nome text NOT NULL, -- e.g., 'Boi Gordo', 'Vaca Gorda'
    descricao text,
    status text DEFAULT 'Ativo', -- 'Ativo', 'Inativo'
    raw_data jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read/write" ON public.categorias;
CREATE POLICY "Allow anonymous read/write" ON public.categorias
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 9. Reload schema cache to ensure PostgREST API detects new tables immediately
NOTIFY pgrst, 'reload schema';

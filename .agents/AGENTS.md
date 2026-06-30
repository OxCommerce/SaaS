# Regras Gerais do Sistema (OxCommerce/SaaS)

Este arquivo cataloga as regras de negócio e comportamento da interface do usuário (UI) estabelecidas no projeto.

## 1. Ordenação de Tabelas
* **Regra**: Todas as tabelas do sistema (Comercial, Fiscal, Financeiro, Logística e Cadastros) devem ser organizadas e ordenadas em **ordem alfanumérica crescente** pelo seu **ID visual / Código** principal (ex: `numeroOperacao`, `numeroOC`, `codigo`, `matricula`, `id`).
* **Comportamento**: A reordenação deve ocorrer em tempo real (client-side) assim que um registro é adicionado ou editado, eliminando a necessidade de atualizar a página (F5) para ver os dados ordenados.

## 2. Cadastro de Clientes e Fornecedores
* **Regra de Replicação Automática para Pessoa Física (PF)**:
  * Quando o cadastro for de Pessoa Física (`clientType === 'PF'`), os dados informados na aba *Geral* devem preencher automaticamente a aba *Contato*:
    * O campo **Razão Social / Nome** (`col1`) é copiado para o campo **Nome** (`contatoNome`).
    * O campo **Nome Fantasia / Sobrenome*** (`nomeFantasia`) é copiado para o campo **Sobrenome** (`contatoSobrenome`).
    * O campo **Nome do Contato** (`contatoNomeContato`) é preenchido com a junção de ambos (`Nome + Sobrenome`).
  * Quando o cadastro for de Pessoa Jurídica (`clientType === 'PJ'`), os campos de contato **não** devem ser replicados automaticamente, permitindo preenchimento manual independente.
* **Mapeamento de Labels**:
  * "Razão Social / Nome Completo *" alterado para **"Razão Social / Nome"**
  * "Nome Fantasia / Apelido *" alterado para **"Nome Fantasia / Sobrenome*"**

## 3. Ordens de Compra (Demandas)
* **Visualização de Colunas**: A tabela de Ordens de Compra no módulo comercial exibe o detalhamento do cliente logo após a coluna ID OC:
  * `ID OC` | `Cód. Cliente` | `CNPJ/CPF` | `Razão Social` | `UF` | `Cidade` | `Categoria` | `Qtd.` | `Peso` | `Preço` | `Valor` | `Status`
* **Abreviação**: Nomes longos no grid são truncados visualmente com reticências (ex: `abbreviateText(text, 10)`) e contêm um balão de dica (tooltip via atributo `title`) com o conteúdo completo ao passar o mouse.

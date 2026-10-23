# 📝 Bloco de Notas - Frontend React

Interface web moderna, reativa e profissional desenvolvida em **React** (com **Vite**) para consumo da API RESTful de gerenciamento de notas. O projeto implementa operações completas de **CRUD**, busca em tempo real, ordenação personalizada, temas Claro/Escuro, exportação de arquivos, monitor de status do servidor e integração direta com o backend em Node.js / Express.

🔗 **Repositório do Backend correspondente:** [github.com/matheusboffz/back-notas](https://github.com/matheusboffz/back-notas)

---

## ✨ Funcionalidades Principais

- ⚡ **CRUD Completo de Notas:**
  - **Criar:** Cadastro de notas com validação de campos, contador de caracteres e modelos rápidos de preenchimento (Tarefas, Ideias, Lembretes).
  - **Listar:** Exibição em cards responsivos com data de criação formatada em pt-BR.
  - **Editar:** Modo de edição integrado com foco automático no formulário e scroll suave.
  - **Excluir:** Modal de confirmação seguro com alerta visual antes da remoção definitiva.
- 📌 **Fixar Notas no Topo:** Destaque para notas prioritárias com persistência no navegador.
- 📋 **Copiar com 1 Clique:** Copia o título e o conteúdo da nota para a área de transferência com feedback animado.
- 🔍 **Busca & Filtros:** Pesquisa instantânea pelo título ou corpo da nota com botão de limpeza rápida.
- 🔃 **Ordenação Inteligente:** Filtre por mais recentes, mais antigas ou ordem alfabética (A-Z / Z-A).
- 💾 **Exportação de Notas:** Permite exportar e baixar todas as notas em formatos `.json` ou `.txt`.
- 📊 **Painel de Estatísticas:** Contagem de notas, notas criadas hoje, total de palavras e status da sincronização.
- 🌓 **Tema Claro e Escuro (Dark Mode):** Alternador fluido com suporte a variáveis CSS e preferência salva no `localStorage`.
- 📡 **Monitor de Conexão com a API:**
  - Exibe status ao vivo: **Online 🟢 (com latência em ms)**, **Conectando 🟡** ou **Offline 🔴**.
  - Modal para configurar ou alternar entre a API local (`localhost:3000`) e a nuvem (**Render**).
- 🔔 **Sistema de Toasts:** Notificações flutuantes não-bloqueantes para confirmação de ações na API.

---

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/):** Biblioteca declarativa baseada em componentes funcionais e hooks.
- **[Vite](https://vitejs.dev/):** Ferramenta de build de última geração com HMR instantâneo.
- **[Lucide React](https://lucide.dev/):** Conjunto moderno e consistente de ícones SVG.
- **CSS3 Moderno:** Flexbox, CSS Grid, Glassmorphism, Micro-animações e variáveis CSS sem frameworks pesados.
- **Fetch API com AbortController:** Requisições assíncronas com tratamento de erros e timeout de segurança (8s).

---

## 📁 Estrutura do Projeto

```text
front-notas/
├── public/                 # Arquivos públicos e favicon
├── src/
│   ├── components/         # Componentes modulares da interface
│   │   ├── ApiConfigModal.jsx  # Modal de ajuste de URL do backend com teste de ping
│   │   ├── ConfirmModal.jsx    # Modal customizado de confirmação de exclusão
│   │   ├── Header.jsx          # Barra superior com status do servidor e dark mode
│   │   ├── NoteCard.jsx        # Cartão de nota com copiar, fixar, editar e excluir
│   │   ├── NoteForm.jsx        # Formulário dinâmico com modelos rápidos e atalhos
│   │   ├── NoteList.jsx        # Grid de notas, busca, ordenação e exportação
│   │   ├── StatsBar.jsx        # Painel com métricas gerais e contadores
│   │   └── Toast.jsx           # Sistema de notificações com barra de progresso
│   ├── services/
│   │   └── api.js          # Módulo isolado de consumo HTTP e verificação de saúde da API
│   ├── App.jsx             # Componente raiz com o gerenciamento de estados
│   ├── App.css             # Design System completo (variáveis, light/dark mode)
│   ├── index.css           # Reset global de CSS
│   └── main.jsx            # Ponto de entrada do React
├── index.html              # HTML com tipografia Inter e metadados
├── package.json            # Dependências e scripts npm
├── vite.config.js          # Configuração do Vite
└── README.md               # Documentação completa
```

---

## 🔗 Rotas Consumidas da API RESTful

A aplicação consome os seguintes endpoints expostos pelo [back-notas](https://github.com/matheusboffz/back-notas):

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/notes` | Retorna o array com todas as notas cadastradas |
| **GET** | `/api/notes/:id` | Retorna uma nota individual por ID |
| **POST** | `/api/notes` | Cadastra nova nota (recebe `titulo` e `texto`) |
| **PUT** | `/api/notes/:id` | Atualiza o título e texto de uma nota existente |
| **DELETE** | `/api/notes/:id` | Remove uma nota pelo seu ID |

---

## 🚀 Como Executar Localmente

### Pré-requisitos:
- [Node.js](https://nodejs.org/) (versão 18 ou superior).
- O backend [back-notas](https://github.com/matheusboffz/back-notas) rodando localmente na porta 3000 (ou utilize a URL do Render).

### Passo a passo:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/matheusboffz/front-notas.git
   cd front-notas
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. Abra no seu navegador o endereço exibido no terminal (geralmente **`http://localhost:5173`**).

---

## ⚙️ Configuração da URL da API

Por padrão, a aplicação busca a API em `http://localhost:3000/api/notes`.

Você pode alterar a URL da API de duas formas:
1. **Pela Interface:** Clique no botão de engrenagem no cabeçalho superior (`Localhost :3000` ou `Render Nuvem`), digite a nova URL e clique em **Testar Conexão** e **Salvar**.
2. **Por Variável de Ambiente (`.env`):**
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   VITE_API_URL=https://sua-api.onrender.com/api/notes
   ```

---

## ☁️ Deploy na Vercel

1. Suba as alterações para o seu repositório no GitHub:
   ```bash
   git push origin main
   ```
2. Acesse [vercel.com](https://vercel.com/) e conecte com sua conta do GitHub.
3. Clique em **Add New Project** e selecione o repositório **`front-notas`**.
4. Nas configurações do projeto, defina a variável de ambiente:
   - `VITE_API_URL`: URL do seu backend no Render (ex: `https://back-notas.onrender.com/api/notes`).
5. Clique em **Deploy**. A Vercel cuidará do build e fornecerá uma URL pública HTTPS gratuita!

---

## 👨‍💻 Autor & Repositórios

- **Frontend:** [https://github.com/matheusboffz/front-notas](https://github.com/matheusboffz/front-notas)
- **Backend:** [https://github.com/matheusboffz/back-notas](https://github.com/matheusboffz/back-notas)
- Desenvolvido para a atividade de Frameworks Front-end (SENAI).

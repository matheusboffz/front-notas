# 📝 Projeto Notas - Frontend React

Interface moderna desenvolvida em **React** (utilizando **Vite**) para consumo da API RESTful de notas. A aplicação permite realizar todas as operações de **CRUD** (Criar, Listar, Editar e Excluir notas), além de possuir busca em tempo real e alternância dinâmica entre a API local (`localhost:3000`) e a API em nuvem hospedada no Render.

---

## 🚀 Tecnologias Utilizadas

- **[React](https://react.dev/)**: Biblioteca para construção de interfaces reativas.
- **[Vite](https://vitejs.dev/)**: Ferramenta de build ágil para desenvolvimento front-end.
- **CSS3 / Flexbox & CSS Grid**: Layout responsivo com cartões, badges e efeitos visuais.
- **Fetch API**: Consumo assíncrono dos endpoints REST.

---

## 📁 Estrutura do Projeto

```text
front-notas/
├── public/             # Arquivos públicos e ícones
├── src/
│   ├── App.jsx         # Componente principal com a lógica do CRUD e formulário
│   ├── App.css         # Estilização completa do layout e cartões
│   ├── main.jsx        # Ponto de montagem da aplicação React
│   └── index.css       # Estilos globais
├── index.html          # HTML principal
├── package.json        # Dependências e scripts
├── vite.config.js      # Configuração do Vite
└── README.md           # Documentação
```

---

## 🔗 Integração com o Backend

O frontend consome as seguintes rotas da API:

| Método | Endpoint | Ação |
| :--- | :--- | :--- |
| **GET** | `/api/notes` | Carrega e lista todas as notas |
| **POST** | `/api/notes` | Cadastra uma nova nota (`titulo`, `texto`) |
| **PUT** | `/api/notes/:id` | Atualiza o título e texto de uma nota existente |
| **DELETE** | `/api/notes/:id` | Remove uma nota pelo ID |

### Configuração da URL da API:
1. **Via Painel na Interface:** Clique no botão superior direito (`⚙️ API Local / API Nuvem`) para inserir a URL do Render a qualquer momento.
2. **Via Variável de Ambiente (`.env`):**
   ```env
   VITE_API_URL=https://seu-backend.onrender.com/api/notes
   ```

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado.
- O [Backend `back-notas`](https://github.com/matheusboffz/back-notas) rodando na porta `3000`.

### Passos:

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

4. Abra no navegador o endereço indicado (geralmente **`http://localhost:5173`**).

---

## ☁️ Deploy na Vercel

1. Suba o código para o GitHub:
   ```bash
   git add .
   git commit -m "feat: interface react completa com crud de notas"
   git push origin main
   ```
2. Acesse [vercel.com](https://vercel.com/) e faça login com sua conta do GitHub.
3. Importe o repositório **`front-notas`**.
4. Configure a variável de ambiente (opcional):
   - `VITE_API_URL`: URL da sua API no Render (ex: `https://seu-backend.onrender.com/api/notes`).
5. Clique em **Deploy**. A aplicação estará online com certificado HTTPS gratuito.

---

## 📄 Licença

Projeto acadêmico desenvolvido na disciplina de Frameworks Front-end (SENAI).

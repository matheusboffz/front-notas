import React, { useState, useEffect } from 'react';
import './App.css';

// URL base da API (pode ser configurada pelo painel ou variável de ambiente)
const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/notes';

export default function App() {
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem('apiUrl') || DEFAULT_API_URL;
  });
  const [showConfig, setShowConfig] = useState(false);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState('');
  
  // Estado do formulário (novo ou edição)
  const [form, setForm] = useState({ id: null, titulo: '', texto: '' });
  const [saving, setSaving] = useState(false);

  // Carrega notas ao montar o componente ou alterar a URL da API
  useEffect(() => {
    localStorage.setItem('apiUrl', apiUrl);
    fetchNotas();
  }, [apiUrl]);

  // GET /api/notes - Listar todas as notas
  const fetchNotas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        throw new Error(`Erro ${res.status}: Não foi possível carregar as notas.`);
      }
      const data = await res.json();
      setNotas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Falha ao conectar com o backend. Verifique se o servidor está rodando na URL configurada.');
    } finally {
      setLoading(false);
    }
  };

  // Manipula inputs do formulário
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // POST /api/notes ou PUT /api/notes/:id
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.texto.trim()) return;

    setSaving(true);
    setError(null);

    const isEditing = Boolean(form.id);
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing ? `${apiUrl}/${form.id}` : apiUrl;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: form.titulo.trim(),
          texto: form.texto.trim()
        })
      });

      if (!res.ok) {
        throw new Error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} a nota (${res.status})`);
      }

      // Limpa o formulário e recarrega
      setForm({ id: null, titulo: '', texto: '' });
      await fetchNotas();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao salvar nota.');
    } finally {
      setSaving(false);
    }
  };

  // Preenche o formulário para edição
  const handleEdit = (nota) => {
    setForm({
      id: nota.id,
      titulo: nota.titulo,
      texto: nota.texto
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancela o modo de edição
  const handleCancelEdit = () => {
    setForm({ id: null, titulo: '', texto: '' });
  };

  // DELETE /api/notes/:id - Excluir nota
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta nota?')) return;

    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error('Erro ao excluir nota');
      }
      if (form.id === id) {
        handleCancelEdit();
      }
      await fetchNotas();
    } catch (err) {
      console.error(err);
      alert('Não foi possível excluir a nota. Verifique o backend.');
    }
  };

  // Filtro de notas pela busca
  const notasFiltradas = notas.filter(nota => 
    (nota.titulo || '').toLowerCase().includes(busca.toLowerCase()) ||
    (nota.texto || '').toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="app-wrapper">
      {/* Cabeçalho */}
      <header className="header">
        <div className="header-container">
          <div className="brand">
            <span className="logo-icon">📝</span>
            <div>
              <h1>Bloco de Notas</h1>
              <p className="subtitle">Gerencie suas anotações e lembretes em tempo real</p>
            </div>
          </div>

          <div className="header-actions">
            <button 
              type="button" 
              className="btn-config"
              onClick={() => setShowConfig(!showConfig)}
              title="Configurar URL do Backend"
            >
              ⚙️ {apiUrl.includes('localhost') ? 'API Local (3000)' : 'API Nuvem (Render)'}
            </button>
          </div>
        </div>

        {/* Painel expansível de configuração da API */}
        {showConfig && (
          <div className="config-banner">
            <div className="config-content">
              <label htmlFor="api-url-input">
                <strong>URL do Endpoint do Backend:</strong>
              </label>
              <div className="config-input-group">
                <input
                  id="api-url-input"
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://seu-backend.onrender.com/api/notes"
                />
                <button 
                  type="button" 
                  className="btn-preset"
                  onClick={() => setApiUrl('http://localhost:3000/api/notes')}
                >
                  Usar Localhost
                </button>
              </div>
              <small>
                💡 Cole aqui a URL gerada no <strong>Render</strong> para conectar seu front-end à API em nuvem!
              </small>
            </div>
          </div>
        )}
      </header>

      {/* Conteúdo Principal */}
      <main className="container">
        {/* Mensagem de Erro / Alerta */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️ {error}</span>
            <button type="button" onClick={fetchNotas} className="btn-retry">Tentar novamente</button>
          </div>
        )}

        {/* Formulário de Criação/Edição */}
        <section className="form-card">
          <div className="form-header">
            <h2>{form.id ? '✏️ Editar Nota' : '➕ Nova Nota'}</h2>
            {form.id && (
              <span className="badge badge-editing">Modo de Edição</span>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titulo">Título</label>
              <input
                type="text"
                name="titulo"
                id="titulo"
                placeholder="Ex: Tarefas da semana, compras..."
                value={form.titulo}
                onChange={handleChange}
                required
                className="input-field"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="texto">Conteúdo</label>
              <textarea
                name="texto"
                id="texto"
                placeholder="Escreva a descrição detalhada da nota..."
                value={form.texto}
                onChange={handleChange}
                required
                className="textarea-field"
                rows={4}
              />
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Salvando...' : form.id ? 'Atualizar Nota' : 'Cadastrar Nota'}
              </button>

              {form.id && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Barra de Busca e Estatísticas */}
        <section className="controls-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Pesquisar notas por título ou texto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="search-input"
            />
            {busca && (
              <button 
                type="button" 
                className="btn-clear-search"
                onClick={() => setBusca('')}
              >
                ✕
              </button>
            )}
          </div>
          <div className="stats-pill">
            Total: <strong>{notasFiltradas.length}</strong> {notasFiltradas.length === 1 ? 'nota' : 'notas'}
          </div>
        </section>

        {/* Listagem de Notas */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando notas...</p>
          </div>
        ) : notasFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>{busca ? 'Nenhuma nota encontrada com esse filtro' : 'Nenhuma nota cadastrada ainda'}</h3>
            <p>
              {busca 
                ? 'Tente pesquisar por outros termos.' 
                : 'Utilize o formulário acima para cadastrar a primeira nota!'}
            </p>
          </div>
        ) : (
          <div className="notas-grid">
            {notasFiltradas.map((nota) => (
              <article key={nota.id} className="nota-card">
                <div className="nota-card-body">
                  <h3 className="nota-title">{nota.titulo}</h3>
                  <p className="nota-text">{nota.texto}</p>
                </div>

                <div className="nota-card-footer">
                  <time className="nota-date">
                    📅 {nota.criadoEm ? new Date(nota.criadoEm).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Sem data'}
                  </time>
                  <div className="nota-actions">
                    <button 
                      type="button" 
                      onClick={() => handleEdit(nota)} 
                      className="btn-action btn-edit"
                      title="Editar nota"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleDelete(nota.id)} 
                      className="btn-action btn-delete"
                      title="Excluir nota"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Rodapé */}
      <footer className="footer">
        <p>Projeto Notas • Frameworks Front-end • Backend Node.js / Express & Frontend React</p>
      </footer>
    </div>
  );
}

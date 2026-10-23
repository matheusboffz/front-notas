import React, { useState, useEffect, useCallback } from 'react';
import { 
  noteService, 
  getStoredApiUrl, 
  setStoredApiUrl 
} from './services/api';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import ConfirmModal from './components/ConfirmModal';
import ApiConfigModal from './components/ApiConfigModal';
import Toast from './components/Toast';
import './App.css';

export default function App() {
  // Configuração da URL da API
  const [apiUrl, setApiUrl] = useState(getStoredApiUrl);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Tema Claro / Escuro
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Estado das Notas
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Status de conexão com o servidor
  const [serverStatus, setServerStatus] = useState({
    online: false,
    latency: null,
    loading: true,
  });

  // Notas Fixadas (IDs salvos no localStorage)
  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('pinnedNotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Estado do Formulário
  const [form, setForm] = useState({ id: null, titulo: '', texto: '' });

  // Modal de Confirmação de Exclusão
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    nota: null,
  });

  // Sistema de Notificações Toast
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  // Aplica o tema no elemento raiz HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Salva notas fixadas no localStorage
  useEffect(() => {
    localStorage.setItem('pinnedNotes', JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  // Checa status do servidor
  const verifyServer = useCallback(async (url) => {
    setServerStatus((prev) => ({ ...prev, loading: true }));
    const result = await noteService.checkConnection(url);
    setServerStatus({
      online: result.online,
      latency: result.latency,
      loading: false,
    });
  }, []);

  // Busca lista de notas na API
  const loadNotas = useCallback(async (targetUrl = apiUrl, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await noteService.getAll(targetUrl);
      setNotas(data);
      verifyServer(targetUrl);
    } catch (err) {
      console.error(err);
      setServerStatus({ online: false, latency: null, loading: false });
      showToast(
        'error',
        'Falha de Conexão',
        `Não foi possível carregar as notas da API (${targetUrl}). Verifique se o servidor está ativo.`
      );
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  }, [apiUrl, verifyServer]);

  // Carrega notas ao montar o componente ou alterar a URL
  useEffect(() => {
    loadNotas(apiUrl);
  }, [apiUrl, loadNotas]);

  // Recarregar manual pelo cabeçalho
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotas(apiUrl, true);
    showToast('info', 'Atualizado', 'Lista de notas sincronizada com o backend.');
  };

  // Alternar fixar/desafixar nota
  const handleTogglePin = (id) => {
    setPinnedIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(
        'info',
        exists ? 'Nota Desafixada' : 'Nota Fixada',
        exists ? 'A nota voltou para a listagem normal.' : 'A nota agora fica destacada no topo.'
      );
      return updated;
    });
  };

  // Salvar (POST ou PUT)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.texto.trim()) {
      showToast('error', 'Campos Obrigatórios', 'Por favor, preencha o título e o conteúdo da nota.');
      return;
    }

    setSaving(true);
    const isEditing = Boolean(form.id);

    try {
      if (isEditing) {
        await noteService.update(form.id, form, apiUrl);
        showToast('success', 'Nota Atualizada', `A nota "${form.titulo}" foi salva com sucesso.`);
      } else {
        await noteService.create(form, apiUrl);
        showToast('success', 'Nota Criada', `A nova nota "${form.titulo}" foi cadastrada com sucesso!`);
      }

      // Limpa formulário e recarrega
      setForm({ id: null, titulo: '', texto: '' });
      await loadNotas(apiUrl, true);
    } catch (err) {
      console.error(err);
      showToast(
        'error',
        isEditing ? 'Erro ao Atualizar' : 'Erro ao Cadastrar',
        err.message || 'Falha ao salvar a nota no backend.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Iniciar edição
  const handleEditNote = (nota) => {
    setForm({
      id: nota.id,
      titulo: nota.titulo,
      texto: nota.texto,
    });
    // Scroll suave para o formulário
    const formElement = document.getElementById('form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setForm({ id: null, titulo: '', texto: '' });
  };

  // Abertura do modal de exclusão
  const handleRequestDelete = (nota) => {
    setDeleteModal({
      isOpen: true,
      nota,
    });
  };

  // Confirmação de exclusão (DELETE /api/notes/:id)
  const handleConfirmDelete = async () => {
    const nota = deleteModal.nota;
    if (!nota) return;

    try {
      await noteService.delete(nota.id, apiUrl);
      showToast('success', 'Nota Excluída', `A nota "${nota.titulo}" foi removida com sucesso.`);

      // Se estava sendo editada, limpa o form
      if (form.id === nota.id) {
        handleCancelEdit();
      }

      // Remove dos fixados se estiver fixada
      if (pinnedIds.includes(nota.id)) {
        setPinnedIds((prev) => prev.filter((id) => id !== nota.id));
      }

      await loadNotas(apiUrl, true);
    } catch (err) {
      console.error(err);
      showToast('error', 'Erro ao Excluir', err.message || 'Não foi possível excluir a nota.');
    } finally {
      setDeleteModal({ isOpen: false, nota: null });
    }
  };

  // Salvar nova URL do backend
  const handleSaveApiUrl = (newUrl) => {
    setStoredApiUrl(newUrl);
    setApiUrl(newUrl);
    showToast('info', 'Backend Atualizado', `Conectando ao endpoint: ${newUrl}`);
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app-layout">
      {/* Sistema de Notificação Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Modal de Configuração do Backend */}
      <ApiConfigModal
        isOpen={isConfigOpen}
        currentUrl={apiUrl}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveApiUrl}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Excluir Anotação"
        message="Tem certeza que deseja remover esta nota permanentemente do banco de dados? Esta ação não pode ser desfeita."
        noteTitle={deleteModal.nota?.titulo}
        confirmText="Excluir Definitivamente"
        isDanger={true}
        onCancel={() => setDeleteModal({ isOpen: false, nota: null })}
        onConfirm={handleConfirmDelete}
      />

      {/* Cabeçalho Superior */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        apiUrl={apiUrl}
        onOpenConfig={() => setIsConfigOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        serverStatus={serverStatus}
      />

      {/* Corpo Principal da Aplicação */}
      <main className="main-content">
        <div className="content-container">
          {/* Painel de Estatísticas das Notas */}
          <StatsBar 
            notas={notas} 
            serverOnline={serverStatus.online} 
          />

          {/* Grid com Formulário e Lista */}
          <div className="main-grid">
            {/* Coluna do Formulário */}
            <div className="grid-form-column">
              <NoteForm
                form={form}
                setForm={setForm}
                onSubmit={handleSubmitForm}
                onCancelEdit={handleCancelEdit}
                saving={saving}
              />
            </div>

            {/* Coluna da Listagem de Notas */}
            <div className="grid-list-column">
              <NoteList
                notas={notas}
                loading={loading}
                pinnedIds={pinnedIds}
                onTogglePin={handleTogglePin}
                onEdit={handleEditNote}
                onRequestDelete={handleRequestDelete}
                onOpenCreate={scrollToForm}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé com Links Oficiais */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-title">
            Bloco de Notas Fullstack • Desenvolvido com React & Node.js Express
          </p>
          <div className="footer-links">
            <a 
              href="https://github.com/matheusboffz/back-notas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              📦 Repositório Backend (back-notas)
            </a>
            <span className="footer-sep">•</span>
            <a 
              href="https://github.com/matheusboffz/front-notas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              💻 Repositório Frontend (front-notas)
            </a>
          </div>
          <p className="footer-copy">
            Arquitetura RESTful completa com operações de CRUD, deploy e documentação OpenAPI/Postman.
          </p>
        </div>
      </footer>
    </div>
  );
}

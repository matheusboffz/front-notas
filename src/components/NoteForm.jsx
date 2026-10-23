import React, { useRef, useEffect } from 'react';
import { 
  PlusCircle, 
  Save, 
  XCircle, 
  Sparkles, 
  RotateCcw 
} from 'lucide-react';

export default function NoteForm({
  form,
  setForm,
  onSubmit,
  onCancelEdit,
  saving,
}) {
  const titleInputRef = useRef(null);

  // Foco automático no título ao entrar em modo de edição
  useEffect(() => {
    if (form.id && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [form.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    // Atalho: Ctrl+Enter ou Cmd+Enter salva o formulário
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const applyTemplate = (tipo) => {
    if (form.titulo || form.texto) {
      if (!window.confirm('Substituir o texto atual pelo modelo pré-definido?')) return;
    }

    const templates = {
      tarefas: {
        titulo: '📋 Lista de Tarefas da Semana',
        texto: '- [ ] Revisar documentação da API\n- [ ] Testar rotas no Postman\n- [ ] Realizar build do frontend\n- [ ] Fazer deploy no Render e Vercel',
      },
      ideia: {
        titulo: '💡 Nova Ideia de Feature',
        texto: 'Objetivo: Adicionar exportação de notas em PDF e filtros por tags personalizadas.\nBenefício: Melhora a experiência do usuário e produtividade.',
      },
      lembrete: {
        titulo: '⏰ Lembrete Importante',
        texto: 'Apresentação do projeto na próxima aula de Frameworks Front-end.\nRevisar os 5 endpoints da API e requisitos da entrega.',
      },
    };

    if (templates[tipo]) {
      setForm((prev) => ({
        ...prev,
        titulo: templates[tipo].titulo,
        texto: templates[tipo].texto,
      }));
    }
  };

  const isEditing = Boolean(form.id);

  return (
    <section className="form-card" id="form-section">
      <div className="form-card-header">
        <div className="form-header-title">
          <div className="form-header-icon">
            {isEditing ? <Save size={20} /> : <PlusCircle size={20} />}
          </div>
          <div>
            <h2>{isEditing ? 'Editar Nota' : 'Criar Nova Nota'}</h2>
            <p className="form-header-subtitle">
              {isEditing 
                ? `Editando nota #${form.id}. Salve as alterações ou cancele para voltar.` 
                : 'Preencha o título e conteúdo para salvar no banco de dados da API.'}
            </p>
          </div>
        </div>

        {isEditing && (
          <span className="badge badge-editing">Modo Edição Ativo</span>
        )}
      </div>

      {/* Modelos rápidos de preenchimento (apenas ao criar nova nota) */}
      {!isEditing && (
        <div className="templates-bar">
          <span className="templates-label">
            <Sparkles size={14} /> Modelos rápidos:
          </span>
          <button
            type="button"
            className="btn-template-chip"
            onClick={() => applyTemplate('tarefas')}
          >
            📋 Tarefas
          </button>
          <button
            type="button"
            className="btn-template-chip"
            onClick={() => applyTemplate('ideia')}
          >
            💡 Ideia
          </button>
          <button
            type="button"
            className="btn-template-chip"
            onClick={() => applyTemplate('lembrete')}
          >
            ⏰ Lembrete
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} onKeyDown={handleKeyDown}>
        <div className="form-group">
          <div className="label-with-counter">
            <label htmlFor="titulo">
              <strong>Título da Nota</strong> <span className="required-star">*</span>
            </label>
            <span className="char-counter">
              {form.titulo.length}/100
            </span>
          </div>
          <input
            ref={titleInputRef}
            type="text"
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Ex: Reunião de alinhamento com a equipe..."
            required
            maxLength={100}
            className="input-field input-title"
          />
        </div>

        <div className="form-group">
          <div className="label-with-counter">
            <label htmlFor="texto">
              <strong>Conteúdo / Descrição</strong> <span className="required-star">*</span>
            </label>
            <span className="char-counter">
              {form.texto.length} caracteres
            </span>
          </div>
          <textarea
            id="texto"
            name="texto"
            value={form.texto}
            onChange={handleChange}
            placeholder="Escreva aqui todas as informações, tópicos ou detalhes importantes desta anotação..."
            required
            rows={5}
            className="textarea-field"
          />
          <small className="form-hint">
            💡 Dica: Pressione <strong>Ctrl + Enter</strong> para salvar rapidamente.
          </small>
        </div>

        <div className="form-actions-row">
          <div className="form-actions-left">
            <button
              type="submit"
              className="btn btn-primary btn-save"
              disabled={saving || !form.titulo.trim() || !form.texto.trim()}
            >
              {saving ? (
                <>
                  <span className="spinner-sm"></span>
                  Salvando na API...
                </>
              ) : isEditing ? (
                <>
                  <Save size={16} /> Atualizar Nota
                </>
              ) : (
                <>
                  <PlusCircle size={16} /> Salvar Nota
                </>
              )}
            </button>

            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelEdit}
                disabled={saving}
              >
                <XCircle size={16} /> Cancelar Edição
              </button>
            )}
          </div>

          {!isEditing && (form.titulo || form.texto) && (
            <button
              type="button"
              className="btn-clear-form"
              onClick={() => setForm({ id: null, titulo: '', texto: '' })}
              title="Limpar campos do formulário"
            >
              <RotateCcw size={14} /> Limpar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

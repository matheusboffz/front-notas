import React, { useState } from 'react';
import { 
  Calendar, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  Pin 
} from 'lucide-react';

export default function NoteCard({ 
  nota, 
  isPinned, 
  onTogglePin, 
  onEdit, 
  onRequestDelete 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${nota.titulo}\n\n${nota.texto}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback simples caso a clipboard API falhe
      const textarea = document.createElement('textarea');
      textarea.value = `${nota.titulo}\n\n${nota.texto}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = nota.criadoEm
    ? new Date(nota.criadoEm).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Sem data';

  return (
    <article className={`nota-card ${isPinned ? 'is-pinned' : ''}`}>
      {/* Cabeçalho do Card */}
      <div className="nota-card-header">
        <div className="nota-header-left">
          {isPinned && (
            <span className="badge-pinned">
              <Pin size={12} className="fill-current" /> Fixada
            </span>
          )}
          <span className="nota-id-tag">#{nota.id}</span>
        </div>

        <div className="nota-header-actions">
          <button
            type="button"
            className={`btn-action-icon pin-action ${isPinned ? 'active' : ''}`}
            onClick={() => onTogglePin(nota.id)}
            title={isPinned ? 'Desafixar nota' : 'Fixar nota no topo'}
            aria-label="Fixar nota"
          >
            <Pin size={15} />
          </button>

          <button
            type="button"
            className={`btn-action-icon copy-action ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title={copied ? 'Copiado para a área de transferência!' : 'Copiar nota'}
            aria-label="Copiar conteúdo da nota"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
      </div>

      {/* Conteúdo da Nota */}
      <div className="nota-card-body">
        <h3 className="nota-title">{nota.titulo}</h3>
        <p className="nota-text">{nota.texto}</p>
      </div>

      {/* Rodapé do Card */}
      <div className="nota-card-footer">
        <div className="nota-meta" title={`Criado em: ${formattedDate}`}>
          <Calendar size={13} className="meta-icon" />
          <time className="nota-date">{formattedDate}</time>
        </div>

        <div className="nota-buttons-group">
          <button
            type="button"
            className="btn-card-action btn-edit"
            onClick={() => onEdit(nota)}
            title="Editar esta nota"
          >
            <Edit3 size={14} />
            <span>Editar</span>
          </button>

          <button
            type="button"
            className="btn-card-action btn-delete"
            onClick={() => onRequestDelete(nota)}
            title="Excluir esta nota"
          >
            <Trash2 size={14} />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </article>
  );
}

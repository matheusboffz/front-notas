import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, noteTitle, onConfirm, onCancel, confirmText = 'Excluir', isDanger = true }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-title">
            <span className={`modal-badge-icon ${isDanger ? 'danger' : 'primary'}`}>
              <AlertTriangle size={20} />
            </span>
            <h3>{title}</h3>
          </div>
          <button type="button" className="btn-icon modal-close" onClick={onCancel} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p>{message}</p>
          {noteTitle && (
            <div className="modal-highlight-box">
              <span className="modal-highlight-label">Nota selecionada:</span>
              <p className="modal-highlight-title">"{noteTitle}"</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button 
            type="button" 
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} 
            onClick={onConfirm}
          >
            {isDanger ? <Trash2 size={16} /> : null}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

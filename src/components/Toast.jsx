import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="toast-icon success" size={20} />,
    error: <AlertCircle className="toast-icon error" size={20} />,
    info: <Info className="toast-icon info" size={20} />,
  };

  return (
    <div className={`toast-container toast-${toast.type || 'info'}`} role="alert">
      <div className="toast-icon-wrapper">
        {icons[toast.type] || icons.info}
      </div>
      <div className="toast-content">
        <strong className="toast-title">{toast.title || (toast.type === 'error' ? 'Erro' : 'Sucesso')}</strong>
        <p className="toast-message">{toast.message}</p>
      </div>
      <button 
        type="button" 
        className="toast-close" 
        onClick={onClose} 
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>
      <div 
        className="toast-progress" 
        style={{ animationDuration: `${toast.duration || 4000}ms` }} 
      />
    </div>
  );
}

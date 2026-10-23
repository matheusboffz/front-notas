import React, { useState } from 'react';
import { Server, CheckCircle2, AlertCircle, RefreshCw, X, ExternalLink } from 'lucide-react';
import { noteService, DEFAULT_API_URL } from '../services/api';

export default function ApiConfigModal({ isOpen, currentUrl, onClose, onSave }) {
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await noteService.checkConnection(urlInput);
    setTesting(false);
    setTestResult(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onSave(urlInput.trim());
    onClose();
  };

  const handlePreset = (url) => {
    setUrlInput(url);
    setTestResult(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-title">
            <span className="modal-badge-icon primary">
              <Server size={20} />
            </span>
            <div>
              <h3>Conectar ao Backend</h3>
              <p className="modal-subtitle">Configure o endpoint da API RESTful de Notas</p>
            </div>
          </div>
          <button type="button" className="btn-icon modal-close" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="api-url-field"><strong>URL Base da API (/api/notes):</strong></label>
              <input
                id="api-url-field"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Ex: http://localhost:3000/api/notes ou https://seu-app.onrender.com/api/notes"
                required
                className="input-field"
              />
            </div>

            <div className="presets-wrapper">
              <span className="presets-label">Atalhos rápidos:</span>
              <div className="presets-buttons">
                <button
                  type="button"
                  className={`btn-preset-chip ${urlInput === DEFAULT_API_URL ? 'active' : ''}`}
                  onClick={() => handlePreset('http://localhost:3000/api/notes')}
                >
                  💻 Localhost (Porta 3000)
                </button>
                <button
                  type="button"
                  className={`btn-preset-chip ${urlInput.includes('onrender.com') ? 'active' : ''}`}
                  onClick={() => handlePreset('https://back-notas.onrender.com/api/notes')}
                >
                  ☁️ Nuvem Render (Deploy)
                </button>
              </div>
            </div>

            <div className="test-connection-section">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleTest}
                disabled={testing || !urlInput.trim()}
              >
                {testing ? <RefreshCw className="animate-spin" size={15} /> : <RefreshCw size={15} />}
                {testing ? 'Testando Conexão...' : 'Testar Conexão Agora'}
              </button>

              {testResult && (
                <div className={`connection-feedback ${testResult.online ? 'success' : 'error'}`}>
                  {testResult.online ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Backend Online! Latência: <strong>{testResult.latency} ms</strong></span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      <span>Falha: {testResult.error || 'Não foi possível contatar o servidor'}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="api-info-box">
              <p>
                🔗 <strong>Repositório do Backend:</strong>{' '}
                <a 
                  href="https://github.com/matheusboffz/back-notas" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="link-external"
                >
                  github.com/matheusboffz/back-notas <ExternalLink size={12} />
                </a>
              </p>
              <small>
                💡 Se a API estiver hospedada no Render (plano gratuito), a primeira requisição pode levar de 30 a 50 segundos para "acordar" o servidor.
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar Configuração
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

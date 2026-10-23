import React from 'react';
import { 
  FileText, 
  Sun, 
  Moon, 
  Settings, 
  RefreshCw, 
  Github, 
  Radio
} from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  apiUrl, 
  onOpenConfig, 
  onRefresh, 
  isRefreshing, 
  serverStatus 
}) {
  const isLocal = apiUrl.includes('localhost');

  return (
    <header className="header">
      <div className="header-container">
        {/* Marca do Aplicativo */}
        <div className="brand">
          <div className="logo-icon-wrapper">
            <FileText className="logo-icon" size={24} />
          </div>
          <div>
            <div className="brand-title-row">
              <h1>Bloco de Notas</h1>
              <span className="badge-pill">Fullstack REST</span>
            </div>
            <p className="subtitle">Gerencie suas anotações integradas com a API Node.js</p>
          </div>
        </div>

        {/* Ações e Conexão */}
        <div className="header-actions">
          {/* Status do Backend */}
          <div 
            className={`server-status-pill ${serverStatus.online ? 'status-online' : serverStatus.loading ? 'status-loading' : 'status-offline'}`}
            title={`Status do Servidor: ${serverStatus.online ? `Online (${serverStatus.latency}ms)` : 'Offline'}`}
          >
            <Radio size={14} className={serverStatus.online ? 'pulse-icon' : ''} />
            <span className="status-text">
              {serverStatus.loading 
                ? 'Conectando...' 
                : serverStatus.online 
                  ? `API Online (${serverStatus.latency}ms)` 
                  : 'API Offline'}
            </span>
          </div>

          {/* Botão de Atualizar Notas */}
          <button
            type="button"
            className="btn-icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Recarregar notas do servidor"
            aria-label="Recarregar notas"
          >
            <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          {/* Botão de Configuração do Backend */}
          <button
            type="button"
            className="btn-config"
            onClick={onOpenConfig}
            title="Configurar URL do Backend"
          >
            <Settings size={15} />
            <span>{isLocal ? 'Localhost :3000' : 'Render Nuvem'}</span>
          </button>

          {/* Link para o GitHub do Backend */}
          <a
            href="https://github.com/matheusboffz/back-notas"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-github"
            title="Acessar repositório do Backend no GitHub"
          >
            <Github size={16} />
            <span className="hide-on-mobile">Backend</span>
          </a>

          {/* Alternador de Tema Claro/Escuro */}
          <button
            type="button"
            className="btn-icon theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Mudar para tema Claro' : 'Mudar para tema Escuro'}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
          </button>
        </div>
      </div>
    </header>
  );
}

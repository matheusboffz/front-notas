import React from 'react';
import { 
  FileText, 
  Sun, 
  Moon, 
  Settings, 
  RefreshCw, 
  Radio
} from 'lucide-react';

const GithubIcon = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

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
            <GithubIcon size={16} />
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

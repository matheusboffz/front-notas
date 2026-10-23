import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  ArrowUpDown, 
  Download, 
  Inbox, 
  Pin, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';
import NoteCard from './NoteCard';

export default function NoteList({
  notas,
  loading,
  pinnedIds,
  onTogglePin,
  onEdit,
  onRequestDelete,
  onOpenCreate,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recentes'); // 'recentes' | 'antigas' | 'az' | 'za'
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Filtragem e ordenação das notas
  const filteredAndSortedNotas = useMemo(() => {
    let result = notas.filter((n) => {
      const q = searchTerm.toLowerCase();
      const tituloMatch = (n.titulo || '').toLowerCase().includes(q);
      const textoMatch = (n.texto || '').toLowerCase().includes(q);
      return tituloMatch || textoMatch;
    });

    result.sort((a, b) => {
      // 1º critério: Notas fixadas sempre vêm primeiro
      const aPinned = pinnedIds.includes(a.id);
      const bPinned = pinnedIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      // 2º critério: Ordenação selecionada
      if (sortBy === 'recentes') {
        return new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0);
      }
      if (sortBy === 'antigas') {
        return new Date(a.criadoEm || 0) - new Date(b.criadoEm || 0);
      }
      if (sortBy === 'az') {
        return (a.titulo || '').localeCompare(b.titulo || '');
      }
      if (sortBy === 'za') {
        return (b.titulo || '').localeCompare(a.titulo || '');
      }
      return 0;
    });

    return result;
  }, [notas, searchTerm, sortBy, pinnedIds]);

  // Exportar notas
  const handleExport = (formato) => {
    setShowExportMenu(false);
    if (notas.length === 0) return;

    let content = '';
    let filename = `notas-${new Date().toISOString().slice(0, 10)}`;
    let mimeType = 'text/plain';

    if (formato === 'json') {
      content = JSON.stringify(notas, null, 2);
      filename += '.json';
      mimeType = 'application/json';
    } else {
      content = notas
        .map(
          (n, idx) =>
            `#${idx + 1} - ${n.titulo}\nCriado em: ${n.criadoEm || 'N/A'}\n${'-'.repeat(30)}\n${n.texto}\n\n`
        )
        .join('\n');
      filename += '.txt';
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="notes-section">
      {/* Barra de Controles (Busca, Ordenação, Exportação) */}
      <div className="controls-bar">
        {/* Campo de Busca */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar por título ou conteúdo das anotações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchTerm('')}
              title="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Ações da Barra: Ordenação e Exportar */}
        <div className="controls-actions">
          {/* Ordenação */}
          <div className="select-wrapper">
            <ArrowUpDown size={15} className="select-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              title="Critério de ordenação"
            >
              <option value="recentes">Mais recentes primeiro</option>
              <option value="antigas">Mais antigas primeiro</option>
              <option value="az">Ordem alfabética (A-Z)</option>
              <option value="za">Ordem alfabética (Z-A)</option>
            </select>
          </div>

          {/* Exportação */}
          <div className="export-dropdown-wrapper">
            <button
              type="button"
              className="btn btn-secondary btn-export"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={notas.length === 0}
              title="Exportar notas salvas"
            >
              <Download size={15} />
              <span className="hide-on-mobile">Exportar</span>
            </button>

            {showExportMenu && (
              <div className="export-menu">
                <button
                  type="button"
                  className="export-menu-item"
                  onClick={() => handleExport('json')}
                >
                  <FileText size={15} /> Exportar como JSON
                </button>
                <button
                  type="button"
                  className="export-menu-item"
                  onClick={() => handleExport('txt')}
                >
                  <FileText size={15} /> Exportar como TXT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contagem / Filtros ativos */}
      <div className="results-info-row">
        <span className="results-count">
          Exibindo <strong>{filteredAndSortedNotas.length}</strong> de <strong>{notas.length}</strong> notas cadastradas
        </span>
        {pinnedIds.length > 0 && (
          <span className="pinned-count-tag">
            <Pin size={12} /> {pinnedIds.length} fixada(s)
          </span>
        )}
      </div>

      {/* Estado: Carregando Skeleton */}
      {loading ? (
        <div className="notas-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-header">
                <div className="skeleton-line sm"></div>
                <div className="skeleton-line icon"></div>
              </div>
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text half"></div>
              <div className="skeleton-footer"></div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedNotas.length === 0 ? (
        /* Estado Vazio */
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <Inbox size={42} className="empty-icon" />
          </div>
          <h3>
            {searchTerm 
              ? 'Nenhuma nota encontrada para esta busca' 
              : 'Nenhuma nota cadastrada ainda'}
          </h3>
          <p>
            {searchTerm
              ? `Não encontramos resultados contendo "${searchTerm}". Tente pesquisar por outros termos.`
              : 'O banco de dados está vazio. Preencha o formulário acima para criar sua primeira nota na API!'}
          </p>
          {searchTerm ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSearchTerm('')}
            >
              Limpar Filtro de Busca
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenCreate}
            >
              Criar Primeira Nota
            </button>
          )}
        </div>
      ) : (
        /* Grid com as Notas */
        <div className="notas-grid">
          {filteredAndSortedNotas.map((nota) => (
            <NoteCard
              key={nota.id}
              nota={nota}
              isPinned={pinnedIds.includes(nota.id)}
              onTogglePin={onTogglePin}
              onEdit={onEdit}
              onRequestDelete={onRequestDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

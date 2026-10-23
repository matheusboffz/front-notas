import React, { useMemo } from 'react';
import { FileText, Calendar, AlignLeft, CheckCircle2 } from 'lucide-react';

export default function StatsBar({ notas, serverOnline }) {
  const stats = useMemo(() => {
    const total = notas.length;
    const hojeStr = new Date().toDateString();

    const hoje = notas.filter((n) => {
      if (!n.criadoEm) return false;
      return new Date(n.criadoEm).toDateString() === hojeStr;
    }).length;

    const palavras = notas.reduce((acc, curr) => {
      const texto = `${curr.titulo || ''} ${curr.texto || ''}`;
      return acc + texto.trim().split(/\s+/).filter(Boolean).length;
    }, 0);

    return { total, hoje, palavras };
  }, [notas]);

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-icon-box blue">
          <FileText size={18} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total de Notas</span>
          <strong className="stat-value">{stats.total}</strong>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-box green">
          <Calendar size={18} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Criadas Hoje</span>
          <strong className="stat-value">{stats.hoje}</strong>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-box purple">
          <AlignLeft size={18} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total de Palavras</span>
          <strong className="stat-value">{stats.palavras.toLocaleString('pt-BR')}</strong>
        </div>
      </div>

      <div className="stat-card">
        <div className={`stat-icon-box ${serverOnline ? 'emerald' : 'rose'}`}>
          <CheckCircle2 size={18} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Sincronização</span>
          <strong className="stat-value">{serverOnline ? 'Ativa' : 'Pendente'}</strong>
        </div>
      </div>
    </div>
  );
}

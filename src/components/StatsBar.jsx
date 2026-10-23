import React from 'react';
import { FileText, Calendar, AlignLeft, CheckCircle2 } from 'lucide-react';

export default function StatsBar({ notas, serverOnline }) {
  const totalNotas = notas.length;

  const notasHoje = notas.filter((n) => {
    if (!n.criadoEm) return false;
    const dataNota = new Date(n.criadoEm).toDateString();
    const hoje = new Date().toDateString();
    return dataNota === hoje;
  }).length;

  const totalPalavras = notas.reduce((acc, curr) => {
    const texto = `${curr.titulo || ''} ${curr.texto || ''}`;
    const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
    return acc + palavras;
  }, 0);

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-icon-box blue">
          <FileText size={18} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total de Notas</span>
          <strong className="stat-value">{totalNotas}</strong>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-box green">
          <Calendar size={18} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Criadas Hoje</span>
          <strong className="stat-value">{notasHoje}</strong>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-box purple">
          <AlignLeft size={18} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total de Palavras</span>
          <strong className="stat-value">{totalPalavras.toLocaleString('pt-BR')}</strong>
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

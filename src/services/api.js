/**
 * Serviço de integração com a API RESTful do Backend (back-notas).
 * Repositório do Backend: https://github.com/matheusboffz/back-notas
 */

export const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/notes';

export const getStoredApiUrl = () => {
  return localStorage.getItem('apiUrl') || DEFAULT_API_URL;
};

export const setStoredApiUrl = (url) => {
  localStorage.setItem('apiUrl', url.trim());
};

/**
 * Executa requisição fetch com timeout de segurança
 */
const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Tempo de requisição esgotado (timeout de 8s). O servidor demorou a responder.');
    }
    throw error;
  }
};

/**
 * Objeto de métodos para consumo do CRUD de notas
 */
export const noteService = {
  /**
   * GET /api/notes - Listar todas as notas
   */
  async getAll(baseUrl = getStoredApiUrl()) {
    const response = await fetchWithTimeout(baseUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Falha ao obter notas (HTTP ${response.status})`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  /**
   * GET /api/notes/:id - Obter nota específica por ID
   */
  async getById(id, baseUrl = getStoredApiUrl()) {
    const response = await fetchWithTimeout(`${baseUrl}/${id}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Falha ao obter nota #${id} (HTTP ${response.status})`);
    }

    return await response.json();
  },

  /**
   * POST /api/notes - Cadastrar nova nota
   */
  async create(noteData, baseUrl = getStoredApiUrl()) {
    const response = await fetchWithTimeout(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        titulo: noteData.titulo.trim(),
        texto: noteData.texto.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Falha ao cadastrar nota (HTTP ${response.status})`);
    }

    return await response.json();
  },

  /**
   * PUT /api/notes/:id - Atualizar nota existente
   */
  async update(id, noteData, baseUrl = getStoredApiUrl()) {
    const response = await fetchWithTimeout(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        titulo: noteData.titulo.trim(),
        texto: noteData.texto.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Falha ao atualizar nota #${id} (HTTP ${response.status})`);
    }

    return await response.json();
  },

  /**
   * DELETE /api/notes/:id - Excluir nota por ID
   */
  async delete(id, baseUrl = getStoredApiUrl()) {
    const response = await fetchWithTimeout(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Falha ao excluir nota #${id} (HTTP ${response.status})`);
    }

    return true;
  },

  /**
   * Testa a conectividade com o backend e calcula a latência
   */
  async checkConnection(baseUrl = getStoredApiUrl()) {
    const startTime = performance.now();
    try {
      const response = await fetchWithTimeout(baseUrl, { method: 'GET' }, 5000);
      const latency = Math.round(performance.now() - startTime);

      if (response.ok) {
        return { online: true, latency, status: response.status };
      }
      return { online: false, latency, status: response.status, error: `HTTP ${response.status}` };
    } catch (err) {
      return { online: false, latency: null, error: err.message || 'Sem conexão com o servidor' };
    }
  },
};

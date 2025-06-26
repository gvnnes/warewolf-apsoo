const API = 'http://localhost:3000/api/atletas';

const AtletaService = {
  async listar(token) {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao listar atletas');
    return data;
  },

  async cadastrar(atleta, token) {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(atleta),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar atleta');
    return data;
  },

  async editar(id, atleta, token) {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(atleta),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao editar atleta');
    return data;
  },

  async excluir(id, token) {
    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao remover atleta');
    return data;
  },

  listarPendentes: async (token) => {
      const res = await fetch('http://localhost:3000/api/atletas/documentos/pendentes', {
          headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao listar documentos pendentes');
      return data;
  },

  gerenciarStatus: async (atletaId, statusData, token) => {
      const res = await fetch(`http://localhost:3000/api/atletas/${atletaId}/documento/status`, {
          method: 'PUT',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(statusData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar status do documento');
      return data;
  },
};

export default AtletaService;
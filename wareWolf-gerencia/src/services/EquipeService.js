const API = 'http://localhost:3000/api/equipes';

const EquipeService = {
  obter: async (token) => {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  cadastrar: async (equipe, token) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equipe),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar equipe');
    return data;
  },

  listarTodas: async (token) => {
    const res = await fetch(`${API}/gerenciar/todas`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao listar equipes');
    return data;
  },

  remover: async (id, token) => {
    const res = await fetch(`${API}/gerenciar/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao remover equipe');
    return data;
  },

  obterPorId: async (id, token) => {
    const res = await fetch(`${API}/gerenciar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao buscar equipe');
    return data;
  },

  atualizar: async (id, equipeData, token) => {
    const res = await fetch(`${API}/gerenciar/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(equipeData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao atualizar equipe');
    return data;
  },
  atualizarStatus: async (id, status, token) => {
    const res = await fetch(`<span class="math-inline">\{API\}/gerenciar/</span>{id}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao atualizar status');
    return data;
}
};

export default EquipeService;
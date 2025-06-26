const API = 'http://localhost:3000/api/modalidades';

const ModalidadeService = {
  listar: async (token) => {
    const res = await fetch(API, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao listar modalidades');
    return data;
  },

  criar: async (modalidadeData, token) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modalidadeData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao criar modalidade');
    return data;
  },

  atualizar: async (id, modalidadeData, token) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modalidadeData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao atualizar modalidade');
    return data;
  },

  remover: async (id, token) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao remover modalidade');
    }
  },
};

export default ModalidadeService;
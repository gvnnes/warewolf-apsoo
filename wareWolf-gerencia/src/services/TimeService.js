const API = 'http://localhost:3000/api/times';

const TimeService = {
  listar: async (token) => {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao listar times');
    return data;
  },

  criar: async (timeData, token) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(timeData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao criar time');
    return data;
  },

  adicionarAtleta: async (timeId, atletaId, token) => {
    const res = await fetch(`${API}/${timeId}/atletas`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ atletaId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao adicionar atleta');
    return data;
  },

  removerAtleta: async (timeId, atletaId, token) => {
    const res = await fetch(`${API}/${timeId}/atletas/${atletaId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao remover atleta');
    return data;
  },
};

export default TimeService;
const API = 'http://localhost:3000/api';

const PartidaService = {
  listar: async (campeonatoId, modalidadeId) => {
    const res = await fetch(`${API}/partidas?campeonatoId=${campeonatoId}&modalidadeId=${modalidadeId}`);
    if (!res.ok) throw new Error('Erro ao buscar partidas');
    return res.json();
  },

  criar: async (dados, token) => {
    const res = await fetch(`${API}/partidas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dados)
    });
    if (!res.ok) throw new Error('Erro ao criar partida');
    return res.json();
  },

  atualizar: async (id, dados, token) => {
    const res = await fetch(`${API}/partidas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dados)
    });
    if (!res.ok) throw new Error('Erro ao atualizar partida');
    return res.json();
  }
};

export default PartidaService;
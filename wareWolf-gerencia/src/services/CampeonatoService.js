
const API = 'http://localhost:3000/api/campeonatos';

const CampeonatoService = {
  listar: async (token) => {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao listar campeonatos');
    return data;
  },

  criar: async (campeonatoData, token) => {
    const res = await fetch(API, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(campeonatoData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao criar campeonato');
    return data;
  },
  
  inscrever: async (campeonatoId, modalidadeId, token) => {
    const res = await fetch(`${API}/${campeonatoId}/modalidades/${modalidadeId}/inscrever`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao se inscrever');
    return data;
  },

  gerarChaveamento: async (campeonatoId, modalidadeId, token) => {
    const res = await fetch(`${API}/${campeonatoId}/modalidades/${modalidadeId}/gerar-chaveamento`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao gerar chaveamento');
    return data;
  },
  agendarPartidas: async (campeonatoId, modalidadeId, scheduleData, token) => {
    const res = await fetch(`${API}/${campeonatoId}/modalidades/${modalidadeId}/agendar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao agendar partidas');
    return data;
  },
};


export default CampeonatoService;
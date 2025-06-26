const API = 'http://localhost:3000/api/auth';

const AuthService = {
  login: async (email, senha) => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('user', JSON.stringify(data));
    return data; 
  
  },

    

  register: async (form) => {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getUser: () => {
    const item = localStorage.getItem('user');
    return item ? JSON.parse(item) : null;
  },
  forgotPassword: async (email) => {
      const res = await fetch(`${API}/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
  },

    resetPassword: async (resetData) => {
        const res = await fetch(`${API}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resetData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
};

export default AuthService;

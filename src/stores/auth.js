import { defineStore } from 'pinia'
import api from '../api/client';

const getSafeUser = () => {
  try {
    const data = localStorage.getItem('user');
    return data && data.trim().startsWith('{') ? JSON.parse(data) : null;
  } catch (e) {
    localStorage.removeItem('user');
    return null;
  }
};

export const useAuth = defineStore('auth', {
  state: () => ({
    token:  localStorage.getItem('token') || null,
    user:   getSafeUser(),
  }),
  getters: {
    isAuthenticated:  (s) => !!s.token,
    isAdmin:          (s) => s.user?.role === 'admin',
  },
  actions: {
    async login(email, password){
      const {data} = await api.post('/auth/login', { email, password });
      this.token = data.access_token;
      this.user = data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    async register(name, email, password) {
      await api.post('/auth/register', { name,email,password});
      await this.login(email,password);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});


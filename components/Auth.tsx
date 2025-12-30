
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  users: User[];
}

export const Auth: React.FC<AuthProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError('Credenciais inválidas. Verifique usuário e senha.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
            S
          </div>
          <h1 className="text-2xl font-bold">Sistema de Gestão SGF</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Entre com suas credenciais para acessar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Digite seu usuário"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
          >
            Entrar no Sistema
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest">Acesso Controlado</p>
          <p className="text-[10px] text-slate-400 mt-1">Padrão: admin / admin</p>
        </div>
      </div>
    </div>
  );
};

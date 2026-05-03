import React, { useState } from 'react';
import type { User } from '../types';
import * as api from '../services/api';

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isRegister) {
        result = await api.register(username, email, password);
      } else {
        result = await api.login(username, password);
      }

      const user = result.user;
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Impossible de se connecter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-4">
        {isRegister ? 'Créer un compte' : 'Connexion'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
            required
          />
        </div>

        {isRegister && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-purple-600 px-4 py-3 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Patientez...' : isRegister ? 'Créer mon compte' : 'Se connecter'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        {isRegister ? 'Vous avez déjà un compte ?' : 'Pas encore de compte ?'}{' '}
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="font-semibold text-purple-600 hover:text-purple-700"
        >
          {isRegister ? 'Se connecter' : 'Créer un compte'}
        </button>
      </div>
    </div>
  );
}

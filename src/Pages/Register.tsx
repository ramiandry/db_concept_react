import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    // 👉 Envoyer les infos vers ton API d'inscription ici
    console.log("Register form:", form);
  };

  const handleGoogleRegister = () => {
    window.location.href = 'http://localhost:8000/api/auth/google'; // adapt to your backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Créer un compte</h2>
          <p className="text-sm text-gray-500">Et commencez à créer vos MCD intelligemment !</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Nom complet</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            S’inscrire
          </button>
        </form>

        {/* Ou Google */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="h-px bg-gray-200 flex-1" />
          ou
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center space-x-3 border py-2 rounded-md hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm">S’inscrire avec Google</span>
        </button>

        <p className="text-center text-sm text-gray-500">
          Déjà un compte ? <Link to="/login" className="text-blue-500">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

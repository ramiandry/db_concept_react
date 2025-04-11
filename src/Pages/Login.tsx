import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import useCreateUser from '../hooks/useCreateUser';
import useAuthUser from '../hooks/useAuthUser';
import { CircleLoader, RingLoader } from 'react-spinners';  

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {createUser, data, error} = useCreateUser();
  const {loginUser} = useAuthUser();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Appel API login classique ici
    console.log({ email, password });
  };

  const handleGoogleLogin =useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        console.log("Token:", tokenResponse);
        setLoading(true);
        try {
          // Utilisez le token d'accès pour récupérer les informations de l'utilisateur avec axios
          const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`, // Le token d'accès
            },
          });
    
          const userData = response.data; // Données de l'utilisateur retournées par Axios
          console.log("User Data:", userData);
    
          // Vous pouvez maintenant utiliser ces informations comme vous le souhaitez
          const { given_name, family_name, email, picture } = userData; // Exemple d'extraction des données
          // Enregistrez l'utilisateur dans la base de données
          await createUser({
            username: family_name.toString().replace(/ /g, "_") + "_" + given_name.toString().replace(/ /g, "_"), // Nom d'utilisateur
            email,
            password: 'Google_Auth_DBConcept!2025', // Mot de passe par défaut
            password_confirmation: 'Google_Auth_DBConcept!2025', // Mot de passe par défaut
          });
    
          
          // Fermez le formulaire de connexion
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      },
    });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Se connecter à DBConcept</h2>
          <p className="text-sm text-gray-500">Modélisez vos bases de données avec l’IA</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Mot de passe</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Connexion
          </button>
        </form>

        {/* OR separator */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="h-px bg-gray-200 flex-1" />
          ou
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-3 border py-2 rounded-md hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl" /> 
          {loading ? (
        <div className="flex justify-center items-center">
          <CircleLoader color="#36d7b7" size={50} />
        </div>
      ) : (
        <span className="text-sm">Se connecter avec Google</span>
      )}
        </button>

        {/* Optional: lien d'inscription */}
        <p className="text-center text-sm text-gray-500">
          Pas encore de compte ? <Link to="/register" className="text-blue-500">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

interface UserData {
  // Définissez ici la structure des données que vous attendez de l'API
  // Par exemple :
  token: string;
  user_id: number;
  email: string;
}

export default function useAuthUser() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [data, setData] = useState<UserData | null>(null);
  let navigate = useNavigate();

  const loginUser = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<UserData> = await axios.post(
        "http://localhost:8000/api/login/",
        formData
        // Headers ne sont pas nécessaires ici, Axios les gère automatiquement
      );

      setData(response.data);
      navigate('/dashboard'); // Redirigez vers la page d'accueil ou une autre page
      localStorage.setItem("token", response.data.token); // Enregistrement des données utilisateur dans le localStorage
    } catch (err: any) {
      setError(err); // AxiosError ou toute autre erreur peut être capturée ici
    } finally {
      setLoading(false);
    }
  };

  return {
    loginUser,
    data,
    error,
    loading,
  };
}

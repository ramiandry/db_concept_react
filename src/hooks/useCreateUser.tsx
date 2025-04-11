import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import useAuthUser from "./useAuthUser";
import { BsPass } from "react-icons/bs";

interface UserData {
  // Définissez ici la structure des données que vous attendez de l'API
  // Par exemple :
  id: number;
  username: string;
  email: string;
}

export default function useCreateUser() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [data, setData] = useState<UserData | null>(null);
  let navigate = useNavigate();
  const {loginUser} = useAuthUser();

  const createUser = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<UserData> = await axios.post(
        "http://localhost:8000/api/register/",
        formData
        // Headers ne sont pas nécessaires ici, Axios les gère automatiquement
      );
      loginUser({
        email: formData.email,
        password: formData.password,
      });
      setData(response.data);

    } catch (err: any) {
      setError(err); // AxiosError ou toute autre erreur peut être capturée ici
      if(err.response.data.username[0] == "A user with that username already exists." && formData.password == "Google_Auth_DBConcept!2025"){
        loginUser({
          email: formData.email,
          password: formData.password,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    createUser,
    data,
    error,
    loading,
  };
}

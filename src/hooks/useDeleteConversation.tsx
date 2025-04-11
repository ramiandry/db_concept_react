import { useState } from 'react';
import axios from 'axios';

export default function useDeleteConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);


  const deleteConversation = async (id : any,) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.delete(
        'http://localhost:8000/api/conversations/'+id+"/",
        {
          headers: {
            'Authorization': `Token ${token?.trim()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setData(response.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteConversation,
    data,
    error,
    loading,
  };
}

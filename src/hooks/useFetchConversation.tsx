import { useState } from 'react';
import axios from 'axios';

export default function useFetchConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchConversation = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        'http://localhost:8000/api/conversations/',
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
    fetchConversation,
    data,
    error,
    loading,
  };
}

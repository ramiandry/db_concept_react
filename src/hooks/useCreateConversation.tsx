import { useState } from 'react';
import axios from 'axios';
import useCreateMessage from './useCreateMessage';

export default function useCreateConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const {createMessage} = useCreateMessage();

  const createConversation = async (formData: any, setId : any,) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/conversations/',
        formData,
        {
          headers: {
            'Authorization': `Token ${token?.trim()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setData(response.data);
      // Create a message for the new conversation
      const messageData = {
        text: formData.text,
        sender: 'user',
        conversation: response.data.id,
      };
      createMessage(messageData, response.data.id)
      setId(response.data.id);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    createConversation,
    data,
    error,
    loading,
  };
}

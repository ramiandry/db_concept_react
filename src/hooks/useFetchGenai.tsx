import { useState } from 'react';
import axios from 'axios';
import useCreateMessage from './useCreateMessage';

export default function useFetchGenai() {

  const {createMessage} = useCreateMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchGenai = async (formData: any, setMessage : any, updateMsg: any, setLoad: any) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/genai/',
        formData,
        {
          headers: {
            'Authorization': `Token ${token?.trim()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setData(response.data);
      console.log(response.data.response.toString().replace(/```json|```/g, '').trim())
      const message_ai = JSON.parse(response.data.response.toString().replace(/```json|```/g, '')
      .replace(/```json|```/g, '')
      .replace(/\/\/.*$/gm, '')  
      .trim()) 
      

      if(message_ai.type === 'text') {
        setMessage([...updateMsg, {
          id: Date.now() + 1,
          role: 'bot',
          type: 'text',
          text: message_ai.response,
        }])

        createMessage({
          text: message_ai.response,
          sender: 'bot',
          conversation: formData.conversation,
        }, formData.conversation)
      } else{
        setMessage([...updateMsg, {
          id: Date.now() + 1,
          role: 'bot',
          type: message_ai.type,
          nodes: message_ai.nodes.map((node: any)=>({
            id: node.id,
            data: {
                label: (<div dangerouslySetInnerHTML={{ __html: node.data.label }} />),
            },
            position: node.position,
            style: node.style,
        })) ,
          edges: message_ai.edges,
        }])
        createMessage({
          text: JSON.stringify(message_ai) ,
          sender: 'bot',
          type : "mcd",
          conversation: formData.conversation,
          nodes: message_ai.nodes,
          edges: message_ai.edges,
        }, formData.conversation)
      }
      setLoad(false)
    } catch (err: any) {
      setError(err);
      setMessage([...updateMsg, {
        id: Date.now() + 1,
        role: 'bot',
        type: 'text',
        text: err.toString(),
      }])

      createMessage({
        text: err.toString(),
        sender: 'bot',
        conversation: formData.conversation,
      }, formData.conversation)
    } finally {
      setLoading(false);
      setLoad(false)

    }
  };

  return {
    fetchGenai,
    data,
    error,
    loading,
  };
}

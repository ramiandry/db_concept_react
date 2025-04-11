import { useState } from 'react';
import axios from 'axios';

export default function useExportSql() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const exportSql = async (tables: string) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/genai/',
        {
          message :"exporter en sql " + tables,
        },
        {
          headers: {
            'Authorization': `Token ${token?.trim()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setData(response.data);
      const message_ai = response.data.response.toString().replace(/```json|```/g, '')
      .replace(/```sql|```/g, '')
      .replace(/\/\/.*$/gm, '')  
      .trim()
      console.log(message_ai)

      const blob = new Blob([message_ai], { type: 'text/sql' });
    
      // Créez un lien de téléchargement temporaire
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'database_export.sql'; // Nom du fichier
      link.click(); // Déclenche le téléchargement
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    exportSql,
    data,
    error,
    loading,
  };
}

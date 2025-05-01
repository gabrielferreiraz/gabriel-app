import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'localhost:8080'; // Altere com seu ngrok se necessário

function App() {
  const [userId, setUserId] = useState('gabriel');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [status, setStatus] = useState('');
  const [qrCodeHtml, setQrCodeHtml] = useState('');
  const [feedback, setFeedback] = useState('');

  const createInstance = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/instance/create/${userId}`);
      setFeedback(res.data);
      fetchStatus();
    } catch (err: any) {
      setFeedback('Erro: ' + (err.response?.data || err.message));
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/instance/status/${userId}`);
      setStatus(res.data);
    } catch {
      setStatus('Desconectado');
    }
  };

  const fetchQrCode = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/instance/qr/${userId}`, {
        headers: { Accept: 'text/html' },
      });
      setQrCodeHtml(res.data);
    } catch (err) {
      setQrCodeHtml('<p>Erro ao carregar QR Code</p>');
    }
  };

  const setWebhook = async () => {
    try {
      await axios.post(`${BASE_URL}/webhook/set/${userId}`, { url: webhookUrl });
      setFeedback('Webhook configurado com sucesso!');
    } catch (err: any) {
      setFeedback('Erro ao configurar webhook: ' + (err.response?.data || err.message));
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Painel WhatsApp (MVP)</h1>

      <label className="block mb-1 text-sm">User ID</label>
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border rounded px-2 py-1 mb-4 w-full"
      />

      <label className="block mb-1 text-sm">Webhook</label>
      <input
        value={webhookUrl}
        onChange={(e) => setWebhookUrl(e.target.value)}
        className="border rounded px-2 py-1 mb-2 w-full"
      />
      <button onClick={setWebhook} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        Setar Webhook
      </button>

      <div className="space-x-2 mb-4">
        <button onClick={createInstance} className="bg-blue-600 text-white px-4 py-2 rounded">
          Criar Instância
        </button>
        <button onClick={fetchQrCode} className="bg-purple-600 text-white px-4 py-2 rounded">
          Ver QR Code
        </button>
      </div>

      <p className="mb-2"><strong>Status:</strong> {status}</p>
      <p className="text-sm text-gray-700 mb-4">{feedback}</p>

      {qrCodeHtml && <div dangerouslySetInnerHTML={{ __html: qrCodeHtml }} />}
    </div>
  );
}

export default App;

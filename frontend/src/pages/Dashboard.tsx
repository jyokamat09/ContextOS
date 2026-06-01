import { useState, useEffect } from 'react';
import { uploadPDF, listDocuments } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const userId = 2;

  useEffect(() => {
    listDocuments(userId).then(res => setDocuments(res.data));
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadPDF(file, userId);
      const res = await listDocuments(userId);
      setDocuments(res.data);
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ContextOS</h1>
          <button
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="text-gray-400 hover:text-white"
          >
            Logout
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <input
            type="file"
            accept=".pdf"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="text-gray-400 mb-4 block"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-violet-600 hover:bg-violet-700 px-6 py-2 rounded-lg font-semibold"
          >
            {uploading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
          {documents.length === 0 && (
            <p className="text-gray-400">No documents yet. Upload a PDF to get started.</p>
          )}
          {documents.map(doc => (
            <div
              key={doc.id}
              onClick={() => navigate(`/chat/${doc.id}`)}
              className="bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-lg p-4 mb-3 flex justify-between items-center"
            >
              <span>{doc.filename}</span>
              <span className="text-violet-400 text-sm">Chat →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
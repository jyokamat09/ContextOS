import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { askQuestion, submitFeedback } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = 2;

  const handleAsk = async () => {
    if (!input.trim()) return;
    const question = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const res = await askQuestion(question, Number(documentId));
      const answer = res.data.answer;
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error getting answer.' }]);
    }
    setLoading(false);
  };

  const handleFeedback = async (rating: string, question: string, answer: string) => {
    await submitFeedback(userId, Number(documentId), question, answer, rating);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="p-4 bg-gray-900 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white">← Back</button>
        <h1 className="text-xl font-bold">Chat with Document</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`rounded-2xl px-4 py-3 max-w-xl ${msg.role === 'user' ? 'bg-violet-600' : 'bg-gray-800'}`}>
              {msg.content}
            </div>
            {msg.role === 'assistant' && (
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => handleFeedback('up', messages[i-1]?.content, msg.content)}
                  className="text-gray-400 hover:text-green-400 text-sm"
                >👍</button>
                <button
                  onClick={() => handleFeedback('down', messages[i-1]?.content, msg.content)}
                  className="text-gray-400 hover:text-red-400 text-sm"
                >👎</button>
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-gray-400">Thinking...</div>}
      </div>

      <div className="p-4 bg-gray-900">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 outline-none"
            placeholder="Ask a question about your document..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-lg font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
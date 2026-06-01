import axios from 'axios';

const API_BASE = 'https://contextos-g1dz.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
});

export const signup = (email: string, password: string) =>
  api.post('/auth/signup', { email, password });

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const uploadPDF = (file: File, userId: number) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/documents/upload?user_id=${userId}`, formData);
};

export const listDocuments = (userId: number) =>
  api.get(`/documents/list?user_id=${userId}`);

export const askQuestion = (question: string, documentId: number) =>
  api.post('/chat/ask', { question, document_id: documentId });

export const submitFeedback = (
  userId: number,
  documentId: number,
  question: string,
  answer: string,
  rating: string
) =>
  api.post('/feedback/submit', {
    user_id: userId,
    document_id: documentId,
    question,
    answer,
    rating,
  });

export default api;
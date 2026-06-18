import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkService = {
  analyzeUrl: async (url: string) => {
    const response = await api.post('/analyze/url', { url });
    return response.data;
  },
  
  analyzeMessage: async (messageText: string) => {
    const response = await api.post('/analyze/message', { message_text: messageText });
    return response.data;
  },
  
  analyzeFusion: async (payload: { url?: string; phone?: string; upi?: string; message_text?: string }) => {
    const response = await api.post('/analyze/fusion', payload);
    return response.data;
  },
  
  getExplainability: async (scanId: string) => {
    const response = await api.get('/analyze/explainability', { params: { scan_id: scanId } });
    return response.data;
  }
};

export const reportService = {
  submitReport: async (reportData: {
    reported_phone?: string;
    reported_upi?: string;
    reported_url?: string;
    scam_category: string;
    description: string;
    loss_amount: number;
  }) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  }
};

export const researchService = {
  getExperiments: async (category?: string) => {
    const response = await api.get('/research/experiments', { params: { category } });
    return response.data;
  },
  
  getGraphEntity: async (entityValue: string) => {
    const response = await api.get('/research/graph/entity', { params: { entity_value: entityValue } });
    return response.data;
  },
  
  getGraphDashboard: async () => {
    const response = await api.get('/research/graph/dashboard');
    return response.data;
  }
};

export const ragService = {
  queryAssistant: async (query: string) => {
    const response = await api.post('/rag/query', { query });
    return response.data;
  },
  explainScam: async (payload: { risk_score: number; scam_type: string; evidence?: string[] }) => {
    const response = await api.post('/rag/explain-scam', payload);
    return response.data;
  }
};

export const systemService = {
  getHealth: async () => {
    const response = await api.get('/system/health');
    return response.data;
  }
};

export default api;

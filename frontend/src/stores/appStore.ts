import { create } from 'zustand';
import { checkService, ragService, systemService } from '../services/api';

export interface AnalysisResult {
  scan_id: string;
  timestamp: string;
  scam_category: string;
  raw_probabilities: {
    url_model: number;
    nlp_model: number;
    graph_model: number;
  };
  fused_probability: number;
  calibration: {
    calibrated_probability: number;
    confidence_score: number;
    method: string;
  };
  explainability: {
    shap_values: Record<string, number>;
    evidence_trace: string[];
    human_readable_explanation: string;
  };
  graph_available: boolean;
}

export interface RAGResult {
  explanation: string;
  prevention_steps: string[];
  references: string[];
}

export interface SystemHealth {
  api: boolean;
  postgres: boolean;
  neo4j: boolean;
  rag: boolean;
}

interface AppState {
  inputs: {
    url: string;
    phone: string;
    upi: string;
    messageText: string;
  };
  currentResult: AnalysisResult | null;
  ragResult: RAGResult | null;
  systemHealth: SystemHealth | null;
  isLoading: boolean;
  ragIsLoading: boolean;
  error: string | null;
  
  setInputs: (fields: Partial<AppState['inputs']>) => void;
  clearInputs: () => void;
  runFusionAnalysis: () => Promise<void>;
  fetchRagExplanation: (scamType: string, riskScore: number) => Promise<void>;
  fetchSystemHealth: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  inputs: {
    url: '',
    phone: '',
    upi: '',
    messageText: '',
  },
  currentResult: null,
  ragResult: null,
  systemHealth: null,
  isLoading: false,
  ragIsLoading: false,
  error: null,
  
  setInputs: (fields) => set((state) => ({ inputs: { ...state.inputs, ...fields } })),
  
  clearInputs: () => set({
    inputs: { url: '', phone: '', upi: '', messageText: '' },
    currentResult: null,
    ragResult: null,
    error: null
  }),
  
  runFusionAnalysis: async () => {
    const { inputs } = get();
    if (!inputs.url && !inputs.phone && !inputs.upi && !inputs.messageText) {
      set({ error: "Please enter at least one signal parameter to begin analysis." });
      return;
    }
    
    set({ isLoading: true, error: null, ragResult: null });
    try {
      const data = await checkService.analyzeFusion({
        url: inputs.url || undefined,
        phone: inputs.phone || undefined,
        upi: inputs.upi || undefined,
        message_text: inputs.messageText || undefined,
      });
      set({ currentResult: data, isLoading: false });
      
      // Automatically pull RAG knowledge recommendations based on the predicted scam category
      await get().fetchRagExplanation(data.scam_category, data.calibration.calibrated_probability * 100);
    } catch (err: any) {
      set({ 
        error: err.response?.data?.detail || "An error occurred during multi-modal scan evaluation.", 
        isLoading: false 
      });
    }
  },
  
  fetchRagExplanation: async (scamType: string, riskScore: number) => {
    set({ ragIsLoading: true, ragResult: null });
    try {
      const data = await ragService.explainScam({
        risk_score: riskScore,
        scam_type: scamType
      });
      set({ ragResult: data, ragIsLoading: false });
    } catch (err) {
      console.error("Failed to retrieve RAG context advisories:", err);
      set({ ragIsLoading: false });
    }
  },
  
  fetchSystemHealth: async () => {
    try {
      const data = await systemService.getHealth();
      set({ systemHealth: data });
    } catch (err) {
      console.error("Failed to fetch system health status:", err);
      set({ systemHealth: { api: false, postgres: false, neo4j: false, rag: false } });
    }
  }
}));

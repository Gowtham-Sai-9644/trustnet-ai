import { create } from 'zustand';
import { researchService } from '../services/api';

export interface GraphNodeDetail {
  entity: string;
  label: string;
  pagerank: number;
  degree_centrality: number;
  relationships: Array<{
    type: string;
    target_node: string;
    target_label: string;
  }>;
}

interface GraphState {
  searchQuery: string;
  selectedNode: GraphNodeDetail | null;
  isLoading: boolean;
  error: string | null;
  
  setSearchQuery: (query: string) => void;
  searchEntity: (entity: string) => Promise<void>;
  clearSelection: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  searchQuery: '',
  selectedNode: null,
  isLoading: false,
  error: null,
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  searchEntity: async (entity) => {
    if (!entity.trim()) return;
    
    set({ isLoading: true, error: null });
    try {
      const data = await researchService.getGraphEntity(entity);
      set({ selectedNode: data, isLoading: false, searchQuery: entity });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.detail || "Could not locate graph entity or its associations.", 
        isLoading: false 
      });
    }
  },
  
  clearSelection: () => set({ selectedNode: null, searchQuery: '', error: null })
}));

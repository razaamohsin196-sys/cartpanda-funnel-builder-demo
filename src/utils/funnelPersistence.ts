import { Node, Edge } from 'reactflow';

export interface FunnelData {
  nodes: Node[];
  edges: Edge[];
  nodeCounters: {
    upsell: number;
    downsell: number;
  };
  version: string;
  savedAt: string;
}

const FUNNEL_STORAGE_KEY = 'cartpanda-funnel-data';
const FUNNEL_VERSION = '1.0.0';

/**
 * Save funnel data to localStorage
 */
export const saveFunnelToLocalStorage = (
  nodes: Node[],
  edges: Edge[],
  nodeCounters: { upsell: number; downsell: number }
): void => {
  try {
    const funnelData: FunnelData = {
      nodes: nodes.map((node) => ({
        ...node,
        // Remove validation state before saving (it's computed)
        data: {
          ...node.data,
          validation: undefined,
        },
      })),
      edges,
      nodeCounters,
      version: FUNNEL_VERSION,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify(funnelData));
  } catch (error) {
    console.error('Failed to save funnel to localStorage:', error);
    throw new Error('Failed to save funnel. Please check browser storage permissions.');
  }
};

/**
 * Load funnel data from localStorage
 */
export const loadFunnelFromLocalStorage = (): FunnelData | null => {
  try {
    const stored = localStorage.getItem(FUNNEL_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const funnelData: FunnelData = JSON.parse(stored);

    // Validate version compatibility (basic check)
    if (funnelData.version && funnelData.version !== FUNNEL_VERSION) {
      console.warn(
        `Funnel version mismatch. Stored: ${funnelData.version}, Current: ${FUNNEL_VERSION}`
      );
    }

    return funnelData;
  } catch (error) {
    console.error('Failed to load funnel from localStorage:', error);
    return null;
  }
};

/**
 * Clear funnel data from localStorage
 */
export const clearFunnelFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(FUNNEL_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear funnel from localStorage:', error);
  }
};

/**
 * Export funnel data as JSON string
 */
export const exportFunnelAsJSON = (
  nodes: Node[],
  edges: Edge[],
  nodeCounters: { upsell: number; downsell: number }
): string => {
  const funnelData: FunnelData = {
    nodes: nodes.map((node) => ({
      ...node,
      // Remove validation state before exporting (it's computed)
      data: {
        ...node.data,
        validation: undefined,
      },
    })),
    edges,
    nodeCounters,
    version: FUNNEL_VERSION,
    savedAt: new Date().toISOString(),
  };

  return JSON.stringify(funnelData, null, 2);
};

/**
 * Download funnel as JSON file
 */
export const downloadFunnelAsFile = (
  nodes: Node[],
  edges: Edge[],
  nodeCounters: { upsell: number; downsell: number },
  filename: string = 'funnel-export.json'
): void => {
  try {
    const jsonString = exportFunnelAsJSON(nodes, edges, nodeCounters);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download funnel:', error);
    throw new Error('Failed to export funnel. Please try again.');
  }
};

/**
 * Import funnel from JSON string
 */
export const importFunnelFromJSON = (jsonString: string): FunnelData => {
  try {
    const funnelData: FunnelData = JSON.parse(jsonString);

    // Basic validation
    if (!funnelData.nodes || !Array.isArray(funnelData.nodes)) {
      throw new Error('Invalid funnel data: nodes array is missing or invalid');
    }

    if (!funnelData.edges || !Array.isArray(funnelData.edges)) {
      throw new Error('Invalid funnel data: edges array is missing or invalid');
    }

    if (!funnelData.nodeCounters) {
      // Default counters if missing
      funnelData.nodeCounters = { upsell: 0, downsell: 0 };
    }

    return funnelData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format. Please check the file and try again.');
    }
    throw error;
  }
};

/**
 * Read funnel from uploaded file
 */
export const readFunnelFromFile = (file: File): Promise<FunnelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const funnelData = importFunnelFromJSON(jsonString);
        resolve(funnelData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file. Please try again.'));
    };

    reader.readAsText(file);
  });
};


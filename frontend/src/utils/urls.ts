// Utility functions for API and asset URLs

export const getApiBaseUrl = (): string => {
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

export const getBackendBaseUrl = (): string => {
  const apiUrl = getApiBaseUrl();
  // Remove '/api' from the end to get the backend base URL
  return apiUrl.replace('/api', '');
};

export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const backendUrl = getBackendBaseUrl();
  return `${backendUrl}${path}`;
};

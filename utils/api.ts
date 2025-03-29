export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('jwt');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...options.headers,
    ...getAuthHeader(),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('jwt');
    window.location.href = '/login';
    throw new Error('인증이 필요합니다.');
  }

  return response;
}; 
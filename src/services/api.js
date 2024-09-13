const API_BASE_URL = 'http://127.0.0.1:5000';

// Helper function for making API requests
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const config = {
    method,
    headers,
    credentials: 'include',
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const responseData = await response.text();
  
  return { response, responseData };
}

// API functions
export async function hackRepo(repoUrl) {
  const response = await fetch(`${API_BASE_URL}/api/hack`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify({ repo_url: repoUrl }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return {
    async *[Symbol.asyncIterator]() {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(5));
              yield data;
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        }
      }

      if (buffer.startsWith('data: ')) {
        try {
          const data = JSON.parse(buffer.slice(5));
          yield data;
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    },
  };
}

export async function pingBackend() {
  const start = Date.now();
  const { response, responseData } = await apiRequest('/ping');
  const latency = Date.now() - start;

  return {
    status: response.status,
    ok: response.ok,
    responseData,
    latency
  };
}

// Add more API functions here as needed

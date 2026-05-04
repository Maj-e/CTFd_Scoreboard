const SCOREBOARD_API_URL =
  import.meta.env.VITE_SCOREBOARD_API_URL || '/api/v1/scoreboard';
const API_TOKEN = import.meta.env.VITE_CTFD_TOKEN;

/**
 * Fetches scoreboard data from the API.
 * @returns {Promise<Object>} The scoreboard data.
 */
export const fetchScoreboard = async () => {
  try {
    const headers = {};
    if (API_TOKEN) {
      headers.Authorization = `Token ${API_TOKEN}`;
    }
    headers['Content-Type'] = 'application/json';

    const response = await fetch(SCOREBOARD_API_URL, { headers });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error while fetching the scoreboard:', error);
    throw error;
  }
};

/**
 * Custom hook for fetching and managing scoreboard data.
 * @returns {Object} { scoreboard, loading, error }
 */
export const useScoreboard = () => {
  const [scoreboard, setScoreboard] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchScoreboard()
      .then(data => {
        setScoreboard(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { scoreboard, loading, error };
};

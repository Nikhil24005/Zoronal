import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(endpoint);

        if (isMounted) {
          setData(response.data);
          setError(null);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { data, loading, error };
}

export default useFetch;

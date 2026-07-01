import { useEffect, useState } from 'react';

export function useCarros() {
  const [carros, setCarros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function carregar() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/carros');
        if (!response.ok) {
          throw new Error('Não foi possível carregar os veículos');
        }
        const data = await response.json();
        if (!cancelled) {
          setCarros(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Erro ao carregar veículos');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    carregar();

    return () => {
      cancelled = true;
    };
  }, []);

  return { carros, loading, error };
}

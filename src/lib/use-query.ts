import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

type Result<T> = { data: T | null; error: { message: string } | null };
type State<T> = { data: T | null; error: string | null; loading: boolean };

/** Ejecuta `fetcher` cada vez que la pantalla gana foco (vuelve tras editar/crear). */
export function useQuery<T>(fetcher: () => PromiseLike<Result<T>>, key: string) {
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const [state, setState] = useState<State<T>>({
    data: null,
    error: null,
    loading: true,
  });

  const run = useCallback(async () => {
    const { data, error } = await fetcherRef.current();
    setState({ data, error: error?.message ?? null, loading: false });
    // `key` fuerza un refetch cuando cambian los parámetros de la ruta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useFocusEffect(
    useCallback(() => {
      run();
    }, [run]),
  );

  return { ...state, refetch: run };
}

import { useEffect, useMemo, useRef, useState } from "react";
import SearchWorker from "./search.worker.js?worker";
import { DISPLAY_LIMIT, parseQuery } from "./search-engine.js";

const initialState = { items: [], fallback: false, parsed: parseQuery(""), loading: false, elapsed: 0 };

export function useLocalSearch(products, query) {
  const workerRef = useRef(null); const requestRef = useRef(0); const buildRef = useRef(0); const productMapRef = useRef(new Map());
  const [ready, setReady] = useState(false); const [state, setState] = useState(initialState);
  const parsed = useMemo(() => parseQuery(query), [query]);
  useEffect(() => {
    const worker = new SearchWorker(); workerRef.current = worker;
    worker.onmessage = ({ data }) => {
      if (data.type === "built") { setReady(true); return; }
      if (data.type === "result" && data.requestId === requestRef.current) {
        setState({ ...data.result, items: data.result.items.map((item) => ({ ...item, product: productMapRef.current.get(item.id) })).filter((item) => item.product), loading: false, elapsed: data.elapsed });
      }
    };
    return () => worker.terminate();
  }, []);

  useEffect(() => {
    const worker = workerRef.current; if (!worker) return;
    productMapRef.current = new Map(products.map((product) => [product.id, product]));
    setReady(false); setState((current) => ({ ...current, loading: products.length > 0 }));
    const buildId = ++buildRef.current;
    worker.postMessage({ type: "build", buildId, products: products.map(({ image, ...indexable }) => indexable) });
  }, [products]);

  useEffect(() => {
    const worker = workerRef.current;
    if (!products.length) { setState(initialState); return; }
    if (!ready || !worker) { setState((current) => ({ ...current, parsed, loading: true })); return; }
    const requestId = ++requestRef.current;
    worker.postMessage({ type: "search", requestId, query, limit: DISPLAY_LIMIT });
  }, [products.length, query, ready, parsed]);

  return { ...state, parsed, ready };
}

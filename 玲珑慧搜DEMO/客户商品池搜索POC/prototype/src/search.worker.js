import { createSearchIndex, searchIndex, DISPLAY_LIMIT } from "./search-engine.js";

let index = createSearchIndex([]);
self.onmessage = ({ data }) => {
  if (data.type === "build") {
    const startedAt = performance.now();
    index = createSearchIndex(data.products || []);
    self.postMessage({ type: "built", buildId: data.buildId, size: index.size, elapsed: Math.round(performance.now() - startedAt) });
  }
  if (data.type === "search") {
    const startedAt = performance.now();
    const result = searchIndex(index, data.query, data.limit || DISPLAY_LIMIT);
    self.postMessage({ type: "result", requestId: data.requestId, result, elapsed: Math.round(performance.now() - startedAt) });
  }
};

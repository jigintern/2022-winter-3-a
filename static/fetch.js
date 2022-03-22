const fetchJSON = async (url, req) => {
  const opt = getRequestInit(req);
  const res = await fetch(url, opt);
  return await res.json();
};

const fetchText = async (url, req) => {
  const opt = getRequestInit(req);
  const res = await fetch(url, opt);
  return await res.text();
};

const getRequestInit = (req) => {
  return req
    ? {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      }
    : null;
};

export { fetchJSON, fetchText };

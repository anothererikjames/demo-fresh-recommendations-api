const http = require("http");
const { randomUUID } = require("crypto");

const service = "recommendations";
const resourcePath = "/recommendations";
const idField = "recommendationId";
let items = [{"recommendationId":"rec-101","status":"active","customerId":"cus-101","itemIds":["sku-101","sku-102"],"strategy":"personalized","confidence":0.92,"createdAt":"2026-07-16T20:00:00Z","updatedAt":"2026-07-16T20:00:00Z"}];

function send(res, status, body) {
  const headers = { "Content-Type": "application/json", "X-Request-Id": `req-${randomUUID()}` };
  res.writeHead(status, headers);
  res.end(body === undefined ? undefined : JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => { raw += chunk; });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch (error) { reject(error); }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/health" && req.method === "GET") return send(res, 200, { status: "ok", service, version: "1.0.0" });

  if (url.pathname === resourcePath && req.method === "GET") {
    const status = url.searchParams.get("status");
    const data = status ? items.filter(item => item.status === status) : items;
    return send(res, 200, { data, meta: { limit: 20, count: data.length, nextCursor: null } });
  }

  if (url.pathname === resourcePath && req.method === "POST") {
    try {
      const input = await readJson(req);
      const now = new Date().toISOString();
      const created = { [idField]: `rec-${Date.now()}`, status: "active", ...input, createdAt: now, updatedAt: now };
      items.push(created);
      return send(res, 201, created);
    } catch (error) { return send(res, 400, { code: "invalid_json", message: error.message, requestId: `req-${randomUUID()}` }); }
  }

  const match = url.pathname.match(new RegExp(`^${resourcePath}/([^/]+)$`));
  if (match) {
    const index = items.findIndex(item => item[idField] === decodeURIComponent(match[1]));
    if (index < 0) return send(res, 404, { code: "not_found", message: "The requested resource was not found", requestId: `req-${randomUUID()}` });
    if (req.method === "GET") return send(res, 200, items[index]);
    if (req.method === "PATCH") {
      try {
        const input = await readJson(req);
        items[index] = { ...items[index], ...input, [idField]: items[index][idField], updatedAt: new Date().toISOString() };
        return send(res, 200, items[index]);
      } catch (error) { return send(res, 400, { code: "invalid_json", message: error.message, requestId: `req-${randomUUID()}` }); }
    }
    if (req.method === "DELETE") { items.splice(index, 1); res.writeHead(204); return res.end(); }
  }

  return send(res, 404, { code: "not_found", message: "The requested route was not found", requestId: `req-${randomUUID()}` });
});

server.listen(Number(process.env.PORT || 3000), () => console.log(`${service} listening`));

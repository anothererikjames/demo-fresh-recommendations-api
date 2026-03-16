const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/recommendations" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify([{ id: "rec-101", items: ["sku-101", "sku-102"] }]));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(3000);

import crypto from "crypto";

const CLIENT_ID = process.env.SNAPTRADE_CLIENT_ID;
const CONSUMER_KEY = process.env.SNAPTRADE_CONSUMER_KEY;
const BASE = "https://api.snaptrade.com/api/v1";

function signRequest(path, queryParams = {}, body = {}) {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const query = { ...queryParams, clientId: CLIENT_ID, timestamp };
  const queryStr = new URLSearchParams(
    Object.keys(query).sort().reduce((s, k) => ({ ...s, [k]: query[k] }), {})
  ).toString();
  const sigObj = { content: body, path, query: queryStr };
  const sigContent = JSON.stringify(sigObj, Object.keys(sigObj).sort());
  const signature = crypto
    .createHmac("sha256", CONSUMER_KEY)
    .update(sigContent)
    .digest("base64");
  return { queryStr, signature };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!CLIENT_ID || !CONSUMER_KEY) {
    return res.status(500).json({ error: "SnapTrade credentials not configured" });
  }

  const { path, userId, userSecret, method = "GET" } = req.query;
  if (!path) return res.status(400).json({ error: "Missing path" });

  const queryParams = {};
  if (userId) queryParams.userId = userId;
  if (userSecret) queryParams.userSecret = userSecret;

  const body = req.method === "POST" ? req.body : {};
  const { queryStr, signature } = signRequest(path, queryParams, body);

  const url = `${BASE}${path}?${queryStr}`;
  try {
    const response = await fetch(url, {
      method: req.method === "POST" ? "POST" : "GET",
      headers: {
        Signature: signature,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: req.method === "POST" ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

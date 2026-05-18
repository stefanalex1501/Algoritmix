import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const cppEnginePath = process.env.CPP_ENGINE_PATH || join(rootDir, "cpp", "algoritmix_engine.exe");

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", app: "EduNova", date: new Date().toISOString() });
});

app.post("/api/v1/simulate-cpp", (req, res) => {
  const { algorithm, vector, startNode } = req.body || {};
  if (!algorithm) return res.status(400).json({ error: "algorithm is required" });

  const args = [algorithm];
  if (algorithm === "bfs") {
    args.push((startNode || "A").toString().toUpperCase());
  } else if (Array.isArray(vector)) {
    for (const value of vector) {
      const n = Number(value);
      if (!Number.isFinite(n)) return res.status(400).json({ error: "vector must contain only numbers" });
      args.push(String(Math.trunc(n)));
    }
  } else {
    return res.status(400).json({ error: "vector is required for sorting algorithms" });
  }

  const child = spawn(cppEnginePath, args, { stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "";
  let stderr = "";
  let responded = false;

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });
  child.on("error", (error) => {
    if (responded) return;
    responded = true;
    res.status(500).json({
      error: "C++ engine failed to start",
      details: error.message,
      hint: "Run `npm run cpp:build` in backend to compile the C++ engine."
    });
  });
  child.on("close", (code) => {
    if (responded) return;
    responded = true;
    if (code !== 0) {
      return res.status(500).json({ error: "C++ engine execution failed", details: stderr || `Exit code ${code}` });
    }

    const lines = stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const steps = lines.map((line) => {
      const [message, payload] = line.split("|");
      if (algorithm === "bfs") {
        const order = payload?.startsWith("order:") ? payload.replace("order:", "").split(",").filter(Boolean) : [];
        return { message, order, queue: [] };
      }

      const array = payload ? payload.split(",").filter(Boolean).map((x) => Number(x)) : [];
      return { message, array };
    });

    return res.json({ engine: "cpp", algorithm, steps });
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`EduNova backend running on port ${port}`);
});

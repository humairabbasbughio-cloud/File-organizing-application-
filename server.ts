import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API endpoints
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "online",
      app: "DriveSort Guard",
      version: "1.0.0",
      compliance: "GDPR Compliant",
      safetyGuarantee: "Zero-File-Deletion / Non-Destructive"
    });
  });

  // Server-side audit log recorder endpoint
  app.post("/api/logs", (req, res) => {
    const log = req.body;
    console.log(`[AUDIT LOG] ${new Date().toISOString()} | User: ${log.userEmail || 'System'} | Action: ${log.action} | Status: ${log.status}`);
    res.json({ success: true, timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DriveSort Guard Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start DriveSort Guard server:", err);
});

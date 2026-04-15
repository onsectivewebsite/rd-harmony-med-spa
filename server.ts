import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function killPort(port: number) {
  const { execSync } = await import("child_process");
  try {
    const pids = execSync(`lsof -ti:${port}`, { encoding: "utf-8" }).trim();
    if (pids) {
      execSync(`kill -9 ${pids.split("\n").join(" ")}`);
      await new Promise((r) => setTimeout(r, 500));
    }
  } catch {}
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Kill any existing processes on ports we need
  await killPort(PORT);
  await killPort(24678);

  app.use(express.json());

  // API routes FIRST
  app.post("/api/enquiry", (req, res) => {
    const { name, email, message, service } = req.body;
    
    // In a real app, you'd use a service like SendGrid or AWS SES here.
    // For now, we'll log it and return success.
    console.log("--- NEW ENQUIRY RECEIVED ---");
    console.log(`From: ${name} (${email})`);
    console.log(`Service: ${service || 'General Inquiry'}`);
    console.log(`Message: ${message}`);
    console.log("----------------------------");

    // Simulate email sending success
    res.json({ 
      success: true, 
      message: "Your enquiry has been sent to our team. We will contact you soon!" 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

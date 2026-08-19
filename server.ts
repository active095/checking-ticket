import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import {
  processSubmission,
  buildAdminEmailHtml,
  buildUserConfirmationEmailHtml,
  getTransporter,
  recentSubmissions,
} from "./api/_lib/ticketService";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.post("/api/submit-ticket", async (req, res) => {
  try {
    const result = await processSubmission(req.body);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error processing ticket validation:", error);
    return res.status(500).json({
      success: false,
      error: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer ultérieurement.",
    });
  }
});

// Admin diagnostic / preview endpoint for emails
app.get("/api/diagnostic-emails", (req, res) => {
  const latest = recentSubmissions[0];
  if (!latest) {
    return res.json({
      hasSubmissions: false,
      message: "Aucune soumission enregistrée pour l'instant.",
    });
  }

  const queryLang = (req.query.lang as string) || latest.language || "fr";

  res.json({
    hasSubmissions: true,
    latestSubmission: {
      ...latest,
      codeMasked: latest.code.replace(/.(?=.{4})/g, "*"),
    },
    adminEmailHtml: buildAdminEmailHtml(latest),
    userEmailHtml: buildUserConfirmationEmailHtml(latest, queryLang),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", service: "checking-ticket-api", timestamp: new Date().toISOString() });
});

// Diagnostic endpoint to verify SMTP connection
app.get("/api/smtp-status", async (req, res) => {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    return res.json({
      configured: false,
      message: "Variables SMTP non configurées (utilise le mode simulation par défaut).",
    });
  }

  try {
    const transporter = getTransporter();
    await transporter.verify();
    return res.json({
      configured: true,
      connected: true,
      user,
      host,
      message: "Connexion SMTP établie avec succès ! Les e-mails seront bien expédiés.",
    });
  } catch (error: any) {
    return res.status(500).json({
      configured: true,
      connected: false,
      user,
      host,
      errorName: error.name,
      errorMessage: error.message,
      responseCode: error.responseCode,
      code: error.code,
      help: error.message.includes("BadCredentials") || error.message.includes("535")
        ? "Pour Gmail, vous devez obligatoirement utiliser un 'Mot de passe d'application' Google (16 caractères) généré depuis https://myaccount.google.com/apppasswords et non votre mot de passe habituel de messagerie."
        : "Vérifiez vos identifiants ou le serveur SMTP.",
    });
  }
});

// Vite integration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Checking Ticket server listening on port ${PORT}`);
  });
}

start();
import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");

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
    let transporter: any;
    if (host.includes("gmail.com") || host === "smtp.gmail.com") {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass: pass.replace(/\s+/g, "") },
      });
    } else {
      transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
        auth: { user, pass },
      });
    }

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
      help: error.message?.includes("BadCredentials") || error.message?.includes("535")
        ? "Pour Gmail, vous devez obligatoirement utiliser un 'Mot de passe d'application' Google (16 caractères) généré depuis https://myaccount.google.com/apppasswords et non votre mot de passe habituel de messagerie."
        : "Vérifiez vos identifiants ou le serveur SMTP.",
    });
  }
}
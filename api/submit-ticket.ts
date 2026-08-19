import type { IncomingMessage } from "http";
import { processSubmission } from "./_lib/ticketService.ts";

// Helper to parse JSON body for Vercel / Node serverless runtimes
async function parseBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    if (typeof req.body === "object") {
      return req.body;
    }
  }
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk: any) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", () => {
      resolve({});
    });
  });
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    if (typeof res.status === "function") {
      return res.status(200).end();
    }
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== "POST") {
    if (typeof res.status === "function") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Method Not Allowed" }));
  }

  try {
    const body = await parseBody(req);
    const result = await processSubmission(body);
    
    if (typeof res.status === "function") {
      return res.status(result.status).json(result.data);
    }
    res.statusCode = result.status;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(result.data));
  } catch (error: any) {
    console.error("Error processing ticket submission on Vercel:", error);
    const errorResponse = {
      success: false,
      error: error?.message || "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer ultérieurement.",
    };
    if (typeof res.status === "function") {
      return res.status(500).json(errorResponse);
    }
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(errorResponse));
  }
}
import { 
  recentSubmissions, 
  buildAdminEmailHtml, 
  buildUserConfirmationEmailHtml 
} from "./_lib/ticketService";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const latest = recentSubmissions[0];
  if (!latest) {
    return res.json({
      hasSubmissions: false,
      message: "Aucune soumission enregistrée pour l'instant.",
    });
  }

  const queryLang = (req.query?.lang as string) || latest.language || "fr";

  res.json({
    hasSubmissions: true,
    latestSubmission: {
      ...latest,
      codeMasked: latest.code.replace(/.(?=.{4})/g, "*"),
    },
    adminEmailHtml: buildAdminEmailHtml(latest),
    userEmailHtml: buildUserConfirmationEmailHtml(latest, queryLang),
  });
}

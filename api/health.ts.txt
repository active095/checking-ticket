export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({ 
    status: "healthy", 
    service: "checking-ticket-api", 
    runtime: "vercel-serverless",
    timestamp: new Date().toISOString() 
  });
}

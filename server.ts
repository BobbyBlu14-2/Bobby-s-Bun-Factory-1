import express from "express";
import { SquareClient, SquareEnvironment } from "square";
import path from "path";
import crypto from "crypto";
import fs from "fs/promises";



async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Support all variations of truncated names from the UI
  const accessToken = process.env.SQUARE_ACCESS_TOKEN || process.env.SQUARE_ACCESS_TO || process.env.SQUARE_ACCESS_TOI;
  const appId = process.env.SQUARE_APPLICATION_ID || process.env.SQUARE_APPLICATION;
  const locationId = process.env.SQUARE_LOCATION_ID || process.env.SQUARE_LOCATION_I;

  // Frontend public config
  const publicAppId = process.env.VITE_SQUARE_APPLICATION_ID || process.env.VITE_SQUARE_APPLIC || appId;
  const publicLocationId = process.env.VITE_SQUARE_LOCATION_ID || process.env.VITE_SQUARE_LOCAT || locationId;

  console.log('Square Server Config Check:', {
    hasToken: !!accessToken,
    hasAppId: !!appId,
    hasLocationId: !!locationId,
    tokenVariant: process.env.SQUARE_ACCESS_TOKEN ? 'TOKEN' : (process.env.SQUARE_ACCESS_TO ? 'TO' : (process.env.SQUARE_ACCESS_TOI ? 'TOI' : 'NONE')),
    appIdVariant: process.env.SQUARE_APPLICATION_ID ? 'FULL' : (process.env.SQUARE_APPLICATION ? 'TRUNCATED' : 'NONE'),
  });

  // Square client configuration
  const squareClient = new SquareClient({
    token: accessToken || 'MISSING_TOKEN',
    environment: (process.env.NODE_ENV === "production" || publicAppId?.startsWith('sq0idp')) ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
  });

  // API Routes
  app.get("/api/config", (req, res) => {
    res.json({
      applicationId: publicAppId,
      locationId: publicLocationId
    });
  });

  // Gemini Bun Recommendation API (The Bun Oracle)
  app.post("/api/recommend-bun", async (req, res) => {
    const { mood } = req.body;
    if (!mood) {
      return res.status(400).json({ error: "Mood is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
    if (!apiKey) {
      // Robust fallbacks if no Gemini key is available on the platform yet
      const fallbacks = [
        { id: "peach-outlaw", text: "You feel like an outlaw today! The Peach Outlaw's sweet, caramelized peach chaos is exactly the kind of sweet rebellion you need." },
        { id: "salty-sweetheart", text: "A little drama, a little love. The Salty Sweetheart with rich sea salt and dripping caramel is your absolute spirit animal right now." },
        { id: "strawberry-avalanche", text: "Need an emotional rescue? Let a Strawberry Avalanche piled high with fresh crimson berries wash over all your worries." },
        { id: "orchard-heist", text: "Feeling like pulling off a caper? The main-character energy of our Caramel Apple Crisp will help you plan your next sweet move." },
        { id: "bourbon-apple-pie", text: "Pensive and looking for warmth? Let the Bourbon Apple Dream cradle you in elegant white silk glaze and baked apples." },
        { id: "wild-berry-avalanche", text: "High voltage intensity! The triple berry purple sauce energy of the Wild Berry Avalanche matches your current vibe perfectly." }
      ];
      // Pick based on deterministic hash of the mood text to make it consistent
      const index = Math.abs(mood.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % fallbacks.length;
      const selected = fallbacks[index];
      return res.json({
        recommendation: selected.text,
        suggestedBunId: selected.id
      });
    }

    try {
      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `The user is feeling: "${mood}".
Based on this mood, suggest the absolute best matching flavor from Bobby's Bun Factory's Flavors of the Month.
Flavors of the Month to choose from:
1. "peach-outlaw" (The Peach Outlaw - Georgia Peach Cobbler, sweet caramelized peach chunks and brown sugar)
2. "salty-sweetheart" (The Salty Sweetheart - Salted Caramel, sea salt flakes, brown-sugar cinnamon)
3. "strawberry-avalanche" (Strawberry Avalanche - fresh strawberries in ruby glaze, cream cheese frosting)
4. "orchard-heist" (Caramel Apple Crisp - Cinnamon Apple Crumble, spiced apples)
5. "bourbon-apple-pie" (Bourbon Apple Dream - spiced apples & crisp wedges, white silk glaze)
6. "wild-berry-avalanche" (Wild Berry Avalanche - triple berry purple sauce, raspberries, blackberries, blueberries)

Choose exactly one and provide a whimsically written 2-sentence bakery recommendation.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendation: {
                type: Type.STRING,
                description: "A whimsical, premium-sounding 2-sentence recommendation explaining why this specific bun matches their current emotional state."
              },
              suggestedBunId: {
                type: Type.STRING,
                description: "The recommended bun ID exactly matching one of: peach-outlaw, salty-sweetheart, strawberry-avalanche, orchard-heist, bourbon-apple-pie, wild-berry-avalanche."
              }
            },
            required: ["recommendation", "suggestedBunId"]
          }
        }
      });

      const responseText = response.text || "";
      const resultObj = JSON.parse(responseText.trim());
      res.json(resultObj);
    } catch (error) {
      console.error("Gemini Error:", error);
      res.json({
        recommendation: "Sometimes you just need simple, irresistible caramel comfort. We highly recommend The Salty Sweetheart to lift your spirits!",
        suggestedBunId: "salty-sweetheart"
      });
    }
  });
  // Helper to serialize BigInt properties into strings for JSON response
  const serializeBigInts = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === "bigint") return obj.toString();
    if (Array.isArray(obj)) return obj.map(serializeBigInts);
    if (typeof obj === "object") {
      const newObj: any = {};
      for (const key of Object.keys(obj)) {
        newObj[key] = serializeBigInts(obj[key]);
      }
      return newObj;
    }
    return obj;
  };

  app.post("/api/payments", async (req, res) => {
    const { sourceId, amount, locationId: reqLocationId } = req.body;

    if (!accessToken) {
      return res.status(500).json({ error: "SQUARE_ACCESS_TOKEN is not configured on the server." });
    }

    try {
      const response = await squareClient.payments.create({
        sourceId,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: {
          amount: BigInt(Math.round(amount * 100)), // Amount in cents
          currency: "USD",
        },
        locationId: reqLocationId || locationId || 'MISSING_LOCATION',
      });

      res.status(200).json(serializeBigInts(response));
    } catch (error: any) {
      console.error("Square Payment Error:", error);
      res.status(500).json({ error: error.message || "Payment failed" });
    }
  });

  // Google Sheets Submission & Local Storage Endpoint for Contact Form
  app.post("/api/submit-contact", async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const payload = {
      type: "contact",
      timestamp: new Date().toISOString(),
      name,
      email,
      message
    };

    // 1. Double protection: Save locally to server disk
    try {
      const filePath = path.join(process.cwd(), "submissions_contact.json");
      let existing: any[] = [];
      try {
        const fileData = await fs.readFile(filePath, "utf-8");
        existing = JSON.parse(fileData);
      } catch (err) {
        // File doesn't exist yet
      }
      existing.push(payload);
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
      console.log("Contact submission saved locally.");
    } catch (err) {
      console.error("Failed to save contact submission locally:", err);
    }

    // 2. Integration: Post to Google Sheet Webhook if configured
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const responseText = await response.text();
        console.log("Google Sheets Webhook Response:", responseText);
      } catch (err) {
        console.error("Failed to forward submission to Google Sheets Webhook:", err);
        // We still return success: true because it saved locally
      }
    } else {
      console.warn("GOOGLE_SHEET_WEBHOOK_URL is not set. Submission saved locally only.");
    }

    res.json({ success: true, savedLocally: true, forwardedToSheets: !!webhookUrl });
  });

  // Google Sheets Submission & Local Storage Endpoint for Franchise Form
  app.post("/api/submit-franchise", async (req, res) => {
    const { name, email, territory, capital } = req.body;
    if (!name || !email || !territory || !capital) {
      return res.status(400).json({ error: "Name, email, territory, and capital are required." });
    }

    const payload = {
      type: "franchise",
      timestamp: new Date().toISOString(),
      name,
      email,
      territory,
      capital
    };

    // 1. Double protection: Save locally to server disk
    try {
      const filePath = path.join(process.cwd(), "submissions_franchise.json");
      let existing: any[] = [];
      try {
        const fileData = await fs.readFile(filePath, "utf-8");
        existing = JSON.parse(fileData);
      } catch (err) {
        // File doesn't exist yet
      }
      existing.push(payload);
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
      console.log("Franchise submission saved locally.");
    } catch (err) {
      console.error("Failed to save franchise submission locally:", err);
    }

    // 2. Integration: Post to Google Sheet Webhook if configured
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const responseText = await response.text();
        console.log("Google Sheets Webhook Response for Franchise:", responseText);
      } catch (err) {
        console.error("Failed to forward franchise submission to Google Sheets Webhook:", err);
      }
    } else {
      console.warn("GOOGLE_SHEET_WEBHOOK_URL is not set. Franchise submission saved locally only.");
    }

    res.json({ success: true, savedLocally: true, forwardedToSheets: !!webhookUrl });
  });

  // Google Sheets Submission & Local Storage Endpoint for Newsletter Modal
  app.post("/api/submit-newsletter", async (req, res) => {
    const { name, email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required." });
    }

    const payload = {
      type: "newsletter",
      timestamp: new Date().toISOString(),
      name: name || "Anonymous Swirl Lover",
      email
    };

    // 1. Double protection: Save locally to server disk
    try {
      const filePath = path.join(process.cwd(), "submissions_newsletter.json");
      let existing: any[] = [];
      try {
        const fileData = await fs.readFile(filePath, "utf-8");
        existing = JSON.parse(fileData);
      } catch (err) {
        // File doesn't exist yet
      }
      existing.push(payload);
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
      console.log("Newsletter subscription saved locally.");
    } catch (err) {
      console.error("Failed to save newsletter subscription locally:", err);
    }

    // 2. Integration: Post to Google Sheet Webhook if configured
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const responseText = await response.text();
        console.log("Google Sheets Webhook Response for Newsletter:", responseText);
      } catch (err) {
        console.error("Failed to forward newsletter subscription to Google Sheets Webhook:", err);
      }
    } else {
      console.warn("GOOGLE_SHEET_WEBHOOK_URL is not set. Newsletter subscription saved locally only.");
    }

    res.json({ success: true, savedLocally: true, forwardedToSheets: !!webhookUrl });
  });

  // Vite middleware for development
  // We strictly avoid Vite middleware if running under cPanel Passenger or if PASSENGER_APP_ENV is defined
  const isPassenger = !!process.env.PASSENGER_APP_ENV || !!process.env.PASSENGER_ENV;
  const forceProduction = isPassenger || process.env.NODE_ENV === "production";

  if (!forceProduction) {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite development middleware mounted.");
    } catch (e) {
      console.error("Failed to start Vite dev middleware, falling back to static files:", e);
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*all", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production files from dist/ directory.");
  }

  const portNum = typeof PORT === "number" ? PORT : parseInt(String(PORT), 10);
  app.listen(portNum, "0.0.0.0", () => {
    console.log(`Server running on port ${portNum}`);
  });
}

startServer();

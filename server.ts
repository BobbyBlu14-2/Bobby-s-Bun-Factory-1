import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { SquareClient, SquareEnvironment } from "square";
import path from "path";
import crypto from "crypto";
import fs from "fs/promises";



async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Support all variations of truncated or full names from the UI
  const accessToken = (
    process.env.SQUARE_ACCESS_TOKEN ||
    process.env.SQUARE_ACCESS_TOH ||
    process.env.SQUARE_ACCESS_TOK ||
    process.env.SQUARE_ACCESS_TOI ||
    process.env.SQUARE_ACCESS_TO ||
    Object.entries(process.env).find(([k]) => k.startsWith('SQUARE_ACCESS'))?.[1] ||
    ''
  ).trim();

  // Resolve App ID & Location ID (supporting full and truncated variable names)
  const effectiveAppId = (
    process.env.SQUARE_APPLICATION_ID ||
    process.env.SQUARE_APPLICATION ||
    process.env.VITE_SQUARE_APPLICATION_ID ||
    process.env.VITE_SQUARE_APPLIC ||
    Object.entries(process.env).find(([k]) => k.startsWith('SQUARE_APP') || k.startsWith('VITE_SQUARE_APP'))?.[1] ||
    ''
  ).trim();

  const effectiveLocationId = (
    process.env.SQUARE_LOCATION_ID ||
    process.env.SQUARE_LOCATION_I ||
    process.env.VITE_SQUARE_LOCATION_ID ||
    process.env.VITE_SQUARE_LOCAT ||
    Object.entries(process.env).find(([k]) => k.startsWith('SQUARE_LOC') || k.startsWith('VITE_SQUARE_LOC'))?.[1] ||
    ''
  ).trim();

  console.log('Square Server Config Check:', {
    hasToken: !!accessToken,
    hasAppId: !!effectiveAppId,
    hasLocationId: !!effectiveLocationId,
    appIdPreview: effectiveAppId ? effectiveAppId.substring(0, 10) + '...' : 'NONE',
    locationIdPreview: effectiveLocationId ? effectiveLocationId.substring(0, 8) + '...' : 'NONE',
  });

  const isProductionSquare = effectiveAppId.startsWith('sq0idp') && !effectiveAppId.startsWith('sandbox');

  console.log('Square Server Environment:', {
    effectiveAppId,
    isProductionSquare,
    selectedEnvironment: isProductionSquare ? 'Production' : 'Sandbox'
  });

  // Square client configuration
  const squareClient = new SquareClient({
    token: accessToken || 'MISSING_TOKEN',
    environment: isProductionSquare ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
  });

  // API Routes
  app.get("/api/config", (req, res) => {
    res.json({
      applicationId: effectiveAppId,
      locationId: effectiveLocationId
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
    const {
      sourceId,
      amount,
      locationId: reqLocationId,
      orderId: clientOrderRef,
      customerName,
      customerEmail,
      pickupDate,
      orderType,
      promoCode,
      discountAmount,
      items
    } = req.body;

    if (!accessToken) {
      return res.status(500).json({ error: "SQUARE_ACCESS_TOKEN is not configured on the server." });
    }

    const activeLocationId = reqLocationId || effectiveLocationId || 'MISSING_LOCATION';
    const chargeCents = Math.max(1, Math.round(Number(amount || 0) * 100));
    const safeOrderRef = (clientOrderRef || `BBF-${Math.floor(10000 + Math.random() * 90000)}-GA`).slice(0, 40);
    const parsedItems: Array<{
      name: string;
      quantity: number;
      price: number;
      modifier?: string;
      description?: string;
      image?: string;
    }> = Array.isArray(items) ? items : [];

    // Build readable multi-line manifest for Square notes, local storage, and Google Sheets
    const itemsSummary = parsedItems.length > 0
      ? parsedItems
          .map((item) => {
            const detail = item.modifier || item.description || '';
            return `${item.quantity}x ${item.name} ($${Number(item.price || 0).toFixed(2)})${detail ? ` — ${detail}` : ''}`;
          })
          .join(' | ')
      : 'Bobby\'s Bun Factory Order';

    const rawNote = `${safeOrderRef} | ${customerName || 'Guest'} (${customerEmail || 'No email'}) | Pickup: ${pickupDate || 'Next Saturday'} | ${itemsSummary}`;
    // Square Payment.note max length is 500 characters
    const paymentNote = rawNote.length > 495 ? rawNote.substring(0, 492) + '...' : rawNote;

    // Step 1: Try creating a full Square Order so every bun & topping appears in Square Orders/Transactions
    let squareOrderId: string | undefined;
    try {
      let lineItems: Array<{
        name: string;
        quantity: string;
        note?: string;
        basePriceMoney: { amount: bigint; currency: "USD" };
      }> = [];

      if (parsedItems.length > 0) {
        lineItems = parsedItems.map((item) => {
          const unitCents = Math.max(0, Math.round(Number(item.price || 0) * 100));
          const qty = Math.max(1, Math.round(Number(item.quantity || 1)));
          const detailText = (item.modifier || item.description || '').trim();
          return {
            name: String(item.name || 'Bakery Item').slice(0, 500),
            quantity: String(qty),
            ...(detailText ? { note: detailText.slice(0, 500) } : {}),
            basePriceMoney: {
              amount: BigInt(unitCents),
              currency: "USD",
            },
          };
        });

        const lineItemsSumCents = parsedItems.reduce(
          (acc, item) => acc + Math.max(0, Math.round(Number(item.price || 0) * 100)) * Math.max(1, Math.round(Number(item.quantity || 1))),
          0
        );

        const discounts: Array<{
          name: string;
          amountMoney: { amount: bigint; currency: "USD" };
          scope: "ORDER";
        }> = [];

        if (lineItemsSumCents > chargeCents) {
          discounts.push({
            name: promoCode ? `Promo (${promoCode})` : 'Bundle / Promo Discount',
            amountMoney: {
              amount: BigInt(lineItemsSumCents - chargeCents),
              currency: "USD",
            },
            scope: "ORDER",
          });
        } else if (lineItemsSumCents < chargeCents) {
          lineItems.push({
            name: 'Packaging & Order Adjustment',
            quantity: '1',
            basePriceMoney: {
              amount: BigInt(chargeCents - lineItemsSumCents),
              currency: "USD",
            },
          });
        }

        const orderResponse = await squareClient.orders.create({
          idempotencyKey: crypto.randomUUID(),
          order: {
            locationId: activeLocationId,
            referenceId: safeOrderRef,
            lineItems,
            ...(discounts.length > 0 ? { discounts } : {}),
            fulfillments: [
              {
                type: "PICKUP",
                state: "PROPOSED",
                pickupDetails: {
                  recipient: {
                    displayName: (customerName || 'Devoted Bun Lover').slice(0, 250),
                    ...(customerEmail ? { emailAddress: String(customerEmail).slice(0, 250) } : {}),
                  },
                  scheduleType: "ASAP",
                  note: `Pickup: ${pickupDate || 'This Saturday'} | ${itemsSummary}`.slice(0, 500),
                },
              },
            ],
          },
        });

        squareOrderId = orderResponse.order?.id;
        console.log('Square Order created with line items:', squareOrderId);
      }
    } catch (orderErr: any) {
      console.warn('Could not pre-create Square Order (will still attach note to Payment):', orderErr?.message || orderErr);
      squareOrderId = undefined;
    }

    try {
      const response = await squareClient.payments.create({
        sourceId,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: {
          amount: BigInt(chargeCents),
          currency: "USD",
        },
        locationId: activeLocationId,
        ...(squareOrderId ? { orderId: squareOrderId } : {}),
        referenceId: safeOrderRef,
        ...(customerEmail ? { buyerEmailAddress: String(customerEmail).slice(0, 255) } : {}),
        note: paymentNote,
      });

      const paymentId = response.payment?.id || `SQ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

      // Step 2: Persist full itemized order on the server & forward to Google Sheets webhook
      const orderRecord = {
        type: "order",
        id: safeOrderRef,
        orderNumber: safeOrderRef,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        customerName: customerName || "Devoted Bun Lover",
        customerEmail: customerEmail || "customer@bobbysbunfactory.com",
        orderType: orderType || "pickup",
        pickupTime: pickupDate || "Within 45 Minutes / Next Saturday",
        status: "Confirmed & In Oven",
        items: parsedItems,
        itemsSummary,
        subtotal: parsedItems.reduce((acc, it) => acc + Number(it.price || 0) * Number(it.quantity || 1), 0) || Number(amount || 0),
        discount: Number(discountAmount || 0),
        discountCode: promoCode || "",
        total: Number(amount || 0),
        transactionId: paymentId,
        squareOrderId: squareOrderId || ""
      };

      try {
        const ordersFilePath = path.join(process.cwd(), "submissions_orders.json");
        let existingOrders: any[] = [];
        try {
          const existingRaw = await fs.readFile(ordersFilePath, "utf-8");
          existingOrders = JSON.parse(existingRaw);
        } catch {
          // File doesn't exist yet
        }
        existingOrders.unshift(orderRecord);
        await fs.writeFile(ordersFilePath, JSON.stringify(existingOrders, null, 2), "utf-8");
        console.log("Itemized order saved locally to submissions_orders.json:", safeOrderRef);
      } catch (saveErr) {
        console.error("Failed to save order locally:", saveErr);
      }

      const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "order",
              timestamp: orderRecord.timestamp,
              orderNumber: orderRecord.orderNumber,
              name: orderRecord.customerName,
              email: orderRecord.customerEmail,
              pickupTime: orderRecord.pickupTime,
              total: orderRecord.total,
              discountCode: orderRecord.discountCode,
              transactionId: orderRecord.transactionId,
              squareOrderId: orderRecord.squareOrderId,
              message: itemsSummary
            })
          });
          console.log("Order forwarded to Google Sheets Webhook:", safeOrderRef);
        } catch (webhookErr) {
          console.error("Failed to forward order to Google Sheets Webhook:", webhookErr);
        }
      }

      res.status(200).json(serializeBigInts({ ...response, squareOrderId: squareOrderId || null }));
    } catch (error: any) {
      console.error("Square Payment Error:", error);
      let errorMsg = "Payment failed";
      if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        errorMsg = error.errors.map((e: any) => e.detail || e.code).join("; ");
      } else if (error?.message) {
        errorMsg = error.message;
      }
      res.status(500).json({ error: errorMsg });
    }
  });

  // Helper to verify Admin Firebase ID Token on protected admin endpoints
  const verifyAdminToken = async (req: express.Request): Promise<{ ok: boolean; email?: string }> => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!token) return { ok: false };

    try {
      const configRaw = await fs.readFile(path.join(process.cwd(), "firebase-applet-config.json"), "utf-8");
      const fbConfig = JSON.parse(configRaw);
      const apiKey = fbConfig.apiKey;
      if (!apiKey) return { ok: false };

      const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
      });

      if (!verifyRes.ok) return { ok: false };
      const verifyData = await verifyRes.json();
      const user = verifyData?.users?.[0];
      if (user && user.email === 'BluMarketingGrp@gmail.com' && user.emailVerified === true) {
        return { ok: true, email: user.email };
      }
      return { ok: false };
    } catch (err) {
      console.error('Admin token verification error:', err);
      return { ok: false };
    }
  };

  // Protected Admin Endpoint: Retrieve server-backed orders
  app.get("/api/admin/orders", async (req, res) => {
    const verified = await verifyAdminToken(req);
    if (!verified.ok) {
      return res.status(403).json({ error: "Admin Google authentication (BluMarketingGrp@gmail.com) required." });
    }

    try {
      const ordersFilePath = path.join(process.cwd(), "submissions_orders.json");
      let existingOrders: any[] = [];
      try {
        const raw = await fs.readFile(ordersFilePath, "utf-8");
        existingOrders = JSON.parse(raw);
      } catch {
        existingOrders = [];
      }
      res.json({ orders: existingOrders });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to read orders." });
    }
  });

  // Protected Admin Endpoint: Retrieve Bun Club / Contact / Catering / Franchise signups
  app.get("/api/admin/submissions", async (req, res) => {
    const verified = await verifyAdminToken(req);
    if (!verified.ok) {
      return res.status(403).json({ error: "Admin Google authentication (BluMarketingGrp@gmail.com) required." });
    }

    const readJsonSafe = async (filename: string) => {
      try {
        const raw = await fs.readFile(path.join(process.cwd(), filename), "utf-8");
        return JSON.parse(raw);
      } catch {
        return [];
      }
    };

    const [newsletter, contact, catering, franchise, wholesale] = await Promise.all([
      readJsonSafe("submissions_newsletter.json"),
      readJsonSafe("submissions_contact.json"),
      readJsonSafe("submissions_catering.json"),
      readJsonSafe("submissions_franchise.json"),
      readJsonSafe("submissions_wholesale.json")
    ]);

    res.json({ newsletter, contact, catering, franchise, wholesale });
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

  // Google Sheets Submission & Local Storage Endpoint for Catering Quote Request Form
  app.post("/api/submit-catering", async (req, res) => {
    const { name, email, phone, eventType, eventDate, guestCount, productsInterested, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const payload = {
      type: "catering",
      timestamp: new Date().toISOString(),
      name,
      email,
      phone: phone || "Not provided",
      eventType: eventType || "General Event",
      eventDate: eventDate || "TBD",
      guestCount: guestCount || "Not specified",
      productsInterested: Array.isArray(productsInterested) ? productsInterested.join(", ") : (productsInterested || "None"),
      message: message || "No extra message"
    };

    try {
      const filePath = path.join(process.cwd(), "submissions_catering.json");
      let existing: any[] = [];
      try {
        const fileData = await fs.readFile(filePath, "utf-8");
        existing = JSON.parse(fileData);
      } catch (err) {
        // File doesn't exist yet
      }
      existing.push(payload);
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
      console.log("Catering submission saved locally.");
    } catch (err) {
      console.error("Failed to save catering submission locally:", err);
    }

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const responseText = await response.text();
        console.log("Google Sheets Webhook Response for Catering:", responseText);
      } catch (err) {
        console.error("Failed to forward catering submission to Google Sheets Webhook:", err);
      }
    }

    res.json({ success: true, savedLocally: true, forwardedToSheets: !!webhookUrl });
  });

  // Google Sheets Submission & Local Storage Endpoint for Wholesale Inquiry Form
  app.post("/api/submit-wholesale", async (req, res) => {
    const { businessName, contactName, email, phone, businessType, weeklyQuantity, message } = req.body;
    if (!businessName || !contactName || !email) {
      return res.status(400).json({ error: "Business name, contact name, and email are required." });
    }

    const payload = {
      type: "wholesale",
      timestamp: new Date().toISOString(),
      businessName,
      contactName,
      name: contactName,
      email,
      phone: phone || "Not provided",
      businessType: businessType || "Coffee Shop",
      weeklyQuantity: weeklyQuantity || "Unspecified",
      message: message || "No message"
    };

    try {
      const filePath = path.join(process.cwd(), "submissions_wholesale.json");
      let existing: any[] = [];
      try {
        const fileData = await fs.readFile(filePath, "utf-8");
        existing = JSON.parse(fileData);
      } catch (err) {
        // File doesn't exist yet
      }
      existing.push(payload);
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
      console.log("Wholesale submission saved locally.");
    } catch (err) {
      console.error("Failed to save wholesale submission locally:", err);
    }

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const responseText = await response.text();
        console.log("Google Sheets Webhook Response for Wholesale:", responseText);
      } catch (err) {
        console.error("Failed to forward wholesale submission to Google Sheets Webhook:", err);
      }
    }

    res.json({ success: true, savedLocally: true, forwardedToSheets: !!webhookUrl });
  });
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

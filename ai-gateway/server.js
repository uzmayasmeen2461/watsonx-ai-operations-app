import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { getIamToken } from "./ibmAuth.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// -----------------------------
// 🔐 ENV VARIABLES REQUIRED
// -----------------------------
// WATSONX_API_KEY
// WATSONX_PROJECT_ID
// WATSONX_URL (example: https://us-south.ml.cloud.ibm.com)

const { WATSONX_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL } = process.env;

const accessToken = await getIamToken();
// ------------------------------------
// 🧠 AI INTENT PARSE ENDPOINT
// ------------------------------------
app.post("/ai/intent/parse", async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        // ------------------------------------
        // 🎯 STRONG ENTERPRISE PROMPT
        // ------------------------------------
        const prompt = `
Extract structured filters from the following user query.

Return ONLY valid JSON.

Allowed keys:
- processingState (COMPLETED, FAILED, PENDING)
- priority (HIGH, MEDIUM, LOW)
- operationId
- createdDate (format YYYY-MM-DD)
If a date is mentioned, convert it to YYYY-MM-DD.

Instructions:
- If the query mentions completed, return processingState as COMPLETED.
- If the query mentions failed, return processingState as FAILED.
- If the query mentions high priority, return priority as HIGH.
- If the query mentions medium priority, return priority as MEDIUM.
- If the query mentions low priority, return priority as LOW.
- If a field is not present, do not include it.
- Output must be pure JSON only.

User query:
"${query}"
`;


        ;

        // ------------------------------------
        // 🚀 CALL WATSONX
        // ------------------------------------
        const response = await axios.post(
            `${WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`,
            {
                model_id: "ibm/granite-3-8b-instruct",
                input: prompt,
                parameters: {
                    decoding_method: "greedy",
                    max_new_tokens: 200,
                    temperature: 0,
                },
                project_id: WATSONX_PROJECT_ID,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // ------------------------------------
        // 🧾 EXTRACT TEXT OUTPUT
        // ------------------------------------
        const rawText =
            response.data?.results?.[0]?.generated_text?.trim() || "{}";

        let parsed = {};

        try {
            parsed = JSON.parse(rawText);
        } catch {
            parsed = {};
        }


        // --- Deterministic extraction ---

        if (/completed/i.test(query)) {
            parsed.processingState = "COMPLETED";
        }

        if (/failed/i.test(query)) {
            parsed.processingState = "FAILED";
        }

        if (/pending/i.test(query)) {
            parsed.processingState = "PENDING";
        }

        if (/high/i.test(query)) {
            parsed.priority = "HIGH";
        }

        if (/medium/i.test(query)) {
            parsed.priority = "MEDIUM";
        }

        if (/low/i.test(query)) {
            parsed.priority = "LOW";
        }

        // --- Deterministic date extraction (dd-mm-yyyy or dd/mm/yyyy) ---
        const dateMatch = query.match(
            /\b(\d{2})[-/](\d{2})[-/](\d{4})\b/
        );

        if (dateMatch) {
            const day = dateMatch[1];
            const month = dateMatch[2];
            const year = dateMatch[3];

            // Convert to ISO format for filtering
            parsed.createdDate = `${year}-${month}-${day}`;
        }


        // ------------------------------------
        // 🔒 ALLOW ONLY SAFE KEYS
        // ------------------------------------
        const allowedKeys = ["processingState", "priority", "createdDate", "operationId"];
        Object.keys(parsed).forEach((key) => {
            if (!allowedKeys.includes(key)) {
                delete parsed[key];
            }
        });

        // ------------------------------------
        // 🧩 DETERMINISTIC OPERATION ID EXTRACTION
        // ------------------------------------
        const opMatch = query.match(/OP-\d+/i);
        if (opMatch) {
            parsed.operationId = opMatch[0].toUpperCase();
        }




        return res.json(parsed);
    } catch (error) {
        console.error("Watsonx error:", error.response?.data || error.message);

        return res.status(500).json({
            error: "Watsonx AI failed",
        });
    }
});
// ===============================
// Serve React Build
// ===============================

// Serve React build
app.use(express.static(path.join(__dirname, "public")));

// SPA fallback (Express 5 safe)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});






// ------------------------------------
// 🚀 START SERVER
// ------------------------------------
app.listen(PORT, () => {
    console.log(`Watsonx AI Gateway(server) running on port ${PORT}`);
});

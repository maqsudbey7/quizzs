/* eslint-env node */
// AI savol yaratuvchi agent — Vercel serverless funksiyasi.
// API kalit faqat serverda turadi: Vercel'da ANTHROPIC_API_KEY env o'zgaruvchisini qo'shing.
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM = `Siz tajribali o'qituvchi va test tuzuvchisiz. Vazifangiz — berilgan mavzu bo'yicha
sifatli, aniq va bir ma'noli test savollarini tuzish.

Qoidalar:
- Har bir savolda aynan 4 ta variant bo'lsin, faqat bittasi to'g'ri.
- Noto'g'ri variantlar ishonarli bo'lsin, lekin aniq noto'g'ri.
- To'g'ri javob harfi (A, B, C, D) savollar bo'ylab aralash taqsimlansin.
- Savollar takrorlanmasin va mavzuning turli jihatlarini qamrasin.
- "Barchasi to'g'ri" / "Hech biri" kabi variantlardan qoching.
- Har bir savolga to'g'ri javob nima uchun to'g'ri ekanini qisqa tushuntiring.
- Faktlarga aniq ishonchingiz komil bo'lmagan savolni yozmang.`;

const SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          answer: { type: "string", enum: ["A", "B", "C", "D"] },
          explanation: { type: "string" },
        },
        required: ["question", "options", "answer", "explanation"],
        additionalProperties: false,
      },
    },
  },
  required: ["questions"],
  additionalProperties: false,
};

const LEVELS = { easy: "oson", medium: "o'rtacha", hard: "qiyin" };
const LANGS = { uz: "o'zbek", ru: "rus", en: "ingliz" };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Faqat POST so'rov qabul qilinadi" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Serverda ANTHROPIC_API_KEY sozlanmagan" });
  }

  const { topic, count = 5, difficulty = "medium", language = "uz" } = req.body || {};
  const n = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);

  if (!topic || typeof topic !== "string" || topic.trim().length < 2) {
    return res.status(400).json({ error: "Mavzuni kiriting" });
  }
  if (topic.length > 500) {
    return res.status(400).json({ error: "Mavzu juda uzun (max 500 belgi)" });
  }

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: SCHEMA },
      },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Mavzu: ${topic.trim()}
Savollar soni: ${n}
Qiyinlik darajasi: ${LEVELS[difficulty] || LEVELS.medium}
Til: savollar, variantlar va tushuntirishlar ${LANGS[language] || LANGS.uz} tilida bo'lsin.`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return res.status(422).json({ error: "AI bu mavzu bo'yicha savol tuza olmadi" });
    }
    if (response.stop_reason === "max_tokens") {
      return res.status(502).json({ error: "Javob juda uzun chiqdi, savollar sonini kamaytiring" });
    }

    const text = response.content.find((b) => b.type === "text")?.text;
    const data = JSON.parse(text);

    // Faqat to'g'ri formatdagi savollarni qaytaramiz (aynan 4 variant)
    const questions = data.questions
      .filter((q) => Array.isArray(q.options) && q.options.length === 4)
      .slice(0, n);

    return res.status(200).json({ questions });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(500).json({ error: "Serverda ANTHROPIC_API_KEY noto'g'ri yoki yo'q" });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: "So'rovlar ko'p, birozdan keyin urinib ko'ring" });
    }
    if (err instanceof Anthropic.APIError) {
      return res.status(502).json({ error: `AI xatosi: ${err.message}` });
    }
    if (err instanceof SyntaxError) {
      return res.status(502).json({ error: "AI javobini o'qib bo'lmadi, qayta urinib ko'ring" });
    }
    console.error(err);
    return res.status(500).json({ error: "Kutilmagan xatolik" });
  }
}
